import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CompetitionsPage = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/competitions/competitions/');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setCompetitions(data.results || data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des compétitions:', err);
      setError('Impossible de charger les compétitions. Vérifiez que le serveur Django est démarré.');
      toast.error('Erreur lors du chargement des compétitions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'solo': 'bg-blue-100 text-blue-800',
      'couple': 'bg-pink-100 text-pink-800',
      'group': 'bg-purple-100 text-purple-800',
      'professional': 'bg-red-100 text-red-800',
      'amateur': 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'solo': 'Solo',
      'couple': 'Couple',
      'group': 'Groupe',
      'professional': 'Professionnel',
      'amateur': 'Amateur'
    };
    return labels[category] || category;
  };

  const getStatusColor = (status) => {
    const colors = {
      'registration_open': 'bg-green-100 text-green-800',
      'registration_closed': 'bg-yellow-100 text-yellow-800',
      'ongoing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'registration_open': 'Inscriptions ouvertes',
      'registration_closed': 'Inscriptions fermées',
      'ongoing': 'En cours',
      'completed': 'Terminée',
      'cancelled': 'Annulée'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des compétitions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">🏆</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCompetitions}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (competitions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">🏆</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucune compétition disponible</h2>
          <p className="text-gray-600">
            Il n'y a pas encore de compétitions dans la base de données.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compétitions de Bachata
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Participez aux meilleures compétitions et démontrez votre talent
          </p>
        </div>

        {/* Grille des compétitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {competitions.map((competition) => (
            <div
              key={competition.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Image de la compétition */}
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center relative">
                {competition.main_image ? (
                  <img
                    src={competition.main_image}
                    alt={competition.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">🏆</div>
                    <p className="text-sm opacity-90">Compétition</p>
                  </div>
                )}
                <div className="absolute top-3 right-3 space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(competition.category)}`}>
                    {getCategoryLabel(competition.category)}
                  </span>
                  <div className="block">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(competition.status)}`}>
                      {getStatusLabel(competition.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenu de la compétition */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {competition.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {competition.description}
                </p>

                {/* Informations de la compétition */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📍</span>
                    <span>{competition.location}, {competition.city}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📅</span>
                    <span>{formatDate(competition.start_date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">💰</span>
                    <span>Prix: {competition.prize_pool} {competition.currency}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">👥</span>
                    <span>{competition.max_participants} participants max</span>
                  </div>
                </div>

                {/* Bouton d'inscription */}
                <button 
                  className={`w-full font-medium py-2 px-4 rounded-lg transition-colors ${
                    competition.status === 'registration_open' 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                  disabled={competition.status !== 'registration_open'}
                >
                  {competition.status === 'registration_open' ? 'S\'inscrire' : 'Inscriptions fermées'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton de rafraîchissement */}
        <div className="text-center mt-12">
          <button
            onClick={fetchCompetitions}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Actualiser la liste
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompetitionsPage;


