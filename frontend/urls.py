from django.urls import path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    # Route racine
    path('', TemplateView.as_view(template_name='index.html')),
    
    # Catch-all pour les routes frontend, mais PAS pour les routes API et media
    # Utilise une regex pour exclure les routes commençant par /api/ et /media/
    re_path(r'^(?!api/|media/).*$', TemplateView.as_view(template_name='index.html')),
]








