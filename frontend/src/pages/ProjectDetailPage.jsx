import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RippleButton from "../components/RippleButton";
import { projects } from "../data/projects";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const project = useMemo(() => projects.find((item) => item.id === id), [id]);
  const hasVideo = project?.video && project.video !== "#";
  const isMp4Video = hasVideo && project.video.toLowerCase().endsWith(".mp4");
  const isYouTubeEmbed = hasVideo && project.video.includes("youtube.com/embed/");

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
          {hasVideo ? (
            <RippleButton
              onClick={() => setShowVideo((prev) => !prev)}
              className="w-full border-mint/40 text-mint sm:w-auto"
            >
              {showVideo ? "Close Video" : "Video"}
            </RippleButton>
          ) : null}
        </div>
        {showVideo && isMp4Video ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/70 p-2">
            <video src={project.video} controls className="h-auto w-full rounded-xl" preload="metadata" />
          </div>
        ) : null}
        {showVideo && isYouTubeEmbed ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-cyan-300/25 bg-slate-950/70 p-2">
            <iframe
              src={project.video}
              title={`${project.title} video`}
              className="h-[220px] w-full rounded-xl sm:h-[360px]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : null}
        {showVideo && !isMp4Video && !isYouTubeEmbed && hasVideo ? (
          <div className="mt-8">
            <a
              href={project.video}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-200 underline underline-offset-4"
            >
              Open Video Link
            </a>
          </div>
        ) : null}
        <div className="mt-8">
          <RippleButton onClick={() => navigate("/projects")} className="w-full sm:w-auto">
            All Projects
          </RippleButton>
        </div>
      </motion.div>
    </div>
  );
}
