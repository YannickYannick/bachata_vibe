from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify

User = get_user_model()

class Festival(models.Model):
    """Modèle pour les festivals de bachata"""
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('pending', 'En attente de validation'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
        ('cancelled', 'Annulé'),
        ('ongoing', 'En cours'),
        ('completed', 'Terminé'),
    ]
    
    # Informations de base
    title = models.CharField(max_length=200, verbose_name=_('Titre'))
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name=_('Slug'))
    description = models.TextField(verbose_name=_('Description'))
    short_description = models.CharField(max_length=300, blank=True, verbose_name=_('Description courte'))
    
    # Créateur et statut
    creator = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='created_festivals',
        verbose_name=_('Créateur')
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        verbose_name=_('Statut')
    )
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_festivals',
        verbose_name=_('Approuvé par')
    )
    approved_at = models.DateTimeField(null=True, blank=True, verbose_name=_('Approuvé le'))
    
    # Dates et horaires
    start_date = models.DateTimeField(verbose_name=_('Date et heure de début'))
    end_date = models.DateTimeField(verbose_name=_('Date et heure de fin'))
    registration_deadline = models.DateTimeField(verbose_name=_('Date limite d\'inscription'))
    
    # Localisation
    location = models.CharField(max_length=200, verbose_name=_('Lieu'))
    address = models.TextField(blank=True, verbose_name=_('Adresse complète'))
    city = models.CharField(max_length=100, verbose_name=_('Ville'))
    postal_code = models.CharField(max_length=10, blank=True, verbose_name=_('Code postal'))
    country = models.CharField(max_length=100, default='France', verbose_name=_('Pays'))
    
    # Capacité et inscriptions
    max_participants = models.PositiveIntegerField(
        default=100,
        validators=[MinValueValidator(10), MaxValueValidator(10000)],
        verbose_name=_('Nombre maximum de participants')
    )
    current_participants = models.PositiveIntegerField(default=0, verbose_name=_('Participants actuels'))
    
    # Prix et packages
    base_price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        verbose_name=_('Prix de base')
    )
    currency = models.CharField(max_length=3, default='EUR', verbose_name=_('Devise'))
    is_free = models.BooleanField(default=False, verbose_name=_('Gratuit'))
    
    # Programmation
    schedule = models.JSONField(default=list, blank=True, verbose_name=_('Programme détaillé'))
    workshops = models.JSONField(default=list, blank=True, verbose_name=_('Ateliers'))
    performances = models.JSONField(default=list, blank=True, verbose_name=_('Spectacles'))
    social_dances = models.JSONField(default=list, blank=True, verbose_name=_('Danses sociales'))
    
    # Artistes et instructeurs
    artists = models.ManyToManyField(
        User,
        related_name='festival_appearances',
        blank=True,
        verbose_name=_('Artistes')
    )
    instructors = models.ManyToManyField(
        User,
        related_name='festival_teaching',
        blank=True,
        verbose_name=_('Instructeurs')
    )
    
    # Images et médias
    main_image = models.ImageField(
        upload_to='festivals/images/',
        blank=True,
        null=True,
        verbose_name=_('Image principale')
    )
    gallery = models.JSONField(default=list, blank=True, verbose_name=_('Galerie d\'images'))
    promotional_video = models.URLField(blank=True, verbose_name=_('Vidéo promotionnelle'))
    
    # Informations pratiques
    accommodation_info = models.TextField(blank=True, verbose_name=_('Informations sur l\'hébergement'))
    transportation_info = models.TextField(blank=True, verbose_name=_('Informations sur le transport'))
    food_info = models.TextField(blank=True, verbose_name=_('Informations sur la restauration'))
    
    # Métadonnées
    tags = models.JSONField(default=list, blank=True, verbose_name=_('Tags'))
    website_url = models.URLField(blank=True, verbose_name=_('Site web'))
    instagram = models.CharField(max_length=100, blank=True, verbose_name=_('Compte Instagram'))
    social_media = models.JSONField(default=dict, blank=True, verbose_name=_('Réseaux sociaux'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Modifié le'))
    
    class Meta:
        verbose_name = _('Festival')
        verbose_name_plural = _('Festivals')
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['status', 'start_date']),
            models.Index(fields=['creator', 'status']),
            models.Index(fields=['city', 'start_date']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    @property
    def is_full(self):
        return self.current_participants >= self.max_participants
    
    @property
    def available_spots(self):
        return max(0, self.max_participants - self.current_participants)
    
    @property
    def is_upcoming(self):
        from django.utils import timezone
        return self.start_date > timezone.now()
    
    @property
    def is_ongoing(self):
        from django.utils import timezone
        now = timezone.now()
        return self.start_date <= now <= self.end_date
    
    @property
    def duration_days(self):
        return (self.end_date - self.start_date).days + 1

class FestivalEnrollment(models.Model):
    """Inscription à un festival"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('cancelled', 'Annulé'),
        ('completed', 'Terminé'),
    ]
    
    PACKAGE_CHOICES = [
        ('basic', 'Basique'),
        ('standard', 'Standard'),
        ('premium', 'Premium'),
        ('vip', 'VIP'),
    ]
    
    festival = models.ForeignKey(
        Festival,
        on_delete=models.CASCADE,
        related_name='enrollments',
        verbose_name=_('Festival')
    )
    participant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='festival_enrollments',
        verbose_name=_('Participant')
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name=_('Statut')
    )
    package = models.CharField(
        max_length=20,
        choices=PACKAGE_CHOICES,
        default='basic',
        verbose_name=_('Package')
    )
    price_paid = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        verbose_name=_('Prix payé')
    )
    enrolled_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Inscrit le'))
    payment_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'En attente'),
            ('paid', 'Payé'),
            ('failed', 'Échoué'),
            ('refunded', 'Remboursé'),
        ],
        default='pending',
        verbose_name=_('Statut du paiement')
    )
    payment_method = models.CharField(max_length=50, blank=True, verbose_name=_('Méthode de paiement'))
    special_requests = models.TextField(blank=True, verbose_name=_('Demandes spéciales'))
    dietary_restrictions = models.TextField(blank=True, verbose_name=_('Restrictions alimentaires'))
    
    class Meta:
        verbose_name = _('Inscription au festival')
        verbose_name_plural = _('Inscriptions aux festivals')
        unique_together = ['festival', 'participant']
        ordering = ['-enrolled_at']
    
    def __str__(self):
        return f"{self.participant.get_full_name()} - {self.festival.title}"
