from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'formations'

# Configuration du routeur DRF
router = DefaultRouter()
router.register(r'categories', views.FormationCategoryViewSet, basename='formation-category')
router.register(r'articles', views.FormationArticleViewSet, basename='formation-article')
router.register(r'favorites', views.FormationFavoriteViewSet, basename='formation-favorite')
router.register(r'comments', views.FormationCommentViewSet, basename='formation-comment')
router.register(r'progress', views.FormationProgressViewSet, basename='formation-progress')
router.register(r'search', views.FormationSearchViewSet, basename='formation-search')

urlpatterns = [
    # URLs de l'API DRF (sans le préfixe 'api/' car déjà inclus dans bachata_site/urls.py)
    path('', include(router.urls)),
    
    # URLs personnalisées pour des actions spécifiques
    path('articles/<slug:slug>/favorite/', 
         views.FormationFavoriteViewSet.as_view({'post': 'toggle'}), 
         name='article-favorite'),
    
    path('articles/<slug:slug>/progress/', 
         views.FormationProgressViewSet.as_view({'post': 'update_progress'}), 
         name='article-progress'),
    
    path('articles/<slug:slug>/comments/', 
         views.FormationCommentViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='article-comments'),
]

# URLs pour les vues frontend (à implémenter plus tard)
# urlpatterns += [
#     path('', views.FormationListView.as_view(), name='formation-list'),
#     path('category/<slug:slug>/', views.FormationCategoryView.as_view(), name='category-detail'),
#     path('article/<slug:slug>/', views.FormationArticleView.as_view(), name='article-detail'),
#     path('search/', views.FormationSearchView.as_view(), name='formation-search'),
#     path('favorites/', views.FormationFavoritesView.as_view(), name='formation-favorites'),
#     path('progress/', views.FormationProgressView.as_view(), name='formation-progress'),
# ]
