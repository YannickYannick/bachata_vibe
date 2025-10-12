# Correction de l'erreur toast.info

## Problème identifié

**Erreur** : `TypeError: react_hot_toast__WEBPACK_IMPORTED_MODULE_1__.toast.info is not a function`

**Cause** : Dans la version `react-hot-toast@^2.4.0` utilisée dans le projet, la méthode `toast.info()` n'existe pas.

## Méthodes disponibles dans react-hot-toast v2.4.0

```javascript
// ✅ Méthodes disponibles :
toast.success(message)
toast.error(message) 
toast.loading(message)
toast(message, options) // Méthode générale

// ❌ Méthode inexistante :
toast.info(message) // N'existe pas dans cette version
```

## Corrections apportées

### 1. ArtistsPage.jsx ✅
**Avant** :
```javascript
toast.info('Fonctionnalité "Voir profil" en cours de développement');
```

**Après** :
```javascript
toast('Fonctionnalité "Voir profil" en cours de développement', {
  icon: 'ℹ️',
  style: {
    background: '#3B82F6',
    color: '#fff',
  },
});
```

### 2. TrainingsPage.jsx ✅
**Avant** :
```javascript
toast.info('Fonctionnalité d\'inscription en cours de développement');
```

**Après** :
```javascript
toast('Fonctionnalité d\'inscription en cours de développement', {
  icon: 'ℹ️',
  style: {
    background: '#10B981',
    color: '#fff',
  },
});
```

## Alternative : Utiliser toast.success()

Si vous préférez une approche plus simple, vous pouvez aussi utiliser :

```javascript
// Pour les messages informatifs
toast.success('Fonctionnalité en cours de développement');

// Ou pour les messages neutres
toast('Message', { icon: 'ℹ️' });
```

## Vérification

Pour vérifier les méthodes disponibles dans votre version de react-hot-toast :

```javascript
import { toast } from 'react-hot-toast';
console.log(Object.getOwnPropertyNames(toast));
```

## Mise à jour (optionnelle)

Si vous voulez avoir accès à `toast.info()`, vous pourriez mettre à jour vers une version plus récente :

```bash
cd frontend
npm install react-hot-toast@latest
```

Mais la solution actuelle fonctionne parfaitement avec la version existante.

## Test

Les boutons fonctionnent maintenant sans erreur :
1. ✅ Bouton "Voir profil" sur http://127.0.0.1:3000/artists
2. ✅ Bouton "S'inscrire" sur http://127.0.0.1:3000/trainings

## Fichiers modifiés

- ✅ `frontend/src/components/ArtistsPage.jsx`
- ✅ `frontend/src/components/TrainingsPage.jsx`

## Fichiers de test (à supprimer après vérification)

- `frontend/src/test-toast.js`
- `frontend/src/components/ToastTest.jsx`
