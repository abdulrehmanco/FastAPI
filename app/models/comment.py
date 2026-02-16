from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)

    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    blog_id = Column(Integer, ForeignKey("blogs.id"), nullable=False)

    # Relationships
    owner = relationship("User", back_populates="comments")
    blog = relationship("Blog", back_populates="comments")
    replies = relationship("Reply", back_populates="comment", cascade="all, delete")

    @property
    def username(self):
        return self.owner.username if self.owner else None


