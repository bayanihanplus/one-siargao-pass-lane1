import Link from "next/link";
import { notFound } from "next/navigation";

type TourBookPageProps = {
  params: {
    slug: string;
  };
};

type BookConfig = {
  slug: string;
  title: string;
  eyebrow: string;
  image: string;
  priceLabel: string;
  statusLabel: string;
  lead: string;
  checkpoints: string[];
  travelerDetails: string[];
  coordinated: string[];
  bring: string[];
};

const bookConfigs: Record<string, BookConfig> = {
  "sugba-lagoon-mangrove-tours": {
    slug: "sugba-lagoon-mangrove-tours",
    title: "Review Sugba Lagoon Experience",
    eyebrow: "Trip review",
    image: "/osp/temp-tour-posters/sugba-lagoon-mangrove-tours.png",
    priceLabel: "From PHP 2,650 + fees",
    statusLabel: "Checkout after confirmation",
    lead:
      "Choose the Del Carmen route style first. Checkout opens after timing, entrance fees, pickup details, and operator confirmation are clear.",
    checkpoints: [
      "Preferred route style is selected",
      "Travel date, time window, and pickup details are checked",
      "Entrance fees and route inclusions are visible before checkout",
    ],
    travelerDetails: [
      "Travel date and preferred time",
      "Number of travelers",
      "Pickup or meeting point",
      "Preferred route option",
      "Special notes, add-ons, or accessibility needs",
    ],
    coordinated: [
      "OSP route visibility reviewed",
      "Approved local partner coordination",
      "Route, timing, and inclusion confirmation",
      "Checkout readiness before payment opens",
    ],
    bring: ["Valid OSP QR", "Waterproof bag", "Sun protection", "Government ID if requested"],
  },
  "bucas-grande-sohoton-tour": {
    slug: "bucas-grande-sohoton-tour",
    title: "Review Bucas Grande & Sohoton",
    eyebrow: "Confirmation required",
    image: "/osp/temp-tour-posters/bucas-grande-sohoton-tour.png",
    priceLabel: "Request to confirm",
    statusLabel: "Route confirmation required",
    lead:
      "Bucas Grande and Sohoton stays request-to-confirm. Route, timing, guide, capacity, pickup, and environmental fees must be clear before checkout.",
    checkpoints: [
      "Route and timing are confirmed before checkout",
      "Guide, capacity, and environmental fee terms are reviewed",
      "No General Luna or Del Carmen pricing is copied into Sohoton",
    ],
    travelerDetails: [
      "Travel date and preferred time",
      "Number of travelers",
      "Pickup or meeting point",
      "Preferred route option",
      "Special notes, add-ons, or accessibility needs",
    ],
    coordinated: [
      "OSP route request flow",
      "Approved local partner coordination",
      "Manifest and route coordination where required",
      "Checkout readiness before payment opens",
    ],
    bring: ["Valid OSP QR", "Waterproof bag", "Sun protection", "Government ID if requested"],
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

function NumberStep({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <li
      style={{
        display: "grid",
        gridTemplateColumns: "24px 1fr",
        gap: 10,
        alignItems: "start",
        color: "#50668B",
        fontSize: 12.4,
        lineHeight: 1.46,
        fontWeight: 740,
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          background: "linear-gradient(135deg, #EAFBFA 0%, #FFFFFF 100%)",
          color: "#0596A5",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 950,
        }}
      >
        {index}
      </span>
      <span style={{ overflowWrap: "anywhere" }}>{children}</span>
    </li>
  );
}

export default function TourBookPage({ params }: TourBookPageProps) {
  const config = bookConfigs[params.slug];

  if (!config) {
    notFound();
  }

  return (
    <main style={shellStyle}>
      <div style={containerStyle}>
        <Link
          href={`/traveler/explore/tours/${config.slug}`}
          style={{
            display: "inline-flex",
            color: "#0596A5",
            fontSize: 12,
            fontWeight: 900,
            textDecoration: "none",
            marginBottom: 12,
          }}
        >
          ← Back to tour details
        </Link>

        <section
          style={{
            borderRadius: 26,
            overflow: "hidden",
            background: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 22px 58px rgba(1,56,99,0.14)",
            marginBottom: 12,
          }}
        >
          <div style={{ height: 242, position: "relative", overflow: "hidden" }}>
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
              <span style={{ ...heroPillTextStyle, color: "#FFFFFF", WebkitTextFillColor: "#FFFFFF", textDecorationColor: "#FFFFFF" }}
              >
                {config.eyebrow}
              </span>

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
                {config.lead}
              </p>
            </div>
          </div>

          <div style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div>
                <p style={{ margin: 0, color: "#64748B", fontSize: 10, fontWeight: 950, letterSpacing: "0.09em", textTransform: "uppercase" }}>
                  Price guide
                </p>
                <p style={{ margin: "2px 0 0", color: "#013863", fontSize: 20, lineHeight: 1.05, fontWeight: 950, letterSpacing: "-0.04em" }}>
                  {config.priceLabel}
                </p>
              </div>

              <span
                style={{
                  borderRadius: 999,
                  padding: "8px 10px",
                  background: "#FFF8EA",
                  border: "1px solid rgba(243,174,38,0.30)",
                  color: "#8A5A00",
                  fontSize: 10.5,
                  lineHeight: 1.1,
                  fontWeight: 950,
                  textAlign: "center",
                  maxWidth: 132,
                }}
              >
                {config.statusLabel}
              </span>
            </div>
          </div>
        </section>

        <section style={{ ...sectionStyle, marginBottom: 12 }}>
          <h2 style={sectionTitleStyle}>Before checkout opens</h2>
          <ol style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 10 }}>
            {config.checkpoints.map((item, index) => (
              <NumberStep key={item} index={index + 1}>
                {item}
              </NumberStep>
            ))}
          </ol>
        </section>

        <section style={{ ...sectionStyle, marginBottom: 12 }}>
          <h2 style={sectionTitleStyle}>Trip details to confirm</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 9 }}>
            {config.travelerDetails.map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </ul>
        </section>

        <section style={{ ...sectionStyle, marginBottom: 12 }}>
          <h2 style={sectionTitleStyle}>What OSP coordinates</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 9 }}>
            {config.coordinated.map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </ul>
        </section>

        <section style={{ ...sectionStyle, marginBottom: 74 }}>
          <h2 style={sectionTitleStyle}>What to bring</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 9 }}>
            {config.bring.map((item) => (
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
              Trip status
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
              {config.statusLabel}
            </p>
          </div>

          <Link href="/traveler/explore" style={premiumPrimaryCtaStyle}>Continue Exploring →</Link>
        </div>
      </div>
    </main>
  );
}
