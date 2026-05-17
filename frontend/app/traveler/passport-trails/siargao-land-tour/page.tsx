"use client";

import SpmTravelerBottomTabBar from "../../../../src/components/traveler/SpmTravelerBottomTabBar";
import Link from "next/link";
import { useMemo, useState } from "react";

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

type LandRouteMode = "south-route" | "north-route" | "private-diy";

const routeModes: Record<
  LandRouteMode,
  {
    label: string;
    shortLabel: string;
    routeCode: string;
    routeProduct: string;
    note: string;
    stops: Array<{
      sequence: number;
      displayCode: string;
      stopCode: string;
      stopName: string;
      stopType: string;
      siteAccessPointCode: string;
      nodeRequirementType: string;
      stampValidationMethod: string;
      passportStampEligible: boolean;
      scanBehavior: string;
      status: string;
      travelerBody: string;
    }>;
  }
> = {
  "south-route": {
    label: "South Route",
    shortLabel: "South",
    routeCode: "LAND_SOUTH_ROUTE",
    routeProduct: "LAND_JOINER_STANDARD",
    note: "Coconut Road, Maasin River, Magpupungko, Secret Beach, and Malinao route context.",
    stops: [
      {
        sequence: 1,
        displayCode: "S1",
        stopCode: "LAND_SOUTH_COCONUT_ROAD",
        stopName: "Coconut Road / Sea of Coconuts",
        stopType: "SCENIC_LAND_NODE",
        siteAccessPointCode: "SPM_LAND_SOUTH_COCONUT_ROAD",
        nodeRequirementType: "LAND_ROUTE_NODE",
        stampValidationMethod: "QR_STAMP_NODE_OR_PARTNER_VALIDATION",
        passportStampEligible: true,
        scanBehavior: "Route stop scan or operator validation",
        status: "Passport-ready",
        travelerBody: "Scenic south-route anchor for coconut road and island landscape context.",
      },
      {
        sequence: 2,
        displayCode: "S2",
        stopCode: "LAND_SOUTH_MAASIN_RIVER",
        stopName: "Maasin River",
        stopType: "SCENIC_LAND_NODE",
        siteAccessPointCode: "SPM_LAND_SOUTH_MAASIN_RIVER",
        nodeRequirementType: "LAND_ROUTE_NODE",
        stampValidationMethod: "QR_STAMP_NODE_OR_PARTNER_VALIDATION",
        passportStampEligible: true,
        scanBehavior: "Route stop scan or operator validation",
        status: "Passport-ready",
        travelerBody: "South-route river stop with local movement and route support context.",
      },
      {
        sequence: 3,
        displayCode: "S3",
        stopCode: "LAND_SOUTH_MAGPUPUNGKO",
        stopName: "Magpupungko",
        stopType: "SCENIC_LAND_NODE",
        siteAccessPointCode: "SPM_LAND_SOUTH_MAGPUPUNGKO",
        nodeRequirementType: "LAND_ROUTE_NODE",
        stampValidationMethod: "QR_STAMP_NODE_OR_PARTNER_VALIDATION",
        passportStampEligible: true,
        scanBehavior: "Route stop scan or operator validation",
        status: "Passport-ready",
        travelerBody: "South-route tidal pool and coastal stop context, subject to route timing.",
      },
      {
        sequence: 4,
        displayCode: "SP",
        stopCode: "LAND_SOUTH_PASSPORT_PROGRESS",
        stopName: "South Route Passport Progress",
        stopType: "TRAIL_PROGRESS_NODE",
        siteAccessPointCode: "SPM_LAND_SOUTH_PROGRESS_LINK",
        nodeRequirementType: "QR_STAMP_NODE",
        stampValidationMethod: "PASSPORT_PROGRESS_EVENT",
        passportStampEligible: true,
        scanBehavior: "Passport Trail progress event after payment",
        status: "Linked",
        travelerBody: "South Route progress can attach to the traveler Passport Trail record.",
      },
    ],
  },
  "north-route": {
    label: "North Route",
    shortLabel: "North",
    routeCode: "LAND_NORTH_ROUTE",
    routeProduct: "LAND_JOINER_STANDARD",
    note: "Pacifico, Trogon’s Perch, Alegria, Somyot Cave, Taktak Falls, and north-coast route context.",
    stops: [
      {
        sequence: 1,
        displayCode: "N1",
        stopCode: "LAND_NORTH_PACIFICO",
        stopName: "Pacifico Beach",
        stopType: "NORTH_ROUTE_NODE",
        siteAccessPointCode: "SPM_LAND_NORTH_PACIFICO",
        nodeRequirementType: "LAND_ROUTE_NODE",
        stampValidationMethod: "QR_STAMP_NODE_OR_PARTNER_VALIDATION",
        passportStampEligible: true,
        scanBehavior: "Route stop scan or operator validation",
        status: "Passport-ready",
        travelerBody: "North-coast beach anchor for the North Route.",
      },
      {
        sequence: 2,
        displayCode: "N2",
        stopCode: "LAND_NORTH_TROGONS_PERCH",
        stopName: "Trogon’s Perch / Scenic North Stop",
        stopType: "NORTH_ROUTE_NODE",
        siteAccessPointCode: "SPM_LAND_NORTH_TROGONS_PERCH",
        nodeRequirementType: "LAND_ROUTE_NODE",
        stampValidationMethod: "QR_STAMP_NODE_OR_PARTNER_VALIDATION",
        passportStampEligible: true,
        scanBehavior: "Route stop scan or operator validation",
        status: "Passport-ready",
        travelerBody: "North Route scenic stop context for elevated coastal viewing.",
      },
      {
        sequence: 3,
        displayCode: "N3",
        stopCode: "LAND_NORTH_ALEGRIA_TAKTAK",
        stopName: "Alegria / Taktak Falls",
        stopType: "NORTH_ROUTE_NODE",
        siteAccessPointCode: "SPM_LAND_NORTH_ALEGRIA_TAKTAK",
        nodeRequirementType: "LAND_ROUTE_NODE",
        stampValidationMethod: "QR_STAMP_NODE_OR_PARTNER_VALIDATION",
        passportStampEligible: true,
        scanBehavior: "Route stop scan or operator validation",
        status: "Passport-ready",
        travelerBody: "North Route beach and waterfall stop context, subject to operator-supported timing.",
      },
      {
        sequence: 4,
        displayCode: "NP",
        stopCode: "LAND_NORTH_PASSPORT_PROGRESS",
        stopName: "North Route Passport Progress",
        stopType: "TRAIL_PROGRESS_NODE",
        siteAccessPointCode: "SPM_LAND_NORTH_PROGRESS_LINK",
        nodeRequirementType: "QR_STAMP_NODE",
        stampValidationMethod: "PASSPORT_PROGRESS_EVENT",
        passportStampEligible: true,
        scanBehavior: "Passport Trail progress event after payment",
        status: "Linked",
        travelerBody: "North Route progress can attach to the traveler Passport Trail record.",
      },
    ],
  },
  "private-diy": {
    label: "Private DIY Route",
    shortLabel: "DIY",
    routeCode: "LAND_PRIVATE_DIY_ROUTE",
    routeProduct: "LAND_PRIVATE_DIY_SUPPORT",
    note: "Custom land route with driver, local support, transport mode, and optional media support.",
    stops: [
      {
        sequence: 1,
        displayCode: "D1",
        stopCode: "LAND_DIY_ROUTE_PLANNING",
        stopName: "Custom Route Planning",
        stopType: "OPERATOR_REQUIRED_NODE",
        siteAccessPointCode: "SPM_LAND_DIY_ROUTE_PLANNING",
        nodeRequirementType: "OPERATOR_REQUIRED_NODE",
        stampValidationMethod: "OPERATOR_ROUTE_CONFIRMATION",
        passportStampEligible: true,
        scanBehavior: "Operator route confirmation before payment",
        status: "Needs confirmation",
        travelerBody: "Custom South/North blended route planning with approved local support.",
      },
      {
        sequence: 2,
        displayCode: "D2",
        stopCode: "LAND_DIY_TRANSPORT_SUPPORT",
        stopName: "Transport Support",
        stopType: "TRANSPORT_REQUIRED_NODE",
        siteAccessPointCode: "SPM_LAND_DIY_TRANSPORT_SUPPORT",
        nodeRequirementType: "TRANSPORT_REQUIRED_NODE",
        stampValidationMethod: "OPERATOR_TRANSPORT_VALIDATION",
        passportStampEligible: true,
        scanBehavior: "Transport support validation",
        status: "Passport-ready",
        travelerBody: "TukTuk, motorcycle, van, or route support can be confirmed by operator.",
      },
      {
        sequence: 3,
        displayCode: "DP",
        stopCode: "LAND_DIY_PASSPORT_PROGRESS",
        stopName: "DIY Passport Progress",
        stopType: "TRAIL_PROGRESS_NODE",
        siteAccessPointCode: "SPM_LAND_DIY_PROGRESS_LINK",
        nodeRequirementType: "QR_STAMP_NODE",
        stampValidationMethod: "PASSPORT_PROGRESS_EVENT",
        passportStampEligible: true,
        scanBehavior: "Passport Trail progress event after payment",
        status: "Linked",
        travelerBody: "Custom land route progress can attach to Passport Trail progress.",
      },
    ],
  },
};

