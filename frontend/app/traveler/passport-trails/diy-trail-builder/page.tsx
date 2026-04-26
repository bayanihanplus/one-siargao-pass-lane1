import { SpmScanQrCta } from "../../../../src/spm/scan/SpmScanQrCta";
export default function BuildYourOwnPassportTrailPage() {
  const routeIdeas = [
    {
      label: "Start point",
      title: "Choose your first stop",
      detail: "Pick a verified Siargao stop as your route anchor.",
      status: "Planning",
    },
    {
      label: "Route support",
      title: "SPM guidance first",
      detail: "SPM helps shape the route before partner support is needed.",
      status: "SPM",
    },
    {
      label: "Commercial readiness",
      title: "Pricing appears before checkout",
      detail: "Transport, boat, guide, or activity fees apply only when required.",
      status: "Gated",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(19,168,183,0.16), transparent 32%), linear-gradient(180deg, #f6fdff 0%, #ffffff 60%, #f7fbfb 100%)",
        color: "#14264b",
        fontFamily: 'Arial, "Helvetica Neue", sans-serif',
        padding: "18px 14px 110px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 850,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#7048e8",
              }}
            >
              Build Your Own Passport Trail
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontSize: 28,
                lineHeight: 0.98,
                letterSpacing: "-0.06em",
                fontWeight: 820,
              }}
            >
              Plan your route.
            </h1>
          </div>

          <a
            href="/traveler/passport-map"
            aria-label="Back to Siargao Passport Map"
            style={{
              borderRadius: 999,
              border: "1px solid #bfe7ee",
              background: "linear-gradient(135deg, #ffffff, #f3fcfd)",
              color: "#067889",
              minHeight: 42,
              padding: "0 15px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 11.6,
              fontWeight: 850,
              boxShadow: "0 14px 32px rgba(8,61,103,0.11)",
            }}
          >
            ← Map
          </a>
        </header>

        <SpmScanQrCta
          source="diy-trail-builder"
          eyebrow="DIY Verified Stops"
          title="Scan QR at verified stop"
          body="Use this only after choosing a verified stop or approved operator point. DIY progress must still come from governed QR validation."
          cta="Scan"
        />


        <section
          aria-label="Build Your Own Passport Trail hero"
          style={{
            borderRadius: 26,
            background: "linear-gradient(135deg, #8b5cf6 0%, #13a8b7 100%)",
            color: "#ffffff",
            padding: 13,
            minHeight: 184,
            boxShadow: "0 18px 42px rgba(8,61,103,0.18)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -34,
              top: -34,
              width: 116,
              height: 116,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.32)",
            }}
          />

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              borderRadius: 999,
              background: "rgba(255,255,255,0.18)",
              padding: "7px 10px",
              fontSize: 10,
              fontWeight: 850,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            🧩 Planning Preview
          </div>

          <h2
            style={{
              margin: "14px 0 0",
              fontSize: 25,
              lineHeight: 1.02,
              letterSpacing: "-0.055em",
              fontWeight: 840,
              maxWidth: 280,
            }}
          >
            Build a personal Passport Trail with SPM guidance.
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: 12.1,
              lineHeight: 1.38,
              fontWeight: 680,
              color: "rgba(255,255,255,0.9)",
              maxWidth: 315,
            }}
          >
            Route planning starts here. Partner support only applies when transport, boat, guide, or activity service is required.
          </p>
        </section>

        <section
          aria-label="Route planning steps"
          style={{
            marginTop: 10,
            border: "1px solid #bfe7ee",
            borderRadius: 24,
            background: "linear-gradient(135deg, rgba(255,255,255,0.99), rgba(244,253,255,0.94))",
            padding: 11,
            boxShadow: "0 16px 38px rgba(8,61,103,0.10)",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 850,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#0796a6",
            }}
          >
            Route Builder
          </div>

          <h2
            style={{
              margin: "5px 0 10px",
              fontSize: 21,
              lineHeight: 1.03,
              fontWeight: 800,
              letterSpacing: "-0.045em",
            }}
          >
            Start with a route idea.
          </h2>

          <div style={{ display: "grid", gap: 8 }}>
            {routeIdeas.map((item) => (
              <div
                key={item.title}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 84px",
                  gap: 8,
                  alignItems: "center",
                  border: "1px solid #bfe7ee",
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #ffffff, #f7fcfd)",
                  padding: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 8.3,
                      fontWeight: 850,
                      letterSpacing: "0.11em",
                      textTransform: "uppercase",
                      color: "#7048e8",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 14.5,
                      lineHeight: 1.05,
                      fontWeight: 840,
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 10.2,
                      lineHeight: 1.18,
                      fontWeight: 670,
                      color: "#53657d",
                    }}
                  >
                    {item.detail}
                  </div>
                </div>

                <div
                  style={{
                    minHeight: 42,
                    borderRadius: 14,
                    background: "linear-gradient(135deg, #f1edff, #ffffff)",
                    color: "#7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: 850,
                  }}
                >
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Passport Assistant route support"
          style={{
            marginTop: 10,
            borderRadius: 24,
            background: "linear-gradient(135deg, #ffffff, #ecfeff)",
            border: "1px solid #bfe7ee",
            padding: 13,
            boxShadow: "0 16px 38px rgba(8,61,103,0.10)",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 850,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#0796a6",
            }}
          >
            Passport Assistant
          </div>
          <h2
            style={{
              margin: "5px 0 7px",
              fontSize: 21,
              lineHeight: 1.03,
              fontWeight: 800,
              letterSpacing: "-0.045em",
            }}
          >
            Ask what route fits your trip.
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 11.6,
              lineHeight: 1.34,
              color: "#53657d",
              fontWeight: 680,
            }}
          >
            The assistant should guide trail choice, stop logic, QR verification, and event-linked recommendations.
          </p>

          <a
            href="/traveler/passport-map"
            aria-label="Ask Passport Assistant from Passport Map"
            style={{
              marginTop: 10,
              minHeight: 48,
              borderRadius: 16,
              background: "linear-gradient(135deg, #14b8c6, #078da0)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 11.6,
              fontWeight: 880,
              boxShadow: "0 12px 24px rgba(19,168,183,0.22)",
            }}
          >
            ✦ Ask Passport Assistant
          </a>
        </section>
      </div>
    </main>
  );
}
