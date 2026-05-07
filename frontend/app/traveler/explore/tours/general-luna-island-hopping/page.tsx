import Link from "next/link";

const routes = [
  {
    tripCode: "GL-ISL-01",
    internalCode: "GL_TRI_ISLAND_STANDARD",
    title: "Classic Tri-Island Joiner",
    stops: "Guyam · Daku · Naked Island",
    subtitle: "The core General Luna island-hopping route with LGU boat-rate matrix and guide fee.",
    port: "General Luna Port",
    range: "₱3,000–₱9,000 boat + guide",
    capacityNote: "Class A–E based on pax. Missing bands are flagged inside the price breakdown.",
    status: "Ready matrix",
    cta: "Select Date & Pax",
    href: "/traveler/explore/tours/general-luna-island-hopping/gl-tri-island-standard/book",
    tone: "ready",
  },
  {
    tripCode: "GL-ISL-02",
    internalCode: "GL_GUYAM_DAKU_MAM_ON",
    title: "Mam-On Island Route",
    stops: "Guyam · Daku · Naked · Mam-On",
    subtitle: "Extended General Luna route. Class A is unavailable based on the LGU matrix.",
    port: "General Luna Port",
    range: "₱6,000–₱13,000 boat + guide",
    capacityNote: "Class A unavailable. Missing pax bands require port confirmation.",
    status: "Route review",
    cta: "Select Date & Pax",
    href: "/traveler/explore/tours/general-luna-island-hopping/gl-guyam-daku-mam-on/book",
    tone: "review",
  },
  {
    tripCode: "GL-ISL-03",
    internalCode: "GL_TRI_ISLAND_CORREGIDOR",
    title: "Corregidor Island Route",
    stops: "Guyam · Daku · Naked · Corregidor",
    subtitle: "Expanded island route with Corregidor included under the General Luna boat-rate matrix.",
    port: "General Luna Port",
    range: "₱5,000–₱11,000 boat + guide",
    capacityNote: "Class A–E depending pax. Gaps require port confirmation.",
    status: "Matrix ready",
    cta: "Select Date & Pax",
    href: "/traveler/explore/tours/general-luna-island-hopping/gl-tri-island-corregidor/book",
    tone: "ready",
  },
  {
    tripCode: "GL-PRV-01",
    internalCode: "GL_PRIVATE_CUSTOM_REQUEST",
    title: "Private Island Hopping Request",
    stops: "Private / custom route",
    subtitle: "Build a private General Luna island route with vessel/category, pax, and operator review before payment.",
    port: "General Luna Port",
    range: "Custom price review",
    capacityNote: "Custom requests continue into price review first. Route, pax, vessel/category, and fee breakdown must be clear before payment.",
    status: "Custom route",
    cta: "Start Private Route Review",
    href: "/traveler/explore/tours/general-luna-island-hopping/gl-private-custom-request/book",
    tone: "custom",
  },
];

function badgeStyle(tone: string) {
  if (tone === "ready") {
    return {
      background: "linear-gradient(135deg, #013863, #0596A5)",
      color: "#FFFFFF",
      border: "1px solid rgba(5,150,165,0.28)",
      boxShadow: "0 10px 20px rgba(1,56,99,0.16)",
    };
  }

  if (tone === "review") {
    return {
      background: "linear-gradient(135deg, #F3AE26, #FFF3D6)",
      color: "#5F3B00",
      border: "1px solid rgba(154,101,0,0.30)",
      boxShadow: "0 10px 22px rgba(154,101,0,0.14)",
    };
  }

  if (tone === "custom") {
    return {
      background: "linear-gradient(135deg, #F3AE26, #FFF3D6)",
      color: "#5F3B00",
      border: "1px solid rgba(154,101,0,0.30)",
      boxShadow: "0 10px 22px rgba(154,101,0,0.14)",
    };
  }

  return {
    background: "#F8FBFD",
    color: "#013863",
    border: "1px solid rgba(1,56,99,0.12)",
    boxShadow: "none",
  };
}


function cardShellStyle(tone: string) {
  if (tone === "ready") {
    return {
      background:
        "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(244,252,250,1) 100%)",
      border: "1px solid rgba(5,150,165,0.22)",
      boxShadow: "0 18px 42px rgba(1,56,99,0.13)",
    };
  }

  if (tone === "review") {
    return {
      background:
        "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,247,230,0.96) 100%)",
      border: "1px solid rgba(243,174,38,0.42)",
      boxShadow: "0 18px 38px rgba(154,101,0,0.12)",
    };
  }

  if (tone === "custom") {
    return {
      background:
        "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,247,230,0.94) 100%)",
      border: "1px solid rgba(243,174,38,0.36)",
      boxShadow: "0 18px 38px rgba(154,101,0,0.10)",
    };
  }

  return {
    background: "#FFFFFF",
    border: "1px solid rgba(1,56,99,0.10)",
    boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
  };
}

function infoPanelStyle(tone: string) {
  if (tone === "ready") {
    return {
      background: "#EAFBFA",
      border: "1px solid rgba(5,150,165,0.20)",
    };
  }

  if (tone === "review") {
    return {
      background: "#FFF3D6",
      border: "1px solid rgba(243,174,38,0.36)",
    };
  }

  if (tone === "custom") {
    return {
      background: "#FFF3D6",
      border: "1px solid rgba(243,174,38,0.32)",
    };
  }

  return {
    background: "#F8FBFD",
    border: "1px solid rgba(1,56,99,0.08)",
  };
}

export default function GeneralLunaIslandHoppingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(5,150,165,0.10), transparent 34%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 56%, #EAFBFA 100%)",
        color: "#013863",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <div style={{ width: "min(100%, 430px)", margin: "0 auto", padding: "14px 14px 96px" }}>
        <Link
          href="/traveler/explore"
          style={{
            display: "inline-flex",
            color: "#0596A5",
            fontSize: 12,
            fontWeight: 850,
            textDecoration: "none",
            marginBottom: 12,
          }}
        >
          ← Back to Explore
        </Link>

        <section
          style={{
            borderRadius: 30,
            overflow: "hidden",
            background: "#013863",
            boxShadow: "0 24px 60px rgba(1,56,99,0.20)",
            marginBottom: 14,
          }}
        >
          <div style={{ height: 220, position: "relative" }}>
            <img
              src="/osp/temp-tour-posters/tri-island-joiner.png"
              alt="General Luna Island Hopping"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                opacity: 0.72,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(1,56,99,0.10) 0%, rgba(1,56,99,0.90) 100%)",
              }}
            />
            <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, color: "#FFFFFF" }}>
              <span
                style={{
                  display: "inline-flex",
                  padding: "7px 11px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.92)",
                  color: "#013863",
                  fontSize: 10.5,
                  fontWeight: 950,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                General Luna Port
              </span>

              <h1
                style={{
                  margin: "10px 0 0",
                  color: "#FFFFFF",
                  fontSize: 30,
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  fontWeight: 900,
                  textShadow: "0 3px 18px rgba(0,0,0,0.42)",
                }}
              >
                Island Hopping Routes
              </h1>

              <p
                style={{
                  margin: "8px 0 0",
                  maxWidth: 360,
                  color: "rgba(255,255,255,0.90)",
                  fontSize: 12.5,
                  lineHeight: 1.36,
                  fontWeight: 720,
                }}
              >
                Choose a General Luna route. The boat-rate matrix, guide fee, pax band, date, and departure window are reviewed before payment.
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            marginBottom: 12,
            borderRadius: 22,
            padding: 13,
            background: "#FFF8EA",
            border: "1px solid rgba(243,174,38,0.34)",
          }}
        >
          <strong
            style={{
              display: "block",
              color: "#8A5A00",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            General Luna Port pricing rule
          </strong>
          <p style={{ margin: "6px 0 0", color: "#013863", fontSize: 12, lineHeight: 1.4, fontWeight: 760 }}>
            This page uses the General Luna Port island-hopping rate matrix. Travel & Tours joiner, private, premium, and VVIP packages are separate commercial products.
          </p>
        </section>

        <section style={{ display: "grid", gap: 11 }}>
          {routes.map((route) => {
            const badge = badgeStyle(route.tone);
            const shell = cardShellStyle(route.tone);
            const infoShell = infoPanelStyle(route.tone);

            return (
              <Link
                key={route.tripCode}
                href={route.href}
                style={{
                  display: "grid",
                  gap: 10,
                  padding: 14,
                  borderRadius: 24,
                  background: shell.background,
                  border: shell.border,
                  boxShadow: shell.boxShadow,
                  textDecoration: "none",
                  color: "#013863",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <span
                      style={{
                        display: "inline-flex",
                        width: "fit-content",
                        padding: "5px 8px",
                        borderRadius: 999,
                        fontSize: 9.8,
                        fontWeight: 950,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        ...badge,
                      }}
                    >
                      {route.status}
                    </span>

                    <h2
                      style={{
                        margin: "8px 0 0",
                        fontSize: 19,
                        lineHeight: 1.06,
                        letterSpacing: "-0.035em",
                        fontWeight: 950,
                      }}
                    >
                      {route.title}
                    </h2>

                    <p style={{ margin: "5px 0 0", color: "#50668B", fontSize: 12, lineHeight: 1.35, fontWeight: 720 }}>
                      {route.subtitle}
                    </p>
                  </div>

                  <span style={{ color: "#0596A5", fontSize: 21, fontWeight: 900 }}>›</span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 7,
                    padding: 11,
                    borderRadius: 18,
                    background: infoShell.background,
                    border: infoShell.border,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ color: "#64748B", fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}>
                      Trip No.
                    </span>
                    <strong style={{ color: "#013863", fontSize: 10.5, textAlign: "right" }}>{route.tripCode}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ color: "#64748B", fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}>
                      Route
                    </span>
                    <strong style={{ color: "#013863", fontSize: 10.5, textAlign: "right" }}>{route.stops}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ color: "#64748B", fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}>
                      Matrix
                    </span>
                    <strong style={{ color: "#013863", fontSize: 10.5, textAlign: "right" }}>{route.range}</strong>
                  </div>
                </div>

                <p style={{ margin: 0, color: "#50668B", fontSize: 11.5, lineHeight: 1.42, fontWeight: 690 }}>
                  {route.capacityNote}
                </p>

                <span
                  style={{
                    minHeight: 42,
                    borderRadius: 999,
                    background:
                      route.tone === "ready"
                        ? "linear-gradient(135deg, #013863, #0596A5)"
                        : route.tone === "review" || route.tone === "custom"
                          ? "linear-gradient(135deg, #F3AE26, #C47A00)"
                          : "linear-gradient(135deg, #334E68, #50668B)",
                    color: "#FFFFFF",
                    border:
                      route.tone === "review" || route.tone === "custom"
                        ? "1px solid rgba(154,101,0,0.28)"
                        : "1px solid rgba(5,150,165,0.20)",
                    boxShadow:
                      route.tone === "review" || route.tone === "custom"
                        ? "0 12px 24px rgba(154,101,0,0.18)"
                        : "0 12px 24px rgba(1,56,99,0.18)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 16px",
                    fontSize: 12.8,
                    fontWeight: 950,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {route.cta}
                </span>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
