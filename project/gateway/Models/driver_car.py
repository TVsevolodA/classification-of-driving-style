from pydantic import BaseModel


class DriverCar(BaseModel):
    id: int
    driver_id: int
    car_id: int
    start_date: str
    end_date: str
    place_departure: str
    place_destination: str
    distance: float
    duration: int
    fuel_consumption: float
    violations_per_trip: int
    average_speed: int