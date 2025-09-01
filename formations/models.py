from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.urls import reverse
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from django.utils import timezone


class FormationCategory(models.Model):
    """Catégorie de formation (ex: Niveau, Style, Technique)"""
    name = models.CharField(max_length=100, verbose_name="Nom")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="Slug")
    description = models.TextField(blank=True, verbose_name="Description")
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, 
                             related_name='children', verbose_name="Catégorie parente")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre d'affichage")
    icon = models.CharField(max_length=50, blank=True, verbose_name="Icône (classe CSS)")
    is_active = models.BooleanField(default=True, verbose_name="Active")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")

    class Meta:
        verbose_name = "Catégorie de formation"
        verbose_name_plural = "Catégories de formation"
        ordering = ['order', 'name']

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name

    def get_absolute_url(self):
        # URL temporaire pour éviter l'erreur NoReverseMatch
        return f"/formations/categories/{self.slug}/"

    def get_breadcrumbs(self):
        """Retourne le fil d'Ariane pour cette catégorie"""
        breadcrumbs = []
        current = self
        while current:
            breadcrumbs.insert(0, current)
            current = current.parent
        return breadcrumbs

    def get_articles_count(self):
        """Retourne le nombre d'articles dans cette catégorie et ses sous-catégories"""
        count = self.formationarticle_set.filter(status='published').count()
        for child in self.children.all():
            count += child.get_articles_count()
        return count


class FormationArticle(models.Model):
    """Article de formation"""
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('pending', 'En attente de validation'),
        ('published', 'Publié'),
        ('archived', 'Archivé'),
    ]
    
    LEVEL_CHOICES = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
    ]

    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    content = models.TextField(verbose_name="Contenu HTML")
    excerpt = models.TextField(max_length=500, blank=True, verbose_name="Extrait")
    
    # Métadonnées
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Auteur")
    category = models.ForeignKey(FormationCategory, on_delete=models.CASCADE, verbose_name="Catégorie")
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner', verbose_name="Niveau")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Statut")
    
    # SEO et affichage
    meta_description = models.TextField(max_length=160, blank=True, verbose_name="Description meta")
    featured_image = models.ImageField(upload_to='formations/images/', blank=True, verbose_name="Image à la une")
    reading_time = models.PositiveIntegerField(default=5, verbose_name="Temps de lecture (minutes)")
    
    # Statistiques
    views_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de vues")
    likes_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de likes")
    comments_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de commentaires")
    
    # Liens avec autres contenus
    related_courses = models.ManyToManyField('courses.Course', blank=True, verbose_name="Cours liés")
    related_festivals = models.ManyToManyField('festivals.Festival', blank=True, verbose_name="Festivals liés")
    related_events = models.ManyToManyField('events.Event', blank=True, verbose_name="Événements liés")
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de publication")
    
    # Versioning
    version = models.PositiveIntegerField(default=1, verbose_name="Version")
    previous_version = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, 
                                       related_name='next_versions', verbose_name="Version précédente")

    class Meta:
        verbose_name = "Article de formation"
        verbose_name_plural = "Articles de formation"
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        
        # Gestion du versioning
        if self.pk:
            old_instance = FormationArticle.objects.get(pk=self.pk)
            if old_instance.content != self.content or old_instance.title != self.title:
                self.version += 1
                self.previous_version = old_instance
        
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        # URL temporaire pour éviter l'erreur NoReverseMatch
        return f"/formations/articles/{self.slug}/"

    def get_breadcrumbs(self):
        """Retourne le fil d'Ariane pour cet article"""
        breadcrumbs = self.category.get_breadcrumbs()
        breadcrumbs.append(self)
        return breadcrumbs

    def increment_views(self):
        """Incrémente le compteur de vues"""
        self.views_count += 1
        self.save(update_fields=['views_count'])

    def update_comments_count(self):
        """Met à jour le compteur de commentaires"""
        self.comments_count = self.comments.filter(is_approved=True).count()
        self.save(update_fields=['comments_count'])

    def update_likes_count(self):
        """Met à jour le compteur de likes"""
        self.likes_count = self.formationfavorite_set.filter(is_active=True).count()
        self.save(update_fields=['likes_count'])


