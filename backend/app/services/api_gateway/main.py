# services/api_gateway/main.py
from fastapi import FastAPI
import requests

app = FastAPI()

AUTH_SERVICE_URL = "http://auth_service:8001"
RECEIPT_SERVICE_URL = "http://receipt_service:8002"


@app.get("/status")
def status():
    return {"message": "API Gateway is running"}
