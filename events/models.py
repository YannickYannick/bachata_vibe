from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

User = get_user_model()

class EventCategory(models.Model):
    """Catégorie d'événement (Soirée, Workshop, Masterclass, etc.)"""
    name = models.CharField(max_length=100, verbose_name="Nom")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="Slug")
    description = models.TextField(blank=True, verbose_name="Description")
    color = models.CharField(max_length=7, default="#8B5CF6", verbose_name="Couleur (hex)")
    icon = models.CharField(max_length=50, blank=True, verbose_name="Icône")
    
    class Meta:
        verbose_name = "Catégorie d'événement"
        verbose_name_plural = "Catégories d'événements"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Event(models.Model):
    """Modèle principal pour les événements/classes"""
    
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('published', 'Publié'),
        ('cancelled', 'Annulé'),
        ('completed', 'Terminé'),
    ]
    
    DIFFICULTY_CHOICES = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
        ('all_levels', 'Tous niveaux'),
    ]
    
    # Informations de base
    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    description = models.TextField(verbose_name="Description courte")
    long_description = models.TextField(verbose_name="Description détaillée")
    
    # Catégorie et statut
    category = models.ForeignKey(EventCategory, on_delete=models.CASCADE, verbose_name="Catégorie")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Statut")
    featured = models.BooleanField(default=False, verbose_name="En vedette")
    
    # Dates et horaires
    start_date = models.DateTimeField(verbose_name="Date et heure de début")
    end_date = models.DateTimeField(verbose_name="Date et heure de fin")
    registration_deadline = models.DateTimeField(verbose_name="Date limite d'inscription")
    
    # Lieu
    location = models.CharField(max_length=200, verbose_name="Lieu")
    address = models.TextField(verbose_name="Adresse complète")
    city = models.CharField(max_length=100, verbose_name="Ville")
    postal_code = models.CharField(max_length=10, verbose_name="Code postal")
    country = models.CharField(max_length=100, default="France", verbose_name="Pays")
    
    # Capacité et participants
    capacity = models.PositiveIntegerField(verbose_name="Capacité maximale")
    min_participants = models.PositiveIntegerField(default=1, verbose_name="Participants minimum")
    
    # Prix et paiement
    price = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Prix")
    currency = models.CharField(max_length=3, default="EUR", verbose_name="Devise")
    early_bird_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, verbose_name="Prix early bird")
    early_bird_deadline = models.DateTimeField(null=True, blank=True, verbose_name="Date limite early bird")
    
    # Niveau et prérequis
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='all_levels', verbose_name="Niveau")
    prerequisites = models.TextField(blank=True, verbose_name="Prérequis")
    
    # Organisateur et instructeur
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_events', verbose_name="Organisateur")
    instructor = models.CharField(max_length=200, blank=True, verbose_name="Instructeur")
    instructor_bio = models.TextField(blank=True, verbose_name="Biographie de l'instructeur")
    
    # Images et médias
    main_image = models.ImageField(upload_to='events/main_images/', verbose_name="Image principale")
    gallery = models.JSONField(default=list, blank=True, verbose_name="Galerie d'images")
    
    # Informations supplémentaires
    highlights = models.JSONField(default=list, blank=True, verbose_name="Points forts")
    schedule = models.JSONField(default=list, blank=True, verbose_name="Programme détaillé")
    materials_needed = models.TextField(blank=True, verbose_name="Matériel nécessaire")
    
    # Réseaux sociaux et contact
    website = models.URLField(blank=True, verbose_name="Site web")
    instagram = models.CharField(max_length=100, blank=True, verbose_name="Compte Instagram")
    facebook = models.CharField(max_length=100, blank=True, verbose_name="Page Facebook")
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    views_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de vues")
    
    class Meta:
        verbose_name = "Événement"
        verbose_name_plural = "Événements"
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['status', 'start_date']),
            models.Index(fields=['category', 'featured']),
            models.Index(fields=['city', 'start_date']),
        ]
    
    def __str__(self):
        return self.title
    
    @property
    def is_upcoming(self):
        """Vérifie si l'événement est à venir"""
        return self.start_date > timezone.now()
    
    @property
    def is_registration_open(self):
        """Vérifie si les inscriptions sont ouvertes"""
        return self.registration_deadline > timezone.now()
    
    @property
    def current_price(self):
        """Retourne le prix actuel (early bird ou normal)"""
        if (self.early_bird_price and self.early_bird_deadline and 
            timezone.now() <= self.early_bird_deadline):
            return self.early_bird_price
        return self.price
    
    @property
    def available_spots(self):
        """Calcule le nombre de places disponibles"""
        enrolled_count = self.enrollments.filter(status='confirmed').count()
        return max(0, self.capacity - enrolled_count)
    
    @property
    def enrollment_rate(self):
        """Calcule le taux d'inscription en pourcentage"""
        if self.capacity == 0:
            return 0
        enrolled_count = self.enrollments.filter(status='confirmed').count()
        return (enrolled_count / self.capacity) * 100
    
    def increment_views(self):
        """Incrémente le compteur de vues"""
        self.views_count += 1
        self.save(update_fields=['views_count'])

