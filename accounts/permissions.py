from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission personnalisée : l'utilisateur peut accéder à ses propres données
    ou l'admin peut accéder à tout
    """
    
    def has_object_permission(self, request, view, obj):
        # L'admin peut tout faire
        if request.user.is_admin():
            return True
        
        # L'utilisateur peut accéder à ses propres données
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'id'):
            return obj.id == request.user.id
        
        return False


class IsAdminUser(permissions.BasePermission):
    """
    Permission personnalisée : seul l'admin peut accéder
    """
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin()


class IsArtistOrAdmin(permissions.BasePermission):
    """
    Permission personnalisée : l'artiste ou l'admin peut accéder
    """
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_admin() or request.user.is_artist()
        )


class IsOwnerArtistOrAdmin(permissions.BasePermission):
    """
    Permission personnalisée : le propriétaire (artiste), ou l'admin peut accéder
    """
    
    def has_object_permission(self, request, view, obj):
        # L'admin peut tout faire
        if request.user.is_admin():
            return True
        
        # L'artiste peut accéder à ses propres créations
        if hasattr(obj, 'creator') and obj.creator == request.user:
            return True
        
        return False


class CanCreateContent(permissions.BasePermission):
    """
    Permission personnalisée : peut créer du contenu (cours, festivals)
    """
    
    def has_permission(self, request, view):
        if request.method == 'GET':
            return True
        
        return request.user.is_authenticated and (
            request.user.is_admin() or request.user.is_artist()
        )


class CanValidateContent(permissions.BasePermission):
    """
    Permission personnalisée : peut valider du contenu (admin seulement)
    """
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin()




