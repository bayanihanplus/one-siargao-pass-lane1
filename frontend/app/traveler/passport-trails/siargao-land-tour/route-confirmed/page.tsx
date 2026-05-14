import Link from "next/link";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(searchParams: SearchParams | undefined, key: string, fallback = "") {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

function buildHref(pathname: string, params: Record<string, string>) {
  return `${pathname}?${new URLSearchParams(params).toString()}`;
}

function peso(value: string) {
  return `₱${Number(value || 0).toLocaleString("en-PH")}`;
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

const OSP = {
  deepNavy: "#003B66",
  teal: "#0596A5",
  white: "#FFFFFF",
  slate: "#50668B",
  line: "rgba(1,56,99,0.12)",
};

export default function SiargaoLandTourRouteConfirmedPage({ searchParams }: { searchParams?: SearchParams }) {
  const routeProduct = getParam(searchParams, "routeProduct", "LAND_JOINER_STANDARD");
  const productCode = getParam(searchParams, "productCode", "LAND_JOINER_STANDARD");
  const tripNo = getParam(searchParams, "tripNo", "SPM-LAND-JOINER");
  const routeCode = getParam(searchParams, "routeCode", "LAND_SOUTH_ROUTE");
  const routeMode = getParam(searchParams, "routeMode", "south-route");
  const date = getParam(searchParams, "date", "2026-05-18");
  const departureTime = getParam(searchParams, "departureTime", "07:00");
  const regularPax = getParam(searchParams, "regularPax", "1");
  const seniorPax = getParam(searchParams, "seniorPax", "0");
  const totalPax = getParam(searchParams, "totalPax", String(Number(regularPax) + Number(seniorPax)));
  const pickupZone = getParam(searchParams, "pickupZone", "GENERAL_LUNA_POBLACION");
  const pickupArea = getParam(searchParams, "pickupArea", "General Luna / Poblacion pickup");
  const supportType = getParam(searchParams, "supportType", "LAND_TRANSPORT_OPERATOR");
  const operatorStatus = getParam(searchParams, "operatorStatus", "CONFIRMED");
  const transportMode = getParam(searchParams, "transportMode", "TUKTUK");
  const mediaAddOn = getParam(searchParams, "mediaAddOn", "MOBILE_PHOTOGRAPHER");
  const guideSupport = getParam(searchParams, "guideSupport", "DRIVER_LOCAL_SUPPORT");
  const supportLevel = getParam(searchParams, "supportLevel", "STANDARD");
  const routeBasePrice = getParam(searchParams, "routeBasePrice", "2100");
  const entranceFeePerPax = getParam(searchParams, "entranceFeePerPax", "0");
  const perPaxTotal = getParam(searchParams, "perPaxTotal", "2100");
  const unitPrice = getParam(searchParams, "unitPrice", perPaxTotal);
  const amount = getParam(searchParams, "amount", String(Number(unitPrice) * Number(totalPax || 1)));
  const pricingVersion = getParam(searchParams, "pricingVersion", "LAND_JOINER_2026_05");
  const pricingMode = getParam(searchParams, "pricingMode", "LAND_JOINER_PER_PAX");
  const paymentTiming = getParam(searchParams, "paymentTiming", "AFTER_ROUTE_SUPPORT_CONFIRMATION");

  const paymentHref = buildHref(`/traveler/payments/tour-sandbox/${routeProduct}`, {
    source: "passport-trails",
    trail: "siargao-land-tour",
    officialTrail: "Siargao Land Tour Passport Trail",
    routeType: "LAND_TOUR_OPERATOR_CONFIRMED",
    routeCode,
    routeMode,
    routeProduct,
    productCode,
    tripNo,
    departurePort: "NOT_DCS",
    amount,
    date,
    departureTime,
    regularPax,
    seniorPax,
    totalPax,
    pax: totalPax,
    pickupZone,
    pickupArea,
    pickup: pickupArea,
    supportType,
    guideSupport,
    operatorStatus,
    transportMode,
    mediaAddOn,
    supportLevel,
    routeBasePrice,
    entranceFeePerPax,
    perPaxTotal,
    unitPrice,
    estimatedTotal: amount,
    pricingVersion,
    pricingMode,
    paymentTiming,
    currencyCode: "PHP",
    tierLabel: "Land Joiner",
    step: "payment-sandbox",
  });

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 45%, #EAFBFA 100%)", color: OSP.deepNavy, padding: "16px 14px 118px", fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif' }}>
      <section style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <Link href="/traveler/passport-trails/siargao-land-tour" style={{ color: OSP.teal, textDecoration: "none", fontSize: 13, fontWeight: 850 }}>← Siargao Land Tour</Link>

        <header style={{ marginTop: 14, background: "linear-gradient(135deg, #ffffff, #f4fcfa)", border: `1px solid ${OSP.line}`, borderRadius: 28, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 20 }}>
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>Route Confirmed</div>
          <h1 style={{ margin: "5px 0 0", fontSize: 25, lineHeight: 1.02, fontWeight: 760, letterSpacing: "-0.045em" }}>Land route confirmed</h1>
          <p style={{ margin: "10px 0 0", color: OSP.slate, fontSize: 13.2, lineHeight: 1.42, fontWeight: 720 }}>
            Land Tour route support and commercial pricing are ready for payment handoff.
          </p>
        </header>

        <section style={{ marginTop: 14, background: OSP.white, border: `1px solid ${OSP.line}`, borderRadius: 28, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 16 }}>
          {[
            ["Trip", tripNo],
            ["Trail", "Siargao Land Tour Passport Trail"],
            ["Product", label(productCode)],
            ["Route", label(routeMode)],
            ["Operator", label(operatorStatus)],
            ["Date", `${date} · ${departureTime}`],
            ["Pax", `${regularPax} regular · ${seniorPax} senior`],
            ["Pickup", pickupArea],
            ["Total", peso(amount)],
          ].map(([itemLabel, value]) => (
            <div key={itemLabel} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: `1px solid ${OSP.line}`, padding: "10px 0" }}>
              <span style={{ color: OSP.slate, fontSize: 12.2, fontWeight: 760 }}>{itemLabel}</span>
              <strong style={{ color: OSP.deepNavy, fontSize: 12.4, fontWeight: 900, textAlign: "right" }}>{value}</strong>
            </div>
          ))}
        </section>

        <section style={{ marginTop: 12, background: OSP.white, border: `1px solid ${OSP.line}`, borderRadius: 24, padding: 12 }}>
          <p style={{ margin: 0, color: OSP.slate, fontSize: 12.2, lineHeight: 1.35, fontWeight: 720 }}>
            Payment confirms the Land Tour route. This remains an operator-supported land route, not an island-hopping clearance, boat manifest, or departure-control flow.
          </p>
        </section>

        <Link href={paymentHref} style={{ marginTop: 14, minHeight: 56, borderRadius: 20, background: `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`, color: OSP.white, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 15, fontWeight: 920 }}>
          Continue Checkout
        </Link>
      </section>
    </main>
  );
}
