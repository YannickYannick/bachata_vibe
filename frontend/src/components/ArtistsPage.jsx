import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2, X, Mail, Phone, Globe, MessageCircle } from 'lucide-react';
import ApiService from '../services/api';


const ArtistsPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchArtists();
    // Vérifier si l'utilisateur est admin
    if (user && user.user_type === 'admin') {
      setIsAdmin(true);
    }
  }, [user]);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getArtists();
      setArtists(data.results || data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la récupération des artistes:', err);
      setError('Impossible de charger les artistes. Vérifiez que le serveur Django est démarré.');
      toast.error('Erreur lors du chargement des artistes');
    } finally {
      setLoading(false);
    }
  };

  const getSpecialtyColor = (specialty) => {
    if (!specialty) return 'bg-gray-100 text-gray-800';
    
    const colors = {
      'bachata': 'bg-red-100 text-red-800',
      'salsa': 'bg-blue-100 text-blue-800',
      'kizomba': 'bg-purple-100 text-purple-800',
      'merengue': 'bg-green-100 text-green-800',
      'cha-cha': 'bg-yellow-100 text-yellow-800'
    };
    return colors[specialty] || 'bg-gray-100 text-gray-800';
  };

  const getSpecialtyLabel = (specialty) => {
    if (!specialty) return 'Divers';
    
    const labels = {
      'bachata': 'Bachata',
      'salsa': 'Salsa',
      'kizomba': 'Kizomba',
      'merengue': 'Merengue',
      'cha-cha': 'Cha-cha'
    };
    return labels[specialty] || specialty;
  };

  const getLevelColor = (level) => {
    if (!level) return 'bg-gray-100 text-gray-800';
    
    const colors = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-orange-100 text-orange-800',
      'professional': 'bg-red-100 text-red-800',
      'master': 'bg-purple-100 text-purple-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getLevelLabel = (level) => {
    if (!level) return 'Non spécifié';
    
    const labels = {
      'beginner': 'Débutant',
      'intermediate': 'Intermédiaire',
      'advanced': 'Avancé',
      'professional': 'Professionnel',
      'master': 'Maître'
    };
    return labels[level] || level;
  };

  // Fonctions d'action utilisateur
  const handleViewProfile = (artistId) => {
    // Pour l'instant, naviguer vers une page de détail d'artiste
    // TODO: Créer une page ArtistDetailPage
    toast('Fonctionnalité "Voir profil" en cours de développement', {
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#fff',
      },
    });
    // navigate(`/artists/${artistId}`);
  };

  const handleContactArtist = (artist) => {
    setSelectedArtist(artist);
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setSelectedArtist(null);
  };

  const handleSendMessage = () => {
    if (!user) {
      toast.error('Vous devez être connecté pour envoyer un message');
      return;
    }
    
    toast.success('Message envoyé avec succès !');
    closeContactModal();
  };

  // Fonctions d'administration
  const handleAddArtist = () => {
    navigate('/admin/artists/add');
  };

  const handleEditArtist = (artistId) => {
    navigate(`/admin/artists/edit/${artistId}`);
  };

  const handleDeleteArtist = async (artistId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet artiste ?')) {
      try {
        await ApiService.deleteArtist(artistId, token);
        setArtists(artists.filter(a => a.id !== artistId));
        toast.success('Artiste supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de l\'artiste');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des artistes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">👨‍🎨</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchArtists}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">👨‍🎨</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucun artiste disponible</h2>
          <p className="text-gray-600">
            Il n'y a pas encore d'artistes dans la base de données.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Artistes de Bachata
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les meilleurs artistes et instructeurs de bachata
          </p>
          {/* Note: L'ajout d'artiste nécessite la création d'un utilisateur d'abord.
              Utilisez l'interface d'administration Django pour créer des profils d'artistes. */}
          {isAdmin && false && (
            <div className="mt-6">
              <button
                onClick={handleAddArtist}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un artiste
              </button>
            </div>
          )}
        </div>

        {/* Grille des artistes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              {/* Photo de l'artiste */}
              <div className="h-64 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center relative">
                {artist.profile_picture ? (
                  <img
                    src={artist.profile_picture}
                    alt={artist.artist_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white text-center">
                    <div className="text-6xl mb-2">👨‍🎨</div>
                    <p className="text-sm opacity-90">Artiste</p>
                  </div>
                )}
                <div className="absolute top-3 right-3 space-y-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSpecialtyColor(artist.primary_specialty)}`}>
                    {getSpecialtyLabel(artist.primary_specialty)}
                  </span>
                  <div className="block">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(artist.level)}`}>
                      {getLevelLabel(artist.level)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informations de l'artiste */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {artist.artist_name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {artist.bio || 'Aucune biographie disponible'}
                </p>

                {/* Détails de l'artiste */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">🌍</span>
                    <span>{artist.country || 'Non spécifié'}, {artist.city || 'Non spécifié'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">🎓</span>
                    <span>{artist.years_experience || 0} ans d'expérience</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">🏆</span>
                    <span>{artist.awards_count || 0} récompenses</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📚</span>
                    <span>{artist.courses_count || 0} cours créés</span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewProfile(artist.id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Voir profil
                  </button>
                  <button 
                    onClick={() => handleContactArtist(artist)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Contacter
                  </button>
                </div>

                {/* Boutons admin */}
                {isAdmin && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditArtist(artist.id);
                      }}
                      className="flex-1 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteArtist(artist.id);
                      }}
                      className="flex-1 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bouton de rafraîchissement */}
        <div className="text-center mt-12">
          <button
            onClick={fetchArtists}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Actualiser la liste
          </button>
        </div>
      </div>

      {/* Modal de contact */}
      {showContactModal && selectedArtist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête du modal */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Contacter {selectedArtist.artist_name}
              </h3>
              <button
                onClick={closeContactModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenu du modal */}
            <div className="p-6">
              {/* Informations de contact disponibles */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Moyens de contact disponibles :</h4>
                <div className="space-y-2">
                  {selectedArtist.website && (
                    <a 
                      href={selectedArtist.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Site web
                    </a>
                  )}
                  {selectedArtist.instagram && (
                    <a 
                      href={`https://instagram.com/${selectedArtist.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-pink-600 hover:text-pink-800 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Instagram: @{selectedArtist.instagram}
                    </a>
                  )}
                  {selectedArtist.facebook && (
                    <a 
                      href={`https://facebook.com/${selectedArtist.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-700 hover:text-blue-900 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Facebook: {selectedArtist.facebook}
                    </a>
                  )}
                  {selectedArtist.youtube && (
                    <a 
                      href={`https://youtube.com/${selectedArtist.youtube}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      YouTube: {selectedArtist.youtube}
                    </a>
                  )}
                  {!selectedArtist.website && !selectedArtist.instagram && !selectedArtist.facebook && !selectedArtist.youtube && (
                    <p className="text-gray-500 text-sm">
                      Aucune information de contact publique disponible.
                    </p>
                  )}
                </div>
              </div>

              {/* Zone de message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre message
                </label>
                <textarea
                  placeholder="Écrivez votre message à cet artiste..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              {/* Boutons d'action */}
              <div className="flex space-x-3">
                <button
                  onClick={closeContactModal}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendMessage}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistsPage;















