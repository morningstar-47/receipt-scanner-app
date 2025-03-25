from sqlalchemy import Column, Float, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    points_totaux = Column(Integer, default=0)
    date_inscription = Column(DateTime, default=datetime.utcnow)

    tickets = relationship("Ticket", back_populates="user")

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    #file_path = Column(String, nullable=False)
    mongo_file_id = Column(String, nullable=False)  # ID du fichier dans MongoDB (GridFS)
    donnees_extraites = Column(Text, nullable=True)  # JSON sous forme de texte
    date_scan = Column(DateTime, default=datetime.utcnow)
    file_hash = Column(String, unique=True, nullable=False)  # Empreinte du fichier

    # Colonnes supplémentaires
    store = Column(String, nullable=False)
    date = Column(String, nullable=False)
    location = Column(String, nullable=True)
    total_purchase = Column(Float, nullable=False)

    # Relation avec les produits
    products = relationship("Product", back_populates="ticket")

    user = relationship("User", back_populates="tickets")
    

# Optionnel : Modèle pour les produits / achats
class Purchase(Base):
    __tablename__ = "purchases"
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"))
    brand_id = Column(Integer, ForeignKey("brands.id"))
    nom_produit = Column(String)
    quantite = Column(Integer)
    prix = Column(Integer)
    # D'autres champs selon le besoin

class Brand(Base):
    __tablename__ = "brands"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String, unique=True)
    email = Column(String, unique=True)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"))
    name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    unitPrice = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    
    # Relation inverse pour lier les produits au ticket
    ticket = relationship("Ticket", back_populates="products")