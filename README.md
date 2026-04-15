# E-Learning Platform

A Django-based e-learning platform with courses, lessons, enrollments, and progress tracking. Includes a REST API with JWT auth and a simple web UI.

## Features
- Role-based users: student, instructor, admin
- Course creation and management
- Ordered lessons with video/text/PDF support
- Enrollment tracking
- Lesson completion and progress percentage
- Student and instructor dashboards
- JWT authentication for API access

## Tech Stack
- Backend: Django 5, Django REST Framework
- Auth: SimpleJWT + Django sessions
- Database: SQLite (dev), PostgreSQL-ready
- Frontend: Django templates + custom CSS
- Frontend (new): React + Vite, modern glassmorphism UI, animated cards, and gradient buttons

## Requirements
- Python 3.12+

## Setup
1. Create and activate a virtual environment.
2. Install dependencies:
   - `D:/PROJECTS/E-Learning/.venv/Scripts/python.exe -m pip install -r requirements.txt`
3. Apply migrations:
   - `D:/PROJECTS/E-Learning/.venv/Scripts/python.exe manage.py migrate`
4. (Optional) Seed sample data:
   - `D:/PROJECTS/E-Learning/.venv/Scripts/python.exe manage.py seed_data`
5. Run the server:
   - `D:/PROJECTS/E-Learning/.venv/Scripts/python.exe manage.py runserver`

## React Frontend
The new React frontend lives in the `frontend/` folder.

1. Install Node dependencies:
   - `cd frontend`
   - `npm install`
2. Start the frontend:
   - `npm run dev`
3. If your Django API is running on a different host or port, set:
   - `VITE_API_BASE_URL=http://127.0.0.1:8000/api`

The Vite dev server proxies `/api` to Django by default.

## Deploy on Vercel
This project is configured for Vercel with a Python serverless entrypoint at `api/index.py`.

1. Import this repository in Vercel.
2. In Vercel Project Settings, set these environment variables:
   - `SECRET_KEY` (required)
   - `DEBUG=False`
   - `ALLOWED_HOSTS=.vercel.app`
   - `CSRF_TRUSTED_ORIGINS=https://*.vercel.app`
   - `DATABASE_URL` (recommended for production, e.g., Neon/Supabase/Postgres)
3. Run database migrations against your production database:
   - `python manage.py migrate`
4. Redeploy.

Notes:
- If `DATABASE_URL` is not provided, SQLite is used (good for local development, not recommended for production on serverless).
- Static files are served with WhiteNoise and Vercel static routing.

## API Endpoints
- `POST /api/register/`
- `POST /api/token/`
- `POST /api/token/refresh/`
- `GET /api/courses/`
- `GET /api/lessons/?course=<course_id>`
- `POST /api/enrollments/`
- `GET /api/progress/`
- `POST /api/progress/update/`

## Sample Accounts
- Admin: `admin` / `AdminPass123`
- Instructor: `instructor` / `InstructorPass123`
- Student: `student` / `StudentPass123`
- Student: `student2` / `StudentPass123`

## Web Pages
- `/` Home
- `/courses/` Course list
- `/courses/<id>/` Course detail
- `/lessons/<id>/` Lesson detail
- `/dashboard/student/` Student dashboard
- `/dashboard/instructor/` Instructor dashboard

## Project Structure
```
frontend/
   index.html
   package.json
   vite.config.js
   src/
elearning/
   settings.py
   urls.py
   views.py
courses/
   models.py
   views.py
   serializers.py
   permissions.py
   management/commands/seed_data.py
lessons/
   models.py
   views.py
   serializers.py
enrollments/
   models.py
   views.py
   serializers.py
progress/
   models.py
   views.py
   serializers.py
users/
   models.py
   views.py
   serializers.py
templates/
   base.html
   home.html
   courses/
   lessons/
   dashboards/
   registration/login.html
static/
   css/styles.css
```

The Django templates remain available as a server-rendered fallback and admin-facing view layer, while the React app in `frontend/` is the primary modern UI.
