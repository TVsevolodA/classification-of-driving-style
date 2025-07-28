import enum

from pydantic import BaseModel

class Roles(enum.Enum):
    user = "user"
    admin = "admin"

class User(BaseModel):
    username: str
    full_name: str = ""
    role: Roles = Roles.user


class UserInDB(User):
    id: int
    phone: str = ""
    address: str = ""
    hashed_password: str