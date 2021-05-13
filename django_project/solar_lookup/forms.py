from django import forms
from .models import SatelliteImagery

class SatelliteImageryForm(forms.ModelForm):
	img_field = forms.ImageField()
	class Meta:
		model = SatelliteImagery
		fields = [
			'photo',
		]