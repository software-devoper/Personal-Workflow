import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCode, FaBars, FaXmark } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

const links = [
  { label: "Home", section: "home" },
  { label: "About Me", section: "about" },
  { label: "Chat with AI", route: "/ai" },
  { label: "Contact Me", section: "contact" },
  { label: "Admin", route: "/admin" }
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const goToSection = (section) => {
    if (location.pathname === "/") {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/", { state: { scrollTo: section } });
    }
    setMobileOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-600/30 bg-deep/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <button
          type="button"
          onClick={() => goToSection("home")}
          className="interactive flex items-center gap-2 rounded-lg border border-cyan-400/30 px-3 py-2 text-cyan-200"
        >
          <FaCode />
          <span className="text-sm font-bold tracking-wide">Subhadip.dev</span>
        </button>
        <div className="hidden items-center gap-2 sm:flex sm:gap-4">
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => {
                if (link.route) {
                  navigate(link.route);
                } else {
                  goToSection(link.section);
                }
              }}
              className="interactive rounded-lg px-3 py-2 text-sm text-slate-200 hover:text-cyan-200"
            >
              {link.label}
            </button>
          ))}
        </div>
        <motion.button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="interactive rounded-lg border border-cyan-300/30 p-2 text-cyan-100 sm:hidden"
          aria-label="Toggle menu"
          whileTap={{ scale: 0.92 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="block"
            >
              {mobileOpen ? <FaXmark /> : <FaBars />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </nav>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 top-[61px] z-40 bg-slate-950/45 sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative z-50 border-t border-slate-700/50 bg-deep/95 px-4 py-3 sm:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-2">
                {links.map((link, index) => (
                  <motion.button
                    key={link.label}
                    type="button"
                    onClick={() => {
                      if (link.route) {
                        navigate(link.route);
                        setMobileOpen(false);
                      } else {
                        goToSection(link.section);
                      }
                    }}
                    className="rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-cyan-300/10 hover:text-cyan-100"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
