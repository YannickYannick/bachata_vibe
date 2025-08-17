from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db import models
from .models import Competition
from .serializers import CompetitionSerializer

class CompetitionViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour les compétitions de bachata
    """
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'city', 'country']
    search_fields = ['title', 'description', 'location', 'city']
    ordering_fields = ['start_date', 'prize_pool', 'created_at']
    ordering = ['-start_date']
    
    def get_queryset(self):
        queryset = Competition.objects.all()
        
        # Filtrage par statut
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            if status_filter == 'upcoming':
                queryset = queryset.filter(start_date__gt=timezone.now())
            elif status_filter == 'ongoing':
                now = timezone.now()
                queryset = queryset.filter(start_date__lte=now, end_date__gte=now)
            elif status_filter == 'completed':
                queryset = queryset.filter(end_date__lt=timezone.now())
        
        # Filtrage par catégorie
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filtrage par ville
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(city__icontains=city)
        
        # Filtrage par pays
        country = self.request.query_params.get('country', None)
        if country:
            queryset = queryset.filter(country__icontains=country)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Récupère les compétitions à venir"""
        upcoming_competitions = self.get_queryset().filter(
            start_date__gt=timezone.now(),
            status__in=['registration_open', 'registration_closed']
        ).order_by('start_date')[:10]
        
        serializer = self.get_serializer(upcoming_competitions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Récupère les compétitions mises en avant"""
        featured_competitions = self.get_queryset().filter(
            status__in=['registration_open', 'registration_closed']
        ).order_by('-created_at')[:6]
        
        serializer = self.get_serializer(featured_competitions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche avancée de compétitions"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Paramètre de recherche requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        competitions = self.get_queryset().filter(
            models.Q(title__icontains=query) |
            models.Q(description__icontains=query) |
            models.Q(location__icontains=query) |
            models.Q(city__icontains=query) |
            models.Q(tags__contains=[query])
        )
        
        serializer = self.get_serializer(competitions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Récupère les compétitions par catégorie"""
        category = request.query_params.get('category', '')
        if not category:
            return Response({'error': 'Catégorie requise'}, status=status.HTTP_400_BAD_REQUEST)
        
        competitions = self.get_queryset().filter(category=category)
        serializer = self.get_serializer(competitions, many=True)
        return Response(serializer.data)


