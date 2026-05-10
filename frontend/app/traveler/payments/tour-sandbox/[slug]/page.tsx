import Link from "next/link";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    slug: string;
  };
  searchParams?: {
    pax?: string;
    paidPax?: string;
    travelers?: string;
    seats?: string;
    date?: string;
    time?: string;
    routeCode?: string;
  };
};

function moneyPhp(value: number) {
  return `PHP ${value.toLocaleString("en-PH")}`;
}

function readPax(searchParams?: PageProps["searchParams"]) {
  const raw =
    searchParams?.pax ||
    searchParams?.paidPax ||
    searchParams?.travelers ||
    searchParams?.seats ||
    "1";

  const parsed = Number.parseInt(String(raw), 10);

  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, 99);
}

function getPaymentSnapshot(slug: string, searchParams?: PageProps["searchParams"]) {
  const paidPax = readPax(searchParams);

  if (slug === "tri-island-joiner" || slug === "gl-tri-island-standard" || slug === "GL_TRI_ISLAND_STANDARD") {
    const unitPricePhp = 1500;
    const travelerTotalPhp = unitPricePhp * paidPax;

    return {
      title: "Classic Tri-Island Joiner",
      routeCode: "GL_TRI_ISLAND_STANDARD",
      tripNo: "GL-ISL-01",
      packageLabel: "Joiner Seat",
      route: "Guyam · Daku · Naked Island",
      port: "General Luna Port",
      eyebrow: "Joiner seat review",
      unitPricePhp,
      paidPax,
      travelerTotalPhp,
      displayTotal: moneyPhp(travelerTotalPhp),
      subtitle: `${paidPax} paid traveler${paidPax === 1 ? "" : "s"} · ${moneyPhp(unitPricePhp)} per traveler`,
      pricingMode: "JOINER_FIXED_PER_PERSON",
      pricingNote:
        "Classic Tri-Island Joiner pricing is fixed at PHP 1,500 per paid traveler. Boat class is fulfillment logic only and must not change the traveler price.",
      inclusions: [
        "Joiner seat pricing locked per paid traveler",
        "General Luna Port departure context",
        "OSP booking/payment sandbox review",
        "Operator/vessel assignment handled after booking readiness",
      ],
    };
  }

  return {
    title: "Tour Payment Review",
    routeCode: slug,
    tripNo: "TOUR-SANDBOX",
    packageLabel: "Route Review",
    route: "Route details pending",
    port: "Siargao",
    eyebrow: "Payment review",
    unitPricePhp: 0,
    paidPax,
    travelerTotalPhp: 0,
    displayTotal: "Review required",
    subtitle: "Request-to-confirm route",
    pricingMode: "REQUEST_TO_CONFIRM",
    pricingNote:
      "This route requires confirmation before a final traveler payment amount is created.",
    inclusions: [
      "Route review required",
      "Final pricing pending confirmation",
      "Operator assignment pending",
    ],
  };
}

