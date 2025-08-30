from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Festival, FestivalEnrollment
from .serializers import FestivalSerializer, FestivalEnrollmentSerializer

class FestivalViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour les festivals de bachata
    """
    queryset = Festival.objects.all()
    serializer_class = FestivalSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'city', 'country', 'is_free']
    search_fields = ['title', 'description', 'location', 'city']
    ordering_fields = ['start_date', 'end_date', 'price', 'created_at']
    ordering = ['-start_date']
    
    def get_queryset(self):
        queryset = Festival.objects.all()
        
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
        
        # Filtrage par ville
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(city__icontains=city)
        
        # Filtrage par pays
        country = self.request.query_params.get('country', None)
        if country:
            queryset = queryset.filter(country__icontains=country)
        
        # Filtrage par prix
        max_price = self.request.query_params.get('max_price', None)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filtrage par capacité
        has_spots = self.request.query_params.get('has_spots', None)
        if has_spots == 'true':
            queryset = queryset.filter(current_participants__lt=models.F('max_participants'))
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Récupère les festivals à venir"""
        upcoming_festivals = self.get_queryset().filter(
            start_date__gt=timezone.now(),
            status__in=['approved', 'ongoing']
        ).order_by('start_date')[:10]
        
        serializer = self.get_serializer(upcoming_festivals, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Récupère les festivals mis en avant"""
        featured_festivals = self.get_queryset().filter(
            status='approved'
        ).order_by('-created_at')[:6]
        
        serializer = self.get_serializer(featured_festivals, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche avancée de festivals"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Paramètre de recherche requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        festivals = self.get_queryset().filter(
            models.Q(title__icontains=query) |
            models.Q(description__icontains=query) |
            models.Q(location__icontains=query) |
            models.Q(city__icontains=query) |
            models.Q(tags__contains=[query])
        )
        
        serializer = self.get_serializer(festivals, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_festivals(self, request):
        """Festivals de l'utilisateur connecté"""
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentification requise"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Festivals créés par l'utilisateur
        created_festivals = Festival.objects.filter(creator=request.user)
        
        # Festivals auxquels l'utilisateur est inscrit
        enrolled_festivals = Festival.objects.filter(
            enrollments__participant=request.user
        ).distinct()
        
        created_serializer = FestivalSerializer(created_festivals, many=True, context={'request': request})
        enrolled_serializer = FestivalSerializer(enrolled_festivals, many=True, context={'request': request})
        
        return Response({
            'created': created_serializer.data,
            'enrolled': enrolled_serializer.data
        })

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        """Inscription à un festival"""
        festival = self.get_object()
        user = request.user
        
        if not user.is_authenticated:
            return Response({'error': 'Authentification requise'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Vérifier si l'utilisateur est déjà inscrit
        if FestivalEnrollment.objects.filter(festival=festival, participant=user).exists():
            return Response({'error': 'Déjà inscrit à ce festival'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier si le festival est complet
        if festival.current_participants >= festival.max_participants:
            return Response({'error': 'Festival complet'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Créer l'inscription
        enrollment = FestivalEnrollment.objects.create(
            festival=festival,
            participant=user,
            status='pending',
            price_paid=festival.base_price  # Ajouter le prix payé
        )
        
        # Incrémenter le nombre de participants
        festival.current_participants += 1
        festival.save()
        
        serializer = FestivalEnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def unenroll(self, request, pk=None):
        """Désinscription d'un festival"""
        festival = self.get_object()
        user = request.user
        
        if not user.is_authenticated:
            return Response({'error': 'Authentification requise'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            enrollment = FestivalEnrollment.objects.get(festival=festival, participant=user)
            enrollment.delete()
            
            # Décrémenter le nombre de participants
            festival.current_participants = max(0, festival.current_participants - 1)
            festival.save()
            
            return Response({'message': 'Désinscription réussie'}, status=status.HTTP_200_OK)
        except FestivalEnrollment.DoesNotExist:
            return Response({'error': 'Inscription non trouvée'}, status=status.HTTP_404_NOT_FOUND)

class FestivalEnrollmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour les inscriptions aux festivals
    """
    queryset = FestivalEnrollment.objects.all()
    serializer_class = FestivalEnrollmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'festival', 'participant']
    ordering = ['-enrolled_at']
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return FestivalEnrollment.objects.filter(participant=self.request.user)
        return FestivalEnrollment.objects.none()
    
    @action(detail=False, methods=['get'])
    def my_enrollments(self, request):
        """Récupère les inscriptions de l'utilisateur connecté"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentification requise'}, status=status.HTTP_401_UNAUTHORIZED)
        
        enrollments = FestivalEnrollment.objects.filter(participant=request.user)
        serializer = self.get_serializer(enrollments, many=True)
        return Response(serializer.data)







