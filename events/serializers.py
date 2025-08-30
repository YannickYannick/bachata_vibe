from rest_framework import serializers
from .models import Event, EventCategory, EventEnrollment, EventReview, EventWaitlist
from accounts.serializers import UserProfileSerializer

class EventCategorySerializer(serializers.ModelSerializer):
    """Serializer pour les catégories d'événements"""
    
    class Meta:
        model = EventCategory
        fields = ['id', 'name', 'slug', 'description', 'color', 'icon']

class EventReviewSerializer(serializers.ModelSerializer):
    """Serializer pour les avis d'événements"""
    
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_avatar = serializers.CharField(source='user.profile.avatar', read_only=True)
    
    class Meta:
        model = EventReview
        fields = ['id', 'rating', 'comment', 'user_name', 'user_avatar', 'created_at']
        read_only_fields = ['user', 'created_at']

class EventEnrollmentSerializer(serializers.ModelSerializer):
    """Serializer pour les inscriptions aux événements"""
    
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = EventEnrollment
        fields = [
            'id', 'event', 'user', 'status', 'payment_status', 'enrollment_date',
            'price_paid', 'currency', 'special_requests', 'dietary_restrictions',
            'emergency_contact', 'user_name', 'user_email', 'event_title'
        ]
        read_only_fields = ['user', 'enrollment_date', 'price_paid', 'currency']

class EventSerializer(serializers.ModelSerializer):
    """Serializer principal pour les événements"""
    
    category = EventCategorySerializer(read_only=True)
    organizer_name = serializers.CharField(source='organizer.get_full_name', read_only=True)
    available_spots = serializers.IntegerField(read_only=True)
    enrollment_rate = serializers.FloatField(read_only=True)
    is_registration_open = serializers.BooleanField(read_only=True)
    is_upcoming = serializers.BooleanField(read_only=True)
    current_price = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)
    reviews_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'description', 'long_description', 'category',
            'status', 'featured', 'start_date', 'end_date', 'registration_deadline',
            'location', 'address', 'city', 'postal_code', 'country', 'capacity',
            'min_participants', 'price', 'currency', 'early_bird_price',
            'early_bird_deadline', 'difficulty', 'prerequisites', 'organizer',
            'organizer_name', 'instructor', 'instructor_bio', 'main_image',
            'gallery', 'highlights', 'schedule', 'materials_needed', 'website',
            'instagram', 'facebook', 'available_spots', 'enrollment_rate',
            'is_registration_open', 'is_upcoming', 'current_price',
            'reviews_count', 'average_rating', 'created_at', 'updated_at'
        ]
        read_only_fields = ['organizer', 'created_at', 'updated_at', 'views_count']
    
    def get_reviews_count(self, obj):
        return obj.reviews.count()
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 0
        total = sum(review.rating for review in reviews)
        return round(total / len(reviews), 1)

