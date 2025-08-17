from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Course, CourseCategory, CourseEnrollment

@admin.register(CourseCategory)
class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'color_display', 'icon']
    list_filter = []
    search_fields = ['name', 'description']
    ordering = ['name']
    
    def color_display(self, obj):
        if obj.color:
            return format_html(
                '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 4px;">{}</span>',
                obj.color, obj.color
            )
        return '-'
    color_display.short_description = 'Couleur'

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'creator', 'category', 'difficulty', 'status', 
        'start_date', 'location', 'price_display', 'participants_display',
        'is_upcoming', 'is_ongoing'
    ]
    list_filter = [
        'status', 'difficulty', 'category', 'city', 'is_free',
        'start_date', 'created_at'
    ]
    search_fields = [
        'title', 'description', 'creator__first_name', 'creator__last_name',
        'creator__email', 'location', 'city'
    ]
    list_editable = ['status']
    readonly_fields = [
        'slug', 'current_participants', 'created_at', 'updated_at',
        'is_upcoming', 'is_ongoing', 'is_full', 'available_spots'
    ]
    date_hierarchy = 'start_date'
    ordering = ['-start_date']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'slug', 'description', 'short_description')
        }),
        ('Créateur et statut', {
            'fields': ('creator', 'status', 'approved_by', 'approved_at')
        }),
        ('Catégorie et niveau', {
            'fields': ('category', 'difficulty')
        }),
        ('Capacité et participants', {
            'fields': ('max_participants', 'current_participants')
        }),
        ('Horaires et localisation', {
            'fields': ('start_date', 'end_date', 'duration_minutes', 'location', 'address', 'city', 'postal_code')
        }),
        ('Prix et inscriptions', {
            'fields': ('price', 'currency', 'is_free')
        }),
        ('Contenu et matériel', {
            'fields': ('content', 'prerequisites', 'materials_needed')
        }),
        ('Images et médias', {
            'fields': ('main_image', 'gallery')
        }),
        ('Métadonnées', {
            'fields': ('tags', 'created_at', 'updated_at')
        }),
    )
    
    def price_display(self, obj):
        if obj.is_free:
            return format_html('<span style="color: green; font-weight: bold;">GRATUIT</span>')
        return f"{obj.price} {obj.currency}"
    price_display.short_description = 'Prix'
    
    def participants_display(self, obj):
        return f"{obj.current_participants}/{obj.max_participants}"
    participants_display.short_description = 'Participants'
    
    def is_upcoming(self, obj):
        return obj.is_upcoming
    is_upcoming.boolean = True
    is_upcoming.short_description = 'À venir'
    
    def is_ongoing(self, obj):
        return obj.is_ongoing
    is_ongoing.boolean = True
    is_ongoing.short_description = 'En cours'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('creator', 'category', 'approved_by')
    
    actions = ['approve_courses', 'reject_courses', 'mark_as_cancelled']
    
    def approve_courses(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(
            status='approved',
            approved_by=request.user,
            approved_at=timezone.now()
        )
        self.message_user(request, f"{updated} cours ont été approuvés.")
    approve_courses.short_description = "Approuver les cours sélectionnés"
    
    def reject_courses(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f"{updated} cours ont été rejetés.")
    reject_courses.short_description = "Rejeter les cours sélectionnés"
    
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f"{updated} cours ont été marqués comme annulés.")
    mark_as_cancelled.short_description = "Marquer comme annulés"

@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = [
        'course', 'participant', 'status', 'payment_status',
        'enrolled_at', 'payment_method'
    ]
    list_filter = [
        'status', 'payment_status', 'enrolled_at', 'course__status'
    ]
    search_fields = [
        'course__title', 'participant__first_name', 'participant__last_name',
        'participant__email'
    ]
    list_editable = ['status', 'payment_status']
    readonly_fields = ['enrolled_at']
    date_hierarchy = 'enrolled_at'
    ordering = ['-enrolled_at']
    
    fieldsets = (
        ('Inscription', {
            'fields': ('course', 'participant', 'status', 'enrolled_at')
        }),
        ('Paiement', {
            'fields': ('payment_status', 'payment_method')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('course', 'participant')


