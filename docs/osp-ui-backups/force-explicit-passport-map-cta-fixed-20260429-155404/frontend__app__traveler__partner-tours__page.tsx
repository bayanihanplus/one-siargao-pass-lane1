import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";
const readinessStats = [
  { icon: "🧭", label: "Source", value: "Operator-led" },
  { icon: "🧑‍✈️", label: "Guide", value: "When required" },
  { icon: "💸", label: "Pricing", value: "Before confirm" },
];

const operatorTourLanes = [
  {
    icon: "🏝️",
    label: "Siargao Partner Tour",
    title: "Island & Boat-Led Tours",
    area: "General Luna / island routes",
    status: "Operator source pending",
    statusTone: "gold",
    body:
      "Future approved operator-led boat and island activities will appear here. Manifest, payment, operator, QR, and stamp rules must be governed before confirmation.",
    chips: ["Boat/operator likely", "Manifest may apply", "Request to confirm"],
  },
  {
    icon: "🚐",
    label: "Siargao Partner Tour",
    title: "Land Route Tours",
    area: "Siargao road movement",
    status: "Fulfillment required",
    statusTone: "blue",
    body:
      "Transport-supported local tours should come from approved Operator Console activity records, with pricing and fulfillment readiness before traveler confirmation.",
    chips: ["Transport support", "Pricing required", "Operator-led"],
  },
  {
    icon: "🧑‍✈️",
    label: "Siargao Partner Tour",
    title: "Guide-Supported Experiences",
    area: "Route-dependent",
    status: "Guide after confirmation",
    statusTone: "green",
    body:
      "Guide support may be provided where required. Assigned guide details appear only after operator confirmation and governed route readiness.",
    chips: ["Guide support", "Operator confirms", "No guide marketplace"],
  },
  {
    icon: "🌊",
    label: "Siargao Partner Tour",
    title: "Surf & Coastal Partner Activities",
    area: "Cloud 9 / coastal zones",
    status: "Approval required",
    statusTone: "slate",
    body:
      "Surf and coastal partner activities must be approved, priced, and governed before they become traveler-visible products.",
    chips: ["Partner activity", "Safety-aware", "Approval first"],
  },
];

const futureSourceRules = [
  {
    icon: "🧾",
    title: "Operator Console source",
    body:
      "Future listings must be populated from approved Operator activity records, not hardcoded tourist cards.",
  },
  {
    icon: "🔐",
    title: "Confirmation boundary",
    body:
      "Selecting or viewing a tour must not create booking, payment, guide assignment, manifest, QR validation, or Passport Stamp progress.",
  },
  {
    icon: "🗺️",
    title: "SPM separation",
    body:
      "Partner Tours are operator-led supply. Passport Trails are curated route/progression layers. The two lanes must stay visibly separate.",
  },
];

function Pill(props: { children: string; tone?: "blue" | "green" | "gold" | "slate" | "light" }) {
  const theme = {
    blue: ["rgba(14,165,233,0.10)", "#0369a1", "rgba(14,165,233,0.18)"],
    green: ["rgba(22,163,74,0.10)", "#166534", "rgba(22,163,74,0.18)"],
    gold: ["rgba(217,119,6,0.10)", "#92400e", "rgba(217,119,6,0.18)"],
    slate: ["rgba(15,23,42,0.06)", "#334155", "rgba(15,23,42,0.10)"],
    light: ["rgba(255,255,255,0.16)", "#ffffff", "rgba(255,255,255,0.22)"],
  }[props.tone ?? "slate"];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "6px 9px",
        background: theme[0],
        color: theme[1],
        border: `1px solid ${theme[2]}`,
        fontSize: 11,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {props.children}
    </span>
  );
}

function CompactLink(props: {
  href: string;
  icon: string;
  children: string;
  variant?: "primary" | "secondary" | "dark" | "ghost";
}) {
  const variant = props.variant ?? "primary";
  const theme =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, #078da0, #0f766e)",
          color: "#ffffff",
          border: "1px solid rgba(7,141,160,0.24)",
          shadow: "0 10px 22px rgba(7,141,160,0.20)",
        }
      : variant === "dark"
        ? {
            background: "#10234a",
            color: "#ffffff",
            border: "1px solid rgba(16,35,74,0.22)",
            shadow: "0 10px 22px rgba(16,35,74,0.18)",
          }
        : variant === "ghost"
          ? {
              background: "transparent",
              color: "#075985",
              border: "1px solid rgba(14,116,144,0.18)",
              shadow: "none",
            }
          : {
              background: "rgba(255,255,255,0.88)",
              color: "#075985",
              border: "1px solid rgba(14,116,144,0.16)",
              shadow: "0 8px 18px rgba(15,23,42,0.07)",
            };

  return (
    <a
      href={props.href}
      style={{
        minHeight: 40,
        borderRadius: 14,
        padding: "10px 12px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        textDecoration: "none",
        fontSize: 12.5,
        fontWeight: 900,
        background: theme.background,
        color: theme.color,
        border: theme.border,
        boxShadow: theme.shadow,
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden="true">{props.icon}</span>
      {props.children}
    </a>
  );
}

function IconBubble(props: { icon: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 44,
        height: 44,
        borderRadius: 18,
        background: "linear-gradient(135deg, #e0f7fa, #ecfdf5)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        flex: "0 0 auto",
        boxShadow: "0 12px 26px rgba(15,23,42,0.10)",
      }}
    >
      {props.icon}
    </span>
  );
}

