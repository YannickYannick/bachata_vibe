from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour permettre aux auteurs de modifier leurs propres commentaires
    """
    
    def has_object_permission(self, request, view, obj):
        # Lecture autorisée pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Écriture autorisée seulement pour l'auteur
        return obj.author == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour permettre aux admins de tout modifier
    """
    
    def has_permission(self, request, view):
        # Lecture autorisée pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Écriture autorisée seulement pour les admins
        return request.user and request.user.is_staff


class IsAuthorOrAdminOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour permettre aux auteurs et admins de modifier
    """
    
    def has_object_permission(self, request, view, obj):
        # Lecture autorisée pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Écriture autorisée pour l'auteur ou les admins
        return (obj.author == request.user) or (request.user and request.user.is_staff)


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour permettre la lecture à tous et l'écriture aux utilisateurs connectés
    """
    
    def has_permission(self, request, view):
        # Lecture autorisée pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Écriture autorisée seulement pour les utilisateurs connectés
        return request.user and request.user.is_authenticated


class CanCreateArticle(permissions.BasePermission):
    """
    Permission pour créer des articles (admins et profs/artistes)
    """
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Vérifier si l'utilisateur est connecté
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Admins peuvent tout faire
        if request.user.is_staff:
            return True
        
        # Vérifier si l'utilisateur est un prof ou artiste
        # Vous pouvez adapter cette logique selon votre modèle User
        if hasattr(request.user, 'userprofile'):
            user_type = request.user.userprofile.user_type
            return user_type in ['admin', 'teacher', 'artist']
        
        return False


class CanModerateComments(permissions.BasePermission):
    """
    Permission pour modérer les commentaires
    """
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Seuls les admins peuvent modérer
        return request.user and request.user.is_staff


class CanViewDraftArticles(permissions.BasePermission):
    """
    Permission pour voir les articles en brouillon
    """
    
    def has_permission(self, request, view):
        # Lecture autorisée pour tous les articles publiés
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Pour voir les brouillons, il faut être admin ou l'auteur
        return request.user and request.user.is_authenticated and (
            request.user.is_staff or 
            (hasattr(request.user, 'userprofile') and 
             request.user.userprofile.user_type in ['admin', 'teacher', 'artist'])
        )
