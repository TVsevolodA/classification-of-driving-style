from typing import List, Annotated, Type

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import JSONResponse

from create_session import CreateSession
from models.car import Car
from models.driver import *
from models.driver_car import *
from models.trip import *

trip_router = APIRouter()
get_db = CreateSession.get_db


def get_id_cars(driver_cars: List[Type[DriverCar]]):
    ids: List[int] = []
    for driver_car in driver_cars:
        ids.append(driver_car.car_id)
    return ids

# , response_model=List[Trip]
@trip_router.get(path='/read/all')
def get_trips_all(db: Annotated[Session, Depends(get_db)],
              driver_id: int = None,
              car_id: int = None,
              trip_id: int = None):
    # try:
    if driver_id is not None:
        req = (db.query(Driver, DriverCar, Car)
                 .join(DriverCar, Driver.id == DriverCar.driver_id)
                 .join(Car, DriverCar.car_id == Car.id)
                 .filter(Driver.id == driver_id)
                 .all())
        trips: List[TripBaseModel] = []
        for driver, driver_car, car in req:
            new_trip = TripBaseModel(
                driver=DriverBaseSchema.model_validate(driver),
                driver_car=DriverCarBaseSchema.model_validate(driver_car),
                car=CarBaseSchema.model_validate(car)
            )
            trips.append(new_trip)
        return trips
    else:
        drivers = db.query(Driver).all()
    return drivers
    # except Exception as e:
    #     return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)



# , response_model=List[Trip]
# @trip_router.get(path='/read')
# def get_trips(db: Annotated[Session, Depends(get_db)],
#               driver_id: int = None,
#               car_id: int = None,
#               trip_id: int = None):
#     try:
#         return []
#     except Exception as e:
#         return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)