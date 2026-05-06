import Link from "next/link";
import { notFound } from "next/navigation";

type TourDetailPageProps = {
  params: {
    slug: string;
  };
};

type RouteOption = {
  title: string;
  price: string;
  description: string;
  badge: string;
};

type TourConfig = {
  slug: string;
  title: string;
  eyebrow: string;
  heroLabel: string;
  image: string;
  priceLabel: string;
  priceNote: string;
  intro: string;
  tags: string[];
  readiness: string[];
  options: RouteOption[];
  highlights: string[];
  bring: string[];
  confirmation: string[];
  footerStatus: string;
};

const tourConfigs: Record<string, TourConfig> = {
  "sugba-lagoon-mangrove-tours": {
    slug: "sugba-lagoon-mangrove-tours",
    title: "Sugba Lagoon & Mangrove Experience",
    eyebrow: "Del Carmen route review",
    heroLabel: "Lagoon route",
    image: "/osp/temp-tour-posters/sugba-lagoon-mangrove-tours.png",
    priceLabel: "From PHP 2,650 + fees",
    priceNote:
      "Published route pricing can be shown where available. Entrance fees, timing, local/foreign handling, and operator confirmation must be clear before checkout.",
    intro:
      "Choose a Del Carmen route style first. OSP keeps checkout closed until the route, timing, inclusions, and fee path are clear.",
    tags: ["Verified route", "Del Carmen Port", "Local partner coordinated", "Passport eligible"],
    readiness: [
      "Route options: Sugba Lagoon, Kawhagan, Pamomoan, and mangrove route combinations",
      "Departure: Del Carmen Port",
      "Price visibility: published route price plus entrance-fee visibility",
      "Checkout opens after timing and operator confirmation",
    ],
    options: [
      {
        title: "Sugba Lagoon Classic",
        price: "PHP 2,650 + fees",
        description: "A focused lagoon route for travelers who want the cleanest Del Carmen experience.",
        badge: "Most direct",
      },
      {
        title: "Sugba + Sandbar / Beach",
        price: "PHP 3,200 + fees",
        description: "Adds Kawhagan Sandbar or Pamomoan Beach depending on timing and route readiness.",
        badge: "Expanded route",
      },
      {
        title: "Premium Lagoon Route",
        price: "PHP 3,550 + fees",
        description: "A fuller Del Carmen lagoon-and-mangrove route with broader stop coverage.",
        badge: "Fuller day",
      },
    ],
    highlights: ["Sugba Lagoon", "Kawhagan Sandbar", "Pamomoan Beach", "Mangrove route options"],
    bring: ["Valid OSP QR", "Waterproof bag", "Sun protection", "Government ID if requested"],
    confirmation: [
      "Traveler selects the preferred route style",
      "Operator confirms route, timing, pickup point, and inclusions",
      "Checkout opens only when fee visibility is clear",
    ],
    footerStatus: "Ready for review",
  },
  "bucas-grande-sohoton-tour": {
    slug: "bucas-grande-sohoton-tour",
    title: "Bucas Grande & Sohoton Experience",
    eyebrow: "Dapa / Socorro request-to-confirm",
    heroLabel: "Island route",
    image: "/osp/temp-tour-posters/bucas-grande-sohoton-tour.png",
    priceLabel: "Request to confirm",
    priceNote:
      "Sohoton stays request-to-confirm until route, timing, guide, capacity, pickup, and environmental fee terms are verified.",
    intro:
      "This route is premium but controlled. OSP does not copy General Luna or Del Carmen pricing into Sohoton.",
    tags: ["Confirmation required", "Dapa / Socorro gateway", "Operator coordinated", "Regulated route"],
    readiness: [
      "Route: Bucas Grande, Sohoton Cove, lagoon and cave stops",
      "Departure: Dapa / Socorro gateway",
      "Price visibility: request-to-confirm before checkout",
      "Checkout opens only after route and environmental terms are clear",
    ],
    options: [
      {
        title: "Bucas Grande Route Review",
        price: "Request to confirm",
        description: "For travelers who need confirmed timing, guide terms, pickup details, and route readiness.",
        badge: "Ready for review",
      },
      {
        title: "Sohoton Cove Experience",
        price: "Request to confirm",
        description: "Cove, lagoon, cave, and environmental fee terms are confirmed before checkout opens.",
        badge: "Controlled route",
      },
    ],
    highlights: [
      "Sohoton Cove",
      "Hagukan Cave",
      "Diving Cave",
      "Non-sting jellyfish lagoon",
      "Bolitas Cave",
      "Crystal Cave",
      "Tiktikan Lake",
      "Bubon Group of Islets",
    ],
    bring: ["Valid OSP QR", "Waterproof bag", "Sun protection", "Government ID if requested"],
    confirmation: [
      "Traveler starts the route request through OSP",
      "Route, inclusions, fees, timing, and manifest requirements are confirmed",
      "Checkout opens only when the booking is ready",
    ],
    footerStatus: "Confirmation required",
  },
};

