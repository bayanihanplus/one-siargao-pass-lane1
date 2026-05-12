import Link from "next/link";

type SiteAccessRegistryPoint = {
  found?: boolean;
  item?: {
    siteAccessPointCode: string;
    displayName: string;
    accessRule: string;
    registryStatus: string;
    isActive: boolean;
    isPublicVisible: boolean;
    physicalLocationLabel?: string | null;
    municipalityCode?: string | null;
    barangayCode?: string | null;
    feeRule?: {
      feeRequired?: boolean;
      feeType?: string;
      paymentProviderAllowed?: boolean;
      receiptRequired?: boolean;
    } | null;
    qrDefinition?: {
      publicScanUrl?: string | null;
      qrPurpose?: string | null;
      status?: string;
    } | null;
  } | null;
};

type PageMode = "LOCAL_COMMUNITY_STOP" | "SCENIC_VIEWPOINT_STOP";

type SiteVisitDetailPageProps = {
  code: string;
  fallbackTitle: string;
  mode: PageMode;
  bannerSrc: string;
  bannerAlt: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8001/api/v1";

const colors = {
  navy: "#013863",
  teal: "#0596A5",
  mist: "#EAFBFA",
  gold: "#F3AE26",
  slate: "#50668B",
  white: "#FFFFFF",
};

async function fetchSiteAccessPoint(code: string) {
  try {
    const response = await fetch(`${API_BASE}/site-access/registry/points/${code}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as SiteAccessRegistryPoint;
    return payload?.item || null;
  } catch {
    return null;
  }
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
      <path d="M9 18l-5 2V6l5-2 6 2 5-2v14l-5 2-6-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
      <path d="M5 5h5v5H5V5ZM14 5h5v5h-5V5ZM5 14h5v5H5v-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 14h2.2v2.2H19V19h-5v-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
      <path d="M5 8.5h3l1.4-2h5.2l1.4 2h3A1.5 1.5 0 0 1 20.5 10v7A1.5 1.5 0 0 1 19 18.5H5A1.5 1.5 0 0 1 3.5 17v-7A1.5 1.5 0 0 1 5 8.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 15.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default async function SiteVisitDetailPage(props: SiteVisitDetailPageProps) {
  const point = await fetchSiteAccessPoint(props.code);
  const title = point?.displayName || props.fallbackTitle;
  const isScenic = props.mode === "SCENIC_VIEWPOINT_STOP";

  const heroLine = isScenic
    ? "A quick scenic stop for photos, views, and a relaxed island pause."
    : "A local community stop for a quick visit, photos, and nearby discovery.";

  const bestFor = isScenic
    ? ["Photos", "Golden hour", "Short stop"]
    : ["Local stop", "Quick visit", "Route add-on"];

  const visitCues = isScenic
    ? [
        { label: "Best time", value: "Late afternoon" },
        { label: "Vibe", value: "Scenic pause" },
        { label: "Stay", value: "10–20 mins" },
      ]
    : [
        { label: "Best time", value: "Daylight visit" },
        { label: "Vibe", value: "Local stop" },
        { label: "Stay", value: "10–15 mins" },
      ];

  const quickReminders = isScenic
    ? ["Take photos safely", "Keep the bridge clear", "Respect local traffic"]
    : ["Respect local users", "Keep the area clean", "Visit during daylight"];

  const nearbyFlow = isScenic
    ? "Good stop before or after nearby Catangnan and Cloud 9 points."
    : "Good add-on while exploring Malinao and south-side map points.";

  const mapHref = "/traveler/passport-map";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: colors.mist,
        padding: "12px 12px 124px",
        boxSizing: "border-box",
        color: colors.navy,
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 430,
          margin: "0 auto",
          display: "grid",
          gap: 12,
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <Link
            href="/traveler/home"
            style={{
              minHeight: 38,
              borderRadius: 999,
              padding: "0 13px",
              background: colors.white,
              border: "1px solid rgba(1,56,99,0.10)",
              color: colors.navy,
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 900,
              boxShadow: "0 8px 20px rgba(1,56,99,0.055)",
            }}
          >
            ← Home
          </Link>

          <span
            style={{
              borderRadius: 999,
              padding: "6px 9px",
              background: colors.white,
              border: "1px solid rgba(5,150,165,0.18)",
              color: colors.teal,
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Site Visit
          </span>
        </header>

        <section
          style={{
            borderRadius: 30,
            background: colors.white,
            border: "1px solid rgba(5,150,165,0.16)",
            boxShadow: "0 22px 54px rgba(1,56,99,0.11)",
            padding: 16,
            display: "grid",
            gap: 14,
          }}
        >
          <div
            style={{
              minHeight: 168,
              borderRadius: 24,
              background: isScenic ? "#EAFBFA" : "#FFF7ED",
              border: isScenic ? "1px solid rgba(5,150,165,0.22)" : "1px solid rgba(243,174,38,0.26)",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 14px 30px rgba(1,56,99,0.08)",
            }}
          >
            <img
              src={props.bannerSrc}
              alt={props.bannerAlt}
              style={{
                width: "100%",
                height: "100%",
                minHeight: 168,
                display: "block",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>

          <div>
            <p
              style={{
                margin: 0,
                color: isScenic ? colors.teal : "#D97706",
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
              }}
            >
              {isScenic ? "Scenic LGU site visit" : "Validated LGU site visit"}
            </p>

            <h1
              style={{
                margin: "7px 0 0",
                color: colors.navy,
                fontSize: 30,
                lineHeight: 0.96,
                letterSpacing: "-0.055em",
                fontWeight: 900,
              }}
            >
              {title}
            </h1>

            <p
              style={{
                margin: "9px 0 0",
                color: colors.slate,
                fontSize: 13,
                lineHeight: 1.35,
                fontWeight: 720,
              }}
            >
              {heroLine}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            {bestFor.map((item) => (
              <div
                key={item}
                style={{
                  borderRadius: 16,
                  background: "#F8FCFC",
                  border: "1px solid rgba(1,56,99,0.08)",
                  padding: "10px 8px",
                  textAlign: "center",
                  color: colors.navy,
                  fontSize: 11,
                  fontWeight: 900,
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <div
            style={{
              borderRadius: 22,
              background: "#F4FCFA",
              border: "1px solid rgba(5,150,165,0.16)",
              padding: 13,
              display: "grid",
              gap: 9,
            }}
          >
            <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 15,
                  background: colors.white,
                  border: "1px solid rgba(5,150,165,0.16)",
                  display: "grid",
                  placeItems: "center",
                  color: colors.teal,
                  flex: "0 0 auto",
                }}
              >
                <QrIcon />
              </span>

              <div>
                <strong style={{ display: "block", fontSize: 12.5, color: colors.navy, lineHeight: 1.1 }}>
                  Free site visit
                </strong>
                <span style={{ display: "block", marginTop: 3, fontSize: 11.2, color: colors.slate, fontWeight: 720, lineHeight: 1.25 }}>
                  Use your OSP QR only when site-visit scan support is available.
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            {visitCues.map((cue) => (
              <div
                key={cue.label}
                style={{
                  borderRadius: 18,
                  background: colors.white,
                  border: "1px solid rgba(1,56,99,0.08)",
                  padding: "11px 8px",
                  minHeight: 58,
                  display: "grid",
                  alignContent: "center",
                  boxShadow: "0 8px 18px rgba(1,56,99,0.04)",
                }}
              >
                <span
                  style={{
                    color: colors.slate,
                    fontSize: 9.5,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {cue.label}
                </span>
                <strong
                  style={{
                    marginTop: 4,
                    color: colors.navy,
                    fontSize: 11.5,
                    lineHeight: 1.08,
                    fontWeight: 950,
                  }}
                >
                  {cue.value}
                </strong>
              </div>
            ))}
          </div>

          <section
            style={{
              borderRadius: 24,
              background: isScenic ? "#F8FCFC" : "#FFFBF5",
              border: isScenic ? "1px solid rgba(5,150,165,0.14)" : "1px solid rgba(243,174,38,0.18)",
              padding: 14,
              display: "grid",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 14,
                  background: colors.white,
                  border: "1px solid rgba(1,56,99,0.08)",
                  display: "grid",
                  placeItems: "center",
                  color: isScenic ? colors.teal : "#D97706",
                  flex: "0 0 auto",
                }}
              >
                <MapIcon />
              </span>
              <div>
                <strong style={{ display: "block", color: colors.navy, fontSize: 13, lineHeight: 1.1, fontWeight: 950 }}>
                  Suggested route flow
                </strong>
                <span style={{ display: "block", marginTop: 3, color: colors.slate, fontSize: 11.2, lineHeight: 1.25, fontWeight: 720 }}>
                  {nearbyFlow}
                </span>
              </div>
            </div>
          </section>

          <section
            style={{
              borderRadius: 24,
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.08)",
              padding: 14,
              display: "grid",
              gap: 9,
            }}
          >
            <strong style={{ color: colors.navy, fontSize: 13, lineHeight: 1.1, fontWeight: 950 }}>
              Quick reminders
            </strong>

            <div style={{ display: "grid", gap: 7 }}>
              {quickReminders.map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: colors.slate,
                    fontSize: 11.4,
                    fontWeight: 760,
                    lineHeight: 1.2,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 999,
                      background: isScenic ? colors.teal : colors.gold,
                      flex: "0 0 auto",
                    }}
                  />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <Link
            href={mapHref}
            style={{
              minHeight: 48,
              borderRadius: 18,
              background: colors.teal,
              color: colors.white,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 950,
              boxShadow: "0 14px 28px rgba(5,150,165,0.22)",
            }}
          >
            Open Map Point
          </Link>

          <Link
            href="/traveler/home"
            style={{
              minHeight: 42,
              borderRadius: 16,
              background: colors.white,
              color: colors.slate,
              border: "1px solid rgba(1,56,99,0.10)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 900,
            }}
          >
            Back to Home
          </Link>
        </section>
      </section>
    </main>
  );
}
