from pydantic import ConfigDict, BaseModel

from models.car import CarBaseSchema
from models.driver import DriverBaseSchema
from models.driver_car import DriverCarBaseSchema


class TripBaseModel(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    car: CarBaseSchema
    driver: DriverBaseSchema
    driver_car: DriverCarBaseSchema | None = None