class EventEnrollment(models.Model):
    """Inscription d'un utilisateur à un événement"""
    
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('cancelled', 'Annulé'),
        ('waitlist', 'Liste d\'attente'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('paid', 'Payé'),
        ('failed', 'Échoué'),
        ('refunded', 'Remboursé'),
    ]
    
    # Relations
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='enrollments', verbose_name="Événement")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_enrollments', verbose_name="Utilisateur")
    
    # Statut et paiement
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Statut")
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending', verbose_name="Statut du paiement")
    
    # Informations d'inscription
    enrollment_date = models.DateTimeField(auto_now_add=True, verbose_name="Date d'inscription")
    price_paid = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Prix payé")
    currency = models.CharField(max_length=3, default="EUR", verbose_name="Devise")
    
    # Informations personnelles
    special_requests = models.TextField(blank=True, verbose_name="Demandes spéciales")
    dietary_restrictions = models.CharField(max_length=200, blank=True, verbose_name="Restrictions alimentaires")
    emergency_contact = models.CharField(max_length=200, blank=True, verbose_name="Contact d'urgence")
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        verbose_name = "Inscription à un événement"
        verbose_name_plural = "Inscriptions aux événements"
        unique_together = ['event', 'user']
        ordering = ['-enrollment_date']
        indexes = [
            models.Index(fields=['status', 'enrollment_date']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['event', 'status']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.event.title}"
    
    @property
    def is_active(self):
        """Vérifie si l'inscription est active"""
        return self.status in ['confirmed', 'pending']
    
    def save(self, *args, **kwargs):
        """Override save pour définir automatiquement le prix payé"""
        if not self.price_paid:
            self.price_paid = self.event.current_price
        super().save(*args, **kwargs)

class EventReview(models.Model):
    """Avis d'un utilisateur sur un événement"""
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reviews', verbose_name="Événement")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_reviews', verbose_name="Utilisateur")
    
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Note (1-5)"
    )
    comment = models.TextField(verbose_name="Commentaire")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        verbose_name = "Avis d'événement"
        verbose_name_plural = "Avis d'événements"
        unique_together = ['event', 'user']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Avis de {self.user.username} sur {self.event.title}"

class EventWaitlist(models.Model):
    """Liste d'attente pour un événement complet"""
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='waitlist', verbose_name="Événement")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_waitlist', verbose_name="Utilisateur")
    
    joined_at = models.DateTimeField(auto_now_add=True, verbose_name="Date d'ajout")
    notified = models.BooleanField(default=False, verbose_name="Notifié")
    
    class Meta:
        verbose_name = "Liste d'attente"
        verbose_name_plural = "Listes d'attente"
        unique_together = ['event', 'user']
        ordering = ['joined_at']
    
    def __str__(self):
        return f"{self.user.username} en attente pour {self.event.title}"
