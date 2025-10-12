import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';
import { 
  Save, 
  X, 
  User, 
  MapPin, 
  Award, 
  Star,
  FileText,
  Image,
  Music
} from 'lucide-react';

const ArtistAdminForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { token } = useAuth();
  
  const [formData, setFormData] = useState({
    artist_name: '',
    bio: '',
    short_bio: '',
    specialties: [],
    dance_styles: [],
    teaching_experience: 0,
    performance_experience: 0,
    qualifications: [],
    certifications: [],
    awards: [],
    profile_image: null,
    main_image: null,
    demo_video: '',
    website_url: '',
    instagram: '',
    facebook: '',
    youtube: '',
    tiktok: '',
    base_location: '',
    city: '',
    country: 'France',
    is_featured: false,
    is_verified: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchArtist();
    }
  }, [id]);

  const fetchArtist = async () => {
    try {
      setLoading(true);
      const artist = await ApiService.getArtist(id);
      setFormData({
        ...formData,
        artist_name: artist.artist_name || '',
        bio: artist.bio || '',
        short_bio: artist.short_bio || '',
        specialties: artist.specialties || [],
        dance_styles: artist.dance_styles || [],
        teaching_experience: artist.teaching_experience || 0,
        performance_experience: artist.performance_experience || 0,
        qualifications: artist.qualifications || [],
        certifications: artist.certifications || [],
        awards: artist.awards || [],
        demo_video: artist.demo_video || '',
        website_url: artist.website_url || '',
        instagram: artist.instagram || '',
        facebook: artist.facebook || '',
        youtube: artist.youtube || '',
        tiktok: artist.tiktok || '',
        base_location: artist.base_location || '',
        city: artist.city || '',
        country: artist.country || 'France',
        is_featured: Boolean(artist.is_featured),
        is_verified: Boolean(artist.is_verified),
        profile_image: artist.profile_image || '',
        main_image: artist.main_image || '',
      });
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur lors du chargement de l\'artiste');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: file
      }));
    }
  };

  const handleArrayInputChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError('Vous devez être connecté pour sauvegarder un artiste');
      setLoading(false);
      return;
    }

    try {
      const artistData = {
        artist_name: formData.artist_name,
        bio: formData.bio,
        short_bio: formData.short_bio,
        specialties: formData.specialties,
        dance_styles: formData.dance_styles,
        teaching_experience: Number(formData.teaching_experience),
        performance_experience: Number(formData.performance_experience),
        qualifications: formData.qualifications,
        certifications: formData.certifications,
        awards: formData.awards,
        demo_video: formData.demo_video,
        website_url: formData.website_url,
        instagram: formData.instagram,
        facebook: formData.facebook,
        youtube: formData.youtube,
        tiktok: formData.tiktok,
        base_location: formData.base_location,
        city: formData.city,
        country: formData.country,
        is_featured: Boolean(formData.is_featured),
        is_verified: Boolean(formData.is_verified),
      };

      // Ne pas inclure les images si elles sont vides ou null
      if (formData.profile_image && formData.profile_image !== '') {
        artistData.profile_image = formData.profile_image;
      }
      if (formData.main_image && formData.main_image !== '') {
        artistData.main_image = formData.main_image;
      }
      
      await ApiService.saveArtist(artistData, token, isEditing ? id : null);

      // Rediriger vers la liste des artistes
      navigate('/artists');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // Afficher les détails de l'erreur de validation
      if (error.data && error.data.detail) {
        setError(error.data.detail);
      } else if (error.data && typeof error.data === 'object') {
        // Afficher les erreurs de validation par champ
        const errorMessages = [];
        for (const [field, messages] of Object.entries(error.data)) {
          if (Array.isArray(messages)) {
            errorMessages.push(`${field}: ${messages.join(', ')}`);
          } else {
            errorMessages.push(`${field}: ${messages}`);
          }
        }
        setError(errorMessages.join('\n'));
      } else {
        setError(error.message || 'Erreur lors de la sauvegarde de l\'artiste');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'artiste...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Modifier l\'artiste' : 'Ajouter un artiste'}
            </h1>
            <button
              onClick={() => navigate('/artists')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations de base */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Informations de base
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'artiste *
              </label>
              <input
                type="text"
                name="artist_name"
                value={formData.artist_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu de base *
              </label>
              <input
                type="text"
                name="base_location"
                value={formData.base_location}
                onChange={handleInputChange}
                placeholder="Ex: Paris, France"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Indiquez la ville et le pays où l'artiste est basé
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Artiste en vedette</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_verified"
                  checked={formData.is_verified}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Vérifié</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biographie courte *
              </label>
              <textarea
                name="short_bio"
                value={formData.short_bio}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biographie complète *
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Spécialités et styles */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Music className="w-5 h-5 mr-2" />
                Spécialités et styles
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spécialités (séparées par des virgules)
              </label>
              <input
                type="text"
                value={formData.specialties.join(', ')}
                onChange={(e) => handleArrayInputChange('specialties', e.target.value)}
                placeholder="Bachata Sensual, Bachata Traditional, Salsa"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Styles de danse (séparés par des virgules)
              </label>
              <input
                type="text"
                value={formData.dance_styles.join(', ')}
                onChange={(e) => handleArrayInputChange('dance_styles', e.target.value)}
                placeholder="Bachata, Salsa, Kizomba, Zouk"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Expérience */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Expérience
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Années d'expérience d'enseignement
              </label>
              <input
                type="number"
                name="teaching_experience"
                value={formData.teaching_experience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Années d'expérience de performance
              </label>
              <input
                type="number"
                name="performance_experience"
                value={formData.performance_experience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Qualifications et certifications */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Qualifications et récompenses
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifications (séparées par des virgules)
              </label>
              <input
                type="text"
                value={formData.qualifications.join(', ')}
                onChange={(e) => handleArrayInputChange('qualifications', e.target.value)}
                placeholder="Formation professionnelle, Diplôme de danse"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifications (séparées par des virgules)
              </label>
              <input
                type="text"
                value={formData.certifications.join(', ')}
                onChange={(e) => handleArrayInputChange('certifications', e.target.value)}
                placeholder="Certification Bachata Sensual, Formation Salsa"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix et récompenses (séparés par des virgules)
              </label>
              <input
                type="text"
                value={formData.awards.join(', ')}
                onChange={(e) => handleArrayInputChange('awards', e.target.value)}
                placeholder="1er Prix Festival de Bachata, Meilleur Instructeur 2023"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Images */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Images
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de profil
              </label>
              <input
                type="file"
                name="profile_image"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image principale
              </label>
              <input
                type="file"
                name="main_image"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Médias */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Music className="w-5 h-5 mr-2" />
                Médias et réseaux sociaux
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vidéo de démonstration
              </label>
              <input
                type="url"
                name="demo_video"
                value={formData.demo_video}
                onChange={handleInputChange}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site web
              </label>
              <input
                type="url"
                name="website_url"
                value={formData.website_url}
                onChange={handleInputChange}
                placeholder="https://www.artiste.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder="@username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="page.facebook.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube
              </label>
              <input
                type="text"
                name="youtube"
                value={formData.youtube}
                onChange={handleInputChange}
                placeholder="@channel ou channel.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TikTok
              </label>
              <input
                type="text"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                placeholder="@username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/artists')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Mettre à jour' : 'Créer l\'artiste'}
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ArtistAdminForm;
