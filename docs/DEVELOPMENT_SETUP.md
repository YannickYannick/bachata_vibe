# 🚀 Configuration de Développement - BachataVibe

## 📋 Vue d'ensemble

Cette documentation explique comment configurer et démarrer l'environnement de développement local pour BachataVibe.

## 🔧 Configuration

### Mode Développement Local
- **Frontend React** : `http://localhost:3000` (mode développement avec hot-reload)
- **API Django** : `http://127.0.0.1:8000` (serveur de développement)
- **Base de données** : SQLite locale (`db_test.sqlite3`)

## 🛠️ Démarrage Rapide

### Option 1: Scripts automatisés

#### Windows (PowerShell)
```powershell
.\start-dev.ps1
```

#### Linux/macOS (Bash)
```bash
./start-dev.sh
```

### Option 2: Démarrage manuel

#### 1. Démarrer l'API Django
```bash
python manage.py runserver --settings=bachata_site.settings_test
```
- API disponible sur : http://127.0.0.1:8000
- Admin Django : http://127.0.0.1:8000/admin/

#### 2. Démarrer le frontend React
```bash
cd frontend
npm start
```
- Frontend disponible sur : http://localhost:3000
- Hot-reload activé

## ⚙️ Configuration des Settings

### Django Settings (`bachata_site/settings_test.py`)
```python
# Mode développement local
USE_PRODUCTION_API = False

# URLs locales
API_BASE_URL = 'http://localhost:8000/api'
FRONTEND_BASE_URL = 'http://localhost:3000'
```

### Frontend Configuration (`frontend/src/config/api.js`)
```javascript
// Détection automatique de l'environnement
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  return 'http://127.0.0.1:8000/api';
}
```

### Proxy React (`frontend/package.json`)
```json
{
  "proxy": "http://localhost:8000"
}
```

## 🔗 URLs de Développement

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Interface utilisateur React |
| API | http://127.0.0.1:8000/api/ | API REST Django |
| Admin | http://127.0.0.1:8000/admin/ | Interface d'administration Django |
| Docs API | http://127.0.0.1:8000/api/docs/ | Documentation API (si configurée) |

## 🗄️ Base de Données

### Configuration SQLite
- **Fichier** : `db_test.sqlite3`
- **Type** : SQLite (développement)
- **Migrations** : Automatiques au démarrage

### Commandes utiles
```bash
# Appliquer les migrations
python manage.py migrate --settings=bachata_site.settings_test

# Créer un superutilisateur
python manage.py createsuperuser --settings=bachata_site.settings_test

# Collecter les fichiers statiques
python manage.py collectstatic --settings=bachata_site.settings_test
```

## 🔄 Workflow de Développement

### 1. Développement Frontend
- Modifications dans `frontend/src/`
- Hot-reload automatique
- Pas besoin de rebuild

### 2. Développement Backend
- Modifications dans les apps Django
- Redémarrage automatique du serveur Django
- API immédiatement disponible

### 3. Développement Full-Stack
- Frontend et backend en parallèle
- Communication via proxy React
- Debugging facilité

## 🐛 Débogage

### Logs Django
```bash
# Activer les logs détaillés
export DJANGO_LOG_LEVEL=DEBUG
python manage.py runserver --settings=bachata_site.settings_test
```

### Logs Frontend
- Console du navigateur (F12)
- React DevTools recommandés
- Network tab pour les appels API

### Problèmes courants

#### API non accessible
- Vérifier que Django démarre sur le port 8000
- Vérifier les paramètres CORS
- Tester directement : `curl http://127.0.0.1:8000/api/events/categories/`

#### Frontend ne se connecte pas à l'API
- Vérifier le proxy dans `package.json`
- Vérifier la configuration dans `frontend/src/config/api.js`
- Redémarrer le serveur React

#### Erreurs CORS
- Vérifier `CORS_ALLOWED_ORIGINS` dans les settings Django
- S'assurer que `http://localhost:3000` est autorisé

## 📦 Dépendances

### Python
```bash
pip install -r requirements.txt
```

### Node.js
```bash
cd frontend
npm install
```

## 🚀 Déploiement

### Build de Production
```bash
# Construire le frontend
cd frontend
npm run build

# Le build sera dans frontend/build/
```

### Configuration Production
- Changer `USE_PRODUCTION_API = True` dans `settings_test.py`
- Rebuild le frontend
- Déployer sur le serveur

## 📚 Ressources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [CORS Headers](https://github.com/adamchainz/django-cors-headers)

---
*Dernière mise à jour : 2025-10-09*
