from pydantic import BaseModel


class Driver(BaseModel):
    id: int
    director_id: int
    license_number: str
    expiration_driver_license: str
    insurance_expiry_date: str
    full_name: str
    phone: str
    email: str
    driving_experience: int
    issue_date: str
    driving_rating: float
    number_violations: int