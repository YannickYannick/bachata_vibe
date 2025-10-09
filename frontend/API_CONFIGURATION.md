# 🔧 Configuration API - Mode Local vs Production

## 📋 Vue d'ensemble

Ce système permet de basculer automatiquement entre le mode local (`http://localhost:8000/api`) et le mode production (`https://bachatavibe.com/api`) sans modifier le code.

## 🚀 Utilisation

### **Mode automatique (recommandé)**
Le système détecte automatiquement l'environnement :
- **Production** : Quand l'application est déployée sur `bachatavibe.com`
- **Local** : Quand l'application tourne sur `localhost` ou `127.0.0.1`

### **Mode manuel**
Vous pouvez forcer un mode spécifique via les variables d'environnement :

```bash
# Mode local
REACT_APP_API_URL=http://localhost:8000/api npm start

# Mode production
REACT_APP_API_URL=https://bachatavibe.com/api npm start
```

## 📁 Structure des fichiers

```
frontend/
├── src/
│   ├── config/
│   │   └── api.js              # Configuration centralisée
│   ├── services/
│   │   └── api.js              # Service API avec détection automatique
│   └── components/
│       └── CompetitionsPage.jsx # Exemple d'utilisation
└── scripts/
    └── update-api-urls.js      # Script de migration automatique
```

## 🔄 Migration des URLs hardcodées

### **Script automatique**
```bash
# Voir ce qui serait changé (dry run)
node scripts/update-api-urls.js --dry-run

# Appliquer les changements
node scripts/update-api-urls.js
```

### **Migration manuelle**
1. **Remplacer les imports** :
   ```javascript
   // Avant
   import React, { useState, useEffect } from 'react';
   
   // Après
   import React, { useState, useEffect } from 'react';
   import ApiService from '../services/api';
   ```

2. **Remplacer les appels fetch** :
   ```javascript
   // Avant
   const response = await fetch('http://localhost:8000/api/competitions/competitions/');
   const data = await response.json();
   
   // Après
   const data = await ApiService.getCompetitions();
   ```

## 🛠️ Configuration Django

### **settings_test.py**
```python
# Configuration de l'API - Mode de déploiement
USE_PRODUCTION_API = False  # True pour la production, False pour le local

# URLs de l'API selon le mode
if USE_PRODUCTION_API:
    API_BASE_URL = 'https://bachatavibe.com/api'
    FRONTEND_BASE_URL = 'https://bachatavibe.com'
else:
    API_BASE_URL = 'http://localhost:8000/api'
    FRONTEND_BASE_URL = 'http://localhost:3000'
```

## 📝 Exemples d'utilisation

### **Dans un composant React**
```javascript
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const MyComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // L'URL est automatiquement détectée
      const data = await ApiService.getCompetitions();
      setData(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return <div>{/* Votre JSX */}</div>;
};
```

### **Avec la configuration centralisée**
```javascript
import { getApiUrl, buildApiUrl, API_CONFIG } from '../config/api';

// Utiliser l'URL de base
const apiUrl = getApiUrl(); // http://localhost:8000/api ou https://bachatavibe.com/api

// Construire une URL complète
const competitionsUrl = buildApiUrl('/competitions/competitions/');

// Vérifier le mode
if (API_CONFIG.IS_PRODUCTION) {
  console.log('Mode production activé');
} else {
  console.log('Mode local activé');
}
```

## 🔍 Dépannage

### **Problème : URLs hardcodées**
- **Solution** : Utilisez le script de migration automatique
- **Vérification** : Recherchez `http://localhost:8000` dans votre code

### **Problème : CORS errors**
- **Solution** : Vérifiez la configuration CORS dans `settings_test.py`
- **Vérification** : Les URLs doivent correspondre entre frontend et backend

### **Problème : Détection d'environnement**
- **Solution** : Vérifiez que `window.location.hostname` est correct
- **Debug** : Ajoutez `console.log(API_CONFIG)` pour voir la configuration

## 🎯 Avantages

1. **🔄 Basculement automatique** entre local et production
2. **📝 Code maintenable** sans URLs hardcodées
3. **🚀 Déploiement simplifié** sans modification de code
4. **🔧 Configuration centralisée** dans un seul endroit
5. **🛡️ Type safety** avec TypeScript (optionnel)

## 📚 Ressources

- [Django CORS Headers](https://github.com/adamchainz/django-cors-headers)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)









