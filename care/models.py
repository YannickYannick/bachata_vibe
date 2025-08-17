from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify

User = get_user_model()

class Service(models.Model):
    """Modèle pour les services de soins et bien-être"""
    CATEGORY_CHOICES = [
        ('massage', 'Massage'),
        ('physiotherapie', 'Physiothérapie'),
        ('osteopathie', 'Ostéopathie'),
        ('nutrition', 'Nutrition'),
        ('bien_etre', 'Bien-être'),
        ('yoga', 'Yoga'),
        ('meditation', 'Méditation'),
        ('reiki', 'Reiki'),
        ('autre', 'Autre'),
    ]
    
    # Informations de base
    title = models.CharField(max_length=200, verbose_name=_('Titre'))
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name=_('Slug'))
    description = models.TextField(verbose_name=_('Description'))
    short_description = models.CharField(max_length=300, blank=True, verbose_name=_('Description courte'))
    
    # Catégorisation
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='bien_etre',
        verbose_name=_('Catégorie')
    )
    
    # Pratiquant
    practitioner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='care_services',
        verbose_name=_('Pratiquant')
    )
    practitioner_name = models.CharField(max_length=200, blank=True, verbose_name=_('Nom du pratiquant'))
    practitioner_email = models.EmailField(blank=True, verbose_name=_('Email du pratiquant'))
    practitioner_phone = models.CharField(max_length=20, blank=True, verbose_name=_('Téléphone du pratiquant'))
    qualifications = models.TextField(blank=True, verbose_name=_('Qualifications'))
    
    # Localisation
    location = models.CharField(max_length=200, verbose_name=_('Lieu'))
    address = models.TextField(blank=True, verbose_name=_('Adresse complète'))
    city = models.CharField(max_length=100, verbose_name=_('Ville'))
    postal_code = models.CharField(max_length=10, blank=True, verbose_name=_('Code postal'))
    country = models.CharField(max_length=100, default='France', verbose_name=_('Pays'))
    
    # Prix et durée
    price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0.00,
        verbose_name=_('Prix')
    )
    currency = models.CharField(max_length=3, default='EUR', verbose_name=_('Devise'))
    duration = models.PositiveIntegerField(
        default=60,
        validators=[MinValueValidator(15), MaxValueValidator(480)],
        verbose_name=_('Durée en minutes')
    )
    is_free = models.BooleanField(default=False, verbose_name=_('Gratuit'))
    
    # Disponibilité
    is_available = models.BooleanField(default=True, verbose_name=_('Disponible'))
    is_featured = models.BooleanField(default=False, verbose_name=_('Mis en avant'))
    schedule = models.JSONField(default=dict, blank=True, verbose_name=_('Horaires'))
    booking_required = models.BooleanField(default=True, verbose_name=_('Réservation requise'))
    
    # Médias
    main_image = models.ImageField(
        upload_to='care/images/',
        blank=True,
        null=True,
        verbose_name=_('Image principale')
    )
    gallery = models.JSONField(default=list, blank=True, verbose_name=_('Galerie d\'images'))
    video_url = models.URLField(blank=True, verbose_name=_('URL de la vidéo'))
    
    # Détails du service
    benefits = models.JSONField(default=list, blank=True, verbose_name=_('Avantages'))
    contraindications = models.TextField(blank=True, verbose_name=_('Contre-indications'))
    materials_needed = models.TextField(blank=True, verbose_name=_('Matériel nécessaire'))
    preparation_required = models.TextField(blank=True, verbose_name=_('Préparation requise'))
    
    # Métadonnées
    tags = models.JSONField(default=list, blank=True, verbose_name=_('Tags'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Modifié le'))
    
    class Meta:
        verbose_name = _('Service de soins')
        verbose_name_plural = _('Services de soins')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'is_available']),
            models.Index(fields=['practitioner', 'is_available']),
            models.Index(fields=['city', 'is_available']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def get_duration_display(self):
        if self.duration < 60:
            return f"{self.duration} min"
        else:
            hours = self.duration // 60
            minutes = self.duration % 60
            if minutes == 0:
                return f"{hours}h"
            else:
                return f"{hours}h{minutes}"


