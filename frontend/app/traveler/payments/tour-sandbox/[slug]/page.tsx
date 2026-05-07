import Link from "next/link";
import { notFound } from "next/navigation";
import { getGlRoutePriceAnchor } from "../../../../../src/spm/traveler/glRoutePriceAnchors";

type TourPaymentPageProps = {
  params: {
    slug: string;
  };
  searchParams?: {
    seats?: string;
    time?: string;
    amount?: string;
  };
};

const GL_JOINER_SEAT_PRICE_PHP = 1500;

function parsePositiveInt(value?: string, fallback = 1) {
  const parsed = Number(value || "");
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.max(1, Math.floor(parsed));
}

function formatPhp(amount: number) {
  return `PHP ${amount.toLocaleString("en-PH")}`;
}

function getJoinerPaymentSnapshot(slug: string, seatsParam?: string, timeParam?: string) {
  const seats = parsePositiveInt(seatsParam, 1);
  const joinerTime = timeParam || "11:00 AM";
  const amountPhp = slug === "tri-island-joiner" ? seats * GL_JOINER_SEAT_PRICE_PHP : null;

  return {
    seats,
    joinerTime,
    amountPhp,
    amountLabel: amountPhp ? `From ${formatPhp(amountPhp)}` : null,
    amountSubcopy: amountPhp
      ? `${seats} joiner seat${seats === 1 ? "" : "s"} · ${joinerTime} Joiner Trip`
      : null,
  };
}

