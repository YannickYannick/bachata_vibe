import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/courses/courses/');
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setCourses(data.results || data); // Gérer la pagination si elle existe
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des cours:', err);
      setError('Impossible de charger les cours. Vérifiez que le serveur Django est démarré.');
      toast.error('Erreur lors du chargement des cours');
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

  const formatPrice = (price, currency, isFree) => {
    if (isFree) return 'Gratuit';
    return `${price} ${currency}`;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-orange-100 text-orange-800',
      'professional': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      'beginner': 'Débutant',
      'intermediate': 'Intermédiaire',
      'advanced': 'Avancé',
      'professional': 'Professionnel'
    };
    return labels[difficulty] || difficulty;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des cours...</p>
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
            onClick={fetchCourses}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucun cours disponible</h2>
          <p className="text-gray-600">
            Il n'y a pas encore de cours dans la base de données. 
            Vérifiez l'interface d'administration Django.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Cours de Bachata
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection de cours pour tous les niveaux, 
            de débutant à professionnel
          </p>
        </div>

        {/* Grille des cours */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Image du cours */}
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
                    <p className="text-sm opacity-90">Bachata</p>
                  </div>
                )}
              </div>

              {/* Contenu du cours */}
              <div className="p-6">
                {/* En-tête du cours */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {course.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                    {getDifficultyLabel(course.difficulty)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.short_description || course.description}
                </p>

                {/* Informations du cours */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📍</span>
                    <span>{course.location}, {course.city}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📅</span>
                    <span>{formatDate(course.start_date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">⏱️</span>
                    <span>{course.duration_minutes} min</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">👥</span>
                    <span>{course.current_participants}/{course.max_participants} participants</span>
                  </div>
                </div>

                {/* Prix et bouton */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(course.price, course.currency, course.is_free)}
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Voir détails
                  </button>
                </div>

                {/* Statut du cours */}
                {course.is_full && (
                  <div className="mt-3 text-center">
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Cours complet
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bouton de rafraîchissement */}
        <div className="text-center mt-12">
          <button
            onClick={fetchCourses}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Actualiser la liste
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;






