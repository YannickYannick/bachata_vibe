#!/usr/bin/env python
"""
Script pour exporter le projet complet avec le frontend buildé
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
            print(f"Erreur lors de l'exécution de: {command}")
            print(f"Erreur: {result.stderr}")
            return False
        return True
    except Exception as e:
        print(f"Exception lors de l'exécution de: {command}")
        print(f"Exception: {e}")
        return False

def main():
    print("🚀 Export du projet Bachata Site...")
    
    # 1. Build du frontend
    print("📦 Build du frontend React...")
    if not run_command("npm run build", cwd="frontend"):
        print("❌ Échec du build frontend")
        return False
    
    # 2. Copier les fichiers buildés vers le backend
    print("📁 Copie des fichiers statiques...")
    frontend_build = "frontend/build"
    backend_static = "static"
    
    if os.path.exists(backend_static):
        shutil.rmtree(backend_static)
    
    if os.path.exists(frontend_build):
        shutil.copytree(frontend_build, backend_static)
        print(f"✅ Fichiers copiés de {frontend_build} vers {backend_static}")
    else:
        print(f"❌ Dossier {frontend_build} non trouvé")
        return False
    
    # 3. Créer un fichier requirements.txt
    print("📋 Génération du requirements.txt...")
    if not run_command("pip freeze > requirements.txt"):
        print("❌ Échec de la génération du requirements.txt")
        return False
    
    # 4. Créer un script de démarrage
    print("🔧 Création du script de démarrage...")
    startup_script = """#!/bin/bash
# Script de démarrage pour le projet Bachata Site

echo "🚀 Démarrage du serveur Django..."

# Vérifier si le virtual environment existe
if [ ! -d "venv" ]; then
    echo "📦 Création du virtual environment..."
    python -m venv venv
fi

# Activer le virtual environment
echo "🔧 Activation du virtual environment..."
source venv/bin/activate

# Installer les dépendances
echo "📥 Installation des dépendances..."
pip install -r requirements.txt

# Appliquer les migrations
echo "🗄️ Application des migrations..."
python manage.py migrate --settings=bachata_site.settings_production

# Collecter les fichiers statiques
echo "📁 Collecte des fichiers statiques..."
python manage.py collectstatic --noinput --settings=bachata_site.settings_production

# Démarrer le serveur
echo "🌐 Démarrage du serveur..."
python manage.py runserver --settings=bachata_site.settings_production
"""
    
    with open("start_server.sh", "w") as f:
        f.write(startup_script)
    
    # Rendre le script exécutable
    os.chmod("start_server.sh", 0o755)
    
    print("✅ Export terminé avec succès!")
    print("\n📋 Pour démarrer le projet:")
    print("   ./start_server.sh")
    print("\n📋 Ou manuellement:")
    print("   python manage.py runserver --settings=bachata_site.settings_production")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
