from django.contrib import admin
from django.utils.html import format_html
from .models import Article, TheoryCategory, TheoryCourse, TheoryLesson

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'difficulty', 'author_name', 'published_date', 
        'reading_time', 'views_count', 'is_published', 'is_featured'
    ]
    list_filter = [
        'category', 'difficulty', 'is_published', 'is_featured', 'published_date', 'created_at'
    ]
    search_fields = ['title', 'content', 'excerpt', 'author_name', 'tags']
    readonly_fields = ['created_at', 'updated_at', 'views_count', 'slug']
    list_editable = ['is_published', 'is_featured']
    date_hierarchy = 'published_date'
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'excerpt', 'content', 'category', 'difficulty')
        }),
        ('Auteur et publication', {
            'fields': ('author_name', 'published_date', 'is_published', 'is_featured')
        }),
        ('Médias', {
            'fields': ('main_image', 'gallery', 'video_url')
        }),
        ('Contenu', {
            'fields': ('tags', 'related_articles', 'resources', 'bibliography')
        }),
        ('Métadonnées', {
            'fields': ('slug', 'reading_time', 'views_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

    def save_model(self, request, obj, form, change):
        # Assigner automatiquement l'auteur connecté si non défini
        if not obj.author_id:
            obj.author = request.user
        super().save_model(request, obj, form, change)
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('author')
    
    list_per_page = 25
    ordering = ['-published_date']
    
    actions = ['publish_articles', 'unpublish_articles', 'mark_as_featured', 'unmark_as_featured']
    
    def publish_articles(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f'{updated} article(s) publié(s)')
    publish_articles.short_description = 'Publier les articles sélectionnés'
    
    def unpublish_articles(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f'{updated} article(s) dépublié(s)')
    unpublish_articles.short_description = 'Dépublier les articles sélectionnés'
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} article(s) mis en avant')
    mark_as_featured.short_description = 'Mettre en avant'
    
    def unmark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} article(s) retiré(s) de la mise en avant')
    unmark_as_featured.short_description = 'Retirer de la mise en avant'

@admin.register(TheoryCategory)
class TheoryCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'get_full_path_display', 'color_display', 'order', 'subcategories_count']
    list_filter = ['parent']
    search_fields = ['name', 'description']
    ordering = ['parent', 'order', 'name']
    list_editable = ['order']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('name', 'description', 'parent')
        }),
        ('Apparence', {
            'fields': ('color', 'icon', 'order')
        }),
    )
    
    def get_full_path_display(self, obj):
        """Affiche le chemin complet de la catégorie"""
        return obj.get_full_path()
    get_full_path_display.short_description = 'Chemin complet'
    
    def color_display(self, obj):
        """Affiche la couleur avec un aperçu visuel"""
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 6px; border-radius: 3px;">{}</span>',
            obj.color, obj.color
        )
    color_display.short_description = 'Couleur'
    
    def subcategories_count(self, obj):
        """Affiche le nombre de sous-catégories"""
        count = obj.subcategories.count()
        return count if count > 0 else '-'
    subcategories_count.short_description = 'Sous-catégories'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('parent').prefetch_related('subcategories')

@admin.register(TheoryCourse)
class TheoryCourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'difficulty', 'status', 'estimated_duration', 'created_at']
    list_filter = ['status', 'difficulty', 'category', 'created_at']
    search_fields = ['title', 'description', 'author__username']
    readonly_fields = ['slug', 'created_at', 'updated_at', 'views_count', 'rating']
    list_editable = ['status']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'slug', 'description', 'short_description')
        }),
        ('Auteur et catégorie', {
            'fields': ('author', 'category', 'difficulty')
        }),
        ('Statut et contenu', {
            'fields': ('status', 'content', 'learning_objectives', 'prerequisites')
        }),
        ('Médias', {
            'fields': ('main_image', 'video_url', 'audio_url', 'attachments')
        }),
        ('Métadonnées', {
            'fields': ('estimated_duration', 'tags', 'keywords', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # Nouvelle création
            obj.author = request.user
        super().save_model(request, obj, form, change)

@admin.register(TheoryLesson)
class TheoryLessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'duration_minutes', 'is_required', 'created_at']
    list_filter = ['course', 'is_required', 'created_at']
    search_fields = ['title', 'content', 'course__title']
    ordering = ['course', 'order']
    list_editable = ['order', 'is_required']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'slug', 'content', 'course')
        }),
        ('Structure', {
            'fields': ('order', 'is_required', 'duration_minutes')
        }),
        ('Médias', {
            'fields': ('video_url', 'audio_url', 'images')
        }),
    )

















