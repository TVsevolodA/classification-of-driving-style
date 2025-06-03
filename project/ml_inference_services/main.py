import pandas as pd
from fastai.tabular.all import *
from fastapi import Request, FastAPI

MODEL = load_learner('model.pkl')
DICT_RESULT = {1: 'Агрессивный', 2: 'Нормальный', 3: 'Неопределенный'}

app = FastAPI()

@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    input_data = pd.Series(
        data=data.values(),
        index=data.keys()
    )
    row, clas, probs = MODEL.predict(input_data)
    number_class: int = int( row["DrivingStyle"][0] )
    prediction_result: str = DICT_RESULT.get(number_class)
    return json.dumps({ "prediction_result": prediction_result })

@app.get("/")
async def predict():
    return json.dumps({"response": "все работает!"})

# learn = load_learner('model.pkl')
#
# examples_driving_styles = \
#  {
#      "агрессивный": {
#          "veincle length": 450,
#          "veincle weight": 2500,
#          "axles number": 2,
#          "perceding veincle time-gap": 0.5,
#          "Lane of the road": 2,
#          "veincle speed": 200,
#          "perceding veincle speed": 150,
#          "perceding veincle weight": 1400,
#          "perceding veincle length": 440,
#          "road condition": 2,
#          "Air temprture": -5,
#          "perciption type": 2,
#          "perciption intensity": 2,
#          "relatve humadity": 40,
#          "wind direction": 90,
#          "wind speed": 25,
#          "Lighting condition": 2
#          },
#      "нормальный": {
#          "veincle length": 460,
#          "veincle weight": 1600,
#          "axles number": 2,
#          "perceding veincle time-gap": 2.5,
#          "Lane of the road": 2,
#          "veincle speed": 90,
#          "perceding veincle speed": 85,
#          "perceding veincle weight": 1500,
#          "perceding veincle length": 450,
#          "road condition": 1,
#          "Air temprture": 15,
#          "perciption type": 1,
#          "perciption intensity": 1,
#          "relatve humadity": 70,
#          "wind direction": 180,
#          "wind speed": 3,
#          "Lighting condition": 1
#          },
#      "неопределенный": {
#          "veincle length": 470,
#          "veincle weight": 1700,
#          "axles number": 2,
#          "perceding veincle time-gap": 3.5,
#          "Lane of the road": 1,
#          "veincle speed": 70,
#          "perceding veincle speed": 65,
#          "perceding veincle weight": 1600,
#          "perceding veincle length": 460,
#          "road condition": 2,
#          "Air temprture": 0,
#          "perciption type": 2,
#          "perciption intensity": 2,
#          "relatve humadity": 85,
#          "wind direction": 270,
#          "wind speed": 4,
#          "Lighting condition": 2
#          }
#      }
#
# dict_result = {1: 'Агрессивный', 2: 'Нормальный', 3: 'Неопределенный'}
#
# columns = [
#     "veincle length", "veincle weight", "axles number",
#     "perceding veincle time-gap", "Lane of the road", "veincle speed",
#     "perceding veincle speed", "perceding veincle weight",
#     "perceding veincle length", "road condition", "Air temprture",
#     "perciption type", "perciption intensity", "relatve humadity",
#     "wind direction", "wind speed", "Lighting condition"]

# for value in examples_driving_styles.values():
#   input_data = pd.Series(
#       data=value.values(),
#       index=columns
#   )
#   row, clas, probs = learn.predict(input_data)
#   number_class = int( row["DrivingStyle"][0] )
#   print( dict_result.get(number_class) )