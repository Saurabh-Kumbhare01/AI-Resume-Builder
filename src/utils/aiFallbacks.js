const roleKeywords = {
  frontend: ["React", "TypeScript", "Accessibility", "Performance", "Design Systems", "REST APIs"],
  backend: ["Python", "FastAPI", "PostgreSQL", "Docker", "Caching", "API Security"],
  data: ["Python", "SQL", "Pandas", "Dashboards", "Experimentation", "Data Modeling"],
  marketing: ["SEO", "Campaign Strategy", "Analytics", "Content", "Lifecycle Marketing", "A/B Testing"],
  product: ["Roadmapping", "User Research", "Prioritization", "Metrics", "Go-to-Market", "Stakeholder Management"]
};

export function inferRoleGroup(role = "") {
  const normalized = role.toLowerCase();
  if (normalized.includes("backend") || normalized.includes("python")) return "backend";
  if (normalized.includes("data") || normalized.includes("analyst")) return "data";
  if (normalized.includes("marketing") || normalized.includes("growth")) return "marketing";
  if (normalized.includes("product") || normalized.includes("manager")) return "product";
  return "frontend";
}

export function generateSummaryFallback(resume) {
  const role = resume.personal.roleTarget || resume.personal.headline || "target role";
  const skills = resume.skills.slice(0, 4).join(", ");
  return `Impact-focused ${role} with hands-on experience across ${skills}. Known for turning ambiguous business goals into measurable outcomes, collaborating across functions, and delivering polished work that improves user experience, operational speed, and product quality.`;
}

export function suggestSkillsFallback(role) {
  return roleKeywords[inferRoleGroup(role)] || roleKeywords.frontend;
}

export function generateProjectFallback(project, role) {
  const name = project?.name || "selected project";
  return `Designed and delivered ${name} for a ${role || "target"} audience, owning requirements, implementation, and iteration. Improved workflow clarity through reusable components, measurable performance improvements, and documentation that made the solution easier to maintain.`;
}

export function analyzeAtsFallback(resume) {
  const text = JSON.stringify(resume).toLowerCase();
  const checks = [
    ["Contact details", resume.personal.email && resume.personal.phone],
    ["Role target", resume.personal.roleTarget],
    ["Quantified impact", /\d+%|\d+k|\d+\+/.test(text)],
    ["Skills depth", resume.skills.length >= 6],
    ["Project evidence", resume.projects.some((project) => project.description.length > 80)],
    ["Experience detail", resume.experience.some((job) => job.description.length > 100)]
  ];

  const passed = checks.filter(([, ok]) => ok).length;
  const score = Math.round((passed / checks.length) * 100);

  return {
    score,
    suggestions: checks
      .filter(([, ok]) => !ok)
      .map(([label]) => `Strengthen ${label.toLowerCase()} for better ATS matching.`)
  };
}

export function optimizeKeywordsFallback(role) {
  return suggestSkillsFallback(role).map((skill) => ({
    keyword: skill,
    reason: `Commonly searched in ${role || "this role"} descriptions.`
  }));
}

export function improveGrammarFallback(text) {
  return text
    .replace(/\bi\b/g, "I")
    .replace(/\s+/g, " ")
    .replace(/(^|\. )([a-z])/g, (match) => match.toUpperCase())
    .trim();
}
