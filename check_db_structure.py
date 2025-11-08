#!/usr/bin/env python
"""
Script pour vérifier la structure de la base de données
"""
import sqlite3

def check_table_structure():
    """Vérifie la structure de la table theory_theorycategory"""
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    
    try:
        # Vérifier la structure de la table
        cursor.execute('PRAGMA table_info(theory_theorycategory)')
        columns = cursor.fetchall()
        
        print("Structure de la table theory_theorycategory:")
        for column in columns:
            print(f"  {column}")
        
        # Vérifier si la colonne parent_id existe
        column_names = [col[1] for col in columns]
        if 'parent_id' in column_names:
            print("\n✓ La colonne parent_id existe")
        else:
            print("\n✗ La colonne parent_id n'existe pas")
            
    except Exception as e:
        print(f"Erreur: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_table_structure()
