#!/usr/bin/env python
"""
Test direct de la requête Django
"""
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bachata_site.settings_test')
django.setup()

from formations.models import FormationArticle
from django.db.models import Q
from django.db.models.functions import Coalesce

def test_django_query():
    print("🧪 Test direct de la requête Django")
    print("=" * 50)
    
    # Test 1: Requête simple
    print("\n1. Requête simple...")
    articles = FormationArticle.objects.filter(status='published')
    print(f"   Articles publiés: {articles.count()}")
    
    for article in articles[:3]:
        print(f"     - {article.title} ({article.status})")
    
    # Test 2: Requête avec select_related et prefetch_related
    print("\n2. Requête avec optimisations...")
    queryset = FormationArticle.objects.filter(status='published').select_related(
        'author', 'category'
    ).prefetch_related(
        'formationfavorite_set', 'formationprogress_set', 'formationmedia_set'
    ).annotate(
        total_views=Coalesce('views_count', 0),
        total_likes=Coalesce('likes_count', 0),
        total_comments=Coalesce('comments_count', 0)
    )
    
    print(f"   Articles avec optimisations: {queryset.count()}")
    
    # Test 3: Requête avec tri
    print("\n3. Requête avec tri...")
    sorted_queryset = queryset.order_by('-published_at', '-created_at')
    print(f"   Articles triés: {sorted_queryset.count()}")
    
    for article in sorted_queryset[:3]:
        print(f"     - {article.title} (publié le: {article.published_at})")

if __name__ == "__main__":
    test_django_query()
