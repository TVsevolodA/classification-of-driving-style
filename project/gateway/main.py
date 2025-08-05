from fastapi import Request, FastAPI, WebSocket, Depends, HTTPException, status, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
from datetime import datetime, timedelta, timezone
from typing import Annotated, List
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext

from Models.user import *
from Models.token import *
from Models.trip import *

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

NODE_ADDRESS =  "http://localhost:5430"


def get_trips(
        driver_id: int = None,
        car_id: int = None,
        driver_car_id: int = None,
        owner_id: int = None,
) -> List[Trip] | None:
    url = NODE_ADDRESS + "/trip/read"
    res = requests.get(
        url,
        params={
            "driver_id": driver_id,
            "car_id": car_id,
            "driver_car_id": driver_car_id,
            "owner_id": owner_id
        }
    )
    if res.status_code == status.HTTP_200_OK:
        trips: List[Trip] = res.json()
        return trips
    return None

def get_best_driver_and_car(owner_id: int) -> Trip | None:
    url = NODE_ADDRESS + "/trip/best"
    res = requests.get( url, params={ "owner_id": owner_id } )
    if res.status_code == status.HTTP_200_OK:
        best_driver_car: Trip = res.json()
        return best_driver_car
    return None

def get_drivers(
        user_id: int,
        driver_id: int | None = None,
        license_number: str | None = None
) -> List[Driver] | None:
    url = NODE_ADDRESS + "/driver/read"
    res = requests.get(
        url,
        params={
            "user_id": user_id,
            "driver_id": driver_id,
            "license_number": license_number,
        }
    )
    if res.status_code == status.HTTP_200_OK:
        drivers: List[Driver] = res.json()
        return drivers
    return None

def create_driver(user_id: int, new_driver: Driver) -> List[Driver] | None:
    url = NODE_ADDRESS + "/driver/create"
    car_dict = new_driver.model_dump()
    res = requests.post(url, json=car_dict)
    if res.status_code == status.HTTP_201_CREATED:
        return get_drivers(user_id=user_id, license_number=new_driver.license_number)
    return None

def update_driver(driver_replaceable_fields: dict) -> List[Driver] | None:
    url = NODE_ADDRESS + "/driver/update"
    res = requests.put(url, json=driver_replaceable_fields)
    if res.status_code == status.HTTP_200_OK:
        return get_drivers(driver_replaceable_fields.get("id"))
    return None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_user(user: User, password: str) -> UserInDB | None:
    url = NODE_ADDRESS + "/user/create"
    user_password_hash = get_password_hash(password=password)
    user_dict = user.model_dump()
    user_dict["role"] = user_dict.get("role").value
    user_dict["hashed_password"] = user_password_hash
    res = requests.post(url, json=user_dict)
    if res.status_code == status.HTTP_201_CREATED:
        return get_user(user.username)
    return None


def update_user(user_replaceable_fields: dict) -> UserInDB | None:
    url = NODE_ADDRESS + "/user/update"
    res = requests.put(url, json=user_replaceable_fields)
    if res.status_code == status.HTTP_200_OK:
        return get_user(user_id=user_replaceable_fields.get("id"))
    return None


def delete_user(user_deleted: UserInDB) -> UserInDB | None:
    url = NODE_ADDRESS + "/user/delete"
    user_deleted_dict: dict = user_deleted.model_dump()
    user_deleted_dict["role"] = user_deleted_dict.get("role").value
    res = requests.delete(url, json=user_deleted_dict)
    if res.status_code == status.HTTP_204_NO_CONTENT:
        return user_deleted
    return None


USER_ID_MISSING = -1
def get_user(username: str = "", user_id: int = USER_ID_MISSING) -> UserInDB | None:
    url = NODE_ADDRESS + "/user/read"
    if len(username) == 0 and user_id == USER_ID_MISSING:
        return  None
    res = requests.get(url, params={ "username": username, "user_id": user_id })
    if res.status_code == status.HTTP_200_OK:
        user = res.json()
        return UserInDB(**user)
    return None


