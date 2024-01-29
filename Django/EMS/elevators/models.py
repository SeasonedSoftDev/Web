# elevators/models.py
from django.db import models

# Create your models here.

class Elevator(models.Model):
    operational = models.BooleanField(default=True)
    in_maintenance = models.BooleanField(default=False)
    current_floor = models.IntegerField(default=1)
    moving_up = models.BooleanField(default=False)
    door_open = models.BooleanField(default=False)

class Request(models.Model):
    elevator = models.ForeignKey(Elevator, on_delete=models.CASCADE)
    requested_floor = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
