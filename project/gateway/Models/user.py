from pydantic import BaseModel

class User(BaseModel):
    username: str
    full_name: str | None = None
    role: str | None = None


class UserInDB(User):
    id: int
    phone: str | None = None
    address: str | None = None
    hashed_password: str