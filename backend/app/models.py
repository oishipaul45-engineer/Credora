
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
)

from .database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)

    phone = Column(String(30), nullable=True)
    headline = Column(String(255), nullable=True)
    location = Column(String(150), nullable=True)

    education = Column(Text, nullable=True)
    career_goal = Column(String(255), nullable=True)
    about = Column(Text, nullable=True)


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)

    profile_id = Column(
        Integer,
        ForeignKey("user_profiles.id"),
        nullable=False,
        index=True
    )

    name = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)

    proficiency_level = Column(
        String(30),
        nullable=False,
        default="Beginner"
    )

    description = Column(Text, nullable=True)


class UserCredential(Base):
    __tablename__ = "user_credentials"

    id = Column(Integer, primary_key=True, index=True)

    profile_id = Column(
        Integer,
        ForeignKey("user_profiles.id"),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = Column(String(255), nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    profile_id = Column(
        Integer,
        ForeignKey("user_profiles.id"),
        nullable=False,
        index=True
    )

    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)

    extracted_text = Column(Text, nullable=False)

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

class JobRole(Base):
    __tablename__ = "job_roles"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(150), unique=True, nullable=False, index=True)

    description = Column(Text, nullable=True)

    category = Column(String(100), nullable=False)

    required_skills = Column(Text, nullable=False)

    optional_skills = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )
