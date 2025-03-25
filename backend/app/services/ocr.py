import os
import json
import base64
from pathlib import Path
from mistralai import Mistral, DocumentURLChunk, ImageURLChunk, TextChunk

# Initialisation du client Mistral avec la clé API (à configurer via une variable d'environnement ou directement)
api_key = os.getenv("MISTRAL_API_KEY", "oue93klhrJfR41W4vHGCtMP7g2v3WYQj")  # Remplacer "API_KEY" par votre clé API ou configurer la variable d'environnement
client = Mistral(api_key=api_key)

def process_ticket(file_path: str) -> dict:
    """
    Traite un ticket de caisse en appliquant l'OCR via Mistral.
    
    Selon le type de fichier (PDF ou image), la fonction :
      - Télécharge et traite un PDF en appelant l'OCR pour documents.
      - Traite une image en encodant le fichier en base64, exécutant l'OCR puis
        en convertissant le résultat en données structurées via un appel au modèle Pixtral.
    
    Args:
        file_path (str): Chemin vers le fichier à traiter (PDF ou image).
    
    Returns:
        dict: Résultat OCR structuré sous forme de dictionnaire.
    
    Raises:
        ValueError: Si le fichier n'existe pas ou si son extension n'est pas supportée.
    """
    path = Path(file_path)
    if not path.is_file():
        raise ValueError(f"Fichier non trouvé : {file_path}")

    ext = path.suffix.lower()

    if ext == ".pdf":
        # Traitement d'un fichier PDF
        uploaded_file = client.files.upload(
            file={
                "file_name": path.stem,
                "content": path.read_bytes(),
            },
            purpose="ocr",
        )
        signed_url = client.files.get_signed_url(file_id=uploaded_file.id, expiry=1)

        # Exécution de l'OCR pour le PDF (inclus l'extraction des images intégrées)
        pdf_response = client.ocr.process(
            document=DocumentURLChunk(document_url=signed_url.url),
            model="mistral-ocr-latest",
            include_image_base64=True
        )
        result = json.loads(pdf_response.model_dump_json())
        return result

    elif ext in [".jpg", ".jpeg", ".png"]:
        # Traitement d'un fichier image
        encoded = base64.b64encode(path.read_bytes()).decode()
        # Détermination du type MIME à partir de l'extension (ici, par défaut "jpeg" pour jpg/jpeg)
        mime_type = "jpeg" if ext in [".jpg", ".jpeg"] else "png"
        base64_data_url = f"data:image/{mime_type};base64,{encoded}"

        # Exécution de l'OCR sur l'image
        image_response = client.ocr.process(
            document=ImageURLChunk(image_url=base64_data_url),
            model="mistral-ocr-latest"
        )

        # Extraction du markdown obtenu via OCR
        image_ocr_markdown = image_response.pages[0].markdown

        # Appel du modèle Pixtral pour obtenir un résultat structuré en JSON
        chat_response = client.chat.complete(
            model="pixtral-12b-latest",
            messages=[
                {
                    "role": "user",
                    "content": [
                        ImageURLChunk(image_url=base64_data_url),
                        TextChunk(
                            text=(
                                f"This is image's OCR in markdown:\n\n{image_ocr_markdown}\n.\n"
                                "Convert this into a sensible structured json response. "
                                "The output should be strictly be json with no extra commentary"
                                "the output should contain the name of store(string) key as store, the date of purchase of the ticket(date) key as date, location(string for value  choose the city where the store is located) key as location, total purchase price(float) key as totalPurchase and also the names of the products, their quantity, unit price(float)  and category(type string and in french) of product key as products."
                                "be lucid in your reasoning"
                            )
                        ),
                    ],
                }
            ],
            response_format={"type": "json_object"},
            temperature=0,
        )

        result = json.loads(chat_response.choices[0].message.content)
        return result

    else:
        raise ValueError(f"Format de fichier non supporté : {ext}")

# Exemple d'utilisation (à décommenter pour tester en local)
# if __name__ == "__main__":
#     file_to_process = "receipt.png"  # ou "mistral7b.pdf"
#     ocr_result = process_ticket(file_to_process)
#     print(json.dumps(ocr_result, indent=4))
