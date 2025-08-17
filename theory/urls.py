from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'articles', views.ArticleViewSet)
router.register(r'courses', views.TheoryCourseViewSet)
router.register(r'lessons', views.TheoryLessonViewSet)

app_name = 'theory'

urlpatterns = [
    path('', include(router.urls)),
]


