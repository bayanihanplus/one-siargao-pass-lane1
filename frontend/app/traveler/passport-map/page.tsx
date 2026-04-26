import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

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
        background: "#f5f9fc",
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
          background: "linear-gradient(180deg, #ffffff 0%, #eef6fa 48%, #ffffff 100%)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            padding: "16px 14px 18px",
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
              paddingRight: 42,
            }}
          >
            <a
              href="/"
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
                  objectFit: "contain",
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
                  fontSize: 25,
                  lineHeight: 1.08,
                  letterSpacing: "-0.056em",
                  color: "#14264b",
                  fontWeight: 590,
                  whiteSpace: "nowrap",
                  overflow: "visible",
                }}
              >
                Siargao Passport Map
              </h1>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#5f6f87",
                  fontSize: 13,
                  lineHeight: 1.16,
                  fontWeight: 590,
                  whiteSpace: "nowrap",
                  overflow: "visible",
                }}
              >
                Follow the Trails. Build the Journey.
              </p>
            </div>

            <a
              href="/traveler/settings?panel=notifications"
              aria-label="Open traveler notifications"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                color: "#14264b",
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(20,38,75,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                position: "absolute",
                top: 15,
                right: 0,
                boxShadow: "0 6px 14px rgba(15,23,42,0.05)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#ff5638",
                }}
              />
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
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
          </header>

          <section
            style={{
              marginTop: 16,
              height: "auto",
              borderRadius: 28,
              border: "1px solid rgba(19,168,183,0.16)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(235,248,252,0.96) 50%, rgba(255,255,255,0.98) 100%)",
              boxShadow: "0 20px 56px rgba(15,23,42,0.092)",
              padding: 18,
            }}
          >
            <div
              style={{
                height: 438,
                borderRadius: 24,
                background:
                  "radial-gradient(circle at 76% 16%, rgba(19,168,183,0.16) 0, transparent 78px), radial-gradient(circle at 22% 84%, rgba(242,183,5,0.15) 0, transparent 64px), linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(238,248,251,0.66) 52%, rgba(255,255,255,0.90) 100%)",
                padding: "18px 8px 18px",
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
                    fontSize: 29,
                    lineHeight: 0.98,
                    letterSpacing: "-0.052em",
                    color: "#14264b",
                    fontWeight: 590,
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
                    color: "#607089",
                    fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
                    fontSize: 12,
                    lineHeight: 1.3,
                    fontWeight: 400,
                    letterSpacing: "-0.003em",
                  }}
                >
                  Collect stamps. Unlock trails. Create memories that last.
                </p>
              </div>

              <SpmMapVisualPreview />

              <SpmLegendAndStatus metrics={spmPreview?.metrics} emptyState={spmPreview?.emptyState} />
            </div>
          </section>

          <SpmTrailCardsPreview trails={spmPreview?.trails} />

          <SpmVerifiedStopsPreview stops={spmPreview?.verifiedStops} />

          <SpmContinueJourneyPreview nextStop={spmPreview?.nextStop} />
          <SpmJourneyHubEngagement />
        </div>

        <nav
          style={{
            position: "sticky",
            bottom: 0,
            width: "100%",
            borderTop: "1px solid rgba(203,213,225,0.78)",
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(16px)",
            padding: "10px 28px 18px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            boxShadow: "0 -8px 28px rgba(15,23,42,0.05)",
          }}
        >
          <BottomNavItem href="/traveler/passport-map" label="Map" active icon="map" />
          <BottomNavItem href="/traveler/passport-trails" label="Trails" icon="trail" />
          <BottomNavItem href="/traveler/pass" label="Pass" icon="pass" />
          <BottomNavItem href="/" label="Profile" icon="profile" />
        </nav>
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
  const title = nextStop?.recommendedStopName ?? "Continue your Passport Trail";
  const reason = nextStop?.recommendationReason ?? "Choose a trail, visit verified stops, scan your OSP QR, and unlock Passport Stamps as you move.";
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
          background: "rgba(255,255,255,0.97)",
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
              height: 32,
              borderRadius: "50%",
              background: "#13a8b7",
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
              color: "#13a8b7",
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
                minHeight: 32,
                borderRadius: 999,
                background: "#13a8b7",
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
};

