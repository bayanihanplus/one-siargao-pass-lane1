import Link from "next/link";
import { notFound } from "next/navigation";

type StayPreview = {
  slug: string;
  name: string;
  typeLine: string;
  location: string;
  rate: string;
  rating: string;
  heroLabel: string;
  heroDescription: string;
  descriptionTitle: string;
  description: string;
  bestFor: string[];
  amenities: string[];
  features: string[];
  rooms: string[];
  readiness: string;
  paymentMode: string;
  paymentIntentId: string;
  terms: string[];
  related: string[];
  gradient: string;
};

const stays: StayPreview[] = [
  {
    slug: "preview-general-luna-surf-stay",
    name: "General Luna Surf Stay",
    typeLine: "Homestay / Surf Stay",
    location: "General Luna · near surf access",
    rate: "PHP 2,500/night",
    rating: "★ 4.8",
    heroLabel: "Stay walkthrough",
    heroDescription: "A calm surf-stay walkthrough for room feel, location confidence, and arrival expectations.",
    descriptionTitle: "Homestay / Surf Stay in General Luna",
    description:
      "A traveler-ready surf stay page showing how One Siargao Pass organizes location context, room options, guest expectations, stay readiness, QR-linked trip record potential, and request-to-confirm availability before payment.",
    bestFor: ["Surf travelers", "Couples", "Longer island stays"],
    amenities: ["Wi-Fi ready", "Near surf access", "Private room option", "Local host support", "Trip-linked stay record"],
    features: ["Location clarity", "Room preview", "Stay support routing", "QR stay capable", "Request-to-confirm path"],
    rooms: ["Standard Queen Room", "Surf Stay Room", "Long-stay Unit"],
    readiness: "Profile ready · Room pricing guide · QR stay capable · Admin approval required",
    paymentMode: "Request-to-confirm first · Settlement lane controlled · Payment continues after confirmation",
    paymentIntentId: "preview-accommodation-general-luna-surf-stay",
    terms: [
      "Availability must be confirmed before stay record creation.",
      "Real public listing requires admin publishing.",
      "QR stay readiness attaches after confirmation.",
    ],
    related: ["preview-cloud-9-family-villa", "preview-barkada-hostel-siargao"],
    gradient: "linear-gradient(135deg, #013863 0%, #003B66 58%, #014B78 100%)",
  },
  {
    slug: "preview-cloud-9-family-villa",
    name: "Cloud 9 Family Villa",
    typeLine: "Villa",
    location: "Cloud 9 / Catangnan area",
    rate: "PHP 6,800/night",
    rating: "★ 4.9",
    heroLabel: "Family stay overview",
    heroDescription: "A premium family stay overview for privacy, comfort, location clarity, and multi-night confidence.",
    descriptionTitle: "Family Villa near Cloud 9",
    description:
      "A premium family stay page showing how OSP presents location clarity, guest terms, approved media, room confidence, family suitability, and payment-aware settlement readiness inside one traveler decision page.",
    bestFor: ["Families", "Small groups", "Premium island stays"],
    amenities: ["Family room setup", "Private villa feel", "Near Cloud 9", "Kitchen-ready preview", "Stay support routing"],
    features: ["Media review required", "Family stay request", "Trip-ready after confirmation", "Settlement configurable", "Admin approval required"],
    rooms: ["Family Villa Room", "Private Villa", "Extra Guest Setup"],
    readiness: "Photos and room proof required before traveler exposure.",
    paymentMode: "Payment continues only after availability and stay details are confirmed.",
    paymentIntentId: "preview-accommodation-cloud-9-family-villa",
    terms: [
      "Family occupancy rules must be confirmed.",
      "Media review is required before public publishing.",
      "Settlement handling depends on approved commercial lane.",
    ],
    related: ["preview-general-luna-surf-stay", "preview-town-center-inn"],
    gradient: "linear-gradient(135deg, #013863 0%, #014B78 56%, #F3AE26 140%)",
  },
  {
    slug: "preview-barkada-hostel-siargao",
    name: "Barkada Hostel Siargao",
    typeLine: "Hostel / Barkada Room",
    location: "Tourism Road access",
    rate: "PHP 950/person",
    rating: "★ 4.6",
    heroLabel: "Group stay overview",
    heroDescription: "A budget/group stay overview for hostel rooms, shared group planning, and availability request routing.",
    descriptionTitle: "Group Hostel Stay near Tourism Road",
    description:
      "A budget/group stay page showing how OSP supports hostels, group rooms, availability requests, basic room readiness, and traveler support routing through a request-to-confirm flow.",
    bestFor: ["Backpackers", "Barkada groups", "Budget travelers"],
    amenities: ["Group room preview", "Shared stay setup", "Tourism Road access", "Host support", "Trip-linked request"],
    features: ["Operator setup needed", "Group availability", "Request-to-confirm", "QR-ready later", "Request-first flow"],
    rooms: ["Barkada Room", "Dorm Bed", "Private Hostel Room"],
    readiness: "Room count, capacity, terms, and media must be completed first.",
    paymentMode: "Request-to-confirm. Booking and settlement activate only after availability and stay details are confirmed.",
    paymentIntentId: "preview-accommodation-barkada-hostel-siargao",
    terms: [
      "Group size must be confirmed.",
      "Room capacity must be validated.",
      "Stay record attaches only after confirmation.",
    ],
    related: ["preview-general-luna-surf-stay", "preview-cloud-9-family-villa"],
    gradient: "linear-gradient(135deg, #013863 0%, #003B66 52%, #0097A7 100%)",
  },
  {
    slug: "preview-town-center-inn",
    name: "Town Center Inn",
    typeLine: "Guesthouse / Town Access",
    location: "General Luna town center",
    rate: "PHP 1,800/night",
    rating: "★ 4.5",
    heroLabel: "Town access overview",
    heroDescription: "A simple town-center stay overview for walkability, practical access, and short-stay clarity.",
    descriptionTitle: "Guesthouse near General Luna Town Center",
    description:
      "A practical guesthouse stay page showing how OSP surfaces town access, room basics, guest expectations, and request-to-confirm readiness for travelers comparing simple accommodations.",
    bestFor: ["Short stays", "Solo travelers", "Town access"],
    amenities: ["Town access", "Private room preview", "Basic Wi-Fi", "Nearby services", "Trip-linked stay"],
    features: ["Simple room clarity", "Location confidence", "Request availability", "Admin review needed", "QR stay capable later"],
    rooms: ["Standard Room", "Twin Room", "Solo Room"],
    readiness: "Operator profile, room pricing, and media approval required.",
    paymentMode: "Payment-aware after approved settlement setup and confirmed availability.",
    paymentIntentId: "preview-accommodation-town-center-inn",
    terms: [
      "Room availability must be confirmed.",
      "Terms must be published before public exposure.",
      "Payment is only collected after availability and stay details are confirmed.",
    ],
    related: ["preview-general-luna-surf-stay", "preview-barkada-hostel-siargao"],
    gradient: "linear-gradient(135deg, #013863 0%, #003B66 62%, #014B78 100%)",
  },
];

