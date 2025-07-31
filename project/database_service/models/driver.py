from datetime import datetime

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Date, Float, event
from sqlalchemy.orm import validates

from models.base import Base


class DriverBaseSchema(BaseModel):
    id: int
    director_id: int
    license_number: str
    expiration_driver_license: datetime
    full_name: str
    phone: str
    email: str
    driving_experience: int
    issue_date: datetime
    driving_rating: float
    number_violations: int

    class Config:
        from_attributes = True
        orm_mode = True


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    director_id = Column(Integer, nullable=False)
    license_number = Column(String, nullable=False, unique=True)
    expiration_driver_license = Column(Date, nullable=True)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)
    driving_experience = Column(Integer, nullable=False)
    issue_date = Column(Date, nullable=False)
    driving_rating = Column(Float, nullable=False, default=5.0)
    number_violations = Column(Integer, nullable=False, default=0)

    @validates('driving_experience')
    def validate_year(self, _, driving_experience):
        MINIMUM_DRIVING_EXPERIENCE: int = 0
        assert MINIMUM_DRIVING_EXPERIENCE < driving_experience,\
            ["Стаж вождения не может быть отрицательным числом!"]
        return driving_experience

def checking_driver_license(mapper, connection, target):
    if target.issue_date >= target.expiration_driver_license:
        raise ValueError("""
            Дата выдачи водительского удостоверения
            должна быть меньше даты окончания их действия!
        """)

event.listen(Driver, "before_insert", checking_driver_license)
event.listen(Driver, "before_update", checking_driver_license)