from fastapi import Request, FastAPI, WebSocket, Depends, HTTPException, status, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
from datetime import datetime, timedelta, timezone
from typing import Annotated
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext

from Models.user import *
from Models.token import *
from Models.car import *

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

NODE_ADDRESS =  "http://localhost:5430"

fake_users_db = {
    "johndoe@example.com": {
        "username": "johndoe@example.com",
        "full_name": "John Doe",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "role": "admin",
        "phone": "+7 (999) 123-45-67",
        "address": "Москва, Россия",
    },
    "triv@example.com": {
        "username": "triv@example.com",
        "full_name": "Tri V",
        "hashed_password": "$2b$12$KelOH415tiAnYwK2nfW6QePR/li73iWeP1FqDarf6ptzZtlMIoR1G",
        "role": "user",
        "phone": "+7 (888) 987-65-43",
        "address": "Саратов, Россия",
    },
    "ivanov@example.ru": {
        "username": "ivanov@example.ru",
        "full_name": "Иванов Иван",
        "hashed_password": "$2b$12$KelOH415tiAnYwK2nfW6QePR/li73iWeP1FqDarf6ptzZtlMIoR1G",
        "role": "user",
        "phone": "+7 (912) 345-67-89",
        "address": "Энгельс, Россия",
    }
}

fake_cars_db = {
    "1HGCM82633A004352": {
        "vin": "1HGCM82633A004352",
        "owner": "triv@example.com",
        "brand": "Hyundai",
        "model": "IX35",
        "year": 2012,
        "licensePlate": "T826MC|64RUS",
        "mileage": 150000
    },
    "WDDHF5KB6EA123456": {
        "vin": "WDDHF5KB6EA123456",
        "owner": "triv@example.com",
        "brand": "Lada",
        "model": "Granta",
        "year": 2018,
        "licensePlate": "T206TC|164RUS",
        "mileage": 100000
    },
    "KL1AF6362AK000789": {
        "vin": "KL1AF6362AK000789",
        "owner": "johndoe@example.com",
        "brand": "Toyota",
        "model": "Camry",
        "year": 2020,
        "licensePlate": "А123ВC|777RUS",
        "mileage": 45000
    },
    "2T1BR18E5WC789012": {
        "vin": "2T1BR18E5WC789012",
        "owner": "johndoe@example.com",
        "brand": "BMW",
        "model": "X5",
        "year": 2019,
        "licensePlate": "B456EK|123RUS",
        "mileage": 62000
    },
    "3VWDS71K08M345678": {
        "vin": "3VWDS71K08M345678",
        "owner": "johndoe@example.com",
        "brand": "Mercedes-Benz",
        "model": "C-class",
        "year": 2021,
        "licensePlate": "M789MO|164RUS",
        "mileage": 28000
    },
}

