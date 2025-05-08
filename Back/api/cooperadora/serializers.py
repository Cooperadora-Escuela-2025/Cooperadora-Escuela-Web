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
# Campos del modelo User
    first_name = serializers.CharField(source='user.first_name')  # Eliminado read_only=True
    last_name = serializers.CharField(source='user.last_name')    # Eliminado read_only=True
    email = serializers.EmailField(source='user.email', read_only=True)  # Solo lectura para email

    class Meta:
        model = Profile
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'dni', 'shift', 'grade_year', 'telephone']
        read_only_fields = ['user', 'email']  # 'user' y 'email' son solo lectura

        extra_kwargs = {
            'dni': {'required': False},
            'shift': {'required': False},
            'grade_year': {'required': False},
            'telephone': {'required': False},
        }

    def update(self, instance, validated_data):
        user = instance.user

        user_data = validated_data.pop('user', {})

        # Si vienen datos para user.first_name o user.last_name, actualizarlos
        if 'first_name' in user_data:
            user.first_name = user_data['first_name']
        if 'last_name' in user_data:
            user.last_name = user_data['last_name']
            user.save()

    # Actualizar los campos del modelo Profile (lo que queda en validated_data)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            instance.save()

            return instance