
import re
import uuid

from io import BytesIO
from pathlib import Path

from docx import Document
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

try:
    from pypdf import PdfReader  # type: ignore[import-not-found]
except ImportError:  # pragma: no cover - fallback for environments with PyPDF2
    from PyPDF2 import PdfReader  # type: ignore[import-not-found]

from ..database import get_db
from ..models import Resume, UserProfile
from ..security import get_current_profile


router = APIRouter(
    prefix="/resume",
    tags=["Resume Intelligence"]
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"

MAX_FILE_SIZE = 5 * 1024 * 1024

SKILL_DATABASE = {
    "Programming": [
        "Python", "Java", "JavaScript", "TypeScript", "C++",
        "C#", "PHP", "C", "Go", "Rust", "Kotlin", "Swift",
        "HTML", "CSS", "SQL"
    ],
    "Frameworks": [
        "React", "Angular", "Vue", "Node.js", "Express",
        "FastAPI", "Django", "Flask", "Spring Boot",
        "Next.js", "Tailwind CSS"
    ],
    "Data and AI": [
        "Machine Learning", "Deep Learning", "Artificial Intelligence",
        "Data Analysis", "Data Science", "Pandas", "NumPy",
        "TensorFlow", "PyTorch", "Power BI", "Tableau",
        "Natural Language Processing"
    ],
    "Tools": [
        "Git", "GitHub", "Docker", "Kubernetes", "AWS",
        "Azure", "Google Cloud", "Linux", "Figma", "Jira",
        "Postman", "VS Code"
    ],
    "Professional": [
        "Communication", "Leadership", "Problem Solving",
        "Teamwork", "Project Management", "Critical Thinking"
    ]
}

EDUCATION_KEYWORDS = [
    "b.tech", "b.e.", "bachelor", "master", "m.tech",
    "mca", "bca", "b.sc", "m.sc", "phd",
    "diploma", "higher secondary", "secondary",
    "university", "college"
]


def extract_pdf_text(content: bytes) -> str:
    reader = PdfReader(BytesIO(content))

    if reader.is_encrypted:
        raise HTTPException(
            status_code=400,
            detail="Password-protected PDFs are not supported."
        )

    pages = []

    for page in reader.pages:
        pages.append(page.extract_text() or "")

    return "\n".join(pages)


def extract_docx_text(content: bytes) -> str:
    document = Document(BytesIO(content))

    paragraphs = [
        paragraph.text
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    ]

    for table in document.tables:
        for row in table.rows:
            for cell in row.cells:
                if cell.text.strip():
                    paragraphs.append(cell.text)

    return "\n".join(paragraphs)


def find_email(text: str):
    match = re.search(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
        text
    )

    return match.group(0) if match else None


def find_phone(text: str):
    patterns = [
        r"(?<!\w)(?:\+?\d{1,3}[-.\s]?)?(?:\d[-.\s]?){9,12}(?!\w)"
    ]

    for pattern in patterns:
        match = re.search(pattern, text)

        if match:
            number = re.sub(r"\s+", " ", match.group(0)).strip()

            if len(re.sub(r"\D", "", number)) >= 10:
                return number

    return None


def find_education(text: str):
    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    matches = []

    for line in lines:
        lower_line = line.lower()

        if any(keyword in lower_line for keyword in EDUCATION_KEYWORDS):
            matches.append(line)

        if len(matches) >= 5:
            break

    return "\n".join(matches) if matches else None


def find_skills(text: str):
    found = []
    normalized_text = text.lower()

    for category, skills in SKILL_DATABASE.items():
        for skill in skills:
            escaped = re.escape(skill.lower())

            pattern = rf"(?<!\w){escaped}(?!\w)"

            if re.search(pattern, normalized_text):
                found.append({
                    "name": skill,
                    "category": category
                })

    return found


def parse_resume(text: str):
    return {
        "email": find_email(text),
        "phone": find_phone(text),
        "education": find_education(text),
        "suggested_skills": find_skills(text)
    }


@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    profile: UserProfile = Depends(get_current_profile)
):
    filename = Path(file.filename or "").name

    extension = Path(filename).suffix.lower()

    if extension not in [".pdf", ".docx"]:
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF or DOCX resume."
        )

    content = await file.read(MAX_FILE_SIZE + 1)

    if not content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty."
        )

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Resume must be smaller than 5 MB."
        )

    if extension == ".pdf":
        if not content.startswith(b"%PDF-"):
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is not a valid PDF."
            )

    if extension == ".docx":
        if not content.startswith(b"PK"):
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is not a valid DOCX file."
            )

    try:
        if extension == ".pdf":
            extracted_text = extract_pdf_text(content)
        else:
            extracted_text = extract_docx_text(content)

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not read this resume. Please try another file."
        )

    extracted_text = extracted_text.strip()

    if len(extracted_text) < 30:
        raise HTTPException(
            status_code=422,
            detail=(
                "Very little text could be extracted. "
                "This may be a scanned resume. Please upload a text-based PDF or DOCX."
            )
        )

    parsed = parse_resume(extracted_text)

    user_directory = UPLOAD_DIR / str(profile.id)
    user_directory.mkdir(parents=True, exist_ok=True)

    stored_filename = f"{uuid.uuid4().hex}{extension}"
    stored_path = user_directory / stored_filename

    try:
        stored_path.write_bytes(content)

        resume = Resume(
            profile_id=profile.id,
            original_filename=filename,
            stored_filename=stored_filename,
            extracted_text=extracted_text
        )

        db.add(resume)
        db.commit()
        db.refresh(resume)

    except Exception:
        db.rollback()

        if stored_path.exists():
            stored_path.unlink()

        raise HTTPException(
            status_code=500,
            detail="Could not save the uploaded resume."
        )

    return {
        "message": "Resume analyzed successfully.",
        "resume_id": resume.id,
        "filename": resume.original_filename,
        "parsed": parsed
    }


@router.get("/me")
def get_my_resumes(
    db: Session = Depends(get_db),
    profile: UserProfile = Depends(get_current_profile)
):
    resumes = db.query(Resume).filter(
        Resume.profile_id == profile.id
    ).order_by(
        Resume.uploaded_at.desc()
    ).all()

    return [
        {
            "id": resume.id,
            "filename": resume.original_filename,
            "uploaded_at": resume.uploaded_at
        }
        for resume in resumes
    ]
