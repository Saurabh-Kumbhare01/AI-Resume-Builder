import { useState } from "react";
import { Bot, CheckCircle2, Gauge, Lightbulb, WandSparkles } from "lucide-react";
import { apiRequest } from "../api/client";
import {
  analyzeAtsFallback,
  generateProjectFallback,
  generateSummaryFallback,
  improveGrammarFallback,
  optimizeKeywordsFallback,
  suggestSkillsFallback
} from "../utils/aiFallbacks";

export default function AIAssistant({ resume, setResume, showToast }) {
  const [ats, setAts] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState("");

  const role = resume.personal.roleTarget || resume.personal.headline;

  const runAction = async (name, action) => {
    setLoading(name);
    try {
      await action();
      showToast("AI suggestion applied");
    } finally {
      setLoading("");
    }
  };

  const useSummary = () =>
    runAction("summary", async () => {
      let summary;
      try {
        summary = (await apiRequest("/ai/summary", { method: "POST", body: { resume } })).summary;
      } catch {
        summary = generateSummaryFallback(resume);
      }
      setResume((current) => ({ ...current, about: summary }));
    });

  const useSkills = () =>
    runAction("skills", async () => {
      let skills;
      try {
        skills = (await apiRequest("/ai/skills", { method: "POST", body: { role } })).skills;
      } catch {
        skills = suggestSkillsFallback(role);
      }
      setResume((current) => ({
        ...current,
        skills: Array.from(new Set([...current.skills, ...skills]))
      }));
    });

  const useProject = () =>
    runAction("project", async () => {
      const project = resume.projects[0] || {};
      let description;
      try {
        description = (await apiRequest("/ai/project", { method: "POST", body: { project, role } })).description;
      } catch {
        description = generateProjectFallback(project, role);
      }
      setResume((current) => ({
        ...current,
        projects: current.projects.length
          ? current.projects.map((item, index) => (index === 0 ? { ...item, description } : item))
          : [{ name: "Featured Project", role, start: "", end: "", link: "", description }]
      }));
    });

  const checkAts = () =>
    runAction("ats", async () => {
      try {
        setAts(await apiRequest("/ai/ats", { method: "POST", body: { resume } }));
      } catch {
        setAts(analyzeAtsFallback(resume));
      }
    });

  const getKeywords = () =>
    runAction("keywords", async () => {
      try {
        setKeywords((await apiRequest("/ai/keywords", { method: "POST", body: { role, resume } })).keywords);
      } catch {
        setKeywords(optimizeKeywordsFallback(role));
      }
    });

  const improveGrammar = () =>
    runAction("grammar", async () => {
      let improved;
      try {
        improved = (await apiRequest("/ai/grammar", { method: "POST", body: { text: resume.about } })).text;
      } catch {
        improved = improveGrammarFallback(resume.about);
      }
      setResume((current) => ({ ...current, about: improved }));
    });

  return (
    <section className="control-section ai-tools" id="ai-tools">
      <div className="control-heading">
        <Bot size={18} />
        <h3>AI Tools</h3>
      </div>
      <div className="ai-button-grid">
        <button type="button" onClick={useSummary} disabled={loading === "summary"}>
          <WandSparkles size={16} />
          Summary
        </button>
        <button type="button" onClick={useSkills} disabled={loading === "skills"}>
          <Lightbulb size={16} />
          Skills
        </button>
        <button type="button" onClick={useProject} disabled={loading === "project"}>
          <CheckCircle2 size={16} />
          Project
        </button>
        <button type="button" onClick={checkAts} disabled={loading === "ats"}>
          <Gauge size={16} />
          ATS
        </button>
        <button type="button" onClick={getKeywords} disabled={loading === "keywords"}>
          <Lightbulb size={16} />
          Keywords
        </button>
        <button type="button" onClick={improveGrammar} disabled={loading === "grammar"}>
          <WandSparkles size={16} />
          Grammar
        </button>
      </div>

      {ats && (
        <div className="ats-box">
          <strong>{ats.score}/100</strong>
          <span>ATS score</span>
          {ats.suggestions?.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      )}

      {keywords.length > 0 && (
        <div className="keyword-cloud">
          {keywords.map((item) => (
            <span key={item.keyword || item}>{item.keyword || item}</span>
          ))}
        </div>
      )}
    </section>
  );
}
