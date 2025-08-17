from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    # Toutes les routes du frontend sont gérées par React Router
    # Django sert le fichier index.html pour toutes les routes
    path('', TemplateView.as_view(template_name='frontend/index.html')),
    path('<path:path>', TemplateView.as_view(template_name='frontend/index.html')),
]




