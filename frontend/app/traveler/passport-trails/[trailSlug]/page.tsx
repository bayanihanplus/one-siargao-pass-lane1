import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
}

async function getPassportTrailPackageDetail(trailSlug: string) {
  const token = cookies().get("osp_access_token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${getApiBaseUrl()}/spm/passport-trail-packages/${trailSlug}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.ok || !json?.data) return null;
    return json.data;
  } catch {
    return null;
  }
}

export default async function TravelerPassportTrailDetailPage({
  params,
}: {
  params: { trailSlug: string };
}) {
  const trail = await getPassportTrailPackageDetail(params.trailSlug);
  if (!trail) notFound();

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
          <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 720, letterSpacing: "0.13em", textTransform: "uppercase", color: "#13a8b7" }}>
                Passport Trails™
              </p>
              <h1
                style={{
                  margin: "4px 0 0",
                  fontFamily: '"Avenir Next", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: 30,
                  lineHeight: 0.95,
                  letterSpacing: "-0.05em",
                  color: "#14264b",
                }}
              >
                {trail.packageName}
              </h1>
            </div>

            <Link
              href="/traveler/passport-trails"
              aria-label="Back to Passport Trails"
              style={{
                minHeight: 38,
                borderRadius: 999,
                border: "1px solid rgba(19,168,183,0.22)",
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
              ← Trails
            </Link>
          </header>

          <section
            aria-label="Passport Trail detail hero"
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
              Package Detail
            </div>

            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.42, fontWeight: 680, color: "rgba(255,255,255,0.88)" }}>
              {trail.description ?? "Official governed Passport Trails™ package detail."}
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
              {trail.packageProgress?.progressPercentage ?? 0}% Complete
            </div>
          </section>

          <section style={{ display: "grid", gap: 12 }}>
            <h2
              style={{
                margin: "0 2px",
                fontFamily: '"Avenir Next", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: 24,
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              Package Stops
            </h2>

            {(trail.nodes ?? []).map((item: any) => {
              const node = item.node ?? {};
              const isStamped = item.stampState?.isStamped === true;
              const verificationStatus = item.verificationState?.verificationStatus ?? "NOT_VERIFIED";

              return (
                <article
                  key={node.nodeId ?? item.sortOrder}
                  style={{
                    borderRadius: 22,
                    border: "1px solid rgba(203,213,225,0.76)",
                    background: "rgba(255,255,255,0.97)",
                    boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
                    padding: 14,
                    position: "relative",
                    overflow: "hidden",
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
                      background: isStamped ? "#1fa45b" : item.isStampEligible ? "#13a8b7" : "#8b95a1",
                    }}
                  />

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 9,
                          fontWeight: 720,
                          letterSpacing: "0.09em",
                          textTransform: "uppercase",
                          color: isStamped ? "#1fa45b" : item.isStampEligible ? "#13a8b7" : "#8b95a1",
                        }}
                      >
                        {isStamped ? "Stamped" : item.isStampEligible ? "Stamp Ready" : "Discovery Node"}
                      </p>
                      <h3 style={{ margin: "4px 0 0", fontSize: 16, lineHeight: 1.1, fontWeight: 720, color: "#14264b" }}>
                        {node.nodeName}
                      </h3>
                    </div>

                    <span
                      style={{
                        borderRadius: 999,
                        background: isStamped ? "rgba(31,164,91,0.12)" : "rgba(19,168,183,0.10)",
                        color: isStamped ? "#1fa45b" : "#13a8b7",
                        fontSize: 9,
                        fontWeight: 720,
                        padding: "6px 8px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isStamped ? "Verified" : verificationStatus}
                    </span>
                  </div>

                  <p style={{ margin: "8px 0 0", fontSize: 12, lineHeight: 1.35, color: "#607089", fontWeight: 660 }}>
                    {node.description ?? "Approved Passport Trails™ package stop."}
                  </p>

                  <div
                    style={{
                      marginTop: 10,
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 8,
                    }}
                  >
                    <MiniDetail label="Stamp" value={item.stampState?.stampStatus ?? "NOT_STAMPED"} />
                    <MiniDetail label="Source" value={item.stampState?.verificationSource ?? "Pending"} />
                  </div>
                </article>
              );
            })}

            {!trail.nodes?.length ? (
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
                No package stops are available yet for this Passport Trails™ package.
              </div>
            ) : null}
          </section>
        </div>

        <TravelerBottomNav active="trails" />
      </div>
    </main>
  );
}


function MiniDetail(props: { label: string; value: string }) {
  return (
    <div style={{ borderRadius: 14, background: "rgba(20,38,75,0.05)", padding: "8px 8px" }}>
      <div style={{ fontSize: 8, fontWeight: 660, color: "#718096", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {props.label}
      </div>
      <div style={{ marginTop: 3, fontSize: 10, fontWeight: 720, color: "#14264b" }}>{props.value}</div>
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
