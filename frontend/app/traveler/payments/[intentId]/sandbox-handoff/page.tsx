import Link from "next/link";
type SandboxHandoffPageProps = {
  params: Promise<{
    intentId: string;
  }>;
  searchParams?: Promise<{
    provider?: string;
    reason?: string;
    amount?: string;
    source?: string;
    slug?: string;
  }>;
};

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
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";

const TEMP_POSTERS: Record<string, string> = {
  "tri-island-joiner": "/osp/temp-tour-posters/tri-island-joiner.png",
  "private-diy-land-tour": "/osp/temp-tour-posters/private-diy-land-tour.png",
  "bucas-grande-sohoton-tour": "/osp/temp-tour-posters/bucas-grande-sohoton-tour.png",
  "sugba-lagoon-mangrove-tours": "/osp/temp-tour-posters/sugba-lagoon-mangrove-tours.png",
};

const TOUR_PORT_CONTEXT: Record<string, {
  lgu: string;
  port: string;
  queue: string;
  assignment: string;
}> = {
  "tri-island-joiner": {
    lgu: "GL LGU",
    port: "GL Port",
    queue: "General Luna island-hopping fulfillment queue",
    assignment: "Boat, seat count, departure time, voucher ticket, and boarding-pass QR",
  },
  "bucas-grande-sohoton-tour": {
    lgu: "Dapa LGU",
    port: "Dapa Port",
    queue: "Dapa boat-operator fulfillment queue",
    assignment: "Boat, route capacity, guide coordination, departure time, voucher ticket, and boarding-pass QR",
  },
  "sugba-lagoon-mangrove-tours": {
    lgu: "Del Carmen LGU",
    port: "Del Carmen Port",
    queue: "Del Carmen boat-operator fulfillment queue",
    assignment: "Tour A / Tour B / Tour B+ / Mangrove Tour option, boat, seat count, boarding time, and voucher ticket",
  },
};

const accommodationPreviewMap: Record<string, {
  stayName: string;
  stayType: string;
  location: string;
  amountLabel: string;
  detailHref: string;
}> = {
  "preview-accommodation-general-luna-surf-stay": {
    stayName: "General Luna Surf Stay",
    stayType: "Homestay / Surf Stay",
    location: "General Luna · near surf access",
    amountLabel: "PHP 2,500",
    detailHref: "/traveler/explore/stays/preview-general-luna-surf-stay",
  },
  "preview-accommodation-cloud-9-family-villa": {
    stayName: "Cloud 9 Family Villa",
    stayType: "Villa",
    location: "Cloud 9 / Catangnan area",
    amountLabel: "PHP 6,800",
    detailHref: "/traveler/explore/stays/preview-cloud-9-family-villa",
  },
  "preview-accommodation-barkada-hostel-siargao": {
    stayName: "Barkada Hostel Siargao",
    stayType: "Hostel / Barkada Room",
    location: "Tourism Road access",
    amountLabel: "PHP 950",
    detailHref: "/traveler/explore/stays/preview-barkada-hostel-siargao",
  },
  "preview-accommodation-town-center-inn": {
    stayName: "Town Center Inn",
    stayType: "Guesthouse",
    location: "General Luna town center",
    amountLabel: "PHP 3,200",
    detailHref: "/traveler/explore/stays/preview-town-center-inn",
  },
};

async function getTourService(slug?: string): Promise<MarketplaceService | null> {
  if (!slug) return null;

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

function getTourImage(service: MarketplaceService | null, slug?: string) {
  return (
    service?.media?.heroImageUrl ||
    service?.media?.imageUrl ||
    service?.media?.thumbnailUrl ||
    service?.media?.gallery?.[0] ||
    (slug ? TEMP_POSTERS[slug] : null) ||
    null
  );
}

function resolveReasonCopy(reason?: string, isTour?: boolean) {
  if (isTour) {
    return "Sandbox payment succeeded for the tour flow. Production wiring will trigger backend email, operator queue notification, voucher ticket generation, and the in-app boarding workflow.";
  }

  if (reason === "paymongo-key-missing") {
    return "PayMongo sandbox key is not configured in this local environment, so OSP is showing the internal sandbox handoff screen for demo continuity.";
  }

  if (reason === "paymongo-base-url-missing") {
    return "The redirect base URL is not configured in this local environment, so OSP is showing the internal sandbox handoff screen for demo continuity.";
  }

  return "OSP opened the sandbox payment handoff screen for this accommodation flow.";
}

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 0% 0%, rgba(0,151,167,0.08), transparent 28%), linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 48%, #FFFFFF 100%)",
  padding: "8px 8px 22px",
  boxSizing: "border-box",
} as const;

const shellStyle = {
  width: "100%",
  maxWidth: 392,
  margin: "0 auto",
} as const;

const navyHeroStyle = {
  borderRadius: 18,
  background: "linear-gradient(135deg, #013863 0%, #003B66 62%, #014B78 100%)",
  color: "#FFFFFF",
  padding: 13,
  boxShadow: "0 10px 22px rgba(1,56,99,0.12)",
} as const;

