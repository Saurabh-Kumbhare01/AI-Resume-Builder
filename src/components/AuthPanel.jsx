import { useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "../api/client";

export default function AuthPanel({ onClose, onAuthed }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = await apiRequest(`/auth/${mode}`, {
        method: "POST",
        body: form
      });
      onAuthed(payload);
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="auth-panel glass-panel" onSubmit={submit}>
        <button className="icon-button close-button" type="button" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <span className="eyebrow">{mode === "login" ? "Welcome back" : "Create account"}</span>
        <h2>{mode === "login" ? "Login" : "Register"}</h2>

        {mode === "register" && (
          <label>
            <span>Name</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
        )}
        <label>
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
            minLength={6}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" type="submit">
          {mode === "login" ? "Login" : "Register"}
        </button>
        <button className="link-button" type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Create an account" : "Use existing account"}
        </button>
      </form>
    </div>
  );
}
