from pydantic import BaseModel


class CommentBase(BaseModel):
    content: str


class CommentCreate(CommentBase):
    pass


class CommentUpdate(CommentBase):
    pass


class CommentRead(CommentBase):
    id: int
    user_id: int
    blog_id: int
    username: str | None = None

    class Config:
        from_attributes = True
