#!/usr/bin/env python3
"""
Script de déploiement pour BachataSite
Automatise le processus de build et déploiement
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def run_command(command, cwd=None, check=True):
    """Exécute une commande shell"""
    print(f"🔄 Exécution: {command}")
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=cwd,
            check=check,
            capture_output=True,
            text=True
        )
        if result.stdout:
            print(result.stdout)
        return result
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur lors de l'exécution de: {command}")
        print(f"Sortie d'erreur: {e.stderr}")
        if check:
            sys.exit(1)
        return e

def check_requirements():
    """Vérifie que tous les prérequis sont installés"""
    print("🔍 Vérification des prérequis...")
    
    # Vérifier Python
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
        print("❌ Python 3.8+ requis")
        sys.exit(1)
    print(f"✅ Python {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    # Vérifier Node.js
    try:
        node_result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        print(f"✅ Node.js {node_result.stdout.strip()}")
    except FileNotFoundError:
        print("❌ Node.js non trouvé")
        sys.exit(1)
    
    # Vérifier npm
    try:
        npm_result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        print(f"✅ npm {npm_result.stdout.strip()}")
    except FileNotFoundError:
        print("❌ npm non trouvé")
        sys.exit(1)

def setup_backend():
    """Configure le backend Django"""
    print("\n🐍 Configuration du backend Django...")
    
    # Créer l'environnement virtuel s'il n'existe pas
    if not os.path.exists('venv'):
        print("📦 Création de l'environnement virtuel...")
        run_command('python -m venv venv')
    
    # Activer l'environnement virtuel
    if os.name == 'nt':  # Windows
        activate_script = 'venv\\Scripts\\activate'
    else:  # Unix/Linux/Mac
        activate_script = 'source venv/bin/activate'
    
    # Installer les dépendances
    print("📦 Installation des dépendances Python...")
    run_command(f'{activate_script} && pip install -r requirements.txt')
    
    # Vérifier si .env existe
    if not os.path.exists('.env'):
        print("⚠️  Fichier .env non trouvé. Création d'un exemple...")
        if os.path.exists('.env.example'):
            shutil.copy('.env.example', '.env')
            print("📝 Veuillez configurer le fichier .env avec vos paramètres")
        else:
            print("❌ Fichier .env.example non trouvé")
    
    # Migrations
    print("🗄️  Exécution des migrations...")
    run_command(f'{activate_script} && python manage.py makemigrations')
    run_command(f'{activate_script} && python manage.py migrate')
    
    # Collecter les fichiers statiques
    print("📁 Collecte des fichiers statiques...")
    run_command(f'{activate_script} && python manage.py collectstatic --noinput')

def setup_frontend():
    """Configure le frontend React"""
    print("\n⚛️  Configuration du frontend React...")
    
    # Aller dans le dossier frontend
    frontend_dir = Path('frontend')
    if not frontend_dir.exists():
        print("❌ Dossier frontend non trouvé")
        return
    
    # Installer les dépendances
    print("📦 Installation des dépendances Node.js...")
    run_command('npm install', cwd=frontend_dir)
    
    # Build de production
    print("🏗️  Build de production...")
    run_command('npm run build', cwd=frontend_dir)

def create_superuser():
    """Crée un superutilisateur Django"""
    print("\n👤 Création d'un superutilisateur...")
    
    if os.name == 'nt':  # Windows
        activate_script = 'venv\\Scripts\\activate'
    else:  # Unix/Linux/Mac
        activate_script = 'source venv/bin/activate'
    
    try:
        run_command(f'{activate_script} && python manage.py createsuperuser', check=False)
        print("✅ Superutilisateur créé ou déjà existant")
    except Exception as e:
        print(f"⚠️  Erreur lors de la création du superutilisateur: {e}")

def run_tests():
    """Exécute les tests"""
    print("\n🧪 Exécution des tests...")
    
    if os.name == 'nt':  # Windows
        activate_script = 'venv\\Scripts\\activate'
    else:  # Unix/Linux/Mac
        activate_script = 'source venv/bin/activate'
    
    # Tests backend
    print("🐍 Tests Django...")
    run_command(f'{activate_script} && python manage.py test', check=False)
    
    # Tests frontend
    print("⚛️  Tests React...")
    frontend_dir = Path('frontend')
    if frontend_dir.exists():
        run_command('npm test -- --watchAll=false', cwd=frontend_dir, check=False)

def start_development_server():
    """Démarre le serveur de développement"""
    print("\n🚀 Démarrage du serveur de développement...")
    
    if os.name == 'nt':  # Windows
        activate_script = 'venv\\Scripts\\activate'
    else:  # Unix/Linux/Mac
        activate_script = 'source venv/bin/activate'
    
    print("🌐 Serveur Django démarré sur http://localhost:8000")
    print("⚛️  Frontend React disponible sur http://localhost:3000")
    print("🔐 Interface d'administration: http://localhost:8000/admin")
    print("\n📱 Appuyez sur Ctrl+C pour arrêter le serveur")
    
    try:
        run_command(f'{activate_script} && python manage.py runserver')
    except KeyboardInterrupt:
        print("\n👋 Arrêt du serveur")

def main():
    """Fonction principale"""
    print("🎯 Script de déploiement BachataSite")
    print("=" * 50)
    
    # Vérifier les prérequis
    check_requirements()
    
    # Configuration du backend
    setup_backend()
    
    # Configuration du frontend
    setup_frontend()
    
    # Créer un superutilisateur
    create_superuser()
    
    # Exécuter les tests
    run_tests()
    
    print("\n✅ Configuration terminée avec succès!")
    print("\n🎉 Votre site de bachata est prêt!")
    
    # Demander si l'utilisateur veut démarrer le serveur
    response = input("\n🚀 Voulez-vous démarrer le serveur de développement? (y/n): ")
    if response.lower() in ['y', 'yes', 'o', 'oui']:
        start_development_server()

if __name__ == '__main__':
    main()









