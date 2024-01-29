# elevators/urls.py
from rest_framework import routers
from django.urls import path, include
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from .views import ElevatorViewSet, RequestViewSet, init_elevator_system, door_control, edit_system, run_system
router = routers.DefaultRouter()

router.register(r'elevators', ElevatorViewSet)
router.register(r'requests', RequestViewSet)

urlpatterns = [
    path(r'api/', include(router.urls)),
    path('', login_required(TemplateView.as_view(template_name='elevators.html')), name='home'),
    path(r'init/', login_required(init_elevator_system), name='init'),
    path(r'door/', login_required(door_control), name='door'),
    path(r'edit/', login_required(edit_system), name='edit'),
    path(r'run/', login_required(run_system), name='run'),
]