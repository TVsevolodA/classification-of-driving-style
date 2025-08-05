from typing import List, Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import JSONResponse

from create_session import CreateSession
from models.driver import DriverBaseSchema, Driver

driver_router = APIRouter()
get_db = CreateSession.get_db

@driver_router.post(path='/create')
def create_driver(new_driver: DriverBaseSchema, db: Annotated[Session, Depends(get_db)],):
    try:
        new_driver_object: Driver = Driver(**new_driver.model_dump())
        db.add(new_driver_object)
        db.commit()
        return JSONResponse(
            content={"message": "Водитель добавлен в базу."},
            status_code=status.HTTP_201_CREATED
        )
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_409_CONFLICT)


@driver_router.get(path='/read', response_model=List[DriverBaseSchema])
def get_info_about_drivers(db: Annotated[Session, Depends(get_db)],
                           user_id: int = None,
                           driver_id: int = None,
                           license_number: str = None):
    try:
        if driver_id is not None and user_id is not None:
            drivers: List[Driver] = (db.query(Driver)
                       .filter(Driver.id==driver_id, Driver.director_id == user_id)
                       .first())
        elif driver_id is None and user_id is not None:
            drivers: List[Driver] = db.query(Driver).filter(Driver.director_id == user_id).all()
        elif license_number is not None:
            drivers: List[Driver] = db.query(Driver).filter(Driver.license_number == license_number).all()
        else:
            drivers: List[Driver] = db.query(Driver).all()
        return [ DriverBaseSchema.model_validate(driver) for driver in drivers ]
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)

@driver_router.put(path='/update')
def update_driver_route(update_driver: dict, db: Annotated[Session, Depends(get_db)],):
    try:
        driver = db.query(Driver).filter_by(id=update_driver.get("id")).first()
        for column, value in update_driver.items():
            setattr(driver, column, value)
        db.commit()
        return JSONResponse(
            content={"message": "Данные о водителе успешно обновлены."},
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_409_CONFLICT)