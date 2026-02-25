import { useState, useEffect } from "react";
import { useI18n } from "../hooks/useI18n";
import { useWindowSize } from "../hooks/useWindowSize";

export default function SectionPanel({ section, onClose }) {
  const { cv, ui } = useI18n();

  const titles = {
    about: ui.sectionAbout,
    skills: ui.sectionSkills,
    education: ui.sectionEducation,
    languages: ui.sectionLanguages,
  };

  return (
    <div className="section-overlay" onClick={onClose}>
      <div className="section-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
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
            {titles[section]}
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
              transition: "all 0.2s",
            }}
          >
            ✕
          </button>
        </div>

        {section === "about" && <AboutContent cv={cv} />}
        {section === "skills" && <SkillsContent cv={cv} />}
        {section === "education" && <EducationContent cv={cv} ui={ui} />}
        {section === "languages" && <LanguagesContent cv={cv} />}
      </div>
    </div>
  );
}

/* ─── About ─────────────────────────────────────────── */
function AboutContent({ cv }) {
  const { isMobile } = useWindowSize();
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: "var(--text-secondary)",
          marginBottom: 24,
        }}
      >
        {cv.about.summary}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 10,
        }}
      >
        {cv.about.highlights.map((h, i) => (
          <div
            key={i}
            style={{
              padding: "10px 14px",
              background: "rgba(96,165,250,0.05)",
              border: "1px solid rgba(96,165,250,0.1)",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--text-primary)",
              animation: `fadeIn 0.4s ease ${i * 0.05}s both`,
            }}
          >
            <span style={{ color: "var(--green)", marginRight: 6 }}>▸</span>
            {h}
          </div>
        ))}
      </div>

      {/* Contact info */}
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
            fontSize: 12,
            color: "var(--text-muted)",
            marginBottom: 8,
          }}
        >
          // contact
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            📧 {cv.profile.email}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            📞 {cv.profile.phone}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            📍 {cv.profile.location}
          </span>
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
  );
}

/* ─── Skills ────────────────────────────────────────── */
function SkillsContent({ cv }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {Object.entries(cv.skills).map(([cat, items], ci) => (
        <div key={cat} style={{ animation: `fadeIn 0.4s ease ${ci * 0.06}s both` }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "var(--text-muted)",
              marginBottom: 8,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {cat}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {items.map((item) => (
              <span key={item} className="skill-tag">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Education ─────────────────────────────────────── */
function EducationContent({ cv, ui }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {cv.education.map((edu, i) => (
        <div
          key={i}
          style={{
            padding: 16,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 10,
            animation: `fadeIn 0.4s ease ${i * 0.1}s both`,
          }}
        >
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
            {edu.degree}
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{edu.school}</p>
          <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
            <span
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--accent)" }}
            >
              {edu.year}
            </span>
            <span
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "var(--text-muted)" }}
            >
              ≡ {edu.equiv}
            </span>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 8 }}>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "var(--text-muted)",
            marginBottom: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {ui.sectionCertifications}
        </p>
        {cv.certifications.map((c, i) => (
          <div
            key={i}
            style={{
              padding: "10px 14px",
              marginBottom: 8,
              background: "rgba(16,185,129,0.05)",
              border: "1px solid rgba(16,185,129,0.15)",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--green)",
              animation: `fadeIn 0.4s ease ${(i + 2) * 0.1}s both`,
            }}
          >
            ✓ {c}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Languages ─────────────────────────────────────── */
function LanguagesContent({ cv }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {cv.languages.map((l, i) => (
        <div
          key={i}
          style={{
            padding: 16,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 10,
            animation: `fadeIn 0.4s ease ${i * 0.1}s both`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600 }}>{l.lang}</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: "var(--accent)",
              }}
            >
              {l.level}
            </span>
          </div>
          <div className="lang-bar">
            <div
              className="lang-fill"
              style={{
                width: animated ? `${l.pct}%` : "0%",
                background: `linear-gradient(90deg, var(--accent), ${l.pct === 100 ? "var(--green)" : "var(--purple)"})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
