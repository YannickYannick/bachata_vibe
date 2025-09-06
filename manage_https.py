#!/usr/bin/env python
"""
Script pour lancer Django avec HTTPS en développement local
Utilise un certificat SSL auto-signé
"""

import os
import sys
import django
from django.core.management import execute_from_command_line
from django.conf import settings

# Configuration pour HTTPS en développement
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bachata_site.settings_test')

# Configuration SSL pour le développement
import ssl
from django.core.servers.basehttp import WSGIServer
from django.core.wsgi import get_wsgi_application

class SecureHTTPServer(WSGIServer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.socket = ssl.wrap_socket(
            self.socket,
            certfile='localhost.pem',
            keyfile='localhost-key.pem',
            server_side=True
        )

if __name__ == '__main__':
    # Générer un certificat SSL auto-signé si nécessaire
    if not os.path.exists('localhost.pem'):
        print("Génération du certificat SSL auto-signé...")
        os.system('openssl req -x509 -newkey rsa:4096 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes -subj "/CN=localhost"')
    
    # Lancer le serveur avec HTTPS
    from django.core.management.commands.runserver import Command
    command = Command()
    command.handle(
        addrport='127.0.0.1:8000',
        use_reloader=True,
        use_threading=True,
        server_class=SecureHTTPServer
    )
