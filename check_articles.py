#!/usr/bin/env python
"""
Script pour vérifier le statut des articles
"""
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bachata_site.settings_test')
django.setup()

from formations.models import FormationArticle

def check_articles():
    print("📝 Vérification des articles de formation")
    print("=" * 50)
    
    all_articles = FormationArticle.objects.all()
    print(f"Total d'articles: {all_articles.count()}")
    
    for article in all_articles:
        print(f"\n📄 {article.title}")
        print(f"   Slug: {article.slug}")
        print(f"   Statut: {article.status}")
        print(f"   Auteur: {article.author.username}")
        print(f"   Catégorie: {article.category.name}")
        print(f"   Niveau: {article.level}")
        print(f"   Publié le: {article.published_at}")
    
    # Articles publiés
    published_articles = FormationArticle.objects.filter(status='published')
    print(f"\n✅ Articles publiés: {published_articles.count()}")
    
    # Articles en brouillon
    draft_articles = FormationArticle.objects.filter(status='draft')
    print(f"📝 Articles en brouillon: {draft_articles.count()}")

if __name__ == "__main__":
    check_articles()
