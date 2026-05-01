import { SpmThreeJourneyScanQrPanel } from "../../../src/spm/scan/SpmScanQrCta";
import KuyaTalaEntryButton from "../../../src/traveler-assistant/KuyaTalaEntryButton";
import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";
import PassportMapShortcut from "../../../src/components/traveler/PassportMapShortcut";
const partnerTours = [
  {
    title: "Island Hopping Trail",
    route: "Guyam • Daku • Naked Island",
    status: "Live",
    href: "/traveler/explore/tours",
  },
];

const officialTrails = [
  {
    title: "Island Hopping Trail",
    status: "Active",
    href: "/traveler/passport-trails/island-hopping",
    tone: "#16a34a",
    buttonTone: "#16a34a",
    softBg: "rgba(227,255,243,0.92)",
    softBorder: "#a9ebc9",
    icon: "🏝️",
  },
  {
    title: "Surf Explorer Trail",
    status: "Preview",
    href: "/traveler/passport-trails/surf-explorer",
    tone: "#0891b2",
    buttonTone: "#0891b2",
    softBg: "rgba(232,251,255,0.96)",
    softBorder: "#aee7f2",
    icon: "🌊",
  },
  {
    title: "North Siargao Trail",
    status: "Preview",
    href: "/traveler/passport-trails/north-siargao",
    tone: "#2563eb",
    buttonTone: "#2563eb",
    softBg: "rgba(239,246,255,0.96)",
    softBorder: "#bfd7ff",
    icon: "🧭",
  },
  {
    title: "Inland Discovery Trail",
    status: "Preview",
    href: "/traveler/passport-trails/inland-discovery",
    tone: "#65a30d",
    buttonTone: "#65a30d",
    softBg: "rgba(244,252,232,0.96)",
    softBorder: "#d4edaa",
    icon: "🌿",
  },
  {
    title: "Culture & Community Trail",
    status: "Preview",
    href: "/traveler/passport-trails/culture-community",
    tone: "#d97706",
    buttonTone: "#d97706",
    softBg: "rgba(255,247,230,0.96)",
    softBorder: "#f3d49b",
    icon: "🧺",
  },
  {
    title: "Sunset & Scenic Stops Trail",
    status: "Preview",
    href: "/traveler/passport-trails/sunset-scenic",
    tone: "#f59e0b",
    buttonTone: "#f59e0b",
    softBg: "rgba(255,248,220,0.96)",
    softBorder: "#f6dd8f",
    icon: "🌅",
  },
  {
    title: "Adventure Trail",
    status: "Preview",
    href: "/traveler/passport-trails/adventure",
    tone: "#7c3aed",
    buttonTone: "#7c3aed",
    softBg: "rgba(245,240,255,0.96)",
    softBorder: "#d8c7ff",
    icon: "⛰️",
  },
  {
    title: "Return Traveler Continuity Trail",
    status: "Preview",
    href: "/traveler/passport-trails/return-traveler-continuity",
    tone: "#64748b",
    buttonTone: "#475569",
    softBg: "rgba(248,250,252,0.98)",
    softBorder: "#d8e2ee",
    icon: "↻",
  },
];


