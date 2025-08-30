from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Avg, Sum
from django.utils import timezone
from django.shortcuts import get_object_or_404

from .models import Event, EventCategory, EventEnrollment, EventReview, EventWaitlist
from .serializers import (
    EventSerializer, EventDetailSerializer, EventCreateUpdateSerializer,
    EventCategorySerializer, EventEnrollmentSerializer, EventEnrollmentCreateSerializer,
    EventReviewSerializer, EventSearchSerializer, EventStatsSerializer
)
from .permissions import IsEventOrganizerOrReadOnly

class EventCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les catégories d'événements"""
    
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    lookup_field = 'slug'
    
    @action(detail=True, methods=['get'])
    def events(self, request, slug=None):
        """Récupérer tous les événements d'une catégorie"""
        category = self.get_object()
        events = Event.objects.filter(
            category=category,
            status='published'
        ).order_by('start_date')
        
        page = self.paginate_queryset(events)
        if page is not None:
            serializer = EventSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)

class EventViewSet(viewsets.ModelViewSet):
    """ViewSet principal pour les événements"""
    
    queryset = Event.objects.filter(status='published').order_by('start_date')
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsEventOrganizerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'city', 'difficulty', 'featured', 'status']
    search_fields = ['title', 'description', 'location', 'instructor']
    ordering_fields = ['start_date', 'price', 'created_at', 'views_count']
    ordering = ['start_date']
    lookup_field = 'slug'
    
    def get_queryset(self):
        """Override queryset pour inclure les événements publiés et les événements de l'utilisateur"""
        queryset = Event.objects.all()
        
        # Si l'utilisateur est connecté, inclure ses événements organisés
        if self.request.user.is_authenticated:
            queryset = queryset.filter(
                Q(status='published') | Q(organizer=self.request.user)
            )
        else:
            queryset = queryset.filter(status='published')
        
        return queryset.order_by('start_date')
    
    def get_serializer_class(self):
        """Retourner le bon serializer selon l'action"""
        if self.action in ['create', 'update', 'partial_update']:
            return EventCreateUpdateSerializer
        elif self.action == 'retrieve':
            return EventDetailSerializer
        return EventSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Override retrieve pour incrémenter le compteur de vues"""
        instance = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Récupérer les événements en vedette"""
        events = self.get_queryset().filter(featured=True, status='published')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Récupérer les événements à venir"""
        events = self.get_queryset().filter(
            start_date__gt=timezone.now(),
            status='published'
        ).order_by('start_date')[:10]
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Recherche avancée d'événements"""
        serializer = EventSearchSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        
        queryset = self.get_queryset()
        
        # Filtres de base
        if serializer.validated_data.get('category'):
            queryset = queryset.filter(category__slug=serializer.validated_data['category'])
        
        if serializer.validated_data.get('city'):
            queryset = queryset.filter(city__icontains=serializer.validated_data['city'])
        
        if serializer.validated_data.get('difficulty'):
            queryset = queryset.filter(difficulty=serializer.validated_data['difficulty'])
        
        if serializer.validated_data.get('featured') is not None:
            queryset = queryset.filter(featured=serializer.validated_data['featured'])
        
        # Filtres de prix
        if serializer.validated_data.get('price_min'):
            queryset = queryset.filter(price__gte=serializer.validated_data['price_min'])
        
        if serializer.validated_data.get('price_max'):
            queryset = queryset.filter(price__lte=serializer.validated_data['price_max'])
        
        # Filtres de date
        if serializer.validated_data.get('date_from'):
            queryset = queryset.filter(start_date__gte=serializer.validated_data['date_from'])
        
        if serializer.validated_data.get('date_to'):
            queryset = queryset.filter(start_date__lte=serializer.validated_data['date_to'])
        
        # Filtre de places disponibles
        if serializer.validated_data.get('available_spots'):
            queryset = queryset.filter(
                capacity__gt=Count('enrollments', filter=Q(enrollments__status='confirmed'))
            )
        
        # Recherche textuelle
        if serializer.validated_data.get('query'):
            query = serializer.validated_data['query']
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(location__icontains=query) |
                Q(instructor__icontains=query)
            )
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques des événements"""
        events = Event.objects.filter(status='published')
        
        stats = {
            'total_events': events.count(),
            'upcoming_events': events.filter(start_date__gt=timezone.now()).count(),
            'total_enrollments': EventEnrollment.objects.filter(status='confirmed').count(),
            'total_revenue': EventEnrollment.objects.filter(
                status='confirmed',
                payment_status='paid'
            ).aggregate(total=Sum('price_paid'))['total'] or 0,
            'events_by_category': {},
            'events_by_city': {},
            'average_rating': 0
        }
        
        # Événements par catégorie
        categories = EventCategory.objects.annotate(
            event_count=Count('event', filter=Q(event__status='published'))
        )
        stats['events_by_category'] = {
            cat.name: cat.event_count for cat in categories if cat.event_count > 0
        }
        
        # Événements par ville
        cities = events.values('city').annotate(count=Count('id'))
        stats['events_by_city'] = {
            city['city']: city['count'] for city in cities if city['city']
        }
        
        # Note moyenne
        avg_rating = EventReview.objects.aggregate(avg=Avg('rating'))['avg']
        stats['average_rating'] = round(avg_rating, 1) if avg_rating else 0
        
        return Response(stats)
    
    @action(detail=True, methods=['post'])
    def enroll(self, request, slug=None):
        """S'inscrire à un événement"""
        event = self.get_object()
        serializer = EventEnrollmentCreateSerializer(
            data={'event': event.id, **request.data},
            context={'request': request}
        )
        
        if serializer.is_valid():
            enrollment = serializer.save()
            return Response(
                EventEnrollmentSerializer(enrollment).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def unenroll(self, request, slug=None):
        """Se désinscrire d'un événement"""
        event = self.get_object()
        try:
            enrollment = event.enrollments.get(user=request.user)
            enrollment.status = 'cancelled'
            enrollment.save()
            return Response({'message': 'Désinscription réussie'})
        except EventEnrollment.DoesNotExist:
            return Response(
                {'error': 'Vous n\'êtes pas inscrit à cet événement'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def add_review(self, request, slug=None):
        """Ajouter un avis à un événement"""
        event = self.get_object()
        serializer = EventReviewSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            # Vérifier que l'utilisateur a participé à l'événement
            if not event.enrollments.filter(
                user=request.user,
                status='confirmed'
            ).exists():
                return Response(
                    {'error': 'Vous devez avoir participé à l\'événement pour laisser un avis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Vérifier qu'il n'a pas déjà laissé un avis
            if event.reviews.filter(user=request.user).exists():
                return Response(
                    {'error': 'Vous avez déjà laissé un avis pour cet événement'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            review = serializer.save(event=event, user=request.user)
            return Response(
                EventReviewSerializer(review).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EventEnrollmentViewSet(viewsets.ModelViewSet):
    """ViewSet pour les inscriptions aux événements"""
    
    serializer_class = EventEnrollmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Retourner les inscriptions de l'utilisateur connecté"""
        return EventEnrollment.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_events(self, request):
        """Récupérer les événements de l'utilisateur connecté"""
        enrollments = self.get_queryset().select_related('event', 'event__category')
        
        # Séparer les événements inscrits et créés
        enrolled_events = []
        created_events = []
        
        for enrollment in enrollments:
            event_data = EventSerializer(enrollment.event, context={'request': request}).data
            enrollment_data = EventEnrollmentSerializer(enrollment).data
            
            if enrollment.event.organizer == request.user:
                created_events.append({
                    'event': event_data,
                    'enrollment': enrollment_data
                })
            else:
                enrolled_events.append({
                    'event': event_data,
                    'enrollment': enrollment_data
                })
        
        return Response({
            'enrolled_events': enrolled_events,
            'created_events': created_events
        })

class EventReviewViewSet(viewsets.ModelViewSet):
    """ViewSet pour les avis d'événements"""
    
    queryset = EventReview.objects.all()
    serializer_class = EventReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """Filtrer par événement si spécifié"""
        queryset = EventReview.objects.all()
        event_id = self.request.query_params.get('event')
        if event_id:
            queryset = queryset.filter(event_id=event_id)
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        """Override perform_create pour définir automatiquement l'utilisateur"""
        serializer.save(user=self.request.user)
