from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...core.dependencies import get_db, get_current_user
from app.models.user import User
from app.crud.like import like_blog, unlike_blog, count_likes

router = APIRouter(
    prefix="/blogs/{blog_id}/likes",
    tags=["Likes"]
)

@router.post("/")
def like(blog_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    like = like_blog(db=db, user_id=current_user.id, blog_id=blog_id)
    if not like:
        raise HTTPException(status_code=400, detail="Already liked")
    return {"detail": "Liked"}

@router.delete("/")
def unlike(blog_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    unlike_blog(db=db, user_id=current_user.id, blog_id=blog_id)
    return {"detail": "Unliked"}


@router.get("/count")
def like_count(blog_id: int, db: Session = Depends(get_db)):
    return {"likes": count_likes(db=db, blog_id=blog_id)}
