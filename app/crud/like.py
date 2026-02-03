from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.like import Like


def like_blog(db: Session, *, user_id: int, blog_id: int):
    like = Like(user_id=user_id, blog_id=blog_id)
    db.add(like)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        return None
    db.refresh(like)
    return like


def unlike_blog(db: Session, *, user_id: int, blog_id: int):
    like = (
        db.query(Like)
        .filter(Like.user_id == user_id, Like.blog_id == blog_id)
        .first()
    )
    if like:
        db.delete(like)
        db.commit()
    return like


def count_likes(db: Session, blog_id: int) -> int:
    return db.query(Like).filter(Like.blog_id == blog_id).count()
