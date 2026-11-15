
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import UserProfile
from ..schemas import ProfileUpdate, ProfileResponse
from ..security import get_current_profile

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get("/me", response_model=ProfileResponse)
def get_my_profile(
    profile: UserProfile = Depends(get_current_profile)
):
    return profile


@router.put("/me", response_model=ProfileResponse)
def update_my_profile(
    data: ProfileUpdate,
    profile: UserProfile = Depends(get_current_profile),
    db: Session = Depends(get_db)
):
    updates = data.model_dump(exclude_unset=True)

    if "email" in updates and updates["email"]:
        updates["email"] = str(updates["email"]).strip().lower()

        existing = db.query(UserProfile).filter(
            UserProfile.email == updates["email"],
            UserProfile.id != profile.id
        ).first()

        if existing:
            raise HTTPException(
                status_code=409,
                detail="Email already in use."
            )

    for key, value in updates.items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)

    return profile
