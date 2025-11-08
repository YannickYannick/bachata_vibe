#!/usr/bin/env python
"""
Script de test pour démontrer le fonctionnement des catégories hiérarchiques
"""
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bachata_site.settings')
django.setup()

from theory.models import TheoryCategory

def test_hierarchical_categories():
    """Test des catégories hiérarchiques"""
    print("=== Test des catégories hiérarchiques ===\n")
    
    # Nettoyer les catégories existantes pour le test
    TheoryCategory.objects.all().delete()
    
    # Créer des catégories racines
    print("1. Création des catégories racines...")
    histoire = TheoryCategory.objects.create(
        name="Histoire",
        description="Histoire de la bachata",
        color="#FF6B6B",
        order=1
    )
    
    technique = TheoryCategory.objects.create(
        name="Technique",
        description="Techniques de danse",
        color="#4ECDC4",
        order=2
    )
    
    culture = TheoryCategory.objects.create(
        name="Culture",
        description="Culture dominicaine",
        color="#45B7D1",
        order=3
    )
    
    print(f"✓ Catégorie racine créée: {histoire}")
    print(f"✓ Catégorie racine créée: {technique}")
    print(f"✓ Catégorie racine créée: {culture}\n")
    
    # Créer des sous-catégories pour Histoire
    print("2. Création des sous-catégories pour 'Histoire'...")
    epoque_moderne = TheoryCategory.objects.create(
        name="Époque moderne",
        description="Histoire moderne de la bachata",
        color="#FF6B6B",
        parent=histoire,
        order=1
    )
    
    epoque_classique = TheoryCategory.objects.create(
        name="Époque classique",
        description="Origines de la bachata",
        color="#FF6B6B",
        parent=histoire,
        order=2
    )
    
    print(f"✓ Sous-catégorie créée: {epoque_moderne}")
    print(f"✓ Sous-catégorie créée: {epoque_classique}\n")
    
    # Créer des sous-catégories pour Technique
    print("3. Création des sous-catégories pour 'Technique'...")
    pas_de_base = TheoryCategory.objects.create(
        name="Pas de base",
        description="Les pas fondamentaux",
        color="#4ECDC4",
        parent=technique,
        order=1
    )
    
    figures = TheoryCategory.objects.create(
        name="Figures",
        description="Figures et enchaînements",
        color="#4ECDC4",
        parent=technique,
        order=2
    )
    
    musicalite = TheoryCategory.objects.create(
        name="Musicalité",
        description="Interprétation musicale",
        color="#4ECDC4",
        parent=technique,
        order=3
    )
    
    print(f"✓ Sous-catégorie créée: {pas_de_base}")
    print(f"✓ Sous-catégorie créée: {figures}")
    print(f"✓ Sous-catégorie créée: {musicalite}\n")
    
    # Créer une sous-catégorie de niveau 3
    print("4. Création d'une sous-catégorie de niveau 3...")
    xxe_siecle = TheoryCategory.objects.create(
        name="XXe siècle",
        description="Bachata du XXe siècle",
        color="#FF6B6B",
        parent=epoque_moderne,
        order=1
    )
    
    print(f"✓ Sous-catégorie de niveau 3 créée: {xxe_siecle}\n")
    
    # Tests des méthodes
    print("5. Tests des méthodes de hiérarchie...")
    
    print(f"Chemin complet de '{xxe_siecle.name}': {xxe_siecle.get_full_path()}")
    print(f"Niveau de profondeur: {xxe_siecle.get_level()}")
    print(f"Est une feuille: {xxe_siecle.is_leaf()}")
    print(f"Est une racine: {xxe_siecle.is_root()}")
    
    print(f"\nAncêtres de '{xxe_siecle.name}':")
    for ancestor in xxe_siecle.get_ancestors():
        print(f"  - {ancestor.name}")
    
    print(f"\nDescendants de '{histoire.name}':")
    for descendant in histoire.get_descendants():
        print(f"  - {descendant.name} (niveau {descendant.get_level()})")
    
    print(f"\nSous-catégories directes de '{technique.name}':")
    for subcat in technique.subcategories.all():
        print(f"  - {subcat.name}")
    
    # Test des catégories racines
    print(f"\n6. Catégories racines:")
    root_categories = TheoryCategory.objects.filter(parent__isnull=True)
    for root in root_categories:
        print(f"  - {root.name}")
        for subcat in root.subcategories.all():
            print(f"    └─ {subcat.name}")
    
    print("\n=== Test terminé avec succès ! ===")

if __name__ == "__main__":
    test_hierarchical_categories()
