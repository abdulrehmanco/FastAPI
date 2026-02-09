from sqlalchemy.orm import Session
from app.models.blog import Blog
from app.schemas.blog import BlogCreate, BlogUpdate
import shutil
from pathlib import Path





def set_blog_image(db: Session, blog: Blog, image_path: str):
    blog.image = image_path
    db.commit()
    db.refresh(blog)
    return blog


# Create blog linked to user
def create_blog(db: Session, blog: BlogCreate, user_id: int, image=None):
    image_path = None
    if image:
        images_dir = Path("app/media/blog_images")
        images_dir.mkdir(parents=True, exist_ok=True)
        image_path = images_dir / image.filename
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_path = str(image_path)
    db_blog = Blog(
        title=blog.title,
        content=blog.content,
        author_id=user_id,
        image=image_path
    )
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

# Read all blogs
def get_blogs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Blog).offset(skip).limit(limit).all()

# Read single blog
def get_blog(db: Session, blog_id: int):
    return db.query(Blog).filter(Blog.id == blog_id).first()

# Update blog
def update_blog(db: Session, blog_id: int, blog: BlogUpdate, user_id: int):
    db_blog = get_blog(db, blog_id)
    if not db_blog or db_blog.author_id != user_id:
        return None  # only author can update
    if blog.title:
        db_blog.title = blog.title
    if blog.content:
        db_blog.content = blog.content
    db.commit()
    db.refresh(db_blog)
    return db_blog

# Delete blog
def delete_blog(db: Session, blog_id: int, user_id: int):
    db_blog = get_blog(db, blog_id)
    if not db_blog or db_blog.author_id != user_id:
        return None  # only author can delete
    db.delete(db_blog)
    db.commit()
    return db_blog
