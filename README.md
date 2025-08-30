# 🕺 Site Bachata et Cocktail

Un site web moderne combinant l'univers de la bachata et des cocktails, construit avec Django et React.

## ✨ Fonctionnalités

- **🎭 Gestion des artistes** : Profils, biographies, photos
- **🏆 Compétitions** : Organisation et suivi des événements
- **📚 Cours et formations** : Système d'apprentissage
- **🎪 Festivals** : Gestion des événements et festivals
- **💆‍♀️ Soins et bien-être** : Services de santé
- **📖 Théorie** : Articles et ressources éducatives
- **🏋️‍♂️ Entraînements** : Programmes d'entraînement

## 🛠️ Technologies utilisées

### Backend
- **Django 4.2.7** - Framework web Python
- **Django REST Framework** - API REST
- **PostgreSQL** - Base de données (production)
- **SQLite** - Base de données (développement)
- **Redis** - Cache et sessions

### Frontend
- **React** - Interface utilisateur
- **Tailwind CSS** - Framework CSS utilitaire
- **Responsive Design** - Compatible mobile et desktop

## 🚀 Installation et démarrage

### Prérequis
- Python 3.8+
- Node.js 16+
- PostgreSQL (optionnel pour le développement)

### 1. Cloner le projet
```bash
git clone https://github.com/YannickYannick/site-bachata-cocktail.git
cd site-bachata-cocktail
```

### 2. Backend Django
```bash
# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations
python manage.py migrate

# Créer un superuser
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver
```

### 3. Frontend React
```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

## ▶️ Démarrer le site : mode "start" vs mode "build"

Cette application peut être lancée de deux façons complémentaires.

### A) Mode développement – `npm start`

- Objectif: développer vite avec rechargement automatique.
- Ce qui se passe:
  - Le frontend React tourne sur `http://localhost:3000` (serveur de dev).
  - Le backend Django tourne sur `http://127.0.0.1:8000`.
  - Les requêtes API sont proxifiées depuis le frontend vers Django (voir `frontend/package.json`).
  - Les fichiers sont servis depuis la mémoire; pas d'optimisation ni de minification.

Commandes:
```powershell
# Terminal 1 – Backend
python manage.py runserver

# Terminal 2 – Frontend
cd frontend
npm start
```

Accès:
- Frontend: `http://localhost:3000`
- API/Back: `http://127.0.0.1:8000`

Où placer vos fichiers pendant le dev:
- Images/vidéos statiques: `frontend/public/...` (ex: `frontend/public/videos/paris-drone.mp4` → accessible via `/videos/paris-drone.mp4`).

### B) Mode production local – `npm run build`

- Objectif: générer une version optimisée servie par Django (sans `npm start`).
- Ce qui se passe:
  - `npm run build` crée un dossier `frontend/build` optimisé (hash, minification).
  - Django sert l'`index.html` du build et les statiques compilés.
  - Les vidéos sont servies par Django via l'URL `/videos/...`.

Commandes (Windows PowerShell):
```powershell
# 1) Construire le frontend
cd frontend
npm run build
cd ..

# 2) Collecter les statiques (si nécessaire)
python manage.py collectstatic --noinput --settings=bachata_site.settings_test

# 3) Lancer Django (qui sert le build)
python manage.py runserver --settings=bachata_site.settings_test
```

Accès:
- Site complet (build): `http://127.0.0.1:8000/`

Astuce (sans changer de dossier):
```powershell
npm --prefix frontend run build
```

Où placer vos fichiers en build:
- Les vidéos destinées à la prod locale sont en `frontend/build/videos/...` (elles sont servies via `/videos/...`).

### Erreurs courantes et solutions

- PowerShell n'accepte pas `&&` entre 2 commandes → exécutez-les sur 2 lignes distinctes.
- `The directory '.../frontend/build/static' in STATICFILES_DIRS does not exist` → refaites `npm run build`.
- Vidéo 404 en prod locale → assurez-vous que l'URL `http://127.0.0.1:8000/videos/<nom>.mp4` fonctionne; le fichier doit exister dans `frontend/build/videos/` et la route `/videos/` est configurée dans `bachata_site/urls.py`.

## 🌐 Accès

- **Backend** : http://127.0.0.1:8000/
- **Admin Django** : http://127.0.0.1:8000/admin/
- **Frontend** : http://localhost:3000/

## 📁 Structure du projet

```
site-bachata-cocktail/
├── accounts/          # Gestion des utilisateurs
├── artists/           # Gestion des artistes
├── care/             # Services de soins
├── competitions/     # Gestion des compétitions
├── courses/          # Système de cours
├── festivals/        # Gestion des festivals
├── frontend/         # Application React
├── theory/           # Articles et théorie
├── trainings/        # Programmes d'entraînement
├── bachata_site/     # Configuration Django
├── manage.py         # Script de gestion Django
└── requirements.txt  # Dépendances Python
```

## 🔧 Scripts utiles

### Migration sécurisée
```bash
# Vérifier l'état des migrations
python migrate_safe.py check

# Créer une sauvegarde
python migrate_safe.py backup

# Appliquer les migrations de manière sécurisée
python migrate_safe.py migrate

# Restaurer une sauvegarde en cas de problème
python migrate_safe.py rollback <fichier_backup>
```

### Déploiement
```bash
# Déploiement complet
python deploy_production.py deploy

# Collecte des fichiers statiques
python deploy_production.py collectstatic
```

## 🚀 Déploiement en production

### Recommandations
- **Hébergement** : DigitalOcean App Platform ou Heroku
- **Base de données** : PostgreSQL géré
- **Cache** : Redis
- **Frontend** : Vercel ou Netlify

### Configuration
1. Copier `env_production_example.txt` vers `.env.production`
2. Remplir les variables d'environnement
3. Utiliser `settings_production.py` pour Django
4. Configurer les domaines autorisés

## 📝 Variables d'environnement

Créer un fichier `.env` avec :

```env
# Base de données
DB_NAME=bachata_site
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Sécurité
SECRET_KEY=your_secret_key
DEBUG=True

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Yannick** - [@YannickYannick](https://github.com/YannickYannick)

## 🙏 Remerciements

- La communauté Django
- La communauté React
- Tous les contributeurs

---

⭐ N'oubliez pas de mettre une étoile si ce projet vous plaît !