const panelStyle = {
  marginTop: 14,
  borderRadius: 16,
  background: "#FFFFFF",
  border: "1px solid rgba(1,56,99,0.10)",
  boxShadow: "0 8px 18px rgba(1,56,99,0.06)",
  padding: 10,
} as const;

const goldPanelStyle = {
  marginTop: 14,
  borderRadius: 16,
  background: "linear-gradient(180deg, #FFF8EA 0%, #FFFFFF 100%)",
  border: "1px solid rgba(243,174,38,0.42)",
  boxShadow: "0 8px 18px rgba(1,56,99,0.06)",
  padding: 10,
} as const;

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  borderRadius: 16,
  background: "#F4FCFA",
  border: "1px solid rgba(0,151,167,0.16)",
  padding: "12px 13px",
} as const;

const stepRowStyle = {
  display: "flex",
  gap: 10,
  alignItems: "flex-start",
  color: "#50668B",
  fontSize: 11.5,
  lineHeight: 1.32,
  fontWeight: 790,
} as const;

const stepDotStyle = {
  display: "grid",
  placeItems: "center",
  width: 22,
  height: 22,
  flexShrink: 0,
  borderRadius: 999,
  background: "#EAFBFA",
  color: "#0596A5",
  fontSize: 11,
  fontWeight: 850,
} as const;

export default async function SandboxHandoffPage({ params, searchParams }: SandboxHandoffPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const intentId = resolvedParams.intentId;
  const source = resolvedSearchParams.source || "";
  const slug = resolvedSearchParams.slug || "";
  const isTour = source === "tour";
  const tour = isTour ? await getTourService(slug) : null;
  const tourImage = getTourImage(tour, slug);
  const portContext = slug ? TOUR_PORT_CONTEXT[slug] || null : null;

  const preview = accommodationPreviewMap[intentId] || {
    stayName: "OSP Booking",
    stayType: "Booking record",
    location: "One Siargao Pass",
    amountLabel: resolvedSearchParams.amount ? `PHP ${resolvedSearchParams.amount}` : "PHP 1,500",
    detailHref: "/traveler/payments",
  };

  const title = isTour ? tour?.title || "Tour booking" : preview.stayName;
  const amountLabel = resolvedSearchParams.amount ? `PHP ${resolvedSearchParams.amount}` : isTour ? "PHP 1,500" : preview.amountLabel;
  const routeLabel =
    slug === "tri-island-joiner"
      ? "GL_TRI_ISLAND_STANDARD"
      : slug
        ? slug.toUpperCase().replace(/-/g, "_")
        : "OSP_BOOKING";

  const paymentHref = `/traveler/payments/${encodeURIComponent(intentId)}?payment=paymongo-success${isTour && slug ? `&source=tour&slug=${encodeURIComponent(slug)}` : ""}`;

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
          href={isTour && slug ? `/traveler/payments/tour-sandbox/${encodeURIComponent(slug)}` : "/traveler/payments"}
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
          ← Back
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
            {tourImage ? (
              <img
                src={tourImage}
                alt={`${title} payment handoff`}
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
                Payment Captured
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
                {title}
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
                Sandbox confirmation for QA. No live charge was made.
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
              Sandbox total
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
              Payment handoff is complete. Live production will issue voucher, receipt, and boarding records from backend events.
            </p>

            <Link
              href={paymentHref}
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
              View Payment Record
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
                Handoff snapshot
              </p>

              <div style={{ marginTop: 9, display: "grid", gap: 7 }}>
                {[
                  ["Payment intent", intentId],
                  ["Route product", routeLabel],
                  ["Port", portContext?.port || preview.location],
                  ["Status", "Sandbox captured"],
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
                Next backend events
              </p>

              <div style={{ marginTop: 9, display: "grid", gap: 7 }}>
                {[
                  ["Voucher", "Issued after payment success"],
                  ["Receipt", "Generated from payment event"],
                  ["Boarding QR", "Issued after valid assignment"],
                  ["Manifest", "Updated after QR boarding scan"],
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
                background: "#FFF8EA",
                border: "1px solid rgba(243,174,38,0.34)",
                padding: 12,
              }}
            >
              <p style={{ margin: 0, color: "#8A5A00", fontSize: 10.5, fontWeight: 900, letterSpacing: "0.09em", textTransform: "uppercase" }}>
                Locked doctrine
              </p>
              <p style={{ margin: "5px 0 0", color: "#013863", fontSize: 11.5, lineHeight: 1.35, fontWeight: 780 }}>
                Voucher is commercial proof. Boarding QR is operational permission. Manifest is boarding truth.
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
              Sandbox total
            </p>
            <p style={{ margin: "2px 0 0", color: "#013863", fontSize: 15, fontWeight: 900 }}>
              {amountLabel}
            </p>
          </div>

          <Link
            href={paymentHref}
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
