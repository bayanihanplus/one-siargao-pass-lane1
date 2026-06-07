import Link from "next/link";

export const dynamic = "force-dynamic";

const flow = ["Voucher", "Assignment", "Boarding QR", "Port Scan", "Manifest", "Movement Record"];

export default function GeneralLunaDepartureControlOverview() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 100% 0%, rgba(243,174,38,0.14), transparent 28%), radial-gradient(circle at 0% 0%, rgba(5,150,165,0.16), transparent 32%), linear-gradient(180deg, #EAFBFA 0%, #FFFFFF 100%)",
        padding: 18,
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1260, margin: "0 auto" }}>
        <Link
          href="/lgu/departure-control"
          style={{
            display: "inline-flex",
            minHeight: 42,
            alignItems: "center",
            borderRadius: 14,
            padding: "0 14px",
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.12)",
            color: "#013863",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 900,
            marginBottom: 14,
          }}
        >
          ← Departure Control
        </Link>

        <section
          style={{
            borderRadius: 34,
            background: "linear-gradient(135deg, #013863 0%, #003B66 58%, #0596A5 130%)",
            color: "#FFFFFF",
            padding: 30,
            boxShadow: "0 30px 80px rgba(1,56,99,0.22)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 88% 14%, rgba(255,255,255,0.15), transparent 28%), linear-gradient(90deg, rgba(255,255,255,0.055), transparent 58%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <p style={{ margin: 0, color: "#F3AE26", fontSize: 12, fontWeight: 950, letterSpacing: "0.16em", textTransform: "uppercase" }}>
              General Luna Port · LGU / DOT Governance Layer
            </p>
            <h1 style={{ margin: "10px 0 0", fontSize: 58, lineHeight: 0.9, letterSpacing: "-0.078em", fontWeight: 950 }}>
              World-class Island Hopping Boarding
            </h1>
            <p style={{ margin: "14px 0 0", maxWidth: 790, color: "rgba(255,255,255,0.91)", fontSize: 17, lineHeight: 1.42, fontWeight: 800 }}>
              One trip reference. One boarding QR. One manifest truth.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 20 }}>
              {flow.map((item) => (
                <span
                  key={item}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    minHeight: 34,
                    borderRadius: 999,
                    padding: "0 12px",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Link
            href="/lgu/departure-control/general-luna/board"
            style={{
              minHeight: 226,
              borderRadius: 30,
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.10)",
              boxShadow: "0 22px 55px rgba(1,56,99,0.08)",
              padding: 21,
              textDecoration: "none",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at 100% 0%, rgba(0,194,209,0.16), transparent 36%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 2 }}>
              <p style={{ margin: 0, color: "#0596A5", fontSize: 11, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
                Plenary Screen
              </p>
              <h2 style={{ margin: "10px 0 0", color: "#013863", fontSize: 36, lineHeight: 0.96, letterSpacing: "-0.06em" }}>
                Open Big Port Board
              </h2>
              <p style={{ margin: "10px 0 0", color: "#50668B", fontSize: 14, lineHeight: 1.42, fontWeight: 780 }}>
                Big-screen board for scheduled departures, QR readiness, manifest status, and port movement confidence.
              </p>
            </div>
          </Link>

          <div
            style={{
              minHeight: 226,
              borderRadius: 30,
              background: "#FFF8EA",
              border: "1px solid rgba(243,174,38,0.32)",
              boxShadow: "0 22px 55px rgba(1,56,99,0.06)",
              padding: 21,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at 100% 0%, rgba(243,174,38,0.22), transparent 38%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 2 }}>
              <p style={{ margin: 0, color: "#8A5A00", fontSize: 11, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
                Pilot Integrity
              </p>
              <h2 style={{ margin: "10px 0 0", color: "#013863", fontSize: 32, lineHeight: 0.97, letterSpacing: "-0.056em" }}>
                Preview now. Activate with event truth.
              </h2>
              <p style={{ margin: "10px 0 0", color: "#50668B", fontSize: 14, lineHeight: 1.42, fontWeight: 780 }}>
                Full activation connects voucher, assignment, QR scan, manifest, and movement records.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
