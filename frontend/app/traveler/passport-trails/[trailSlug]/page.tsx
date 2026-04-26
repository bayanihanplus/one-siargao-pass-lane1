import Link from "next/link";
import { SpmFunctionalJourneyMap } from "../../../../src/spm/functional-map/SpmFunctionalJourneyMap";
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
  "island-hopping": {
    eyebrow: "PASSPORT TRAILS™",
    title: "Island Hopping Trail",
    subtitle:
      "Follow official Island Hopping nodes through OSP/SPM verification. Stamps unlock only after verified QR / Passport records.",
    progressLabel: "1/5 Core Stops",
    statusLabel: "Live Trail",
    nextStop: "Daku Island",
    nextStopReason:
      "Guyam is already stamped. Daku is the next ready-to-verify official Island Hopping node. Corregidor, Mam-on, and Secret Island stay locked until governed package or progress rules apply.",
    stops: [
      {
        name: "Guyam Island",
        shortCode: "GU",
        note: "Official QR stamp node. Stamp unlocked from verified OSP/SPM validation.",
        status: "STAMP_UNLOCKED",
        source: "QR",
      },
      {
        name: "Daku Island",
        shortCode: "DA",
        note: "Official QR stamp node. Ready for QR-based stop verification.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Naked Island",
        shortCode: "NA",
        note: "Official QR stamp node. Ready for QR-based stop verification.",
        status: "READY_TO_VERIFY",
        source: "Pending",
      },
      {
        name: "Corregidor Island",
        shortCode: "CO",
        note: "Official QR stamp node. Locked until selected route/package progress allows it.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Mam-on Island",
        shortCode: "MO",
        note: "Official QR stamp node. Locked until selected route/package progress allows it.",
        status: "LOCKED",
        source: "Pending",
      },
      {
        name: "Secret Island",
        shortCode: "SI",
        note: "Conditional package-only node. Hidden or locked until governed package rules apply.",
        status: "LOCKED",
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

        <SpmFunctionalJourneyMap trailSlug={params.trailSlug} />

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
                "Which Island Hopping node is next?",
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
