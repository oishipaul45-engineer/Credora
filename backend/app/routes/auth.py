
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import UserProfile, UserCredential
from ..schemas import ProfileResponse
from ..security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_profile
)


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


class SignupRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    profile: ProfileResponse


@router.post("/signup", response_model=AuthResponse)
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db)
):
    email = str(data.email).strip().lower()

    existing_user = db.query(UserProfile).filter(
        UserProfile.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )

    try:
        profile = UserProfile(
            full_name=data.full_name.strip(),
            email=email
        )

        db.add(profile)
        db.flush()

        credential = UserCredential(
            profile_id=profile.id,
            password_hash=hash_password(data.password)
        )

        db.add(credential)
        db.commit()
        db.refresh(profile)

        token = create_access_token(profile.id)

        return {
            "access_token": token,
            "token_type": "bearer",
            "profile": profile
        }

    except Exception:
        db.rollback()
        raise


@router.post("/login", response_model=AuthResponse)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    email = str(data.email).strip().lower()

    profile = db.query(UserProfile).filter(
        UserProfile.email == email
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    credential = db.query(UserCredential).filter(
        UserCredential.profile_id == profile.id
    ).first()

    if not credential or not verify_password(
        data.password,
        credential.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_access_token(profile.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "profile": profile
    }


@router.get("/me", response_model=ProfileResponse)
def get_my_account(
    profile: UserProfile = Depends(get_current_profile)
):
    return profile
