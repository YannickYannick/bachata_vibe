from django.contrib import admin
from django.utils.html import format_html
from .models import ArtistProfile

@admin.register(ArtistProfile)
class ArtistAdmin(admin.ModelAdmin):
    list_display = [
        'artist_name', 'base_location', 'teaching_experience', 'performance_experience', 
        'is_featured', 'is_verified', 'created_at'
    ]
    list_filter = [
        'base_location', 'is_featured', 'is_verified', 'created_at'
    ]
    search_fields = [
        'artist_name', 'bio', 'base_location', 'specialties', 'awards'
    ]
    readonly_fields = ['created_at', 'updated_at', 'awards_count']
    list_editable = ['is_verified']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('artist_name', 'bio', 'short_bio', 'specialties', 'dance_styles')
        }),
        ('Localisation', {
            'fields': ('base_location', 'travel_radius', 'willing_to_travel')
        }),
        ('Expérience et compétences', {
            'fields': ('teaching_experience', 'performance_experience', 'certifications')
        }),
        ('Contact', {
            'fields': ('website', 'instagram', 'facebook', 'youtube', 'tiktok')
        }),
        ('Médias', {
            'fields': ('profile_image', 'gallery', 'demo_video')
        }),
        ('Statistiques', {
            'fields': ('views_count', 'rating', 'reviews_count'),
            'classes': ('collapse',)
        }),
        ('Vérification', {
            'fields': ('is_verified', 'is_featured'),
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('courses', 'awards')
    
    def awards_count(self, obj):
        return len(obj.awards) if obj.awards else 0
    awards_count.short_description = 'Récompenses'
    
    list_per_page = 25
    ordering = ['-created_at']
    
    actions = ['verify_artists', 'unverify_artists', 'mark_as_featured']
    
    def verify_artists(self, request, queryset):
        updated = queryset.update(is_verified=True)
        self.message_user(request, f'{updated} artiste(s) vérifié(s)')
    verify_artists.short_description = 'Vérifier les artistes sélectionnés'
    
    def unverify_artists(self, request, queryset):
        updated = queryset.update(is_verified=False)
        self.message_user(request, f'{updated} artiste(s) non vérifié(s)')
    unverify_artists.short_description = 'Dévérifier les artistes sélectionnés'
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} artiste(s) marqué(s) comme "Mis en avant"')
    mark_as_featured.short_description = 'Marquer comme "Mis en avant"'
