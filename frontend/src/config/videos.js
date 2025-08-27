// Configuration des vidéos pour le site
export const videoConfig = {
  // Vidéo de Paris en drone pour la page d'accueil
  parisDrone: {
    sources: [
      {
        // Essaye d'abord le chemin servi par Django (build)
        src: "/videos/paris-drone.mp4",
        type: "video/mp4",
        quality: "high"
      },
      {
        // Fallback local depuis le dossier public en dev (CRA)
        src: "/public/videos/paris-drone.mp4",
        type: "video/mp4",
        quality: "medium"
      },
      {
        // Dernier fallback externe léger
        src: "https://filesamples.com/samples/video/mp4/sample_1280x720.mp4",
        type: "video/mp4",
        quality: "fallback"
      }
    ],
    poster: "https://images.unsplash.com/photo-1502602898535-0c2d26c0469b?w=1920&h=1080&fit=crop",
    alt: "Paris vu du ciel en drone",
    autoplay: true,
    loop: true,
    muted: true,
    playsInline: true
  },
  
  // Autres vidéos pour le site
  bachataDance: {
    sources: [
      {
        src: "/videos/bachata-dance.mp4",
        type: "video/mp4"
      }
    ],
    poster: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=1920&h=1080&fit=crop",
    alt: "Danse de bachata"
  },
  
  // Vidéo de festival
  festival: {
    sources: [
      {
        src: "/videos/festival-bachata.mp4",
        type: "video/mp4"
      }
    ],
    poster: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&h=1080&fit=crop",
    alt: "Festival de bachata"
  }
};

// Fonction pour obtenir la meilleure source vidéo disponible
export const getBestVideoSource = (videoKey) => {
  const video = videoConfig[videoKey];
  if (!video) return null;
  
  // Retourner la première source disponible (la plus haute qualité)
  return video.sources[0];
};

// Fonction pour obtenir toutes les sources d'une vidéo
export const getAllVideoSources = (videoKey) => {
  const video = videoConfig[videoKey];
  if (!video) return [];
  
  return video.sources;
};

// Fonction pour obtenir la configuration complète d'une vidéo
export const getVideoConfig = (videoKey) => {
  return videoConfig[videoKey] || null;
};




