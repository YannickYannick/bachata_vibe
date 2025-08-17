from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'bio', 'website', 'instagram', 'facebook', 'youtube',
            'favorite_dance_style', 'preferred_partner_gender',
            'total_classes_attended', 'total_festivals_attended'
        ]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    user_type_display = serializers.CharField(source='get_user_type_display', read_only=True)
    dance_level_display = serializers.CharField(source='get_dance_level_display', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'user_type', 'user_type_display', 'phone', 'birth_date',
            'profile_picture', 'dance_level', 'dance_level_display',
            'dance_styles', 'experience_years', 'address', 'city',
            'country', 'is_verified', 'newsletter_subscription',
            'created_at', 'updated_at', 'profile'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_verified']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'user_type', 'phone',
            'birth_date', 'dance_level', 'city', 'country'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        # Créer automatiquement le profil
        UserProfile.objects.create(user=user)
        
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone', 'birth_date',
            'profile_picture', 'dance_level', 'dance_styles',
            'experience_years', 'address', 'city', 'country',
            'newsletter_subscription'
        ]


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'bio', 'website', 'instagram', 'facebook', 'youtube',
            'favorite_dance_style', 'preferred_partner_gender'
        ]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Identifiants invalides.')
            if not user.is_active:
                raise serializers.ValidationError('Compte désactivé.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Username et password requis.')
        
        return attrs


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Les nouveaux mots de passe ne correspondent pas.")
        return attrs


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField()
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Les nouveaux mots de passe ne correspondent pas.")
        return attrs