const shellStyle = {
  minHeight: "100vh",
  overflowX: "hidden" as const,
  background:
    "radial-gradient(circle at 50% 0%, rgba(5,150,165,0.18), transparent 34%), radial-gradient(circle at 20% 18%, rgba(243,174,38,0.08), transparent 28%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 48%, #EAFBFA 100%)",
  color: "#013863",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
};

const containerStyle = {
  width: "min(100%, 430px)",
  maxWidth: "100%",
  margin: "0 auto",
  padding: "16px 14px 118px",
  boxSizing: "border-box" as const,
  overflowX: "hidden" as const,
};

const cardStyle = {
  borderRadius: 26,
  background: "rgba(255,255,255,0.96)",
  border: "1px solid rgba(1,56,99,0.10)",
  boxShadow: "0 22px 58px rgba(1,56,99,0.14)",
  boxSizing: "border-box" as const,
  overflow: "hidden" as const,
};

const sectionStyle = {
  borderRadius: 24,
  background: "linear-gradient(180deg, #FFFFFF 0%, #F8FCFC 100%)",
  border: "1px solid rgba(1,56,99,0.09)",
  boxShadow: "0 16px 38px rgba(1,56,99,0.085)",
  padding: 14,
  boxSizing: "border-box" as const,
};

const heroTitleTextStyle = {
  margin: 0,
  color: "#FFFFFF",
  WebkitTextFillColor: "#FFFFFF",
  textDecorationColor: "#FFFFFF",
  fontSize: 27,
  lineHeight: 0.98,
  letterSpacing: "-0.052em",
  fontWeight: 920,
  textShadow: "0 5px 28px rgba(0,0,0,0.78)",
};

const heroPillTextStyle = {
  display: "inline-flex",
  borderRadius: 999,
  padding: "7px 10px",
  background: "rgba(1,56,99,0.50)",
  border: "1px solid rgba(255,255,255,0.24)",
  color: "#FFFFFF",
  WebkitTextFillColor: "#FFFFFF",
  textDecorationColor: "#FFFFFF",
  fontSize: 10,
  fontWeight: 950,
  letterSpacing: "0.075em",
  textTransform: "uppercase" as const,
  textShadow: "0 2px 12px rgba(0,0,0,0.50)",
};

const heroPillAccentStyle = {
  ...heroPillTextStyle,
  background: "rgba(5,150,165,0.54)",
};

const premiumPrimaryCtaStyle = {
  minHeight: 46,
  borderRadius: 999,
  padding: "0 18px",
  background: "linear-gradient(135deg, #013863 0%, #026C84 52%, #0596A5 100%)",
  color: "#FFFFFF",
  WebkitTextFillColor: "#FFFFFF",
  textDecorationColor: "#FFFFFF",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 12,
  lineHeight: 1,
  fontWeight: 950,
  letterSpacing: "-0.01em",
  boxShadow: "0 16px 34px rgba(1,56,99,0.28)",
  border: "1px solid rgba(255,255,255,0.18)",
  whiteSpace: "nowrap" as const,
  boxSizing: "border-box" as const,
};

