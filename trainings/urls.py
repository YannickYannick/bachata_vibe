from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'trainings', views.TrainingViewSet)

app_name = 'trainings'

urlpatterns = [
    path('', include(router.urls)),
]


