from pydantic import BaseModel

class Car(BaseModel):
    vin: str
    owner: str
    brand: str
    model: str
    year: int
    licensePlate: str
    mileage: int