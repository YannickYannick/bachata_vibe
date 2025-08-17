import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Music, 
  Calendar, 
  Users, 
  Heart, 
  Trophy, 
  BookOpen, 
  ArrowRight,
  Play,
  Star,
  MapPin,
  Clock
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Music,
      title: 'Cours de Bachata',
      description: 'Apprenez la bachata avec des professeurs expérimentés dans une ambiance conviviale.',
      href: '/courses',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Calendar,
      title: 'Festivals',
      description: 'Participez aux plus grands festivals de bachata en France et à l\'étranger.',
      href: '/festivals',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Users,
      title: 'Trainings',
      description: 'Rejoignez des sessions d\'entraînement entre danseurs de tous niveaux.',
      href: '/trainings',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Heart,
      title: 'Care & Bien-être',
      description: 'Prenez soin de votre corps et de votre esprit pour une danse optimale.',
      href: '/care',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Trophy,
      title: 'Compétitions',
      description: 'Affrontez d\'autres danseurs dans des compétitions passionnantes.',
      href: '/competitions',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: BookOpen,
      title: 'Théorie en Ligne',
      description: 'Approfondissez vos connaissances avec nos ressources théoriques.',
      href: '/theory',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const stats = [
    { number: '500+', label: 'Cours dispensés' },
    { number: '50+', label: 'Festivals organisés' },
    { number: '1000+', label: 'Danseurs actifs' },
    { number: '100+', label: 'Professeurs certifiés' }
  ];

  const upcomingEvents = [
    {
      title: 'Festival Bachata Paris 2024',
      date: '15-17 Mars 2024',
      location: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop'
    },
    {
      title: 'Stage Intensif Débutants',
      date: '22-23 Mars 2024',
      location: 'Lyon, France',
      image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400&h=300&fit=crop'
    },
    {
      title: 'Compétition Nationale',
      date: '5-6 Avril 2024',
      location: 'Marseille, France',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Découvrez la{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Bachata
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              Rejoignez la communauté de danseurs passionnés et développez vos compétences 
              avec nos cours, festivals et événements exclusifs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Commencer à Danser
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/festivals"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold"
              >
                Voir les Festivals
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-auto">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,8.77,158.84-3.84c54.53-12.43,104.34-26.9,158.56-32.37C373.84,1.36,450.56,6.69,528.41,20.13c77.68,13.38,155.88,35.44,229.94,56.13c74.06,20.69,143.54,40.09,218.94,45.34c75.4,5.25,156.8-4.36,229.94-20.34c73.14-16,139.88-42.47,201.34-68.76c61.46-26.29,117.68-52.68,168.34-79.13c50.66-26.45,95.8-52.92,135.34-79.4V0H0Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour danser
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme complète pour tous les passionnés de bachata, 
              du débutant au professionnel.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link to={feature.href} className="block">
                    <div className="card h-full group-hover:shadow-large transition-all duration-300">
                      <div className="card-body text-center">
                        <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {feature.description}
                        </p>
                        <div className="flex items-center justify-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors duration-300">
                          En savoir plus
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl font-bold text-primary-600 mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Prochains Événements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ne manquez pas nos événements à venir et réservez votre place dès maintenant.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      À venir
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="btn-primary w-full">
                      Réserver
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/festivals"
              className="btn-outline px-8 py-3 text-lg"
            >
              Voir tous les événements
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à rejoindre la communauté ?
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              Créez votre compte gratuitement et accédez à tous nos contenus, 
              cours et événements exclusifs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Créer un compte
              </Link>
              <Link
                to="/courses"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold"
              >
                Découvrir les cours
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;




