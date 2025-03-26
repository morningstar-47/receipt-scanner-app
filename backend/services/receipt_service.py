from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database.db as database
from services import auth_service

router = APIRouter()

@router.post("/tickets", response_model=schemas.Ticket)
async def save_ticket(
    ticket_data: schemas.TicketCreate,
    current_user: models.User = Depends(auth_service.get_current_user),
    db: Session = Depends(database.get_db)
):
    db_ticket = models.Ticket(
        user_id=current_user.id,
        store=ticket_data.store,
        date=ticket_data.date,
        location=ticket_data.location,
        total=ticket_data.total,
        points=ticket_data.points
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)

    for item in ticket_data.items:
        db_item = models.TicketItem(
            ticket_id=db_ticket.id,
            name=item.name,
            category=item.category,
            price=item.price,
            quantity=item.quantity
        )
        db.add(db_item)

    current_user.points = current_user.points + ticket_data.points
    db.commit()

    return db_ticket

@router.get("/tickets", response_model=List[schemas.Ticket])
async def get_user_tickets(
    current_user: models.User = Depends(auth_service.get_current_user),
    db: Session = Depends(database.get_db)
):
    tickets = db.query(models.Ticket).filter(models.Ticket.user_id == current_user.id).all()
    return tickets
