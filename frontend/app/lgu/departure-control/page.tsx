import Link from "next/link";

export const dynamic = "force-dynamic";

const ports = [
  {
    name: "General Luna Port",
    code: "GENERAL LUNA",
    routes: "Tri-Island · Mam-On · Corregidor",
    status: "Pilot Preview Ready",
    tone: "#00C2D1",
    href: "/lgu/departure-control/general-luna",
  },
  {
    name: "Dapa Port",
    code: "DAPA / SOHOTON",
    routes: "Bucas Grande · Sohoton",
    status: "Route Matrix Pending",
    tone: "#F3AE26",
    href: "/lgu/departure-control",
  },
  {
    name: "Del Carmen Port",
    code: "DEL CARMEN",
    routes: "Sugba Lagoon · Mangrove",
    status: "Governance Ready",
    tone: "#0596A5",
    href: "/lgu/departure-control",
  },
];

export default function LguDepartureControlPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, rgba(5,150,165,0.16), transparent 32%), radial-gradient(circle at 100% 0%, rgba(243,174,38,0.12), transparent 28%), linear-gradient(180deg, #EAFBFA 0%, #F8FEFE 52%, #FFFFFF 100%)",
        padding: 18,
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <section
          style={{
            borderRadius: 34,
            background: "linear-gradient(135deg, #013863 0%, #003B66 58%, #0596A5 130%)",
            color: "#FFFFFF",
            padding: 30,
            boxShadow: "0 30px 80px rgba(1,56,99,0.22)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 86% 18%, rgba(255,255,255,0.14), transparent 28%), linear-gradient(90deg, rgba(255,255,255,0.06), transparent 56%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 2 }}>
            <p style={{ margin: 0, color: "#F3AE26", fontSize: 12, fontWeight: 950, letterSpacing: "0.16em", textTransform: "uppercase" }}>
              LGU / DOT Governance Layer
            </p>
            <h1 style={{ margin: "10px 0 0", fontSize: 54, lineHeight: 0.92, letterSpacing: "-0.075em", fontWeight: 950 }}>
              Departure Control System
            </h1>
            <p style={{ margin: "13px 0 0", maxWidth: 760, color: "rgba(255,255,255,0.90)", fontSize: 16, lineHeight: 1.45, fontWeight: 780 }}>
              Port-separated operating view for island-hopping departures, QR boarding readiness, manifest truth, and movement records.
            </p>

            <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginTop: 18 }}>
              <Chip label="One Port Board" />
              <Chip label="One Boarding QR" />
              <Chip label="One Manifest Truth" />
              <Chip label="Sensitive Data Hidden" />
            </div>
          </div>
        </section>

        <section style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
          {ports.map((port) => (
            <Link
              key={port.name}
              href={port.href}
              style={{
                minHeight: 238,
                borderRadius: 30,
                background: "#FFFFFF",
                border: "1px solid rgba(1,56,99,0.10)",
                boxShadow: "0 22px 55px rgba(1,56,99,0.08)",
                padding: 19,
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at 100% 0%, ${port.tone}22, transparent 36%)`,
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 2 }}>
                <span
                  style={{
                    display: "inline-flex",
                    borderRadius: 999,
                    padding: "8px 10px",
                    background: `${port.tone}12`,
                    border: `1px solid ${port.tone}55`,
                    color: port.tone,
                    fontSize: 11,
                    fontWeight: 950,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                  }}
                >
                  {port.status}
                </span>
                <p style={{ margin: "18px 0 0", color: "#50668B", fontSize: 11, fontWeight: 950, letterSpacing: "0.14em" }}>
                  {port.code}
                </p>
                <h2 style={{ margin: "7px 0 0", color: "#013863", fontSize: 31, lineHeight: 0.96, letterSpacing: "-0.058em" }}>
                  {port.name}
                </h2>
                <p style={{ margin: "10px 0 0", color: "#50668B", fontSize: 14, lineHeight: 1.4, fontWeight: 780 }}>
                  {port.routes}
                </p>
              </div>
              <strong style={{ position: "relative", zIndex: 2, color: "#013863", fontSize: 13 }}>
                Open port lane →
              </strong>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        minHeight: 34,
        alignItems: "center",
        borderRadius: 999,
        padding: "0 12px",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.18)",
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: 900,
      }}
    >
      {label}
    </span>
  );
}
