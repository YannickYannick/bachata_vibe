"""
WSGI config for bachata_site project.
"""

import os

from django.core.wsgi import get_wsgi_application


os.environ['DJANGO_SETTINGS_MODULE'] = 'site_trading_v3.settings_production'

application = get_wsgi_application()


