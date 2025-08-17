from django.contrib import admin
from django.utils.html import format_html
from .models import Service

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'practitioner_name', 'city', 'duration', 
        'price', 'currency', 'is_available', 'is_featured'
    ]
    list_filter = [
        'category', 'city', 'is_available', 'is_featured', 'created_at'
    ]
    search_fields = ['title', 'description', 'practitioner_name', 'city', 'benefits']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['is_available', 'is_featured']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'description', 'short_description', 'category')
        }),
        ('Pratiquant', {
            'fields': ('practitioner', 'practitioner_name', 'practitioner_email', 'practitioner_phone', 'qualifications')
        }),
        ('Localisation', {
            'fields': ('location', 'address', 'city', 'postal_code', 'country')
        }),
        ('Prix et durée', {
            'fields': ('price', 'currency', 'duration', 'is_free')
        }),
        ('Disponibilité', {
            'fields': ('is_available', 'is_featured', 'schedule', 'booking_required')
        }),
        ('Médias', {
            'fields': ('main_image', 'gallery', 'video_url')
        }),
        ('Détails du service', {
            'fields': ('benefits', 'contraindications', 'materials_needed', 'preparation_required')
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('practitioner')
    
    def save_model(self, request, obj, form, change):
        if not change:  # Si c'est une création
            if not obj.practitioner:
                obj.practitioner = request.user
        super().save_model(request, obj, form, change)
    
    list_per_page = 25
    ordering = ['-created_at']
    
    actions = ['make_available', 'make_unavailable', 'mark_as_featured', 'unmark_as_featured']
    
    def make_available(self, request, queryset):
        updated = queryset.update(is_available=True)
        self.message_user(request, f'{updated} service(s) marqué(s) comme disponible')
    make_available.short_description = 'Marquer comme disponible'
    
    def make_unavailable(self, request, queryset):
        updated = queryset.update(is_available=False)
        self.message_user(request, f'{updated} service(s) marqué(s) comme indisponible')
    make_unavailable.short_description = 'Marquer comme indisponible'
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} service(s) mis en avant')
    mark_as_featured.short_description = 'Mettre en avant'
    
    def unmark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} service(s) retiré(s) de la mise en avant')
    unmark_as_featured.short_description = 'Retirer de la mise en avant'
