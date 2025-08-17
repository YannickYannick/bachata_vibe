from rest_framework import serializers
from .models import Service
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les utilisateurs"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class ServiceSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les services de soins"""
    practitioner = UserSerializer(read_only=True)
    
    # Champs calculés
    duration_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'category', 'practitioner', 'practitioner_name', 'practitioner_email',
            'practitioner_phone', 'qualifications', 'location', 'address',
            'city', 'postal_code', 'country', 'price', 'currency',
            'duration', 'duration_display', 'is_free', 'is_available',
            'is_featured', 'schedule', 'booking_required', 'main_image',
            'gallery', 'video_url', 'benefits', 'contraindications',
            'materials_needed', 'preparation_required', 'tags',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'slug', 'practitioner', 'duration_display',
            'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        # Assigner l'utilisateur connecté comme praticien
        validated_data['practitioner'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate(self, data):
        # Vérifier que la durée est positive
        if data.get('duration') and data['duration'] <= 0:
            raise serializers.ValidationError(
                "La durée doit être positive."
            )
        
        # Vérifier que le prix est positif si pas gratuit
        if not data.get('is_free', False) and data.get('price', 0) <= 0:
            raise serializers.ValidationError(
                "Le prix doit être positif pour un service payant."
            )
        
        return data

class ServiceListSerializer(serializers.ModelSerializer):
    """Sérialiseur simplifié pour la liste des services"""
    practitioner_name = serializers.CharField(source='practitioner_name', read_only=True)
    duration_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'short_description', 'category',
            'practitioner_name', 'city', 'price', 'currency',
            'duration', 'duration_display', 'is_free', 'is_available',
            'is_featured', 'main_image', 'created_at'
        ]


