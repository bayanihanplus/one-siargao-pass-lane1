const partnerTours = [
  {
    title: "Tri-Island Joiner",
    route: "Guyam • Daku • Naked Island",
    status: "Live",
    href: "/traveler/passport-trails/tri-island-joiner",
  },
];

const officialTrails = [
  ["Island Hopping Trail", "Active", "/traveler/passport-trails/tri-island-joiner"],
  ["Surf Explorer Trail", "Preview", "/traveler/passport-trails"],
  ["North Siargao Trail", "Preview", "/traveler/passport-trails"],
  ["Inland Discovery Trail", "Preview", "/traveler/passport-trails"],
  ["Culture & Community Trail", "Preview", "/traveler/passport-trails"],
  ["Sunset & Scenic Stops Trail", "Preview", "/traveler/passport-trails"],
  ["Adventure Trail", "Preview", "/traveler/passport-trails"],
  ["Return Traveler Continuity Trail", "Preview", "/traveler/passport-trails"],
];

export default function PassportTrailsCatalogPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(19,168,183,0.14), transparent 32%), linear-gradient(180deg, #f6fdff 0%, #ffffff 60%, #f7fbfb 100%)",
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
            gap: 12,
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
                color: "#0796a6",
              }}
            >
              Siargao Passport Map™
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontSize: 31,
                lineHeight: 0.93,
                letterSpacing: "-0.065em",
                fontWeight: 840,
              }}
            >
              Passport Trails™
            </h1>
          </div>

          <a
            href="/traveler/passport-map"
            aria-label="Back to Siargao Passport Map"
            style={{
              borderRadius: 999,
              border: "1px solid #d3eef2",
              background: "#ffffff",
              color: "#078da0",
              minHeight: 42,
              padding: "0 15px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 850,
              boxShadow: "0 8px 20px rgba(8,61,103,0.08)",
            }}
          >
            ← Map
          </a>
        </header>

        <section
          aria-label="Passport Trails catalog hero"
          style={{
            borderRadius: 26,
            background: "linear-gradient(135deg, #078da0 0%, #13a8b7 52%, #8bbf63 100%)",
            color: "#ffffff",
            padding: 18,
            minHeight: 172,
            boxShadow: "0 18px 42px rgba(8,61,103,0.18)",
            position: "relative",
            overflow: "hidden",
          }}
        >
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
            🧭 Package Catalog
          </div>

          <h2
            style={{
              margin: "14px 0 0",
              fontSize: 24,
              lineHeight: 1.04,
              letterSpacing: "-0.055em",
              fontWeight: 840,
              maxWidth: 305,
            }}
          >
            Choose a partner tour, official trail, or SPM-guided route.
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: 12.5,
              lineHeight: 1.38,
              fontWeight: 680,
              color: "rgba(255,255,255,0.9)",
              maxWidth: 318,
            }}
          >
            Pricing appears before checkout. QR, stamp, booking, and payment activation remain governed by OSP/SPM readiness.
          </p>
        </section>

        <section
          aria-label="Siargao Partner Tours"
          style={{
            marginTop: 14,
            border: "1px solid #d3eef2",
            borderRadius: 24,
            background: "rgba(255,255,255,0.98)",
            padding: 12,
            boxShadow: "0 14px 34px rgba(8,61,103,0.08)",
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 850, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0796a6" }}>
            Siargao Partner Tour
          </div>
          <h2 style={{ margin: "5px 0 10px", fontSize: 22, lineHeight: 1.02, fontWeight: 800, letterSpacing: "-0.05em" }}>
            Partner-operated tours.
          </h2>

          <div style={{ display: "grid", gap: 8 }}>
            {partnerTours.map((tour) => (
              <a
                key={tour.title}
                href={tour.href}
                aria-label={`Open ${tour.title}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 90px",
                  alignItems: "center",
                  gap: 9,
                  border: "1px solid #d3eef2",
                  borderRadius: 17,
                  background: "linear-gradient(135deg, #ffffff, #f6fdff)",
                  padding: 10,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 860, lineHeight: 1.03 }}>{tour.title}</div>
                  <div style={{ marginTop: 4, fontSize: 10.5, fontWeight: 690, color: "#607089" }}>{tour.route}</div>
                  <div style={{ marginTop: 6, display: "inline-flex", borderRadius: 999, background: "#e4fbff", padding: "3px 7px", fontSize: 8.8, fontWeight: 830, color: "#078da0" }}>
                    Stamp-ready • Partner-operated
                  </div>
                </div>

                <div
                  style={{
                    minHeight: 48,
                    borderRadius: 15,
                    background: "#13a8b7",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 880,
                  }}
                >
                  View
                </div>
              </a>
            ))}
          </div>
        </section>

        <section
          aria-label="Passport Trails Curated Tours"
          style={{
            marginTop: 14,
            border: "1px solid #d3eef2",
            borderRadius: 24,
            background: "rgba(255,255,255,0.98)",
            padding: 12,
            boxShadow: "0 14px 34px rgba(8,61,103,0.08)",
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 850, letterSpacing: "0.13em", textTransform: "uppercase", color: "#16a34a" }}>
            Passport Trails™ Curated Tour
          </div>
          <h2 style={{ margin: "5px 0 10px", fontSize: 22, lineHeight: 1.02, fontWeight: 800, letterSpacing: "-0.05em" }}>
            Official trail families.
          </h2>

          <div style={{ display: "grid", gap: 8 }}>
            {officialTrails.map(([title, status, href], index) => (
              <a
                key={title}
                href={href}
                aria-label={`Open ${title}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 78px",
                  alignItems: "center",
                  gap: 8,
                  border: index === 0 ? "1px solid #bdebd6" : "1px solid #d3eef2",
                  borderRadius: 16,
                  background: index === 0 ? "linear-gradient(135deg, #e3fff3, #f3ffff)" : "linear-gradient(135deg, #ffffff, #f7fcfd)",
                  padding: 10,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <div>
                  <div style={{ fontSize: 13.8, fontWeight: 850, lineHeight: 1.04 }}>{title}</div>
                  <div style={{ marginTop: 4, fontSize: 10.2, fontWeight: 690, color: "#607089" }}>
                    Verified Passport stamps
                  </div>
                </div>

                <div
                  style={{
                    minHeight: 38,
                    borderRadius: 13,
                    background: index === 0 ? "#16a34a" : "#e4fbff",
                    color: index === 0 ? "#ffffff" : "#078da0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 850,
                  }}
                >
                  {status}
                </div>
              </a>
            ))}
          </div>

          <div
            style={{
              marginTop: 10,
              borderRadius: 14,
              background: "#f2f6f8",
              padding: "8px 10px",
              fontSize: 9.5,
              lineHeight: 1.25,
              fontWeight: 720,
              color: "#355071",
            }}
          >
            Pricing appears before checkout. No trail should imply unpaid fulfillment unless explicitly approved.
          </div>
        </section>

        <section
          aria-label="Build Your Own Passport Trail"
          style={{
            marginTop: 14,
            border: "1px solid #d3eef2",
            borderRadius: 24,
            background: "rgba(255,255,255,0.98)",
            padding: 12,
            boxShadow: "0 14px 34px rgba(8,61,103,0.08)",
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 850, letterSpacing: "0.13em", textTransform: "uppercase", color: "#8b5cf6" }}>
            Build Your Own Passport Trail
          </div>
          <h2 style={{ margin: "5px 0 8px", fontSize: 22, lineHeight: 1.02, fontWeight: 800, letterSpacing: "-0.05em" }}>
            Plan your own route.
          </h2>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.35, color: "#607089", fontWeight: 680 }}>
            SPM route guidance first. Approved partner support may apply where transport, boat, guide, or activity service is required.
          </p>

          <a
            href="/traveler/passport-trails/diy-trail-builder"
            aria-label="Open Build Your Own Passport Trail"
            style={{
              marginTop: 12,
              minHeight: 50,
              borderRadius: 16,
              background: "#8b5cf6",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 880,
              boxShadow: "0 12px 24px rgba(139,92,246,0.22)",
            }}
          >
            Plan Route
          </a>
        </section>
      </div>
    </main>
  );
}
