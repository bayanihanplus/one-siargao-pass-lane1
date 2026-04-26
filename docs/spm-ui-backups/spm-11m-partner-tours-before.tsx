const partnerTourCards = [
  {
    icon: "🏝️",
    title: "Island & Boat-Led Tours",
    area: "General Luna / island routes",
    status: "Operator-led source pending",
    body: "Future approved operator-led activities will populate this lane. Boat, manifest, payment, and QR/stamp rules must be governed before confirmation.",
  },
  {
    icon: "🚐",
    title: "Land Route Tours",
    area: "Siargao land movement",
    status: "Operator fulfillment required",
    body: "Transport-supported tours should come from approved operator activity records, with pricing and fulfillment readiness before traveler confirmation.",
  },
  {
    icon: "🧑‍✈️",
    title: "Guide-Supported Tours",
    area: "Route-dependent",
    status: "Guide support after confirmation",
    body: "Guide support may be provided where required. Assigned guide details appear only after operator confirmation.",
  },
];

function Pill(props: { children: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "6px 9px",
        background: "rgba(14,165,233,0.10)",
        color: "#0369a1",
        border: "1px solid rgba(14,165,233,0.18)",
        fontSize: 10,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {props.children}
    </span>
  );
}

function CompactLink(props: { href: string; icon: string; children: string; variant?: "primary" | "secondary" }) {
  const primary = props.variant !== "secondary";

  return (
    <a
      href={props.href}
      style={{
        minHeight: 38,
        borderRadius: 14,
        padding: "9px 11px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        textDecoration: "none",
        fontSize: 11.5,
        fontWeight: 900,
        background: primary ? "linear-gradient(135deg, #078da0, #0f766e)" : "rgba(255,255,255,0.88)",
        color: primary ? "#ffffff" : "#075985",
        border: primary ? "1px solid rgba(7,141,160,0.24)" : "1px solid rgba(14,116,144,0.16)",
        boxShadow: primary ? "0 10px 22px rgba(7,141,160,0.20)" : "0 8px 18px rgba(15,23,42,0.07)",
      }}
    >
      <span aria-hidden="true">{props.icon}</span>
      {props.children}
    </a>
  );
}

export default function PartnerToursPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 15% 0%, rgba(45,212,191,0.18), transparent 34%), radial-gradient(circle at 96% 4%, rgba(251,191,36,0.15), transparent 30%), linear-gradient(180deg, #f8fdff 0%, #eefbf7 46%, #f8fafc 100%)",
        padding: "14px 12px 92px",
        color: "#10234a",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <header
          style={{
            borderRadius: 28,
            background: "linear-gradient(145deg, rgba(12,74,110,0.98), rgba(8,145,178,0.92), rgba(20,184,166,0.82))",
            boxShadow: "0 22px 48px rgba(15,23,42,0.18)",
            padding: 16,
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <a
              href="/traveler/passport-trails"
              aria-label="Back to Passport Trails"
              style={{
                width: 38,
                height: 38,
                borderRadius: 15,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                background: "rgba(255,255,255,0.16)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.20)",
                fontWeight: 950,
              }}
            >
              ←
            </a>
            <Pill>Operator-led lane</Pill>
          </div>

          <div style={{ marginTop: 22 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.78)",
              }}
            >
              Siargao Partner Tours
            </div>

            <h1 style={{ margin: "7px 0 0", fontSize: 29, lineHeight: 1, letterSpacing: "-0.045em", fontWeight: 950 }}>
              View Tours
            </h1>

            <p style={{ margin: "9px 0 0", color: "#fef9c3", fontSize: 15.5, fontWeight: 950 }}>
              Operator-led activities will appear here.
            </p>

            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.82)", fontSize: 12.2, lineHeight: 1.45, fontWeight: 680 }}>
              This page is the traveler-facing lane for approved local partner tours. Future listings should come from Operator Console activity records, not Passport Trail detail pages.
            </p>
          </div>

          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <CompactLink href="/traveler/passport-trails/diy-trail-builder" icon="🧩">Build route</CompactLink>
            <CompactLink href="/traveler/passport-map" icon="🗺️" variant="secondary">Passport Map</CompactLink>
          </div>
        </header>

        <section
          style={{
            marginTop: 12,
            borderRadius: 24,
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(14,116,144,0.13)",
            boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
            padding: 13,
          }}
        >
          <div style={{ fontSize: 9.8, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", color: "#078da0" }}>
            Source of truth
          </div>
          <h2 style={{ margin: "4px 0 0", fontSize: 18, lineHeight: 1.08, fontWeight: 950 }}>
            Future listings must come from approved Operator activities.
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 11.5, lineHeight: 1.42, color: "rgba(15,23,42,0.64)", fontWeight: 700 }}>
            Partner Tours are separate from Passport Trails detail pages. Listings must be populated from approved operator-led activities with pricing, fulfillment, guide, payment, manifest, QR, and stamp rules before confirmation.
          </p>
        </section>

        <section style={{ marginTop: 12, display: "grid", gap: 9 }}>
          {partnerTourCards.map((card) => (
            <article
              key={card.title}
              style={{
                borderRadius: 22,
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(14,116,144,0.13)",
                boxShadow: "0 12px 28px rgba(15,23,42,0.07)",
                padding: 12,
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #e0f7fa, #ecfdf5)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 19,
                    flex: "0 0 auto",
                  }}
                >
                  {card.icon}
                </div>

                <div style={{ minWidth: 0 }}>
                  <h3 style={{ margin: 0, fontSize: 14.5, lineHeight: 1.12, fontWeight: 950 }}>{card.title}</h3>
                  <p style={{ margin: "3px 0 0", fontSize: 10.8, color: "rgba(15,23,42,0.55)", fontWeight: 780 }}>
                    {card.area}
                  </p>
                  <div style={{ marginTop: 7 }}>
                    <Pill>{card.status}</Pill>
                  </div>
                  <p style={{ margin: "8px 0 0", fontSize: 11.2, lineHeight: 1.38, color: "rgba(15,23,42,0.63)", fontWeight: 690 }}>
                    {card.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section
          style={{
            marginTop: 12,
            borderRadius: 22,
            background: "rgba(15,23,42,0.94)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.10)",
            padding: 13,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 950 }}>Current boundary</h2>
          <p style={{ margin: "7px 0 0", fontSize: 11.4, lineHeight: 1.42, color: "rgba(255,255,255,0.70)", fontWeight: 700 }}>
            This page does not create bookings, payments, guide assignments, QR validation, manifests, or Passport Stamp progress yet.
          </p>
        </section>
      </div>
    </main>
  );
}
