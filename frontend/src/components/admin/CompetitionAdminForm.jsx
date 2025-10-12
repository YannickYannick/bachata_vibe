import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';
import { 
  Save, 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Trophy,
  FileText,
  Image,
  Award
} from 'lucide-react';

const CompetitionAdminForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { token } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    city: '',
    country: 'France',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    category: 'couple',
    status: 'draft',
    location: '',
    address: '',
    postal_code: '',
    max_participants: 50,
    entry_fee: 0,
    currency: 'EUR',
    prize_pool: 0,
    rules: '',
    judging_criteria: '',
    main_image: null,
    website_url: '',
    instagram: '',
    facebook: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchCompetition();
    }
  }, [id]);

  const fetchCompetition = async () => {
    try {
      setLoading(true);
      const competition = await ApiService.getCompetition(id);
      setFormData({
        ...formData,
        title: competition.title || '',
        short_description: competition.short_description || '',
        description: competition.description || '',
        city: competition.city || '',
        country: competition.country || 'France',
        location: competition.location || '',
        address: competition.address || '',
        postal_code: competition.postal_code || '',
        start_date: competition.start_date ? competition.start_date.split('T')[0] : '',
        end_date: competition.end_date ? competition.end_date.split('T')[0] : '',
        registration_deadline: competition.registration_deadline ? competition.registration_deadline.split('T')[0] : '',
        category: competition.category || 'couple',
        status: competition.status || 'draft',
        max_participants: competition.max_participants || 50,
        entry_fee: competition.entry_fee || 0,
        currency: competition.currency || 'EUR',
        prize_pool: competition.prize_pool || 0,
        rules: competition.rules || '',
        judging_criteria: competition.judging_criteria || '',
        website_url: competition.website_url || '',
        instagram: competition.instagram || '',
        facebook: competition.facebook || '',
        main_image: competition.main_image || '',
      });
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur lors du chargement de la compétition');
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

    if (!token) {
      setError('Vous devez être connecté pour sauvegarder une compétition');
      setLoading(false);
      return;
    }

    try {
      // Validation du JSON pour judging_criteria
      if (formData.judging_criteria && formData.judging_criteria.trim()) {
        try {
          JSON.parse(formData.judging_criteria);
        } catch (e) {
          setError('Le champ "Critères de jugement" doit contenir un JSON valide. Exemple: {"technique": 40, "style": 30, "musicality": 30}');
          setLoading(false);
          return;
        }
      }

      const toIsoDateTime = (dateStr, endOfDay = false) => {
        if (!dateStr) return '';
        const time = endOfDay ? '23:59:59' : '00:00:00';
        return `${dateStr}T${time}Z`;
      };

      const competitionData = {
        title: formData.title,
        short_description: formData.short_description,
        description: formData.description,
        city: formData.city,
        country: formData.country,
        location: formData.location,
        address: formData.address,
        postal_code: formData.postal_code,
        start_date: toIsoDateTime(formData.start_date, false),
        end_date: toIsoDateTime(formData.end_date, true),
        registration_deadline: toIsoDateTime(formData.registration_deadline, false),
        category: formData.category,
        status: formData.status,
        max_participants: Number(formData.max_participants),
        entry_fee: Number(formData.entry_fee),
        currency: formData.currency,
        prize_pool: Number(formData.prize_pool),
        rules: formData.rules,
        judging_criteria: formData.judging_criteria && formData.judging_criteria.trim() ? formData.judging_criteria : '',
        website_url: formData.website_url,
        instagram: formData.instagram,
        facebook: formData.facebook,
      };

      // Ne pas inclure main_image si c'est vide ou null
      if (formData.main_image && formData.main_image !== '') {
        competitionData.main_image = formData.main_image;
      }
      
      await ApiService.saveCompetition(competitionData, token, isEditing ? id : null);

      // Rediriger vers la liste des compétitions
      navigate('/competitions');
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
        setError(error.message || 'Erreur lors de la sauvegarde de la compétition');
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
          <p className="text-gray-600">Chargement de la compétition...</p>
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
              {isEditing ? 'Modifier la compétition' : 'Ajouter une compétition'}
            </h1>
            <button
              onClick={() => navigate('/competitions')}
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
                Catégorie
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="solo">Solo</option>
                <option value="couple">Couple</option>
                <option value="group">Groupe</option>
                <option value="professional">Professionnel</option>
                <option value="amateur">Amateur</option>
                <option value="youth">Jeunesse</option>
                <option value="senior">Senior</option>
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
                <option value="registration_open">Inscriptions ouvertes</option>
                <option value="registration_closed">Inscriptions fermées</option>
                <option value="ongoing">En cours</option>
                <option value="completed">Terminée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description courte *
              </label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description complète
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Dates et lieu */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Dates et lieu
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début *
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin *
              </label>
              <input
                type="date"
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
                type="date"
                name="registration_deadline"
                value={formData.registration_deadline}
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
                Lieu (nom de la salle / lieu principal) *
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

            {/* Participants et prix */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Participants et prix
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre maximum de participants
              </label>
              <input
                type="number"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais d'inscription
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="entry_fee"
                  value={formData.entry_fee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
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
                Prix total
              </label>
              <input
                type="number"
                name="prize_pool"
                value={formData.prize_pool}
                onChange={handleInputChange}
                min="0"
                step="0.01"
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

            {/* Règlement */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Règlement et critères
              </h3>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Règlement
              </label>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={handleInputChange}
                rows={4}
                placeholder="Décrivez les règles de la compétition..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Critères de jugement (JSON)
              </label>
              <textarea
                name="judging_criteria"
                value={formData.judging_criteria}
                onChange={handleInputChange}
                rows={6}
                placeholder='Format JSON attendu, ex: {"technique": 40, "style": 30, "musicality": 30}'
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Entrez un JSON valide. Exemple: {"{"}"technique": 40, "style": 30, "musicality": 30{"}"}
              </p>
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
                name="website_url"
                value={formData.website_url}
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
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/competitions')}
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
                  {isEditing ? 'Mettre à jour' : 'Créer la compétition'}
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default CompetitionAdminForm;
