import SpmTravelerBottomTabBar from "../../../../src/components/traveler/SpmTravelerBottomTabBar";
import Link from "next/link";

function buildHref(pathname: string, params: Record<string, string>) {
  return `${pathname}?${new URLSearchParams(params).toString()}`;
}

const OSP = {
  navy: "#013863",
  deepNavy: "#003B66",
  teal: "#0596A5",
  gold: "#F3AE26",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  mistSoft: "#F4FCFA",
  slate: "#50668B",
  line: "rgba(1,56,99,0.12)",
};

const content = {
  eyebrow: "PASSPORT TRAILS™ · COMMUNITY",
  title: "Culture & Community Trail",
  mediaTitle: "Culture & Community Trail preview",
  descriptionTitle: "Description",
  description:
    "Discover Siargao through local stories, community stops, cultural encounters, and partner-supported experiences — confirmed into one clean checkout flow.",
  features: [
    "Local community stories",
    "Partner-supported experience",
    "Cultural stop context",
    "Guided local handoff",
    "Passport progress linked",
    "Respectful visitor flow",
  ],
  bookingSteps: [
    ["01", "Choose culture session", "Community partner experience context."],
    ["02", "Confirm local support", "Partner support is confirmed first."],
    ["03", "Review total", "₱1,000 per pax prepared for checkout."],
    ["04", "Continue checkout", "Payment opens after partner confirmation."],
  ],
  guideTitle: "Guide / Support Logic",
  guideBody:
    "Community partner support, local story context, cultural stop handling, and respectful visitor flow follow the selected Culture & Community session. Passport progress can attach after payment.",
  routeFacts: [
    ["Session", "Community"],
    ["Support", "Partner confirmed"],
    ["Price", "₱1,000 / pax"],
    ["Status", "Payment-ready"],
  ],
  ctaLabel: "Continue Checkout",
};

const otherTrails = [
  {
    icon: "🏝️",
    iconSrc: "/osp/osp-verified-logo.png",
    title: "Tri-Island Passport Trail",
    routeBadge: "GL Port",
    note: "Governed island route",
    href: "/traveler/passport-trails/island-hopping",
    stripAccent: "Island",
    tileColor: "#EAFBFA",
  },
  {
    icon: "🛶",
    iconSrc: "/osp/spm/trails/icons/sugba-lagoon-badge.png?v=01l",
    title: "Sugba Lagoon Island Hopping",
    routeBadge: "Del Carmen",
    note: "Lagoon route",
    href: "/traveler/passport-trails/sugba-lagoon",
    stripAccent: "Lagoon",
    tileColor: "#F2FBFF",
  },
  {
    icon: "🗺️",
    iconSrc: "/osp/spm/trails/icons/siargao-land-tour-badge.png?v=01l",
    title: "Siargao Land Tour Passport Trail",
    routeBadge: "South / North",
    note: "Land route",
    href: "/traveler/passport-trails/siargao-land-tour",
    stripAccent: "Land",
    tileColor: "#FFF8E7",
  },
  {
    icon: "🏄",
    iconSrc: "/osp/spm/trails/icons/surf-explorer-badge.png?v=01l",
    title: "Explorer Surf Trail",
    routeBadge: "Cloud 9",
    note: "Surf support",
    href: "/traveler/passport-trails/surf-explorer",
    stripAccent: "Surf",
    tileColor: "#EEF7FF",
  },
  {
    icon: "🍽️",
    iconSrc: "/osp/spm/trails/icons/food-wellness-badge.png?v=01l",
    title: "Food & Wellness Trail",
    routeBadge: "Merchant trail",
    note: "Food and wellness",
    href: "/traveler/passport-trails/food-wellness",
    stripAccent: "Merchant",
    tileColor: "#FFF4EF",
  },
  {
    icon: "🌊",
    iconSrc: "/osp/spm/trails/icons/bucas-sohoton-badge.png?v=01l",
    title: "Bucas Grande / Sohoton Official Trail",
    routeBadge: "Dapa-side",
    note: "Sohoton route",
    href: "/traveler/passport-trails/bucas-grande-sohoton",
    stripAccent: "Sohoton",
    tileColor: "#F2FBFF",
  },
] as const;

