"use client";

import { ReactNode, useMemo, useState } from "react";
import SpmTravelerBottomTabBar from "../../../../src/components/traveler/SpmTravelerBottomTabBar";
import PassportMapShortcut from "../../../../src/components/traveler/PassportMapShortcut";

const DRAFT_STORAGE_KEY = "osp-spm-diy-passport-trail-draft-v1";

type TemplateCategory =
  | "ISLAND"
  | "LAND"
  | "SOHOTON"
  | "PREMIUM_ISLAND"
  | "NORTH"
  | "SCENIC"
  | "CUSTOM";

type RouteStop = {
  id: string;
  title: string;
  area: string;
  tag: string;
  supportFlag:
    | "Scenic stop"
    | "Driver-supported"
    | "Boat required"
    | "Guide/operator required"
    | "Tide/weather sensitive"
    | "Optional add-on";
  requiredByDefault: boolean;
};

type TourTemplate = {
  id: string;
  category: TemplateCategory;
  label: string;
  name: string;
  promise: string;
  bestFor: string[];
  routeHighlights: string[];
  durationLabel: string;
  difficulty: "Easy" | "Average" | "Expedition";
  commercialMode: string;
  startingPriceLabel: string;
  fulfillmentMode: string;
  paymentStatus: string;
  operatorStatus: string;
  confirmationStatus: string;
  cautionFlags: string[];
  stops: RouteStop[];
};

