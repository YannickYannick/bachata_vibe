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
    
    # Champs calculés pour la compatibilité frontend
    primary_specialty = serializers.SerializerMethodField()
    level = serializers.SerializerMethodField()
    profile_picture = serializers.ImageField(source='profile_image', read_only=True)
    country = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    years_experience = serializers.IntegerField(source='teaching_experience', read_only=True)
    awards_count = serializers.SerializerMethodField()
    courses_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ArtistProfile
        fields = [
            'id', 'user', 'artist_name', 'bio', 'short_bio', 'specialties',
            'primary_specialty', 'level', 'dance_styles', 'base_location', 
            'country', 'city', 'travel_radius', 'willing_to_travel',
            'teaching_experience', 'years_experience', 'performance_experience', 
            'certifications', 'awards', 'awards_count', 'courses_count',
            'website', 'instagram', 'facebook', 'youtube',
            'tiktok', 'profile_image', 'profile_picture', 'gallery', 'demo_video',
            'views_count', 'rating', 'reviews_count', 'is_verified',
            'is_featured', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'views_count', 'rating', 'reviews_count',
            'is_verified', 'primary_specialty', 'level', 'profile_picture',
            'country', 'city', 'years_experience', 'awards_count', 'courses_count',
            'created_at', 'updated_at'
        ]
    
    def get_primary_specialty(self, obj):
        """Retourne la première spécialité comme spécialité principale"""
        return obj.specialties[0] if obj.specialties else 'bachata'
    
    def get_level(self, obj):
        """Détermine le niveau basé sur l'expérience"""
        experience = obj.teaching_experience
        if experience >= 10:
            return 'professional'
        elif experience >= 5:
            return 'advanced'
        elif experience >= 2:
            return 'intermediate'
        else:
            return 'beginner'
    
    def get_country(self, obj):
        """Extrait le pays de base_location"""
        # Supposons que base_location est au format "Ville, Pays"
        if ',' in obj.base_location:
            return obj.base_location.split(',')[-1].strip()
        return obj.base_location
    
    def get_city(self, obj):
        """Extrait la ville de base_location"""
        # Supposons que base_location est au format "Ville, Pays"
        if ',' in obj.base_location:
            return obj.base_location.split(',')[0].strip()
        return obj.base_location
    
    def get_awards_count(self, obj):
        """Retourne le nombre de récompenses"""
        return len(obj.awards) if obj.awards else 0
    
    def get_courses_count(self, obj):
        """Retourne le nombre de cours créés (à implémenter avec relation)"""
        # TODO: Ajouter la relation avec les cours quand elle sera disponible
        return 0
    
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





















