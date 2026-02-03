from pydantic import BaseModel


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
    class Config:
        from_attributes = True
