const routeOptions = [
  {
    icon: "🌅",
    title: "Sunset + Scenic Trail",
    badge: "Soft route",
    body: "Shape a route around golden-hour stops, scenic anchors, and low-friction land movement.",
    cta: "View stop ideas",
    href: "#stop-candidates",
  },
  {
    icon: "🌊",
    title: "Surf + Coastal Trail",
    badge: "Active route",
    body: "Plan around surf culture, coastal movement, and nearby verified stop candidates.",
    cta: "Compare support needs",
    href: "#support-level",
  },
  {
    icon: "🚐",
    title: "Operator-Supported Route",
    badge: "Support required",
    body: "Use this when transport, guide support, boat access, or activity fulfillment may be required.",
    cta: "See next steps",
    href: "#next-steps",
  },
];

const travelerModes = [
  {
    icon: "🧘",
    title: "Relaxed Explorer",
    body: "Slow pacing, fewer stops, more time for photos, food, and downtime.",
    tag: "Low intensity",
  },
  {
    icon: "📸",
    title: "Scenic Hunter",
    body: "Prioritizes viewpoints, sunset timing, photogenic stops, and smooth routing.",
    tag: "Photo-first",
  },
  {
    icon: "🏄",
    title: "Active Island Day",
    body: "More movement, surf/coastal energy, and operator support when required.",
    tag: "High energy",
  },
];

const supportLevels = [
  {
    icon: "🚶",
    title: "Self-guided where possible",
    body: "Good for accessible stops. No operator or guide is implied until records require it.",
  },
  {
    icon: "🚐",
    title: "Transport-supported",
    body: "Useful when distance, route timing, or multiple stops require local support.",
  },
  {
    icon: "🧑‍✈️",
    title: "Guide-supported",
    body: "Guide support is provided where required. Assignment appears only after operator confirmation.",
  },
];

const engagementSteps = [
  "Choose your route style",
  "Select the kind of support you may need",
  "Shape with Kuya Tala™ to shape the request",
  "Wait for pricing, operator, and guide validation before confirmation",
];

const stopCards = [
  {
    icon: "🌉",
    title: "Catangnan Bridge",
    subtitle: "Scenic anchor",
    status: "Candidate",
    body: "Good for sunset/scenic routing after governed validation.",
  },
  {
    icon: "🏄",
    title: "Cloud 9 Zone",
    subtitle: "Surf + sunset context",
    status: "Strong anchor",
    body: "Useful as a surf, scenic, or nearby movement anchor depending on route design.",
  },
  {
    icon: "🥥",
    title: "Coconut Road",
    subtitle: "Route corridor",
    status: "Review",
    body: "Route use depends on approved stop records and local validation.",
  },
];

const engagementActions = [
  {
    icon: "🧭",
    title: "Choose your style",
    body: "Choose the kind of trail you want before any fulfillment request is created.",
  },
  {
    icon: "🧑‍✈️",
    title: "Guide support check",
    body: "Guide support is provided where required, but guide details appear only after operator confirmation.",
  },
  {
    icon: "💸",
    title: "Specialized pricing",
    body: "Custom route planning may cost more than fixed-route tours because support, transport, and validation rules may apply.",
  },
  {
    icon: "🪪",
    title: "Stamp eligibility",
    body: "Passport Stamps count only after approved OSP/SPM QR or validation records.",
  },
];

const bottomRules = [
  "No booking or payment is created here.",
  "No guide is assigned from this planning screen.",
  "No Passport Stamp progress is created from selecting a card.",
];

function IconBubble(props: { icon: string; tone?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 42,
        height: 42,
        borderRadius: 18,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        background: props.tone || "linear-gradient(135deg, #e0f7fa, #ecfdf5)",
        boxShadow: "0 12px 26px rgba(15, 23, 42, 0.10)",
        fontSize: 19,
      }}
    >
      {props.icon}
    </span>
  );
}

function Pill(props: { children: string; tone?: "teal" | "gold" | "green" | "slate" }) {
  const theme = {
    teal: ["rgba(8,145,178,0.11)", "#0e7490", "rgba(8,145,178,0.18)"],
    gold: ["rgba(217,119,6,0.12)", "#92400e", "rgba(217,119,6,0.18)"],
    green: ["rgba(22,163,74,0.11)", "#166534", "rgba(22,163,74,0.18)"],
    slate: ["rgba(15,23,42,0.06)", "#334155", "rgba(15,23,42,0.10)"],
  }[props.tone || "slate"];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "7px 10px",
        background: theme[0],
        color: theme[1],
        border: `1px solid ${theme[2]}`,
        fontSize: 10.5,
        fontWeight: 950,
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      {props.children}
    </span>
  );
}