class FormationFavorite(models.Model):
    """Favoris des utilisateurs pour les articles"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Utilisateur")
    article = models.ForeignKey(FormationArticle, on_delete=models.CASCADE, verbose_name="Article")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date d'ajout")
    notes = models.TextField(blank=True, verbose_name="Notes personnelles")

    class Meta:
        verbose_name = "Favori de formation"
        verbose_name_plural = "Favoris de formation"
        unique_together = ['user', 'article']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.article.title}"


class FormationComment(models.Model):
    """Commentaires sur les articles de formation"""
    article = models.ForeignKey(FormationArticle, on_delete=models.CASCADE, 
                               related_name='comments', verbose_name="Article")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Auteur")
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, 
                              related_name='replies', verbose_name="Commentaire parent")
    
    content = models.TextField(verbose_name="Contenu")
    is_approved = models.BooleanField(default=False, verbose_name="Approuvé")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    
    # Modération
    moderated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, 
                                    related_name='moderated_comments', verbose_name="Modéré par")
    moderated_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de modération")
    moderation_notes = models.TextField(blank=True, verbose_name="Notes de modération")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")

    class Meta:
        verbose_name = "Commentaire de formation"
        verbose_name_plural = "Commentaires de formation"
        ordering = ['created_at']

    def __str__(self):
        return f"Commentaire de {self.author.username} sur {self.article.title}"

    def get_replies_count(self):
        """Retourne le nombre de réponses"""
        return self.replies.filter(is_approved=True, is_active=True).count()


class FormationProgress(models.Model):
    """Suivi de progression de lecture des utilisateurs"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Utilisateur")
    article = models.ForeignKey(FormationArticle, on_delete=models.CASCADE, verbose_name="Article")
    
    # Progression
    is_started = models.BooleanField(default=False, verbose_name="Lecture commencée")
    is_completed = models.BooleanField(default=False, verbose_name="Lecture terminée")
    progress_percentage = models.PositiveIntegerField(
        default=0, 
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Pourcentage de progression"
    )
    
    # Suivi temporel
    started_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de début")
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de fin")
    last_read_at = models.DateTimeField(auto_now=True, verbose_name="Dernière lecture")
    
    # Temps passé
    total_reading_time = models.PositiveIntegerField(default=0, verbose_name="Temps total de lecture (secondes)")
    
    # Notes personnelles
    personal_notes = models.TextField(blank=True, verbose_name="Notes personnelles")
    difficulty_rating = models.PositiveIntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Note de difficulté (1-5)"
    )

    class Meta:
        verbose_name = "Progression de formation"
        verbose_name_plural = "Progressions de formation"
        unique_together = ['user', 'article']
        ordering = ['-last_read_at']

    def __str__(self):
        return f"Progression de {self.user.username} sur {self.article.title}"

    def update_progress(self, percentage):
        """Met à jour la progression"""
        self.progress_percentage = max(0, min(100, percentage))
        
        if percentage > 0 and not self.is_started:
            self.is_started = True
            self.started_at = timezone.now()
        
        if percentage >= 100 and not self.is_completed:
            self.is_completed = True
            self.completed_at = timezone.now()
        
        self.save()

    def get_time_spent_formatted(self):
        """Retourne le temps passé formaté"""
        minutes = self.total_reading_time // 60
        seconds = self.total_reading_time % 60
        if minutes > 0:
            return f"{minutes}m {seconds}s"
        return f"{seconds}s"


class FormationMedia(models.Model):
    """Médias attachés aux articles de formation"""
    MEDIA_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Vidéo'),
        ('audio', 'Audio'),
        ('document', 'Document'),
        ('archive', 'Archive'),
    ]

    article = models.ForeignKey(FormationArticle, on_delete=models.CASCADE, 
                               related_name='media_files', verbose_name="Article")
    file = models.FileField(upload_to='formations/media/', verbose_name="Fichier")
    file_type = models.CharField(max_length=20, choices=MEDIA_TYPE_CHOICES, verbose_name="Type de fichier")
    title = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(blank=True, verbose_name="Description")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre d'affichage")
    
    # Métadonnées
    file_size = models.PositiveIntegerField(blank=True, null=True, verbose_name="Taille du fichier (bytes)")
    duration = models.PositiveIntegerField(blank=True, null=True, verbose_name="Durée (secondes)")
    dimensions = models.CharField(max_length=50, blank=True, verbose_name="Dimensions (WxH)")
    
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")

    class Meta:
        verbose_name = "Média de formation"
        verbose_name_plural = "Médias de formation"
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.title} ({self.get_file_type_display()})"

    def save(self, *args, **kwargs):
        if not self.file_size and self.file:
            self.file_size = self.file.size
        super().save(*args, **kwargs)

    def get_file_size_formatted(self):
        """Retourne la taille du fichier formatée"""
        if not self.file_size:
            return "0 B"
        
        for unit in ['B', 'KB', 'MB', 'GB']:
            if self.file_size < 1024.0:
                return f"{self.file_size:.1f} {unit}"
            self.file_size /= 1024.0
        return f"{self.file_size:.1f} TB"


class FormationSearchLog(models.Model):
    """Log des recherches effectuées par les utilisateurs"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Utilisateur")
    query = models.CharField(max_length=500, blank=True, verbose_name="Requête de recherche")
    results_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de résultats")
    filters_applied = models.JSONField(default=dict, verbose_name="Filtres appliqués")
    ip_address = models.GenericIPAddressField(blank=True, null=True, verbose_name="Adresse IP")
    user_agent = models.TextField(blank=True, verbose_name="User Agent")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de recherche")

    class Meta:
        verbose_name = "Log de recherche de formation"
        verbose_name_plural = "Logs de recherche de formation"
        ordering = ['-created_at']

    def __str__(self):
        return f"Recherche: {self.query} ({self.results_count} résultats)"
