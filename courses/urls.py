from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CourseCategoryViewSet)
router.register(r'courses', views.CourseViewSet)
router.register(r'enrollments', views.CourseEnrollmentViewSet)

app_name = 'courses'

urlpatterns = [
    path('', include(router.urls)),
]


