import UniversalTravelerBottomTabBar from "../../../../../src/components/traveler/UniversalTravelerBottomTabBar";

type TourSandboxPaymentPageProps = {
  params?: {
    slug?: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

const OSP = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  mist: "#EAFBFA",
  slate: "#50668B",
  white: "#FFFFFF",
};

function readParam(
  searchParams: TourSandboxPaymentPageProps["searchParams"],
  key: string,
  fallback = "",
) {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
}

function label(value: string) {
  return String(value || "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function peso(value: string | number) {
  const amount = Number(value || 0);
  return `PHP ${amount.toLocaleString("en-PH")}`;
}

export default function TourSandboxPaymentPage({
  params,
  searchParams,
}: TourSandboxPaymentPageProps) {
  const slug = params?.slug || readParam(searchParams, "trail", "siargao-land-tour");
  const trailSlug = readParam(searchParams, "trail", slug);
  const isSugba = trailSlug === "sugba-lagoon" || String(slug).startsWith("SUGBA_LAGOON");

  const officialTrail = readParam(
    searchParams,
    "officialTrail",
    isSugba
      ? "Sugba Lagoon"
      : slug === "siargao-land-tour"
        ? "Siargao Land Tour Passport Trail"
        : "Passport Trail Tour",
  );

  const routeProduct = readParam(searchParams, "routeProduct", isSugba ? String(slug) : "");
  const productCode = readParam(searchParams, "productCode", isSugba ? routeProduct : "SPM_LAND_TOUR_PRIVATE_MVP");
  const pricingVersion = readParam(searchParams, "pricingVersion", isSugba ? "DEL_CARMEN_SUGBA_2026_05" : "LAND_TOUR_MVP_2026_05");
  const pricingMode = readParam(searchParams, "pricingMode", isSugba ? "ROUTE_PRODUCT_PLUS_ENTRANCE_FEE" : "PAX_TIERED_PER_HEAD");
  const paymentTiming = readParam(searchParams, "paymentTiming", isSugba ? "AFTER_ROUTE_READINESS" : "AFTER_OPERATOR_CONFIRMATION");
  const currencyCode = readParam(searchParams, "currencyCode", "PHP");

  const routeType = readParam(searchParams, "routeType", isSugba ? "DEL_CARMEN_SUGBA_LAGOON" : "");
  const routeCode = readParam(searchParams, "routeCode", isSugba ? "dc-sugba-a" : "");
  const tripNo = readParam(searchParams, "tripNo", "");
  const departurePort = readParam(searchParams, "departurePort", isSugba ? "DEL_CARMEN_PORT" : "");
  const pickupArea = readParam(searchParams, "pickupArea", readParam(searchParams, "pickup", "general-luna"));
  const pickupZone = readParam(searchParams, "pickupZone", "");
  const regularPax = readParam(searchParams, "regularPax", "");
  const seniorPax = readParam(searchParams, "seniorPax", "0");
  const pax = readParam(searchParams, "pax", regularPax || "7");
  const routeBasePrice = readParam(searchParams, "routeBasePrice", isSugba ? "2650" : "");
  const entranceFeePerPax = readParam(searchParams, "entranceFeePerPax", isSugba ? "100" : "");
  const perPaxTotal = readParam(searchParams, "perPaxTotal", isSugba ? "2750" : "");

  const routeMode = readParam(searchParams, "routeMode", "south-tour");
  const pickup = readParam(searchParams, "pickup", "general-luna");
  const transportMode = readParam(searchParams, "transportMode", "TUKTUK");
  const mediaAddOn = readParam(searchParams, "mediaAddOn", "MOBILE_PHOTOGRAPHER");
  const guideSupport = readParam(searchParams, "guideSupport", "DRIVER_LOCAL_SUPPORT");
  const supportLevel = readParam(searchParams, "supportLevel", "STANDARD");
  const unitPrice = readParam(searchParams, "unitPrice", "1500");
  const estimatedTotal = isSugba
    ? readParam(searchParams, "amount", "0")
    : readParam(
        searchParams,
        "estimatedTotal",
        readParam(searchParams, "amount", String(Number(pax || 1) * Number(unitPrice || 0))),
      );
  const tierLabel = readParam(searchParams, "tierLabel", "7–10 pax tier");

  const rows = isSugba
    ? [
        ["Trail", officialTrail],
        ["Route", label(routeCode)],
        ["Trip", tripNo],
        ["Port", label(departurePort)],
        ["Pickup", pickupArea],
        ["Pax", `${regularPax || pax} regular · ${seniorPax} senior`],
      ]
    : [
        ["Trail", officialTrail],
        ["Route", label(routeMode)],
        ["Pax", `${pax} pax`],
        ["Unit price", `${peso(unitPrice)} / pax`],
        ["Tier", tierLabel],
        ["Pickup", label(pickup)],
        ["Transport", label(transportMode)],
        ["Guide", label(guideSupport)],
        ["Support level", label(supportLevel)],
        ["Media", label(mediaAddOn)],
      ];

  const snapshotRows = isSugba
    ? [
        ["Product", routeProduct.replaceAll("_", " ")],
        ["Route base", `${peso(routeBasePrice)} / pax`],
        ["Entrance", `${peso(entranceFeePerPax)} / pax`],
        ["Per pax", peso(perPaxTotal)],
        ["Pickup zone", pickupZone || "GL / Poblacion"],
      ]
    : [
        ["Product code", productCode],
        ["Pricing version", pricingVersion],
        ["Pricing mode", pricingMode],
        ["Payment timing", label(paymentTiming)],
        ["Currency", currencyCode],
      ];

  return (
    <main className="osp-traveler-bottom-tab-safe-page"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% -8%, rgba(5,150,165,0.10), transparent 28%), linear-gradient(180deg, #F7FCFB 0%, #FFFFFF 46%, #EAFBFA 100%)",
        color: OSP.navy,
        padding: "12px 14px calc(176px + env(safe-area-inset-bottom))",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 390,
          margin: "0 auto",
          display: "grid",
          gap: 12,
        }}
      >
        <header
          aria-label={`${isSugba ? "Sugba Lagoon Checkout" : "Tour Payment Review"} compact header`}
          style={{
            borderRadius: 24,
            background: "rgba(255,255,255,0.98)",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.075)",
            padding: 14,
          }}
        >
          <a
            href={`/traveler/passport-trails/${slug}/operator-confirmation?${new URLSearchParams(
              Object.entries(searchParams || {}).reduce<Record<string, string>>((acc, [key, value]) => {
                acc[key] = Array.isArray(value) ? value[0] || "" : value || "";
                return acc;
              }, {}),
            ).toString()}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 34,
              borderRadius: 999,
              padding: "0 11px",
              background: "rgba(234,251,250,0.92)",
              color: OSP.navy,
              border: "1px solid rgba(5,150,165,0.16)",
              textDecoration: "none",
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            ‹ Back
          </a>

          <div style={{ marginTop: 12 }}>
            <span
              style={{
                display: "inline-flex",
                minHeight: 24,
                alignItems: "center",
                borderRadius: 999,
                padding: "0 9px",
                background: "rgba(243,174,38,0.14)",
                color: OSP.navy,
                border: "1px solid rgba(243,174,38,0.28)",
                fontSize: 9.5,
                lineHeight: 1,
                fontWeight: 950,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {isSugba ? "Sugba payment" : "Payment sandbox"}
            </span>

            <h1
              style={{
                margin: "9px 0 0",
                color: OSP.navy,
                fontSize: 23,
                lineHeight: 1.02,
                fontWeight: 920,
                letterSpacing: "-0.055em",
              }}
            >
              {isSugba ? "Sugba Lagoon Checkout" : "Tour Payment Review"}
            </h1>

            <p
              style={{
                margin: "7px 0 0",
                color: OSP.slate,
                fontSize: 12,
                lineHeight: 1.38,
                fontWeight: 720,
              }}
            >
              {isSugba ? "Review amount before checkout." : "Review the payment snapshot before checkout."}
            </p>
          </div>
        </header>

        <section
          aria-label="Tour payment total"
          style={{
            borderRadius: 24,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 16px 36px rgba(1,56,99,0.08)",
            padding: 14,
          }}
        >
          <span
            style={{
              display: "block",
              color: OSP.slate,
              fontSize: 9.5,
              fontWeight: 950,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Estimated total
          </span>

          <strong
            style={{
              display: "block",
              marginTop: 5,
              color: OSP.navy,
              fontSize: 31,
              lineHeight: 1,
              fontWeight: 950,
              letterSpacing: "-0.06em",
            }}
          >
            {peso(estimatedTotal)}
          </strong>

          <p
            style={{
              margin: "7px 0 0",
              color: OSP.slate,
              fontSize: 11.5,
              lineHeight: 1.32,
              fontWeight: 760,
            }}
          >
            {isSugba ? `${regularPax || pax} regular · ${seniorPax} senior · ${peso(perPaxTotal)} / pax` : `${pax} pax × ${peso(unitPrice)} / pax · ${tierLabel}`}
          </p>
        </section>

        <section
          aria-label="Tour payment review details"
          style={{
            borderRadius: 24,
            background: "rgba(255,255,255,0.98)",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 32px rgba(1,56,99,0.065)",
            padding: 13,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {rows.map(([key, value]) => (
              <div
                key={key}
                style={{
                  minHeight: 54,
                  borderRadius: 17,
                  background: "linear-gradient(180deg, #FFFFFF 0%, rgba(234,251,250,0.54) 100%)",
                  border: "1px solid rgba(5,150,165,0.10)",
                  padding: "9px 10px",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: OSP.slate,
                    fontSize: 8.8,
                    fontWeight: 900,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  {key}
                </span>
                <strong
                  style={{
                    display: "block",
                    marginTop: 4,
                    color: OSP.navy,
                    fontSize: 11.5,
                    lineHeight: 1.18,
                    fontWeight: 900,
                  }}
                >
                  {value}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Commercial snapshot"
          style={{
            borderRadius: 22,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 12px 28px rgba(1,56,99,0.06)",
            padding: 12,
          }}
        >
          <strong
            style={{
              display: "block",
              color: OSP.navy,
              fontSize: 13,
              lineHeight: 1.15,
              fontWeight: 930,
            }}
          >
            Commercial snapshot
          </strong>

          <div style={{ marginTop: 9, display: "grid", gap: 7 }}>
            {snapshotRows.map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "112px minmax(0, 1fr)",
                  gap: 8,
                  alignItems: "center",
                  color: OSP.slate,
                  fontSize: 10.5,
                  lineHeight: 1.25,
                  fontWeight: 760,
                }}
              >
                <span>{key}</span>
                <strong
                  style={{
                    color: OSP.navy,
                    fontSize: 10.5,
                    lineHeight: 1.25,
                    fontWeight: 900,
                    overflowWrap: "anywhere",
                  }}
                >
                  {value}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Sandbox handoff action"
          style={{
            position: "fixed",
            left: "50%",
            bottom: "calc(92px + env(safe-area-inset-bottom))",
            transform: "translateX(-50%)",
            width: "min(390px, calc(100vw - 22px))",
            zIndex: 70,
            borderRadius: 24,
            background: "rgba(255,255,255,0.98)",
            border: "1px solid rgba(5,150,165,0.16)",
            boxShadow: "0 18px 46px rgba(1,56,99,0.18)",
            padding: "10px 11px",
            boxSizing: "border-box",
            backdropFilter: "blur(18px)",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <span
              style={{
                display: "block",
                color: OSP.slate,
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Sandbox total
            </span>
            <strong
              style={{
                display: "block",
                marginTop: 3,
                color: OSP.navy,
                fontSize: 19,
                lineHeight: 1,
                fontWeight: 950,
                letterSpacing: "-0.04em",
              }}
            >
              {peso(estimatedTotal)}
            </strong>
          </div>

          <a
            href={`/traveler/payments/${productCode.toLowerCase()}-sandbox-handoff?${new URLSearchParams(
              Object.entries(searchParams || {}).reduce<Record<string, string>>((acc, [key, value]) => {
                acc[key] = Array.isArray(value) ? value[0] || "" : value || "";
                return acc;
              }, {}),
            ).toString()}`}
            aria-label="Proceed to payment sandbox handoff"
            style={{
              minHeight: 48,
              borderRadius: 18,
              padding: "0 14px",
              display: "grid",
              placeItems: "center",
              textDecoration: "none",
              color: OSP.navy,
              background: "linear-gradient(135deg, #F3AE26 0%, #FFE19A 100%)",
              border: "1px solid rgba(243,174,38,0.50)",
              boxShadow: "0 12px 26px rgba(243,174,38,0.25)",
              fontSize: 12,
              fontWeight: 950,
              whiteSpace: "nowrap",
            }}
          >
            Continue
          </a>
        </section>
      </div>

      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
