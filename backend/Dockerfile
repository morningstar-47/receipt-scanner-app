FROM python:3.9

WORKDIR /app

# Installer Tesseract OCR
RUN apt-get update && apt-get install -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copier les fichiers de dépendances
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 8000

# Variables d'environnement
ENV PYTHONUNBUFFERED=1

# Commande de démarrage
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

