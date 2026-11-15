
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


# PROFILE SCHEMAS

class ProfileCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    headline: Optional[str] = None
    location: Optional[str] = None
    education: Optional[str] = None
    career_goal: Optional[str] = None
    about: Optional[str] = None


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    headline: Optional[str] = None
    location: Optional[str] = None
    education: Optional[str] = None
    career_goal: Optional[str] = None
    about: Optional[str] = None


class ProfileResponse(ProfileCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


# SKILL SCHEMAS

class SkillCreate(BaseModel):
    name: str
    category: str
    proficiency_level: str = "Beginner"
    description: Optional[str] = None


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    proficiency_level: Optional[str] = None
    description: Optional[str] = None


class SkillResponse(SkillCreate):
    id: int
    profile_id: int

    model_config = ConfigDict(from_attributes=True)
