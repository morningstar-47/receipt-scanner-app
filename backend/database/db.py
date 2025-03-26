# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# import os

# # URL de connexion à la base de données
# DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fidelity_app.db")

# # Créer le moteur SQLAlchemy
# engine = create_engine(
#     DATABASE_URL, connect_args={"check_same_thread": False}
# )

# # Créer une session locale
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # Créer une classe de base pour les modèles
# Base = declarative_base()



from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL" ,"sqlite:///./database/fidelity_app.db" ) # Remplacez par votre URL de base de données

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