export default function TourSandboxPaymentPage({ params, searchParams }: TourPaymentPageProps) {
  const snapshot = getGlRoutePriceAnchor(params.slug);

  if (!snapshot) {
    notFound();
  }

  const joinerSnapshot = getJoinerPaymentSnapshot(params.slug, searchParams?.seats, searchParams?.time);
  const displayAmountLabel = joinerSnapshot.amountLabel || snapshot.amountLabel;
  const displayAmountSubcopy = joinerSnapshot.amountSubcopy || snapshot.amountSubcopy;
  const paymentAmountPhp = joinerSnapshot.amountPhp || 0;
  const paymentIntentId = joinerSnapshot.amountPhp
    ? `tour_sandbox_${snapshot.slug}_${paymentAmountPhp}`
    : snapshot.intentId;

  const row = (label: string, value: string) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        padding: "9px 0",
        borderBottom: "1px solid rgba(1,56,99,0.08)",
      }}
    >
      <span style={{ color: "#50668B", fontSize: 12, fontWeight: 850 }}>{label}</span>
      <strong style={{ color: "#013863", fontSize: 12.5, textAlign: "right", fontWeight: 950 }}>{value}</strong>
    </div>
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(5,150,165,0.10), transparent 34%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 58%, #EAFBFA 100%)",
        color: "#013863",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <div style={{ width: "min(100%, 430px)", margin: "0 auto", padding: "14px 14px 110px" }}>
        <Link
          href={`/traveler/explore/tours/general-luna-island-hopping/${snapshot.routeCode}/book`}
          style={{ display: "inline-flex", color: "#0596A5", fontSize: 12, fontWeight: 850, textDecoration: "none", marginBottom: 12 }}
        >
          ← Back to route booking
        </Link>

        <section style={{ borderRadius: 30, overflow: "hidden", background: "#013863", boxShadow: "0 24px 60px rgba(1,56,99,0.20)", marginBottom: 14 }}>
          <div style={{ height: 210, position: "relative" }}>
            <img src={snapshot.image} alt={snapshot.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.68 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(1,56,99,0.08) 0%, rgba(1,56,99,0.92) 100%)" }} />
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
                Joiner seat review
              </span>

              <h1 style={{ margin: "10px 0 0", color: "#FFFFFF", fontSize: 29, lineHeight: 1, letterSpacing: "-0.055em", fontWeight: 950, textShadow: "0 3px 18px rgba(0,0,0,0.42)" }}>
                {snapshot.title}
              </h1>

              <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.90)", fontSize: 12.5, lineHeight: 1.36, fontWeight: 720 }}>
                {snapshot.tripNo} · {snapshot.port}
              </p>
            </div>
          </div>
        </section>

        <section style={{ borderRadius: 26, padding: 16, background: "#FFFFFF", border: "1px solid rgba(1,56,99,0.10)", boxShadow: "0 18px 42px rgba(1,56,99,0.10)", marginBottom: 12 }}>
          <p style={{ margin: 0, color: "#64748B", fontSize: 10.5, fontWeight: 950, letterSpacing: "0.09em", textTransform: "uppercase" }}>
            Estimated route total
          </p>
          <h2 style={{ margin: "5px 0 0", color: "#013863", fontSize: 34, lineHeight: 0.96, letterSpacing: "-0.055em", fontWeight: 950 }}>
            {displayAmountLabel}
          </h2>
          <p style={{ margin: "9px 0 0", color: "#50668B", fontSize: 12.2, lineHeight: 1.38, fontWeight: 720 }}>
            {displayAmountSubcopy}
          </p>

          <Link
            href={`/traveler/payments/${encodeURIComponent(paymentIntentId)}/sandbox-handoff?source=tour&slug=${encodeURIComponent(snapshot.slug)}&seats=${encodeURIComponent(String(joinerSnapshot.seats))}&time=${encodeURIComponent(joinerSnapshot.joinerTime)}&amount=${encodeURIComponent(String(paymentAmountPhp))}`}
            style={{
              marginTop: 14,
              minHeight: 46,
              borderRadius: 999,
              background: "linear-gradient(135deg, #013863, #0596A5)",
              color: "#FFFFFF",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 950,
              boxShadow: "0 12px 24px rgba(1,56,99,0.18)",
            }}
          >
            Continue to Payment
          </Link>
        </section>

        <section style={{ borderRadius: 24, padding: 14, background: "#F4FCFA", border: "1px solid rgba(5,150,165,0.16)", marginBottom: 12 }}>
          <p style={{ margin: 0, color: "#0596A5", fontSize: 10.5, fontWeight: 950, letterSpacing: "0.09em", textTransform: "uppercase" }}>
            Trip details
          </p>
          <div style={{ display: "grid", gap: 8, marginTop: 11 }}>
            {row("Trip", snapshot.title)}
            {row("Trip No.", snapshot.tripNo)}
            {row("Package", snapshot.packageLabel)}
            {row("Route", snapshot.route)}
            {row("Port", snapshot.port)}
          </div>
        </section>

        <section style={{ borderRadius: 24, padding: 14, background: "#FFFFFF", border: "1px solid rgba(1,56,99,0.10)", boxShadow: "0 14px 34px rgba(1,56,99,0.07)", marginBottom: 12 }}>
          <p style={{ margin: 0, color: "#013863", fontSize: 10.5, fontWeight: 950, letterSpacing: "0.09em", textTransform: "uppercase" }}>
            Price anchor
          </p>
          <p style={{ margin: "7px 0 0", color: "#013863", fontSize: 12, lineHeight: 1.42, fontWeight: 760 }}>
            {snapshot.matrixLine}
          </p>
        </section>

        <section style={{ borderRadius: 24, padding: 14, background: "#FFF8EA", border: "1px solid rgba(243,174,38,0.34)", marginBottom: 70 }}>
          <p style={{ margin: 0, color: "#8A5A00", fontSize: 10.5, fontWeight: 950, letterSpacing: "0.09em", textTransform: "uppercase" }}>
            No hidden charges
          </p>
          <p style={{ margin: "7px 0 0", color: "#013863", fontSize: 12, lineHeight: 1.42, fontWeight: 760 }}>
            {snapshot.feeLine}
          </p>
        </section>
      </div>
    </main>
  );
}