const premiumStickyBarStyle = {
  position: "fixed" as const,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 20,
  background: "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.98) 100%)",
  borderTop: "1px solid rgba(1,56,99,0.10)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 -18px 38px rgba(1,56,99,0.08)",
  padding: "10px 12px calc(10px + env(safe-area-inset-bottom))",
};

const premiumSecondaryPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  padding: "7px 10px",
  background: "linear-gradient(135deg, #EAFBFA 0%, #FFFFFF 100%)",
  border: "1px solid rgba(5,150,165,0.18)",
  color: "#027E8F",
  fontSize: 10.4,
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: "-0.01em",
  whiteSpace: "normal" as const,
  boxSizing: "border-box" as const,
};

const sectionTitleStyle = {
  margin: 0,
  color: "#013863",
  fontSize: 18,
  lineHeight: 1.08,
  letterSpacing: "-0.03em",
  fontWeight: 880,
};

const bodyTextStyle = {
  margin: 0,
  color: "#50668B",
  fontSize: 12.4,
  lineHeight: 1.48,
  fontWeight: 720,
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span style={premiumSecondaryPillStyle}
    >
      {children}
    </span>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li
      style={{
        display: "grid",
        gridTemplateColumns: "20px 1fr",
        gap: 9,
        alignItems: "start",
        color: "#50668B",
        fontSize: 12.4,
        lineHeight: 1.46,
        fontWeight: 740,
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          background: "linear-gradient(135deg, #EAFBFA 0%, #FFFFFF 100%)",
          color: "#0596A5",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 950,
          flex: "0 0 auto",
        }}
      >
        ✓
      </span>
      <span style={{ overflowWrap: "anywhere" }}>{children}</span>
    </li>
  );
}

