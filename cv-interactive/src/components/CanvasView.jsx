import { useEffect, useRef, useMemo } from "react";
import { useI18n } from "../hooks/useI18n";
import { useWindowSize } from "../hooks/useWindowSize";
import { NODE_TYPES } from "../data/constants";

/**
 * CanvasView — Vue workflow n8n du parcours professionnel
 *
 * Affiche un diagramme interactif avec :
 * - Nœuds d'expérience organisés chronologiquement (du plus ancien au plus récent)
 * - Connexions courbes reliant les expériences (Bezier curves)
 * - Boîtes de groupe pour regrouper les missions sous un même client/employeur
 * - Animations : apparition progressive, flow de particules sur les connexions
 * - Support responsive (desktop 2 colonnes, mobile 1 colonne)
 *
 * Chaque nœud est cliquable et ouvre un tiroir (drawer) avec les détails
 */
export default function CanvasView({ onBack, onSelectExperience }) {
  // Ref du conteneur scrollable pour le canvas
  const containerRef = useRef(null);

  // Contexte i18n : données CV et textes UI
  const { cv, ui } = useI18n();

  // Infos responsive : isMobile pour adapter le layout
  const { isMobile } = useWindowSize();

  // Réinitialise scroll au montage
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  }, []);

  /**
   * Aplatit les groupes d'expériences en liste unique
   * (les enfants des groupes sont extraits pour être rendus individuellement)
   * Garde aussi la trace des indices de groupes pour dessiner les boîtes englobantes
   */
  const { nodes, groupBoxes } = useMemo(() => {
    const flat = [];
    const groups = [];

    cv.experienceGroups.forEach((item) => {
      if (item.isGroup) {
        // Nœud groupe : extrait les enfants
        const startIdx = flat.length;
        item.children.forEach((child) => flat.push(child));
        groups.push({
          id: item.id,
          label: item.label,
          period: item.period,
          startIdx,
          endIdx: flat.length - 1,
        });
      } else {
        // Nœud indépendant
        flat.push(item);
      }
    });

    return { nodes: flat, groupBoxes: groups };
  }, [cv.experienceGroups]);

  // ── Dimensions du layout responsif ──
  const nodeW = isMobile ? 200 : 240;
  const nodeH = isMobile ? 90 : 100;
  const gapX = isMobile ? 80 : 140; // Espacement horizontal
  const gapY = isMobile ? 140 : 180; // Espacement vertical
  const cols = isMobile ? 1 : 2; // Nombre de colonnes

  // Calcul des positions centrées
  const totalCols = Math.ceil(nodes.length / cols);
  const contentW = totalCols > 0 ? (totalCols - 1) * (nodeW + gapX) + nodeW : nodeW;
  const windowW = typeof window !== "undefined" ? window.innerWidth : 800;
  const startX = Math.max(40, windowW / 2 - contentW / 2);
  const startY = 120;

  /**
   * Calcule la position (x, y) d'un nœud basé sur son index
   * Utilise un système en grille : les nœuds se disposent en colonnes
   */
  const getNodePos = (index) => {
    const col = Math.floor(index / cols);
    const row = index % cols;
    return {
      x: startX + col * (nodeW + gapX),
      y: startY + row * (nodeH + gapY),
    };
  };

  // Dimensions totales du canvas pour les niveaux de scroll
  const canvasW = Math.max(startX * 2 + totalCols * (nodeW + gapX), 800);
  const canvasH = startY * 2 + cols * (nodeH + gapY) + 60;

  /**
   * Génère les lignes de connexion entre nœuds consécutifs
   * Utilise un chemin Bezier cubique (curve lisse)
   */
  const connections = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const from = getNodePos(i);
    const to = getNodePos(i + 1);
    connections.push({
      x1: from.x + nodeW,
      y1: from.y + nodeH / 2,
      x2: to.x,
      y2: to.y + nodeH / 2,
    });
  }

  /**
   * Calcule les dimensions des boîtes englobantes des groupes
   * Englobe tous les nœuds du groupe avec padding
   */
  const groupRects = groupBoxes.map((g) => {
    const sPos = getNodePos(g.startIdx);
    const ePos = getNodePos(g.endIdx);
    const pad = 24; // Padding autour des nœuds
    const x = Math.min(sPos.x, ePos.x) - pad;
    const y = Math.min(sPos.y, ePos.y) - pad - 32; // -32 pour le label
    const w = Math.max(sPos.x, ePos.x) + nodeW - x + pad;
    const h = Math.max(sPos.y, ePos.y) + nodeH - y + pad + 8;
    return { ...g, x, y, w, h };
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10, pointerEvents: "none" }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          pointerEvents: "auto",
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 50,
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-secondary)",
          padding: "8px 16px",
          borderRadius: 8,
          cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← {ui.back}
      </button>

      {/* Workflow title bar */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 16px",
          background: "rgba(21,28,44,0.9)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 10,
          backdropFilter: "blur(8px)",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--green)",
            boxShadow: "0 0 6px rgba(16,185,129,0.5)",
          }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "var(--text-secondary)",
          }}
        >
          {ui.workflowTitle}
        </span>
      </div>

      {/* Canvas */}
      <div
        className="canvas-container"
        ref={containerRef}
        style={{ pointerEvents: "auto" }}
      >
        <div
          style={{
            width: canvasW,
            height: canvasH,
            position: "relative",
            minWidth: "100vw",
            minHeight: "100dvh",
            paddingTop: 60,
          }}
        >
          {/* Group boxes - Optimized */}
          {groupRects.map((g) => (
            <div
              key={g.id}
              style={{
                position: "absolute",
                left: g.x,
                top: g.y,
                width: g.w,
                height: g.h,
                border: "1px dashed rgba(96,165,250,0.18)",
                borderRadius: 16,
                background: "rgba(96,165,250,0.02)",
                opacity: 1,
                pointerEvents: "none",
                contain: "layout style",
              }}
            >
              {/* Group label */}
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  left: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--accent)",
                    letterSpacing: "0.04em",
                    opacity: 1,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  📂 {g.label}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: "var(--text-primary)",
                    opacity: 0.8,
                  }}
                >
                  {g.period}
                </span>
              </div>
            </div>
          ))}

          {/* Connection SVG - Optimized */}
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: canvasW,
              height: canvasH,
              pointerEvents: "none",
              willChange: "auto",
            }}
          >
            {connections.map((c, i) => {
              const midX = (c.x1 + c.x2) / 2;
              const pathD = `M${c.x1},${c.y1} C${midX},${c.y1} ${midX},${c.y2} ${c.x2},${c.y2}`;
              return (
                <path
                  key={i}
                  d={pathD}
                  fill="none"
                  stroke="rgba(96,165,250,0.15)"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          {/* Nodes - Optimized */}
          {nodes.map((exp, i) => {
            const pos = getNodePos(i);
            const nt = NODE_TYPES[exp.type];
            return (
              <div
                key={exp.id}
                className="node-hover"
                onClick={() => onSelectExperience(exp)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onSelectExperience(exp)}
                style={{
                  position: "absolute",
                  left: pos.x,
                  top: pos.y,
                  width: nodeW,
                  height: nodeH,
                  background: "var(--bg-card)",
                  border: `1px solid ${nt.border}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  opacity: 1,
                  transform: "scale(1) translateY(0)",
                  overflow: "hidden",
                  boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 ${nt.bg}`,
                  contain: "layout style paint",
                }}
              >
                {/* Color bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: nt.color,
                    borderRadius: "12px 12px 0 0",
                  }}
                />

                <div
                  style={{
                    padding: isMobile ? "12px 14px" : "14px 16px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontSize: isMobile ? 14 : 16 }}>{exp.icon}</span>
                      <span
                        style={{
                          fontSize: isMobile ? 12 : 14,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {exp.title}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: nt.color,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {exp.role}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        color: "var(--text-muted)",
                      }}
                    >
                      {exp.period}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9,
                        padding: "2px 6px",
                        background: nt.bg,
                        color: nt.color,
                        borderRadius: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      {nt.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
