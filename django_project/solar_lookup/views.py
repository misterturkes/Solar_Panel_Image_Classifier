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
		'''
		print("upload_image")
		form = SatelliteImageryForm(request.POST, request.FILES)
		if form.is_valid():
			form.save()
			print("Image Saved")
			return redirect('home')
		else:
			form = SatelliteImageryForm()
			print("no post")
			'''
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

		my_entry = SatelliteImagery(photo=upload_file,username="test1", address="553 Sth", confidence=my_confidence )
		my_entry.save()




		#sampleUsage.simple_use('machinglearning/roof.png')
		'''
		form = SatelliteImageryForm(request.POST, request.FILES)
		if form.is_valid():
			form.save()
			print("Image Saved")
			return redirect('home')
		else:
			form = SatelliteImageryForm()
			print("no post")
			'''
		
	return render(request,'solar_lookup/home.html',  context)

