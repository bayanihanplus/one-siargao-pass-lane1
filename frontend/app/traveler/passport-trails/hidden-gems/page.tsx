import Link from "next/link";

const trail = {
  eyebrow: "PASSPORT TRAIL FAMILY",
  title: "Hidden Gems Trail",
  subtitle: "Curated discoveries • lesser-known stops",
  icon: "⭐",
  status: "Preview",
  tone: "#8b5cf6",
  summary: "A future curated journey for verified lesser-known stops once governance, operators, and QR rules are ready.",
  stops: [
    { name: "Curated Discovery", note: "Preview node", status: "Preview" },
    { name: "Hidden Viewpoint", note: "Coming later", status: "Coming" },
    { name: "Local Secret Stop", note: "Governed later", status: "Coming" },
  ],
};

export default function TrailFamilyPreviewPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(19,168,183,0.16), transparent 34%), linear-gradient(180deg, #f6fbfc 0%, #ffffff 72%)",
        color: "#14264b",
        fontFamily: "\"Source Sans 3\", \"Source Sans Pro\", \"Noto Sans\", Arial, sans-serif",
        padding: "18px 14px 92px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 720,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: "#0796a6",
              }}
            >
              {trail.eyebrow}
            </div>
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
              background: "rgba(255,255,255,0.86)",
              color: "#0796a6",
              padding: "10px 14px",
              fontSize: 12,
              fontWeight: 720,
              whiteSpace: "nowrap",
            }}
          >
            ← Trails
          </Link>
        </header>

        <section
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
          <div style={{ fontSize: 32, lineHeight: 1 }}>{trail.icon}</div>
          <div
            style={{
              marginTop: 12,
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
            {trail.status} Family
          </div>
          <h2
            style={{
              margin: "12px 0 8px",
              fontSize: 24,
              lineHeight: 1.08,
              fontWeight: 690,
              letterSpacing: "-0.035em",
            }}
          >
            {trail.subtitle}
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
            {trail.summary}
          </p>
        </section>

        <section
          style={{
            marginTop: 16,
            border: "1px solid #d3eef2",
            borderRadius: 24,
            background: "rgba(255,255,255,0.9)",
            padding: 16,
            boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 720,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#0796a6",
            }}
          >
            Trail Stops Preview
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            {trail.stops.map((stop, index) => (
              <div
                key={stop.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr auto",
                  alignItems: "center",
                  gap: 10,
                  border: "1px solid rgba(11,151,166,0.14)",
                  borderRadius: 18,
                  background: "rgba(248,252,252,0.9)",
                  padding: 11,
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: trail.tone,
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 720,
                  }}
                >
                  {index + 1}
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 690, lineHeight: 1.16 }}>{stop.name}</div>
                  <div style={{ marginTop: 3, fontSize: 10.5, fontWeight: 600, color: "#607089" }}>
                    {stop.note}
                  </div>
                </div>
                <span
                  style={{
                    borderRadius: 999,
                    padding: "5px 8px",
                    background: stop.status === "Preview" ? "#dff8ff" : "#edf2f5",
                    color: stop.status === "Preview" ? "#078da0" : "#718096",
                    fontSize: 8.5,
                    fontWeight: 720,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {stop.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: 16,
            border: "1px solid #d3eef2",
            borderRadius: 24,
            background: "linear-gradient(135deg, rgba(240,253,255,0.96), rgba(238,248,239,0.92))",
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 720,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#0796a6",
            }}
          >
            Activation Status
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 12.5, lineHeight: 1.42, fontWeight: 600, color: "#355071" }}>
            This family is exposed for traveler discovery. Booking, payment, QR unlocking, and operator fulfillment remain locked until governed readiness is active.
          </p>
        </section>
      </div>
    </main>
  );
}
