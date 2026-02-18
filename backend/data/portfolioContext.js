export const portfolioContext = {
  name: "Subhadip Mondal",
  title: "AI Explorer",
  summary:
    "Subhadip Mondal is an AI Explorer focused on real-time AI applications and production-level full-stack systems.",
  skills: {
    frontend: ["HTML", "CSS", "JavaScript", "React", "Tailwind", "Three.js"],
    backend: ["Node.js", "Python", "Express", "Flask", "REST APIs", "Socket.IO"],
    database: ["Supabase", "Firebase"],
    tools: ["Git", "GitHub", "VS Code", "Replit", "Lovable", "Render", "Gemini API"]
  },
  projects: [
    {
      id: "neurodesk",
      title: "NeuroDesk Assistant",
      tech: ["React", "Node.js", "Supabase", "Gemini API"]
    },
    {
      id: "visionpulse",
      title: "VisionPulse Monitoring",
      tech: ["React", "Socket.IO", "Express", "PostgreSQL"]
    },
    {
      id: "codestream-ai",
      title: "CodeStream AI Mentor",
      tech: ["Vite", "Tailwind", "Gemini API", "Render"]
    },
    {
      id: "cortex-shop",
      title: "Cortex Commerce",
      tech: ["React", "Flask", "Supabase", "REST APIs"]
    },
    {
      id: "echo-room",
      title: "EchoRoom Collaboration",
      tech: ["Node.js", "Socket.IO", "Tailwind", "Gemini API"]
    }
  ]
};

export function getAllTechFromContext() {
  const flat = [
    ...portfolioContext.skills.frontend,
    ...portfolioContext.skills.backend,
    ...portfolioContext.skills.database,
    ...portfolioContext.skills.tools
  ];
  return [...new Set(flat)];
}
