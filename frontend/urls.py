from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    # Toutes les routes du frontend sont gérées par React Router
    # Django sert le fichier index.html du build pour toutes les routes
    path('', TemplateView.as_view(template_name='index.html')),
    path('<path:path>', TemplateView.as_view(template_name='index.html')),
]








