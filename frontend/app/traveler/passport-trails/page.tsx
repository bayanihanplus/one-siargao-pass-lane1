import type { ReactNode } from "react";
import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";
import { getTravelerLanguageRuntime, tr } from "../../../src/lib/traveler-language-runtime";

const OSP = {
  navy: "#013863",
  deepNavy: "#003B66",
  teal: "#0596A5",
  tealDark: "#047D8A",
  gold: "#F3AE26",
  goldSoft: "#FFF7E7",
  cream: "#FFFBF3",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  pale: "#F7FCFD",
  slate: "#50668B",
  ink: "#102F57",
  line: "rgba(5,150,165,0.18)",
  softLine: "rgba(1,56,99,0.10)",
};

type OfficialTrailFilterKey = "all" | "bookable" | "confirm" | "explore" | "saved";
type TravelerDictionary = Record<string, string>;

const OFFICIAL_TRAIL_FILTERS: Array<{ key: OfficialTrailFilterKey; label: string; dictionaryKey: string }> = [
  { key: "all", label: "All", dictionaryKey: "passportTrails.filters.all" },
  { key: "explore", label: "Explore", dictionaryKey: "passportTrails.filters.explore" },
  { key: "bookable", label: "Bookable", dictionaryKey: "passportTrails.filters.bookable" },
  { key: "confirm", label: "Needs Confirm", dictionaryKey: "passportTrails.filters.confirm" },
  { key: "saved", label: "Saved", dictionaryKey: "passportTrails.filters.saved" },
];

function getTrailFilterKey(trail: { badge?: string; status?: string; eyebrow?: string; title?: string }): OfficialTrailFilterKey {
  const haystack = `${trail.badge ?? ""} ${trail.status ?? ""} ${trail.eyebrow ?? ""} ${trail.title ?? ""}`.toLowerCase();

  if (haystack.includes("booking") || haystack.includes("book trail") || haystack.includes("bookable") || haystack.includes("book")) {
    return "bookable";
  }

  if (haystack.includes("confirm") || haystack.includes("request") || haystack.includes("route check") || haystack.includes("activation")) {
    return "confirm";
  }

  if (haystack.includes("continuity") || haystack.includes("saved") || haystack.includes("continue")) {
    return "saved";
  }

  return "explore";
}


const officialTrails = [
  {
    hierarchy: "Island Hopping",
    title: "Tri-Island Passport Trail",
    imageUrl: "/osp/spm/passport-trails/choose-official-trail/tri-island-passport-trail.png",
    description: "Classic island route.",
    href: "/traveler/passport-trails/island-hopping",
    icon: "",
    badge: "GL Port",
    behavior: "One-day tour",
    support: "Port route",
    source: "SPM Operator / OTA",
    pricing: "Bookable",
    features: ["GL Port", "Boat route", "Weather aware"],
    tone: "#047f91",
    shell: "linear-gradient(145deg, #ffffff 0%, #eafbfa 58%, #fff8e8 100%)",
  },
  {
    hierarchy: "Island Hopping",
    title: "Sugba Lagoon Island Hopping",
    imageUrl: "/osp/spm/passport-trails/choose-official-trail/sugba-lagoon-island-hopping.png",
    description: "Lagoon route.",
    href: "/traveler/passport-trails/sugba-lagoon",
    icon: "",
    badge: "Request first",
    behavior: "One-day route",
    support: "Governed route",
    source: "SPM Operator / OTA",
    pricing: "Booking/payment governed",
    features: ["Del Carmen", "Support", "Access"],
    tone: "#013863",
    shell: "linear-gradient(145deg, #ffffff 0%, #eefbff 58%, #eafbfa 100%)",
  },
  {
    hierarchy: "Future Governed",
    title: "Bucas Grande / Sohoton Official Trail",
    imageUrl: "/osp/spm/passport-trails/choose-official-trail/bucas-grande-sohoton-cave.png",
    description: "Sohoton route.",
    href: "/traveler/passport-trails/bucas-grande-sohoton",
    icon: "",
    badge: "Future-ready",
    behavior: "One-day route",
    support: "Dapa support",
    source: "SPM Operator / OTA",
    pricing: "Future governed pricing",
    features: ["Sohoton", "Dapa", "Support"],
    tone: "#64748b",
    shell: "linear-gradient(145deg, #ffffff 0%, #f8fafc 58%, #eef2f7 100%)",
  },
  {
    hierarchy: "Land Tour",
    title: "Siargao Land Tour Passport Trail",
    imageUrl: "/osp/spm/passport-trails/choose-official-trail/siargao-land-tour-passport-trail.png",
    description: "Land route.",
    href: "/traveler/passport-trails/siargao-land-tour",
    icon: "",
    badge: "Guide + TukTuk",
    behavior: "South/North one-day",
    support: "Local operator guided",
    source: "SPM Operator / OTA",
    pricing: "Guide/transport pricing",
    features: ["Guide", "TukTuk", "Drone option"],
    tone: "#047f91",
    shell: "linear-gradient(145deg, #ffffff 0%, #f4fcfa 58%, #fff8e8 100%)",
  },
  {
    hierarchy: "Surf Trail",
    title: "Explorer Surf Trail",
    imageUrl: "/osp/spm/passport-trails/choose-official-trail/explorer-surf-trail.png",
    description: "Surf route.",
    href: "/traveler/passport-trails/surf-explorer",
    icon: "",
    badge: "Continue later",
    behavior: "Multi-session",
    support: "Surf optional",
    source: "SPM Operator",
    pricing: "Lesson/support optional",
    features: ["Beginner", "Saved", "Surf"],
    tone: "#0596A5",
    shell: "linear-gradient(145deg, #ffffff 0%, #eefbff 58%, #ffffff 100%)",
  },
  {
    hierarchy: "Community",
    title: "Culture & Community Trail",
    imageUrl: "/osp/spm/passport-trails/choose-official-trail/culture-community-trail.png",
    description: "Local route.",
    href: "/traveler/passport-trails/culture-community",
    icon: "",
    badge: "Local",
    behavior: "One-day flexible",
    support: "SPM-guided",
    source: "SPM Partner",
    pricing: "Free/paid stops mixed",
    features: ["Community stops", "Local stories", "Makers and markets"],
    tone: "#8A5A00",
    shell: "linear-gradient(145deg, #ffffff 0%, #fff8e8 58%, #f4fcfa 100%)",
  },
  {
    hierarchy: "Merchant Trail",
    title: "Food & Wellness Trail",
    imageUrl: "/osp/spm/passport-trails/choose-official-trail/food-wellness-trail.png",
    description: "Local route.",
    href: "/traveler/passport-trails/food-wellness",
    icon: "",
    badge: "Merchant-led",
    behavior: "Flexible",
    support: "Restaurant/wellness operated",
    source: "SPM Merchant",
    pricing: "Merchant payment logic",
    features: ["Restaurants", "Cafés", "Spa / wellness / recovery"],
    tone: "#9A5F0C",
    shell: "linear-gradient(145deg, #ffffff 0%, #fff8e8 58%, #ffffff 100%)",
  },
  {
    hierarchy: "Continuity",
    title: "Return Traveler Continuity",
    imageUrl: "/osp/spm/passport-trails/choose-official-trail/return-traveler-continuity.png",
    description: "Saved route.",
    href: "/traveler/passport-trails/return-traveler-continuity",
    icon: "",
    badge: "Across trips",
    behavior: "No fixed duration",
    support: "Saved layer",
    source: "Traveler account",
    pricing: "No direct tour price",
    features: ["Saved trails", "Open", "Return"],
    tone: "#013863",
    shell: "linear-gradient(145deg, #ffffff 0%, #eefbff 58%, #ffffff 100%)",
  },
];

