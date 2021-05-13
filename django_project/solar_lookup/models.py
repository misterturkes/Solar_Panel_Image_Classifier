from django.db import models

class SatelliteImagery(models.Model):
	photo = models.ImageField(upload_to='upload')
