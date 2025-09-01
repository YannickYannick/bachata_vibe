#!/usr/bin/env python
"""
Script de test des API formations
"""
import requests
import json

def test_formations_api():
    base_url = "http://localhost:8000/api/formations"
    
    print("🧪 Test des API Formations")
    print("=" * 50)
    
    # Test 1: Catégories
    print("\n1. Test des catégories...")
    try:
        response = requests.get(f"{base_url}/categories/")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Catégories trouvées: {len(data.get('results', data))}")
            for cat in data.get('results', data)[:3]:  # Afficher les 3 premières
                print(f"     - {cat.get('name', 'N/A')}")
        else:
            print(f"   Erreur: {response.text}")
    except Exception as e:
        print(f"   Erreur de connexion: {e}")
    
    # Test 2: Arborescence des catégories
    print("\n2. Test de l'arborescence...")
    try:
        response = requests.get(f"{base_url}/categories/tree/")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Catégories racines: {len(data)}")
            for cat in data[:2]:  # Afficher les 2 premières
                print(f"     - {cat.get('name', 'N/A')} ({len(cat.get('children', []))} enfants)")
        else:
            print(f"   Erreur: {response.text}")
    except Exception as e:
        print(f"   Erreur de connexion: {e}")
    
    # Test 3: Articles
    print("\n3. Test des articles...")
    try:
        response = requests.get(f"{base_url}/articles/")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Articles trouvés: {len(data.get('results', data))}")
            for article in data.get('results', data)[:2]:  # Afficher les 2 premiers
                print(f"     - {article.get('title', 'N/A')} ({article.get('level', 'N/A')})")
        else:
            print(f"   Erreur: {response.text}")
    except Exception as e:
        print(f"   Erreur de connexion: {e}")
    
    # Test 4: Recherche
    print("\n4. Test de la recherche...")
    try:
        response = requests.get(f"{base_url}/articles/search/?search=bachata")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Résultats de recherche: {len(data.get('results', data))}")
        else:
            print(f"   Erreur: {response.text}")
    except Exception as e:
        print(f"   Erreur de connexion: {e}")

if __name__ == "__main__":
    test_formations_api()
