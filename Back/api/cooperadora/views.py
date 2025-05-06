from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from .models import Profile
from .serializers import UserSerializer,ProfileSerializer



@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])  # Solo usuarios autenticados pueden acceder
def profile_view(request):
    user = request.user 
    try:
        
        profile = request.user.profile  # Accede al perfil del usuario autenticado
    except Profile.DoesNotExist:
        return Response({'error': 'Perfil no encontrado'}, status=404)

    if request.method == 'GET':
        # Mostrar los datos del perfil
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Actualizar los datos del perfil
        serializer = ProfileSerializer(profile, data=request.data, partial=True)  # `partial=True` permite actualizar solo los campos enviados
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
