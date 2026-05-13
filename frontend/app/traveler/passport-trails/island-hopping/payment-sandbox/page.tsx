import UniversalTravelerBottomTabBar from "../../../../../src/components/traveler/UniversalTravelerBottomTabBar";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function getParam(searchParams: PageProps["searchParams"], key: string, fallback = "") {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
}

function buildTravelerPaymentHref(searchParams: PageProps["searchParams"]) {
  const params = new URLSearchParams();

  params.set("source", "passport-trails");
  params.set("trail", getParam(searchParams, "trail", "island-hopping"));
  params.set("officialTrail", getParam(searchParams, "officialTrail", "Island Hopping"));
  params.set("routeType", getParam(searchParams, "routeType", "GL_TRI_ISLAND_STANDARD"));
  params.set("routeCode", getParam(searchParams, "routeCode", "gl-tri-island-standard"));
  params.set("routeProduct", getParam(searchParams, "routeProduct", "tri-island-joiner"));
  params.set("tripNo", getParam(searchParams, "tripNo", "GL-ISL-01"));
  params.set("step", "payment");
  params.set("amount", getParam(searchParams, "matrixTotal", "3000"));

  return `/traveler/payments?${params.toString()}`;
}

export default function IslandHoppingPaymentHandoffPage({ searchParams }: PageProps) {
  const pax = getParam(searchParams, "pax", "2");
  const amount = getParam(searchParams, "matrixTotal", "3000");
  const paymentHref = buildTravelerPaymentHref(searchParams);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, rgba(5,150,165,0.08), transparent 34%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 54%, #EAFBFA 100%)",
        color: "#013863",
        padding: "14px 14px 0",
      }}
    >
      <div style={{ maxWidth: 390, margin: "0 auto" }}>
        <a
          href="/traveler/passport-trails/island-hopping"
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 36,
            borderRadius: 999,
            padding: "0 12px",
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.08)",
            boxShadow: "0 8px 20px rgba(1,56,99,0.06)",
            color: "#013863",
            fontSize: 12,
            fontWeight: 850,
            textDecoration: "none",
          }}
        >
          ← Island Hopping
        </a>

        <section
          aria-label="Island Hopping payment handoff"
          style={{
            marginTop: 12,
            borderRadius: 28,
            padding: 16,
            background: "#FFFFFF",
            border: "1px solid rgba(5,150,165,0.14)",
            boxShadow: "0 18px 42px rgba(1,56,99,0.08)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              borderRadius: 999,
              padding: "5px 8px",
              background: "#EAFBFA",
              color: "#0596A5",
              fontSize: 9,
              lineHeight: 1,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Payment Ready
          </div>

          <h1
            style={{
              margin: "12px 0 0",
              color: "#013863",
              fontSize: 25,
              lineHeight: 1.02,
              letterSpacing: "-0.045em",
              fontWeight: 880,
            }}
          >
            Complete your route payment.
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              maxWidth: 310,
              color: "#50668B",
              fontSize: 13,
              lineHeight: 1.28,
              fontWeight: 760,
            }}
          >
            Payment keeps your receipt and trip records connected.
          </p>
        </section>

        <section
          aria-label="Island Hopping payment summary"
          style={{
            marginTop: 12,
            borderRadius: 26,
            padding: 14,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.08)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.07)",
          }}
        >
          <div style={{ color: "#0596A5", fontSize: 9, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Summary
          </div>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Trail", value: "Island Hopping" },
              { label: "Pax", value: pax },
              { label: "Route", value: "GL Tri-Island" },
              { label: "Amount", value: `PHP ${Number(amount || 0).toLocaleString("en-PH")}` },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  borderRadius: 18,
                  padding: 10,
                  background: "#F4FCFA",
                  border: "1px solid rgba(5,150,165,0.12)",
                }}
              >
                <div style={{ color: "#50668B", fontSize: 8.5, fontWeight: 930, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {item.label}
                </div>
                <strong style={{ display: "block", marginTop: 5, color: "#013863", fontSize: 12, lineHeight: 1.1, fontWeight: 900 }}>
                  {item.value}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Island Hopping records after payment"
          style={{
            marginTop: 12,
            borderRadius: 26,
            padding: 14,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.08)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.07)",
          }}
        >
          <div style={{ color: "#0596A5", fontSize: 9, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            After payment
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {["Receipt", "Voucher", "Boarding QR", "Trip record"].map((item, index) => (
              <div
                key={item}
                style={{
                  minHeight: 48,
                  borderRadius: 18,
                  padding: "9px 10px",
                  display: "grid",
                  gridTemplateColumns: "34px 1fr",
                  alignItems: "center",
                  gap: 9,
                  background: index === 0 ? "#FFF4D8" : "#EAFBFA",
                  border: index === 0 ? "1px solid rgba(243,174,38,0.24)" : "1px solid rgba(5,150,165,0.12)",
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 13,
                    background: "#FFFFFF",
                    color: "#013863",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 10,
                    fontWeight: 950,
                  }}
                >
                  {index + 1}
                </span>
                <strong style={{ color: "#013863", fontSize: 12.5, fontWeight: 900 }}>{item}</strong>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Continue to traveler payment"
          style={{
            margin: "12px auto 0",
            width: "min(390px, calc(100vw - 28px))",
            borderRadius: 24,
            padding: 10,
            background: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(5,150,165,0.14)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.10)",
          }}
        >
          <a
            href={paymentHref}
            style={{
              minHeight: 54,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              textDecoration: "none",
              background: "#F3AE26",
              color: "#013863",
              fontSize: 13,
              fontWeight: 950,
              boxShadow: "0 10px 22px rgba(243,174,38,0.20)",
            }}
          >
            Continue to Payment
          </a>
        </section>

        <div aria-hidden="true" style={{ height: 148 }} />
      </div>

      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
