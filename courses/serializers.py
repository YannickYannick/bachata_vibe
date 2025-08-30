from rest_framework import serializers
from .models import Course, CourseCategory, CourseEnrollment
from accounts.serializers import UserSerializer

class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = ['id', 'name', 'description', 'color', 'icon']

class CourseSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    category = CourseCategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    is_upcoming = serializers.ReadOnlyField()
    is_ongoing = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    available_spots = serializers.ReadOnlyField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'creator', 'category', 'category_id', 'status', 'difficulty',
            'max_participants', 'current_participants', 'start_date', 'end_date',
            'duration_minutes', 'location', 'address', 'city', 'postal_code',
            'price', 'currency', 'is_free', 'content', 'prerequisites',
            'materials_needed', 'main_image', 'gallery', 'tags',
            'is_upcoming', 'is_ongoing', 'is_full', 'available_spots',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'slug', 'creator', 'status', 'current_participants',
            'created_at', 'updated_at'
        ]
    
    def validate(self, data):
        # Vérifier que la date de fin est après la date de début
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] >= data['end_date']:
                raise serializers.ValidationError(
                    "La date de fin doit être après la date de début."
                )
        
        # Vérifier que le prix est positif si le cours n'est pas gratuit
        if not data.get('is_free', False) and data.get('price', 0) <= 0:
            raise serializers.ValidationError(
                "Le prix doit être positif pour un cours payant."
            )
        
        return data
    
    def create(self, validated_data):
        # Définir le créateur automatiquement
        validated_data['creator'] = self.context['request'].user
        return super().create(validated_data)

class CourseDetailSerializer(CourseSerializer):
    """Sérialiseur détaillé pour un cours avec plus d'informations"""
    creator = UserSerializer(read_only=True)
    category = CourseCategorySerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)
    
    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + [
            'approved_by', 'approved_at'
        ]

class CourseEnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    participant = UserSerializer(read_only=True)
    course_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = CourseEnrollment
        fields = [
            'id', 'course', 'course_id', 'participant', 'status',
            'enrolled_at', 'payment_status', 'payment_method', 'notes'
        ]
        read_only_fields = [
            'id', 'course', 'participant', 'enrolled_at'
        ]
    
    def validate(self, data):
        course_id = data.get('course_id')
        user = self.context['request'].user
        
        # Vérifier que l'utilisateur n'est pas déjà inscrit
        if CourseEnrollment.objects.filter(
            course_id=course_id, 
            participant=user
        ).exists():
            raise serializers.ValidationError(
                "Vous êtes déjà inscrit à ce cours."
            )
        
        # Vérifier que le cours existe et est approuvé
        try:
            course = Course.objects.get(id=course_id)
            if course.status != 'approved':
                raise serializers.ValidationError(
                    "Ce cours n'est pas encore approuvé."
                )
            if course.is_full:
                raise serializers.ValidationError(
                    "Ce cours est complet."
                )
        except Course.DoesNotExist:
            raise serializers.ValidationError(
                "Cours introuvable."
            )
        
        return data
    
    def create(self, validated_data):
        # Définir le participant automatiquement
        validated_data['participant'] = self.context['request'].user
        
        # Mettre à jour le nombre de participants du cours
        course = Course.objects.get(id=validated_data['course_id'])
        course.current_participants += 1
        course.save()
        
        return super().create(validated_data)

class CourseEnrollmentUpdateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour mettre à jour une inscription"""
    
    class Meta:
        model = CourseEnrollment
        fields = ['status', 'payment_status', 'payment_method', 'notes']
    
    def validate_status(self, value):
        # Empêcher la modification du statut si l'inscription est terminée
        if self.instance and self.instance.status == 'completed':
            raise serializers.ValidationError(
                "Impossible de modifier une inscription terminée."
            )
        return value

class CourseSearchSerializer(serializers.Serializer):
    """Sérialiseur pour la recherche de cours"""
    query = serializers.CharField(required=False, allow_blank=True)
    category = serializers.IntegerField(required=False)
    difficulty = serializers.CharField(required=False)
    city = serializers.CharField(required=False)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)
    price_min = serializers.DecimalField(required=False, max_digits=8, decimal_places=2)
    price_max = serializers.DecimalField(required=False, max_digits=8, decimal_places=2)
    is_free = serializers.BooleanField(required=False)
    status = serializers.CharField(required=False, default='approved')
    
    def validate(self, data):
        # Vérifier que la date de fin est après la date de début
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] >= data['end_date']:
                raise serializers.ValidationError(
                    "La date de fin doit être après la date de début."
                )
        
        # Vérifier que le prix minimum est inférieur au prix maximum
        if data.get('price_min') and data.get('price_max'):
            if data['price_min'] >= data['price_max']:
                raise serializers.ValidationError(
                    "Le prix minimum doit être inférieur au prix maximum."
                )
        
        return data