function IslandHoppingRequestStartedPanel({
  serviceId,
  requestId,
  paxCount,
  requestedDate,
  paymentIntentId,
}: {
  serviceId?: string
  requestId?: string
  paxCount?: string
  requestedDate?: string
  paymentIntentId?: string
}) {
  const normalizedServiceId = serviceId ? decodeURIComponent(serviceId) : ""
  const cleanRequestId = requestId ? decodeURIComponent(requestId) : "Request started"
  const paxLabel = paxCount ? `${paxCount} traveler${paxCount === "1" ? "" : "s"}` : "Traveler details pending"
  const dateLabel = requestedDate ? decodeURIComponent(requestedDate) : "Travel date to be confirmed"

  const serviceTitle =
    normalizedServiceId.includes("tri-island-joiner") || normalizedServiceId.includes("island-hopping")
      ? "Siargao Partner Tour — Tri-Island Joiner"
      : "Siargao Partner Tour"

  const serviceRoute =
    normalizedServiceId.includes("tri-island-joiner") || normalizedServiceId.includes("island-hopping")
      ? "Guyam • Daku • Naked Island"
      : "Verified Siargao experience"

  const cleanPaymentIntentId = paymentIntentId ? decodeURIComponent(paymentIntentId) : ""
  const continueHref = cleanPaymentIntentId
    ? `/traveler/payments/${encodeURIComponent(cleanPaymentIntentId)}`
    : `/traveler/passport-trails?intent=island-hopping-request&serviceId=${encodeURIComponent(
        normalizedServiceId || "spm-package:tri-island-joiner"
      )}&requestId=${encodeURIComponent(cleanRequestId)}`

  return (
    <section
      aria-label="Island Hopping request started"
      style={{
        width: "100%",
        maxWidth: 430,
        margin: "0 auto",
        padding: "4px 0 18px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          borderRadius: 30,
          overflow: "hidden",
          background:
            "linear-gradient(150deg, #043447 0%, #066f81 46%, #0b9aa5 100%)",
          color: "#ffffff",
          boxShadow: "0 24px 60px rgba(6,63,86,0.24)",
          border: "1px solid rgba(255,255,255,0.24)",
          position: "relative",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(255,255,255,0.30), transparent 34%), radial-gradient(circle at bottom left, rgba(250,204,21,0.28), transparent 28%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", padding: "18px 16px 16px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              borderRadius: 999,
              background: "rgba(255,255,255,0.24)",
              border: "1px solid rgba(255,255,255,0.34)",
              padding: "7px 10px",
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            🏝️ Request Started
          </div>

          <h1
            style={{
              margin: "15px 0 0",
              fontSize: 28,
              lineHeight: 0.98,
              letterSpacing: "-0.065em",
              fontWeight: 950,
              color: "#ffffff",
              WebkitTextFillColor: "#ffffff",
              textShadow: "0 4px 22px rgba(0,18,42,0.72), 0 1px 3px rgba(0,18,42,0.58)",
            }}
          >
            Your Island Hopping request is now open.
          </h1>

          <p
            style={{
              margin: "11px 0 0",
              fontSize: 13,
              lineHeight: 1.48,
              fontWeight: 680,
              color: "rgba(255,255,255,0.96)",
            }}
          >
            Complete the next details so OSP can connect your request to your Pass,
            QR identity, manifest, and trip readiness steps.
          </p>

          <div
            style={{
              marginTop: 15,
              borderRadius: 24,
              background: "rgba(255,255,255,0.985)",
              color: "#12314a",
              padding: 13,
              boxShadow: "0 18px 42px rgba(6,63,86,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 9.5,
                    fontWeight: 900,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#078da0",
                  }}
                >
                  Selected experience
                </div>
                <h2
                  style={{
                    margin: "5px 0 0",
                    fontSize: 19,
                    lineHeight: 1.05,
                    fontWeight: 900,
                    letterSpacing: "-0.045em",
                    color: "#10253f",
                  }}
                >
                  {serviceTitle}
                </h2>
                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: 12,
                    lineHeight: 1.35,
                    color: "#557086",
                    fontWeight: 750,
                  }}
                >
                  {serviceRoute}
                </p>
              </div>

              <div
                style={{
                  flex: "0 0 auto",
                  borderRadius: 999,
                  background: "#ecfeff",
                  border: "1px solid #bae6fd",
                  color: "#067889",
                  padding: "7px 9px",
                  fontSize: 10,
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                }}
              >
                OSP-linked
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
              <div
                style={{
                  borderRadius: 18,
                  background: "#f4fbfb",
                  border: "1px solid #d8f2f5",
                  padding: 10,
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase", color: "#078da0" }}>
                  Travelers
                </div>
                <div style={{ marginTop: 4, fontSize: 12.5, fontWeight: 900, color: "#10253f" }}>
                  {paxLabel}
                </div>
              </div>

              <div
                style={{
                  borderRadius: 18,
                  background: "#f4fbfb",
                  border: "1px solid #d8f2f5",
                  padding: 10,
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase", color: "#078da0" }}>
                  Date
                </div>
                <div style={{ marginTop: 4, fontSize: 12.5, fontWeight: 900, color: "#10253f" }}>
                  {dateLabel}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 10,
                borderRadius: 18,
                background: "#fff7ed",
                border: "1px solid #fed7aa",
                padding: 10,
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase", color: "#c2410c" }}>
                Request reference
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  lineHeight: 1.35,
                  fontWeight: 850,
                  color: "#7c2d12",
                  wordBreak: "break-word",
                }}
              >
                {cleanRequestId}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gap: 9,
        }}
      >
        <a
          href={continueHref}
          aria-label="Continue Island Hopping request"
          style={{
            minHeight: 52,
            borderRadius: 20,
            background: "linear-gradient(135deg, #045f70 0%, #067889 52%, #089fa5 100%)",
            color: "#ffffff",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 16px",
            fontSize: 14,
            fontWeight: 950,
            boxShadow: "0 18px 38px rgba(4,95,112,0.30)",
          }}
        >
          Continue Request
        </a>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 9,
          }}
        >
          <a
            href="/traveler/pass"
            aria-label="Open My OSP Pass"
            style={{
              minHeight: 48,
              borderRadius: 18,
              background: "linear-gradient(135deg, #ffffff 0%, #f1fbfc 100%)",
              color: "#045f70",
              border: "1px solid #a9dfe7",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 12px",
              fontSize: 12.5,
              fontWeight: 900,
              boxShadow: "0 12px 28px rgba(8,61,103,0.09)",
            }}
          >
            Open My Pass
          </a>

          <a
            href="/traveler/passport-map"
            aria-label="Open Passport Map"
            style={{
              minHeight: 48,
              borderRadius: 18,
              background: "linear-gradient(135deg, #ffffff 0%, #f1fbfc 100%)",
              color: "#045f70",
              border: "1px solid #a9dfe7",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 12px",
              fontSize: 12.5,
              fontWeight: 900,
              boxShadow: "0 12px 28px rgba(8,61,103,0.09)",
            }}
          >
            Passport Map
          </a>
        </div>
      </div>

      <section
        aria-label="What happens next"
        style={{
          marginTop: 13,
          borderRadius: 24,
          background: "linear-gradient(180deg, #ffffff 0%, #f7fcfc 100%)",
          border: "1px solid #cbeef2",
          padding: 13,
          boxShadow: "0 16px 38px rgba(8,61,103,0.08)",
        }}
      >
        <div
          style={{
            fontSize: 9.5,
            fontWeight: 900,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#078da0",
          }}
        >
          What happens next
        </div>

        <div style={{ marginTop: 11, display: "grid", gap: 9 }}>
          {[
            {
              icon: "1",
              title: "Complete request details",
              body: "Confirm traveler count, preferred date, and required trip information.",
            },
            {
              icon: "2",
              title: "OSP checks trip readiness",
              body: "Your Pass, QR identity, and Island Hopping requirements stay connected.",
            },
            {
              icon: "3",
              title: "Pay only when ready",
              body: "Payment appears only after the request is ready for the next step.",
            },
          ].map((step) => (
            <div
              key={step.title}
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                gap: 10,
                alignItems: "start",
                borderRadius: 18,
                background: "#f2fbfc",
                border: "1px solid #d7f1f4",
                padding: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  background: "#ecfeff",
                  color: "#067889",
                  border: "1px solid #bae6fd",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 950,
                }}
              >
                {step.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "#10253f" }}>
                  {step.title}
                </div>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: 11.7,
                    lineHeight: 1.38,
                    color: "#5b7184",
                    fontWeight: 680,
                  }}
                >
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p
        style={{
          margin: "12px 4px 0",
          fontSize: 11,
          lineHeight: 1.42,
          color: "#64748b",
          textAlign: "center",
          fontWeight: 650,
        }}
      >
        This is not a confirmed booking yet. No payment or clearance approval has been created from this screen.
      </p>
    </section>
  )
}


