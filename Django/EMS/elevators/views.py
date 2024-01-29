# elevators/views.py
from rest_framework import viewsets
from .models import Elevator, Request
from .serializers import ElevatorSerializer, RequestSerializer
from django.http import HttpResponse

from datetime import datetime

from django.db import connection

class ElevatorViewSet(viewsets.ModelViewSet):
    queryset = Elevator.objects.all()
    serializer_class = ElevatorSerializer

class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer

# Function to init elevator system
def init_elevator_system(request):
    objects = Elevator.objects.all()
    # delete elevators set earlier 
    objects.delete() 
    # create new elevators according to the requested number of elevator
    for i in range(int(request.POST.get('num'))):
        newObjects = Elevator()
        newObjects.save()
    return HttpResponse('ok')

# Function to open & close the door according to the requested id of elevator
def door_control(request):
    id = int(request.POST.get('id'))
    with connection.cursor() as cursor:
        cursor.execute('UPDATE "elevators_elevator" SET "door_open" = %s WHERE id = %s', [request.POST.get('type'), id])
    return HttpResponse('ok')

# Function to run given elevator
def run_system(request):
    id = int(request.POST.get('id'))
    with connection.cursor() as cursor:
        cursor.execute('UPDATE "elevators_elevator" SET "moving_up" = %s, "current_floor" = %s WHERE id = %s', [request.POST.get('moving_up'), int(request.POST.get("current_floor")), id])
    return HttpResponse('ok')

# Fucntion to update the status of given elevator 
def edit_system(request):
    id = int(request.POST.get("id"))
    with connection.cursor() as cursor:
        cursor.execute('UPDATE "elevators_elevator" SET "in_maintenance" = %s, "operational" = %s WHERE id = %s', [request.POST.get('in_maintenance'), request.POST.get("operational"), id])
        # Decide to go up or down to which floor
        if (int(request.POST.get("to_floor")) != 0):
            if (request.POST.get("edit_type") == 'true'): 
                objects = Request.objects.get(elevator_id = id)
                objects.requested_floor = int(request.POST.get('to_floor'))
                objects.save()
            elif (request.POST.get("edit_type") == 'false'):
                objects = Request(
                    requested_floor = int(request.POST.get('to_floor')), elevator_id = id, 
                    created_at = datetime.now()
                )
                objects.save()
    return HttpResponse('ok')