def get_cars(vin: str = None, car_id: int = None, owner_id: int = None) -> List[Car]:
    url = NODE_ADDRESS + "/car/read"
    parameters: dict = {}
    if vin is not None:
        parameters = {"vin": vin}
    elif car_id is not None:
        parameters = {"car_id": car_id}
    elif owner_id is not None:
        parameters = {"owner_id": owner_id}
    res = requests.get(url, params=parameters)
    if res.status_code == status.HTTP_200_OK:
        cars: List[Car] = res.json()
        return cars
    return []


def update_car(car_replaceable_fields: dict) -> List[Car] | None:
    url = NODE_ADDRESS + "/car/update"
    res = requests.put(url, json=car_replaceable_fields)
    if res.status_code == status.HTTP_200_OK:
        return get_cars(car_replaceable_fields.get("id"))
    return None


def create_car(new_car: Car) -> List[Car] | None:
    url = NODE_ADDRESS + "/car/create"
    car_dict = new_car.model_dump()
    res = requests.post(url, json=car_dict)
    if res.status_code == status.HTTP_201_CREATED:
        return get_cars(vin=new_car.vin)
    return None


def delete_car(car: Car) -> Car | None:
    url = NODE_ADDRESS + "/car/delete"
    car_deleted_dict: dict = car.model_dump()
    res = requests.delete(url, json=car_deleted_dict)
    if res.status_code == status.HTTP_204_NO_CONTENT:
        return car
    return None


