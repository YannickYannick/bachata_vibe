from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Service
from .serializers import ServiceSerializer
from django.db import models

class ServiceViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour les services de soins et bien-être
    """
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'city', 'is_available', 'is_featured']
    search_fields = ['title', 'description', 'practitioner_name', 'city']
    ordering_fields = ['price', 'duration', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Service.objects.filter(is_available=True)
        
        # Filtrage par catégorie
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
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
            queryset = queryset.filter(duration__lte=max_duration)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Récupère les services mis en avant"""
        featured_services = self.get_queryset().filter(
            is_featured=True,
            is_available=True
        ).order_by('-created_at')[:6]
        
        serializer = self.get_serializer(featured_services, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche avancée de services"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Paramètre de recherche requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        services = self.get_queryset().filter(
            models.Q(title__icontains=query) |
            models.Q(description__icontains=query) |
            models.Q(practitioner_name__icontains=query) |
            models.Q(city__icontains=query) |
            models.Q(benefits__contains=[query])
        )
        
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Récupère les services par catégorie"""
        category = request.query_params.get('category', '')
        if not category:
            return Response({'error': 'Catégorie requise'}, status=status.HTTP_400_BAD_REQUEST)
        
        services = self.get_queryset().filter(category=category)
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data)






