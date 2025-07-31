from typing import List

from pydantic import BaseModel, ConfigDict

from models.car import *
from models.driver import *
from models.driver_car import *


class TripBaseModel(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    car: CarBaseSchema
    driver: DriverBaseSchema
    driver_car: DriverCarBaseSchema