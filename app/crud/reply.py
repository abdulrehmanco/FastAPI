from sqlalchemy.orm import Session
from app.models.reply import Reply

def create_reply(db: Session, *, user_id: int, comment_id: int, content: str):
    reply = Reply(user_id=user_id, comment_id=comment_id, content=content)
    db.add(reply)
    db.commit()
    db.refresh(reply)
    return reply

def get_replies_by_comment(db: Session, comment_id: int):
    return db.query(Reply).filter(Reply.comment_id == comment_id).all()
