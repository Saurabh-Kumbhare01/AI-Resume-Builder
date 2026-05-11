from __future__ import annotations

import json
import re
import secrets
from datetime import datetime, timezone
from functools import wraps
from io import BytesIO
from pathlib import Path
from typing import Any, Callable

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from werkzeug.security import check_password_hash, generate_password_hash

DATA_DIR = Path(__file__).parent / "data"
USERS_FILE = DATA_DIR / "users.json"
RESUMES_FILE = DATA_DIR / "resumes.json"
SESSIONS: dict[str, str] = {}


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    DATA_DIR.mkdir(exist_ok=True)

    @app.get("/api/health")
    def health() -> tuple[dict[str, str], int]:
        return {"status": "ok", "service": "AI Resume Builder API"}, 200

    @app.post("/api/auth/register")
    def register() -> tuple[Any, int]:
        payload = request.get_json(force=True)
        email = clean_email(payload.get("email", ""))
        password = payload.get("password", "")
        name = payload.get("name", "").strip() or email.split("@")[0]

        if not email or len(password) < 6:
            return jsonify({"error": "Valid email and 6+ character password required"}), 400

        users = read_json(USERS_FILE, {})
        if email in users:
            return jsonify({"error": "Account already exists"}), 409

        users[email] = {
            "name": name,
            "email": email,
            "password_hash": generate_password_hash(password),
            "created_at": now_iso()
        }
        write_json(USERS_FILE, users)
        return issue_session(users[email])

    @app.post("/api/auth/login")
    def login() -> tuple[Any, int]:
        payload = request.get_json(force=True)
        email = clean_email(payload.get("email", ""))
        password = payload.get("password", "")
        users = read_json(USERS_FILE, {})
        user = users.get(email)

        if not user or not check_password_hash(user["password_hash"], password):
            return jsonify({"error": "Invalid credentials"}), 401

        return issue_session(user)

    @app.get("/api/resumes")
    @require_auth
    def get_resume(user_email: str) -> tuple[Any, int]:
        resumes = read_json(RESUMES_FILE, {})
        return jsonify(resumes.get(user_email, {})), 200

    @app.post("/api/resumes")
    @require_auth
    def save_resume(user_email: str) -> tuple[Any, int]:
        payload = request.get_json(force=True)
        resumes = read_json(RESUMES_FILE, {})
        resumes[user_email] = {
            **payload,
            "updated_at": now_iso()
        }
        write_json(RESUMES_FILE, resumes)
        return jsonify({"saved": True, "updated_at": resumes[user_email]["updated_at"]}), 200

    @app.post("/api/pdf")
    def create_pdf() -> Any:
        payload = request.get_json(force=True)
        resume = payload.get("resume", {})
        section_order = payload.get("sectionOrder", [])
        pdf_buffer = render_pdf(resume, section_order)
        filename = slugify(resume.get("personal", {}).get("fullName", "resume")) + ".pdf"
        return send_file(
            pdf_buffer,
            mimetype="application/pdf",
            as_attachment=True,
            download_name=filename
        )

    @app.post("/api/ai/summary")
    def ai_summary() -> tuple[Any, int]:
        resume = request.get_json(force=True).get("resume", {})
        personal = resume.get("personal", {})
        role = personal.get("roleTarget") or personal.get("headline") or "target role"
        skills = ", ".join(resume.get("skills", [])[:5])
        summary = (
            f"Results-driven {role} with proven experience across {skills}. "
            "Skilled at translating business goals into polished, measurable work, "
            "partnering with cross-functional teams, and communicating impact through clear execution."
        )
        return jsonify({"summary": summary}), 200

    @app.post("/api/ai/skills")
    def ai_skills() -> tuple[Any, int]:
        role = request.get_json(force=True).get("role", "")
        return jsonify({"skills": suggest_skills(role)}), 200

    @app.post("/api/ai/project")
    def ai_project() -> tuple[Any, int]:
        payload = request.get_json(force=True)
        project = payload.get("project", {})
        role = payload.get("role") or "target role"
        name = project.get("name") or "the project"
        description = (
            f"Designed and delivered {name} for a {role} audience, owning planning, implementation, "
            "and iteration. Improved usability with reusable workflows, measurable performance gains, "
            "and documentation that made the solution easier to maintain."
        )
        return jsonify({"description": description}), 200

    @app.post("/api/ai/ats")
    def ai_ats() -> tuple[Any, int]:
        resume = request.get_json(force=True).get("resume", {})
        return jsonify(score_resume(resume)), 200

    @app.post("/api/ai/keywords")
    def ai_keywords() -> tuple[Any, int]:
        role = request.get_json(force=True).get("role", "")
        keywords = [
            {"keyword": keyword, "reason": f"Frequently requested in {role or 'target role'} postings."}
            for keyword in suggest_skills(role)
        ]
        return jsonify({"keywords": keywords}), 200

    @app.post("/api/ai/grammar")
    def ai_grammar() -> tuple[Any, int]:
        text = request.get_json(force=True).get("text", "")
        cleaned = re.sub(r"\s+", " ", text).strip()
        cleaned = re.sub(r"\bi\b", "I", cleaned)
        if cleaned:
            cleaned = cleaned[0].upper() + cleaned[1:]
        return jsonify({"text": cleaned}), 200

    return app


def require_auth(route: Callable[..., Any]) -> Callable[..., Any]:
    @wraps(route)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        header = request.headers.get("Authorization", "")
        token = header.removeprefix("Bearer ").strip()
        user_email = SESSIONS.get(token)
        if not user_email:
            return jsonify({"error": "Authentication required"}), 401
        return route(user_email, *args, **kwargs)

    return wrapper


