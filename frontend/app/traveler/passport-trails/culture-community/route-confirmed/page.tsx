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
  slate: "#50668B",
  line: "rgba(1,56,99,0.12)",
};

export default function CultureCommunityRouteConfirmedPage({ searchParams }: { searchParams?: SearchParams }) {
  const routeProduct = getParam(searchParams, "routeProduct", "CULTURE_COMMUNITY_SESSION");
  const tripNo = getParam(searchParams, "tripNo", "SPM-CULTURE-COMMUNITY");
  const date = getParam(searchParams, "date", "2026-05-18");
  const departureTime = getParam(searchParams, "departureTime", "09:00");
  const regularPax = getParam(searchParams, "regularPax", "1");
  const seniorPax = getParam(searchParams, "seniorPax", "0");
  const totalPax = getParam(searchParams, "totalPax", String(Number(regularPax) + Number(seniorPax)));
  const pickupZone = getParam(searchParams, "pickupZone", "GENERAL_LUNA_COMMUNITY_MEETUP");
  const pickupArea = getParam(searchParams, "pickupArea", "General Luna community meetup");
  const routeCode = getParam(searchParams, "routeCode", "culture-community-partner-session");
  const supportType = getParam(searchParams, "supportType", "COMMUNITY_PARTNER");
  const partnerStatus = getParam(searchParams, "partnerStatus", "CONFIRMED");
  const routeBasePrice = getParam(searchParams, "routeBasePrice", "1000");
  const entranceFeePerPax = getParam(searchParams, "entranceFeePerPax", "0");
  const perPaxTotal = getParam(searchParams, "perPaxTotal", "1000");
  const unitPrice = getParam(searchParams, "unitPrice", perPaxTotal);
  const amount = getParam(searchParams, "amount", String(Number(perPaxTotal) * Number(totalPax || 1)));
  const pricingVersion = getParam(searchParams, "pricingVersion", "CULTURE_COMMUNITY_2026_05");
  const pricingMode = getParam(searchParams, "pricingMode", "CULTURE_COMMUNITY_PER_PAX");
  const paymentTiming = getParam(searchParams, "paymentTiming", "AFTER_PARTNER_CONFIRMATION");

  const paymentHref = buildHref(`/traveler/payments/tour-sandbox/${routeProduct}`, {
    source: "passport-trails",
    trail: "culture-community",
    officialTrail: "Culture & Community Trail",
    routeType: "CULTURE_COMMUNITY_PARTNER_CONFIRMED",
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
    partnerStatus,
    routeBasePrice,
    entranceFeePerPax,
    perPaxTotal,
    unitPrice,
    estimatedTotal: amount,
    pricingVersion,
    pricingMode,
    paymentTiming,
    currencyCode: "PHP",
    tierLabel: "Culture community session",
    step: "payment-sandbox",
  });

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 45%, #EAFBFA 100%)", color: OSP.deepNavy, padding: "16px 14px 118px", fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif' }}>
      <section style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <Link href="/traveler/passport-trails/culture-community" style={{ color: OSP.teal, textDecoration: "none", fontSize: 13, fontWeight: 850 }}>← Culture & Community Trail</Link>

        <header style={{ marginTop: 14, background: "linear-gradient(135deg, #ffffff, #f4fcfa)", border: `1px solid ${OSP.line}`, borderRadius: 28, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 20 }}>
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>Route Confirmed</div>
          <h1 style={{ margin: "5px 0 0", fontSize: 25, lineHeight: 1.02, fontWeight: 760, letterSpacing: "-0.045em" }}>Community session confirmed</h1>
          <p style={{ margin: "10px 0 0", color: OSP.slate, fontSize: 13.2, lineHeight: 1.42, fontWeight: 720 }}>
            Community partner support and trail session context are ready for payment handoff.
          </p>
        </header>

        <section style={{ marginTop: 14, background: OSP.white, border: `1px solid ${OSP.line}`, borderRadius: 28, boxShadow: "0 18px 50px rgba(1,56,99,0.08)", padding: 16 }}>
          {[
            ["Trip", tripNo],
            ["Trail", "Culture & Community Trail"],
            ["Session", routeProduct.replaceAll("_", " ")],
            ["Partner", partnerStatus.replaceAll("_", " ")],
            ["Date", `${date} · ${departureTime}`],
            ["Pax", `${regularPax} regular · ${seniorPax} senior`],
            ["Meeting", pickupArea],
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
            Payment confirms the Culture & Community session. This remains a partner-supported trail, not a DCS boarding or manifest flow.
          </p>
        </section>

        <Link href={paymentHref} style={{ marginTop: 14, minHeight: 56, borderRadius: 20, background: `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`, color: OSP.white, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 15, fontWeight: 920 }}>
          Continue Checkout
        </Link>
      </section>
    </main>
  );
}
