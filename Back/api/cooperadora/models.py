from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    # rol = models.CharField(max_length=10, choices=RolEnum.choices, default=RolEnum.USUARIO)
    dni = models.CharField(max_length=20,blank=True, null=True)
    shift  = models.CharField(max_length=20,blank=True, null=True)#turno
    grade_year = models.CharField(max_length=20,blank=True, null=True)#curso/año
    telephone = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return f"Perfil de {self.user.first_name} {self.user.last_name}"