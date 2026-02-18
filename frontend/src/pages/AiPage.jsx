import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import RippleButton from "../components/RippleButton";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function createSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function AiPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi, I am Subhadip's AI assistant. Ask me about his skills, projects, and experience." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingDots, setTypingDots] = useState(".");
  const listRef = useRef(null);

  const sessionId = useMemo(() => {
    let stored = localStorage.getItem("session_id");
    if (!stored) {
      stored = createSessionId();
      localStorage.setItem("session_id", stored);
    }
    return stored;
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) return undefined;
    const interval = setInterval(() => {
      setTypingDots((prev) => (prev.length < 3 ? `${prev}.` : "."));
    }, 300);
    return () => clearInterval(interval);
  }, [loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: trimmed })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.details || data?.error || "Chat request failed");
      }

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Error: ${error.message}. Please try again.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 pb-6 pt-24 sm:px-6 sm:pb-10 sm:pt-28">
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-cyan-200 sm:text-4xl"
      >
        AI Assistant
      </motion.h1>
      <p className="mt-3 text-slate-300">Chat with the portfolio AI to learn about Subhadip Mondal.</p>

      <div ref={listRef} className="glass mt-6 h-[58vh] space-y-4 overflow-y-auto rounded-2xl p-4 sm:h-[62vh] sm:p-5">
        {messages.map((msg, idx) => (
          <motion.div
            key={`${msg.role}-${idx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[92%] rounded-2xl px-4 py-3 sm:max-w-[85%] ${
              msg.role === "user"
                ? "ml-auto border border-cyan-300/35 bg-cyan-400/20 text-cyan-100"
                : "border border-slate-700 bg-slate-900/70 text-slate-200"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
        {loading && (
          <div className="inline-flex rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-slate-300">
            Typing{typingDots}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Ask about skills, projects, technologies..."
          className="input-glow w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 sm:flex-1"
        />
        <RippleButton onClick={sendMessage} disabled={loading} className="w-full sm:w-auto">
          Send
        </RippleButton>
      </div>
    </div>
  );
}
