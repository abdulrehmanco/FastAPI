from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.db import Base


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    blog_id = Column(Integer, ForeignKey("blogs.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "blog_id", name="unique_user_blog_like"),
    )

    user = relationship("User", back_populates="likes")
    blog = relationship("Blog", back_populates="likes")
