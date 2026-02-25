import { useI18n } from "../hooks/useI18n";
import { NODE_TYPES } from "../data/constants";

export default function ExperienceDrawer({ experience, onClose }) {
  const { ui } = useI18n();
  const nt = NODE_TYPES[experience.type];

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        {/* Header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>{experience.icon}</span>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{experience.title}</h3>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: nt.color,
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
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Meta tags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              animation: "fadeIn 0.4s ease both",
            }}
          >
            {[
              { text: experience.role, color: "var(--accent)", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
              { text: experience.period, color: "var(--text-muted)", bg: "var(--bg-elevated)", border: "var(--border-subtle)" },
              { text: experience.company, color: "var(--text-muted)", bg: "var(--bg-elevated)", border: "var(--border-subtle)" },
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
                }}
              >
                {tag.text}
              </span>
            ))}
          </div>

          {/* Payload blocks */}
          <PayloadBlock
            label={ui.inputLabel}
            color="#f59e0b"
            content={experience.input}
            delay={0.1}
          />
          <PayloadBlock
            label={ui.processingLabel}
            color="#3b82f6"
            content={experience.processing}
            delay={0.2}
          />
          <PayloadBlock
            label={ui.outputLabel}
            color="#10b981"
            content={experience.output}
            delay={0.3}
          />

          {/* JSON preview */}
          <div
            style={{
              padding: 14,
              background: "rgba(0,0,0,0.3)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 8,
              animation: "fadeIn 0.4s ease 0.4s both",
            }}
          >
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "var(--text-muted)",
                marginBottom: 8,
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
    </>
  );
}

function PayloadBlock({ label, color, content, delay }) {
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 10,
        overflow: "hidden",
        animation: `fadeIn 0.4s ease ${delay}s both`,
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
        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--text-secondary)" }}>
          {content}
        </p>
      </div>
    </div>
  );
}
