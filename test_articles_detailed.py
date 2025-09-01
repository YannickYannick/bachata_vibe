#!/usr/bin/env python
"""
Test détaillé de l'API articles
"""
import requests
import json

def test_articles_detailed():
    base_url = "http://localhost:8000/api/formations"
    
    print("🧪 Test détaillé de l'API Articles")
    print("=" * 50)
    
    # Test 1: Articles sans pagination
    print("\n1. Test articles sans pagination...")
    try:
        response = requests.get(f"{base_url}/articles/?page_size=100")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Count: {data.get('count', 'N/A')}")
            print(f"   Results: {len(data.get('results', []))}")
            print(f"   Next: {data.get('next', 'N/A')}")
            print(f"   Previous: {data.get('previous', 'N/A')}")
            
            if data.get('results'):
                for article in data['results'][:2]:  # Afficher les 2 premiers
                    print(f"     - {article.get('title', 'N/A')} ({article.get('status', 'N/A')})")
        else:
            print(f"   Erreur: {response.text}")
    except Exception as e:
        print(f"   Erreur de connexion: {e}")
    
    # Test 2: Articles avec filtre de statut
    print("\n2. Test articles avec filtre...")
    try:
        response = requests.get(f"{base_url}/articles/?status=published")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Count: {data.get('count', 'N/A')}")
            print(f"   Results: {len(data.get('results', []))}")
        else:
            print(f"   Erreur: {response.text}")
    except Exception as e:
        print(f"   Erreur de connexion: {e}")

if __name__ == "__main__":
    test_articles_detailed()
