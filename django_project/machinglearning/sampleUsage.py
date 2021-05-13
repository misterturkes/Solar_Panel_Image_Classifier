from machinglearning import imageClassifier

def simple_use(mFile):
	probability = imageClassifier.getResult(mFile)
	'''
	for x in probability:
    	print(x, probability[x])
   '''

	# roof 0.7381455898284912
	# solar panel 0.2618544399738312

	print("get probability:")
	print(probability['roof']) # 0.7381455898284912
	print(probability['solar panel']) # 0.2618544399738312
	return probability

#simple_use('machinglearning/roof.png')
'''
probability = imageClassifier.getResult('roof.png')

for x in probability:
    print(x, probability[x])

# roof 0.7381455898284912
# solar panel 0.2618544399738312

print("get probability:")
print(probability['roof']) # 0.7381455898284912
print(probability['solar panel']) # 0.2618544399738312
'''