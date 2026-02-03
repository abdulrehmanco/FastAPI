from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.blog import BlogCreate, BlogRead, BlogUpdate
from app.crud.blog import create_blog, get_blog, get_blogs, update_blog, delete_blog
from app.database.db import Base, engine, SessionLocal
from app.core.dependencies import get_db, get_current_user
from app.models.user import User

# Create tables (dev only)
Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"]
)


# -----------------
# Blog Routes
# -----------------

# Create blog (protected)
@router.post("/", response_model=BlogRead)
def create_blog_endpoint(
    blog: BlogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_blog(db=db, blog=blog, user_id=current_user.id)


# Read all blogs (public)
@router.get("/", response_model=List[BlogRead])
def read_blogs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_blogs(db=db, skip=skip, limit=limit)


# Read single blog (public)
@router.get("/{blog_id}", response_model=BlogRead)
def read_blog(blog_id: int, db: Session = Depends(get_db)):
    db_blog = get_blog(db=db, blog_id=blog_id)
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return db_blog


# Update blog (protected, only author)
@router.put("/{blog_id}", response_model=BlogRead)
def update_blog_endpoint(
    blog_id: int,
    blog: BlogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_blog = update_blog(db=db, blog_id=blog_id, blog=blog, user_id=current_user.id)
    if not db_blog:
        raise HTTPException(status_code=403, detail="Not authorized to update this blog")
    return db_blog


# Delete blog (protected, only author)
@router.delete("/{blog_id}", response_model=BlogRead)
def delete_blog_endpoint(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_blog = delete_blog(db=db, blog_id=blog_id, user_id=current_user.id)
    if not db_blog:
        raise HTTPException(status_code=403, detail="Not authorized to delete this blog")
    return db_blog
