from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import SatelliteImageryForm
from .models import SatelliteImagery
import numpy as np
from PIL import Image
import tensorflow as tf # TF2
from machinglearning import sampleUsage


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
		upload_file = request.FILES['myImg']
		print(upload_file.name)
		print(upload_file.size)
		temp = sampleUsage.simple_use(upload_file)
		context = {'solar': temp["solar panel"] * 100,
					 'roof': temp["roof"] * 100}
		print(context)
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

	#return render(request, 'users/register.html', {'form': form})