const content = {
  eyebrow: "PASSPORT TRAILS™ · LAND TOUR",
  title: "Siargao Land Tour Passport Trail",
  mediaTitle: "Siargao Land Tour preview",
  descriptionTitle: "Description",
  description:
    "Explore Siargao by land through South Route, North Route, or private DIY route support — with operator-backed transport, stop planning, and Passport Trail progress connected into one clean checkout flow.",
  features: [
    "South Route highlights",
    "North Route highlights",
    "Private DIY support",
    "Transport-backed route",
    "Passport progress linked",
    "Operator-confirmed flow",
  ],
  bookingSteps: [
    ["01", "Choose route mode", "South, North, or Private DIY route support."],
    ["02", "Confirm transport support", "Driver, TukTuk, motorcycle, or van support where configured."],
    ["03", "Review route total", "Land Joiner starts from ₱2,100 per pax."],
    ["04", "Continue checkout", "Payment opens after route support confirmation."],
  ],
  guideTitle: "Guide / Support Logic",
  guideBody:
    "Land Tour uses operator-backed transport and route support. South, North, and Private DIY modes can carry different stops, support levels, and Passport Trail progress, while keeping one clean booking and payment flow.",
  routeFacts: [
    ["Product", "Land Joiner"],
    ["Route", "South / North / DIY"],
    ["Price", "₱2,100 / pax"],
    ["Difficulty", "Average"],
  ],
  ctaLabel: "Continue Checkout",
};