const templates: TourTemplate[] = [
  {
    id: "essential-island-hopping",
    category: "ISLAND",
    label: "Most recommended",
    name: "Essential Island Hopping Trail",
    promise: "The classic Siargao island day, structured for first-timers.",
    bestFor: ["First-time visitors", "Couples", "Friend groups", "Solo joiners"],
    routeHighlights: ["Guyam Island", "Daku Island", "Naked Island", "Secret Island if tide allows"],
    durationLabel: "9AM–4PM typical",
    difficulty: "Easy",
    commercialMode: "Joiner / Private / Premium private",
    startingPriceLabel: "Joiner from ₱1,500",
    fulfillmentMode: "SPM-curated / boat operator-led",
    paymentStatus: "Gateway-ready after request",
    operatorStatus: "Operator alert supported",
    confirmationStatus: "Request to confirm",
    cautionFlags: ["Boat required", "Tide may affect Secret Island", "Pickup rules apply"],
    stops: [
      { id: "guyam", title: "Guyam Island", area: "Tri-Island", tag: "Island stop", supportFlag: "Boat required", requiredByDefault: true },
      { id: "daku", title: "Daku Island", area: "Tri-Island", tag: "Lunch / beach stop", supportFlag: "Boat required", requiredByDefault: true },
      { id: "naked", title: "Naked Island", area: "Tri-Island", tag: "Sandbar stop", supportFlag: "Boat required", requiredByDefault: true },
      { id: "secret-island", title: "Secret Island", area: "Tide-dependent", tag: "Optional low-tide stop", supportFlag: "Tide/weather sensitive", requiredByDefault: false },
    ],
  },
  {
    id: "south-lagoon-discovery",
    category: "LAND",
    label: "Best balanced day",
    name: "South + Lagoon Discovery Trail",
    promise: "A balanced full-day route combining iconic land stops and lagoon access.",
    bestFor: ["Families", "Couples", "Photo travelers", "First-time full-day explorers"],
    routeHighlights: ["Coconut Road", "Maasin River", "Magpupungko", "Sugba Lagoon"],
    durationLabel: "7AM–5PM typical",
    difficulty: "Average",
    commercialMode: "Joiner where available / Private land tour",
    startingPriceLabel: "Joiner from ₱2,100",
    fulfillmentMode: "SPM-curated / driver + lagoon operator-led",
    paymentStatus: "Gateway-ready after request",
    operatorStatus: "Operator alert supported",
    confirmationStatus: "Request to confirm",
    cautionFlags: ["Driver support required", "Lagoon boat segment", "Timing and tide validation"],
    stops: [
      { id: "coconut-road", title: "Coconut Road / Sea of Coconuts", area: "Land route", tag: "Scenic anchor", supportFlag: "Driver-supported", requiredByDefault: true },
      { id: "maasin", title: "Maasin River View", area: "Land route", tag: "River stop", supportFlag: "Driver-supported", requiredByDefault: true },
      { id: "magpupungko", title: "Magpupungko", area: "Pilar", tag: "Tide pool / scenic", supportFlag: "Tide/weather sensitive", requiredByDefault: true },
      { id: "sugba", title: "Sugba Lagoon", area: "Lagoon segment", tag: "Water activity", supportFlag: "Boat required", requiredByDefault: true },
      { id: "secret-beach", title: "Secret Beach", area: "Optional scenic", tag: "Optional stop", supportFlag: "Optional add-on", requiredByDefault: false },
      { id: "malinao-skate", title: "Malinao Skate Road", area: "General Luna", tag: "Scenic / lifestyle", supportFlag: "Driver-supported", requiredByDefault: false },
    ],
  },
  {
    id: "sohoton-expedition",
    category: "SOHOTON",
    label: "Full-day expedition",
    name: "Sohoton Expedition Trail",
    promise: "A bigger adventure route for travelers who want the full Bucas Grande experience.",
    bestFor: ["Adventure travelers", "Groups", "Longer-stay visitors", "Higher-budget travelers"],
    routeHighlights: ["Sohoton Cove", "Jellyfish Sanctuary", "Hagukan Cave", "Tiktikan Lake"],
    durationLabel: "6AM–5PM typical",
    difficulty: "Expedition",
    commercialMode: "Joiner / Private / Premium private",
    startingPriceLabel: "Joiner from ₱2,800",
    fulfillmentMode: "SPM-curated / boat + local guide-led",
    paymentStatus: "Gateway-ready after request",
    operatorStatus: "Operator alert supported",
    confirmationStatus: "Request to confirm",
    cautionFlags: ["Early pickup", "Sea-condition validation", "Environmental fees"],
    stops: [
      { id: "sohoton-cove", title: "Sohoton Cove", area: "Bucas Grande", tag: "Main expedition stop", supportFlag: "Boat required", requiredByDefault: true },
      { id: "jellyfish", title: "Jellyfish Sanctuary", area: "Bucas Grande", tag: "Signature stop", supportFlag: "Guide/operator required", requiredByDefault: true },
      { id: "hagukan", title: "Hagukan Cave", area: "Bucas Grande", tag: "Cave stop", supportFlag: "Guide/operator required", requiredByDefault: true },
      { id: "tiktikan", title: "Tiktikan Lake", area: "Bucas Grande", tag: "Lake stop", supportFlag: "Boat required", requiredByDefault: true },
      { id: "crystal-cave", title: "Crystal Cave", area: "Bucas Grande", tag: "Optional cave", supportFlag: "Optional add-on", requiredByDefault: false },
    ],
  },
  {
    id: "corregidor-premium",
    category: "PREMIUM_ISLAND",
    label: "Premium island route",
    name: "Corregidor + Tri-Island Premium Trail",
    promise: "Island hopping with a stronger, more complete premium route.",
    bestFor: ["Groups", "Content travelers", "Premium private guests"],
    routeHighlights: ["Corregidor", "Naked Island", "Daku Island", "Guyam Island"],
    durationLabel: "9AM–4PM typical",
    difficulty: "Average",
    commercialMode: "Joiner / Private / Premium private",
    startingPriceLabel: "Joiner from ₱2,300",
    fulfillmentMode: "SPM-curated / boat operator-led",
    paymentStatus: "Gateway-ready after request",
    operatorStatus: "Operator alert supported",
    confirmationStatus: "Request to confirm",
    cautionFlags: ["Boat required", "Route sequence may change", "Pickup rules apply"],
    stops: [
      { id: "corregidor", title: "Corregidor Island", area: "Island route", tag: "Premium island stop", supportFlag: "Boat required", requiredByDefault: true },
      { id: "naked-corregidor", title: "Naked Island", area: "Island route", tag: "Sandbar stop", supportFlag: "Boat required", requiredByDefault: true },
      { id: "daku-corregidor", title: "Daku Island", area: "Island route", tag: "Lunch / beach stop", supportFlag: "Boat required", requiredByDefault: true },
      { id: "guyam-corregidor", title: "Guyam Island", area: "Island route", tag: "Island stop", supportFlag: "Boat required", requiredByDefault: true },
    ],
  },
  {
    id: "north-coastal",
    category: "NORTH",
    label: "Beyond General Luna",
    name: "North Siargao Coastal Trail",
    promise: "A quieter discovery route for travelers who want to go beyond the usual island day.",
    bestFor: ["Return travelers", "Long-stay travelers", "Adventure-light travelers"],
    routeHighlights: ["Pacifico", "Little Hawaii", "Alegria", "TakTak Falls"],
    durationLabel: "Full-day private route",
    difficulty: "Average",
    commercialMode: "Private / Small group",
    startingPriceLabel: "Private request",
    fulfillmentMode: "SPM-curated / driver-led",
    paymentStatus: "Gateway-ready after request",
    operatorStatus: "Operator alert supported",
    confirmationStatus: "Request to confirm",
    cautionFlags: ["Long-distance timing", "Driver support required", "Some stops need validation"],
    stops: [
      { id: "pacifico", title: "Pacifico Beach", area: "North Siargao", tag: "Coastal anchor", supportFlag: "Driver-supported", requiredByDefault: true },
      { id: "little-hawaii", title: "Little Hawaii", area: "North Siargao", tag: "Scenic stop", supportFlag: "Driver-supported", requiredByDefault: true },
      { id: "alegria", title: "Alegria Beach", area: "North Siargao", tag: "Beach stop", supportFlag: "Driver-supported", requiredByDefault: true },
      { id: "taktak", title: "TakTak Falls", area: "North Siargao", tag: "Waterfall stop", supportFlag: "Driver-supported", requiredByDefault: true },
      { id: "somyot", title: "Somyot Cave", area: "Candidate stop", tag: "Optional cave", supportFlag: "Optional add-on", requiredByDefault: false },
    ],
  },
  {
    id: "sunset-soft-day",
    category: "SCENIC",
    label: "Easy scenic day",
    name: "Sunset Soft Day Trail",
    promise: "A lighter Siargao day for beauty, photos, and a slower island pace.",
    bestFor: ["Couples", "Families", "Arrival-day travelers", "Slow travelers"],
    routeHighlights: ["Cloud 9 Sunset", "Catangnan Bridge", "Coconut Road", "Malinao / Secret Beach candidate"],
    durationLabel: "Half-day / soft route",
    difficulty: "Easy",
    commercialMode: "Private soft route",
    startingPriceLabel: "Request to confirm",
    fulfillmentMode: "SPM-curated / driver or tuktuk-led",
    paymentStatus: "Gateway-ready after request",
    operatorStatus: "Operator alert supported",
    confirmationStatus: "Request to confirm",
    cautionFlags: ["Low-friction route", "Optional photo support", "Best timed near sunset"],
    stops: [
      { id: "cloud9-sunset", title: "Cloud 9 Sunset Zone", area: "General Luna", tag: "Sunset anchor", supportFlag: "Scenic stop", requiredByDefault: true },
      { id: "catangnan", title: "Catangnan Bridge", area: "General Luna", tag: "Photo stop", supportFlag: "Scenic stop", requiredByDefault: true },
      { id: "coconut-soft", title: "Coconut Road", area: "Scenic route", tag: "Scenic drive", supportFlag: "Driver-supported", requiredByDefault: true },
      { id: "malinao-secret", title: "Malinao / Secret Beach Candidate", area: "Candidate stop", tag: "Optional soft stop", supportFlag: "Optional add-on", requiredByDefault: false },
    ],
  },
  {
    id: "custom-private",
    category: "CUSTOM",
    label: "Most flexible",
    name: "Custom Private Passport Trail",
    promise: "For travelers who want flexibility, but still need SPM route structure.",
    bestFor: ["Private groups", "Special requests", "Travelers with must-see stops"],
    routeHighlights: ["Choose route mood", "Choose pax", "Choose support level", "Choose must-see stops"],
    durationLabel: "Built around request",
    difficulty: "Average",
    commercialMode: "Private custom request",
    startingPriceLabel: "Request to confirm",
    fulfillmentMode: "SPM-curated / matched local operator-led",
    paymentStatus: "Gateway-ready after request",
    operatorStatus: "Operator alert supported",
    confirmationStatus: "Request to confirm",
    cautionFlags: ["Final route needs review", "Price depends on stops", "Operator assignment after confirmation"],
    stops: [
      { id: "custom-island", title: "Island route candidate", area: "Traveler choice", tag: "Water route", supportFlag: "Boat required", requiredByDefault: false },
      { id: "custom-land", title: "Land route candidate", area: "Traveler choice", tag: "Land route", supportFlag: "Driver-supported", requiredByDefault: false },
      { id: "custom-soft", title: "Soft scenic candidate", area: "Traveler choice", tag: "Scenic route", supportFlag: "Scenic stop", requiredByDefault: false },
    ],
  },
];

