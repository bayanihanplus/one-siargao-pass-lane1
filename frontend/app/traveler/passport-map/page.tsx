import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";
import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";

async function getSpmTravelerPreview() {
  try {
    const token = await requireAccessToken();
    const res = await fetch(`${getApiBaseUrl()}/spm/traveler-preview`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.ok ? json.data : null;
  } catch {
    return null;
  }
}

export default async function TravelerPassportMapPage() {
  const spmPreview = await getSpmTravelerPreview();
  return (
    <main
      style={{
        minHeight: "100vh",
        overflowX: "hidden",
        background: "linear-gradient(180deg, #f4fcfa 0%, #ffffff 68%, #fff8e8 100%)",
        color: "#14264b",
        fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          minHeight: "100vh",
          margin: "0 auto",
          background: "linear-gradient(180deg, #ffffff 0%, #f4fcfa 48%, #ffffff 100%)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            padding: "16px 14px 112px",
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minHeight: 64,
              position: "relative",
              zIndex: 5,
              paddingRight: 86,
            }}
          >
            <a
              href="/traveler/home"
              aria-label="Back to One Siargao Pass home"
              style={{
                width: 54,
                height: 54,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                flex: "0 0 54px",
              }}
            >
              <img
                src="/osp/spm-header-mark.png"
                alt="Siargao Passport Map"
                style={{
                  width: 54,
                  height: 54,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </a>

            <div
              style={{
                flex: "1 1 auto",
                minWidth: 0,
                paddingTop: 1,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
                  fontSize: 22,
                  lineHeight: 1.04,
                  letterSpacing: "-0.045em",
                  color: "#013863",
                  fontWeight: 850,
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                }}
              >
                Siargao Passport Map
              </h1>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#5f6f87",
                  fontSize: 12.2,
                  lineHeight: 1.18,
                  fontWeight: 760,
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                }}
              >
                Follow the Trails. Build the Journey.
              </p>
            </div>

            <div
              aria-label="Passport Map header actions"
              style={{
                position: "absolute",
                top: 12,
                right: 0,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <a
                href="/traveler/settings?panel=notifications"
                aria-label="Open traveler notifications"
                style={{
                  width: 38,
                  minHeight: 42,
                  borderRadius: 18,
                  color: "#14264b",
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(20,38,75,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  position: "relative",
                  boxShadow: "0 8px 18px rgba(15,23,42,0.06)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#ff5638",
                  }}
                />
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                  <path
                    d="M18 8.5a6 6 0 1 0-12 0c0 7-2.5 7.7-2.5 9h17c0-1.3-2.5-2-2.5-9Z"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.8 20.2a2.4 2.4 0 0 0 4.4 0"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                  />
                </svg>
              </a>

              <a
                href="/traveler/settings?panel=assistant&topic=map"
                aria-label="Open OSP trip assistant"
                title="Trip Assistant"
                style={{
                  minWidth: 42,
                  minHeight: 42,
                  borderRadius: 18,
                  color: "#ffffff",
                  background: "linear-gradient(135deg, #14b8c6, #078da0)",
                  border: "1px solid rgba(255,255,255,0.58)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  position: "relative",
                  boxShadow: "0 10px 22px rgba(7,141,160,0.22)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 3,
                    borderRadius: 15,
                    border: "1px solid rgba(255,255,255,0.22)",
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    fontSize: 15,
                    fontWeight: 950,
                    letterSpacing: "-0.04em",
                    zIndex: 1,
                  }}
                >
                  AI
                </span>
              </a>
            </div>
          </header>

          <section
            style={{
              marginTop: 16,
              height: "auto",
              borderRadius: 28,
              border: "1px solid rgba(19,168,183,0.16)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(235,248,252,0.96) 50%, rgba(255,255,255,0.98) 100%)",
              boxShadow: "0 22px 58px rgba(15,23,42,0.10)",
              padding: 12,
            }}
          >
            <div
              style={{
                minHeight: 248,
                height: "auto",
                borderRadius: 24,
                background:
                  "radial-gradient(circle at 76% 16%, rgba(19,168,183,0.16) 0, transparent 78px), radial-gradient(circle at 22% 84%, rgba(242,183,5,0.15) 0, transparent 64px), linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(238,248,251,0.66) 52%, rgba(255,255,255,0.90) 100%)",
                padding: "16px 8px 14px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  maxWidth: 212,
                  paddingTop: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 5,
                    transform: "rotate(-0.25deg)",
                    transformOrigin: "left center",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontFamily:
                        '"Snell Roundhand", "Apple Chancery", "Bradley Hand", "Segoe Script", cursive',
                      fontSize: 14,
                      lineHeight: 1.08,
                      fontWeight: 400,
                      color: "#14264b",
                      letterSpacing: "-0.004em",
                    }}
                  >
                    Hello, Explorer!
                  </p>

                  <span
                    aria-hidden="true"
                    style={{
                      fontSize: 12,
                      lineHeight: 1.08,
                      transform: "rotate(7deg)",
                      display: "inline-block",
                      marginTop: -1,
                    }}
                  >
                    🌴
                  </span>
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
                    fontSize: 28,
                    lineHeight: 0.98,
                    letterSpacing: "-0.05em",
                    color: "#013863",
                    fontWeight: 820,
                  }}
                >
                  Your Siargao Journey,
                </h2>

                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    marginTop: -1,
                    paddingBottom: 6,
                  }}
                >
                  <div
                    style={{
                      fontFamily:
                        '"Snell Roundhand", "Apple Chancery", "Bradley Hand", "Segoe Script", cursive',
                      fontSize: 35,
                      lineHeight: 0.88,
                      fontWeight: 400,
                      color: "#0f9aa6",
                      letterSpacing: "-0.014em",
                      transform: "rotate(-0.6deg)",
                      transformOrigin: "left center",
                    }}
                  >
                    Mapped
                  </div>

                  <svg
                    aria-hidden="true"
                    viewBox="0 0 120 14"
                    width="88"
                    height="12"
                    style={{
                      position: "absolute",
                      left: 2,
                      bottom: 0,
                      pointerEvents: "none",
                    }}
                  >
                    <path
                      d="M4 8 C28 12, 72 12, 116 5"
                      fill="none"
                      stroke="#f2bf38"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p
                  style={{
                    margin: "3px 0 0",
                    maxWidth: 190,
                    color: "#53657d",
                    fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
                    fontSize: 11.8,
                    lineHeight: 1.32,
                    fontWeight: 720,
                    letterSpacing: "-0.003em",
                  }}
                >
                  Collect stamps. Unlock trails. Create memories that last.
                </p>
                <SpmLegendAndStatus metrics={spmPreview?.metrics} emptyState={spmPreview?.emptyState} />
              </div>

              <SpmMapVisualPreview />
            </div>
          </section>

          <SpmCuratedPassportTours />
          <SpmFeaturedPartnerTours />
          <SpmBuildYourOwnTrailSection />
          <SpmGuideSupportProvidedBy />

          <SpmTrailCardsPreview trails={spmPreview?.trails} />

          <SpmVerifiedStopsPreview stops={spmPreview?.verifiedStops} />

          <SpmJourneyHubEngagement />
        </div>

        
      <div aria-hidden="true" style={{ height: "calc(172px + env(safe-area-inset-bottom))" }} />
      <UniversalTravelerBottomTabBar activeTab="trails" fixed />

      </div>
    </main>
  );
}

type SpmNextStopPreviewData = {
  recommendedStopName?: string | null;
  recommendationReason?: string | null;
  distanceOrEtaLabel?: string | null;
  ctaRoute?: string | null;
};

