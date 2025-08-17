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




