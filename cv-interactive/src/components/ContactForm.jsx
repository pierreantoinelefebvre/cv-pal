import { useState } from "react";
import { useI18n } from "../hooks/useI18n";
import { useWindowSize } from "../hooks/useWindowSize";

/*
 * Configure your Formspree endpoint below.
 * 1. Go to https://formspree.io → create a free form
 * 2. Replace the URL below with your form endpoint
 * Or set the env var VITE_FORMSPREE_URL
 */
const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL || "";

export default function ContactForm({ onClose }) {
  const { cv, ui } = useI18n();
  const { isMobile } = useWindowSize();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;

    if (!FORMSPREE_URL) {
      // Fallback: open mailto
      const subject = encodeURIComponent(`Contact CV — ${form.name}`);
      const body = encodeURIComponent(
        `Nom: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
      );
      window.open(`mailto:${cv.profile.email}?subject=${subject}&body=${body}`, "_blank");
      setStatus("success");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-subtle)",
    borderRadius: 8,
    color: "var(--text-primary)",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "var(--text-muted)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div className="section-overlay" onClick={onClose}>
      <div
        className="section-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 520 }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h2
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              color: "var(--accent)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {ui.contactTitle}
          </h2>
          <button
            onClick={onClose}
            aria-label={ui.close}
            style={{
              background: "none",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              width: 32,
              height: 32,
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          {ui.contactSubtitle}
        </p>

        {status === "success" ? (
          <div
            style={{
              padding: 20,
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 10,
              textAlign: "center",
              animation: "fadeIn 0.4s ease",
            }}
          >
            <p style={{ fontSize: 18, marginBottom: 8 }}>✓</p>
            <p style={{ color: "var(--green)", fontSize: 14, fontWeight: 600 }}>
              {ui.contactSuccess}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>{ui.contactName}</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
              />
            </div>

            <div>
              <label style={labelStyle}>{ui.contactEmail}</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
              />
            </div>

            <div>
              <label style={labelStyle}>{ui.contactMessage}</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: 100,
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-subtle)")}
              />
            </div>

            {status === "error" && (
              <p style={{ fontSize: 13, color: "#ef4444" }}>{ui.contactError}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === "sending" || !form.name || !form.email || !form.message}
              style={{
                padding: "12px 24px",
                background:
                  status === "sending" || !form.name || !form.email || !form.message
                    ? "var(--bg-elevated)"
                    : "var(--accent)",
                color:
                  status === "sending" || !form.name || !form.email || !form.message
                    ? "var(--text-muted)"
                    : "#0a0e17",
                border: "none",
                borderRadius: 10,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                fontWeight: 600,
                cursor:
                  status === "sending" || !form.name || !form.email || !form.message
                    ? "not-allowed"
                    : "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.04em",
              }}
            >
              {status === "sending" ? ui.contactSending : ui.contactSend}
            </button>
          </div>
        )}

        {/* Direct contact fallback */}
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "var(--bg-elevated)",
            borderRadius: 10,
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            {ui.contactDirect}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <a
              href={`mailto:${cv.profile.email}`}
              style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none" }}
            >
              📧 {cv.profile.email}
            </a>
            <a
              href={`tel:${cv.profile.phone}`}
              style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}
            >
              📞 {cv.profile.phone}
            </a>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              📬 {cv.profile.address || cv.profile.location}
            </span>
            {cv.profile.permit && (
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                🆔 {cv.profile.permit}
              </span>
            )}
            <a
              href={cv.profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none" }}
            >
              🔗 LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
