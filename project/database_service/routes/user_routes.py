from typing import Annotated
from fastapi import APIRouter, Depends, Response, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import JSONResponse
from create_session import CreateSession
from models.user import UserBaseSchema, User

user_router = APIRouter()
get_db = CreateSession.get_db


@user_router.post(path='/create')
def creating_user(new_user: UserBaseSchema, db: Annotated[Session, Depends(get_db)]):
    try:
        db_user_model: User = User(**new_user.model_dump())
        db.add(db_user_model)
        db.commit()
        return JSONResponse(
            content={"message": "Пользователь добавлен в базу."},
            status_code=status.HTTP_201_CREATED
        )
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_409_CONFLICT)


@user_router.get(path='/read')
def getting_user(username: str, user_id: int, db: Annotated[Session, Depends(get_db)]):
    try:
        if len(username) > 0:
            user: User | None = db.query(User).filter_by(username=username).first()
        else:
            user: User | None = db.query(User).filter_by(id=user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не обнаружен.",
            )
        return user
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)


@user_router.put(path='/update')
def user_update(update_user: dict, db: Annotated[Session, Depends(get_db)]):
    try:
        user = db.query(User).filter_by(id=update_user.get("id")).first()
        for column, value in update_user.items():
            setattr(user, column, value)
        db.commit()
        return JSONResponse(
            content={"message": "Пользовательские данные успешно обновлены."},
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_409_CONFLICT)


@user_router.delete(path='/delete')
def deleting_user(current_user: UserBaseSchema, db: Annotated[Session, Depends(get_db)]):
    try:
        user = db.query(User).filter_by(id=current_user.id).first()
        db.delete(user)
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)