function SpmContinueJourneyPreview(props: { nextStop?: SpmNextStopPreviewData | null }) {
  const nextStop = props.nextStop;
  const title = nextStop?.recommendedStopName ?? "Continue Passport Trail";
  const reason = nextStop?.recommendationReason ?? "Choose a trail, visit verified stops, and use your OSP QR only when governed validation records are available. Passport Stamps count only after approved OSP/SPM records.";
  const eta = nextStop?.distanceOrEtaLabel ?? "Your next stop activates from verified QR / stamp progress.";
  const ctaRoute = nextStop?.ctaRoute ?? "/traveler/passport-map";
  return (
    <section
      aria-label="Continue journey recommendation card"
      style={{
        marginTop: 14,
        marginBottom: 34,
      }}
    >
      <div
        style={{
          minHeight: 112,
          borderRadius: 22,
          background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(244,253,255,0.92))",
          border: "1px solid rgba(203,213,225,0.74)",
          color: "#14264b",
          boxShadow: "0 12px 28px rgba(15,23,42,0.07)",
          position: "relative",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "42% 1fr",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "relative",
            minHeight: 112,
            background:
              "linear-gradient(135deg, #7fd2eb 0%, #dff7ff 35%, #bce8d6 68%, #f7dca4 100%)",
            borderRight: "1px solid rgba(226,232,240,0.82)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(20,38,75,0.10) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 13,
              bottom: 12,
              width: 32,
              minHeight: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #14b8c6, #078da0)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              boxShadow: "0 9px 18px rgba(19,168,183,0.22)",
            }}
          >
            ☆
          </div>
        </div>

        <div
          style={{
            padding: "12px 12px 12px",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              color: "#067889",
              fontSize: 9,
              lineHeight: 1.08,
              fontWeight: 640,
              letterSpacing: "0.03em",
            }}
          >
            Recommended Next Stop
          </div>

          <h2
            style={{
              margin: "5px 0 0",
              fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
              fontSize: 20,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              color: "#14264b",
              fontWeight: 590,
            }}
          >
            {title}
          </h2>

          <p
            style={{
              margin: "4px 0 0",
              color: "#6b7890",
              fontSize: 10.5,
              lineHeight: 1.22,
              fontWeight: 590,
            }}
          >
            {reason}
          </p>

          <div
            style={{
              marginTop: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span
              style={{
                color: "#6b7890",
                fontSize: 9,
                fontWeight: 580,
                whiteSpace: "nowrap",
              }}
            >
              {eta}
            </span>

            <a
              href={ctaRoute}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                borderRadius: 999,
                background: "linear-gradient(135deg, #14b8c6, #078da0)",
                color: "#ffffff",
                padding: "0 12px",
                fontSize: 10,
                fontWeight: 640,
                textDecoration: "none",
                whiteSpace: "nowrap",
                boxShadow: "0 8px 16px rgba(19,168,183,0.20)",
              }}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true" style={{ marginRight: 5 }}>
                <path d="M3 6.8l6-2.3 6 2.3 6-2.3v12.7l-6 2.3-6-2.3-6 2.3V6.8z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
                <path d="M9 4.5v12.7M15 6.8v12.7" stroke="currentColor" strokeWidth="1.9" />
              </svg>
              Explore
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}



type SpmVerifiedStopPreviewData = {
  stopName?: string;
  subtitle?: string | null;
  verificationStatus?: string;
  source?: string;
  href?: string;
};

