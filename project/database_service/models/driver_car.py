from sqlalchemy import Column, Integer, DateTime, event

from models.base import Base


class DriverCar(Base):
    __tablename__ = "driver_car"

    id = Column(Integer, primary_key=True, autoincrement=True)
    driver_id = Column(Integer, nullable=False)
    car_id = Column(Integer, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)

def checking_travel_time(mapper, connection, target):
    if target.start_date >= target.end_date:
        raise ValueError("Время начала поездки должно быть меньше времени окончания!")

event.listen(DriverCar, "before_insert", checking_travel_time)
event.listen(DriverCar, "before_update", checking_travel_time)