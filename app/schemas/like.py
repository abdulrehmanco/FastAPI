from pydantic import BaseModel


class LikeRead(BaseModel):
    id: int
    user_id: int
    blog_id: int

    class Config:
        from_attributes = True
