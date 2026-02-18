import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RippleButton from "./RippleButton";

export default function ProjectCard({ project, index = 0 }) {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="interactive glass rounded-2xl p-6"
    >
      <h3 className="text-2xl font-bold text-cyan-200">{project.title}</h3>
      <p className="mt-3 text-slate-300">{project.shortDescription}</p>
      <p className="mt-4 text-sm text-slate-400">{project.tech.join(" • ")}</p>
      <div className="mt-6">
        <RippleButton onClick={() => navigate(`/projects/${project.id}`)}>View</RippleButton>
      </div>
    </motion.article>
  );
}
