import Link from "next/link";

const chips = ["Hotels", "Resorts", "Villas", "Hostels", "Homestays", "Guesthouses"];

export default function StaysExplorePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(32,169,183,0.18), transparent 34%), linear-gradient(180deg, #f7fcff 0%, #eef8fb 52%, #f8fafc 100%)",
        padding: "18px 14px 30px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <div style={{ marginBottom: 14 }}>
          <Link href="/traveler/explore" style={backLinkStyle}>
            ← Back to Explore
          </Link>
        </div>

        <header style={heroStyle}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.86 }}>
            Places to stay
          </p>
          <h1 style={{ margin: "8px 0 0", fontSize: 30, lineHeight: 1, letterSpacing: "-0.055em", fontWeight: 950 }}>
            Stay in Siargao
          </h1>
          <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.45, fontWeight: 750, color: "rgba(255,255,255,0.86)" }}>
            Discover hotels, resorts, villas, hostels, homestays, and guesthouses once approved stay listings are ready for traveler discovery.
          </p>
        </header>

        <section style={{ marginTop: 14, border: "1px solid rgba(15,118,140,0.14)", borderRadius: 22, background: "rgba(255,255,255,0.94)", padding: 16, boxShadow: "0 14px 32px rgba(15,23,42,0.06)" }}>
          <p style={{ margin: 0, color: "#0f7890", fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Trust & Readiness
          </p>
          <p style={{ margin: "7px 0 0", color: "rgba(16,35,63,0.72)", fontSize: 13, lineHeight: 1.45, fontWeight: 750 }}>
            Stay listings should show readiness, availability, terms, location clarity, and booking confidence before they become active.
          </p>
        </section>

        <section style={{ marginTop: 14 }}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
            {chips.map((chip) => (
              <span
                key={chip}
                style={{ flex: "0 0 auto", borderRadius: 999, background: "#ffffff", border: "1px solid rgba(47,127,178,0.14)", color: "#0b355f", padding: "8px 10px", fontSize: 12, fontWeight: 900 }}
              >
                {chip}
              </span>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 14, border: "1px solid rgba(36,191,209,0.20)", borderRadius: 24, background: "rgba(255,255,255,0.92)", padding: 18, boxShadow: "0 16px 40px rgba(15,23,42,0.07)" }}>
          <p style={{ margin: 0, color: "#0f7890", fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Empty State
          </p>
          <h2 style={{ margin: "6px 0 0", color: "#10233f", fontSize: 22, lineHeight: 1.08, fontWeight: 950, letterSpacing: "-0.035em" }}>
            Nothing live yet.
          </h2>
          <p style={{ margin: "8px 0 0", color: "rgba(16,35,63,0.72)", fontSize: 14, lineHeight: 1.45, fontWeight: 700 }}>
            No stay listings are live yet. Approved accommodation partners will appear here after readiness and visibility checks.
          </p>

          <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
            <Link href="/traveler/explore" style={primaryActionStyle}>
              Back to Explore
            </Link>
            <Link href="/traveler/trips" style={secondaryActionStyle}>
              View Trips
            </Link>
          </div>
        </section>

        <section style={{ marginTop: 14, borderRadius: 20, background: "#e0f7fb", border: "1px solid rgba(36,191,209,0.22)", color: "#0b355f", padding: 14, fontSize: 13, lineHeight: 1.4, fontWeight: 750 }}>
          <strong>Request Availability</strong>
          <span> will activate only when approved, DB-backed services are available.</span>
        </section>
      </div>
    </main>
  );
}


const backLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 40,
  padding: "0 14px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(47,127,178,0.16)",
  color: "#0b355f",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 900,
  boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
} as const;

const heroStyle = {
  borderRadius: 30,
  background: "linear-gradient(135deg, #073b63 0%, #0f7890 58%, #24bfd1 100%)",
  color: "#ffffff",
  padding: 22,
  boxShadow: "0 22px 50px rgba(7,59,99,0.24)",
} as const;

const primaryActionStyle = {
  minHeight: 48,
  borderRadius: 18,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  background: "linear-gradient(135deg, #134f7f, #20a9b7)",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.24)",
  fontSize: 14,
  fontWeight: 950,
} as const;

const secondaryActionStyle = {
  ...primaryActionStyle,
  background: "rgba(255,255,255,0.94)",
  color: "#0b355f",
  border: "1px solid rgba(47,127,178,0.16)",
} as const;

