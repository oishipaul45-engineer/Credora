 <div align="center">

# ✦ C R E D O R A

### YOUR CREDENTIALS. YOUR IDENTITY. YOUR PROFESSIONAL WORKSPACE.

*A smarter space to discover your skills, understand your potential, and shape your career.*

<br/>

<a href="https://credora-connect.vercel.app/">
  <img src="https://img.shields.io/badge/✦_EXPLORE_LIVE_DEMO-FF7139?style=for-the-badge&labelColor=20202B" alt="Live Demo"/>
</a>

<br/><br/>

[![React](https://img.shields.io/badge/React-20202B?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-20202B?style=for-the-badge&logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-20202B?style=for-the-badge&logo=vite&logoColor=646CFF)](https://vite.dev/)

[![Python](https://img.shields.io/badge/Python-20202B?style=for-the-badge&logo=python&logoColor=FFD43B)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-20202B?style=for-the-badge&logo=fastapi&logoColor=009688)](https://fastapi.tiangolo.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-20202B?style=for-the-badge&logo=sqlalchemy&logoColor=D71F00)](https://www.sqlalchemy.org/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-20202B?style=for-the-badge&logo=postgresql&logoColor=4169E1)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-20202B?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com/)
[![CSS3](https://img.shields.io/badge/CSS3-20202B?style=for-the-badge&logo=css3&logoColor=1572B6)](https://developer.mozilla.org/en-US/docs/Web/CSS)

[![Vercel](https://img.shields.io/badge/Vercel-20202B?style=for-the-badge&logo=vercel&logoColor=FFFFFF)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-20202B?style=for-the-badge&logo=render&logoColor=46E3B7)](https://render.com/)
[![GitHub](https://img.shields.io/badge/GitHub-20202B?style=for-the-badge&logo=github&logoColor=FFFFFF)](https://github.com/)

<br/>

**A career workspace that sees more than just a resume.**

</div>

---

## ✦ THE BIG IDEA

A resume tells people what they have done.

But what about what they can do next?

What skills are missing? Which opportunities match their abilities? What should they learn to reach their career goals?

Traditional resumes capture experience, but professional growth is an ongoing journey.

**Credora brings that journey into one place.**

It combines resume insights, professional profiles, skill management, job matching and career planning in a single workspace designed to help people understand their potential and take their next step with confidence.

---

## ◇ EXPLORE THE PLATFORM

<table>
<tr>
<td width="50%">

### 📄 Resume Analysis

Upload a PDF or DOCX resume and extract useful professional information and skills.

</td>
<td width="50%">

### 🧩 Skill Management

Build, organise and manage your professional skill profile.

</td>
</tr>
<tr>
<td width="50%">

### 🎯 Job Matching

Compare your existing skills against career-role requirements and discover skill gaps.

</td>
<td width="50%">

### 🗺️ Career Roadmap

Explore career directions, follow learning stages and track your progress.

</td>
</tr>
<tr>
<td width="50%">

### 👤 Professional Profile

Keep your professional identity and information organised in one workspace.

</td>
<td width="50%">

### 🔐 Secure Authentication

Create an account and access your personal professional workspace.

</td>
</tr>
</table>

---

## ✧ HOW CREDORA WORKS

**01 — UPLOAD. DISCOVER.**

Your resume is more than a document. Upload it and let Credora extract useful professional information and identify skills that can contribute to your profile.

**02 — UNDERSTAND. MATCH.**

Explore career roles and compare your current skills with the requirements of different opportunities.

**03 — PLAN. PROGRESS.**

Explore career pathways, identify learning gaps and track your development through a structured roadmap.

**04 — BUILD. GROW.**

Keep your professional identity organised as your skills, experience and ambitions evolve.

---

## ⚙️ TECHNOLOGY STACK

Credora combines a modern frontend, a Python backend and cloud-powered infrastructure.

| Layer | Technology |
|:--|:--|
| Frontend | React, TypeScript |
| Build Tool | Vite |
| Styling | CSS |
| Backend | Python, FastAPI |
| ORM | SQLAlchemy |
| Production Database | PostgreSQL |
| Local Development Database | SQLite |
| Database Platform | Supabase |
| Authentication | Token-based authentication (JWT) |
| Resume Processing | PDF and DOCX parsing |
| File Storage | Supabase Storage |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Version Control | Git and GitHub |

---

## 🏗️ SYSTEM ARCHITECTURE

Credora follows a frontend-backend architecture with cloud-hosted database and file storage.

```text
                 USER
                   |
                   v
       REACT + TYPESCRIPT FRONTEND
                (Vercel)
                   |
              API REQUESTS
                   |
                   v
          PYTHON + FASTAPI
                (Render)
                   |
          +--------+--------+
          |                 |
          v                 v
     POSTGRESQL        SUPABASE STORAGE
     (Supabase)        (Resume Files)
```

### Infrastructure

- **Vercel:** Hosts the frontend application.
- **Render:** Runs the FastAPI backend.
- **Supabase PostgreSQL:** Stores application data.
- **Supabase Storage:** Stores uploaded resume files.
- **SQLAlchemy:** Handles database operations through ORM models.

---

## 🎨 DESIGNED WITH INTENTION

Credora isn't designed to look like another ordinary dashboard.

Its visual identity brings together:

- Warm cream backgrounds
- Deep navy typography
- Orange, lavender, blue and lime accents
- Space Grotesk and DM Sans typography
- Structured cards and clean layouts
- Subtle cosmic-inspired visual details

The goal is simple: make career development feel less overwhelming and more personal.

---

## 📂 PROJECT STRUCTURE

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
│   │   │
│   │   ├── models.py
│   │   ├── database.py
│   │   ├── security.py
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── ResumeUpload.tsx
│   │   └── JobMatching.tsx
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 RUN CREDORA LOCALLY

Want to explore Credora on your own machine?

### Prerequisites

- Python
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/oishipaul45-engineer/Credora.git
```

```bash
cd Credora
```

### 2. Set up the backend

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Configure the necessary environment variables for your database and Supabase integration if using cloud services.

Start the backend:

```bash
python -m uvicorn app.main:app --reload
```

Backend:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure the API URL if required:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

---

## 🌱 WHAT'S NEXT?

Credora is an evolving platform. Future development possibilities include:

- More personalised career recommendations
- Expanded job-role and skill databases
- Deeper resume insights
- More advanced career progression tracking
- Improved skill-gap analysis
- Additional learning and career resources

---

## 💭 OUR PHILOSOPHY

<div align="center">

### Your career isn't a straight line.

### It's a landscape of possibilities.

<br/>

**Not just another resume.**

# A SPACE TO BUILD WHAT COMES NEXT.

<br/>

<a href="https://credora-connect.vercel.app/">
  <img src="https://img.shields.io/badge/EXPLORE_CREDORA-FF7139?style=for-the-badge&labelColor=20202B" alt="Explore Credora"/>
</a>

<br/><br/>

[GitHub Repository](https://github.com/oishipaul45-engineer/Credora)

**Made with curiosity, creativity and code.**

✦ CREDORA

</div>
