import { cookies } from "next/headers";
import Link from "next/link";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
}

async function getPassportTrailPackages() {
  const token = cookies().get("osp_access_token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${getApiBaseUrl()}/spm/passport-trail-packages`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? [];
  } catch {
    return null;
  }
}

export default async function TravelerPassportTrailsPage() {
  const packages = await getPassportTrailPackages();

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 18% 8%, rgba(19,168,183,0.16) 0, transparent 28%), linear-gradient(180deg, #f7fbff 0%, #eef8f7 45%, #fff8e8 100%)",
        color: "#14264b",
        fontFamily: '"Avenir Next", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: "14px 12px 104px",
      }}
    >
      <div
        style={{
          maxWidth: 430,
          margin: "0 auto",
          minHeight: "100vh",
          borderRadius: 32,
          background: "rgba(255,255,255,0.58)",
          boxShadow: "0 22px 60px rgba(15,23,42,0.08)",
          border: "1px solid rgba(255,255,255,0.72)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ padding: "16px 14px 18px" }}>
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 10,
                  fontWeight: 720,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "#13a8b7",
                }}
              >
                Siargao Passport Map™
              </p>
              <h1
                style={{
                  margin: "4px 0 0",
                  fontFamily: '"Avenir Next", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: 34,
                  lineHeight: 0.92,
                  letterSpacing: "-0.055em",
                  color: "#14264b",
                }}
              >
                Passport
                <br />
                Trails™
              </h1>
            </div>

            <Link
              href="/traveler/passport-map"
              aria-label="Return to Passport Map"
              style={{
                minHeight: 38,
                borderRadius: 999,
                border: "1px solid rgba(19,168,183,0.24)",
                background: "rgba(255,255,255,0.92)",
                color: "#13a8b7",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 13px",
                fontSize: 11,
                fontWeight: 720,
                textDecoration: "none",
                boxShadow: "0 8px 18px rgba(15,23,42,0.06)",
              }}
            >
              ← Map
            </Link>
          </header>

          <section
            aria-label="Passport Trails discovery hero"
            style={{
              borderRadius: 28,
              background:
                "linear-gradient(135deg, rgba(20,61,102,0.98) 0%, rgba(19,168,183,0.94) 56%, rgba(242,183,5,0.88) 135%)",
              color: "#ffffff",
              padding: 18,
              boxShadow: "0 18px 40px rgba(20,38,75,0.16)",
              marginBottom: 14,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -22,
                top: -24,
                width: 110,
                height: 110,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.24)",
                background: "rgba(255,255,255,0.08)",
              }}
            />

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                borderRadius: 999,
                background: "rgba(255,255,255,0.14)",
                padding: "6px 9px",
                fontSize: 9,
                fontWeight: 720,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f2b705" }} />
              Package Catalog
            </div>

            <p
              style={{
                margin: 0,
                fontSize: 12,
                lineHeight: 1.42,
                fontWeight: 680,
                color: "rgba(255,255,255,0.88)",
                maxWidth: 320,
              }}
            >
              Explore governed Passport Trails™ packages with live progress, pricing visibility,
              and stamp-ready nodes. Booking actions will activate only after governed operator, pricing, and payment readiness.
            </p>

            <div
              style={{
                marginTop: 13,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 999,
                background: "rgba(255,255,255,0.92)",
                color: "#143d66",
                padding: "7px 10px",
                fontSize: 10,
                fontWeight: 720,
              }}
            >
              Powered by Passport Trails™
            </div>
          </section>

          <section aria-label="Passport Trails list" style={{ display: "grid", gap: 12 }}>
            {(packages ?? []).map((trail: any, index: number) => (
              <Link
                key={trail.packageId}
                href={`/traveler/passport-trails/${trail.packageSlug}`}
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(203,213,225,0.76)",
                  background: "rgba(255,255,255,0.97)",
                  boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
                  padding: 14,
                  textDecoration: "none",
                  color: "#14264b",
                  display: "grid",
                  gap: 10,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 5,
                    background: index % 3 === 0 ? "#13a8b7" : index % 3 === 1 ? "#1fa45b" : "#f2b705",
                  }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 9,
                        fontWeight: 720,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#13a8b7",
                      }}
                    >
                      Passport Package
                    </p>
                    <h2
                      style={{
                        margin: "5px 0 0",
                        fontFamily: '"Avenir Next", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontSize: 23,
                        lineHeight: 0.98,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {trail.packageName}
                    </h2>
                  </div>

                  <span
                    style={{
                      borderRadius: 999,
                      background: "rgba(19,168,183,0.10)",
                      color: "#13a8b7",
                      fontSize: 10,
                      fontWeight: 720,
                      padding: "7px 9px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    View
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.35, color: "#607089", fontWeight: 680 }}>
                  {trail.shortDescription ?? trail.description ?? "Official Passport Trails™ package route."}
                </p>

                <div
                  aria-label="Package progress"
                  style={{
                    height: 8,
                    borderRadius: 999,
                    background: "rgba(20,38,75,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(0, Math.min(100, Number(trail.packageProgress?.progressPercentage ?? 0)))}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #13a8b7 0%, #1fa45b 100%)",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 7 }}>
                  <MiniStat value={String(trail.linkedNodeCount ?? 0)} label="Nodes" />
                  <MiniStat value={String(trail.stampEligibleNodeCount ?? 0)} label="Stamp-ready" />
                  <MiniStat value={`${trail.packageProgress?.progressPercentage ?? 0}%`} label="Progress" />
                </div>
              </Link>
            ))}

            {!packages?.length ? (
              <div
                style={{
                  borderRadius: 24,
                  border: "1px dashed rgba(148,163,184,0.70)",
                  background: "rgba(248,250,252,0.90)",
                  padding: 18,
                  color: "#64748b",
                  fontSize: 13,
                  fontWeight: 750,
                  lineHeight: 1.4,
                }}
              >
                No Passport Trails™ packages are available yet. Once approved packages are distributed, they will appear here.
              </div>
            ) : null}
          </section>
        </div>

        <TravelerBottomNav active="trails" />
      </div>
    </main>
  );
}

