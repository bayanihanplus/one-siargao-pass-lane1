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

const OSP = {
  deepNavy: "#003B66",
  teal: "#0596A5",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  slate: "#50668B",
  line: "rgba(1,56,99,0.12)",
};

export default function SurfExplorerRouteConfirmedPage({ searchParams }: { searchParams?: SearchParams }) {
  const routeProduct = getParam(searchParams, "routeProduct", "SURF_EXPLORER_BEGINNER_SESSION");
  const tripNo = getParam(searchParams, "tripNo", "SPM-SURF-C9-SESSION");
  const date = getParam(searchParams, "date", "2026-05-18");
  const departureTime = getParam(searchParams, "departureTime", "09:00");
  const regularPax = getParam(searchParams, "regularPax", "1");
  const seniorPax = getParam(searchParams, "seniorPax", "0");
  const totalPax = getParam(searchParams, "totalPax", String(Number(regularPax) + Number(seniorPax)));
  const pickupZone = getParam(searchParams, "pickupZone", "CLOUD_9_CATANGNAN");
  const pickupArea = getParam(searchParams, "pickupArea", "Cloud 9 / Catangnan");
  const routeCode = getParam(searchParams, "routeCode", "surf-explorer-cloud-9-beginner");
  const supportType = getParam(searchParams, "supportType", "SURF_INSTRUCTOR");
  const instructorStatus = getParam(searchParams, "instructorStatus", "CONFIRMED");
  const routeBasePrice = getParam(searchParams, "routeBasePrice", "1500");
  const entranceFeePerPax = getParam(searchParams, "entranceFeePerPax", "0");
  const perPaxTotal = getParam(searchParams, "perPaxTotal", "1500");
  const unitPrice = getParam(searchParams, "unitPrice", perPaxTotal);
  const amount = getParam(searchParams, "amount", String(Number(perPaxTotal) * Number(totalPax || 1)));
  const pricingVersion = getParam(searchParams, "pricingVersion", "SURF_EXPLORER_2026_05");
  const pricingMode = getParam(searchParams, "pricingMode", "INSTRUCTOR_SESSION_PER_PAX");
  const paymentTiming = getParam(searchParams, "paymentTiming", "AFTER_INSTRUCTOR_CONFIRMATION");

  const paymentHref = buildHref(`/traveler/payments/tour-sandbox/${routeProduct}`, {
    source: "passport-trails",
    trail: "surf-explorer",
    officialTrail: "Explorer Surf Trail",
    routeType: "SURF_EXPLORER_INSTRUCTOR_CONFIRMED",
    routeCode,
    routeProduct,
    productCode: routeProduct,
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
    guideSupport: supportType,
    instructorStatus,
    routeBasePrice,
    entranceFeePerPax,
    perPaxTotal,
    unitPrice,
    estimatedTotal: amount,
    pricingVersion,
    pricingMode,
    paymentTiming,
    currencyCode: "PHP",
    tierLabel: "Surf instructor session",
    step: "payment-sandbox",
  });

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 45%, #EAFBFA 100%)", color: OSP.deepNavy, padding: "16px 14px 118px", fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif' }}>
      <section style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <Link href="/traveler/passport-trails/surf-explorer" style={{ color: OSP.teal, textDecoration: "none", fontSize: 13, fontWeight: 850 }}>
          ← Explorer Surf Trail
        </Link>

        <header style={{ marginTop: 14, background: "linear-gradient(135deg, #ffffff, #f4fcfa)", border: `1px solid ${OSP.line}`, borderRadius: 28, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 20 }}>
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>Route Confirmed</div>
          <h1 style={{ margin: "5px 0 0", fontSize: 25, lineHeight: 1.02, fontWeight: 760, letterSpacing: "-0.045em" }}>Surf session confirmed</h1>
          <p style={{ margin: "10px 0 0", color: OSP.slate, fontSize: 13.2, lineHeight: 1.42, fontWeight: 720 }}>
            Instructor support and Cloud 9 session context are ready for payment handoff.
          </p>
        </header>

        <section style={{ marginTop: 14, background: OSP.white, border: `1px solid ${OSP.line}`, borderRadius: 28, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 16 }}>
          {[
            ["Trip", tripNo],
            ["Trail", "Explorer Surf Trail"],
            ["Session", routeProduct.replaceAll("_", " ")],
            ["Instructor", instructorStatus.replaceAll("_", " ")],
            ["Date", `${date} · ${departureTime}`],
            ["Pax", `${regularPax} regular · ${seniorPax} senior`],
            ["Pickup", pickupArea],
            ["Total", peso(amount)],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: `1px solid ${OSP.line}`, padding: "10px 0" }}>
              <span style={{ color: OSP.slate, fontSize: 12.2, fontWeight: 760 }}>{label}</span>
              <strong style={{ color: OSP.deepNavy, fontSize: 12.4, fontWeight: 900, textAlign: "right" }}>{value}</strong>
            </div>
          ))}
        </section>

        <section style={{ marginTop: 12, background: OSP.white, border: `1px solid ${OSP.line}`, borderRadius: 24, padding: 12 }}>
          <p style={{ margin: 0, color: OSP.slate, fontSize: 12.2, lineHeight: 1.35, fontWeight: 720 }}>
            Payment confirms the Surf Explorer session. This remains a surf-support trail, not a DCS boarding or manifest flow.
          </p>
        </section>

        <Link href={paymentHref} style={{ marginTop: 14, minHeight: 56, borderRadius: 20, background: `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`, color: OSP.white, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 15, fontWeight: 920 }}>
          Continue Checkout
        </Link>
      </section>
    </main>
  );
}
