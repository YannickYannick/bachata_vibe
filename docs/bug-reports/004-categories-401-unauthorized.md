# Bug Report #004: Event Categories 401 Unauthorized

## 📅 Date
2025-10-09

## 🚨 Erreur
```
GET http://127.0.0.1:8000/api/events/categories/ 401 (Unauthorized)
Erreur API getEventCategories: Error: Erreur lors de la récupération des catégories d'événements
```

## 🔍 Diagnostic du problème
1. **Cause principale** : Permissions trop restrictives
   - `EventCategoryViewSet` utilisait les permissions par défaut de DRF
   - Permission par défaut : `IsAuthenticated` (nécessite authentification)
   - Les catégories doivent être accessibles sans authentification pour les formulaires

2. **Configuration DRF** :
   ```python
   # settings.py
   REST_FRAMEWORK = {
       'DEFAULT_PERMISSION_CLASSES': [
           'rest_framework.permissions.IsAuthenticated',  # Trop restrictif
       ],
   }
   ```

3. **Impact** : Impossible de charger les catégories dans les formulaires d'administration

## 🔧 Solution appliquée

### 1. Ajout de l'import AllowAny (events/views.py)
```python
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
```

### 2. Configuration des permissions explicites
```python
class EventCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les catégories d'événements"""
    
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    permission_classes = [AllowAny]  # Permettre l'accès sans authentification
    lookup_field = 'slug'
```

## ✅ Résultat
- ✅ Catégories d'événements accessibles sans authentification
- ✅ Formulaires d'administration fonctionnels
- ✅ Plus d'erreur 401 Unauthorized
- ✅ API retourne StatusCode: 200 avec données JSON

## 📝 Fichiers modifiés
- `events/views.py`

## 🧪 Test de validation
```bash
# Test API
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/events/categories/" -Method GET
# Résultat: StatusCode: 200, Content: JSON avec 5 catégories
```

## 🎯 Leçon apprise
- **Permissions explicites** : Toujours définir les permissions au niveau du ViewSet
- **Données de référence** : Les catégories/options doivent être accessibles sans authentification
- **Principe de moindre privilège** : Utiliser `AllowAny` pour les données publiques
- **Test systématique** : Vérifier l'accès aux endpoints critiques
