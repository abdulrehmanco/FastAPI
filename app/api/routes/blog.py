from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import shutil, os
from uuid import uuid4
from app.database.db import Base, engine
from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.blog import Blog
from app.schemas.blog import BlogRead, BlogUpdate

Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"]
)

UPLOAD_DIR = "app/media/blog_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ------------------------
# CREATE BLOG (WITH IMAGE)
# ------------------------
@router.post("/", response_model=BlogRead)
def create_blog(
    title: str = Form(...),
    content: str = Form(...),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    image_url = None

    if image:
        if not image.content_type.startswith("image/"):
            raise HTTPException(400, "File must be an image")

        ext = image.filename.split(".")[-1]
        filename = f"{uuid4()}.{ext}"

        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # 🔑 THIS is what frontend uses
        image_url = f"media/blog_images/{filename}"

    blog = Blog(
        title=title,
        content=content,
        author_id=current_user.id,
        image=image_url
    )

    db.add(blog)
    db.commit()
    db.refresh(blog)
    return blog


# ------------------------
# READ ALL BLOGS
# ------------------------
@router.get("/", response_model=List[BlogRead])
def read_blogs(db: Session = Depends(get_db)):
    return db.query(Blog).all()



# ------------------------
# READ SINGLE BLOG
# ------------------------
@router.get("/{blog_id}", response_model=BlogRead)
def read_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(404, "Blog not found")
    return blog


# ------------------------
# UPDATE BLOG
# ------------------------
@router.put("/{blog_id}", response_model=BlogRead)
def update_blog(
    blog_id: int,
    title: str = Form(...),
    content: str = Form(...),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_blog = db.query(Blog).filter(Blog.id == blog_id).first()

    if not db_blog or db_blog.author_id != current_user.id:
        raise HTTPException(403, "Not allowed")

    db_blog.title = title
    db_blog.content = content

    # Update image if provided
    if image:
        if not image.content_type.startswith("image/"):
            raise HTTPException(400, "File must be an image")

        ext = image.filename.split(".")[-1]
        filename = f"{uuid4()}.{ext}"

        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        image_url = f"media/blog_images/{filename}"
        db_blog.image = image_url

    db.commit()
    db.refresh(db_blog)
    return db_blog


# ------------------------
# DELETE BLOG
# ------------------------
@router.delete("/{blog_id}", response_model=BlogRead)
def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()

    if not blog or blog.author_id != current_user.id:
        raise HTTPException(403, "Not allowed")

    db.delete(blog)
    db.commit()
    return blog
