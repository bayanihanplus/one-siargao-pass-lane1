import Link from "next/link";

export const dynamic = "force-dynamic";

type StayPreview = {
  slug: string;
  name: string;
  type: string;
  location: string;
  areaHint: string;
  priceLabel: string;
  ratingLabel: string;
  readinessLabel: string;
  settlementLabel: string;
  tags: string[];
  gradient: string;
};

const stayTypes = ["All", "Hotels", "Resorts", "Villas", "Hostels", "Homestays", "Guesthouses"];

const previewStays: StayPreview[] = [
  {
    slug: "preview-general-luna-surf-stay",
    name: "General Luna Surf Stay",
    type: "Homestay / Surf Stay",
    location: "General Luna",
    areaHint: "near surf access",
    priceLabel: "PHP 2,500/night",
    ratingLabel: "★ 4.8",
    readinessLabel: "Stay-ready",
    settlementLabel: "Request first",
    tags: ["Surf access", "QR stay capable"],
    gradient: "linear-gradient(135deg, #013863 0%, #003B66 62%, #014B78 100%)",
  },
  {
    slug: "preview-cloud-9-family-villa",
    name: "Cloud 9 Family Villa",
    type: "Villa",
    location: "Cloud 9 / Catangnan",
    areaHint: "family stay",
    priceLabel: "PHP 6,800/night",
    ratingLabel: "★ 4.9",
    readinessLabel: "Media review",
    settlementLabel: "Configurable",
    tags: ["Family", "Private villa"],
    gradient: "linear-gradient(135deg, #013863 0%, #014B78 55%, #F3AE26 145%)",
  },
  {
    slug: "preview-barkada-hostel-siargao",
    name: "Barkada Hostel Siargao",
    type: "Hostel / Barkada Room",
    location: "Tourism Road",
    areaHint: "group access",
    priceLabel: "PHP 950/person",
    ratingLabel: "★ 4.6",
    readinessLabel: "Setup needed",
    settlementLabel: "Request-to-confirm",
    tags: ["Groups", "Budget"],
    gradient: "linear-gradient(135deg, #013863 0%, #003B66 55%, #0097A7 100%)",
  },
  {
    slug: "preview-town-center-inn",
    name: "Town Center Inn",
    type: "Guesthouse",
    location: "General Luna",
    areaHint: "quiet local stay",
    priceLabel: "PHP 3,200/night",
    ratingLabel: "★ 4.7",
    readinessLabel: "Profile ready",
    settlementLabel: "Request first",
    tags: ["Local host", "Town access"],
    gradient: "linear-gradient(135deg, #013863 0%, #003B66 62%, #014B78 100%)",
  },
  {
    slug: "preview-palm-lane-resort",
    name: "Palm Lane Resort",
    type: "Resort",
    location: "Malinao",
    areaHint: "beach access",
    priceLabel: "PHP 5,400/night",
    ratingLabel: "★ 4.8",
    readinessLabel: "Photo review",
    settlementLabel: "Request first",
    tags: ["Couples", "Beach"],
    gradient: "linear-gradient(135deg, #013863 0%, #014B78 58%, #0097A7 120%)",
  },
  {
    slug: "preview-daku-view-guesthouse",
    name: "Daku View Guesthouse",
    type: "Guesthouse",
    location: "General Luna",
    areaHint: "local access",
    priceLabel: "PHP 2,900/night",
    ratingLabel: "★ 4.5",
    readinessLabel: "Rooms needed",
    settlementLabel: "Request first",
    tags: ["Simple stay", "Local"],
    gradient: "linear-gradient(135deg, #013863 0%, #003B66 60%, #F3AE26 150%)",
  },
];

const shellStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 0% 0%, rgba(0,151,167,0.08), transparent 28%), linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 48%, #FFFFFF 100%)",
  padding: "12px 12px 104px",
  boxSizing: "border-box",
};

const appFrameStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 430,
  margin: "0 auto",
};

const cardStyle: React.CSSProperties = {
  borderRadius: 24,
  background: "#FFFFFF",
  border: "1px solid rgba(1,56,99,0.10)",
  boxShadow: "0 16px 40px rgba(1,56,99,0.07)",
};

const primaryButtonStyle: React.CSSProperties = {
  minHeight: 46,
  borderRadius: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  background: "#013863",
  border: "1px solid #013863",
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: 950,
};

const secondaryButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  background: "#FFFFFF",
  border: "1px solid rgba(1,56,99,0.16)",
  color: "#013863",
};

const chipStyle: React.CSSProperties = {
  flex: "0 0 auto",
  borderRadius: 999,
  background: "#FFFFFF",
  border: "1px solid rgba(1,56,99,0.12)",
  color: "#013863",
  padding: "8px 11px",
  fontSize: 12,
  fontWeight: 900,
  textDecoration: "none",
};

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  color: "#0097A7",
  fontSize: 11,
  fontWeight: 950,
  letterSpacing: "0.13em",
  textTransform: "uppercase",
};

export default function StaysExplorePage() {
  const featured = previewStays.slice(0, 3);
  const moreStays = previewStays.slice(3);

  return (
    <main style={shellStyle}>
      <div style={appFrameStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <Link href="/traveler/explore" style={{ ...secondaryButtonStyle, minHeight: 42, padding: "0 13px", width: "fit-content" }}>
            ← Explore
          </Link>
          <span
            style={{
              borderRadius: 999,
              padding: "8px 10px",
              background: "#FFF8EA",
              border: "1px solid rgba(243,174,38,0.35)",
              color: "#8A5A00",
              fontSize: 11,
              fontWeight: 950,
            }}
          >
            Featured stays
          </span>
        </div>

        <section
          style={{
            borderRadius: 30,
            background: "linear-gradient(135deg, #013863 0%, #003B66 64%, #014B78 100%)",
            color: "#FFFFFF",
            padding: 20,
            boxShadow: "0 20px 46px rgba(1,56,99,0.18)",
          }}
        >
          <p style={{ margin: 0, color: "#F3AE26", fontSize: 11, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
            OSP Stay Discovery
          </p>
          <h1 style={{ margin: "8px 0 0", fontSize: 34, lineHeight: 0.92, letterSpacing: "-0.065em", fontWeight: 950 }}>
            Stay in Siargao
          </h1>
          <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.92)", fontSize: 14, lineHeight: 1.42, fontWeight: 800 }}>
            Browse accommodation options prepared for OSP Traveler App discovery, trip attachment, QR readiness, and request-to-confirm stay flow.
          </p>
        </section>

        <section style={{ ...cardStyle, marginTop: 12, padding: 14 }}>
          <p style={eyebrowStyle}>Traveler search path</p>
          <h2 style={{ margin: "7px 0 0", color: "#013863", fontSize: 21, lineHeight: 1.05, letterSpacing: "-0.04em", fontWeight: 950 }}>
            Choose fast. Open details only when a stay looks right.
          </h2>
          <p style={{ margin: "8px 0 0", color: "#50668B", fontSize: 13, lineHeight: 1.45, fontWeight: 750 }}>
            This shelf is designed for mobile scanning: price, location, readiness, and a clear path into the full stay page.
          </p>
        </section>

        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 0 10px" }}>
          {stayTypes.map((type, index) => (
            <span
              key={type}
              style={{
                ...chipStyle,
                background: index === 0 ? "#013863" : "#FFFFFF",
                color: index === 0 ? "#FFFFFF" : "#013863",
                border: index === 0 ? "1px solid #013863" : "1px solid rgba(1,56,99,0.12)",
              }}
            >
              {type}
            </span>
          ))}
        </div>

        <section
          style={{
            borderRadius: 20,
            background: "#FFF8EA",
            border: "1px solid rgba(243,174,38,0.38)",
            color: "#8A5A00",
            padding: 12,
            fontSize: 12,
            lineHeight: 1.4,
            fontWeight: 850,
          }}
        >
          Near-production preview: live public listings still require backend supply, operator readiness, approved media, settlement rules, and Admin publishing.
        </section>

        <section style={{ marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 10, marginBottom: 9 }}>
            <div>
              <p style={eyebrowStyle}>Featured accommodations</p>
              <h2 style={{ margin: "4px 0 0", color: "#013863", fontSize: 22, lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 950 }}>
                Recommended first
              </h2>
            </div>
            <span style={{ color: "#50668B", fontSize: 12, fontWeight: 900 }}>
              {featured.length} shown
            </span>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {featured.map((stay) => (
              <StayRowCard key={stay.slug} stay={stay} featured />
            ))}
          </div>
        </section>

        <section style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 10, marginBottom: 9 }}>
            <div>
              <p style={eyebrowStyle}>More stay choices</p>
              <h2 style={{ margin: "4px 0 0", color: "#013863", fontSize: 22, lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 950 }}>
                Browse more
              </h2>
            </div>
            <span style={{ color: "#50668B", fontSize: 12, fontWeight: 900 }}>
              Compact list
            </span>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {moreStays.map((stay) => (
              <StayRowCard key={stay.slug} stay={stay} />
            ))}
          </div>
        </section>
      </div>

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "10px 12px 14px",
          background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.96) 28%, #FFFFFF 100%)",
          zIndex: 20,
        }}
      >
        <div style={{ maxWidth: 430, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
          <Link href="/traveler/explore" style={secondaryButtonStyle}>
            Explore
          </Link>
          <Link href="/traveler/trips" style={primaryButtonStyle}>
            My Trips
          </Link>
        </div>
      </div>
    </main>
  );
}

