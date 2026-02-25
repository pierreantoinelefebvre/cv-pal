import { useState, useEffect } from "react";
import { useI18n } from "../hooks/useI18n";
import { useWindowSize } from "../hooks/useWindowSize";

const NODE_DEFS = [
  { id: "about", icon: "👤", angle: -90 },
  { id: "skills", icon: "⚙️", angle: -30 },
  { id: "education", icon: "🎓", angle: 30 },
  { id: "languages", icon: "🌍", angle: 90 },
  { id: "experiences", icon: "🔗", angle: 150 },
  { id: "contact", icon: "✉️", angle: 210 },
];

export default function MicroservicesView({ onSelectNode }) {
  const [appeared, setAppeared] = useState(false);
  const { ui } = useI18n();
  const { w, h, isMobile, isTablet } = useWindowSize();

  useEffect(() => {
    const t = setTimeout(() => setAppeared(true), 100);
    return () => clearTimeout(t);
  }, []);

  const radius = isMobile ? 120 : isTablet ? 150 : 180;
  const cx = w / 2;
  const cy = h / 2;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      {/* SVG connections */}
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {NODE_DEFS.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + radius * Math.cos(rad);
          const ny = cy + radius * Math.sin(rad);
          return (
            <line
              key={node.id}
              x1={cx}
              y1={cy}
              x2={appeared ? nx : cx}
              y2={appeared ? ny : cy}
              stroke="rgba(96,165,250,0.15)"
              strokeWidth="1"
              strokeDasharray="6 4"
              style={{
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`,
                animation: appeared ? "dash-flow 1.5s linear infinite" : "none",
              }}
            />
          );
        })}
      </svg>

      {/* Center avatar */}
      <div
        style={{
          width: isMobile ? 56 : 72,
          height: isMobile ? 56 : 72,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)",
          border: "2px solid rgba(96,165,250,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMobile ? 18 : 24,
          fontWeight: 700,
          color: "var(--accent)",
          zIndex: 2,
          position: "relative",
          boxShadow: "0 0 30px rgba(96,165,250,0.15)",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: appeared ? "scale(1)" : "scale(1.4)",
          opacity: appeared ? 1 : 0,
        }}
      >
        PA
      </div>

      {/* Orbiting nodes */}
      {NODE_DEFS.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);
        const label = ui.menuNodes[node.id];

        return (
          <div
            key={node.id}
            onClick={() => onSelectNode(node.id)}
            className="node-hover"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelectNode(node.id)}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: appeared
                ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                : "translate(-50%, -50%)",
              opacity: appeared ? 1 : 0,
              transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1 + 0.15}s`,
              cursor: "pointer",
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: isMobile ? 50 : 64,
                height: isMobile ? 50 : 64,
                borderRadius: isMobile ? 12 : 16,
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? 20 : 26,
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                transition: "all 0.3s",
              }}
            >
              {node.icon}
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: isMobile ? 9 : 10,
                color: "var(--text-secondary)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
