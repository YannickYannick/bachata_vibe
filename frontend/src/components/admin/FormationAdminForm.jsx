import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Save,
  X,
  Upload,
  Plus,
  Trash2,
  Eye,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  File
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const FormationAdminForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [relatedFestivals, setRelatedFestivals] = useState([]);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' ou 'preview'
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    level: 'beginner',
    status: 'draft',
    meta_description: '',
    reading_time: 5,
    related_courses: [],
    related_festivals: [],
    related_events: []
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const isEditing = !!slug;

  useEffect(() => {
    loadCategories();
    loadRelatedData();
    
    if (isEditing) {
      loadArticle();
    }
  }, [slug]);

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/formations/categories/');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.results || data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const loadRelatedData = async () => {
    try {
      // Charger les cours
      const coursesResponse = await fetch('http://localhost:8000/api/courses/courses/');
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        setRelatedCourses(coursesData.results || coursesData);
      }

      // Charger les festivals
      const festivalsResponse = await fetch('http://localhost:8000/api/festivals/festivals/');
      if (festivalsResponse.ok) {
        const festivalsData = await festivalsResponse.json();
        setRelatedFestivals(festivalsData.results || festivalsData);
      }

      // Charger les événements
      const eventsResponse = await fetch('http://localhost:8000/api/events/events/');
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setRelatedEvents(eventsData.results || eventsData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données liées:', error);
    }
  };

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/formations/articles/${slug}/`);
      if (response.ok) {
        const article = await response.json();
        setFormData({
          title: article.title || '',
          slug: article.slug || '',
          content: article.content || '',
          excerpt: article.excerpt || '',
          category: article.category?.id || '',
          level: article.level || 'beginner',
          status: article.status || 'draft',
          meta_description: article.meta_description || '',
          reading_time: article.reading_time || 5,
          related_courses: article.related_courses?.map(c => c.id) || [],
          related_festivals: article.related_festivals?.map(f => f.id) || [],
          related_events: article.related_events?.map(e => e.id) || []
        });
        
        if (article.media_files) {
          setMediaFiles(article.media_files);
        }
      } else {
        throw new Error('Article non trouvé');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement de l\'article');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Générer le slug automatiquement pour le titre
    if (name === 'title') {
      const slug = value.toLowerCase()
        .replace(/[éèê]/g, 'e')
        .replace(/[àâ]/g, 'a')
        .replace(/[ùû]/g, 'u')
        .replace(/[ôö]/g, 'o')
        .replace(/[îï]/g, 'i')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
    
    // Effacer les erreurs
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMediaFiles = files.map(file => ({
      file,
      title: file.name,
      description: '',
      file_type: getFileType(file.type),
      order: mediaFiles.length
    }));
    
    setMediaFiles(prev => [...prev, ...newMediaFiles]);
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';
    return 'archive';
  };

  const removeMediaFile = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateMediaFile = (index, field, value) => {
    setMediaFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, [field]: value } : file
    ));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.content.trim()) newErrors.content = 'Le contenu est requis';
    if (!formData.category) newErrors.category = 'La catégorie est requise';
    if (formData.reading_time < 1) newErrors.reading_time = 'Le temps de lecture doit être positif';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      const formDataToSend = new FormData();
      
      // Données de base
      Object.keys(formData).forEach(key => {
        if (key === 'related_courses' || key === 'related_festivals' || key === 'related_events') {
          formData[key].forEach(id => {
            formDataToSend.append(key, id);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Fichiers média
      mediaFiles.forEach((media, index) => {
        if (media.file instanceof File) {
          formDataToSend.append(`media_files[${index}][file]`, media.file);
          formDataToSend.append(`media_files[${index}][title]`, media.title);
          formDataToSend.append(`media_files[${index}][description]`, media.description);
          formDataToSend.append(`media_files[${index}][file_type]`, media.file_type);
          formDataToSend.append(`media_files[${index}][order]`, media.order);
        }
      });
      
      const url = isEditing 
        ? `http://localhost:8000/api/formations/articles/${slug}/`
        : 'http://localhost:8000/api/formations/articles/';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: formDataToSend
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(isEditing ? 'Article modifié avec succès !' : 'Article créé avec succès !');
        navigate('/formations');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur lors de la sauvegarde: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Modifier l\'article' : 'Créer un nouvel article'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Modifiez les informations de votre article de formation' : 'Créez un nouvel article pour partager vos connaissances'}
          </p>
        </motion.div>

        {/* Formulaire */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colonne gauche */}
            <div className="space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Titre de l'article"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="slug-automatique"
                />
                <p className="mt-1 text-sm text-gray-500">
                  URL de l'article (généré automatiquement)
                </p>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Niveau */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                </select>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="draft">Brouillon</option>
                  <option value="pending">En attente de validation</option>
                  <option value="published">Publié</option>
                  <option value="archived">Archivé</option>
                </select>
              </div>

              {/* Temps de lecture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temps de lecture (minutes) *
                </label>
                <input
                  type="number"
                  name="reading_time"
                  value={formData.reading_time}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.reading_time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.reading_time && (
                  <p className="mt-1 text-sm text-red-600">{errors.reading_time}</p>
                )}
              </div>
            </div>

            {/* Colonne droite */}
            <div className="space-y-6">
              {/* Extrait */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Extrait
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Résumé court de l'article"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Maximum 500 caractères
                </p>
              </div>

              {/* Description meta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description meta
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Description pour le SEO"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Maximum 160 caractères
                </p>
              </div>

              {/* Cours liés */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cours liés
                </label>
                <select
                  multiple
                  name="related_courses"
                  value={formData.related_courses}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData(prev => ({ ...prev, related_courses: values }));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {relatedCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs cours
                </p>
              </div>

              {/* Festivals liés */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Festivals liés
                </label>
                <select
                  multiple
                  name="related_festivals"
                  value={formData.related_festivals}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData(prev => ({ ...prev, related_festivals: values }));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {relatedFestivals.map(festival => (
                    <option key={festival.id} value={festival.id}>
                      {festival.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Événements liés */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Événements liés
                </label>
                <select
                  multiple
                  name="related_events"
                  value={formData.related_events}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData(prev => ({ ...prev, related_events: values }));
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {relatedEvents.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contenu avec onglets */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Contenu HTML *
              </label>
              
              {/* Onglets */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'edit'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Éditer
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Aperçu
                </button>
              </div>
            </div>

            {/* Onglet Éditer */}
            {activeTab === 'edit' && (
              <div>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="15"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Contenu HTML de l'article..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Utilisez le HTML pour formater votre contenu. Exemple: &lt;h2&gt;Titre&lt;/h2&gt;, &lt;p&gt;Paragraphe&lt;/p&gt;
                </p>
              </div>
            )}

            {/* Onglet Aperçu */}
            {activeTab === 'preview' && (
              <div className="border border-gray-300 rounded-lg p-6 bg-white min-h-[400px]">
                {formData.content ? (
                  <div 
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-blockquote:border-l-purple-500 prose-blockquote:bg-purple-50 prose-blockquote:text-gray-700"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun contenu à prévisualiser</p>
                    <p className="text-sm">Écrivez du contenu dans l'onglet "Éditer" pour voir l'aperçu</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Médias */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Fichiers média
            </label>
            
            {/* Upload de fichiers */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="media-upload"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
              />
              <label
                htmlFor="media-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <span className="text-lg font-medium text-gray-900 mb-2">
                  Glissez vos fichiers ici ou cliquez pour sélectionner
                </span>
                <span className="text-sm text-gray-500">
                  Images, vidéos, audio, documents (max 10MB par fichier)
                </span>
              </label>
            </div>

            {/* Liste des fichiers */}
            {mediaFiles.length > 0 && (
              <div className="mt-6 space-y-4">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      {getFileTypeIcon(media.file_type)}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={media.title}
                        onChange={(e) => updateMediaFile(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Titre du fichier"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={media.description}
                        onChange={(e) => updateMediaFile(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Description"
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => removeMediaFile(index)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/formations')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <X className="w-5 h-5 mr-2" />
              Annuler
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isEditing ? 'Modifier' : 'Créer'}
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

const getFileTypeIcon = (fileType) => {
  switch (fileType) {
    case 'image': return <ImageIcon className="w-6 h-6 text-green-600" />;
    case 'video': return <Video className="w-6 h-6 text-blue-600" />;
    case 'audio': return <Music className="w-6 h-6 text-purple-600" />;
    case 'document': return <FileText className="w-6 h-6 text-orange-600" />;
    default: return <File className="w-6 h-6 text-gray-600" />;
  }
};

export default FormationAdminForm;
