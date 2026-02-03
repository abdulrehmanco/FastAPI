from pydantic import BaseModel

class ReplyCreate(BaseModel):
    content: str

class ReplyRead(BaseModel):
    id: int
    content: str
    user_id: int
    comment_id: int

    class Config:
        from_attributes = True
