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
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
        maxParticipants: 25
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
        maxParticipants: 30
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
        maxParticipants: 20
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-pink-600/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            className="text-center text-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold mb-6"
              variants={itemVariants}
            >
              Découvrez la
              <span className="block text-yellow-300">Bachata</span>
            </motion.h1>
            <motion.p 
              className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-purple-100"
              variants={itemVariants}
            >
              Rejoignez la communauté de danseurs passionnés. Apprenez, pratiquez et partagez votre passion pour la bachata.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link
                to="/courses"
                className="bg-yellow-400 text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Trouver un cours
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/festivals"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-900 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Découvrir les festivals
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-auto">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-white"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19.3,81.78-28.2,126.67-39.49C465.83,1.27,521.69,0,583,0c69.27,0,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".5"
              className="fill-white"
            />
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-white"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { label: "Cours disponibles", value: stats.totalCourses, icon: Calendar },
              { label: "Participants actifs", value: stats.totalParticipants, icon: Users },
              { label: "Artistes certifiés", value: stats.totalArtists, icon: Star },
              { label: "Villes couvertes", value: stats.totalCities, icon: MapPin }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={itemVariants}
              >
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-10 h-10 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cours populaires
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos cours les plus demandés et commencez votre apprentissage dès aujourd'hui
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredCourses.map((course) => (
              <motion.div
                key={course.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
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
                      <Calendar className="w-4 h-4" />
                      {new Date(course.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      {course.participants}/{course.maxParticipants} participants
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(course.participants / course.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Link
                    to={`/courses/${course.id}`}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    Voir le cours
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            className="text-center mt-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-purple-600 font-semibold text-lg hover:text-purple-700 transition-colors"
            >
              Voir tous les cours
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Événements à venir
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ne manquez pas les festivals et compétitions de bachata les plus attendus
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl overflow-hidden text-white"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                      <div className="flex items-center gap-4 text-purple-100">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  </div>
                  
                  <Link
                    to={`/events/${event.id}`}
                    className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    En savoir plus
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
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
                className="bg-yellow-400 text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-colors duration-300"
              >
                Créer un compte
              </Link>
              <Link
                to="/courses"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-900 transition-colors duration-300"
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




