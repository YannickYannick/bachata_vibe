// Configuration de l'API - Mode de déploiement
// Cette configuration permet de basculer entre le mode local et le mode en ligne

// ⚠️ FORCER L'UTILISATION DE L'API DE PRODUCTION
// Pour revenir en mode local, mettre FORCE_PRODUCTION_API à false
const FORCE_PRODUCTION_API = true;

// Fonction pour déterminer l'URL de l'API selon l'environnement
export const getApiUrl = () => {
  // Mode forcé vers l'API de production
  if (FORCE_PRODUCTION_API) {
    return 'https://bachatavibe.com/api';
  }
  
  // Vérifier si on est en production (déployé sur bachatavibe.com)
  if (window.location.hostname === 'bachatavibe.com' || window.location.hostname === 'www.bachatavibe.com') {
    return 'https://bachatavibe.com/api';
  }
  
  // Vérifier la variable d'environnement React
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Mode local - forcer l'utilisation du port 8000 pour l'API
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8000/api';
  }
  
  // Mode local par défaut - utiliser la même origine que le frontend
  return `${window.location.protocol}//${window.location.host}/api`;
};

// Fonction pour déterminer l'URL du frontend selon l'environnement
export const getFrontendUrl = () => {
  // Vérifier si on est en production
  if (window.location.hostname === 'bachatavibe.com' || window.location.hostname === 'www.bachatavibe.com') {
    return 'https://bachatavibe.com';
  }
  
  // Mode local par défaut - utiliser la même origine
  return `${window.location.protocol}//${window.location.host}`;
};

// Configuration exportée
export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  FRONTEND_URL: getFrontendUrl(),
  // Mode de déploiement détecté automatiquement
  IS_PRODUCTION: window.location.hostname === 'bachatavibe.com' || window.location.hostname === 'www.bachatavibe.com',
  // Mode de déploiement détecté automatiquement
  IS_LOCAL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
};

// Fonction utilitaire pour construire une URL complète
export const buildApiUrl = (endpoint) => {
  const baseUrl = getApiUrl();
  // S'assurer que l'endpoint commence par /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Fonction utilitaire pour construire une URL frontend complète
export const buildFrontendUrl = (path) => {
  const baseUrl = getFrontendUrl();
  // S'assurer que le path commence par /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export default API_CONFIG;





