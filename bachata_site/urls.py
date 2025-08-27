"""
URL configuration for bachata_site project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.views.static import serve as serve_static

urlpatterns = [
    # Interface d'administration Django
    path('admin/', admin.site.urls),
    
    # API des comptes utilisateurs
    path('api/accounts/', include('accounts.urls')),
    
    # API des cours
    path('api/courses/', include('courses.urls')),
    
    # API des festivals
    path('api/festivals/', include('festivals.urls')),
    
    # API des trainings
    path('api/trainings/', include('trainings.urls')),
    
    # API des compétitions
    path('api/competitions/', include('competitions.urls')),
    
    # API des artistes
    path('api/artists/', include('artists.urls')),
    
    # API de la théorie
    path('api/theory/', include('theory.urls')),
    
    # API des soins
    path('api/care/', include('care.urls')),
    
    # Redirection de la racine vers le frontend
    path('', RedirectView.as_view(url='/frontend/', permanent=False)),
    
    # Servir les vidéos du build React (ex: /videos/paris-drone.mp4)
    re_path(r'^videos/(?P<path>.*)$', serve_static, {
        'document_root': settings.BASE_DIR / 'frontend' / 'build' / 'videos'
    }),

    # URLs du frontend React (gérées par React Router)
    path('frontend/', include('frontend.urls')),
]

# Configuration des médias et fichiers statiques en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Configuration de l'interface d'administration
admin.site.site_header = "Administration BachataSite"
admin.site.site_title = "BachataSite Admin"
admin.site.index_title = "Bienvenue dans l'administration de BachataSite"