function StayRowCard({ stay, featured = false }: { stay: StayPreview; featured?: boolean }) {
  return (
    <Link
      href={`/traveler/explore/stays/${stay.slug}`}
      style={{
        ...cardStyle,
        display: "grid",
        gridTemplateColumns: featured ? "118px minmax(0, 1fr)" : "96px minmax(0, 1fr)",
        gap: 11,
        padding: 10,
        textDecoration: "none",
        color: "#013863",
        minHeight: featured ? 150 : 124,
      }}
    >
      <div
        style={{
          borderRadius: 20,
          background: stay.gradient,
          minHeight: featured ? 130 : 104,
          padding: 11,
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <span style={{ color: "#F3AE26", fontSize: 9.5, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {featured ? "Featured" : "Stay"}
        </span>
        <span style={{ fontSize: featured ? 13 : 12, lineHeight: 1.05, fontWeight: 950 }}>
          {stay.location}
        </span>
      </div>

      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p style={{ margin: 0, color: "#0097A7", fontSize: 10, fontWeight: 950, letterSpacing: "0.11em", textTransform: "uppercase" }}>
            {stay.type}
          </p>
          <h3 style={{ margin: "5px 0 0", color: "#013863", fontSize: featured ? 18 : 16, lineHeight: 1.05, letterSpacing: "-0.035em", fontWeight: 950 }}>
            {stay.name}
          </h3>
          <p style={{ margin: "5px 0 0", color: "#50668B", fontSize: 12, lineHeight: 1.32, fontWeight: 800 }}>
            {stay.location} · {stay.areaHint}
          </p>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={miniPillStyle}>{stay.ratingLabel}</span>
          <span style={miniPillStyle}>{stay.readinessLabel}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div>
            <p style={{ margin: 0, color: "#50668B", fontSize: 10.5, fontWeight: 900 }}>
              Preview from
            </p>
            <p style={{ margin: "2px 0 0", color: "#013863", fontSize: 13, lineHeight: 1.1, fontWeight: 950 }}>
              {stay.priceLabel}
            </p>
          </div>
          <span
            style={{
              borderRadius: 14,
              padding: "9px 12px",
              background: "#013863",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 950,
              whiteSpace: "nowrap",
            }}
          >
            View
          </span>
        </div>
      </div>
    </Link>
  );
}

const miniPillStyle: React.CSSProperties = {
  borderRadius: 999,
  padding: "5px 8px",
  background: "#F4FCFA",
  border: "1px solid rgba(0,151,167,0.18)",
  color: "#013863",
  fontSize: 10.5,
  lineHeight: 1,
  fontWeight: 900,
};
