import React, { useState, useRef, useEffect } from 'react';
import { getAllVideoSources, getVideoConfig } from '../config/videos';

const VideoBackground = ({ 
  videoKey = "parisDrone", 
  className = "w-full h-full object-cover",
  overlay = true,
  overlayOpacity = 70,
  children,
  debug = false,
  noOverlay = false
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [videoElement, setVideoElement] = useState(null);
  const videoRef = useRef(null);
  
  // Obtenir la configuration de la vidéo
  const videoSources = getAllVideoSources(videoKey);
  const videoConfig = getVideoConfig(videoKey);
  const poster = videoConfig?.poster || "https://images.unsplash.com/photo-1502602898535-0c2d26c0469b?w=1920&h=1080&fit=crop";
  const alt = videoConfig?.alt || "Arrière-plan vidéo";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoSources.length === 0) return;

    console.log('🎬 Initialisation vidéo:', videoKey);
    console.log('📁 Sources disponibles:', videoSources);
    console.log('🎯 Source actuelle:', currentSourceIndex);

    const handleLoadedData = () => {
      console.log('✅ Vidéo chargée avec succès:', videoKey, 'Source:', currentSourceIndex);
      setIsVideoLoaded(true);
      setIsVideoError(false);
    };

    const handleError = (e) => {
      console.error('❌ Erreur vidéo source', currentSourceIndex, ':', e);
      console.error('❌ Détails erreur:', e.target.error);
      
      // Essayer la source suivante
      if (currentSourceIndex < videoSources.length - 1) {
        console.log('🔄 Tentative avec la source suivante:', currentSourceIndex + 1);
        setCurrentSourceIndex(prev => prev + 1);
      } else {
        // Toutes les sources ont échoué
        console.error('❌ Toutes les sources vidéo ont échoué');
        setIsVideoError(true);
        setIsVideoLoaded(false);
      }
    };

    const handleCanPlay = () => {
      console.log('▶️ Vidéo prête à être lue:', videoKey);
      // Forcer la lecture
      video.play().catch(e => console.log('⚠️ Impossible de lancer la lecture automatique:', e));
    };

    const handleLoadStart = () => {
      console.log('🔄 Début du chargement de la source:', currentSourceIndex);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        console.log('📊 Progression du chargement:', Math.round((video.buffered.end(0) / video.duration) * 100) + '%');
      }
    };

    const handleLoadedMetadata = () => {
      console.log('📏 Métadonnées chargées - Durée:', video.duration, 'Dimensions:', video.videoWidth, 'x', video.videoHeight);
    };

    // Ajouter tous les event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Forcer le chargement de la source actuelle
    const currentSource = videoSources[currentSourceIndex];
    if (currentSource) {
      console.log('🎯 Chargement de la source:', currentSource.src);
      video.src = currentSource.src;
      video.load(); // Forcer le chargement
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoKey, currentSourceIndex, videoSources.length]);

  // Réinitialiser l'index de source quand la vidéo change
  useEffect(() => {
    setCurrentSourceIndex(0);
    setIsVideoLoaded(false);
    setIsVideoError(false);
    console.log('🔄 Changement de vidéo:', videoKey);
  }, [videoKey]);

  // Obtenir la source actuelle
  const currentSource = videoSources[currentSourceIndex];

  return (
    <div className="relative w-full h-full">
      {/* Mode debug pour voir les informations */}
      {debug && (
        <div className="absolute top-4 left-4 z-50 bg-black/80 text-white p-4 rounded-lg text-sm">
          <div>Video Key: {videoKey}</div>
          <div>Sources: {videoSources.length}</div>
          <div>Current Source: {currentSourceIndex + 1}</div>
          <div>Loaded: {isVideoLoaded ? 'Yes' : 'No'}</div>
          <div>Error: {isVideoError ? 'Yes' : 'No'}</div>
          <div>Overlay: {overlay && !noOverlay ? 'Yes' : 'No'}</div>
          <div>Opacity: {overlayOpacity}</div>
          <div>Current Src: {currentSource?.src}</div>
        </div>
      )}
      
      {/* Vidéo en arrière-plan - AU PREMIER PLAN */}
      {currentSource && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className={className}
          poster={poster}
          style={{ 
            zIndex: 10,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            border: '3px solid red', // Test pour voir si la vidéo est là
            backgroundColor: 'black' // Fond noir pour voir la vidéo
          }}
          key={`${videoKey}-${currentSourceIndex}`}
          onLoadStart={() => console.log('🔄 onLoadStart déclenché')}
          onLoadedData={() => console.log('✅ onLoadedData déclenché')}
          onError={(e) => console.log('❌ onError déclenché:', e)}
        >
          <source 
            src={currentSource.src} 
            type={currentSource.type} 
          />
          {/* Fallback image si la vidéo ne se charge pas */}
          <img 
            src={poster} 
            alt={alt} 
            className={className}
          />
        </video>
      )}

      {/* Overlay très subtil pour améliorer la lisibilité du texte */}
      {overlay && !noOverlay && (
        <>
          {/* Overlay principal avec gradient - opacité très réduite */}
          <div className={`absolute inset-0 bg-gradient-to-r from-purple-600/${Math.min(overlayOpacity * 0.3, 15)} via-purple-500/${Math.min(overlayOpacity * 0.2, 10)} to-pink-600/${Math.min(overlayOpacity * 0.3, 15)}`} style={{ zIndex: 5 }}></div>
          {/* Effet de profondeur très subtil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" style={{ zIndex: 5 }}></div>
        </>
      )}

      {/* Indicateur de chargement - seulement si la vidéo n'est pas chargée */}
      {!isVideoLoaded && !isVideoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20" style={{ zIndex: 20 }}>
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-sm opacity-75">Chargement de la vidéo...</p>
            <p className="text-xs opacity-50 mt-2">Source {currentSourceIndex + 1}/{videoSources.length}</p>
            <p className="text-xs opacity-50 mt-1">{currentSource?.src}</p>
          </div>
        </div>
      )}

      {/* Message d'erreur si la vidéo ne se charge pas */}
      {isVideoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20" style={{ zIndex: 20 }}>
          <div className="text-white text-center">
            <div className="text-4xl mb-4">🎥</div>
            <p className="text-sm opacity-75">Vidéo non disponible</p>
            <p className="text-xs opacity-50 mt-2">Affichage de l'image de secours</p>
            <p className="text-xs opacity-50 mt-1">Erreur sur toutes les sources</p>
          </div>
        </div>
      )}

      {/* Contenu enfant */}
      {children}
    </div>
  );
};

export default VideoBackground;


