from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import SatelliteImageryForm
from .models import SatelliteImagery
import numpy as np
import tensorflow as tf # TF2
from machinglearning import sampleUsage
import base64


# Create your views here.
def home(request):
	return render(request,'solar_lookup/home.html')

def upload_image(request):
	print("called in upload_image")
	if request.method == 'POST':
		
		print("this is a post")
		print(request)
		print(request.read())
		

		print(request.FILES)
		upload_file = request.FILES['image']
		temp = sampleUsage.simple_use(upload_file)



		# upload_file = request.FILES['myImg']
		# print(upload_file.name)
		# print(upload_file.size)
		# temp = sampleUsage.simple_use(upload_file)
		context = {'solar': temp["solar panel"] * 100,
		 			 'roof': temp["roof"] * 100}
		print(context)
		my_confidence = temp["solar panel"] * 100

		my_entry = SatelliteImagery(photo=upload_file,username="demotest", address="324 Paseo de San Carlos, San Jose, CA 95192", confidence=my_confidence )
		my_entry.save()

		
	return render(request,'solar_lookup/home.html',  context)

