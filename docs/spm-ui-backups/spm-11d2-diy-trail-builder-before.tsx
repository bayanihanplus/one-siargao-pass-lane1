const routeIdeas = [
  {
    icon: "📍",
    eyebrow: "Start",
    title: "Choose your anchor stop",
    body: "Begin with one preferred Siargao stop. OSP/SPM uses governed stop records before anything becomes fulfillment-ready.",
  },
  {
    icon: "🧭",
    eyebrow: "Shape",
    title: "Auto-build compatible stops",
    body: "The route can be structured around nearby verified stops, operator-required services, guide support, and safety rules.",
  },
  {
    icon: "💠",
    eyebrow: "Validate",
    title: "Price before confirmation",
    body: "Specialized trip pricing applies before booking, payment, guide assignment, QR validation, or Passport Stamp progress.",
  },
];

const featuredStops = [
  {
    icon: "🌉",
    name: "Catangnan Bridge",
    meta: "Scenic anchor",
    status: "Candidate stop",
    note: "May fit sunset / scenic routes after governed validation.",
  },
  {
    icon: "🌊",
    name: "Cloud 9 Zone",
    meta: "Surf + sunset",
    status: "Verified context",
    note: "Can anchor surf, scenic, or nearby trail logic depending on the route.",
  },
  {
    icon: "🥥",
    name: "Coconut Road",
    meta: "Route corridor",
    status: "Review required",
    note: "Route use depends on approved stop records and local validation.",
  },
];

const premiumRules = [
  {
    icon: "🧑‍✈️",
    title: "Guide support provided where required",
    body: "Travelers do not choose guides yet. Assigned guide details appear only after operator confirmation.",
  },
  {
    icon: "💸",
    title: "Specialized pricing may be higher",
    body: "Custom trail planning can include operator support, guide support, transport, boat access, activity fees, and validation rules.",
  },
  {
    icon: "🔐",
    title: "No fake activation",
    body: "No booking, payment, guide assignment, QR validation, or Passport Stamp progress is created from this planning page yet.",
  },
];

const fulfillmentCards = [
  {
    icon: "🚶",
    title: "Self-guided stop",
    body: "May be visited independently when records and local access rules allow it.",
  },
  {
    icon: "🚐",
    title: "Operator-supported",
    body: "Transport, boat, activity, or access services require approved operator fulfillment.",
  },
  {
    icon: "🪪",
    title: "Stamp validation",
    body: "Passport Stamps count only after approved OSP/SPM QR or validation records.",
  },
];

function AppIcon(props: { children: string; tone?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 38,
        height: 38,
        borderRadius: 16,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        background: props.tone || "linear-gradient(135deg, #e0f7fa, #ecfdf5)",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.10)",
        fontSize: 18,
      }}
    >
      {props.children}
    </span>
  );
}

function Pill(props: { children: string; tone?: "green" | "blue" | "gold" | "soft" }) {
  const styles = {
    green: { background: "rgba(22, 163, 74, 0.10)", color: "#166534", border: "rgba(22, 163, 74, 0.18)" },
    blue: { background: "rgba(14, 165, 233, 0.10)", color: "#0369a1", border: "rgba(14, 165, 233, 0.18)" },
    gold: { background: "rgba(217, 119, 6, 0.10)", color: "#92400e", border: "rgba(217, 119, 6, 0.18)" },
    soft: { background: "rgba(15, 23, 42, 0.05)", color: "#334155", border: "rgba(15, 23, 42, 0.08)" },
  }[props.tone || "soft"];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        border: `1px solid ${styles.border}`,
        background: styles.background,
        color: styles.color,
        padding: "7px 10px",
        fontSize: 10.5,
        fontWeight: 900,
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      {props.children}
    </span>
  );
}

