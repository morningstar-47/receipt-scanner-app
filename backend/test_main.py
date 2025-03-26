from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
import base64
import io
import json
import re
from PIL import Image
import models
import schemas
from database import SessionLocal, engine
from mistralai import Mistral

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

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-development")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

# MistralAI Configuration
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    raise ValueError("MISTRAL_API_KEY is not set in the environment variables.")
mistral_client = Mistral(api_key=MISTRAL_API_KEY)

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# Dépendance pour obtenir la session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Fonctions d'authentification
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

# Routes d'authentification
@app.post("/auth/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = get_user(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password,
        points=0
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@app.get("/auth/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# OCR Function with MistralAI
def process_receipt_with_mistral(image_data):
    try:
        # Convert image to base64
        image = Image.open(io.BytesIO(image_data))
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        # Define the prompt for the AI model
        prompt = """
        Analyse cette image de ticket de caisse et extrait les informations suivantes au format JSON:
        1. Le nom du magasin
        2. La date du ticket
        3. Le lieu (ville ou adresse)
        4. Le montant total
        5. La liste des articles avec pour chacun:
           - Le nom de l'article
           - La catégorie (si possible)
           - Le prix unitaire
           - La quantité

        Réponds uniquement avec un objet JSON valide sans autre texte.
        Format attendu:
        {
          "store": "Nom du magasin",
          "date": "JJ/MM/AAAA",
          "location": "Ville ou adresse",
          "total": 00.00,
          "items": [
            {
              "name": "Nom de l'article",
              "category": "Catégorie",
              "price": 00.00,
              "quantity": 1
            }
          ]
        }
        """

        # Prepare the messages for the MistralAI API, including a system message for OCR
        messages = [
            {
                "role": "system",
                "content": "You are an OCR system capable of extracting text from images."
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": f"data:image/jpeg;base64,{img_str}"}
                ]
            }
        ]

        # Call the MistralAI API with the correct model
        response = mistral_client.chat.complete(
            model="pixtral-12b-latest",  # Ensure this model supports image processing
            messages=messages,
            temperature=0.2,
            max_tokens=4000
        )

        # Extract and parse the JSON response
        result_text = response.choices[0].message.content
        json_match = re.search(r'```json\s*(.*?)\s*```', result_text, re.DOTALL)
        if json_match:
            result_text = json_match.group(1)
        else:
            json_match = re.search(r'({.*})', result_text, re.DOTALL)
            if json_match:
                result_text = json_match.group(1)

        result = json.loads(result_text)
        result["points"] = int(result.get("total", 0))

        # Set default values for missing data
        defaults = {
            "store": "Magasin inconnu",
            "date": datetime.now().strftime("%d/%m/%Y"),
            "location": "Localisation inconnue",
            "total": 0.0,
            "items": []
        }
        result = {**defaults, **result}

        # Ensure each item has default values
        for item in result["items"]:
            item_defaults = {
                "name": "Article inconnu",
                "category": "Divers",
                "price": 0.0,
                "quantity": 1
            }
            item.update({k: v for k, v in item_defaults.items() if k not in item})

        return result

    except Exception as e:
        print(f"Erreur lors du traitement de l'image avec MistralAI: {str(e)}")
        return {
            "store": "Erreur de traitement",
            "date": datetime.now().strftime("%d/%m/%Y"),
            "location": "Localisation inconnue",
            "total": 0.0,
            "points": 0,
            "items": []
        }


# OCR Routes
@app.post("/ocr/process", response_model=schemas.TicketData)
async def process_receipt(
    image: str = Body(..., embed=True),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        image_data = base64.b64decode(image.split(',')[1] if ',' in image else image)
        ticket_data = process_receipt_with_mistral(image_data)
        return ticket_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/tickets", response_model=schemas.Ticket)
async def save_ticket(
    ticket_data: schemas.TicketCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
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

    current_user.points += ticket_data.points
    db.commit()

    return db_ticket

@app.get("/tickets", response_model=List[schemas.Ticket])
async def get_user_tickets(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tickets = db.query(models.Ticket).filter(models.Ticket.user_id == current_user.id).all()
    return tickets

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
