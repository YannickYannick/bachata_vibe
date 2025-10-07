import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import ApiService from '../services/api';


const FestivalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchFestivalDetails();
  }, [id]);

  const fetchFestivalDetails = async () => {
    if (!id) {
      setError('ID du festival manquant.');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching festival with ID:', id);
      const data = await ApiService.getFestival(id);
      console.log('Festival data received:', data);
      setFestival(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération du festival:', err);
      setError(err.message || 'Impossible de charger les détails du festival.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated || !token) {
      toast.error('Vous devez être connecté pour vous inscrire');
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await ApiService.enrollInFestival(id, token);
      toast.success('Inscription réussie !');
      navigate('/my-festivals');
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      toast.error('Erreur lors de l\'inscription');
    } finally {
      setEnrolling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'À définir';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price, currency, isFree) => {
    if (isFree) return 'Gratuit';
    return `${price} ${currency || '€'}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'approved': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'ongoing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'approved': 'Approuvé',
      'pending': 'En attente',
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
          <p className="text-gray-600">Chargement du festival...</p>
        </div>
      </div>
    );
  }

  if (error || !festival) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error || 'Festival introuvable'}</p>
          <button
            onClick={() => navigate('/festivals')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Retour aux festivals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/festivals')}
          className="mb-6 flex items-center text-purple-600 hover:text-purple-800 transition-colors"
        >
          ← Retour aux festivals
        </button>

        {/* En-tête du festival */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Image du festival */}
          <div className="h-64 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
            {festival.main_image ? (
              <img
                src={festival.main_image}
                alt={festival.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white text-center">
                <div className="text-6xl mb-4">🎭</div>
                <p className="text-xl opacity-90">Festival</p>
              </div>
            )}
          </div>

          {/* Informations principales */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{festival.title}</h1>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(festival.status)}`}>
                {getStatusLabel(festival.status)}
              </span>
            </div>

            <p className="text-gray-600 text-lg mb-6">
              {festival.description}
            </p>

            {/* Statistiques du festival */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{festival.duration_days || 1}</div>
                <div className="text-sm text-gray-500">Jours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{festival.current_participants || 0}/{festival.max_participants || 0}</div>
                <div className="text-sm text-gray-500">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{festival.base_price || 0}</div>
                <div className="text-sm text-gray-500">{festival.currency || '€'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{festival.start_date ? formatDate(festival.start_date).split(' ')[0] : 'N/A'}</div>
                <div className="text-sm text-gray-500">Date de début</div>
              </div>
            </div>

            {/* Bouton d'inscription */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                    enrolling
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {enrolling ? 'Inscription en cours...' : 'S\'inscrire au festival'}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  Se connecter pour s'inscrire
                </button>
              )}
              
              {festival.is_free ? (
                <span className="text-green-600 font-medium text-center sm:text-left">
                  ✓ Festival gratuit
                </span>
              ) : (
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatPrice(festival.base_price, festival.currency, festival.is_free)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Détails supplémentaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations pratiques */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations pratiques</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="mr-3 text-gray-500">📍</span>
                <span>{festival.location || 'Non spécifié'}, {festival.city || 'Non spécifié'}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-gray-500">📅</span>
                <span>Début: {formatDate(festival.start_date)}</span>
              </div>
              {festival.end_date && (
                <div className="flex items-center">
                  <span className="mr-3 text-gray-500">📅</span>
                  <span>Fin: {formatDate(festival.end_date)}</span>
                </div>
              )}
              <div className="flex items-center">
                <span className="mr-3 text-gray-500">⏱️</span>
                <span>Durée: {festival.duration_days || 1} jour(s)</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-gray-500">📝</span>
                <span>Inscription jusqu'au: {formatDate(festival.registration_deadline)}</span>
              </div>
            </div>
          </div>

          {/* Programmation */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Programmation</h2>
            <div className="space-y-3">
              {festival.workshops && festival.workshops.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Ateliers:</h3>
                  <p className="text-gray-600 text-sm">{festival.workshops.length} atelier(s) prévu(s)</p>
                </div>
              )}
              {festival.performances && festival.performances.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Spectacles:</h3>
                  <p className="text-gray-600 text-sm">{festival.performances.length} spectacle(s) prévu(s)</p>
                </div>
              )}
              {festival.social_dances && festival.social_dances.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Danses sociales:</h3>
                  <p className="text-gray-600 text-sm">{festival.social_dances.length} session(s) prévue(s)</p>
                </div>
              )}
              {(!festival.workshops || festival.workshops.length === 0) && 
               (!festival.performances || festival.performances.length === 0) && 
               (!festival.social_dances || festival.social_dances.length === 0) && (
                <p className="text-gray-500 text-sm">Programme en cours de finalisation</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalDetailPage;
