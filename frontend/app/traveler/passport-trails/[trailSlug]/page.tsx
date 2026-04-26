import Link from "next/link";
import { notFound } from "next/navigation";

type StopStatus = "STAMP_UNLOCKED" | "READY_TO_VERIFY" | "LOCKED";

type TrailStop = {
  name: string;
  shortCode: string;
  note: string;
  status: StopStatus;
  source: "QR" | "Pending";
};

type TrailDetail = {
  title: string;
  eyebrow: string;
  subtitle: string;
  progressLabel: string;
  statusLabel: string;
  nextStop: string;
  nextStopReason: string;
  stops: TrailStop[];
};

const TRAILS: Record<string, TrailDetail> = {
  "tri-island-joiner": {
    eyebrow: "PASSPORT TRAILS™",
    title: "Tri-Island Joiner",
    subtitle:
      "Follow Guyam, Daku, and Naked Island through OSP/SPM verification. Stamps unlock only after verified QR / Passport records.",
    progressLabel: "33% Complete",
    statusLabel: "Live Trail",
    nextStop: "Daku Island",
    nextStopReason:
      "Guyam is already stamped. Daku is the next ready-to-verify stop in this Island Hopping journey.",
    stops: [
      {
        name: "Guyam Island",
        shortCode: "GU",
        note: "Stamp unlocked from verified OSP/SPM validation.",
        status: "STAMP_UNLOCKED",
        source: "QR",
      },
      {
        name: "Daku Island",
        shortCode: "DA",
        note: "Ready for QR-based stop verification.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Naked Island",
        shortCode: "NA",
        note: "Ready for QR-based stop verification.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
    ],
  },
};

function statusTone(status: StopStatus) {
  if (status === "STAMP_UNLOCKED") {
    return {
      label: "Stamp unlocked",
      color: "#138a58",
      background: "#d8fbef",
      border: "#1fa45b",
    };
  }

  if (status === "READY_TO_VERIFY") {
    return {
      label: "Ready to verify",
      color: "#067889",
      background: "#dff8ff",
      border: "#13a8b7",
    };
  }

  return {
    label: "Locked",
    color: "#53657d",
    background: "#edf2f5",
    border: "#a0aec0",
  };
}

function ShellCard(props: { children: React.ReactNode; ariaLabel?: string }) {
  return (
    <section
      aria-label={props.ariaLabel}
      style={{
        border: "1px solid #bfe7ee",
        borderRadius: 26,
        background: "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(244,253,255,0.88))",
        padding: 13,
        boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
      }}
    >
      {props.children}
    </section>
  );
}

function SectionEyebrow(props: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9,
        fontWeight: 820,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        color: "#0796a6",
      }}
    >
      {props.children}
    </div>
  );
}


