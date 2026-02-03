from pydantic import BaseModel, EmailStr, constr
from typing import Annotated

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: Annotated[str, constr(min_length=6, max_length=72)]

class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_admin: int

    class Config:
        from_attributes=True

class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    password: str | None = None
