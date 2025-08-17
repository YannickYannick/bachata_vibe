"""
WSGI config for bachata_site project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bachata_site.settings')

application = get_wsgi_application()




