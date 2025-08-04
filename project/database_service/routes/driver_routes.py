from typing import List, Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import JSONResponse

from create_session import CreateSession
from models.driver import DriverBaseSchema, Driver

driver_router = APIRouter()
get_db = CreateSession.get_db


@driver_router.get(path='/read', response_model=List[DriverBaseSchema])
def get_info_about_drivers(db: Annotated[Session, Depends(get_db)],
                           user_id: int = None,
                           driver_id: int = None):
    try:
        if driver_id is not None and user_id is not None:
            drivers: List[Driver] = (db.query(Driver)
                       .filter(Driver.id==driver_id, Driver.director_id == user_id)
                       .first())
        elif driver_id is None and user_id is not None:
            drivers: List[Driver] = db.query(Driver).filter(Driver.director_id == user_id).all()
        else:
            drivers: List[Driver] = db.query(Driver).all()
        return [ DriverBaseSchema.model_validate(driver) for driver in drivers ]
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)