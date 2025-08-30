from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Authentification
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.UserLoginView.as_view(), name='user-login'),
    path('logout/', views.UserLogoutView.as_view(), name='user-logout'),
    
    # Profil utilisateur
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('profile/update/', views.UserProfileUpdateView.as_view(), name='profile-update'),
    path('current-user/', views.current_user_view, name='current-user'),
    
    # Gestion des utilisateurs (admin)
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<str:username>/', views.UserDetailView.as_view(), name='user-detail'),
    path('users/<int:user_id>/verify/', views.UserVerificationView.as_view(), name='user-verify'),
    path('users/update-type/', views.update_user_type_view, name='update-user-type'),
    
    # Mot de passe
    path('password/change/', views.PasswordChangeView.as_view(), name='password-change'),
]









