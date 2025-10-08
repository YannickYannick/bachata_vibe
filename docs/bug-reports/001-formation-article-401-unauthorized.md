# Bug Report #001: FormationArticle 401 Unauthorized

## 📅 Date
2025-10-07

## 🚨 Erreur
```
Erreur lors de la sauvegarde: Erreur lors de la sauvegarde de l'article
WARNING 2025-10-07 23:09:11,528 log 4480 19388 Unauthorized: /api/formations/articles/ (401 Unauthorized)
```

## 🔍 Diagnostic du problème
1. **Cause principale** : Permissions incorrectes dans `formations/views.py`
   - `FormationArticleViewSet` utilisait `permissions.AllowAny`
   - Mais le formulaire tentait de créer/modifier des articles sans authentification appropriée

2. **Cause secondaire** : Structure de données incorrecte
   - Le frontend envoyait `category` au lieu de `category_id`
   - Mismatch entre les champs attendus par le sérialiseur backend

3. **Impact** : Impossible de sauvegarder les articles de formation

## 🔧 Solution appliquée

### 1. Correction des permissions (formations/views.py)
```python
# AVANT
permission_classes = [permissions.AllowAny]

# APRÈS
permission_classes = [permissions.IsAuthenticatedOrReadOnly]
```

### 2. Amélioration du queryset
```python
def get_queryset(self):
    if self.request.user.is_authenticated:
        if self.request.user.is_staff:
            return FormationArticle.objects.all()
        else:
            return FormationArticle.objects.filter(
                Q(status='published') | 
                Q(author=self.request.user, status='draft')
            )
    return FormationArticle.objects.filter(status='published')
```

### 3. Création d'un sérialiseur dédié (formations/serializers.py)
```python
class FormationArticleCreateUpdateSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = FormationArticle
        fields = [..., 'category_id', ...]
    
    def create(self, validated_data):
        category_id = validated_data.pop('category_id')
        validated_data['category'] = get_object_or_404(FormationCategory, id=category_id)
        return super().create(validated_data)
```

### 4. Correction du frontend (FormationAdminForm.jsx)
```javascript
// AVANT
const articleData = {
  category: formData.category, // Incorrect
  // ...
};

// APRÈS
const articleData = {
  category_id: formData.category_id, // Correct
  // ...
};
```

## ✅ Résultat
- ✅ Articles de formation sauvegardables
- ✅ Permissions appropriées pour lecture/écriture
- ✅ Structure de données cohérente frontend/backend
- ✅ Gestion des brouillons pour les utilisateurs authentifiés

## 📝 Fichiers modifiés
- `formations/views.py`
- `formations/serializers.py`
- `frontend/src/components/admin/FormationAdminForm.jsx`

## 🎯 Leçon apprise
- Toujours vérifier les permissions DRF pour les opérations CRUD
- S'assurer de la cohérence entre les champs frontend et backend
- Utiliser des sérialiseurs dédiés pour les opérations de création/modification
