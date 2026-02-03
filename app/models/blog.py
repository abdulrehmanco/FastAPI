from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"))
    comments = relationship("Comment", back_populates="blog", cascade="all, delete")
    likes = relationship("Like", back_populates="blog", cascade="all, delete")

    # Relationship to User
    author = relationship("User")
