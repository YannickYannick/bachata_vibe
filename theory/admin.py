from django.contrib import admin
from django.utils.html import format_html
from .models import Article

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
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'published_date'
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'category', 'difficulty')
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
            'fields': ('reading_time', 'views_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
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


