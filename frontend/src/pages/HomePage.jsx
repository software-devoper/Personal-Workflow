import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaWhatsapp, FaInstagram, FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import NeuralSphere from "../components/NeuralSphere";
import ProjectCard from "../components/ProjectCard";
import RippleButton from "../components/RippleButton";
import { projects } from "../data/projects";
import { trackEvent } from "../services/analytics";

const skillGroups = [
  {
    title: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "React", "Tailwind", "Three.js"]
  },
  {
    title: "Backend",
    items: ["Node.js", "Python", "Express", "Flask", "REST APIs", "Socket.IO"]
  },
  {  
    title: "Database",
    items: ["Supabase","Firebase"]
  },
  {
    title: "Tools",
    items: ["Git", "GitHub", "VS Code", "Replit", "Lovable", "Render", "Gemini API"]
  }
];

const socials = [
  { name: "WhatsApp", href: "https://wa.me/918972594871", icon: FaWhatsapp },
  { name: "Instagram", href: "https://www.instagram.com/code774?igsh=ZTliczAwZzk2NWww", icon: FaInstagram },
  { name: "GitHub", href: "https://github.com/software-devoper", icon: FaGithub },
  { name: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin }
];

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState({ type: "", text: "" });
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [location.state]);

  useEffect(() => {
    if (contactStatus.type !== "success") return undefined;

    const timeoutId = setTimeout(() => {
      setContactStatus({ type: "", text: "" });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [contactStatus.type]);

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    if (contactLoading) return;

    const payload = {
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      message: contactForm.message.trim()
    };

    if (!payload.name || !payload.email || !payload.message) {
      setContactStatus({ type: "error", text: "Please fill all fields." });
      return;
    }

    setContactLoading(true);
    setContactStatus({ type: "", text: "" });

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || data?.details || "Failed to submit message");
      }

      setContactForm({ name: "", email: "", message: "" });
      setContactStatus({ type: "success", text: "Message sent successfully." });
      trackEvent("contact_submit", { page_path: "/" });
    } catch (error) {
      setContactStatus({ type: "error", text: error.message });
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
      <section id="home" className="grid min-h-[90vh] items-center gap-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-base text-cyan-200 sm:text-lg">Hello, It&apos;s Me</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-6xl">Subhadip Mondal</h1>
          <h2 className="mt-2 text-xl text-mint sm:text-2xl">And I&apos;m an AI Explorer</h2>

          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
            {socials.map((social, idx) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12 }}
                className="interactive rounded-full border border-cyan-300/35 bg-cyan-300/10 p-3 text-cyan-100"
              >
                <social.icon className="text-xl" />
              </motion.a>
            ))}
          </div>

          <div className="mt-6 sm:mt-8">
            <a
              href="/Subhadip-Mondal-cv%20(1).pdf"
              download="Subhadip-Mondal-Resume.pdf"
              className="inline-block w-full rounded-xl border border-cyan-300/35 bg-cyan-400/10 px-6 py-3 text-center font-medium text-cyan-200 transition hover:-translate-y-1 hover:bg-cyan-300/15 hover:shadow-neon sm:w-auto"
            >
              Download Resume
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative flex w-full justify-end lg:pr-2"
        >
          <div className="w-full max-w-[680px]">
            <NeuralSphere />
          </div>
        </motion.div>
      </section>

      <section id="about" className="mt-16 sm:mt-20">
        <motion.h3
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-cyan-200 sm:text-4xl"
        >
          About Me
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-5 max-w-4xl leading-7 text-slate-200 sm:leading-8"
        >
          I am Subhadip Mondal, an AI Explorer focused on building practical, real-time solutions that merge
          intelligent systems with scalable full-stack engineering. I enjoy turning ideas into production-level
          products, from interactive frontend experiences to robust backend services and data-driven AI integrations.
          My work centers on clean architecture, reliable APIs, and modern technologies that deliver measurable user
          value.
        </motion.p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {skillGroups.map((group, index) => (
            <motion.article
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="interactive glass rounded-2xl p-5"
            >
              <h4 className="text-xl font-bold text-cyan-200">{group.title}</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded-full border border-cyan-300/35 px-3 py-1 text-sm text-slate-200">
                    {item}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="projects" className="mt-16 sm:mt-20">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-3xl font-bold text-cyan-200 sm:text-4xl">Projects</h3>
          <RippleButton onClick={() => navigate("/projects")} className="w-full sm:w-auto">
            All Projects
          </RippleButton>
        </div>
        <div className="mt-8 grid gap-6">
          {projects.slice(0, 3).map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </section>

      <section id="contact" className="mt-16 sm:mt-20">
        <h3 className="text-3xl font-bold text-cyan-200 sm:text-4xl">Contact Me</h3>

        <div className="mt-6 flex flex-col gap-3 text-slate-200">
          <p className="flex items-center gap-2 break-all">
            <FaEnvelope className="text-cyan-200" />
            Subhadipmondal0101@gmail.com
          </p>
          <p className="flex items-center gap-2">
            <FaPhone className="text-cyan-200" />
            +918972594871
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="interactive rounded-full border border-cyan-300/35 bg-cyan-300/10 p-3 text-cyan-100"
            >
              <social.icon className="text-xl" />
            </a>
          ))}
        </div>

        <motion.form
          onSubmit={handleContactSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass mt-8 grid gap-4 rounded-2xl p-4 sm:p-6"
        >
          <input
            name="name"
            value={contactForm.name}
            onChange={handleContactChange}
            placeholder="Your Name"
            className="input-glow rounded-xl border border-slate-700 bg-slate-900/60 p-3"
          />
          <input
            name="email"
            type="email"
            value={contactForm.email}
            onChange={handleContactChange}
            placeholder="Your Email"
            className="input-glow rounded-xl border border-slate-700 bg-slate-900/60 p-3"
          />
          <textarea
            name="message"
            value={contactForm.message}
            onChange={handleContactChange}
            placeholder="Your Message"
            rows={5}
            className="input-glow rounded-xl border border-slate-700 bg-slate-900/60 p-3"
          />
          {contactStatus.text ? (
            <p className={contactStatus.type === "error" ? "text-sm text-red-300" : "text-sm text-emerald-300"}>
              {contactStatus.text}
            </p>
          ) : null}
          <div>
            <RippleButton type="submit" className="w-full sm:w-auto" disabled={contactLoading}>
              {contactLoading ? "Submitting..." : "Submit"}
            </RippleButton>
          </div>
        </motion.form>
      </section>
    </div>
  );
}
