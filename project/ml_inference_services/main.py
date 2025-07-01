import pickle
from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse

MODEL = pickle.load(open('model1.pickle', 'rb'))
# DICT_RESULT = {1: 'Agressive', 2: 'Normal', 3: 'Vague'}
app = FastAPI()

@app.post("/predict")
async def predict(request: Request):
    try:
        data = await request.json()
        result = MODEL.predict([list(data.values())])
        # prediction_result = DICT_RESULT.get(result[0])
        return JSONResponse(content={"prediction_result": str(result[0])}, status_code=200)
    except Exception as e:
        print(f'Ошибка в ml:\n{e}')
        return JSONResponse(content={}, status_code=400)

@app.get("/")
def home():
    return JSONResponse(
        content={"response": "Welcome to the Driving Style Classification API."},
        status_code=200
    )