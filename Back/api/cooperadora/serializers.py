from rest_framework import serializers
from .models import User,Profile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff']
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
        }

class ProfileSerializer(serializers.ModelSerializer):
    # campos del modelo User
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'dni', 'shift', 'grade_year','telephone']
        read_only_fields = ['user'] 
        extra_kwargs = { 
            'dni': {'required': False},
            'shift': {'required': False},
            'grade_year': {'required': False},
            'telephone': {'required': False},
        }



