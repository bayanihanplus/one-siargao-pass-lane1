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
                minHeight: 42,
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
              boxShadow: "0 22px 58px rgba(15,23,42,0.10)",
              padding: 12,
            }}
          >
            <div
              style={{
                height: 272,
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
                    color: "#53657d",
                    fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
                    fontSize: 12,
                    lineHeight: 1.3,
                    fontWeight: 400,
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

          <SpmPassportExperienceCards />
          <SpmFeaturedPartnerTours />
          <SpmCuratedPassportTours />
          <SpmBuildYourOwnTrailSection />
          <SpmGuideSupportProvidedBy />

          <SpmTrailCardsPreview trails={spmPreview?.trails} />

          <SpmVerifiedStopsPreview stops={spmPreview?.verifiedStops} />

          <SpmJourneyHubEngagement />
        </div>

        <nav
          style={{
            position: "sticky",
            bottom: 0,
            width: "100%",
            borderTop: "1px solid rgba(191,231,238,0.90)",
            background: "linear-gradient(135deg, rgba(255,255,255,0.97), rgba(244,253,255,0.90))",
            backdropFilter: "blur(16px)",
            padding: "10px 28px 18px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            boxShadow: "0 -10px 30px rgba(15,23,42,0.075)",
          }}
        >
          <BottomNavItem href="/traveler/passport-map" label="Map" active icon="map" />
          <BottomNavItem href="/traveler/passport-trails" label="Trails" icon="trail" />
          <BottomNavItem href="/traveler/pass" label="Pass" icon="pass" />
          <BottomNavItem href="/traveler/settings" label="Profile" icon="profile" />
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
  const title = nextStop?.recommendedStopName ?? "Continue Passport Trail";
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

function SpmVerifiedStopsPreview(props: { stops?: SpmVerifiedStopPreviewData[] | null }) {
  const realStops = props.stops?.length ? props.stops.slice(0, 3) : [];
  const visualPaddingStops = [
    {
      stopName: "Stamp Lock",
      subtitle: "Open pass / QR",
      verificationStatus: "locked",
      source: "visual_padding",
      href: "/traveler/pass",
    },
    {
      stopName: "QR Ready",
      subtitle: "Show QR credential",
      verificationStatus: "ready",
      source: "visual_padding",
      href: "/traveler/pass",
    },
    {
      stopName: "Progress",
      subtitle: "Open Passport Trails",
      verificationStatus: "progress",
      source: "visual_padding",
      href: "/traveler/passport-trails",
    },
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
              fontSize: 23,
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
              fontSize: 11.4,
              lineHeight: 1.2,
              color: "#6b7890",
              fontWeight: 610,
            }}
          >
            QR-verified activity appears here. Pending cards unlock only after real scans.
          </p>
        </div>

        <a
          href="/traveler/pass"
          aria-label="View pass and QR records"
          style={{
            minHeight: 40,
            borderRadius: 999,
            border: "1px solid rgba(19,168,183,0.20)",
            background: "rgba(236,254,255,0.86)",
            color: "#067889",
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
          Pass
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
              state={stop.verificationStatus ?? "pending"}
              href={stop.href ?? (!isPadding ? "/traveler/pass" : "/traveler/passport-map")}
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
      aria-label={`${props.name} preview stop. ${props.verified ? "Governed verified stop." : "Visual placeholder only."}`}
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

function SpmTrailCardsPreview(props: any) {
  const fallbackTrails = [
    {
      trailName: "Island Hopping Trail",
      trailStatus: "active",
      stopsCompleted: 2,
      stopsTotal: 6,
      progressPercentage: 33,
      href: "/traveler/passport-trails/tri-island-joiner",
    },
    {
      trailName: "Surf Explorer Trail",
      trailStatus: "preview",
      stopsCompleted: 0,
      stopsTotal: 0,
      progressPercentage: 0,
      href: "/traveler/passport-trails",
    },
    {
      trailName: "North Siargao Trail",
      trailStatus: "preview",
      stopsCompleted: 0,
      stopsTotal: 0,
      progressPercentage: 0,
      href: "/traveler/passport-trails",
    },
  ];

  const incoming = Array.isArray(props?.trails) && props.trails.length > 0 ? props.trails.slice(0, 3) : [];
  const trails = incoming.length > 0
    ? incoming.map((trail: any, index: number) => ({
        trailName: trail.trailName ?? fallbackTrails[index]?.trailName ?? "Passport Trail",
        trailStatus: trail.trailStatus ?? fallbackTrails[index]?.trailStatus ?? "preview",
        stopsCompleted: trail.stopsCompleted ?? fallbackTrails[index]?.stopsCompleted ?? 0,
        stopsTotal: trail.stopsTotal ?? fallbackTrails[index]?.stopsTotal ?? 0,
        progressPercentage: trail.progressPercentage ?? fallbackTrails[index]?.progressPercentage ?? 0,
        href: trail.href ?? fallbackTrails[index]?.href ?? "/traveler/passport-trails",
      }))
    : fallbackTrails;

  return (
    <section
      aria-label="Your Passport Trails"
      style={{
        marginTop: 14,
        border: "1px solid #bfe7ee",
        borderRadius: 22,
        background: "linear-gradient(135deg, rgba(255,255,255,0.99), rgba(244,253,255,0.94))",
        padding: 12,
        boxShadow: "0 12px 28px rgba(8,61,103,0.07)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ fontSize: 8.9, fontWeight: 840, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0796a6" }}>
            Your Trails
          </div>
          <h2 style={{ margin: "4px 0 0", fontSize: 20, lineHeight: 1.03, fontWeight: 780, letterSpacing: "-0.045em", color: "#14264b" }}>
            Continue your journey.
          </h2>
        </div>

        <a
          href="/traveler/passport-trails"
          aria-label="Explore all Passport Trails"
          style={{
            flexShrink: 0,
            borderRadius: 999,
            background: "linear-gradient(135deg, #14b8c6, #078da0)",
            color: "#ffffff",
            padding: "9px 11px",
            fontSize: 10,
            fontWeight: 860,
            textDecoration: "none",
            boxShadow: "0 12px 26px rgba(7,141,160,0.24)",
          }}
        >
          Explore
        </a>
      </div>

      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
        {trails.map((trail: any, index: number) => {
          const active = String(trail.trailStatus).toLowerCase().includes("active") || Number(trail.progressPercentage) > 0;
          const progressText = active
            ? `${trail.stopsCompleted ?? 0}/${trail.stopsTotal ?? 0} stops`
            : "Preview";

          return (
            <a
              key={`${trail.trailName}-${index}`}
              href={trail.href ?? "/traveler/passport-trails"}
              aria-label={`Open ${trail.trailName}`}
              style={{
                display: "grid",
                gridTemplateColumns: "42px 1fr 78px",
                alignItems: "center",
                gap: 9,
                border: "1px solid #bfe7ee",
                borderRadius: 18,
                background: active ? "linear-gradient(135deg, #e3fff3, #f3ffff)" : "linear-gradient(135deg, #ffffff, #f7fcfd)",
                padding: "9px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: 42,
                  minHeight: 44,
                  borderRadius: 18,
                  background: active ? "#16a34a" : "#e4fbff",
                  color: active ? "#ffffff" : "#078da0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 900,
                }}
              >
                {active ? "✓" : "→"}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14.2, fontWeight: 830, lineHeight: 1.04, color: "#14264b" }}>
                  {trail.trailName}
                </div>
                <div style={{ marginTop: 4, fontSize: 10.6, fontWeight: 670, color: "#53657d", lineHeight: 1.12 }}>
                  {progressText} • Passport stamps
                </div>
              </div>

              <div
                style={{
                  minHeight: 44,
                  borderRadius: 14,
                  background: active ? "#16a34a" : "#13a8b7",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10.6,
                  fontWeight: 860,
                  boxShadow: "0 8px 18px rgba(8,61,103,0.14)",
                }}
              >
                {active ? "Continue" : "Open"}
              </div>
            </a>
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
        border: "1px solid rgba(191,231,238,0.72)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(240,250,252,0.82))",
        boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
        padding: "7px 7px 6px",
        backdropFilter: "blur(10px)",
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
            color: "#14264b",
            fontSize: 8.8,
            fontWeight: 820,
            letterSpacing: "0.095em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
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
            fontWeight: 780,
            color: "#067889",
            whiteSpace: "nowrap",
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
        borderRadius: 12,
        background: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(203,213,225,0.48)",
        padding: "5px 3px",
        display: "grid",
        alignContent: "center",
        justifyItems: "center",
        gap: 2,
      }}
    >
      <div
        style={{
          color: props.tone,
          fontSize: 11.8,
          lineHeight: 1,
          fontWeight: 850,
          letterSpacing: "-0.025em",
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
          color: "#53657d",
          fontSize: 7.2,
          lineHeight: 1,
          fontWeight: 760,
          letterSpacing: "0.035em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
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
  const routeNodes = [
    {
      label: "Verified",
      icon: "✓",
      state: "completed",
      tone: "#16a34a",
      softBg: "rgba(220,252,231,0.92)",
      border: "rgba(34,184,90,0.32)",
    },
    {
      label: "Current",
      icon: "⌁",
      state: "active",
      tone: "#0891b2",
      softBg: "rgba(232,251,255,0.96)",
      border: "rgba(8,145,178,0.34)",
    },
    {
      label: "Next",
      icon: "↗",
      state: "next",
      tone: "#f59e0b",
      softBg: "rgba(255,248,220,0.96)",
      border: "rgba(245,158,11,0.34)",
    },
    {
      label: "Locked",
      icon: "▣",
      state: "locked",
      tone: "#64748b",
      softBg: "rgba(248,250,252,0.98)",
      border: "rgba(148,163,184,0.34)",
    },
  ];

  return (
    <section
      aria-label="SPM Functional Journey Map"
      style={{
        marginTop: 16,
        border: "1px solid #bfe7ee",
        borderRadius: 24,
        background: "linear-gradient(180deg, rgba(255,255,255,0.99), rgba(244,253,255,0.95))",
        padding: 13,
        boxShadow: "0 16px 38px rgba(8,61,103,0.10)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 8.8,
              fontWeight: 900,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "#0796a6",
            }}
          >
            Functional Journey Map
          </div>
          <h2
            style={{
              margin: "5px 0 0",
              fontSize: 18,
              lineHeight: 1.04,
              fontWeight: 900,
              letterSpacing: "-0.045em",
              color: "#14264b",
            }}
          >
            Continue Passport Trail
          </h2>
          <p
            style={{
              margin: "5px 0 0",
              fontSize: 10.4,
              lineHeight: 1.22,
              fontWeight: 720,
              color: "#53657d",
            }}
          >
            A compact route view for verified stops, next unlocks, and locked trail progress.
          </p>
        </div>

        <a
          href="/traveler/passport-trails/tri-island-joiner"
          aria-label="Open active Island Hopping Passport Trail"
          style={{
            flexShrink: 0,
            minHeight: 40,
            minWidth: 78,
            borderRadius: 15,
            background: "linear-gradient(135deg, #22b85a, #11843d)",
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            textDecoration: "none",
            fontSize: 9.8,
            fontWeight: 900,
            boxShadow: "0 10px 22px rgba(17,132,61,0.20)",
          }}
        >
          Open Trail
        </a>
      </div>

      <div
        aria-label="Compact route progress preview"
        style={{
          marginTop: 12,
          borderRadius: 22,
          border: "1px solid rgba(191,231,238,0.82)",
          background: "linear-gradient(135deg, #e8fbff 0%, #ffffff 54%, #f8fafc 100%)",
          padding: "14px 12px",
          position: "relative",
          overflow: "hidden",
          minHeight: 150,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 22%, rgba(20,184,198,0.14), transparent 26%), radial-gradient(circle at 82% 34%, rgba(34,184,90,0.10), transparent 28%), radial-gradient(circle at 62% 88%, rgba(245,158,11,0.12), transparent 26%)",
          }}
        />

        <svg
          aria-hidden="true"
          viewBox="0 0 320 120"
          width="100%"
          height="120"
          preserveAspectRatio="none"
          style={{ position: "relative", display: "block" }}
        >
          <path
            d="M28 88 C76 44, 110 76, 146 48 C184 18, 217 42, 257 25 C282 14, 298 22, 306 38"
            fill="none"
            stroke="rgba(148,163,184,0.42)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="8 10"
          />
          <path
            d="M28 88 C76 44, 110 76, 146 48"
            fill="none"
            stroke="#16a34a"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M146 48 C184 18, 217 42, 257 25"
            fill="none"
            stroke="#0891b2"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M257 25 C282 14, 298 22, 306 38"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="4 8"
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: "7%",
            bottom: 35,
            width: 32,
            height: 32,
            borderRadius: 14,
            background: "#16a34a",
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            fontSize: 16,
            fontWeight: 950,
            boxShadow: "0 10px 22px rgba(22,163,74,0.24)",
          }}
        >
          ✓
        </div>

        <div
          style={{
            position: "absolute",
            left: "42%",
            top: 46,
            width: 36,
            height: 36,
            borderRadius: 15,
            background: "linear-gradient(135deg, #14b8c6, #078da0)",
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            fontSize: 18,
            fontWeight: 950,
            boxShadow: "0 12px 26px rgba(7,141,160,0.24)",
          }}
        >
          ⌁
        </div>

        <div
          style={{
            position: "absolute",
            right: "18%",
            top: 25,
            width: 38,
            height: 38,
            borderRadius: 16,
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            fontSize: 18,
            fontWeight: 950,
            boxShadow: "0 14px 30px rgba(245,158,11,0.28)",
          }}
        >
          ↗
        </div>

        <div
          style={{
            position: "absolute",
            right: "4%",
            top: 44,
            width: 30,
            height: 30,
            borderRadius: 13,
            background: "#64748b",
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            fontSize: 14,
            fontWeight: 900,
            boxShadow: "0 8px 18px rgba(100,116,139,0.20)",
          }}
        >
          ▣
        </div>

        <div
          style={{
            position: "absolute",
            left: 12,
            top: 12,
            borderRadius: 999,
            background: "rgba(255,255,255,0.86)",
            border: "1px solid rgba(191,231,238,0.76)",
            padding: "5px 8px",
            fontSize: 8.5,
            fontWeight: 900,
            color: "#067889",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Preview / DB-ready
        </div>
      </div>

      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 7 }}>
        {routeNodes.map((node) => (
          <div
            key={node.state}
            style={{
              minHeight: 58,
              borderRadius: 16,
              border: `1px solid ${node.border}`,
              background: `linear-gradient(180deg, ${node.softBg}, rgba(255,255,255,0.96))`,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              padding: "7px 4px",
            }}
          >
            <div style={{ color: node.tone, fontSize: 15, fontWeight: 950, lineHeight: 1 }}>
              {node.icon}
            </div>
            <div style={{ marginTop: 5, color: "#14264b", fontSize: 8.7, lineHeight: 1.05, fontWeight: 900 }}>
              {node.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 10,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        <div
          style={{
            borderRadius: 16,
            border: "1px solid rgba(191,231,238,0.76)",
            background: "linear-gradient(135deg, #ffffff, #f4fdff)",
            padding: "9px 10px",
          }}
        >
          <div style={{ fontSize: 8.3, fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase", color: "#067889" }}>
            Active Trail
          </div>
          <div style={{ marginTop: 3, fontSize: 11.4, fontWeight: 880, color: "#14264b", lineHeight: 1.06 }}>
            Island Hopping
          </div>
        </div>

        <div
          style={{
            borderRadius: 16,
            border: "1px solid rgba(191,231,238,0.76)",
            background: "linear-gradient(135deg, #ffffff, #fff8dc)",
            padding: "9px 10px",
          }}
        >
          <div style={{ fontSize: 8.3, fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase", color: "#b45309" }}>
            Next Unlock
          </div>
          <div style={{ marginTop: 3, fontSize: 11.4, fontWeight: 880, color: "#14264b", lineHeight: 1.06 }}>
            After verified QR scan
          </div>
        </div>
      </div>
    </section>
  );
}



function SpmFeaturedPartnerTours() {
  const partnerTours = [
    {
      label: "Siargao Partner Tour",
      title: "Tri-Island Joiner",
      subtitle: "Guyam • Daku • Naked Island",
      badge: "Passport-ready",
      action: "View Tour",
      href: "/traveler/passport-trails/tri-island-joiner",
      tone: "#0891b2",
      softBg: "rgba(232,251,255,0.96)",
      softBorder: "#aee7f2",
    },
    {
      label: "Siargao Partner Tour",
      title: "Corregidor + Tri-Island",
      subtitle: "Corregidor • Guyam • Daku",
      badge: "Pricing before checkout",
      action: "Preview",
      href: "/traveler/passport-trails",
      tone: "#0f9aa8",
      softBg: "rgba(236,254,255,0.94)",
      softBorder: "#bfe7ee",
    },
    {
      label: "Siargao Partner Tour",
      title: "Sohoton Joiner",
      subtitle: "Sohoton • Bucas Grande",
      badge: "Activation-gated",
      action: "Preview Tour",
      href: "/traveler/passport-trails",
      tone: "#14a3b8",
      softBg: "rgba(240,253,255,0.94)",
      softBorder: "#bfe7ee",
    },
  ];

  return (
    <section
      aria-label="Featured Siargao Partner Tours"
      style={{
        marginTop: 18,
        border: "1px solid #bfe7ee",
        borderRadius: 24,
        background: "linear-gradient(180deg, rgba(255,255,255,0.99), rgba(244,253,255,0.94))",
        padding: 12,
        boxShadow: "0 16px 38px rgba(8,61,103,0.10)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0796a6" }}>
            Featured Siargao Partner Tours
          </div>
          <h2 style={{ margin: "5px 0 0", fontSize: 21, lineHeight: 1.03, fontWeight: 850, letterSpacing: "-0.045em", color: "#14264b" }}>
            Partner tours.
          </h2>
        </div>

        <a
          href="/traveler/passport-trails"
          aria-label="View all Siargao Partner Tours"
          style={{
            minHeight: 40,
            minWidth: 74,
            borderRadius: 16,
            background: "linear-gradient(135deg, #14b8c6, #078da0)",
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            fontSize: 10.2,
            fontWeight: 900,
            textDecoration: "none",
            boxShadow: "0 12px 26px rgba(7,141,160,0.22)",
          }}
        >
          View All
        </a>
      </div>

      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
        {partnerTours.map((tour) => (
          <a
            key={tour.title}
            href={tour.href}
            aria-label={`Open ${tour.title}`}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 82px",
              gap: 8,
              alignItems: "center",
              textDecoration: "none",
              border: `1px solid ${tour.softBorder}`,
              borderRadius: 17,
              background: `linear-gradient(135deg, ${tour.softBg}, #ffffff)`,
              padding: "9px 10px",
              color: "inherit",
              boxShadow: "0 8px 20px rgba(8,61,103,0.055)",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 8.4, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: tour.tone }}>
                {tour.label}
              </div>
              <div style={{ marginTop: 3, fontSize: 13.1, lineHeight: 1.03, fontWeight: 900, color: "#14264b" }}>
                {tour.title}
              </div>
              <div style={{ marginTop: 4, fontSize: 9.4, lineHeight: 1.1, fontWeight: 700, color: "#53657d" }}>
                {tour.subtitle}
              </div>
              <div
                style={{
                  marginTop: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 22,
                  borderRadius: 999,
                  background: "rgba(232,251,255,0.86)",
                  color: "#067889",
                  padding: "0 8px",
                  fontSize: 8.4,
                  fontWeight: 850,
                }}
              >
                {tour.badge}
              </div>
            </div>

            <div
              style={{
                minHeight: 44,
                borderRadius: 15,
                background: "linear-gradient(135deg, #14b8c6, #078da0)",
                color: "#ffffff",
                display: "grid",
                placeItems: "center",
                fontSize: 9.4,
                fontWeight: 900,
                textAlign: "center",
                boxShadow: "0 10px 22px rgba(7,141,160,0.18)",
              }}
            >
              {tour.action}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}



function SpmCuratedPassportTours() {
  const officialTrails = [
    {
      title: "Island Hopping Trail",
      subtitle: "Verified stamp route",
      status: "Recommended",
      cta: "Continue",
      href: "/traveler/passport-trails/tri-island-joiner",
      icon: "✓",
      tone: "#16a34a",
      softBg: "rgba(227,255,243,0.94)",
      softBorder: "#a9ebc9",
      buttonBg: "linear-gradient(135deg, #22b85a, #11843d)",
    },
    {
      title: "Surf Explorer Trail",
      subtitle: "Surf stops • coastal route",
      cta: "Preview",
      href: "/traveler/passport-trails",
      icon: "🌊",
      tone: "#0891b2",
      softBg: "rgba(232,251,255,0.96)",
      softBorder: "#aee7f2",
      buttonBg: "linear-gradient(135deg, #e8fbff, #ffffff)",
    },
    {
      title: "North Siargao Trail",
      subtitle: "Pacifico • north route",
      cta: "Preview",
      href: "/traveler/passport-trails",
      icon: "🧭",
      tone: "#2563eb",
      softBg: "rgba(239,246,255,0.96)",
      softBorder: "#bfd7ff",
      buttonBg: "linear-gradient(135deg, #eef6ff, #ffffff)",
    },
    {
      title: "Inland Discovery Trail",
      subtitle: "Falls • inland stops",
      cta: "Preview",
      href: "/traveler/passport-trails",
      icon: "🌿",
      tone: "#65a30d",
      softBg: "rgba(244,252,232,0.96)",
      softBorder: "#d4edaa",
      buttonBg: "linear-gradient(135deg, #f4fce8, #ffffff)",
    },
    {
      title: "Culture & Community Trail",
      subtitle: "Local life • culture stops",
      cta: "Preview",
      href: "/traveler/passport-trails",
      icon: "🧺",
      tone: "#d97706",
      softBg: "rgba(255,247,230,0.96)",
      softBorder: "#f3d49b",
      buttonBg: "linear-gradient(135deg, #fff7e6, #ffffff)",
    },
    {
      title: "Sunset & Scenic Stops Trail",
      subtitle: "Golden hour • scenic points",
      cta: "Preview",
      href: "/traveler/passport-trails",
      icon: "🌅",
      tone: "#f59e0b",
      softBg: "rgba(255,248,220,0.96)",
      softBorder: "#f6dd8f",
      buttonBg: "linear-gradient(135deg, #fff8dc, #ffffff)",
    },
    {
      title: "Adventure Trail",
      subtitle: "High-energy route",
      cta: "Preview",
      href: "/traveler/passport-trails",
      icon: "⛰️",
      tone: "#7c3aed",
      softBg: "rgba(245,240,255,0.96)",
      softBorder: "#d8c7ff",
      buttonBg: "linear-gradient(135deg, #f5f0ff, #ffffff)",
    },
    {
      title: "Return Traveler Continuity Trail",
      subtitle: "Come back and continue",
      cta: "Preview",
      href: "/traveler/passport-trails",
      icon: "↻",
      tone: "#64748b",
      softBg: "rgba(248,250,252,0.98)",
      softBorder: "#d8e2ee",
      buttonBg: "linear-gradient(135deg, #f8fafc, #ffffff)",
    },
  ];

  const featuredTrail = officialTrails[0];
  const previewTrails = officialTrails.slice(1);

  return (
    <section
      aria-label="Passport Trails Curated Tours"
      style={{
        marginTop: 14,
        border: "1px solid #bfe7ee",
        borderRadius: 24,
        background: "linear-gradient(180deg, rgba(255,255,255,0.99), rgba(244,253,255,0.94))",
        padding: 12,
        boxShadow: "0 16px 38px rgba(8,61,103,0.10)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0796a6" }}>
            Passport Trails™ Curated Tours
          </div>
          <h2 style={{ margin: "5px 0 0", fontSize: 21, lineHeight: 1.03, fontWeight: 850, letterSpacing: "-0.045em", color: "#14264b" }}>
            Official trails.
          </h2>
        </div>

        <a
          href="/traveler/passport-trails"
          aria-label="Explore all Passport Trails"
          style={{
            flexShrink: 0,
            minHeight: 44,
            minWidth: 78,
            borderRadius: 16,
            background: "linear-gradient(135deg, #22b85a, #11843d)",
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            fontSize: 10.6,
            fontWeight: 900,
            textDecoration: "none",
            boxShadow: "0 12px 26px rgba(17,132,61,0.22)",
          }}
        >
          Explore
        </a>
      </div>

      <a
        href={featuredTrail.href}
        aria-label={`Continue ${featuredTrail.title}`}
        style={{
          marginTop: 10,
          display: "grid",
          gridTemplateColumns: "44px 1fr 82px",
          alignItems: "center",
          gap: 8,
          border: `1px solid ${featuredTrail.softBorder}`,
          borderLeft: `5px solid ${featuredTrail.tone}`,
          borderRadius: 18,
          background: `linear-gradient(135deg, ${featuredTrail.softBg}, #ffffff)`,
          padding: 9,
          color: "inherit",
          textDecoration: "none",
          boxShadow: "0 10px 24px rgba(22,163,74,0.10)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 16,
            background: featuredTrail.buttonBg,
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            fontSize: 19,
            fontWeight: 950,
          }}
        >
          {featuredTrail.icon}
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 8.6, fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase", color: featuredTrail.tone }}>
            Recommended
          </div>
          <div style={{ marginTop: 2, fontSize: 14.3, fontWeight: 900, lineHeight: 1.03, color: "#14264b" }}>
            {featuredTrail.title}
          </div>
          <div style={{ marginTop: 4, fontSize: 9.7, fontWeight: 720, color: "#53657d", lineHeight: 1.12 }}>
            {featuredTrail.subtitle}
          </div>
        </div>

        <div
          style={{
            minHeight: 40,
            borderRadius: 15,
            background: featuredTrail.buttonBg,
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            fontSize: 9.5,
            fontWeight: 900,
            lineHeight: 1.05,
            boxShadow: "0 10px 22px rgba(17,132,61,0.18)",
          }}
        >
          {featuredTrail.cta}
        </div>
      </a>

      <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontSize: 10.2, fontWeight: 900, color: "#14264b" }}>More official trails</div>
        <div style={{ fontSize: 9.8, fontWeight: 780, color: "#53657d" }}>Preview first</div>
      </div>

      <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
        {previewTrails.map((trail) => (
          <a
            key={trail.title}
            href={trail.href}
            aria-label={`Preview ${trail.title}`}
            style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr 68px",
              alignItems: "center",
              gap: 8,
              border: `1px solid ${trail.softBorder}`,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${trail.softBg}, #ffffff)`,
              padding: "8px 9px",
              color: "inherit",
              textDecoration: "none",
              boxShadow: "0 7px 18px rgba(8,61,103,0.05)",
            }}
          >
            <div
              style={{
                width: 29,
                height: 29,
                borderRadius: 13,
                background: "rgba(255,255,255,0.82)",
                display: "grid",
                placeItems: "center",
                fontSize: 14,
                color: trail.tone,
                boxShadow: "0 6px 14px rgba(15,23,42,0.055)",
              }}
            >
              {trail.icon}
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11.3, fontWeight: 880, lineHeight: 1.04, color: "#14264b" }}>
                {trail.title}
              </div>
              <div style={{ marginTop: 3, fontSize: 8.8, fontWeight: 680, color: "#53657d", lineHeight: 1.1 }}>
                {trail.subtitle}
              </div>
            </div>

            <div
              style={{
                minHeight: 34,
                borderRadius: 13,
                background: trail.buttonBg,
                color: trail.tone,
                display: "grid",
                placeItems: "center",
                fontSize: 8.9,
                fontWeight: 900,
                border: `1px solid ${trail.softBorder}`,
              }}
            >
              Preview
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
          fontSize: 9.5,
          lineHeight: 1.22,
          fontWeight: 740,
          color: "#355071",
          border: "1px solid rgba(191,231,238,0.62)",
        }}
      >
        Pricing appears before checkout. Verified Passport stamps unlock only through governed OSP/SPM records.
      </div>
    </section>
  );
}



function SpmBuildYourOwnTrailSection() {
  return (
    <section
      aria-label="Build Your Own Passport Trail"
      style={{
        marginTop: 14,
        border: "1px solid #bfe7ee",
        borderRadius: 24,
        background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(246,241,255,0.96))",
        padding: 12,
        boxShadow: "0 16px 38px rgba(8,61,103,0.10)",
      }}
    >
      <a
        href="/traveler/passport-trails/diy-trail-builder"
        aria-label="Open Build Your Own Passport Trail"
        style={{
          display: "grid",
          gridTemplateColumns: "42px 1fr 94px",
          alignItems: "center",
          gap: 9,
          color: "inherit",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: 42,
            minHeight: 44,
            borderRadius: 18,
            background: "linear-gradient(135deg, #f1edff, #ffffff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          🧩
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 8.9, fontWeight: 840, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7048e8" }}>
            Build Your Own Passport Trail
          </div>
          <div style={{ marginTop: 2, fontSize: 16, fontWeight: 840, lineHeight: 1.04, color: "#14264b" }}>
            Plan your route
          </div>
          <div style={{ marginTop: 4, fontSize: 10.6, fontWeight: 670, color: "#53657d", lineHeight: 1.14 }}>
            SPM-guided. Partner support only when needed.
          </div>
        </div>

        <div
          style={{
            minHeight: 50,
            borderRadius: 16,
            background: "linear-gradient(135deg, #9b72ff, #7048e8)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: 10.5,
            fontWeight: 880,
            lineHeight: 1.05,
            boxShadow: "0 10px 22px rgba(139,92,246,0.22)",
          }}
        >
          ＋ Plan Route
        </div>
      </a>
    </section>
  );
}



function SpmGuideSupportProvidedBy() {
  const supportCards = [
    {
      title: "Siargao Partner Tour",
      support: "Partner guide",
      note: "Operator-supported package",
      tone: "#13a8b7",
    },
    {
      title: "Passport Trails™ Curated Tour",
      support: "SPM-guided",
      note: "Official route flow",
      tone: "#16a34a",
    },
    {
      title: "Build Your Own Passport Trail",
      support: "SPM route guidance",
      note: "Partner support if needed",
      tone: "#8b5cf6",
    },
  ];

  return (
    <section
      aria-label="Guide support provided by"
      style={{
        marginTop: 14,
        border: "1px solid #bfe7ee",
        borderRadius: 22,
        background: "linear-gradient(135deg, rgba(255,255,255,0.99), rgba(244,253,255,0.94))",
        padding: 12,
        boxShadow: "0 12px 28px rgba(8,61,103,0.07)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ fontSize: 8.9, fontWeight: 840, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0796a6" }}>
            Guide Support
          </div>
          <h2 style={{ margin: "4px 0 0", fontSize: 18, lineHeight: 1.04, fontWeight: 780, letterSpacing: "-0.04em", color: "#14264b" }}>
            Who supports the trip?
          </h2>
        </div>
        <a
          href="/traveler/passport-trails"
          aria-label="Ask about guide support"
          style={{
            flexShrink: 0,
            borderRadius: 999,
            background: "linear-gradient(135deg, #e8fbff, #ffffff)",
            color: "#067889",
            padding: "8px 10px",
            fontSize: 9.8,
            fontWeight: 850,
            textDecoration: "none",
          }}
        >
          Check
        </a>
      </div>

      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
        {supportCards.map((card) => (
          <div
            key={card.title}
            style={{
              minHeight: 78,
              border: "1px solid #bfe7ee",
              borderTop: `4px solid ${card.tone}`,
              borderRadius: 16,
              background: "linear-gradient(135deg, #ffffff, #f7fcfd)",
              padding: "8px 7px",
            }}
          >
            <div style={{ fontSize: 9.4, fontWeight: 820, lineHeight: 1.06, color: "#14264b" }}>
              {card.title}
            </div>
            <div style={{ marginTop: 5, fontSize: 9, fontWeight: 820, color: card.tone, lineHeight: 1.08 }}>
              {card.support}
            </div>
            <div style={{ marginTop: 4, fontSize: 9, fontWeight: 650, color: "#53657d", lineHeight: 1.1 }}>
              {card.note}
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
      title: "Book a local tour",
      sub: "Partner-operated",
      badge: "Pricing shown before booking",
      href: "/traveler/passport-trails/tri-island-joiner",
      tone: "#13a8b7",
      cta: "↗ View Tours",
    },
    {
      icon: "🗺️",
      label: "Passport Trails™ Curated Tour",
      title: "Follow an official trail",
      sub: "SPM-guided",
      badge: "Stamps unlock when verified",
      href: "/traveler/passport-trails",
      tone: "#16a34a",
      cta: "⌁ Explore Trails",
    },
    {
      icon: "🧩",
      label: "Build Your Own Passport Trail",
      title: "Plan your route",
      sub: "SPM-guided planning",
      badge: "Preview first",
      href: "/traveler/passport-trails/diy-trail-builder",
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




