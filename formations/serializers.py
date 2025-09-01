from rest_framework import serializers
from .models import (
    FormationCategory, FormationArticle, FormationFavorite, 
    FormationComment, FormationProgress, FormationMedia, FormationSearchLog
)
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les utilisateurs"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class FormationCategorySerializer(serializers.ModelSerializer):
    """Sérialiseur pour les catégories de formation"""
    children = serializers.SerializerMethodField()
    articles_count = serializers.SerializerMethodField()
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    
    class Meta:
        model = FormationCategory
        fields = [
            'id', 'name', 'slug', 'description', 'parent', 'parent_name',
            'order', 'icon', 'is_active', 'children', 'articles_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_children(self, obj):
        """Retourne les sous-catégories"""
        children = obj.children.filter(is_active=True).order_by('order', 'name')
        return FormationCategorySerializer(children, many=True, context=self.context).data
    
    def get_articles_count(self, obj):
        """Retourne le nombre d'articles dans cette catégorie et ses sous-catégories"""
        return obj.get_articles_count()


class FormationCategoryTreeSerializer(serializers.ModelSerializer):
    """Sérialiseur pour l'arborescence des catégories"""
    children = serializers.SerializerMethodField()
    articles_count = serializers.SerializerMethodField()
    level = serializers.SerializerMethodField()
    
    class Meta:
        model = FormationCategory
        fields = ['id', 'name', 'slug', 'icon', 'children', 'articles_count', 'level']
    
    def get_children(self, obj):
        """Retourne les sous-catégories actives"""
        children = obj.children.filter(is_active=True).order_by('order', 'name')
        return FormationCategoryTreeSerializer(children, many=True, context=self.context).data
    
    def get_articles_count(self, obj):
        """Retourne le nombre d'articles publiés"""
        return obj.formationarticle_set.filter(status='published').count()
    
    def get_level(self, obj):
        """Retourne le niveau de profondeur de la catégorie"""
        level = 0
        current = obj
        while current.parent:
            level += 1
            current = current.parent
        return level


class FormationMediaSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les médias de formation"""
    file_size_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = FormationMedia
        fields = [
            'id', 'file', 'file_type', 'title', 'description', 'order',
            'file_size', 'file_size_formatted', 'duration', 'dimensions',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'file_size', 'created_at']
    
    def get_file_size_formatted(self, obj):
        """Retourne la taille du fichier formatée"""
        return obj.get_file_size_formatted()


class FormationArticleListSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la liste des articles de formation"""
    author = UserSerializer(read_only=True)
    category = FormationCategorySerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    excerpt = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()
    user_progress = serializers.SerializerMethodField()
    
    class Meta:
        model = FormationArticle
        fields = [
            'id', 'title', 'slug', 'excerpt', 'author', 'category', 'category_name',
            'level', 'status', 'featured_image', 'reading_time', 'views_count',
            'likes_count', 'comments_count', 'is_favorited', 'user_progress',
            'created_at', 'published_at'
        ]
        read_only_fields = ['id', 'slug', 'views_count', 'likes_count', 'comments_count', 'created_at']
    
    def get_excerpt(self, obj):
        """Retourne l'extrait ou génère un extrait depuis le contenu"""
        if obj.excerpt:
            return obj.excerpt
        # Générer un extrait depuis le contenu HTML (supprimer les balises)
        import re
        content_text = re.sub('<[^<]+?>', '', obj.content)
        return content_text[:200] + '...' if len(content_text) > 200 else content_text
    
    def get_is_favorited(self, obj):
        """Vérifie si l'article est dans les favoris de l'utilisateur"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.formationfavorite_set.filter(user=request.user, is_active=True).exists()
        return False
    
    def get_user_progress(self, obj):
        """Retourne la progression de l'utilisateur sur cet article"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                progress = obj.formationprogress_set.get(user=request.user)
                return {
                    'progress_percentage': progress.progress_percentage,
                    'is_started': progress.is_started,
                    'is_completed': progress.is_completed,
                    'last_read_at': progress.last_read_at
                }
            except FormationProgress.DoesNotExist:
                return {
                    'progress_percentage': 0,
                    'is_started': False,
                    'is_completed': False,
                    'last_read_at': None
                }
        return None


class FormationArticleDetailSerializer(serializers.ModelSerializer):
    """Sérialiseur détaillé pour les articles de formation"""
    author = UserSerializer(read_only=True)
    category = FormationCategorySerializer(read_only=True)
    media_files = FormationMediaSerializer(many=True, read_only=True)
    related_courses = serializers.SerializerMethodField()
    related_festivals = serializers.SerializerMethodField()
    related_events = serializers.SerializerMethodField()
    breadcrumbs = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()
    user_progress = serializers.SerializerMethodField()
    user_notes = serializers.SerializerMethodField()
    
    class Meta:
        model = FormationArticle
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'author', 'category',
            'level', 'status', 'meta_description', 'featured_image', 'reading_time',
            'views_count', 'likes_count', 'comments_count', 'media_files',
            'related_courses', 'related_festivals', 'related_events',
            'breadcrumbs', 'is_favorited', 'user_progress', 'user_notes',
            'version', 'created_at', 'updated_at', 'published_at'
        ]
        read_only_fields = ['id', 'slug', 'views_count', 'likes_count', 'comments_count', 'created_at', 'updated_at']
    
    def get_related_courses(self, obj):
        """Retourne les cours liés"""
        from courses.serializers import CourseSerializer
        return CourseSerializer(obj.related_courses.all(), many=True, context=self.context).data
    
    def get_related_festivals(self, obj):
        """Retourne les festivals liés"""
        from festivals.serializers import FestivalSerializer
        return FestivalSerializer(obj.related_festivals.all(), many=True, context=self.context).data
    
    def get_related_events(self, obj):
        """Retourne les événements liés"""
        from events.serializers import EventSerializer
        return EventSerializer(obj.related_events.all(), many=True, context=self.context).data
    
    def get_breadcrumbs(self, obj):
        """Retourne le fil d'Ariane"""
        breadcrumbs = obj.get_breadcrumbs()
        return [
            {
                'name': item.name if hasattr(item, 'name') else item.title,
                'slug': item.slug,
                'url': item.get_absolute_url() if hasattr(item, 'get_absolute_url') else None
            }
            for item in breadcrumbs
        ]
    
    def get_is_favorited(self, obj):
        """Vérifie si l'article est dans les favoris de l'utilisateur"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorites.filter(user=request.user, is_active=True).exists()
        return False
    
    def get_user_progress(self, obj):
        """Retourne la progression de l'utilisateur sur cet article"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                progress = obj.formationprogress_set.get(user=request.user)
                return {
                    'progress_percentage': progress.progress_percentage,
                    'is_started': progress.is_started,
                    'is_completed': progress.is_completed,
                    'started_at': progress.started_at,
                    'completed_at': progress.completed_at,
                    'last_read_at': progress.last_read_at,
                    'total_reading_time': progress.total_reading_time,
                    'difficulty_rating': progress.difficulty_rating
                }
            except FormationProgress.DoesNotExist:
                return None
        return None
    
    def get_user_notes(self, obj):
        """Retourne les notes personnelles de l'utilisateur"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                progress = obj.formationprogress_set.get(user=request.user)
                return progress.personal_notes
            except FormationProgress.DoesNotExist:
                return ""
        return ""


class FormationFavoriteSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les favoris de formation"""
    article = FormationArticleListSerializer(read_only=True)
    article_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = FormationFavorite
        fields = ['id', 'article', 'article_id', 'is_active', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        """Crée ou met à jour un favori"""
        user = self.context['request'].user
        article_id = validated_data.pop('article_id')
        
        favorite, created = FormationFavorite.objects.get_or_create(
            user=user,
            article_id=article_id,
            defaults=validated_data
        )
        
        if not created:
            # Mise à jour si le favori existe déjà
            for attr, value in validated_data.items():
                setattr(favorite, attr, value)
            favorite.save()
        
        return favorite


class FormationCommentSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les commentaires de formation"""
    author = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    replies_count = serializers.SerializerMethodField()
    can_moderate = serializers.SerializerMethodField()
    
    class Meta:
        model = FormationComment
        fields = [
            'id', 'article', 'author', 'parent', 'content', 'is_approved',
            'is_active', 'replies', 'replies_count', 'can_moderate',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author', 'is_approved', 'created_at', 'updated_at']
    
    def get_replies(self, obj):
        """Retourne les réponses approuvées"""
        replies = obj.replies.filter(is_approved=True, is_active=True).order_by('created_at')
        return FormationCommentSerializer(replies, many=True, context=self.context).data
    
    def get_replies_count(self, obj):
        """Retourne le nombre de réponses"""
        return obj.get_replies_count()
    
    def get_can_moderate(self, obj):
        """Vérifie si l'utilisateur peut modérer ce commentaire"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.is_staff or request.user == obj.author
        return False
    
    def create(self, validated_data):
        """Crée un commentaire avec l'auteur actuel"""
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class FormationProgressSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la progression de formation"""
    article = FormationArticleListSerializer(read_only=True)
    article_id = serializers.IntegerField(write_only=True)
    time_spent_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = FormationProgress
        fields = [
            'id', 'article', 'article_id', 'is_started', 'is_completed',
            'progress_percentage', 'started_at', 'completed_at', 'last_read_at',
            'total_reading_time', 'time_spent_formatted', 'personal_notes',
            'difficulty_rating'
        ]
        read_only_fields = ['id', 'started_at', 'completed_at', 'last_read_at']
    
    def get_time_spent_formatted(self, obj):
        """Retourne le temps passé formaté"""
        return obj.get_time_spent_formatted()
    
    def create(self, validated_data):
        """Crée ou met à jour une progression"""
        user = self.context['request'].user
        article_id = validated_data.pop('article_id')
        
        progress, created = FormationProgress.objects.get_or_create(
            user=user,
            article_id=article_id,
            defaults=validated_data
        )
        
        if not created:
            # Mise à jour si la progression existe déjà
            for attr, value in validated_data.items():
                setattr(progress, attr, value)
            progress.save()
        
        return progress


class FormationSearchSerializer(serializers.Serializer):
    """Sérialiseur pour la recherche de formation"""
    query = serializers.CharField(max_length=500, required=False)
    category = serializers.CharField(max_length=100, required=False)
    level = serializers.ChoiceField(choices=FormationArticle.LEVEL_CHOICES, required=False)
    author = serializers.CharField(max_length=100, required=False)
    sort_by = serializers.ChoiceField(
        choices=[
            ('relevance', 'Pertinence'),
            ('date', 'Date'),
            ('popularity', 'Popularité'),
            ('level', 'Niveau'),
            ('reading_time', 'Temps de lecture')
        ],
        default='relevance',
        required=False
    )
    page = serializers.IntegerField(min_value=1, default=1, required=False)
    page_size = serializers.IntegerField(min_value=1, max_value=50, default=10, required=False)


class FormationSearchResultSerializer(serializers.Serializer):
    """Sérialiseur pour les résultats de recherche"""
    articles = FormationArticleListSerializer(many=True)
    total_count = serializers.IntegerField()
    page = serializers.IntegerField()
    page_size = serializers.IntegerField()
    total_pages = serializers.IntegerField()
    query = serializers.CharField()
    filters_applied = serializers.DictField()


class FormationStatsSerializer(serializers.Serializer):
    """Sérialiseur pour les statistiques de formation"""
    total_articles = serializers.IntegerField()
    total_categories = serializers.IntegerField()
    total_views = serializers.IntegerField()
    total_favorites = serializers.IntegerField()
    total_comments = serializers.IntegerField()
    articles_by_level = serializers.DictField()
    articles_by_category = serializers.DictField()
    most_popular_articles = FormationArticleListSerializer(many=True)
    recent_articles = FormationArticleListSerializer(many=True)
