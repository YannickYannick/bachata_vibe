import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const FestivalsPage = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/festivals/festivals/');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setFestivals(data.results || data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des festivals:', err);
      setError('Impossible de charger les festivals. Vérifiez que le serveur Django est démarré.');
      toast.error('Erreur lors du chargement des festivals');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'upcoming': 'bg-green-100 text-green-800',
      'ongoing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'upcoming': 'À venir',
      'ongoing': 'En cours',
      'completed': 'Terminé',
      'cancelled': 'Annulé'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des festivals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">🎪</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchFestivals}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (festivals.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">🎪</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucun festival disponible</h2>
          <p className="text-gray-600">
            Il n'y a pas encore de festivals dans la base de données.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Festivals de Bachata
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les plus beaux festivals de bachata en France et en Europe
          </p>
        </div>

        {/* Grille des festivals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {festivals.map((festival) => (
            <div
              key={festival.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Image du festival */}
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center relative">
                {festival.main_image ? (
                  <img
                    src={festival.main_image}
                    alt={festival.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">🎪</div>
                    <p className="text-sm opacity-90">Festival</p>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(festival.status)}`}>
                    {getStatusLabel(festival.status)}
                  </span>
                </div>
              </div>

              {/* Contenu du festival */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {festival.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {festival.description}
                </p>

                {/* Informations du festival */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📍</span>
                    <span>{festival.location}, {festival.city}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📅</span>
                    <span>{formatDate(festival.start_date)} - {formatDate(festival.end_date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">💰</span>
                    <span>{festival.price} {festival.currency}</span>
                  </div>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Voir détails
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton de rafraîchissement */}
        <div className="text-center mt-12">
          <button
            onClick={fetchFestivals}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Actualiser la liste
          </button>
        </div>
      </div>
    </div>
  );
};

export default FestivalsPage;