function ButtonLink(props: {
  href: string;
  icon: string;
  children: string;
  variant?: "primary" | "secondary" | "dark";
  ariaLabel?: string;
}) {
  const variant = props.variant || "primary";
  const styles =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, #078da0, #0f766e)",
          color: "#ffffff",
          border: "1px solid rgba(7,141,160,0.26)",
          shadow: "0 16px 32px rgba(7,141,160,0.24)",
        }
      : variant === "dark"
        ? {
            background: "#10234a",
            color: "#ffffff",
            border: "1px solid rgba(16,35,74,0.22)",
            shadow: "0 16px 32px rgba(16,35,74,0.22)",
          }
        : {
            background: "rgba(255,255,255,0.84)",
            color: "#075985",
            border: "1px solid rgba(14,116,144,0.16)",
            shadow: "0 12px 24px rgba(15,23,42,0.08)",
          };

  return (
    <a
      href={props.href}
      aria-label={props.ariaLabel || props.children}
      style={{
        minHeight: 46,
        borderRadius: 999,
        padding: "12px 15px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        textDecoration: "none",
        fontSize: 12.5,
        fontWeight: 950,
        background: styles.background,
        color: styles.color,
        border: styles.border,
        boxShadow: styles.shadow,
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden="true">{props.icon}</span>
      <span>{props.children}</span>
    </a>
  );
}

function RouteOptionCard(props: {
  icon: string;
  title: string;
  badge: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <article
      style={{
        borderRadius: 28,
        border: "1px solid rgba(14,116,144,0.14)",
        background: "rgba(255,255,255,0.90)",
        boxShadow: "0 20px 44px rgba(15,23,42,0.09)",
        padding: 15,
        backdropFilter: "blur(16px)",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <IconBubble icon={props.icon} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
            <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.12, fontWeight: 950, color: "#10234a" }}>
              {props.title}
            </h3>
            <Pill tone="teal">{props.badge}</Pill>
          </div>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 12.2,
              lineHeight: 1.45,
              color: "rgba(15,23,42,0.66)",
              fontWeight: 700,
            }}
          >
            {props.body}
          </p>

          <div style={{ marginTop: 12 }}>
            <ButtonLink href={props.href} icon="✨" variant="secondary">
              {props.cta}
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}

