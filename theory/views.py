from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db import models
from .models import Article, TheoryCourse, TheoryLesson
from .serializers import ArticleSerializer, TheoryCourseSerializer, TheoryLessonSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour les articles théoriques
    """
    queryset = Article.objects.filter(is_published=True)
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'difficulty', 'is_featured']
    search_fields = ['title', 'content', 'summary', 'tags']
    ordering_fields = ['created_at', 'updated_at', 'views_count', 'rating']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Article.objects.filter(is_published=True)
        
        # Filtrage par catégorie
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filtrage par difficulté
        difficulty = self.request.query_params.get('difficulty', None)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        # Filtrage par tags
        tags = self.request.query_params.get('tags', None)
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            queryset = queryset.filter(tags__contains=tag_list)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Récupère les articles mis en avant"""
        featured_articles = self.get_queryset().filter(
            is_featured=True
        ).order_by('-created_at')[:6]
        
        serializer = self.get_serializer(featured_articles, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche avancée d'articles"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Paramètre de recherche requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        articles = self.get_queryset().filter(
            models.Q(title__icontains=query) |
            models.Q(content__icontains=query) |
            models.Q(summary__icontains=query) |
            models.Q(tags__contains=[query])
        )
        
        serializer = self.get_serializer(articles, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """Incrémente le compteur de vues d'un article"""
        article = self.get_object()
        article.views_count += 1
        article.save()
        return Response({'status': 'Vues incrémentées'})

class TheoryCourseViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour les cours théoriques
    """
    queryset = TheoryCourse.objects.filter(status='published')
    serializer_class = TheoryCourseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['difficulty', 'is_featured']
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['created_at', 'estimated_duration', 'rating']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Récupère les cours mis en avant"""
        featured_courses = self.get_queryset().order_by('-created_at')[:6]
        
        serializer = self.get_serializer(featured_courses, many=True)
        return Response(serializer.data)

class TheoryLessonViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour les leçons théoriques
    """
    queryset = TheoryLesson.objects.all()
    serializer_class = TheoryLessonSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['course']
    search_fields = ['title', 'content']
    ordering_fields = ['order', 'duration_minutes', 'created_at']
    ordering = ['order', 'created_at']
    
    def get_queryset(self):
        queryset = TheoryLesson.objects.all()
        
        # Filtrage par cours
        course = self.request.query_params.get('course', None)
        if course:
            queryset = queryset.filter(course_id=course)
        
        return queryset
