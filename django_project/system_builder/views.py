from django.shortcuts import render

# Create your views here.
def system_builder(request):
	return render(request,'system_builder/test.html')