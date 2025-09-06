#!/bin/bash

# Script de démarrage pour le frontend React
echo "🚀 Démarrage du frontend React..."

# Aller dans le dossier frontend
cd frontend

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Tuer les processus sur le port 3000 et 3001
echo "🔄 Libération des ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Démarrer le serveur de développement
echo "🌐 Démarrage du serveur sur le port 3001..."
PORT=3001 HOST=localhost DANGEROUSLY_DISABLE_HOST_CHECK=true npm start


