export const sectionLabels = {
  about: "About Me",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  education: "Education",
  certifications: "Certifications",
  achievements: "Achievements",
  links: "Contact Links"
};

export const defaultSectionOrder = [
  "about",
  "experience",
  "projects",
  "skills",
  "education",
  "certifications",
  "achievements",
  "links"
];

export const templateOptions = [
  {
    id: "executive",
    name: "Executive",
    description: "Clean two-column ATS-friendly profile"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Classic single-column recruiter format"
  },
  {
    id: "compact",
    name: "Compact",
    description: "Dense layout for experienced candidates"
  }
];

export const fontOptions = [
  { label: "Inter", value: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { label: "Source Sans", value: "'Source Sans 3', ui-sans-serif, sans-serif" },
  { label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "'IBM Plex Mono', 'SFMono-Regular', monospace" }
];

export const themeOptions = [
  { name: "Aurora", accent: "#24c6dc", secondary: "#f4b860" },
  { name: "Circuit", accent: "#51d88a", secondary: "#4f7cff" },
  { name: "Ember", accent: "#ff7a59", secondary: "#ffd166" },
  { name: "Violet", accent: "#8b5cf6", secondary: "#22d3ee" }
];

export const defaultResume = {
  personal: {
    fullName: "Aarav Sharma",
    headline: "Frontend Engineer | React | Product UI",
    roleTarget: "Senior Frontend Developer",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    website: "aarav.dev",
    linkedin: "linkedin.com/in/aarav-sharma",
    github: "github.com/aarav-sharma",
    profileImage: ""
  },
  about:
    "Product-minded frontend engineer with 5+ years of experience building responsive SaaS dashboards, design systems, and high-performance React applications. Strong collaborator with a track record of improving conversion, accessibility, and developer velocity.",
  skills: [
    "React",
    "JavaScript",
    "TypeScript",
    "REST APIs",
    "Accessibility",
    "Performance",
    "Tailwind CSS",
    "Testing Library"
  ],
  education: [
    {
      school: "National Institute of Technology",
      degree: "B.Tech in Computer Science",
      location: "Surathkal",
      start: "2015",
      end: "2019",
      details: "Graduated with distinction. Coursework in data structures, algorithms, and human-computer interaction."
    }
  ],
  projects: [
    {
      name: "AI Resume Studio",
      role: "Lead Developer",
      start: "2024",
      end: "2025",
      link: "github.com/aarav/resume-studio",
      description:
        "Built a resume optimization workspace with live preview, keyword scoring, and PDF export, reducing candidate editing time by 42%."
    }
  ],
  experience: [
    {
      company: "NovaCloud",
      title: "Frontend Engineer",
      location: "Remote",
      start: "2021",
      end: "Present",
      description:
        "Led React dashboard development for analytics products used by 18K+ monthly users. Improved Core Web Vitals by 31%, introduced reusable UI primitives, and partnered with design to ship accessible workflows."
    },
    {
      company: "BrightApps",
      title: "Software Engineer",
      location: "Pune",
      start: "2019",
      end: "2021",
      description:
        "Delivered customer-facing features across a fintech web app, integrated REST APIs, and wrote regression tests that reduced release defects by 23%."
    }
  ],
  certifications: [
    {
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      year: "2023"
    }
  ],
  achievements: [
    "Speaker at React India community meetup on building accessible dashboards.",
    "Received company impact award for improving onboarding activation by 18%."
  ],
  links: [
    { label: "Portfolio", url: "https://aarav.dev" },
    { label: "LinkedIn", url: "https://linkedin.com/in/aarav-sharma" }
  ]
};
