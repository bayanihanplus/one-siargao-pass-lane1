/*
 * OSP-LOGIN-01E LOCK:
 * /traveler/start is the first-time traveler start surface.
 * This page does not issue OSP Pass, QR, payment, booking, manifest, or clearance.
 * It prepares the traveler for account access and the later guided trip-registration lane.
 */

const startSteps = [
  {
    icon: "▣",
    title: "Create traveler access",
    body: "Start with an account so your trip, pass, and QR readiness can stay connected.",
  },
  {
    icon: "🧭",
    title: "Add your trip details",
    body: "Arrival, departure, accommodation, and trip context come next in the guided traveler flow.",
  },
  {
    icon: "◈",
    title: "Open your OSP Pass when ready",
    body: "Your OSP Pass / QR appears only when your trip record is ready.",
  },
];

function MiniButton(props: { href: string; icon: string; children: string; variant?: "primary" | "secondary" | "dark" }) {
  const variant = props.variant ?? "primary";
  const isPrimary = variant === "primary";
  const theme =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, #078da0, #0f766e)",
          color: "#ffffff",
          border: "1px solid rgba(7,141,160,0.24)",
          shadow: "0 12px 24px rgba(7,141,160,0.20)",
        }
      : variant === "dark"
        ? {
            background: "#10234a",
            color: "#ffffff",
            border: "1px solid rgba(16,35,74,0.22)",
            shadow: "0 12px 24px rgba(16,35,74,0.18)",
          }
        : {
            background: "rgba(255,255,255,0.90)",
            color: "#075985",
            border: "1px solid rgba(14,116,144,0.16)",
            shadow: "0 8px 18px rgba(15,23,42,0.07)",
          };

  return (
    <a
      href={props.href}
      style={{
        minHeight: 42,
        borderRadius: 16,
        padding: "9px 11px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        textDecoration: "none",
        fontSize: 12.4,
        fontWeight: 950,
        background: theme.background,
        color: theme.color,
        border: theme.border,
        boxShadow: theme.shadow,
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 23,
          height: 23,
          borderRadius: 9,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: isPrimary ? "rgba(255,255,255,0.16)" : "rgba(14,165,233,0.10)",
          fontSize: 12,
          flex: "0 0 auto",
        }}
      >
        {props.icon}
      </span>
      <span>{props.children}</span>
      {isPrimary ? <span aria-hidden="true">→</span> : null}
    </a>
  );
}

function Pill(props: { children: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        borderRadius: 999,
        padding: "6px 9px",
        background: "rgba(14,165,233,0.10)",
        color: "#0369a1",
        border: "1px solid rgba(14,165,233,0.18)",
        fontSize: 11,
        fontWeight: 950,
      }}
    >
      {props.children}
    </span>
  );
}

export default function TravelerStartPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 14% -2%, rgba(45,212,191,0.24), transparent 34%), radial-gradient(circle at 96% 2%, rgba(251,191,36,0.20), transparent 30%), linear-gradient(180deg, #f8fdff 0%, #eefbf7 44%, #f8fafc 100%)",
        color: "#10234a",
        padding: "14px 12px 92px",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <header
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 30,
            background:
              "linear-gradient(145deg, rgba(12,74,110,0.98), rgba(8,145,178,0.92), rgba(20,184,166,0.82))",
            boxShadow: "0 22px 50px rgba(15,23,42,0.19)",
            padding: 16,
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <a
              href="/login"
              aria-label="Back to traveler access"
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
            <span
              style={{
                borderRadius: 999,
                padding: "6px 9px",
                background: "rgba(255,255,255,0.16)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.24)",
                fontSize: 11,
                fontWeight: 950,
              }}
            >
              First-time traveler
            </span>
          </div>

          <div style={{ marginTop: 22 }}>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 950,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.78)",
              }}
            >
              One Siargao Pass
            </div>
            <h1 style={{ margin: "7px 0 0", fontSize: 31, lineHeight: 1, letterSpacing: "-0.045em", fontWeight: 950 }}>
              Start your OSP Pass
            </h1>
            <p style={{ margin: "10px 0 0", color: "#fef9c3", fontSize: 15.8, lineHeight: 1.22, fontWeight: 950 }}>
              Prepare your traveler access before your trip continues.
            </p>
            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.84)", fontSize: 12.8, lineHeight: 1.42, fontWeight: 700 }}>
              This starts the first-time traveler path. It does not issue a pass or QR yet.
            </p>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <MiniButton href="/login?mode=traveler" icon="▣">Sign in</MiniButton>
            <MiniButton href="/traveler/passport-map" icon="🗺️" variant="secondary">Preview map</MiniButton>
          </div>
        </header>

        <section
          style={{
            marginTop: 13,
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,253,250,0.92))",
            border: "1px solid rgba(14,116,144,0.14)",
            boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
            padding: 14,
          }}
        >
          <Pill>What happens next</Pill>
          <h2 style={{ margin: "8px 0 0", fontSize: 20, lineHeight: 1.1, fontWeight: 950 }}>
            Start simple. Continue when your trip details are ready.
          </h2>

          <div style={{ marginTop: 12, display: "grid", gap: 9 }}>
            {startSteps.map((step) => (
              <article
                key={step.title}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  borderRadius: 19,
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(14,116,144,0.11)",
                  padding: 11,
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 16,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(14,165,233,0.10)",
                    color: "#0369a1",
                    fontSize: 18,
                    flex: "0 0 auto",
                    boxShadow: "0 8px 16px rgba(15,23,42,0.07)",
                  }}
                >
                  {step.icon}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14.5, lineHeight: 1.12, fontWeight: 950 }}>
                    {step.title}
                  </h3>
                  <p style={{ margin: "5px 0 0", fontSize: 12.3, lineHeight: 1.38, color: "rgba(15,23,42,0.64)", fontWeight: 720 }}>
                    {step.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: 13,
            borderRadius: 24,
            background: "rgba(15,23,42,0.96)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 18px 42px rgba(15,23,42,0.20)",
            padding: 14,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, lineHeight: 1.1, fontWeight: 950 }}>
            Pass and QR are not instant.
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 12.5, lineHeight: 1.42, color: "rgba(255,255,255,0.74)", fontWeight: 720 }}>
            OSP Pass / QR access depends on your trip record. Continue to sign in first, then complete the traveler path when registration is enabled.
          </p>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <MiniButton href="/login?mode=traveler" icon="▣">Continue</MiniButton>
            <MiniButton href="/traveler/pass" icon="◈" variant="secondary">View pass</MiniButton>
          </div>
        </section>
      </div>
    </main>
  );
}
