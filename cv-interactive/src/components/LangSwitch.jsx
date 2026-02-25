import { useI18n } from "../hooks/useI18n";

export default function LangSwitch() {
  const { ui, toggle } = useI18n();

  return (
    <button
      onClick={toggle}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 200,
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
  );
}
