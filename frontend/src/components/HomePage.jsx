import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Star, 
  ArrowRight, 
  Play,
  Heart,
  Share2,
  Clock,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoBackground from './VideoBackground';
import { getStats, getFeaturedCourses } from '../services/api';
import ApiService from '../services/api';

const HomePage = () => {
  const [stats, setStats] = useState({
    courses_count: 0,
    total_participants: 0,
    artists_count: 0,
    cities_count: 0
  });
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState({ courses: [], festivals: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomePageData = async () => {
      try {
        setLoading(true);
        
        // Charger les données en parallèle
        const [statsData, featuredData, upcomingEventsData, upcomingFestivalsData] = await Promise.all([
          getStats(),
          getFeaturedCourses(),
          ApiService.getUpcomingEvents(),
          ApiService.getUpcomingEvents() // Pour les festivals, on peut adapter plus tard
        ]);
        
        setStats(statsData);
        setFeaturedCourses(featuredData);
        setUpcomingEvents({
          courses: upcomingEventsData.filter(event => event.category?.slug === 'workshops' || event.category?.slug === 'masterclasses'),
          festivals: upcomingEventsData.filter(event => event.category?.slug === 'soirees' || event.category?.slug === 'spectacles')
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données de la page d\'accueil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomePageData();
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString('fr-FR');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la page d'accueil...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section avec Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background - Positionné en arrière-plan */}
        <div className="absolute inset-0 w-full h-full">
          <VideoBackground 
            videoKey="parisDrone"
            overlay={true}
            overlayOpacity={5}
            debug={false}
          />
        </div>
        
        {/* Contenu principal centré */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              variants={itemVariants}
            >
              Bachata
              <span className="block text-yellow-400">Passion</span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-purple-100 mb-8"
              variants={itemVariants}
            >
              Rejoignez notre communauté de passionnés et commencez votre voyage dans le monde de la bachata
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link
                to="/register"
                className="bg-yellow-400 text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Créer un compte
              </Link>
              <Link
                to="/courses"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-900 transition-all duration-300 transform hover:scale-105"
              >
                Explorer les cours
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Indicateur de défilement */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowRight className="w-6 h-6 text-white rotate-90" />
        </motion.div>
      </section>

      {/* Section Statistiques */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Notre Communauté en Chiffres
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              variants={itemVariants}
            >
              Découvrez l'ampleur de notre réseau de passionnés
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">{formatNumber(stats.courses_count)}</div>
              <div className="text-gray-600">Cours disponibles</div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">{formatNumber(stats.total_participants)}</div>
              <div className="text-gray-600">Participants</div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">{formatNumber(stats.artists_count)}</div>
              <div className="text-gray-600">Artistes</div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="text-center"
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">{formatNumber(stats.cities_count)}</div>
              <div className="text-gray-600">Villes</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cours en Vedette */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Cours en Vedette
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              variants={itemVariants}
            >
              Découvrez nos cours les plus populaires et les événements à venir
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredCourses.map((course) => (
              <motion.div
                key={course.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                variants={itemVariants}
              >
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  {course.main_image ? (
                    <img
                      src={course.main_image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">💃</div>
                      <p className="text-lg opacity-90">Bachata</p>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{course.instructor?.get_full_name || course.instructor?.username || 'Instructeur'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{course.city}, {course.country}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {course.is_free ? 'Gratuit' : `${course.base_price} ${course.currency || '€'}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {course.current_participants}/{course.max_participants} participants
                    </div>
                  </div>
                  
                  <Link
                    to={`/courses/${course.id}`}
                    className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Voir détails
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Événements à Venir */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Événements à Venir
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              variants={itemVariants}
            >
              Ne manquez pas nos prochains événements et festivals
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Cours à venir */}
            {upcomingEvents.courses.map((course) => (
              <motion.div
                key={`course-${course.id}`}
                className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                variants={itemVariants}
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  {course.main_image ? (
                    <img
                      src={course.main_image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">💃</div>
                      <p className="text-lg opacity-90">Cours</p>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(course.start_date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {course.city}, {course.country}
                    </div>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Plus d'infos
                  </Link>
                </div>
              </motion.div>
            ))}
            
            {/* Festivals à venir */}
            {upcomingEvents.festivals.map((festival) => (
              <motion.div
                key={`festival-${festival.id}`}
                className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                variants={itemVariants}
              >
                <div className="h-48 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
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
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {festival.title}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(festival.start_date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {festival.city}, {festival.country}
                    </div>
                  </div>
                  <Link
                    to={`/festivals/${festival.id}`}
                    className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition-colors"
                  >
                    Plus d'infos
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl font-bold text-white mb-6"
              variants={itemVariants}
            >
              Prêt à Danser ?
            </motion.h2>
            <motion.p 
              className="text-xl text-purple-100 mb-8"
              variants={itemVariants}
            >
              Rejoignez notre communauté et commencez votre voyage dans le monde de la bachata dès aujourd'hui
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link
                to="/register"
                className="bg-yellow-400 text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Commencer maintenant
              </Link>
              <Link
                to="/courses"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-900 transition-all duration-300 transform hover:scale-105"
              >
                Découvrir les cours
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
