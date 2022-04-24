import base64
import json                    

import requests

api = 'http://localhost:8080/test'
image_file = 'teste.jpg'

with open(image_file, "rb") as f:
    im_bytes = f.read()        
im_b64 = base64.b64encode(im_bytes).decode("utf8")

headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
  
payload = json.dumps({"image": im_b64, "other_key": "value"})
print(im_b64)
response = requests.post(api, data=payload, headers=headers)

try:
    data = response.json()
    print(data)                
except requests.exceptions.RequestException:
    print(response.text)
