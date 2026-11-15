
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Skill, UserProfile
from ..schemas import SkillCreate, SkillUpdate, SkillResponse
from ..security import get_current_profile

router = APIRouter(
    prefix="/skills",
    tags=["Skills"]
)


@router.post("/me", response_model=SkillResponse, status_code=201)
def create_skill(
    data: SkillCreate,
    db: Session = Depends(get_db),
    profile: UserProfile = Depends(get_current_profile)
):
    skill = Skill(
        profile_id=profile.id,
        **data.model_dump()
    )

    db.add(skill)
    db.commit()
    db.refresh(skill)

    return skill


@router.get("/me", response_model=list[SkillResponse])
def get_my_skills(
    db: Session = Depends(get_db),
    profile: UserProfile = Depends(get_current_profile)
):
    return db.query(Skill).filter(
        Skill.profile_id == profile.id
    ).all()


@router.put("/item/{skill_id}", response_model=SkillResponse)
def update_skill(
    skill_id: int,
    data: SkillUpdate,
    db: Session = Depends(get_db),
    profile: UserProfile = Depends(get_current_profile)
):
    skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.profile_id == profile.id
    ).first()

    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    updates = data.model_dump(exclude_unset=True)

    for key, value in updates.items():
        setattr(skill, key, value)

    db.commit()
    db.refresh(skill)

    return skill


@router.delete("/item/{skill_id}")
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    profile: UserProfile = Depends(get_current_profile)
):
    skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.profile_id == profile.id
    ).first()

    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    db.delete(skill)
    db.commit()

    return {"message": "Skill deleted successfully"}
