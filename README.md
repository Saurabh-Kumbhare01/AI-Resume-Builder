# AI Resume Builder

A modern resume builder with a React/Vite frontend and a beginner-friendly Flask backend. It includes live resume preview, ATS-friendly templates, drag-and-drop section ordering, profile image upload, localStorage persistence, PDF export, authentication, resume storage, and AI helper endpoints.

## Features

- Responsive glassmorphism UI with Tailwind tooling, custom CSS, dark/light mode, theme colors, and font selection
- Resume form for personal info, about, education, skills, projects, experience, certifications, achievements, and links
- Live resume preview with Executive, Minimal, and Compact templates
- Drag-and-drop section arrangement
- Browser PDF export with `html2canvas` and `jspdf`
- Flask PDF generation endpoint with `reportlab`
- Basic register/login flow with password hashing
- Local JSON resume storage for a simple backend learning path
- AI helper APIs for summaries, skill suggestions, project descriptions, ATS score, keywords, and grammar cleanup

## Frontend Setup

```bash
npm install
npm run dev
```

The Vite app runs on `http://127.0.0.1:5173`.

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The Flask API runs on `http://127.0.0.1:5000`. Vite proxies `/api` requests to Flask during development.

## Project Structure

```text
.
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── data/
├── src/
│   ├── api/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── vite.config.js
```

## Deployment Notes

- Deploy the React frontend to Vercel or Netlify with `npm run build`.
- Deploy the Flask backend separately to Render, Railway, Fly.io, or another Python host.
- For production, replace JSON file storage with MongoDB, PostgreSQL, Firebase, or another managed database.
- Add a real AI provider by replacing the heuristic logic in `backend/app.py` with your model API calls.
