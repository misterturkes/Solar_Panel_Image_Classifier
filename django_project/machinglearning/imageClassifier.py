# Copyright 2018 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================
"""label_image for tflite."""



import numpy as np
from PIL import Image
import tensorflow as tf # TF2


def load_labels(filename):
  with open(filename, 'r') as f:
    return [line.strip() for line in f.readlines()]



def getResult(imagefile):

  interpreter = tf.lite.Interpreter(
      model_path='machinglearning/new_mobile_model.tflite', num_threads=None)
  interpreter.allocate_tensors()

  input_details = interpreter.get_input_details()
  output_details = interpreter.get_output_details()

  # check the type of the input tensor
  floating_model = input_details[0]['dtype'] == np.float32

  # NxHxWxC, H:1, W:2
  height = input_details[0]['shape'][1]
  width = input_details[0]['shape'][2]
  img = Image.open(imagefile).convert("RGB", palette=Image.ADAPTIVE, colors=24).resize((width, height))

  # add N dim
  input_data = np.expand_dims(img, axis=0)
  # print(input_data)
  if floating_model:
    input_data = np.float32(input_data)/ 225

  interpreter.set_tensor(input_details[0]['index'], input_data)

  interpreter.invoke()

  output_data = interpreter.get_tensor(output_details[0]['index'])
  results = np.squeeze(output_data)

  top_k = results.argsort()[-5:][::-1]
  labels = load_labels('machinglearning/class_labels.txt')
  result = {}
  for i in top_k:
    if floating_model:
      result[labels[i]] = float(results[i])
    else:
      result[labels[i]] = float(results[i] / 255.0)
  
  return result

  # thisdict["color"] = "red"



def main():
  
  result = getResult('machinglearning/roof.png')
  for x in result:
    print(x, result[x])

# main()