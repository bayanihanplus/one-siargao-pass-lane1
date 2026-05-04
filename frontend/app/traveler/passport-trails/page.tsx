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

const featuredTrails = [
  {
    label: "Most Popular",
    tone: "island",
    title: "Island Hopping Trail",
    promise:
      "Follow Siargao’s classic island route through Guyam, Daku, and Naked Island with QR-ready Passport stops.",
    chips: ["QR-ready", "Booking may apply", "OSP Pass linked"],
    href: "/traveler/passport-trails/island-hopping",
    cta: "Start Island Hopping Trail",
    note: "Best first move if this is your first Siargao trip.",
  },
  {
    label: "Iconic Siargao",
    tone: "surf",
    title: "Surf Explorer Trail",
    promise:
      "Start from Cloud 9 and follow a surf-side discovery path designed for movement, memory, and verified progress.",
    chips: ["Route preview", "Surf anchor", "Support may apply"],
    href: "/traveler/passport-trails/surf-explorer",
    cta: "Preview Surf Explorer",
    note: "Best for travelers who want the Siargao surf identity.",
  },
  {
    label: "Scenic North Route",
    tone: "north",
    title: "North Siargao Trail",
    promise:
      "Move toward Pacifico, Alegria, and Taktak Falls with a calmer north-island route experience.",
    chips: ["Scenic route", "Transport may apply", "Trail page ready"],
    href: "/traveler/passport-trails/north-siargao",
    cta: "Explore North Siargao Route",
    note: "Best for travelers who want a wider island day.",
  },
];