const trailStops = [
  {
    sequence: 1,
    displayCode: "C1",
    stopCode: "CULTURE_COMMUNITY_WELCOME",
    stopName: "Community Welcome Node",
    stopType: "COMMUNITY_PARTNER_NODE",
    siteAccessPointCode: "SPM_CULTURE_COMMUNITY_WELCOME",
    nodeRequirementType: "PARTNER_SITE_NODE",
    stampValidationMethod: "PARTNER_VALIDATION_OR_GOVERNED_STAMP_EVENT",
    passportStampEligible: true,
    scanBehavior: "Community partner validation or governed stamp event",
    status: "Passport-ready",
    travelerBody: "Start with a partner-supported community welcome and respectful visitor context.",
  },
  {
    sequence: 2,
    displayCode: "C2",
    stopCode: "CULTURE_LOCAL_STORY_STOP",
    stopName: "Local Story / Cultural Stop",
    stopType: "CULTURAL_EXPERIENCE_NODE",
    siteAccessPointCode: "SPM_CULTURE_LOCAL_STORY_STOP",
    nodeRequirementType: "PARTNER_SITE_NODE",
    stampValidationMethod: "COMMUNITY_PARTNER_VALIDATION",
    passportStampEligible: true,
    scanBehavior: "Community partner scan or approved cultural stop validation",
    status: "Confirmed",
    travelerBody: "Local story, cultural encounter, or community stop attached to the trail session.",
  },
  {
    sequence: 3,
    displayCode: "CP",
    stopCode: "CULTURE_PASSPORT_PROGRESS",
    stopName: "Culture Passport Progress",
    stopType: "TRAIL_PROGRESS_NODE",
    siteAccessPointCode: "SPM_CULTURE_PROGRESS_LINK",
    nodeRequirementType: "QR_STAMP_NODE",
    stampValidationMethod: "PASSPORT_PROGRESS_EVENT",
    passportStampEligible: true,
    scanBehavior: "Passport Trail progress event after payment",
    status: "Linked",
    travelerBody: "Culture & Community activity can attach to Passport Trail progress.",
  },
] as const;

const paymentHref = buildHref("/traveler/passport-trails/culture-community/book", {
  source: "passport-trails",
  trail: "culture-community",
  officialTrail: "Culture & Community Trail",
  routeType: "CULTURE_COMMUNITY_PARTNER_CONFIRMED",
  routeCode: "culture-community-partner-session",
  routeProduct: "CULTURE_COMMUNITY_SESSION",
  tripNo: "SPM-CULTURE-COMMUNITY-SESSION-01",
  departurePort: "NOT_DCS",
  date: "2026-05-18",
  departureTime: "09:00",
  regularPax: "1",
  seniorPax: "0",
  totalPax: "1",
  pickupZone: "GENERAL_LUNA_COMMUNITY_MEETUP",
  pickupArea: "General Luna community meetup",
  supportType: "COMMUNITY_PARTNER",
  partnerStatus: "CONFIRMED",
  routeBasePrice: "1000",
  entranceFeePerPax: "0",
  perPaxTotal: "1000",
  amount: "1000",
  step: "book",
});

const cardStyle = {
  background: "rgba(255,255,255,0.96)",
  border: `1px solid ${OSP.line}`,
  borderRadius: 28,
  boxShadow: "0 18px 50px rgba(1,56,99,0.08)",
};


export default function CultureCommunityOfficialTrailPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, rgba(5,150,165,0.10), transparent 32%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 52%, #EAFBFA 100%)",
        color: OSP.navy,
        padding: "14px 14px 128px",
        fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
          <div>
            <div style={{ color: OSP.teal, fontSize: 10.5, lineHeight: 1, fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>
              {content.eyebrow}
            </div>
            <h1 style={{ margin: "6px 0 0", color: OSP.deepNavy, fontSize: 25, lineHeight: 1.02, fontWeight: 760, letterSpacing: "-0.045em" }}>
              {content.title}
            </h1>
          </div>

          <Link
            href="/traveler/passport-trails"
            style={{
              borderRadius: 999,
              border: `1px solid ${OSP.line}`,
              background: "rgba(255,255,255,0.92)",
              color: OSP.teal,
              padding: "10px 13px",
              fontSize: 11.5,
              fontWeight: 850,
              whiteSpace: "nowrap",
              textDecoration: "none",
            }}
          >
            Trails
          </Link>
        </header>

        <section aria-label="Culture & Community Trail media" style={{ ...cardStyle, overflow: "hidden", background: "#F4FCFA", color: OSP.deepNavy }}>
          <div style={{ padding: 12, display: "grid", gap: 9 }}>
            <div
              aria-label="Main trail video preview"
              style={{
                minHeight: 212,
                borderRadius: 24,
                padding: 16,
                display: "grid",
                alignContent: "space-between",
                background: "linear-gradient(180deg, #FFFFFF 0%, #EAFBFA 100%)",
                border: "1px solid rgba(1,56,99,0.10)",
                boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div
                  style={{
                    display: "inline-flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: 999,
                    padding: "7px 10px",
                    background: "#FFFFFF",
                    border: "1px solid rgba(5,150,165,0.18)",
                    color: OSP.teal,
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Main video
                </div>

                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    background: "#F3AE26",
                    color: OSP.deepNavy,
                    fontSize: 15,
                    fontWeight: 950,
                    boxShadow: "0 10px 24px rgba(243,174,38,0.24)",
                  }}
                >
                  ▶
                </div>
              </div>

              <div>
                <h2 style={{ margin: 0, color: OSP.deepNavy, fontSize: 26, lineHeight: 1, fontWeight: 760, letterSpacing: "-0.045em" }}>
                  {content.mediaTitle}
                </h2>
              </div>
            </div>

            <div aria-label="Compact trail photo previews" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                {
                  label: "Photo 01",
                  caption: "Community",
                  image: "/osp/spm/trails/culture-community/community.png",
                },
                {
                  label: "Photo 02",
                  caption: "Story",
                  image: "/osp/spm/trails/culture-community/story.png",
                },
                {
                  label: "Photo 03",
                  caption: "Culture",
                  image: "/osp/spm/trails/culture-community/culture.png",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    minHeight: 78,
                    borderRadius: 17,
                    padding: 9,
                    display: "grid",
                    alignContent: "space-between",
                    background:
                      `linear-gradient(180deg, rgba(1,56,99,0.04), rgba(1,56,99,0.62)), url(${item.image}) center/cover`,
                    border: "1px solid rgba(255,255,255,0.72)",
                    boxShadow: "0 12px 26px rgba(1,56,99,0.14)",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.88)", textShadow: "0 2px 8px rgba(1,56,99,0.42)", fontSize: 8.6, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {item.label}
                  </span>
                  <span style={{ color: "#FFFFFF", textShadow: "0 2px 8px rgba(1,56,99,0.48)", fontSize: 11.2, lineHeight: 1.05, fontWeight: 850 }}>
                    {item.caption}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...cardStyle, marginTop: 14, padding: 18 }}>
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>
            {content.descriptionTitle}
          </div>
          <p style={{ margin: "9px 0 0", color: OSP.slate, fontSize: 14.5, lineHeight: 1.52 }}>
            {content.description}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 8, marginTop: 15 }}>
            {content.routeFacts.map(([label, value]) => (
              <div key={label} style={{ borderRadius: 18, padding: 12, background: OSP.mistSoft, border: `1px solid ${OSP.line}` }}>
                <div style={{ color: OSP.slate, fontSize: 9.5, lineHeight: 1, fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {label}
                </div>
                <div style={{ marginTop: 6, color: OSP.deepNavy, fontSize: 12.3, lineHeight: 1.16, fontWeight: 900 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, marginTop: 14, padding: 18 }}>
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>
            Features
          </div>
          <div style={{ display: "grid", gap: 9, marginTop: 12 }}>
            {content.features.map((feature) => (
              <div
                key={feature}
                style={{
                  display: "grid",
                  gridTemplateColumns: "26px 1fr",
                  gap: 10,
                  alignItems: "center",
                  borderRadius: 18,
                  padding: 11,
                  background: "rgba(234,251,250,0.72)",
                  border: `1px solid ${OSP.line}`,
                }}
              >
                <span aria-hidden="true" style={{ width: 26, height: 26, display: "grid", placeItems: "center", borderRadius: 999, background: OSP.gold, color: OSP.deepNavy, fontSize: 12, fontWeight: 950 }}>
                  ✓
                </span>
                <span style={{ color: OSP.deepNavy, fontSize: 13.5, fontWeight: 820 }}>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, marginTop: 14, padding: 18 }}>
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>
            Booking Flow
          </div>
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            {content.bookingSteps.map(([step, title, body]) => (
              <div key={step} style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 11, alignItems: "start", padding: 12, borderRadius: 19, background: "#FFFFFF", border: `1px solid ${OSP.line}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 14, display: "grid", placeItems: "center", background: OSP.mist, color: OSP.teal, fontSize: 12, fontWeight: 950 }}>
                  {step}
                </div>
                <div>
                  <div style={{ color: OSP.deepNavy, fontSize: 14, fontWeight: 900 }}>{title}</div>
                  <p style={{ margin: "4px 0 0", color: OSP.slate, fontSize: 12.8, lineHeight: 1.38 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, marginTop: 14, padding: 18 }}>
          <div style={{ color: OSP.teal, fontSize: 10.5, fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase" }}>
            {content.guideTitle}
          </div>
          <p style={{ margin: "9px 0 0", color: OSP.slate, fontSize: 14, lineHeight: 1.48 }}>
            {content.guideBody}
          </p>
        </section>

        <section aria-label="Route readiness CTA" style={{ ...cardStyle, marginTop: 14, padding: 12, display: "grid", gap: 10, background: "rgba(255,255,255,0.98)" }}>
          <div style={{ padding: "4px 6px 0" }}>
            <div style={{ color: OSP.slate, fontSize: 10.5, fontWeight: 850, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Route readiness CTA
            </div>
            <div style={{ marginTop: 5, color: OSP.deepNavy, fontSize: 15, fontWeight: 900 }}>
              Continue into the confirmed community session flow.
            </div>
          </div>

          <Link
            href={paymentHref}
            style={{
              minHeight: 54,
              borderRadius: 19,
              background: `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`,
              color: OSP.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 14.5,
              fontWeight: 900,
              boxShadow: "0 16px 30px rgba(5,150,165,0.22)",
            }}
          >
            {content.ctaLabel}
          </Link>

          <Link
            href={paymentHref}
            style={{
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
            Pay Now
          </Link>
        </section>

        <section aria-label="Culture & Community trail stops" style={{ marginTop: 12, borderRadius: 24, padding: 12, background: "#FFFFFF", border: `1px solid ${OSP.line}`, boxShadow: "0 12px 28px rgba(1,56,99,0.065)" }}>
          <div style={{ color: OSP.teal, fontSize: 9.4, lineHeight: 1, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Trail stops
          </div>

          <div style={{ marginTop: 8, color: OSP.slate, fontSize: 11.4, lineHeight: 1.34, fontWeight: 720 }}>
            Passport-ready stop records for Culture & Community. Each stop carries sequence, stop code, Site Access context, stamp eligibility, and scan behavior.
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {trailStops.map((stop) => (
              <div key={stop.stopCode} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 10, alignItems: "start", minHeight: 62, borderRadius: 17, background: OSP.mist, color: OSP.navy, border: "1px solid rgba(5,150,165,0.12)", padding: 11 }}>
                <span style={{ width: 30, height: 30, borderRadius: 12, display: "grid", placeItems: "center", background: "#FFFFFF", color: OSP.teal, fontSize: 10.5, fontWeight: 950 }}>
                  {stop.displayCode}
                </span>
                <span style={{ minWidth: 0 }}>
                  <strong style={{ display: "block", fontSize: 12.4, lineHeight: 1.05, fontWeight: 900, overflowWrap: "anywhere" }}>{stop.stopName}</strong>
                  <span style={{ display: "block", marginTop: 4, fontSize: 11.3, lineHeight: 1.25, fontWeight: 720, color: OSP.slate, overflowWrap: "anywhere" }}>{stop.travelerBody}</span>
                  <span style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 6, marginTop: 9 }}>
                    {[
                      ["Stop", stop.stopCode],
                      ["Site", stop.siteAccessPointCode],
                      ["Stamp", stop.passportStampEligible ? "Eligible" : "Not eligible"],
                      ["Scan", stop.scanBehavior],
                    ].map(([label, value]) => (
                      <span key={label} style={{ borderRadius: 12, background: "#FFFFFF", border: "1px solid rgba(1,56,99,0.08)", padding: "7px 8px", color: OSP.slate, fontSize: 9.2, lineHeight: 1.15, fontWeight: 760, minWidth: 0, overflowWrap: "anywhere", wordBreak: "break-word" }}>
                        <strong style={{ display: "block", color: OSP.teal, fontSize: 8.6, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</strong>
                        {value}
                      </span>
                    ))}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Discover other trails" style={{ marginTop: 12, borderRadius: 24, padding: 12, background: "#FFFFFF", border: `1px solid ${OSP.line}`, boxShadow: "0 12px 28px rgba(1,56,99,0.065)" }}>
          <div style={{ color: OSP.teal, fontSize: 9.4, lineHeight: 1, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Discover other trails
          </div>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 8 }}>
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
                  padding: "11px",
                  boxShadow: "0 8px 18px rgba(1,56,99,0.045)",
                }}
              >
                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <span aria-hidden="true" style={{ width: 46, height: 46, borderRadius: 18, display: "grid", placeItems: "center", background: "#FFFFFF", border: "1px solid rgba(1,56,99,0.10)", boxShadow: "0 10px 22px rgba(1,56,99,0.09)", overflow: "hidden", fontSize: 19 }}>
                    <img src={trail.iconSrc} alt="" aria-hidden="true" style={{ width: 34, height: 34, objectFit: "contain", display: "block" }} />
                  </span>

                  <span style={{ borderRadius: 999, background: "#FFFFFF", border: "1px solid rgba(1,56,99,0.07)", padding: "5px 7px", color: OSP.teal, fontSize: 8.4, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                    {trail.stripAccent}
                  </span>
                </span>

                <span>
                  <strong style={{ display: "block", color: OSP.deepNavy, fontSize: 11.8, lineHeight: 1.08, fontWeight: 900 }}>
                    {trail.title}
                  </strong>
                  <span style={{ display: "block", marginTop: 5, color: OSP.slate, fontSize: 9.8, lineHeight: 1.18, fontWeight: 740 }}>
                    {trail.routeBadge}
                  </span>
                </span>

                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, color: OSP.slate, fontSize: 9.4, lineHeight: 1, fontWeight: 760 }}>
                  <span>{trail.note}</span>
                  <strong style={{ color: OSP.deepNavy, fontSize: 16, lineHeight: 1 }}>›</strong>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div aria-hidden="true" style={{ height: 118 }} />
      </div>

      <SpmTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
