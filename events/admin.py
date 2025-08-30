from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import EventCategory, Event, EventEnrollment, EventReview, EventWaitlist


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    """Administration des catégories d'événements"""
    list_display = ['name', 'slug', 'color', 'icon', 'event_count']
    list_filter = ['name']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']
    
    def event_count(self, obj):
        """Afficher le nombre d'événements dans cette catégorie"""
        count = obj.event_set.count()
        return format_html('<span style="color: {};">{}</span>', obj.color, count)
    event_count.short_description = 'Nombre d\'événements'


class EventEnrollmentInline(admin.TabularInline):
    """Inscriptions aux événements en ligne"""
    model = EventEnrollment
    extra = 0
    readonly_fields = ['enrollment_date', 'price_paid']
    fields = ['user', 'status', 'payment_status', 'enrollment_date', 'price_paid']
    can_delete = False


class EventReviewInline(admin.TabularInline):
    """Avis sur les événements en ligne"""
    model = EventReview
    extra = 0
    readonly_fields = ['created_at']
    fields = ['user', 'rating', 'comment', 'created_at']
    can_delete = False


class EventWaitlistInline(admin.TabularInline):
    """Liste d'attente en ligne"""
    model = EventWaitlist
    extra = 0
    readonly_fields = ['joined_at']
    fields = ['user', 'joined_at', 'notified']
    can_delete = False


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Administration des événements"""
    list_display = [
        'title', 'category', 'status', 'featured', 'start_date', 
        'location', 'city', 'capacity', 'enrollment_count', 'available_spots',
        'current_price_display', 'organizer'
    ]
    list_filter = [
        'status', 'featured', 'category', 'city', 'difficulty',
        'start_date', 'created_at'
    ]
    search_fields = [
        'title', 'description', 'location', 'city', 'instructor',
        'organizer__username', 'organizer__first_name', 'organizer__last_name'
    ]
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = [
        'created_at', 'updated_at', 'views_count', 'available_spots',
        'enrollment_rate', 'is_upcoming', 'is_registration_open'
    ]
    date_hierarchy = 'start_date'
    ordering = ['-start_date']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'slug', 'description', 'long_description', 'category', 'status', 'featured')
        }),
        ('Dates et horaires', {
            'fields': ('start_date', 'end_date', 'registration_deadline')
        }),
        ('Lieu', {
            'fields': ('location', 'address', 'city', 'postal_code', 'country')
        }),
        ('Capacité et participants', {
            'fields': ('capacity', 'min_participants')
        }),
        ('Prix et paiement', {
            'fields': ('price', 'currency', 'early_bird_price', 'early_bird_deadline')
        }),
        ('Niveau et prérequis', {
            'fields': ('difficulty', 'prerequisites')
        }),
        ('Organisation', {
            'fields': ('organizer', 'instructor', 'instructor_bio')
        }),
        ('Images et médias', {
            'fields': ('main_image', 'gallery')
        }),
        ('Informations supplémentaires', {
            'fields': ('highlights', 'schedule', 'materials_needed')
        }),
        ('Réseaux sociaux', {
            'fields': ('website', 'instagram', 'facebook')
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at', 'views_count'),
            'classes': ('collapse',)
        })
    )
    
    inlines = [EventEnrollmentInline, EventReviewInline, EventWaitlistInline]
    
    def enrollment_count(self, obj):
        """Afficher le nombre d'inscriptions"""
        count = obj.enrollments.count()
        return format_html('<span style="color: #2563eb;">{}</span>', count)
    enrollment_count.short_description = 'Inscriptions'
    
    def available_spots(self, obj):
        """Afficher les places disponibles"""
        spots = obj.available_spots
        color = '#10b981' if spots > 0 else '#ef4444'
        return format_html('<span style="color: {};">{}</span>', color, spots)
    available_spots.short_description = 'Places dispo.'
    
    def current_price_display(self, obj):
        """Afficher le prix actuel"""
        price = obj.current_price
        if obj.early_bird_price and obj.early_bird_deadline:
            return format_html(
                '<span style="color: #059669;">{}€</span> <small>(early bird: {}€)</small>',
                price, obj.early_bird_price
            )
        return format_html('<span style="color: #059669;">{}€</span>', price)
    current_price_display.short_description = 'Prix actuel'
    
    def get_queryset(self, request):
        """Optimiser les requêtes avec select_related et prefetch_related"""
        return super().get_queryset(request).select_related(
            'category', 'organizer'
        ).prefetch_related('enrollments', 'reviews', 'waitlist')
    
    actions = ['mark_as_featured', 'mark_as_published', 'mark_as_cancelled']
    
    def mark_as_featured(self, request, queryset):
        """Marquer les événements comme étant en vedette"""
        updated = queryset.update(featured=True)
        self.message_user(request, f'{updated} événement(s) marqué(s) comme étant en vedette.')
    mark_as_featured.short_description = 'Marquer comme étant en vedette'
    
    def mark_as_published(self, request, queryset):
        """Publier les événements"""
        updated = queryset.update(status='published')
        self.message_user(request, f'{updated} événement(s) publié(s).')
    mark_as_published.short_description = 'Publier les événements'
    
    def mark_as_cancelled(self, request, queryset):
        """Annuler les événements"""
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} événement(s) annulé(s).')
    mark_as_cancelled.short_description = 'Annuler les événements'


