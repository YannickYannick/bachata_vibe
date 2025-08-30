from rest_framework import permissions

class IsEventOrganizerOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour les événements.
    Permet la lecture à tous, mais la modification uniquement à l'organisateur.
    """
    
    def has_permission(self, request, view):
        # Permettre la lecture à tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permettre la création aux utilisateurs authentifiés
        if request.method == 'POST':
            return request.user.is_authenticated
        
        return True
    
    def has_object_permission(self, request, view, obj):
        # Permettre la lecture à tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permettre la modification uniquement à l'organisateur
        return obj.organizer == request.user

class IsEnrollmentOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission pour les inscriptions aux événements.
    Permet la lecture à tous, mais la modification uniquement au propriétaire.
    """
    
    def has_object_permission(self, request, view, obj):
        # Permettre la lecture à tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permettre la modification uniquement au propriétaire de l'inscription
        return obj.user == request.user

class IsReviewOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission pour les avis d'événements.
    Permet la lecture à tous, mais la modification uniquement à l'auteur.
    """
    
    def has_object_permission(self, request, view, obj):
        # Permettre la lecture à tous
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Permettre la modification uniquement à l'auteur de l'avis
        return obj.user == request.user

class IsEventParticipant(permissions.BasePermission):
    """
    Permission pour vérifier si un utilisateur a participé à un événement.
    Utile pour les avis et certaines actions.
    """
    
    def has_object_permission(self, request, view, obj):
        # Vérifier si l'utilisateur a participé à l'événement
        if hasattr(obj, 'event'):
            event = obj.event
        else:
            event = obj
        
        return event.enrollments.filter(
            user=request.user,
            status='confirmed'
        ).exists()

class IsEventOrganizer(permissions.BasePermission):
    """
    Permission pour vérifier si un utilisateur est l'organisateur d'un événement.
    """
    
    def has_object_permission(self, request, view, obj):
        return obj.organizer == request.user
