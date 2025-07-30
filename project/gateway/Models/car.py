from pydantic import BaseModel

class Car(BaseModel):
    id: int
    vin: str
    owner_id: int
    brand: str
    model: str
    year: int
    license_plate: str
    mileage: int