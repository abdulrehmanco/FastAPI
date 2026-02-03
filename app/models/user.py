from sqlalchemy import Column, Integer, String
from app.database.db import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Integer, default=0)  # 0 = normal user, 1 = admin
    comments = relationship("Comment", back_populates="owner", cascade="all, delete")
    likes = relationship("Like", back_populates="user", cascade="all, delete")
    replies = relationship("Reply", back_populates="user", cascade="all, delete")