const moreTrailFamilies = [
  {
    title: "Inland Discovery",
    mood: "Slow nature day",
    body: "Rivers, rock pools, and inland stops for a calmer route outside the usual crowd.",
    readiness: "Safety and access rules may apply.",
    href: "/traveler/passport-trails/inland-discovery",
    tone: "inland",
  },
  {
    title: "Culture & Community",
    mood: "Local participation",
    body: "Consent-first local experiences with approved partners and community readiness.",
    readiness: "Community and partner approval required.",
    href: "/traveler/passport-trails/culture-community",
    tone: "culture",
  },
  {
    title: "Sunset & Scenic Stops",
    mood: "Golden-hour memories",
    body: "Photo-friendly routes for calm movement, soft views, and late-afternoon island moments.",
    readiness: "Best for flexible, low-pressure movement.",
    href: "/traveler/passport-trails/sunset-scenic",
    tone: "sunset",
  },
  {
    title: "Adventure Trail",
    mood: "Bigger activity day",
    body: "Activity routes where operator support, safety rules, or booking readiness may apply.",
    readiness: "Operator and trip readiness may be required.",
    href: "/traveler/passport-trails/adventure",
    tone: "adventure",
  },
  {
    title: "Return Traveler Continuity",
    mood: "Continue your story",
    body: "A continuity route for travelers coming back to build a longer Siargao journey.",
    readiness: "Designed for repeat visits and saved progress.",
    href: "/traveler/passport-trails/return-traveler-continuity",
    tone: "continuity",
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

function getFeaturedToneStyles(tone: string) {
  if (tone === "island") {
    return {
      cardBg: "linear-gradient(135deg, #FFFFFF 0%, #FFFBF3 68%, #FFF7E7 100%)",
      border: "1px solid rgba(243,174,38,0.22)",
      ribbon: "linear-gradient(90deg, rgba(243,174,38,0.48), rgba(243,174,38,0.18))",
      badgeBg: "#FFF7E7",
      badgeColor: "#8A5B00",
      badgeBorder: "1px solid rgba(243,174,38,0.22)",
      noteBg: "#FFFDF7",
      noteBorder: "1px solid rgba(243,174,38,0.16)",
      noteColor: "#7A5600",
      iconColor: "#D28D13",
    };
  }

  if (tone === "surf") {
    return {
      cardBg: "linear-gradient(135deg, #FFFFFF 0%, #F4FCFE 64%, #EAFBFA 100%)",
      border: "1px solid rgba(5,150,165,0.18)",
      ribbon: "linear-gradient(90deg, rgba(5,150,165,0.42), rgba(5,150,165,0.14))",
      badgeBg: "#F1FBFD",
      badgeColor: "#0A7A86",
      badgeBorder: "1px solid rgba(5,150,165,0.18)",
      noteBg: "#F8FEFF",
      noteBorder: "1px solid rgba(5,150,165,0.12)",
      noteColor: "#456786",
      iconColor: "#0A95A3",
    };
  }

  return {
    cardBg: "linear-gradient(135deg, #FFFFFF 0%, #F5F9FD 66%, #EEF6FB 100%)",
    border: "1px solid rgba(1,56,99,0.12)",
    ribbon: "linear-gradient(90deg, rgba(1,56,99,0.34), rgba(5,150,165,0.12))",
    badgeBg: "#F2F7FC",
    badgeColor: "#244F79",
    badgeBorder: "1px solid rgba(1,56,99,0.10)",
    noteBg: "#F8FBFE",
    noteBorder: "1px solid rgba(1,56,99,0.10)",
    noteColor: "#496684",
    iconColor: "#0F4A7B",
  };
}

function getFamilyToneStyles(tone: string) {
  if (tone === "inland") {
    return {
      cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 54%, #F2FBF7 100%)",
      topBand: "linear-gradient(135deg, #EAFBF4 0%, #F8FFFC 100%)",
      border: "1px solid rgba(46,125,99,0.26)",
      shadow: "0 16px 34px rgba(46,125,99,0.12)",
      moodColor: "#2E7D63",
      markerBg: "#EAFBF4",
      markerColor: "#2E7D63",
      readinessBg: "#F7FFFB",
      readinessBorder: "1px solid rgba(46,125,99,0.18)",
      readinessColor: "#3F6F5C",
    };
  }

  if (tone === "culture") {
    return {
      cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 54%, #FFF6EF 100%)",
      topBand: "linear-gradient(135deg, #FFF1E8 0%, #FFFDF9 100%)",
      border: "1px solid rgba(178,106,61,0.25)",
      shadow: "0 16px 34px rgba(178,106,61,0.11)",
      moodColor: "#B26A3D",
      markerBg: "#FFF1E8",
      markerColor: "#B26A3D",
      readinessBg: "#FFFCF8",
      readinessBorder: "1px solid rgba(178,106,61,0.18)",
      readinessColor: "#7B5A44",
    };
  }

  if (tone === "sunset") {
    return {
      cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 54%, #FFFDF5 100%)",
      topBand: "linear-gradient(135deg, #FFF2D4 0%, #FFFDF7 100%)",
      border: "1px solid rgba(243,174,38,0.24)",
      shadow: "0 16px 34px rgba(195,124,0,0.11)",
      moodColor: "#B87400",
      markerBg: "#FFF2D4",
      markerColor: "#B87400",
      readinessBg: "#FFFDF7",
      readinessBorder: "1px solid rgba(243,174,38,0.18)",
      readinessColor: "#7B5A24",
    };
  }

  if (tone === "adventure") {
    return {
      cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 54%, #F0F8FF 100%)",
      topBand: "linear-gradient(135deg, #EAF5FF 0%, #FBFDFF 100%)",
      border: "1px solid rgba(47,111,177,0.24)",
      shadow: "0 16px 34px rgba(47,111,177,0.11)",
      moodColor: "#2F6FB1",
      markerBg: "#EAF5FF",
      markerColor: "#2F6FB1",
      readinessBg: "#FBFDFF",
      readinessBorder: "1px solid rgba(47,111,177,0.17)",
      readinessColor: "#4F6D8B",
    };
  }

  return {
    cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 54%, #F5F5FC 100%)",
    topBand: "linear-gradient(135deg, #F0F1FC 0%, #FCFCFF 100%)",
    border: "1px solid rgba(102,111,154,0.24)",
    shadow: "0 16px 34px rgba(102,111,154,0.11)",
    moodColor: "#666F9A",
    markerBg: "#F0F1FC",
    markerColor: "#666F9A",
    readinessBg: "#FCFCFF",
    readinessBorder: "1px solid rgba(102,111,154,0.17)",
    readinessColor: "#676F8B",
  };
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
            Official trails, island map pins, and custom route planning connected to your OSP Pass.
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

function FeaturedTrailCard({
  trail,
}: {
  trail: (typeof featuredTrails)[number];
}) {
  const tone = getFeaturedToneStyles(trail.tone);

  return (
    <a
      href={trail.href}
      style={{
        display: "grid",
        gap: 10,
        borderRadius: 26,
        padding: 13,
        textDecoration: "none",
        color: "inherit",
        background: tone.cardBg,
        border: tone.border,
        boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: tone.ribbon,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span
          style={{
            borderRadius: 999,
            padding: "6px 9px",
            background: tone.badgeBg,
            color: tone.badgeColor,
            fontSize: 9.5,
            fontWeight: 950,
            whiteSpace: "nowrap",
            border: tone.badgeBorder,
          }}
        >
          {trail.label}
        </span>

        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: "#FFFFFF",
            border: `1px solid ${OSP.softLine}`,
            color: tone.iconColor,
            fontSize: 13,
            fontWeight: 950,
            boxShadow: "0 8px 18px rgba(1,56,99,0.07)",
          }}
        >
          ✦
        </span>
      </div>

      <div>
        <h3
          style={{
            margin: 0,
            fontSize: 21,
            lineHeight: 1.02,
            letterSpacing: "-0.06em",
            fontWeight: 950,
            color: OSP.ink,
          }}
        >
          {trail.title}
        </h3>

        <p
          style={{
            margin: "6px 0 0",
            fontSize: 12.1,
            lineHeight: 1.4,
            fontWeight: 720,
            color: OSP.slate,
          }}
        >
          {trail.promise}
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {trail.chips.map((chip) => (
          <span
            key={chip}
            style={{
              borderRadius: 999,
              padding: "5px 8px",
              background: "#FFFFFF",
              border: `1px solid ${OSP.softLine}`,
              color: chip.toLowerCase().includes("booking") || chip.toLowerCase().includes("support") || chip.toLowerCase().includes("transport")
                ? "#7A5200"
                : OSP.tealDark,
              fontSize: 9.2,
              fontWeight: 900,
            }}
          >
            {chip}
          </span>
        ))}
      </div>

      <div
        style={{
          borderRadius: 17,
          background: tone.noteBg,
          border: tone.noteBorder,
          padding: "8px 9px",
          color: tone.noteColor,
          fontSize: 10.7,
          lineHeight: 1.28,
          fontWeight: 780,
        }}
      >
        {trail.note}
      </div>

      <div
        style={{
          minHeight: 46,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${OSP.deepNavy} 0%, ${OSP.teal} 100%)`,
          color: "#FFFFFF",
          WebkitTextFillColor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12.2,
          fontWeight: 950,
          boxShadow: "0 12px 26px rgba(1,56,99,0.17)",
        }}
      >
        {trail.cta} →
      </div>
    </a>
  );
}

function MoreTrailCard({ trail }: { trail: (typeof moreTrailFamilies)[number] }) {
  const tone = getFamilyToneStyles(trail.tone);

  return (
    <a
      href={trail.href}
      style={{
        minHeight: 164,
        borderRadius: 24,
        background: tone.cardBg,
        border: tone.border,
        boxShadow: tone.shadow,
        color: "inherit",
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          minHeight: 46,
          background: tone.topBand,
          borderBottom: "1px solid rgba(1,56,99,0.07)",
          padding: "10px 11px 9px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 950,
            letterSpacing: "0.11em",
            textTransform: "uppercase",
            color: tone.moodColor,
            lineHeight: 1.1,
          }}
        >
          {trail.mood}
        </div>

        <div
          aria-hidden="true"
          style={{
            flex: "0 0 auto",
            width: 28,
            height: 28,
            borderRadius: 999,
            background: tone.markerBg,
            color: tone.markerColor,
            border: "1px solid rgba(255,255,255,0.72)",
            boxShadow: "0 8px 18px rgba(1,56,99,0.08)",
            display: "grid",
            placeItems: "center",
            fontSize: 12,
            fontWeight: 950,
          }}
        >
          ✦
        </div>
      </div>

      <div
        style={{
          padding: 12,
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.04,
              letterSpacing: "-0.045em",
              fontWeight: 950,
              color: OSP.ink,
            }}
          >
            {trail.title}
          </h3>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: 11.1,
              lineHeight: 1.34,
              fontWeight: 720,
              color: OSP.slate,
            }}
          >
            {trail.body}
          </p>
        </div>

        <div>
          <div
            style={{
              fontSize: 9.7,
              lineHeight: 1.25,
              fontWeight: 850,
              color: tone.readinessColor,
              background: tone.readinessBg,
              border: tone.readinessBorder,
              borderRadius: 14,
              padding: "7px 8px",
            }}
          >
            {trail.readiness}
          </div>

          <div
            style={{
              marginTop: 9,
              minHeight: 39,
              borderRadius: 15,
              background: `linear-gradient(135deg, ${OSP.deepNavy} 0%, ${OSP.teal} 100%)`,
              color: "#FFFFFF",
              WebkitTextFillColor: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 11px 22px rgba(1,56,99,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10.9,
              fontWeight: 950,
            }}
          >
            Preview Route →
          </div>
        </div>
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

        <section
          id="official-trails"
          aria-label="Most Popular Passport Trails"
          style={{
            marginTop: 12,
            borderRadius: 30,
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 18px 44px rgba(1,56,99,0.10)",
            padding: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-end" }}>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: OSP.teal,
                }}
              >
                Most Popular Passport Trails
              </div>
              <h2
                style={{
                  margin: "5px 0 0",
                  fontSize: 25,
                  lineHeight: 1,
                  letterSpacing: "-0.065em",
                  fontWeight: 950,
                  color: OSP.ink,
                }}
              >
                Recommended first for Siargao travelers.
              </h2>
            </div>

            <span
              style={{
                flex: "0 0 auto",
                borderRadius: 999,
                padding: "7px 9px",
                background: OSP.goldSoft,
                color: "#7A5200",
                fontSize: 9.4,
                fontWeight: 950,
                border: "1px solid rgba(243,174,38,0.22)",
              }}
            >
              Best picks
            </span>
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {featuredTrails.map((trail) => (
              <FeaturedTrailCard key={trail.title} trail={trail} />
            ))}
          </div>
        </section>

        <section
          aria-label="Follow the Island Map"
          style={{
            marginTop: 12,
            borderRadius: 30,
            background: `linear-gradient(135deg, #FFFFFF 0%, ${OSP.mist} 100%)`,
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 18px 44px rgba(1,56,99,0.09)",
            padding: 13,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              right: -34,
              top: -34,
              width: 120,
              height: 120,
              borderRadius: 999,
              background: "rgba(243,174,38,0.08)",
            }}
          />

          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "inline-flex",
                borderRadius: 999,
                padding: "6px 9px",
                background: "#FFFFFF",
                border: `1px solid ${OSP.line}`,
                fontSize: 9.5,
                fontWeight: 950,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: OSP.teal,
              }}
            >
              Explore Mode
            </div>

            <h2
              style={{
                margin: "7px 0 0",
                fontSize: 24,
                lineHeight: 1.02,
                letterSpacing: "-0.06em",
                fontWeight: 950,
                color: OSP.ink,
              }}
            >
              Follow the Island Map.
            </h2>

            <p
              style={{
                margin: "7px 0 0",
                fontSize: 12.2,
                lineHeight: 1.4,
                fontWeight: 720,
                color: OSP.slate,
              }}
            >
              Tap pins across Siargao and open the official route page behind each destination.
            </p>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <AppButton href="/traveler/passport-trails/follow-map">Open Full Island Map</AppButton>
              <AppButton href="/traveler/passport-map" variant="soft">Discovery Page</AppButton>
            </div>
          </div>
        </section>

        <section
          aria-label="More Ways to Experience Siargao"
          style={{
            marginTop: 12,
            borderRadius: 30,
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            boxShadow: "0 18px 44px rgba(1,56,99,0.09)",
            padding: 12,
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
            More Ways to Experience Siargao
          </div>

          <h2
            style={{
              margin: "5px 0 0",
              fontSize: 24,
              lineHeight: 1.02,
              letterSpacing: "-0.06em",
              fontWeight: 950,
              color: OSP.ink,
            }}
          >
            Pick a route based on your trip mood.
          </h2>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            {moreTrailFamilies.map((trail) => (
              <MoreTrailCard key={trail.title} trail={trail} />
            ))}
          </div>
        </section>

        <section
          aria-label="Build Your Own Passport Trail"
          style={{
            marginTop: 12,
            borderRadius: 30,
            background: `linear-gradient(135deg, ${OSP.deepNavy} 0%, ${OSP.navy} 55%, ${OSP.tealDark} 100%)`,
            color: "#FFFFFF",
            WebkitTextFillColor: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 20px 48px rgba(1,56,99,0.18)",
            padding: 14,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: OSP.gold,
              WebkitTextFillColor: OSP.gold,
            }}
          >
            Custom Path
          </div>

          <h2
            style={{
              margin: "6px 0 0",
              fontSize: 24,
              lineHeight: 1.02,
              letterSpacing: "-0.06em",
              fontWeight: 950,
              color: "#FFFFFF",
              WebkitTextFillColor: "#FFFFFF",
              textShadow: "0 4px 20px rgba(0,18,42,0.44)",
            }}
          >
            Build Your Own Passport Trail.
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: 12.3,
              lineHeight: 1.42,
              fontWeight: 720,
              color: "rgba(255,255,255,0.88)",
              WebkitTextFillColor: "rgba(255,255,255,0.88)",
            }}
          >
            Create a custom route request from verified stops when you want flexibility, operator help, or guide support.
          </p>

          <div style={{ marginTop: 12 }}>
            <AppButton href="/traveler/passport-trails/diy-trail-builder">Build My Custom Route →</AppButton>
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
              fontSize: 23,
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
            <AppButton href="/traveler/trips">Review My Trips</AppButton>
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
            <AppButton href="/traveler/settings?panel=assistant&topic=passport-trails">Ask Kuya Tala™</AppButton>
          </div>
        </section>
      </div>

      <div aria-hidden="true" style={{ height: 118 }} />
      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
