from rest_framework import serializers
from .models import Article, TheoryCourse, TheoryLesson, TheoryCategory
from django.contrib.auth import get_user_model

User = get_user_model()

class TheoryCategorySerializer(serializers.ModelSerializer):
    """Sérialiseur pour les catégories de théorie avec support hiérarchique"""
    subcategories = serializers.SerializerMethodField()
    full_path = serializers.SerializerMethodField()
    level = serializers.SerializerMethodField()
    is_root = serializers.SerializerMethodField()
    is_leaf = serializers.SerializerMethodField()
    
    class Meta:
        model = TheoryCategory
        fields = [
            'id', 'name', 'description', 'color', 'icon', 'order',
            'parent', 'subcategories', 'full_path', 'level',
            'is_root', 'is_leaf'
        ]
        read_only_fields = ['id']
    
    def get_subcategories(self, obj):
        """Retourne les sous-catégories de cette catégorie"""
        subcategories = obj.subcategories.all()
        if subcategories:
            return TheoryCategorySerializer(subcategories, many=True).data
        return []
    
    def get_full_path(self, obj):
        """Retourne le chemin complet de la catégorie"""
        return obj.get_full_path()
    
    def get_level(self, obj):
        """Retourne le niveau de profondeur de la catégorie"""
        return obj.get_level()
    
    def get_is_root(self, obj):
        """Vérifie si c'est une catégorie racine"""
        return obj.is_root()
    
    def get_is_leaf(self, obj):
        """Vérifie si c'est une catégorie feuille"""
        return obj.is_leaf()

class TheoryCategoryListSerializer(serializers.ModelSerializer):
    """Sérialiseur simplifié pour la liste des catégories"""
    full_path = serializers.SerializerMethodField()
    subcategories_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TheoryCategory
        fields = [
            'id', 'name', 'color', 'icon', 'order', 'parent',
            'full_path', 'subcategories_count'
        ]
    
    def get_full_path(self, obj):
        """Retourne le chemin complet de la catégorie"""
        return obj.get_full_path()
    
    def get_subcategories_count(self, obj):
        """Retourne le nombre de sous-catégories"""
        return obj.subcategories.count()

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
    category = TheoryCategoryListSerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = TheoryCourse
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'difficulty', 'instructor', 'category', 'category_id', 'status', 
            'is_featured', 'estimated_duration', 'main_image', 'tags', 'rating',
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