function Pill(props: { children: ReactNode; tone?: "aqua" | "gold" | "green" | "slate" | "dark" }) {
  const theme = {
    aqua: ["rgba(14,165,233,0.08)", "#08798e", "rgba(14,116,144,0.12)"],
    gold: ["rgba(217,119,6,0.09)", "#9a5b11", "rgba(217,119,6,0.14)"],
    green: ["rgba(20,184,166,0.10)", "#0f766e", "rgba(20,184,166,0.18)"],
    slate: ["rgba(15,23,42,0.045)", "#64748b", "rgba(15,23,42,0.08)"],
    dark: ["rgba(16,35,74,0.08)", "#10234a", "rgba(16,35,74,0.10)"],
  }[props.tone ?? "slate"];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "4px 7px",
        background: theme[0],
        color: theme[1],
        border: `1px solid ${theme[2]}`,
        fontSize: 9.4,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {props.children}
    </span>
  );
}

function Action(props: {
  children: string;
  href?: string;
  onClick?: (event: any) => void;
  selected?: boolean;
  tone?: "primary" | "soft" | "dark" | "optional";
  priority?: "dominant" | "normal" | "compact";
  disabled?: boolean;
}) {
  const tone = props.tone ?? "primary";
  const priority = props.priority ?? "normal";
  const dominant = priority === "dominant";
  const compact = priority === "compact";

  const theme =
    tone === "dark"
      ? {
          background: "linear-gradient(135deg, #10234a, #17415f)",
          color: "#ffffff",
          border: "1px solid rgba(16,35,74,0.18)",
          shadow: dominant ? "0 12px 24px rgba(16,35,74,0.16)" : "0 8px 18px rgba(16,35,74,0.12)",
        }
      : tone === "optional"
        ? {
            background: "rgba(255,255,255,0.58)",
            color: "#64748b",
            border: "1px dashed rgba(100,116,139,0.22)",
            shadow: "none",
          }
        : tone === "soft"
          ? {
              background: props.selected ? "rgba(20,184,166,0.10)" : "rgba(255,255,255,0.78)",
              color: props.selected ? "#0f766e" : "#0b6f82",
              border: props.selected ? "1px solid rgba(20,184,166,0.22)" : "1px solid rgba(14,116,144,0.12)",
              shadow: dominant ? "0 10px 22px rgba(15,23,42,0.08)" : "0 7px 16px rgba(15,23,42,0.04)",
            }
          : {
              background: "linear-gradient(135deg, #0b8f9f, #0f766e)",
              color: "#ffffff",
              border: "1px solid rgba(11,143,159,0.22)",
              shadow: dominant ? "0 12px 24px rgba(7,141,160,0.18)" : "0 8px 18px rgba(7,141,160,0.13)",
            };

  const style = {
    minHeight: dominant ? 44 : compact ? 28 : 32,
    borderRadius: dominant ? 16 : 12,
    padding: dominant ? "10px 15px" : compact ? "5px 8px" : "7px 10px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    textDecoration: "none",
    fontSize: dominant ? 12.4 : compact ? 9.8 : 10.3,
    lineHeight: 1,
    fontWeight: dominant ? 950 : 900,
    letterSpacing: dominant ? "-0.015em" : "-0.01em",
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? 0.46 : 1,
    background: theme.background,
    color: theme.color,
    border: theme.border,
    boxShadow: theme.shadow,
    WebkitTapHighlightColor: "transparent",
  } as const;

  if (props.href) {
    return (
      <a href={props.href} onClick={props.onClick} style={style}>
        {props.children}
      </a>
    );
  }

  return (
    <button type="button" onClick={props.onClick} disabled={props.disabled} style={style}>
      {props.children}
    </button>
  );
}

