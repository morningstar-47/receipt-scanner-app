from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from services import auth_service, ocr_service, receipt_service
from database.db import engine
import models


# Create the database tables
models.Base.metadata.create_all(bind=engine)


# Initialize FastAPI app
app = FastAPI(title="Fidelity App API")
load_dotenv()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_service.router)
app.include_router(ocr_service.router)
app.include_router(receipt_service.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
