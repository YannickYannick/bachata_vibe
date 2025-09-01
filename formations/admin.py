from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    FormationCategory, FormationArticle, FormationFavorite, 
    FormationComment, FormationProgress, FormationMedia, FormationSearchLog
)
from django.utils import timezone


@admin.register(FormationCategory)
class FormationCategoryAdmin(admin.ModelAdmin):
    """Administration des catégories de formation"""
    list_display = ['name', 'parent', 'order', 'articles_count', 'is_active', 'created_at']
    list_filter = ['is_active', 'parent', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['order', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'slug', 'description', 'parent', 'order', 'icon')
        }),
        ('Statut', {
            'fields': ('is_active',)
        }),
    )
    
    def articles_count(self, obj):
        """Affiche le nombre d'articles dans cette catégorie"""
        count = obj.get_articles_count()
        return format_html('<span style="color: {};">{}</span>', 
                         'green' if count > 0 else 'red', count)
    articles_count.short_description = 'Nombre d\'articles'


@admin.register(FormationArticle)
class FormationArticleAdmin(admin.ModelAdmin):
    """Administration des articles de formation"""
    list_display = ['title', 'author', 'category', 'level', 'status', 'views_count', 
                   'likes_count', 'comments_count', 'created_at', 'published_at']
    list_filter = ['status', 'level', 'category', 'author', 'created_at', 'published_at']
    search_fields = ['title', 'content', 'excerpt', 'author__username', 'category__name']
    list_editable = ['status', 'level']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Contenu', {
            'fields': ('title', 'slug', 'content', 'excerpt', 'featured_image')
        }),
        ('Métadonnées', {
            'fields': ('author', 'category', 'level', 'status', 'reading_time')
        }),
        ('SEO', {
            'fields': ('meta_description',)
        }),
        ('Liens', {
            'fields': ('related_courses', 'related_festivals', 'related_events'),
            'classes': ('collapse',)
        }),
        ('Statistiques', {
            'fields': ('views_count', 'likes_count', 'comments_count'),
            'classes': ('collapse',)
        }),
        ('Versioning', {
            'fields': ('version', 'previous_version'),
            'classes': ('collapse',)
        }),
    )
    
    filter_horizontal = ['related_courses', 'related_festivals', 'related_events']
    
    def save_model(self, request, obj, form, change):
        """Sauvegarde personnalisée pour gérer la publication"""
        if obj.status == 'published' and not obj.published_at:
            obj.published_at = timezone.now()
        super().save_model(request, obj, form, change)
    
    def get_queryset(self, request):
        """Optimise la requête avec les relations"""
        return super().get_queryset(request).select_related('author', 'category')


@admin.register(FormationFavorite)
class FormationFavoriteAdmin(admin.ModelAdmin):
    """Administration des favoris de formation"""
    list_display = ['user', 'article', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['user__username', 'article__title']
    list_editable = ['is_active']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Informations', {
            'fields': ('user', 'article', 'is_active')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
    )


@admin.register(FormationComment)
class FormationCommentAdmin(admin.ModelAdmin):
    """Administration des commentaires de formation"""
    list_display = ['author', 'article', 'parent', 'is_approved', 'is_active', 
                   'replies_count', 'created_at']
    list_filter = ['is_approved', 'is_active', 'created_at', 'parent']
    search_fields = ['author__username', 'content', 'article__title']
    list_editable = ['is_approved', 'is_active']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Contenu', {
            'fields': ('article', 'author', 'parent', 'content')
        }),
        ('Modération', {
            'fields': ('is_approved', 'is_active', 'moderated_by', 'moderated_at', 'moderation_notes')
        }),
    )
    
    def replies_count(self, obj):
        """Affiche le nombre de réponses"""
        count = obj.get_replies_count()
        return format_html('<span style="color: {};">{}</span>', 
                         'blue' if count > 0 else 'gray', count)
    replies_count.short_description = 'Réponses'
    
    def save_model(self, request, obj, form, change):
        """Sauvegarde personnalisée pour la modération"""
        if change and 'is_approved' in form.changed_data:
            obj.moderated_by = request.user
            obj.moderated_at = timezone.now()
        super().save_model(request, obj, form, change)


@admin.register(FormationProgress)
class FormationProgressAdmin(admin.ModelAdmin):
    """Administration de la progression de formation"""
    list_display = ['user', 'article', 'progress_percentage', 'is_started', 
                   'is_completed', 'last_read_at']
    list_filter = ['is_started', 'is_completed']
    search_fields = ['user__username', 'article__title']
    ordering = ['-last_read_at']
    
    fieldsets = (
        ('Utilisateur et Article', {
            'fields': ('user', 'article')
        }),
        ('Progression', {
            'fields': ('is_started', 'is_completed', 'progress_percentage')
        }),
        ('Temps', {
            'fields': ('started_at', 'completed_at', 'last_read_at', 'total_reading_time')
        }),
        ('Notes personnelles', {
            'fields': ('personal_notes', 'difficulty_rating')
        }),
    )
    
    readonly_fields = ['started_at', 'completed_at', 'last_read_at']


@admin.register(FormationMedia)
class FormationMediaAdmin(admin.ModelAdmin):
    """Administration des médias de formation"""
    list_display = ['title', 'article', 'file_type', 'file_size_formatted', 
                   'order', 'is_active', 'created_at']
    list_filter = ['file_type', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'article__title']
    list_editable = ['order', 'is_active']
    ordering = ['order', 'created_at']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('article', 'title', 'description', 'order')
        }),
        ('Fichier', {
            'fields': ('file', 'file_type')
        }),
        ('Métadonnées', {
            'fields': ('duration', 'dimensions'),
            'classes': ('collapse',)
        }),
        ('Statut', {
            'fields': ('is_active',)
        }),
    )
    
    def file_size_formatted(self, obj):
        """Affiche la taille du fichier formatée"""
        return obj.get_file_size_formatted()
    file_size_formatted.short_description = 'Taille'


@admin.register(FormationSearchLog)
class FormationSearchLogAdmin(admin.ModelAdmin):
    """Administration des logs de recherche"""
    list_display = ['query', 'user', 'results_count', 'ip_address', 'created_at']
    list_filter = ['created_at', 'results_count']
    search_fields = ['query', 'user__username', 'ip_address']
    ordering = ['-created_at']
    readonly_fields = ['query', 'user', 'results_count', 'filters_applied', 
                      'ip_address', 'user_agent', 'created_at']
    
    fieldsets = (
        ('Recherche', {
            'fields': ('query', 'results_count', 'filters_applied')
        }),
        ('Utilisateur', {
            'fields': ('user', 'ip_address', 'user_agent')
        }),
        ('Date', {
            'fields': ('created_at',)
        }),
    )
    
    def has_add_permission(self, request):
        """Empêche l'ajout manuel de logs"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Empêche la modification des logs"""
        return False


# Configuration de l'admin
admin.site.site_header = "Administration Formation Bachata"
admin.site.site_title = "Formation Bachata"
admin.site.index_title = "Gestion des formations et articles"
