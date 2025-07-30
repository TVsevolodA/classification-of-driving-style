from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import JSONResponse

from create_session import CreateSession
from models.car import Car, CarBaseSchema

car_router = APIRouter()
get_db = CreateSession.get_db

@car_router.post(path='/create')
def creating_car(new_car: CarBaseSchema, db: Annotated[Session, Depends(get_db)]):
    try:
        new_car_object: Car = Car(**new_car.model_dump())
        db.add(new_car_object)
        db.commit()
        return JSONResponse(
            content={"message": "Транспорт добавлен в базу."},
            status_code=status.HTTP_201_CREATED
        )
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_409_CONFLICT)


@car_router.get(path='/read', response_model=List[CarBaseSchema])
def getting_car(db: Annotated[Session, Depends(get_db)], vin: str = None, car_id: int = None, owner_id: int = None):
    try:
        exc = HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Транспорт не найден.",
        )

        cars = list()
        if owner_id is not None:
            # Вывести весь автопарк владельца
            cars = db.query(Car).filter_by(owner_id=owner_id).all()
        elif vin is None and car_id is None and owner_id is None:
            # Вывести весь автопарк
            cars = db.query(Car).all()
        elif vin is not None:
            car: Car | None = db.query(Car).filter_by(vin=vin).first()
            if car is None:
                raise exc
            cars.append( car )
        else:
            car: Car | None = db.query(Car).filter_by(id=car_id).first()
            if car is None:
                raise exc
            cars.append( car )
        return cars
    except HTTPException as http_exc:
        return JSONResponse(content={"error": http_exc.detail}, status_code=http_exc.status_code)
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)


@car_router.put(path='/update')
def car_update(update_car: dict, db: Annotated[Session, Depends(get_db)]):
    try:
        car = db.query(Car).filter_by(id=update_car.get("id")).first()
        for column, value in update_car.items():
            setattr(car, column, value)
        db.commit()
        return JSONResponse(
            content={"message": "Данные на транспорт успешно обновлены."},
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_409_CONFLICT)


@car_router.delete(path='/delete')
def deleting_car(current_car: CarBaseSchema, db: Annotated[Session, Depends(get_db)]):
    try:
        car = db.query(Car).filter_by(id=current_car.id).first()
        db.delete(car)
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return JSONResponse(content={"error": repr(e)}, status_code=status.HTTP_404_NOT_FOUND)