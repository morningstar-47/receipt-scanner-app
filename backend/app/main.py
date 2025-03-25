from fastapi import FastAPI
from app.services.user_service import main as user
from app.services.receipt_service import main as ticket
from app.services.brand_service import main as brand
# from app.services.api_gateway import main as getway
from app.services.brand_service import main as brand

from app.database import engine, Base

# Création des tables si nécessaire
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ticket Scan App")

# Inclusion des routers
app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(ticket.router, prefix="/tickets", tags=["tickets"])
app.include_router(brand.router, prefix="/brands", tags=["brands"])

@app.get("/")
def root(): 
    return {"message": "API de gestion des tickets et des utilisateurs"}
