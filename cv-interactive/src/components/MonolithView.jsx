import { useState } from "react";
import { useI18n } from "../hooks/useI18n";
import { useWindowSize } from "../hooks/useWindowSize";

export default function MonolithView({ onDeploy }) {
  const [hover, setHover] = useState(false);
  const { cv, ui } = useI18n();
  const { isMobile } = useWindowSize();

  const blockW = isMobile ? 300 : 360;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        padding: 20,
      }}
    >
      <div
        onClick={onDeploy}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onDeploy()}
        style={{
          width: blockW,
          maxWidth: "100%",
          padding: isMobile ? "36px 28px" : "48px 40px",
          background: hover
            ? "linear-gradient(145deg, var(--mono-card-hover-from), var(--mono-card-hover-to))"
            : "linear-gradient(145deg, var(--mono-card-from), var(--mono-card-to))",
          border: `1px solid ${hover ? "rgba(96,165,250,0.3)" : "var(--border-subtle)"}`,
          borderRadius: 20,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hover ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
          animation: "pulse-glow 3s ease-in-out infinite",
          boxShadow: hover
            ? "0 20px 60px rgba(96,165,250,0.15), 0 0 0 1px rgba(96,165,250,0.1)"
            : "var(--shadow-card-lg)",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: isMobile ? 72 : 90,
            height: isMobile ? 72 : 90,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)",
            border: "2px solid rgba(96,165,250,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? 26 : 32,
            fontWeight: 700,
            color: "var(--accent)",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          PA
        </div>

        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: isMobile ? 19 : 22,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              marginBottom: 6,
            }}
          >
            {cv.profile.name}
          </h1>
          <p
            className="font-mono"
            style={{
              fontSize: isMobile ? 10 : 12,
              color: "var(--accent)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {cv.profile.title}
          </p>
        </div>

        {/* Deploy button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: hover ? "rgba(96,165,250,0.12)" : "rgba(96,165,250,0.06)",
            border: "1px solid rgba(96,165,250,0.2)",
            borderRadius: 10,
            transition: "all 0.3s",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--green)",
              boxShadow: "0 0 8px rgba(16,185,129,0.5)",
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: isMobile ? 11 : 12,
              color: "var(--accent)",
              fontWeight: 500,
            }}
          >
            {ui.deploy} →
          </span>
        </div>
      </div>

      <p
        style={{
          marginTop: 32,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: "var(--text-muted)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {ui.deployHint}
      </p>
    </div>
  );
}
