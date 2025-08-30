import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin, 
  Users, 
  Star,
  Eye
} from 'lucide-react';

const FestivalsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [festivalToDelete, setFestivalToDelete] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('FestivalsPage mounted, festivals state:', festivals); // Debug log
    fetchFestivals();
    // Vérifier si l'utilisateur est admin
    if (user && user.user_type === 'admin') {
      setIsAdmin(true);
    }
  }, [user]);

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      console.log('Fetching festivals...'); // Debug log
      const response = await fetch('http://localhost:8000/api/festivals/festivals/');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      // S'assurer que festivals est toujours un tableau
      if (Array.isArray(data)) {
        console.log('Data is array, setting festivals:', data); // Debug log
        setFestivals(data);
      } else if (data.results && Array.isArray(data.results)) {
        console.log('Data has results array, setting festivals:', data.results); // Debug log
        setFestivals(data.results);
      } else if (data.festivals && Array.isArray(data.festivals)) {
        console.log('Data has festivals array, setting festivals:', data.festivals); // Debug log
        setFestivals(data.festivals);
      } else {
        console.warn('Format de données inattendu:', data);
        setFestivals([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des festivals:', err);
      setError('Impossible de charger les festivals.');
      setFestivals([]); // S'assurer que festivals est un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (festivalId) => {
    navigate(`/festivals/${festivalId}`);
  };

  // Fonctions d'administration
  const handleAddFestival = () => {
    navigate('/admin/festivals/add');
  };

  const handleEditFestival = (festivalId) => {
    navigate(`/admin/festivals/edit/${festivalId}`);
  };

  const handleDeleteFestival = (festival) => {
    setFestivalToDelete(festival);
    setShowDeleteModal(true);
  };

  const confirmDeleteFestival = async () => {
    if (!festivalToDelete) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/festivals/festivals/${festivalToDelete.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        // Supprimer le festival de la liste locale
        setFestivals(festivals.filter(f => f.id !== festivalToDelete.id));
        setShowDeleteModal(false);
        setFestivalToDelete(null);
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du festival');
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
          <p className="text-gray-600">Chargement des festivals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Festivals de Bachata</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les meilleurs festivals de bachata en France et à l'étranger. 
            Inscrivez-vous et vivez une expérience inoubliable !
          </p>
          
          {/* Bouton d'ajout pour les admins */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <button
                onClick={handleAddFestival}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un festival
              </button>
            </motion.div>
          )}
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher un festival..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">Toutes les villes</option>
              <option value="Paris">Paris</option>
              <option value="Lyon">Lyon</option>
              <option value="Marseille">Marseille</option>
              <option value="Bordeaux">Bordeaux</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">Tous les statuts</option>
              <option value="upcoming">À venir</option>
              <option value="ongoing">En cours</option>
              <option value="completed">Terminés</option>
            </select>
          </div>
        </div>

        {/* Liste des festivals */}
        {!Array.isArray(festivals) || festivals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucun festival trouvé</h2>
            <p className="text-gray-600">Il n'y a pas encore de festivals disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {festivals.map((festival) => (
              <div key={festival.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Image du festival */}
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  {festival.main_image ? (
                    <img
                      src={festival.main_image}
                      alt={festival.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">🎭</div>
                      <p className="text-lg opacity-90">Festival</p>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-6">
                  {/* En-tête avec statut */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {festival.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(festival.status)}`}>
                      {getStatusLabel(festival.status)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {festival.short_description || festival.description}
                  </p>

                  {/* Informations clés */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📍</span>
                      <span>{festival.city}, {festival.country}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📅</span>
                      <span>{formatDate(festival.start_date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">⏱️</span>
                      <span>{festival.duration_days || 1} jour(s)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">👥</span>
                      <span>{festival.current_participants}/{festival.max_participants} participants</span>
                    </div>
                  </div>

                  {/* Prix et bouton */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-purple-600">
                      {formatPrice(festival.base_price, festival.currency, festival.is_free)}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(festival.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir détails
                      </button>
                      
                      {/* Boutons d'administration */}
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleEditFestival(festival.id)}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFestival(festival)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer le festival "{festivalToDelete?.title}" ? 
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteFestival}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FestivalsPage;







