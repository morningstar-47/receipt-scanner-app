# services/ocr_service/main.py
from fastapi import FastAPI

app = FastAPI()


@app.get("/ocr/status")
def status():
    return {"message": "OCR Service is running"}
