from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'festivals', views.FestivalViewSet)
router.register(r'enrollments', views.FestivalEnrollmentViewSet)

app_name = 'festivals'

urlpatterns = [
    path('', include(router.urls)),
]


