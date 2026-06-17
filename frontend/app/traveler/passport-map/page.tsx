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

// OSP_PASSPORT_MAP_IMAGE_CARD_TEXT_CONTRAST_09J
export default async function TravelerPassportMapPage() {
  const spmPreview = await getSpmTravelerPreview();
  return (
    <main className="osp-traveler-bottom-tab-safe-page"
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
            padding: "16px 14px calc(96px + env(safe-area-inset-bottom))",
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
              href="/traveler/app"
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
                  fontSize: 21.5,
                  lineHeight: 1.04,
                  letterSpacing: "-0.035em",
                  color: "#013863",
                  fontWeight: 790,
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
                  fontSize: 12,
                  lineHeight: 1.18,
                  fontWeight: 690,
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
                  background: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(20,38,75,0.07)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  position: "relative",
                  boxShadow: "0 7px 16px rgba(15,23,42,0.055)",
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
                  background: "linear-gradient(135deg, #13AFC0, #078DA0)",
                  border: "1px solid rgba(255,255,255,0.54)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  position: "relative",
                  boxShadow: "0 9px 20px rgba(7,141,160,0.20)",
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
                    fontSize: 14.5,
                    fontWeight: 900,
                    letterSpacing: "-0.035em",
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

          <SpmVerifiedStopsPreview stops={spmPreview?.verifiedStops} />

          <SpmJourneyHubEngagement />
        </div>

        
      <div aria-hidden="true" style={{ height: 0 }} />
      <UniversalTravelerBottomTabBar activeTab="trails" fixed />

      </div>
        <style
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
          /* OSP_PASSPORT_MAP_CREATIVE_TEXT_WHITE_09K */
          [style*="/osp/spm/passport-map/"] h1,
          [style*="/osp/spm/passport-map/"] h2,
          [style*="/osp/spm/passport-map/"] h3,
          [style*="/osp/spm/passport-map/"] h4,
          [style*="/osp/spm/passport-map/"] strong,
          [style*="/osp/spm/passport-map/"] p {
            color: #FFFFFF !important;
            text-shadow: 0 2px 8px rgba(1, 24, 48, 0.82) !important;
          }

          [style*="/osp/spm/passport-map/"] a,
          [style*="/osp/spm/passport-map/"] a strong,
          [style*="/osp/spm/passport-map/"] a p {
            color: #FFFFFF !important;
            text-shadow: 0 2px 8px rgba(1, 24, 48, 0.82) !important;
          }

          [style*="/osp/spm/passport-map/"] small,
          [style*="/osp/spm/passport-map/"] em {
            color: rgba(255,255,255,0.94) !important;
            text-shadow: 0 1px 6px rgba(1, 24, 48, 0.78) !important;
          }
            

          /* OSP_PASSPORT_MAP_CAPSULE_TEXT_BLUE_11D */
          [style*="/osp/spm/passport-map/return-traveler-continuity.png"] h1,
          [style*="/osp/spm/passport-map/return-traveler-continuity.png"] h2,
          [style*="/osp/spm/passport-map/return-traveler-continuity.png"] h3,
          [style*="/osp/spm/passport-map/return-traveler-continuity.png"] h4,
          [style*="/osp/spm/passport-map/return-traveler-continuity.png"] strong,
          [style*="/osp/spm/passport-map/return-traveler-continuity.png"] p,
          [style*="/osp/spm/passport-map/check-trail-hierarchy.png"] h1,
          [style*="/osp/spm/passport-map/check-trail-hierarchy.png"] h2,
          [style*="/osp/spm/passport-map/check-trail-hierarchy.png"] h3,
          [style*="/osp/spm/passport-map/check-trail-hierarchy.png"] h4,
          [style*="/osp/spm/passport-map/check-trail-hierarchy.png"] strong,
          [style*="/osp/spm/passport-map/check-trail-hierarchy.png"] p,
          [style*="/osp/spm/passport-map/your-passport-progress.png"] h1,
          [style*="/osp/spm/passport-map/your-passport-progress.png"] h2,
          [style*="/osp/spm/passport-map/your-passport-progress.png"] h3,
          [style*="/osp/spm/passport-map/your-passport-progress.png"] h4,
          [style*="/osp/spm/passport-map/your-passport-progress.png"] strong,
          [style*="/osp/spm/passport-map/your-passport-progress.png"] p,
          [style*="/osp/spm/passport-map/guide-support.png"] h1,
          [style*="/osp/spm/passport-map/guide-support.png"] h2,
          [style*="/osp/spm/passport-map/guide-support.png"] h3,
          [style*="/osp/spm/passport-map/guide-support.png"] h4,
          [style*="/osp/spm/passport-map/guide-support.png"] strong,
          [style*="/osp/spm/passport-map/guide-support.png"] p {
            color: #013863 !important;
            text-shadow: 0 1px 4px rgba(255, 255, 255, 0.88) !important;
          }

          [style*="/osp/spm/passport-map/return-traveler-continuity.png"] small,
          [style*="/osp/spm/passport-map/return-traveler-continuity.png"] em,
          [style*="/osp/spm/passport-map/check-trail-hierarchy.png"] small,
          [style*="/osp/spm/passport-map/check-trail-hierarchy.png"] em,
          [style*="/osp/spm/passport-map/your-passport-progress.png"] small,
          [style*="/osp/spm/passport-map/your-passport-progress.png"] em,
          [style*="/osp/spm/passport-map/guide-support.png"] small,
          [style*="/osp/spm/passport-map/guide-support.png"] em {
            color: rgba(1, 56, 99, 0.88) !important;
            text-shadow: 0 1px 4px rgba(255, 255, 255, 0.88) !important;
          }


          /* OSP_PASSPORT_MAP_FLEXIBLE_TRAIL_TEXT_BLUE_11E */
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] h1,
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] h2,
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] h3,
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] h4,
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] strong,
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] p,
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] small,
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] em,
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] a,
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] button {
            color: #013863 !important;
            text-shadow: 0 1px 4px rgba(255,255,255,0.82) !important;
          }

          /* Keep the primary CTA (Start route) white */
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] a:first-of-type,
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] a:first-of-type *,
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] button:first-of-type,
          [style*="/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png"] button:first-of-type * {
            color: #FFFFFF !important;
            text-shadow: none !important;
          }
