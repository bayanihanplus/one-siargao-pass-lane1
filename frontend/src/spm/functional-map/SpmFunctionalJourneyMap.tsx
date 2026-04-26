import { getFunctionalTrailMapBySlug } from "./spmFunctionalMapConfig";

type Props = {
  trailSlug: string;
};

function getStateTheme(state: string) {
  if (state === "verified") {
    return {
      badgeBg: "#16a34a",
      badgeColor: "#ffffff",
      labelBg: "rgba(255,255,255,0.94)",
      labelBorder: "rgba(34,184,90,0.35)",
      accent: "#138a58",
      icon: "✓",
      label: "Verified",
    };
  }

  if (state === "next") {
    return {
      badgeBg: "#f59e0b",
      badgeColor: "#ffffff",
      labelBg: "rgba(255,255,255,0.95)",
      labelBorder: "rgba(245,158,11,0.42)",
      accent: "#b45309",
      icon: "↗",
      label: "Next Unlock",
    };
  }

  if (state === "qr_ready") {
    return {
      badgeBg: "#0891b2",
      badgeColor: "#ffffff",
      labelBg: "rgba(255,255,255,0.94)",
      labelBorder: "rgba(8,145,178,0.36)",
      accent: "#067889",
      icon: "↗",
      label: "QR-ready",
    };
  }

  if (state === "conditional") {
    return {
      badgeBg: "#7c3aed",
      badgeColor: "#ffffff",
      labelBg: "rgba(255,255,255,0.88)",
      labelBorder: "rgba(124,58,237,0.28)",
      accent: "#6d28d9",
      icon: "◇",
      label: "Conditional",
    };
  }

  return {
    badgeBg: "#64748b",
    badgeColor: "#ffffff",
    labelBg: "rgba(255,255,255,0.9)",
    labelBorder: "rgba(100,116,139,0.28)",
    accent: "#64748b",
    icon: "□",
    label: "Locked",
  };
}

function getSegmentStyle(style: string) {
  if (style === "active") {
    return { stroke: "#16a34a", strokeWidth: 1.35, dashArray: "0", opacity: 0.95 };
  }

  if (style === "upcoming") {
    return { stroke: "#f59e0b", strokeWidth: 1.25, dashArray: "3 2", opacity: 0.9 };
  }

  return { stroke: "#94a3b8", strokeWidth: 1, dashArray: "2.5 2.5", opacity: 0.74 };
}

