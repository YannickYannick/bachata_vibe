#!/usr/bin/env python
"""
Script pour vérifier les catégories de formation
"""
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bachata_site.settings_test')
django.setup()

from formations.models import FormationCategory

def check_categories():
    """Vérifie les catégories de formation existantes"""
    print("=== Catégories de formation existantes ===\n")
    
    categories = FormationCategory.objects.all()
    
    if not categories.exists():
        print("Aucune catégorie trouvée.")
        return
    
    print(f"Nombre total de catégories: {categories.count()}\n")
    
    # Afficher toutes les catégories
    for cat in categories:
        parent_name = cat.parent.name if cat.parent else "Aucune (racine)"
        status = "✓ Actif" if cat.is_active else "✗ Inactif"
        print(f"- {cat.name}")
        print(f"  Parent: {parent_name}")
        print(f"  Statut: {status}")
        print(f"  Ordre: {cat.order}")
        print(f"  Slug: {cat.slug}")
        print()
    
    # Afficher seulement les catégories actives
    active_categories = categories.filter(is_active=True)
    print(f"Catégories actives: {active_categories.count()}")
    for cat in active_categories:
        parent_name = cat.parent.name if cat.parent else "Aucune (racine)"
        print(f"  - {cat.name} (parent: {parent_name})")

if __name__ == "__main__":
    check_categories()