export default function TourSandboxPaymentPage({ params, searchParams }: PageProps) {
  const snapshot = getPaymentSnapshot(params.slug, searchParams);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 15% 0%, rgba(5,150,165,0.14), transparent 30%), linear-gradient(180deg, #f4fcfa 0%, #ffffff 72%)",
        padding: "24px 16px 90px",
        color: "#013863",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 430,
          margin: "0 auto",
          display: "grid",
          gap: 14,
        }}
      >
        <Link
          href={`/traveler/explore/tours/general-luna-island-hopping/gl-tri-island-standard/book${snapshot.paidPax > 1 ? `?pax=${snapshot.paidPax}` : ""}`}
          style={{
            color: "#047f91",
            fontWeight: 900,
            textDecoration: "none",
            fontSize: 13,
          }}
        >
          ← Back to route booking
        </Link>

        <section
          style={{
            borderRadius: 28,
            overflow: "hidden",
            minHeight: 190,
            position: "relative",
            background:
              "linear-gradient(135deg, rgba(1,56,99,0.92), rgba(5,150,165,0.58)), url('/osp/explore-siargao-hero-lagoon-kayak-square.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 22px 48px rgba(1,56,99,0.14)",
            padding: 18,
            display: "grid",
            alignContent: "end",
            color: "#ffffff",
          }}
        >
          <span
            style={{
              width: "fit-content",
              borderRadius: 999,
              padding: "8px 12px",
              background: "#ffffff",
              color: "#013863",
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              boxShadow: "0 10px 24px rgba(1,56,99,0.18)",
            }}
          >
            {snapshot.eyebrow}
          </span>

          <h1
            style={{
              margin: "12px 0 0",
              color: "#ffffff",
              fontSize: 30,
              lineHeight: 0.95,
              letterSpacing: "-0.055em",
              fontWeight: 920,
              textShadow: "0 18px 40px rgba(0,0,0,0.34)",
            }}
          >
            {snapshot.title}
          </h1>

          <p style={{ margin: "8px 0 0", color: "#ffffff", fontSize: 13, fontWeight: 850 }}>
            {snapshot.tripNo} · {snapshot.port}
          </p>
        </section>

        <section
          data-gl-joiner-payment-total="true"
          style={{
            borderRadius: 26,
            background: "#ffffff",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 18px 44px rgba(1,56,99,0.10)",
            padding: 18,
            display: "grid",
            gap: 12,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#50668B",
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Fixed Joiner Route Total
          </p>

          <div
            style={{
              color: "#013863",
              fontSize: 34,
              lineHeight: 0.95,
              fontWeight: 950,
              letterSpacing: "-0.055em",
            }}
          >
            {snapshot.displayTotal}
          </div>

          <p style={{ margin: 0, color: "#50668B", fontSize: 13, lineHeight: 1.45, fontWeight: 850 }}>
            {snapshot.subtitle}
          </p>

          <div
            style={{
              borderRadius: 18,
              background: "rgba(5,150,165,0.08)",
              border: "1px solid rgba(5,150,165,0.16)",
              padding: "12px 13px",
              display: "grid",
              gap: 7,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span style={{ color: "#50668B", fontSize: 12, fontWeight: 850 }}>Paid travelers</span>
              <strong style={{ color: "#013863", fontSize: 13 }}>{snapshot.paidPax}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span style={{ color: "#50668B", fontSize: 12, fontWeight: 850 }}>Price per traveler</span>
              <strong style={{ color: "#013863", fontSize: 13 }}>{moneyPhp(snapshot.unitPricePhp)}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span style={{ color: "#50668B", fontSize: 12, fontWeight: 850 }}>Pricing mode</span>
              <strong style={{ color: "#047f91", fontSize: 12 }}>{snapshot.pricingMode}</strong>
            </div>
          </div>

          <button
            type="button"
            style={{
              border: 0,
              borderRadius: 999,
              minHeight: 48,
              background: "linear-gradient(135deg, #013863, #0596A5)",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 950,
              cursor: "default",
              boxShadow: "0 14px 30px rgba(5,150,165,0.20)",
            }}
          >
            Continue to Payment
          </button>
        </section>

        <section
          style={{
            borderRadius: 24,
            background: "#f8ffff",
            border: "1px solid rgba(5,150,165,0.14)",
            padding: 16,
            display: "grid",
            gap: 12,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#047f91",
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Trip Details
          </p>

          {[
            ["Trip", snapshot.title],
            ["Trip No.", snapshot.tripNo],
            ["Package", snapshot.packageLabel],
            ["Route", snapshot.route],
            ["Port", snapshot.port],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "grid",
                gridTemplateColumns: "110px 1fr",
                gap: 10,
                borderTop: "1px solid rgba(1,56,99,0.08)",
                paddingTop: 10,
              }}
            >
              <span style={{ color: "#50668B", fontSize: 12, fontWeight: 850 }}>{label}</span>
              <strong style={{ color: "#013863", fontSize: 12.5, textAlign: "right" }}>{value}</strong>
            </div>
          ))}
        </section>

        <section
          style={{
            borderRadius: 22,
            background: "#fff8e8",
            border: "1px solid rgba(243,174,38,0.32)",
            padding: 15,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#9a5f0c",
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Price Doctrine
          </p>
          <p style={{ margin: "8px 0 0", color: "#013863", fontSize: 12.5, lineHeight: 1.45, fontWeight: 850 }}>
            {snapshot.pricingNote}
          </p>
        </section>
      </section>
    </main>
  );
}
