import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

export default function AllProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-28">
      <motion.h1 initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-cyan-200">
        All Projects
      </motion.h1>
      <p className="mt-3 text-slate-300">A complete list of placeholder projects ready for your manual replacement.</p>
      <div className="mt-8 grid gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}
