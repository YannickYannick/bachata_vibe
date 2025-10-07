import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MyEventsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Données temporaires pour les événements (à remplacer par l'API Django)
  const tempEnrolledEvents = [
    {
      id: 1,
      title: "Soirée Bachata Sensual",
      description: "Une soirée exceptionnelle dédiée à la Bachata Sensual avec des DJs internationaux.",
      date: "2025-09-15",
      time: "21:00",
      location: "Le Petit Journal, Paris",
      category: "soiree",
      price: "15€",
      capacity: 150,
      attendees: 89,
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
      featured: true,
      enrollmentDate: "2025-08-20",
      status: "confirmed"
    },
    {
      id: 3,
      title: "Compétition Bachata Amateur",
      description: "Participez à notre compétition annuelle de Bachata pour les danseurs amateurs.",
      date: "2025-10-05",
      time: "19:00",
      location: "Palais des Congrès, Marseille",
      category: "competition",
      price: "25€",
      capacity: 200,
      attendees: 156,
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
      featured: true,
      enrollmentDate: "2025-08-15",
      status: "confirmed"
    }
  ];

  const tempCreatedEvents = [
    {
      id: 5,
      title: "Workshop Bachata Sensual Avancé",
      description: "Perfectionnez votre technique de Bachata Sensual avec des exercices avancés.",
      date: "2025-11-20",
      time: "14:00",
      location: "Studio Dance, Paris",
      category: "workshop",
      price: "60€",
      capacity: 25,
      attendees: 18,
      image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400&h=300&fit=crop",
      featured: false,
      status: "active"
    }
  ];

  useEffect(() => {
    const loadMyEvents = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Ici, vous pourrez remplacer par des appels API réels
        // const [enrolledResponse, createdResponse] = await Promise.all([
        //   fetch('/api/events/my_events/', {
        //     headers: {
        //       'Authorization': `Token ${localStorage.getItem('auth_token')}`
        //     }
        //   }),
        //   fetch('/api/events/created_events/', {
        //     headers: {
        //       'Authorization': `Token ${localStorage.getItem('auth_token')}`
        //     }
        //   })
        // ]);
        
        // Pour l'instant, utilisons les données temporaires
        setTimeout(() => {
          setEnrolledEvents(tempEnrolledEvents);
          setCreatedEvents(tempCreatedEvents);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Erreur lors du chargement de vos événements');
        setLoading(false);
      }
    };

    loadMyEvents();
  }, [isAuthenticated]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      case 'active':
        return 'Actif';
      default:
        return 'Inconnu';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h2>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour voir vos événements.
            </p>
            <div className="space-x-4">
              <Link
                to="/login"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de vos événements...</p>
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
            Mes <span className="text-purple-600">Événements</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gérez vos inscriptions et vos événements créés
          </p>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/events"
              className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              Découvrir de nouveaux événements
            </Link>
            <Link
              to="/profile"
              className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-center"
            >
              Retour au profil
            </Link>
          </div>
        </motion.div>

        {/* Événements auxquels vous êtes inscrit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Événements auxquels vous êtes inscrit ({enrolledEvents.length})
            </h2>
          </div>

          {enrolledEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Image de l'événement */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image || event.main_image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-purple-600">
                      {event.price}
                    </div>
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(event.status)}`}>
                      {getStatusLabel(event.status)}
                    </div>
                  </div>

                  {/* Contenu de l'événement */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.category === 'soiree' ? 'bg-purple-100 text-purple-700' :
                        event.category === 'workshop' ? 'bg-blue-100 text-blue-700' :
                        event.category === 'masterclass' ? 'bg-green-100 text-green-700' :
                        event.category === 'competition' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {event.category === 'soiree' ? 'Soirée' :
                         event.category === 'workshop' ? 'Workshop' :
                         event.category === 'masterclass' ? 'Masterclass' :
                         event.category === 'competition' ? 'Compétition' :
                         event.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Informations de l'événement */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                    </div>

                    {/* Bouton d'action */}
                    <Link
                      to={`/events/${event.id}`}
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center group"
                    >
                      Voir les détails
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun événement inscrit</h3>
              <p className="text-gray-600 mb-6">
                Vous n'êtes inscrit à aucun événement pour le moment.
              </p>
              <Link
                to="/events"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Découvrir des événements
              </Link>
            </div>
          )}
        </motion.div>

        {/* Événements que vous avez créés */}
        {createdEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Événements que vous avez créés ({createdEvents.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Image de l'événement */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image || event.main_image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-purple-600">
                      {event.price}
                    </div>
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(event.status)}`}>
                      {getStatusLabel(event.status)}
                    </div>
                  </div>

                  {/* Contenu de l'événement */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.category === 'soiree' ? 'bg-purple-100 text-purple-700' :
                        event.category === 'workshop' ? 'bg-blue-100 text-blue-700' :
                        event.category === 'masterclass' ? 'bg-green-100 text-green-700' :
                        event.category === 'competition' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {event.category === 'soiree' ? 'Soirée' :
                         event.category === 'workshop' ? 'Workshop' :
                         event.category === 'masterclass' ? 'Masterclass' :
                         event.category === 'competition' ? 'Compétition' :
                         event.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Informations de l'événement */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="space-y-2">
                      <Link
                        to={`/events/${event.id}`}
                        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center group"
                      >
                        Voir les détails
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      
                      <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                        Gérer l'événement
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;
