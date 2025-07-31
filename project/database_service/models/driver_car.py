from datetime import datetime

from pydantic import BaseModel
from sqlalchemy import Column, Integer, DateTime, event, String, Float
from sqlalchemy.orm import validates

from models.base import Base

class DriverCarBaseSchema(BaseModel):
    id: int
    driver_id: int
    car_id: int
    start_date: datetime
    end_date: datetime
    place_departure: str
    place_destination: str
    distance: float
    duration: int
    fuel_consumption: float
    violations_per_trip: int
    average_speed: int

    class Config:
        from_attributes = True
        orm_mode = True

class DriverCar(Base):
    __tablename__ = "driver_car"

    id = Column(Integer, primary_key=True, autoincrement=True)
    driver_id = Column(Integer, nullable=False)
    car_id = Column(Integer, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    place_departure = Column(String, nullable=False)
    place_destination = Column(String, nullable=False)
    distance = Column(Float, nullable=False)
    duration = Column(Integer, nullable=False)
    fuel_consumption = Column(Float, nullable=False)
    violations_per_trip = Column(Integer, nullable=False, default=0)
    average_speed = Column(Integer, nullable=False)

    @validates('distance')
    def validate_year(self, _, distance):
        MIN_DISTANCE = 1
        assert distance < MIN_DISTANCE,\
            ["Расстояние должно быть положительным!"]
        return distance

    @validates('duration')
    def validate_year(self, _, duration):
        MIN_DURATION = 1
        assert duration < MIN_DURATION,\
            ["Продолжительность поездки должна быть положительной!"]
        return duration

    @validates('fuel_consumption')
    def validate_year(self, _, fuel_consumption):
        MIN_FUEL_CONSUMPTION = 1
        assert fuel_consumption < MIN_FUEL_CONSUMPTION,\
            ["Расход топлива должен быть положительным!"]
        return fuel_consumption

    @validates('violations_per_trip')
    def validate_year(self, _, violations_per_trip):
        MIN_NUMBER_VIOLATIONS = 0
        assert violations_per_trip < MIN_NUMBER_VIOLATIONS,\
            ["Количество нарушений не может быть отрицательным!"]
        return violations_per_trip

    @validates('average_speed')
    def validate_year(self, _, average_speed):
        MIN_ALLOWABLE_AVERAGE_SPEED = 1
        assert average_speed < MIN_ALLOWABLE_AVERAGE_SPEED,\
            ["Средняя скорось должна быть положительной!"]
        return average_speed

def checking_travel_time(mapper, connection, target):
    if target.start_date >= target.end_date:
        raise ValueError("Время начала поездки должно быть меньше времени окончания!")

event.listen(DriverCar, "before_insert", checking_travel_time)
event.listen(DriverCar, "before_update", checking_travel_time)