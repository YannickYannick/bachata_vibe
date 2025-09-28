import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import ApiService from '../services/api';


const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getCourses();
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setCourse(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération du cours:', err);
      setError('Impossible de charger les détails du cours.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated || !token) {
      toast.error('Vous devez être connecté pour vous inscrire');
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await ApiService.enrollInCourse(id, token);
      toast.success('Inscription réussie !');
      navigate('/my-courses');
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      toast.error('Erreur lors de l\'inscription');
    } finally {
      setEnrolling(false);
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
          <p className="text-gray-600">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error || 'Cours introuvable'}</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Retour aux cours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/courses')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Retour aux cours
        </button>

        {/* En-tête du cours */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Image du cours */}
          <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            {course.main_image ? (
              <img
                src={course.main_image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white text-center">
                <div className="text-6xl mb-4">💃</div>
                <p className="text-xl opacity-90">Bachata</p>
              </div>
            )}
          </div>

          {/* Informations principales */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
                {getDifficultyLabel(course.difficulty)}
              </span>
            </div>

            <p className="text-gray-600 text-lg mb-6">
              {course.description}
            </p>

            {/* Statistiques du cours */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{course.duration_minutes || 0}</div>
                <div className="text-sm text-gray-500">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{course.current_participants || 0}/{course.max_participants || 0}</div>
                <div className="text-sm text-gray-500">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{course.price || 0}</div>
                <div className="text-sm text-gray-500">{course.currency || '€'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{course.start_date ? formatDate(course.start_date).split(' ')[0] : 'N/A'}</div>
                <div className="text-sm text-gray-500">Date de début</div>
              </div>
            </div>

            {/* Bouton d'inscription */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                    enrolling
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {enrolling ? 'Inscription en cours...' : 'S\'inscrire au cours'}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Se connecter pour s'inscrire
                </button>
              )}
              
              {course.is_free ? (
                <span className="text-green-600 font-medium text-center sm:text-left">
                  ✓ Cours gratuit
                </span>
              ) : (
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(course.price, course.currency, course.is_free)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Détails supplémentaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations pratiques */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations pratiques</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="mr-3 text-gray-500">📍</span>
                <span>{course.location || 'Non spécifié'}, {course.city || 'Non spécifié'}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-3 text-gray-500">📅</span>
                <span>Début: {formatDate(course.start_date)}</span>
              </div>
              {course.end_date && (
                <div className="flex items-center">
                  <span className="mr-3 text-gray-500">📅</span>
                  <span>Fin: {formatDate(course.end_date)}</span>
                </div>
              )}
              <div className="flex items-center">
                <span className="mr-3 text-gray-500">⏱️</span>
                <span>Durée: {course.duration_minutes || 0} minutes</span>
              </div>
            </div>
          </div>

          {/* Prérequis et matériel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Prérequis & Matériel</h2>
            <div className="space-y-3">
              {course.prerequisites && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Prérequis:</h3>
                  <p className="text-gray-600 text-sm">{course.prerequisites}</p>
                </div>
              )}
              {course.materials_needed && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Matériel nécessaire:</h3>
                  <p className="text-gray-600 text-sm">{course.materials_needed}</p>
                </div>
              )}
              {!course.prerequisites && !course.materials_needed && (
                <p className="text-gray-500 text-sm">Aucune information disponible</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
