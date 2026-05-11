import { Moon, Sparkles, Sun, UserRound } from "lucide-react";

export default function Header({ mode, onModeChange, onAuth, user }) {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="AI Resume Builder home">
        <span className="brand-mark">
          <Sparkles size={18} />
        </span>
        <span>ResumeAI</span>
      </a>

      <nav className="top-nav" aria-label="Primary navigation">
        <a href="#templates">Templates</a>
        <a href="#builder">Builder</a>
        <a href="#ai-tools">AI Tools</a>
      </nav>

      <div className="top-actions">
        <button className="icon-button" type="button" onClick={onModeChange} aria-label="Toggle color mode">
          {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="auth-button" type="button" onClick={onAuth}>
          <UserRound size={17} />
          <span>{user ? user.name : "Login"}</span>
        </button>
      </div>
    </header>
  );
}
