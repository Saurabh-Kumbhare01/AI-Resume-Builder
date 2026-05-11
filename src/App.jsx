import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  defaultResume,
  defaultSectionOrder,
  fontOptions,
  themeOptions
} from "./data/defaultResume";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { apiRequest } from "./api/client";
import { downloadResumePdf } from "./utils/pdf";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import AuthPanel from "./components/AuthPanel";

export default function App() {
  const [resume, setResume] = useLocalStorage("resumeai-data", defaultResume);
  const [sectionOrder, setSectionOrder] = useLocalStorage("resumeai-section-order", defaultSectionOrder);
  const [template, setTemplate] = useLocalStorage("resumeai-template", "executive");
  const [mode, setMode] = useLocalStorage("resumeai-mode", "dark");
  const [theme, setTheme] = useLocalStorage("resumeai-theme", themeOptions[0]);
  const [font, setFont] = useLocalStorage("resumeai-font", fontOptions[0]);
  const [user, setUser] = useLocalStorage("resumeai-user", null);
  const [authOpen, setAuthOpen] = useState(false);
  const [toast, setToast] = useState("");
  const previewRef = useRef(null);

  const appStyle = useMemo(
    () => ({
      "--accent": theme.accent,
      "--secondary": theme.secondary,
      "--resume-font": font.value
    }),
    [font, theme]
  );

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const handleDownload = async () => {
    try {
      await downloadResumePdf(previewRef.current, resume.personal.fullName || "resume");
      showToast("PDF download started");
    } catch {
      showToast("PDF export needs the browser canvas libraries installed");
    }
  };

  const handleBackendPdf = async () => {
    try {
      const blob = await apiRequest("/pdf", {
        method: "POST",
        body: { resume, sectionOrder, template }
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.personal.fullName || "resume"}-backend.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      showToast("Backend PDF generated");
    } catch {
      showToast("Start the Flask backend to use server PDF");
    }
  };

  const saveToBackend = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    try {
      await apiRequest("/resumes", {
        method: "POST",
        body: { resume, sectionOrder, template, theme, font }
      });
      showToast("Resume saved to Flask backend");
    } catch {
      showToast("Start the Flask backend to save online");
    }
  };

  return (
    <div className="app-shell" data-theme={mode} style={appStyle}>
      <Header
        mode={mode}
        onModeChange={() => setMode(mode === "dark" ? "light" : "dark")}
        onAuth={() => setAuthOpen(true)}
        user={user}
      />

      <main>
        <Landing onStart={() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" })} />
        <Dashboard
          resume={resume}
          setResume={setResume}
          sectionOrder={sectionOrder}
          setSectionOrder={setSectionOrder}
          template={template}
          setTemplate={setTemplate}
          theme={theme}
          setTheme={setTheme}
          font={font}
          setFont={setFont}
          previewRef={previewRef}
          onDownload={handleDownload}
          onBackendPdf={handleBackendPdf}
          onSave={saveToBackend}
          showToast={showToast}
        />
      </main>

      {authOpen && (
        <AuthPanel
          onClose={() => setAuthOpen(false)}
          onAuthed={(payload) => {
            window.localStorage.setItem("resumeai-token", payload.token);
            setUser(payload.user);
            setAuthOpen(false);
            showToast(`Welcome, ${payload.user.name}`);
          }}
        />
      )}

      {toast && (
        <motion.div
          className="toast"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
}
