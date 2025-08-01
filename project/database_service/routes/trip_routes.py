from typing import List, Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import JSONResponse

from create_session import CreateSession
from models.car import Car, CarBaseSchema
from models.driver import Driver, DriverBaseSchema
from models.driver_car import DriverCar, DriverCarBaseSchema
from models.trip import TripBaseModel

trip_router = APIRouter()
get_db = CreateSession.get_db


@trip_router.get(path='/read', response_model=List[TripBaseModel])
def get_trips_all(db: Annotated[Session, Depends(get_db)],
                  driver_id: int = None,
                  car_id: int = None,
                  driver_car_id: int = None,
                  owner_id: int = None,):
    try:
        query = (
            db.query(Driver, DriverCar, Car)
            .join(DriverCar, Driver.id == DriverCar.driver_id)
            .join(Car, DriverCar.car_id == Car.id)
        )

        if driver_id is not None:
            query = query.filter(Driver.id == driver_id)
        elif car_id is not None:
            query = query.filter(Car.id == car_id)
        elif driver_car_id is not None:
            query = query.filter(DriverCar.id == driver_car_id)
        if owner_id is not None:
            query = query.filter(Car.owner_id == owner_id, Driver.director_id == owner_id)

        selection: List = query.all()
        trips: List[TripBaseModel] = []

        for driver, driver_car, car in selection:
            new_trip = TripBaseModel(
                driver=DriverBaseSchema.model_validate(driver),
                driver_car=DriverCarBaseSchema.model_validate(driver_car),
                car=CarBaseSchema.model_validate(car)
            )
            trips.append(new_trip)
        return trips
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)