function MiniStat(props: { value: string; label: string }) {
  return (
    <div style={{ borderRadius: 16, background: "rgba(20,38,75,0.05)", padding: "9px 8px" }}>
      <div style={{ fontSize: 15, fontWeight: 720, color: "#14264b" }}>{props.value}</div>
      <div style={{ marginTop: 2, fontSize: 9, fontWeight: 650, color: "#718096" }}>{props.label}</div>
    </div>
  );
}

function TravelerBottomNav(props: { active: "map" | "trails" | "pass" | "profile" }) {
  return (
    <nav
      aria-label="Traveler bottom navigation"
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 12,
        minHeight: 66,
        borderRadius: 24,
        background: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(203,213,225,0.74)",
        boxShadow: "0 18px 42px rgba(15,23,42,0.12)",
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        alignItems: "center",
        padding: "6px 7px",
      }}
    >
      <BottomNavItem href="/traveler/passport-map" label="Map" icon="⌖" active={props.active === "map"} />
      <BottomNavItem href="/traveler/passport-trails" label="Trails" icon="⌁" active={props.active === "trails"} />
      <BottomNavItem href="/traveler/pass" label="Pass" icon="▣" active={props.active === "pass"} />
      <BottomNavItem href="/" label="Profile" icon="◌" active={props.active === "profile"} />
    </nav>
  );
}

function BottomNavItem(props: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={props.href}
      style={{
        minHeight: 50,
        borderRadius: 18,
        background: props.active ? "rgba(19,168,183,0.12)" : "transparent",
        color: props.active ? "#13a8b7" : "#64748b",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        fontSize: 10,
        fontWeight: 660,
        textDecoration: "none",
      }}
    >
      <span style={{ fontSize: 17, lineHeight: 1 }}>{props.icon}</span>
      <span>{props.label}</span>
    </Link>
  );
}
