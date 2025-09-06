# Site Bachata & Cocktail

Site web Django pour la communauté Bachata avec intégration React frontend.

## 🚀 Fonctionnalités

- **Backend Django** avec API REST
- **Frontend React** intégré
- **Gestion des cours** de Bachata
- **Événements et festivals**
- **Formations et compétitions**
- **Gestion des artistes**
- **Système de soins**

## 🛠️ Installation

### Prérequis
- Python 3.8+
- Node.js 16+
- PostgreSQL (production)

### Développement local

1. **Cloner le dépôt**
```bash
git clone https://github.com/votre-username/bachata-site.git
cd bachata-site
```

2. **Installer les dépendances Python**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

3. **Installer les dépendances Node.js**
```bash
cd frontend
npm install
npm run build
cd ..
```

4. **Configuration de la base de données**
```bash
python manage.py migrate
python manage.py createsuperuser
```

5. **Lancer le serveur de développement**
```bash
python manage.py runserver --settings=bachata_site.settings_test
```

## 🌐 Déploiement

### Variables d'environnement

Créer un fichier `.env` avec :
```
SECRET_KEY=your-secret-key
DEBUG=False
DB_NAME=bachata_site
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
USE_POSTGRES=true
```

### Production

```bash
python manage.py runserver --settings=bachata_site.settings_production
```

## 📁 Structure du projet

```
bachata_site/
├── bachata_site/          # Configuration Django
├── accounts/              # Gestion des utilisateurs
├── courses/               # Cours de Bachata
├── events/                # Événements
├── festivals/             # Festivals
├── trainings/             # Formations
├── care/                  # Système de soins
├── competitions/          # Compétitions
├── artists/               # Gestion des artistes
├── theory/                # Théorie
├── formations/            # Formations
├── frontend/              # Application React
├── templates/             # Templates Django
├── static/                # Fichiers statiques
└── media/                 # Médias uploadés
```

## 🔧 Configuration

### Settings disponibles
- `settings.py` - Configuration de base
- `settings_test.py` - Configuration de test (SQLite)
- `settings_dev.py` - Configuration de développement
- `settings_production.py` - Configuration de production (PostgreSQL)

## 📝 Licence

Ce projet est sous licence MIT.