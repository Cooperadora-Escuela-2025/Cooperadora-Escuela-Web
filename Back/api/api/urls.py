from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from cooperadora import views
from cooperadora.views import profile_view

router = DefaultRouter()


urlpatterns = [
    path('admin/', admin.site.urls),
    path('profile/', views.profile_view, name='profile'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)