"""
Configuration de test pour Django
Utilise SQLite pour les tests locaux
"""

import os
from pathlib import Path
from .settings import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Hosts autorisés pour les tests
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
]

# Configuration de sécurité (désactivée pour les tests)
SECURE_SSL_REDIRECT = False
SECURE_HSTS_SECONDS = 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
SECURE_CONTENT_TYPE_NOSNIFF = False
SECURE_BROWSER_XSS_FILTER = False
X_FRAME_OPTIONS = 'SAMEORIGIN'

# Configuration de la base de données SQLite pour les tests
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db_test.sqlite3',
    }
}

# Configuration des fichiers statiques
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Configuration des médias
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'

# Configuration pour servir le frontend React
BUILD_DIR = BASE_DIR / 'frontend' / 'build'
BUILD_STATIC_DIR = BUILD_DIR / 'static'

# Évite l'avertissement si le build n'a pas encore été généré
STATICFILES_DIRS = [p for p in [BUILD_STATIC_DIR] if p.exists()]

# Configuration des templates pour le frontend React (fallback vers templates/ si pas de build)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BUILD_DIR if BUILD_DIR.exists() else BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Configuration du cache simple pour les tests
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

# Configuration des sessions
SESSION_ENGINE = 'django.contrib.sessions.backends.db'

# Configuration des logs
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Configuration CORS pour les tests
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Configuration CSRF pour les tests
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

# Cookies en local (HTTP) – éviter les blocages CSRF
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'

# Configuration des emails pour les tests
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Configuration pour les tests
USE_TZ = True
TIME_ZONE = 'Europe/Paris'

# Configuration des middlewares pour les tests

