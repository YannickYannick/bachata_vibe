import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  ArrowRight,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import ApiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const EventsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Données temporaires pour les événements (fallback si l'API échoue)
  const tempEvents = [];

  const categories = [
    { value: 'all', label: 'Tous les événements' },
    { value: 'soiree', label: 'Soirées' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'masterclass', label: 'Masterclasses' },
    { value: 'competition', label: 'Compétitions' },
    { value: 'show', label: 'Spectacles' }
  ];

    useEffect(() => {
    // Charger les événements depuis l'API Django
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getAllEvents();
        
        if (data && data.results) {
          // Gérer la pagination de l'API Django
          setEvents(data.results);
        } else if (data) {
          // Si pas de pagination, utiliser directement les données
          setEvents(data);
        } else {
          setEvents([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des événements:', err);
        setError('Erreur lors du chargement des événements');
        setLoading(false);
        // Fallback vers les données temporaires
        setEvents(tempEvents);
        setLoading(false);
      }
    };

    loadEvents();
    
    // Vérifier si l'utilisateur est admin
    if (user && user.user_type === 'admin') {
      setIsAdmin(true);
    }
  }, [user]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonctions d'administration
  const handleAddEvent = () => {
    navigate('/admin/events/add');
  };

  const handleEditEvent = (eventId) => {
    navigate(`/admin/events/edit/${eventId}`);
  };

  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/events/events/${eventToDelete.slug}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        // Supprimer l'événement de la liste locale
        setEvents(events.filter(e => e.slug !== eventToDelete.slug));
        setShowDeleteModal(false);
        setEventToDelete(null);
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'événement');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des événements...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Découvrez nos <span className="text-purple-600">Événements</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Participez à des soirées, workshops, masterclasses et compétitions pour progresser en Bachata
          </p>
          
          {/* Bouton d'ajout pour les admins */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <button
                onClick={handleAddEvent}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un événement
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filtre par catégorie */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Grille des événements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image de l'événement */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {event.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                    <Star className="w-4 h-4 inline mr-1" />
                    En vedette
                  </div>
                )}
                                   <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-purple-600">
                     {event.current_price || event.price}€
                   </div>
              </div>

              {/* Contenu de l'événement */}
              <div className="p-6">
                                 <div className="flex items-center gap-2 mb-3">
                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                     event.category?.slug === 'soirees' ? 'bg-purple-100 text-purple-700' :
                     event.category?.slug === 'workshops' ? 'bg-blue-100 text-blue-700' :
                     event.category?.slug === 'masterclasses' ? 'bg-green-100 text-green-700' :
                     event.category?.slug === 'competitions' ? 'bg-red-100 text-red-700' :
                     event.category?.slug === 'spectacles' ? 'bg-yellow-100 text-yellow-700' :
                     'bg-gray-100 text-gray-700'
                   }`}>
                     {event.category?.name || 'Événement'}
                   </span>
                 </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Informations de l'événement */}
                <div className="space-y-2 mb-4">
                                     <div className="flex items-center text-sm text-gray-500">
                     <Calendar className="w-4 h-4 mr-2" />
                     {formatDate(event.start_date)}
                   </div>
                   <div className="flex items-center text-sm text-gray-500">
                     <Clock className="w-4 h-4 mr-2" />
                     {new Date(event.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                   </div>
                   <div className="flex items-center text-sm text-gray-500">
                     <MapPin className="w-4 h-4 mr-2" />
                     {event.location}
                   </div>
                   <div className="flex items-center text-sm text-gray-500">
                     <Users className="w-4 h-4 mr-2" />
                     {event.available_spots || 0}/{event.capacity} places disponibles
                   </div>
                </div>

                {/* Bouton d'action */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/events/${event.slug}`}
                    className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center group"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir détails
                  </Link>
                  
                  {/* Boutons d'administration */}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleEditEvent(event.slug)}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event)}
                        className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Message si aucun événement trouvé */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou revenez plus tard.
            </p>
          </motion.div>
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
              Êtes-vous sûr de vouloir supprimer l'événement "{eventToDelete?.title}" ? 
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
                onClick={confirmDeleteEvent}
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

export default EventsPage;
