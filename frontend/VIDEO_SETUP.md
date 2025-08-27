# 🎥 Guide d'installation des vidéos

## 📁 Structure des dossiers

```
frontend/
├── public/
│   └── videos/           # Dossier pour les vidéos locales
│       ├── paris-drone.mp4
│       ├── bachata-dance.mp4
│       └── festival-bachata.mp4
├── src/
│   ├── config/
│   │   └── videos.js     # Configuration des vidéos
│   └── components/
│       └── VideoBackground.jsx  # Composant vidéo réutilisable
```

## 🚀 Ajout d'une nouvelle vidéo

### 1. Placer la vidéo dans le dossier `public/videos/`

### 2. Mettre à jour la configuration dans `src/config/videos.js`

```javascript
export const videoConfig = {
  // Exemple d'ajout d'une nouvelle vidéo
  maNouvelleVideo: {
    sources: [
      {
        src: "/videos/ma-nouvelle-video.mp4",
        type: "video/mp4",
        quality: "high"
      },
      {
        src: "https://url-de-fallback.com/video.mp4",
        type: "video/mp4",
        quality: "fallback"
      }
    ],
    poster: "https://url-de-limage-poster.jpg",
    alt: "Description de la vidéo",
    autoplay: true,
    loop: true,
    muted: true,
    playsInline: true
  }
};
```

### 3. Utiliser le composant VideoBackground

```jsx
import VideoBackground from './VideoBackground';

// Dans votre composant
<VideoBackground 
  videoKey="maNouvelleVideo"
  overlayOpacity={70}
  overlay={true}
>
  {/* Contenu à afficher par-dessus la vidéo */}
</VideoBackground>
```

## 🎯 Utilisation du composant VideoBackground

### Props disponibles

- **`videoKey`** (string, requis) : Clé de la vidéo dans la configuration
- **`className`** (string, optionnel) : Classes CSS pour la vidéo (défaut: "w-full h-full object-cover")
- **`overlay`** (boolean, optionnel) : Afficher l'overlay (défaut: true)
- **`overlayOpacity`** (number, optionnel) : Opacité de l'overlay (défaut: 70)
- **`children`** (ReactNode, optionnel) : Contenu à afficher par-dessus la vidéo

### Exemples d'utilisation

```jsx
// Vidéo simple
<VideoBackground videoKey="parisDrone" />

// Vidéo sans overlay
<VideoBackground videoKey="parisDrone" overlay={false} />

// Vidéo avec overlay personnalisé
<VideoBackground videoKey="parisDrone" overlayOpacity={50} />

// Vidéo avec contenu personnalisé
<VideoBackground videoKey="parisDrone">
  <div className="absolute inset-0 flex items-center justify-center">
    <h1 className="text-white text-4xl">Mon titre</h1>
  </div>
</VideoBackground>
```

## 🔧 Gestion des erreurs

Le composant gère automatiquement :
- ✅ **Chargement** : Affiche un spinner pendant le chargement
- ❌ **Erreurs** : Affiche un message d'erreur et l'image de secours
- 🖼️ **Fallback** : Utilise l'image poster si la vidéo échoue

## 📱 Optimisation mobile

- **`playsInline`** : Évite la lecture en plein écran sur mobile
- **`muted`** : Permet la lecture automatique sur tous les appareils
- **Responsive** : S'adapte automatiquement à toutes les tailles d'écran

## 🎬 Formats supportés

- **MP4** : Format recommandé (meilleure compatibilité)
- **WebM** : Format alternatif pour les navigateurs modernes
- **Images** : JPG, PNG, WebP pour les posters et fallbacks

## 💡 Bonnes pratiques

1. **Taille des fichiers** : Optimisez vos vidéos (max 10-20MB)
2. **Résolution** : Utilisez 1920x1080 pour un rendu optimal
3. **Compression** : Utilisez H.264 pour une compatibilité maximale
4. **Fallbacks** : Toujours prévoir une image de secours
5. **Sources multiples** : Fournissez plusieurs qualités pour la robustesse

## 🚨 Dépannage

### La vidéo ne se charge pas
- Vérifiez que le fichier existe dans `public/videos/`
- Vérifiez la configuration dans `videos.js`
- Regardez la console du navigateur pour les erreurs

### Performance lente
- Réduisez la taille du fichier vidéo
- Utilisez une compression plus agressive
- Ajoutez une vidéo de qualité inférieure en fallback

### Problèmes sur mobile
- Vérifiez que `playsInline` est activé
- Assurez-vous que la vidéo est `muted`
- Testez sur différents appareils




