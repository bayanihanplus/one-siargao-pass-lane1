import Link from "next/link";
import { getGlRoutePriceAnchor } from "../../../../../src/spm/traveler/glRoutePriceAnchors";

type SandboxHandoffPageProps = {
  params: Promise<{
    intentId: string;
  }>;
  searchParams?: Promise<{
    source?: string;
    slug?: string;
    amount?: string;
    seats?: string;
    time?: string;
  }>;
};

function detailRow(label: string, value: string) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span
        style={{
          color: "#64748B",
          fontSize: 10.5,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </span>
      <strong
        style={{
          color: "#013863",
          fontSize: 11.3,
          lineHeight: 1.22,
          textAlign: "right",
          fontWeight: 900,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function nextStep(label: string, value: string) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "28px 1fr",
        gap: 10,
        alignItems: "start",
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          background: "#EAFBFA",
          color: "#0596A5",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 950,
          marginTop: 1,
        }}
      >
        ✓
      </span>
      <div>
        <strong
          style={{
            display: "block",
            color: "#013863",
            fontSize: 12.2,
            lineHeight: 1.15,
            fontWeight: 900,
          }}
        >
          {label}
        </strong>
        <span
          style={{
            display: "block",
            marginTop: 3,
            color: "#50668B",
            fontSize: 11.2,
            lineHeight: 1.35,
            fontWeight: 720,
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function formatPhp(amount: number) {
  return `PHP ${amount.toLocaleString("en-PH")}`;
}

function parsePositiveInt(value?: string, fallback = 1) {
  const parsed = Number(value || "");
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.max(1, Math.floor(parsed));
}

export default async function SandboxHandoffPage({
  params,
  searchParams,
}: SandboxHandoffPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const intentId = resolvedParams.intentId;
  const slug = resolvedSearchParams.slug || "";
  const snapshot = getGlRoutePriceAnchor(slug);

  const title = snapshot?.title || "Payment Handoff";
  const tripNo = snapshot?.tripNo || "Sandbox trip";
  const route = snapshot?.route || "Selected route";
  const port = snapshot?.port || "Selected port";
  const queryAmount = Number(resolvedSearchParams.amount || "");
  const querySeats = parsePositiveInt(resolvedSearchParams.seats, 1);
  const queryTime = resolvedSearchParams.time || "11:00 AM";
  const hasQueryAmount = Number.isFinite(queryAmount) && queryAmount > 0;

  const amountLabel = hasQueryAmount ? `From ${formatPhp(queryAmount)}` : snapshot?.amountLabel || "Price review";
  const amountSubcopy = hasQueryAmount
    ? `${querySeats} joiner seat${querySeats === 1 ? "" : "s"} · ${queryTime} Joiner Trip`
    : snapshot?.amountSubcopy || "Joiner price is PHP 1,500 per person. OSP handles fulfillment category assignment after payment.";
  const image = snapshot?.image || "/osp/temp-tour-posters/tri-island-joiner.png";

  const backHref = slug
    ? `/traveler/payments/tour-sandbox/${encodeURIComponent(slug)}`
    : "/traveler/payments";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(5,150,165,0.10), transparent 34%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 58%, #EAFBFA 100%)",
        color: "#013863",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <div style={{ width: "min(100%, 430px)", margin: "0 auto", padding: "14px 14px 110px" }}>
        <Link
          href={backHref}
          style={{
            display: "inline-flex",
            color: "#0596A5",
            fontSize: 12,
            fontWeight: 850,
            textDecoration: "none",
            marginBottom: 12,
          }}
        >
          ← Back to price review
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
          <div style={{ height: 202, position: "relative" }}>
            <img
              src={image}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                opacity: 0.68,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(1,56,99,0.08) 0%, rgba(1,56,99,0.90) 100%)",
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
                Payment handoff
              </span>

              <h1
                style={{
                  margin: "10px 0 0",
                  color: "#FFFFFF",
                  fontSize: 28,
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  fontWeight: 950,
                  textShadow: "0 3px 18px rgba(0,0,0,0.42)",
                }}
              >
                {title}
              </h1>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "rgba(255,255,255,0.90)",
                  fontSize: 12.5,
                  lineHeight: 1.36,
                  fontWeight: 720,
                }}
              >
                {tripNo} · {port}
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            borderRadius: 26,
            padding: 16,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 18px 42px rgba(1,56,99,0.10)",
            marginBottom: 12,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: 10.5,
              fontWeight: 950,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
            }}
          >
            Price review
          </p>
          <h2
            style={{
              margin: "5px 0 0",
              color: "#013863",
              fontSize: 34,
              lineHeight: 0.96,
              letterSpacing: "-0.055em",
              fontWeight: 950,
            }}
          >
            {amountLabel}
          </h2>
          <p style={{ margin: "9px 0 0", color: "#50668B", fontSize: 12.2, lineHeight: 1.38, fontWeight: 720 }}>
            {amountSubcopy}
          </p>

          <Link
            href={`/traveler/payments/${encodeURIComponent(intentId)}?payment=paymongo-success${
              slug ? `&source=tour&slug=${encodeURIComponent(slug)}${hasQueryAmount ? `&seats=${encodeURIComponent(String(querySeats))}&time=${encodeURIComponent(queryTime)}&amount=${encodeURIComponent(String(queryAmount))}` : ""}` : ""
            }`}
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
            View Payment Record
          </Link>
        </section>

        <section
          style={{
            borderRadius: 24,
            padding: 14,
            background: "#F4FCFA",
            border: "1px solid rgba(5,150,165,0.16)",
            marginBottom: 12,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#0596A5",
              fontSize: 10.5,
              fontWeight: 950,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
            }}
          >
            Trip handoff summary
          </p>

          <div style={{ display: "grid", gap: 8, marginTop: 11 }}>
            {detailRow("Trip", title)}
            {detailRow("Trip No.", tripNo)}
            {detailRow("Route", route)}
            {detailRow("Port", port)}
            {detailRow("Payment intent", intentId)}
            {detailRow("Status", "Handoff preview")}
          </div>
        </section>

        <section
          style={{
            borderRadius: 24,
            padding: 14,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.07)",
            marginBottom: 12,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#013863",
              fontSize: 10.5,
              fontWeight: 950,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
            }}
          >
            What happens next
          </p>

          <div style={{ display: "grid", gap: 13, marginTop: 13 }}>
            {nextStep("Voucher is prepared", "Your voucher becomes the commercial proof of the trip after payment success.")}
            {nextStep("Receipt is recorded", "Your receipt is generated from the payment record and linked to this trip.")}
            {nextStep("Boarding QR is prepared", "Your boarding QR becomes active after valid operator and vessel assignment.")}
            {nextStep("Port scan updates the boarding record", "The boarding record updates when the QR is scanned at the port.")}
          </div>
        </section>

        <section
          style={{
            borderRadius: 24,
            padding: 14,
            background: "#FFF8EA",
            border: "1px solid rgba(243,174,38,0.34)",
            marginBottom: 70,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#8A5A00",
              fontSize: 10.5,
              fontWeight: 950,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
            }}
          >
            Locked travel record
          </p>
          <p style={{ margin: "7px 0 0", color: "#013863", fontSize: 12, lineHeight: 1.42, fontWeight: 760 }}>
            Voucher, receipt, boarding QR, and boarding record must be generated from backend events and logged. Frontend-only confirmation is not acceptable for production.
          </p>
        </section>
      </div>

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 20,
          background: "rgba(255,255,255,0.92)",
          borderTop: "1px solid rgba(1,56,99,0.10)",
          backdropFilter: "blur(14px)",
          padding: "10px 12px calc(10px + env(safe-area-inset-bottom))",
        }}
      >
        <div
          style={{
            width: "min(100%, 430px)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: "#64748B",
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Payment handoff
            </p>
            <p style={{ margin: "2px 0 0", color: "#013863", fontSize: 13.5, fontWeight: 900 }}>
              {amountLabel}
            </p>
          </div>

          <Link
            href={`/traveler/payments/${encodeURIComponent(intentId)}?payment=paymongo-success${
              slug ? `&source=tour&slug=${encodeURIComponent(slug)}${hasQueryAmount ? `&seats=${encodeURIComponent(String(querySeats))}&time=${encodeURIComponent(queryTime)}&amount=${encodeURIComponent(String(queryAmount))}` : ""}` : ""
            }`}
            style={{
              minHeight: 42,
              padding: "0 18px",
              borderRadius: 999,
              background: "#013863",
              color: "#FFFFFF",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 900,
              boxShadow: "0 10px 22px rgba(1,56,99,0.18)",
            }}
          >
            Continue
          </Link>
        </div>
      </div>
    </main>
  );
}
