#!/usr/bin/env python
"""
Test simple des articles
"""
import requests

def test_articles():
    url = "http://localhost:8000/api/formations/articles/"
    print(f"Testing: {url}")
    
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        print(f"Content: {response.text[:500]}...")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_articles()