export default function PassportTrailsCatalogPage({
  searchParams,
}: {
  searchParams?: {
    intent?: string
    serviceId?: string
    requestId?: string
    paxCount?: string
    requestedDate?: string
    paymentIntentId?: string
  }
}) {

  const isIslandHoppingRequestIntent = searchParams?.intent === "island-hopping-request"

  if (isIslandHoppingRequestIntent) {
    return (
      <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #eaf8f8 0%, #f7fcfc 46%, #ffffff 100%)", padding: "14px 14px 110px", boxSizing: "border-box" }}>
        <IslandHoppingRequestStartedPanel
          serviceId={searchParams?.serviceId}
          requestId={searchParams?.requestId}
          paxCount={searchParams?.paxCount}
          requestedDate={searchParams?.requestedDate}
          paymentIntentId={searchParams?.paymentIntentId}
        />
      </main>
    )
  }


  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(19,168,183,0.14), transparent 32%), linear-gradient(180deg, #f6fdff 0%, #ffffff 60%, #f7fbfb 100%)",
        color: "#14264b",
        fontFamily: 'Arial, "Helvetica Neue", sans-serif',
        padding: "18px 14px 110px",
        boxSizing: "border-box",
      }}
    >
            <section
        aria-label="Passport Trails top shortcuts"
        style={{
          maxWidth: 560,
          margin: "0 auto 14px",
          padding: "0 14px",
          boxSizing: "border-box",
        }}
      >
        <PassportMapShortcut compact title="Open the Passport Map" body="See where Passport Trails connect across Siargao and continue your journey from the map." />
              <KuyaTalaEntryButton topic="trail" title="Ask Kuya Tala™ about Passport Trails" note="Get guided help choosing trails, understanding QR/stamp logic, and planning your next Siargao move." />
      </section>
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 850,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#0796a6",
              }}
            >
              Siargao Passport Map™
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontSize: 29,
                lineHeight: 0.93,
                letterSpacing: "-0.065em",
                fontWeight: 840,
              }}
            >
              Passport Trails™
            </h1>
          </div>

          <a
            href="/traveler/passport-map"
            aria-label="Back to Siargao Passport Map"
            style={{
              borderRadius: 999,
              border: "1px solid #bfe7ee",
              background: "linear-gradient(135deg, #ffffff, #f3fcfd)",
              color: "#067889",
              minHeight: 42,
              padding: "0 15px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 11.6,
              fontWeight: 850,
              boxShadow: "0 14px 32px rgba(8,61,103,0.11)",
            }}
          >
            ← Map
          </a>
        </header>

        <section
          aria-label="Passport Trails catalog hero"
          style={{
            borderRadius: 26,
            background: "linear-gradient(135deg, #078da0 0%, #13a8b7 52%, #8bbf63 100%)",
            color: "#ffffff",
            padding: 13,
            minHeight: 154,
            boxShadow: "0 18px 42px rgba(8,61,103,0.18)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              borderRadius: 999,
              background: "rgba(255,255,255,0.18)",
              padding: "7px 10px",
              fontSize: 10,
              fontWeight: 850,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            🧭 Package Catalog
          </div>

          <h2
            style={{
              margin: "14px 0 0",
              fontSize: 20,
              lineHeight: 1.04,
              letterSpacing: "-0.055em",
              fontWeight: 840,
              maxWidth: 305,
            }}
          >
            Choose your Passport experience.
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: 12.1,
              lineHeight: 1.38,
              fontWeight: 680,
              color: "rgba(255,255,255,0.9)",
              maxWidth: 318,
            }}
          >
            Preview first. Pricing, QR, stamps, booking, and payment stay record-based.
          </p>
        </section>

                <SpmThreeJourneyScanQrPanel />

