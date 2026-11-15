
import json
import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import JobRole, Skill, UserProfile
from ..security import get_current_profile


router = APIRouter(
    prefix="/jobs",
    tags=["Job Matching"]
)


# --------------------------------------------------
# DEFAULT JOB ROLES
# --------------------------------------------------

DEFAULT_JOB_ROLES = [
    {
        "title": "Frontend Developer",
        "category": "Development",
        "description": "Build responsive and interactive user interfaces for web applications.",
        "required_skills": [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "TypeScript"
        ],
        "optional_skills": [
            "Next.js",
            "Tailwind CSS",
            "Git",
            "REST API",
            "Figma"
        ]
    },
    {
        "title": "Backend Developer",
        "category": "Development",
        "description": "Build server-side applications, APIs, databases and backend systems.",
        "required_skills": [
            "Python",
            "SQL",
            "FastAPI",
            "REST API",
            "Database Management"
        ],
        "optional_skills": [
            "Docker",
            "Git",
            "Linux",
            "AWS",
            "Redis"
        ]
    },
    {
        "title": "Full Stack Developer",
        "category": "Development",
        "description": "Develop both frontend and backend components of web applications.",
        "required_skills": [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Python",
            "SQL"
        ],
        "optional_skills": [
            "FastAPI",
            "Node.js",
            "TypeScript",
            "Git",
            "Docker"
        ]
    },
    {
        "title": "Data Analyst",
        "category": "Data Science",
        "description": "Analyze datasets and generate insights to support business decisions.",
        "required_skills": [
            "Python",
            "SQL",
            "Excel",
            "Statistics",
            "Data Visualization"
        ],
        "optional_skills": [
            "Power BI",
            "Tableau",
            "Pandas",
            "NumPy",
            "Machine Learning"
        ]
    },
    {
        "title": "Machine Learning Engineer",
        "category": "Artificial Intelligence",
        "description": "Develop, train and deploy machine learning models.",
        "required_skills": [
            "Python",
            "Machine Learning",
            "Statistics",
            "NumPy",
            "Pandas"
        ],
        "optional_skills": [
            "TensorFlow",
            "PyTorch",
            "SQL",
            "Deep Learning",
            "Scikit-learn"
        ]
    },
    {
        "title": "UI/UX Designer",
        "category": "Design",
        "description": "Design intuitive digital experiences and user interfaces.",
        "required_skills": [
            "Figma",
            "UI Design",
            "UX Design",
            "Wireframing",
            "Prototyping"
        ],
        "optional_skills": [
            "Adobe XD",
            "Photoshop",
            "User Research",
            "HTML",
            "CSS"
        ]
    },
    {
        "title": "Python Developer",
        "category": "Development",
        "description": "Develop software applications and automation tools using Python.",
        "required_skills": [
            "Python",
            "OOP",
            "SQL",
            "Git",
            "Problem Solving"
        ],
        "optional_skills": [
            "FastAPI",
            "Django",
            "Flask",
            "REST API",
            "Docker"
        ]
    },
    {
        "title": "Cybersecurity Analyst",
        "category": "Cybersecurity",
        "description": "Monitor systems, identify security threats and protect digital infrastructure.",
        "required_skills": [
            "Networking",
            "Linux",
            "Cybersecurity",
            "Python",
            "Operating Systems"
        ],
        "optional_skills": [
            "Ethical Hacking",
            "Penetration Testing",
            "SIEM",
            "Cryptography",
            "Cloud Security"
        ]
    }
]


# --------------------------------------------------
# SKILL NORMALIZATION
# --------------------------------------------------

def normalize_skill(skill_name: str) -> str:
    """
    Normalize skill names to improve matching.
    """

    skill = skill_name.strip().lower()

    aliases = {
        "js": "javascript",
        "ts": "typescript",
        "reactjs": "react",
        "react.js": "react",
        "nodejs": "node.js",
        "node": "node.js",
        "html5": "html",
        "css3": "css",
        "postgres": "postgresql",
        "powerbi": "power bi",
        "ml": "machine learning",
        "ai": "artificial intelligence",
        "restful api": "rest api",
        "object oriented programming": "oop"
    }

    return aliases.get(skill, skill)


# --------------------------------------------------
# INSERT DEFAULT JOB ROLES
# --------------------------------------------------

def seed_job_roles(db: Session):
    """
    Add default roles if the job roles table is empty.
    """

    existing_role = db.query(JobRole).first()

    if existing_role:
        return

    for role_data in DEFAULT_JOB_ROLES:
        role = JobRole(
            title=role_data["title"],
            category=role_data["category"],
            description=role_data["description"],
            required_skills=json.dumps(
                role_data["required_skills"]
            ),
            optional_skills=json.dumps(
                role_data["optional_skills"]
            )
        )

        db.add(role)

    db.commit()


