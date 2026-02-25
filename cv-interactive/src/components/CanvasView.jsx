import { useEffect, useRef, useMemo } from "react";
import { useI18n } from "../hooks/useI18n";
import { useWindowSize } from "../hooks/useWindowSize";
import { NODE_TYPES } from "../data/constants";

/**
 * CanvasView — Vue workflow n8n du parcours professionnel
 *
 * Affiche un diagramme interactif avec :
 * - Noeud "Manual Trigger" (Start) en debut de workflow
 * - Noeuds d'experience organises chronologiquement
 * - Noeud "Today" (End) en fin de workflow
 * - Connexions Bezier avec fleches et particules animees
 * - Ports d'entree/sortie (dots) sur chaque noeud
 * - Badges d'execution (checkmark / pulsing)
 * - Boites de groupe pour les missions consultant
 * - Barre de statut d'execution en bas
 *
 * Mobile : layout vertical (colonne unique, scroll bas)
 * Desktop : layout horizontal 2 lignes + drag-to-pan
 */
export default function CanvasView({ onBack, onSelectExperience }) {
  const containerRef = useRef(null);
  // Drag-to-pan (desktop)
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const { cv, ui } = useI18n();
  const { isMobile } = useWindowSize();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  }, []);

  const { nodes, groupBoxes } = useMemo(() => {
    const flat = [];
    const groups = [];

    cv.experienceGroups.forEach((item) => {
      if (item.isGroup) {
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
        flat.push(item);
      }
    });

    return { nodes: flat, groupBoxes: groups };
  }, [cv.experienceGroups]);

  // ── Dimensions ──
  const nodeW = isMobile ? 300 : 240;
  const nodeH = isMobile ? 90 : 100;
  const gapX = 140; // horizontal gap (desktop only)
  const gapY = isMobile ? 36 : 180;
  const specialW = isMobile ? 150 : 160;
  const specialH = isMobile ? 60 : 70;
  const startY = isMobile ? 60 : 120;
  const windowW = typeof window !== "undefined" ? window.innerWidth : 800;

  // Mobile: nodes centred horizontally
  const mobilePad = Math.max(20, (windowW - nodeW) / 2);
  const mobileCenter = windowW / 2;

  // Desktop layout (2-row grid, horizontal flow)
  const cols = 2;
  const totalExpCols = Math.ceil(nodes.length / cols);
  const expGridW =
    totalExpCols > 0 ? (totalExpCols - 1) * (nodeW + gapX) + nodeW : nodeW;
  const totalWorkflowW = specialW + gapX + expGridW + gapX + specialW;
  const workflowStartX = Math.max(60, windowW / 2 - totalWorkflowW / 2);
  const expStartX = workflowStartX + specialW + gapX;
  const centerY = startY + nodeH + gapY / 2;

  // ── Node position ──
  // Mobile  : single vertical column, nodes stacked top-to-bottom
  // Desktop : 2-row grid, nodes flow left-to-right
  const getNodePos = (index) => {
    if (isMobile) {
      return {
        x: mobilePad,
        y: startY + specialH + gapY + index * (nodeH + gapY),
      };
    }
    const col = Math.floor(index / cols);
    const row = index % cols;
    return {
      x: expStartX + col * (nodeW + gapX),
      y: startY + row * (nodeH + gapY),
    };
  };

  // ── Special node positions ──
  const startNodePos = isMobile
    ? { x: mobileCenter - specialW / 2, y: startY }
    : { x: workflowStartX, y: centerY - specialH / 2 };

  const lastExpPos =
    nodes.length > 0
      ? getNodePos(nodes.length - 1)
      : isMobile
      ? { x: mobilePad, y: startY + specialH + gapY }
      : { x: expStartX, y: startY };

  const endNodePos = isMobile
    ? {
        x: mobileCenter - specialW / 2,
        y: lastExpPos.y + nodeH + gapY,
      }
    : {
        x: lastExpPos.x + nodeW + gapX,
        y: centerY - specialH / 2,
      };

  // ── Canvas dimensions ──
  const canvasW = isMobile
    ? Math.max(windowW, 360)
    : Math.max(endNodePos.x + specialW + 80, 800);

  const canvasH = isMobile
    ? endNodePos.y + specialH + 80
    : startY * 2 + cols * (nodeH + gapY) + 60;

  // ── Connections ──
  const allConnections = [];

  if (nodes.length > 0) {
    const firstPos = getNodePos(0);
    allConnections.push(
      isMobile
        ? {
            x1: startNodePos.x + specialW / 2,
            y1: startNodePos.y + specialH,
            x2: firstPos.x + nodeW / 2,
            y2: firstPos.y,
          }
        : {
            x1: startNodePos.x + specialW,
            y1: startNodePos.y + specialH / 2,
            x2: firstPos.x,
            y2: firstPos.y + nodeH / 2,
          }
    );
  }

  for (let i = 0; i < nodes.length - 1; i++) {
    const from = getNodePos(i);
    const to = getNodePos(i + 1);
    allConnections.push(
      isMobile
        ? {
            x1: from.x + nodeW / 2,
            y1: from.y + nodeH,
            x2: to.x + nodeW / 2,
            y2: to.y,
          }
        : {
            x1: from.x + nodeW,
            y1: from.y + nodeH / 2,
            x2: to.x,
            y2: to.y + nodeH / 2,
          }
    );
  }

  if (nodes.length > 0) {
    allConnections.push(
      isMobile
        ? {
            x1: lastExpPos.x + nodeW / 2,
            y1: lastExpPos.y + nodeH,
            x2: endNodePos.x + specialW / 2,
            y2: endNodePos.y,
          }
        : {
            x1: lastExpPos.x + nodeW,
            y1: lastExpPos.y + nodeH / 2,
            x2: endNodePos.x,
            y2: endNodePos.y + specialH / 2,
          }
    );
  }

  // ── Group rectangles ──
  const groupRects = groupBoxes.map((g) => {
    const sPos = getNodePos(g.startIdx);
    const ePos = getNodePos(g.endIdx);
    const pad = 24;
    const x = Math.min(sPos.x, ePos.x) - pad;
    const y = Math.min(sPos.y, ePos.y) - pad - 32;
    const w = Math.max(sPos.x, ePos.x) + nodeW - x + pad;
    const h = Math.max(sPos.y, ePos.y) + nodeH - y + pad + 8;
    return { ...g, x, y, w, h };
  });

  // ── Drag-to-pan handlers (desktop) ──
  const handleMouseDown = (e) => {
    if (e.button !== 0 || !containerRef.current) return;
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    containerRef.current.scrollLeft =
      dragStart.current.scrollLeft - (e.clientX - dragStart.current.x);
    containerRef.current.scrollTop =
      dragStart.current.scrollTop - (e.clientY - dragStart.current.y);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const ntStart = NODE_TYPES.start;
  const ntEnd = NODE_TYPES.end;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          pointerEvents: "auto",
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 50,
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-secondary)",
          padding: isMobile ? "6px 10px" : "8px 16px",
          borderRadius: 8,
          cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: isMobile ? 12 : 13,
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← {!isMobile && ui.back}
      </button>

      {/* Workflow title bar */}
      <div
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: isMobile ? "6px 12px" : "8px 16px",
          background: "rgba(21,28,44,0.9)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 10,
          backdropFilter: "blur(8px)",
          maxWidth: isMobile ? "calc(100vw - 160px)" : "calc(100vw - 220px)",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--green)",
            boxShadow: "0 0 6px rgba(16,185,129,0.5)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: isMobile ? 10 : 12,
            color: "var(--text-secondary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {ui.workflowTitle}
        </span>
        {!isMobile && (
          <>
            <span style={{ color: "var(--border-subtle)", flexShrink: 0 }}>|</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
              }}
            >
              {nodes.length} {ui.workflowNodes}
            </span>
          </>
        )}
      </div>

      {/* ══ Canvas ══ */}
      <div
        className="canvas-container"
        ref={containerRef}
        style={{ pointerEvents: "auto" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            width: canvasW,
            height: canvasH,
            position: "relative",
            minWidth: isMobile ? "100vw" : undefined,
            minHeight: "100dvh",
            paddingTop: 60,
          }}
        >
          {/* Group boxes */}
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
                pointerEvents: "none",
                contain: "layout style",
              }}
            >
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
                    fontSize: isMobile ? 11 : 13,
                    fontWeight: 600,
                    color: "var(--accent)",
                    letterSpacing: "0.04em",
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

          {/* ══ SVG CONNECTIONS ══ */}
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: canvasW,
              height: canvasH,
              pointerEvents: "none",
            }}
          >
            <defs>
              {/* Arrowhead marker — orient="auto" rotates for vertical paths too */}
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="8"
                refX="9"
                refY="4"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M0,1 L9,4 L0,7" fill="rgba(96,165,250,0.45)" />
              </marker>
              <filter id="particleGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {allConnections.map((c, i) => {
              const midX = (c.x1 + c.x2) / 2;
              const midY = (c.y1 + c.y2) / 2;
              // Mobile: vertical bezier (curves up/down)
              // Desktop: horizontal bezier (curves left/right)
              const pathD = isMobile
                ? `M${c.x1},${c.y1} C${c.x1},${midY} ${c.x2},${midY} ${c.x2},${c.y2}`
                : `M${c.x1},${c.y1} C${midX},${c.y1} ${midX},${c.y2} ${c.x2},${c.y2}`;
              return (
                <g key={i}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="rgba(96,165,250,0.2)"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  <circle
                    r="3"
                    fill="#60a5fa"
                    opacity="0.7"
                    filter="url(#particleGlow)"
                  >
                    <animateMotion
                      dur={`${2.5 + i * 0.15}s`}
                      repeatCount="indefinite"
                      path={pathD}
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* ══ START NODE (Manual Trigger) ══ */}
          <div
            style={{
              position: "absolute",
              left: startNodePos.x,
              top: startNodePos.y,
              width: specialW,
              height: specialH,
              background: "var(--bg-card)",
              border: `1px solid ${ntStart.border}`,
              borderRadius: 12,
              overflow: "visible",
              boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 ${ntStart.bg}`,
              contain: "layout style",
            }}
          >
            {/* Top color bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: ntStart.color,
                borderRadius: "12px 12px 0 0",
              }}
            />

            {/* Output port — mobile: bottom-center, desktop: right-center */}
            <div
              style={{
                position: "absolute",
                ...(isMobile
                  ? { bottom: -6, left: "50%", transform: "translateX(-50%)" }
                  : { right: -6, top: "50%", transform: "translateY(-50%)" }),
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "var(--bg-card)",
                border: `2px solid ${ntStart.border}`,
                zIndex: 2,
              }}
            />

            {/* Execution badge */}
            <div
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: "white",
                fontWeight: "bold",
                boxShadow: "0 2px 6px rgba(16,185,129,0.4)",
                zIndex: 3,
              }}
            >
              ✓
            </div>

            {/* Content */}
            <div
              style={{
                padding: "8px 14px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill={ntStart.color}>
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span
                  style={{
                    fontSize: isMobile ? 10 : 12,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ui.workflowStart}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  color: ntStart.color,
                  letterSpacing: "0.04em",
                }}
              >
                {ui.workflowStartSub}
              </span>
            </div>
          </div>

          {/* ══ EXPERIENCE NODES ══ */}
          {nodes.map((exp, i) => {
            const pos = getNodePos(i);
            const nt = NODE_TYPES[exp.type];
            const isCurrent = i === nodes.length - 1 && !exp.isCompleted;
            return (
              <div
                key={exp.id}
                className="node-hover"
                onClick={() => onSelectExperience(exp)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && onSelectExperience(exp)
                }
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
                  overflow: "visible",
                  boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 ${nt.bg}`,
                  contain: "layout style",
                }}
              >
                {/* Input port — mobile: top-center, desktop: left-center */}
                <div
                  style={{
                    position: "absolute",
                    ...(isMobile
                      ? { top: -6, left: "50%", transform: "translateX(-50%)" }
                      : { left: -6, top: "50%", transform: "translateY(-50%)" }),
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "var(--bg-card)",
                    border: `2px solid ${nt.border}`,
                    zIndex: 2,
                  }}
                />

                {/* Output port — mobile: bottom-center, desktop: right-center */}
                <div
                  style={{
                    position: "absolute",
                    ...(isMobile
                      ? { bottom: -6, left: "50%", transform: "translateX(-50%)" }
                      : { right: -6, top: "50%", transform: "translateY(-50%)" }),
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "var(--bg-card)",
                    border: `2px solid ${nt.border}`,
                    zIndex: 2,
                  }}
                />

                {/* Execution badge */}
                {isCurrent ? (
                  <div
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#f59e0b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 3,
                      animation: "pulseGlow 2s ease-in-out infinite",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "white",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#10b981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      color: "white",
                      fontWeight: "bold",
                      boxShadow: "0 2px 6px rgba(16,185,129,0.4)",
                      zIndex: 3,
                    }}
                  >
                    ✓
                  </div>
                )}

                {/* Top color bar */}
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

                {/* Node content */}
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
                      <span style={{ fontSize: isMobile ? 14 : 16 }}>
                        {exp.icon}
                      </span>
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

          {/* ══ END NODE (Today) ══ */}
          <div
            style={{
              position: "absolute",
              left: endNodePos.x,
              top: endNodePos.y,
              width: specialW,
              height: specialH,
              background: "var(--bg-card)",
              border: `1px solid ${ntEnd.border}`,
              borderRadius: 12,
              overflow: "visible",
              boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 ${ntEnd.bg}`,
              contain: "layout style",
            }}
          >
            {/* Pulsing ring */}
            <div
              style={{
                position: "absolute",
                inset: -4,
                border: "2px solid rgba(16,185,129,0.3)",
                borderRadius: 16,
                animation: "pulseRing 2s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />

            {/* Top color bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: ntEnd.color,
                borderRadius: "12px 12px 0 0",
              }}
            />

            {/* Input port — mobile: top-center, desktop: left-center */}
            <div
              style={{
                position: "absolute",
                ...(isMobile
                  ? { top: -6, left: "50%", transform: "translateX(-50%)" }
                  : { left: -6, top: "50%", transform: "translateY(-50%)" }),
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "var(--bg-card)",
                border: `2px solid ${ntEnd.border}`,
                zIndex: 2,
              }}
            />

            {/* Content */}
            <div
              style={{
                padding: "8px 14px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>🏁</span>
                <span
                  style={{
                    fontSize: isMobile ? 10 : 12,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {ui.workflowEnd}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#10b981",
                    boxShadow: "0 0 6px rgba(16,185,129,0.6)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9,
                    color: "#10b981",
                    letterSpacing: "0.04em",
                  }}
                >
                  {ui.workflowEndSub}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ EXECUTION STATUS BAR ══ */}
      <div
        style={{
          pointerEvents: "auto",
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 6 : 10,
          padding: isMobile ? "6px 12px" : "8px 18px",
          background: "rgba(21,28,44,0.95)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 10,
          backdropFilter: "blur(8px)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: isMobile ? 10 : 11,
          maxWidth: "calc(100vw - 40px)",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 6px rgba(16,185,129,0.5)",
            flexShrink: 0,
          }}
        />
        <span style={{ color: "#10b981", whiteSpace: "nowrap" }}>
          {ui.workflowSuccess}
        </span>
        <span style={{ color: "var(--border-subtle)" }}>|</span>
        <span style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          {nodes.length} {ui.workflowNodes}
        </span>
        {!isMobile && (
          <>
            <span style={{ color: "var(--border-subtle)" }}>|</span>
            <span style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              2014 → {ui.workflowNow}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
