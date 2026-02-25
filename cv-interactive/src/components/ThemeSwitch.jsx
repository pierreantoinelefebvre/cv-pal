import { useState, useEffect } from "react";
import { useWindowSize } from "../hooks/useWindowSize";

export default function ThemeSwitch() {
  const { isMobile } = useWindowSize();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      title={isDark ? "Passer en mode jour" : "Passer en mode nuit"}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        color: "var(--text-secondary)",
        padding: isMobile ? "5px 10px" : "6px 14px",
        borderRadius: 8,
        cursor: "pointer",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: isMobile ? 11 : 12,
        fontWeight: 600,
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 5,
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-elevated)";
        e.currentTarget.style.borderColor = "var(--border-active)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg-card)";
        e.currentTarget.style.borderColor = "var(--border-subtle)";
      }}
    >
      <span style={{ fontSize: isMobile ? 13 : 14 }}>{isDark ? "☀️" : "🌙"}</span>
      {!isMobile && (isDark ? "Jour" : "Nuit")}
    </button>
  );
}
