from django.contrib import admin
from django.utils.html import format_html
from .models import Training

@admin.register(Training)
class TrainingAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'difficulty', 'city', 'start_date', 'duration_minutes', 
        'price', 'currency', 'max_participants', 'current_participants', 'status'
    ]
    list_filter = [
        'difficulty', 'city', 'start_date', 'status', 'is_free', 'created_at'
    ]
    search_fields = ['title', 'description', 'location', 'city']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'description', 'short_description', 'training_type', 'difficulty', 'status')
        }),
        ('Localisation', {
            'fields': ('location', 'address', 'city', 'postal_code', 'country')
        }),
        ('Dates et horaires', {
            'fields': ('start_date', 'end_date', 'duration_minutes', 'schedule')
        }),
        ('Prix et capacité', {
            'fields': ('price', 'currency', 'is_free', 'max_participants', 'current_participants')
        }),
        ('Instructeur', {
            'fields': ('creator', 'approved_by', 'approved_at')
        }),
        ('Médias', {
            'fields': ('main_image', 'gallery', 'video_url')
        }),
        ('Contenu', {
            'fields': ('curriculum', 'prerequisites', 'materials_needed', 'objectives', 'tags')
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
    
    actions = ['mark_as_active', 'mark_as_full', 'mark_as_cancelled']
    
    def mark_as_active(self, request, queryset):
        updated = queryset.update(status='active')
        self.message_user(request, f'{updated} training(s) marqué(s) comme "Actif"')
    mark_as_active.short_description = 'Marquer comme "Actif"'
    
    def mark_as_full(self, request, queryset):
        updated = queryset.update(status='full')
        self.message_user(request, f'{updated} training(s) marqué(s) comme "Complet"')
    mark_as_full.short_description = 'Marquer comme "Complet"'
    
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} training(s) marqué(s) comme "Annulé"')
    mark_as_cancelled.short_description = 'Marquer comme "Annulé"'
