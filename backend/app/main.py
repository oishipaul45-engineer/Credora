
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models
from .routes import profile, skills, auth, resume, job_matching


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Credora API",
    description="Your credentials. Your identity. Your professional workspace.",
    version="1.2.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Existing routes
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(skills.router)
app.include_router(resume.router)

# Job matching route
app.include_router(job_matching.router)


@app.get("/")
def home():
    return {
        "message": "Welcome to Credora API",
        "status": "running",
        "version": "1.2.0"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Credora Backend"
    }
