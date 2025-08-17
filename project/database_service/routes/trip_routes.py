from typing import List, Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import func, cast, Float
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

@trip_router.post(path='/create')
def creating_car(new_trip: DriverCarBaseSchema, db: Annotated[Session, Depends(get_db)]):
    try:
        new_trip_object: DriverCar = DriverCar(**new_trip.model_dump())
        existing = db.query(DriverCar).filter_by(
            driver_id=new_trip_object.driver_id,
            car_id=new_trip_object.car_id,
            start_date=new_trip_object.start_date,
            place_departure=new_trip_object.place_departure,
            place_destination=new_trip_object.place_destination,
        ).first()
        if existing:
            existing.end_date = new_trip_object.end_date
            existing.distance = new_trip_object.distance
            existing.duration = new_trip_object.duration
            existing.fuel_consumption = new_trip_object.fuel_consumption
            existing.violations_per_trip = new_trip_object.violations_per_trip
            existing.average_speed = new_trip_object.average_speed
        else:
            db.add(new_trip_object)
        db.commit()

        db.add(new_trip_object)
        db.commit()
        return JSONResponse(
            content={"message": "Информация о поездке добавлена в базу."},
            status_code=status.HTTP_201_CREATED
        )
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_409_CONFLICT)

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


def find_out_rating(db: Session, table, rating_calc_func):
    return (
        db.query(
            table,
            rating_calc_func.label("rating")
        )
        .join(DriverCar, DriverCar.driver_id == table.id)
    )

@trip_router.get(path='/best', response_model=TripBaseModel)
def get_best_driver_and_car(
        db: Annotated[Session, Depends(get_db)],
        owner_id: int | None = None,
):
    try:
        rating_expr = 1 - func.avg(cast(DriverCar.violations_per_trip, Float) / DriverCar.distance)
        if owner_id:
            query_driver = ( find_out_rating(db, Driver, rating_expr)
                             .filter(Driver.director_id == owner_id)
                             .group_by(Driver.id, Driver.full_name)
                             .order_by(rating_expr.desc())
                             )
            query_car = ( find_out_rating(db, Car, rating_expr)
                          .filter(Car.owner_id == owner_id)
                          .group_by(Car.id, Car.model)
                          .order_by(rating_expr.desc())
                          )
        else:
            query_driver = ( find_out_rating(db, Driver, rating_expr)
                             .group_by(Driver.id, Driver.full_name)
                             .order_by(rating_expr.desc())
                             )
            query_car = ( find_out_rating(db, Car, rating_expr)
                          .group_by(Car.id, Car.model)
                          .order_by(rating_expr.desc())
                          )
        best_driver, _ = query_driver.first()
        best_car, _ = query_car.first()
        return TripBaseModel(driver=best_driver, car=best_car)
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)