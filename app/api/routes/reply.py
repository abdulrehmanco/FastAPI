from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ...core.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.reply import ReplyCreate, ReplyRead
from app.crud.reply import create_reply, get_replies_by_comment

router = APIRouter(
    prefix="/comments/{comment_id}/replies",
    tags=["Replies"]
)

# Create a reply
@router.post("/", response_model=ReplyRead)
def reply(comment_id: int, reply: ReplyCreate, db: Session = Depends(get_db),
          current_user: User = Depends(get_current_user)):
    return create_reply(db=db, user_id=current_user.id, comment_id=comment_id, content=reply.content)

# Get all replies of a comment
@router.get("/", response_model=List[ReplyRead])
def list_replies(comment_id: int, db: Session = Depends(get_db)):
    return get_replies_by_comment(db=db, comment_id=comment_id)
