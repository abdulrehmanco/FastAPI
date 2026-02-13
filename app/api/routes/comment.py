from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from ...core.dependencies import get_db, get_current_user

from app.schemas.comment import CommentCreate, CommentRead, CommentUpdate
from app.crud.comment import (
    create_comment,
    get_comments_for_blog,
    get_comment,
    update_comment,
    delete_comment
)




router = APIRouter(
    prefix="/blogs/{blog_id}/comments",
    tags=["Comments"]
)

@router.post("/", response_model=CommentRead)
def add_comment(
    blog_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_comment(
        db=db,
        comment=comment,
        user_id=current_user.id,
        blog_id=blog_id,
    )

@router.get("/", response_model=List[CommentRead])
def read_comments(blog_id: int, db: Session = Depends(get_db)):
    return get_comments_for_blog(db=db, blog_id=blog_id)


@router.put("/{comment_id}", response_model=CommentRead)
def edit_comment(
    blog_id: int,
    comment_id: int,
    comment: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_comment = get_comment(db=db, comment_id=comment_id)

    if not db_comment or db_comment.blog_id != blog_id:
        raise HTTPException(status_code=404, detail="Comment not found")

    if db_comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    return update_comment(db=db, db_comment=db_comment, comment=comment)

@router.delete("/{comment_id}")
def remove_comment(
    blog_id: int,
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_comment = get_comment(db=db, comment_id=comment_id)

    if not db_comment or db_comment.blog_id != blog_id:
        raise HTTPException(status_code=404, detail="Comment not found")

    if db_comment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    delete_comment(db=db, db_comment=db_comment)
    return {"detail": "Comment deleted"}

