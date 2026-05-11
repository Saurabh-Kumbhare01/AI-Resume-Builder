import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, FileText, Gauge, WandSparkles } from "lucide-react";

const metrics = [
  { label: "ATS score", value: "92" },
  { label: "Keywords", value: "+18" },
  { label: "Templates", value: "3" }
];

export default function Landing({ onStart }) {
  return (
    <section className="hero" id="top">
      <div className="hero-scene" aria-hidden="true">
        <div className="scene-grid" />
        <motion.div
          className="floating-resume resume-one"
          animate={{ y: [0, -14, 0], rotate: [-2, 1, -2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span />
          <span />
          <span />
          <span />
        </motion.div>
        <motion.div
          className="floating-resume resume-two"
          animate={{ y: [0, 16, 0], rotate: [3, -1, 3] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <span />
          <span />
          <span />
        </motion.div>
      </div>

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow">
            <WandSparkles size={16} />
            AI-powered resume studio
          </span>
          <h1>Build an ATS-ready resume with live AI guidance.</h1>
          <p>
            Create polished resumes, tune keywords for a target role, reorder sections, and export a recruiter-ready PDF from a single responsive workspace.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={onStart}>
              Start building
              <ArrowRight size={18} />
            </button>
            <a className="secondary-button" href="#templates">
              View templates
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-panel"
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <div className="panel-header">
            <FileText size={18} />
            <span>Live resume intelligence</span>
          </div>
          <div className="score-ring">
            <Gauge size={30} />
            <strong>92</strong>
            <span>ATS Score</span>
          </div>
          <ul className="hero-checks">
            <li>
              <CheckCircle2 size={16} />
              Strong role keywords
            </li>
            <li>
              <CheckCircle2 size={16} />
              Quantified impact statements
            </li>
            <li>
              <CheckCircle2 size={16} />
              Clean PDF structure
            </li>
          </ul>
          <div className="metric-row">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
