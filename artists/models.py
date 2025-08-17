from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify

User = get_user_model()

class ArtistProfile(models.Model):
    """Profil détaillé d'un artiste de bachata"""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='artist_profile',
        verbose_name=_('Utilisateur')
    )
    
    # Informations artistiques
    artist_name = models.CharField(max_length=200, blank=True, verbose_name=_('Nom d\'artiste'))
    bio = models.TextField(verbose_name=_('Biographie'))
    short_bio = models.CharField(max_length=300, blank=True, verbose_name=_('Biographie courte'))
    
    # Spécialités
    specialties = models.JSONField(default=list, blank=True, verbose_name=_('Spécialités'))
    dance_styles = models.JSONField(default=list, blank=True, verbose_name=_('Styles de danse'))
    teaching_experience = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Années d\'expérience d\'enseignement')
    )
    performance_experience = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Années d\'expérience de performance')
    )
    
    # Qualifications et certifications
    qualifications = models.JSONField(default=list, blank=True, verbose_name=_('Qualifications'))
    certifications = models.JSONField(default=list, blank=True, verbose_name=_('Certifications'))
    awards = models.JSONField(default=list, blank=True, verbose_name=_('Prix et récompenses'))
    
    # Images et médias
    profile_image = models.ImageField(
        upload_to='artists/profile_images/',
        blank=True,
        null=True,
        verbose_name=_('Image de profil')
    )
    gallery = models.JSONField(default=list, blank=True, verbose_name=_('Galerie d\'images'))
    demo_video = models.URLField(blank=True, verbose_name=_('Vidéo de démonstration'))
    
    # Réseaux sociaux et contact
    website = models.URLField(blank=True, verbose_name=_('Site web'))
    instagram = models.CharField(max_length=100, blank=True, verbose_name=_('Instagram'))
    facebook = models.CharField(max_length=100, blank=True, verbose_name=_('Facebook'))
    youtube = models.CharField(max_length=100, blank=True, verbose_name=_('YouTube'))
    tiktok = models.CharField(max_length=100, blank=True, verbose_name=_('TikTok'))
    
    # Disponibilité et services
    is_available_for_teaching = models.BooleanField(default=True, verbose_name=_('Disponible pour l\'enseignement'))
    is_available_for_performances = models.BooleanField(default=True, verbose_name=_('Disponible pour les performances'))
    is_available_for_workshops = models.BooleanField(default=True, verbose_name=_('Disponible pour les ateliers'))
    is_available_for_private_lessons = models.BooleanField(default=True, verbose_name=_('Disponible pour les cours privés'))
    
    # Tarifs
    teaching_rate_per_hour = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('Tarif d\'enseignement par heure')
    )
    performance_rate = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('Tarif de performance')
    )
    workshop_rate = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('Tarif d\'atelier')
    )
    currency = models.CharField(max_length=3, default='EUR', verbose_name=_('Devise'))
    
    # Localisation
    base_location = models.CharField(max_length=200, verbose_name=_('Lieu de base'))
    travel_radius = models.PositiveIntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(1000)],
        verbose_name=_('Rayon de déplacement (km)')
    )
    willing_to_travel = models.BooleanField(default=True, verbose_name=_('Prêt à voyager'))
    
    # Langues
    languages = models.JSONField(default=list, blank=True, verbose_name=_('Langues parlées'))
    
    # Métadonnées
    is_featured = models.BooleanField(default=False, verbose_name=_('Artiste mis en avant'))
    is_verified = models.BooleanField(default=False, verbose_name=_('Artiste vérifié'))
    views_count = models.PositiveIntegerField(default=0, verbose_name=_('Nombre de vues'))
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name=_('Note moyenne')
    )
    reviews_count = models.PositiveIntegerField(default=0, verbose_name=_('Nombre d\'avis'))
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Modifié le'))
    
    class Meta:
        verbose_name = _('Profil d\'artiste')
        verbose_name_plural = _('Profils d\'artistes')
        ordering = ['-rating', '-views_count']
        indexes = [
            models.Index(fields=['is_featured', 'is_verified']),
            models.Index(fields=['base_location', 'is_available_for_teaching']),
        ]
    
    def __str__(self):
        return self.artist_name or self.user.get_full_name()
    
    def increment_views(self):
        self.views_count += 1
        self.save(update_fields=['views_count'])

