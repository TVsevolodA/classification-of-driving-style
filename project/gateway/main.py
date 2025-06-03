import requests

url = "http://localhost:8000/predict"
data = {"veincle length": 450, "veincle weight": 2500, "axles number": 2, "perceding veincle time-gap": 0.5, "Lane of the road": 2, "veincle speed": 200, "perceding veincle speed": 150, "perceding veincle weight": 1400, "perceding veincle length": 440, "road condition": 2, "Air temprture": -5, "perciption type": 2, "perciption intensity": 2, "relatve humadity": 40, "wind direction": 90, "wind speed": 25, "Lighting condition": 2}
response = requests.post(url, json=data)
# url = "http://localhost:8000/"
# response = requests.get(url)
print("Status Code", response.status_code)
print("JSON Response ", response.json())