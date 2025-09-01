#!/usr/bin/env python
"""
Script pour vérifier les tables de la base de données
"""
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bachata_site.settings_test')
django.setup()

from django.db import connection

def check_tables():
    with connection.cursor() as cursor:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print("📋 Tables existantes dans la base de données:")
        print("=" * 50)
        
        formation_tables = []
        for table in tables:
            table_name = table[0]
            print(f"  - {table_name}")
            if table_name.startswith('formations_'):
                formation_tables.append(table_name)
        
        print(f"\n🎯 Tables formations trouvées: {len(formation_tables)}")
        for table in formation_tables:
            print(f"  - {table}")
        
        # Vérifier spécifiquement la table FormationArticle
        if 'formations_formationarticle' in [t[0] for t in tables]:
            print("\n✅ Table formations_formationarticle existe")
            
            # Compter les articles
            cursor.execute("SELECT COUNT(*) FROM formations_formationarticle;")
            count = cursor.fetchone()[0]
            print(f"   Nombre d'articles: {count}")
        else:
            print("\n❌ Table formations_formationarticle N'EXISTE PAS")

if __name__ == "__main__":
    check_tables()
