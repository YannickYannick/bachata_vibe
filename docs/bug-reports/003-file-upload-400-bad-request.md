# Bug Report #003: File Upload 400 Bad Request

## 📅 Date
2025-10-08

## 🚨 Erreur
```
PUT http://127.0.0.1:3000/api/events/events/soiree-bachata-sensual/ 400 (Bad Request)
Erreur serveur: {main_image: Array(1)}
"main_image: La donnée soumise n'est pas un fichier. Vérifiez le type d'encodage du formulaire."
```

## 🔍 Diagnostic du problème
1. **Cause principale** : Mauvais format d'envoi des fichiers
   - Envoi d'un objet `File` via JSON (`Content-Type: application/json`)
   - Django REST Framework ne peut pas traiter les fichiers en JSON

2. **Problèmes identifiés** :
   - `main_image` était un objet `File` mais envoyé via `JSON.stringify()`
   - URL API incorrecte : port 3000 au lieu de 8000
   - Sérialisation incorrecte des champs JSON

3. **Impact** : Impossible de sauvegarder les événements avec des images

## 🔧 Solution appliquée

### 1. Correction de l'URL API (frontend/src/config/api.js)
```javascript
// Mode local - forcer l'utilisation du port 8000 pour l'API
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  return 'http://127.0.0.1:8000/api';
}
```

### 2. Gestion intelligente des fichiers (frontend/src/services/api.js)
```javascript
// Vérifier s'il y a un fichier à uploader
const hasFile = eventData.main_image && eventData.main_image instanceof File;

let headers, body;

if (hasFile) {
  // Utiliser FormData pour les fichiers
  const formData = new FormData();
  
  // Ajouter tous les champs au FormData
  Object.keys(eventData).forEach(key => {
    if (eventData[key] !== null && eventData[key] !== undefined) {
      if (key === 'main_image' && eventData[key] instanceof File) {
        formData.append(key, eventData[key]); // Fichier
      } else if (key === 'highlights' || key === 'schedule') {
        formData.append(key, JSON.stringify(eventData[key])); // JSON en chaîne
      } else {
        formData.append(key, eventData[key]); // Valeur normale
      }
    }
  });
  
  headers = { 'Authorization': `Token ${token}` }; // Pas de Content-Type
  body = formData;
} else {
  // Utiliser JSON pour les données sans fichier
  headers = { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` };
  body = JSON.stringify(eventData);
}
```

### 3. Gestion conditionnelle du main_image
```javascript
// Ne pas inclure main_image si c'est vide ou null
if (cleanFormData.main_image && cleanFormData.main_image !== '') {
  eventData.main_image = cleanFormData.main_image;
}
```

## ✅ Résultat
- ✅ Upload de fichiers fonctionnel avec FormData
- ✅ URL API correcte (port 8000)
- ✅ Sérialisation JSON appropriée pour FormData
- ✅ Gestion intelligente fichier/JSON selon le contexte

## 📝 Fichiers modifiés
- `frontend/src/config/api.js`
- `frontend/src/services/api.js`
- `frontend/src/components/admin/EventAdminForm.jsx`

## 🎯 Leçon apprise
- **Fichiers** : Toujours utiliser `FormData` avec `multipart/form-data`
- **Données simples** : Utiliser `JSON` avec `application/json`
- **Détection automatique** : Vérifier le type de contenu à envoyer
- **URLs** : S'assurer de la cohérence entre frontend et backend
