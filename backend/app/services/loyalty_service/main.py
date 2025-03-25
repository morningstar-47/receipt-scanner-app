# services/loyalty_service/main.py
from fastapi import FastAPI

app = FastAPI()


@app.get("/loyalty/status")
def status():
    return {"message": "Loyalty Service is running"}
