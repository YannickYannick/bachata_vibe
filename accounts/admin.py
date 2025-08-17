from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, UserProfile


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profil'
    fk_name = 'user'


class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'is_verified', 'is_staff', 'is_active')
    list_filter = ('user_type', 'is_verified', 'is_staff', 'is_active', 'dance_level', 'city', 'country')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'city')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Informations personnelles'), {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'birth_date', 'profile_picture')
        }),
        (_('Type de compte'), {'fields': ('user_type', 'is_verified')}),
        (_('Informations de danse'), {
            'fields': ('dance_level', 'dance_styles', 'experience_years')
        }),
        (_('Informations de contact'), {
            'fields': ('address', 'city', 'country')
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Dates importantes'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'user_type'),
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('profile')


admin.site.register(User, UserAdmin)