export function SpmFunctionalJourneyMap({ trailSlug }: Props) {
  const map = getFunctionalTrailMapBySlug(trailSlug);

  if (!map) return null;

  const verifiedCount = map.nodes.filter((node) => node.state === "verified").length;
  const qrReadyCount = map.nodes.filter((node) => node.state === "qr_ready" || node.state === "next").length;
  const lockedCount = map.nodes.filter((node) => node.state === "locked" || node.state === "conditional").length;
  const nodeByKey = Object.fromEntries(map.nodes.map((node) => [node.key, node]));

  return (
    <section
      aria-label="SPM Functional Map illustrated journey"
      style={{
        marginTop: 20,
        border: "1px solid #bfe6eb",
        borderRadius: 28,
        background: "linear-gradient(180deg, rgba(255,255,255,0.99), rgba(244,253,255,0.96))",
        padding: 20,
        display: "grid",
        gap: 16,
        boxShadow: "0 16px 38px rgba(8,61,103,0.10)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#0891b2",
              marginBottom: 8,
            }}
          >
            SPM Own Map Journey Canvas
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 28,
              lineHeight: 1.08,
              fontWeight: 900,
              color: "#14264b",
              letterSpacing: "-0.045em",
            }}
          >
            {map.heading}
          </h2>

          <p
            style={{
              margin: "10px 0 0 0",
              fontSize: 16,
              lineHeight: 1.45,
              fontWeight: 760,
              color: "#53657d",
            }}
          >
            {map.subheading}
          </p>
        </div>

        <a
          href="/traveler/pass"
          aria-label="Open OSP Pass QR"
          style={{
            textDecoration: "none",
            minWidth: 112,
            textAlign: "center",
            padding: "14px 18px",
            borderRadius: 20,
            background: "linear-gradient(135deg, #14b8c6 0%, #11843d 100%)",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: 16,
            boxShadow: "0 10px 24px rgba(7,141,160,0.20)",
          }}
        >
          Show QR
        </a>
      </div>

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 30,
          border: "1px solid #c8e8ed",
          aspectRatio: "1448 / 1086",
          minHeight: 292,
          background: "#d8edf1",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55), 0 14px 34px rgba(8,61,103,0.08)",
        }}
      >
        <img
          src={map.imageSrc}
          alt={`${map.familyLabel} functional journey map`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: "saturate(1.04) contrast(0.98)",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(5,28,48,0.08) 0%, rgba(255,255,255,0.04) 42%, rgba(244,253,255,0.34) 100%)",
          }}
        />

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {map.segments.map((segment) => {
            const from = nodeByKey[segment.from];
            const to = nodeByKey[segment.to];
            if (!from || !to) return null;

            const segmentTheme = getSegmentStyle(segment.style);

            return (
              <line
                key={`${segment.from}-${segment.to}`}
                x1={from.xPercent}
                y1={from.yPercent}
                x2={to.xPercent}
                y2={to.yPercent}
                stroke={segmentTheme.stroke}
                strokeWidth={segmentTheme.strokeWidth}
                strokeDasharray={segmentTheme.dashArray}
                strokeLinecap="round"
                opacity={segmentTheme.opacity}
              />
            );
          })}
        </svg>

        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            padding: "8px 12px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.93)",
            border: "1px solid #bfe6eb",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#067889",
            boxShadow: "0 8px 18px rgba(8,61,103,0.08)",
          }}
        >
          Official Nodes / DB-ready
        </div>

        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            padding: "8px 12px",
            borderRadius: 999,
            background: "rgba(20,184,198,0.88)",
            border: "1px solid rgba(255,255,255,0.62)",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#ffffff",
            boxShadow: "0 8px 18px rgba(8,61,103,0.10)",
          }}
        >
          {map.familyLabel}
        </div>

        {map.nodes.map((node) => {
          const theme = getStateTheme(node.state);

          let labelTransform = "translate(-50%, 12px)";
          let labelTop = "100%";
          let labelLeft = "50%";

          if (node.labelPosition === "top") {
            labelTransform = "translate(-50%, calc(-100% - 12px))";
            labelTop = "0%";
            labelLeft = "50%";
          } else if (node.labelPosition === "left") {
            labelTransform = "translate(calc(-100% - 12px), -50%)";
            labelTop = "50%";
            labelLeft = "0%";
          } else if (node.labelPosition === "right") {
            labelTransform = "translate(12px, -50%)";
            labelTop = "50%";
            labelLeft = "100%";
          }

          const isPrimary = node.priority === "primary";
          const nodeSize = isPrimary ? 58 : node.priority === "secondary" ? 42 : 36;
          const nodeRadius = isPrimary ? 20 : 15;
          const nodeFontSize = isPrimary ? 27 : node.priority === "secondary" ? 18 : 16;

          return (
            <div
              key={node.key}
              style={{
                position: "absolute",
                left: `${node.xPercent}%`,
                top: `${node.yPercent}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isPrimary ? 5 : node.priority === "secondary" ? 4 : 3,
              }}
            >
              <div
                title={`${theme.label}: ${node.label}`}
                style={{
                  width: nodeSize,
                  height: nodeSize,
                  borderRadius: nodeRadius,
                  background: theme.badgeBg,
                  color: theme.badgeColor,
                  display: "grid",
                  placeItems: "center",
                  fontSize: nodeFontSize,
                  fontWeight: 900,
                  boxShadow: "0 12px 24px rgba(26,41,78,0.18)",
                  border: isPrimary ? "4px solid rgba(255,255,255,0.92)" : "3px solid rgba(255,255,255,0.88)",
                }}
              >
                {theme.icon}
              </div>

              {isPrimary ? (
                <div
                  style={{
                    position: "absolute",
                    top: labelTop,
                    left: labelLeft,
                    transform: labelTransform,
                    minWidth: 118,
                    maxWidth: 150,
                    padding: "8px 10px",
                    borderRadius: 16,
                    background: theme.labelBg,
                    border: `1px solid ${theme.labelBorder}`,
                    boxShadow: "0 10px 22px rgba(25,35,60,0.12)",
                    backdropFilter: "blur(8px)",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      lineHeight: 1.2,
                      fontWeight: 900,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: theme.accent,
                      marginBottom: 3,
                    }}
                  >
                    {theme.label}
                  </div>

                  <div
                    style={{
                      fontSize: 12.5,
                      lineHeight: 1.15,
                      fontWeight: 900,
                      color: "#14264b",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {node.label}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 16,
            borderRadius: 26,
            background: "rgba(255,255,255,0.91)",
            border: "1px solid #d7e9ec",
            padding: "16px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            boxShadow: "0 12px 26px rgba(8,61,103,0.10)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#b45309",
                marginBottom: 6,
              }}
            >
              Next Unlock
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                color: "#14264b",
              }}
            >
              {map.nextUnlockLabel}
            </div>
          </div>

          <a
            href="/traveler/pass"
            aria-label="Open OSP Pass QR from SPM Functional Map"
            style={{
              textDecoration: "none",
              padding: "15px 20px",
              borderRadius: 22,
              background: "linear-gradient(135deg, #14b8c6 0%, #11843d 100%)",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: 15,
              minWidth: 112,
              textAlign: "center",
              boxShadow: "0 8px 18px rgba(7,141,160,0.18)",
            }}
          >
            Show QR
          </a>
        </div>
      </div>

      <div
        aria-label="Official Island Hopping nodes"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {map.nodes.map((node) => {
          const theme = getStateTheme(node.state);

          return (
            <div
              key={`rail-${node.key}`}
              style={{
                borderRadius: 16,
                border: `1px solid ${theme.labelBorder}`,
                background: theme.labelBg,
                padding: "8px 9px",
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 7,
                alignItems: "center",
                minHeight: 48,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 10,
                  background: theme.badgeBg,
                  color: theme.badgeColor,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 13,
                  fontWeight: 900,
                }}
              >
                {theme.icon}
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 8.2,
                    lineHeight: 1,
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: theme.accent,
                  }}
                >
                  {theme.label}
                </div>
                <div
                  style={{
                    marginTop: 3,
                    fontSize: 10.6,
                    lineHeight: 1.08,
                    fontWeight: 880,
                    color: "#14264b",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {node.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {[
          { label: "Verified", value: verifiedCount, bg: "#e7f8ea", color: "#16a34a" },
          { label: "QR-ready", value: qrReadyCount, bg: "#e8fbff", color: "#0891b2" },
          { label: "Locked", value: lockedCount, bg: "#f4f5f8", color: "#64748b" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              borderRadius: 22,
              border: "1px solid #cbe8ec",
              background: item.bg,
              padding: "16px 12px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: item.color,
                marginBottom: 6,
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "#14264b",
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          borderRadius: 24,
          border: "1px solid rgba(245,158,11,0.34)",
          background: "linear-gradient(135deg, #ffffff, #fff8dc)",
          padding: 18,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#b45309",
            marginBottom: 8,
          }}
        >
          Next Unlock
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "#14264b",
            marginBottom: 8,
          }}
        >
          {map.nextUnlockLabel}
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.5,
            fontWeight: 760,
            color: "#53657d",
          }}
        >
          {map.nextUnlockDescription}
        </p>
      </div>
    </section>
  );
}
