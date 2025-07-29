import enum
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Enum
from models.base import Base

class Roles(enum.Enum):
    user = "user"
    admin = "admin"

class UserBaseSchema(BaseModel):
    id: int | None = None
    username: str
    full_name: str
    hashed_password: str
    role: Roles
    phone: str = ""
    address: str = ""


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False, unique=True)
    full_name = Column(String, nullable=True, default="")
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(Roles), default=Roles.user, nullable=False)
    phone = Column(String, nullable=True, default="")
    address = Column(String, nullable=True, default="")