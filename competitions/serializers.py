from rest_framework import serializers
from .models import Competition
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les utilisateurs"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class CompetitionSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les compétitions"""
    creator = UserSerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)
    judges = UserSerializer(many=True, read_only=True)
    
    class Meta:
        model = Competition
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'category', 'status', 'creator', 'approved_by', 'approved_at',
            'start_date', 'end_date', 'registration_deadline', 'schedule',
            'location', 'address', 'city', 'postal_code', 'country',
            'prize_pool', 'currency', 'prize_distribution', 'max_participants',
            'current_participants', 'registration_fee', 'main_image',
            'gallery', 'video_url', 'rules', 'judging_criteria',
            'categories', 'age_groups', 'judges', 'tags',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'slug', 'creator', 'approved_by', 'approved_at',
            'current_participants', 'created_at', 'updated_at'
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
        
        # Vérifier que la date limite d'inscription est avant la date de début
        if data.get('registration_deadline') and data.get('start_date'):
            if data['registration_deadline'] >= data['start_date']:
                raise serializers.ValidationError(
                    "La date limite d'inscription doit être avant la date de début."
                )
        
        return data

class CompetitionListSerializer(serializers.ModelSerializer):
    """Sérialiseur simplifié pour la liste des compétitions"""
    creator_name = serializers.CharField(source='creator.get_full_name', read_only=True)
    
    class Meta:
        model = Competition
        fields = [
            'id', 'title', 'slug', 'short_description', 'category',
            'status', 'city', 'start_date', 'prize_pool', 'currency',
            'max_participants', 'current_participants', 'main_image',
            'created_at'
        ]









