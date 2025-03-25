# services/notification_service/main.py
from fastapi import FastAPI

app = FastAPI()


@app.get("/notifications/status")
def status():
    return {"message": "Notification Service is running"}