@admin.register(EventEnrollment)
class EventEnrollmentAdmin(admin.ModelAdmin):
    """Administration des inscriptions aux événements"""
    list_display = [
        'event_title', 'user_info', 'status', 'payment_status', 
        'enrollment_date', 'price_paid', 'currency'
    ]
    list_filter = ['status', 'payment_status', 'enrollment_date', 'currency']
    search_fields = [
        'event__title', 'user__username', 'user__first_name', 
        'user__last_name', 'user__email'
    ]
    readonly_fields = ['enrollment_date', 'created_at', 'updated_at']
    date_hierarchy = 'enrollment_date'
    ordering = ['-enrollment_date']
    
    fieldsets = (
        ('Événement et utilisateur', {
            'fields': ('event', 'user')
        }),
        ('Statut et paiement', {
            'fields': ('status', 'payment_status', 'price_paid', 'currency')
        }),
        ('Informations personnelles', {
            'fields': ('special_requests', 'dietary_restrictions', 'emergency_contact')
        }),
        ('Métadonnées', {
            'fields': ('enrollment_date', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def event_title(self, obj):
        """Afficher le titre de l'événement avec lien"""
        url = reverse('admin:events_event_change', args=[obj.event.id])
        return format_html('<a href="{}">{}</a>', url, obj.event.title)
    event_title.short_description = 'Événement'
    
    def user_info(self, obj):
        """Afficher les informations de l'utilisateur avec lien"""
        url = reverse('admin:accounts_user_change', args=[obj.user.id])
        return format_html(
            '<a href="{}">{} {}</a><br><small>{}</small>',
            url, obj.user.first_name, obj.user.last_name, obj.user.email
        )
    user_info.short_description = 'Utilisateur'
    
    def get_queryset(self, request):
        """Optimiser les requêtes"""
        return super().get_queryset(request).select_related('event', 'user')


@admin.register(EventReview)
class EventReviewAdmin(admin.ModelAdmin):
    """Administration des avis sur les événements"""
    list_display = [
        'event_title', 'user_info', 'rating', 'comment_preview', 
        'created_at'
    ]
    list_filter = ['rating', 'created_at']
    search_fields = [
        'event__title', 'user__username', 'user__first_name', 
        'user__last_name', 'comment'
    ]
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Événement et utilisateur', {
            'fields': ('event', 'user')
        }),
        ('Avis', {
            'fields': ('rating', 'comment')
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def event_title(self, obj):
        """Afficher le titre de l'événement avec lien"""
        url = reverse('admin:events_event_change', args=[obj.event.id])
        return format_html('<a href="{}">{}</a>', url, obj.event.title)
    event_title.short_description = 'Événement'
    
    def user_info(self, obj):
        """Afficher les informations de l'utilisateur avec lien"""
        url = reverse('admin:accounts_user_change', args=[obj.user.id])
        return format_html(
            '<a href="{}">{} {}</a>',
            url, obj.user.first_name, obj.user.last_name
        )
    user_info.short_description = 'Utilisateur'
    
    def comment_preview(self, obj):
        """Aperçu du commentaire"""
        if len(obj.comment) > 50:
            return f"{obj.comment[:50]}..."
        return obj.comment
    comment_preview.short_description = 'Commentaire'
    
    def get_queryset(self, request):
        """Optimiser les requêtes"""
        return super().get_queryset(request).select_related('event', 'user')


@admin.register(EventWaitlist)
class EventWaitlistAdmin(admin.ModelAdmin):
    """Administration des listes d'attente"""
    list_display = [
        'event_title', 'user_info', 'joined_at', 'notified'
    ]
    list_filter = ['notified', 'joined_at']
    search_fields = [
        'event__title', 'user__username', 'user__first_name', 
        'user__last_name'
    ]
    readonly_fields = ['joined_at']
    date_hierarchy = 'joined_at'
    ordering = ['joined_at']
    
    fieldsets = (
        ('Événement et utilisateur', {
            'fields': ('event', 'user')
        }),
        ('Statut', {
            'fields': ('notified', 'joined_at')
        })
    )
    
    def event_title(self, obj):
        """Afficher le titre de l'événement avec lien"""
        url = reverse('admin:events_event_change', args=[obj.event.id])
        return format_html('<a href="{}">{}</a>', url, obj.event.title)
    event_title.short_description = 'Événement'
    
    def user_info(self, obj):
        """Afficher les informations de l'utilisateur avec lien"""
        url = reverse('admin:accounts_user_change', args=[obj.user.id])
        return format_html(
            '<a href="{}">{} {}</a>',
            url, obj.user.first_name, obj.user.last_name
        )
    user_info.short_description = 'Utilisateur'
    
    def get_queryset(self, request):
        """Optimiser les requêtes"""
        return super().get_queryset(request).select_related('event', 'user')


# Configuration de l'admin
admin.site.site_header = "Administration Bachata Site"
admin.site.site_title = "Bachata Site Admin"
admin.site.index_title = "Gestion du site Bachata"
