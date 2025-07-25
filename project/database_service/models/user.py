import enum

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Enum

from models.base import Base

class Roles(enum.Enum):
    USER = "user"
    ADMIN = "admin"

class UserPydanticModel(BaseModel):
    id: int
    username: str
    full_name: str
    hashed_password: str
    role: str
    phone: str
    address: str


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False, unique=True)
    full_name = Column(String, nullable=True, default="")
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(Roles), default=Roles.USER, nullable=False)
    phone = Column(String, nullable=True, default="")
    address = Column(String, nullable=True, default="")