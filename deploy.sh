#!/bin/bash

# Script de déploiement automatisé pour BachataVibe
# Usage: ./deploy.sh [--production|--local]

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Vérifier les arguments
MODE="production"
if [[ "$1" == "--local" ]]; then
    MODE="local"
elif [[ "$1" == "--production" ]]; then
    MODE="production"
fi

log "🚀 Démarrage du déploiement en mode: $MODE"

# Étape 1: Build du frontend
log "📦 Build du frontend React..."
cd frontend

# Vérifier que node_modules existe
if [ ! -d "node_modules" ]; then
    log "📥 Installation des dépendances npm..."
    npm install
fi

# Build
npm run build
success "Frontend buildé avec succès"

# Retour au dossier racine
cd ..

# Étape 2: Configuration Django
log "⚙️  Configuration Django..."

if [[ "$MODE" == "production" ]]; then
    # Mode production
    sed -i 's/USE_PRODUCTION_API = False/USE_PRODUCTION_API = True/' bachata_site/settings_test.py
    success "Configuration Django: Mode production"
else
    # Mode local
    sed -i 's/USE_PRODUCTION_API = True/USE_PRODUCTION_API = False/' bachata_site/settings_test.py
    success "Configuration Django: Mode local"
fi

# Étape 3: Collecter les fichiers statiques
log "📁 Collecte des fichiers statiques..."
python manage.py collectstatic --noinput --settings=bachata_site.settings_test
success "Fichiers statiques collectés"

# Étape 4: Tests rapides
log "🧪 Tests rapides..."
python manage.py check --settings=bachata_site.settings_test
success "Tests Django passés"

# Étape 5: Git (optionnel)
if [[ "$2" != "--no-git" ]]; then
    log "📤 Poussée vers Git..."
    git add .
    git commit -m "Deploy: $MODE mode - $(date)"
    git push origin main
    success "Changements poussés vers Git"
fi

# Étape 6: Instructions pour le serveur
log "🖥️  Instructions pour le serveur:"
echo ""
echo "Sur votre serveur HostHarmada, exécutez:"
echo ""
echo "  git pull origin main"
echo "  source /home2/bachatav/virtualenv/bachata_vibe/3.9/bin/activate"
echo "  python manage.py collectstatic --noinput --settings=bachata_site.settings_test"
echo "  ./manage_bachata.sh restart"
echo ""

# Étape 7: Vérifications locales
if [[ "$MODE" == "local" ]]; then
    log "🔍 Démarrage du serveur local..."
    echo "Démarrage du serveur Django en mode local..."
    echo "Appuyez sur Ctrl+C pour arrêter"
    python manage.py runserver 0.0.0.0:8000 --settings=bachata_site.settings_test
fi

success "🎉 Déploiement terminé!"








