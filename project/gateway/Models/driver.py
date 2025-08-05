from pydantic import BaseModel


class Driver(BaseModel):
    id: int | None = None
    director_id: int
    license_number: str
    expiration_driver_license: str
    full_name: str
    phone: str
    email: str
    driving_experience: int
    issue_date: str
    driving_rating: float | None = 5
    number_violations: int | None = 0