fake_drivers_db = {
    "1234567890": {
        "director": "ivanov@example.ru",
        "license_number": "1234 567890",
        "expiry_date": "2027-12-31",
        "full_name": "Иванов Иван Иванович",
        "phone": "79123456789",
        "email": "ivanov@example.ru",
        "driving_experience": 5,
        "issue_date": "2018-11-15",
        "driving_rating": 4.5,
        "insurance_expiry_date": "2025-06-30"
    },
    "2345678901": {
        "director": "triv@example.com",
        "license_number": "2345 678901",
        "expiry_date": "2026-09-05",
        "full_name": "Петров Петр Петрович",
        "phone": "79234567890",
        "email": "petrov@example.ru",
        "driving_experience": 7,
        "issue_date": "2016-04-22",
        "driving_rating": 3.7,
        "insurance_expiry_date": "2024-12-15"
    },
    "3456789012": {
        "director": "triv@example.com",
        "license_number": "3456 789012",
        "expiry_date": "2028-03-18",
        "full_name": "Сидорова Елена Сергеевна",
        "phone": "79345678901",
        "email": "sidorova@example.ru",
        "driving_experience": 3,
        "issue_date": "2020-07-03",
        "driving_rating": 4.8,
        "insurance_expiry_date": "2025-01-10"
    },
    "4567890123": {
        "director": "triv@example.com",
        "license_number": "4567 890123",
        "expiry_date": "2027-11-28",
        "full_name": "Кузнецов Артем Викторович",
        "phone": "89456789012",
        "email": "kuznetsov@example.ru",
        "driving_experience": 10,
        "issue_date": "2013-03-10",
        "driving_rating": 4.2,
        "insurance_expiry_date": "2024-11-01"
    },
    "5678901234": {
        "director": "ivanov@example.ru",
        "license_number": "5678 901234",
        "expiry_date": "2026-07-14",
        "full_name": "Смирнова Анастасия Дмитриевна",
        "phone": "89678901234",
        "email": "smirnova@example.ru",
        "driving_experience": 2,
        "issue_date": "2021-09-05",
        "driving_rating": 3.9,
        "insurance_expiry_date": "2024-09-20"
    },
    "6789012345": {
        "director": "ivanov@example.ru",
        "license_number": "6789 012345",
        "expiry_date": "2029-05-22",
        "full_name": "Федоров Максим Александрович",
        "phone": "89789012345",
        "email": "fedorov@example.ru",
        "driving_experience": 8,
        "issue_date": "2015-12-30",
        "driving_rating": 4.0,
        "insurance_expiry_date": "2025-04-15"
    },
    "7890123456": {
        "director": "ivanov@example.ru",
        "license_number": "7890 123456",
        "expiry_date": "2026-02-10",
        "full_name": "Морозова Ольга Игоревна",
        "phone": "89890123456",
        "email": "morozova@example.ru",
        "driving_experience": 6,
        "issue_date": "2017-08-17",
        "driving_rating": 4.6,
        "insurance_expiry_date": "2024-08-05"
    },
    "8901234567": {
        "director": "ivanov@example.ru",
        "license_number": "8901 234567",
        "expiry_date": "2028-08-07",
        "full_name": "Белов Денис Олегович",
        "phone": "89901234567",
        "email": "belov@example.ru",
        "driving_experience": 1,
        "issue_date": "2022-04-01",
        "driving_rating": 3.0,
        "insurance_expiry_date": "2024-12-31"
    },
    "9012345678": {
        "director": "ivanov@example.ru",
        "license_number": "9012 345678",
        "expiry_date": "2025-10-19",
        "full_name": "Григорьева Валентина Сергеевна",
        "phone": "89012345678",
        "email": "grigorieva@example.ru",
        "driving_experience": 12,
        "issue_date": "2011-05-25",
        "driving_rating": 4.9,
        "insurance_expiry_date": "2025-03-01"
    },
    "0123456789": {
        "director": "ivanov@example.ru",
        "license_number": "0123 456789",
        "expiry_date": "2027-04-03",
        "full_name": "Козлов Владимир Анатольевич",
        "phone": "79183456789",
        "email": "kozlov@example.ru",
        "driving_experience": 9,
        "issue_date": "2014-10-08",
        "driving_rating": 3.5,
        "insurance_expiry_date": "2024-10-15"
    }
}

fake_driver_car = {
    1: {
        "id": 1,
        "driver_id": "1234567890",
        "car_id": "1HGCM82633A004352",
        "start_date": "2026-07-14",
        "end_date": "2026-07-14"
    },
    2: {
        "id": 2,
        "driver_id": "2345678901",
        "car_id": "WDDHF5KB6EA123456",
        "start_date": "2026-07-14",
        "end_date": "2026-07-14"
    },
    3: {
        "id": 3,
        "driver_id": "1234567890",
        "car_id": "WDDHF5KB6EA123456",
        "start_date": "2026-07-14",
        "end_date": "2026-07-14"
    },
    4: {
        "id": 4,
        "driver_id": "2345678901",
        "car_id": "3VWDS71K08M345678",
        "start_date": "2026-07-14",
        "end_date": "2026-07-14"
    },
    5: {
        "id": 5,
        "driver_id": "0123456789",
        "car_id": "3VWDS71K08M345678",
        "start_date": "2026-07-14",
        "end_date": "2026-07-14"
    },
    6: {
        "id": 6,
        "driver_id": "0123456789",
        "car_id": "3VWDS71K08M345678",
        "start_date": "2026-07-14",
        "end_date": "2026-07-14"
    }
}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)

