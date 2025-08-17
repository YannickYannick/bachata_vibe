from rest_framework import serializers
from .models import ArtistProfile
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les utilisateurs"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class ArtistProfileSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les profils d'artistes"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ArtistProfile
        fields = [
            'id', 'user', 'artist_name', 'bio', 'short_bio', 'specialties',
            'dance_styles', 'base_location', 'travel_radius', 'willing_to_travel',
            'teaching_experience', 'performance_experience', 'certifications',
            'awards', 'website', 'instagram', 'facebook', 'youtube',
            'tiktok', 'profile_image', 'gallery', 'demo_video',
            'views_count', 'rating', 'reviews_count', 'is_verified',
            'is_featured', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'views_count', 'rating', 'reviews_count',
            'is_verified', 'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        # Assigner l'utilisateur connecté
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate(self, data):
        # Vérifier que le rayon de voyage est positif
        if data.get('travel_radius') and data['travel_radius'] < 0:
            raise serializers.ValidationError(
                "Le rayon de voyage doit être positif."
            )
        
        return data

class ArtistProfileListSerializer(serializers.ModelSerializer):
    """Sérialiseur simplifié pour la liste des artistes"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = ArtistProfile
        fields = [
            'id', 'artist_name', 'user_name', 'short_bio', 'specialties',
            'dance_styles', 'base_location', 'profile_image', 'rating',
            'reviews_count', 'is_featured', 'created_at'
        ]


