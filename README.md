# ✳ CREDORA

### Your potential deserves a platform.

**Not just another resume builder. A workspace for everything you're becoming.**

Credora is a career development platform designed to bring your professional identity, skills, opportunities, and ambitions into one place.

Discover what you're good at. Understand where you need to grow. Find the direction that takes you further.

<p align="center">
  <strong>YOUR SKILLS. YOUR DIRECTION. YOUR NEXT CHAPTER.</strong>
</p>

---

## ◈ THE IDEA

A resume tells people where you've been.

But what helps you understand where you could go next?

Credora is built around that question.

Instead of treating your resume, skills, and career goals as separate things, Credora connects them into one professional workspace — helping you understand your current capabilities and explore your next opportunities.

---

## ✳ EXPLORE CREDORA

| | Experience | What it does |
|---|---|---|
| ◉ | **Your Identity** | Build and manage your professional profile. |
| ↗ | **Resume Intelligence** | Upload PDF or DOCX resumes, extract information, and identify skills. |
| ◈ | **Skill Studio** | Organize, update, and track your professional skills. |
| ◎ | **Job Matching** | Compare your skills with career-role requirements and discover skill gaps. |
| ✺ | **Career Roadmap** | Explore personalized learning paths and track your progress. |
| ✧ | **Career Insights** | Get an overview of your professional development. |

---

## ◎ THE CREDORA JOURNEY

```text
        YOUR PROFILE
             │
             ▼
       RESUME ANALYSIS
             │
             ▼
        SKILL DISCOVERY
             │
             ▼
         JOB MATCHING
             │
             ▼
      CAREER ROADMAP
             │
             ▼
       YOUR NEXT MOVE
```

**One workspace. A clearer direction.**

---

## ◈ BUILT WITH

Credora combines a modern frontend with a Python-powered backend.

| Frontend | Backend |
|---|---|
| React | Python |
| TypeScript | FastAPI |
| Vite | SQLAlchemy |
| CSS | REST APIs |

**Data layer:** SQLite in the current local development setup.

---

## ✧ THE ARCHITECTURE

```text
Credora/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── profile.py
│   │   │   ├── skills.py
│   │   │   ├── resume.py
│   │   │   └── job_matching.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── security.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── App.tsx
│       ├── App.css
│       ├── CareerRoadmap.tsx
│       ├── JobMatching.tsx
│       ├── PersonalizedRoadmap.tsx
│       ├── ResumeUpload.tsx
│       └── index.css
│
└── README.md
```

---

## ↗ RUN CREDORA LOCALLY

Want to explore the project?

### 01 — Clone

```bash
git clone https://github.com/oishipaul45-engineer/Credora.git
cd Credora
```

### 02 — Start the backend

```bash
cd backend
python -m venv .venv
```

Activate the environment on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Run the API:

```bash
python -m uvicorn app.main:app --reload
```

API documentation: `http://127.0.0.1:8000/docs`

### 03 — Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite.

---

## ✺ WHAT'S NEXT?

Credora is an evolving project. The next stage of development can explore:

- More intelligent resume feedback.
- Advanced job recommendation systems.
- Live job-market integration.
- Deeper skill-gap analysis.
- Expanded learning resources.
- Cloud-based resume storage.
- Production deployment and scalability.

---

## ◉ THE THINKING BEHIND CREDORA

We believe career development should be more than a collection of documents, qualifications, and job applications.

It should be a continuous process of discovering your strengths, recognizing your gaps, and building towards something bigger.

**Your career isn't a straight line. Credora helps you navigate it.**

---

<p align="center">
  <strong>✳ CREDORA</strong>
  <br/>
  <em>Your credentials. Your identity. Your professional workspace.</em>
  <br/><br/>
  Built with curiosity and a vision for better career journeys.
  <br/><br/>
  <a href="https://github.com/oishipaul45-engineer/Credora">EXPLORE THE REPOSITORY ↗</a>
</p>