<section
          aria-label="Siargao Partner Tours"
          style={{
            marginTop: 10,
            border: "1px solid #bfe7ee",
            borderRadius: 24,
            background: "linear-gradient(135deg, rgba(255,255,255,0.99), rgba(244,253,255,0.94))",
            padding: 11,
            boxShadow: "0 16px 38px rgba(8,61,103,0.10)",
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 850, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0796a6" }}>
            Siargao Partner Tour
          </div>
          <h2 style={{ margin: "5px 0 10px", fontSize: 20, lineHeight: 1.02, fontWeight: 800, letterSpacing: "-0.05em" }}>
            Partner tours.
          </h2>

          <div style={{ display: "grid", gap: 8 }}>
            {partnerTours.map((tour) => (
              <a
                key={tour.title}
                href={tour.href}
                aria-label={`Open ${tour.title}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 94px",
                  alignItems: "center",
                  gap: 8,
                  border: "1px solid #bfe7ee",
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #ffffff, #f6fdff)",
                  padding: 10,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <div>
                  <div style={{ fontSize: 14.4, fontWeight: 860, lineHeight: 1.03 }}>{tour.title}</div>
                  <div style={{ marginTop: 4, fontSize: 10.2, fontWeight: 690, color: "#53657d" }}>{tour.route}</div>
                  <div style={{ marginTop: 6, display: "inline-flex", borderRadius: 999, background: "linear-gradient(135deg, #e8fbff, #ffffff)", padding: "3px 7px", fontSize: 8.8, fontWeight: 830, color: "#067889" }}>
                    Stamp rules • Partner-operated
                  </div>
                </div>

                <div
                  style={{
                    minHeight: 48,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #14b8c6, #078da0)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 880,
                  }}
                >
                  View
                </div>
              </a>
            ))}
          </div>
        </section>

        <section
          aria-label="Passport Trails Curated Tours"
          style={{
            marginTop: 10,
            border: "1px solid #bfe7ee",
            borderRadius: 24,
            background: "linear-gradient(135deg, rgba(255,255,255,0.99), rgba(244,253,255,0.94))",
            padding: 11,
            boxShadow: "0 16px 38px rgba(8,61,103,0.10)",
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 850, letterSpacing: "0.13em", textTransform: "uppercase", color: "#11843d" }}>
            Passport Trails™ Curated Tour
          </div>
          <h2 style={{ margin: "5px 0 10px", fontSize: 20, lineHeight: 1.02, fontWeight: 800, letterSpacing: "-0.05em" }}>
            Official trails.
          </h2>

          <div style={{ display: "grid", gap: 8 }}>
            {officialTrails.map((family, index) => (
              <a
                key={family.title}
                href={family.href}
                aria-label={`Open ${family.title}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 84px",
                  alignItems: "center",
                  gap: 8,
                  border: `1px solid ${(family.softBorder ?? '#bfe7ee')}`,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${(family.softBg ?? 'rgba(244,253,255,0.94)')}, #ffffff)`,
                  padding: 10,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <div>
                  <div
                    style={{
                      width: 36,
                      minHeight: 36,
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.72)",
                      display: "grid",
                      placeItems: "center",
                      color: (family.tone ?? '#078da0'),
                      fontSize: 18,
                      boxShadow: "0 8px 18px rgba(15,23,42,0.06)",
                    }}
                  >
                    {(family.icon ?? '⌁')}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      aria-hidden="true"
                      style={{
                        width: 30,
                        height: 4,
                        borderRadius: 999,
                        background: (family.tone ?? '#078da0'),
                        marginBottom: 7,
                        opacity: 0.82,
                      }}
                    />
                    <div style={{ fontSize: 13.4, fontWeight: 850, lineHeight: 1.04 }}>{family.title}</div>
                  <div style={{ marginTop: 4, fontSize: 10.6, fontWeight: 690, color: "#53657d" }}>
                    Verified Passport stamps
                  </div>
                </div>
                </div>

                <div
                  style={{
                    minHeight: 42,
                    borderRadius: 14,
                    background: index === 0 ? "linear-gradient(135deg, #22b85a, #11843d)" : `linear-gradient(135deg, ${(family.softBg ?? 'rgba(244,253,255,0.94)')}, #ffffff)`,
                    color: index === 0 ? "#ffffff" : (family.buttonTone ?? '#078da0'),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 850,
                  }}
                >
                  {family.status}
                </div>
              </a>
            ))}
          </div>

          <div
            style={{
              marginTop: 10,
              borderRadius: 14,
              background: "linear-gradient(135deg, #f8fbfc, #ffffff)",
              padding: "8px 10px",
              fontSize: 10,
              lineHeight: 1.25,
              fontWeight: 720,
              color: "#355071",
            }}
          >
            Pricing must appear before confirmation. Verified stamps count through governed records only.
          </div>
        </section>

        <section
          aria-label="Build Your Own Passport Trail"
          style={{
            marginTop: 10,
            border: "1px solid #bfe7ee",
            borderRadius: 24,
            background: "linear-gradient(135deg, rgba(255,255,255,0.99), rgba(244,253,255,0.94))",
            padding: 11,
            boxShadow: "0 16px 38px rgba(8,61,103,0.10)",
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 850, letterSpacing: "0.13em", textTransform: "uppercase", color: "#7048e8" }}>
            Build Your Own Passport Trail
          </div>
          <h2 style={{ margin: "5px 0 8px", fontSize: 20, lineHeight: 1.02, fontWeight: 800, letterSpacing: "-0.05em" }}>
            Build your route.
          </h2>
          <p style={{ margin: 0, fontSize: 11.6, lineHeight: 1.35, color: "#53657d", fontWeight: 680 }}>
            Plan a curated route request. Operator and guide support appear only when real service fulfillment is required.
          </p>

          <a
            href="/traveler/passport-trails/diy-trail-builder"
            aria-label="Open Build Your Own Passport Trail"
            style={{
              marginTop: 10,
              minHeight: 50,
              borderRadius: 16,
              background: "linear-gradient(135deg, #9b72ff, #7048e8)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 11.6,
              fontWeight: 880,
              boxShadow: "0 12px 26px rgba(112,72,232,0.24)",
            }}
          >
            ＋ Plan Route
          </a>
        </section>
      </div>
      <div aria-hidden="true" style={{ height: 118 }} />
      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
