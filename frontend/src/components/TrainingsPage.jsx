import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ApiService from '../services/api';


const TrainingsPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchTrainings();
    // Vérifier si l'utilisateur est admin
    if (user && user.user_type === 'admin') {
      setIsAdmin(true);
    }
  }, [user]);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getTrainings();
      setTrainings(data.results || data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des trainings:', err);
      setError('Impossible de charger les trainings. Vérifiez que le serveur Django est démarré.');
      toast.error('Erreur lors du chargement des trainings');
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

  const getLevelColor = (level) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-orange-100 text-orange-800',
      'expert': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getLevelLabel = (level) => {
    const labels = {
      'beginner': 'Débutant',
      'intermediate': 'Intermédiaire',
      'advanced': 'Avancé',
      'expert': 'Expert'
    };
    return labels[level] || level;
  };

  // Fonctions d'action utilisateur
  const handleEnrollInTraining = (training) => {
    if (!user) {
      toast.error('Vous devez être connecté pour vous inscrire');
      return;
    }
    
    if (training.current_participants >= training.max_participants) {
      toast.error('Ce training est complet');
      return;
    }
    
    // TODO: Implémenter l'inscription via API
    toast('Fonctionnalité d\'inscription en cours de développement', {
      icon: 'ℹ️',
      style: {
        background: '#10B981',
        color: '#fff',
      },
    });
    console.log('Inscription au training:', training.id);
  };

  // Fonctions d'administration
  const handleAddTraining = () => {
    navigate('/admin/trainings/add');
  };

  const handleEditTraining = (trainingId) => {
    navigate(`/admin/trainings/edit/${trainingId}`);
  };

  const handleDeleteTraining = async (trainingId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce training ?')) {
      try {
        await ApiService.deleteTraining(trainingId, token);
        setTrainings(trainings.filter(t => t.id !== trainingId));
        toast.success('Training supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression du training');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des trainings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">🏋️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTrainings}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (trainings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">🏋️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucun training disponible</h2>
          <p className="text-gray-600">
            Il n'y a pas encore de trainings dans la base de données.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trainings de Bachata
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Améliorez vos compétences avec nos trainings intensifs et spécialisés
          </p>
          {isAdmin && (
            <div className="mt-6">
              <button
                onClick={handleAddTraining}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un training
              </button>
            </div>
          )}
        </div>

        {/* Grille des trainings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainings.map((training) => (
            <div
              key={training.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Image du training */}
              <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center relative">
                {training.main_image ? (
                  <img
                    src={training.main_image}
                    alt={training.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">🏋️</div>
                    <p className="text-sm opacity-90">Training</p>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(training.level)}`}>
                    {getLevelLabel(training.level)}
                  </span>
                </div>
              </div>

              {/* Contenu du training */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {training.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {training.description}
                </p>

                {/* Informations du training */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📍</span>
                    <span>{training.location}, {training.city}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📅</span>
                    <span>{formatDate(training.start_date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">⏱️</span>
                    <span>{training.duration_hours} heures</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">👥</span>
                    <span>{training.max_participants} participants max</span>
                  </div>
                </div>

                {/* Prix et bouton */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">
                    {training.is_free ? 'Gratuit' : `${training.price} ${training.currency}`}
                  </div>
                  <button 
                    onClick={() => handleEnrollInTraining(training)}
                    disabled={training.current_participants >= training.max_participants}
                    className={`font-medium py-2 px-4 rounded-lg transition-colors ${
                      training.current_participants >= training.max_participants
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {training.current_participants >= training.max_participants ? 'Complet' : 'S\'inscrire'}
                  </button>
                </div>

                {/* Boutons admin */}
                {isAdmin && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTraining(training.id);
                      }}
                      className="flex-1 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTraining(training.id);
                      }}
                      className="flex-1 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bouton de rafraîchissement */}
        <div className="text-center mt-12">
          <button
            onClick={fetchTrainings}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Actualiser la liste
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingsPage;










