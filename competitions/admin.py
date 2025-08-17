from django.contrib import admin
from django.utils.html import format_html
from .models import Competition

@admin.register(Competition)
class CompetitionAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'status', 'city', 'start_date', 
        'prize_pool', 'currency', 'max_participants', 'current_participants'
    ]
    list_filter = [
        'category', 'status', 'city', 'start_date', 'created_at'
    ]
    search_fields = ['title', 'description', 'location', 'city']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'description', 'short_description', 'category', 'status')
        }),
        ('Localisation', {
            'fields': ('location', 'address', 'city', 'postal_code', 'country')
        }),
        ('Dates et horaires', {
            'fields': ('start_date', 'end_date', 'registration_deadline', 'schedule')
        }),
        ('Prix et récompenses', {
            'fields': ('prize_pool', 'currency', 'prize_distribution')
        }),
        ('Capacité et inscriptions', {
            'fields': ('max_participants', 'current_participants', 'registration_fee')
        }),
        ('Organisation', {
            'fields': ('creator', 'approved_by', 'approved_at', 'judges')
        }),
        ('Médias', {
            'fields': ('main_image', 'gallery', 'video_url')
        }),
        ('Règles et critères', {
            'fields': ('rules', 'judging_criteria', 'categories', 'age_groups', 'tags')
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
    
    actions = ['open_registration', 'close_registration', 'mark_as_ongoing', 'mark_as_completed']
    
    def open_registration(self, request, queryset):
        updated = queryset.update(status='registration_open')
        self.message_user(request, f'{updated} compétition(s) avec inscriptions ouvertes')
    open_registration.short_description = 'Ouvrir les inscriptions'
    
    def close_registration(self, request, queryset):
        updated = queryset.update(status='registration_closed')
        self.message_user(request, f'{updated} compétition(s) avec inscriptions fermées')
    close_registration.short_description = 'Fermer les inscriptions'
    
    def mark_as_ongoing(self, request, queryset):
        updated = queryset.update(status='ongoing')
        self.message_user(request, f'{updated} compétition(s) marquée(s) comme "En cours"')
    mark_as_ongoing.short_description = 'Marquer comme "En cours"'
    
    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} compétition(s) marquée(s) comme "Terminée"')
    mark_as_completed.short_description = 'Marquer comme "Terminée"'
