import type { ReactNode } from "react";
import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";

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

const officialTrails = [
  {
    hierarchy: "Island Hopping",
    title: "Tri-Island Passport Trail",
    description: "Classic General Luna island-hopping route usually completed in one scheduled tour day from GL Port.",
    href: "/traveler/passport-trails/island-hopping",
    icon: "🏝️",
    badge: "GL Port",
    behavior: "One-day tour",
    support: "DCS / boarding-ready",
    source: "SPM · Operator · OTA",
    pricing: "Booking + payment-ready",
    features: ["GL Port", "Boat/operator fulfillment", "Weather/clearance aware"],
    tone: "#047f91",
    shell: "linear-gradient(145deg, #ffffff 0%, #eafbfa 58%, #fff8e8 100%)",
  },
  {
    hierarchy: "Island Hopping",
    title: "Sugba Lagoon Island Hopping",
    description: "Governed lagoon route connected to official access, Del Carmen readiness, and future DCS movement logic.",
    href: "/traveler/passport-trails/sugba-lagoon",
    icon: "🛶",
    badge: "DCS-linked",
    behavior: "One-day route",
    support: "Governed route",
    source: "SPM · Operator · OTA",
    pricing: "Booking/payment governed",
    features: ["Del Carmen flow", "Operator readiness", "Official access route"],
    tone: "#013863",
    shell: "linear-gradient(145deg, #ffffff 0%, #eefbff 58%, #eafbfa 100%)",
  },
  {
    hierarchy: "Future Governed",
    title: "Bucas Grande / Sohoton Official Trail",
    description: "Future-ready governed route for Bucas Grande and Sohoton access, operator readiness, and Dapa-side movement.",
    href: "/traveler/passport-trails/bucas-grande-sohoton",
    icon: "⛰️",
    badge: "Future-ready",
    behavior: "One-day route",
    support: "Dapa-side future DCS",
    source: "SPM · Operator · OTA",
    pricing: "Future governed pricing",
    features: ["Sohoton route", "Dapa-side flow", "Operator readiness"],
    tone: "#64748b",
    shell: "linear-gradient(145deg, #ffffff 0%, #f8fafc 58%, #eef2f7 100%)",
  },
  {
    hierarchy: "Land Tour",
    title: "Siargao Land Tour Passport Trail",
    description: "Choose South or North as a one-day land tour. Complete both across separate days or private DIY support.",
    href: "/traveler/passport-trails/siargao-land-tour",
    icon: "🛺",
    badge: "Guide + TukTuk",
    behavior: "South/North one-day",
    support: "Local operator guided",
    source: "SPM · Operator · OTA",
    pricing: "Guide/transport pricing",
    features: ["Guides", "TukTuk / motorcycle", "Drone or no-drone option"],
    tone: "#047f91",
    shell: "linear-gradient(145deg, #ffffff 0%, #f4fcfa 58%, #fff8e8 100%)",
  },
  {
    hierarchy: "Surf Trail",
    title: "Explorer Surf Trail",
    description: "Start with one surf stop or lesson. Progress stays saved so beginners and enthusiasts can continue later.",
    href: "/traveler/passport-trails/surf-explorer",
    icon: "🏄",
    badge: "Continue later",
    behavior: "Multi-session",
    support: "Surf support optional",
    source: "SPM · Operator",
    pricing: "Lesson/support optional",
    features: ["Beginner-safe", "Saved progress", "Surf school support"],
    tone: "#0596A5",
    shell: "linear-gradient(145deg, #ffffff 0%, #eefbff 58%, #ffffff 100%)",
  },
  {
    hierarchy: "Community",
    title: "Culture & Community Trail",
    description: "One-day local discovery trail through community stops, island stories, makers, and local experiences.",
    href: "/traveler/passport-trails/culture-community",
    icon: "🤝",
    badge: "Local discovery",
    behavior: "One-day flexible",
    support: "SPM-guided",
    source: "SPM · Partner",
    pricing: "Free/paid stops mixed",
    features: ["Community stops", "Local stories", "Makers and markets"],
    tone: "#8A5A00",
    shell: "linear-gradient(145deg, #ffffff 0%, #fff8e8 58%, #f4fcfa 100%)",
  },
  {
    hierarchy: "Merchant Trail",
    title: "Food & Wellness Trail",
    description: "Restaurants, cafés, wellness, recovery, and island care experiences operated by local merchants.",
    href: "/traveler/passport-trails/food-wellness",
    icon: "🥗",
    badge: "Merchant-led",
    behavior: "Flexible",
    support: "Restaurant/wellness operated",
    source: "SPM · Merchant",
    pricing: "Merchant payment logic",
    features: ["Restaurants", "Cafés", "Spa / wellness / recovery"],
    tone: "#9A5F0C",
    shell: "linear-gradient(145deg, #ffffff 0%, #fff8e8 58%, #ffffff 100%)",
  },
  {
    hierarchy: "Continuity",
    title: "Return Traveler Continuity",
    description: "Continue unfinished Passport progress, saved trails, and previous stops when you return to Siargao.",
    href: "/traveler/passport-trails/return-traveler-continuity",
    icon: "🎫",
    badge: "Across trips",
    behavior: "No fixed duration",
    support: "Saved progress layer",
    source: "Traveler account",
    pricing: "No direct tour price",
    features: ["Saved trails", "Unfinished stops", "Return visits"],
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
          Continue to Next Step →
        </a>
      </section>
    </main>
  );
}

