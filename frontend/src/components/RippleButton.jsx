import { useState } from "react";

export default function RippleButton({ children, className = "", ...props }) {
  const [ripple, setRipple] = useState(null);

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    setRipple({ x, y, size, key: Date.now() });
    if (props.onClick) props.onClick(event);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-xl border border-cyan-300/35 bg-cyan-400/10 px-6 py-3 font-medium text-cyan-200 transition hover:-translate-y-1 hover:bg-cyan-300/15 hover:shadow-neon ${className}`}
    >
      <span className="relative z-10">{children}</span>
      {ripple && (
        <span
          key={ripple.key}
          className="pointer-events-none absolute animate-ping rounded-full bg-cyan-300/40"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size
          }}
        />
      )}
    </button>
  );
}