def issue_session(user: dict[str, Any]) -> tuple[Any, int]:
    token = secrets.token_urlsafe(32)
    SESSIONS[token] = user["email"]
    return jsonify({
        "token": token,
        "user": {"name": user["name"], "email": user["email"]}
    }), 200


def read_json(path: Path, fallback: Any) -> Any:
    if not path.exists():
        return fallback
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def write_json(path: Path, payload: Any) -> None:
    with path.open("w", encoding="utf-8") as file:
        json.dump(payload, file, indent=2)


def clean_email(email: str) -> str:
    return email.strip().lower()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "resume"


def suggest_skills(role: str) -> list[str]:
    normalized = role.lower()
    if "backend" in normalized or "python" in normalized:
        return ["Python", "FastAPI", "Flask", "PostgreSQL", "Docker", "API Security", "Caching"]
    if "data" in normalized or "analyst" in normalized:
        return ["Python", "SQL", "Pandas", "Power BI", "Experimentation", "Data Modeling", "Forecasting"]
    if "product" in normalized:
        return ["Roadmapping", "User Research", "Prioritization", "Analytics", "Go-to-Market", "Stakeholder Management"]
    if "marketing" in normalized or "growth" in normalized:
        return ["SEO", "Lifecycle Marketing", "Campaign Strategy", "A/B Testing", "Analytics", "Content Strategy"]
    return ["React", "TypeScript", "JavaScript", "Accessibility", "Performance", "Design Systems", "REST APIs"]


def score_resume(resume: dict[str, Any]) -> dict[str, Any]:
    text = json.dumps(resume).lower()
    checks = [
        ("Add complete contact details.", bool(resume.get("personal", {}).get("email") and resume.get("personal", {}).get("phone"))),
        ("Add a specific target role.", bool(resume.get("personal", {}).get("roleTarget"))),
        ("Include measurable impact with numbers.", bool(re.search(r"\d+%|\d+k|\d+\+", text))),
        ("Include at least six relevant skills.", len(resume.get("skills", [])) >= 6),
        ("Write detailed project outcomes.", any(len(item.get("description", "")) > 80 for item in resume.get("projects", []))),
        ("Strengthen recent experience descriptions.", any(len(item.get("description", "")) > 100 for item in resume.get("experience", []))),
    ]
    passed = sum(1 for _, ok in checks if ok)
    return {
        "score": round((passed / len(checks)) * 100),
        "suggestions": [message for message, ok in checks if not ok]
    }


def render_pdf(resume: dict[str, Any], section_order: list[str]) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=16 * mm,
        leftMargin=16 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
    )
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="ResumeTitle", fontSize=22, leading=26, textColor=colors.HexColor("#122025")))
    styles.add(ParagraphStyle(name="ResumeSubtitle", fontSize=10, leading=14, textColor=colors.HexColor("#526b72")))
    styles.add(ParagraphStyle(name="SectionTitle", fontSize=11, leading=14, textColor=colors.HexColor("#0f5f66"), spaceBefore=12))
    styles.add(ParagraphStyle(name="Body", fontSize=9.6, leading=13, textColor=colors.HexColor("#2f444a")))

    personal = resume.get("personal", {})
    story: list[Any] = [
        Paragraph(personal.get("fullName", "Resume"), styles["ResumeTitle"]),
        Paragraph(personal.get("headline", ""), styles["ResumeSubtitle"]),
        Paragraph(
            " | ".join(filter(None, [personal.get("email"), personal.get("phone"), personal.get("location"), personal.get("linkedin")])),
            styles["ResumeSubtitle"],
        ),
        Spacer(1, 6)
    ]

    renderers = {
        "about": lambda: [Paragraph(resume.get("about", ""), styles["Body"])],
        "skills": lambda: [Paragraph(", ".join(resume.get("skills", [])), styles["Body"])],
        "education": lambda: render_entries(resume.get("education", []), styles, ["degree", "school", "location", "details"]),
        "experience": lambda: render_entries(resume.get("experience", []), styles, ["title", "company", "location", "description"]),
        "projects": lambda: render_entries(resume.get("projects", []), styles, ["name", "role", "link", "description"]),
        "certifications": lambda: render_entries(resume.get("certifications", []), styles, ["name", "issuer", "year"]),
        "achievements": lambda: [Paragraph(f"• {item}", styles["Body"]) for item in resume.get("achievements", [])],
        "links": lambda: render_entries(resume.get("links", []), styles, ["label", "url"]),
    }

    labels = {
        "about": "About Me",
        "skills": "Skills",
        "education": "Education",
        "experience": "Experience",
        "projects": "Projects",
        "certifications": "Certifications",
        "achievements": "Achievements",
        "links": "Contact Links",
    }

    for section in section_order or labels.keys():
        content = renderers.get(section, lambda: [])()
        if not content:
            continue
        story.append(Paragraph(labels.get(section, section.title()), styles["SectionTitle"]))
        story.extend(content)

    doc.build(story)
    buffer.seek(0)
    return buffer


def render_entries(entries: list[dict[str, Any]], styles: Any, fields: list[str]) -> list[Any]:
    output: list[Any] = []
    for entry in entries:
        parts = [str(entry.get(field, "")).strip() for field in fields]
        text = " - ".join(part for part in parts if part)
        if text:
            output.append(Paragraph(text, styles["Body"]))
            output.append(Spacer(1, 4))
    return output


app = create_app()


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
