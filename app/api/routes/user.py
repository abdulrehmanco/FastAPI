from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.db import SessionLocal, Base, engine
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.crud.user import create_user, get_user, get_users, update_user, delete_user, get_user_by_username
from ...core.dependencies import get_current_user



# Initialize DB (dev only)
Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/me", response_model=UserRead)
def read_current_user(current_user=Depends(get_current_user)):
    return current_user


# Create user
@router.post("/", response_model=UserRead)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user_by_username(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    return create_user(db=db, user=user)

# Get all users (admin only - checks is_admin flag)
@router.get("/", response_model=List[UserRead])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Only admins can list all users
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return get_users(db=db, skip=skip, limit=limit)

# Get single user - users can only view their own profile, admins can view any
@router.get("/{user_id}", response_model=UserRead)
def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Users can only view their own profile, admins can view anyone
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to view this user")
    
    db_user = get_user(db=db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Update own user (protected - user can only update themselves)
@router.put("/{user_id}", response_model=UserRead)
def update_user_endpoint(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Users can only update their own profile, admins can update anyone
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to update this user")
    
    db_user = update_user(db=db, user_id=user_id, user=user)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Delete own user (protected - user can only delete themselves, or admin can delete anyone)
@router.delete("/{user_id}", response_model=UserRead)
def delete_user_endpoint(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Users can only delete their own account, admins can delete anyone
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")
    
    db_user = delete_user(db=db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# Promote/Demote user to admin (admin only)
@router.put("/{user_id}/admin", response_model=UserRead)
def toggle_admin_status(
    user_id: int,
    is_admin: bool,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Only admins can change admin status
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Admins cannot demote themselves
    if current_user.id == user_id and not is_admin:
        raise HTTPException(status_code=400, detail="Cannot demote yourself from admin")
    
    db_user = get_user(db=db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.is_admin = 1 if is_admin else 0
    db.commit()
    db.refresh(db_user)
    return db_user