# Checked
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

# Checked
def update_user(replaceable_fields: dict) -> UserInDB | None:
    url = NODE_ADDRESS + "/user/update"
    res = requests.put(url, json=replaceable_fields)
    if res.status_code == status.HTTP_200_OK:
        return get_user(user_id=replaceable_fields.get("id"))
    return None

# Checked
def delete_user(user_deleted: UserInDB) -> UserInDB | None:
    url = NODE_ADDRESS + "/user/delete"
    user_deleted_dict: dict = user_deleted.model_dump()
    user_deleted_dict["role"] = user_deleted_dict.get("role").value
    res = requests.delete(url, json=user_deleted_dict)
    if res.status_code == status.HTTP_204_NO_CONTENT:
        return user_deleted
    return None


# Checked
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


def get_cars(owner_id: int) -> list[Car]:
    url = NODE_ADDRESS + "/car/read"
    res = requests.get(url, params={ "owner_id": owner_id })
    if res.status_code == status.HTTP_200_OK:
        cars: list[Car] = res.json()
        return cars
    return []
    # if username is None:
    #     return  list(db.values())
    # user_cars: list = list()
    # for key, value in db.items():
    #     if value.get("owner") == username:
    #         user_cars.append(value)
    # return user_cars


def update_car(db, vin: str, new_car: Car):
    if vin in db:
        db[vin] = new_car.model_dump()
        return db[vin]
    return None


def create_car(db, car: Car):
    if car.vin in db:
        return None
    db[car.vin] = car.model_dump()
    return db[car.vin]


def delete_car(db, car: Car):
    if car.vin in db:
        del db[car.vin]
        return car.vin
    return None


def get_drivers_with_vehicles(username: str = None):
    if username is None:
        return {"drivers": fake_drivers_db, "vehicles": fake_cars_db, "driver_car": fake_driver_car}
    else:
        drivers: dict = dict()
        for key, value in fake_drivers_db.items():
            if username == value.get("director"):
                drivers[key] = value
        vehicles: dict = dict()
        for key, value in fake_cars_db.items():
            if username == value.get("owner"):
                vehicles[key] = value
        # TODO: недописано!!!
        driver_car: dict = dict()
        for key, value in fake_driver_car.items():
            if username == value.get("driver_id"):
                vehicles[key] = value
        return {"drivers": drivers, "vehicles": vehicles}


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

# Checked
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

# Checked
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

# Checked
@app.get(path="/logout")
async def logout(response: Response):
    response.delete_cookie(key="token")
    return {"message": "Успешно вышли из системы."}

# Checked
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
        update_result = update_user(replaceable_fields=object_form)

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


# Checked
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





# Checked
@app.get(path="/cars/me")
async def read_cars_me(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    return get_cars(owner_id=current_user.id)

@app.get(path="/cars/all")
async def read_cars_all(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    try:
        if current_user.role == Roles.admin:
            return get_cars(db=fake_cars_db)
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
        update_result = update_car(db=fake_cars_db, vin=object_form.get("vin"), new_car=Car(**object_form))
        if update_result is not None:
            return {"message": "Данные успешно обновлены."}
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Автомобиля с таким VIN-номером нет в базе.",
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
        created_car = create_car(db=fake_cars_db, car=Car(**object_form))
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
        deletion_result = delete_car(db=fake_cars_db, car=Car(**object_form))
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

@app.get(path="/drivers-with-vehicles")
async def get_information_about_drivers_and_vehicles(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    try:
        if current_user.role == Roles.admin:
            drivers_and_vehicles = get_drivers_with_vehicles()
        else:
            drivers_and_vehicles = get_drivers_with_vehicles(username=current_user.username)
        return  drivers_and_vehicles
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_403_FORBIDDEN)