function AppHeader() {
  return (
    <header
      style={{
        borderRadius: 28,
        background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(247,252,253,0.98))",
        border: `1px solid ${OSP.line}`,
        boxShadow: "0 16px 40px rgba(1,56,99,0.09)",
        padding: "14px 13px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
        <div>
          <div
            style={{
              display: "inline-flex",
              borderRadius: 999,
              padding: "6px 9px",
              background: OSP.goldSoft,
              border: "1px solid rgba(243,174,38,0.22)",
              color: "#7A5200",
              fontSize: 9.5,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Passport Trails™
          </div>

          <h1
            style={{
              margin: "8px 0 0",
              fontSize: 27,
              lineHeight: 0.98,
              letterSpacing: "-0.072em",
              fontWeight: 950,
              color: OSP.ink,
            }}
          >
            Choose your Siargao route.
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: 12.3,
              lineHeight: 1.38,
              fontWeight: 720,
              color: OSP.slate,
            }}
          >
            Official trail routes, verified stops, and saved Passport progress linked to your OSP Pass.
          </p>
        </div>

        <a
          href="/traveler/pass"
          aria-label="Open My OSP Pass"
          style={{
            flex: "0 0 auto",
            width: 44,
            height: 44,
            borderRadius: 16,
            display: "grid",
            placeItems: "center",
            textDecoration: "none",
            background: `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`,
            color: "#FFFFFF",
            WebkitTextFillColor: "#FFFFFF",
            boxShadow: "0 12px 26px rgba(1,56,99,0.18)",
            fontSize: 18,
            fontWeight: 950,
          }}
        >
          ▣
        </a>
      </div>

      <div style={{ marginTop: 11, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["QR-ready", "OSP Pass linked", "Booking-aware"].map((chip) => (
          <span
            key={chip}
            style={{
              borderRadius: 999,
              padding: "6px 8px",
              background: "#FFFFFF",
              border: `1px solid ${OSP.line}`,
              color: OSP.tealDark,
              fontSize: 9.5,
              fontWeight: 950,
              letterSpacing: "-0.01em",
            }}
          >
            {chip}
          </span>
        ))}
      </div>

      <div style={{ marginTop: 13, padding: "0 2px" }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 950,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: OSP.tealDark,
            WebkitTextFillColor: OSP.tealDark,
          }}
        >
          Passport Trail Preview
        </div>

        <p
          style={{
            margin: "5px 0 0",
            maxWidth: 330,
            fontSize: 11.5,
            lineHeight: 1.35,
            fontWeight: 760,
            color: OSP.slate,
          }}
        >
          Route path, verified stops, and stamp points — previewed before you choose.
        </p>
      </div>

      <div
        aria-label="Passport Trails visual route preview image"
        style={{
          marginTop: 9,
          height: 112,
          borderRadius: 23,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.94)",
          backgroundImage: "url('/osp/spm-passport-trails-hero-image-2.png')",
          backgroundSize: "134% auto",
          backgroundPosition: "55% center",
          boxShadow: "0 12px 26px rgba(1,56,99,0.11)",
        }}
      />
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
      state: "Booking-ready",
      detail: "Connected to booking flow + DCS.",
      tone: "#047f91",
      bg: "rgba(5,150,165,0.10)",
      border: "rgba(5,150,165,0.18)",
    };
  }

  if (trail.href.includes("sugba-lagoon")) {
    return {
      state: "DCS-linked",
      detail: "Confirmation and official access required.",
      tone: "#013863",
      bg: "rgba(1,56,99,0.08)",
      border: "rgba(1,56,99,0.14)",
    };
  }

  if (trail.href.includes("bucas-grande-sohoton")) {
    return {
      state: "Activation-gated",
      detail: "No checkout until route readiness is approved.",
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
    detail: "Saved progress across return trips.",
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
  return (
    <section
      aria-label="Passport journey status"
      style={{
        marginTop: 12,
        borderRadius: 22,
        padding: 10,
        background:
          "linear-gradient(135deg, rgba(234,251,250,0.96) 0%, rgba(255,255,255,0.98) 58%, rgba(255,248,232,0.82) 100%)",
        border: "1px solid rgba(5,150,165,0.16)",
        boxShadow: "0 14px 30px rgba(1,56,99,0.07)",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "42px 1fr", gap: 10, alignItems: "center" }}>
        <div
          aria-hidden="true"
          style={{
            width: 42,
            height: 42,
            borderRadius: 17,
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(135deg, #0596A5, #013863)",
            color: "#FFFFFF",
            fontSize: 22,
            fontWeight: 950,
            boxShadow: "0 12px 24px rgba(1,56,99,0.18)",
          }}
        >
          ▣
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: OSP.tealDark,
              fontSize: 9.5,
              fontWeight: 950,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Passport readiness
          </div>
          <div
            style={{
              marginTop: 3,
              color: OSP.ink,
              fontSize: 17,
              lineHeight: 1.05,
              fontWeight: 760,
              letterSpacing: "-0.04em",
            }}
          >
            Choose an official trail to start.
          </div>
          <div
            style={{
              marginTop: 4,
              color: OSP.slate,
              fontSize: 11.5,
              lineHeight: 1.35,
              fontWeight: 640,
            }}
          >
            Stamps count only after verified OSP/SPM booking, QR, or stop records.
          </div>
        </div>
      </div>
    </section>
  );
}

function TrailFilterChips() {
  const chips = ["All", "Booking-ready", "Confirmation", "Discovery", "Continuity"];

  return (
    <div
      aria-label="Trail filters"
      style={{
        marginTop: 12,
        display: "flex",
        gap: 7,
        overflowX: "auto",
        paddingBottom: 2,
        WebkitOverflowScrolling: "touch",
      }}
    >
      {chips.map((chip, index) => (
        <span
          key={chip}
          style={{
            flex: "0 0 auto",
            borderRadius: 999,
            padding: "8px 10px",
            background: index === 0
              ? "linear-gradient(135deg, #013863 0%, #0596A5 76%, #F3AE26 145%)"
              : "linear-gradient(135deg, #FFFFFF 0%, #F4FCFA 100%)",
            border: index === 0 ? "1px solid rgba(5,150,165,0.24)" : "1px solid rgba(5,150,165,0.16)",
            color: index === 0 ? "#FFFFFF" : OSP.slate,
            WebkitTextFillColor: index === 0 ? "#FFFFFF" : OSP.slate,
            fontSize: 10.5,
            lineHeight: 1,
            fontWeight: 900,
            whiteSpace: "nowrap",
            boxShadow: index === 0 ? "0 12px 24px rgba(1,56,99,0.18)" : "0 8px 18px rgba(5,150,165,0.06)",
          }}
        >
          {chip}
        </span>
      ))}
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
  index,
  compact = false,
}: {
  trail: (typeof officialTrails)[number];
  index: number;
  compact?: boolean;
}) {
  const readiness = getTrailReadiness(trail);
  const surface = getPriorityTrailSurface(trail);

  if (compact) {
    return (
      <a
        href={trail.href}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "grid",
          gridTemplateColumns: "40px 1fr auto",
          gap: 10,
          alignItems: "center",
          borderRadius: 22,
          padding: 11,
          background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(244,252,250,0.88))",
          border: "1px solid rgba(5,150,165,0.13)",
          boxShadow: "0 10px 24px rgba(1,56,99,0.06)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 40,
            height: 40,
            borderRadius: 16,
            display: "grid",
            placeItems: "center",
            background: trail.shell,
            border: "1px solid rgba(5,150,165,0.12)",
            fontSize: 22,
          }}
        >
          {trail.icon}
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: trail.tone,
              fontSize: 9,
              fontWeight: 950,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {trail.hierarchy}
          </div>
          <div
            style={{
              marginTop: 3,
              color: OSP.ink,
              fontSize: 15.5,
              lineHeight: 1.08,
              fontWeight: 760,
              letterSpacing: "-0.035em",
            }}
          >
            {trail.title}
          </div>
          <div
            style={{
              marginTop: 4,
              color: OSP.slate,
              fontSize: 10.5,
              lineHeight: 1.25,
              fontWeight: 650,
            }}
          >
            {readiness.state} · {trail.badge}
          </div>
        </div>

        <div
          aria-hidden="true"
          style={{
            width: 30,
            height: 30,
            borderRadius: 13,
            display: "grid",
            placeItems: "center",
            background: readiness.bg,
            color: readiness.tone,
            fontSize: 16,
            fontWeight: 950,
          }}
        >
          →
        </div>
      </a>
    );
  }

  return (
    <a
      href={trail.href}
      aria-label={`${trail.title}. ${readiness.state}. ${readiness.detail}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        minHeight: 178,
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        borderRadius: 26,
        padding: 13,
        background: surface.background,
        border: surface.border,
        boxShadow: surface.shadow,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 18% 12%, rgba(255,255,255,0.42), transparent 28%), radial-gradient(circle at 92% 100%, rgba(255,255,255,0.24), transparent 32%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div
          aria-hidden="true"
          style={{
            width: 42,
            height: 42,
            borderRadius: 17,
            display: "grid",
            placeItems: "center",
            background: surface.iconBg,
            border: surface.iconBorder,
            color: surface.accent,
            fontSize: 22,
            boxShadow: "0 10px 22px rgba(1,56,99,0.10)",
          }}
        >
          {trail.icon}
        </div>

        <span
          style={{
            borderRadius: 999,
            padding: "6px 7px",
            background: "rgba(255,255,255,0.60)",
            border: surface.iconBorder,
            color: surface.accent,
            fontSize: 8.3,
            lineHeight: 1,
            fontWeight: 950,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {readiness.state}
        </span>
      </div>

      <div style={{ position: "relative", zIndex: 1, alignSelf: "end", marginTop: 14 }}>
        <div
          style={{
            color: surface.accent,
            fontSize: 8.8,
            lineHeight: 1,
            fontWeight: 950,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
          }}
        >
          {trail.hierarchy}
        </div>

        <h3
          style={{
            margin: "6px 0 0",
            color: OSP.ink,
            fontSize: 17.4,
            lineHeight: 1.04,
            fontWeight: 780,
            letterSpacing: "-0.045em",
          }}
        >
          {trail.title}
        </h3>

        <p
          style={{
            margin: "6px 0 0",
            color: OSP.slate,
            fontSize: 10.7,
            lineHeight: 1.28,
            fontWeight: 650,
          }}
        >
          {readiness.detail}
        </p>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: 11,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span
          style={{
            color: surface.accent,
            fontSize: 11,
            fontWeight: 950,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {surface.action}
        </span>

        <span
          aria-hidden="true"
          style={{
            width: 30,
            height: 30,
            borderRadius: 13,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.78)",
            border: surface.iconBorder,
            color: surface.accent,
            fontSize: 16,
            fontWeight: 950,
            boxShadow: "0 8px 18px rgba(1,56,99,0.10)",
          }}
        >
          →
        </span>
      </div>
    </a>
  );
}


export default function PassportTrailsPremiumHubPage({
  searchParams,
}: {
  searchParams?: {
    intent?: string;
    serviceId?: string;
    requestId?: string;
    paxCount?: string;
    requestedDate?: string;
    paymentIntentId?: string;
  };
}) {
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
        padding: "14px 14px 114px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <AppHeader />

        <PassportJourneyStatusStrip />

        <section
          id="official-trails"
          aria-label="Official SPM Passport Trails"
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
              <SectionEyebrow>Official SPM Passport Trails</SectionEyebrow>
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
                {officialTrails.length} trails
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
              Choose an official Passport Trail.
            </h2>

            <p
              style={{
                margin: 0,
                color: OSP.slate,
                fontSize: 12.2,
                lineHeight: 1.38,
                fontWeight: 640,
              }}
            >
              Booking, payment, support, and stamps stay clear before you move forward.
            </p>
          </div>

          <TrailFilterChips />

          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {officialTrails.slice(0, 4).map((trail, index) => (
              <OfficialTrailCard key={trail.title} trail={trail} index={index} />
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <SectionEyebrow>Discovery + Continuity</SectionEyebrow>
              <span
                style={{
                  color: OSP.slate,
                  fontSize: 10,
                  fontWeight: 850,
                }}
              >
                Saved-progress friendly
              </span>
            </div>

            {officialTrails.slice(4).map((trail, index) => (
              <OfficialTrailCard key={trail.title} trail={trail} index={index + 4} compact />
            ))}
          </div>
        </section>

        
        <section
          aria-label="Trail helper actions"
          style={{
            marginTop: 12,
            borderRadius: 24,
            padding: 12,
            background: "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(234,251,250,0.92))",
            border: "1px solid rgba(5,150,165,0.15)",
            boxShadow: "0 12px 28px rgba(1,56,99,0.07)",
            display: "grid",
            gap: 10,
          }}
        >
          <div>
            <SectionEyebrow>Trail Help</SectionEyebrow>
            <h2
              style={{
                margin: "6px 0 0",
                color: OSP.ink,
                fontSize: 19,
                lineHeight: 1.05,
                fontWeight: 740,
                letterSpacing: "-0.045em",
              }}
            >
              Not sure which trail fits your trip?
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                color: OSP.slate,
                fontSize: 11.6,
                lineHeight: 1.34,
                fontWeight: 640,
              }}
            >
              Ask Kuya Tala™ or open the Passport Map before choosing.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <a
              href="/traveler/settings?panel=assistant&topic=passport-trails"
              style={{
                textDecoration: "none",
                borderRadius: 18,
                minHeight: 42,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #003B66 0%, #047f91 52%, #00B4C7 100%)",
                color: "#FFFFFF",
                WebkitTextFillColor: "#FFFFFF",
                border: "1px solid rgba(5,150,165,0.38)",
                boxShadow: "0 16px 30px rgba(1,56,99,0.28)",
                fontSize: 12.2,
                fontWeight: 980,
                letterSpacing: "-0.015em",
              }}
            >
              Ask Kuya Tala™
            </a>

            <a
              href="/traveler/passport-map"
              style={{
                textDecoration: "none",
                borderRadius: 16,
                minHeight: 38,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #FFF8E8 0%, #FFE8A3 100%)",
                border: "1px solid rgba(243,174,38,0.32)",
                color: "#8A5B00",
                WebkitTextFillColor: "#8A5B00",
                fontSize: 11.2,
                fontWeight: 950,
                boxShadow: "0 12px 24px rgba(243,174,38,0.13)",
              }}
            >
              Open Map
            </a>
          </div>
        </section>

<section
          aria-label="Build Your Own Passport Trail"
          style={{
            marginTop: 12,
            borderRadius: 26,
            padding: 13,
            background:
              "linear-gradient(145deg, #FFF8E8 0%, #F4FCFA 52%, #EAFBFA 100%)",
            border: "1px solid rgba(243,174,38,0.26)",
            boxShadow: "0 16px 34px rgba(243,174,38,0.11)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 12% 8%, rgba(255,255,255,0.48), transparent 30%), radial-gradient(circle at 92% 100%, rgba(234,251,250,0.48), transparent 36%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "44px 1fr", gap: 11, alignItems: "start" }}>
            <div
              aria-hidden="true"
              style={{
                width: 44,
                height: 44,
                borderRadius: 18,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(145deg, #FFF3C4 0%, #DFF8F8 100%)",
                border: "1px solid rgba(243,174,38,0.28)",
                color: "#047f91",
                fontSize: 22,
                boxShadow: "0 10px 22px rgba(1,56,99,0.09)",
              }}
            >
              ✦
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: "#9A5F0C",
                  fontSize: 9,
                  lineHeight: 1,
                  fontWeight: 950,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Custom Path
              </div>

              <h2
                style={{
                  margin: "6px 0 0",
                  color: OSP.ink,
                  fontSize: 20,
                  lineHeight: 1.04,
                  fontWeight: 780,
                  letterSpacing: "-0.05em",
                }}
              >
                Build Your Own Passport Trail.
              </h2>

              <p
                style={{
                  margin: "7px 0 0",
                  color: OSP.slate,
                  fontSize: 11.7,
                  lineHeight: 1.34,
                  fontWeight: 640,
                }}
              >
                Create a custom route request from verified stops when you want flexibility, operator help, or guide support.
              </p>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 8,
              alignItems: "center",
            }}
          >
            <div
              style={{
                borderRadius: 16,
                padding: "9px 10px",
                background: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(243,174,38,0.18)",
              }}
            >
              <div
                style={{
                  color: "#9A5F0C",
                  fontSize: 8.5,
                  fontWeight: 950,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Request-first flow
              </div>
              <div
                style={{
                  marginTop: 3,
                  color: OSP.ink,
                  fontSize: 10.6,
                  lineHeight: 1.18,
                  fontWeight: 820,
                }}
              >
                Plan stops first. Confirm support only when needed.
              </div>
            </div>

            <a
              href="/traveler/passport-trails/diy-trail-builder"
              style={{
                textDecoration: "none",
                width: 44,
                height: 44,
                borderRadius: 18,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #FFF3C4 0%, #F3AE26 100%)",
                border: "1px solid rgba(243,174,38,0.36)",
                color: "#7A4A00",
                WebkitTextFillColor: "#7A4A00",
                fontSize: 18,
                fontWeight: 950,
                boxShadow: "0 10px 22px rgba(243,174,38,0.18)",
              }}
              aria-label="Build my custom Passport Trail"
            >
              →
            </a>
          </div>
        </section>

        
        <section
          aria-label="Trip Readiness"
          style={{
            marginTop: 12,
            borderRadius: 30,
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 18px 44px rgba(1,56,99,0.09)",
            padding: 13,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: OSP.teal,
            }}
          >
            Before You Confirm
          </div>

          <h2
            style={{
              margin: "5px 0 0",
              fontSize: 21,
              lineHeight: 1.02,
              letterSpacing: "-0.06em",
              fontWeight: 950,
              color: OSP.ink,
            }}
          >
            Know what needs booking before your trip is ready.
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: 12.2,
              lineHeight: 1.42,
              fontWeight: 720,
              color: OSP.slate,
            }}
          >
            Some routes are free to explore. Others may need operator confirmation, transport, guide support, or payment before your trip is ready.
          </p>

          <div
            style={{
              marginTop: 10,
              borderRadius: 18,
              background: "#FFFDF7",
              border: "1px solid rgba(243,174,38,0.16)",
              padding: "9px 10px",
              color: "#735000",
              fontSize: 11,
              lineHeight: 1.34,
              fontWeight: 800,
            }}
          >
            OSP keeps your route, booking, payment, QR identity, and trip readiness connected.
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <a
              href="/traveler/trips"
              style={{
                textDecoration: "none",
                minHeight: 46,
                borderRadius: 17,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #003B66 0%, #047f91 52%, #00B4C7 100%)",
                color: "#FFFFFF",
                WebkitTextFillColor: "#FFFFFF",
                border: "1px solid rgba(5,150,165,0.36)",
                boxShadow: "0 16px 32px rgba(1,56,99,0.26)",
                fontSize: 12.2,
                fontWeight: 980,
                letterSpacing: "-0.012em",
              }}
            >
              Review My Trips
            </a>
            <AppButton href="/traveler/payments" variant="soft">Payments & Receipts</AppButton>
          </div>
        </section>

        <section
          aria-label="Kuya Tala help"
          style={{
            marginTop: 12,
            borderRadius: 30,
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            padding: 13,
            boxShadow: "0 16px 38px rgba(1,56,99,0.09)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: OSP.teal,
            }}
          >
            Kuya Tala™
          </div>

          <h2
            style={{
              margin: "5px 0 0",
              fontSize: 22,
              lineHeight: 1.03,
              letterSpacing: "-0.055em",
              fontWeight: 950,
              color: OSP.ink,
            }}
          >
            Not sure which route fits your trip?
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12,
              lineHeight: 1.4,
              fontWeight: 700,
              color: OSP.slate,
            }}
          >
            Ask for help choosing between official routes, the full island map, and custom route planning.
          </p>

          <div style={{ marginTop: 10 }}>
            <a
              href="/traveler/settings?panel=assistant&topic=passport-trails"
              style={{
                textDecoration: "none",
                minHeight: 60,
                borderRadius: 20,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #003B66 0%, #047f91 46%, #00B4C7 100%)",
                color: "#FFFFFF",
                WebkitTextFillColor: "#FFFFFF",
                border: "1px solid rgba(5,150,165,0.42)",
                boxShadow: "0 20px 42px rgba(1,56,99,0.30)",
                fontSize: 13.8,
                fontWeight: 990,
                letterSpacing: "-0.018em",
              }}
            >
              Ask Kuya Tala™
            </a>
          </div>
        </section>
      </div>

      <div aria-hidden="true" style={{ height: 118 }} />
      
      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
