import { useState } from "react";
import { FaCode, FaBars, FaXmark } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";

const links = [
  { label: "Home", section: "home" },
  { label: "About Me", section: "about" },
  { label: "Chat with AI", route: "/ai" },
  { label: "Contact Me", section: "contact" }
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
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="interactive rounded-lg border border-cyan-300/30 p-2 text-cyan-100 sm:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FaXmark /> : <FaBars />}
        </button>
      </nav>
      {mobileOpen && (
        <div className="border-t border-slate-700/50 bg-deep/95 px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <button
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
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
