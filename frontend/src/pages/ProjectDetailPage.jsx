import { motion } from "framer-motion";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RippleButton from "../components/RippleButton";
import { projects } from "../data/projects";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = useMemo(() => projects.find((item) => item.id === id), [id]);

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl px-6 pt-28">
        <p className="text-slate-300">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-12 pt-24 sm:px-6 sm:pb-14 sm:pt-28">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-7">
        <h1 className="text-3xl font-bold text-cyan-200 sm:text-4xl">{project.title}</h1>
        <p className="mt-5 leading-7 text-slate-200 sm:leading-8">{project.description}</p>
        <p className="mt-4 text-sm text-slate-400">{project.tech.join(" • ")}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <RippleButton onClick={() => window.open(project.live, "_blank")} className="w-full sm:w-auto">
            Live
          </RippleButton>
          <RippleButton
            onClick={() => window.open(project.video, "_blank")}
            className="w-full border-mint/40 text-mint sm:w-auto"
          >
            Video
          </RippleButton>
        </div>
        <div className="mt-8">
          <RippleButton onClick={() => navigate("/projects")} className="w-full sm:w-auto">
            All Projects
          </RippleButton>
        </div>
      </motion.div>
    </div>
  );
}
