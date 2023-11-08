from flask import Flask, json
from flask import request
from flask_cors import CORS, cross_origin
import boto3
import openai
app = Flask(__name__)
cors = CORS(app)
openai.api_key = "OPENAI_KEY"

@app.route('/ask', methods = ['POST'])
def home():
    
    
    if request.method == 'POST':
        data = request.get_json()
        prompt = data['prompt']
        completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": prompt}])
        data = {
            "answer":completion.choices[0].message.content
        }
        return json.dumps(data)
        
@app.route('/find', methods = ['POST'])
@cross_origin()
def findCeleb():
    if request.method == 'POST':
        session = boto3.Session(profile_name='profile-name')
        client = session.client('rekognition')
        celebrity=request.files['celebrity']
        photo = celebrity.read()
        response = client.recognize_celebrities(Image={'Bytes': photo})  
        for celebrity in response['CelebrityFaces']:
            print('Id: ' + celebrity['Id'])
            print('Name: ' + celebrity['Name'])
            data = {
                 "name": celebrity['Name'],
            }
        return json.dumps(data)
app.run(port=8000)