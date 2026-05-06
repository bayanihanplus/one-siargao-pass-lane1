import Link from "next/link";
import { notFound } from "next/navigation";

type MarketplaceService = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  category?: string | null;
  media?: {
    heroImageUrl?: string | null;
    imageUrl?: string | null;
    thumbnailUrl?: string | null;
    gallery?: string[];
  };
  price?: {
    displayPrice?: string | null;
    pricingReady?: boolean;
    currencyCode?: string | null;
  };
  booking?: {
    bookingMode?: string | null;
    ctaMode?: string | null;
    instantCheckoutAllowed?: boolean;
    paymentExecutionIncluded?: boolean;
  };
  content?: {
    inclusions?: string[];
    cancellationPolicy?: string | null;
    paymentTerms?: string | null;
  };
  governance?: {
    requiresManifest?: boolean;
    requiresClearance?: boolean;
    qrValidationRequired?: boolean;
    passportTrailEligible?: boolean;
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";

const TEMP_POSTERS: Record<string, string> = {
  "tri-island-joiner": "/osp/temp-tour-posters/tri-island-joiner.png",
  "private-diy-land-tour": "/osp/temp-tour-posters/private-diy-land-tour.png",
  "bucas-grande-sohoton-tour": "/osp/temp-tour-posters/bucas-grande-sohoton-tour.png",
  "sugba-lagoon-mangrove-tours": "/osp/temp-tour-posters/sugba-lagoon-mangrove-tours.png",
};

const TOUR_PORT_CONTEXT: Record<string, { lgu: string; port: string; queue: string; note: string }> = {
  "tri-island-joiner": {
    lgu: "GL LGU",
    port: "GL Port",
    queue: "GL fulfillment queue",
    note: "Dedicated logic comes in next MVP.",
  },
  "bucas-grande-sohoton-tour": {
    lgu: "Dapa LGU",
    port: "Dapa Port",
    queue: "Future Dapa boat-operator queue integration",
    note: "Current environment uses manual boat-operator queueing.",
  },
  "sugba-lagoon-mangrove-tours": {
    lgu: "Del Carmen LGU",
    port: "Del Carmen Port",
    queue: "Future Del Carmen boat-operator queue integration",
    note: "Current environment uses manual boat-operator queueing.",
  },
};

const TOUR_PAYMENT_NOTES: Record<string, string[]> = {
  "tri-island-joiner": [
    "Booking intent is created from the selected tour.",
    "Operator assignment starts after capture.",
    "Sandbox mode only.",
  ],
  "private-diy-land-tour": [
    "Land tour booking intent is created from the selected route.",
    "Operator confirms vehicle, route timing, and final pickup after payment capture.",
    "Sandbox mode only.",
  ],
  "bucas-grande-sohoton-tour": [
    "Sohoton booking intent is created from the selected tour.",
    "Operator confirms schedule, guide, fees, and route capacity after payment capture.",
    "Sandbox mode only.",
  ],
  "sugba-lagoon-mangrove-tours": [
    "Sugba / Del Carmen booking intent is created from the selected route.",
    "Operator confirms chosen tour option, timing, and applicable fees after payment capture.",
    "Sandbox mode only.",
  ],
};

async function getService(slug: string): Promise<MarketplaceService | null> {
  try {
    const res = await fetch(`${API_BASE}/traveler/marketplace/services?limit=24`, { cache: "no-store" });
    if (!res.ok) return null;

    const json = await res.json();
    const services: MarketplaceService[] = Array.isArray(json?.services) ? json.services : [];
    return services.find((service) => service.slug === slug) || null;
  } catch {
    return null;
  }
}

function getImage(service: MarketplaceService) {
  return (
    service.media?.heroImageUrl ||
    service.media?.imageUrl ||
    service.media?.thumbnailUrl ||
    service.media?.gallery?.[0] ||
    TEMP_POSTERS[service.slug] ||
    null
  );
}

function extractAmount(displayPrice?: string | null) {
  const value = String(displayPrice || "").replace(/[^\d.]/g, "");
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 54%, #EAFBFA 100%)",
  color: "#013863",
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
} as const;

const shellStyle = {
  width: "min(100%, 414px)",
  margin: "0 auto",
  padding: "8px 8px 82px",
  display: "grid",
  gap: 12,
} as const;

const cardStyle = {
  borderRadius: 18,
  background: "rgba(255,255,255,0.96)",
  border: "1px solid rgba(1,56,99,0.10)",
  boxShadow: "0 8px 18px rgba(1,56,99,0.08)",
  overflow: "hidden",
} as const;

const panelStyle = {
  borderRadius: 16,
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(1,56,99,0.10)",
  boxShadow: "0 12px 30px rgba(1,56,99,0.07)",
  padding: 10,
} as const;

const rowStyle = {
  display: "flex",
  gap: 9,
  alignItems: "flex-start",
  color: "#50668B",
  fontSize: 11,
  fontWeight: 740,
  lineHeight: 1.3,
} as const;

const dotStyle = {
  display: "grid",
  placeItems: "center",
  width: 18,
  height: 18,
  flexShrink: 0,
  borderRadius: 999,
  background: "#EAFBFA",
  color: "#0596A5",
  fontSize: 10.5,
  fontWeight: 900,
} as const;

const payButtonStyle = {
  borderRadius: 999,
  background: "linear-gradient(135deg, #013863, #0596A5)",
  color: "#ffffff",
  padding: "10px 12px",
  textDecoration: "none",
  fontSize: 11.5,
  fontWeight: 900,
  textAlign: "center",
  boxShadow: "0 8px 18px rgba(1,56,99,0.14)",
} as const;

export default async function TourPaymentSandboxPage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);
  if (!service) notFound();

  const image = getImage(service);
  const amount = extractAmount(service.price?.displayPrice);
  const sandboxIntentId = `tour_sandbox_${service.slug}_${amount || "quote"}`;
  const amountLabel = amount ? `PHP ${amount.toLocaleString("en-PH")}` : service.price?.displayPrice || "Request quote";
  const portContext = TOUR_PORT_CONTEXT[service.slug] || null;

  const isTriIsland = service.slug === "tri-island-joiner";

  const snapshot = {
    routeProduct: isTriIsland ? "GL_TRI_ISLAND_STANDARD" : service.slug.toUpperCase().replace(/-/g, "_"),
    route: isTriIsland ? "Guyam · Daku · Naked Island" : service.title,
    port: portContext?.port || "OSP Port",
    departure: "Chosen date + departure slot",
    pax: "Regular + senior pax captured before checkout",
    boatClass: isTriIsland ? "GL Boat Class A–E by paying pax" : "Route product capacity rule",
  };

  const feeRows = isTriIsland
    ? [
        ["Boat rate", "By GL boat class"],
        ["Tour guide fee", "Separate line item"],
        ["Entrance fee", "PHP 50 / pax"],
        ["Daku entrance fee", "PHP 100 / pax"],
        ["Mam-On fee", "Only when route applies"],
        ["Port charge", "PHP 100 regular · PHP 80 senior"],
        ["OSP platform fee", "Shown separately"],
        ["OSP QR / event fee", "Separate if applicable"],
        ["Payment processing", "Shown if charged"],
      ]
    : [
        ["Route product price", "From approved route/service rule"],
        ["Entrance fee", "PHP 100 / pax when route applies"],
        ["Port / LGU fee", "Shown when applicable"],
        ["OSP platform fee", "Shown separately"],
        ["OSP QR / event fee", "Separate if applicable"],
        ["Payment processing", "Shown if charged"],
      ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(5,150,165,0.10), transparent 34%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 55%, #EAFBFA 100%)",
        color: "#013863",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <div style={{ width: "min(100%, 414px)", margin: "0 auto", padding: "14px 12px 104px" }}>
        <Link
          href={`/traveler/explore/tours/${service.slug}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 10,
            color: "#0596A5",
            fontSize: 12,
            fontWeight: 850,
            textDecoration: "none",
          }}
        >
          ← Back to tour
        </Link>

        <section
          style={{
            borderRadius: 28,
            overflow: "hidden",
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 22px 54px rgba(1,56,99,0.16)",
          }}
        >
          <div
            style={{
              height: 184,
              position: "relative",
              background: "linear-gradient(135deg, #013863, #0596A5)",
            }}
          >
            {image ? (
              <img
                src={image}
                alt={`${service.title} payment preview`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  opacity: 0.52,
                }}
              />
            ) : null}

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(1,56,99,0.28) 0%, rgba(1,56,99,0.92) 100%)",
              }}
            />

            <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, color: "#FFFFFF" }}>
              <span
                style={{
                  display: "inline-flex",
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.92)",
                  color: "#013863",
                  fontSize: 10.5,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Pricing Snapshot
              </span>

              <h1
                style={{
                  margin: "8px 0 0",
                  fontSize: 28,
                  lineHeight: 1.02,
                  letterSpacing: "-0.045em",
                  fontWeight: 900,
                  textShadow: "0 2px 14px rgba(0,0,0,0.35)",
                }}
              >
                {service.title}
              </h1>

              <p
                style={{
                  margin: "7px 0 0",
                  color: "rgba(255,255,255,0.88)",
                  fontSize: 12,
                  lineHeight: 1.25,
                  fontWeight: 750,
                  textShadow: "0 1px 10px rgba(0,0,0,0.28)",
                }}
              >
                Transparent one-time payment preview.
              </p>
            </div>
          </div>

          <div style={{ padding: 18 }}>
            <p
              style={{
                margin: 0,
                color: "#50668B",
                fontSize: 11,
                fontWeight: 850,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              Amount due
            </p>

            <h2
              style={{
                margin: "4px 0 0",
                color: "#013863",
                fontSize: 31,
                lineHeight: 1,
                letterSpacing: "-0.045em",
                fontWeight: 900,
              }}
            >
              {amountLabel}
            </h2>

            <p style={{ margin: "8px 0 0", color: "#50668B", fontSize: 12, lineHeight: 1.35, fontWeight: 700 }}>
              Sandbox preview only. Live checkout must lock this from backend pricing snapshot records.
            </p>

            <Link
              href={`/traveler/payments/${sandboxIntentId}/sandbox-handoff?source=tour&slug=${service.slug}`}
              style={{
                marginTop: 14,
                minHeight: 48,
                borderRadius: 999,
                background: "linear-gradient(135deg, #013863, #0596A5)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: 13.5,
                fontWeight: 900,
                boxShadow: "0 14px 30px rgba(1,56,99,0.20)",
              }}
            >
              Continue Payment
            </Link>

            <div
              style={{
                marginTop: 14,
                borderRadius: 18,
                background: "#F4FCFA",
                border: "1px solid rgba(5,150,165,0.16)",
                padding: 12,
              }}
            >
              <p style={{ margin: 0, color: "#0596A5", fontSize: 10.5, fontWeight: 900, letterSpacing: "0.09em", textTransform: "uppercase" }}>
                Trip snapshot
              </p>

              <div style={{ marginTop: 9, display: "grid", gap: 7 }}>
                {[
                  ["Route product", snapshot.routeProduct],
                  ["Route", snapshot.route],
                  ["Port", snapshot.port],
                  ["Departure", snapshot.departure],
                  ["Pax", snapshot.pax],
                  ["Boat class", snapshot.boatClass],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ color: "#50668B", fontSize: 11.5, fontWeight: 750 }}>{label}</span>
                    <strong style={{ color: "#013863", fontSize: 11.5, fontWeight: 900, textAlign: "right" }}>{value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: 10,
                borderRadius: 18,
                background: "#FFFFFF",
                border: "1px solid rgba(1,56,99,0.10)",
                padding: 12,
              }}
            >
              <p style={{ margin: 0, color: "#013863", fontSize: 10.5, fontWeight: 900, letterSpacing: "0.09em", textTransform: "uppercase" }}>
                Price breakdown
              </p>

              <div style={{ marginTop: 9, display: "grid", gap: 7 }}>
                {feeRows.map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ color: "#50668B", fontSize: 11.5, fontWeight: 750 }}>{label}</span>
                    <strong style={{ color: "#013863", fontSize: 11.5, fontWeight: 900, textAlign: "right" }}>{value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                marginTop: 10,
                borderRadius: 18,
                background: "#FFF8EA",
                border: "1px solid rgba(243,174,38,0.34)",
                padding: 12,
              }}
            >
              <p style={{ margin: 0, color: "#8A5A00", fontSize: 10.5, fontWeight: 900, letterSpacing: "0.09em", textTransform: "uppercase" }}>
                No hidden charges
              </p>
              <p style={{ margin: "5px 0 0", color: "#013863", fontSize: 11.5, lineHeight: 1.35, fontWeight: 780 }}>
                Live checkout must show route fees, island fees, port charges, OSP fees, QR/event fees, and payment processing before payment.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 20,
          background: "rgba(255,255,255,0.92)",
          borderTop: "1px solid rgba(1,56,99,0.10)",
          backdropFilter: "blur(14px)",
          padding: "10px 12px calc(10px + env(safe-area-inset-bottom))",
        }}
      >
        <div
          style={{
            width: "min(100%, 414px)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ margin: 0, color: "#50668B", fontSize: 10, fontWeight: 900, letterSpacing: "0.09em", textTransform: "uppercase" }}>
              Amount due
            </p>
            <p style={{ margin: "2px 0 0", color: "#013863", fontSize: 15, fontWeight: 900 }}>
              {amountLabel}
            </p>
          </div>

          <Link
            href={`/traveler/payments/${sandboxIntentId}/sandbox-handoff?source=tour&slug=${service.slug}`}
            style={{
              minHeight: 42,
              padding: "0 18px",
              borderRadius: 999,
              background: "#013863",
              color: "#FFFFFF",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 900,
              boxShadow: "0 10px 22px rgba(1,56,99,0.18)",
            }}
          >
            Continue
          </Link>
        </div>
      </div>
    </main>
  );
}
