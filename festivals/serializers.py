from rest_framework import serializers
from .models import Festival, FestivalEnrollment
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les utilisateurs"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class FestivalSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les festivals"""
    creator = UserSerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)
    artists = UserSerializer(many=True, read_only=True)
    instructors = UserSerializer(many=True, read_only=True)
    
    # Champs calculés
    is_full = serializers.ReadOnlyField()
    available_spots = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    is_ongoing = serializers.ReadOnlyField()
    duration_days = serializers.ReadOnlyField()
    
    class Meta:
        model = Festival
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'creator', 'status', 'approved_by', 'approved_at',
            'start_date', 'end_date', 'registration_deadline',
            'location', 'address', 'city', 'postal_code', 'country',
            'max_participants', 'current_participants',
            'base_price', 'currency', 'is_free',
            'schedule', 'workshops', 'performances', 'social_dances',
            'artists', 'instructors',
            'main_image', 'gallery', 'promotional_video',
            'accommodation_info', 'transportation_info', 'food_info',
            'tags', 'website_url', 'social_media',
            'is_full', 'available_spots', 'is_upcoming', 'is_ongoing', 'duration_days',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'slug', 'creator', 'approved_by', 'approved_at',
            'current_participants', 'is_full', 'available_spots',
            'is_upcoming', 'is_ongoing', 'duration_days',
            'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        # Assigner l'utilisateur connecté comme créateur
        validated_data['creator'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate(self, data):
        # Vérifier que la date de fin est après la date de début
        if data.get('end_date') and data.get('start_date'):
            if data['end_date'] <= data['start_date']:
                raise serializers.ValidationError(
                    "La date de fin doit être après la date de début."
                )
        
        # Vérifier que la date limite d'inscription est avant la date de début
        if data.get('registration_deadline') and data.get('start_date'):
            if data['registration_deadline'] >= data['start_date']:
                raise serializers.ValidationError(
                    "La date limite d'inscription doit être avant la date de début."
                )
        
        return data

class FestivalEnrollmentSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les inscriptions aux festivals"""
    festival = FestivalSerializer(read_only=True)
    participant = UserSerializer(read_only=True)
    
    class Meta:
        model = FestivalEnrollment
        fields = [
            'id', 'festival', 'participant', 'status', 'package',
            'price_paid', 'enrolled_at', 'payment_status',
            'payment_method', 'special_requests', 'dietary_restrictions'
        ]
        read_only_fields = [
            'id', 'festival', 'participant', 'enrolled_at'
        ]
    
    def create(self, validated_data):
        # Assigner l'utilisateur connecté comme participant
        validated_data['participant'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate(self, data):
        # Vérifier que le festival n'est pas complet
        festival = self.context.get('festival')
        if festival and festival.is_full:
            raise serializers.ValidationError(
                "Ce festival est complet."
            )
        
        return data

class FestivalListSerializer(serializers.ModelSerializer):
    """Sérialiseur simplifié pour la liste des festivals"""
    creator_name = serializers.CharField(source='creator.get_full_name', read_only=True)
    is_full = serializers.ReadOnlyField()
    available_spots = serializers.ReadOnlyField()
    
    class Meta:
        model = Festival
        fields = [
            'id', 'title', 'slug', 'short_description', 'status',
            'start_date', 'end_date', 'city', 'country',
            'max_participants', 'current_participants',
            'base_price', 'currency', 'is_free',
            'main_image', 'creator_name',
            'is_full', 'available_spots', 'created_at'
        ]


