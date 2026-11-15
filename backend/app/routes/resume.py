
import os
import re
import uuid
from io import BytesIO
from pathlib import Path
from urllib.parse import quote

import httpx
from dotenv import load_dotenv
from docx import Document
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

try:
    from pypdf import PdfReader
except ImportError:
    try:
        import PyPDF2  # type: ignore[import-not-found]
        PdfReader = PyPDF2.PdfReader
    except ImportError as exc:
        raise ImportError("Install 'pypdf' or 'PyPDF2' to process PDF resumes.") from exc

from ..database import get_db
from ..models import Resume, UserProfile
from ..security import get_current_profile


load_dotenv()

router = APIRouter(
    prefix="/resume",
    tags=["Resume Intelligence"]
)

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY", "")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "resumes")

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


def get_storage_config():
    if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
        raise HTTPException(
            status_code=503,
            detail="Supabase Storage is not configured on the server."
        )

    return {
        "apikey": SUPABASE_SECRET_KEY,
        "Authorization": f"Bearer {SUPABASE_SECRET_KEY}"
    }


def get_storage_path(profile_id: int, filename: str) -> str:
    return f"{profile_id}/{filename}"


async def upload_to_supabase(
    storage_path: str,
    content: bytes,
    content_type: str
):
    headers = get_storage_config()
    headers["Content-Type"] = content_type
    headers["x-upsert"] = "false"

    encoded_path = quote(storage_path, safe="/")

    url = (
        f"{SUPABASE_URL}/storage/v1/object/"
        f"{SUPABASE_BUCKET}/{encoded_path}"
    )
    print("ACTUAL UPLOAD URL:", url, flush=True)

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                url,
                content=content,
                headers=headers
            )
            print("REQUEST URL:", str(response.request.url), flush=True)
            if response.status_code not in (200, 201):
                print("SUPABASE STATUS:", response.status_code, flush=True)
                print("SUPABASE ERROR:", response.text, flush=True)

                raise HTTPException(
                    status_code=502,
                    detail=f"Supabase error {response.status_code}: {response.text[:500]}"
                )

    except httpx.RequestError:
        raise HTTPException(
            status_code=502,
            detail="Could not connect to resume storage."
        )


async def delete_from_supabase(storage_path: str):
    headers = get_storage_config()

    url = (
        f"{SUPABASE_URL}/storage/v1/object/"
        f"{SUPABASE_BUCKET}"
    )

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.delete(
                url,
                json={"prefixes": [storage_path]},
                headers=headers
            )

        if response.status_code not in (200, 204):
            raise RuntimeError("Supabase file deletion failed.")

    except httpx.RequestError as exc:
        raise RuntimeError("Could not connect to Supabase.") from exc


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
    pattern = (
        r"(?<!\w)(?:\+?\d{1,3}[-.\s]?)?"
        r"(?:\d[-.\s]?){9,12}(?!\w)"
    )

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

    if extension == ".pdf" and not content.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid PDF."
        )

    if extension == ".docx" and not content.startswith(b"PK"):
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
                "This may be a scanned resume. Please upload "
                "a text-based PDF or DOCX."
            )
        )

    parsed = parse_resume(extracted_text)

    stored_filename = f"{uuid.uuid4().hex}{extension}"
    storage_path = get_storage_path(
        profile.id,
        stored_filename
    )

    content_type = (
        "application/pdf"
        if extension == ".pdf"
        else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )

    await upload_to_supabase(
        storage_path,
        content,
        content_type
    )

    try:
        resume = Resume(
            profile_id=profile.id,
            original_filename=filename,
            stored_filename=storage_path,
            extracted_text=extracted_text
        )

        db.add(resume)
        db.commit()
        db.refresh(resume)

    except Exception:
        db.rollback()

        try:
            await delete_from_supabase(storage_path)
        except Exception:
            pass

        raise HTTPException(
            status_code=500,
            detail="Could not save the resume record."
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
