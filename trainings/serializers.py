from rest_framework import serializers
from .models import Training
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les utilisateurs"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class TrainingSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les formations et entraînements"""
    creator = UserSerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)
    
    # Champs calculés
    duration_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Training
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'training_type', 'difficulty', 'status', 'creator', 'approved_by',
            'approved_at', 'start_date', 'end_date', 'duration_minutes',
            'schedule', 'location', 'address', 'city', 'postal_code',
            'country', 'price', 'currency', 'is_free', 'max_participants',
            'current_participants', 'main_image', 'gallery', 'video_url',
            'curriculum', 'prerequisites', 'materials_needed', 'objectives',
            'tags', 'duration_display', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'slug', 'creator', 'approved_by', 'approved_at',
            'current_participants', 'duration_display', 'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        # Assigner l'utilisateur connecté comme créateur
        validated_data['creator'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate(self, data):
        # Vérifier que la date de fin est après la date de début
        if data.get('start_date') and data.get('end_date'):
            if data['start_date'] >= data['end_date']:
                raise serializers.ValidationError(
                    "La date de fin doit être après la date de début."
                )
        
        # Vérifier que la durée est positive
        if data.get('duration_minutes') and data['duration_minutes'] <= 0:
            raise serializers.ValidationError(
                "La durée doit être positive."
            )
        
        # Vérifier que le prix est positif si pas gratuit
        if not data.get('is_free', False) and data.get('price', 0) <= 0:
            raise serializers.ValidationError(
                "Le prix doit être positif pour une formation payante."
            )
        
        return data

class TrainingListSerializer(serializers.ModelSerializer):
    """Sérialiseur simplifié pour la liste des formations"""
    creator_name = serializers.CharField(source='creator.get_full_name', read_only=True)
    duration_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Training
        fields = [
            'id', 'title', 'slug', 'short_description', 'training_type',
            'difficulty', 'city', 'start_date', 'duration_minutes',
            'duration_display', 'price', 'currency', 'is_free',
            'max_participants', 'current_participants', 'main_image',
            'created_at'
        ]