function categoryTone(category: TemplateCategory) {
  if (category === "ISLAND") return ["#e8fbfb", "#0b8f9f"];
  if (category === "LAND") return ["#eefcf4", "#25734a"];
  if (category === "SOHOTON") return ["#eef7ff", "#174a7c"];
  if (category === "PREMIUM_ISLAND") return ["#fff8eb", "#a05b0b"];
  if (category === "NORTH") return ["#f3f7ff", "#2b5188"];
  if (category === "SCENIC") return ["#fffdf0", "#8a6a0a"];
  return ["#f8fafc", "#10234a"];
}


function getStopInsight(stop: RouteStop, template: TourTemplate) {
  const support = stop.supportFlag;

  const role = stop.requiredByDefault
    ? "This is a core stop. It keeps the selected SPM route coherent and should usually stay included."
    : "This is an optional add-on. Add it only if your pace, timing, and operator availability allow it.";

  const fulfillment =
    support === "Boat required"
      ? "This stop needs boat/operator coordination and must be confirmed before payment."
      : support === "Tide/weather sensitive"
        ? "This stop depends on tide, weather, or timing. SPM keeps it reviewable before confirmation."
        : support === "Guide/operator required"
          ? "This stop needs local guide or operator support before it can become a confirmed activity."
          : support === "Driver-supported"
            ? "This stop depends on route timing, pickup area, and driver-supported movement."
            : support === "Optional add-on"
              ? "This stop can improve the route, but it should not weaken the day’s timing or flow."
              : "This stop supports the route experience without forcing unnecessary complexity.";

  return {
    routeRole: role,
    fulfillment,
    paymentImpact: `${template.confirmationStatus}. Final timing, operator support, and price are reviewed before payment execution.`,
  };
}


function getDiyPackageCode(templateName: string) {
  const name = templateName.toLowerCase();

  if (name.includes("corregidor")) return "DIY_CORREGIDOR_TRI_ISLAND_PREMIUM";
  if (name.includes("custom")) return "DIY_CUSTOM_PRIVATE_PASSPORT_TRAIL";
  if (name.includes("essential") || name.includes("island hopping")) return "DIY_ESSENTIAL_ISLAND_HOPPING";
  if (name.includes("north")) return "DIY_NORTH_SIARGAO_COASTAL";
  if (name.includes("sohoton")) return "DIY_SOHOTON_EXPEDITION";
  if (name.includes("south") || name.includes("lagoon")) return "DIY_SOUTH_LAGOON_DISCOVERY";
  if (name.includes("sunset")) return "DIY_SUNSET_SOFT_DAY";

  return "";
}

export default function BuildYourOwnPassportTrailPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const [pace, setPace] = useState("Balanced");
  const [paxCount, setPaxCount] = useState(2);
  const [supportLevel, setSupportLevel] = useState("Private / operator-supported");
  const [selectedStopIds, setSelectedStopIds] = useState<string[]>(
    templates[0].stops.filter((stop) => stop.requiredByDefault).map((stop) => stop.id)
  );
  const [savedNotice, setSavedNotice] = useState("");
  const [activeStopInsightId, setActiveStopInsightId] = useState<string | null>(null);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? templates[0],
    [selectedTemplateId]
  );

  const selectedStops = useMemo(
    () => selectedTemplate.stops.filter((stop) => selectedStopIds.includes(stop.id)),
    [selectedTemplate, selectedStopIds]
  );

  function selectTemplate(template: TourTemplate) {
    setSelectedTemplateId(template.id);
    setSelectedStopIds(template.stops.filter((stop) => stop.requiredByDefault).map((stop) => stop.id));
    setActiveStopInsightId(null);
    setSavedNotice("");
  }

  function toggleStop(stopId: string) {
    setSavedNotice("");
    setSelectedStopIds((current) =>
      current.includes(stopId) ? current.filter((id) => id !== stopId) : [...current, stopId]
    );
  }

  function saveLocalDraft() {
    const payload = {
      savedAt: new Date().toISOString(),
      selectedStyle: selectedTemplate.name,
      supportLevel,
      items: selectedStops.map((stop) => ({
        id: stop.id,
        icon: "◇",
        title: stop.title,
        category: stop.tag,
        area: stop.area,
        support: stop.supportFlag,
        priceMode: selectedTemplate.startingPriceLabel,
        note: `${selectedTemplate.name} • ${selectedTemplate.confirmationStatus}`,
      })),
      disclaimer:
        "SPM-curated traveler request draft only. Booking, payment, operator assignment, QR validation, clearance, and Passport Stamp progress require backend confirmation.",
      commercialContext: {
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        packageCode: getDiyPackageCode(selectedTemplate.name),
        paxCount,
        pace,
        paymentGatewayReady: true,
        operatorNotificationSupported: true,
        operatorAssignmentStatus: "AFTER_CONFIRMATION",
        fulfillmentMode: selectedTemplate.fulfillmentMode,
      },
    };

    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
    setSavedNotice("Route request draft prepared on this device.");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 18% 0%, rgba(20,184,166,0.10), transparent 32%), radial-gradient(circle at 96% 2%, rgba(14,165,233,0.08), transparent 28%), linear-gradient(180deg, #fbfeff 0%, #f5fbfb 44%, #f8fafc 100%)",
        padding: "12px 12px 96px",
        color: "#10234a",
      }}
    >
      <div style={{ maxWidth: 470, margin: "0 auto" }}>
        <header
          style={{
            borderRadius: 30,
            background:
              "radial-gradient(circle at 12% 0%, rgba(20,184,166,0.14), transparent 34%), linear-gradient(145deg, rgba(255,255,255,0.96), rgba(237,250,250,0.96))",
            border: "1px solid rgba(14,116,144,0.12)",
            boxShadow: "0 18px 44px rgba(15,23,42,0.10)",
            padding: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
            <a
              href="/traveler/passport-trails"
              aria-label="Back to Passport Trails"
              style={{
                width: 36,
                height: 36,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                textDecoration: "none",
                background: "rgba(255,255,255,0.74)",
                color: "#0b6f82",
                border: "1px solid rgba(14,116,144,0.12)",
                fontWeight: 950,
              }}
            >
              ←
            </a>
            <Pill tone="gold">SPM-curated / local operator-led</Pill>
          </div>

          <div style={{ marginTop: 18 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#0b8f9f",
              }}
            >
              Passport Trails™ Builder
            </div>
            <h1 style={{ margin: "6px 0 0", fontSize: 30, lineHeight: 0.98, letterSpacing: "-0.05em", fontWeight: 950 }}>
              Build Your Own Passport Trail
            </h1>
            <p style={{ margin: "9px 0 0", color: "#0f766e", fontSize: 14.4, lineHeight: 1.25, fontWeight: 950 }}>
              Start from a proven Siargao route. Customize it your way. SPM prepares it for approved local operator fulfillment.
            </p>
          </div>

          <div style={{ marginTop: 13, display: "flex", flexWrap: "wrap", gap: 6 }}>
            <Pill tone="green">Payment gateway ready</Pill>
            <Pill tone="aqua">Operator alerts supported</Pill>
            <Pill tone="slate">Assignment after confirmation</Pill>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Action href="#templates" priority="dominant">
              Route Templates
            </Action>
            <Action href="#request" tone="soft" priority="dominant">
              Request Review
            </Action>
          </div>
        </header>

        <section id="templates" aria-label="Curated SPM tour templates" style={{ marginTop: 15 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 9.8, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0b8f9f" }}>
                Choose your Siargao day
              </div>
              <h2 style={{ margin: "4px 0 0", fontSize: 21, lineHeight: 1.04, fontWeight: 950, letterSpacing: "-0.035em" }}>
                Not sure where to go? Start here.
              </h2>
              <p style={{ margin: "6px 0 0", fontSize: 11.2, lineHeight: 1.35, color: "rgba(15,23,42,0.58)", fontWeight: 720 }}>
                Pick the kind of day you want. SPM turns it into a route travelers can actually understand and operators can fulfill.
              </p>
            </div>
            <Pill tone="aqua">{templates.length} packages</Pill>
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {templates.map((template) => {
              const selected = template.id === selectedTemplate.id;
              const [bg, accent] = categoryTone(template.category);

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => selectTemplate(template)}
                  style={{
                    textAlign: "left",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 26,
                    border: selected ? `2px solid ${accent}` : "1px solid rgba(14,116,144,0.10)",
                    background: selected
                      ? `radial-gradient(circle at 12% 0%, ${accent}30, transparent 34%), linear-gradient(135deg, ${bg}, rgba(255,255,255,0.98))`
                      : "rgba(255,255,255,0.88)",
                    boxShadow: selected ? `0 18px 42px ${accent}24` : "0 10px 26px rgba(15,23,42,0.055)",
                    padding: 13,
                    cursor: "pointer",
                    transform: selected ? "translateY(-1px)" : "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {selected ? (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        right: 10,
                        top: 10,
                        height: 28,
                        minWidth: 28,
                        padding: "0 8px",
                        borderRadius: 999,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                        background: accent,
                        color: "#ffffff",
                        boxShadow: `0 10px 22px ${accent}33`,
                        fontSize: 10.2,
                        fontWeight: 950,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      ✓ Selected
                    </div>
                  ) : null}

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, paddingRight: selected ? 88 : 0 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 7 }}>
                        <Pill tone={selected ? "green" : "slate"}>{template.label}</Pill>
                        <Pill tone="gold">{template.startingPriceLabel}</Pill>
                      </div>
                      <h3 style={{ margin: 0, fontSize: 16.2, lineHeight: 1.1, letterSpacing: "-0.025em", color: "#10234a", fontWeight: 950 }}>
                        {template.name}
                      </h3>
                      <p style={{ margin: "6px 0 0", fontSize: 11.3, lineHeight: 1.38, color: "rgba(15,23,42,0.62)", fontWeight: 730 }}>
                        {template.promise}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 999,
                        display: "grid",
                        placeItems: "center",
                        background: selected ? accent : "rgba(15,23,42,0.045)",
                        color: selected ? "#ffffff" : accent,
                        border: selected ? "1px solid rgba(255,255,255,0.55)" : "1px solid rgba(15,23,42,0.06)",
                        fontSize: 14,
                        fontWeight: 950,
                        flex: "0 0 auto",
                      }}
                    >
                      {selected ? "✓" : "→"}
                    </span>
                  </div>

                  <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                    <div style={{ borderRadius: 16, background: "rgba(255,255,255,0.62)", border: "1px solid rgba(15,23,42,0.055)", padding: "8px 9px" }}>
                      <div style={{ fontSize: 9.2, color: "#64748b", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}>Duration</div>
                      <div style={{ marginTop: 2, fontSize: 11.2, fontWeight: 900, color: "#10234a" }}>{template.durationLabel}</div>
                    </div>
                    <div style={{ borderRadius: 16, background: "rgba(255,255,255,0.62)", border: "1px solid rgba(15,23,42,0.055)", padding: "8px 9px" }}>
                      <div style={{ fontSize: 9.2, color: "#64748b", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}>Mode</div>
                      <div style={{ marginTop: 2, fontSize: 11.2, fontWeight: 900, color: "#10234a" }}>{template.commercialMode}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 9, display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {template.routeHighlights.slice(0, 4).map((highlight) => (
                      <Pill key={highlight} tone="aqua">{highlight}</Pill>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section
          aria-label="Selected route customization"
          style={{
            marginTop: 15,
            borderRadius: 28,
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(14,116,144,0.10)",
            boxShadow: "0 12px 30px rgba(15,23,42,0.055)",
            padding: 14,
          }}
        >
          <div style={{ fontSize: 9.8, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0b8f9f" }}>
            Selected DIY tour
          </div>
          <div
            style={{
              marginTop: 6,
              borderRadius: 20,
              background: "linear-gradient(135deg, rgba(20,184,166,0.13), rgba(255,255,255,0.88))",
              border: "1px solid rgba(20,184,166,0.20)",
              padding: "10px 11px",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background: "#0f766e",
                color: "#ffffff",
                fontSize: 13,
                fontWeight: 950,
                flex: "0 0 auto",
              }}
            >
              ✓
            </span>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ margin: 0, fontSize: 18.5, lineHeight: 1.05, letterSpacing: "-0.035em", fontWeight: 950 }}>
                {selectedTemplate.name}
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 10.8, lineHeight: 1.35, color: "rgba(15,23,42,0.58)", fontWeight: 720 }}>
                {selectedTemplate.label} • {selectedTemplate.startingPriceLabel} • {selectedTemplate.confirmationStatus}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 11, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <label style={{ display: "grid", gap: 5 }}>
              <span style={{ fontSize: 9.4, fontWeight: 950, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b" }}>Pax</span>
              <select
                value={paxCount}
                onChange={(event) => setPaxCount(Number(event.target.value))}
                style={{
                  minHeight: 38,
                  borderRadius: 15,
                  border: "1px solid rgba(14,116,144,0.16)",
                  background: "#ffffff",
                  color: "#10234a",
                  padding: "0 10px",
                  fontSize: 12,
                  fontWeight: 850,
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n} pax</option>
                ))}
              </select>
            </label>

            <label style={{ display: "grid", gap: 5 }}>
              <span style={{ fontSize: 9.4, fontWeight: 950, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b" }}>Pace</span>
              <select
                value={pace}
                onChange={(event) => setPace(event.target.value)}
                style={{
                  minHeight: 38,
                  borderRadius: 15,
                  border: "1px solid rgba(14,116,144,0.16)",
                  background: "#ffffff",
                  color: "#10234a",
                  padding: "0 10px",
                  fontSize: 12,
                  fontWeight: 850,
                }}
              >
                <option>Relaxed</option>
                <option>Balanced</option>
                <option>Packed</option>
              </select>
            </label>
          </div>

          <label style={{ marginTop: 9, display: "grid", gap: 5 }}>
            <span style={{ fontSize: 9.4, fontWeight: 950, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b" }}>Support preference</span>
            <select
              value={supportLevel}
              onChange={(event) => setSupportLevel(event.target.value)}
              style={{
                minHeight: 38,
                borderRadius: 15,
                border: "1px solid rgba(14,116,144,0.16)",
                background: "#ffffff",
                color: "#10234a",
                padding: "0 10px",
                fontSize: 12,
                fontWeight: 850,
              }}
            >
              <option>Joiner where available</option>
              <option>Private / operator-supported</option>
              <option>Premium private</option>
              <option>Driver-supported route</option>
              <option>Boat-required route</option>
            </select>
          </label>
        </section>

        <section aria-label="Route stops" style={{ marginTop: 15 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 9.8, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0b8f9f" }}>
                Customize safely
              </div>
              <h2 style={{ margin: "4px 0 0", fontSize: 21, lineHeight: 1.04, fontWeight: 950, letterSpacing: "-0.035em" }}>
                Keep the core stops. Adjust the rest.
              </h2>
              <p style={{ margin: "6px 0 0", fontSize: 11.2, lineHeight: 1.35, color: "rgba(15,23,42,0.58)", fontWeight: 720 }}>
                Core stops keep the route coherent. Optional stops let you match the day to your pace, weather, and support needs.
              </p>
            </div>
            <Pill tone="green">{selectedStops.length} selected</Pill>
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 9 }}>
            {selectedTemplate.stops.map((stop) => {
              const selected = selectedStopIds.includes(stop.id);
              const insightOpen = activeStopInsightId === stop.id;
              const insight = getStopInsight(stop, selectedTemplate);

              return (
                <article
                  key={stop.id}
                  onClick={() => toggleStop(stop.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleStop(stop.id);
                    }
                  }}
                  style={{
                    borderRadius: 24,
                    border: selected ? "2px solid rgba(15,118,110,0.72)" : "1px solid rgba(14,116,144,0.12)",
                    background: selected
                      ? "linear-gradient(135deg, rgba(236,253,245,0.99), rgba(255,255,255,0.98))"
                      : "rgba(255,255,255,0.88)",
                    boxShadow: selected ? "0 16px 34px rgba(15,118,110,0.14)" : "0 10px 26px rgba(15,23,42,0.055)",
                    padding: 12,
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div
                      aria-hidden="true"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 15,
                        display: "grid",
                        placeItems: "center",
                        background: "linear-gradient(135deg, #e6fbfb, #f4fffe)",
                        color: "#0b8f9f",
                        fontSize: 15,
                        fontWeight: 950,
                        flex: "0 0 auto",
                      }}
                    >
                      ◇
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ minWidth: 0 }}>
                          <h3 style={{ margin: 0, fontSize: 14.4, lineHeight: 1.12, fontWeight: 950, color: "#10234a" }}>{stop.title}</h3>
                          <p style={{ margin: "3px 0 0", fontSize: 10.7, color: "rgba(15,23,42,0.55)", fontWeight: 760 }}>
                            {stop.tag} • {stop.area}
                          </p>
                        </div>
                        <Pill tone={selected ? "green" : "slate"}>{selected ? "✓ Selected" : "Tap to add"}</Pill>
                      </div>

                      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 5 }}>
                        <Pill tone={stop.requiredByDefault ? "dark" : "slate"}>{stop.requiredByDefault ? "Core stop" : "Optional"}</Pill>
                        <Pill tone={stop.supportFlag.includes("Boat") ? "gold" : "aqua"}>{stop.supportFlag}</Pill>
                      </div>

                      <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                        <Action
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleStop(stop.id);
                          }}
                          selected={selected}
                          tone={selected ? "soft" : "primary"}
                        >
                          {selected ? "Remove stop" : "Add stop"}
                        </Action>
                        <Action
                          onClick={(event) => {
                            event.stopPropagation();
                            setActiveStopInsightId((current) => (current === stop.id ? null : stop.id));
                          }}
                          tone="soft"
                        >
                          Why this stop?
                        </Action>
                      </div>

                      {insightOpen ? (
                        <div
                          onClick={(event) => event.stopPropagation()}
                          style={{
                            marginTop: 10,
                            borderRadius: 18,
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(240,253,250,0.90))",
                            border: "1px solid rgba(20,184,166,0.16)",
                            padding: "10px 11px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 9.4,
                              fontWeight: 950,
                              letterSpacing: "0.11em",
                              textTransform: "uppercase",
                              color: "#0f766e",
                            }}
                          >
                            Why this stop belongs
                          </div>

                          <div style={{ marginTop: 8, display: "grid", gap: 7 }}>
                            {[
                              ["Route role", insight.routeRole],
                              ["Fulfillment", insight.fulfillment],
                              ["Payment impact", insight.paymentImpact],
                            ].map(([label, value]) => (
                              <div
                                key={label}
                                style={{
                                  borderRadius: 14,
                                  background: "rgba(255,255,255,0.68)",
                                  border: "1px solid rgba(14,116,144,0.08)",
                                  padding: "8px 9px",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 9.2,
                                    color: "#64748b",
                                    fontWeight: 900,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.09em",
                                  }}
                                >
                                  {label}
                                </div>
                                <p
                                  style={{
                                    margin: "3px 0 0",
                                    fontSize: 10.8,
                                    lineHeight: 1.36,
                                    color: "rgba(15,23,42,0.66)",
                                    fontWeight: 720,
                                  }}
                                >
                                  {value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="request"
          aria-label="Trail request preparation"
          style={{
            marginTop: 16,
            borderRadius: 28,
            background:
              "radial-gradient(circle at 16% 0%, rgba(20,184,166,0.10), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.94), rgba(239,250,250,0.96))",
            color: "#10234a",
            border: "1px solid rgba(14,116,144,0.11)",
            boxShadow: "0 14px 34px rgba(15,23,42,0.065)",
            padding: 14,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 9.6, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0b8f9f" }}>
                Trail request preparation
              </div>
              <h2 style={{ margin: "5px 0 0", fontSize: 19, lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 950 }}>
                {selectedTemplate.name} is almost ready for review
              </h2>
              <p style={{ margin: "7px 0 0", fontSize: 11.4, lineHeight: 1.42, color: "rgba(15,23,42,0.62)", fontWeight: 720 }}>
                You selected <strong>{selectedTemplate.name}</strong>. SPM will structure this route for local operator fulfillment. Final timing, price, pickup, and operator assignment happen after confirmation.
              </p>
            </div>
            <Pill tone={selectedStops.length ? "green" : "slate"}>{selectedStops.length ? `${selectedStops.length} selected` : "Empty"}</Pill>
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 7 }}>
            {[
              ["Selected tour", selectedTemplate.name],
              ["Route", "SPM-curated"],
              ["Fulfillment", selectedTemplate.fulfillmentMode],
              ["Payment", selectedTemplate.paymentStatus],
              ["Operator alert", selectedTemplate.operatorStatus],
              ["Confirmation", selectedTemplate.confirmationStatus],
              ["QR / stamp", "Reviewed after route confirmation"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  alignItems: "center",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.68)",
                  border: "1px solid rgba(14,116,144,0.08)",
                  padding: "8px 10px",
                }}
              >
                <span style={{ fontSize: 10.4, fontWeight: 850, color: "rgba(15,23,42,0.55)" }}>{label}</span>
                <span style={{ fontSize: 10.6, fontWeight: 950, color: "#10234a", textAlign: "right" }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 11, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {selectedTemplate.cautionFlags.map((flag) => (
              <Pill key={flag} tone="gold">{flag}</Pill>
            ))}
          </div>

          {savedNotice ? (
            <div
              style={{
                marginTop: 10,
                borderRadius: 16,
                background: "rgba(20,184,166,0.10)",
                border: "1px solid rgba(20,184,166,0.18)",
                padding: "8px 10px",
                color: "#0f766e",
                fontSize: 11,
                fontWeight: 850,
              }}
            >
              {savedNotice}
            </div>
          ) : null}

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 10, alignItems: "center" }}>
            <Action href="/traveler/passport-trails/diy-trail-builder/summary" onClick={saveLocalDraft} tone="dark" priority="dominant" disabled={!selectedStops.length}>
              Review Route
            </Action>
            <Action onClick={saveLocalDraft} tone="soft" priority="dominant" disabled={!selectedStops.length}>
              Save Route
            </Action>
          </div>

          <p style={{ margin: "10px 0 0", fontSize: 10.5, lineHeight: 1.36, color: "rgba(15,23,42,0.48)", fontWeight: 650 }}>
            Some routes depend on tide, weather, pickup area, operator availability, and boat coordination. Prepare early so the route can be reviewed properly.
          </p>
        </section>

        <section
          aria-label="Sticky actions"
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
            padding: "9px 12px 13px",
            background: "linear-gradient(180deg, rgba(248,250,252,0), rgba(248,250,252,0.98) 28%, rgba(248,250,252,1))",
          }}
        >
          <div style={{ maxWidth: 470, margin: "0 auto", display: "grid", gridTemplateColumns: "1.45fr 0.8fr 0.7fr", gap: 8 }}>
            <Action href="/traveler/passport-trails/diy-trail-builder/summary" onClick={saveLocalDraft} tone="dark" priority="dominant">
              Review Route
            </Action>
            <Action href="#request" tone="soft">
              Save
            </Action>
            <Action href="/traveler/passport-map" tone="optional" priority="compact">
              Optional Map
            </Action>
          </div>
        </section>
      </div>

      <div aria-hidden="true" style={{ height: 118 }} />
      <PassportMapShortcut
        compact
        title="Optional map check"
        body="Use the map only if you need location context. The main next step is Review Route."
      />
      <SpmTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
