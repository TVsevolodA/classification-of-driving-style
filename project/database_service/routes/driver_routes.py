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
def get_info_about_drivers(db: Annotated[Session, Depends(get_db)], driver_id: int = None):
    try:
        if driver_id is not None:
            drivers = db.query(Driver).filter_by(id=driver_id).first()
        else:
            drivers = db.query(Driver).all()
        return drivers
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)