import os
import sys

# Ajoute le répertoire du projet au chemin d'accès
project_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_dir)

# Configuration de l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bachata_site.settings_production')

# Import de l'application WSGI
import django
from django.core.wsgi import get_wsgi_application

django.setup()
application = get_wsgi_application()
