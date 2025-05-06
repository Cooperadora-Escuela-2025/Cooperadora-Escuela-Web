from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from .models import Profile,User
from .serializers import UserSerializer,ProfileSerializer
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets,permissions
import json
from django.http import JsonResponse

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_superuser=False)
    serializer_class = UserSerializer
    # permission_classes = [IsAdminUser]
    
class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])  #solo usuarios autenticados pueden acceder
def profile_view(request):
    user = request.user 
    try:
        
        profile = request.user.profile  
    except Profile.DoesNotExist:
        return Response({'error': 'Perfil no encontrado'}, status=404)

    if request.method == 'GET':
        #muestra los datos del perfil
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    elif request.method == 'PUT':
        #actualiza los datos del perfil
        serializer = ProfileSerializer(profile, data=request.data, partial=True)  
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)



User = get_user_model()
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])  
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Email y contraseña son requeridos'}, status=400)

    try:
        #verifica si esta en la base de datos
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=404)

    #verifica si la contraseña es correcta
    if not check_password(password, user.password):
        return Response({'error': 'Contraseña incorrecta'}, status=401)

    #verificar si el usuario esta activo
    if not user.is_active:
        return Response({'error': 'Cuenta inactiva'}, status=403)

    #genera los tokens jwt
    refresh = RefreshToken.for_user(user)

    #devuelve los tokens y la info del usuario
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,          
            'is_superuser': user.is_superuser 
        }
    })
    
    
User = get_user_model()
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            email = data.get('email')
            password = data.get('password')
            password2 = data.get('password2')

            #verifica que no falte ningún dato
            if not all([first_name, last_name, email, password, password2]):
                return JsonResponse({"error": "Todos los campos son obligatorios."}, status=400)

            #verifica que las contraseñas sean iguales
            if password != password2:
                return JsonResponse({"error": "Las contraseñas no coinciden."}, status=400)

            #verifica si el email ya existe
            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "El email ya está registrado."}, status=400)

            #se crea el usuario
            user = User.objects.create_user(
                username=email,  #usar el email como username
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password
            )

            #crea el perfil
            Profile.objects.create(user=user)

            return JsonResponse({"message": "Usuario creado exitosamente."}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Formato JSON inválido."}, status=400)

        except Exception as e:
            return JsonResponse({"error": f"Error en el servidor: {str(e)}"}, status=500)

    else:
        return JsonResponse({"error": "Método no permitido."}, status=405)


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff