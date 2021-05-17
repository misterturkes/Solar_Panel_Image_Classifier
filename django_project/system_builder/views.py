from django.shortcuts import render
import json

# Create your views here.
def system_builder(request):
	if request.method == 'POST':
		print("builder recieved")
		print(request.body)
		panels = request.body
		my_json = json.loads(panels)
		my_json = json.dumps(my_json)
		# my_entry = ArrayModel(panels=my_json)
		# my_entry.save()

	return render(request,'system_builder/test.html')