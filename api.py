import os
import pathlib
import six.moves.urllib as urllib
import sys
import tarfile
import tensorflow as tf
import zipfile
from collections import defaultdict
from io import StringIO
from matplotlib import pyplot as plt
from PIL import Image
from IPython.display import display
import io
import json                    
import base64                  
import logging             
import numpy as np
from PIL import Image
from object_detection.utils import ops as utils_ops
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as vis_util
from flask import Flask, request, abort
from flask_cors import CORS

app = Flask(__name__)          
app.logger.setLevel(logging.DEBUG)

CORS(app)
PATH_TO_LABELS = 'object_detection/labelmap.pbtxt'

category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS, use_display_name=True)
detection_model = tf.saved_model.load('object_detection/inference_graph/saved_model')

@app.route("/test", methods=['POST'])
def image_decode():
    # if not request.json or 'image' not in request.json: 
    #     abort(400)
             
    im_b64 = request.json['image']
    img_bytes = base64.b64decode(im_b64.encode('utf-8'))

    ret = show_inference(detection_model, img_bytes)
    buf = io.BytesIO()
    
    ret[0].save(buf, format='JPEG')
    byte_im = buf.getvalue()

    im_r64 = base64.b64encode(byte_im).decode("utf8")
    payload = json.dumps({"image": im_r64, "count": ret[1]})
    # print(payload)
    return payload
  
def run_inference_for_single_image(model, image):
  image = np.asarray(image)
  # The input needs to be a tensor, convert it using `tf.convert_to_tensor`.
  input_tensor = tf.convert_to_tensor(image)
  # The model expects a batch of images, so add an axis with `tf.newaxis`.
  input_tensor = input_tensor[tf.newaxis,...]

  # Run inference
  model_fn = model.signatures['serving_default']
  output_dict = model_fn(input_tensor)
#   print(output_dict)
  # All outputs are batches tensors.
  # Convert to numpy arrays, and take index [0] to remove the batch dimension.
  # We're only interested in the first num_detections.
  num_detections = int(output_dict.pop('num_detections'))
  output_dict = {key:value[0, :num_detections].numpy() 
                 for key,value in output_dict.items()}
  output_dict['num_detections'] = num_detections

  # detection_classes should be ints.
  output_dict['detection_classes'] = output_dict['detection_classes'].astype(np.int64)
#   print(output_dict['detection_classes'])
  # Handle models with masks:
  if 'detection_masks' in output_dict:
    # Reframe the the bbox mask to the image size.
    detection_masks_reframed = utils_ops.reframe_box_masks_to_image_masks(
              output_dict['detection_masks'], output_dict['detection_boxes'],
               image.shape[0], image.shape[1])      
    detection_masks_reframed = tf.cast(detection_masks_reframed > 0.8,
                                       tf.uint8)
    output_dict['detection_masks_reframed'] = detection_masks_reframed.numpy()
    
  return output_dict

def show_inference(model, image_path):
  img = Image.open(io.BytesIO(image_path))
  img = img.resize((800, 600))
  image_np = np.array(img)
  output_dict = run_inference_for_single_image(model, image_np)
  vis_util.visualize_boxes_and_labels_on_image_array(
    image_np,
    output_dict['detection_boxes'],
    output_dict['detection_classes'],
    output_dict['detection_scores'],
    category_index,
    instance_masks=output_dict.get('detection_masks_reframed', None),
    use_normalized_coordinates=True,
    line_thickness=8)
  quantity = output_dict['detection_scores']
  cnt = 0
  for x in quantity:
    if x > 0.4:
      cnt+=1
  ret = [Image.fromarray(image_np), cnt]     
  return ret      

def run_server_api():
    utils_ops.tf = tf.compat.v1
    tf.gfile = tf.io.gfile

    app.run(host='0.0.0.0', port=8080)

  
if __name__ == "__main__":     
    run_server_api()
