import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApiService from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Save, 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Euro,
  FileText,
  Image,
  Star
} from 'lucide-react';

const EventAdminForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const isEditing = Boolean(id);
  
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    long_description: '',
    category: '',
    status: 'draft',
    featured: false,
    start_date: '',
    end_date: '',
    registration_deadline: '',
    location: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
    capacity: 50,
    min_participants: 1,
    price: 0,
    currency: 'EUR',
    early_bird_price: '',
    early_bird_deadline: '',
    difficulty: 'all_levels',
    prerequisites: '',
    instructor: '',
    instructor_bio: '',
    main_image: '',
    highlights: '',
    schedule: '',
    materials_needed: '',
    website: '',
    instagram: '',
    facebook: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchEvent();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await ApiService.getEventCategories();
      // S'assurer que data est un tableau
      if (Array.isArray(data)) {
      setCategories(data);
      } else if (data && data.results && Array.isArray(data.results)) {
        // Si l'API retourne un objet avec une propriété results
        setCategories(data.results);
      } else {
        console.warn('Format de données inattendu pour les catégories:', data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      setCategories([]);
    }
  };

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const event = await ApiService.getEvent(id);
      
      // Convertir les dates ISO en format datetime-local
      const toDateTimeLocal = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
      
      setFormData({
        ...event,
        start_date: toDateTimeLocal(event.start_date),
        end_date: toDateTimeLocal(event.end_date),
        registration_deadline: toDateTimeLocal(event.registration_deadline),
        early_bird_deadline: toDateTimeLocal(event.early_bird_deadline),
        category: event.category?.id || '',
        main_image: event.main_image || ''
      });
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur lors du chargement de l\'événement');
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
        main_image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convertir les dates au format ISO pour les champs datetime-local
      const toIsoDateTime = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toISOString();
      };

      // Validation des données avant envoi
      if (!formData.title || !formData.description || !formData.category) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }

      // Validation supplémentaire pour éviter les données corrompues
      if (typeof formData.title !== 'string' || formData.title.length > 500) {
        setError('Le titre est invalide');
        return;
      }

      if (typeof formData.description !== 'string' || formData.description.length > 1000) {
        setError('La description est invalide');
        return;
      }

      // Vérifier que les champs optionnels sont des chaînes ou null/undefined
      const stringFields = ['long_description', 'location', 'address', 'city', 'postal_code', 'country', 
                           'instructor', 'instructor_bio', 'prerequisites', 'highlights', 'schedule', 
                           'materials_needed', 'website', 'instagram', 'facebook'];
      
      for (const field of stringFields) {
        if (formData[field] !== null && formData[field] !== undefined && typeof formData[field] !== 'string') {
          console.warn(`Champ ${field} n'est pas une chaîne:`, typeof formData[field], formData[field]);
          // Convertir en chaîne si ce n'est pas déjà le cas
          formData[field] = String(formData[field]);
        }
      }

      // Fonction utilitaire pour nettoyer les chaînes
      const cleanString = (value) => {
        if (typeof value === 'string') {
          return value.trim();
        }
        if (value === null || value === undefined) {
          return '';
        }
        if (Array.isArray(value)) {
          // Pour les tableaux, joindre avec des virgules
          return value.map(item => {
            if (typeof item === 'object' && item !== null) {
              // Pour les objets, extraire les propriétés pertinentes
              return item.name || item.title || item.time || JSON.stringify(item);
            }
            return String(item);
          }).join(',');
        }
        if (typeof value === 'object' && value !== null) {
          // Pour les objets, essayer d'extraire des propriétés utiles
          return value.name || value.title || value.time || JSON.stringify(value);
        }
        return String(value).trim();
      };

      // Nettoyer les données avant envoi
      const cleanFormData = {
        ...formData,
        title: cleanString(formData.title),
        description: cleanString(formData.description),
        long_description: cleanString(formData.long_description) || cleanString(formData.description),
        location: cleanString(formData.location),
        address: cleanString(formData.address),
        city: cleanString(formData.city),
        postal_code: cleanString(formData.postal_code),
        country: cleanString(formData.country) || 'France',
        instructor: cleanString(formData.instructor),
        instructor_bio: cleanString(formData.instructor_bio),
        prerequisites: cleanString(formData.prerequisites),
        materials_needed: cleanString(formData.materials_needed),
        website: cleanString(formData.website),
        instagram: cleanString(formData.instagram),
        facebook: cleanString(formData.facebook),
        // Garder highlights et schedule comme tableaux pour le backend
        highlights: Array.isArray(formData.highlights) ? formData.highlights : [],
        schedule: Array.isArray(formData.schedule) ? formData.schedule : []
      };

      const eventData = {
        title: cleanFormData.title,
        slug: cleanFormData.slug || cleanFormData.title.toLowerCase().replace(/\s+/g, '-'),
        description: cleanFormData.description,
        long_description: cleanFormData.long_description,
        category: cleanFormData.category, // ID de la catégorie
        status: cleanFormData.status,
        featured: cleanFormData.featured,
        start_date: toIsoDateTime(cleanFormData.start_date),
        end_date: toIsoDateTime(cleanFormData.end_date),
        registration_deadline: toIsoDateTime(cleanFormData.registration_deadline),
        location: cleanFormData.location,
        address: cleanFormData.address,
        city: cleanFormData.city,
        postal_code: cleanFormData.postal_code,
        country: cleanFormData.country,
        capacity: Number(cleanFormData.capacity) || 50,
        min_participants: Number(cleanFormData.min_participants) || 1,
        price: Number(cleanFormData.price) || 0,
        currency: cleanFormData.currency || 'EUR',
        early_bird_price: cleanFormData.early_bird_price ? Number(cleanFormData.early_bird_price) : null,
        early_bird_deadline: cleanFormData.early_bird_deadline ? toIsoDateTime(cleanFormData.early_bird_deadline) : null,
        difficulty: cleanFormData.difficulty || 'all_levels',
        prerequisites: cleanFormData.prerequisites,
        instructor: cleanFormData.instructor,
        instructor_bio: cleanFormData.instructor_bio,
        highlights: cleanFormData.highlights,
        schedule: cleanFormData.schedule,
        materials_needed: cleanFormData.materials_needed,
        website: cleanFormData.website,
        instagram: cleanFormData.instagram,
        facebook: cleanFormData.facebook
      };

      // Ne pas inclure main_image si c'est vide ou null
      if (cleanFormData.main_image && cleanFormData.main_image !== '') {
        eventData.main_image = cleanFormData.main_image;
      }
      
      await ApiService.saveEvent(eventData, token, isEditing ? id : null);

      // Rediriger vers la liste des événements
      navigate('/events');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // Essayer de récupérer les détails de l'erreur du serveur
      let errorMessage = error.message;
      
      if (error.data) {
        const errorData = error.data;
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'object') {
          // Afficher les erreurs de validation
          const validationErrors = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          errorMessage = `Erreurs de validation:\n${validationErrors}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'événement...</p>
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
              {isEditing ? 'Modifier l\'événement' : 'Ajouter un événement'}
            </h1>
            <button
              onClick={() => navigate('/events')}
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
          {/* Affichage des erreurs */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Erreur lors de la sauvegarde
                  </h3>
                  <div className="mt-2 text-sm text-red-700 whitespace-pre-line">
                    {error}
                  </div>
                </div>
              </div>
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
                Titre *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="titre-de-levenement"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Sélectionner une catégorie</option>
                {Array.isArray(categories) && categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="cancelled">Annulé</option>
                <option value="completed">Terminé</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Mettre en vedette
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description courte *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description détaillée
              </label>
              <textarea
                name="long_description"
                value={formData.long_description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Dates et horaires */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Dates et horaires
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date et heure de début *
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date et heure de fin *
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date limite d'inscription *
              </label>
              <input
                type="datetime-local"
                name="registration_deadline"
                value={formData.registration_deadline}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
                <option value="all_levels">Tous niveaux</option>
              </select>
            </div>

            {/* Lieu */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Lieu
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code postal
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
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

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse complète
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Capacité et prix */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Capacité et prix
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacité maximale *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participants minimum
              </label>
              <input
                type="number"
                name="min_participants"
                value={formData.min_participants}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix *
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix early bird
              </label>
              <input
                type="number"
                name="early_bird_price"
                value={formData.early_bird_price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date limite early bird
              </label>
              <input
                type="datetime-local"
                name="early_bird_deadline"
                value={formData.early_bird_deadline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Instructeur */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Instructeur
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'instructeur
              </label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biographie de l'instructeur
              </label>
              <textarea
                name="instructor_bio"
                value={formData.instructor_bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Image */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Image principale
              </h3>
              <input
                type="file"
                name="main_image"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Réseaux sociaux */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Réseaux sociaux et contact
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site web
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
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

            {/* Informations supplémentaires */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Informations supplémentaires
              </h3>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prérequis
              </label>
              <textarea
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleInputChange}
                rows={3}
                placeholder="Prérequis pour participer à l'événement..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points forts
              </label>
              <textarea
                name="highlights"
                value={formData.highlights}
                onChange={handleInputChange}
                rows={3}
                placeholder="Listez les points forts de l'événement..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programme détaillé
              </label>
              <textarea
                name="schedule"
                value={formData.schedule}
                onChange={handleInputChange}
                rows={4}
                placeholder="Décrivez le programme de l'événement..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matériel nécessaire
              </label>
              <textarea
                name="materials_needed"
                value={formData.materials_needed}
                onChange={handleInputChange}
                rows={3}
                placeholder="Matériel nécessaire pour l'événement..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/events')}
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
                  {isEditing ? 'Mettre à jour' : 'Créer l\'événement'}
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default EventAdminForm;
