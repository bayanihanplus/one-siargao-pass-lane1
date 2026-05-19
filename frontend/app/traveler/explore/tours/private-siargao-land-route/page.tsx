import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../../../src/components/traveler/UniversalTravelerBottomTabBar";

const OSP = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  mist: "#F4FCFA",
  soft: "#F8FBFD",
  slate: "#50668B",
  line: "rgba(1,56,99,0.10)",
};

const bookingHref =
  "/traveler/passport-trails/siargao-land-tour/book?source=explore-tour&trail=siargao-land-tour&officialTrail=Siargao+Land+Tour&routeType=SIARGAO_LAND_TOUR&routeCode=south-highlights&routeProduct=SOUTH_HIGHLIGHTS&step=slot-confirmation&bookingPath=land-route&product=south-highlights";

const mediaTiles = [
  { label: "South route", hint: "Route view" },
  { label: "North route", hint: "Scenic route" },
  { label: "DIY stops", hint: "Custom route" },
];

const confidenceCards = [
  { label: "Route", value: "South / North" },
  { label: "Support", value: "Driver / guide" },
  { label: "Status", value: "Slot request" },
];

const routeProducts = [
  {
    badge: "Popular",
    title: "South Highlights",
    note: "Coconut Road, Maasin, and Magpupungko.",
    price: "Confirm first",
    meta: "One-day route",
    cta: "Confirm South Slot",
    href: "/traveler/passport-trails/siargao-land-tour/book?source=explore-tour&trail=siargao-land-tour&officialTrail=Siargao+Land+Tour&routeType=SIARGAO_LAND_TOUR&routeCode=south-highlights&routeProduct=SOUTH_HIGHLIGHTS&step=slot-confirmation&bookingPath=land-route&product=south-highlights",
    tone: "gold",
  },
  {
    badge: "Scenic",
    title: "North Highlights",
    note: "Pacifico, Alegria, and Taktak Falls.",
    price: "Confirm first",
    meta: "One-day route",
    cta: "Confirm North Slot",
    href: "/traveler/passport-trails/siargao-land-tour/book?source=explore-tour&trail=siargao-land-tour&officialTrail=Siargao+Land+Tour&routeType=SIARGAO_LAND_TOUR&routeCode=north-highlights&routeProduct=NORTH_HIGHLIGHTS&step=slot-confirmation&bookingPath=land-route&product=north-highlights",
    tone: "mist",
  },
  {
    badge: "Flexible",
    title: "Private DIY Route",
    note: "Flexible private route setup.",
    price: "Custom quote",
    meta: "Private route",
    cta: "Confirm Private Slot",
    href: "/traveler/passport-trails/siargao-land-tour/book?source=explore-tour&trail=siargao-land-tour&officialTrail=Siargao+Land+Tour&routeType=SIARGAO_LAND_TOUR&routeCode=private-diy&routeProduct=PRIVATE_DIY&step=slot-confirmation&bookingPath=land-route&product=private-diy",
    tone: "mist",
  },
];

const trailStops = [
  {
    number: "1",
    tag: "Route setup",
    title: "Choose South, North, or DIY",
    body: "Choose your route style.",
    tone: "mist",
  },
  {
    number: "2",
    tag: "South option",
    title: "South Highlights",
    body: "Coconut Road, Maasin, and Magpupungko.",
    tone: "gold",
  },
  {
    number: "3",
    tag: "North option",
    title: "North Highlights",
    body: "Pacifico, Alegria, and Taktak Falls.",
    tone: "mist",
  },
  {
    number: "4",
    tag: "Custom option",
    title: "Private DIY Route",
    body: "Flexible stops with local support.",
    tone: "mist",
  },
];

const reasons = [
  ["1", "Flexible route", "South, North, or DIY."],
  ["2", "Clear next step", "Pickup and timing reviewed next."],
  ["3", "Local support", "Driver or guide support."],
  ["4", "No fixed script", "Keep the route flexible."],
];

const inclusions = [
  "Route review",
  "Driver support",
  "Guide support",
  "Pickup guidance",
  "Timing check",
  "Stop planning",
  "Operator support",
  "Slot confirmation",
];

const exclusions = [
  "Entrance fees may vary by stop",
  "Drone or photographer support depends on selected package",
];