function safeDecode(value?: string) {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}


function IslandHoppingRequestStartedPanel({
  serviceId,
  requestId,
  paxCount,
  requestedDate,
  paymentIntentId,
}: {
  serviceId?: string;
  requestId?: string;
  paxCount?: string;
  requestedDate?: string;
  paymentIntentId?: string;
}) {
  const normalizedServiceId = safeDecode(serviceId);
  const cleanRequestId = safeDecode(requestId) || "Request started";
  const paxLabel = paxCount ? `${paxCount} traveler${paxCount === "1" ? "" : "s"}` : "Traveler details pending";
  const dateLabel = safeDecode(requestedDate) || "Travel date to be confirmed";
  const cleanPaymentIntentId = safeDecode(paymentIntentId);

  const serviceTitle =
    normalizedServiceId.includes("tri-island-joiner") || normalizedServiceId.includes("island-hopping")
      ? "Siargao Partner Tour — Tri-Island Joiner"
      : "Siargao Partner Tour";

  const continueHref = cleanPaymentIntentId
    ? `/traveler/payments/${encodeURIComponent(cleanPaymentIntentId)}`
    : `/traveler/passport-trails?intent=island-hopping-request&serviceId=${encodeURIComponent(
        normalizedServiceId || "spm-package:tri-island-joiner"
      )}&requestId=${encodeURIComponent(cleanRequestId)}`;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${OSP.mist} 0%, #FFFFFF 54%, ${OSP.pale} 100%)`,
        padding: "14px 14px 110px",
        boxSizing: "border-box",
        fontFamily: 'Arial, "Helvetica Neue", sans-serif',
        color: OSP.ink,
      }}
    >
      <style>{`
        .osp-passport-trails-next-step-hidden {
          display: none !important;
        }
      `}</style>

      <section
        aria-label="Island Hopping request started"
        style={{ width: "100%", maxWidth: 430, margin: "0 auto", display: "grid", gap: 12 }}
      >
        <div
          style={{
            borderRadius: 30,
            background: `linear-gradient(145deg, ${OSP.deepNavy} 0%, ${OSP.navy} 52%, ${OSP.tealDark} 100%)`,
            color: "#ffffff",
            WebkitTextFillColor: "#ffffff",
            boxShadow: "0 22px 56px rgba(1,56,99,0.22)",
            border: "1px solid rgba(255,255,255,0.22)",
            padding: 16,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: OSP.gold, WebkitTextFillColor: OSP.gold }}>
            Request Started
          </div>

          <h1 style={{ margin: "10px 0 0", fontSize: 30, lineHeight: 0.96, letterSpacing: "-0.07em", fontWeight: 950, color: "#ffffff", WebkitTextFillColor: "#ffffff" }}>
            Your Island Hopping request is open.
          </h1>

          <p style={{ margin: "10px 0 0", fontSize: 13, lineHeight: 1.45, fontWeight: 720, color: "rgba(255,255,255,0.9)", WebkitTextFillColor: "rgba(255,255,255,0.9)" }}>
            Complete the next step so OSP can connect your request to your Pass, QR identity, booking record, and trip readiness.
          </p>
        </div>

        <div
          style={{
            borderRadius: 26,
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            padding: 13,
            boxShadow: "0 18px 44px rgba(1,56,99,0.11)",
          }}
        >
          <div style={{ fontSize: 9.5, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: OSP.teal }}>
            Selected experience
          </div>

          <h2 style={{ margin: "5px 0 0", fontSize: 20, lineHeight: 1.04, fontWeight: 950, color: OSP.ink }}>
            {serviceTitle}
          </h2>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              ["Travelers", paxLabel],
              ["Date", dateLabel],
            ].map(([label, value]) => (
              <div key={label} style={{ borderRadius: 18, background: OSP.pale, border: `1px solid ${OSP.line}`, padding: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 950, letterSpacing: "0.11em", textTransform: "uppercase", color: OSP.teal }}>{label}</div>
                <div style={{ marginTop: 4, fontSize: 12.5, fontWeight: 900, color: OSP.ink }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        <a
          href={continueHref}
          style={{
            minHeight: 54,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${OSP.deepNavy} 0%, ${OSP.teal} 100%)`,
            color: "#ffffff",
            WebkitTextFillColor: "#ffffff",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 950,
            boxShadow: "0 18px 38px rgba(1,56,99,0.24)",
          }}
        >
          Continue to Next Step
        </a>
      </section>
    </main>
  );
}

function AppHeader({ dictionary }: { dictionary: TravelerDictionary }) {
  return (
    <header
      aria-label={tr(dictionary, "passportTrails.header.aria", "Passport Trails compact premium hero")}
      style={{
        marginTop: 12,
        borderRadius: 28,
        padding: 13,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(145deg, #FFFFFF 0%, #F4FCFA 62%, #FFFFFF 100%)",
        color: OSP.navy,
        border: "1px solid rgba(5,150,165,0.14)",
        boxShadow: "0 18px 42px rgba(1,56,99,0.11)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -78,
          right: -88,
          width: 178,
          height: 178,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(243,174,38,0.18) 0%, rgba(243,174,38,0) 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -98,
          left: -88,
          width: 190,
          height: 190,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(5,150,165,0.12) 0%, rgba(5,150,165,0) 72%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              borderRadius: 999,
              padding: "6px 9px",
              background: "transparent",
              color: "#FFFFFF",
              fontSize: 9,
              fontWeight: 920,
              letterSpacing: "0.115em",
              textTransform: "uppercase",
              boxShadow: "0 9px 20px rgba(1,56,99,0.15)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: OSP.gold,
                boxShadow: "0 0 0 4px rgba(243,174,38,0.16)",
              }}
            />
            {tr(dictionary, "passportTrails.header.title", "Passport Trails")}
          </div>

          <a
            href="/traveler/passport-map"
            aria-label={tr(dictionary, "passportTrails.actions.openMapAria", "Open Passport Map")}
            style={{
              minHeight: 34,
              borderRadius: 999,
              padding: "0 11px",
              background: "#FFFFFF",
              color: OSP.navy,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10.6,
              fontWeight: 920,
              border: "1px solid rgba(1,56,99,0.10)",
              boxShadow: "0 9px 20px rgba(1,56,99,0.09)",
              whiteSpace: "nowrap",
            }}
          >{tr(dictionary, "passportTrails.actions.map", "Map")}
          </a>
        </div>

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 12,
            alignItems: "end",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                maxWidth: 245,
                color: OSP.navy,
                fontSize: 25,
                lineHeight: 1.02,
                letterSpacing: "-0.052em",
                fontWeight: 840,
              }}
            >
              {tr(dictionary, "passportTrails.hero.title", "Choose your trail.")}
            </h1>

            <p
              style={{
                margin: "6px 0 0",
                maxWidth: 245,
                color: OSP.slate,
                fontSize: 11.4,
                lineHeight: 1.24,
                fontWeight: 700,
              }}
            >
              {tr(dictionary, "passportTrails.hero.body", "Routes, stops, and progress in one view.")}
            </p>
          </div>

          <div
            aria-label="Passport Trail readiness"
            style={{
              width: 76,
              borderRadius: 18,
              padding: "9px 8px",
              background: "#FFFFFF",
              border: "1px solid rgba(5,150,165,0.14)",
              boxShadow: "0 10px 22px rgba(1,56,99,0.07)",
            }}
          >
            <div style={{ color: OSP.navy, fontSize: 15, lineHeight: 1, fontWeight: 920 }}>8</div>
            <div style={{ marginTop: 4, color: OSP.slate, fontSize: 9.2, lineHeight: 1.05, fontWeight: 800 }}>
              {tr(dictionary, "passportTrails.count.trailsCapital", "Trails")}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          <a
            href="#official-trails"
            aria-label={tr(dictionary, "passportTrails.actions.viewTrailsAria", "View official Passport Trails")}
            style={{
              minHeight: 44,
              borderRadius: 16,
              background: "transparent",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 12.7,
              fontWeight: 900,
              boxShadow: "0 13px 28px rgba(1,56,99,0.17)",
            }}
          >
            {tr(dictionary, "passportTrails.actions.viewTrails", "View trails")}
          </a>

          <a
            href="/traveler/passport-trails/diy-trail-builder"
            aria-label={tr(dictionary, "passportTrails.actions.buildCustomAria", "Build a custom Passport Trail")}
            style={{
              minHeight: 44,
              borderRadius: 16,
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.12)",
              color: OSP.navy,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 12.3,
              fontWeight: 880,
              boxShadow: "0 9px 20px rgba(1,56,99,0.065)",
            }}
          >
            {tr(dictionary, "passportTrails.actions.buildRoute", "Build route")}
          </a>
        </div>

        <div
          aria-label="Passport Trail quick actions"
          style={{
            marginTop: 9,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          <a
            href="/traveler/passport-map"
            aria-label={tr(dictionary, "passportTrails.actions.openMapAria", "Open Passport Map")}
            style={{
              minHeight: 40,
              borderRadius: 15,
              background: OSP.mist,
              color: OSP.navy,
              textDecoration: "none",
              border: "1px solid rgba(5,150,165,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: 11.2,
              fontWeight: 840,
            }}
          >
            {tr(dictionary, "passportTrails.actions.map", "Map")}
          </a>

          <a
            href="/traveler/settings?panel=assistant&topic=passport-trails"
            aria-label={tr(dictionary, "passportTrails.actions.askKuyaTalaAria", "Ask Kuya Tala about Passport Trails")}
            style={{
              minHeight: 40,
              borderRadius: 15,
              background: OSP.goldSoft,
              color: OSP.navy,
              textDecoration: "none",
              border: "1px solid rgba(243,174,38,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: 11.2,
              fontWeight: 840,
            }}
          >
            {tr(dictionary, "passportTrails.actions.kuyaTala", "Kuya Tala")}
          </a>
        </div>
      </div>
    </header>
  );
}







function AppButton({
  href,
  children,
  variant = "navy",
}: {
  href: string;
  children: ReactNode;
  variant?: "navy" | "soft";
}) {
  const dynamicStyle =
    variant === "soft"
      ? {
          background: "#FFFFFF",
          color: OSP.deepNavy,
          WebkitTextFillColor: OSP.deepNavy,
          border: `1px solid ${OSP.line}`,
          boxShadow: "0 10px 22px rgba(1,56,99,0.07)",
        }
      : {
          background: `linear-gradient(135deg, ${OSP.deepNavy} 0%, ${OSP.teal} 100%)`,
          color: "#FFFFFF",
          WebkitTextFillColor: "#FFFFFF",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 14px 30px rgba(1,56,99,0.20)",
        };

  return (
    <a
      href={href}
      style={{
        minHeight: 48,
        borderRadius: 17,
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 13px",
        fontSize: 12.2,
        lineHeight: 1.1,
        fontWeight: 950,
        boxSizing: "border-box",
        ...dynamicStyle,
      }}
    >
      {children}
    </a>
  );
}



function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        color: OSP.tealDark,
        fontSize: 10,
        lineHeight: 1,
        fontWeight: 950,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}


function getTrailReadiness(trail: (typeof officialTrails)[number]) {
  if (trail.href.includes("island-hopping")) {
    return {
      state: "Bookable",
      detail: "Bookable route.",
      tone: "#047f91",
      bg: "rgba(5,150,165,0.10)",
      border: "rgba(5,150,165,0.18)",
    };
  }

  if (trail.href.includes("sugba-lagoon")) {
    return {
      state: "Request first",
      detail: "Request first.",
      tone: "#013863",
      bg: "rgba(1,56,99,0.08)",
      border: "rgba(1,56,99,0.14)",
    };
  }

  if (trail.href.includes("bucas-grande-sohoton")) {
    return {
      state: "Activation-gated",
      detail: "Request first.",
      tone: "#64748b",
      bg: "rgba(100,116,139,0.10)",
      border: "rgba(100,116,139,0.16)",
    };
  }

  if (trail.href.includes("siargao-land-tour")) {
    return {
      state: "Request confirmation",
      detail: "Guide, transport, pax, and support confirmed first.",
      tone: "#047f91",
      bg: "rgba(5,150,165,0.10)",
      border: "rgba(5,150,165,0.18)",
    };
  }

  if (trail.href.includes("surf-explorer")) {
    return {
      state: "Continue-later",
      detail: "Surf progress can be saved across sessions.",
      tone: "#0596A5",
      bg: "rgba(5,150,165,0.09)",
      border: "rgba(5,150,165,0.14)",
    };
  }

  if (trail.href.includes("culture-community")) {
    return {
      state: "Partner-ready",
      detail: "Community and partner approval required.",
      tone: "#8A5A00",
      bg: "rgba(243,174,38,0.10)",
      border: "rgba(243,174,38,0.18)",
    };
  }

  if (trail.href.includes("food-wellness")) {
    return {
      state: "Merchant rules",
      detail: "Merchant payment and reward logic apply.",
      tone: "#9A5F0C",
      bg: "rgba(243,174,38,0.10)",
      border: "rgba(243,174,38,0.18)",
    };
  }

  return {
    state: "Continuity",
    detail: "Saved for return trips.",
    tone: "#013863",
    bg: "rgba(1,56,99,0.08)",
    border: "rgba(1,56,99,0.14)",
  };
}

function TrailReadinessPill({ trail }: { trail: (typeof officialTrails)[number] }) {
  const readiness = getTrailReadiness(trail);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        borderRadius: 999,
        padding: "6px 8px",
        background: readiness.bg,
        border: `1px solid ${readiness.border}`,
        color: readiness.tone,
        fontSize: 9.4,
        fontWeight: 950,
        letterSpacing: "0.045em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: readiness.tone,
          boxShadow: `0 0 0 3px ${readiness.bg}`,
        }}
      />
      {readiness.state}
    </div>
  );
}

function PassportJourneyStatusStrip() {
  return null;
}





function TrailFilterChips({ activeFilter, dictionary }: { activeFilter: OfficialTrailFilterKey; dictionary: TravelerDictionary }) {
  return (
    <div
      aria-label={tr(dictionary, "passportTrails.filters.aria", "Filter official Passport Trails")}
      role="tablist"
      style={{
        display: "flex",
        gap: 7,
        overflowX: "auto",
        paddingBottom: 2,
        scrollbarWidth: "none",
      }}
    >
      {OFFICIAL_TRAIL_FILTERS.map((filter) => {
        const isActive = activeFilter === filter.key;
        const href = filter.key === "all" ? "/traveler/passport-trails" : `/traveler/passport-trails?trailFilter=${filter.key}`;

        return (
          <a
            key={filter.key}
            href={href}
            role="tab"
            aria-selected={isActive}
            aria-current={isActive ? "page" : undefined}
            style={{
              minHeight: 34,
              borderRadius: 999,
              padding: "0 12px",
              border: isActive ? "1px solid rgba(1,56,99,0.12)" : "1px solid rgba(1,56,99,0.09)",
              background: isActive ? OSP.navy : "#FFFFFF",
              color: isActive ? "#FFFFFF" : OSP.navy,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 10.4,
              fontWeight: 880,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              boxShadow: isActive ? "0 10px 22px rgba(1,56,99,0.16)" : "0 7px 16px rgba(1,56,99,0.055)",
            }}
          >
            {tr(dictionary, filter.dictionaryKey, filter.label)}
          </a>
        );
      })}
    </div>
  );
}

function getPriorityTrailSurface(trail: (typeof officialTrails)[number]) {
  if (trail.href.includes("island-hopping")) {
    return {
      background: "linear-gradient(145deg, #DDFBF6 0%, #BFEFEA 48%, #FFF1C8 100%)",
      border: "1px solid rgba(5,150,165,0.36)",
      shadow: "0 18px 36px rgba(5,150,165,0.18)",
      iconBg: "linear-gradient(145deg, #C5F7EF 0%, #8FE2DE 100%)",
      iconBorder: "1px solid rgba(5,150,165,0.34)",
      accent: "#047f91",
      action: "Book Trail",
    };
  }

  if (trail.href.includes("sugba-lagoon")) {
    return {
      background: "linear-gradient(145deg, #DDF3FF 0%, #CBEFF8 52%, #E8FBFA 100%)",
      border: "1px solid rgba(1,56,99,0.26)",
      shadow: "0 18px 36px rgba(1,56,99,0.15)",
      iconBg: "linear-gradient(145deg, #BFEFFF 0%, #8EDBE8 100%)",
      iconBorder: "1px solid rgba(5,150,165,0.30)",
      accent: "#013863",
      action: "Check Route",
    };
  }

  if (trail.href.includes("bucas-grande-sohoton")) {
    return {
      background: "linear-gradient(145deg, #EEF3FA 0%, #DCE6F0 55%, #F8FAFC 100%)",
      border: "1px solid rgba(100,116,139,0.30)",
      shadow: "0 18px 36px rgba(100,116,139,0.16)",
      iconBg: "linear-gradient(145deg, #E2E8F0 0%, #CBD5E1 100%)",
      iconBorder: "1px solid rgba(100,116,139,0.26)",
      accent: "#4B5F78",
      action: "View Readiness",
    };
  }

  if (trail.href.includes("siargao-land-tour")) {
    return {
      background: "linear-gradient(145deg, #FFF0C8 0%, #FFE4A3 42%, #DDF8F4 100%)",
      border: "1px solid rgba(243,174,38,0.36)",
      shadow: "0 18px 36px rgba(243,174,38,0.18)",
      iconBg: "linear-gradient(145deg, #FFE8A3 0%, #BFEFEA 100%)",
      iconBorder: "1px solid rgba(243,174,38,0.34)",
      accent: "#047f91",
      action: "Request Slot",
    };
  }

  return {
    background: trail.shell,
    border: "1px solid rgba(5,150,165,0.16)",
    shadow: "0 10px 22px rgba(1,56,99,0.06)",
    iconBg: "rgba(255,255,255,0.86)",
    iconBorder: "1px solid rgba(5,150,165,0.12)",
    accent: trail.tone,
    action: "Open",
  };
}





function OfficialTrailCard({
  trail,
  priority = false,
  compact = false,
  dictionary,
}: {
  trail: (typeof officialTrails)[number];
  priority?: boolean;
  compact?: boolean;
  dictionary: TravelerDictionary;
}) {
  const visual = getPriorityTrailSurface(trail);
  const readiness = getTrailReadiness(trail);
  const facts = trail.features.slice(0, compact ? 1 : priority ? 2 : 1);
  const trailImageUrl = "imageUrl" in trail ? trail.imageUrl : undefined;
  const safeState =
    readiness.state.toLowerCase().includes("confirm") || readiness.state.toLowerCase().includes("request")
      ? tr(dictionary, "passportTrails.status.request", "Request")
      : readiness.state.toLowerCase().includes("book")
        ? tr(dictionary, "passportTrails.status.bookable", "Bookable")
        : readiness.state.toLowerCase().includes("continue") || readiness.state.toLowerCase().includes("saved")
          ? tr(dictionary, "passportTrails.status.saved", "Saved")
          : tr(dictionary, "passportTrails.status.explore", "Explore");

  if (compact) {
    return (
      <a
        href={trail.href}
        aria-label={`Open ${trail.title}`}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: 10,
          minHeight: 62,
          textDecoration: "none",
          color: OSP.navy,
          borderRadius: 20,
          padding: "9px 10px",
          background: visual.background,
          backgroundImage: trailImageUrl
            ? `linear-gradient(90deg, rgba(1,56,99,0.08) 0%, rgba(1,56,99,0.12) 52%, rgba(1,56,99,0.18) 100%), url(${trailImageUrl})`
            : undefined,
          backgroundSize: trailImageUrl ? "cover" : undefined,
          backgroundPosition: trailImageUrl ? "center" : undefined,
          border: visual.border,
          boxShadow: "0 10px 24px rgba(1,56,99,0.07)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: -56,
            top: -58,
            width: 104,
            height: 104,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.20)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              minWidth: 0,
            }}
          >
            <span
              style={{
                maxWidth: 88,
                borderRadius: 999,
                padding: "4px 7px",
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(1,56,99,0.08)",
                color: OSP.slate,
                fontSize: 7.9,
                lineHeight: 1,
                fontWeight: 860,
                letterSpacing: "0.065em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                flexShrink: 0,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 5,
                  height: 5,
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: OSP.gold,
                }}
              />
              {trail.badge}
            </span>

            <span
              style={{
                minWidth: 0,
                color: "#FFFFFF",
                WebkitTextFillColor: "#FFFFFF",
                textShadow: "0 2px 14px rgba(0,0,0,0.78)",
                fontSize: 8.2,
                lineHeight: 1,
                fontWeight: 800,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {facts[0] ?? safeState}
            </span>
          </div>

          <h3
            style={{
              margin: "6px 0 0",
              color: "#FFFFFF",
              WebkitTextFillColor: "#FFFFFF",
              textShadow: "0 2px 14px rgba(0,0,0,0.78)",
              fontSize: 14.4,
              lineHeight: 1.02,
              letterSpacing: "-0.034em",
              fontWeight: 850,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {trail.title}
          </h3>

          <p
            style={{
              margin: "4px 0 0",
              color: "rgba(255,255,255,0.96)",
              WebkitTextFillColor: "rgba(255,255,255,0.96)",
              textShadow: "0 2px 10px rgba(0,0,0,0.68)",
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {trail.description}
          </p>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            justifyItems: "end",
            gap: 7,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              borderRadius: 999,
              padding: "4px 7px",
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.09)",
              color: OSP.navy,
              fontSize: 8.1,
              lineHeight: 1,
              fontWeight: 840,
              whiteSpace: "nowrap",
              boxShadow: "0 6px 14px rgba(1,56,99,0.05)",
            }}
          >
            {safeState}
          </span>

          <span
            aria-hidden="true"
            style={{
              width: 25,
              height: 25,
              borderRadius: 10,
              background: "transparent",
              color: "#FFFFFF",
              display: "grid",
              placeItems: "center",
              fontSize: 12.5,
              fontWeight: 900,
              boxShadow: "none",
            }}
          >

          </span>
        </div>
      </a>
    );
  }

  return (
    <a
      href={trail.href}
      aria-label={`Open ${trail.title}`}
      style={{
        display: "block",
        minHeight: priority ? 184 : 82,
        textDecoration: "none",
        color: OSP.navy,
        borderRadius: priority ? 24 : 20,
        padding: priority ? 10 : 10,
        background: visual.background,
        backgroundImage: trailImageUrl
          ? `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(1,56,99,0.16)), url(${trailImageUrl})`
          : undefined,
        backgroundSize: trailImageUrl ? "cover" : undefined,
        backgroundPosition: trailImageUrl ? "center" : undefined,
        border: visual.border,
        boxShadow: visual.shadow,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: priority ? -56 : -62,
          top: priority ? -58 : -66,
          width: priority ? 112 : 104,
          height: priority ? 112 : 104,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.20)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 7 }}>
          <span
            style={{
              minWidth: 0,
              maxWidth: priority ? "70%" : "62%",
              borderRadius: 999,
              padding: "4px 7px",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid rgba(1,56,99,0.08)",
              color: OSP.slate,
              fontSize: 8.2,
              lineHeight: 1,
              fontWeight: 860,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 5,
                height: 5,
                flexShrink: 0,
                borderRadius: "50%",
                background: OSP.gold,
              }}
            />
            {trail.badge}
          </span>

          <span
            style={{
              flexShrink: 0,
              borderRadius: 999,
              padding: "4px 7px",
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.09)",
              color: "#FFFFFF",
              WebkitTextFillColor: "#FFFFFF",
              textShadow: "0 2px 14px rgba(0,0,0,0.78)",
              fontSize: 8.3,
              lineHeight: 1,
              fontWeight: 840,
              whiteSpace: "nowrap",
              boxShadow: "0 6px 14px rgba(1,56,99,0.05)",
            }}
          >
            {safeState}
          </span>
        </div>

        <h3
          style={{
            margin: priority ? "8px 0 0" : "7px 0 0",
            color: "#FFFFFF",
            WebkitTextFillColor: "#FFFFFF",
            textShadow: "0 2px 14px rgba(0,0,0,0.78)",
            fontSize: priority ? 16.2 : 14.8,
            lineHeight: 1.02,
            letterSpacing: "-0.038em",
            fontWeight: 850,
            whiteSpace: priority ? "normal" : "nowrap",
            display: priority ? "-webkit-box" : "block",
            WebkitLineClamp: priority ? 2 : undefined,
            WebkitBoxOrient: priority ? "vertical" : undefined,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {trail.title}
        </h3>

        <p
          style={{
            margin: "5px 0 0",
            color: "rgba(255,255,255,0.96)",
            WebkitTextFillColor: "rgba(255,255,255,0.96)",
            textShadow: "0 2px 10px rgba(0,0,0,0.68)",
            fontSize: priority ? 10.2 : 9.7,
            lineHeight: 1.15,
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {trail.description}
        </p>

        {facts.length > 0 ? (
          <div
            aria-label="Trail highlights"
            style={{
              marginTop: priority ? 8 : 7,
              display: "flex",
              flexWrap: "nowrap",
              gap: 5,
              overflow: "hidden",
            }}
          >
            {facts.map((fact) => (
              <span
                key={fact}
                style={{
                  borderRadius: 999,
                  padding: "4px 6px",
                  background: "rgba(255,255,255,0.68)",
                  border: "1px solid rgba(1,56,99,0.07)",
                  color: OSP.slate,
                  fontSize: 8.1,
                  lineHeight: 1,
                  fontWeight: 780,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: priority ? 82 : 74,
                }}
              >
                {fact}
              </span>
            ))}
          </div>
        ) : null}

        <div
          style={{
            marginTop: priority ? 9 : 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span
            style={{
              color: OSP.navy,
              fontSize: 10.5,
              lineHeight: 1,
              fontWeight: 900,
            }}
          >
            {tr(dictionary, "passportTrails.cards.view", "View")}
          </span>

          <span
            aria-hidden="true"
            style={{
              width: priority ? 27 : 26,
              height: priority ? 27 : 26,
              borderRadius: 11,
              background: "transparent",
              color: "#FFFFFF",
              display: "grid",
              placeItems: "center",
              fontSize: 13,
              fontWeight: 900,
              boxShadow: "none",
            }}
          >

          </span>
        </div>
      </div>
    </a>
  );
}

export default async function PassportTrailsPremiumHubPage({
  searchParams,
}: {
  searchParams?: {
    intent?: string;
    serviceId?: string;
    requestId?: string;
    paxCount?: string;
    requestedDate?: string;
    paymentIntentId?: string;
    trailFilter?: OfficialTrailFilterKey;
  };
}) {
  const requestedFilter = searchParams?.trailFilter;
  const languageRuntime = await getTravelerLanguageRuntime({
    searchParams,
    scope: "traveler",
    allowQueryPreview: true,
  });
  const dictionary = languageRuntime.dictionary;
  const activeFilter: OfficialTrailFilterKey = OFFICIAL_TRAIL_FILTERS.some((filter) => filter.key === requestedFilter)
    ? (requestedFilter as OfficialTrailFilterKey)
    : "all";

  const visibleOfficialTrails =
    activeFilter === "all"
      ? officialTrails
      : officialTrails.filter((trail) => getTrailFilterKey(trail) === activeFilter);

  if (searchParams?.intent === "island-hopping-request") {
    return (
      <IslandHoppingRequestStartedPanel
        serviceId={searchParams?.serviceId}
        requestId={searchParams?.requestId}
        paxCount={searchParams?.paxCount}
        requestedDate={searchParams?.requestedDate}
        paymentIntentId={searchParams?.paymentIntentId}
      />
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at top left, rgba(5,150,165,0.10), transparent 30%), linear-gradient(180deg, ${OSP.mist} 0%, #FFFFFF 48%, ${OSP.pale} 100%)`,
        color: OSP.ink,
        fontFamily: 'Arial, "Helvetica Neue", sans-serif',
        padding: "14px 14px calc(104px + env(safe-area-inset-bottom))",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <AppHeader dictionary={dictionary} />

        <PassportJourneyStatusStrip />

        <section
          id="official-trails"
          aria-label="Official Trails"
          style={{
            marginTop: 14,
            borderRadius: 28,
            padding: 12,
            background:
              "linear-gradient(145deg, rgba(234,251,250,0.94) 0%, rgba(255,255,255,0.99) 58%, rgba(255,248,232,0.84) 100%)",
            border: "1px solid rgba(5,150,165,0.16)",
            boxShadow: "0 16px 38px rgba(1,56,99,0.08)",
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <SectionEyebrow>{tr(dictionary, "passportTrails.sections.officialEyebrow", "Passport Trails")}</SectionEyebrow>
              <span
                style={{
                  borderRadius: 999,
                  padding: "7px 9px",
                  background: OSP.goldSoft,
                  border: "1px solid rgba(243,174,38,0.22)",
                  color: "#8A5B00",
                  fontSize: 9.5,
                  fontWeight: 950,
                  whiteSpace: "nowrap",
                }}
              >
                {officialTrails.length} {tr(dictionary, "passportTrails.count.trails", "trails")}
              </span>
            </div>

            <h2
              style={{
                margin: 0,
                color: OSP.ink,
                fontSize: 21,
                lineHeight: 1.03,
                fontWeight: 730,
                letterSpacing: "-0.055em",
              }}
            >
              {tr(dictionary, "passportTrails.official.title", "Choose your trail.")}
            </h2>

            <p
              style={{
                margin: 0,
                color: "#FFFFFF",
                WebkitTextFillColor: "#FFFFFF",
                textShadow: "0 2px 14px rgba(0,0,0,0.78)",
                fontSize: 12.2,
                lineHeight: 1.38,
                fontWeight: 760,
              }}
            >
              {tr(dictionary, "passportTrails.official.body", "Choose a route. Your pass stays connected.")}
            </p>
          </div>

          <TrailFilterChips activeFilter={activeFilter} dictionary={dictionary} />

          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {visibleOfficialTrails.slice(0, 4).map((trail) => (
              <OfficialTrailCard key={trail.title} trail={trail} dictionary={dictionary} />
            ))}
          </div>

          <div
            style={{
              marginTop: 10,
              display: "grid",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <SectionEyebrow>{tr(dictionary, "passportTrails.sections.discoverSaved", "More trails")}</SectionEyebrow>
              <span
                style={{
                  color: "#FFFFFF",
                  WebkitTextFillColor: "#FFFFFF",
                  textShadow: "0 2px 14px rgba(0,0,0,0.78)",
                  fontSize: 10,
                  fontWeight: 850,
                }}
              >
                {tr(dictionary, "passportTrails.labels.savedFriendly", "")}
              </span>
            </div>

            {visibleOfficialTrails.slice(4).map((trail) => (
              <OfficialTrailCard key={trail.title} trail={trail} compact dictionary={dictionary} />
            ))}
          </div>
        </section>

        
        <section
          aria-label="Passport Trail next-step decision"
          style={{
            marginTop: 16,
            borderRadius: 30,
            padding: 12,
            background: "linear-gradient(145deg, #FFFFFF 0%, #F4FCFA 58%, #FFF8E8 100%)",
            border: "1px solid rgba(5,150,165,0.16)",
            boxShadow: "0 18px 42px rgba(1,56,99,0.10)",
          }}
         data-osp-passport-trails-next-step-hidden="true" className="osp-passport-trails-next-step-hidden">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div>
              <SectionEyebrow>{tr(dictionary, "passportTrails.nextStep.eyebrow", "Next Step")}</SectionEyebrow>
              <h2
                style={{
                  margin: "6px 0 0",
                  color: OSP.navy,
                  fontSize: 23,
                  lineHeight: 1,
                  letterSpacing: "-0.045em",
                  fontWeight: 950,
                }}
              >
                {tr(dictionary, "passportTrails.nextStep.title", "Choose how you want to move.")}
              </h2>
            </div>

            <span
              aria-hidden="true"
              style={{
                width: 44,
                height: 44,
                borderRadius: 18,
                background: "transparent",
                color: OSP.white,
                display: "grid",
                placeItems: "center",
                fontSize: 19,
                boxShadow: "none",
              }}
            >

            </span>
          </div>

          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 9,
            }}
          >
            <a
              href="/traveler/passport-trails/island-hopping"
              aria-label="Start an official Passport Trail"
              style={{
                minHeight: 104,
                borderRadius: 24,
                padding: 12,
                textDecoration: "none",
                background: "transparent",
                backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(1,56,99,0.58)), url(/osp/spm/passport-trails/choose-official-trail/official-trail.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "1px solid rgba(5,150,165,0.18)",
                color: "#FFFFFF",
                boxShadow: "0 12px 28px rgba(1,56,99,0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}></span>
              <span>
                <strong style={{ display: "block", fontSize: 14.8, lineHeight: 1.02, letterSpacing: "-0.03em" }}>
                  {tr(dictionary, "passportTrails.nextStep.official.title", "Official Trail")}
                </strong>
                <span style={{ display: "block", marginTop: 5, color: "rgba(255,255,255,0.88)", fontSize: 10.5, lineHeight: 1.2, fontWeight: 760 }}>
                  {tr(dictionary, "passportTrails.nextStep.official.body", "Book or check route.")}
                </span>
              </span>
            </a>

            <a
              href="/traveler/passport-trails/diy-trail-builder"
              aria-label="Build a custom Passport Trail"
              style={{
                minHeight: 104,
                borderRadius: 24,
                padding: 12,
                textDecoration: "none",
                background: "transparent",
                backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(1,56,99,0.58)), url(/osp/spm/passport-trails/choose-official-trail/custom-route.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "1px solid rgba(243,174,38,0.28)",
                color: "#FFFFFF",
                boxShadow: "0 12px 28px rgba(1,56,99,0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1 }}></span>
              <span>
                <strong style={{ display: "block", fontSize: 14.8, lineHeight: 1.02, letterSpacing: "-0.03em" }}>
                  {tr(dictionary, "passportTrails.nextStep.custom.title", "Custom Route")}
                </strong>
                <span style={{ display: "block", marginTop: 5, color: "rgba(255,255,255,0.88)", fontSize: 10.5, lineHeight: 1.2, fontWeight: 760 }}>
                  {tr(dictionary, "passportTrails.nextStep.custom.body", "Pick your stops.")}
                </span>
              </span>
            </a>
          </div>

          <div
            style={{
              marginTop: 10,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 9,
            }}
          >
            <AppButton href="/traveler/passport-map" variant="soft">{tr(dictionary, "passportTrails.actions.openMap", "Open Map")}</AppButton>
            <AppButton href="/traveler/settings?panel=assistant&topic=passport-trails" variant="navy">{tr(dictionary, "passportTrails.actions.askKuyaTala", "Ask Kuya Tala")}</AppButton>
          </div>
        </section>

        <section
          aria-label="Passport Trail readiness shortcuts"
          style={{
            marginTop: 12,
            borderRadius: 28,
            padding: 12,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.08)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            <a
              href="/traveler/trips"
              aria-label="Review my trips"
              style={{
                minHeight: 58,
                borderRadius: 20,
                padding: "10px 11px",
                background: "transparent",
                backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(1,56,99,0.58)), url(/osp/spm/passport-trails/choose-official-trail/trips-saved-plans.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#FFFFFF",
                textDecoration: "none",
                border: "1px solid rgba(5,150,165,0.18)",
                display: "flex",
                alignItems: "center",
                gap: 9,
                boxShadow: "0 10px 24px rgba(1,56,99,0.08)",
              }}
            >
              <span style={{ fontSize: 18 }}></span>
              <span>
                <strong style={{ display: "block", fontSize: 12.5, lineHeight: 1.05 }}>{tr(dictionary, "passportTrails.shortcuts.trips", "Trips")}</strong>
                <span style={{ display: "block", marginTop: 3, color: "rgba(255,255,255,0.88)", fontSize: 9.8, fontWeight: 760 }}>{tr(dictionary, "passportTrails.shortcuts.savedPlans", "Saved plans")}</span>
              </span>
            </a>

            <a
              href="/traveler/payments"
              aria-label="Review payments and receipts"
              style={{
                minHeight: 58,
                borderRadius: 20,
                padding: "10px 11px",
                background: "transparent",
                backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.12), rgba(1,56,99,0.58)), url(/osp/spm/passport-trails/choose-official-trail/payments-receipts.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#FFFFFF",
                textDecoration: "none",
                border: "1px solid rgba(243,174,38,0.24)",
                display: "flex",
                alignItems: "center",
                gap: 9,
                boxShadow: "0 10px 24px rgba(1,56,99,0.08)",
              }}
            >
              <span style={{ fontSize: 18 }}></span>
              <span>
                <strong style={{ display: "block", fontSize: 12.5, lineHeight: 1.05 }}>{tr(dictionary, "passportTrails.utility.payments", "Payments")}</strong>
                <span style={{ display: "block", marginTop: 3, color: "rgba(255,255,255,0.88)", fontSize: 9.8, fontWeight: 760 }}>{tr(dictionary, "passportTrails.utility.receipts", "Receipts")}</span>
              </span>
            </a>
          </div>
        </section>
      </div>

      <div aria-hidden="true" style={{ height: 118 }} />
      
      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}













