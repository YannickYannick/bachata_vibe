import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  ArrowLeft,
  Heart,
  Share2,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Données temporaires pour l'événement (à remplacer par l'API Django)
  const tempEvent = {
    id: parseInt(id),
    title: "Soirée Bachata Sensual",
    description: "Une soirée exceptionnelle dédiée à la Bachata Sensual avec des DJs internationaux. Venez danser sur les plus belles musiques latines dans une ambiance chaleureuse et festive. Cette soirée est l'occasion parfaite de pratiquer vos pas de Bachata et de rencontrer d'autres passionnés de danse.",
    longDescription: "Une soirée exceptionnelle dédiée à la Bachata Sensual avec des DJs internationaux. Venez danser sur les plus belles musiques latines dans une ambiance chaleureuse et festive. Cette soirée est l'occasion parfaite de pratiquer vos pas de Bachata et de rencontrer d'autres passionnés de danse. Nous vous proposons une programmation variée avec des DJs renommés qui sauront vous faire danser toute la soirée. L'ambiance sera au rendez-vous avec une décoration soignée et un éclairage d'ambiance. N'oubliez pas de venir avec votre bonne humeur et votre envie de danser !",
    date: "2025-09-15",
    time: "21:00",
    endTime: "04:00",
    location: "Le Petit Journal, Paris",
    address: "71 Boulevard Saint-Michel, 75005 Paris",
    category: "soiree",
    price: "15€",
    capacity: 150,
    attendees: 89,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
    featured: true,
    organizer: {
      name: "Bachata Paris Events",
      email: "contact@bachataparis.fr",
      phone: "+33 1 42 34 56 78",
      website: "https://bachataparis.fr",
      instagram: "@bachataparis",
      facebook: "bachataparis.events"
    },
    highlights: [
      "DJs internationaux",
      "Ambiance festive",
      "Bar avec cocktails",
      "Zone de repos",
      "Parking sécurisé"
    ],
    schedule: [
      { time: "21:00", activity: "Ouverture des portes" },
      { time: "21:30", activity: "Cours d'initiation gratuit" },
      { time: "22:00", activity: "Début de la soirée dansante" },
      { time: "00:00", activity: "Show de danse" },
      { time: "02:00", activity: "Salsa et Bachata" },
      { time: "04:00", activity: "Fin de soirée" }
    ],
    requirements: [
      "Tenue confortable pour danser",
      "Chaussures de danse recommandées",
      "Âge minimum : 18 ans",
      "Respect des règles de sécurité"
    ]
  };

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        // Ici, vous pourrez remplacer par un appel API réel
        // const response = await fetch(`/api/events/${id}/`);
        // const data = await response.json();
        
        // Pour l'instant, utilisons les données temporaires
        setTimeout(() => {
          setEvent(tempEvent);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Erreur lors du chargement de l\'événement');
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      // Ici, vous pourrez remplacer par un appel API réel
      // const response = await fetch(`/api/events/${id}/enroll/`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Token ${localStorage.getItem('auth_token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // Simulation de l'inscription
      setTimeout(() => {
        setIsEnrolled(true);
        setEnrolling(false);
      }, 1000);
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      setEnrolling(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de l'événement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement</h2>
            <p className="text-gray-600 mb-6">{error || 'Événement non trouvé'}</p>
            <button 
              onClick={() => navigate('/events')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retour aux événements
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/events"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux événements
          </Link>
        </motion.div>

        {/* Header de l'événement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          {/* Image et badge en vedette */}
          <div className="relative h-96">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            {event.featured && (
              <div className="absolute top-6 right-6 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold">
                <Star className="w-4 h-4 inline mr-2" />
                En vedette
              </div>
            )}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-lg font-semibold text-purple-600">
              {event.price}
            </div>
          </div>

          {/* Informations principales */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
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

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              {event.description}
            </p>

            {/* Informations clés */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">{formatDate(event.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Heure</p>
                  <p className="font-semibold">{event.time} - {event.endTime}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Lieu</p>
                  <p className="font-semibold">{event.location}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Participants</p>
                  <p className="font-semibold">{event.attendees}/{event.capacity}</p>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="flex-1 bg-purple-600 text-white py-4 px-8 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {enrolling ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Inscription en cours...
                    </>
                  ) : (
                    'S\'inscrire à l\'événement'
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-green-600 text-white py-4 px-8 rounded-lg cursor-not-allowed flex items-center justify-center"
                >
                  ✓ Inscrit à l'événement
                </button>
              )}
              
              <button className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                <Heart className="w-5 h-5 mr-2" />
                Ajouter aux favoris
              </button>
              
              <button className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                <Share2 className="w-5 h-5 mr-2" />
                Partager
              </button>
            </div>
          </div>
        </motion.div>

        {/* Contenu détaillé */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description détaillée */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">À propos de cet événement</h2>
              <p className="text-gray-600 leading-relaxed">
                {event.longDescription}
              </p>
            </motion.div>

            {/* Programme de la soirée */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Programme de la soirée</h2>
              <div className="space-y-4">
                {event.schedule.map((item, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold mr-4">
                      {item.time}
                    </div>
                    <span className="text-gray-700">{item.activity}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Points forts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Points forts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Prérequis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Prérequis</h2>
              <div className="space-y-3">
                {event.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organisateur */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Organisateur</h3>
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">{event.organizer.name}</p>
                
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${event.organizer.email}`} className="hover:text-purple-600">
                    {event.organizer.email}
                  </a>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${event.organizer.phone}`} className="hover:text-purple-600">
                    {event.organizer.phone}
                  </a>
                </div>
                
                {event.organizer.website && (
                  <div className="flex items-center text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <a href={event.organizer.website} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">
                      Site web
                    </a>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Réseaux sociaux */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Suivez-nous</h3>
              <div className="space-y-3">
                {event.organizer.instagram && (
                  <a href={`https://instagram.com/${event.organizer.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
                    <Instagram className="w-5 h-5 mr-3" />
                    {event.organizer.instagram}
                  </a>
                )}
                
                {event.organizer.facebook && (
                  <a href={`https://facebook.com/${event.organizer.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
                    <Facebook className="w-5 h-5 mr-3" />
                    {event.organizer.facebook}
                  </a>
                )}
              </div>
            </motion.div>

            {/* Carte du lieu */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lieu</h3>
              <div className="space-y-3">
                <p className="text-gray-700">{event.location}</p>
                <p className="text-sm text-gray-500">{event.address}</p>
                <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
                  <span className="text-gray-500">Carte interactive</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