const otherTrails = [
  {
    title: "General Luna Island Hopping",
    area: "General Luna Port",
    tag: "Island",
    note: "Boat route",
    href: "/traveler/explore/tours/general-luna-island-hopping",
    tileColor: "#EAFBFA",
  },
  {
    title: "Sugba Lagoon Island Hopping",
    area: "Del Carmen",
    tag: "Lagoon",
    note: "Lagoon route",
    href: "/traveler/explore/tours/sugba-lagoon-mangrove-tours",
    tileColor: "#FFF8E6",
  },
  {
    title: "Bucas Grande / Sohoton Official Trail",
    area: "Dapa-side",
    tag: "Sohoton",
    note: "Governed route",
    href: "/traveler/explore/tours/bucas-grande-sohoton-tour",
    tileColor: "#EAFBFA",
  },
  {
    title: "Explorer Surf Trail",
    area: "Cloud 9",
    tag: "Surf",
    note: "Surf support",
    href: "/traveler/passport-trails/surf-explorer",
    tileColor: "#EAF5FF",
  },
];

function ShellCard({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <section
      style={{
        borderRadius: 24,
        padding: 12,
        background: "#FFFFFF",
        border: `1px solid ${OSP.line}`,
        boxShadow: "0 12px 28px rgba(1,56,99,0.065)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: OSP.teal,
        fontSize: 9.4,
        lineHeight: 1,
        fontWeight: 900,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: "6px 0 0",
        color: OSP.navy,
        fontSize: 20,
        lineHeight: 1.05,
        letterSpacing: "-0.04em",
        fontWeight: 860,
      }}
    >
      {children}
    </h2>
  );
}

