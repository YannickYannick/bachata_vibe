from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify

User = get_user_model()

class Competition(models.Model):
    """Modèle pour les compétitions de bachata"""
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('registration_open', 'Inscriptions ouvertes'),
        ('registration_closed', 'Inscriptions fermées'),
        ('ongoing', 'En cours'),
        ('completed', 'Terminée'),
        ('cancelled', 'Annulée'),
    ]
    
    CATEGORY_CHOICES = [
        ('solo', 'Solo'),
        ('couple', 'Couple'),
        ('group', 'Groupe'),
        ('professional', 'Professionnel'),
        ('amateur', 'Amateur'),
        ('youth', 'Jeunesse'),
        ('senior', 'Senior'),
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
        related_name='created_competitions',
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
        related_name='approved_competitions',
        verbose_name=_('Approuvé par')
    )
    approved_at = models.DateTimeField(null=True, blank=True, verbose_name=_('Approuvé le'))
    
    # Catégorie et type
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='couple',
        verbose_name=_('Catégorie')
    )
    age_groups = models.JSONField(default=list, blank=True, verbose_name=_('Groupes d\'âge'))
    
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
        default=50,
        validators=[MinValueValidator(10), MaxValueValidator(1000)],
        verbose_name=_('Nombre maximum de participants')
    )
    current_participants = models.PositiveIntegerField(default=0, verbose_name=_('Participants actuels'))
    registration_fee = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0.00,
        verbose_name=_('Frais d\'inscription')
    )
    
    # Prix et récompenses
    prize_pool = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        verbose_name=_('Dotation totale')
    )
    currency = models.CharField(max_length=3, default='EUR', verbose_name=_('Devise'))
    prize_distribution = models.JSONField(default=dict, blank=True, verbose_name=_('Distribution des prix'))
    
    # Règles et critères
    rules = models.TextField(blank=True, verbose_name=_('Règlement'))
    judging_criteria = models.JSONField(default=list, blank=True, verbose_name=_('Critères de jugement'))
    time_limits = models.JSONField(default=dict, blank=True, verbose_name=_('Limites de temps'))
    
    # Juges
    judges = models.ManyToManyField(
        User,
        related_name='competition_judging',
        blank=True,
        verbose_name=_('Juges')
    )
    
    # Images et médias
    main_image = models.ImageField(
        upload_to='competitions/images/',
        blank=True,
        null=True,
        verbose_name=_('Image principale')
    )
    gallery = models.JSONField(default=list, blank=True, verbose_name=_('Galerie d\'images'))
    video_url = models.URLField(blank=True, verbose_name=_('Vidéo promotionnelle'))
    
    # Métadonnées
    tags = models.JSONField(default=list, blank=True, verbose_name=_('Tags'))
    website_url = models.URLField(blank=True, verbose_name=_('Site web'))
    social_media = models.JSONField(default=dict, blank=True, verbose_name=_('Réseaux sociaux'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Modifié le'))
    
    class Meta:
        verbose_name = _('Compétition')
        verbose_name_plural = _('Compétitions')
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['status', 'start_date']),
            models.Index(fields=['creator', 'status']),
            models.Index(fields=['city', 'start_date']),
            models.Index(fields=['category', 'status']),
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
    def is_registration_open(self):
        from django.utils import timezone
        return self.status == 'registration_open' and timezone.now() <= self.registration_deadline
    
    @property
    def is_upcoming(self):
        from django.utils import timezone
        return self.start_date > timezone.now()
    
    @property
    def is_ongoing(self):
        from django.utils import timezone
        now = timezone.now()
        return self.start_date <= now <= self.end_date

class CompetitionEnrollment(models.Model):
    """Inscription à une compétition"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('cancelled', 'Annulé'),
        ('completed', 'Terminé'),
    ]
    
    competition = models.ForeignKey(
        Competition,
        on_delete=models.CASCADE,
        related_name='enrollments',
        verbose_name=_('Compétition')
    )
    participant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='competition_enrollments',
        verbose_name=_('Participant')
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name=_('Statut')
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
    
    # Informations de compétition
    partner_name = models.CharField(max_length=100, blank=True, verbose_name=_('Nom du partenaire'))
    dance_style = models.CharField(max_length=50, blank=True, verbose_name=_('Style de danse'))
    music_choice = models.CharField(max_length=200, blank=True, verbose_name=_('Choix musical'))
    special_requests = models.TextField(blank=True, verbose_name=_('Demandes spéciales'))
    
    # Résultats
    final_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('Score final')
    )
    ranking = models.PositiveIntegerField(null=True, blank=True, verbose_name=_('Classement'))
    awards = models.JSONField(default=list, blank=True, verbose_name=_('Récompenses obtenues'))
    
    class Meta:
        verbose_name = _('Inscription à la compétition')
        verbose_name_plural = _('Inscriptions aux compétitions')
        unique_together = ['competition', 'participant']
        ordering = ['-enrolled_at']
    
    def __str__(self):
        return f"{self.participant.get_full_name()} - {self.competition.title}"


