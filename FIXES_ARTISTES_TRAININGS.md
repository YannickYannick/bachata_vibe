# Corrections - Artistes et Trainings

## Problèmes identifiés et corrigés

### 1. Configuration API (✅ CORRIGÉ)
**Problème**: Le frontend était configuré pour toujours utiliser l'API de production même en local.

**Fichier**: `frontend/src/config/api.js`
- Changé `FORCE_PRODUCTION_API = true` → `FORCE_PRODUCTION_API = false`
- Maintenant le frontend utilise `http://127.0.0.1:8000/api` en local

### 2. Serializers Backend (✅ CORRIGÉ)

#### TrainingSerializer
**Problème**: Référençait des champs inexistants dans le modèle.

**Fichier**: `trainings/serializers.py`
- ❌ Retiré : `schedule`, `country`, `video_url`, `curriculum`
- ✅ Ajouté : `duration_hours` (calculé depuis `duration_minutes`)
- ✅ Ajouté : `level` (alias pour `difficulty`)
- ✅ Ajouté : `content` (existe dans le modèle)

#### ArtistProfileSerializer
**Problème**: Manquait des champs attendus par le frontend.

**Fichier**: `artists/serializers.py`
- ✅ Ajouté : `primary_specialty` (première spécialité de la liste)
- ✅ Ajouté : `level` (calculé depuis l'expérience)
- ✅ Ajouté : `profile_picture` (alias pour `profile_image`)
- ✅ Ajouté : `country` (extrait de `base_location`)
- ✅ Ajouté : `city` (extrait de `base_location`)
- ✅ Ajouté : `years_experience` (alias pour `teaching_experience`)
- ✅ Ajouté : `awards_count` (compte le nombre d'awards)
- ✅ Ajouté : `courses_count` (placeholder à 0)

### 3. Service API Frontend (✅ CORRIGÉ)

**Fichier**: `frontend/src/services/api.js`
- ✅ Ajouté : `deleteArtist(id, token)`
- ✅ Ajouté : `deleteTraining(id, token)`
- ✅ Ajouté : `deleteCompetition(id, token)` (bonus)

## Instructions pour tester

### 1. Redémarrer le serveur Django
```bash
# Arrêter le serveur actuel (Ctrl+C)
# Puis redémarrer
python manage.py runserver
```

### 2. Redémarrer le serveur React (si nécessaire)
```bash
# Le serveur devrait se recharger automatiquement
# Si ce n'est pas le cas, redémarrez-le :
cd frontend
npm start
```

### 3. Vérifier qu'il y a des données

#### Pour voir les artistes :
Les artistes doivent avoir `is_verified=True` dans la base de données.

```python
# Dans le shell Django
python manage.py shell
from artists.models import ArtistProfile
ArtistProfile.objects.all().update(is_verified=True)
```

#### Pour voir les trainings :
Les trainings doivent avoir `status='approved'`.

```python
# Dans le shell Django
python manage.py shell
from trainings.models import Training
Training.objects.all().update(status='approved')
```

### 4. Tester les pages
- http://127.0.0.1:3000/artists
- http://127.0.0.1:3000/trainings
- http://127.0.0.1:3000/competitions

### 5. Créer des données de test (si base vide)

#### Via l'admin Django :
1. Aller sur http://127.0.0.1:8000/admin/
2. Créer des artistes dans "Artist Profiles"
3. Créer des trainings dans "Trainings"
4. N'oubliez pas de marquer :
   - Artistes : `is_verified = True`
   - Trainings : `status = 'approved'`

## Points importants

### Format de base_location pour les artistes
Pour que `country` et `city` soient correctement extraits, utilisez le format :
```
Ville, Pays
```
Exemples :
- "Paris, France"
- "Barcelona, Spain"
- "New York, USA"

### Statuts des trainings
Seuls les trainings avec `status='approved'` sont affichés aux utilisateurs.
Les autres statuts disponibles :
- `draft` : Brouillon
- `pending` : En attente de validation
- `rejected` : Rejeté
- `cancelled` : Annulé
- `ongoing` : En cours
- `completed` : Terminé

### Vérification des artistes
Seuls les artistes avec `is_verified=True` sont affichés (en production).
En développement, tous les artistes sont affichés.

## Problème production restant

L'erreur sur `https://bachatavibe.com/admin/trainings/training/add/` est due au fait que
le fichier `trainings/admin.py` sur le serveur de production n'est pas à jour.

**Solution** : Déployer le code corrigé sur la production :
```bash
git add .
git commit -m "Fix trainings and artists serializers and API configuration"
git push origin main
python deploy_production.py
```

## Debug

Si les pages restent vides après ces corrections :

1. **Ouvrir la console du navigateur** (F12) et chercher les erreurs
2. **Vérifier que le serveur Django répond** :
   ```bash
   curl http://127.0.0.1:8000/api/artists/artists/
   curl http://127.0.0.1:8000/api/trainings/trainings/
   ```
3. **Vérifier les logs Django** dans le terminal où tourne le serveur