const otherTrails = [
  {
    iconSrc: "/osp/osp-verified-logo.png",
    title: "Tri-Island Passport Trail",
    routeBadge: "GL Port",
    note: "Governed island route",
    href: "/traveler/passport-trails/island-hopping",
    stripAccent: "Island",
    tileColor: "#EAFBFA",
  },
  {
    iconSrc: "/osp/spm/trails/icons/sugba-lagoon-badge.png?v=01l",
    title: "Sugba Lagoon Island Hopping",
    routeBadge: "Del Carmen",
    note: "Lagoon route",
    href: "/traveler/passport-trails/sugba-lagoon",
    stripAccent: "Lagoon",
    tileColor: "#F2FBFF",
  },
  {
    iconSrc: "/osp/spm/trails/icons/surf-explorer-badge.png?v=01l",
    title: "Explorer Surf Trail",
    routeBadge: "Cloud 9",
    note: "Surf support",
    href: "/traveler/passport-trails/surf-explorer",
    stripAccent: "Surf",
    tileColor: "#EEF7FF",
  },
  {
    iconSrc: "/osp/spm/trails/icons/culture-community-badge.png?v=01l",
    title: "Culture & Community Trail",
    routeBadge: "Local discovery",
    note: "Community stops",
    href: "/traveler/passport-trails/culture-community",
    stripAccent: "Culture",
    tileColor: "#F6F3FF",
  },
  {
    iconSrc: "/osp/spm/trails/icons/food-wellness-badge.png?v=01l",
    title: "Food & Wellness Trail",
    routeBadge: "Merchant trail",
    note: "Food and wellness",
    href: "/traveler/passport-trails/food-wellness",
    stripAccent: "Merchant",
    tileColor: "#FFF4EF",
  },
  {
    iconSrc: "/osp/spm/trails/icons/bucas-sohoton-badge.png?v=01l",
    title: "Bucas Grande / Sohoton Official Trail",
    routeBadge: "Dapa-side",
    note: "Sohoton route",
    href: "/traveler/passport-trails/bucas-grande-sohoton",
    stripAccent: "Sohoton",
    tileColor: "#F2FBFF",
  },
] as const;

