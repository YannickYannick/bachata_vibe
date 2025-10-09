#!/bin/bash

# Script de démarrage pour le mode développement
# Démarre l'API Django et le frontend React en parallèle

echo "🚀 Démarrage du mode développement BachataVibe"
echo "=============================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "manage.py" ]; then
    echo "❌ Erreur: manage.py non trouvé. Assurez-vous d'être dans le répertoire racine du projet."
    exit 1
fi

# Fonction pour nettoyer les processus à la sortie
cleanup() {
    echo ""
    echo "🛑 Arrêt des serveurs..."
    kill $DJANGO_PID 2>/dev/null
    kill $REACT_PID 2>/dev/null
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT SIGTERM

echo "📡 Démarrage de l'API Django sur http://127.0.0.1:8000..."
python manage.py runserver --settings=bachata_site.settings_test &
DJANGO_PID=$!

# Attendre que Django démarre
sleep 3

echo "⚛️  Démarrage du frontend React sur http://localhost:3000..."
cd frontend
npm start &
REACT_PID=$!

echo ""
echo "✅ Serveurs démarrés avec succès !"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 API: http://127.0.0.1:8000"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"

# Attendre que les processus se terminent
wait