function SpmVerifiedStopsPreview({ stops }: { stops?: SpmVerifiedStopPreviewData[] }) {
  const stopCount = stops?.length || 0;
  const verifiedCards = [
    {
      eyebrow: "Stamp-ready Stops",
      title: "Verified places for Passport collection",
      description: "Places prepared for stamp collection, trail movement, and destination progress.",
      metric: stopCount ? `${stopCount} visible stops` : "Verified stop layer",
      visual: "📍",
    },
    {
      eyebrow: "QR Ready",
      title: "Use your OSP pass for supported trail actions",
      description: "Your QR identity keeps trail actions connected to your traveler journey.",
      metric: "OSP pass linked",
      visual: "🔳",
    },
    {
      eyebrow: "Trail Progress",
      title: "Track completed stops and continue routes",
      description: "Continue unfinished routes and keep your Passport journey organized.",
      metric: "Progress layer",
      visual: "✨",
    },
  ];

  return (
    <section
      aria-label="Verified Stops"
      style={{
        marginTop: 18,
        borderRadius: 28,
        background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8EA 46%, #F4FCFA 100%)",
        border: "1px solid rgba(243,174,38,0.32)",
        boxShadow: "0 18px 44px rgba(1,56,99,0.09)",
        padding: 14,
      }}
    >
      <div>
        <div style={{ fontSize: 9.5, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8A5A00" }}>
          Verified Stops
        </div>
        <h2 style={{ margin: "6px 0 0", fontSize: 25, lineHeight: 1, fontWeight: 950, letterSpacing: "-0.055em", color: "#013863" }}>
          Stamp-ready places connected to your Passport journey.
        </h2>
        <p style={{ margin: "8px 0 0", color: "#50668B", fontSize: 13.2, lineHeight: 1.42, fontWeight: 760 }}>
          Verified stops prove the Passport Map is not just a map — it is a guided, trackable journey layer.
        </p>
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {verifiedCards.map((card) => (
          <div
            key={card.title}
            style={{
              borderRadius: 22,
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.09)",
              boxShadow: "0 12px 28px rgba(1,56,99,0.07)",
              padding: 13,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 11, alignItems: "start" }}>
              <div
                style={{
                  width: 48,
                  minHeight: 50,
                  borderRadius: 18,
                  background: "#FFF8EA",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 22,
                  border: "1px solid rgba(243,174,38,0.24)",
                }}
              >
                {card.visual}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#8A5A00", fontSize: 8.6, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
                  {card.eyebrow}
                </div>
                <h3 style={{ margin: "4px 0 0", color: "#013863", fontSize: 17.5, lineHeight: 1.03, fontWeight: 950, letterSpacing: "-0.04em" }}>
                  {card.title}
                </h3>
                <p style={{ margin: "7px 0 0", color: "#50668B", fontSize: 12.2, lineHeight: 1.35, fontWeight: 730 }}>
                  {card.description}
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: 11,
                borderRadius: 999,
                background: "#F4FCFA",
                border: "1px solid rgba(0,151,167,0.14)",
                color: "#0097A7",
                display: "inline-flex",
                alignItems: "center",
                minHeight: 32,
                padding: "0 10px",
                fontSize: 10,
                fontWeight: 950,
              }}
            >
              {card.metric}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


function StopPreviewCard(props: {
  name: string;
  subtitle: string;
  imageLabel: string;
  variant: "town" | "surf" | "pool";
  verified: boolean;
  state?: string;
  href: string;
}) {
  const imageBackground =
    props.variant === "town"
      ? "linear-gradient(135deg, #bcecf2 0%, #effaf8 38%, #f6dda9 100%)"
      : props.variant === "surf"
        ? "linear-gradient(135deg, #7fd2eb 0%, #dbf6ff 42%, #b9e6d1 100%)"
        : "linear-gradient(135deg, #b2d8ee 0%, #e8f7f4 46%, #d2dfb0 100%)";

  const stateTone =
    props.verified ? "#16a34a" : props.state === "ready" ? "#0891b2" : props.state === "progress" ? "#7c3aed" : "#64748b";
  const stateSoft =
    props.verified
      ? "rgba(220,252,231,0.88)"
      : props.state === "ready"
        ? "rgba(232,251,255,0.94)"
        : props.state === "progress"
          ? "rgba(245,240,255,0.94)"
          : "rgba(248,250,252,0.94)";
  const stateIcon =
    props.verified ? "✓" : props.state === "ready" ? "⌁" : props.state === "progress" ? "↗" : "▣";

  return (
    <a
      href={props.href}
      aria-label={`${props.name} passport stop. ${props.verified ? "Governed verified stop." : "Passport journey stop."}`}
      style={{
        minHeight: 106,
        borderRadius: 20,
        border: `1px solid ${props.verified ? "rgba(34,184,90,0.32)" : "rgba(191,231,238,0.86)"}`,
        background: `linear-gradient(180deg, ${stateSoft}, rgba(255,255,255,0.96))`,
        boxShadow: "0 10px 24px rgba(15,23,42,0.055)",
        textDecoration: "none",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "52px auto",
        opacity: 1,
        transition: "box-shadow 160ms ease, border-color 160ms ease",
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: 52,
          background: imageBackground,
          borderBottom: "1px solid rgba(226,232,240,0.72)",
          filter: props.verified ? "none" : "saturate(0.65)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(20,38,75,0.10) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 9,
            bottom: 9,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.94)",
            color: stateTone,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 850,
            boxShadow: "0 8px 16px rgba(15,23,42,0.10)",
          }}
        >
          {props.imageLabel}
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 8,
            bottom: 8,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: stateTone,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 900,
            boxShadow: props.verified ? "0 7px 14px rgba(31,164,91,0.20)" : "0 7px 14px rgba(100,116,139,0.16)",
          }}
        >
          {stateIcon}
        </div>
      </div>

      <div
        style={{
          padding: "8px 9px 9px",
          minWidth: 0,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#14264b",
            fontSize: 11.4,
            lineHeight: 1.1,
            fontWeight: 820,
            letterSpacing: "-0.02em",
          }}
        >
          {props.name}
        </h3>

        <p
          style={{
            margin: "5px 0 0",
            color: "#6b7890",
            fontSize: 9.3,
            lineHeight: 1.12,
            fontWeight: 700,
          }}
        >
          {props.subtitle}
        </p>

        <div
          style={{
            marginTop: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            borderRadius: 999,
            background: props.verified ? "rgba(31,164,91,0.10)" : "rgba(148,163,184,0.14)",
            color: props.verified ? "#1fa45b" : "#64748b",
            padding: "4px 6px",
            fontSize: 8,
            lineHeight: 1.08,
            fontWeight: 640,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {props.verified ? "Verified" : "Pending"}
        </div>
      </div>
    </a>
  );
}


type SpmTrailPreviewData = {
  trailName?: string;
  trailStatus?: string;
  stopsTotal?: number;
  stopsCompleted?: number;
  progressPercentage?: number;
  unlockRule?: string | null;
  iconKey?: string | null;
  source?: string;
};

function SpmTrailCardsPreview({ trails }: { trails?: unknown[] }) {
  const journeyCards = [
    {
      eyebrow: "Your Trips",
      title: "Continue saved Siargao plans",
      description: "Open saved routes, booking records, trip details, and active journey context.",
      href: "/traveler/trips",
      metric: trails?.length ? `${trails.length} trail options` : "Trip records",
      visual: "🧳",
      cta: "View Trips",
    },
    {
      eyebrow: "Your Pass",
      title: "Open your OSP QR identity",
      description: "Use your traveler QR identity and trip pass for supported OSP journey actions.",
      href: "/traveler/pass",
      metric: "QR ready",
      visual: "🎫",
      cta: "Open My Pass",
    },
    {
      eyebrow: "Payments",
      title: "Review payments and receipts",
      description: "Check booking-linked payment records, receipts, and payment readiness.",
      href: "/traveler/payments",
      metric: "Receipt layer",
      visual: "🧾",
      cta: "View Payments",
    },
  ];

  return (
    <section
      aria-label="Continue Your Journey"
      style={{
        marginTop: 18,
        borderRadius: 28,
        background: "linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 100%)",
        border: "1px solid rgba(0,151,167,0.18)",
        boxShadow: "0 18px 44px rgba(1,56,99,0.09)",
        padding: 14,
      }}
    >
      <div>
        <div style={{ fontSize: 9.5, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0097A7" }}>
          Continue Your Journey
        </div>
        <h2 style={{ margin: "6px 0 0", fontSize: 25, lineHeight: 1, fontWeight: 950, letterSpacing: "-0.055em", color: "#013863" }}>
          Your active Passport journey control panel.
        </h2>
        <p style={{ margin: "8px 0 0", color: "#50668B", fontSize: 13.2, lineHeight: 1.42, fontWeight: 760 }}>
          Pick up where your Siargao Passport journey left off.
        </p>
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {journeyCards.map((card) => (
          <a
            key={card.title}
            href={card.href}
            aria-label={`${card.eyebrow}: ${card.title}`}
            style={{
              display: "block",
              color: "inherit",
              textDecoration: "none",
              borderRadius: 22,
              background: "linear-gradient(135deg, #FFFFFF 0%, #EAFBFA 100%)",
              border: "1px solid rgba(0,151,167,0.16)",
              boxShadow: "0 12px 28px rgba(1,56,99,0.07)",
              padding: 13,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 11, alignItems: "start" }}>
              <div
                style={{
                  width: 48,
                  minHeight: 50,
                  borderRadius: 18,
                  background: "#FFFFFF",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 22,
                  border: "1px solid rgba(1,56,99,0.08)",
                }}
              >
                {card.visual}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#0097A7", fontSize: 8.6, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
                  {card.eyebrow}
                </div>
                <h3 style={{ margin: "4px 0 0", color: "#013863", fontSize: 17.5, lineHeight: 1.03, fontWeight: 950, letterSpacing: "-0.04em" }}>
                  {card.title}
                </h3>
                <p style={{ margin: "7px 0 0", color: "#50668B", fontSize: 12.2, lineHeight: 1.35, fontWeight: 730 }}>
                  {card.description}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 11 }}>
              <span
                style={{
                  borderRadius: 999,
                  background: "#FFFFFF",
                  border: "1px solid rgba(1,56,99,0.08)",
                  color: "#013863",
                  padding: "7px 9px",
                  fontSize: 9.5,
                  fontWeight: 900,
                }}
              >
                {card.metric}
              </span>
              <span
                style={{
                  minHeight: 40,
                  borderRadius: 15,
                  background: "linear-gradient(135deg, rgba(5,150,165,0.12), rgba(1,56,99,0.08))",
                  color: "#047f91",
                  border: "1px solid rgba(5,150,165,0.16)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 12px",
                  fontSize: 11,
                  fontWeight: 950,
                  whiteSpace: "nowrap",
                }}
              >
                {card.cta}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}


function TrailPreviewCard(props: {
  title: string;
  progressLabel: string;
  progressPercent: number;
  variant: "coast" | "lagoon" | "locked";
  accent: string;
  icon: string;
  governed: boolean;
}) {
  const isLocked = props.variant === "locked";

  const artBackground =
    props.variant === "coast"
      ? "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.0) 100%), linear-gradient(135deg, #90d7e6 0%, #dff5f7 38%, #f4f8db 68%, #e8d3a6 100%)"
      : props.variant === "lagoon"
        ? "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.0) 100%), linear-gradient(135deg, #8fd7f2 0%, #dff6ff 36%, #e8f7df 70%, #c9e7c2 100%)"
        : "linear-gradient(135deg, rgba(226,232,240,0.95) 0%, rgba(248,250,252,0.98) 100%)";

  const cardBackground = isLocked
    ? "linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(241,245,249,0.96) 100%)"
    : "rgba(255,255,255,0.98)";

  return (
    <a
      href="/traveler/passport-trails/follow-map"
      aria-label={`${props.title} passport card. ${props.governed ? "Governed progress." : "Passport journey card."}`}
      style={{
        minHeight: 132,
        borderRadius: 18,
        border: "1px solid rgba(203,213,225,0.84)",
        background: cardBackground,
        boxShadow: "0 10px 26px rgba(15,23,42,0.06)",
        opacity: props.governed ? 1 : 0.82,
        textDecoration: "none",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "72px auto auto",
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: 72,
          background: artBackground,
          borderBottom: "1px solid rgba(226,232,240,0.78)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isLocked
              ? "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(226,232,240,0.45) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0.00) 0%, rgba(20,38,75,0.08) 100%)",
          }}
        />

        {!isLocked ? (
          <>
            <div
              style={{
                position: "absolute",
                left: 10,
                top: 9,
                width: 28,
                height: 30,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.94)",
                boxShadow: "0 8px 18px rgba(15,23,42,0.10)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 12,
                top: 11,
                width: 36,
                height: 2,
                borderRadius: 999,
                background: "rgba(255,255,255,0.72)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 12,
                top: 20,
                width: 34,
                height: 2,
                borderRadius: 999,
                background: "rgba(255,255,255,0.58)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 28,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.62) 100%)",
              }}
            />
          </>
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 24% 24%, rgba(148,163,184,0.22) 0, rgba(148,163,184,0.22) 14px, transparent 15px), radial-gradient(circle at 72% 22%, rgba(148,163,184,0.18) 0, rgba(148,163,184,0.18) 16px, transparent 17px), linear-gradient(180deg, rgba(255,255,255,0.0) 0%, rgba(148,163,184,0.12) 100%)",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            left: 10,
            bottom: 8,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: isLocked ? "#9aa5b1" : props.accent,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            boxShadow: "0 8px 18px rgba(15,23,42,0.12)",
          }}
        >
          {props.icon}
        </div>
      </div>

      <div
        style={{
          padding: "8px 9px 0",
          minWidth: 0,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#14264b",
            fontSize: 11.5,
            lineHeight: 1.16,
            fontWeight: 640,
            letterSpacing: "-0.03em",
          }}
        >
          {props.title}
        </h3>
      </div>

      <div
        style={{
          padding: "6px 9px 9px",
          alignSelf: "end",
        }}
      >
        {isLocked ? (
          <div
            style={{
              color: "#7b8798",
              fontSize: 10,
              lineHeight: 1.22,
              fontWeight: 580,
            }}
          >
            {props.progressLabel}
          </div>
        ) : (
          <>
            <div
              style={{
                color: "#067889",
                fontSize: 11,
                lineHeight: 1.15,
                fontWeight: 590,
              }}
            >
              {props.progressLabel}
            </div>

            <div
              style={{
                marginTop: 6,
                height: 5,
                borderRadius: 999,
                background: "rgba(148,163,184,0.22)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.max(0, Math.min(100, props.progressPercent))}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: props.accent,
                }}
              />
            </div>
          </>
        )}
      </div>
    </a>
  );
}


type SpmMetricsPreviewData = {
  trailsUnlocked?: number;
  placesVerified?: number;
  journeyProgressPercent?: number;
  passStatus?: string | null;
};

function SpmLegendAndStatus(props: { metrics?: SpmMetricsPreviewData | null; emptyState?: boolean | null }) {
  const metrics = props.metrics;
  const trailsUnlocked = metrics?.trailsUnlocked ?? 0;
  const placesVerified = metrics?.placesVerified ?? 0;
  const journeyProgress = metrics?.journeyProgressPercent ?? 0;
  const passStatus = metrics?.passStatus ?? "Active";

  return (
    <div
      aria-label="SPM verified progress summary"
      style={{
        marginTop: 12,
        width: "100%",
        maxWidth: 210,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.22)",
        background: "linear-gradient(145deg, rgba(255,255,255,0.10), rgba(234,251,250,0.035))",
        boxShadow: "0 10px 24px rgba(1,56,99,0.04), inset 0 1px 0 rgba(255,255,255,0.10)",
        padding: "7px 7px 6px",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 7,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            minWidth: 0,
            color: "rgba(255,255,255,0.96)",
            fontSize: 8.9,
            fontWeight: 950,
            letterSpacing: "0.095em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            textShadow: "0 1px 4px rgba(1,36,64,0.62)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: props.emptyState ? "#8b95a1" : "#f2b705",
              boxShadow: "0 0 0 3px rgba(242,183,5,0.14)",
              flex: "0 0 auto",
            }}
          />
          {props.emptyState ? "No Stamps Yet" : "Verified Progress"}
        </div>

        <div
          style={{
            fontSize: 9,
            fontWeight: 950,
            color: "rgba(255,255,255,0.92)",
            whiteSpace: "nowrap",
            textShadow: "0 1px 4px rgba(1,36,64,0.58)",
          }}
        >
          Record-based
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 5,
        }}
      >
        <HeroMetric value={String(trailsUnlocked)} label="Trails" tone="#13a8b7" />
        <HeroMetric value={String(placesVerified)} label="Places" tone="#59aa61" />
        <HeroMetric value={`${journeyProgress}%`} label="Progress" tone="#168fe3" />
        <HeroMetric value={passStatus} label="QR" tone="#f2b705" />
      </div>

      <div
        aria-hidden="true"
        style={{
          marginTop: 7,
          height: 4,
          borderRadius: 999,
          background: "rgba(203,213,225,0.58)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(0, Math.min(100, journeyProgress))}%`,
            height: "100%",
            borderRadius: 999,
            background: "linear-gradient(90deg, #13a8b7, #16a34a)",
          }}
        />
      </div>
    </div>
  );
}

function HeroMetric(props: { value: string; label: string; tone: string }) {
  return (
    <div
      style={{
        minWidth: 0,
        minHeight: 44,
        borderRadius: 14,
        background: "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(234,251,250,0.018))",
        border: "1px solid rgba(255,255,255,0.16)",
        padding: "5px 3px",
        display: "grid",
        alignContent: "center",
        justifyItems: "center",
        gap: 2,
        boxShadow: "0 5px 12px rgba(1,56,99,0.02), inset 0 1px 0 rgba(255,255,255,0.08)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          color: "rgba(255,255,255,0.98)",
          fontSize: 11.8,
          lineHeight: 1,
          fontWeight: 950,
          letterSpacing: "-0.025em",
          textShadow: "0 1px 5px rgba(1,36,64,0.68)",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {props.value}
      </div>
      <div
        style={{
          color: "rgba(255,255,255,0.88)",
          fontSize: 7.2,
          lineHeight: 1,
          fontWeight: 880,
          letterSpacing: "0.035em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          textShadow: "0 1px 4px rgba(1,36,64,0.62)",
        }}
      >
        {props.label}
      </div>
    </div>
  );
}

function LegendItem(props: {
  color: string;
  label: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        color: "#42526b",
        fontSize: 11,
        fontWeight: 580,
      }}
    >
      <span
        style={{
          width: 11,
          height: 11,
          borderRadius: "50%",
          background: props.color,
          boxShadow: "0 2px 6px rgba(15,23,42,0.12)",
        }}
      />
      {props.label}
    </div>
  );
}

function LegendRouteItem(props: {
  label: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        color: "#42526b",
        fontSize: 11,
        fontWeight: 580,
      }}
    >
      <span
        style={{
          width: 18,
          height: 0,
          borderTop: "3px dashed #1976d2",
          display: "inline-block",
        }}
      />
      {props.label}
    </div>
  );
}


