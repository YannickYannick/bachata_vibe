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
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllVideoSources } from '../config/videos';
import VideoBackground from './VideoBackground';

const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalParticipants: 0,
    totalArtists: 0,
    totalCities: 0
  });

  useEffect(() => {
    // Simuler le chargement des données
    // En production, cela viendrait de l'API Django
    setFeaturedCourses([
      {
        id: 1,
        title: "Bachata Sensual - Niveau Intermédiaire",
        instructor: "Maria Rodriguez",
        location: "Paris, France",
        date: "2024-02-15",
        price: 45,
        image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400",
        rating: 4.8,
        participants: 18,
        maxParticipants: 25,
        duration: "2h",
        students: 18
      },
      {
        id: 2,
        title: "Bachata Dominicana - Débutants",
        instructor: "Carlos Mendez",
        location: "Lyon, France",
        date: "2024-02-20",
        price: 35,
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
        rating: 4.9,
        participants: 22,
        maxParticipants: 30,
        duration: "1h30",
        students: 22
      },
      {
        id: 3,
        title: "Bachata Moderna - Avancé",
        instructor: "Ana Silva",
        location: "Marseille, France",
        date: "2024-02-25",
        price: 55,
        image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400",
        rating: 4.7,
        participants: 15,
        maxParticipants: 20,
        duration: "2h30",
        students: 15
      }
    ]);

    setUpcomingEvents([
      {
        id: 1,
        title: "Festival Bachata Paris 2024",
        date: "2024-03-15",
        location: "Paris, France",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400"
      },
      {
        id: 2,
        title: "Compétition Nationale Bachata",
        date: "2024-04-20",
        location: "Lyon, France",
        image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400"
      }
    ]);

    setStats({
      totalCourses: 156,
      totalParticipants: 2847,
      totalArtists: 89,
      totalCities: 23
    });
  }, []);

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
            noOverlay={false}
            debug={true}
          />
        </div>
        
        {/* Contenu principal centré */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              variants={itemVariants}
            >
              Bachata & Cocktails
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl mb-8 text-purple-100 max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Découvrez l'art de la danse et l'élégance des cocktails
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={itemVariants}
            >
              <Link
                to="/register"
                className="bg-yellow-400 text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Commencer
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
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Section Statistiques */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.totalCourses}</div>
              <div className="text-gray-600">Cours disponibles</div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.totalParticipants}</div>
              <div className="text-gray-600">Participants</div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.totalArtists}</div>
              <div className="text-gray-600">Artistes</div>
            </motion.div>
            
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.totalCities}</div>
              <div className="text-gray-600">Villes</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Cours en Vedette */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
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
              Découvrez nos cours les plus populaires
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
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {course.price}€
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{course.rating}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">{course.instructor}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {course.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students} étudiants</span>
                    </div>
                    <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">
                      S'inscrire
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Événements à Venir */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
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
              Ne manquez pas nos prochains événements
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                variants={itemVariants}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </div>
                  <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">
                    Plus d'infos
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
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
              Prêt à danser ?
            </motion.h2>
            <motion.p 
              className="text-xl text-purple-100 mb-8"
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
      </section>
    </div>
  );
};

export default HomePage;

