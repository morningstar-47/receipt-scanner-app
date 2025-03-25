from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, Body
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Ticket, User, Product
from app.auth import get_current_user
from app.services import ocr
import json
import hashlib
import tempfile
import os
from app.database_mongo import fs
from bson import ObjectId
from typing import Dict, Any
from app.utils.helpers import parse_currency


router = APIRouter()

def compute_file_hash(file_bytes: bytes) -> str:
    """Calcule l'empreinte MD5 du contenu du fichier."""
    hash_md5 = hashlib.md5()
    hash_md5.update(file_bytes)
    return hash_md5.hexdigest()
def compute_points(ocr_result: dict, ticket_count: int) -> int:
    """
    Calcule les points à attribuer selon la stratégie :
      - 10 points de base
      - 1 point par tranche de 10€ dépensés
      - Si ticket_count >= 5, multiplicateur de 1.2
      - Bonus de 5 points par unité pour chaque produit dans une catégorie stratégique
    """
    base_points = 10
    bonus_purchase = int(float(ocr_result["totalPurchase"]) // 10)  # Assurez-vous que totalPurchase est convertible en float
    loyalty_multiplier = 1.2 if ticket_count >= 5 else 1.0
    bonus_category = 0
    strategic_categories = {"luxury", "electronics"}  # Exemple de catégories stratégiques

    for product in ocr_result["products"]:
        # Vérifier la catégorie en minuscules pour éviter les problèmes de casse
        if product["category"].lower() in strategic_categories:
            bonus_category += 5 * int(product["quantity"])
    
    total = (base_points + bonus_purchase + bonus_category) * loyalty_multiplier
    return int(total)



@router.post("/upload")
async def upload_ticket(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint pour l'upload et le traitement d'un ticket de caisse.
    Le fichier est stocké sur MongoDB via GridFS.
    Vérifie qu'un ticket identique n'a pas déjà été scanné (via MD5)
    et attribue des points selon la stratégie définie.
    """
    try:
        # Lecture complète du contenu du fichier
        file_bytes = await file.read()
        file_hash = compute_file_hash(file_bytes)
        
        # Vérifier si un ticket avec ce hash existe déjà
        existing_ticket = db.query(Ticket).filter(Ticket.file_hash == file_hash).first()
        if existing_ticket:
            raise HTTPException(status_code=400, detail="Ce ticket a déjà été scanné.")
        
        # Nettoyer le nom du fichier pour supprimer les caractères nuls
        safe_filename = file.filename.replace("\x00", "") if file.filename else "upload.tmp"
        if not safe_filename:
            safe_filename = "upload.tmp"
        
        # Stockage du fichier sur MongoDB via GridFS en utilisant le nom nettoyé
        mongo_file_id = fs.put(file_bytes, filename=safe_filename)
        
        # Déterminer le suffixe du fichier temporaire à partir du nom nettoyé
        base_name = os.path.basename(safe_filename)
        suffix = os.path.splitext(base_name)[1] if os.path.splitext(base_name)[1] else ".tmp"
        
        # Création d'un fichier temporaire pour l'OCR
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(file_bytes)
            tmp.flush()
            tmp_file_path = tmp.name
        
        # Exécution de l'OCR pour extraire les données du ticket
        ocr_result = ocr.process_ticket(tmp_file_path)
        print(json.dumps(ocr_result))
        
        # Suppression du fichier temporaire
        os.remove(tmp_file_path)

         # Conversion des montants en nombre via parse_currency
        total_purchase = parse_currency(ocr_result["totalPurchase"])
        
        # Création d'une nouvelle entrée Ticket liée à l'utilisateur dans SQLite
        ticket_entry = Ticket(
            user_id=current_user.id, 
            mongo_file_id=str(mongo_file_id),
            file_hash=file_hash,
            store=ocr_result["store"],
            date=ocr_result["date"],
            location=ocr_result["location"],
            total_purchase=total_purchase
        )
        db.add(ticket_entry)
        db.commit()
        db.refresh(ticket_entry)
        
        # Enregistrer les produits associés
        for product_data in ocr_result["products"]:
            # Convertir unitPrice avec parse_currency
            unit_price = parse_currency(product_data["unitPrice"])
            product_entry = Product(
                ticket_id=ticket_entry.id,
                name=product_data["name"],
                quantity=int(product_data["quantity"]),
                unitPrice=unit_price,
                category=product_data["category"]
            )
            db.add(product_entry)
            db.commit()
        db.commit()
        
        # Mise à jour des données OCR dans le ticket (stockées au format JSON)
        ticket_entry.donnees_extraites = json.dumps(ocr_result)
        db.commit()
        
        # Calcul du nombre de tickets déjà scannés par l'utilisateur
        ticket_count = db.query(Ticket).filter(Ticket.user_id == current_user.id).count()
        # Calcul des points selon la stratégie
        points = compute_points(ocr_result, ticket_count)
        
        # Attribution des points
        current_user.points_totaux += points
        db.commit()
        
        return {
            "ticket_id": ticket_entry.id,
            "ocr_data": ocr_result,
            "points_ajoutes": points
        }
    except HTTPException as he:
        db.rollback()
        raise he
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(status_code=500, detail=f"Erreur lors du traitement du ticket : {e}")

@router.get("/history")
async def get_ticket_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère la liste de tous les tickets scannés par l'utilisateur authentifié.
    """
    tickets = db.query(Ticket).filter(Ticket.user_id == current_user.id).all()
    # Préparer une liste de tickets sous forme de dictionnaires
    ticket_list = []
    for ticket in tickets:
        ticket_list.append({
            "ticket_id": ticket.id,
            "mongo_file_id": ticket.mongo_file_id,
            "donnees_extraites": ticket.donnees_extraites,
            "file_hash": ticket.file_hash
        })
    return {"tickets": ticket_list}

@router.get("/{ticket_id}/file")
async def get_ticket_file(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère le fichier (image ou PDF) d'un ticket scanné par l'utilisateur authentifié.
    """
    # Récupérer le ticket et vérifier qu'il appartient à l'utilisateur
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.user_id == current_user.id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket non trouvé.")
    
    try:
        # Récupérer le fichier dans GridFS
        file_data = fs.get(ObjectId(ticket.mongo_file_id))
    except Exception as e:
        raise HTTPException(status_code=404, detail="Fichier non trouvé dans GridFS.")
    
    # On peut définir le type de média (par exemple, application/pdf ou image/jpeg)
    # Récupérer le nom du fichier depuis GridFS
    filename = file_data.filename if hasattr(file_data, "filename") else ""
    media_type = "application/octet-stream"  # Valeur par défaut

    if filename.lower().endswith(".pdf"):
        media_type = "application/pdf"
    elif filename.lower().endswith((".jpg", ".jpeg")):
        media_type = "image/jpeg"
    elif filename.lower().endswith(".png"):
        media_type = "image/png"

    return StreamingResponse(file_data, media_type=media_type)

@router.get("/{ticket_id}", response_model=dict)
async def get_ticket_with_products(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retourne les détails d'un ticket scanné par l'utilisateur, incluant les produits associés.
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.user_id == current_user.id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket non trouvé.")
    
    products = db.query(Product).filter(Product.ticket_id == ticket.id).all()
    product_list = [
        {
            "id": prod.id,
            "name": prod.name,
            "quantity": prod.quantity,
            "unitPrice": prod.unitPrice,
            "category": prod.category
        }
        for prod in products
    ]
    
    return {
        "ticket_id": ticket.id,
        "store": ticket.store,
        "date": ticket.date,
        "location": ticket.location,
        "total_purchase": ticket.total_purchase,
        "donnees_extraites": ticket.donnees_extraites,
        "products": product_list
    }


@router.put("/{ticket_id}/validate")
async def validate_ticket(
    ticket_id: int,
    corrections: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Permet à l'utilisateur de corriger manuellement un ticket.
    Champs du ticket pouvant être corrigés : store, date, location, total_purchase, donnees_extraites.
    Optionnellement, correction des produits associés (liste de dicts avec 'id' et/ou nouveaux champs).
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id, Ticket.user_id == current_user.id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket non trouvé.")
    
    # Mise à jour des champs du ticket autorisés
    allowed_fields = ["store", "date", "location", "total_purchase", "donnees_extraites"]
    for field in allowed_fields:
        if field in corrections:
            setattr(ticket, field, corrections[field])
    
    # Mise à jour des produits si fournis
    if "products" in corrections and isinstance(corrections["products"], list):
        for prod_data in corrections["products"]:
            # Si un ID de produit est fourni, on met à jour l'existant
            if "id" in prod_data:
                product = db.query(Product).filter(Product.id == prod_data["id"], Product.ticket_id == ticket.id).first()
                if product:
                    for field in ["name", "quantity", "unitPrice", "category"]:
                        if field in prod_data:
                            setattr(product, field, prod_data[field])
            # Sinon, on peut envisager d'ajouter un nouveau produit (optionnel)
            else:
                new_product = Product(
                    ticket_id=ticket.id,
                    name=prod_data.get("name"),
                    quantity=prod_data.get("quantity"),
                    unitPrice=prod_data.get("unitPrice"),
                    category=prod_data.get("category")
                )
                db.add(new_product)
    
    db.commit()
    db.refresh(ticket)
    
    # Récupération de la liste des produits mis à jour
    products = db.query(Product).filter(Product.ticket_id == ticket.id).all()
    product_list = [
        {
            "id": product.id,
            "name": product.name,
            "quantity": product.quantity,
            "unitPrice": product.unitPrice,
            "category": product.category
        }
        for product in products
    ]
    
    return {
        "message": "Ticket validé et corrigé avec succès.",
        "ticket": {
            "id": ticket.id,
            "store": ticket.store,
            "date": ticket.date,
            "location": ticket.location,
            "total_purchase": ticket.total_purchase,
            "products": product_list
        }
    }