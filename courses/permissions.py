from rest_framework import permissions

class IsCreatorOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée permettant aux créateurs de modifier leurs cours
    et aux autres de les consulter uniquement.
    """
    
    def has_object_permission(self, request, view, obj):
        # Lecture autorisée pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Écriture autorisée seulement pour le créateur ou les admins
        return obj.creator == request.user or request.user.is_admin()

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission permettant aux admins de tout faire et aux autres de consulter uniquement.
    """
    
    def has_permission(self, request, view):
        # Lecture autorisée pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Écriture autorisée seulement pour les admins
        return request.user.is_authenticated and request.user.is_admin()

class IsAdminOrCreator(permissions.BasePermission):
    """
    Permission permettant aux admins et créateurs d'accéder aux objets.
    """
    
    def has_object_permission(self, request, view, obj):
        # Les admins peuvent tout faire
        if request.user.is_admin():
            return True
        
        # Les créateurs peuvent modifier leurs propres objets
        if hasattr(obj, 'creator'):
            return obj.creator == request.user
        
        # Par défaut, refuser l'accès
        return False

class IsEnrolledParticipant(permissions.BasePermission):
    """
    Permission permettant aux participants inscrits d'accéder aux détails d'un cours.
    """
    
    def has_object_permission(self, request, view, obj):
        # Lecture autorisée pour tous les cours approuvés
        if request.method in permissions.SAFE_METHODS:
            if obj.status == 'approved':
                return True
        
        # Les admins peuvent tout faire
        if request.user.is_admin():
            return True
        
        # Les créateurs peuvent modifier leurs cours
        if obj.creator == request.user:
            return True
        
        # Les participants inscrits peuvent voir les détails
        if request.user.is_authenticated:
            from .models import CourseEnrollment
            return CourseEnrollment.objects.filter(
                course=obj,
                participant=request.user,
                status__in=['confirmed', 'pending']
            ).exists()
        
        return False

class CanManageEnrollments(permissions.BasePermission):
    """
    Permission pour gérer les inscriptions aux cours.
    """
    
    def has_object_permission(self, request, view, obj):
        # Les admins peuvent tout faire
        if request.user.is_admin():
            return True
        
        # Les créateurs peuvent gérer les inscriptions à leurs cours
        if hasattr(obj, 'course') and obj.course.creator == request.user:
            return True
        
        # Les participants peuvent modifier leurs propres inscriptions
        if obj.participant == request.user:
            return True
        
        return False








