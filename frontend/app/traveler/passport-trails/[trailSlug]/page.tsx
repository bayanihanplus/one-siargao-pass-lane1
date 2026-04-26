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
        fontWeight: 720,
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
              border: "1px solid #bdebf0",
              borderRadius: 999,
              background: "rgba(255,255,255,0.9)",
              color: "#0796a6",
              padding: "10px 14px",
              fontSize: 11.6,
              fontWeight: 720,
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
              fontWeight: 720,
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
              fontWeight: 720,
            }}
          >
            {trail.progressLabel}
          </div>
        </section>

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
                  padding: 13,
                  boxShadow: "0 12px 28px rgba(19,168,183,0.22)",
                }}
              >
                <div style={{ fontSize: 18, lineHeight: 1 }}>▦</div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: 720,
                    lineHeight: 1.12,
                  }}
                >
                  ▣ Show My QR
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
                  ▣ Open traveler pass.
                </div>
              </Link>

              <Link
                href="/traveler/settings?panel=assistant"
                aria-label="Ask Passport Assistant about this trail"
                style={{
                  textDecoration: "none",
                  border: "1px solid #bdebf0",
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.88)",
                  color: "#14264b",
                  padding: 13,
                }}
              >
                <div style={{ fontSize: 18, lineHeight: 1 }}>🤖</div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    fontWeight: 720,
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
                  Help with stops and stamps.
                </div>
              </Link>
            </div>
          </ShellCard>
        </div>

        <div style={{ marginTop: 16 }}>
          <ShellCard ariaLabel="Recommended next move">
            <SectionEyebrow>Recommended Next Move</SectionEyebrow>
            <div
              style={{
                marginTop: 8,
                display: "grid",
                gridTemplateColumns: "40px 1fr",
                gap: 8,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#dff8ff",
                  color: "#067889",
                  fontSize: 20,
                  fontWeight: 720,
                }}
              >
                2
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14.4,
                    fontWeight: 720,
                    lineHeight: 1.16,
                  }}
                >
                  → Continue to {trail.nextStop}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: "#53657d",
                    lineHeight: 1.35,
                  }}
                >
                  {trail.nextStopReason}
                </div>
              </div>
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
                Visit, verify, unlock.
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
                    background: "rgba(255,255,255,0.94)",
                    padding: 13,
                    boxShadow: "0 10px 28px rgba(15,23,42,0.05)",
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
                          fontWeight: 720,
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
                          fontWeight: 720,
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
                        fontWeight: 720,
                        whiteSpace: "nowrap",
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
                        borderRadius: 14,
                        background: "linear-gradient(135deg, #f8fbfc, #ffffff)",
                        padding: "9px 10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 8,
                          fontWeight: 720,
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
                          fontWeight: 720,
                        }}
                      >
                        {tone.label}
                      </div>
                    </div>

                    <div
                      style={{
                        borderRadius: 14,
                        background: "linear-gradient(135deg, #f8fbfc, #ffffff)",
                        padding: "9px 10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 8,
                          fontWeight: 720,
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
                          fontWeight: 720,
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
                fontWeight: 720,
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
                    background: "rgba(255,255,255,0.86)",
                    padding: "7px 9px",
                    color: "#067889",
                    fontSize: 10.2,
                    fontWeight: 720,
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
                    background: "rgba(248,252,252,0.88)",
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
            background: "rgba(255,255,255,0.94)",
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
                background: item.label === "Trails" ? "#dff8ff" : "transparent",
                fontSize: 10,
                fontWeight: 720,
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
