from pymongo import MongoClient
import gridfs
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = MongoClient(MONGO_URL)
mongo_db = client["ticket_db"]

# Utilisation de GridFS pour le stockage des fichiers
fs = gridfs.GridFS(mongo_db)


if __name__ == "__main__":
    print("🚀 Connexion réussie à la base de données MongoDB !")
    # Ajouter un fichier test
    with open("test_file.txt", "w") as f:
        f.write("Ceci est un test GridFS.")

    with open("test_file.txt", "rb") as f:
        file_id = fs.put(f, filename="test_file.txt")

    print(f"✅ Fichier ajouté avec succès ! ID : {file_id}")