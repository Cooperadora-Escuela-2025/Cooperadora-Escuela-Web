from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from cooperadora import views
from cooperadora.views import profile_view,login,register
from rest_framework_simplejwt import views as jwt_views

router = DefaultRouter()


urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', login, name='login'),  
    path('register/', views.register, name='register'), 
    path('profile/', views.profile_view, name='profile'),
    
     #rutas para obtener el token de acceso y el token de actualización
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)