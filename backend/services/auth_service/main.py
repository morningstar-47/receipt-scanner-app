# services/auth_service/main.py
from fastapi import FastAPI

app = FastAPI()


@app.get("/auth/status")
def status():
    return {"message": "Auth Service is running"}