def authenticate_user(username: str, password: str):
    user: UserInDB = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """
    Метод создания JWT-токена.
    :param data: данные для кодирования в токен
    :param expires_delta: время действия токен
    :return: JWT-токен
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_token_from_cookies(request: Request) -> str:
    token = request.cookies.get("token")
    if token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token is missing")
    return token


async def get_current_user(token: Annotated[str, Depends(get_token_from_cookies)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        expire = payload.get("exp")
        expire_time = datetime.fromtimestamp(int(expire), tz=timezone.utc)
        if username is None:
            raise credentials_exception
        elif (not expire) or (expire_time < datetime.now(timezone.utc)):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Токен истек')
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user: UserInDB = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключенные клиенты к серверу
connected_clients = set()

async def predict(input_parameters: dict) -> dict:
    """
    :param input_parameters: JSON-объект телеметрии с транстпортного средства
    :return: JSON-объект, с распознанным стилем вождения
    """
    url: str = "http://ml_inference_services:8000/predict"
    try:
        response = requests.post(url, json=input_parameters)
        return response.json()
    except Exception:
        return {}


@app.post(path="/inference_instance")
async def inference_instance(request: Request, current_user: Annotated[UserInDB, Depends(get_current_user)]):
    """
    Выполнение единичного предсказания.
    :param current_user:
    :param request: JSON-объект с входными параметрами.
    :return: JSON-объект с предсказанием.
    """
    try:
        input_parameters = await request.json()
        prediction = await predict(input_parameters=input_parameters)
        return JSONResponse(content=prediction, status_code=200)
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={}, status_code=400)


@app.websocket(path="/tracking")
async def tracking(websocket: WebSocket):
    """
    Принимает данные
    Отправляет в ml_inference_services
    Делает запись в БД
    Отправляет данные в UI
    :param websocket:
    :return:
    """
    await websocket.accept()
    connected_clients.add(websocket)
    try:
        while True:
            input_data = await websocket.receive_json()
            prediction_result = await predict(input_parameters=input_data["input_parametrs"])
            data_send = {
                "result": prediction_result["prediction_result"],
                "metadata": input_data["metadata"],
            }
            for client in connected_clients:
                await client.send_text(json.dumps(data_send))
    except Exception as e:
        print(f"Произошла ошибка связи с клиентом.\nСоединение разорвано.\n{e}")
        connected_clients.remove(websocket)


@app.post(path="/auth/signUp")
async def sign_up(request: Request):
    try:
        object_form = await request.json()
        new_user = User(
            username=object_form["username"],
            full_name=object_form["full_name"],
        )
        created_user = create_user(user=new_user, password=object_form["password"])
        if created_user is not None:
            return JSONResponse(content={"message": "Пользователь успешно зарегистрирован."}, status_code=201)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с таким email уже существует.",
        )
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={}, status_code=400)


@app.post(path="/auth/signIn")
async def sign_in(request: Request, response: Response):
    try:
        object_form = await request.json()
        token = login_for_access_token(
            username=object_form["username"],
            password=object_form["password"]
        )
        response.set_cookie(
            key="token",
            value=token.access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            path="/",
        )
        return {"message": "Успешнй вход в систему."}
    except HTTPException as http_exc:
        print(f'Ошибка в gateway, связанная с авторизацией:\n{http_exc}')
        return JSONResponse(content={"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={"error": repr(e)}, status_code=400)


@app.get(path="/logout")
async def logout(response: Response):
    response.delete_cookie(key="token")
    return {"message": "Успешно вышли из системы."}


@app.put(path="/update/user")
async def update_user_route(
        request: Request,
        response: Response,
        current_user: Annotated[UserInDB, Depends(get_current_user)]
):
    try:
        object_form: dict = await request.json()

        # В случае смены пароля проверяем, что текущий совпадает с введеным
        new_password = object_form.get("password")
        if new_password is not None:

            current_password = object_form.get("currentPassword")
            if current_password is not None:
                password_correct = verify_password(
                    plain_password=current_password,
                    hashed_password=current_user.hashed_password
                )
                if not password_correct:
                    raise HTTPException(
                        status_code=status.HTTP_409_CONFLICT,
                        detail="Текущий пароль неверный.",
                    )

            # Получаем хэш пароля и вносим поле в словарь изменений
            hash_password = get_password_hash(password=new_password)
            object_form["hashed_password"] = hash_password
            del object_form["currentPassword"]
            del object_form["password"]

        # Обновляем данные пользователя
        update_result = update_user(user_replaceable_fields=object_form)

        # Получаем новый токен доступа и возвращаем его
        token = login_for_access_token(username=update_result.username, password=new_password)
        response.set_cookie(
            key="token",
            value=token.access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            path="/",
        )

        if update_result is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Пользователь с такой почтой уже зарегистрирован.",
            )
        return {"message": "Данные успешно обновлены."}
    except HTTPException as http_exc:
        print(f'Ошибка в gateway, связанная с обновлением пользователя:\n{http_exc}')
        return JSONResponse(content={"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_409_CONFLICT)


@app.delete(path="/delete/user")
async def delete_user_route(response: Response, current_user: Annotated[UserInDB, Depends(get_current_user)]):
    try:
        response.delete_cookie(key="token")
        delete_result = delete_user(user_deleted=current_user)
        if delete_result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Не удалось удалить пользователя.",
            )
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)


def login_for_access_token(username: str, password: str) -> Token:
    user = authenticate_user(username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token)  # , token_type="bearer"


@app.get(path="/users/me")
async def read_users(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    return current_user


@app.get(path="/cars/me")
async def read_cars_me(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    return get_cars(owner_id=current_user.id)


@app.get(path="/cars/all")
async def read_cars_all(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    try:
        if current_user.role == Roles.admin:
            return get_cars()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас нет прав на просмотр содержимого.",
        )
    except HTTPException as http_exc:
        print(f'Ошибка в gateway, связанная с правами доступа:\n{http_exc}')
        return JSONResponse(content={"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_403_FORBIDDEN)


@app.put(path="/update/car")
async def update_car_route(request: Request, current_user: Annotated[UserInDB, Depends(get_current_user)]):
    try:
        object_form: dict = await request.json()
        update_result = update_car(car_replaceable_fields=object_form)
        if update_result is not None:
            return {"message": "Данные успешно обновлены."}
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Автомобиля с такими данными нет в базе.",
        )
    except HTTPException as http_exc:
        print(f'Ошибка в gateway, связанная с обновлением данных об автомобиле:\n{http_exc}')
        return JSONResponse(content={"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_409_CONFLICT)


@app.post(path="/add/car")
async def add_car_route(request: Request, current_user: Annotated[UserInDB, Depends(get_current_user)]):
    try:
        object_form: dict = await request.json()
        created_car = create_car(new_car=Car(**object_form))
        if created_car is not None:
            return JSONResponse(content={"message": "Автомобиль успешно зарегистрирован."}, status_code=201)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Автомобиль с таким VIN-номером уже зарегистрирован.",
        )
    except HTTPException as http_exc:
        print(f'Ошибка в gateway, связанная с регистрацией автомобиля:\n{http_exc}')
        return JSONResponse(content={"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={}, status_code=400)


@app.delete(path="/delete/car")
async def delete_car_route(request: Request, current_user: Annotated[UserInDB, Depends(get_current_user)]):
    try:
        object_form: dict = await request.json()
        deletion_result = delete_car(car=Car(**object_form))
        if deletion_result is not None:
            return Response(status_code=status.HTTP_204_NO_CONTENT)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Автомобиля с такими данными не существует.",
        )
    except HTTPException as http_exc:
        print(f'Ошибка в gateway, связанная с удалением автомобиля:\n{http_exc}')
        return JSONResponse(content={"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)





@app.get(path="/trips")
async def get_info_about_specific_trip(
        current_user: Annotated[UserInDB, Depends(get_current_user)],
        driver_id: int = None,
        car_id: int = None,
        driver_car_id: int = None
):
    try:
        trips: List[Trip] = get_trips(
            driver_id=driver_id,
            car_id=car_id,
            driver_car_id=driver_car_id,
            owner_id= current_user.id if current_user.role == Roles.user else None
        )
        if trips is not None:
            return trips
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Не удалось получить информацию о поездках.",
        )
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)


@app.get(path="/trips/best")
async def get_best_driver_car(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    try:
        driver_car: Trip = get_best_driver_and_car(
            owner_id= current_user.id if current_user.role == Roles.user else None
        )
        if driver_car is not None:
            return driver_car
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Не удалось получить информацию.",
        )
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)

@app.get(path="/drivers")
async def get_drivers_route(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    try:
        drivers: List[Driver] = get_drivers(user_id =current_user.id if current_user.role == Roles.user else None)
        if drivers is not None:
            return drivers
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Не удалось получить информацию о водителях.",
        )
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)


@app.put(path="/update/driver")
async def update_driver_route(request: Request, current_user: Annotated[UserInDB, Depends(get_current_user)]):
    try:
        object_form: dict = await request.json()
        if object_form.get("driving_experience"):
            object_form["driving_experience"] = int( object_form.get("driving_experience") )
        update_result = update_driver(driver_replaceable_fields=object_form)
        if update_result is not None:
            return {"message": "Данные успешно обновлены."}
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Водителя с такими данными нет в базе.",
        )
    except HTTPException as http_exc:
        print(f'Ошибка в gateway, связанная с обновлением данных о водителе:\n{http_exc}')
        return JSONResponse(content={"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_409_CONFLICT)


@app.post(path="/add/driver")
async def add_driver_route(request: Request, current_user: Annotated[UserInDB, Depends(get_current_user)]):
    try:
        object_form: dict = await request.json()
        created_car = create_driver(user_id=current_user.id, new_driver=Driver(**object_form))
        if created_car is not None:
            return JSONResponse(content={"message": "Водитель успешно зарегистрирован."}, status_code=201)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Водитель уже зарегистрирован.",
        )
    except HTTPException as http_exc:
        print(f'Ошибка в gateway, связанная с регистрацией водителя:\n{http_exc}')
        return JSONResponse(content={"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={}, status_code=400)