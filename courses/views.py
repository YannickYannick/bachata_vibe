from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.utils import timezone
from datetime import datetime, timedelta

from .models import Course, CourseCategory, CourseEnrollment
from .serializers import (
    CourseSerializer, CourseDetailSerializer, CourseCategorySerializer,
    CourseEnrollmentSerializer, CourseEnrollmentUpdateSerializer,
    CourseSearchSerializer
)
from .permissions import IsCreatorOrReadOnly, IsAdminOrReadOnly

class CourseCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Vue pour les catégories de cours (lecture seule)"""
    queryset = CourseCategory.objects.all()
    serializer_class = CourseCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

class CourseViewSet(viewsets.ModelViewSet):
    """Vue pour les cours"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsCreatorOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'difficulty', 'category', 'city', 'is_free']
    search_fields = ['title', 'description', 'location', 'city']
    ordering_fields = ['start_date', 'price', 'created_at', 'current_participants']
    ordering = ['-start_date']
    
    def get_queryset(self):
        queryset = Course.objects.select_related('creator', 'category', 'approved_by')
        
        # Filtrer par statut par défaut (cours approuvés pour les visiteurs)
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(status='approved')
        elif not self.request.user.is_admin():
            # Les artistes voient leurs propres cours + cours approuvés
            if self.request.user.is_artist():
                queryset = queryset.filter(
                    Q(status='approved') | Q(creator=self.request.user)
                )
            else:
                # Les participants voient seulement les cours approuvés
                queryset = queryset.filter(status='approved')
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseSerializer
    
    def perform_create(self, serializer):
        # Définir le statut initial selon le type d'utilisateur
        if self.request.user.is_admin():
            serializer.save(creator=self.request.user, status='approved')
        else:
            serializer.save(creator=self.request.user, status='pending')
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        """S'inscrire à un cours"""
        course = self.get_object()
        user = request.user
        
        # Vérifier que l'utilisateur peut s'inscrire
        if not course.is_upcoming:
            return Response(
                {"error": "Ce cours n'est plus disponible pour les inscriptions."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if course.is_full:
            return Response(
                {"error": "Ce cours est complet."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer l'inscription
        enrollment_data = {
            'course_id': course.id,
            'status': 'pending'
        }
        
        serializer = CourseEnrollmentSerializer(
            data=enrollment_data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            enrollment = serializer.save()
            return Response(
                CourseEnrollmentSerializer(enrollment, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unenroll(self, request, pk=None):
        """Se désinscrire d'un cours"""
        course = self.get_object()
        user = request.user
        
        try:
            enrollment = CourseEnrollment.objects.get(
                course=course,
                participant=user
            )
            
            # Mettre à jour le nombre de participants
            course.current_participants = max(0, course.current_participants - 1)
            course.save()
            
            enrollment.delete()
            return Response({"message": "Désinscription réussie"}, status=status.HTTP_200_OK)
            
        except CourseEnrollment.DoesNotExist:
            return Response(
                {"error": "Vous n'êtes pas inscrit à ce cours."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def my_courses(self, request):
        """Cours de l'utilisateur connecté"""
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentification requise"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Cours créés par l'utilisateur
        created_courses = Course.objects.filter(creator=request.user)
        
        # Cours auxquels l'utilisateur est inscrit
        enrolled_courses = Course.objects.filter(
            enrollments__participant=request.user
        ).distinct()
        
        created_serializer = CourseSerializer(created_courses, many=True, context={'request': request})
        enrolled_serializer = CourseSerializer(enrolled_courses, many=True, context={'request': request})
        
        return Response({
            'created': created_serializer.data,
            'enrolled': enrolled_serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Cours à venir"""
        queryset = self.get_queryset().filter(
            start_date__gt=timezone.now(),
            status='approved'
        ).order_by('start_date')[:10]
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Cours mis en avant"""
        queryset = self.get_queryset().filter(
            status='approved'
        ).annotate(
            enrollment_count=Count('enrollments')
        ).order_by('-enrollment_count', '-created_at')[:6]
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def search(self, request):
        """Recherche avancée de cours"""
        serializer = CourseSearchSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        queryset = self.get_queryset()
        
        # Filtres de base
        if data.get('status'):
            queryset = queryset.filter(status=data['status'])
        
        if data.get('category'):
            queryset = queryset.filter(category_id=data['category'])
        
        if data.get('difficulty'):
            queryset = queryset.filter(difficulty=data['difficulty'])
        
        if data.get('city'):
            queryset = queryset.filter(city__icontains=data['city'])
        
        if data.get('start_date'):
            queryset = queryset.filter(start_date__gte=data['start_date'])
        
        if data.get('end_date'):
            queryset = queryset.filter(end_date__lte=data['end_date'])
        
        if data.get('price_min') is not None:
            queryset = queryset.filter(price__gte=data['price_min'])
        
        if data.get('price_max') is not None:
            queryset = queryset.filter(price__lte=data['price_max'])
        
        if data.get('is_free') is not None:
            queryset = queryset.filter(is_free=data['is_free'])
        
        # Recherche textuelle
        if data.get('query'):
            query = data['query']
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(location__icontains=query) |
                Q(city__icontains=query) |
                Q(tags__contains=[query])
            )
        
        # Tri par défaut
        queryset = queryset.order_by('start_date')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class CourseEnrollmentViewSet(viewsets.ModelViewSet):
    """Vue pour les inscriptions aux cours"""
    queryset = CourseEnrollment.objects.all()
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_status', 'course', 'participant']
    ordering_fields = ['enrolled_at', 'status']
    ordering = ['-enrolled_at']
    
    def get_queryset(self):
        user = self.request.user
        
        # Les admins voient toutes les inscriptions
        if user.is_admin():
            return CourseEnrollment.objects.select_related('course', 'participant')
        
        # Les artistes voient leurs inscriptions et celles à leurs cours
        if user.is_artist():
            return CourseEnrollment.objects.filter(
                Q(participant=user) | Q(course__creator=user)
            ).select_related('course', 'participant')
        
        # Les participants voient seulement leurs inscriptions
        return CourseEnrollment.objects.filter(
            participant=user
        ).select_related('course', 'participant')
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return CourseEnrollmentUpdateSerializer
        return CourseEnrollmentSerializer
    
    def perform_create(self, serializer):
        serializer.save(participant=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def confirm_payment(self, request, pk=None):
        """Confirmer le paiement d'une inscription"""
        enrollment = self.get_object()
        user = request.user
        
        # Vérifier les permissions
        if not (user.is_admin() or enrollment.course.creator == user or enrollment.participant == user):
            return Response(
                {"error": "Permission refusée"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        enrollment.payment_status = 'paid'
        enrollment.save()
        
        return Response({
            "message": "Paiement confirmé",
            "enrollment": CourseEnrollmentSerializer(enrollment, context={'request': request}).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        """Annuler une inscription"""
        enrollment = self.get_object()
        user = request.user
        
        # Vérifier les permissions
        if not (user.is_admin() or enrollment.participant == user):
            return Response(
                {"error": "Permission refusée"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Mettre à jour le statut
        enrollment.status = 'cancelled'
        enrollment.save()
        
        # Mettre à jour le nombre de participants du cours
        course = enrollment.course
        course.current_participants = max(0, course.current_participants - 1)
        course.save()
        
        return Response({"message": "Inscription annulée"})




