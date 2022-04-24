import io
import json                    
import base64                  
import logging             
import numpy as np
from PIL import Image

from flask import Flask, request, abort
from flask_cors import CORS

app = Flask(__name__)          
app.logger.setLevel(logging.DEBUG)
CORS(app)
  
@app.route("/test", methods=['POST'])
def image_decode():
    # if not request.json or 'image' not in request.json: 
    #     abort(400)
             
    im_b64 = request.json['image']
    img_bytes = base64.b64decode(im_b64.encode('utf-8'))

    img = Image.open(io.BytesIO(img_bytes))
    img_arr = np.asarray(img)      
    
    print('img shape', img_arr.shape)
    image_file = 'retorno.jpg'

    with open(image_file, "rb") as f:
        im_bytes = f.read()        
    im_r64 = base64.b64encode(im_bytes).decode("utf8")

    payload = json.dumps({"image": im_r64, "other_key": "value"})
    # print(payload)
    return payload
  
def run_server_api():
    app.run(host='0.0.0.0', port=8080)
  
if __name__ == "__main__":     
    run_server_api()
