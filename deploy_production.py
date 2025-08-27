#!/usr/bin/env python
"""
Script de déploiement sécurisé pour la production
Gère les migrations et la sauvegarde automatique
"""

import os
import sys
import subprocess
import datetime
from pathlib import Path

# Configuration
PROJECT_ROOT = Path(__file__).parent
BACKUP_DIR = PROJECT_ROOT / "backups"
DJANGO_SETTINGS = "bachata_site.settings_test"  # Utilise SQLite pour les tests

def run_command(command, check=True):
    """Exécute une commande et gère les erreurs"""
    print(f"🔄 Exécution: {command}")
    try:
        result = subprocess.run(command, shell=True, check=check, capture_output=True, text=True)
        if result.stdout:
            print(f"✅ Succès: {result.stdout}")
        return result
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur: {e.stderr}")
        if check:
            sys.exit(1)
        return e

def create_backup():
    """Crée une sauvegarde de la base de données"""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = BACKUP_DIR / f"backup_{timestamp}.sql"
    
    print(f"💾 Création de sauvegarde: {backup_file}")
    
    # Créer le dossier de backup s'il n'existe pas
    BACKUP_DIR.mkdir(exist_ok=True)
    
    # Sauvegarde PostgreSQL (si utilisé en production)
    if os.getenv('DATABASE_URL', '').startswith('postgres'):
        run_command(f"pg_dump $DATABASE_URL > {backup_file}")
    else:
        print("⚠️  Sauvegarde SQLite - copie du fichier")
        db_file = PROJECT_ROOT / "db.sqlite3"
        if db_file.exists():
            import shutil
            shutil.copy2(db_file, backup_file)
    
    print(f"✅ Sauvegarde créée: {backup_file}")

def check_migrations():
    """Vérifie l'état des migrations"""
    print("🔍 Vérification des migrations...")
    
    # Vérifier s'il y a des migrations non appliquées
    result = run_command(f"python manage.py showmigrations --list", check=False)
    
    if "unapplied migrations" in result.stdout or "[ ]" in result.stdout:
        print("⚠️  Migrations non appliquées détectées!")
        return False
    
    print("✅ Toutes les migrations sont appliquées")
    return True

def safe_migrate():
    """Applique les migrations de manière sécurisée"""
    print("🚀 Application des migrations...")
    
    # 1. Créer une sauvegarde
    create_backup()
    
    # 2. Vérifier les migrations
    if not check_migrations():
        print("❌ Migrations non appliquées détectées. Arrêt pour sécurité.")
        return False
    
    # 3. Appliquer les migrations
    run_command(f"python manage.py migrate --settings={DJANGO_SETTINGS}")
    
    # 4. Vérifier l'état final
    if check_migrations():
        print("✅ Migrations appliquées avec succès!")
        return True
    else:
        print("❌ Problème lors des migrations")
        return False

def deploy():
    """Processus de déploiement complet"""
    print("🚀 Démarrage du déploiement...")
    
    # Vérifier l'environnement
    if not os.getenv('DJANGO_SETTINGS_MODULE'):
        os.environ['DJANGO_SETTINGS_MODULE'] = DJANGO_SETTINGS
    
    # Collecter les fichiers statiques
    print("📦 Collecte des fichiers statiques...")
    run_command(f"python manage.py collectstatic --noinput --settings={DJANGO_SETTINGS}")
    
    # Appliquer les migrations
    if not safe_migrate():
        print("❌ Déploiement échoué à cause des migrations")
        return False
    
    # Redémarrer le serveur (si applicable)
    print("🔄 Redémarrage du serveur...")
    # Ici vous pouvez ajouter la logique pour redémarrer votre serveur
    
    print("✅ Déploiement terminé avec succès!")
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "backup":
            create_backup()
        elif command == "migrate":
            safe_migrate()
        elif command == "check":
            check_migrations()
        elif command == "deploy":
            deploy()
        else:
            print("Usage: python deploy_production.py [backup|migrate|check|deploy]")
    else:
        deploy()
