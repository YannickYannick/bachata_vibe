import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
  FileText,
  File,
  Download,
  Edit,
  Trash2,
  Send,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const FormationArticleDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadArticle();
    loadComments();
    
    // Vérifier si l'utilisateur est admin
    if (user && user.user_type === 'admin') {
      setIsAdmin(true);
    }
  }, [slug, user]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/formations/articles/${slug}/`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
        setIsFavorited(data.is_favorited);
        setUserProgress(data.user_progress);
      } else {
        throw new Error('Article non trouvé');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/formations/comments/?article=${slug}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.results || data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert('Vous devez être connecté pour ajouter aux favoris');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/formations/favorites/toggle/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ article_id: article.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.is_favorited);
        // Mettre à jour le compteur de likes
        setArticle(prev => ({
          ...prev,
          likes_count: data.is_favorited ? prev.likes_count + 1 : prev.likes_count - 1
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
    }
  };

  const updateProgress = async (percentage) => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:8000/api/formations/progress/update_progress/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          article_id: article.id, 
          progress_percentage: percentage,
          reading_time: 30 // Simuler 30 secondes de lecture
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserProgress(data);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la progression:', error);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Vous devez être connecté pour commenter');
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:8000/api/formations/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          article: article.id,
          content: newComment,
          parent: replyTo?.id || null
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prev => [comment, ...prev]);
        setNewComment('');
        setReplyTo(null);
        setReplyContent('');
        
        // Mettre à jour le compteur de commentaires
        setArticle(prev => ({
          ...prev,
          comments_count: prev.comments_count + 1
        }));
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    }
  };

  const handleDeleteArticle = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteArticle = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/formations/articles/${slug}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        navigate('/formations');
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de l\'article');
    }
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to="/formations"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Retour aux formations
          </Link>
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fil d'Ariane */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/formations" className="hover:text-purple-600">
                Formations
              </Link>
            </li>
            {article.breadcrumbs?.map((crumb, index) => (
              <li key={crumb.slug} className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-2" />
                {index === article.breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium">{crumb.name}</span>
                ) : (
                  <Link to={crumb.url} className="hover:text-purple-600">
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </motion.nav>

        {/* En-tête de l'article */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              {/* Métadonnées */}
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(article.level)}`}>
                  {getLevelLabel(article.level)}
                </span>
                <span className="text-gray-500">
                  {article.category?.name}
                </span>
                <span className="text-gray-500 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.reading_time} min de lecture
                </span>
                <span className="text-gray-500 flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {article.views_count} vues
                </span>
              </div>

              {/* Titre */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              {/* Extrait */}
              {article.excerpt && (
                <p className="text-xl text-gray-600 mb-6">
                  {article.excerpt}
                </p>
              )}

              {/* Auteur et date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    Par <span className="font-medium">{article.author?.username}</span>
                  </span>
                  <span className="text-gray-500">
                    {new Date(article.published_at || article.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-lg transition-colors ${
                      isFavorited 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => navigate(`/admin/formations/edit/${article.slug}`)}
                        className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleDeleteArticle}
                        className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Image à la une */}
            {article.featured_image && (
              <div className="ml-8 flex-shrink-0">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-48 h-48 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Progression de l'utilisateur */}
          {user && userProgress && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-900">Votre progression</span>
                <span className="text-sm text-purple-600">{userProgress.progress_percentage}%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${userProgress.progress_percentage}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-purple-600">
                <span>{userProgress.is_started ? 'Lecture commencée' : 'Non commencé'}</span>
                <span>{userProgress.is_completed ? 'Terminé' : 'En cours'}</span>
              </div>
            </div>
          )}
        </motion.header>

        {/* Contenu de l'article */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8 mb-8"
        >
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-blockquote:border-l-purple-500 prose-blockquote:bg-purple-50 prose-blockquote:text-gray-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </motion.article>

        {/* Médias attachés */}
        {article.media_files && article.media_files.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ressources attachées</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {article.media_files.map((media) => (
                <div key={media.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    {getFileTypeIcon(media.file_type)}
                    <span className="text-sm font-medium text-gray-900">{media.title}</span>
                  </div>
                  {media.description && (
                    <p className="text-sm text-gray-600 mb-3">{media.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{media.file_size_formatted}</span>
                    <button className="text-purple-600 hover:text-purple-700 flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      Télécharger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Commentaires */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2" />
            Commentaires ({article.comments_count})
          </h2>

          {/* Formulaire de commentaire */}
          {user && (
            <form onSubmit={submitComment} className="mb-8">
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows="3"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Publier
                </button>
              </div>
            </form>
          )}

          {/* Liste des commentaires */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-purple-200 pl-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{comment.author?.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {comment.can_moderate && (
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-700 mb-3">{comment.content}</p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <button className="text-gray-500 hover:text-gray-700 flex items-center">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    J'aime
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 flex items-center">
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Je n'aime pas
                  </button>
                  <button 
                    onClick={() => setReplyTo(comment)}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Répondre
                  </button>
                </div>

                {/* Formulaire de réponse */}
                {replyTo?.id === comment.id && (
                  <form onSubmit={submitComment} className="mt-4">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Répondre à ce commentaire..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows="2"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setReplyTo(null)}
                        className="px-4 py-1 text-gray-600 hover:text-gray-800"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      >
                        Répondre
                      </button>
                    </div>
                  </form>
                )}

                {/* Réponses */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-6 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">{reply.author?.username}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(reply.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-gray-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Bouton de retour */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Link
            to="/formations"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Retour aux formations
          </Link>
        </motion.div>
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
              Êtes-vous sûr de vouloir supprimer l'article "{article.title}" ?
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

export default FormationArticleDetailPage;
