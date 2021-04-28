import imageClassifier

probability = imageClassifier.getResult('roof.png')

for x in probability:
    print(x, probability[x])

# roof 0.7381455898284912
# solar panel 0.2618544399738312

print("get probability:")
print(probability['roof']) # 0.7381455898284912
print(probability['solar panel']) # 0.2618544399738312