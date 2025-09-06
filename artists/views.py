from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db import models
from .models import ArtistProfile
from .serializers import ArtistProfileSerializer

class ArtistProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour les profils d'artistes
    """
    queryset = ArtistProfile.objects.all()
    serializer_class = ArtistProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['base_location', 'is_featured', 'is_verified']
    search_fields = ['artist_name', 'bio', 'base_location', 'specialties']
    ordering_fields = ['rating', 'reviews_count', 'views_count', 'created_at']
    ordering = ['-rating', '-created_at']
    
    def get_queryset(self):
        queryset = ArtistProfile.objects.filter(is_verified=True)
        
        # Filtrage par localisation
        location = self.request.query_params.get('location', None)
        if location:
            queryset = queryset.filter(base_location__icontains=location)
        
        # Filtrage par style de danse
        dance_style = self.request.query_params.get('dance_style', None)
        if dance_style:
            queryset = queryset.filter(dance_styles__contains=[dance_style])
        
        # Filtrage par spécialité
        specialty = self.request.query_params.get('specialty', None)
        if specialty:
            queryset = queryset.filter(specialties__contains=[specialty])
        
        # Filtrage par note minimum
        min_rating = self.request.query_params.get('min_rating', None)
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Récupère les artistes mis en avant"""
        featured_artists = self.get_queryset().filter(
            is_featured=True,
            is_verified=True
        ).order_by('-rating')[:6]
        
        serializer = self.get_serializer(featured_artists, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche avancée d'artistes"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Paramètre de recherche requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        artists = self.get_queryset().filter(
            models.Q(artist_name__icontains=query) |
            models.Q(bio__icontains=query) |
            models.Q(base_location__icontains=query) |
            models.Q(specialties__contains=[query]) |
            models.Q(dance_styles__contains=[query])
        )
        
        serializer = self.get_serializer(artists, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_location(self, request):
        """Récupère les artistes par localisation"""
        location = request.query_params.get('location', '')
        if not location:
            return Response({'error': 'Localisation requise'}, status=status.HTTP_400_BAD_REQUEST)
        
        artists = self.get_queryset().filter(base_location__icontains=location)
        serializer = self.get_serializer(artists, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_style(self, request):
        """Récupère les artistes par style de danse"""
        style = request.query_params.get('style', '')
        if not style:
            return Response({'error': 'Style de danse requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        artists = self.get_queryset().filter(dance_styles__contains=[style])
        serializer = self.get_serializer(artists, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """Incrémente le compteur de vues d'un artiste"""
        artist = self.get_object()
        artist.views_count += 1
        artist.save()
        return Response({'status': 'Vues incrémentées'})