export default function TourDetailPage({ params }: TourDetailPageProps) {
  const config = tourConfigs[params.slug];

  if (!config) {
    notFound();
  }

  return (
    <main style={shellStyle}>
      <div style={containerStyle}>
        <Link
          href="/traveler/explore"
          style={{
            display: "inline-flex",
            color: "#0596A5",
            fontSize: 12,
            fontWeight: 900,
            textDecoration: "none",
            marginBottom: 12,
          }}
        >
          ← Back to Explore
        </Link>

        <section style={{ ...cardStyle, marginBottom: 12 }}>
          <div style={{ height: 252, position: "relative", overflow: "hidden" }}>
            <img
              src={config.image}
              alt={config.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: "scale(1.035)" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(1,56,99,0.16) 0%, rgba(1,56,99,0.64) 42%, rgba(1,56,99,0.99) 100%)",
              }}
            />
            <div style={{ position: "absolute", left: 16, right: 16, bottom: 15, color: "#FFFFFF" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
                <span style={{ ...heroPillTextStyle, color: "#FFFFFF", WebkitTextFillColor: "#FFFFFF", textDecorationColor: "#FFFFFF" }}
                >
                  {config.heroLabel}
                </span>
                <span style={{ ...heroPillAccentStyle, color: "#FFFFFF", WebkitTextFillColor: "#FFFFFF", textDecorationColor: "#FFFFFF" }}
                >
                  Operator-coordinated
                </span>
              </div>

              <h1 style={{ ...heroTitleTextStyle, color: "#FFFFFF", WebkitTextFillColor: "#FFFFFF", textDecorationColor: "#FFFFFF" }}>{config.title}
              </h1>

              <p
                style={{
                  margin: "9px 0 0",
                  color: "rgba(255,255,255,0.94)",
                  fontSize: 12.6,
                  lineHeight: 1.46,
                  fontWeight: 760,
                  textShadow: "0 2px 14px rgba(0,0,0,0.48)",
                }}
              >
                {config.intro}
              </p>
            </div>
          </div>

          <div style={{ padding: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, color: "#64748B", fontSize: 10, fontWeight: 950, letterSpacing: "0.09em", textTransform: "uppercase" }}>
                  Starts from
                </p>
                <p style={{ margin: "2px 0 0", color: "#013863", fontSize: 20, lineHeight: 1.05, fontWeight: 950, letterSpacing: "-0.04em" }}>
                  {config.priceLabel}
                </p>
              </div>

              <Link href={`/traveler/explore/tours/${config.slug}/book`} style={premiumPrimaryCtaStyle}>Review Trip →</Link>
            </div>

            <p style={{ ...bodyTextStyle, marginTop: 10 }}>{config.priceNote}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 }}>
              {config.tags.map((tag) => (
                <Pill key={tag}>{tag}</Pill>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...sectionStyle, marginBottom: 12 }}>
          <h2 style={sectionTitleStyle}>Trip readiness</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 10 }}>
            {config.readiness.map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </ul>
        </section>

        <section style={{ ...sectionStyle, marginBottom: 12 }}>
          <h2 style={sectionTitleStyle}>Choose a route style</h2>
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            {config.options.map((option) => (
              <article
                key={option.title}
                style={{
                  borderRadius: 20,
                  padding: 12,
                  background: "linear-gradient(135deg, #FFFFFF 0%, #F7FCFC 58%, #EAFBFA 100%)",
                  border: "1px solid rgba(5,150,165,0.16)",
                  boxShadow: "0 12px 26px rgba(1,56,99,0.075)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        borderRadius: 999,
                        padding: "5px 8px",
                        background: "#FFF8EA",
                        border: "1px solid rgba(243,174,38,0.28)",
                        color: "#8A5A00",
                        fontSize: 9.6,
                        fontWeight: 950,
                        textTransform: "uppercase",
                        letterSpacing: "0.055em",
                      }}
                    >
                      {option.badge}
                    </span>
                    <h3
                      style={{
                        margin: "8px 0 0",
                        color: "#013863",
                        fontSize: 15.5,
                        lineHeight: 1.08,
                        fontWeight: 950,
                        letterSpacing: "-0.035em",
                      }}
                    >
                      {option.title}
                    </h3>
                  </div>
                  <strong
                    style={{
                      color: "#0596A5",
                      fontSize: 12.2,
                      lineHeight: 1.1,
                      textAlign: "right",
                      fontWeight: 950,
                      maxWidth: 118,
                    }}
                  >
                    {option.price}
                  </strong>
                </div>
                <p style={{ ...bodyTextStyle, marginTop: 8 }}>{option.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ ...sectionStyle, marginBottom: 12 }}>
          <h2 style={sectionTitleStyle}>Experience highlights</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 9 }}>
            {config.highlights.map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </ul>
        </section>

        <section style={{ ...sectionStyle, marginBottom: 74 }}>
          <h2 style={sectionTitleStyle}>Before checkout</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 9 }}>
            {config.confirmation.map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </ul>
        </section>
      </div>

      <div style={premiumStickyBarStyle}
      >
        <div
          style={{
            width: "min(100%, 430px)",
            maxWidth: "100%",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 12,
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, color: "#64748B", fontSize: 9.5, fontWeight: 950, letterSpacing: "0.09em", textTransform: "uppercase" }}>
              {config.footerStatus}
            </p>
            <p
              style={{
                margin: "2px 0 0",
                color: "#013863",
                fontSize: 14.2,
                lineHeight: 1.08,
                fontWeight: 950,
                overflowWrap: "anywhere",
              }}
            >
              {config.priceLabel}
            </p>
          </div>

          <Link href={`/traveler/explore/tours/${config.slug}/book`} style={premiumPrimaryCtaStyle}>Review Trip →</Link>
        </div>
      </div>
    </main>
  );
}
