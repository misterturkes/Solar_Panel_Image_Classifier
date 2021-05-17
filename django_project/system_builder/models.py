from django.db import models

class SolarArraySystem(models.Model):
    panelsInfo = models.JSONField()