function getStay(slug: string) {
  return stays.find((stay) => stay.slug === slug);
}

function relatedStays(stay: StayPreview) {
  return stay.related
    .map((slug) => stays.find((item) => item.slug === slug))
    .filter(Boolean) as StayPreview[];
}

const shellStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 0% 0%, rgba(0,151,167,0.08), transparent 26%), linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 46%, #FFFFFF 100%)",
  padding: "14px 12px 104px",
  boxSizing: "border-box",
};

const appFrameStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 430,
  margin: "0 auto",
};

const cardStyle: React.CSSProperties = {
  borderRadius: 26,
  background: "#FFFFFF",
  border: "1px solid rgba(1,56,99,0.10)",
  boxShadow: "0 18px 46px rgba(1,56,99,0.08)",
};

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  color: "#0097A7",
  fontSize: 11,
  fontWeight: 950,
  letterSpacing: "0.13em",
  textTransform: "uppercase",
};

const h2Style: React.CSSProperties = {
  margin: "7px 0 0",
  color: "#013863",
  fontSize: 24,
  lineHeight: 1.04,
  letterSpacing: "-0.045em",
  fontWeight: 950,
};

const bodyStyle: React.CSSProperties = {
  margin: "9px 0 0",
  color: "#50668B",
  fontSize: 14,
  lineHeight: 1.48,
  fontWeight: 750,
};

const pillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 32,
  borderRadius: 999,
  padding: "0 10px",
  border: "1px solid rgba(0,151,167,0.20)",
  background: "#F4FCFA",
  color: "#013863",
  fontSize: 12,
  fontWeight: 900,
};

const secondaryButtonStyle: React.CSSProperties = {
  minHeight: 48,
  borderRadius: 17,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  background: "#FFFFFF",
  border: "1px solid rgba(1,56,99,0.16)",
  color: "#013863",
  fontSize: 14,
  fontWeight: 950,
};

