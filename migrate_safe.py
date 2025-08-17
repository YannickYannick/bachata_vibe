#!/usr/bin/env python
"""
Script de migration sécurisée
Évite les problèmes de base de données en production
"""

import os
import sys
import subprocess
import json
from pathlib import Path
from datetime import datetime

class SafeMigration:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.backup_dir = self.project_root / "backups"
        self.migration_log = self.project_root / "migration_log.json"
        
    def log_migration(self, action, status, details=""):
        """Enregistre chaque action de migration"""
        if not self.migration_log.exists():
            log_data = []
        else:
            with open(self.migration_log, 'r') as f:
                log_data = json.load(f)
        
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "action": action,
            "status": status,
            "details": details
        }
        
        log_data.append(log_entry)
        
        with open(self.migration_log, 'w') as f:
            json.dump(log_data, f, indent=2)
    
    def create_backup(self):
        """Crée une sauvegarde complète de la base de données"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = self.backup_dir / f"backup_{timestamp}.sql"
        
        print(f"💾 Création de sauvegarde: {backup_file}")
        
        # Créer le dossier de backup
        self.backup_dir.mkdir(exist_ok=True)
        
        try:
            # Vérifier le type de base de données
            result = subprocess.run(
                "python manage.py shell -c \"from django.conf import settings; print(settings.DATABASES['default']['ENGINE'])\"",
                shell=True, capture_output=True, text=True
            )
            
            db_engine = result.stdout.strip()
            
            if 'postgresql' in db_engine:
                # Sauvegarde PostgreSQL
                db_config = self.get_db_config()
                cmd = f"pg_dump -h {db_config['HOST']} -U {db_config['USER']} -d {db_config['NAME']} > {backup_file}"
                
                # Utiliser PGPASSWORD pour éviter l'interaction
                env = os.environ.copy()
                env['PGPASSWORD'] = db_config['PASSWORD']
                
                subprocess.run(cmd, shell=True, env=env, check=True)
                print("✅ Sauvegarde PostgreSQL créée")
                
            elif 'sqlite' in db_engine:
                # Sauvegarde SQLite
                db_file = self.project_root / "db.sqlite3"
                if db_file.exists():
                    import shutil
                    shutil.copy2(db_file, backup_file)
                    print("✅ Sauvegarde SQLite créée")
                else:
                    print("⚠️  Fichier SQLite non trouvé")
                    
        except Exception as e:
            print(f"❌ Erreur lors de la sauvegarde: {e}")
            self.log_migration("backup", "failed", str(e))
            return False
        
        self.log_migration("backup", "success", str(backup_file))
        return True
    
    def get_db_config(self):
        """Récupère la configuration de la base de données"""
        try:
            result = subprocess.run(
                "python manage.py shell -c \"from django.conf import settings; import json; print(json.dumps(settings.DATABASES['default']))\"",
                shell=True, capture_output=True, text=True
            )
            return json.loads(result.stdout.strip())
        except:
            return {
                'HOST': 'localhost',
                'USER': 'postgres',
                'NAME': 'bachata_site',
                'PASSWORD': ''
            }
    
    def check_migrations_status(self):
        """Vérifie l'état actuel des migrations"""
        print("🔍 Vérification de l'état des migrations...")
        
        try:
            result = subprocess.run(
                "python manage.py showmigrations --list",
                shell=True, capture_output=True, text=True
            )
            
            if result.returncode != 0:
                print(f"❌ Erreur lors de la vérification: {result.stderr}")
                return False
            
            # Analyser les migrations
            lines = result.stdout.split('\n')
            unapplied = []
            applied = []
            
            for line in lines:
                if '[ ]' in line:
                    unapplied.append(line.strip())
                elif '[X]' in line:
                    applied.append(line.strip())
            
            print(f"✅ Migrations appliquées: {len(applied)}")
            if unapplied:
                print(f"⚠️  Migrations non appliquées: {len(unapplied)}")
                for migration in unapplied:
                    print(f"   - {migration}")
            
            return len(unapplied) == 0
            
        except Exception as e:
            print(f"❌ Erreur lors de la vérification: {e}")
            return False
    
    def safe_migrate(self):
        """Applique les migrations de manière sécurisée"""
        print("🚀 Démarrage de la migration sécurisée...")
        
        # 1. Vérifier l'état actuel
        if not self.check_migrations_status():
            print("⚠️  Migrations non appliquées détectées")
        
        # 2. Créer une sauvegarde
        if not self.create_backup():
            print("❌ Impossible de créer la sauvegarde. Arrêt.")
            return False
        
        # 3. Vérifier les migrations en attente
        try:
            result = subprocess.run(
                "python manage.py showmigrations --list",
                shell=True, capture_output=True, text=True
            )
            
            if '[ ]' not in result.stdout:
                print("✅ Aucune migration en attente")
                self.log_migration("migrate", "success", "no_migrations_needed")
                return True
                
        except Exception as e:
            print(f"❌ Erreur lors de la vérification: {e}")
            return False
        
        # 4. Appliquer les migrations
        print("🔄 Application des migrations...")
        try:
            result = subprocess.run(
                "python manage.py migrate",
                shell=True, capture_output=True, text=True
            )
            
            if result.returncode == 0:
                print("✅ Migrations appliquées avec succès")
                self.log_migration("migrate", "success")
                
                # Vérifier l'état final
                if self.check_migrations_status():
                    print("✅ Toutes les migrations sont maintenant appliquées")
                    return True
                else:
                    print("⚠️  Problème détecté après migration")
                    return False
            else:
                print(f"❌ Erreur lors des migrations: {result.stderr}")
                self.log_migration("migrate", "failed", result.stderr)
                return False
                
        except Exception as e:
            print(f"❌ Erreur lors des migrations: {e}")
            self.log_migration("migrate", "failed", str(e))
            return False
    
    def rollback_migration(self, backup_file):
        """Restaure une sauvegarde en cas de problème"""
        print(f"🔄 Restauration de la sauvegarde: {backup_file}")
        
        try:
            if backup_file.suffix == '.sql':
                # Restauration PostgreSQL
                db_config = self.get_db_config()
                cmd = f"psql -h {db_config['HOST']} -U {db_config['USER']} -d {db_config['NAME']} < {backup_file}"
                
                env = os.environ.copy()
                env['PGPASSWORD'] = db_config['PASSWORD']
                
                subprocess.run(cmd, shell=True, env=env, check=True)
                print("✅ Restauration PostgreSQL réussie")
                
            else:
                # Restauration SQLite
                import shutil
                shutil.copy2(backup_file, self.project_root / "db.sqlite3")
                print("✅ Restauration SQLite réussie")
                
            self.log_migration("rollback", "success", str(backup_file))
            return True
            
        except Exception as e:
            print(f"❌ Erreur lors de la restauration: {e}")
            self.log_migration("rollback", "failed", str(e))
            return False

def main():
    migrator = SafeMigration()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "check":
            migrator.check_migrations_status()
        elif command == "backup":
            migrator.create_backup()
        elif command == "migrate":
            migrator.safe_migrate()
        elif command == "rollback":
            if len(sys.argv) > 2:
                backup_file = Path(sys.argv[2])
                migrator.rollback_migration(backup_file)
            else:
                print("Usage: python migrate_safe.py rollback <backup_file>")
        else:
            print("Usage: python migrate_safe.py [check|backup|migrate|rollback]")
    else:
        migrator.safe_migrate()

if __name__ == "__main__":
    main()