function PremiumCard(props: {
  icon: string;
  eyebrow?: string;
  title: string;
  body: string;
  footer?: string;
}) {
  return (
    <article
      style={{
        borderRadius: 24,
        border: "1px solid rgba(14, 116, 144, 0.13)",
        background: "rgba(255, 255, 255, 0.82)",
        boxShadow: "0 18px 42px rgba(15, 23, 42, 0.08)",
        padding: 15,
        backdropFilter: "blur(14px)",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <AppIcon>{props.icon}</AppIcon>
        <div style={{ minWidth: 0 }}>
          {props.eyebrow ? (
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 950,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#078da0",
              }}
            >
              {props.eyebrow}
            </div>
          ) : null}

          <h3
            style={{
              margin: props.eyebrow ? "4px 0 0" : "0",
              fontSize: 15.5,
              lineHeight: 1.15,
              fontWeight: 950,
              color: "#10234a",
            }}
          >
            {props.title}
          </h3>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: 12,
              lineHeight: 1.45,
              fontWeight: 700,
              color: "rgba(15, 23, 42, 0.66)",
            }}
          >
            {props.body}
          </p>

          {props.footer ? (
            <p
              style={{
                margin: "9px 0 0",
                fontSize: 11,
                lineHeight: 1.35,
                fontWeight: 850,
                color: "#078da0",
              }}
            >
              {props.footer}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function PrimaryAction(props: { href: string; icon: string; children: string; variant?: "primary" | "ghost" }) {
  const primary = props.variant !== "ghost";

  return (
    <a
      href={props.href}
      style={{
        minHeight: 44,
        borderRadius: 999,
        padding: "12px 15px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        textDecoration: "none",
        fontSize: 12.5,
        fontWeight: 950,
        background: primary ? "linear-gradient(135deg, #078da0, #0f766e)" : "rgba(255, 255, 255, 0.76)",
        color: primary ? "#ffffff" : "#075985",
        border: primary ? "1px solid rgba(7, 141, 160, 0.28)" : "1px solid rgba(14, 116, 144, 0.16)",
        boxShadow: primary ? "0 16px 32px rgba(7, 141, 160, 0.24)" : "0 10px 24px rgba(15, 23, 42, 0.08)",
      }}
    >
      <span aria-hidden="true">{props.icon}</span>
      {props.children}
    </a>
  );
}

export default function BuildYourOwnPassportTrailPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 0%, rgba(45, 212, 191, 0.22), transparent 34%), radial-gradient(circle at 95% 8%, rgba(251, 191, 36, 0.18), transparent 30%), linear-gradient(180deg, #f8fdff 0%, #eefbf7 48%, #f8fafc 100%)",
        padding: "18px 14px 96px",
        color: "#10234a",
      }}
    >
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <header
          style={{
            borderRadius: 32,
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(14, 116, 144, 0.14)",
            background:
              "linear-gradient(145deg, rgba(12, 74, 110, 0.96), rgba(8, 145, 178, 0.88) 48%, rgba(20, 184, 166, 0.82))",
            boxShadow: "0 24px 54px rgba(15, 23, 42, 0.18)",
            padding: 18,
          }}
          aria-label="Build Your Own Passport Trail hero"
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 82% 18%, rgba(255,255,255,0.28), transparent 22%), radial-gradient(circle at 18% 90%, rgba(250,204,21,0.22), transparent 24%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <a
                href="/traveler/passport-trails"
                aria-label="Back to Passport Trails"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 18,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.16)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.20)",
                  fontWeight: 950,
                  boxShadow: "0 12px 26px rgba(15, 23, 42, 0.16)",
                }}
              >
                ←
              </a>

              <Pill tone="gold">Premium custom trail</Pill>
            </div>

            <div style={{ marginTop: 28 }}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 950,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                Passport Trails™
              </div>

              <h1
                style={{
                  margin: "8px 0 0",
                  fontSize: 32,
                  lineHeight: 0.98,
                  letterSpacing: "-0.05em",
                  color: "#ffffff",
                  fontWeight: 950,
                }}
              >
                Build Your Own Passport Trail
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 17,
                  lineHeight: 1.18,
                  color: "#fef9c3",
                  fontWeight: 950,
                }}
              >
                Plan a curated route request.
              </p>

              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 12.5,
                  lineHeight: 1.48,
                  color: "rgba(255,255,255,0.82)",
                  fontWeight: 680,
                  maxWidth: 350,
                }}
              >
                Choose preferred Siargao stops. OSP/SPM structures the route around verified locations,
                operator support, guide support where required, pricing rules, and QR/stamp validation boundaries.
              </p>
            </div>

            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 9,
              }}
            >
              <PrimaryAction href="/traveler/passport-map" icon="🗺️">
                View map
              </PrimaryAction>
              <PrimaryAction href="/traveler/settings?panel=assistant&topic=trail" icon="✨" variant="ghost">
                Ask Kuya Tala
              </PrimaryAction>
            </div>
          </div>
        </header>

        <section
          aria-label="Curated route request rules"
          style={{
            marginTop: 14,
            borderRadius: 28,
            border: "1px solid rgba(14, 116, 144, 0.14)",
            background: "rgba(255, 255, 255, 0.86)",
            boxShadow: "0 20px 46px rgba(15, 23, 42, 0.08)",
            padding: 16,
            backdropFilter: "blur(14px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <AppIcon tone="linear-gradient(135deg, #fef3c7, #ccfbf1)">🔒</AppIcon>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "#078da0",
                }}
              >
                Governed planning preview
              </div>

              <h2
                style={{
                  margin: "5px 0 0",
                  fontSize: 20,
                  lineHeight: 1.12,
                  fontWeight: 950,
                  color: "#10234a",
                }}
              >
                Custom trail planning is premium and record-based.
              </h2>

              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  color: "rgba(15, 23, 42, 0.68)",
                  fontWeight: 720,
                }}
              >
                No booking, payment, guide assignment, QR validation, or Passport Stamp progress is created from
                this planning page yet. Confirmation happens only after pricing, operator fulfillment, guide support,
                and OSP/SPM records are ready.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-label="Route builder preview"
          style={{
            marginTop: 14,
            display: "grid",
            gap: 10,
          }}
        >
          {routeIdeas.map((item) => (
            <PremiumCard
              key={item.title}
              icon={item.icon}
              eyebrow={item.eyebrow}
              title={item.title}
              body={item.body}
            />
          ))}
        </section>

        <section
          aria-label="Featured stop candidates"
          style={{
            marginTop: 18,
            borderRadius: 30,
            background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(240,253,250,0.88))",
            border: "1px solid rgba(14, 116, 144, 0.12)",
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
            padding: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "#078da0",
                }}
              >
                Auto-populated candidates
              </div>
              <h2
                style={{
                  margin: "5px 0 0",
                  fontSize: 21,
                  lineHeight: 1.08,
                  fontWeight: 950,
                  color: "#10234a",
                }}
              >
                Stops are suggestions until governed records approve them.
              </h2>
            </div>
            <Pill tone="blue">Preview</Pill>
          </div>

          <div style={{ marginTop: 13, display: "grid", gap: 10 }}>
            {featuredStops.map((stop) => (
              <article
                key={stop.name}
                style={{
                  borderRadius: 22,
                  background: "#ffffff",
                  border: "1px solid rgba(14, 116, 144, 0.11)",
                  padding: 12,
                  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
                }}
              >
                <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                  <AppIcon>{stop.icon}</AppIcon>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 950, color: "#10234a" }}>{stop.name}</h3>
                        <p style={{ margin: "3px 0 0", fontSize: 11.5, fontWeight: 800, color: "rgba(15,23,42,0.55)" }}>
                          {stop.meta}
                        </p>
                      </div>
                      <Pill tone={stop.status === "Verified context" ? "green" : stop.status === "Review required" ? "gold" : "blue"}>
                        {stop.status}
                      </Pill>
                    </div>

                    <p style={{ margin: "8px 0 0", fontSize: 11.6, lineHeight: 1.42, fontWeight: 700, color: "rgba(15,23,42,0.64)" }}>
                      {stop.note}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-label="Guide and pricing logic" style={{ marginTop: 18, display: "grid", gap: 10 }}>
          {premiumRules.map((item) => (
            <PremiumCard key={item.title} icon={item.icon} title={item.title} body={item.body} />
          ))}
        </section>

        <section
          aria-label="Fulfillment logic"
          style={{
            marginTop: 18,
            borderRadius: 30,
            border: "1px solid rgba(14, 116, 144, 0.12)",
            background: "rgba(15, 23, 42, 0.92)",
            boxShadow: "0 22px 52px rgba(15, 23, 42, 0.18)",
            padding: 16,
            color: "#ffffff",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#67e8f9",
            }}
          >
            Fulfillment logic
          </div>
          <h2
            style={{
              margin: "6px 0 0",
              fontSize: 21,
              lineHeight: 1.08,
              fontWeight: 950,
            }}
          >
            Each stop gets classified before it becomes part of a real trip.
          </h2>

          <div style={{ marginTop: 13, display: "grid", gap: 9 }}>
            {fulfillmentCards.map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  padding: 12,
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 20, lineHeight: 1 }}>
                  {item.icon}
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 13.5, fontWeight: 950 }}>{item.title}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: 11.6, lineHeight: 1.42, color: "rgba(255,255,255,0.72)", fontWeight: 650 }}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Bottom actions"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
            padding: "10px 14px 14px",
            background: "linear-gradient(180deg, rgba(248,250,252,0), rgba(248,250,252,0.98) 30%, rgba(248,250,252,1))",
          }}
        >
          <div
            style={{
              maxWidth: 440,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 9,
            }}
          >
            <PrimaryAction href="/traveler/passport-map" icon="🗺️" variant="ghost">
              Passport Map
            </PrimaryAction>
            <PrimaryAction href="/traveler/settings?panel=assistant&topic=trail" icon="✨">
              Ask Kuya Tala
            </PrimaryAction>
          </div>
        </section>
      </div>
    </main>
  );
}
