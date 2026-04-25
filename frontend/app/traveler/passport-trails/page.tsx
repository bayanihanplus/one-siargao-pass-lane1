import { cookies } from "next/headers";
import Link from "next/link";

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
}

async function getPassportTrails() {
  const token = cookies().get("osp_access_token")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${getApiBaseUrl()}/spm/passport-trails`, {
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
  const trails = await getPassportTrails();

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
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 950,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#13a8b7",
              }}
            >
              Siargao Passport Map™
            </p>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
                fontSize: 32,
                lineHeight: 0.95,
                letterSpacing: "-0.05em",
                color: "#14264b",
              }}
            >
              Passport Trails™
            </h1>
          </div>

          <Link
            href="/traveler/passport-map"
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
            Map
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
          <p
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.4,
              fontWeight: 750,
              color: "rgba(255,255,255,0.86)",
            }}
          >
            Discover official governed trail families. Booking, pricing, guide,
            operator, manifest, and payment logic remain intentionally excluded from this discovery layer.
          </p>
        </section>

        <div style={{ display: "grid", gap: 12 }}>
          {(trails ?? []).map((trail: any) => (
            <Link
              key={trail.trailId}
              href={`/traveler/passport-trails/${trail.trailSlug}`}
              style={{
                borderRadius: 24,
                border: "1px solid rgba(203,213,225,0.76)",
                background: "rgba(255,255,255,0.96)",
                boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
                padding: 14,
                textDecoration: "none",
                color: "#14264b",
                display: "grid",
                gap: 9,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 9,
                      fontWeight: 950,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#13a8b7",
                    }}
                  >
                    Official Trail
                  </p>
                  <h2
                    style={{
                      margin: "4px 0 0",
                      fontFamily: 'Georgia, "Times New Roman", Times, serif',
                      fontSize: 23,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {trail.trailName}
                  </h2>
                </div>

                <span
                  style={{
                    borderRadius: 999,
                    background: "rgba(19,168,183,0.10)",
                    color: "#13a8b7",
                    fontSize: 10,
                    fontWeight: 950,
                    padding: "6px 8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  View
                </span>
              </div>

              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.35, color: "#607089", fontWeight: 700 }}>
                {trail.description ?? "Official Passport Trails™ discovery route."}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 7 }}>
                <MiniStat value={String(trail.nodeCount ?? 0)} label="Nodes" />
                <MiniStat value={String(trail.stampEligibleCount ?? 0)} label="Stamp-ready" />
                <MiniStat value={String(trail.bookingRequiredCount ?? 0)} label="Booking nodes" />
              </div>
            </Link>
          ))}

          {!trails?.length ? (
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
              No Passport Trails™ discovery data available yet. Once official trail families are seeded, they will appear here.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function MiniStat(props: { value: string; label: string }) {
  return (
    <div style={{ borderRadius: 16, background: "rgba(20,38,75,0.05)", padding: "9px 8px" }}>
      <div style={{ fontSize: 15, fontWeight: 950, color: "#14264b" }}>{props.value}</div>
      <div style={{ marginTop: 2, fontSize: 9, fontWeight: 850, color: "#718096" }}>{props.label}</div>
    </div>
  );
}