`,
          }}
        />

</main>
  );
}

type SpmVerifiedStopPreviewData = {
  stopName?: string;
  subtitle?: string | null;
  verificationStatus?: string;
  source?: string;
  href?: string;
};

type StopPreviewIcon = "wave" | "park" | "bridge" | "pin";


function SpmBuildYourOwnTrailSection() {
  return (
    <section
      aria-label="Build your own Passport Trail"
      style={{
        marginTop: 14,
        borderRadius: 28,
        padding: 16,
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(234,251,250,0.98))",
        backgroundImage:
          "url(/osp/spm/passport-map/flexible-trail/build-your-own-passport-trail.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
        border: "1px solid rgba(5,150,165,0.16)",
        boxShadow: "0 16px 38px rgba(1,56,99,0.08)",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          borderRadius: 999,
          padding: "7px 10px",
          background: "rgba(243,174,38,0.18)",
          color: "#013863",
          fontSize: 9,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#F3AE26",
          }}
        />
        Flexible trail
      </div>

      <h2
        style={{
          margin: "11px 0 0",
          color: "#013863",
          fontSize: 21,
          lineHeight: 1,
          letterSpacing: "-0.045em",
          fontWeight: 920,
        }}
      >
        Build your own Passport Trail
      </h2>

      <p
        style={{
          margin: "8px 0 0",
          color: "#50668B",
          fontSize: 12.4,
          lineHeight: 1.35,
          fontWeight: 720,
        }}
      >
        Choose verified stops, save your route, and continue your Siargao journey at your own pace.
      </p>

      <div
        style={{
          marginTop: 13,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        <a
          href="/traveler/passport-trails/diy-trail-builder"
          style={{
            minHeight: 46,
            borderRadius: 16,
            background: "#013863",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          Start route
        </a>

        <a
          href="/traveler/passport-trails"
          style={{
            minHeight: 46,
            borderRadius: 16,
            background: "#FFFFFF",
            color: "#013863",
            border: "1px solid rgba(1,56,99,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          View trails
        </a>
      </div>
    </section>
  );
}



function SpmGuideSupportProvidedBy() {
  return (
    <section
      aria-label="Guide support"
      style={{
        marginTop: 14,
        borderRadius: 28,
        padding: 16,
        background: "#FFFFFF",
        backgroundImage:
          "url(/osp/spm/passport-map/flexible-trail/guided-when-needed.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
        border: "1px solid rgba(1,56,99,0.10)",
        boxShadow: "0 16px 38px rgba(1,56,99,0.075)",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          borderRadius: 999,
          padding: "7px 10px",
          background: "rgba(5,150,165,0.10)",
          color: "#013863",
          fontSize: 9,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#0596A5",
          }}
        />
        Local support
      </div>

      <h2
        style={{
          margin: "11px 0 0",
          color: "#013863",
          fontSize: 21,
          lineHeight: 1,
          letterSpacing: "-0.045em",
          fontWeight: 920,
        }}
      >
        Guided when needed
      </h2>

      <p
        style={{
          margin: "8px 0 0",
          color: "#50668B",
          fontSize: 12.4,
          lineHeight: 1.35,
          fontWeight: 720,
        }}
      >
        Bookable routes can connect to approved local operators, guides, transport, and route support where required.
      </p>

      <div
        style={{
          marginTop: 13,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
        }}
      >
        {["Guide", "Pickup", "Route"].map((item) => (
          <div
            key={item}
            style={{
              minHeight: 44,
              borderRadius: 16,
              background: "#F4FCFA",
              border: "1px solid rgba(5,150,165,0.12)",
              color: "#013863",
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}


function SpmVerifiedStopsPreview({ stops }: { stops?: SpmVerifiedStopPreviewData[] }) {
  const fallbackStops: SpmVerifiedStopPreviewData[] = [
    {
      stopName: "Cloud 9",
      subtitle: "Surf landmark",
      verificationStatus: "STAMP_READY",
      source: "site-access",
      href: "/traveler/site-access/cloud-9",
    },
    {
      stopName: "Malinao Skate Park",
      subtitle: "Community stop",
      verificationStatus: "STAMP_READY",
      source: "site-access",
      href: "/traveler/site-access/malinao-skate-park",
    },
    {
      stopName: "AFAM / Catangnan Bridge",
      subtitle: "Scenic stop",
      verificationStatus: "STAMP_READY",
      source: "site-access",
      href: "/traveler/site-access/afam-catangnan-bridge",
    },
  ];

  const sourceStops = Array.isArray(stops) && stops.length ? stops : fallbackStops;

  const verifiedCards = sourceStops.slice(0, 6).map((stop, index) => {
    const normalizedName = stop.stopName || fallbackStops[index % fallbackStops.length]?.stopName || "Verified Stop";
    const normalizedSubtitle =
      stop.subtitle ||
      (normalizedName.toLowerCase().includes("cloud")
        ? "Surf landmark"
        : normalizedName.toLowerCase().includes("malinao")
          ? "Community stop"
          : normalizedName.toLowerCase().includes("bridge") || normalizedName.toLowerCase().includes("catangnan")
            ? "Scenic stop"
            : "Passport stop");

    const normalizedHref =
      stop.href ||
      (normalizedName.toLowerCase().includes("cloud")
        ? "/traveler/site-access/cloud-9"
        : normalizedName.toLowerCase().includes("malinao")
          ? "/traveler/site-access/malinao-skate-park"
          : normalizedName.toLowerCase().includes("bridge") || normalizedName.toLowerCase().includes("catangnan")
            ? "/traveler/site-access/afam-catangnan-bridge"
            : "/traveler/passport-trails/follow-map");

    const tone =
      normalizedName.toLowerCase().includes("cloud")
        ? "#F3AE26"
        : normalizedName.toLowerCase().includes("malinao")
          ? "#0596A5"
          : normalizedName.toLowerCase().includes("bridge") || normalizedName.toLowerCase().includes("catangnan")
            ? "#013863"
            : "#047D8A";

    const soft =
      normalizedName.toLowerCase().includes("cloud")
        ? "#FFF7E6"
        : normalizedName.toLowerCase().includes("malinao")
          ? "#EAFBFA"
          : normalizedName.toLowerCase().includes("bridge") || normalizedName.toLowerCase().includes("catangnan")
            ? "#EEF6FA"
            : "#F4FCFA";

    const icon: StopPreviewIcon =
      normalizedName.toLowerCase().includes("cloud")
        ? "wave"
        : normalizedName.toLowerCase().includes("malinao")
          ? "park"
          : normalizedName.toLowerCase().includes("bridge") || normalizedName.toLowerCase().includes("catangnan")
            ? "bridge"
            : "pin";

    return {
      name: normalizedName,
      subtitle: normalizedSubtitle,
      href: normalizedHref,
      tone,
      soft,
      icon,
    };
  });

  return (
    <section
      aria-label="Verified Stops"
      style={{
        marginTop: 15,
        borderRadius: 30,
        padding: "15px 13px 17px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.995) 0%, rgba(246,253,251,0.985) 100%)",
        border: "1px solid rgba(5,150,165,0.105)",
        boxShadow: "0 20px 48px rgba(1,56,99,0.075)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#047D8A",
              fontSize: 8.9,
              fontWeight: 840,
              letterSpacing: "0.125em",
              textTransform: "uppercase",
            }}
          >
            Verified Stops
          </div>
          <h2
            style={{
              margin: "5px 0 0",
              color: "#083F4D",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 20.2,
              lineHeight: 1.02,
              fontWeight: 540,
              letterSpacing: "-0.034em",
            }}
          >
            Stamp-ready places
          </h2>
        </div>

        <span
          style={{
            borderRadius: 999,
            padding: "5.5px 8px",
            background: "#EAFBFA",
            border: "1px solid rgba(5,150,165,0.105)",
            color: "#047D8A",
            fontSize: 8.6,
            fontWeight: 840,
            whiteSpace: "nowrap",
          }}
        >
          OSP verified
        </span>
      </div>

      <div
        aria-label="Verified stop cards"
        style={{
          display: "flex",
          gap: 9,
          overflowX: "auto",
          padding: "13px 1px 2px",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {verifiedCards.map((stop) => (
          <StopPreviewCard
            key={`${stop.name}-${stop.href}`}
            stopName={stop.name}
            subtitle={stop.subtitle}
            href={stop.href}
            tone={stop.tone}
            soft={stop.soft}
            icon={stop.icon}
          />
        ))}
      </div>
    </section>
  );
}

// OSP_PASSPORT_MAP_MEDIA_SHARPEN_09B
function StopPreviewCard(props: {
  stopName: string;
  subtitle: string;
  href: string;
  tone: string;
  soft: string;
  icon: StopPreviewIcon;
}) {
  const icon = (() => {
    if (props.icon === "wave") {
      return (
        <svg width="27" height="27" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M6 20.5C8.3 18.9 10.7 18.9 13 20.5C15.3 22.1 17.7 22.1 20 20.5C22.3 18.9 24.7 18.9 27 20.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M7 24.5C9.3 22.9 11.7 22.9 14 24.5C16.3 26.1 18.7 26.1 21 24.5C23.3 22.9 25.7 22.9 28 24.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.58" />
          <path d="M11 15.5C13.8 11.6 18.2 10.5 22.5 12.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.72" />
        </svg>
      );
    }

    if (props.icon === "park") {
      return (
        <svg width="27" height="27" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M8 22H24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M10 20L15 12L20 20" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.5 12L22 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.62" />
          <circle cx="10" cy="22" r="2.2" fill="currentColor" opacity="0.86" />
          <circle cx="23" cy="22" r="2.2" fill="currentColor" opacity="0.86" />
        </svg>
      );
    }

    if (props.icon === "bridge") {
      return (
        <svg width="27" height="27" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M7 21H25" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M9 21C10.3 15.8 12.7 13 16 13C19.3 13 21.7 15.8 23 21" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
          <path d="M11 17H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.62" />
          <path d="M16 13V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.62" />
        </svg>
      );
    }

    return (
      <svg width="27" height="27" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 27C16 27 24 19.7 24 12.8C24 8.4 20.4 5 16 5C11.6 5 8 8.4 8 12.8C8 19.7 16 27 16 27Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
        <circle cx="16" cy="13" r="3" fill="currentColor" opacity="0.82" />
      </svg>
    );
  })();

  return (
    <a
      href={props.href}
      aria-label={`Open verified stop: ${props.stopName}`}
      style={{
        flex: "0 0 166px",
        scrollSnapAlign: "start",
        minHeight: 128,
        borderRadius: 23,
        padding: 10,
        background: props.soft,
            backgroundImage:
              props.stopName === "Cloud 9"
                ? "url(/osp/spm/passport-map/verified-stops/cloud-9-surf-landmark.png)"
                : props.stopName === "Malinao Skate Park"
                  ? "url(/osp/spm/passport-map/verified-stops/malinao-skate-park-community-stop.png)"
                  : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
        border: "1px solid rgba(5,150,165,0.105)",
        boxShadow: "0 10px 21px rgba(1,56,99,0.048)",
        color: "inherit",
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 88% 4%, rgba(255,255,255,0.70), transparent 32%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <span
          aria-hidden="true"
          style={{
            width: 42,
            height: 42,
            borderRadius: 17,
            background: "rgba(255,255,255,0.90)",
            border: "1px solid rgba(1,56,99,0.06)",
            color: props.tone,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 7px 15px rgba(1,56,99,0.048)",
            flex: "0 0 auto",
          }}
        >
          {icon}
        </span>

        <span
          style={{
            borderRadius: 999,
            padding: "4.5px 6.5px",
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(1,56,99,0.06)",
            color: props.tone,
            fontSize: 8.1,
            lineHeight: 1,
            fontWeight: 840,
            whiteSpace: "nowrap",
          }}
        >
          Stamp ready
        </span>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <h3
          style={{
            margin: 0,
            color: "#083F4D",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 15,
            lineHeight: 1.03,
            fontWeight: 540,
            letterSpacing: "-0.027em",
          }}
        >
          {props.stopName}
        </h3>

        <p
          style={{
            margin: "5px 0 0",
            color: "#61737B",
            fontSize: 10,
            lineHeight: 1.18,
            fontWeight: 610,
          }}
        >
          {props.subtitle}
        </p>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 8,
        }}
      >
        <span
          style={{
            width: 29,
            height: 29,
            borderRadius: 999,
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(1,56,99,0.06)",
            color: props.tone,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 340,
          }}
        >
          ›
        </span>
      </div>
    </a>
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
    { label: "Cloud 9", x: "64%", y: "50%", tone: "#F3AE26", href: "/traveler/site-access/cloud-9" },
    { label: "General Luna", x: "56%", y: "66%", tone: "#0097A7", href: "/traveler/passport-trails?zone=general-luna" },
    { label: "Island Hopping", x: "43%", y: "75%", tone: "#013863", href: "/traveler/passport-trails/island-hopping?pin=island-hopping" },
    { label: "North Siargao", x: "49%", y: "25%", tone: "#F3AE26", href: "/traveler/passport-trails/north-siargao?pin=north-siargao" },
    { label: "Sugba Lagoon", x: "33%", y: "45%", tone: "#0097A7", href: "/traveler/partner-tours?focus=sugba-lagoon-adventure" },
  ];

  const trailStatus = [
    { value: "4", label: "Stops ready" },
    { value: "QR", label: "Stamp enabled" },
    { value: "5", label: "Trail zones" },
  ];

  return (
    <section
      aria-label="Continue Passport Trail with Siargao map preview"
      style={{
        marginTop: 16,
        marginBottom: 0,
        borderRadius: 28,
        background: "linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 64%, #FFFFFF 100%)",
        color: "#013863",
        padding: 13,
        boxShadow: "0 18px 44px rgba(1,56,99,0.12)",
        border: "1px solid rgba(0,151,167,0.16)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -96,
          right: -88,
          width: 176,
          height: 176,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(243,174,38,0.22) 0%, rgba(243,174,38,0.00) 68%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -128,
          left: -104,
          width: 210,
          height: 210,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,151,167,0.16) 0%, rgba(0,151,167,0.00) 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 1,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              borderRadius: 999,
              background: "#013863",
              color: "#FFFFFF",
              padding: "7px 10px",
              fontSize: 9.2,
              fontWeight: 920,
              letterSpacing: "0.11em",
              textTransform: "uppercase",
              boxShadow: "0 10px 24px rgba(1,56,99,0.16)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#F3AE26",
                boxShadow: "0 0 0 4px rgba(243,174,38,0.18)",
              }}
            />
            Active Trail
          </div>

          <div
            style={{
              borderRadius: 999,
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.10)",
              color: "#50668B",
              padding: "7px 9px",
              fontSize: 9.2,
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            QR Ready
          </div>
        </div>

        <h2
          style={{
            margin: "12px 0 0",
            fontSize: 23,
            lineHeight: 1,
            fontWeight: 830,
            letterSpacing: "-0.04em",
            color: "#013863",
          }}
        >
          Continue your Siargao trail
        </h2>

        <p
          style={{
            margin: "7px 0 0",
            color: "#50668B",
            fontSize: 12.6,
            lineHeight: 1.32,
            fontWeight: 720,
            maxWidth: 330,
          }}
        >
          Resume your route. Check verified stops.
        </p>

        <div
          aria-label="Passport trail status"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 7,
            marginTop: 12,
          }}
        >
          {trailStatus.map((item) => (
            <div
              key={item.label}
              style={{
                borderRadius: 16,
                background: "#FFFFFF",
                border: "1px solid rgba(0,151,167,0.13)",
                padding: "8px 8px",
                boxShadow: "0 8px 18px rgba(1,56,99,0.055)",
              }}
            >
              <div
                style={{
                  color: "#013863",
                  fontSize: 14.5,
                  lineHeight: 1,
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  marginTop: 4,
                  color: "#50668B",
                  fontSize: 9.2,
                  lineHeight: 1.08,
                  fontWeight: 810,
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 12,
            borderRadius: 24,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.105)",
            padding: 7,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              borderRadius: 20,
              minHeight: 258,
              overflow: "hidden",
              background: "#EAFBFA",
              border: "1px solid rgba(0,151,167,0.13)",
            }}
          >
            <img
              src="/osp/spm/maps/osp-spm-passport-map-preview-v1.png"
              alt="Siargao Passport Map preview"
              style={{
                width: "100%",
                height: 258,
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                filter: "saturate(1.04) contrast(1.03)",
              }}
            />

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(1,56,99,0.13) 100%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                right: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div
                style={{
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(1,56,99,0.10)",
                  color: "#013863",
                  padding: "7px 10px",
                  fontSize: 10,
                  fontWeight: 920,
                  boxShadow: "0 8px 22px rgba(1,56,99,0.12)",
                }}
              >
                Passport Map
              </div>

              <div
                aria-label="Map zoom controls preview"
                style={{
                  display: "flex",
                  gap: 6,
                }}
              >
                {["+", "−"].map((label) => (
                  <span
                    key={label}
                    style={{
                      width: 29,
                      height: 29,
                      borderRadius: 11,
                      background: "rgba(255,255,255,0.94)",
                      border: "1px solid rgba(1,56,99,0.12)",
                      color: "#013863",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 16,
                      fontWeight: 900,
                      boxShadow: "0 8px 20px rgba(1,56,99,0.12)",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {mapPins.map((pin) => (
              <a
                key={pin.label}
                href={pin.href}
                aria-label={`Open ${pin.label} from Passport Map`}
                style={{
                  position: "absolute",
                  left: pin.x,
                  top: pin.y,
                  transform: "translate(-50%, -50%)",
                  textDecoration: "none",
                  display: "grid",
                  placeItems: "center",
                  width: 27,
                  height: 27,
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  border: `2.5px solid ${pin.tone}`,
                  color: pin.tone,
                  fontSize: 10,
                  fontWeight: 920,
                  boxShadow: "0 10px 24px rgba(1,56,99,0.24)",
                }}
                title={pin.label}
              >
                ●
              </a>
            ))}

            <div
              style={{
                position: "absolute",
                left: 9,
                right: 9,
                bottom: 9,
                borderRadius: 17,
                background: "rgba(255,255,255,0.95)",
                border: "1px solid rgba(1,56,99,0.10)",
                padding: 9,
                boxShadow: "0 10px 24px rgba(1,56,99,0.13)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ color: "#013863", fontSize: 11.6, fontWeight: 900, letterSpacing: "-0.02em" }}>
                    Next: Cloud 9
                  </div>
                  <div style={{ marginTop: 3, color: "#50668B", fontSize: 10.2, lineHeight: 1.22, fontWeight: 740 }}>
                    Verified stop preview
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 999,
                    background: "#F3AE26",
                    color: "#013863",
                    padding: "6px 8px",
                    fontSize: 9.2,
                    fontWeight: 920,
                    whiteSpace: "nowrap",
                  }}
                >
                  Stamp ready
                </div>
              </div>

              <div
                aria-hidden="true"
                style={{
                  marginTop: 9,
                  height: 6,
                  borderRadius: 999,
                  background: "rgba(1,56,99,0.10)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "42%",
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #0097A7 0%, #F3AE26 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "1.16fr 0.84fr",
            gap: 8,
          }}
        >
          <a
            href="/traveler/passport-trails/follow-map"
            aria-label="Resume Passport Trail"
            style={{
              minHeight: 50,
              borderRadius: 17,
              background: "#013863",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 13.6,
              fontWeight: 900,
              boxShadow: "0 14px 30px rgba(1,56,99,0.20)",
            }}
          >
            Resume trail
          </a>

          <a
            href="/traveler/passport-trails"
            aria-label="View verified Passport Trail stops"
            style={{
              minHeight: 50,
              borderRadius: 17,
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.12)",
              color: "#013863",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 12.7,
              fontWeight: 880,
            }}
          >
            View stops
          </a>
        </div>
      </div>
    </section>
  );
}

function SpmFeaturedPartnerTours() {
  const partnerTours = [
    {
      eyebrow: "Popular route",
      title: "Tri-Island Joiner Tour",
      image: "/osp/spm/passport-map/featured-local-tours/tri-island-joiner-tour.png",
      description: "Classic General Luna island-hopping route.",
      meta: ["Joiner", "Island day"],
      href: "/traveler/partner-tours?focus=tri-island-joiner",
      visual: "boat",
      tone: "#047f91",
      shell: "linear-gradient(145deg, #F0FBFA 0%, #E5F8F6 58%, #FFFFFF 100%)",
    },
    {
      eyebrow: "Land route",
      title: "Siargao Land Tour Highlights",
      image: "/osp/spm/passport-map/featured-local-tours/siargao-land-tour-highlights.png",
      description: "Scenic inland and coastal stops.",
      meta: ["Full day", "Land tour"],
      href: "/traveler/partner-tours?focus=land-tour-highlights",
      visual: "route",
      tone: "#013863",
      shell: "linear-gradient(145deg, #FFF8EA 0%, #F8F1DF 56%, #FFFFFF 100%)",
    },
    {
      eyebrow: "Lagoon route",
      title: "Sugba Lagoon Adventure",
      image: "/osp/spm/passport-map/featured-local-tours/sugba-lagoon-adventure.png",
      description: "A calm day trip through lagoon waters.",
      meta: ["Day trip", "Nature route"],
      href: "/traveler/partner-tours?focus=sugba-lagoon-adventure",
      visual: "lagoon",
      tone: "#0596A5",
      shell: "linear-gradient(145deg, #F0FAFB 0%, #E3F5F7 58%, #FFFFFF 100%)",
    },
    {
      eyebrow: "Scenic route",
      title: "North Siargao Local Route",
      image: "/osp/spm/passport-map/featured-local-tours/north-siargao-local-route.png",
      description: "Slower northern stops and local views.",
      meta: ["Flexible", "Scenic stops"],
      href: "/traveler/partner-tours?focus=north-siargao-local-route",
      visual: "north",
      tone: "#9A6A12",
      shell: "linear-gradient(145deg, #FFF8EC 0%, #F8EEDB 58%, #FFFFFF 100%)",
    },
  ];

  const renderTourIcon = (type: string, tone: string) => {
    if (type === "boat") {
      return (
        <svg width="29" height="29" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M5.5 18.5H26.5L23.8 24.2C23.3 25.3 22.2 26 21 26H11C9.8 26 8.7 25.3 8.2 24.2L5.5 18.5Z" fill={tone} opacity="0.92" />
          <path d="M11 18.5V10.2C11 9.5 11.5 9 12.2 9H19.9C20.6 9 21.1 9.5 21.1 10.2V18.5" stroke={tone} strokeWidth="2" strokeLinecap="round" />
          <path d="M7 21.5C9 22.8 11 22.8 13 21.5C15 22.8 17 22.8 19 21.5C21 22.8 23 22.8 25 21.5" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    }

    if (type === "route") {
      return (
        <svg width="29" height="29" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M9 24C12.5 19.5 18.5 20.2 23 8" stroke={tone} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8.5" cy="24" r="3" fill={tone} opacity="0.92" />
          <circle cx="23.5" cy="8" r="3" fill={tone} opacity="0.92" />
          <path d="M12 12.5H17.5" stroke={tone} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
          <path d="M14.5 16H20" stroke={tone} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
        </svg>
      );
    }

    if (type === "lagoon") {
      return (
        <svg width="29" height="29" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M7 20.5C9.2 19.1 11.4 19.1 13.6 20.5C15.8 21.9 18 21.9 20.2 20.5C22.4 19.1 24.6 19.1 26.8 20.5" stroke={tone} strokeWidth="2.1" strokeLinecap="round" />
          <path d="M8 24.5C10.2 23.1 12.4 23.1 14.6 24.5C16.8 25.9 19 25.9 21.2 24.5C23.4 23.1 25.6 23.1 27.8 24.5" stroke={tone} strokeWidth="2.1" strokeLinecap="round" opacity="0.62" />
          <path d="M13 16.5L16 8L20 16.5" stroke={tone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 8L18 16.5" stroke={tone} strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
        </svg>
      );
    }

    return (
      <svg width="29" height="29" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M8 23C11.5 17.5 15 14 24 9" stroke={tone} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M9.5 13.5C12.2 11.2 15.4 10.3 19 11" stroke={tone} strokeWidth="1.8" strokeLinecap="round" opacity="0.58" />
        <path d="M12.5 18C15.5 16.1 18.7 15.5 22 16.2" stroke={tone} strokeWidth="1.8" strokeLinecap="round" opacity="0.58" />
        <circle cx="24" cy="9" r="3" fill={tone} opacity="0.92" />
        <circle cx="8" cy="23" r="3" fill={tone} opacity="0.92" />
      </svg>
    );
  };

  return (
    <section
      aria-label="Featured Local Tours"
      style={{
        marginTop: 14,
        borderRadius: 30,
        padding: "17px 14px 19px",
        background: "linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,253,252,0.98) 100%)",
        border: "1px solid rgba(5,150,165,0.12)",
        boxShadow: "0 24px 60px rgba(1,56,99,0.09)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#047D8A",
              fontSize: 9.2,
              fontWeight: 850,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
            }}
          >
            Featured Local Tours
          </div>
          <h2
            style={{
              margin: "5px 0 0",
              color: "#083F4D",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 21,
              lineHeight: 1.02,
              fontWeight: 560,
              letterSpacing: "-0.038em",
            }}
          >
            Bookable island routes
          </h2>
        </div>

        <span
          style={{
            borderRadius: 999,
            padding: "6px 9px",
            background: "#EAFBFA",
            border: "1px solid rgba(5,150,165,0.12)",
            color: "#047D8A",
            fontSize: 9,
            fontWeight: 850,
            whiteSpace: "nowrap",
          }}
        >
          Local partners
        </span>
      </div>

      <p
        style={{
          margin: "7px 0 0",
          color: "#61737B",
          fontSize: 11.4,
          lineHeight: 1.28,
          fontWeight: 620,
          maxWidth: 300,
        }}
      >
        Curated island experiences from approved Siargao partners.
      </p>

      <div
        aria-label="Featured local tour cards"
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          padding: "14px 1px 3px",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {partnerTours.map((tour) => (
          <a
            key={tour.title}
            href={tour.href}
            aria-label={`View tour: ${tour.title}`}
            style={{
              flex: "0 0 214px",
              scrollSnapAlign: "start",
              minHeight: 158,
              borderRadius: 24,
              padding: 11,
              background: tour.shell,
              backgroundImage: tour.image
                ? `url(${tour.image})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              border: "1px solid rgba(5,150,165,0.13)",
              boxShadow: "0 12px 24px rgba(1,56,99,0.06)",
              color: "inherit",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 9,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at 88% 10%, rgba(255,255,255,0.72), transparent 34%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.86)",
                  border: "1px solid rgba(5,150,165,0.10)",
                  color: tour.tone,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 9px 18px rgba(1,56,99,0.065)",
                  flex: "0 0 auto",
                }}
              >
                {renderTourIcon(tour.visual, tour.tone)}
              </span>

              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 8px",
                  background: "rgba(255,255,255,0.86)",
                  border: "1px solid rgba(5,150,165,0.10)",
                  color: tour.tone,
                  fontSize: 8.6,
                  lineHeight: 1,
                  fontWeight: 850,
                  whiteSpace: "nowrap",
                }}
              >
                {tour.eyebrow}
              </span>
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <h3
                style={{
                  margin: 0,
                  color: "#083F4D",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: 16.2,
                  lineHeight: 1.02,
                  fontWeight: 560,
                  letterSpacing: "-0.032em",
                }}
              >
                {tour.title}
              </h3>

              <p
                style={{
                  margin: "7px 0 0",
                  color: "#61737B",
                  fontSize: 10.7,
                  lineHeight: 1.24,
                  fontWeight: 610,
                }}
              >
                {tour.description}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {tour.meta.map((item) => (
                  <span
                    key={item}
                    style={{
                      borderRadius: 999,
                      padding: "5px 8px",
                      background: "rgba(255,255,255,0.78)",
                      border: "1px solid rgba(1,56,99,0.06)",
                      color: "#50668B",
                      fontSize: 8.8,
                      lineHeight: 1,
                      fontWeight: 760,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <span
              style={{
                position: "relative",
                zIndex: 1,
                minHeight: 32,
                borderRadius: 999,
                background: "linear-gradient(135deg, #035F6C 0%, #024E5A 100%)",
                color: "#FFFFFF",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10.8,
                fontWeight: 850,
                letterSpacing: "-0.01em",
                boxShadow: "0 10px 18px rgba(4,125,138,0.18)",
              }}
            >
              View Tour →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}


// OSP_PASSPORT_MAP_FEATURED_TRAIL_HERO_PAGE_CARD_10K
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
          image: "/osp/spm/passport-map/explorer-surf-trail.png",
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
          image: "/osp/spm/passport-map/culture-community-trail.png",
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
          image: "/osp/spm/passport-map/food-wellness-trail.png",
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
    width: "100%",
    maxWidth: "none",
    margin: "16px 0 0",
    padding: "0 0 24px",
  }}
>
  <div
    style={{
      borderRadius: 30,
      border: "1px solid rgba(5,150,165,0.12)",
      background: "linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,253,252,0.98) 100%)",
      padding: "16px 14px 18px",
      boxShadow: "0 24px 60px rgba(1,56,99,0.105)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 14,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <h2
          style={{
            margin: 0,
            color: "#083F4D",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 25.8,
            lineHeight: 1,
            letterSpacing: "-0.045em",
            fontWeight: 520,
          }}
        >
          Official Passport Trails
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
          <p style={{ margin: 0, color: "#61737B", fontSize: 11.8, lineHeight: 1.15, fontWeight: 620, letterSpacing: "0.005em" }}>
            Real Siargao trail routes
          </p>
          <span aria-hidden="true" style={{ color: "#39BFC5", fontSize: 15, fontWeight: 850, lineHeight: 1, transform: "translateY(-1px)" }}>
            〰
          </span>
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          width: 50,
          height: 50,
          borderRadius: 999,
          border: "1px solid rgba(5,150,165,0.11)",
          background: "linear-gradient(145deg, #FFFFFF 0%, #ECFBF9 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 22px rgba(1,56,99,0.10)",
          flex: "0 0 auto",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <circle cx="16" cy="16" r="12.7" stroke="#047D8A" strokeWidth="2" />
          <path d="M22 8.8L17.7 19.3L9.8 22.5L14.2 11.9L22 8.8Z" fill="#047D8A" opacity="0.94" />
          <circle cx="16" cy="16" r="2.1" fill="#FFFFFF" />
        </svg>
      </div>
    </div>

    <article
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
        border: "1px solid rgba(5,150,165,0.20)",
        background: "linear-gradient(135deg, #E8FBF9 0%, #D8F6F3 48%, #BFEDEA 100%)",
        padding: "16px 15px 15px",
        minHeight: 214,
        boxShadow: "0 18px 38px rgba(0,151,167,0.18)",
      }}
    >
      <img
        src="/osp/spm/passport-map/featured-trail/island-hopping-passport-trail-hero-page-card.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.98,
          pointerEvents: "none",
          filter: "saturate(1.03) contrast(1.01)",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(232,251,249,0.99) 0%, rgba(232,251,249,0.94) 34%, rgba(232,251,249,0.62) 54%, rgba(232,251,249,0.16) 78%, rgba(232,251,249,0.04) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(232,251,249,0.00) 34%, rgba(232,251,249,0.18) 100%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "55%" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.78)",
            background: "rgba(255,255,255,0.80)",
            padding: "6px 10px",
            color: "#AD7418",
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            boxShadow: "0 6px 14px rgba(1,56,99,0.04)",
          }}
        >
          <span aria-hidden="true">★</span>
          Featured Trail
        </span>

        <h3
          style={{
            margin: "12px 0 0",
            color: "#083F4D",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 23.2,
            lineHeight: 1.02,
            letterSpacing: "-0.046em",
            fontWeight: 560,
          }}
        >
          Island Hopping Passport Trail
        </h3>

        <p style={{ margin: "10px 0 0", color: "#566872", fontSize: 11.8, lineHeight: 1.34, fontWeight: 650 }}>
          Classic island route from General Luna.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {["Official", "One-day", "Port-linked"].map((chip, index) => (
            <span
              key={chip}
              style={{
                borderRadius: 999,
                padding: "5px 9px",
                background: index === 2 ? "#F7E5B8" : index === 1 ? "#DDF5F4" : "#BFEFEA",
                color: index === 2 ? "#A46D11" : "#047D8A",
                fontSize: 9.8,
                lineHeight: 1,
                fontWeight: 850,
              }}
            >
              {chip}
            </span>
          ))}
        </div>

        <a
          href="/traveler/passport-trails/island-hopping"
          style={{
            marginTop: 15,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 11,
            borderRadius: 18,
            background: "linear-gradient(135deg, #035F6C 0%, #024E5A 100%)",
            color: "#FFFFFF",
            padding: "11px 14px 11px 19px",
            fontSize: 12.8,
            fontWeight: 850,
            textDecoration: "none",
            boxShadow: "0 16px 26px rgba(4,125,138,0.28)",
          }}
        >
          View trail
          <span
            aria-hidden="true"
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              background: "rgba(24,174,180,0.55)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            →
          </span>
        </a>
      </div>
    </article>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 10,
        marginTop: 13,
      }}
    >
      {[
        {
          href: "/traveler/passport-trails/sugba-lagoon",
          title: "Sugba Lagoon",
          image: "/osp/spm/passport-map/sugba-lagoon.png",
          line: "Hidden lagoon escape.",
          icon: "/osp/spm/trails/icons/sugba-lagoon-badge.png?v=01l",
          background: "linear-gradient(145deg, #EFFAF6 0%, #E7F7F1 100%)",
          border: "#D4EEE2",
          accent: "#047D8A",
        },
        {
          href: "/traveler/passport-trails/bucas-grande-sohoton",
          title: "Bucas Grande / Sohoton",
          image: "/osp/spm/passport-map/bucas-grande-sohoton.png",
          line: "Caves, cliffs, clear waters.",
          icon: "/osp/spm/trails/icons/bucas-sohoton-badge.png?v=01l",
          background: "linear-gradient(145deg, #F0FAFB 0%, #E7F6F8 100%)",
          border: "#D5EDF2",
          accent: "#047D8A",
        },
        {
          href: "/traveler/passport-trails/siargao-land-tour",
          title: "Siargao Land Tour",
          image: "/osp/spm/passport-map/siargao-land-tour.png",
          line: "Scenic spots. Local gems.",
          icon: "/osp/spm/trails/icons/siargao-land-tour-badge.png?v=01l",
          background: "linear-gradient(145deg, #FFF7EA 0%, #FFF2DF 100%)",
          border: "#F1E1C3",
          accent: "#B77913",
        },
        {
          href: "/traveler/passport-trails/culture-community",
          title: "Culture & Community Trail",
          image: "/osp/spm/passport-map/culture-community-trail.png",
          line: "Stories, people, heritage.",
          icon: "/osp/spm/trails/icons/culture-community-badge.png?v=01l",
          background: "linear-gradient(145deg, #FFF1EF 0%, #FDE8E5 100%)",
          border: "#F1D4D0",
          accent: "#C84A43",
        },
        {
          href: "/traveler/passport-trails/explorer-surf",
          title: "Explorer Surf Trail",
          image: "/osp/spm/passport-map/explorer-surf-trail.png",
          line: "Chase waves. Find flow.",
          icon: "/osp/spm/trails/icons/explorer-surf-badge.png?v=01l",
          background: "linear-gradient(145deg, #EFF8FF 0%, #E4F2FC 100%)",
          border: "#D4E8F5",
          accent: "#047D8A",
        },
        {
          href: "/traveler/passport-trails/food-wellness",
          title: "Food & Wellness Trail",
          image: "/osp/spm/passport-map/food-wellness-trail.png",
          line: "Savor. Nourish. Heal.",
          icon: "/osp/spm/trails/icons/food-wellness-badge.png?v=01l",
          background: "linear-gradient(145deg, #FFF9EC 0%, #FFF3DF 100%)",
          border: "#F1E3C4",
          accent: "#B77913",
        },
      ].map((trail) => (
        <a
          key={trail.title}
          href={trail.href}
          style={{
            minHeight: 138,
            borderRadius: 22,
            border: `1px solid ${trail.border}`,
            background: trail.background,
            backgroundImage: trail.image
              ? `url(${trail.image})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            padding: 10,
            color: "inherit",
            textDecoration: "none",
            boxShadow: "0 12px 24px rgba(1,56,99,0.06)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 7,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 82% 14%, rgba(255,255,255,0.62), transparent 30%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <img
              src={trail.icon}
              alt=""
              aria-hidden="true"
              style={{
                width: 58,
                height: 58,
                borderRadius: 999,
                objectFit: "cover",
                objectPosition: "center",
                background: "transparent",
                border: "0 solid transparent",
                boxShadow: "0 8px 16px rgba(1,56,99,0.10)",
                flex: "0 0 auto",
                transform: "scale(1.12)",
                transformOrigin: "center",
              }}
            />

            <span
              aria-hidden="true"
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                background: "rgba(255,255,255,0.84)",
                border: "1px solid rgba(5,150,165,0.12)",
                color: trail.accent,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 500,
                boxShadow: "0 8px 18px rgba(1,56,99,0.055)",
                flex: "0 0 auto",
              }}
            >
              →
            </span>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <h3
              style={{
                margin: 0,
                color: "#083F4D",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 15.2,
                lineHeight: 1.04,
                letterSpacing: "-0.028em",
                fontWeight: 560,
              }}
            >
              {trail.title}
            </h3>
            <p style={{ margin: "6px 0 0", color: "#62727B", fontSize: 10.2, lineHeight: 1.22, fontWeight: 650 }}>
              {trail.line}
            </p>
            <span
              style={{
                marginTop: 8,
                display: "inline-flex",
                borderRadius: 999,
                background: "#BFEFEA",
                padding: "5px 9px",
                color: "#047D8A",
                fontSize: 9,
                lineHeight: 1,
                fontWeight: 820,
              }}
            >
              Official
            </span>
          </div>
        </a>
      ))}
    </div>

    <a
      href="/traveler/passport-trails/return-traveler-continuity"
      style={{
        marginTop: 13,
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderRadius: 22,
        border: "1px solid rgba(5,150,165,0.18)",
        background: "linear-gradient(135deg, #DDF7F4 0%, #C9F1EE 100%)",
        backgroundImage: `linear-gradient(90deg, rgba(221,247,244,0.78) 0%, rgba(221,247,244,0.58) 52%, rgba(221,247,244,0.32) 100%), url(/osp/spm/passport-map/return-traveler-continuity.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
        padding: 12,
        color: "inherit",
        textDecoration: "none",
        boxShadow: "0 12px 24px rgba(1,56,99,0.075)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src="/osp/spm/trails/icons/return-continuity-badge.png?v=01l"
        alt=""
        aria-hidden="true"
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          objectFit: "cover",
          objectPosition: "center",
          boxShadow: "0 8px 16px rgba(4,125,138,0.16)",
          flex: "0 0 auto",
          position: "relative",
          zIndex: 1,
          transform: "scale(1.10)",
          transformOrigin: "center",
        }}
      />

      <div style={{ minWidth: 0, flex: 1, position: "relative", zIndex: 1 }}>
        <h3 style={{ margin: 0, color: "#083F4D", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 16.6, lineHeight: 1.04, letterSpacing: "-0.025em", fontWeight: 600 }}>
          Return Traveler Continuity
        </h3>
        <p style={{ margin: "5px 0 0", color: "#61737B", fontSize: 11, fontWeight: 650 }}>
          Pick up where you left off.
        </p>
      </div>

      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          borderRadius: 17,
          background: "linear-gradient(135deg, #035F6C 0%, #024E5A 100%)",
          color: "#FFFFFF",
          padding: "10px 12px 10px 15px",
          fontSize: 11,
          lineHeight: 1,
          fontWeight: 850,
          flex: "0 0 auto",
          boxShadow: "0 10px 18px rgba(4,125,138,0.20)",
          position: "relative",
          zIndex: 1,
        }}
      >
        Continue
        <span aria-hidden="true">→</span>
      </span>
    </a>

    <div style={{ display: "grid", gap: 10, marginTop: 13 }}>
      <a
        href="/traveler/passport-trails"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderRadius: 20,
          border: "1px solid #E1E8EA",
          background: "#FFFFFF",
          backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.18) 54%, rgba(255,255,255,0.28) 100%), url(/osp/spm/passport-map/check-trail-hierarchy.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
          padding: "11px 12px",
          color: "inherit",
          textDecoration: "none",
          boxShadow: "0 9px 20px rgba(1,56,99,0.045)",
        }}
      >
        <div aria-hidden="true" style={{ width: 46, height: 46, borderRadius: 999, border: "1px solid #E5ECEE", background: "#F8FAFA", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <rect x="13" y="4" width="6" height="6" rx="1" stroke="#40545C" strokeWidth="1.8" />
            <rect x="5" y="22" width="6" height="6" rx="1" stroke="#40545C" strokeWidth="1.8" />
            <rect x="21" y="22" width="6" height="6" rx="1" stroke="#40545C" strokeWidth="1.8" />
            <path d="M16 10V16M8 22V18H24V22" stroke="#40545C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ margin: 0, color: "#083F4D", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 15.4, lineHeight: 1.06, letterSpacing: "-0.025em", fontWeight: 600 }}>
            Check trail hierarchy
          </h3>
          <p style={{ margin: "5px 0 0", color: "#687982", fontSize: 10.8, lineHeight: 1.2, fontWeight: 650 }}>
            See the full trail structure.
          </p>
        </div>
        <span aria-hidden="true" style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid rgba(5,150,165,0.10)", background: "rgba(255,255,255,0.80)", color: "#047D8A", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 350, boxShadow: "0 8px 18px rgba(1,56,99,0.04)", flex: "0 0 auto" }}>
          ›
        </span>
      </a>

      <a
        href="/traveler/passport"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderRadius: 20,
          border: "1px solid #CFEFEB",
          background: "linear-gradient(145deg, #EFFCFB 0%, #E5F8F6 100%)",
          backgroundImage: `linear-gradient(90deg, rgba(239,252,251,0.22) 0%, rgba(239,252,251,0.16) 56%, rgba(239,252,251,0.30) 100%), url(/osp/spm/passport-map/your-passport-progress.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
          padding: "11px 12px",
          color: "inherit",
          textDecoration: "none",
          boxShadow: "0 9px 20px rgba(1,56,99,0.045)",
        }}
      >
        <img
          src="/osp/spm/trails/icons/passport-progress-badge.png?v=01l"
          alt=""
          aria-hidden="true"
          style={{ width: 50, height: 50, borderRadius: 999, objectFit: "cover", objectPosition: "center", boxShadow: "0 8px 16px rgba(4,125,138,0.16)", flex: "0 0 auto", transform: "scale(1.10)", transformOrigin: "center" }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: 0, color: "#083F4D", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 15.4, lineHeight: 1.06, letterSpacing: "-0.025em", fontWeight: 600 }}>
                Your Passport Progress
              </h3>
              <p style={{ margin: "5px 0 0", color: "#687982", fontSize: 10.8, lineHeight: 1.2, fontWeight: 650 }}>
                4 of 12 trails completed
              </p>
            </div>
            <span style={{ borderRadius: 999, border: "1px solid #F2D391", background: "#FFFFFF", color: "#A46D11", padding: "6px 10px", fontSize: 10, lineHeight: 1, fontWeight: 850, whiteSpace: "nowrap" }}>
              ★ 120 pts
            </span>
          </div>
          <div style={{ marginTop: 10, height: 7, overflow: "hidden", borderRadius: 999, background: "#D5E5E5" }}>
            <div style={{ width: "34%", height: "100%", borderRadius: 999, background: "#047D8A" }} />
          </div>
        </div>
        <span aria-hidden="true" style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid rgba(5,150,165,0.10)", background: "rgba(255,255,255,0.80)", color: "#047D8A", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 350, boxShadow: "0 8px 18px rgba(1,56,99,0.04)", flex: "0 0 auto" }}>
          ›
        </span>
      </a>

      <a
        href="/traveler/settings?panel=assistant&topic=map"
        aria-label="Guide Support for Your Passport Journey"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderRadius: 20,
          border: "1px solid #F0DFC4",
          background: "linear-gradient(145deg, #FFF8EA 0%, #FFF1DD 100%)",
          backgroundImage: `linear-gradient(90deg, rgba(255,248,234,0.22) 0%, rgba(255,248,234,0.16) 56%, rgba(255,248,234,0.30) 100%), url(/osp/spm/passport-map/guide-support.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
          padding: "11px 12px",
          color: "inherit",
          textDecoration: "none",
          boxShadow: "0 9px 20px rgba(1,56,99,0.045)",
        }}
      >
        <div aria-hidden="true" style={{ width: 46, height: 46, borderRadius: 999, background: "#F6DCA7", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
          <svg width="25" height="25" viewBox="0 0 32 32" fill="none">
            <path d="M8 18V15C8 10.6 11.6 7 16 7C20.4 7 24 10.6 24 15V18" stroke="#083F4D" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M8 18H11V25H8C6.9 25 6 24.1 6 23V20C6 18.9 6.9 18 8 18Z" stroke="#083F4D" strokeWidth="2" />
            <path d="M24 18H21V25H24C25.1 25 26 24.1 26 23V20C26 18.9 25.1 18 24 18Z" stroke="#083F4D" strokeWidth="2" />
            <path d="M19 25C18.2 26.2 17.2 26.8 16 26.8" stroke="#083F4D" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ margin: 0, color: "#083F4D", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 15.4, lineHeight: 1.06, letterSpacing: "-0.025em", fontWeight: 600 }}>
            Guide Support
          </h3>
          <p style={{ margin: "5px 0 0", color: "#687982", fontSize: 10.8, lineHeight: 1.2, fontWeight: 650 }}>
            Local help for routes, bookings, and more.
          </p>
        </div>
        <span aria-hidden="true" style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid rgba(5,150,165,0.10)", background: "rgba(255,255,255,0.80)", color: "#B77913", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 350, boxShadow: "0 8px 18px rgba(1,56,99,0.04)", flex: "0 0 auto" }}>
          ›
        </span>
      </a>
    </div>
  </div>
</section>






  );
}