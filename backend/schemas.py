# from pydantic import BaseModel, EmailStr
# from typing import List, Optional
# from datetime import datetime

# # Schémas pour les utilisateurs
# class UserBase(BaseModel):
#     email: EmailStr
#     name: str

# class UserCreate(UserBase):
#     password: str

# class User(UserBase):
#     id: int
#     points: int
#     avatar: Optional[str] = None
#     created_at: datetime

#     class Config:
#         from_attributes = True  # Remplace orm_mode=True

# # Schémas pour l'authentification
# class Token(BaseModel):
#     access_token: str
#     token_type: str
#     user: User

# class TokenData(BaseModel):
#     email: Optional[str] = None

# # Schémas pour les articles de ticket
# class TicketItemBase(BaseModel):
#     name: str
#     category: str
#     price: float
#     quantity: int

# class TicketItemCreate(TicketItemBase):
#     pass

# class TicketItem(TicketItemBase):
#     id: int
#     ticket_id: int

#     class Config:
#         from_attributes = True  # Remplace orm_mode=True

# # Schémas pour les tickets
# class TicketBase(BaseModel):
#     store: str
#     date: str
#     location: str
#     total: float
#     points: int

# class TicketCreate(TicketBase):
#     items: List[TicketItemCreate]

# class Ticket(TicketBase):
#     id: int
#     user_id: int
#     created_at: datetime
#     items: List[TicketItem]

#     class Config:
#         from_attributes = True  # Remplace orm_mode=True

# # Schéma pour les données OCR
# class TicketData(TicketBase):
#     items: List[TicketItemBase]


# # from pydantic import BaseModel
# # from typing import List, Optional

# # class UserBase(BaseModel):
# #     email: str
# #     name: str

# # class UserCreate(UserBase):
# #     password: str

# # class User(UserBase):
# #     id: int
# #     points: int

# #     class Config:
# #         orm_mode = True

# # class Token(BaseModel):
# #     access_token: str
# #     token_type: str
# #     user: User

# # class TokenData(BaseModel):
# #     email: Optional[str] = None

# # class TicketItemBase(BaseModel):
# #     name: str
# #     category: str
# #     price: float
# #     quantity: int

# # class TicketItemCreate(TicketItemBase):
# #     pass

# # class TicketItem(TicketItemBase):
# #     id: int
# #     ticket_id: int

# #     class Config:
# #         orm_mode = True

# # class TicketBase(BaseModel):
# #     store: str
# #     date: str
# #     location: str
# #     total: float
# #     points: int

# # class TicketCreate(TicketBase):
# #     items: List[TicketItemCreate]

# # class Ticket(TicketBase):
# #     id: int
# #     user_id: int
# #     items: List[TicketItem]

# #     class Config:
# #         orm_mode = True

# # class TicketData(BaseModel):
# #     store: str
# #     date: str
# #     location: str
# #     total: float
# #     points: int
# #     items: List[TicketItem]


from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Schémas pour les utilisateurs
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    points: int
    avatar: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True  # Remplace orm_mode=True

# Schémas pour l'authentification
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    email: Optional[str] = None

# Schémas pour les articles de ticket
class TicketItemBase(BaseModel):
    name: str
    category: str
    price: float
    quantity: int

class TicketItemCreate(TicketItemBase):
    pass

class TicketItem(TicketItemBase):
    id: int
    ticket_id: int

    class Config:
        from_attributes = True  # Remplace orm_mode=True

# Schémas pour les tickets
class TicketBase(BaseModel):
    store: str
    date: str
    location: str
    total: float
    points: int

class TicketCreate(TicketBase):
    items: List[TicketItemCreate]

class Ticket(TicketBase):
    id: int
    user_id: int
    created_at: datetime
    items: List[TicketItem]

    class Config:
        from_attributes = True  # Remplace orm_mode=True

# Schéma pour les données OCR
class TicketData(TicketBase):
    items: List[TicketItemBase]

