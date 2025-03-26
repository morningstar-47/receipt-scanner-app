from fastapi import APIRouter, Depends, HTTPException, Body
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import base64
import io
import json
import re
from PIL import Image
import models, schemas, database.db as database
from services import auth_service
from mistralai import Mistral
import os
from dotenv import load_dotenv

router = APIRouter()
load_dotenv()

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    raise ValueError("MISTRAL_API_KEY is not set in the environment variables.")
mistral_client = Mistral(api_key=MISTRAL_API_KEY)

def process_receipt_with_mistral(image_data):
    try:
        image = Image.open(io.BytesIO(image_data))
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        prompt = """
        Analyse cette image de ticket de caisse et extrait les informations suivantes au format JSON:
        1. Le nom du magasin
        2. La date du ticket
        3. Le lieu (ville ou adresse)
        4. Le montant total
        5. La liste des articles avec pour chacun:
           - Le nom de l'article
           - La catégorie (si possible)
           - Le prix unitaire
           - La quantité

        Réponds uniquement avec un objet JSON valide sans autre texte.
        Format attendu:
        {
          "store": "Nom du magasin",
          "date": "JJ/MM/AAAA",
          "location": "Ville ou adresse",
          "total": 00.00,
          "items": [
            {
              "name": "Nom de l'article",
              "category": "Catégorie",
              "price": 00.00,
              "quantity": 1
            }
          ]
        }
        """

        messages = [
            {"role": "system", "content": "You are an OCR system capable of extracting text from images."},
            {"role": "user", "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": f"data:image/jpeg;base64,{img_str}"}
            ]}
        ]

        response = mistral_client.chat.complete(
            model="pixtral-12b-latest",
            messages=messages,
            temperature=0.2,
            max_tokens=4000
        )

        result_text = response.choices[0].message.content if response and response.choices and response.choices[0].message else ""
        json_match = re.search(pattern=r'```json\s*(.*?)\s*```', string=result_text, flags=re.DOTALL)
        if json_match:
            result_text = json_match.group(1)
        else:
            json_match = re.search(r'({.*})', result_text, re.DOTALL)
            if json_match:
                result_text = json_match.group(1)

        result = json.loads(result_text)
        result["points"] = int(result.get("total", 0))

        defaults = {
            "store": "Magasin inconnu",
            "date": datetime.now().strftime("%d/%m/%Y"),
            "location": "Localisation inconnue",
            "total": 0.0,
            "items": []
        }
        result = {**defaults, **result}

        for item in result["items"]:
            item_defaults = {
                "name": "Article inconnu",
                "category": "Divers",
                "price": 0.0,
                "quantity": 1
            }
            item.update({k: v for k, v in item_defaults.items() if k not in item})

        return result

    except Exception as e:
        print(f"Erreur lors du traitement de l'image avec MistralAI: {str(e)}")
        return {
            "store": "Erreur de traitement",
            "date": datetime.now().strftime("%d/%m/%Y"),
            "location": "Localisation inconnue",
            "total": 0.0,
            "points": 0,
            "items": []
        }

@router.post("/ocr/process", response_model=schemas.TicketData)
async def process_receipt(
    image: str = Body(..., embed=True),
    current_user: models.User = Depends(auth_service.get_current_user),
    db: Session = Depends(database.get_db)
):
    try:
        image_data = base64.b64decode(image.split(',')[1] if ',' in image else image)
        ticket_data = process_receipt_with_mistral(image_data)
        return ticket_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
