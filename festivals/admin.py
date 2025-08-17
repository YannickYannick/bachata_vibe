from django.contrib import admin
from django.utils.html import format_html
from .models import Festival

@admin.register(Festival)
class FestivalAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'status', 'city', 'start_date', 'end_date', 
        'base_price', 'currency', 'max_participants', 'created_at'
    ]
    list_filter = [
        'status', 'city', 'start_date', 'end_date', 'is_free', 'created_at'
    ]
    search_fields = ['title', 'description', 'location', 'city']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'description', 'short_description', 'status')
        }),
        ('Localisation', {
            'fields': ('location', 'address', 'city', 'postal_code', 'country')
        }),
        ('Dates et horaires', {
            'fields': ('start_date', 'end_date', 'registration_deadline')
        }),
        ('Prix et capacité', {
            'fields': ('base_price', 'currency', 'is_free', 'max_participants', 'current_participants')
        }),
        ('Organisation', {
            'fields': ('creator', 'approved_by', 'approved_at')
        }),
        ('Médias', {
            'fields': ('main_image', 'gallery', 'promotional_video')
        }),
        ('Contenu', {
            'fields': ('schedule', 'workshops', 'performances', 'social_dances', 'tags')
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('creator', 'approved_by')
    
    def current_participants_display(self, obj):
        if obj.current_participants >= obj.max_participants:
            return format_html(
                '<span style="color: red; font-weight: bold;">{}</span>', 
                obj.current_participants
            )
        elif obj.current_participants >= obj.max_participants * 0.8:
            return format_html(
                '<span style="color: orange; font-weight: bold;">{}</span>', 
                obj.current_participants
            )
        return obj.current_participants
    
    current_participants_display.short_description = 'Participants actuels'
    
    list_per_page = 25
    ordering = ['-start_date']
    
    actions = ['mark_as_upcoming', 'mark_as_ongoing', 'mark_as_completed']
    
    def mark_as_upcoming(self, request, queryset):
        updated = queryset.update(status='upcoming')
        self.message_user(request, f'{updated} festival(s) marqué(s) comme "À venir"')
    mark_as_upcoming.short_description = 'Marquer comme "À venir"'
    
    def mark_as_ongoing(self, request, queryset):
        updated = queryset.update(status='ongoing')
        self.message_user(request, f'{updated} festival(s) marqué(s) comme "En cours"')
    mark_as_ongoing.short_description = 'Marquer comme "En cours"'
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} festival(s) marqué(s) comme "Terminé"')
    mark_as_completed.short_description = 'Marquer comme "Terminé"'