class ArtistPortfolio(models.Model):
    """Portfolio d'un artiste avec ses réalisations"""
    artist = models.ForeignKey(
        ArtistProfile,
        on_delete=models.CASCADE,
        related_name='portfolio_items',
        verbose_name=_('Artiste')
    )
    
    # Informations de base
    title = models.CharField(max_length=200, verbose_name=_('Titre'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    category = models.CharField(
        max_length=50,
        choices=[
            ('performance', 'Performance'),
            ('choreography', 'Chorégraphie'),
            ('teaching', 'Enseignement'),
            ('competition', 'Compétition'),
            ('workshop', 'Atelier'),
            ('other', 'Autre'),
        ],
        verbose_name=_('Catégorie')
    )
    
    # Médias
    main_image = models.ImageField(
        upload_to='artists/portfolio/images/',
        blank=True,
        null=True,
        verbose_name=_('Image principale')
    )
    images = models.JSONField(default=list, blank=True, verbose_name=_('Images'))
    video_url = models.URLField(blank=True, verbose_name=_('URL de la vidéo'))
    
    # Détails
    date = models.DateField(verbose_name=_('Date'))
    location = models.CharField(max_length=200, blank=True, verbose_name=_('Lieu'))
    collaborators = models.JSONField(default=list, blank=True, verbose_name=_('Collaborateurs'))
    tags = models.JSONField(default=list, blank=True, verbose_name=_('Tags'))
    
    # Métadonnées
    is_featured = models.BooleanField(default=False, verbose_name=_('Mis en avant'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Modifié le'))
    
    class Meta:
        verbose_name = _('Portfolio d\'artiste')
        verbose_name_plural = _('Portfolios d\'artistes')
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.artist} - {self.title}"

class ArtistReview(models.Model):
    """Avis d'un utilisateur sur un artiste"""
    artist = models.ForeignKey(
        ArtistProfile,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name=_('Artiste')
    )
    reviewer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='artist_reviews_given',
        verbose_name=_('Évaluateur')
    )
    
    # Évaluation
    overall_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name=_('Note globale (1-5)')
    )
    teaching_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name=_('Note enseignement (1-5)')
    )
    performance_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name=_('Note performance (1-5)')
    )
    professionalism_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name=_('Note professionnalisme (1-5)')
    )
    
    # Commentaires
    title = models.CharField(max_length=200, blank=True, verbose_name=_('Titre de l\'avis'))
    comment = models.TextField(verbose_name=_('Commentaire'))
    
    # Contexte
    context = models.CharField(
        max_length=50,
        choices=[
            ('course', 'Cours'),
            ('workshop', 'Atelier'),
            ('performance', 'Performance'),
            ('private_lesson', 'Cours privé'),
            ('festival', 'Festival'),
            ('other', 'Autre'),
        ],
        verbose_name=_('Contexte')
    )
    event_date = models.DateField(null=True, blank=True, verbose_name=_('Date de l\'événement'))
    
    # Métadonnées
    is_verified = models.BooleanField(default=False, verbose_name=_('Avis vérifié'))
    helpful_votes = models.PositiveIntegerField(default=0, verbose_name=_('Votes utiles'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Modifié le'))
    
    class Meta:
        verbose_name = _('Avis d\'artiste')
        verbose_name_plural = _('Avis d\'artistes')
        unique_together = ['artist', 'reviewer']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Avis de {self.reviewer.get_full_name()} sur {self.artist}"
    
    def get_average_rating(self):
        ratings = [
            self.overall_rating,
            self.teaching_rating,
            self.performance_rating,
            self.professionalism_rating
        ]
        return sum(ratings) / len(ratings)

class ArtistAvailability(models.Model):
    """Disponibilités d'un artiste"""
    artist = models.ForeignKey(
        ArtistProfile,
        on_delete=models.CASCADE,
        related_name='availabilities',
        verbose_name=_('Artiste')
    )
    
    # Période
    start_date = models.DateField(verbose_name=_('Date de début'))
    end_date = models.DateField(verbose_name=_('Date de fin'))
    
    # Type de disponibilité
    availability_type = models.CharField(
        max_length=50,
        choices=[
            ('teaching', 'Enseignement'),
            ('performance', 'Performance'),
            ('workshop', 'Atelier'),
            ('private_lesson', 'Cours privé'),
            ('consultation', 'Consultation'),
            ('other', 'Autre'),
        ],
        verbose_name=_('Type de disponibilité')
    )
    
    # Détails
    description = models.TextField(blank=True, verbose_name=_('Description'))
    is_available = models.BooleanField(default=True, verbose_name=_('Disponible'))
    notes = models.TextField(blank=True, verbose_name=_('Notes'))
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Modifié le'))
    
    class Meta:
        verbose_name = _('Disponibilité d\'artiste')
        verbose_name_plural = _('Disponibilités d\'artistes')
        ordering = ['start_date']
    
    def __str__(self):
        return f"{self.artist} - {self.availability_type} ({self.start_date} - {self.end_date})"


