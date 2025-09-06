import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CarePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/care/services/');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setServices(data.results || data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des services:', err);
      setError('Impossible de charger les services. Vérifiez que le serveur Django est démarré.');
      toast.error('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'massage': 'bg-blue-100 text-blue-800',
      'physiotherapie': 'bg-green-100 text-green-800',
      'osteopathie': 'bg-purple-100 text-purple-800',
      'nutrition': 'bg-yellow-100 text-yellow-800',
      'bien_etre': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'massage': 'Massage',
      'physiotherapie': 'Physiothérapie',
      'osteopathie': 'Ostéopathie',
      'nutrition': 'Nutrition',
      'bien_etre': 'Bien-être'
    };
    return labels[category] || category;
  };

  const getDurationLabel = (duration) => {
    if (duration < 60) {
      return `${duration} min`;
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      if (minutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h${minutes}`;
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">💆‍♀️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchServices}
            className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">💆‍♀️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucun service disponible</h2>
          <p className="text-gray-600">
            Il n'y a pas encore de services de soins dans la base de données.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Soins et Bien-être
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Prenez soin de votre corps et de votre esprit avec nos services spécialisés
          </p>
        </div>

        {/* Grille des services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Image du service */}
              <div className="h-48 bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center relative">
                {service.main_image ? (
                  <img
                    src={service.main_image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">💆‍♀️</div>
                    <p className="text-sm opacity-90">Soin</p>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                    {getCategoryLabel(service.category)}
                  </span>
                </div>
              </div>

              {/* Contenu du service */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Informations du service */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">👨‍⚕️</span>
                    <span>{service.practitioner_name || 'Spécialiste'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">⏱️</span>
                    <span>{getDurationLabel(service.duration)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📍</span>
                    <span>{service.location}, {service.city}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">💳</span>
                    <span>{service.price} {service.currency}</span>
                  </div>
                </div>

                {/* Avantages du service */}
                {service.benefits && service.benefits.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Avantages :</h4>
                    <div className="flex flex-wrap gap-1">
                      {service.benefits.slice(0, 3).map((benefit, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bouton de réservation */}
                <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Réserver
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton de rafraîchissement */}
        <div className="text-center mt-12">
          <button
            onClick={fetchServices}
            className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Actualiser la liste
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarePage;









