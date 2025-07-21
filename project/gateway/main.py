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

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

counter = 2
fake_users_db = [
    {
        "id": 1,
        "username": "johndoe@example.com",
        "full_name": "John Doe",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "role": "admin",
        "phone": "+7 (999) 123-45-67",
        "address": "Москва, Россия",
    },
    {
        "id": 2,
        "username": "triv@example.com",
        "full_name": "Tri V",
        "hashed_password": "$2b$12$KelOH415tiAnYwK2nfW6QePR/li73iWeP1FqDarf6ptzZtlMIoR1G",
        "role": "user",
        "phone": "+7 (888) 987-65-43",
        "address": "Саратов, Россия",
    }
]


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_user(db, user: User, password: str):
    for db_user in db:
        if db_user.get("username") == user.username:
            return None
    user_password_hash = get_password_hash(password=password)
    db.append({
        "id": 3,
        "username": user.username,
        "full_name": user.full_name,
        "hashed_password": user_password_hash,
        "role": "user",
    })
    return get_user(db, user.username)


def delete_user(db, user: UserInDB):
    try:
        db.remove(user)
        return user.username
    except Exception:
        return None

def update_user(db, user: UserInDB):
    for index, db_user in enumerate(db):
        if db_user.get("id") == user.id:
            if user.hashed_password == "":
                user.hashed_password = db_user.get("hashed_password")
            db[index] = user.model_dump()
            return user
    return None


def get_user(db, username: str):
    for db_user in db:
        if db_user.get("username") == username:
            return UserInDB(**db_user)
    return None


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
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
    user = get_user(fake_users_db, username=token_data.username)
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


@app.post("/inference_instance")
async def inference_instance(request: Request, current_user: Annotated[User, Depends(get_current_user)]):
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


@app.websocket("/tracking")
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


@app.post("/auth/signUp")
async def sign_up(request: Request):
    try:
        object_form = await request.json()
        new_user = User(
            username=object_form["username"],
            full_name=object_form["full_name"],
        )
        created_user = create_user(db=fake_users_db, user=new_user, password=object_form["password"])
        if created_user is not None:
            return JSONResponse(content={"message": "Пользователь успешно зарегистрирован."}, status_code=201)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Пользователь с таким email уже существует.",
        )
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={}, status_code=400)


@app.post("/auth/signIn")
async def sign_in(request: Request, response: Response):
    try:
        object_form: dict = await request.json()
        token = await login_for_access_token(
            username=object_form.get("username"),
            password=object_form.get("password")
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
async def update_user_route(request: Request, current_user: Annotated[User, Depends(get_current_user)]):
    try:
        object_form: dict = await request.json()
        user_in_db = object_form.copy()
        if object_form.get("password") == "":
            user_in_db["hashed_password"] = ""
        else:
            hash_password = get_password_hash( password=object_form.get("password") )
            user_in_db["hashed_password"] = hash_password
        del user_in_db["password"]
        del user_in_db["confirmPassword"]
        print(object_form)
        update_result = update_user(fake_users_db, UserInDB(**user_in_db))
        if update_result is not None:
            return Response(status_code=status.HTTP_200_OK)
        else:
            return Response(status_code=status.HTTP_409_CONFLICT)
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_409_CONFLICT)


@app.delete(path="/delete/user")
async def delete_user_route(response: Response, current_user: Annotated[UserInDB, Depends(get_current_user)]):
    try:
        response.delete_cookie(key="token")
        deletion_result = delete_user(db=fake_users_db, user=current_user)
        if deletion_result == current_user.username:
            return Response(status_code=status.HTTP_204_NO_CONTENT)
        return JSONResponse(content={"message": "Пользователя с такими данными не существует."}, status_code=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f'Ошибка в gateway:\n{e}')
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)


async def login_for_access_token(username: str, password: str) -> Token:
    user = authenticate_user(fake_users_db, username, password)
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
    return Token(access_token=access_token)


@app.get("/users/me")
async def read_users_me(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    return current_user