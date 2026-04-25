import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
}

async function getPassportTrailDetail(trailSlug: string) {
  const token = cookies().get("osp_access_token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${getApiBaseUrl()}/spm/passport-trails/${trailSlug}`, {
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
  const trail = await getPassportTrailDetail(params.trailSlug);
  if (!trail) notFound();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7fbff 0%, #eef8f7 45%, #fff8e8 100%)",
        color: "#14264b",
        padding: "18px 14px 96px",
      }}
    >
      <div style={{ maxWidth: 430, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", color: "#13a8b7" }}>
              Passport Trails™
            </p>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
                fontSize: 30,
                lineHeight: 0.95,
                letterSpacing: "-0.05em",
                color: "#14264b",
              }}
            >
              {trail.trailName}
            </h1>
          </div>

          <Link
            href="/traveler/passport-trails"
            style={{
              minHeight: 34,
              borderRadius: 999,
              border: "1px solid rgba(19,168,183,0.22)",
              background: "rgba(255,255,255,0.82)",
              color: "#13a8b7",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 12px",
              fontSize: 11,
              fontWeight: 950,
              textDecoration: "none",
            }}
          >
            Trails
          </Link>
        </header>

        <section
          style={{
            borderRadius: 28,
            background: "linear-gradient(135deg, #143d66 0%, #13a8b7 55%, #f2b705 130%)",
            color: "#ffffff",
            padding: 18,
            boxShadow: "0 18px 40px rgba(20,38,75,0.16)",
            marginBottom: 16,
          }}
        >
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.4, fontWeight: 750, color: "rgba(255,255,255,0.88)" }}>
            {trail.description ?? "Official governed Passport Trails™ discovery detail."}
          </p>
        </section>

        <section style={{ display: "grid", gap: 12 }}>
          <h2
            style={{
              margin: "0 2px",
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              fontSize: 24,
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            Approved Trail Nodes
          </h2>

          {(trail.nodes ?? []).map((node: any) => (
            <article
              key={node.stopId}
              style={{
                borderRadius: 22,
                border: "1px solid rgba(203,213,225,0.76)",
                background: "rgba(255,255,255,0.96)",
                boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
                padding: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 9,
                      fontWeight: 950,
                      letterSpacing: "0.09em",
                      textTransform: "uppercase",
                      color: node.stampEligible ? "#1fa45b" : "#8b95a1",
                    }}
                  >
                    {node.stampEligible ? "Stamp Eligible" : "Discovery Node"}
                  </p>
                  <h3 style={{ margin: "4px 0 0", fontSize: 16, lineHeight: 1.1, fontWeight: 950, color: "#14264b" }}>
                    {node.stopName}
                  </h3>
                </div>

                <span
                  style={{
                    borderRadius: 999,
                    background: node.safetyControlled ? "rgba(242,183,5,0.14)" : "rgba(19,168,183,0.10)",
                    color: node.safetyControlled ? "#9a6b00" : "#13a8b7",
                    fontSize: 9,
                    fontWeight: 950,
                    padding: "6px 8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {node.safetyControlled ? "Controlled" : node.requirementType}
                </span>
              </div>

              <p style={{ margin: "8px 0 0", fontSize: 12, lineHeight: 1.35, color: "#607089", fontWeight: 700 }}>
                {node.description ?? node.locationLabel ?? node.barangay ?? node.municipality ?? "Approved Passport Trails™ node."}
              </p>
            </article>
          ))}

          {!trail.nodes?.length ? (
            <div
              style={{
                borderRadius: 24,
                border: "1px dashed rgba(148,163,184,0.70)",
                background: "rgba(248,250,252,0.86)",
                padding: 18,
                color: "#64748b",
                fontSize: 13,
                fontWeight: 750,
                lineHeight: 1.4,
              }}
            >
              No approved nodes are available yet for this trail.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
