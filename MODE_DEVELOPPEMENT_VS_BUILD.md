# 🔄 Guide : Mode Développement vs Mode Build

## 📋 Résumé des modes

| **Mode** | **Frontend** | **Backend** | **URL** | **Avantages** |
|----------|--------------|-------------|---------|---------------|
| **Développement** | `npm start` (port 3000) | `python manage.py runserver` (port 8000) | `http://localhost:3000` | Hot reload, debug facile |
| **Build** | Fichiers statiques dans `frontend/build/` | `python manage.py runserver` (port 8000) | `http://127.0.0.1:8000` | Performance optimisée |

---

## 🚀 Mode Développement → Mode Build

### 1. Arrêter les serveurs de développement
```bash
# Dans le terminal où tourne React (Ctrl+C)
# Dans le terminal où tourne Django (Ctrl+C)
```

### 2. Reconstruire le frontend React
```bash
cd frontend
npm run build
```

### 3. Modifier `bachata_site/settings_test.py`

**Ligne 54-69 :**
```python
# Configuration des templates pour le frontend React (mode build)
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
```

### 4. Modifier `templates/index.html`

**Lignes 9-12 :** Supprimer la redirection
```html
<!-- SUPPRIMER ces lignes -->
<script>
    // Redirection vers le serveur de développement React
    window.location.href = 'http://localhost:3000' + window.location.pathname;
</script>
```

### 5. Collecter les fichiers statiques
```bash
python manage.py collectstatic --noinput
```

### 6. Démarrer uniquement Django
```bash
python manage.py runserver
```

---

## 🔄 Mode Build → Mode Développement

### 1. Arrêter le serveur Django
```bash
# Dans le terminal où tourne Django (Ctrl+C)
```

### 2. Modifier `bachata_site/settings_test.py`

**Ligne 54-69 :**
```python
# Configuration des templates pour le frontend React (mode développement)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # Utilise toujours le template de fallback en mode dev
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
```

### 3. Modifier `templates/index.html`

**Lignes 9-12 :** Ajouter la redirection
```html
<script>
    // Redirection vers le serveur de développement React
    window.location.href = 'http://localhost:3000' + window.location.pathname;
</script>
```

### 4. Démarrer le serveur React
```bash
cd frontend
npm start
```

### 5. Démarrer le serveur Django (dans un autre terminal)
```bash
python manage.py runserver
```

---

## 🎯 Commandes rapides

### Mode Développement
```bash
# Terminal 1
cd frontend && npm start

# Terminal 2  
python manage.py runserver
```

### Mode Build
```bash
# Une seule fois
cd frontend && npm run build
python manage.py collectstatic --noinput

# Puis
python manage.py runserver
```

---

## ⚠️ Points importants

- **Mode Développement** : Utilise `localhost:3000` avec redirection automatique
- **Mode Build** : Utilise `127.0.0.1:8000` avec fichiers statiques optimisés
- **Hot reload** : Disponible uniquement en mode développement
- **Performance** : Optimisée uniquement en mode build
- **Debug** : Plus facile en mode développement grâce aux logs en temps réel
