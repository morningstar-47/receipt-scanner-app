# app/utils/helpers.py
import os
import shutil
from fastapi import UploadFile
import re

UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def save_uploaded_file(file: UploadFile) -> str:
    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return file_location

def parse_currency(value) -> float:
    """
    Convertit une valeur contenant un montant en float.
    - Si la valeur est déjà un int ou float, la retourne.
    - Sinon, elle retire le symbole '€' et les espaces, remplace la virgule par un point, puis convertit en float.
    """
    if isinstance(value, (int, float)):
        return float(value)
    
    if not isinstance(value, str):
        raise ValueError("La valeur doit être une chaîne de caractères ou un nombre.")
    
    # Retirer le symbole '€' et les espaces
    cleaned = value.replace("€", "").strip()
    # Remplacer la virgule par un point
    cleaned = cleaned.replace(",", ".")
    
    try:
        return float(cleaned)
    except Exception as e:
        raise ValueError(f"Impossible de convertir '{value}' en nombre : {e}")
