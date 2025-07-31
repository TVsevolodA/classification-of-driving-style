from pydantic import BaseModel

from Models.car import Car
from Models.driver import Driver
from Models.driver_car import DriverCar


class Trip(BaseModel):
    car: Car
    driver: Driver
    driver_car: DriverCar