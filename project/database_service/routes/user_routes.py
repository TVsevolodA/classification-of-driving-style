from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import JSONResponse

from create_session import CreateSession
from models.user import UserPydanticModel, User

user_router = APIRouter()
get_db = lambda: CreateSession.get_db()

@user_router.post(path='/create', response_model=UserPydanticModel)
def creating_user(new_user: UserPydanticModel, db: Session = Depends(get_db)):
    try:
        db.add(new_user)
        db.commit()
        return JSONResponse(
            content={"message": "Пользователь добавлен в базу."},
            status_code=status.HTTP_201_CREATED
        )
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_409_CONFLICT)

@user_router.get(path='/read')
def getting_user(username: str, db: Session = Depends(get_db)):
    try:
        return db.query(User).filter_by(username=username).first()
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)

@user_router.put(path='/update', response_model=UserPydanticModel)
def user_update(update_user: UserPydanticModel, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter_by(id=update_user.id).first()
        user.username = update_user.username
        user.full_name = update_user.full_name
        user.hashed_password = update_user.hashed_password
        user.role = update_user.role
        user.phone = update_user.phone
        user.address = update_user.address
        db.commit()
        return JSONResponse(
            content={"message": "Пользовательские данные успешно обновлены."},
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_409_CONFLICT)

@user_router.delete(path='/delete', response_model=UserPydanticModel)
def deleting_user(current_user: UserPydanticModel, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter_by(id=current_user.id).first()
        db.delete(user)
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)