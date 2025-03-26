# from sqlalchemy import Column, Integer, String, ForeignKey, Float
# from sqlalchemy.orm import relationship
# from database import Base

# class User(Base):
#     __tablename__ = "users"
#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True)
#     name = Column(String)
#     hashed_password = Column(String)
#     points = Column(Integer, default=0)
#     tickets = relationship("Ticket", back_populates="owner")

# class Ticket(Base):
#     __tablename__ = "tickets"
#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"))
#     store = Column(String)
#     date = Column(String)
#     location = Column(String)
#     total = Column(Float)
#     points = Column(Integer)
#     owner = relationship("User", back_populates="tickets")
#     items = relationship("TicketItem", back_populates="ticket")

# class TicketItem(Base):
#     __tablename__ = "ticket_items"
#     id = Column(Integer, primary_key=True, index=True)
#     ticket_id = Column(Integer, ForeignKey("tickets.id"))
#     name = Column(String)
#     category = Column(String)
#     price = Column(Float)
#     quantity = Column(Integer)
#     ticket = relationship("Ticket", back_populates="items")

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    points = Column(Integer, default=0)
    avatar = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    tickets = relationship("Ticket", back_populates="user")

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    store = Column(String)
    date = Column(String)
    location = Column(String)
    total = Column(Float)
    points = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="tickets")
    items = relationship("TicketItem", back_populates="ticket")

class TicketItem(Base):
    __tablename__ = "ticket_items"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"))
    name = Column(String)
    category = Column(String)
    price = Column(Float)
    quantity = Column(Integer)

    ticket = relationship("Ticket", back_populates="items")

