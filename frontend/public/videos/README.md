# 🎥 Dossier des vidéos

## 📋 Vidéos à ajouter

### 1. `paris-drone.mp4` - Vidéo principale de Paris en drone
- **Résolution recommandée** : 1920x1080 (Full HD)
- **Durée** : 10-30 secondes (boucle)
- **Format** : MP4 avec codec H.264
- **Taille maximale** : 20MB
- **Contenu** : Vues aériennes de Paris (Tour Eiffel, Seine, monuments)

### 2. `bachata-dance.mp4` - Vidéo de danse
- **Résolution recommandée** : 1920x1080
- **Durée** : 15-45 secondes
- **Format** : MP4
- **Contenu** : Couples dansant la bachata

### 3. `festival-bachata.mp4` - Vidéo de festival
- **Résolution recommandée** : 1920x1080
- **Durée** : 20-60 secondes
- **Format** : MP4
- **Contenu** : Ambiance de festival, performances

## 🔗 Sources de vidéos gratuites

### Pixabay
- [Vidéos de Paris](https://pixabay.com/videos/search/paris/)
- [Vidéos de danse](https://pixabay.com/videos/search/dance/)
- **Licence** : Gratuite pour usage commercial

### Pexels
- [Vidéos de Paris](https://www.pexels.com/search/videos/paris/)
- [Vidéos de danse](https://www.pexels.com/search/videos/dance/)
- **Licence** : Gratuite pour usage commercial

### Unsplash
- [Vidéos de Paris](https://unsplash.com/s/photos/paris)
- **Note** : Principalement des photos, quelques vidéos

## 📱 Optimisation pour mobile

### Compression recommandée
```bash
# Utiliser FFmpeg pour optimiser
ffmpeg -i input.mp4 -vf "scale=1920:1080" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
```

### Paramètres optimaux
- **Codec vidéo** : H.264
- **Codec audio** : AAC
- **Bitrate vidéo** : 2-5 Mbps
- **Bitrate audio** : 128 kbps
- **FPS** : 24-30

## 🎯 Utilisation dans le code

```jsx
// Dans votre composant
import VideoBackground from './VideoBackground';

<VideoBackground 
  videoKey="parisDrone"
  overlayOpacity={70}
>
  {/* Votre contenu */}
</VideoBackground>
```

## ⚠️ Important

- **Toujours vérifier les licences** des vidéos utilisées
- **Optimiser la taille** pour de meilleures performances
- **Tester sur mobile** pour s'assurer de la compatibilité
- **Prévoir des fallbacks** (images) en cas d'échec de chargement
