export default function PartnerToursPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 14% -2%, rgba(45,212,191,0.24), transparent 34%), radial-gradient(circle at 96% 2%, rgba(251,191,36,0.20), transparent 30%), radial-gradient(circle at 50% 52%, rgba(14,165,233,0.08), transparent 38%), linear-gradient(180deg, #f8fdff 0%, #eefbf7 44%, #f8fafc 100%)",
        padding: "16px 13px 104px",
        color: "#10234a",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <header
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 34,
            background:
              "linear-gradient(145deg, rgba(12,74,110,0.98), rgba(8,145,178,0.92), rgba(20,184,166,0.82))",
            boxShadow: "0 28px 62px rgba(15,23,42,0.22)",
            padding: 18,
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 82% 18%, rgba(255,255,255,0.24), transparent 23%), radial-gradient(circle at 15% 92%, rgba(250,204,21,0.18), transparent 25%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <a
                href="/traveler/passport-trails"
                aria-label="Back to Passport Trails"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 17,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.16)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.20)",
                  fontWeight: 950,
                }}
              >
                ←
              </a>
              <Pill tone="light">Operator-led lane</Pill>
            </div>

            <div style={{ marginTop: 22 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                Siargao Partner Tours
              </div>

              <h1
                style={{
                  margin: "7px 0 0",
                  fontSize: 34,
                  lineHeight: 0.98,
                  letterSpacing: "-0.045em",
                  fontWeight: 950,
                }}
              >
                View Tours
              </h1>

              <p style={{ margin: "9px 0 0", color: "#fef9c3", fontSize: 17, fontWeight: 950 }}>
                Approved local partner activities will appear here.
              </p>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "rgba(255,255,255,0.82)",
                  fontSize: 13.4,
                  lineHeight: 1.45,
                  fontWeight: 680,
                  maxWidth: 370,
                }}
              >
                This is the traveler-facing lane for Operator Console products and services. Partner Tours are separate from Passport Trails detail pages.
              </p>
            </div>

            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <CompactLink href="#tour-lanes" icon="🏝️">View lanes</CompactLink>
              <CompactLink href="/traveler/passport-trails/diy-trail-builder" icon="🧩" variant="secondary">
                Build route
              </CompactLink>
            </div>
          </div>
        </header>

        <section
          aria-label="Partner tour readiness stats"
          style={{
            marginTop: 11,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 7,
          }}
        >
          {readinessStats.map((item) => (
            <div
              key={item.label}
              style={{
                borderRadius: 22,
                background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(240,253,250,0.88))",
                border: "1px solid rgba(14,116,144,0.14)",
                boxShadow: "0 14px 30px rgba(15,23,42,0.08)",
                padding: "12px 9px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 20 }}>{item.icon}</div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 10.5,
                  fontWeight: 950,
                  color: "#078da0",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {item.label}
              </div>
              <div style={{ marginTop: 2, fontSize: 12, fontWeight: 900, color: "#10234a" }}>{item.value}</div>
            </div>
          ))}
        </section>

        <section
          style={{
            marginTop: 12,
            borderRadius: 28,
            background: "linear-gradient(180deg, rgba(255,255,255,0.97), rgba(240,253,250,0.90))",
            border: "1px solid rgba(14,116,144,0.15)",
            boxShadow: "0 20px 44px rgba(15,23,42,0.09)",
            padding: 16,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", color: "#078da0" }}>
            Source of truth
          </div>
          <h2 style={{ margin: "4px 0 0", fontSize: 20, lineHeight: 1.08, fontWeight: 950 }}>
            Future tour cards must come from approved Operator activities.
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 12.5, lineHeight: 1.42, color: "rgba(15,23,42,0.64)", fontWeight: 700 }}>
            Operator Console will populate approved tour-led products and services here. Listings must be traveler-visible only after approval, pricing readiness, fulfillment readiness, and required safety/compliance rules.
          </p>
        </section>

        <section id="tour-lanes" aria-label="Operator-led tour lanes" style={{ marginTop: 13, display: "grid", gap: 9 }}>
          {operatorTourLanes.map((card) => (
            <article
              key={card.title}
              style={{
                borderRadius: 28,
                background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.90))",
                border: "1px solid rgba(14,116,144,0.15)",
                boxShadow: "0 18px 42px rgba(15,23,42,0.09)",
                padding: 15,
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <IconBubble icon={card.icon} />

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <div
                        style={{
                          fontSize: 9.5,
                          fontWeight: 950,
                          letterSpacing: "0.09em",
                          textTransform: "uppercase",
                          color: "#078da0",
                        }}
                      >
                        {card.label}
                      </div>
                      <h3 style={{ margin: "3px 0 0", fontSize: 16.5, lineHeight: 1.12, fontWeight: 950 }}>
                        {card.title}
                      </h3>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(15,23,42,0.55)", fontWeight: 780 }}>
                        {card.area}
                      </p>
                    </div>
                    <Pill tone={card.statusTone as "blue" | "green" | "gold" | "slate"}>{card.status}</Pill>
                  </div>

                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 12.6,
                      lineHeight: 1.4,
                      color: "rgba(15,23,42,0.64)",
                      fontWeight: 690,
                    }}
                  >
                    {card.body}
                  </p>

                  <div style={{ marginTop: 9, display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {card.chips.map((chip) => (
                      <Pill key={chip} tone="slate">
                        {chip}
                      </Pill>
                    ))}
                  </div>

                  <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <CompactLink href="/traveler/passport-trails/diy-trail-builder" icon="+" variant="primary">
                      Add to route draft
                    </CompactLink>
                    <CompactLink href="/traveler/passport-map" icon="🗺️" variant="ghost">
                      View map
                    </CompactLink>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section
          aria-label="Partner tour readiness pipeline"
          style={{
            marginTop: 13,
            borderRadius: 28,
            background: "linear-gradient(180deg, rgba(255,255,255,0.97), rgba(240,249,255,0.92))",
            border: "1px solid rgba(14,116,144,0.15)",
            boxShadow: "0 20px 44px rgba(15,23,42,0.09)",
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#078da0",
            }}
          >
            Readiness pipeline
          </div>
          <h2 style={{ margin: "5px 0 0", fontSize: 20, lineHeight: 1.08, fontWeight: 950 }}>
            From Operator Console to traveler visibility.
          </h2>
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {[
              ["1", "Operator creates tour-led activity"],
              ["2", "Pricing, guide, fulfillment, and safety fields are reviewed"],
              ["3", "Approved products become traveler-visible here"],
              ["4", "Booking, payment, QR, manifest, and stamp rules activate only when wired"],
            ].map(([number, label]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(14,116,144,0.11)",
                  padding: "10px 11px",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(14,165,233,0.12)",
                    color: "#0369a1",
                    fontSize: 12,
                    fontWeight: 950,
                    flex: "0 0 auto",
                  }}
                >
                  {number}
                </span>
                <span style={{ fontSize: 12.7, lineHeight: 1.35, fontWeight: 800, color: "rgba(15,23,42,0.70)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: 13,
            borderRadius: 28,
            background: "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(16,35,74,0.96))",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 24px 54px rgba(15,23,42,0.24)",
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#67e8f9",
            }}
          >
            Current boundary
          </div>
          <h2 style={{ margin: "5px 0 0", fontSize: 20, lineHeight: 1.1, fontWeight: 950 }}>
            This is not a live booking marketplace yet.
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 12.5, lineHeight: 1.42, color: "rgba(255,255,255,0.72)", fontWeight: 700 }}>
            Viewing or adding a partner tour to a route draft does not create booking, payment, operator assignment, guide assignment, manifest, QR validation, or Passport Stamp progress.
          </p>

          <div style={{ marginTop: 11, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <CompactLink href="/traveler/settings?panel=assistant&topic=trail" icon="✨">Ask Kuya Tala</CompactLink>
            <CompactLink href="/traveler/passport-trails" icon="🏝️" variant="secondary">Passport Trails</CompactLink>
          </div>
        </section>

        <section
          aria-label="Sticky actions"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
            padding: "10px 13px 14px",
            background: "linear-gradient(180deg, rgba(248,250,252,0), rgba(248,250,252,0.96) 24%, rgba(248,250,252,1))",
            borderTop: "1px solid rgba(14,116,144,0.08)",
          }}
        >
          <div
            style={{
              maxWidth: 460,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 7,
            }}
          >
            <CompactLink href="/traveler/passport-trails" icon="🏝️" variant="secondary">
              Trails
            </CompactLink>
            <CompactLink href="/traveler/passport-trails/diy-trail-builder" icon="🧩">
              Builder
            </CompactLink>
            <CompactLink href="/traveler/passport-map" icon="🗺️" variant="dark">
              Map
            </CompactLink>
          </div>
        </section>
      </div>
      <UniversalTravelerBottomTabBar activeTab="explore" fixed />
    </main>
  );
}
