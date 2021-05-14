from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class SatelliteImagery(models.Model):
	photo = models.ImageField(upload_to='upload')
	username = models.CharField(default="",max_length=100)
	address = models.TextField(default="")
	date_posted = models.DateTimeField(default=timezone.now)
	confidence = models.FloatField(default=0)
    