function TrailFunctionalJourneyMap(props: { trail: TrailDetail }) {
  const completedCount = props.trail.stops.filter((stop) => stop.status === "STAMP_UNLOCKED").length;
  const readyCount = props.trail.stops.filter((stop) => stop.status === "READY_TO_VERIFY").length;
  const lockedCount = props.trail.stops.filter((stop) => stop.status === "LOCKED").length;

  const nodes = props.trail.stops.map((stop) => {
    if (stop.status === "STAMP_UNLOCKED") {
      return {
        label: stop.shortCode,
        title: stop.name,
        icon: "✓",
        tone: "#16a34a",
        softBg: "rgba(220,252,231,0.94)",
        border: "rgba(34,184,90,0.34)",
      };
    }

    if (stop.status === "READY_TO_VERIFY") {
      return {
        label: stop.shortCode,
        title: stop.name,
        icon: "↗",
        tone: "#f59e0b",
        softBg: "rgba(255,248,220,0.96)",
        border: "rgba(245,158,11,0.36)",
      };
    }

    return {
      label: stop.shortCode,
      title: stop.name,
      icon: "▣",
      tone: "#64748b",
      softBg: "rgba(248,250,252,0.98)",
      border: "rgba(148,163,184,0.34)",
    };
  });

  return (
    <div style={{ marginTop: 16 }}>
      <ShellCard ariaLabel="Trail functional journey map">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <SectionEyebrow>Functional Journey Map</SectionEyebrow>
            <h2
              style={{
                margin: "6px 0 0",
                fontSize: 20,
                lineHeight: 1.06,
                fontWeight: 760,
                letterSpacing: "-0.04em",
                color: "#14264b",
              }}
            >
              {props.trail.title} route state
            </h2>
            <p
              style={{
                margin: "5px 0 0",
                fontSize: 11.4,
                lineHeight: 1.28,
                fontWeight: 640,
                color: "#53657d",
              }}
            >
              Verified stops, QR-ready stops, and locked progress stay record-based.
            </p>
          </div>

          <Link
            href="/traveler/pass"
            aria-label="Open OSP Pass QR for this trail"
            style={{
              flexShrink: 0,
              minHeight: 40,
              minWidth: 74,
              borderRadius: 15,
              background: "linear-gradient(135deg, #14b8c6, #078da0)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              textDecoration: "none",
              fontSize: 10,
              fontWeight: 820,
              boxShadow: "0 10px 22px rgba(7,141,160,0.20)",
            }}
          >
            Show QR
          </Link>
        </div>

        <div
          aria-label="Trail route progress visualization"
          style={{
            marginTop: 12,
            borderRadius: 22,
            border: "1px solid rgba(191,231,238,0.82)",
            background: "linear-gradient(135deg, #e8fbff 0%, #ffffff 54%, #f8fafc 100%)",
            padding: "14px 12px",
            position: "relative",
            overflow: "hidden",
            minHeight: 136,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 18% 26%, rgba(20,184,198,0.14), transparent 26%), radial-gradient(circle at 72% 46%, rgba(245,158,11,0.13), transparent 28%)",
            }}
          />

          <svg
            aria-hidden="true"
            viewBox="0 0 320 112"
            width="100%"
            height="112"
            preserveAspectRatio="none"
            style={{ position: "relative", display: "block" }}
          >
            <path
              d="M34 80 C92 38, 142 74, 184 42 C224 14, 263 28, 294 46"
              fill="none"
              stroke="rgba(148,163,184,0.38)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="8 10"
            />
            <path
              d="M34 80 C92 38, 142 74, 184 42"
              fill="none"
              stroke="#16a34a"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M184 42 C224 14, 263 28, 294 46"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="4 8"
            />
          </svg>

          {nodes.map((node, index) => {
            const positions = [
              { left: "8%", bottom: 31 },
              { left: "50%", top: 39 },
              { right: "6%", top: 47 },
            ];
            const position = positions[index] ?? positions[positions.length - 1];

            return (
              <div
                key={node.title}
                title={node.title}
                style={{
                  position: "absolute",
                  ...position,
                  width: index === 1 ? 38 : 34,
                  height: index === 1 ? 38 : 34,
                  borderRadius: index === 1 ? 16 : 14,
                  background: node.tone,
                  color: "#ffffff",
                  display: "grid",
                  placeItems: "center",
                  fontSize: index === 1 ? 18 : 16,
                  fontWeight: 950,
                  boxShadow: `0 12px 24px ${node.tone}33`,
                }}
              >
                {node.icon}
              </div>
            );
          })}

          <div
            style={{
              position: "absolute",
              left: 12,
              top: 12,
              borderRadius: 999,
              background: "linear-gradient(135deg, #ffffff, #f4fdff)",
              border: "1px solid rgba(191,231,238,0.76)",
              padding: "5px 8px",
              fontSize: 8.5,
              fontWeight: 900,
              color: "#067889",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Trail detail / DB-ready
          </div>
        </div>

        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 7 }}>
          {[
            { label: "Verified", value: String(completedCount), tone: "#16a34a", bg: "rgba(220,252,231,0.94)" },
            { label: "QR-ready", value: String(readyCount), tone: "#0891b2", bg: "rgba(232,251,255,0.96)" },
            { label: "Locked", value: String(lockedCount), tone: "#64748b", bg: "rgba(248,250,252,0.98)" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                borderRadius: 16,
                border: "1px solid rgba(191,231,238,0.76)",
                background: item.bg,
                minHeight: 54,
                display: "grid",
                placeItems: "center",
                textAlign: "center",
                padding: "7px 4px",
              }}
            >
              <div style={{ color: item.tone, fontSize: 15, lineHeight: 1, fontWeight: 950 }}>{item.value}</div>
              <div style={{ marginTop: 5, color: "#14264b", fontSize: 8.6, lineHeight: 1.05, fontWeight: 820 }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 10,
            borderRadius: 18,
            border: "1px solid rgba(245,158,11,0.28)",
            background: "linear-gradient(135deg, #ffffff, #fff8dc)",
            padding: "10px 11px",
          }}
        >
          <div style={{ fontSize: 8.6, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b45309" }}>
            Next Unlock
          </div>
          <div style={{ marginTop: 4, fontSize: 14.2, lineHeight: 1.08, fontWeight: 820, color: "#14264b" }}>
            {props.trail.nextStop}
          </div>
          <div style={{ marginTop: 4, fontSize: 10.8, lineHeight: 1.3, fontWeight: 620, color: "#53657d" }}>
            {props.trail.nextStopReason}
          </div>
        </div>
      </ShellCard>
    </div>
  );
}

export default function PassportTrailDetailPage({
  params,
}: {
  params: { trailSlug: string };
}) {
  const trail = TRAILS[params.trailSlug];

  if (!trail) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(19,168,183,0.16), transparent 34%), linear-gradient(180deg, #f6fbfc 0%, #ffffff 72%)",
        color: "#14264b",
        fontFamily:
          '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
        padding: "18px 14px 110px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div>
            <SectionEyebrow>{trail.eyebrow}</SectionEyebrow>
            <h1
              style={{
                margin: "5px 0 0",
                fontSize: 30,
                lineHeight: 1.02,
                fontWeight: 690,
                letterSpacing: "-0.045em",
              }}
            >
              {trail.title}
            </h1>
          </div>

          <Link
            href="/traveler/passport-trails"
            style={{
              textDecoration: "none",
              border: "1px solid rgba(191,231,238,0.92)",
              borderRadius: 999,
              background: "rgba(255,255,255,0.9)",
              color: "#0796a6",
              padding: "10px 14px",
              fontSize: 11.6,
              fontWeight: 820,
              whiteSpace: "nowrap",
            }}
          >
            ← Trails
          </Link>
        </header>

        <section
          aria-label="Trail hero"
          style={{
            borderRadius: 28,
            background:
              "linear-gradient(135deg, rgba(10,115,145,0.94), rgba(19,168,183,0.88), rgba(132,184,101,0.86))",
            color: "#ffffff",
            padding: 20,
            overflow: "hidden",
            boxShadow: "0 18px 44px rgba(15,23,42,0.14)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              borderRadius: 999,
              padding: "6px 10px",
              background: "rgba(255,255,255,0.16)",
              fontSize: 9,
              fontWeight: 820,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {trail.statusLabel}
          </div>

          <h2
            style={{
              margin: "12px 0 8px",
              fontSize: 20,
              lineHeight: 1.08,
              fontWeight: 690,
              letterSpacing: "-0.035em",
            }}
          >
            Verify stops. Unlock stamps. Continue.
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: 1.45,
              fontWeight: 600,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {trail.subtitle}
          </p>

          <div
            style={{
              marginTop: 10,
              display: "inline-flex",
              borderRadius: 999,
              padding: "7px 11px",
              background: "linear-gradient(135deg, #ffffff, #f4fdff)",
              color: "#14264b",
              fontSize: 11,
              fontWeight: 820,
            }}
          >
            {trail.progressLabel}
          </div>
        </section>

        <TrailFunctionalJourneyMap trail={trail} />

        <div style={{ marginTop: 16 }}>
          <ShellCard ariaLabel="Trail verification actions">
            <SectionEyebrow>Verify Your Stop</SectionEyebrow>
            <h2
              style={{
                margin: "7px 0 8px",
                fontSize: 20,
                lineHeight: 1.08,
                fontWeight: 690,
                letterSpacing: "-0.035em",
              }}
            >
              Use your OSP QR to unlock Passport Stamps.
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 12.1,
                lineHeight: 1.42,
                fontWeight: 600,
                color: "#53657d",
              }}
            >
              At each verified stop, open your OSP Pass QR and present it for
              validation. A stamp only counts after the stop is verified by
              OSP/SPM records.
            </p>

            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 8,
              }}
            >
              <Link
                href="/traveler/pass"
                aria-label="Show my OSP QR pass"
                style={{
                  textDecoration: "none",
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #14b8c6, #078da0)",
                  color: "#ffffff",
                  padding: 14,
                  minHeight: 104,
                  boxShadow: "0 14px 30px rgba(7,141,160,0.24)",
                }}
              >
                <div style={{ fontSize: 18, lineHeight: 1 }}>▦</div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: 820,
                    lineHeight: 1.12,
                  }}
                >
                  ▣ Show QR
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 10.2,
                    fontWeight: 600,
                    opacity: 0.86,
                    lineHeight: 1.25,
                  }}
                >
                  Open your OSP Pass.
                </div>
              </Link>

              <Link
                href="/traveler/settings?panel=assistant"
                aria-label="Ask Passport Assistant about this trail"
                style={{
                  textDecoration: "none",
                  border: "1px solid rgba(191,231,238,0.92)",
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #ffffff, #f4fdff)",
                  color: "#14264b",
                  padding: 14,
                  minHeight: 104,
                  boxShadow: "0 10px 24px rgba(8,61,103,0.07)",
                }}
              >
                <div style={{ fontSize: 18, lineHeight: 1 }}>✦</div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: 820,
                    lineHeight: 1.12,
                  }}
                >
                  Ask Assistant
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 10.2,
                    fontWeight: 600,
                    color: "#53657d",
                    lineHeight: 1.25,
                  }}
                >
                  Ask route and stamp questions.
                </div>
              </Link>
            </div>
          </ShellCard>
        </div>

        <section style={{ marginTop: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <div>
              <SectionEyebrow>Trail Stops</SectionEyebrow>
              <h2
                style={{
                  margin: "5px 0 0",
                  fontSize: 20,
                  lineHeight: 1.08,
                  fontWeight: 690,
                  letterSpacing: "-0.04em",
                }}
              >
                Verify each stop.
              </h2>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {trail.stops.map((stop, index) => {
              const tone = statusTone(stop.status);

              return (
                <article
                  key={stop.name}
                  style={{
                    border: "1px solid #bfe7ee",
                    borderLeft: `5px solid ${tone.border}`,
                    borderRadius: 22,
                    background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,253,255,0.94))",
                    padding: 13,
                    boxShadow: "0 12px 30px rgba(8,61,103,0.075)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 820,
                          letterSpacing: "0.13em",
                          textTransform: "uppercase",
                          color: tone.color,
                        }}
                      >
                        Stop {index + 1}
                      </div>
                      <h3
                        style={{
                          margin: "5px 0 0",
                          fontSize: 18,
                          lineHeight: 1.1,
                          fontWeight: 820,
                        }}
                      >
                        {stop.name}
                      </h3>
                    </div>

                    <span
                      style={{
                        borderRadius: 999,
                        padding: "6px 9px",
                        background: tone.background,
                        color: tone.color,
                        fontSize: 9,
                        fontWeight: 900,
                        whiteSpace: "nowrap",
                        border: `1px solid ${tone.border}33`,
                      }}
                    >
                      {tone.label}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "9px 0 0",
                      fontSize: 11.6,
                      lineHeight: 1.4,
                      fontWeight: 600,
                      color: "#53657d",
                    }}
                  >
                    {stop.note}
                  </p>

                  <div
                    style={{
                      marginTop: 10,
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        borderRadius: 15,
                        border: "1px solid rgba(191,231,238,0.58)",
                        background: "linear-gradient(135deg, #ffffff, #f4fdff)",
                        padding: "10px 10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 8,
                          fontWeight: 820,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#7b8aa0",
                        }}
                      >
                        Stamp
                      </div>
                      <div
                        style={{
                          marginTop: 3,
                          fontSize: 11,
                          fontWeight: 820,
                        }}
                      >
                        {tone.label}
                      </div>
                    </div>

                    <div
                      style={{
                        borderRadius: 15,
                        border: "1px solid rgba(191,231,238,0.58)",
                        background: "linear-gradient(135deg, #ffffff, #f4fdff)",
                        padding: "10px 10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 8,
                          fontWeight: 820,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#7b8aa0",
                        }}
                      >
                        Source
                      </div>
                      <div
                        style={{
                          marginTop: 3,
                          fontSize: 11,
                          fontWeight: 820,
                        }}
                      >
                        {stop.source}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div style={{ marginTop: 16 }}>
          <ShellCard ariaLabel="AI Passport Assistant trail detail prompt chips">
            <SectionEyebrow>✦ Ask Passport Assistant</SectionEyebrow>
            <div
              style={{
                marginTop: 8,
                fontSize: 14.4,
                fontWeight: 820,
                lineHeight: 1.14,
              }}
            >
              Need help at this trail?
            </div>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 11.5,
                lineHeight: 1.38,
                fontWeight: 600,
                color: "#53657d",
              }}
            >
              Ask about stops, QR verification, stamp rules, and your next move. The assistant cannot confirm booking, payment, guide, or manifest status unless the system proves it.
            </p>

            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
              {[
                "How do I verify this stop?",
                "What stamp can I unlock?",
                "What should I do at Daku?",
                "Why is this not yet stamped?",
              ].map((prompt) => (
                <Link
                  key={prompt}
                  href="/traveler/settings?panel=assistant"
                  style={{
                    textDecoration: "none",
                    border: "1px solid rgba(11,151,166,0.18)",
                    borderRadius: 999,
                    background: "linear-gradient(135deg, #ffffff, #f4fdff)",
                    padding: "8px 10px",
                    boxShadow: "0 6px 14px rgba(8,61,103,0.045)",
                    color: "#067889",
                    fontSize: 10.2,
                    fontWeight: 820,
                    lineHeight: 1,
                  }}
                >
                  {prompt}
                </Link>
              ))}
            </div>
          </ShellCard>
        </div>

        <div style={{ marginTop: 16 }}>
          <ShellCard ariaLabel="Passport stamp rules">
            <SectionEyebrow>Stamp Rules</SectionEyebrow>
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {[
                "Unlocked stamps must come from verified OSP/SPM records.",
                "Ready-to-verify stops are not counted until validation is complete.",
                "Your OSP QR is your traveler identity for stop validation.",
                "Payment, booking, guide, and manifest status are not changed on this page.",
              ].map((rule) => (
                <div
                  key={rule}
                  style={{
                    border: "1px solid rgba(11,151,166,0.12)",
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #ffffff, #f8fbfc)",
                    padding: "9px 10px",
                    fontSize: 11.5,
                    lineHeight: 1.35,
                    fontWeight: 600,
                    color: "#355071",
                  }}
                >
                  {rule}
                </div>
              ))}
            </div>
          </ShellCard>
        </div>

        <nav
          aria-label="Passport Trail bottom navigation"
          style={{
            position: "fixed",
            left: "50%",
            bottom: 18,
            transform: "translateX(-50%)",
            width: "min(392px, calc(100vw - 28px))",
            border: "1px solid #dbeef2",
            borderRadius: 26,
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,253,255,0.94))",
            boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
            padding: 10,
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          {[
            { label: "Map", href: "/traveler/passport-map", icon: "⌖" },
            { label: "Trails", href: "/traveler/passport-trails", icon: "⌁" },
            { label: "Pass", href: "/traveler/pass", icon: "▣" },
            { label: "Profile", href: "/traveler/settings", icon: "◉" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                textDecoration: "none",
                borderRadius: 18,
                padding: "9px 6px",
                textAlign: "center",
                color: item.label === "Trails" ? "#0796a6" : "#607089",
                background: item.label === "Trails" ? "linear-gradient(135deg, #dff8ff, #ffffff)" : "transparent",
                fontSize: 10,
                fontWeight: 820,
              }}
            >
              <div style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</div>
              <div style={{ marginTop: 4 }}>{item.label}</div>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