const primaryButtonStyle: React.CSSProperties = {
  ...secondaryButtonStyle,
  background: "#013863",
  border: "1px solid #013863",
  color: "#FFFFFF",
};

export default function TravelerStayPreviewPage({ params }: { params: { slug: string } }) {
  const stay = getStay(params.slug);

  if (!stay) {
    notFound();
  }

  const related = relatedStays(stay);

  return (
    <main style={shellStyle}>
      <div style={appFrameStyle}>
        <nav style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", paddingBottom: 2 }}>
          <Link href="/traveler/explore/stays" style={{ ...secondaryButtonStyle, flex: "0 0 auto", minHeight: 42, padding: "0 13px" }}>
            ← Back to Stays
          </Link>
          <Link href="/traveler/explore" style={{ ...secondaryButtonStyle, flex: "0 0 auto", minHeight: 42, padding: "0 13px" }}>
            Explore more
          </Link>
        </nav>

        <section
          style={{
            ...cardStyle,
            overflow: "hidden",
            background: "#FFFFFF",
          }}
        >
          <div
            style={{
              minHeight: 330,
              background: stay.gradient,
              color: "#FFFFFF",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
              <span
                style={{
                  borderRadius: 999,
                  padding: "8px 11px",
                  background: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                Stay media guide
              </span>
              <span
                style={{
                  borderRadius: 999,
                  padding: "8px 11px",
                  background: "#F3AE26",
                  color: "#013863",
                  fontSize: 12,
                  fontWeight: 950,
                }}
              >
                DOT/LGU demo
              </span>
            </div>

            <div>
              <p style={{ margin: 0, color: "#F3AE26", fontSize: 11, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
                {stay.heroLabel}
              </p>
              <h1 style={{ margin: "8px 0 0", fontSize: 32, lineHeight: 0.95, letterSpacing: "-0.06em", fontWeight: 950 }}>
                {stay.name}
              </h1>
              <p style={{ margin: "10px 0 0", fontSize: 13.5, lineHeight: 1.38, fontWeight: 800, color: "rgba(255,255,255,0.92)" }}>
                {stay.heroDescription}
              </p>
            </div>
          </div>

          <div style={{ padding: "12px 12px 14px", overflowX: "auto" }}>
            <div style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "132px", gap: 9 }}>
              {[1, 2, 3, 4, 5].map((photo) => (
                <div
                  key={photo}
                  style={{
                    minHeight: 106,
                    borderRadius: 18,
                    background:
                      photo === 3
                        ? "linear-gradient(135deg, #013863 0%, #0097A7 55%, #F3AE26 150%)"
                        : "linear-gradient(135deg, #013863 0%, #003B66 70%, #0097A7 130%)",
                    padding: 12,
                    color: "#FFFFFF",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end",
                  }}
                >
                  <span style={{ color: "#F3AE26", fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Photo {photo}
                  </span>
                  <span style={{ marginTop: 3, fontSize: 11, color: "rgba(255,255,255,0.82)", fontWeight: 800 }}>
                    {photo === 1 ? "Hero exterior" : photo === 2 ? "Room preview" : photo === 3 ? "Comfort detail" : photo === 4 ? "Location context" : "Guest area"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...cardStyle, padding: 18, marginTop: 14 }}>
          <p style={eyebrowStyle}>Stay description</p>
          <h2 style={h2Style}>{stay.descriptionTitle}</h2>
          <p style={bodyStyle}>{stay.description}</p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            <span style={pillStyle}>Preview rating · {stay.rating}</span>
            <span style={pillStyle}>{stay.rate}</span>
            <span style={pillStyle}>{stay.location}</span>
          </div>

          <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
            <InfoGroup title="Best for" items={stay.bestFor} pill />
            <InfoGroup title="Amenities" items={stay.amenities} />
            <InfoGroup title="Features" items={stay.features} />
            <InfoGroup title="Room options" items={stay.rooms} />
          </div>

          <div
            style={{
              marginTop: 16,
              borderRadius: 18,
              border: "1px solid rgba(0,151,167,0.18)",
              background: "#F4FCFA",
              padding: 13,
              color: "#013863",
              fontSize: 13,
              lineHeight: 1.4,
              fontWeight: 900,
            }}
          >
            Readiness: {stay.readiness}
          </div>
        </section>

        <section
          style={{
            ...cardStyle,
            marginTop: 14,
            padding: 18,
            border: "1px solid rgba(243,174,38,0.38)",
            background: "linear-gradient(180deg, #FFF8EA 0%, #FFFFFF 100%)",
          }}
        >
          <p style={{ ...eyebrowStyle, color: "#8A5A00" }}>Booking and payment path</p>
          <h2 style={h2Style}>Reserve the stay, confirm availability, then continue to payment.</h2>
          <p style={bodyStyle}>
            This is the traveler-facing accommodation handoff: the stay can be attached to the trip, reviewed for availability, then routed into the payment gateway once the booking lane is confirmed.
          </p>

          <div
            style={{
              marginTop: 14,
              borderRadius: 18,
              padding: 13,
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.12)",
              display: "grid",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span style={{ color: "#50668B", fontSize: 12, fontWeight: 900 }}>Selected stay</span>
              <strong style={{ color: "#013863", fontSize: 12, textAlign: "right" }}>{stay.name}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span style={{ color: "#50668B", fontSize: 12, fontWeight: 900 }}>Preview amount</span>
              <strong style={{ color: "#013863", fontSize: 12, textAlign: "right" }}>{stay.rate}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span style={{ color: "#50668B", fontSize: 12, fontWeight: 900 }}>Payment state</span>
              <strong style={{ color: "#8A5A00", fontSize: 12, textAlign: "right" }}>Gateway-ready after confirmation</strong>
            </div>
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 15 }}>
            <Link href={`/traveler/payments/${stay.paymentIntentId}`} style={primaryButtonStyle}>
              Continue After Confirmation
            </Link>
            <Link href="/traveler/explore/stays" style={secondaryButtonStyle}>
              Compare other stays
            </Link>
          </div>
        </section>

        <section style={{ ...cardStyle, padding: 18, marginTop: 14 }}>
          <p style={eyebrowStyle}>Payment readiness</p>
          <h2 style={h2Style}>Payment-aware booking path</h2>
          <p style={bodyStyle}>
            {stay.paymentMode}. The CTA above now leads to the Traveler App payment gateway surface, while final charging remains controlled by confirmed booking, supply readiness, and approved settlement rules.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            <span style={pillStyle}>Gateway handoff ready</span>
            <span style={pillStyle}>Settlement lane controlled</span>
            <span style={pillStyle}>Booking confirmation required</span>
          </div>
        </section>

        <section style={{ ...cardStyle, padding: 18, marginTop: 14 }}>
          <p style={eyebrowStyle}>Guest terms</p>
          <h2 style={h2Style}>Rules travelers should see before choosing</h2>
          <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "#50668B", fontSize: 13.5, lineHeight: 1.6, fontWeight: 800 }}>
            {stay.terms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </section>

        <section style={{ ...cardStyle, padding: 18, marginTop: 14 }}>
          <p style={eyebrowStyle}>Related choices</p>
          <h2 style={h2Style}>You may also like</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/traveler/explore/stays/${item.slug}`}
                style={{
                  textDecoration: "none",
                  color: "#013863",
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "1px solid rgba(1,56,99,0.12)",
                  background: "#FFFFFF",
                }}
              >
                <div style={{ minHeight: 94, background: item.gradient, padding: 12, display: "flex", flexDirection: "column", justifyContent: "end" }}>
                  <span style={{ color: "#F3AE26", fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    Related stay
                  </span>
                  <strong style={{ marginTop: 4, color: "#FFFFFF", fontSize: 13, lineHeight: 1.1 }}>
                    {item.name}
                  </strong>
                </div>
                <div style={{ padding: 11 }}>
                  <p style={{ margin: 0, color: "#50668B", fontSize: 11.5, lineHeight: 1.35, fontWeight: 850 }}>
                    {item.typeLine} · {item.location}
                  </p>
                  <p style={{ margin: "7px 0 0", fontSize: 12, fontWeight: 950 }}>
                    View Stay →
                  </p>
                </div>
              </Link>
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
          <Link href="/traveler/explore/stays" style={secondaryButtonStyle}>
            Back to Stays
          </Link>
          <Link href={`/traveler/payments/${stay.paymentIntentId}`} style={primaryButtonStyle}>
            Payment
          </Link>
        </div>
      </div>
    </main>
  );
}

function InfoGroup({ title, items, pill = false }: { title: string; items: string[]; pill?: boolean }) {
  return (
    <div>
      <h3 style={{ margin: 0, color: "#013863", fontSize: 16, fontWeight: 950 }}>
        {title}
      </h3>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {items.map((item) =>
          pill ? (
            <span key={item} style={pillStyle}>
              {item}
            </span>
          ) : (
            <span key={item} style={{ color: "#50668B", fontSize: 13, fontWeight: 850, lineHeight: 1.4 }}>
              ✓ {item}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
