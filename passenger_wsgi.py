import os
import sys

# Ajoute le répertoire du projet au chemin d'accès
sys.path.insert(0, os.path.dirname(__file__))

# Ajoute le chemin vers le répertoire du projet Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'bachata_site'))

# Configuration de l'environnement Django
os.environ['DJANGO_SETTINGS_MODULE'] = 'bachata_site.settings_production'

# Import de l'application WSGI
from bachata_site.wsgi import application
