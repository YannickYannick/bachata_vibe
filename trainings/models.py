from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify

User = get_user_model()

class Training(models.Model):
    """Modèle pour les trainings entre adhérents"""
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('pending', 'En attente de validation'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
        ('cancelled', 'Annulé'),
        ('ongoing', 'En cours'),
        ('completed', 'Terminé'),
    ]
    
    TYPE_CHOICES = [
        ('practice', 'Entraînement'),
        ('social', 'Danse sociale'),
        ('workshop', 'Atelier'),
        ('choreography', 'Chorégraphie'),
        ('technique', 'Technique'),
        ('other', 'Autre'),
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
        related_name='created_trainings',
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
        related_name='approved_trainings',
        verbose_name=_('Approuvé par')
    )
    approved_at = models.DateTimeField(null=True, blank=True, verbose_name=_('Approuvé le'))
    
    # Type et niveau
    training_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='practice',
        verbose_name=_('Type d\'entraînement')
    )
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Débutant'),
            ('intermediate', 'Intermédiaire'),
            ('advanced', 'Avancé'),
            ('all_levels', 'Tous niveaux'),
        ],
        default='all_levels',
        verbose_name=_('Niveau requis')
    )
    
    # Capacité et participants
    max_participants = models.PositiveIntegerField(
        default=10,
        validators=[MinValueValidator(2), MaxValueValidator(50)],
        verbose_name=_('Nombre maximum de participants')
    )
    current_participants = models.PositiveIntegerField(default=0, verbose_name=_('Participants actuels'))
    min_participants = models.PositiveIntegerField(
        default=2,
        validators=[MinValueValidator(2), MaxValueValidator(20)],
        verbose_name=_('Nombre minimum de participants')
    )
    
    # Horaires et localisation
    start_date = models.DateTimeField(verbose_name=_('Date et heure de début'))
    end_date = models.DateTimeField(verbose_name=_('Date et heure de fin'))
    duration_minutes = models.PositiveIntegerField(
        default=60,
        validators=[MinValueValidator(15), MaxValueValidator(480)],
        verbose_name=_('Durée en minutes')
    )
    location = models.CharField(max_length=200, verbose_name=_('Lieu'))
    address = models.TextField(blank=True, verbose_name=_('Adresse complète'))
    city = models.CharField(max_length=100, verbose_name=_('Ville'))
    postal_code = models.CharField(max_length=10, blank=True, verbose_name=_('Code postal'))
    
    # Prix et inscriptions
    price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0.00,
        verbose_name=_('Prix')
    )
    currency = models.CharField(max_length=3, default='EUR', verbose_name=_('Devise'))
    is_free = models.BooleanField(default=True, verbose_name=_('Gratuit'))
    
    # Contenu et matériel
    content = models.TextField(blank=True, verbose_name=_('Contenu détaillé'))
    objectives = models.TextField(blank=True, verbose_name=_('Objectifs'))
    prerequisites = models.TextField(blank=True, verbose_name=_('Prérequis'))
    materials_needed = models.TextField(blank=True, verbose_name=_('Matériel nécessaire'))
    
    # Images et médias
    main_image = models.ImageField(
        upload_to='trainings/images/',
        blank=True,
        null=True,
        verbose_name=_('Image principale')
    )
    gallery = models.JSONField(default=list, blank=True, verbose_name=_('Galerie d\'images'))
    
    # Métadonnées
    tags = models.JSONField(default=list, blank=True, verbose_name=_('Tags'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Modifié le'))
    
    class Meta:
        verbose_name = _('Training')
        verbose_name_plural = _('Trainings')
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['status', 'start_date']),
            models.Index(fields=['creator', 'status']),
            models.Index(fields=['city', 'start_date']),
            models.Index(fields=['training_type', 'difficulty']),
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
    def can_start(self):
        return self.current_participants >= self.min_participants

class TrainingEnrollment(models.Model):
    """Inscription à un training"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('cancelled', 'Annulé'),
        ('completed', 'Terminé'),
    ]
    
    training = models.ForeignKey(
        Training,
        on_delete=models.CASCADE,
        related_name='enrollments',
        verbose_name=_('Training')
    )
    participant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='training_enrollments',
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
    notes = models.TextField(blank=True, verbose_name=_('Notes'))
    
    class Meta:
        verbose_name = _('Inscription au training')
        verbose_name_plural = _('Inscriptions aux trainings')
        unique_together = ['training', 'participant']
        ordering = ['-enrolled_at']
    
    def __str__(self):
        return f"{self.participant.get_full_name()} - {self.training.title}"