# --------------------------------------------------
# CONVERT STORED SKILLS
# --------------------------------------------------

def parse_skills(value: str | None) -> list[str]:
    """
    Read skills stored as JSON.
    Supports comma-separated values as a fallback.
    """

    if not value:
        return []

    try:
        parsed = json.loads(value)

        if isinstance(parsed, list):
            return [
                str(skill).strip()
                for skill in parsed
                if str(skill).strip()
            ]

    except (json.JSONDecodeError, TypeError):
        pass

    return [
        skill.strip()
        for skill in value.split(",")
        if skill.strip()
    ]


# --------------------------------------------------
# CALCULATE JOB MATCH
# --------------------------------------------------

def calculate_match(
    role: JobRole,
    user_skills: list[Skill]
):
    required_skills = parse_skills(
        role.required_skills
    )

    optional_skills = parse_skills(
        role.optional_skills
    )

    user_skill_map = {
        normalize_skill(skill.name): skill
        for skill in user_skills
    }

    matched_required = []
    missing_required = []
    matched_optional = []
    missing_optional = []

    for required in required_skills:
        normalized = normalize_skill(required)

        if normalized in user_skill_map:
            matched_required.append({
                "name": required,
                "proficiency": user_skill_map[
                    normalized
                ].proficiency_level
            })
        else:
            missing_required.append(required)

    for optional in optional_skills:
        normalized = normalize_skill(optional)

        if normalized in user_skill_map:
            matched_optional.append({
                "name": optional,
                "proficiency": user_skill_map[
                    normalized
                ].proficiency_level
            })
        else:
            missing_optional.append(optional)

    total_required = len(required_skills)

    if total_required:
        match_percentage = round(
            len(matched_required) / total_required * 100
        )
    else:
        match_percentage = 0

    if match_percentage >= 80:
        status = "Excellent Match"
    elif match_percentage >= 60:
        status = "Good Match"
    elif match_percentage >= 40:
        status = "Moderate Match"
    else:
        status = "Needs Improvement"

    return {
        "job_id": role.id,
        "job_title": role.title,
        "category": role.category,
        "description": role.description,

        "match_percentage": match_percentage,
        "match_status": status,

        "total_required_skills": total_required,
        "matched_required_count": len(
            matched_required
        ),

        "matched_required_skills": matched_required,
        "missing_required_skills": missing_required,

        "matched_optional_skills": matched_optional,
        "missing_optional_skills": missing_optional,

        "total_optional_skills": len(optional_skills),
        "matched_optional_count": len(matched_optional)
    }


# --------------------------------------------------
# GET ALL AVAILABLE JOB ROLES
# --------------------------------------------------

@router.get("/roles")
def get_job_roles(
    db: Session = Depends(get_db),
    profile: UserProfile = Depends(get_current_profile)
):
    seed_job_roles(db)

    roles = db.query(JobRole).order_by(
        JobRole.title
    ).all()

    return [
        {
            "id": role.id,
            "title": role.title,
            "category": role.category,
            "description": role.description,
            "required_skills": parse_skills(
                role.required_skills
            ),
            "optional_skills": parse_skills(
                role.optional_skills
            )
        }
        for role in roles
    ]


# --------------------------------------------------
# MATCH USER AGAINST ONE JOB ROLE
# --------------------------------------------------

@router.get("/match/{job_id}")
def match_single_job(
    job_id: int,
    db: Session = Depends(get_db),
    profile: UserProfile = Depends(get_current_profile)
):
    seed_job_roles(db)

    role = db.query(JobRole).filter(
        JobRole.id == job_id
    ).first()

    if not role:
        raise HTTPException(
            status_code=404,
            detail="Job role not found"
        )

    user_skills = db.query(Skill).filter(
        Skill.profile_id == profile.id
    ).all()

    return calculate_match(
        role,
        user_skills
    )


# --------------------------------------------------
# MATCH USER AGAINST ALL JOB ROLES
# --------------------------------------------------

@router.get("/matches")
def match_all_jobs(
    db: Session = Depends(get_db),
    profile: UserProfile = Depends(get_current_profile)
):
    seed_job_roles(db)

    roles = db.query(JobRole).all()

    user_skills = db.query(Skill).filter(
        Skill.profile_id == profile.id
    ).all()

    results = [
        calculate_match(role, user_skills)
        for role in roles
    ]

    results.sort(
        key=lambda item: item["match_percentage"],
        reverse=True
    )

    return {
        "profile_id": profile.id,
        "total_jobs_analyzed": len(results),
        "matches": results
    }