class EventDetailSerializer(EventSerializer):
    """Serializer détaillé pour un événement spécifique"""
    
    enrollments = EventEnrollmentSerializer(many=True, read_only=True)
    reviews = EventReviewSerializer(many=True, read_only=True)
    user_enrollment = serializers.SerializerMethodField()
    
    class Meta(EventSerializer.Meta):
        fields = EventSerializer.Meta.fields + [
            'enrollments', 'reviews', 'user_enrollment'
        ]
    
    def get_user_enrollment(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                enrollment = obj.enrollments.get(user=request.user)
                return EventEnrollmentSerializer(enrollment).data
            except EventEnrollment.DoesNotExist:
                return None
        return None

class EventCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour créer/modifier un événement"""
    
    class Meta:
        model = Event
        fields = [
            'title', 'slug', 'description', 'long_description', 'category',
            'status', 'featured', 'start_date', 'end_date', 'registration_deadline',
            'location', 'address', 'city', 'postal_code', 'country', 'capacity',
            'min_participants', 'price', 'currency', 'early_bird_price',
            'early_bird_deadline', 'difficulty', 'prerequisites', 'instructor',
            'instructor_bio', 'main_image', 'gallery', 'highlights', 'schedule',
            'materials_needed', 'website', 'instagram', 'facebook'
        ]
    
    def validate(self, data):
        """Validation personnalisée"""
        # Vérifier que la date de fin est après la date de début
        if data['end_date'] <= data['start_date']:
            raise serializers.ValidationError(
                "La date de fin doit être après la date de début."
            )
        
        # Vérifier que la date limite d'inscription est avant la date de début
        if data['registration_deadline'] >= data['start_date']:
            raise serializers.ValidationError(
                "La date limite d'inscription doit être avant la date de début."
            )
        
        # Vérifier que le prix early bird est inférieur au prix normal
        if (data.get('early_bird_price') and data.get('price') and 
            data['early_bird_price'] >= data['price']):
            raise serializers.ValidationError(
                "Le prix early bird doit être inférieur au prix normal."
            )
        
        # Vérifier que la date limite early bird est avant la date limite d'inscription
        if (data.get('early_bird_deadline') and data.get('registration_deadline') and
            data['early_bird_deadline'] >= data['registration_deadline']):
            raise serializers.ValidationError(
                "La date limite early bird doit être avant la date limite d'inscription."
            )
        
        return data
    
    def create(self, validated_data):
        """Override create pour définir automatiquement l'organisateur"""
        validated_data['organizer'] = self.context['request'].user
        return super().create(validated_data)

class EventEnrollmentCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer une inscription à un événement"""
    
    class Meta:
        model = EventEnrollment
        fields = [
            'event', 'special_requests', 'dietary_restrictions', 'emergency_contact'
        ]
    
    def validate(self, data):
        """Validation personnalisée"""
        event = data['event']
        user = self.context['request'].user
        
        # Vérifier que l'événement est publié
        if event.status != 'published':
            raise serializers.ValidationError(
                "Impossible de s'inscrire à un événement non publié."
            )
        
        # Vérifier que les inscriptions sont ouvertes
        if not event.is_registration_open:
            raise serializers.ValidationError(
                "Les inscriptions sont fermées pour cet événement."
            )
        
        # Vérifier qu'il y a des places disponibles
        if event.available_spots <= 0:
            raise serializers.ValidationError(
                "Aucune place disponible pour cet événement."
            )
        
        # Vérifier que l'utilisateur n'est pas déjà inscrit
        if EventEnrollment.objects.filter(event=event, user=user).exists():
            raise serializers.ValidationError(
                "Vous êtes déjà inscrit à cet événement."
            )
        
        return data
    
    def create(self, validated_data):
        """Override create pour définir automatiquement l'utilisateur et le prix"""
        validated_data['user'] = self.context['request'].user
        validated_data['price_paid'] = validated_data['event'].current_price
        validated_data['currency'] = validated_data['event'].currency
        
        # Vérifier s'il y a des places disponibles
        event = validated_data['event']
        if event.available_spots <= 0:
            # Mettre en liste d'attente
            validated_data['status'] = 'waitlist'
            EventWaitlist.objects.create(event=event, user=validated_data['user'])
        else:
            validated_data['status'] = 'pending'
        
        return super().create(validated_data)

class EventSearchSerializer(serializers.Serializer):
    """Serializer pour la recherche d'événements"""
    
    query = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    difficulty = serializers.CharField(required=False, allow_blank=True)
    price_min = serializers.DecimalField(max_digits=8, decimal_places=2, required=False)
    price_max = serializers.DecimalField(max_digits=8, decimal_places=2, required=False)
    date_from = serializers.DateTimeField(required=False)
    date_to = serializers.DateTimeField(required=False)
    featured = serializers.BooleanField(required=False)
    available_spots = serializers.BooleanField(required=False)

class EventStatsSerializer(serializers.Serializer):
    """Serializer pour les statistiques des événements"""
    
    total_events = serializers.IntegerField()
    upcoming_events = serializers.IntegerField()
    total_enrollments = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    events_by_category = serializers.DictField()
    events_by_city = serializers.DictField()
    average_rating = serializers.FloatField()
