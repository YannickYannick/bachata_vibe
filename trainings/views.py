from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db import models
from .models import Training
from .serializers import TrainingSerializer

class TrainingViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour les formations et entraînements
    """
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['difficulty', 'city', 'status', 'is_free']
    search_fields = ['title', 'description', 'location', 'city']
    ordering_fields = ['start_date', 'price', 'duration_minutes', 'created_at']
    ordering = ['-start_date']
    
    def get_queryset(self):
        queryset = Training.objects.filter(status='active')
        
        # Filtrage par difficulté
        difficulty = self.request.query_params.get('difficulty', None)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        # Filtrage par ville
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(city__icontains=city)
        
        # Filtrage par prix maximum
        max_price = self.request.query_params.get('max_price', None)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filtrage par durée
        max_duration = self.request.query_params.get('max_duration', None)
        if max_duration:
            queryset = queryset.filter(duration_minutes__lte=max_duration)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Récupère les formations à venir"""
        upcoming_trainings = self.get_queryset().filter(
            start_date__gt=timezone.now(),
            status='active'
        ).order_by('start_date')[:10]
        
        serializer = self.get_serializer(upcoming_trainings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Récupère les formations mises en avant"""
        featured_trainings = self.get_queryset().filter(
            status='active'
        ).order_by('-created_at')[:6]
        
        serializer = self.get_serializer(featured_trainings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche avancée de formations"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Paramètre de recherche requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        trainings = self.get_queryset().filter(
            models.Q(title__icontains=query) |
            models.Q(description__icontains=query) |
            models.Q(location__icontains=query) |
            models.Q(city__icontains=query) |
            models.Q(tags__contains=[query])
        )
        
        serializer = self.get_serializer(trainings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_difficulty(self, request):
        """Récupère les formations par niveau de difficulté"""
        difficulty = request.query_params.get('difficulty', '')
        if not difficulty:
            return Response({'error': 'Niveau de difficulté requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        trainings = self.get_queryset().filter(difficulty=difficulty)
        serializer = self.get_serializer(trainings, many=True)
        return Response(serializer.data)






