import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/artists/artists/');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setArtists(data.results || data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des artistes:', err);
      setError('Impossible de charger les artistes. Vérifiez que le serveur Django est démarré.');
      toast.error('Erreur lors du chargement des artistes');
    } finally {
      setLoading(false);
    }
  };

  const getSpecialtyColor = (specialty) => {
    const colors = {
      'bachata': 'bg-red-100 text-red-800',
      'salsa': 'bg-blue-100 text-blue-800',
      'kizomba': 'bg-purple-100 text-purple-800',
      'merengue': 'bg-green-100 text-green-800',
      'cha-cha': 'bg-yellow-100 text-yellow-800'
    };
    return colors[specialty] || 'bg-gray-100 text-gray-800';
  };

  const getSpecialtyLabel = (specialty) => {
    const labels = {
      'bachata': 'Bachata',
      'salsa': 'Salsa',
      'kizomba': 'Kizomba',
      'merengue': 'Merengue',
      'cha-cha': 'Cha-cha'
    };
    return labels[specialty] || specialty;
  };

  const getLevelColor = (level) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-orange-100 text-orange-800',
      'professional': 'bg-red-100 text-red-800',
      'master': 'bg-purple-100 text-purple-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getLevelLabel = (level) => {
    const labels = {
      'beginner': 'Débutant',
      'intermediate': 'Intermédiaire',
      'advanced': 'Avancé',
      'professional': 'Professionnel',
      'master': 'Maître'
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des artistes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">👨‍🎨</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchArtists}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">👨‍🎨</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucun artiste disponible</h2>
          <p className="text-gray-600">
            Il n'y a pas encore d'artistes dans la base de données.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Artistes de Bachata
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les meilleurs artistes et instructeurs de bachata
          </p>
        </div>

        {/* Grille des artistes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Photo de l'artiste */}
              <div className="h-64 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center relative">
                {artist.profile_picture ? (
                  <img
                    src={artist.profile_picture}
                    alt={artist.artist_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-center">
                    <div className="text-6xl mb-2">👨‍🎨</div>
                    <p className="text-sm opacity-90">Artiste</p>
                  </div>
                )}
                <div className="absolute top-3 right-3 space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSpecialtyColor(artist.primary_specialty)}`}>
                    {getSpecialtyLabel(artist.primary_specialty)}
                  </span>
                  <div className="block">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(artist.level)}`}>
                      {getLevelLabel(artist.level)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informations de l'artiste */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {artist.artist_name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {artist.bio}
                </p>

                {/* Détails de l'artiste */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">🌍</span>
                    <span>{artist.country}, {artist.city}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">🎓</span>
                    <span>{artist.years_experience} ans d'expérience</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">🏆</span>
                    <span>{artist.awards_count || 0} récompenses</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📚</span>
                    <span>{artist.courses_count || 0} cours créés</span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Voir profil
                  </button>
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Contacter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton de rafraîchissement */}
        <div className="text-center mt-12">
          <button
            onClick={fetchArtists}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Actualiser la liste
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistsPage;









