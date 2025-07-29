from  datetime import datetime as dt

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import validates

from models.base import Base

CURRENT_YEAR = dt.now().year

class CarBaseSchema(BaseModel):
    id: int
    vin: str
    owner_id: int
    brand: str
    model: str
    year: int = CURRENT_YEAR
    license_plate: str | None = None
    mileage: int


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, autoincrement=True)
    vin = Column(String, nullable=False, unique=True)
    owner_id = Column(Integer, nullable=False)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    license_plate = Column(String, nullable=True, default="")
    mileage = Column(Integer, nullable=False)

    @validates('year')
    def validate_year(self, _, year):
        MINIMUM_CAR_PRODUCTION_YEAR: int = 1950
        assert year > dt.now().year, ["Год выпуска автомобиля больше текущего!"]
        assert MINIMUM_CAR_PRODUCTION_YEAR < year, ["Год выпуска автомобиля ниже минимального значения!"]
        return year

    @validates('mileage')
    def validate_year(self, _, mileage):
        MINIMUM_MILEAGE: int = 0
        MAXIMUM_MILEAGE: int =  1_000_000
        assert MINIMUM_MILEAGE< mileage < MAXIMUM_MILEAGE,\
            [f"""Пробег автомобиля должен находится в диапазоне значений
            от {MINIMUM_MILEAGE} до {MAXIMUM_MILEAGE}!"""]
        return mileage