function SpmMapVisualPreview() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: -8,
        height: 304,
        zIndex: 1,
        borderRadius: "24px 24px 0 0",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <img
        src="/spm/spm-own-map-canvas.png"
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          transform: "scale(1)",
          transformOrigin: "center center",
          display: "block",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 28,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(246,251,253,0.88) 72%, rgba(246,251,253,1) 100%)",
        }}
      />
    </div>
  );
}


function PreviewPin(props: {
  x: number;
  y: number;
  type: "completed" | "available" | "locked";
}) {
  const isCompleted = props.type === "completed";
  const isAvailable = props.type === "available";

  return (
    <g filter="url(#spmPinShadow)" transform={`translate(${props.x - 17} ${props.y - 34})`}>
      <path
        d="M17 0C7.8 0 0 7.5 0 16.8C0 29.4 17 39 17 39C17 39 34 29.4 34 16.8C34 7.5 26.2 0 17 0Z"
        fill={isCompleted ? "#1fa45b" : isAvailable ? "#13a8b7" : "#8b95a1"}
      />
      <circle cx="17" cy="16.5" r="10.2" fill={isAvailable ? "#ffffff" : "rgba(255,255,255,0.2)"} />
      {isCompleted ? (
        <path d="M11.2 16.6l4 4.2 8-9" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      ) : null}
      {isAvailable ? (
        <circle cx="17" cy="16.5" r="6" fill="#13a8b7" />
      ) : null}
      {!isCompleted && !isAvailable ? (
        <>
          <rect x="12" y="15" width="10" height="8" rx="2" fill="#ffffff" />
          <path d="M14 15v-2.4a3 3 0 0 1 6 0V15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : null}
    </g>
  );
}

function MapLabel(props: {
  text: string;
  top: number;
  right: number;
}) {
  return (
    <span
      style={{
        position: "absolute",
        top: props.top,
        right: props.right,
        color: "#25344d",
        fontSize: 10,
        lineHeight: 1.08,
        fontWeight: 590,
        textShadow: "0 1px 2px rgba(255,255,255,0.95)",
        whiteSpace: "nowrap",
      }}
    >
      {props.text}
    </span>
  );
}


function NavIcon(props: {
  type: "map" | "trail" | "pass" | "profile";
  active?: boolean;
}) {
  if (props.type === "map") {
    return (
      <svg viewBox="0 0 24 24" width="27" height="27" fill={props.active ? "currentColor" : "none"}>
        <path
          d="M3.5 5.8 8.7 3.8l6.6 2.4 5.2-2v14l-5.2 2-6.6-2.4-5.2 2v-14Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M8.7 3.8v14M15.3 6.2v14" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (props.type === "trail") {
    return (
      <svg viewBox="0 0 24 24" width="27" height="27" fill="none">
        <path
          d="M6 18c3-7 9-5 12-12"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
        <circle cx="6" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="18" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (props.type === "pass") {
    return (
      <svg viewBox="0 0 24 24" width="27" height="27" fill="none">
        <rect x="5" y="4" width="14" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="27" height="27" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 20a6.5 6.5 0 0 1 13 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


function SpmJourneyHubEngagement() {
  const mapPins = [
    { label: "Cloud 9", x: "63%", y: "51%", tone: "#F3AE26", href: "/traveler/site-access/cloud-9" },
    { label: "General Luna", x: "56%", y: "66%", tone: "#0097A7", href: "/traveler/passport-trails?zone=general-luna" },
    { label: "Island Hopping", x: "43%", y: "74%", tone: "#013863", href: "/traveler/passport-trails/island-hopping?pin=island-hopping" },
    { label: "North Siargao", x: "49%", y: "25%", tone: "#F3AE26", href: "/traveler/passport-trails/north-siargao?pin=north-siargao" },
    { label: "Sugba Lagoon", x: "33%", y: "45%", tone: "#0097A7", href: "/traveler/partner-tours?focus=sugba-lagoon-adventure" },
  ];

  const trailChips = ["Official Trails", "Verified Stops", "Stamp Ready", "QR Journey"];

  return (
    <section
      aria-label="Continue Passport Trail with Siargao map preview"
      style={{
        marginTop: 18,
        borderRadius: 30,
        background: "linear-gradient(135deg, #013863 0%, #003B66 58%, #0097A7 100%)",
        color: "#FFFFFF",
        padding: 14,
        boxShadow: "0 22px 52px rgba(1,56,99,0.22)",
        border: "1px solid rgba(255,255,255,0.16)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 80% 8%, rgba(243,174,38,0.24), transparent 30%), radial-gradient(circle at 0% 100%, rgba(0,151,167,0.28), transparent 34%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 9.5, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase", color: "#F3AE26" }}>
          Continue Passport Trail
        </div>
        <h2 style={{ margin: "7px 0 0", fontSize: 27, lineHeight: 0.98, fontWeight: 950, letterSpacing: "-0.06em", color: "#FFFFFF" }}>
          Follow your trail across Siargao.
        </h2>
        <p style={{ margin: "9px 0 0", color: "rgba(255,255,255,0.84)", fontSize: 13.4, lineHeight: 1.42, fontWeight: 760 }}>
          Preview verified stops, trail paths, and Passport-ready moments before opening the full journey map.
        </p>

        <div
          style={{
            marginTop: 14,
            borderRadius: 26,
            background: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.24)",
            boxShadow: "0 18px 42px rgba(0,0,0,0.18)",
            padding: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: 22,
              minHeight: 280,
              overflow: "hidden",
              background: "#EAFBFA",
              border: "1px solid rgba(1,56,99,0.10)",
            }}
          >
            <img
              src="/spm/spm-own-map-canvas.png"
              alt="Siargao Passport Map preview"
              style={{
                width: "100%",
                height: 280,
                objectFit: "cover",
                display: "block",
                filter: "saturate(1.05) contrast(1.02)",
              }}
            />

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(1,56,99,0.05) 0%, rgba(1,56,99,0.16) 100%)",
                pointerEvents: "none",
              }}
            />

            <div
              aria-label="Map zoom controls preview"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                display: "grid",
                gap: 7,
              }}
            >
              {["+", "−"].map((label) => (
                <span
                  key={label}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 13,
                    background: "rgba(255,255,255,0.94)",
                    border: "1px solid rgba(1,56,99,0.12)",
                    color: "#013863",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 18,
                    fontWeight: 950,
                    boxShadow: "0 8px 20px rgba(1,56,99,0.12)",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            {mapPins.map((pin) => (
              <a
                key={pin.label}
                href={pin.href}
                aria-label={`Open Passport Trails from ${pin.label} map pin`}
                style={{
                  position: "absolute",
                  left: pin.x,
                  top: pin.y,
                  transform: "translate(-50%, -50%)",
                  textDecoration: "none",
                  display: "grid",
                  placeItems: "center",
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: pin.tone,
                  border: "3px solid #FFFFFF",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 950,
                  boxShadow: "0 10px 24px rgba(1,56,99,0.24)",
                }}
                title={pin.label}
              >
                •
              </a>
            ))}

            <div
              style={{
                position: "absolute",
                left: 10,
                right: 10,
                bottom: 10,
                borderRadius: 18,
                background: "rgba(255,255,255,0.94)",
                border: "1px solid rgba(1,56,99,0.10)",
                padding: 10,
                boxShadow: "0 12px 30px rgba(1,56,99,0.14)",
              }}
            >
              <div style={{ color: "#013863", fontSize: 12, fontWeight: 950, letterSpacing: "-0.02em" }}>
                Passport Map Preview
              </div>
              <div style={{ marginTop: 4, color: "#50668B", fontSize: 11.2, lineHeight: 1.32, fontWeight: 780 }}>
                Pins preview verified stops and trail-ready zones. Full zoom and live pin behavior comes through the map engine lane.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 10 }}>
            {trailChips.map((chip) => (
              <span
                key={chip}
                style={{
                  borderRadius: 999,
                  background: "#F4FCFA",
                  border: "1px solid rgba(0,151,167,0.16)",
                  color: "#013863",
                  padding: "7px 9px",
                  fontSize: 9.8,
                  fontWeight: 900,
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            borderRadius: 24,
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.16)",
            padding: 12,
            display: "grid",
            gap: 9,
          }}
        >
          <a
            href="/traveler/passport-trails/follow-map"
            aria-label="Open Full Passport Map"
            style={{
              minHeight: 52,
              borderRadius: 17,
              background: "#F3AE26",
              color: "#013863",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 950,
              boxShadow: "0 14px 30px rgba(0,0,0,0.14)",
            }}
          >
            Open Passport Map
          </a>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            <a
              href="/traveler/pass"
              aria-label="View My Pass"
              style={{
                minHeight: 46,
                borderRadius: 16,
                background: "rgba(255,255,255,0.96)",
                color: "#013863",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 950,
              }}
            >
              View My Pass
            </a>
            <a
              href="/traveler/settings?panel=assistant&topic=map"
              aria-label="Ask Kuya Tala"
              style={{
                minHeight: 46,
                borderRadius: 16,
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 950,
              }}
            >
              Ask Kuya Tala™
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


function SpmFeaturedPartnerTours() {
  const partnerTours = [
    {
      eyebrow: "Operator Console",
      title: "Tri-Island Joiner Tour",
      description: "Approved local operator supply for the classic General Luna island-hopping flow.",
      duration: "Joiner route",
      bestFor: "Island hopping",
      indicator: "Operator-backed",
      href: "/traveler/partner-tours?focus=tri-island-joiner",
      visual: "🚤",
      tone: "#047f91",
    },
    {
      eyebrow: "Operator Console",
      title: "Siargao Land Tour Highlights",
      description: "Land route supply prepared for partner confirmation and mobile booking readiness.",
      duration: "Full-day route",
      bestFor: "Land tour",
      indicator: "Approved partner",
      href: "/traveler/partner-tours?focus=land-tour-highlights",
      visual: "🌴",
      tone: "#013863",
    },
    {
      eyebrow: "Operator Console",
      title: "Sugba Lagoon Adventure",
      description: "Partner-sourced lagoon tour exposure with confirmation-ready operator context.",
      duration: "Day trip",
      bestFor: "Lagoon route",
      indicator: "Confirmation-ready",
      href: "/traveler/partner-tours?focus=sugba-lagoon-adventure",
      visual: "🛶",
      tone: "#047f91",
    },
    {
      eyebrow: "Operator Console",
      title: "North Siargao Local Route",
      description: "North route exposure prepared for approved operators and governed discovery.",
      duration: "Flexible",
      bestFor: "Scenic stops",
      indicator: "Supply-ready",
      href: "/traveler/partner-tours?focus=north-siargao-local-route",
      visual: "🛣️",
      tone: "#8A5A00",
    },
  ];

  return (
    <section
      aria-label="Featured Siargao Partner Tours"
      style={{
        marginTop: 16,
        borderRadius: 28,
        padding: 14,
        background: "linear-gradient(145deg, #ffffff 0%, #f4fcfa 58%, #fff8e8 100%)",
        border: "1px solid rgba(5,150,165,0.16)",
        boxShadow: "0 16px 38px rgba(1,56,99,0.075)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#047f91",
              fontSize: 9.5,
              fontWeight: 950,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Featured Partner Tours
          </div>
          <h2
            style={{
              margin: "5px 0 0",
              color: "#013863",
              fontSize: 18.5,
              lineHeight: 1.02,
              fontWeight: 950,
              letterSpacing: "-0.05em",
            }}
          >
            Operator-backed routes.
          </h2>
        </div>

        <span
          style={{
            borderRadius: 999,
            padding: "6px 9px",
            background: "#ffffff",
            border: "1px solid rgba(5,150,165,0.14)",
            color: "#047f91",
            fontSize: 9.5,
            fontWeight: 950,
            whiteSpace: "nowrap",
          }}
        >
          Console-ready
        </span>
      </div>

      <p
        style={{
          margin: "6px 0 0",
          color: "#50668B",
          fontSize: 10.8,
          lineHeight: 1.38,
          fontWeight: 760,
        }}
      >
        This block is structured as the traveler-facing exposure surface for approved Tour Operator Console supply.
      </p>

      <div
        aria-label="Featured partner tour cards"
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          padding: "13px 2px 4px",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {partnerTours.map((tour) => (
          <a
            key={tour.title}
            href={tour.href}
            aria-label={`View Partner Tour: ${tour.title}`}
            style={{
              flex: "0 0 238px",
              scrollSnapAlign: "start",
              minHeight: 178,
              borderRadius: 24,
              padding: 12,
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(234,251,250,0.92) 60%, rgba(255,248,232,0.82) 100%)",
              border: "1px solid rgba(5,150,165,0.16)",
              boxShadow: "0 12px 28px rgba(1,56,99,0.07)",
              color: "inherit",
              textDecoration: "none",
              display: "grid",
              alignContent: "space-between",
              gap: 10,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at 92% 8%, rgba(5,150,165,0.14), transparent 34%)",
              }}
            />

            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 17,
                  background: "#ffffff",
                  border: "1px solid rgba(5,150,165,0.14)",
                  color: tour.tone,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  boxShadow: "0 8px 18px rgba(1,56,99,0.055)",
                }}
              >
                {tour.visual}
              </span>

              <span
                style={{
                  height: 24,
                  borderRadius: 999,
                  padding: "0 8px",
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#ffffff",
                  border: "1px solid rgba(5,150,165,0.14)",
                  color: "#047f91",
                  fontSize: 8.6,
                  fontWeight: 950,
                  whiteSpace: "nowrap",
                }}
              >
                {tour.indicator}
              </span>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ color: tour.tone, fontSize: 8.7, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
                {tour.eyebrow}
              </div>
              <h3
                style={{
                  margin: "5px 0 0",
                  color: "#013863",
                  fontSize: 15,
                  lineHeight: 1.05,
                  fontWeight: 950,
                  letterSpacing: "-0.04em",
                }}
              >
                {tour.title}
              </h3>
              <p
                style={{
                  margin: "7px 0 0",
                  color: "#50668B",
                  fontSize: 10.7,
                  lineHeight: 1.32,
                  fontWeight: 740,
                }}
              >
                {tour.description}
              </p>
            </div>

            <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              {[tour.duration, tour.bestFor].map((item) => (
                <span
                  key={item}
                  style={{
                    borderRadius: 999,
                    padding: "6px 7px",
                    background: "rgba(255,255,255,0.80)",
                    border: "1px solid rgba(1,56,99,0.07)",
                    color: "#50668B",
                    fontSize: 8.8,
                    fontWeight: 850,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <span
              style={{
                position: "relative",
                zIndex: 1,
                minHeight: 31,
                borderRadius: 999,
                background: "linear-gradient(135deg, rgba(5,150,165,0.12), rgba(243,174,38,0.10))",
                border: "1px solid rgba(5,150,165,0.15)",
                color: "#047f91",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 950,
              }}
            >
              View Partner Tour →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}


function SpmCuratedPassportTours() {
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

  return (
    <section
      aria-label="Official Passport Trails"
      style={{
        marginTop: 16,
        borderRadius: 28,
        padding: 12,
        background:
          "linear-gradient(145deg, rgba(234,251,250,0.92) 0%, rgba(255,255,255,0.98) 55%, rgba(255,248,232,0.86) 100%)",
        border: "1px solid rgba(5,150,165,0.16)",
        boxShadow: "0 16px 38px rgba(1,56,99,0.075)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#047f91",
              fontSize: 9.5,
              fontWeight: 950,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Official Passport Trails
          </div>
          <h2
            style={{
              margin: "5px 0 0",
              color: "#013863",
              fontSize: 18.5,
              lineHeight: 1.02,
              fontWeight: 950,
              letterSpacing: "-0.05em",
            }}
          >
            Real Siargao trail routes.
          </h2>
        </div>

        <span
          style={{
            borderRadius: 999,
            padding: "6px 9px",
            background: "#ffffff",
            border: "1px solid rgba(5,150,165,0.14)",
            color: "#047f91",
            fontSize: 9.5,
            fontWeight: 950,
            whiteSpace: "nowrap",
          }}
        >
          8 locked
        </span>
      </div>

      <p
        style={{
          margin: "6px 0 0",
          color: "#50668B",
          fontSize: 10.8,
          lineHeight: 1.35,
          fontWeight: 760,
        }}
      >
        Island hopping, land tours, surf, community, merchant, and continuity trails aligned to real traveler behavior.
      </p>

      <div
        aria-label="Official Passport Trail cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 7,
          marginTop: 10,
        }}
      >
        {officialTrails.map((trail) => (
          <a
            key={trail.title}
            href={trail.href}
            aria-label={`Open ${trail.title}`}
            style={{
              minHeight: 124,
              borderRadius: 19,
              padding: 9,
              background: trail.shell,
              border: "1px solid rgba(5,150,165,0.15)",
              boxShadow: "0 10px 24px rgba(1,56,99,0.06)",
              color: "inherit",
              textDecoration: "none",
              display: "grid",
              alignContent: "space-between",
              gap: 7,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -22,
                top: -28,
                width: 86,
                height: 86,
                borderRadius: 999,
                background: "rgba(5,150,165,0.07)",
              }}
            />

            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", gap: 7 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 31,
                  height: 31,
                  borderRadius: 13,
                  background: "#ffffff",
                  border: "1px solid rgba(5,150,165,0.14)",
                  color: trail.tone,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  boxShadow: "0 8px 18px rgba(1,56,99,0.05)",
                  flex: "0 0 auto",
                }}
              >
                {trail.icon}
              </span>

              <span
                style={{
                  height: 20,
                  borderRadius: 999,
                  padding: "0 6px",
                  display: "inline-flex",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(1,56,99,0.07)",
                  color: trail.tone,
                  fontSize: 7.8,
                  fontWeight: 950,
                  whiteSpace: "nowrap",
                }}
              >
                {trail.badge}
              </span>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  color: trail.tone,
                  fontSize: 7.9,
                  fontWeight: 950,
                  letterSpacing: "0.11em",
                  textTransform: "uppercase",
                }}
              >
                {trail.hierarchy}
              </div>
              <h3
                style={{
                  margin: "3px 0 0",
                  color: "#013863",
                  fontSize: 11.5,
                  lineHeight: 1.05,
                  fontWeight: 950,
                  letterSpacing: "-0.035em",
                }}
              >
                {trail.title}
              </h3>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "#50668B",
                  fontSize: 8.7,
                  lineHeight: 1.18,
                  fontWeight: 750,
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
                gap: 5,
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                {[trail.behavior, trail.support].map((item) => (
                  <span
                    key={item}
                    style={{
                      minHeight: 21,
                      borderRadius: 999,
                      padding: "0 6px",
                      background: "rgba(255,255,255,0.76)",
                      border: "1px solid rgba(1,56,99,0.06)",
                      color: "#50668B",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 7.4,
                      fontWeight: 850,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <span
                style={{
                  minHeight: 24,
                  borderRadius: 999,
                  background: "rgba(5,150,165,0.10)",
                  border: "1px solid rgba(5,150,165,0.14)",
                  color: "#047f91",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8.5,
                  fontWeight: 950,
                }}
              >
                View Trail →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}


function SpmBuildYourOwnTrailSection() {
  return (
    <section
      aria-label="Build Your Own Passport Trail"
      style={{
        marginTop: 18,
        borderRadius: 28,
        background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8EA 48%, #F4FCFA 100%)",
        border: "1px solid rgba(243,174,38,0.35)",
        boxShadow: "0 18px 44px rgba(1,56,99,0.09)",
        padding: 14,
      }}
    >
      <a
        href="/traveler/passport-trails/diy-trail-builder"
        aria-label="Start DIY Passport Trail Builder"
        style={{
          display: "block",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        <div style={{ fontSize: 9.5, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8A5A00" }}>
          Build Your Own Passport Trail
        </div>
        <h2 style={{ margin: "6px 0 0", fontSize: 25, lineHeight: 1, fontWeight: 950, letterSpacing: "-0.055em", color: "#013863" }}>
          Create a flexible route from verified stops.
        </h2>
        <p style={{ margin: "8px 0 0", color: "#50668B", fontSize: 13.2, lineHeight: 1.42, fontWeight: 760 }}>
          Choose verified stops, compare route ideas, review stamp opportunities, and prepare your custom trail request.
        </p>

        <div
          style={{
            marginTop: 14,
            borderRadius: 24,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.07)",
            padding: 14,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "54px 1fr", gap: 12, alignItems: "start" }}>
            <div
              style={{
                width: 54,
                minHeight: 58,
                borderRadius: 20,
                background: "#FFF8EA",
                border: "1px solid rgba(243,174,38,0.30)",
                display: "grid",
                placeItems: "center",
                fontSize: 25,
              }}
            >
              🧩
            </div>
            <div>
              <div style={{ color: "#8A5A00", fontSize: 8.8, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
                DIY Passport Trail Builder
              </div>
              <h3 style={{ margin: "4px 0 0", color: "#013863", fontSize: 19.5, lineHeight: 1.02, fontWeight: 950, letterSpacing: "-0.045em" }}>
                Build your route around your travel style.
              </h3>
              <p style={{ margin: "7px 0 0", color: "#50668B", fontSize: 12.4, lineHeight: 1.38, fontWeight: 730 }}>
                Flexible route planning with verified stops available and partner support only where needed.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
            <div style={{ borderRadius: 15, background: "#F4FCFA", border: "1px solid rgba(0,151,167,0.12)", padding: "9px 10px" }}>
              <div style={{ color: "#50668B", fontSize: 8.5, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>Duration</div>
              <div style={{ marginTop: 3, color: "#013863", fontSize: 11.4, lineHeight: 1.15, fontWeight: 900 }}>Flexible</div>
            </div>
            <div style={{ borderRadius: 15, background: "#F4FCFA", border: "1px solid rgba(0,151,167,0.12)", padding: "9px 10px" }}>
              <div style={{ color: "#50668B", fontSize: 8.5, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>Best for</div>
              <div style={{ marginTop: 3, color: "#013863", fontSize: 11.4, lineHeight: 1.15, fontWeight: 900 }}>Independent travelers, repeat visitors, custom groups</div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              minHeight: 44,
              borderRadius: 16,
              background: "#013863",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 950,
            }}
          >
            Start DIY Trail
          </div>
        </div>
      </a>
    </section>
  );
}


function SpmGuideSupportProvidedBy() {
  const guideMenus = [
    {
      eyebrow: "Local Host",
      title: "Approved local guide support",
      description: "Use local support when a route benefits from hosted movement, context, or confidence.",
      support: "Host-ready",
      note: "Profile-ready",
      href: "/traveler/partner-tours?focus=featured-guides",
      visual: "🧑‍✈️",
      tone: "#047f91",
      shell: "linear-gradient(145deg, #ffffff 0%, #eafbfa 60%, #ffffff 100%)",
    },
    {
      eyebrow: "Partner Guided",
      title: "Partner-guided tours",
      description: "Operator-led route assistance for travelers who prefer structured local support.",
      support: "Partner guide",
      note: "Operator-backed",
      href: "/traveler/partner-tours?focus=partner-guided",
      visual: "🚐",
      tone: "#013863",
      shell: "linear-gradient(145deg, #ffffff 0%, #eefbff 60%, #ffffff 100%)",
    },
    {
      eyebrow: "Official Route",
      title: "Follow SPM-curated routes",
      description: "Use SPM route logic when you want official stops, stamp flow, and less confusion.",
      support: "SPM-guided",
      note: "Official route",
      href: "/traveler/passport-trails?focus=official-guidance",
      visual: "🗺️",
      tone: "#047f91",
      shell: "linear-gradient(145deg, #ffffff 0%, #f4fcfa 60%, #fff8e8 100%)",
    },
    {
      eyebrow: "DIY Support",
      title: "Build your own trail with support",
      description: "Plan a custom Passport route and request help only when your journey needs it.",
      support: "DIY-friendly",
      note: "Support optional",
      href: "/traveler/passport-trails/diy-trail-builder?support=available",
      visual: "✨",
      tone: "#8A5A00",
      shell: "linear-gradient(145deg, #ffffff 0%, #fff8e8 60%, #ffffff 100%)",
    },
  ];

  return (
    <section
      aria-label="Guide Support for Your Passport Journey"
      style={{
        marginTop: 16,
        borderRadius: 28,
        padding: 14,
        background: "linear-gradient(145deg, #ffffff 0%, #f4fcfa 56%, #ffffff 100%)",
        border: "1px solid rgba(5,150,165,0.16)",
        boxShadow: "0 16px 38px rgba(1,56,99,0.075)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: "#047f91", fontSize: 9.5, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Guide Support
          </div>
          <h2 style={{ margin: "5px 0 0", color: "#013863", fontSize: 20, lineHeight: 1.02, fontWeight: 950, letterSpacing: "-0.05em" }}>
            Choose your support style.
          </h2>
        </div>

        <span
          style={{
            borderRadius: 999,
            padding: "6px 9px",
            background: "#ffffff",
            border: "1px solid rgba(5,150,165,0.14)",
            color: "#047f91",
            fontSize: 9.5,
            fontWeight: 950,
            whiteSpace: "nowrap",
          }}
        >
          Optional
        </span>
      </div>

      <p style={{ margin: "8px 0 0", color: "#50668B", fontSize: 11.7, lineHeight: 1.38, fontWeight: 760 }}>
        Partner-guided, SPM-guided, or DIY with support only when needed. No strip layout, no heavy reading.
      </p>

      <div
        aria-label="Guide support decision cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 9,
          marginTop: 13,
        }}
      >
        {guideMenus.map((card) => (
          <a
            key={card.title}
            href={card.href}
            aria-label={`${card.eyebrow}: ${card.title}`}
            style={{
              minHeight: 136,
              borderRadius: 21,
              padding: 11,
              background: card.shell,
              border: "1px solid rgba(5,150,165,0.14)",
              boxShadow: "0 10px 24px rgba(1,56,99,0.06)",
              color: "inherit",
              textDecoration: "none",
              display: "grid",
              alignContent: "space-between",
              gap: 9,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 7 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 15,
                  background: "#ffffff",
                  border: "1px solid rgba(5,150,165,0.14)",
                  color: card.tone,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 17,
                  boxShadow: "0 8px 18px rgba(1,56,99,0.05)",
                }}
              >
                {card.visual}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "4px 7px",
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(1,56,99,0.07)",
                  color: card.tone,
                  fontSize: 8.3,
                  fontWeight: 950,
                  whiteSpace: "nowrap",
                }}
              >
                {card.note}
              </span>
            </div>

            <div>
              <div style={{ color: card.tone, fontSize: 8.6, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
                {card.eyebrow}
              </div>
              <h3 style={{ margin: "4px 0 0", color: "#013863", fontSize: 12.8, lineHeight: 1.05, fontWeight: 950, letterSpacing: "-0.035em" }}>
                {card.title}
              </h3>
              <p style={{ margin: "5px 0 0", color: "#50668B", fontSize: 9.5, lineHeight: 1.24, fontWeight: 750 }}>
                {card.description}
              </p>
            </div>

            <span
              style={{
                minHeight: 28,
                borderRadius: 999,
                background: "rgba(5,150,165,0.10)",
                border: "1px solid rgba(5,150,165,0.14)",
                color: "#047f91",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9.4,
                fontWeight: 950,
              }}
            >
              {card.support} →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}


function SpmPassportRewardsRetention() {
  return (
    <section
      aria-label="Passport Rewards and Return Traveler Continuity"
      style={{
        marginTop: 18,
        border: "1px solid #bfe7ee",
        borderRadius: 28,
        background: "linear-gradient(135deg, rgba(255,252,239,0.98), rgba(239,253,255,0.96))",
        padding: 16,
        boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 720, letterSpacing: "0.13em", textTransform: "uppercase", color: "#c58a00" }}>
        Passport Rewards / Return Traveler Continuity
      </div>
      <h2 style={{ margin: "7px 0 8px", fontSize: 23, lineHeight: 1.06, fontWeight: 690, letterSpacing: "-0.04em", color: "#14264b" }}>
        Keep building your Siargao Passport.
      </h2>
      <p style={{ margin: "0 0 13px", fontSize: 12.5, lineHeight: 1.42, fontWeight: 600, color: "#53657d" }}>
        Unlock stamps, complete trails, and continue unfinished journeys across future trips. Rewards remain preview-only until governed activation.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        {[
          ["Live", "When verified"],
          ["SPM", "Record-based"],
          ["Next", "Unlock pending"],
        ].map(([value, label]) => (
          <div key={label} style={{ borderRadius: 16, background: "rgba(255,255,255,0.86)", padding: "10px 8px", border: "1px solid rgba(197,138,0,0.12)" }}>
            <div style={{ fontSize: 17, fontWeight: 760, color: "#14264b" }}>{value}</div>
            <div style={{ marginTop: 2, fontSize: 10, lineHeight: 1.15, fontWeight: 650, color: "#53657d" }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


function SpmPassportExperienceCards() {
  const experiences = [
    {
      icon: "🛶",
      label: "Siargao Partner Tour",
      title: "Explore a local tour",
      sub: "Partner-operated",
      badge: "Pricing required before booking",
      href: "/traveler/partner-tours",
      tone: "#13a8b7",
      cta: "↗ View Tours",
    },
    {
      icon: "🗺️",
      label: "Passport Trails™ Curated Tour",
      title: "Follow an official trail",
      sub: "SPM-guided",
      badge: "Stamps count when verified",
      href: "/traveler/passport-trails",
      tone: "#16a34a",
      cta: "⌁ Explore Trails",
    },
    {
      icon: "🧩",
      label: "Build Your Own Passport Trail",
      title: "Plan a curated route request",
      sub: "SPM-guided planning",
      badge: "Preview first",
      href: "/traveler/passport-trails",
      tone: "#8b5cf6",
      cta: "＋ Plan Route",
    },
  ];

  return (
    <section
      aria-label="Choose your Passport experience"
      style={{
        marginTop: 18,
        border: "1px solid #bfe7ee",
        borderRadius: 24,
        background: "linear-gradient(135deg, rgba(255,255,255,0.99), rgba(244,253,255,0.94))",
        padding: 12,
        boxShadow: "0 16px 38px rgba(8,61,103,0.10)",
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 820, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0796a6" }}>
        Choose Your Passport Experience
      </div>

      <h2 style={{ margin: "6px 0 10px", fontSize: 22, lineHeight: 1.02, fontWeight: 760, letterSpacing: "-0.05em", color: "#14264b" }}>
        What do you want to do?
      </h2>

      <div style={{ display: "grid", gap: 8 }}>
        {experiences.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-label={`Open ${item.label}`}
            style={{
              display: "grid",
              gridTemplateColumns: "36px 1fr 88px",
              alignItems: "center",
              gap: 8,
              border: "1px solid #bfe7ee",
              borderLeft: `5px solid ${item.tone}`,
              borderRadius: 18,
              background: "linear-gradient(135deg, rgba(255,255,255,0.99), rgba(244,253,255,0.94))",
              padding: "9px",
              minHeight: 76,
              color: "inherit",
              textDecoration: "none",
              boxShadow: "0 8px 20px rgba(8,61,103,0.045)",
            }}
          >
            <div
              style={{
                width: 38,
                minHeight: 40,
                borderRadius: 16,
                background: "rgba(226,250,255,0.96)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              {item.icon}
            </div>
<div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 8, fontWeight: 840, letterSpacing: "0.09em", textTransform: "uppercase", color: item.tone }}>
                {item.label}
              </div>
              <div style={{ marginTop: 2, fontSize: 14.5, fontWeight: 830, lineHeight: 1.02, color: "#14264b" }}>
                {item.title}
              </div>
              <div style={{ marginTop: 3, fontSize: 10.1, fontWeight: 680, color: "#53657d", lineHeight: 1.15 }}>
                {item.sub}
              </div>
              <div style={{ marginTop: 5, display: "inline-flex", borderRadius: 999, background: "rgba(242,246,248,0.95)", padding: "3px 6px", fontSize: 8.8, fontWeight: 760, color: "#355071" }}>
                {item.badge}
              </div>
            </div>

            <div
              style={{
                minHeight: 48,
                borderRadius: 16,
                background: item.tone,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                fontSize: 10.4,
                fontWeight: 860,
                lineHeight: 1.05,
                boxShadow: "0 10px 22px rgba(8,61,103,0.14)",
              }}
            >
              {item.cta}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}




