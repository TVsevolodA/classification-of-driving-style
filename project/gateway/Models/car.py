from pydantic import BaseModel

class Car(BaseModel):
    id: int | None = None
    vin: str
    owner_id: int
    brand: str
    model: str
    year: int
    license_plate: str
    insurance_expiry_date: str
    date_technical_inspection: str
    mileage: int