import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  Eye,
  Heart,
  Plus,
  Edit,
  Trash2,
  FolderOpen,
  FileText,
  Play,
  Image as ImageIcon,
  File
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';

const FormationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadCategories();
    loadArticles();
    
    // Vérifier si l'utilisateur est admin
    if (user && user.user_type === 'admin') {
      setIsAdmin(true);
    }
  }, [user]);

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/formations/categories/tree/');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const loadArticles = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:8000/api/formations/articles/';
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedLevel !== 'all') params.append('level', selectedLevel);
      if (sortBy) params.append('sort_by', sortBy);
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setArticles(data.results || data);
      } else {
        throw new Error('Erreur lors du chargement des articles');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [searchTerm, selectedCategory, selectedLevel, sortBy]);

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category ? category.slug : null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadArticles();
  };

  const handleDeleteArticle = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const confirmDeleteArticle = async () => {
    if (!articleToDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/formations/articles/${articleToDelete.slug}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setArticles(articles.filter(a => a.slug !== articleToDelete.slug));
        setShowDeleteModal(false);
        setArticleToDelete(null);
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'article');
    }
  };

  const renderCategoryTree = (categoryList, level = 0) => {
    return categoryList.map(category => (
      <div key={category.id} className="mb-2">
        <div 
          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
            selectedCategory === category.slug 
              ? 'bg-purple-100 border-l-4 border-purple-500' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => handleCategorySelect(category)}
        >
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">{level * 20}px</span>
            {category.children && category.children.length > 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category.id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <span className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{category.name}</span>
            <span className="text-xs text-gray-500">({category.articles_count})</span>
          </div>
        </div>
        
        {category.children && category.children.length > 0 && expandedCategories.has(category.id) && (
          <div className="ml-6 mt-2">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return level;
    }
  };

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Play className="w-4 h-4" />;
      case 'audio': return <Play className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-300 rounded"></div>
              </div>
              <div className="lg:col-span-3">
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 Centre de Formation Bachata
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos articles, tutoriels et ressources pour progresser en Bachata.
            Organisés par niveau et catégorie pour un apprentissage structuré.
          </p>

          {/* Bouton d'ajout pour les admins */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <button
                onClick={() => navigate('/admin/formations/add')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un article
              </button>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Arborescence des catégories */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm p-6 sticky top-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FolderOpen className="w-5 h-5 mr-2" />
                Catégories
              </h3>
              
              {/* Recherche dans les catégories */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Rechercher une catégorie..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Arborescence */}
              <div className="space-y-1">
                {renderCategoryTree(categories)}
              </div>

              {/* Filtres */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Filtres</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Niveau</label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">Tous les niveaux</option>
                      <option value="beginner">Débutant</option>
                      <option value="intermediate">Intermédiaire</option>
                      <option value="advanced">Avancé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Tri</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="date">Plus récents</option>
                      <option value="popularity">Plus populaires</option>
                      <option value="level">Par niveau</option>
                      <option value="reading_time">Temps de lecture</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contenu principal - Liste des articles */}
          <div className="lg:col-span-3">
            {/* Barre de recherche */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6 mb-6"
            >
              <form onSubmit={handleSearch} className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher dans les articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </button>
              </form>
            </motion.div>

            {/* Résultats de recherche */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Liste des articles */}
            <div className="space-y-6">
              {articles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun article trouvé
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedCategory || selectedLevel !== 'all'
                      ? 'Essayez de modifier vos critères de recherche'
                      : 'Aucun article n\'est disponible pour le moment'}
                  </p>
                </motion.div>
              ) : (
                articles.map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* En-tête de l'article */}
                          <div className="flex items-center space-x-3 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(article.level)}`}>
                              {getLevelLabel(article.level)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {article.category?.name}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {article.reading_time} min
                            </span>
                          </div>

                          {/* Titre et auteur */}
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            <Link 
                              to={`/formations/${article.slug}`}
                              className="hover:text-purple-600 transition-colors"
                            >
                              {article.title}
                            </Link>
                          </h3>

                          {/* Extrait */}
                          {article.excerpt && (
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {article.excerpt}
                            </p>
                          )}

                          {/* Métadonnées */}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span>Par {article.author?.username}</span>
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {article.views_count} vues
                              </span>
                              <span className="flex items-center">
                                <Heart className="w-4 h-4 mr-1" />
                                {article.likes_count} likes
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {/* Boutons d'action */}
                              <Link
                                to={`/formations/${article.slug}`}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                              >
                                <BookOpen className="w-4 h-4 mr-1" />
                                Lire
                              </Link>

                              {/* Boutons d'administration */}
                              {isAdmin && (
                                <>
                                  <button
                                    onClick={() => navigate(`/admin/formations/edit/${article.slug}`)}
                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    title="Modifier"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteArticle(article)}
                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Image à la une */}
                        {article.featured_image && (
                          <div className="ml-6 flex-shrink-0">
                            <img
                              src={article.featured_image}
                              alt={article.title}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l'article "{articleToDelete?.title}" ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteArticle}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FormationsPage;
