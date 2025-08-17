from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Modèle utilisateur personnalisé avec 3 types de comptes
    """
    USER_TYPE_CHOICES = [
        ('admin', 'Administrateur'),
        ('artist', 'Artiste'),
        ('participant', 'Participant'),
    ]
    
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='participant',
        verbose_name=_('Type d\'utilisateur')
    )
    
    # Informations personnelles
    phone = models.CharField(max_length=20, blank=True, verbose_name=_('Téléphone'))
    birth_date = models.DateField(null=True, blank=True, verbose_name=_('Date de naissance'))
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True, verbose_name=_('Photo de profil'))
    
    # Informations de danse
    dance_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Débutant'),
            ('intermediate', 'Intermédiaire'),
            ('advanced', 'Avancé'),
            ('professional', 'Professionnel'),
        ],
        default='beginner',
        verbose_name=_('Niveau de danse')
    )
    
    dance_styles = models.JSONField(default=list, blank=True, verbose_name=_('Styles de danse'))
    experience_years = models.PositiveIntegerField(default=0, verbose_name=_('Années d\'expérience'))
    
    # Informations de contact
    address = models.TextField(blank=True, verbose_name=_('Adresse'))
    city = models.CharField(max_length=100, blank=True, verbose_name=_('Ville'))
    country = models.CharField(max_length=100, default='France', verbose_name=_('Pays'))
    
    # Paramètres du compte
    is_verified = models.BooleanField(default=False, verbose_name=_('Compte vérifié'))
    newsletter_subscription = models.BooleanField(default=True, verbose_name=_('Abonnement newsletter'))
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Modifié le'))
    
    class Meta:
        verbose_name = _('Utilisateur')
        verbose_name_plural = _('Utilisateurs')
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_user_type_display()})"
    
    def is_admin(self):
        return self.user_type == 'admin'
    
    def is_artist(self):
        return self.user_type == 'artist'
    
    def is_participant(self):
        return self.user_type == 'participant'
    
    def can_create_courses(self):
        return self.is_admin() or self.is_artist()
    
    def can_create_festivals(self):
        return self.is_admin() or self.is_artist()
    
    def can_validate_content(self):
        return self.is_admin()


class UserProfile(models.Model):
    """
    Profil étendu pour les informations supplémentaires
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Biographie
    bio = models.TextField(blank=True, verbose_name=_('Biographie'))
    
    # Réseaux sociaux
    website = models.URLField(blank=True, verbose_name=_('Site web'))
    instagram = models.CharField(max_length=100, blank=True, verbose_name=_('Instagram'))
    facebook = models.CharField(max_length=100, blank=True, verbose_name=_('Facebook'))
    youtube = models.CharField(max_length=100, blank=True, verbose_name=_('YouTube'))
    
    # Préférences
    favorite_dance_style = models.CharField(max_length=50, blank=True, verbose_name=_('Style de danse préféré'))
    preferred_partner_gender = models.CharField(
        max_length=20,
        choices=[
            ('male', 'Homme'),
            ('female', 'Femme'),
            ('any', 'Peu importe'),
        ],
        default='any',
        verbose_name=_('Genre de partenaire préféré')
    )
    
    # Statistiques
    total_classes_attended = models.PositiveIntegerField(default=0, verbose_name=_('Total des cours suivis'))
    total_festivals_attended = models.PositiveIntegerField(default=0, verbose_name=_('Total des festivals suivis'))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Profil utilisateur')
        verbose_name_plural = _('Profils utilisateurs')
    
    def __str__(self):
        return f"Profil de {self.user.get_full_name()}"




