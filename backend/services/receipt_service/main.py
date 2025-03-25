# services/receipt_service/main.py
from fastapi import FastAPI

app = FastAPI()


@app.get("/receipts/status")
def status():
    return {"message": "Receipt Service is running"}
