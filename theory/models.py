from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

class TheoryCategory(models.Model):
    """Catégorie de théorie (histoire, technique, culture, etc.)"""
    name = models.CharField(max_length=100, verbose_name=_('Nom'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    color = models.CharField(max_length=7, default='#8B5CF6', verbose_name=_('Couleur'))
    icon = models.CharField(max_length=50, blank=True, verbose_name=_('Icône'))
    order = models.PositiveIntegerField(default=0, verbose_name=_('Ordre d\'affichage'))
    
    class Meta:
        verbose_name = _('Catégorie de théorie')
        verbose_name_plural = _('Catégories de théorie')
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name

class TheoryCourse(models.Model):
    """Cours de théorie en ligne"""
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('pending', 'En attente de validation'),
        ('published', 'Publié'),
        ('archived', 'Archivé'),
    ]
    
    DIFFICULTY_CHOICES = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
        ('expert', 'Expert'),
    ]
    
    # Informations de base
    title = models.CharField(max_length=200, verbose_name=_('Titre'))
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name=_('Slug'))
    description = models.TextField(verbose_name=_('Description'))
    short_description = models.CharField(max_length=300, blank=True, verbose_name=_('Description courte'))
    
    # Auteur et statut
    author = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='theory_courses',
        verbose_name=_('Auteur')
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
        related_name='approved_theory_courses',
        verbose_name=_('Approuvé par')
    )
    approved_at = models.DateTimeField(null=True, blank=True, verbose_name=_('Approuvé le'))
    
    # Catégorie et niveau
    category = models.ForeignKey(
        TheoryCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Catégorie')
    )
    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default='beginner',
        verbose_name=_('Niveau de difficulté')
    )
    
    # Contenu et structure
    content = models.TextField(verbose_name=_('Contenu principal'))
    learning_objectives = models.JSONField(default=list, blank=True, verbose_name=_('Objectifs d\'apprentissage'))
    prerequisites = models.TextField(blank=True, verbose_name=_('Prérequis'))
    
    # Médias et ressources
    main_image = models.ImageField(
        upload_to='theory/images/',
        blank=True,
        null=True,
        verbose_name=_('Image principale')
    )
    video_url = models.URLField(blank=True, verbose_name=_('URL de la vidéo'))
    audio_url = models.URLField(blank=True, verbose_name=_('URL de l\'audio'))
    attachments = models.JSONField(default=list, blank=True, verbose_name=_('Fichiers joints'))
    
    # Métadonnées
    estimated_duration = models.PositiveIntegerField(
        default=30,
        validators=[MinValueValidator(5), MaxValueValidator(300)],
        verbose_name=_('Durée estimée (minutes)')
    )
    views_count = models.PositiveIntegerField(default=0, verbose_name=_('Nombre de vues'))
    likes_count = models.PositiveIntegerField(default=0, verbose_name=_('Nombre de likes'))
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        verbose_name=_('Note moyenne')
    )
    
    # Tags et mots-clés
    tags = models.JSONField(default=list, blank=True, verbose_name=_('Tags'))
    keywords = models.JSONField(default=list, blank=True, verbose_name=_('Mots-clés'))
    
    # Dates
    published_at = models.DateTimeField(null=True, blank=True, verbose_name=_('Publié le'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Modifié le'))
    
    class Meta:
        verbose_name = _('Cours de théorie')
        verbose_name_plural = _('Cours de théorie')
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['status', 'published_at']),
            models.Index(fields=['author', 'status']),
            models.Index(fields=['category', 'difficulty']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if self.status == 'published' and not self.published_at:
            from django.utils import timezone
            self.published_at = timezone.now()
        super().save(*args, **kwargs)
    
    def increment_views(self):
        self.views_count += 1
        self.save(update_fields=['views_count'])

class TheoryLesson(models.Model):
    """Leçon individuelle dans un cours de théorie"""
    title = models.CharField(max_length=200, verbose_name=_('Titre'))
    slug = models.SlugField(max_length=200, blank=True, verbose_name=_('Slug'))
    content = models.TextField(verbose_name=_('Contenu'))
    
    # Cours parent
    course = models.ForeignKey(
        TheoryCourse,
        on_delete=models.CASCADE,
        related_name='lessons',
        verbose_name=_('Cours')
    )
    
    # Ordre et structure
    order = models.PositiveIntegerField(default=0, verbose_name=_('Ordre dans le cours'))
    is_required = models.BooleanField(default=True, verbose_name=_('Leçon obligatoire'))
    
    # Médias
    video_url = models.URLField(blank=True, verbose_name=_('URL de la vidéo'))
    audio_url = models.URLField(blank=True, verbose_name=_('URL de l\'audio'))
    images = models.JSONField(default=list, blank=True, verbose_name=_('Images'))
    
    # Métadonnées
    duration_minutes = models.PositiveIntegerField(
        default=15,
        validators=[MinValueValidator(1), MaxValueValidator(120)],
        verbose_name=_('Durée (minutes)')
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Modifié le'))
    
    class Meta:
        verbose_name = _('Leçon de théorie')
        verbose_name_plural = _('Leçons de théorie')
        ordering = ['course', 'order']
        unique_together = ['course', 'order']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

class TheoryQuiz(models.Model):
    """Quiz pour tester les connaissances théoriques"""
    title = models.CharField(max_length=200, verbose_name=_('Titre'))
    description = models.TextField(blank=True, verbose_name=_('Description'))
    
    # Cours associé
    course = models.ForeignKey(
        TheoryCourse,
        on_delete=models.CASCADE,
        related_name='quizzes',
        verbose_name=_('Cours')
    )
    
    # Configuration
    passing_score = models.PositiveIntegerField(
        default=70,
        validators=[MinValueValidator(50), MaxValueValidator(100)],
        verbose_name=_('Score de réussite (%)')
    )
    time_limit_minutes = models.PositiveIntegerField(
        default=30,
        validators=[MinValueValidator(5), MaxValueValidator(180)],
        verbose_name=_('Limite de temps (minutes)')
    )
    max_attempts = models.PositiveIntegerField(
        default=3,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        verbose_name=_('Nombre maximum de tentatives')
    )
    
    # Questions
    questions = models.JSONField(default=list, verbose_name=_('Questions'))
    
    # Métadonnées
    is_active = models.BooleanField(default=True, verbose_name=_('Actif'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Modifié le'))
    
    class Meta:
        verbose_name = _('Quiz de théorie')
        verbose_name_plural = _('Quiz de théorie')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"

class TheoryProgress(models.Model):
    """Progression d'un utilisateur dans un cours de théorie"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='theory_progress',
        verbose_name=_('Utilisateur')
    )
    course = models.ForeignKey(
        TheoryCourse,
        on_delete=models.CASCADE,
        related_name='user_progress',
        verbose_name=_('Cours')
    )
    
    # Progression
    completed_lessons = models.JSONField(default=list, verbose_name=_('Leçons terminées'))
    current_lesson = models.ForeignKey(
        TheoryLesson,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Leçon actuelle')
    )
    progress_percentage = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name=_('Pourcentage de progression')
    )
    
    # Quiz et évaluations
    quiz_attempts = models.JSONField(default=dict, verbose_name=_('Tentatives de quiz'))
    best_quiz_score = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name=_('Meilleur score de quiz')
    )
    
    # Dates
    started_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Commencer le'))
    last_accessed = models.DateTimeField(auto_now=True, verbose_name=_('Dernière consultation'))
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name=_('Terminé le'))
    
    class Meta:
        verbose_name = _('Progression théorique')
        verbose_name_plural = _('Progressions théoriques')
        unique_together = ['user', 'course']
        ordering = ['-last_accessed']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.course.title}"
    
    def update_progress(self):
        """Met à jour le pourcentage de progression"""
        total_lessons = self.course.lessons.count()
        if total_lessons > 0:
            completed_count = len(self.completed_lessons)
            self.progress_percentage = int((completed_count / total_lessons) * 100)
            if self.progress_percentage == 100 and not self.completed_at:
                from django.utils import timezone
                self.completed_at = timezone.now()
            self.save()

class Article(models.Model):
    """Modèle pour les articles de théorie de la bachata"""
    CATEGORY_CHOICES = [
        ('technique', 'Technique'),
        ('histoire', 'Histoire'),
        ('culture', 'Culture'),
        ('musique', 'Musique'),
        ('style', 'Style'),
        ('anatomie', 'Anatomie et mouvement'),
        ('psychologie', 'Psychologie de la danse'),
        ('pedagogie', 'Pédagogie'),
        ('autre', 'Autre'),
    ]
    
    DIFFICULTY_CHOICES = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
    ]
    
    # Informations de base
    title = models.CharField(max_length=200, verbose_name=_('Titre'))
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name=_('Slug'))
    excerpt = models.TextField(blank=True, verbose_name=_('Extrait'))
    content = models.TextField(verbose_name=_('Contenu'))
    
    # Auteur et publication
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='authored_articles',
        verbose_name=_('Auteur')
    )
    author_name = models.CharField(max_length=200, blank=True, verbose_name=_('Nom de l\'auteur'))
    published_date = models.DateTimeField(verbose_name=_('Date de publication'))
    is_published = models.BooleanField(default=False, verbose_name=_('Publié'))
    is_featured = models.BooleanField(default=False, verbose_name=_('Mis en avant'))
    
    # Catégorisation
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='technique',
        verbose_name=_('Catégorie')
    )
    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default='beginner',
        verbose_name=_('Niveau de difficulté')
    )
    
    # Médias
    main_image = models.ImageField(
        upload_to='theory/images/',
        blank=True,
        null=True,
        verbose_name=_('Image principale')
    )
    gallery = models.JSONField(default=list, blank=True, verbose_name=_('Galerie d\'images'))
    video_url = models.URLField(blank=True, verbose_name=_('URL de la vidéo'))
    
    # Contenu enrichi
    tags = models.JSONField(default=list, blank=True, verbose_name=_('Tags'))
    related_articles = models.ManyToManyField(
        'self',
        blank=True,
        verbose_name=_('Articles liés')
    )
    resources = models.JSONField(default=list, blank=True, verbose_name=_('Ressources'))
    bibliography = models.TextField(blank=True, verbose_name=_('Bibliographie'))
    
    # Métadonnées
    reading_time = models.PositiveIntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(120)],
        verbose_name=_('Temps de lecture (minutes)')
    )
    views_count = models.PositiveIntegerField(default=0, verbose_name=_('Nombre de vues'))
    likes_count = models.PositiveIntegerField(default=0, verbose_name=_('Nombre de likes'))
    shares_count = models.PositiveIntegerField(default=0, verbose_name=_('Nombre de partages'))
    
    # Modération
    is_approved = models.BooleanField(default=False, verbose_name=_('Approuvé'))
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_articles',
        verbose_name=_('Approuvé par')
    )
    approved_at = models.DateTimeField(null=True, blank=True, verbose_name=_('Approuvé le'))
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Créé le'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Modifié le'))
    
    class Meta:
        verbose_name = _('Article')
        verbose_name_plural = _('Articles')
        ordering = ['-published_date']
        indexes = [
            models.Index(fields=['is_published', 'is_featured']),
            models.Index(fields=['category', 'difficulty']),
            models.Index(fields=['author', 'is_published']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def increment_views(self):
        self.views_count += 1
        self.save(update_fields=['views_count'])
    
    def get_reading_time_display(self):
        if self.reading_time < 60:
            return f"{self.reading_time} min"
        else:
            hours = self.reading_time // 60
            minutes = self.reading_time % 60
            if minutes == 0:
                return f"{hours}h"
            else:
                return f"{hours}h{minutes}"