function SpmVerifiedStopsPreview(props: { stops?: SpmVerifiedStopPreviewData[] | null }) {
  const realStops = props.stops?.length ? props.stops.slice(0, 3) : [];
  const visualPaddingStops = [
    { stopName: "Passport stamp pending", subtitle: "Scan a governed OSP QR stop", verificationStatus: "available", source: "visual_padding" },
    { stopName: "Approved node available", subtitle: "Official discovery only", verificationStatus: "available", source: "visual_padding" },
    { stopName: "Trail progress waiting", subtitle: "No verified stamp yet", verificationStatus: "available", source: "visual_padding" },
  ];

  const stops = [...realStops, ...visualPaddingStops].slice(0, 3);
  return (
    <section
      aria-label="Verified stops cards"
      style={{
        marginTop: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
          padding: "0 2px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
              fontSize: 24,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
              color: "#14264b",
              fontWeight: 590,
            }}
          >
            Verified Stops
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12,
              lineHeight: 1.25,
              color: "#6b7890",
              fontWeight: 610,
            }}
          >
            Governed QR-validated stops appear first. Empty slots stay as visual placeholders.
          </p>
        </div>

        <a
          href="/traveler/passport-map"
          aria-label="See all verified stops"
          style={{
            minHeight: 30,
            borderRadius: 999,
            border: "1px solid rgba(19,168,183,0.20)",
            background: "rgba(236,254,255,0.86)",
            color: "#13a8b7",
            fontSize: 11,
            fontWeight: 640,
            textDecoration: "none",
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            padding: "0 10px",
          }}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
            <path d="M12 3.5 18.5 6v5.2c0 4.2-2.7 7.5-6.5 9.3-3.8-1.8-6.5-5.1-6.5-9.3V6L12 3.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
            <path d="M8.8 12.1 11 14.2l4.4-4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          See all
        </a>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 9,
        }}
      >
        {stops.map((stop, index) => {
          const isPadding = stop.source === "visual_padding";
          return (
            <StopPreviewCard
              key={`${stop.stopName}-${index}`}
              name={stop.stopName ?? "Verified Stop"}
              subtitle={stop.subtitle ?? "Verified stop"}
              imageLabel={isPadding ? "SP" : (stop.stopName ?? "VS").slice(0, 2).toUpperCase()}
              variant={index === 1 ? "surf" : index === 2 ? "pool" : "town"}
              verified={!isPadding}
            />
          );
        })}
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
}) {
  const imageBackground =
    props.variant === "town"
      ? "linear-gradient(135deg, #bcecf2 0%, #effaf8 38%, #f6dda9 100%)"
      : props.variant === "surf"
        ? "linear-gradient(135deg, #7fd2eb 0%, #dbf6ff 42%, #b9e6d1 100%)"
        : "linear-gradient(135deg, #b2d8ee 0%, #e8f7f4 46%, #d2dfb0 100%)";

  return (
    <a
      href="/traveler/passport-map"
      aria-label={`${props.name} preview stop. ${props.verified ? "Governed verified stop." : "Visual placeholder only."}`}
      style={{
        minHeight: 126,
        borderRadius: 20,
        border: "1px solid rgba(203,213,225,0.72)",
        background: props.verified ? "rgba(255,255,255,0.97)" : "rgba(248,250,252,0.92)",
        boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
        textDecoration: "none",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "70px auto",
        opacity: props.verified ? 1 : 0.82,
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: 70,
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
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.94)",
            color: props.verified ? "#13a8b7" : "#8b95a1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 640,
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
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: props.verified ? "#1fa45b" : "#8b95a1",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 640,
            boxShadow: props.verified ? "0 7px 14px rgba(31,164,91,0.20)" : "0 7px 14px rgba(100,116,139,0.16)",
          }}
        >
          {props.verified ? "✓" : "•"}
        </div>
      </div>

      <div
        style={{
          padding: "10px 10px 11px",
          minWidth: 0,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#14264b",
            fontSize: 12,
            lineHeight: 1.12,
            fontWeight: 640,
            letterSpacing: "-0.02em",
          }}
        >
          {props.name}
        </h3>

        <p
          style={{
            margin: "5px 0 0",
            color: "#6b7890",
            fontSize: 9.5,
            lineHeight: 1.2,
            fontWeight: 610,
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

function SpmTrailCardsPreview(props: { trails?: SpmTrailPreviewData[] | null }) {
  const visualPaddingTrails = [
    { trailName: "More trail families coming", trailStatus: "pending", stopsTotal: 0, stopsCompleted: 0, progressPercentage: 0, unlockRule: null, iconKey: "ISLAND_HOPPING", source: "visual_padding" },
    { trailName: "Official trail families", trailStatus: "available", stopsTotal: 0, stopsCompleted: 0, progressPercentage: 0, unlockRule: null, iconKey: "NORTH_SIARGAO", source: "visual_padding" },
    { trailName: "Scan to unlock progress", trailStatus: "available", stopsTotal: 0, stopsCompleted: 0, progressPercentage: 0, unlockRule: null, iconKey: "ADVENTURE", source: "visual_padding" },
  ];

  const realTrails = props.trails?.length ? props.trails.slice(0, 3) : [];
  const trails = [...realTrails, ...visualPaddingTrails].slice(0, 3);
  return (
    <section
      aria-label="Passport Trails cards"
      style={{
        marginTop: 14,
        position: "relative",
        zIndex: 4,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 12,
          padding: "0 2px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
              fontSize: 24,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
              color: "#14264b",
              fontWeight: 590,
            }}
          >

          <SpmFeaturedPartnerTours />
          <SpmCuratedPassportTours />
          <SpmBuildYourOwnTrailSection />
          <SpmGuideSupportProvidedBy />

        <section
          style={{
            marginTop: 18,
            border: "1px solid #d3eef2",
            borderRadius: 24,
            background: "rgba(255,255,255,0.9)",
            padding: 16,
            boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 720,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#0796a6",
            }}
          >
            Passport Trail Families
          </div>

          <h2
            style={{
              margin: "7px 0 8px",
              fontSize: 22,
              lineHeight: 1.08,
              fontWeight: 690,
              letterSpacing: "-0.035em",
              color: "#14264b",
            }}
          >
            Pick a journey, not just a card
          </h2>

          <p
            style={{
              margin: "0 0 13px",
              fontSize: 12.5,
              lineHeight: 1.42,
              fontWeight: 600,
              color: "#607089",
            }}
          >
            Start with a live trail family or preview what will unlock next as more verified stops go live.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
            <a
              href="/traveler/passport-trails/tri-island-joiner"
              aria-label="Open Island Hopping Trail"
              style={{
                textDecoration: "none",
                border: "1px solid rgba(11,151,166,0.2)",
                borderRadius: 18,
                background: "linear-gradient(135deg, rgba(221,253,255,0.98), rgba(232,250,239,0.96))",
                padding: 12,
                minHeight: 94,
                color: "#14264b",
                boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
              }}
            >
              <div style={{ fontSize: 18, lineHeight: 1 }}>🏝️</div>
              <div style={{ marginTop: 8, fontSize: 13, fontWeight: 720, lineHeight: 1.14 }}>
                Island Hopping
              </div>
              <div style={{ marginTop: 5, fontSize: 10.5, fontWeight: 600, color: "#607089", lineHeight: 1.25 }}>
                Guyam • Daku • Naked
              </div>
              <div
                style={{
                  marginTop: 9,
                  display: "inline-flex",
                  borderRadius: 999,
                  padding: "4px 8px",
                  background: "#d8fbef",
                  color: "#138a58",
                  fontSize: 8.5,
                  fontWeight: 720,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Open Trail
              </div>
            </a>

            {[
              { icon: "🌊", name: "Surf & Coastal", href: "/traveler/passport-trails/surf-coastal", hint: "Beach and surf stops" },
              { icon: "🍽️", name: "Food & Culture", href: "/traveler/passport-trails/food-culture", hint: "Local flavors" },
              { icon: "🌿", name: "Nature & Inland", href: "/traveler/passport-trails/nature-inland", hint: "Falls and inland stops" },
              { icon: "🏘️", name: "Heritage & Local Life", href: "/traveler/passport-trails/heritage-local-life", hint: "Community routes" },
              { icon: "⭐", name: "Hidden Gems", href: "/traveler/passport-trails/hidden-gems", hint: "Curated discoveries" },
            ].map((family) => (
              <div
                key={family.name}
                aria-label={`${family.name} coming soon`}
                style={{
                  border: "1px solid rgba(11,151,166,0.12)",
                  borderRadius: 18,
                  background: "rgba(248,251,252,0.9)",
                  padding: 12,
                  minHeight: 94,
                  color: "#14264b",
                }}
              >
                <div style={{ fontSize: 18, lineHeight: 1, opacity: 0.78 }}>{family.icon}</div>
                <div style={{ marginTop: 8, fontSize: 13, fontWeight: 690, lineHeight: 1.14 }}>
                  {family.name}
                </div>
                <div style={{ marginTop: 5, fontSize: 10.5, fontWeight: 600, color: "#607089", lineHeight: 1.25 }}>
                  {family.hint}
                </div>
                <div
                  style={{
                    marginTop: 9,
                    display: "inline-flex",
                    borderRadius: 999,
                    padding: "4px 8px",
                    background: "#edf2f5",
                    color: "#718096",
                    fontSize: 8.5,
                    fontWeight: 720,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Coming
                </div>
              </div>
            ))}
          </div>
        </section>

            Your Trails
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12,
              lineHeight: 1.25,
              color: "#6b7890",
              fontWeight: 610,
            }}
          >
            Follow curated trail families, unlock verified stops, and continue your Siargao journey from your Passport Map.
          </p>
        </div>

        <a
          href="/traveler/passport-trails"
          aria-label="Explore Trails passport trails"
          style={{
            minHeight: 30,
            borderRadius: 999,
            border: "1px solid rgba(19,168,183,0.20)",
            background: "rgba(236,254,255,0.86)",
            color: "#13a8b7",
            fontSize: 11,
            fontWeight: 640,
            textDecoration: "none",
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            padding: "0 10px",
          }}
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
            <path d="M6 5.5h8.5a3.5 3.5 0 0 1 0 7H9.5a3.5 3.5 0 0 0 0 7H18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            <circle cx="6" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.9" />
            <circle cx="18" cy="19.5" r="2" stroke="currentColor" strokeWidth="1.9" />
          </svg>
          Explore Trails
        </a>
      </div>

      <div
        style={{
          marginTop: 8,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {trails.map((trail, index) => {
          const isPadding = trail.source === "visual_padding";
          const isLocked = trail.trailStatus === "locked";
          const completed = trail.stopsCompleted ?? 0;
          const total = trail.stopsTotal ?? 0;
          const progressLabel = isPadding
            ? "Unlock by visiting verified stops"
            : isLocked
              ? trail.unlockRule ?? "Complete more trails to unlock"
              : `${completed} / ${total} completed`;

          return (
            <TrailPreviewCard
              key={`${trail.trailName}-${index}`}
              title={trail.trailName ?? "Passport Trail"}
              progressLabel={progressLabel}
              progressPercent={isPadding ? 0 : trail.progressPercentage ?? 0}
              variant={isLocked || isPadding ? "locked" : index === 1 ? "lagoon" : "coast"}
              accent={isLocked || isPadding ? "#8b95a1" : "#13a8b7"}
              icon={isLocked || isPadding ? "•" : index === 1 ? "🏝" : "⛱"}
              governed={!isPadding}
            />
          );
        })}
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
      href="/traveler/passport-trails"
      aria-label={`${props.title} preview card. ${props.governed ? "Governed progress." : "Visual placeholder only."}`}
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
                color: "#13a8b7",
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
      style={{
        position: "absolute",
        left: 8,
        right: 8,
        bottom: 12,
        zIndex: 3,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          borderRadius: 999,
          background: "rgba(20,38,75,0.08)",
          color: "#14264b",
          padding: "6px 10px",
          fontSize: 10,
          fontWeight: 590,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: props.emptyState ? "#8b95a1" : "#f2b705",
          }}
        />
        {props.emptyState ? "No Stamps Yet" : "Live Progress"}
      </div>

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 8,
          maxWidth: 245,
        }}
      >
        <LegendItem color="#1fa45b" label="Completed" />
        <LegendItem color="#13a8b7" label="Available" />
        <LegendItem color="#8b95a1" label="Pending" />
        <LegendRouteItem label="Your Route" />
      </div>

      <div
        aria-label="SPM governed journey metrics"
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 0,
          width: "100%",
          borderRadius: 17,
          border: "1px solid rgba(203,213,225,0.72)",
          background: "rgba(255,255,255,0.96)",
          boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
          overflow: "hidden",
        }}
      >
        <StatusCard icon="⚑" value={String(trailsUnlocked)} label="Trails\\nUnlocked" tone="#13a8b7" withDivider />
        <StatusCard icon="♙" value={String(placesVerified)} label="Places\\nVerified" tone="#59aa61" withDivider />
        <StatusCard icon="▥" value={`${journeyProgress}%`} label="Journey\\nProgress" tone="#168fe3" withDivider />
        <StatusCard icon="▣" value={`Pass\\n${passStatus}`} label="OSP QR\\nReady" tone="#f2b705" />
      </div>

      <p
        style={{
          margin: "7px 2px 0",
          fontSize: 9.5,
          lineHeight: 1.28,
          color: "#718096",
          fontWeight: 590,
        }}
      >
        Metrics use governed OSP/SPM QR, Passport Stamp, and traveler progress records only.
        Visual placeholder cards do not count as verified progress.
      </p>
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

function StatusCard(props: {
  icon: string;
  value: string;
  label: string;
  tone: string;
  withDivider?: boolean;
}) {
  const valueLines = props.value.split("\\n");
  const labelLines = props.label.split("\\n");

  return (
    <div
      style={{
        minWidth: 0,
        minHeight: 48,
        padding: "6px 4px",
        borderRight: props.withDivider ? "1px solid rgba(203,213,225,0.78)" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        textAlign: "left",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: props.tone,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 590,
          flex: "0 0 22px",
          boxShadow: "0 5px 10px rgba(15,23,42,0.10)",
        }}
      >
        {props.icon}
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: "#14264b",
            fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
            fontSize: valueLines.length > 1 ? 10.5 : 17,
            lineHeight: valueLines.length > 1 ? 0.96 : 1,
            fontWeight: 590,
            letterSpacing: "-0.04em",
            whiteSpace: "normal",
          }}
        >
          {valueLines.map((line) => (
            <span key={line} style={{ display: "block" }}>
              {line}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: 2,
            color: props.value.includes("Pass") ? "#1fa45b" : "#66738b",
            fontSize: props.value.includes("Pass") ? 6.3 : 6.8,
            lineHeight: 1.08,
            fontWeight: 580,
            letterSpacing: "0.01em",
          }}
        >
          {labelLines.map((line) => (
            <span key={line} style={{ display: "block" }}>
              {line}
            </span>
          ))}
        </div>
      </div>
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
        top: -36,
        height: 430,
        zIndex: 1,
        borderRadius: "24px 24px 0 0",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <img
        src="/osp/spm-hero-banner-bg-approved.png"
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center center",
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
          height: 92,
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

function BottomNavItem(props: {
  href: string;
  label: string;
  active?: boolean;
  icon: "map" | "trail" | "pass" | "profile";
}) {
  const color = props.active ? "#13a8b7" : "#6b7890";

  return (
    <a
      href={props.href}
      style={{
        minWidth: 54,
        color,
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        fontWeight: props.active ? 900 : 750,
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NavIcon type={props.icon} active={props.active} />
      </span>
      <span>{props.label}</span>
    </a>
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
  const trailFamilies = [
    {
      icon: "🏝️",
      name: "Island Hopping",
      status: "Live",
      hint: "Guyam • Daku • Naked",
      href: "/traveler/passport-trails/tri-island-joiner",
      cta: "Continue Trail",
      live: true,
    },
    {
      icon: "🌊",
      name: "Surf & Coastal",
      status: "Preview",
      hint: "Beach and surf stops",
      href: "/traveler/passport-trails/surf-coastal",
      cta: "Preview",
      live: false,
    },
    {
      icon: "🍽️",
      name: "Food & Culture",
      status: "Preview",
      hint: "Local flavors",
      href: "/traveler/passport-trails/food-culture",
      cta: "Preview",
      live: false,
    },
    {
      icon: "🌿",
      name: "Nature & Inland",
      status: "Preview",
      hint: "Falls and inland stops",
      href: "/traveler/passport-trails/nature-inland",
      cta: "Preview",
      live: false,
    },
    {
      icon: "🏘️",
      name: "Heritage & Local Life",
      status: "Preview",
      hint: "Community routes",
      href: "/traveler/passport-trails/heritage-local-life",
      cta: "Preview",
      live: false,
    },
    {
      icon: "⭐",
      name: "Hidden Gems",
      status: "Preview",
      hint: "Curated discoveries",
      href: "/traveler/passport-trails/hidden-gems",
      cta: "Preview",
      live: false,
    },
  ];

  const achievements = [
    { icon: "✅", title: "First Stamp", body: "Unlock your first QR-verified Passport Stamp.", status: "In progress" },
    { icon: "🏝️", title: "Island Starter", body: "Begin the Island Hopping Trail.", status: "Live" },
    { icon: "🧭", title: "Trail Explorer", body: "Open and preview three trail families.", status: "Preview" },
    { icon: "⭐", title: "Hidden Gem Hunter", body: "Future achievement for curated stops.", status: "Coming" },
  ];

  return (
    <section
      aria-label="SPM traveler journey hub"
      style={{
        marginTop: 18,
        display: "grid",
        gap: 16,
      }}
    >
      <div
        style={{
          border: "1px solid #d3eef2",
          borderRadius: 28,
          background: "linear-gradient(135deg, rgba(240,253,255,0.98), rgba(238,248,239,0.94))",
          padding: 18,
          boxShadow: "0 16px 40px rgba(15,23,42,0.07)",
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 720,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: "#0796a6",
          }}
        >
          SPM Journey Hub
        </div>

        <h2
          style={{
            margin: "7px 0 8px",
            fontSize: 25,
            lineHeight: 1.04,
            fontWeight: 690,
            letterSpacing: "-0.045em",
            color: "#14264b",
          }}
        >
          Build your Siargao Passport, one trail at a time.
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.45,
            fontWeight: 600,
            color: "#607089",
          }}
        >
          Choose a trail family, visit verified stops, unlock Passport Stamps, and let your journey record grow inside One Siargao Pass.
        </p>

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
          <a
            href="/traveler/passport-trails/tri-island-joiner"
            style={{
              textDecoration: "none",
              borderRadius: 18,
              background: "#13a8b7",
              color: "#ffffff",
              padding: 13,
              boxShadow: "0 12px 28px rgba(19,168,183,0.22)",
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 720, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.86 }}>
              Continue
            </div>
            <div style={{ marginTop: 5, fontSize: 15, fontWeight: 720, lineHeight: 1.12 }}>
              Island Hopping
            </div>
            <div style={{ marginTop: 4, fontSize: 11, fontWeight: 600, opacity: 0.86 }}>
              Open live trail →
            </div>
          </a>

          <div
            style={{
              borderRadius: 18,
              background: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(11,151,166,0.14)",
              padding: 13,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 720, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0796a6" }}>
              Next Unlock
            </div>
            <div style={{ marginTop: 5, fontSize: 15, fontWeight: 700, color: "#14264b", lineHeight: 1.12 }}>
              Daku Island
            </div>
            <div style={{ marginTop: 4, fontSize: 11, fontWeight: 600, color: "#607089", lineHeight: 1.25 }}>
              Continue after verified QR / stamp progress.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #d3eef2",
          borderRadius: 28,
          background: "rgba(255,255,255,0.92)",
          padding: 16,
          boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 720,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: "#0796a6",
              }}
            >
              Choose Your Trail Family
            </div>
            <h2
              style={{
                margin: "6px 0 0",
                fontSize: 22,
                lineHeight: 1.08,
                fontWeight: 690,
                letterSpacing: "-0.035em",
                color: "#14264b",
              }}
            >
              Pick your travel style
            </h2>
          </div>

          <a
            href="/traveler/passport-trails"
            style={{
              textDecoration: "none",
              borderRadius: 999,
              border: "1px solid #bdebf0",
              padding: "8px 11px",
              fontSize: 11,
              fontWeight: 720,
              color: "#0796a6",
              background: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            All Trails
          </a>
        </div>

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
          {trailFamilies.map((family) => (
            <a
              key={family.name}
              href={family.href}
              aria-label={`Open ${family.name} trail family`}
              style={{
                textDecoration: "none",
                border: family.live ? "1px solid rgba(11,151,166,0.22)" : "1px solid rgba(11,151,166,0.12)",
                borderRadius: 20,
                background: family.live
                  ? "linear-gradient(135deg, rgba(221,253,255,0.98), rgba(232,250,239,0.96))"
                  : "rgba(248,251,252,0.92)",
                padding: 12,
                minHeight: 106,
                color: "#14264b",
                boxShadow: family.live ? "0 10px 26px rgba(15,23,42,0.06)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{family.icon}</span>
                <span
                  style={{
                    borderRadius: 999,
                    padding: "4px 7px",
                    background: family.live ? "#d8fbef" : "#edf2f5",
                    color: family.live ? "#138a58" : "#718096",
                    fontSize: 8,
                    fontWeight: 720,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {family.status}
                </span>
              </div>
              <div style={{ marginTop: 9, fontSize: 13, fontWeight: 720, lineHeight: 1.14 }}>
                {family.name}
              </div>
              <div style={{ marginTop: 5, fontSize: 10.5, fontWeight: 600, color: "#607089", lineHeight: 1.25 }}>
                {family.hint}
              </div>
              <div style={{ marginTop: 9, fontSize: 10, fontWeight: 720, color: family.live ? "#0796a6" : "#718096" }}>
                {family.cta} →
              </div>
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #d3eef2",
          borderRadius: 28,
          background: "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(246,251,255,0.94))",
          padding: 16,
          boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 720,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: "#0796a6",
          }}
        >
          Passport Stamps & Achievements
        </div>

        <h2
          style={{
            margin: "6px 0 12px",
            fontSize: 22,
            lineHeight: 1.08,
            fontWeight: 690,
            letterSpacing: "-0.035em",
            color: "#14264b",
          }}
        >
          Turn visits into progress
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
          {achievements.map((item) => (
            <div
              key={item.title}
              style={{
                border: "1px solid rgba(11,151,166,0.12)",
                borderRadius: 18,
                background: "rgba(255,255,255,0.82)",
                padding: 12,
                minHeight: 108,
              }}
            >
              <div style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</div>
              <div style={{ marginTop: 8, fontSize: 13, fontWeight: 720, lineHeight: 1.14, color: "#14264b" }}>
                {item.title}
              </div>
              <div style={{ marginTop: 5, fontSize: 10.5, fontWeight: 600, color: "#607089", lineHeight: 1.25 }}>
                {item.body}
              </div>
              <div
                style={{
                  marginTop: 9,
                  display: "inline-flex",
                  borderRadius: 999,
                  padding: "4px 7px",
                  background: item.status === "Live" ? "#d8fbef" : item.status === "Coming" ? "#edf2f5" : "#dff8ff",
                  color: item.status === "Live" ? "#138a58" : item.status === "Coming" ? "#718096" : "#078da0",
                  fontSize: 8,
                  fontWeight: 720,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        <a
          href="/traveler/passport-trails?mode=diy"
          style={{
            textDecoration: "none",
            border: "1px solid #d3eef2",
            borderRadius: 24,
            background: "rgba(255,255,255,0.92)",
            padding: 15,
            color: "#14264b",
          }}
        >
          <div style={{ fontSize: 20 }}>🧩</div>
          <div style={{ marginTop: 8, fontSize: 14, fontWeight: 720, lineHeight: 1.14 }}>
            DIY Trail Builder
          </div>
          <div style={{ marginTop: 5, fontSize: 10.5, fontWeight: 600, color: "#607089", lineHeight: 1.25 }}>
            Plan your own Siargao route. Persistence comes later.
          </div>
        </a>

        <a
          href="/traveler/settings?panel=assistant"
          style={{
            textDecoration: "none",
            border: "1px solid #bdebf0",
            borderRadius: 24,
            background: "linear-gradient(135deg, rgba(227,253,255,0.96), rgba(255,255,255,0.92))",
            padding: 15,
            color: "#14264b",
          }}
        >
          <div style={{ fontSize: 20 }}>🤖</div>
          <div style={{ marginTop: 8, fontSize: 14, fontWeight: 720, lineHeight: 1.14 }}>
            Ask Passport Assistant
          </div>
          <div style={{ marginTop: 5, fontSize: 10.5, fontWeight: 600, color: "#607089", lineHeight: 1.25 }}>
            Get help choosing trails, stamps, events, and next moves.
          </div>
        </a>
      </div>

      <div
        aria-label="AI Passport Assistant prompt chips"
        style={{
          border: "1px solid #bdebf0",
          borderRadius: 24,
          background: "linear-gradient(135deg, rgba(227,253,255,0.96), rgba(255,255,255,0.92))",
          padding: 15,
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 720,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: "#0796a6",
          }}
        >
          AI Passport Assistant
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 17,
            fontWeight: 720,
            color: "#14264b",
            lineHeight: 1.12,
          }}
        >
          Not sure what to do next?
        </div>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 11.5,
            lineHeight: 1.38,
            fontWeight: 600,
            color: "#607089",
          }}
        >
          Ask the Passport Assistant about trails, stamps, QR verification, DIY routes, and events.
        </p>

        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 7 }}>
          {[
            "Help me choose a trail",
            "What can I unlock next?",
            "How do Passport Stamps work?",
            "Plan a DIY trail",
            "What events fit my journey?",
          ].map((prompt) => (
            <a
              key={prompt}
              href="/traveler/settings?panel=assistant"
              style={{
                textDecoration: "none",
                border: "1px solid rgba(11,151,166,0.18)",
                borderRadius: 999,
                background: "rgba(255,255,255,0.86)",
                padding: "7px 9px",
                color: "#078da0",
                fontSize: 10.5,
                fontWeight: 720,
                lineHeight: 1,
              }}
            >
              {prompt}
            </a>
          ))}
        </div>
      </div>

          <SpmPassportRewardsRetention />

      <div
        style={{
          border: "1px solid #d3eef2",
          borderRadius: 24,
          background: "rgba(255,255,255,0.9)",
          padding: 15,
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 720,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: "#0796a6",
          }}
        >
          Events Discovery Preview
        </div>
        <div style={{ marginTop: 8, fontSize: 15, fontWeight: 720, color: "#14264b", lineHeight: 1.14 }}>
          This Week in Siargao
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 11.5, lineHeight: 1.38, fontWeight: 600, color: "#607089" }}>
          Events will connect to Passport Trails later. For now, the assistant can explain which trail family fits your travel style.
        </p>
      </div>
    </section>
  );
}


function SpmFeaturedPartnerTours() {
  const tours = [
    {
      title: "Tri-Island Joiner",
      route: "Guyam • Daku • Naked Island",
      support: "Provided by approved local partner",
      stamps: "Passport stamps available",
      commercial: "Package pricing applies when booking opens.",
      href: "/traveler/passport-trails/tri-island-joiner",
    },
    {
      title: "Corregidor + Tri-Island Joiner",
      route: "Corregidor • Guyam • Daku • Naked Island",
      support: "Provided by approved local partner",
      stamps: "Passport stamps available",
      commercial: "Pricing appears before checkout.",
      href: "/traveler/passport-trails/tri-island-joiner",
    },
    {
      title: "Sohoton Joiner",
      route: "Sohoton • Bucas Grande route",
      support: "Provided by approved local partner",
      stamps: "Passport stamps available when activated",
      commercial: "Booking opens when operator readiness is active.",
      href: "/traveler/passport-trails/tri-island-joiner",
    },
  ];

  return (
    <section
      aria-label="Featured Siargao Partner Tours"
      style={{
        marginTop: 18,
        border: "1px solid #d3eef2",
        borderRadius: 28,
        background: "rgba(255,255,255,0.94)",
        padding: 16,
        boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 720, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0796a6" }}>
        Featured Siargao Partner Tours
      </div>
      <h2 style={{ margin: "7px 0 8px", fontSize: 23, lineHeight: 1.06, fontWeight: 690, letterSpacing: "-0.04em", color: "#14264b" }}>
        Local tour products made Passport-ready.
      </h2>
      <p style={{ margin: "0 0 13px", fontSize: 12.5, lineHeight: 1.42, fontWeight: 600, color: "#607089" }}>
        These are Siargao Partner Tours operated by approved local partners. They are commercial packages, not free map entries.
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        {tours.map((tour) => (
          <a
            key={tour.title}
            href={tour.href}
            aria-label={`Open ${tour.title}`}
            style={{
              textDecoration: "none",
              border: "1px solid rgba(11,151,166,0.14)",
              borderLeft: "5px solid #13a8b7",
              borderRadius: 22,
              background: "rgba(248,252,252,0.92)",
              padding: 14,
              color: "#14264b",
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 720, letterSpacing: "0.1em", textTransform: "uppercase", color: "#13a8b7" }}>
              Siargao Partner Tour
            </div>
            <div style={{ marginTop: 4, fontSize: 16, fontWeight: 720, lineHeight: 1.14 }}>
              {tour.title}
            </div>
            <div style={{ marginTop: 5, fontSize: 11.5, fontWeight: 600, color: "#607089", lineHeight: 1.35 }}>
              {tour.route}
            </div>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              <div style={{ borderRadius: 14, background: "#f2f6f8", padding: "8px 9px" }}>
                <div style={{ fontSize: 8, fontWeight: 720, color: "#7b8aa0", letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide Support</div>
                <div style={{ marginTop: 3, fontSize: 10.5, fontWeight: 720, color: "#355071", lineHeight: 1.25 }}>{tour.support}</div>
              </div>
              <div style={{ borderRadius: 14, background: "#f2f6f8", padding: "8px 9px" }}>
                <div style={{ fontSize: 8, fontWeight: 720, color: "#7b8aa0", letterSpacing: "0.08em", textTransform: "uppercase" }}>Stamps</div>
                <div style={{ marginTop: 3, fontSize: 10.5, fontWeight: 720, color: "#355071", lineHeight: 1.25 }}>{tour.stamps}</div>
              </div>
            </div>
            <div style={{ marginTop: 9, borderRadius: 14, background: "rgba(223,248,255,0.92)", padding: "8px 9px", fontSize: 10.5, fontWeight: 700, color: "#078da0", lineHeight: 1.28 }}>
              {tour.commercial}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function SpmCuratedPassportTours() {
  const families = [
    "Island Hopping Trail",
    "Surf Explorer Trail",
    "North Siargao Trail",
    "Inland Discovery Trail",
    "Culture & Community Trail",
    "Sunset & Scenic Stops Trail",
    "Adventure Trail",
    "Return Traveler Continuity Trail",
  ];

  return (
    <section
      aria-label="Passport Trails Curated Tours"
      style={{
        marginTop: 18,
        border: "1px solid #d3eef2",
        borderRadius: 28,
        background: "rgba(255,255,255,0.94)",
        padding: 16,
        boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 720, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0796a6" }}>
        Passport Trails™ Curated Tours
      </div>
      <h2 style={{ margin: "7px 0 8px", fontSize: 23, lineHeight: 1.06, fontWeight: 690, letterSpacing: "-0.04em", color: "#14264b" }}>
        Official SPM trail families.
      </h2>
      <p style={{ margin: "0 0 13px", fontSize: 12.5, lineHeight: 1.42, fontWeight: 600, color: "#607089" }}>
        Curated Passport Trails™ are provided through SPM-approved trail operations, with approved local partner fulfillment where service is required.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
        {families.map((family, index) => (
          <a
            key={family}
            href={index === 0 ? "/traveler/passport-trails/tri-island-joiner" : "/traveler/passport-trails"}
            aria-label={`Open ${family}`}
            style={{
              textDecoration: "none",
              border: "1px solid rgba(11,151,166,0.14)",
              borderRadius: 20,
              background: index === 0 ? "linear-gradient(135deg, rgba(221,253,255,0.98), rgba(232,250,239,0.96))" : "rgba(248,252,252,0.92)",
              padding: 12,
              color: "#14264b",
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 720, letterSpacing: "0.08em", textTransform: "uppercase", color: index === 0 ? "#138a58" : "#718096" }}>
              {index === 0 ? "Active Family" : "Preview Family"}
            </div>
            <div style={{ marginTop: 5, fontSize: 13.5, fontWeight: 720, lineHeight: 1.12 }}>
              {family}
            </div>
            <div style={{ marginTop: 7, fontSize: 10.5, lineHeight: 1.28, fontWeight: 650, color: "#607089" }}>
              Verified Passport stamps included when activated.
            </div>
          </a>
        ))}
      </div>

      <div style={{ marginTop: 12, borderRadius: 16, background: "#f2f6f8", padding: "10px 11px", fontSize: 11, fontWeight: 700, color: "#355071", lineHeight: 1.3 }}>
        Pricing appears before checkout. No curated trail should imply free fulfillment unless explicitly approved.
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
        border: "1px solid #d3eef2",
        borderRadius: 28,
        background: "linear-gradient(135deg, rgba(247,250,255,0.98), rgba(239,253,255,0.96))",
        padding: 16,
        boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 720, letterSpacing: "0.13em", textTransform: "uppercase", color: "#8b5cf6" }}>
        Build Your Own Passport Trail
      </div>
      <h2 style={{ margin: "7px 0 8px", fontSize: 23, lineHeight: 1.06, fontWeight: 690, letterSpacing: "-0.04em", color: "#14264b" }}>
        Create a personal route with SPM guidance.
      </h2>
      <p style={{ margin: "0 0 13px", fontSize: 12.5, lineHeight: 1.42, fontWeight: 600, color: "#607089" }}>
        Route guidance is provided by SPM. Approved local partner support may apply where transport, boat, guide, or activity service is required.
      </p>

      <a
        href="/traveler/passport-trails/diy-trail-builder"
        aria-label="Open Build Your Own Passport Trail"
        style={{
          display: "block",
          textDecoration: "none",
          borderRadius: 20,
          background: "#8b5cf6",
          color: "#ffffff",
          padding: 14,
          boxShadow: "0 12px 28px rgba(139,92,246,0.18)",
        }}
      >
        <div style={{ fontSize: 18 }}>🧩</div>
        <div style={{ marginTop: 8, fontSize: 16, fontWeight: 720, lineHeight: 1.12 }}>
          Start DIY Trail Builder
        </div>
        <div style={{ marginTop: 5, fontSize: 11.5, fontWeight: 600, lineHeight: 1.32, opacity: 0.9 }}>
          Planning preview now. Save, booking, fulfillment, and stamp activation come only when governed readiness is live.
        </div>
      </a>
    </section>
  );
}

function SpmGuideSupportProvidedBy() {
  const support = [
    {
      label: "Siargao Partner Tour",
      provided: "Provided by approved local partner",
      note: "Best for partner-operated tours, island hopping, land tours, private trips, and commercial packages.",
    },
    {
      label: "Passport Trails™ Curated Tour",
      provided: "Provided through SPM-approved trail operations",
      note: "Best for curated stamp journeys, verified route flow, and official trail family progression.",
    },
    {
      label: "Build Your Own Passport Trail",
      provided: "Route guidance provided by SPM",
      note: "Approved local partner support may apply where transport, boat, guide, or activity service is required.",
    },
  ];

  return (
    <section
      aria-label="Guide Support Provided By"
      style={{
        marginTop: 18,
        border: "1px solid #d3eef2",
        borderRadius: 28,
        background: "rgba(255,255,255,0.94)",
        padding: 16,
        boxShadow: "0 14px 36px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 720, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0796a6" }}>
        Guide Support / Provided By
      </div>
      <h2 style={{ margin: "7px 0 8px", fontSize: 23, lineHeight: 1.06, fontWeight: 690, letterSpacing: "-0.04em", color: "#14264b" }}>
        Know who supports each journey.
      </h2>
      <p style={{ margin: "0 0 13px", fontSize: 12.5, lineHeight: 1.42, fontWeight: 600, color: "#607089" }}>
        This explains support responsibility only. Guide selection and assignment happen later inside the governed booking/request flow.
      </p>

      <div style={{ display: "grid", gap: 9 }}>
        {support.map((item) => (
          <div
            key={item.label}
            style={{
              border: "1px solid rgba(11,151,166,0.13)",
              borderRadius: 18,
              background: "rgba(248,252,252,0.92)",
              padding: 12,
            }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 720, color: "#14264b", lineHeight: 1.12 }}>
              {item.label}
            </div>
            <div style={{ marginTop: 5, fontSize: 11.5, fontWeight: 720, color: "#078da0", lineHeight: 1.25 }}>
              {item.provided}
            </div>
            <div style={{ marginTop: 5, fontSize: 10.8, fontWeight: 600, color: "#607089", lineHeight: 1.32 }}>
              {item.note}
            </div>
          </div>
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
        border: "1px solid #d3eef2",
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
      <p style={{ margin: "0 0 13px", fontSize: 12.5, lineHeight: 1.42, fontWeight: 600, color: "#607089" }}>
        Unlock stamps, complete trails, and continue unfinished journeys across future trips. Rewards remain preview-only until governed activation.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        {[
          ["2", "Places verified"],
          ["33%", "Trail progress"],
          ["Next", "Unlock pending"],
        ].map(([value, label]) => (
          <div key={label} style={{ borderRadius: 16, background: "rgba(255,255,255,0.86)", padding: "10px 8px", border: "1px solid rgba(197,138,0,0.12)" }}>
            <div style={{ fontSize: 17, fontWeight: 760, color: "#14264b" }}>{value}</div>
            <div style={{ marginTop: 2, fontSize: 9.5, lineHeight: 1.15, fontWeight: 650, color: "#607089" }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

