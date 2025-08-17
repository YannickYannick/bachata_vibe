from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'competitions', views.CompetitionViewSet)

app_name = 'competitions'

urlpatterns = [
    path('', include(router.urls)),
]


