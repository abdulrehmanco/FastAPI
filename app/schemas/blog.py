from pydantic import BaseModel
from typing import Optional

class BlogBase(BaseModel):
    title: str
    content: str


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BlogBase):
    pass


class BlogRead(BlogBase):
    id: int
    author_id: int
    image: Optional[str] 
    class Config:
        from_attributes = True