export default function PrivateSiargaoLandRouteExplorePage() {
  return (
    <main className="osp-traveler-bottom-tab-safe-page"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% 0%, rgba(5,150,165,0.10), transparent 34%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 54%, #EAFBFA 100%)",
        color: OSP.navy,
        padding: "14px 14px 132px",
      }}
    >
      <div style={{ maxWidth: 390, margin: "0 auto" }}>
        <Link
          href="/traveler/explore"
          aria-label="Back to Explore"
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            color: OSP.navy,
            textDecoration: "none",
            fontSize: 18,
            fontWeight: 900,
            boxShadow: "0 10px 24px rgba(1,56,99,0.08)",
            marginBottom: 10,
          }}
        >
          ‹
        </Link>

        <ShellCard style={{ padding: 8 }}>
          <section
            aria-label="Private Siargao Land Route media detail"
            style={{
              minHeight: 246,
              borderRadius: 22,
              overflow: "hidden",
              padding: 14,
              display: "grid",
              alignContent: "end",
              background:
                "linear-gradient(180deg, rgba(1,56,99,0.58), rgba(1,56,99,0.94)), url('/osp/temp-tour-posters/private-diy-land-tour.png') center/cover",
            }}
          >
            <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap", marginBottom: 13 }}>
              <span
                style={{
                  borderRadius: 999,
                  padding: "7px 10px",
                  background: "#FFFFFF",
                  color: OSP.navy,
                  fontSize: 10.5,
                  fontWeight: 900,
                }}
              >
                ● PRIVATE ROUTE
              </span>
              <span
                style={{
                  borderRadius: 999,
                  padding: "7px 10px",
                  background: OSP.gold,
                  color: OSP.navy,
                  fontSize: 10.5,
                  fontWeight: 900,
                }}
              >
                South / North / DIY
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                color: "#FFFFFF",
                textShadow: "0 3px 16px rgba(0,0,0,0.36)",
                fontSize: 31,
                lineHeight: 0.93,
                letterSpacing: "-0.055em",
                fontWeight: 880,
              }}
            >
              Private Siargao Land Route
            </h1>

            <p
              style={{
                margin: "10px 0 0",
                color: "rgba(255,255,255,0.96)",
                textShadow: "0 2px 10px rgba(0,0,0,0.32)",
                fontSize: 13.2,
                lineHeight: 1.28,
                fontWeight: 760,
                maxWidth: 300,
              }}
            >
              South, North, or custom land route.
            </p>

            <Link
              href={bookingHref}
              style={{
                justifySelf: "end",
                marginTop: 14,
                borderRadius: 999,
                padding: "8px 12px",
                background: "rgba(1,56,99,0.86)",
                color: "#FFFFFF",
                textDecoration: "none",
                fontSize: 11,
                fontWeight: 900,
              }}
            >
              ▶ Video
            </Link>
          </section>

          <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {mediaTiles.map((tile) => (
              <div
                key={tile.label}
                style={{
                  minHeight: 76,
                  borderRadius: 18,
                  padding: 10,
                  background: "linear-gradient(145deg, #EAFBFA, #FFF8E6)",
                  border: "1px solid rgba(5,150,165,0.18)",
                  display: "grid",
                  alignContent: "space-between",
                }}
              >
                <span style={{ color: OSP.slate, fontSize: 9.2, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {tile.hint}
                </span>
                <strong style={{ color: OSP.navy, fontSize: 12.5, lineHeight: 1.05 }}>{tile.label}</strong>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard style={{ marginTop: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              ["📅", "Date", "Choose on next step"],
              ["👥", "Pax", "Set during request"],
              ["📍", "Route", "South / North"],
              ["🛺", "Support", "Driver / guide"],
            ].map(([icon, label, value]) => (
              <div
                key={label}
                style={{
                  minHeight: 76,
                  borderRadius: 18,
                  padding: 12,
                  background: OSP.mist,
                  border: "1px solid rgba(5,150,165,0.16)",
                  display: "grid",
                  gridTemplateColumns: "26px 1fr",
                  gap: 9,
                  alignItems: "center",
                }}
              >
                <span>{icon}</span>
                <div>
                  <div style={{ color: OSP.slate, fontSize: 9.5, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {label}
                  </div>
                  <strong style={{ display: "block", marginTop: 4, color: OSP.navy, fontSize: 12.5, lineHeight: 1.12 }}>{value}</strong>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={bookingHref}
            style={{
              marginTop: 10,
              minHeight: 52,
              borderRadius: 18,
              background: OSP.navy,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 930,
            }}
          >
            Confirm Land Route Slot
          </Link>
        </ShellCard>

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {confidenceCards.map((card) => (
            <div
              key={card.label}
              style={{
                minHeight: 70,
                borderRadius: 18,
                padding: 10,
                background: "#FFFFFF",
                border: `1px solid ${OSP.line}`,
                boxShadow: "0 10px 22px rgba(1,56,99,0.05)",
              }}
            >
              <div style={{ color: OSP.slate, fontSize: 9.2, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {card.label}
              </div>
              <strong style={{ display: "block", marginTop: 8, color: OSP.navy, fontSize: 12.5, lineHeight: 1.1 }}>{card.value}</strong>
            </div>
          ))}
        </div>

        <ShellCard style={{ marginTop: 12 }}>
          <Eyebrow>Trail stops</Eyebrow>
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {trailStops.map((stop) => (
              <div
                key={stop.title}
                style={{
                  minHeight: 88,
                  borderRadius: 20,
                  padding: 12,
                  background: stop.tone === "gold" ? "#FFF8E6" : OSP.mist,
                  border: stop.tone === "gold" ? "1px solid rgba(243,174,38,0.28)" : "1px solid rgba(5,150,165,0.16)",
                  display: "grid",
                  gridTemplateColumns: "52px 1fr",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 18,
                    background: "#FFFFFF",
                    display: "grid",
                    placeItems: "center",
                    color: OSP.navy,
                    fontWeight: 950,
                    fontSize: 15,
                  }}
                >
                  {stop.number}
                </div>

                <div>
                  <span
                    style={{
                      borderRadius: 999,
                      padding: "4px 8px",
                      background: "#FFFFFF",
                      color: OSP.slate,
                      fontSize: 9,
                      fontWeight: 900,
                    }}
                  >
                    {stop.tag}
                  </span>
                  <strong style={{ display: "block", marginTop: 7, color: OSP.navy, fontSize: 15.5, lineHeight: 1.05 }}>
                    {stop.title}
                  </strong>
                  <p style={{ margin: "5px 0 0", color: OSP.slate, fontSize: 12, lineHeight: 1.28, fontWeight: 740 }}>
                    {stop.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard style={{ marginTop: 12 }}>
          <Eyebrow>Choose route setup</Eyebrow>

          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {routeProducts.map((product) => (
              <article
                key={product.title}
                style={{
                  borderRadius: 20,
                  padding: 12,
                  background: product.tone === "gold" ? "#FFF8E6" : OSP.mist,
                  border: product.tone === "gold" ? "1px solid rgba(243,174,38,0.28)" : "1px solid rgba(5,150,165,0.16)",
                  display: "grid",
                  gap: 9,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "5px 8px",
                        background: "#FFFFFF",
                        color: OSP.slate,
                        fontSize: 9.2,
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      {product.badge}
                    </span>
                    <strong style={{ display: "block", marginTop: 9, color: OSP.navy, fontSize: 15.5, lineHeight: 1.05 }}>
                      {product.title}
                    </strong>
                    <p style={{ margin: "4px 0 0", color: OSP.slate, fontSize: 12, fontWeight: 720 }}>{product.note}</p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <strong style={{ display: "block", color: OSP.navy, fontSize: 15.5, lineHeight: 1.05 }}>{product.price}</strong>
                    <span style={{ color: OSP.slate, fontSize: 10.5, fontWeight: 800 }}>{product.meta}</span>
                  </div>
                </div>

                <Link
                  href={product.href}
                  style={{
                    width: "fit-content",
                    borderRadius: 999,
                    padding: "8px 12px",
                    background: OSP.navy,
                    color: "#FFFFFF",
                    textDecoration: "none",
                    fontSize: 11,
                    fontWeight: 900,
                  }}
                >
                  {product.cta}
                </Link>
              </article>
            ))}
          </div>
        </ShellCard>

        <ShellCard style={{ marginTop: 12 }}>
          <Heading>Flexible Siargao land route.</Heading>
          <p style={{ margin: "9px 0 0", color: OSP.slate, fontSize: 12.6, lineHeight: 1.35, fontWeight: 760 }}>
            Choose your route first. Pickup and timing follow.
          </p>
        </ShellCard>

        <ShellCard style={{ marginTop: 12 }}>
          <Eyebrow>Top reasons</Eyebrow>
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {reasons.map(([number, title, body]) => (
              <div key={number} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: number === "1" ? "#FFF8E6" : OSP.mist,
                    color: OSP.navy,
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 950,
                  }}
                >
                  {number}
                </div>
                <div>
                  <strong style={{ color: OSP.navy, fontSize: 14.2, lineHeight: 1.05 }}>{title}</strong>
                  <p style={{ margin: "4px 0 0", color: OSP.slate, fontSize: 11.7, lineHeight: 1.25, fontWeight: 720 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard style={{ marginTop: 12 }}>
          <Eyebrow>Included support</Eyebrow>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
            {inclusions.map((item) => (
              <span
                key={item}
                style={{
                  borderRadius: 999,
                  padding: "8px 10px",
                  background: OSP.mist,
                  border: "1px solid rgba(5,150,165,0.18)",
                  color: OSP.navy,
                  fontSize: 11,
                  fontWeight: 850,
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 10, display: "grid", gap: 7 }}>
            {exclusions.map((item) => (
              <div
                key={item}
                style={{
                  borderRadius: 999,
                  padding: "9px 12px",
                  background: "#FFF8E6",
                  border: "1px solid rgba(243,174,38,0.24)",
                  color: OSP.navy,
                  fontSize: 11.5,
                  fontWeight: 860,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard style={{ marginTop: 12, background: "linear-gradient(145deg, #FFF8E6, #FFFFFF)", border: "1px solid rgba(243,174,38,0.28)" }}>
          <Eyebrow>Route support</Eyebrow>
          <Heading>Confirm your land route slot.</Heading>
          <p style={{ margin: "9px 0 0", color: OSP.slate, fontSize: 12.6, lineHeight: 1.35, fontWeight: 760 }}>
            Route, date, and pickup are reviewed next.
          </p>
        </ShellCard>

        <section
          style={{
            marginTop: 12,
            borderRadius: 24,
            padding: 14,
            background: OSP.navy,
            color: "#FFFFFF",
            boxShadow: "0 14px 28px rgba(1,56,99,0.20)",
          }}
        >
          <h2 style={{ margin: 0, color: "#FFFFFF", fontSize: 21, lineHeight: 1.02, letterSpacing: "-0.045em", fontWeight: 860 }}>
            Confirm your land route slot.
          </h2>
          <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.88)", fontSize: 12.8, lineHeight: 1.35, fontWeight: 760 }}>
            Choose route, date, pax, and pickup next.
          </p>
          <Link
            href={bookingHref}
            style={{
              marginTop: 13,
              minHeight: 52,
              borderRadius: 18,
              background: OSP.gold,
              color: OSP.navy,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 930,
            }}
          >
            Confirm Land Route Slot
          </Link>
        </section>

        <ShellCard style={{ marginTop: 12 }}>
          <Eyebrow>Discover other trails</Eyebrow>
          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {otherTrails.map((trail) => (
              <Link
                key={trail.href}
                href={trail.href}
                style={{
                  minHeight: 112,
                  borderRadius: 18,
                  background: trail.tileColor,
                  color: OSP.navy,
                  border: "1px solid rgba(5,150,165,0.12)",
                  display: "grid",
                  alignContent: "space-between",
                  gap: 8,
                  textDecoration: "none",
                  padding: 12,
                }}
              >
                <div>
                  <span
                    style={{
                      borderRadius: 999,
                      padding: "5px 8px",
                      background: "#FFFFFF",
                      color: OSP.teal,
                      fontSize: 9,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      float: "right",
                    }}
                  >
                    {trail.tag}
                  </span>
                  <strong style={{ display: "block", color: OSP.navy, fontSize: 13.2, lineHeight: 1.05, clear: "both", paddingTop: 10 }}>
                    {trail.title}
                  </strong>
                  <span style={{ display: "block", marginTop: 5, color: OSP.slate, fontSize: 11, fontWeight: 750 }}>{trail.area}</span>
                </div>
                <span style={{ color: OSP.slate, fontSize: 10.8, fontWeight: 800 }}>{trail.note} ›</span>
              </Link>
            ))}
          </div>
        </ShellCard>
      </div>
      <UniversalTravelerBottomTabBar />
    </main>
  );
}
