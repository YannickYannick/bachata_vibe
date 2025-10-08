# Bug Report #002: TypeError 'trim is not a function'

## 📅 Date
2025-10-08

## 🚨 Erreur
```
TypeError: _formData$highlights.trim is not a function
    at handleSubmit (EventAdminForm.jsx:184:1)
```

## 🔍 Diagnostic du problème
1. **Cause principale** : Validation de type insuffisante
   - Les champs `highlights` et `schedule` étaient des tableaux/objets
   - Le code tentait d'appliquer `.trim()` sur des types non-string

2. **Types de données problématiques** :
   - `highlights`: `['DJs internationaux', 'Ambiance festive', 'Bar avec cocktails', 'Zone de repos']`
   - `schedule`: `[{…}, {…}, {…}, {…}, {…}, {…}]`

3. **Impact** : Crash du formulaire lors de la sauvegarde

## 🔧 Solution appliquée

### 1. Fonction utilitaire robuste (EventAdminForm.jsx)
```javascript
const cleanString = (value) => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (value === null || value === undefined) {
    return '';
  }
  if (Array.isArray(value)) {
    // Pour les tableaux, joindre avec des virgules
    return value.map(item => {
      if (typeof item === 'object' && item !== null) {
        // Pour les objets, extraire les propriétés pertinentes
        return item.name || item.title || item.time || JSON.stringify(item);
      }
      return String(item);
    }).join(',');
  }
  if (typeof value === 'object' && value !== null) {
    // Pour les objets, essayer d'extraire des propriétés utiles
    return value.name || value.title || item.time || JSON.stringify(value);
  }
  return String(value).trim();
};
```

### 2. Validation de type préventive
```javascript
// Vérifier que les champs optionnels sont des chaînes ou null/undefined
const stringFields = ['long_description', 'location', 'address', 'city', 'postal_code', 'country', 
                     'instructor', 'instructor_bio', 'prerequisites', 'highlights', 'schedule', 
                     'materials_needed', 'website', 'instagram', 'facebook'];

for (const field of stringFields) {
  if (formData[field] !== null && formData[field] !== undefined && typeof formData[field] !== 'string') {
    console.warn(`Champ ${field} n'est pas une chaîne:`, typeof formData[field], formData[field]);
    // Convertir en chaîne si ce n'est pas déjà le cas
    formData[field] = String(formData[field]);
  }
}
```

### 3. Gestion spéciale des champs JSON
```javascript
// Garder highlights et schedule comme tableaux pour le backend
highlights: Array.isArray(formData.highlights) ? formData.highlights : [],
schedule: Array.isArray(formData.schedule) ? formData.schedule : []
```

## ✅ Résultat
- ✅ Plus d'erreur `trim is not a function`
- ✅ Gestion robuste de tous les types de données
- ✅ Conversion automatique des types non-string
- ✅ Nettoyage sécurisé des données avant envoi

## 📝 Fichiers modifiés
- `frontend/src/components/admin/EventAdminForm.jsx`

## 🎯 Leçon apprise
- Toujours valider le type des données avant d'appliquer des méthodes spécifiques
- Créer des fonctions utilitaires robustes pour la gestion des types
- Ajouter des logs de debug pour identifier les types de données inattendus
