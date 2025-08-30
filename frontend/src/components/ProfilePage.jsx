import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, logout, isAuthenticated, loading, token } = useAuth();
  const navigate = useNavigate();
  const [created, setCreated] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [festivalsCreated, setFestivalsCreated] = useState([]);
  const [festivalsEnrolled, setFestivalsEnrolled] = useState([]);
  const [festivalsLoading, setFestivalsLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      if (!isAuthenticated || !token) {
        setCoursesLoading(false);
        return;
      }

      try {
        setCoursesLoading(true);
        const response = await fetch('http://localhost:8000/api/courses/courses/my_courses/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCreated(data.created || []);
          setEnrolled(data.enrolled || []);
        } else {
          console.error('Erreur lors de la récupération des cours');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des cours:', error);
      } finally {
        setCoursesLoading(false);
      }
    };

    const loadFestivals = async () => {
      if (!isAuthenticated || !token) {
        setFestivalsLoading(false);
        return;
      }

      try {
        setFestivalsLoading(true);
        const response = await fetch('http://localhost:8000/api/festivals/festivals/my_festivals/', {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFestivalsCreated(data.created || []);
          setFestivalsEnrolled(data.enrolled || []);
        } else {
          console.error('Erreur lors de la récupération des festivals');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des festivals:', error);
      } finally {
        setFestivalsLoading(false);
      }
    };

    loadCourses();
    loadFestivals();
  }, [isAuthenticated, token]);

  // Si en cours de chargement, afficher un indicateur
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié, rediriger vers la connexion
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Vous devez être connecté</h2>
          <p className="text-gray-600 mb-6">Connectez-vous pour accéder à votre profil</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const CoursesSection = ({ title, items, emptyMessage }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {coursesLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📚</div>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((course) => (
            <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{course.title}</h4>
                <p className="text-sm text-gray-600">
                  {course.city} • {course.price}{course.currency || '€'}
                </p>
              </div>
              <Link
                to={`/courses/${course.id}`}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
              >
                Voir
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête du profil */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Photo de profil"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`
              )}
            </div>

            {/* Informations principales */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  {user.user_type_display || user.user_type}
                </span>
                {user.dance_level && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {user.dance_level_display || user.dance_level}
                  </span>
                )}
                {user.city && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    📍 {user.city}
                  </span>
                )}
              </div>
            </div>

            {/* Bouton de déconnexion */}
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/courses"
              className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              <div className="text-2xl mr-3">💃</div>
              <div>
                <div className="font-semibold">Découvrir des cours</div>
                <div className="text-blue-100 text-sm">Trouver de nouveaux cours</div>
              </div>
            </Link>

            <Link
              to="/festivals"
              className="flex items-center p-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all"
            >
              <div className="text-2xl mr-3">🎭</div>
              <div>
                <div className="font-semibold">Découvrir des festivals</div>
                <div className="text-pink-100 text-sm">Trouver de nouveaux festivals</div>
              </div>
            </Link>

            <Link
              to="/events"
              className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
            >
              <div className="text-2xl mr-3">🎪</div>
              <div>
                <div className="font-semibold">Découvrir des événements</div>
                <div className="text-purple-100 text-sm">Trouver de nouveaux événements</div>
              </div>
            </Link>

            <Link
              to="/my-events"
              className="flex items-center p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all"
            >
              <div className="text-2xl mr-3">📅</div>
              <div>
                <div className="font-semibold">Mes événements</div>
                <div className="text-indigo-100 text-sm">Gérer mes inscriptions</div>
              </div>
            </Link>

            <Link
              to="/settings"
              className="flex items-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
            >
              <div className="text-2xl mr-3">⚙️</div>
              <div>
                <div className="font-semibold">Paramètres</div>
                <div className="text-green-100 text-sm">Gérer mon compte</div>
              </div>
            </Link>

            {/* Lien d'administration pour les admins */}
            {user?.user_type === 'admin' && (
              <a
                href="http://localhost:8000/admin/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
              >
                <div className="text-2xl mr-3">👑</div>
                <div>
                  <div className="font-semibold">Administration</div>
                  <div className="text-red-100 text-sm">Accéder au panel admin</div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Section des cours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CoursesSection
            title="Cours auxquels je suis inscrit(e)"
            items={enrolled}
            emptyMessage="Vous n'êtes inscrit à aucun cours pour le moment"
          />

          <CoursesSection
            title="Cours que j'ai créés"
            items={created}
            emptyMessage="Vous n'avez créé aucun cours pour le moment"
          />
        </div>

        {/* Section des festivals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CoursesSection
            title="Festivals auxquels je suis inscrit(e)"
            items={festivalsEnrolled}
            emptyMessage="Vous n'êtes inscrit à aucun festival pour le moment"
          />

          <CoursesSection
            title="Festivals que j'ai créés"
            items={festivalsCreated}
            emptyMessage="Vous n'avez créé aucun festival pour le moment"
          />
        </div>

        {/* Section d'administration pour les admins */}
        {user?.user_type === 'admin' && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">👑</div>
              <h2 className="text-xl font-semibold text-red-900">Panel d'Administration</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <div className="text-2xl font-bold text-red-600 mb-2">📊</div>
                <h3 className="font-semibold text-gray-900 mb-2">Statistiques</h3>
                <p className="text-sm text-gray-600">Voir les statistiques du site</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-red-200">
                <div className="text-2xl font-bold text-red-600 mb-2">✅</div>
                <h3 className="font-semibold text-gray-900 mb-2">Validation</h3>
                <p className="text-sm text-gray-600">Approuver le contenu en attente</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-red-200">
                <div className="text-2xl font-bold text-red-600 mb-2">👥</div>
                <h3 className="font-semibold text-gray-900 mb-2">Utilisateurs</h3>
                <p className="text-sm text-gray-600">Gérer les comptes utilisateurs</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <a
                href="http://localhost:8000/admin/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <span className="mr-2">🚀</span>
                Accéder au Panel d'Administration
              </a>
            </div>
          </div>
        )}

        {/* Informations détaillées */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations détaillées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Informations personnelles</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom d'utilisateur:</span>
                  <span className="font-medium">{user.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prénom:</span>
                  <span className="font-medium">{user.first_name || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom:</span>
                  <span className="font-medium">{user.last_name || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type d'utilisateur:</span>
                  <span className="font-medium">{user.user_type_display || user.user_type}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-3">Informations de danse</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Niveau:</span>
                  <span className="font-medium">{user.dance_level_display || user.dance_level || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Années d'expérience:</span>
                  <span className="font-medium">{user.experience_years || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ville:</span>
                  <span className="font-medium">{user.city || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pays:</span>
                  <span className="font-medium">{user.country || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Téléphone:</span>
                  <span className="font-medium">{user.phone || 'Non renseigné'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


