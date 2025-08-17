from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import User, UserProfile
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer,
    ProfileUpdateSerializer, LoginSerializer, PasswordChangeSerializer,
    ProfileUpdateSerializer
)
from .permissions import IsOwnerOrAdmin, IsAdminUser


class UserRegistrationView(generics.CreateAPIView):
    """
    Vue pour l'inscription des utilisateurs
    """
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Compte créé avec succès'
        }, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    """
    Vue pour la connexion des utilisateurs
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Connexion réussie'
        })


class UserLogoutView(APIView):
    """
    Vue pour la déconnexion des utilisateurs
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Déconnexion réussie'})
        except:
            return Response({'message': 'Erreur lors de la déconnexion'}, 
                          status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Vue pour afficher et modifier le profil utilisateur
    """
    serializer_class = UserSerializer
    permission_classes = [IsOwnerOrAdmin]
    
    def get_object(self):
        return self.request.user


class UserProfileUpdateView(generics.UpdateAPIView):
    """
    Vue pour mettre à jour le profil utilisateur
    """
    serializer_class = ProfileUpdateSerializer
    permission_classes = [IsOwnerOrAdmin]
    
    def get_object(self):
        return self.request.user.profile


class UserDetailView(generics.RetrieveAPIView):
    """
    Vue pour afficher le profil d'un autre utilisateur
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'username'


class UserListView(generics.ListAPIView):
    """
    Vue pour lister les utilisateurs (admin seulement)
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = User.objects.all()
        
        # Filtres
        user_type = self.request.query_params.get('user_type', None)
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        
        dance_level = self.request.query_params.get('dance_level', None)
        if dance_level:
            queryset = queryset.filter(dance_level=dance_level)
        
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(city__icontains=city)
        
        return queryset


class PasswordChangeView(APIView):
    """
    Vue pour changer le mot de passe
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'error': 'Ancien mot de passe incorrect'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        update_session_auth_hash(request, user)
        
        return Response({'message': 'Mot de passe modifié avec succès'})


class UserVerificationView(APIView):
    """
    Vue pour vérifier un compte utilisateur (admin seulement)
    """
    permission_classes = [IsAdminUser]
    
    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        user.is_verified = True
        user.save()
        
        return Response({
            'message': f'Compte de {user.username} vérifié avec succès',
            'user': UserSerializer(user).data
        })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user_view(request):
    """
    Vue pour récupérer l'utilisateur connecté
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_user_type_view(request):
    """
    Vue pour mettre à jour le type d'utilisateur (admin seulement)
    """
    if not request.user.is_admin():
        return Response({'error': 'Accès refusé'}, status=status.HTTP_403_FORBIDDEN)
    
    user_id = request.data.get('user_id')
    new_type = request.data.get('user_type')
    
    if not user_id or not new_type:
        return Response({'error': 'user_id et user_type requis'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(id=user_id)
        user.user_type = new_type
        user.save()
        
        return Response({
            'message': f'Type de compte de {user.username} mis à jour',
            'user': UserSerializer(user).data
        })
    except User.DoesNotExist:
        return Response({'error': 'Utilisateur non trouvé'}, 
                       status=status.HTTP_404_NOT_FOUND)