function StopCard(props: { icon: string; title: string; subtitle: string; status: string; body: string }) {
  return (
    <article
      style={{
        minWidth: 252,
        maxWidth: 252,
        borderRadius: 26,
        border: "1px solid rgba(14,116,144,0.13)",
        background: "#ffffff",
        boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
        padding: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <IconBubble icon={props.icon} />
        <Pill tone={props.status === "Strong anchor" ? "green" : props.status === "Review" ? "gold" : "teal"}>
          {props.status}
        </Pill>
      </div>
      <h3 style={{ margin: "13px 0 0", fontSize: 16, fontWeight: 950, color: "#10234a" }}>{props.title}</h3>
      <p style={{ margin: "4px 0 0", fontSize: 11.4, color: "rgba(15,23,42,0.55)", fontWeight: 850 }}>
        {props.subtitle}
      </p>
      <p style={{ margin: "9px 0 0", fontSize: 11.8, lineHeight: 1.43, color: "rgba(15,23,42,0.66)", fontWeight: 700 }}>
        {props.body}
      </p>
    </article>
  );
}

function EngagementCard(props: { icon: string; title: string; body: string }) {
  return (
    <div
      style={{
        borderRadius: 24,
        background: "rgba(255,255,255,0.86)",
        border: "1px solid rgba(14,116,144,0.12)",
        boxShadow: "0 14px 32px rgba(15,23,42,0.07)",
        padding: 13,
        display: "flex",
        gap: 11,
        alignItems: "flex-start",
      }}
    >
      <IconBubble icon={props.icon} />
      <div>
        <h3 style={{ margin: 0, fontSize: 14.2, lineHeight: 1.15, fontWeight: 950, color: "#10234a" }}>
          {props.title}
        </h3>
        <p style={{ margin: "6px 0 0", fontSize: 11.7, lineHeight: 1.43, fontWeight: 700, color: "rgba(15,23,42,0.64)" }}>
          {props.body}
        </p>
      </div>
    </div>
  );
}

function ModeCard(props: { icon: string; title: string; body: string; tag: string }) {
  return (
    <article
      style={{
        borderRadius: 26,
        border: "1px solid rgba(14,116,144,0.13)",
        background: "rgba(255,255,255,0.90)",
        boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
        padding: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
        <IconBubble icon={props.icon} />
        <Pill tone="gold">{props.tag}</Pill>
      </div>
      <h3 style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.12, fontWeight: 950, color: "#10234a" }}>
        {props.title}
      </h3>
      <p style={{ margin: "7px 0 0", fontSize: 11.8, lineHeight: 1.43, color: "rgba(15,23,42,0.65)", fontWeight: 700 }}>
        {props.body}
      </p>
    </article>
  );
}

function SupportCard(props: { icon: string; title: string; body: string }) {
  return (
    <article
      style={{
        borderRadius: 24,
        border: "1px solid rgba(14,116,144,0.12)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(240,253,250,0.88))",
        boxShadow: "0 14px 34px rgba(15,23,42,0.07)",
        padding: 13,
        display: "flex",
        gap: 11,
        alignItems: "flex-start",
      }}
    >
      <IconBubble icon={props.icon} />
      <div>
        <h3 style={{ margin: 0, fontSize: 14.2, lineHeight: 1.15, fontWeight: 950, color: "#10234a" }}>
          {props.title}
        </h3>
        <p style={{ margin: "6px 0 0", fontSize: 11.7, lineHeight: 1.43, fontWeight: 700, color: "rgba(15,23,42,0.64)" }}>
          {props.body}
        </p>
      </div>
    </article>
  );
}

function StepRail() {
  return (
    <div style={{ display: "grid", gap: 9 }}>
      {engagementSteps.map((step, index) => (
        <div
          key={step}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            borderRadius: 18,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.10)",
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
              flex: "0 0 auto",
              background: "rgba(103,232,249,0.16)",
              color: "#67e8f9",
              fontSize: 11,
              fontWeight: 950,
            }}
          >
            {index + 1}
          </span>
          <span style={{ fontSize: 11.8, lineHeight: 1.35, color: "rgba(255,255,255,0.78)", fontWeight: 780 }}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function BuildYourOwnPassportTrailPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 15% 0%, rgba(45,212,191,0.22), transparent 36%), radial-gradient(circle at 96% 6%, rgba(251,191,36,0.18), transparent 32%), linear-gradient(180deg, #f8fdff 0%, #eefbf7 46%, #f8fafc 100%)",
        padding: "18px 14px 102px",
        color: "#10234a",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <header
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 34,
            border: "1px solid rgba(14,116,144,0.16)",
            background:
              "linear-gradient(145deg, rgba(12,74,110,0.98), rgba(8,145,178,0.92) 48%, rgba(20,184,166,0.82))",
            boxShadow: "0 26px 58px rgba(15,23,42,0.20)",
            padding: 18,
          }}
          aria-label="Build Your Own Passport Trail hero"
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 83% 16%, rgba(255,255,255,0.28), transparent 22%), radial-gradient(circle at 18% 92%, rgba(250,204,21,0.22), transparent 24%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <a
                href="/traveler/passport-trails"
                aria-label="Back to Passport Trails"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 18,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.16)",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.22)",
                  fontWeight: 950,
                  fontSize: 18,
                  boxShadow: "0 12px 26px rgba(15,23,42,0.16)",
                }}
              >
                ←
              </a>
              <Pill tone="gold">Specialized trip</Pill>
            </div>

            <div style={{ marginTop: 26 }}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 950,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.78)",
                }}
              >
                Passport Trails™ Custom
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
                  color: "rgba(255,255,255,0.83)",
                  fontWeight: 700,
                  maxWidth: 360,
                }}
              >
                Build a route around how you actually want to experience Siargao: scenic, active, relaxed, or support-assisted.
                Kuya Tala™ can help shape the request while fulfillment, guide support, pricing, payment, and stamp validation remain record-based.
              </p>
            </div>

            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 9 }}>
              <ButtonLink href="#traveler-style" icon="🧭" variant="primary">
                Choose your style
              </ButtonLink>
              <ButtonLink href="/traveler/settings?panel=assistant&topic=trail" icon="✨" variant="secondary">
                Shape with Kuya Tala
              </ButtonLink>
            </div>
          </div>
        </header>

        <section
          aria-label="Engagement summary"
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          {[
            ["🧭", "Route", "curated"],
            ["🧑‍✈️", "Guide", "provided"],
            ["💸", "Price", "specialized"],
          ].map(([icon, label, value]) => (
            <div
              key={label}
              style={{
                borderRadius: 22,
                background: "rgba(255,255,255,0.86)",
                border: "1px solid rgba(14,116,144,0.12)",
                boxShadow: "0 14px 30px rgba(15,23,42,0.07)",
                padding: "12px 9px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 19 }}>{icon}</div>
              <div style={{ marginTop: 5, fontSize: 10, fontWeight: 950, color: "#078da0", textTransform: "uppercase" }}>
                {label}
              </div>
              <div style={{ marginTop: 2, fontSize: 11, fontWeight: 900, color: "#10234a" }}>{value}</div>
            </div>
          ))}
        </section>


        <section
          id="traveler-style"
          aria-label="Traveler style selector"
          style={{
            marginTop: 18,
            display: "grid",
            gap: 11,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
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
                What kind of trip?
              </div>
              <h2 style={{ margin: "5px 0 0", fontSize: 22, lineHeight: 1.06, fontWeight: 950, color: "#10234a" }}>
                Pick the traveler mood first.
              </h2>
            </div>
            <Pill tone="gold">Personalized</Pill>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
            {travelerModes.map((item) => (
              <ModeCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section
          id="route-options"
          aria-label="Route option cards"
          style={{
            marginTop: 18,
            display: "grid",
            gap: 11,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
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
                Start here
              </div>
              <h2 style={{ margin: "5px 0 0", fontSize: 22, lineHeight: 1.06, fontWeight: 950, color: "#10234a" }}>
                Choose the route style.
              </h2>
            </div>
            <Pill tone="teal">Preview only</Pill>
          </div>

          {routeOptions.map((item) => (
            <RouteOptionCard key={item.title} {...item} />
          ))}
        </section>

        <section
          id="stop-candidates"
          aria-label="Stop candidate carousel"
          style={{
            marginTop: 20,
            borderRadius: 30,
            background: "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(240,253,250,0.90))",
            border: "1px solid rgba(14,116,144,0.13)",
            boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
            padding: 15,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
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
              <h2 style={{ margin: "5px 0 0", fontSize: 21, lineHeight: 1.08, fontWeight: 950, color: "#10234a" }}>
                Featured stop ideas.
              </h2>
              <p style={{ margin: "7px 0 0", fontSize: 11.8, lineHeight: 1.42, fontWeight: 700, color: "rgba(15,23,42,0.62)" }}>
                These are engagement cards. Stops become usable only when governed records allow them.
              </p>
            </div>
            <ButtonLink href="/traveler/passport-map" icon="🗺️" variant="secondary">
              Open map
            </ButtonLink>
          </div>

          <div
            style={{
              marginTop: 13,
              display: "flex",
              gap: 11,
              overflowX: "auto",
              paddingBottom: 4,
              scrollSnapType: "x mandatory",
            }}
          >
            {stopCards.map((item) => (
              <div key={item.title} style={{ scrollSnapAlign: "start" }}>
                <StopCard {...item} />
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Engagement cards"
          style={{
            marginTop: 18,
            display: "grid",
            gap: 10,
          }}
        >
          {engagementActions.map((item) => (
            <EngagementCard key={item.title} {...item} />
          ))}
        </section>


        <section
          id="support-level"
          aria-label="Support level selector"
          style={{
            marginTop: 18,
            display: "grid",
            gap: 10,
          }}
        >
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
              Support level
            </div>
            <h2 style={{ margin: "5px 0 0", fontSize: 22, lineHeight: 1.06, fontWeight: 950, color: "#10234a" }}>
              Decide how much help the route may need.
            </h2>
          </div>

          {supportLevels.map((item) => (
            <SupportCard key={item.title} {...item} />
          ))}
        </section>

        <section
          id="next-steps"
          aria-label="Safe action boundary"
          style={{
            marginTop: 18,
            borderRadius: 30,
            background: "rgba(15,23,42,0.94)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 24px 54px rgba(15,23,42,0.20)",
            padding: 16,
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
            What happens next
          </div>
          <h2 style={{ margin: "6px 0 0", fontSize: 21, lineHeight: 1.08, fontWeight: 950 }}>
            This is a planning request, not a live booking.
          </h2>
          <div style={{ marginTop: 13 }}>
            <StepRail />
          </div>

          <div style={{ marginTop: 13 }}>
            <ButtonLink href="/traveler/settings?panel=assistant&topic=trail" icon="✨" variant="secondary">
              Need help shaping it?
            </ButtonLink>
          </div>

          <div style={{ marginTop: 13, display: "grid", gap: 8 }}>
            {bottomRules.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  padding: "10px 11px",
                  fontSize: 11.8,
                  lineHeight: 1.42,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.76)",
                }}
              >
                <span aria-hidden="true">✓</span>
                <span>{item}</span>
              </div>
            ))}
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
            padding: "10px 14px 14px",
            background: "linear-gradient(180deg, rgba(248,250,252,0), rgba(248,250,252,0.98) 30%, rgba(248,250,252,1))",
          }}
        >
          <div
            style={{
              maxWidth: 460,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 9,
            }}
          >
            <ButtonLink href="/traveler/passport-trails" icon="🏝️" variant="secondary">
              Trail catalog
            </ButtonLink>
            <ButtonLink href="/traveler/passport-map" icon="🗺️" variant="primary">
              Open map
            </ButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
