from django.contrib import admin
from django.urls import path, include
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from cooperadora import views
from cooperadora.views import ProcedureViewSet,all_profile_view, profile_view,login,register, register_user_by_admin
from rest_framework_simplejwt import views as jwt_views
from cooperadora.views import ProductViewSet, UserViewSet, OrderViewSet, CheckoutView, download_orders_excel,create_preference


router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'users', UserViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'procedure',ProcedureViewSet, basename='procedure')



urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('login/', login, name='login'),  
    path('register/', views.register, name='register'), 
    path('profile/', views.profile_view, name='profile'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('download-orders/', download_orders_excel, name='download_orders'),
    path('all-users/', all_profile_view, name='profile-list'),  
    path('all-users/<int:pk>/', all_profile_view, name='profile-detail') ,
    path('create-user/', register_user_by_admin, name='register_user_by_admin'),
    path('mercadopago/', create_preference, name='mercadopago'),
    # path('procedure',Procedure.as_view(),name='procedure'),
    #rutas para obtener el token de acceso y el token de actualización
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)