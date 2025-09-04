#!/usr/bin/env python
"""
Script de déploiement spécifique pour Harmada
"""
import os
import shutil
import subprocess
import sys

def run_command(command, cwd=None):
    """Exécute une commande et retourne le résultat"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"❌ Erreur: {command}")
            print(f"   {result.stderr}")
            return False
        print(f"✅ Succès: {command}")
        return True
    except Exception as e:
        print(f"❌ Exception: {command}")
        print(f"   {e}")
        return False

def main():
    print("🚀 Déploiement pour Harmada...")
    
    # 1. Build du frontend
    print("\n📦 Build du frontend...")
    if not run_command("npm run build", cwd="frontend"):
        return False
    
    # 2. Copier les fichiers statiques
    print("\n📁 Copie des fichiers statiques...")
    if os.path.exists("static"):
        shutil.rmtree("static")
    shutil.copytree("frontend/build", "static")
    
    # 3. Créer le dossier staticfiles
    print("\n🗂️ Préparation des fichiers statiques...")
    if not run_command("python manage.py collectstatic --noinput --settings=bachata_site.settings_production"):
        return False
    
    # 4. Appliquer les migrations
    print("\n🗄️ Application des migrations...")
    if not run_command("python manage.py migrate --settings=bachata_site.settings_production"):
        return False
    
    # 5. Créer un superutilisateur si nécessaire
    print("\n👤 Vérification du superutilisateur...")
    if not run_command("python manage.py shell -c \"from django.contrib.auth import get_user_model; User = get_user_model(); print('Superuser exists:', User.objects.filter(is_superuser=True).exists())\" --settings=bachata_site.settings_production"):
        print("⚠️ Impossible de vérifier le superutilisateur")
    
    # 6. Créer un fichier de configuration Harmada
    print("\n⚙️ Création de la configuration Harmada...")
    harmada_config = """# Configuration Harmada
# Variables d'environnement pour Harmada

# Base de données (à configurer dans le panel Harmada)
DB_NAME=bachata_site
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432

# Django
SECRET_KEY=your_secret_key_here
DEBUG=False

# Redis (si disponible)
REDIS_URL=redis://localhost:6379/0
"""
    
    with open(".env", "w") as f:
        f.write(harmada_config)
    
    print("\n✅ Déploiement terminé!")
    print("\n📋 Étapes suivantes sur Harmada:")
    print("1. Uploadez tous les fichiers vers votre compte Harmada")
    print("2. Configurez les variables d'environnement dans le panel Harmada")
    print("3. Vérifiez que passenger_wsgi.py est dans le dossier racine")
    print("4. Vérifiez que .htaccess est présent")
    print("5. Testez votre site!")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
