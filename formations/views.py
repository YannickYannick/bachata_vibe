from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count, F
from django.contrib.auth.models import User
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.core.paginator import Paginator
from django.db.models.functions import Coalesce

from .models import (
    FormationCategory, FormationArticle, FormationFavorite, 
    FormationComment, FormationProgress, FormationMedia, FormationSearchLog
)
from .serializers import (
    FormationCategorySerializer, FormationCategoryTreeSerializer,
    FormationArticleListSerializer, FormationArticleDetailSerializer,
    FormationFavoriteSerializer, FormationCommentSerializer,
    FormationProgressSerializer, FormationSearchSerializer,
    FormationSearchResultSerializer, FormationStatsSerializer
)
from .permissions import IsAuthorOrReadOnly, IsAdminOrReadOnly


class FormationCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les catégories de formation"""
    queryset = FormationCategory.objects.filter(is_active=True)
    serializer_class = FormationCategorySerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]  # Permettre l'accès public
    
    def get_queryset(self):
        """Retourne les catégories avec leurs enfants"""
        return FormationCategory.objects.filter(
            is_active=True,
            parent__isnull=True  # Seulement les catégories racines
        ).prefetch_related('children')
    
    @action(detail=False, methods=['get'])
    def tree(self, request):
        """Retourne l'arborescence complète des catégories"""
        categories = FormationCategory.objects.filter(
            is_active=True,
            parent__isnull=True
        ).prefetch_related('children')
        
        serializer = FormationCategoryTreeSerializer(categories, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def articles(self, request, slug=None):
        """Retourne les articles d'une catégorie"""
        category = self.get_object()
        
        # Récupérer tous les articles de cette catégorie et ses sous-catégories
        def get_category_articles(cat):
            articles = list(FormationArticle.objects.filter(category=cat, status='published'))
            for child in cat.children.filter(is_active=True):
                articles.extend(get_category_articles(child))
            return articles
        
        all_articles = get_category_articles(category)
        
        # Pagination
        page = request.query_params.get('page', 1)
        page_size = min(int(request.query_params.get('page_size', 10)), 50)
        
        paginator = Paginator(all_articles, page_size)
        try:
            articles_page = paginator.page(page)
        except:
            articles_page = paginator.page(1)
        
        serializer = FormationArticleListSerializer(articles_page.object_list, many=True, context={'request': request})
        
        return Response({
            'articles': serializer.data,
            'total_count': paginator.count,
            'page': int(page),
            'page_size': page_size,
            'total_pages': paginator.num_pages,
            'category': FormationCategorySerializer(category, context={'request': request}).data
        })


class FormationArticleViewSet(viewsets.ModelViewSet):
    """ViewSet pour les articles de formation"""
    queryset = FormationArticle.objects.all()
    serializer_class = FormationArticleListSerializer
    lookup_field = 'slug'
    pagination_class = PageNumberPagination
    permission_classes = [permissions.AllowAny]  # Permettre l'accès public temporairement
    
    def get_queryset(self):
        """Retourne les articles selon l'utilisateur et l'action"""
        # Simplification maximale pour déboguer
        return FormationArticle.objects.filter(status='published')
    
    def perform_create(self, serializer):
        """Crée un article avec l'auteur actuel"""
        serializer.save(author=self.request.user)
    
    def perform_update(self, serializer):
        """Met à jour un article"""
        serializer.save()
    
    def get_serializer_class(self):
        """Retourne le bon sérialiseur selon l'action"""
        if self.action == 'retrieve':
            return FormationArticleDetailSerializer
        return FormationArticleListSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Récupère un article et incrémente le compteur de vues"""
        article = self.get_object()
        
        # Incrémenter le compteur de vues
        article.increment_views()
        
        # Créer/mettre à jour la progression de l'utilisateur
        if request.user.is_authenticated:
            progress, created = FormationProgress.objects.get_or_create(
                user=request.user,
                article=article,
                defaults={'is_started': True}
            )
            if not created:
                progress.is_started = True
                progress.save()
        
        serializer = self.get_serializer(article)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Retourne les articles en vedette"""
        articles = self.get_queryset().order_by('-views_count', '-likes_count')[:6]
        serializer = self.get_serializer(articles, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Retourne les articles récents"""
        articles = self.get_queryset().order_by('-published_at')[:10]
        serializer = self.get_serializer(articles, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_level(self, request):
        """Retourne les articles groupés par niveau"""
        levels = {}
        for level_choice in FormationArticle.LEVEL_CHOICES:
            level_code = level_choice[0]
            level_name = level_choice[1]
            articles = self.get_queryset().filter(level=level_code)[:5]
            levels[level_code] = {
                'name': level_name,
                'articles': FormationArticleListSerializer(articles, many=True, context={'request': request}).data
            }
        
        return Response(levels)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Retourne les statistiques des articles"""
        total_articles = self.get_queryset().count()
        total_views = sum(article.views_count for article in self.get_queryset())
        total_likes = sum(article.likes_count for article in self.get_queryset())
        
        articles_by_level = {}
        for level_choice in FormationArticle.LEVEL_CHOICES:
            level_code = level_choice[0]
            level_name = level_choice[1]
            count = self.get_queryset().filter(level=level_code).count()
            articles_by_level[level_code] = {
                'name': level_name,
                'count': count
            }
        
        most_popular = self.get_queryset().order_by('-views_count')[:5]
        recent_articles = self.get_queryset().order_by('-published_at')[:5]
        
        return Response({
            'total_articles': total_articles,
            'total_views': total_views,
            'total_likes': total_likes,
            'articles_by_level': articles_by_level,
            'most_popular_articles': FormationArticleListSerializer(most_popular, many=True, context={'request': request}).data,
            'recent_articles': FormationArticleListSerializer(recent_articles, many=True, context={'request': request}).data
        })
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche dans les articles"""
        query = request.query_params.get('search', '')
        if query:
            queryset = self.get_queryset().filter(
                Q(title__icontains=query) |
                Q(content__icontains=query) |
                Q(excerpt__icontains=query) |
                Q(category__name__icontains=query)
            )
        else:
            queryset = self.get_queryset()
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class FormationFavoriteViewSet(viewsets.ModelViewSet):
    """ViewSet pour les favoris de formation"""
    serializer_class = FormationFavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourne les favoris de l'utilisateur connecté"""
        return FormationFavorite.objects.filter(
            user=self.request.user,
            is_active=True
        ).select_related('article', 'article__author', 'article__category')
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """Ajoute ou supprime un article des favoris"""
        article_id = request.data.get('article_id')
        if not article_id:
            return Response({'error': 'article_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            article = FormationArticle.objects.get(id=article_id, status='published')
        except FormationArticle.DoesNotExist:
            return Response({'error': 'Article non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        
        favorite, created = FormationFavorite.objects.get_or_create(
            user=request.user,
            article=article,
            defaults={'is_active': True}
        )
        
        if not created:
            # Si le favori existe déjà, inverser son état
            favorite.is_active = not favorite.is_active
            favorite.save()
        
        # Mettre à jour le compteur de likes de l'article
        article.update_likes_count()
        
        return Response({
            'is_favorited': favorite.is_active,
            'message': 'Ajouté aux favoris' if favorite.is_active else 'Retiré des favoris'
        })


class FormationCommentViewSet(viewsets.ModelViewSet):
    """ViewSet pour les commentaires de formation"""
    serializer_class = FormationCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    
    def get_queryset(self):
        """Retourne les commentaires approuvés"""
        return FormationComment.objects.filter(
            is_approved=True,
            is_active=True,
            parent__isnull=True  # Seulement les commentaires parents
        ).select_related('author', 'article').prefetch_related('replies')
    
    def perform_create(self, serializer):
        """Crée un commentaire avec l'auteur actuel"""
        serializer.save(author=self.request.user)
        
        # Mettre à jour le compteur de commentaires de l'article
        article = serializer.instance.article
        article.update_comments_count()
    
    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """Répondre à un commentaire"""
        parent_comment = self.get_object()
        content = request.data.get('content')
        
        if not content:
            return Response({'error': 'Contenu requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        reply = FormationComment.objects.create(
            article=parent_comment.article,
            author=request.user,
            parent=parent_comment,
            content=content
        )
        
        # Mettre à jour le compteur de commentaires de l'article
        parent_comment.article.update_comments_count()
        
        serializer = self.get_serializer(reply)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FormationProgressViewSet(viewsets.ModelViewSet):
    """ViewSet pour la progression de formation"""
    serializer_class = FormationProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Retourne la progression de l'utilisateur connecté"""
        return FormationProgress.objects.filter(
            user=self.request.user
        ).select_related('article', 'article__author', 'article__category')
    
    @action(detail=False, methods=['post'])
    def update_progress(self, request):
        """Met à jour la progression de lecture d'un article"""
        article_id = request.data.get('article_id')
        progress_percentage = request.data.get('progress_percentage', 0)
        reading_time = request.data.get('reading_time', 0)
        
        if not article_id:
            return Response({'error': 'article_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            article = FormationArticle.objects.get(id=article_id, status='published')
        except FormationArticle.DoesNotExist:
            return Response({'error': 'Article non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        
        progress, created = FormationProgress.objects.get_or_create(
            user=request.user,
            article=article,
            defaults={
                'progress_percentage': progress_percentage,
                'total_reading_time': reading_time,
                'is_started': True
            }
        )
        
        if not created:
            progress.progress_percentage = progress_percentage
            progress.total_reading_time += reading_time
            progress.save()
        
        # Mettre à jour les métadonnées
        progress.update_progress(progress_percentage)
        
        serializer = self.get_serializer(progress)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Retourne le tableau de bord de progression de l'utilisateur"""
        progress_list = self.get_queryset()
        
        total_articles_started = progress_list.filter(is_started=True).count()
        total_articles_completed = progress_list.filter(is_completed=True).count()
        total_reading_time = sum(progress.total_reading_time for progress in progress_list)
        
        # Articles récemment lus
        recently_read = progress_list.order_by('-last_read_at')[:5]
        
        # Progression par niveau
        progress_by_level = {}
        for level_choice in FormationArticle.LEVEL_CHOICES:
            level_code = level_choice[0]
            level_name = level_choice[1]
            level_progress = progress_list.filter(article__level=level_code)
            if level_progress.exists():
                avg_progress = sum(p.progress_percentage for p in level_progress) / level_progress.count()
                progress_by_level[level_code] = {
                    'name': level_name,
                    'average_progress': round(avg_progress, 1),
                    'articles_count': level_progress.count()
                }
        
        return Response({
            'total_articles_started': total_articles_started,
            'total_articles_completed': total_articles_completed,
            'total_reading_time_seconds': total_reading_time,
            'total_reading_time_formatted': f"{total_reading_time // 60}m {total_reading_time % 60}s",
            'recently_read': FormationProgressSerializer(recently_read, many=True, context={'request': request}).data,
            'progress_by_level': progress_by_level
        })


class FormationSearchViewSet(viewsets.ViewSet):
    """ViewSet pour la recherche de formation"""
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def search(self, request):
        """Effectue une recherche dans les articles de formation"""
        serializer = FormationSearchSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        query = data.get('query', '')
        category = data.get('category')
        level = data.get('level')
        author = data.get('author')
        sort_by = data.get('sort_by', 'relevance')
        page = data.get('page', 1)
        page_size = data.get('page_size', 10)
        
        # Construire la requête de base
        queryset = FormationArticle.objects.filter(status='published').select_related(
            'author', 'category'
        ).prefetch_related('formationfavorite_set', 'formationprogress_set', 'media_files')
        
        # Filtres
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(content__icontains=query) |
                Q(excerpt__icontains=query) |
                Q(category__name__icontains=query)
            )
        
        if category:
            queryset = queryset.filter(category__slug=category)
        
        if level:
            queryset = queryset.filter(level=level)
        
        if author:
            queryset = queryset.filter(author__username__icontains=author)
        
        # Tri
        if sort_by == 'popularity':
            queryset = queryset.order_by('-views_count', '-likes_count')
        elif sort_by == 'date':
            queryset = queryset.order_by('-published_at')
        elif sort_by == 'level':
            queryset = queryset.order_by('level', '-published_at')
        elif sort_by == 'reading_time':
            queryset = queryset.order_by('reading_time', '-published_at')
        else:  # relevance
            # Tri par pertinence (nombre de correspondances dans le titre)
            if query:
                queryset = queryset.extra(
                    select={'relevance': "CASE WHEN title ILIKE %s THEN 3 WHEN content ILIKE %s THEN 2 ELSE 1 END"},
                    select_params=[f'%{query}%', f'%{query}%']
                ).order_by('-relevance', '-views_count')
            else:
                queryset = queryset.order_by('-views_count')
        
        # Pagination
        paginator = Paginator(queryset, page_size)
        try:
            articles_page = paginator.page(page)
        except:
            articles_page = paginator.page(1)
        
        # Log de la recherche
        if request.user.is_authenticated:
            FormationSearchLog.objects.create(
                user=request.user,
                query=query,
                results_count=paginator.count,
                filters_applied={
                    'category': category,
                    'level': level,
                    'author': author,
                    'sort_by': sort_by
                },
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
        
        # Préparer la réponse
        articles_serializer = FormationArticleListSerializer(
            articles_page.object_list, 
            many=True, 
            context={'request': request}
        )
        
        result_serializer = FormationSearchResultSerializer({
            'articles': articles_serializer.data,
            'total_count': paginator.count,
            'page': page,
            'page_size': page_size,
            'total_pages': paginator.num_pages,
            'query': query,
            'filters_applied': {
                'category': category,
                'level': level,
                'author': author,
                'sort_by': sort_by
            }
        })
        
        return Response(result_serializer.data)
