import { useState } from "react";
import { useI18n } from "../hooks/useI18n";

export default function LangSwitch() {
  const { ui, toggle, lang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 200 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          color: "var(--accent)",
          padding: "6px 14px",
          borderRadius: 8,
          cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.06em",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 6,
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
        <span style={{ fontSize: 14 }}>🌐</span>
        {ui.switchLang}
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 8,
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
            overflow: "hidden",
            minWidth: 100,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            zIndex: 201,
          }}
        >
          {["FR", "EN"].map((l) => (
            <button
              key={l}
              onClick={() => {
                if (lang !== l.toLowerCase()) {
                  toggle();
                }
                setIsOpen(false);
              }}
              style={{
                width: "100%",
                padding: "8px 16px",
                background: lang === l.toLowerCase() ? "var(--bg-elevated)" : "transparent",
                border: "none",
                color: lang === l.toLowerCase() ? "var(--accent)" : "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 600,
                textAlign: "left",
                transition: "all 0.2s",
                borderBottom: l === "FR" ? "1px solid var(--border-subtle)" : "none",
              }}
              onMouseEnter={(e) => {
                if (lang !== l.toLowerCase()) {
                  e.currentTarget.style.background = "var(--bg-elevated)";
                  e.currentTarget.style.color = "var(--accent)";
                }
              }}
              onMouseLeave={(e) => {
                if (lang !== l.toLowerCase()) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
