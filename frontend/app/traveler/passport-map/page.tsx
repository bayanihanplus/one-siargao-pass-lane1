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
            padding: "16px 14px 88px",
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
                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                  fontSize: 24,
                  lineHeight: 1.02,
                  letterSpacing: "-0.052em",
                  color: "#14264b",
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                  overflow: "visible",
                }}
              >
                Siargao Passport Map
              </h1>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#6c7890",
                  fontSize: 13,
                  lineHeight: 1.12,
                  fontWeight: 700,
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
              minHeight: 500,
              borderRadius: 28,
              border: "1px solid rgba(19,168,183,0.14)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(238,248,251,0.94) 52%, rgba(255,255,255,0.96) 100%)",
              boxShadow: "0 18px 46px rgba(15,23,42,0.07)",
              padding: 18,
            }}
          >
            <div
              style={{
                minHeight: 430,
                borderRadius: 24,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(238,248,251,0.62) 52%, rgba(255,255,255,0.86) 100%)",
                padding: "18px 6px 24px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "relative",
                  zIndex: 3,
                  maxWidth: 198,
                  paddingTop: 4,
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
                      lineHeight: 1,
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
                      lineHeight: 1,
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
                    fontFamily: 'Georgia, "Times New Roman", Times, serif',
                    fontSize: 27,
                    lineHeight: 1.02,
                    letterSpacing: "-0.052em",
                    color: "#14264b",
                    fontWeight: 900,
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
                      fontSize: 32,
                      lineHeight: 0.9,
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
                    maxWidth: 176,
                    color: "#6c7890",
                    fontFamily: "Arial, Helvetica, sans-serif",
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

              <SpmLegendAndStatus />
            </div>
          </section>

          <SpmTrailCardsPreview trails={spmPreview?.trails} />

          <SpmVerifiedStopsPreview stops={spmPreview?.verifiedStops} />

          <SpmContinueJourneyPreview nextStop={spmPreview?.nextStop} />
        </div>

        <nav
          style={{
            position: "fixed",
            left: "50%",
            bottom: 0,
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 430,
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
          <BottomNavItem href="/traveler/trips" label="Trails" icon="trail" />
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
  const title = nextStop?.recommendedStopName ?? "Daku Island";
  const reason = nextStop?.recommendationReason ?? "Crystal clear waters and island vibes";
  const eta = nextStop?.distanceOrEtaLabel ?? "About 15 min by boat from GL";
  const ctaRoute = nextStop?.ctaRoute ?? "/traveler/trips";
  return (
    <section
      aria-label="Continue journey recommendation card"
      style={{
        marginTop: 14,
        marginBottom: 92,
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
              lineHeight: 1,
              fontWeight: 950,
              letterSpacing: "0.03em",
            }}
          >
            Recommended Next Stop
          </div>

          <h2
            style={{
              margin: "5px 0 0",
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontSize: 20,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              color: "#14264b",
              fontWeight: 900,
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
              fontWeight: 700,
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
                fontWeight: 800,
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
                fontWeight: 950,
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
};

function SpmVerifiedStopsPreview(props: { stops?: SpmVerifiedStopPreviewData[] | null }) {
  const fallbackStops = [
    { stopName: "Daku Island", subtitle: "Verified stop", verificationStatus: "verified" },
    { stopName: "Guyam Island", subtitle: "Verified stop", verificationStatus: "verified" },
    { stopName: "Cloud 9", subtitle: "World Famous Wave", verificationStatus: "verified" },
  ];

  const realStops = props.stops?.length ? props.stops.slice(0, 3) : [];
  const stops = [...realStops, ...fallbackStops]
    .filter((stop, index, list) => list.findIndex((item) => item.stopName === stop.stopName) === index)
    .slice(0, 3);
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
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontSize: 24,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#14264b",
              fontWeight: 900,
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
              fontWeight: 750,
            }}
          >
            Places you have checked in and verified.
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
            fontWeight: 950,
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
        {stops.map((stop, index) => (
          <StopPreviewCard
            key={`${stop.stopName}-${index}`}
            name={stop.stopName ?? "Verified Stop"}
            subtitle={stop.subtitle ?? "Verified stop"}
            imageLabel={(stop.stopName ?? "VS").slice(0, 2).toUpperCase()}
            variant={index === 1 ? "surf" : index === 2 ? "pool" : "town"}
          />
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
      aria-label={`${props.name} preview stop. Visual only.`}
      style={{
        minHeight: 126,
        borderRadius: 20,
        border: "1px solid rgba(203,213,225,0.72)",
        background: "rgba(255,255,255,0.97)",
        boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
        textDecoration: "none",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "70px auto",
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: 70,
          background: imageBackground,
          borderBottom: "1px solid rgba(226,232,240,0.72)",
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
            color: "#13a8b7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 950,
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
            background: "#1fa45b",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 950,
            boxShadow: "0 7px 14px rgba(31,164,91,0.20)",
          }}
        >
          ✓
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
            fontWeight: 950,
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
            fontWeight: 750,
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
            background: "rgba(31,164,91,0.10)",
            color: "#1fa45b",
            padding: "4px 6px",
            fontSize: 8,
            lineHeight: 1,
            fontWeight: 950,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Verified
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
};

function SpmTrailCardsPreview(props: { trails?: SpmTrailPreviewData[] | null }) {
  const fallbackTrails = [
    { trailName: "Island Discovery Trail", trailStatus: "active", stopsTotal: 4, stopsCompleted: 1, progressPercentage: 25, iconKey: "ISLAND_HOPPING" },
    { trailName: "North Siargao Trail", trailStatus: "locked", stopsTotal: 0, stopsCompleted: 0, progressPercentage: 0, unlockRule: "Complete more trails to unlock", iconKey: "NORTH_SIARGAO" },
    { trailName: "Adventure Trail", trailStatus: "locked", stopsTotal: 0, stopsCompleted: 0, progressPercentage: 0, unlockRule: "Complete more trails to unlock", iconKey: "ADVENTURE" },
  ];

  const realTrails = props.trails?.length ? props.trails.slice(0, 3) : [];
  const trails = [...realTrails, ...fallbackTrails]
    .filter((trail, index, list) => list.findIndex((item) => item.trailName === trail.trailName) === index)
    .slice(0, 3);
  return (
    <section
      aria-label="Passport Trails cards"
      style={{
        marginTop: 2,
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
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontSize: 24,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#14264b",
              fontWeight: 900,
            }}
          >
            Your Trails
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12,
              lineHeight: 1.25,
              color: "#6b7890",
              fontWeight: 750,
            }}
          >
            Your real trail progress appears first. Extra cards preserve map layout.
          </p>
        </div>

        <a
          href="/traveler/passport-map"
          aria-label="View all passport trails"
          style={{
            minHeight: 30,
            borderRadius: 999,
            border: "1px solid rgba(19,168,183,0.20)",
            background: "rgba(236,254,255,0.86)",
            color: "#13a8b7",
            fontSize: 11,
            fontWeight: 950,
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
          View all
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
          const isLocked = trail.trailStatus === "locked";
          const completed = trail.stopsCompleted ?? 0;
          const total = trail.stopsTotal ?? 0;

          return (
            <TrailPreviewCard
              key={`${trail.trailName}-${index}`}
              title={trail.trailName ?? "Passport Trail"}
              progressLabel={isLocked ? trail.unlockRule ?? "Complete more trails to unlock" : `${completed} / ${total} completed`}
              variant={isLocked ? "locked" : index === 1 ? "lagoon" : "coast"}
              accent={isLocked ? "#8b95a1" : "#13a8b7"}
              icon={isLocked ? "🔒" : index === 1 ? "🏝" : "⛱"}
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
  variant: "coast" | "lagoon" | "locked";
  accent: string;
  icon: string;
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
      href="/traveler/passport-map"
      aria-label={`${props.title} preview card. Visual only.`}
      style={{
        minHeight: 160,
        borderRadius: 18,
        border: "1px solid rgba(203,213,225,0.84)",
        background: cardBackground,
        boxShadow: "0 10px 26px rgba(15,23,42,0.06)",
        textDecoration: "none",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "92px auto auto",
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: 92,
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
                top: 12,
                width: 30,
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
                top: 14,
                width: 42,
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
            bottom: 10,
            width: 34,
            height: 34,
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
          padding: "10px 10px 0",
          minWidth: 0,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#14264b",
            fontSize: 11.5,
            lineHeight: 1.1,
            fontWeight: 950,
            letterSpacing: "-0.03em",
          }}
        >
          {props.title}
        </h3>
      </div>

      <div
        style={{
          padding: "8px 10px 12px",
          alignSelf: "end",
        }}
      >
        {isLocked ? (
          <div
            style={{
              color: "#7b8798",
              fontSize: 10,
              lineHeight: 1.22,
              fontWeight: 800,
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
                fontWeight: 900,
              }}
            >
              {props.progressLabel}
            </div>

            <div
              style={{
                marginTop: 8,
                height: 6,
                borderRadius: 999,
                background: "rgba(148,163,184,0.22)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: props.progressLabel.startsWith("3 / 5") ? "60%" : "25%",
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


function SpmLegendAndStatus() {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 3,
        marginTop: 24,
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
          fontWeight: 900,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#f2b705",
          }}
        />
        Preview Mode
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
        <LegendItem color="#8b95a1" label="Locked" />
        <LegendRouteItem label="Your Route" />
      </div>

      <div
        aria-label="SPM preview journey metrics"
        style={{
          marginTop: 78,
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
        <StatusCard icon="⚑" value="5" label="Trails\\nUnlocked" tone="#13a8b7" withDivider />
        <StatusCard icon="♙" value="3" label="Places\\nVerified" tone="#59aa61" withDivider />
        <StatusCard icon="▥" value="42%" label="Journey\\nProgress" tone="#168fe3" withDivider />
        <StatusCard icon="▣" value="Pass\\nActive" label="Valid until\\nMay 24, 2025" tone="#f2b705" />
      </div>

      <p
        style={{
          margin: "7px 2px 0",
          fontSize: 9.5,
          lineHeight: 1.28,
          color: "#718096",
          fontWeight: 700,
        }}
      >
        Preview values are visual-only until connected to governed OSP/SPM stamp,
        QR, and traveler progress records.
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
        fontWeight: 850,
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
        fontWeight: 850,
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
          fontWeight: 900,
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
            fontFamily: 'Georgia, "Times New Roman", Times, serif',
            fontSize: valueLines.length > 1 ? 10.5 : 17,
            lineHeight: valueLines.length > 1 ? 0.96 : 1,
            fontWeight: 900,
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
            fontWeight: 850,
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
        top: 0,
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
        lineHeight: 1,
        fontWeight: 900,
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
