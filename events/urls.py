from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.EventCategoryViewSet)
router.register(r'events', views.EventViewSet)
router.register(r'enrollments', views.EventEnrollmentViewSet, basename='enrollment')
router.register(r'reviews', views.EventReviewViewSet, basename='review')

app_name = 'events'

urlpatterns = [
    path('', include(router.urls)),
]