const cardStyle = {
  background: "rgba(255,255,255,0.96)",
  border: `1px solid ${OSP.line}`,
  borderRadius: 28,
  boxShadow: "0 18px 50px rgba(1,56,99,0.08)",
};


export default function SiargaoLandTourOfficialTrailPage() {
  const [routeMode, setRouteMode] = useState<LandRouteMode>("south-route");
  const selectedRoute = routeModes[routeMode];

  const paymentHref = useMemo(
    () =>
      buildHref("/traveler/passport-trails/siargao-land-tour/book", {
        source: "passport-trails",
        trail: "siargao-land-tour",
        officialTrail: "Siargao Land Tour Passport Trail",
        routeType: "LAND_TOUR_OPERATOR_CONFIRMED",
        routeCode: selectedRoute.routeCode,
        routeMode,
        routeProduct: selectedRoute.routeProduct,
        productCode: "LAND_JOINER_STANDARD",
        tripNo: `SPM-LAND-${selectedRoute.shortLabel.toUpperCase()}-01`,
        departurePort: "NOT_DCS",
        date: "2026-05-18",
        departureTime: "07:00",
        regularPax: "1",
        seniorPax: "0",
        totalPax: "1",
        pickupZone: "GENERAL_LUNA_POBLACION",
        pickupArea: "General Luna / Poblacion pickup",
        supportType: "LAND_TRANSPORT_OPERATOR",
        operatorStatus: "CONFIRMED",
        routeBasePrice: "2100",
        entranceFeePerPax: "0",
        perPaxTotal: "2100",
        unitPrice: "2100",
        amount: "2100",
        pricingVersion: "LAND_JOINER_2026_05",
        pricingMode: "LAND_JOINER_PER_PAX",
        paymentTiming: "AFTER_ROUTE_SUPPORT_CONFIRMATION",
        currencyCode: "PHP",
        step: "book",
      }),
    [routeMode, selectedRoute.routeCode, selectedRoute.routeProduct, selectedRoute.shortLabel],
  );

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

        <section aria-label="Siargao Land Tour media" style={{ ...cardStyle, overflow: "hidden", background: "#F4FCFA", color: OSP.deepNavy }}>
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
                  caption: "South",
                  image: "/osp/spm/trails/siargao-land-tour/south.png",
                },
                {
                  label: "Photo 02",
                  caption: "North",
                  image: "/osp/spm/trails/siargao-land-tour/north.png",
                },
                {
                  label: "Photo 03",
                  caption: "DIY",
                  image: "/osp/spm/trails/siargao-land-tour/diy.png",
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

        <section aria-label="Land route selector" style={{ ...cardStyle, marginTop: 14, padding: 12 }}>
          <div style={{ color: OSP.teal, fontSize: 9.4, lineHeight: 1, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Choose route mode
          </div>
          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {(Object.entries(routeModes) as Array<[LandRouteMode, (typeof routeModes)[LandRouteMode]]>).map(([key, route]) => {
              const active = routeMode === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRouteMode(key)}
                  style={{
                    minHeight: 76,
                    borderRadius: 18,
                    padding: 9,
                    border: active ? "1.5px solid rgba(5,150,165,0.42)" : `1px solid ${OSP.line}`,
                    background: active ? OSP.mist : "#FFFFFF",
                    color: OSP.deepNavy,
                    display: "grid",
                    alignContent: "space-between",
                    textAlign: "left",
                    boxShadow: active ? "0 10px 22px rgba(5,150,165,0.10)" : "none",
                    cursor: "pointer",
                  }}
                >
                  <strong style={{ fontSize: 12.2, lineHeight: 1.05, fontWeight: 930 }}>{route.shortLabel}</strong>
                  <span style={{ color: OSP.slate, fontSize: 9.2, lineHeight: 1.15, fontWeight: 760 }}>
                    {route.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p style={{ margin: "10px 2px 0", color: OSP.slate, fontSize: 11.8, lineHeight: 1.36, fontWeight: 720 }}>
            {selectedRoute.note}
          </p>
        </section>

        <section aria-label="Route readiness CTA" style={{ ...cardStyle, marginTop: 14, padding: 12, display: "grid", gap: 10, background: "rgba(255,255,255,0.98)" }}>
          <div style={{ padding: "4px 6px 0" }}>
            <div style={{ color: OSP.slate, fontSize: 10.5, fontWeight: 850, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Route readiness CTA
            </div>
            <div style={{ marginTop: 5, color: OSP.deepNavy, fontSize: 15, fontWeight: 900 }}>
              Continue into the confirmed Land Tour route flow.
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

        <section aria-label="Siargao Land Tour trail stops" style={{ marginTop: 12, borderRadius: 24, padding: 12, background: "#FFFFFF", border: `1px solid ${OSP.line}`, boxShadow: "0 12px 28px rgba(1,56,99,0.065)" }}>
          <div style={{ color: OSP.teal, fontSize: 9.4, lineHeight: 1, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Trail stops
          </div>

          <div style={{ marginTop: 8, color: OSP.slate, fontSize: 11.4, lineHeight: 1.34, fontWeight: 720 }}>
            Passport-ready stop records for {selectedRoute.label}. Each stop carries route code, stop code, Site Access context, stamp eligibility, and scan behavior.
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {selectedRoute.stops.map((stop) => (
              <div key={stop.stopCode} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 10, alignItems: "start", minHeight: 62, borderRadius: 17, background: OSP.mist, color: OSP.navy, border: "1px solid rgba(5,150,165,0.12)", padding: 11 }}>
                <span style={{ width: 30, height: 30, borderRadius: 12, display: "grid", placeItems: "center", background: "#FFFFFF", color: OSP.teal, fontSize: 10.5, fontWeight: 950 }}>
                  {stop.displayCode}
                </span>
                <span style={{ minWidth: 0 }}>
                  <strong style={{ display: "block", fontSize: 12.4, lineHeight: 1.05, fontWeight: 900, overflowWrap: "anywhere" }}>{stop.stopName}</strong>
                  <span style={{ display: "block", marginTop: 4, fontSize: 11.3, lineHeight: 1.25, fontWeight: 720, color: OSP.slate, overflowWrap: "anywhere" }}>{stop.travelerBody}</span>
                  <span style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 6, marginTop: 9 }}>
                    {[
                      ["Route", selectedRoute.routeCode],
                      ["Stop", stop.stopCode],
                      ["Site", stop.siteAccessPointCode],
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
