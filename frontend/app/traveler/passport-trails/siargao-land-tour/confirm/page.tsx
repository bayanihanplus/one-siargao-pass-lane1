import UniversalTravelerBottomTabBar from "../../../../../src/components/traveler/UniversalTravelerBottomTabBar";
import {
  OfficialTrailLightHeaderCard,
  OfficialTrailStateChips,
  OfficialTrailSummaryGrid,
} from "../../_components";

type ConfirmPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function readParam(searchParams: ConfirmPageProps["searchParams"], key: string, fallback = "") {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
}

function label(value: string) {
  return value
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

export default function SiargaoLandTourConfirmPage({ searchParams }: ConfirmPageProps) {
  const productCode = readParam(searchParams, "productCode", "SPM_LAND_TOUR_PRIVATE_MVP");
  const pricingVersion = readParam(searchParams, "pricingVersion", "LAND_TOUR_MVP_2026_05");
  const pricingMode = readParam(searchParams, "pricingMode", "PAX_TIERED_PER_HEAD");
  const paymentTiming = readParam(searchParams, "paymentTiming", "AFTER_OPERATOR_CONFIRMATION");
  const currencyCode = readParam(searchParams, "currencyCode", "PHP");

  const routeMode = readParam(searchParams, "routeMode", "south-tour");
  const date = readParam(searchParams, "date", "To confirm");
  const pax = readParam(searchParams, "pax", "7");
  const pickup = readParam(searchParams, "pickup", "general-luna");

  const transportMode = readParam(searchParams, "transportMode", "TUKTUK");
  const mediaAddOn = readParam(searchParams, "mediaAddOn", "MOBILE_PHOTOGRAPHER");
  const guideSupport = readParam(searchParams, "guideSupport", "DRIVER_LOCAL_SUPPORT");
  const supportLevel = readParam(searchParams, "supportLevel", "STANDARD");

  const unitPrice = readParam(searchParams, "unitPrice", "1500");
  const estimatedTotal = readParam(searchParams, "estimatedTotal", String(Number(pax || 1) * Number(unitPrice || 0)));
  const tierLabel = readParam(searchParams, "tierLabel", "7–10 pax tier");

  const operatorParams = new URLSearchParams({
    intent: "land-tour-slot-confirmed",
    trail: "siargao-land-tour",
    officialTrail: "Siargao Land Tour Passport Trail",
    productCode,
    pricingVersion,
    pricingMode,
    paymentTiming,
    currencyCode,
    routeMode,
    date,
    pax,
    pickup,
    transportMode,
    mediaAddOn,
    guideSupport,
    supportLevel,
    unitPrice,
    estimatedTotal,
    tierLabel,
    amount: estimatedTotal,
    source: "spm-official-trail",
    bookingMode: "ROUTE_OPERATOR_SUPPORT",
    step: "operator-confirmation",
  });

  const backParams = new URLSearchParams({
    productCode,
    pricingVersion,
    pricingMode,
    paymentTiming,
    currencyCode,
    routeMode,
    date,
    pax,
    pickup,
    transportMode,
    mediaAddOn,
    guideSupport,
    supportLevel,
    unitPrice,
    estimatedTotal,
    tierLabel,
    source: "spm-official-trail",
  });

  const summary = [
    { label: "Route", value: label(routeMode) },
    { label: "Date", value: date },
    { label: "Pax", value: `${pax} pax` },
    { label: "Unit price", value: `${peso(unitPrice)} / pax` },
    { label: "Tier", value: tierLabel },
    { label: "Pickup", value: label(pickup) },
    { label: "Transport", value: label(transportMode) },
    { label: "Guide", value: label(guideSupport) },
    { label: "Support level", value: label(supportLevel) },
    { label: "Media", value: label(mediaAddOn) },
    { label: "Estimated total", value: peso(estimatedTotal) },
    { label: "Pricing version", value: pricingVersion },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% -12%, rgba(5,150,165,0.12), transparent 30%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 48%, #EAFBFA 100%)",
        color: "#013863",
        padding: "12px 14px calc(190px + env(safe-area-inset-bottom))",
      }}
    >
      <div style={{ width: "100%", maxWidth: 390, margin: "0 auto" }}>
        <OfficialTrailLightHeaderCard
          backHref={`/traveler/passport-trails/siargao-land-tour/book?${backParams.toString()}`}
          backLabel="‹ Edit setup"
          title="Confirm Land Tour"
          subtitle="Review your Land Tour setup before operator confirmation. Payment opens only after availability is accepted."
        >
          <OfficialTrailStateChips
            chips={[
              { label: "Route", value: "Chosen" },
              { label: "Operator", value: "Next" },
              { label: "Payment", value: "After confirm" },
              { label: "Price", value: "Snapshotted" },
            ]}
          />
        </OfficialTrailLightHeaderCard>

        <section
          aria-label="Land Tour confirmation summary"
          style={{
            marginTop: 12,
            borderRadius: 26,
            padding: 13,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
          }}
        >
          <OfficialTrailSummaryGrid items={summary} />

          <div
            aria-label="Land Tour commercial snapshot confirmation"
            style={{
              marginTop: 12,
              borderRadius: 20,
              padding: 12,
              background: "linear-gradient(135deg, #013863 0%, #045E78 100%)",
              color: "#FFFFFF",
              boxShadow: "0 16px 32px rgba(1,56,99,0.18)",
            }}
          >
            <span
              style={{
                display: "block",
                color: "rgba(255,255,255,0.72)",
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Estimated total
            </span>
            <strong
              style={{
                display: "block",
                marginTop: 4,
                color: "#F3AE26",
                fontSize: 25,
                lineHeight: 1,
                fontWeight: 950,
                letterSpacing: "-0.04em",
              }}
            >
              {peso(estimatedTotal)}
            </strong>
            <span
              style={{
                display: "block",
                marginTop: 6,
                color: "rgba(255,255,255,0.78)",
                fontSize: 10.5,
                lineHeight: 1.25,
                fontWeight: 760,
              }}
            >
              {pax} pax × {peso(unitPrice)} / pax · {tierLabel}
            </span>
          </div>

          <a
            href={`/traveler/passport-trails/siargao-land-tour/operator-confirmation?${operatorParams.toString()}`}
            aria-label="Confirm Land Tour Slot"
            style={{
              marginTop: 12,
              minHeight: 52,
              borderRadius: 18,
              background: "linear-gradient(135deg, #F3AE26 0%, #FFE19A 100%)",
              color: "#013863",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13.2,
              fontWeight: 930,
              boxShadow: "0 16px 32px rgba(243,174,38,0.22)",
            }}
          >
            Confirm Land Tour Slot
          </a>

          <a
            href="/traveler/passport-trails/siargao-land-tour"
            style={{
              marginTop: 10,
              minHeight: 46,
              borderRadius: 16,
              background: "#FFFFFF",
              color: "#013863",
              border: "1px solid rgba(1,56,99,0.12)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12.2,
              fontWeight: 880,
            }}
          >
            Back to Land Tour Trail
          </a>
        </section>
      </div>

      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
