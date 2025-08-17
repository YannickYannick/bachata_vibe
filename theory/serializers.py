from rest_framework import serializers
from .models import Article, TheoryCourse, TheoryLesson
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les utilisateurs"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class ArticleSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les articles théoriques"""
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'content', 'summary', 'category',
            'difficulty', 'author', 'is_published', 'is_featured',
            'main_image', 'gallery', 'tags', 'views_count', 'rating',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'slug', 'author', 'views_count', 'rating',
            'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        # Assigner l'utilisateur connecté comme auteur
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

class ArticleListSerializer(serializers.ModelSerializer):
    """Sérialiseur simplifié pour la liste des articles"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'summary', 'category', 'difficulty',
            'author_name', 'main_image', 'tags', 'views_count', 'rating',
            'created_at'
        ]

class TheoryCourseSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les cours théoriques"""
    instructor = UserSerializer(read_only=True)
    
    class Meta:
        model = TheoryCourse
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'difficulty', 'instructor', 'status', 'is_featured',
            'estimated_duration', 'main_image', 'tags', 'rating',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'slug', 'instructor', 'rating', 'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        # Assigner l'utilisateur connecté comme instructeur
        validated_data['instructor'] = self.context['request'].user
        return super().create(validated_data)

class TheoryLessonSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les leçons théoriques"""
    course = TheoryCourseSerializer(read_only=True)
    
    class Meta:
        model = TheoryLesson
        fields = [
            'id', 'title', 'slug', 'content', 'course',
            'order', 'is_required', 'duration_minutes',
            'images', 'video_url', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'slug', 'created_at', 'updated_at'
        ]
