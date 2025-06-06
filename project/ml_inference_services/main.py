import json
import pickle

import pandas as pd
# from fastai.tabular.all import load_learner
from fastapi import Request, FastAPI

# MODEL = load_learner('model1.pickle')
MODEL = pickle.load(open('model1.pickle', 'rb'))
DICT_RESULT = {1: 'Agressive', 2: 'Normal', 3: 'Vague'}

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

# learn = pickle.load(open('model1.pickle', 'rb'))
# # learn = load_learner('model.pkl')
#
# examples_driving_styles = \
#  {
#      # Пример 1:
#      # "нормальный": {
#      #     "veincle length": 350, # Длина тс (см)
#      #     "veincle weight": 2500, # Вес тс (кг)
#      #     "axles number": 2, # Количество осей (2-9)
#      #     "perceding veincle time-gap": 2, # время проезда предыдущего тс (1-1800 сек)
#      #     "Lane of the road": 2, # Полоса движения на дороге (1 или 2)
#      #     "veincle speed": 60, # Скорость (8-160)
#      #     "perceding veincle speed": 70, # Скорость предыдущего тс (0-160)
#      #     "perceding veincle weight": 1500,  # Вес предыдущего тс (3-70000 кг)
#      #     "perceding veincle length": 250, # Длина предыдущего тс (100-3000 см)
#      #     "road condition": 2, # Состояние дороги: 0-сухая, 1-мокрая, 2-видимые следы, 3-заснеженно
#      #     "Air temprture": -5, # Температура воздуха (-13 - +24)
#      #     "perciption type": 0, # Облачность: 0-ясно, 1-дождь, 2-снег
#      #     "perciption intensity": 0, # Скорость выпадения осадков мм/10мин: -1-нет, 0-низкие (0-1), 1-умеренные (1-5), 2-большие (5-16) 3
#      #     "relatve humadity": 30, # Относительная влажность воздуха (16-97)
#      #     "wind direction": 20, # Направление ветра 0-360 (6-360)
#      #     "wind speed": 5, # Скорость ветра (0-17)
#      #     "Lighting condition": 2 # Условия освещения: 0-день, 1-ночь, 2-сумерки
#      #     },
#      # "агрессивный": {
#      #     "veincle length": 350, # Длина тс (см)
#      #     "veincle weight": 2500, # Вес тс (кг)
#      #     "axles number": 2, # Количество осей (2-9)
#      #     "perceding veincle time-gap": 2, # время проезда предыдущего тс (1-1800 сек)
#      #     "Lane of the road": 2, # Полоса движения на дороге (1 или 2)
#      #     "veincle speed": 160, # Скорость (8-160)
#      #     "perceding veincle speed": 70, # Скорость предыдущего тс (0-160)
#      #     "perceding veincle weight": 1500,  # Вес предыдущего тс (3-70000 кг)
#      #     "perceding veincle length": 250, # Длина предыдущего тс (100-3000 см)
#      #     "road condition": 2, # Состояние дороги: 0-сухая, 1-мокрая, 2-видимые следы, 3-заснеженно
#      #     "Air temprture": -5, # Температура воздуха (-13 - +24)
#      #     "perciption type": 0, # Облачность: 0-ясно, 1-дождь, 2-снег
#      #     "perciption intensity": 0, # Скорость выпадения осадков мм/10мин: -1-нет, 0-низкие (0-1), 1-умеренные (1-5), 2-большие (5-16) 3
#      #     "relatve humadity": 30, # Относительная влажность воздуха (16-97)
#      #     "wind direction": 20, # Направление ветра 0-360 (6-360)
#      #     "wind speed": 5, # Скорость ветра (0-17)
#      #     "Lighting condition": 2 # Условия освещения: 0-день, 1-ночь, 2-сумерки
#      #     },
#      # Пример 2:
#      "агр": {
#          "veincle length": 950,  # Длина тс (см)
#          "veincle weight": 5000,  # Вес тс (кг)
#          "axles number": 4,  # Количество осей (2-9)
#          "perceding veincle time-gap": 600,  # время проезда предыдущего тс (1-1800 сек)
#          "Lane of the road": 1,  # Полоса движения на дороге (1 или 2)
#          "veincle speed": 140,  # Скорость (8-160)
#          "perceding veincle speed": 80,  # Скорость предыдущего тс (0-160)
#          "perceding veincle weight": 1500,  # Вес предыдущего тс (3-70000 кг)
#          "perceding veincle length": 250,  # Длина предыдущего тс (100-3000 см)
#          "road condition": 1,  # Состояние дороги: 0-сухая, 1-мокрая, 2-видимые следы, 3-заснеженно
#          "Air temprture": 15,  # Температура воздуха (-13 - +24)
#          "perciption type": 1,  # Облачность: 0-ясно, 1-дождь, 2-снег
#          "perciption intensity": 3,
#          # Скорость выпадения осадков мм/10мин: -1-нет, 0-низкие (0-1), 1-умеренные (1-5), 2-большие (5-16) 3
#          "relatve humadity": 90,  # Относительная влажность воздуха (16-97)
#          "wind direction": 50,  # Направление ветра 0-360 (6-360)
#          "wind speed": 15,  # Скорость ветра (0-17)
#          "Lighting condition": 0  # Условия освещения: 0-день, 1-ночь, 2-сумерки
#      },
#      "норм": {
#          "veincle length": 950,  # Длина тс (см)
#          "veincle weight": 5000,  # Вес тс (кг)
#          "axles number": 4,  # Количество осей (2-9)
#          "perceding veincle time-gap": 600,  # время проезда предыдущего тс (1-1800 сек)
#          "Lane of the road": 1,  # Полоса движения на дороге (1 или 2)
#          "veincle speed": 90,  # Скорость (8-160)
#          "perceding veincle speed": 80,  # Скорость предыдущего тс (0-160)
#          "perceding veincle weight": 1500,  # Вес предыдущего тс (3-70000 кг)
#          "perceding veincle length": 250,  # Длина предыдущего тс (100-3000 см)
#          "road condition": 1,  # Состояние дороги: 0-сухая, 1-мокрая, 2-видимые следы, 3-заснеженно
#          "Air temprture": 15,  # Температура воздуха (-13 - +24)
#          "perciption type": 1,  # Облачность: 0-ясно, 1-дождь, 2-снег
#          "perciption intensity": 3,
#          # Скорость выпадения осадков мм/10мин: -1-нет, 0-низкие (0-1), 1-умеренные (1-5), 2-большие (5-16) 3
#          "relatve humadity": 90,  # Относительная влажность воздуха (16-97)
#          "wind direction": 50,  # Направление ветра 0-360 (6-360)
#          "wind speed": 15,  # Скорость ветра (0-17)
#          "Lighting condition": 0  # Условия освещения: 0-день, 1-ночь, 2-сумерки
#      },
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
#
# for value in examples_driving_styles.values():
#     result = learn.predict([list(value.values())])
#     print(dict_result.get(result[0]))
#   # input_data = pd.Series(
#   #     data=value.values(),
#   #     index=columns
#   # )
#   # row, clas, probs = learn.predict(input_data)
#   # number_class = int( row["DrivingStyle"][0] )
#   # print( dict_result.get(number_class) )