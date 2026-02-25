import { useEffect, useRef, useCallback } from "react";
import { useI18n } from "../hooks/useI18n";
import { NODE_TYPES } from "../data/constants";

export default function ExperienceModal({ experience, onClose }) {
  const { ui } = useI18n();
  const nt = NODE_TYPES[experience.type];
  const modalRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent scroll on body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === modalRef.current) onClose();
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div
        className="modal-content"
      >
        {/* Header - Always rendered */}
        <div
          style={{
            flexShrink: 0,
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{experience.icon}</span>
            <div style={{ minWidth: 0 }}>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {experience.title}
              </h3>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: nt.color,
                  display: "block",
                  marginTop: 2,
                }}
              >
                {nt.label.toUpperCase()} NODE
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={ui.close}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              width: 32,
              height: 32,
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "var(--border-subtle)";
              e.target.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "var(--bg-elevated)";
              e.target.style.color = "var(--text-secondary)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
            {/* Meta tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                {
                  text: experience.role,
                  color: "var(--accent)",
                  bg: "rgba(96,165,250,0.08)",
                  border: "rgba(96,165,250,0.2)",
                },
                {
                  text: experience.period,
                  color: "var(--text-muted)",
                  bg: "var(--bg-elevated)",
                  border: "var(--border-subtle)",
                },
                {
                  text: experience.company,
                  color: "var(--text-muted)",
                  bg: "var(--bg-elevated)",
                  border: "var(--border-subtle)",
                },
              ].map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    padding: "4px 10px",
                    background: tag.bg,
                    border: `1px solid ${tag.border}`,
                    borderRadius: 6,
                    color: tag.color,
                    whiteSpace: "nowrap",
                  }}
                >
                  {tag.text}
                </span>
              ))}
            </div>

            {/* Payload blocks */}
            <PayloadBlockFast
              label={ui.inputLabel}
              color="#f59e0b"
              content={experience.input}
            />
            <PayloadBlockFast
              label={ui.processingLabel}
              color="#3b82f6"
              content={experience.processing}
            />
            <PayloadBlockFast
              label={ui.outputLabel}
              color="#10b981"
              content={experience.output}
            />

            {/* JSON preview */}
            <div
              style={{
                padding: 14,
                background: "rgba(0,0,0,0.3)",
                border: "1px solid var(--border-subtle)",
                borderRadius: 8,
                contain: "layout style",
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                  margin: 0,
                }}
              >
                {ui.rawPayload}
              </p>
              <pre
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: 0,
                }}
              >
{`{
  "id": "${experience.id}",
  "type": "${experience.type}",
  "status": "completed",
  "role": "${experience.role}",
  "period": "${experience.period}"
}`}
              </pre>
            </div>
          </div>
      </div>
    </div>
  );
}

function PayloadBlockFast({ label, color, content }) {
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 10,
        overflow: "hidden",
        contain: "layout style",
      }}
    >
      <div
        style={{
          padding: "8px 14px",
          background: `${color}08`,
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 6px ${color}60`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ padding: 14 }}>
        <p
          style={{
            fontSize: 13.5,
            lineHeight: 1.65,
            color: "var(--text-secondary)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            margin: 0,
          }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}
