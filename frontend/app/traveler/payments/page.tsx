import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";
import KuyaTalaEntryButton from "../../../src/traveler-assistant/KuyaTalaEntryButton";

type PaymentSectionProps = {
  title: string;
  eyebrow: string;
  body: string;
  icon: string;
};

type TravelerPaymentsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSearchValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}


function getPaymentParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
  fallback = "",
) {
  const value = searchParams[key];
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
}

function prettifyTrailSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function PaymentSection(props: PaymentSectionProps) {
  return (
    <section
      style={{
        border: "1px solid rgba(15, 118, 140, 0.14)",
        borderRadius: 24,
        background: "rgba(255,255,255,0.94)",
        boxShadow: "0 18px 44px rgba(15,23,42,0.07)",
        padding: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          aria-hidden="true"
          style={{
            width: 42,
            height: 42,
            borderRadius: 16,
            background: "linear-gradient(135deg, #e0f7fb, #eff6ff)",
            color: "#0596A5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            flex: "0 0 auto",
          }}
        >
          {props.icon}
        </div>

        <div>
          <p
            style={{
              margin: 0,
              color: "#0596A5",
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {props.eyebrow}
          </p>
          <h2
            style={{
              margin: "5px 0 0",
              color: "#10233f",
              fontSize: 18,
              lineHeight: 1.1,
              fontWeight: 950,
              letterSpacing: "-0.03em",
            }}
          >
            {props.title}
          </h2>
          <p
            style={{
              margin: "7px 0 0",
              color: "rgba(16,35,63,0.72)",
              fontSize: 13,
              lineHeight: 1.24,
              fontWeight: 700,
            }}
          >
            {props.body}
          </p>
        </div>
      </div>
    </section>
  );
}

function ActionLink(props: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const primary = props.variant !== "secondary";

  return (
    <Link
      href={props.href}
      style={{
        minHeight: 48,
        borderRadius: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        background: primary ? "linear-gradient(135deg, #134f7f, #20a9b7)" : "rgba(255,255,255,0.94)",
        color: primary ? "#ffffff" : "#0b355f",
        border: primary ? "1px solid rgba(255,255,255,0.24)" : "1px solid rgba(47,127,178,0.16)",
        boxShadow: primary ? "0 14px 30px rgba(19,79,127,0.20)" : "0 10px 24px rgba(15,23,42,0.06)",
        fontSize: 13,
        fontWeight: 950,
      }}
    >
      {props.children}
    </Link>
  );
}

export default async function TravelerPaymentsPage({ searchParams }: TravelerPaymentsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const source = getSearchValue(resolvedSearchParams.source);
  const trail = getSearchValue(resolvedSearchParams.trail);
  const gateway = getSearchValue(resolvedSearchParams.gateway);
  const isPassportTrailGateway = source === "passport-trails";
  const decodedTrail = trail ? decodeURIComponent(trail) : "";
  const trailLabel = decodedTrail ? prettifyTrailSlug(decodedTrail) : "Passport Trail";

  if (isPassportTrailGateway) {
    const amountValue = getPaymentParam(resolvedSearchParams, "amount") || getPaymentParam(resolvedSearchParams, "matrixTotal") || "3000";
    const amountLabel = `PHP ${Number(amountValue || 0).toLocaleString("en-PH")}`;
    const tripNo = getPaymentParam(resolvedSearchParams, "tripNo") || "GL-ISL-01";
    const routeCode = getPaymentParam(resolvedSearchParams, "routeCode") || "gl-tri-island-standard";
    const routeProduct = getPaymentParam(resolvedSearchParams, "routeProduct") || "tri-island-joiner";
    const trailSlug = decodedTrail || "island-hopping";
    const safeTrailLabel = trailLabel || "Island Hopping";
    const checkoutHref = `/traveler/payments/tour_sandbox_${routeProduct}?source=passport-trails&trail=${encodeURIComponent(trailSlug)}&slug=${encodeURIComponent(routeProduct)}&amount=${encodeURIComponent(amountValue)}&tripNo=${encodeURIComponent(tripNo)}&routeCode=${encodeURIComponent(routeCode)}`;

    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 0% 0%, rgba(5,150,165,0.08), transparent 34%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 54%, #EAFBFA 100%)",
          color: "#013863",
          padding: "14px 14px 0",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", maxWidth: 390, margin: "0 auto" }}>
          <Link
            href={`/traveler/passport-trails/${encodeURIComponent(trailSlug)}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              minHeight: 36,
              padding: "0 12px",
              borderRadius: 999,
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.08)",
              color: "#013863",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 850,
              boxShadow: "0 8px 20px rgba(1,56,99,0.06)",
            }}
          >
            ← Trail
          </Link>

          <section
            aria-label="Passport Trails payment handoff"
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
              Payment ready
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
              {safeTrailLabel} Payment
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
              Complete checkout to keep your receipt and trip records connected.
            </p>
          </section>

          <section
            aria-label="Passport Trails payment summary"
            style={{
              marginTop: 12,
              borderRadius: 26,
              padding: 14,
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.08)",
              boxShadow: "0 14px 34px rgba(1,56,99,0.07)",
            }}
          >
            <div
              style={{
                color: "#0596A5",
                fontSize: 9,
                fontWeight: 950,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Summary
            </div>

            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {[
                { label: "Trail", value: safeTrailLabel },
                { label: "Trip", value: tripNo },
                { label: "Route", value: routeCode.replaceAll("-", " ") },
                { label: "Amount", value: amountLabel },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    borderRadius: 18,
                    padding: 10,
                    background: item.label === "Amount" ? "#FFF4D8" : "#F4FCFA",
                    border:
                      item.label === "Amount"
                        ? "1px solid rgba(243,174,38,0.24)"
                        : "1px solid rgba(5,150,165,0.12)",
                  }}
                >
                  <div
                    style={{
                      color: "#50668B",
                      fontSize: 8.5,
                      fontWeight: 930,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}
                  </div>
                  <strong
                    style={{
                      display: "block",
                      marginTop: 5,
                      color: "#013863",
                      fontSize: 12,
                      lineHeight: 1.1,
                      fontWeight: 900,
                    }}
                  >
                    {item.value}
                  </strong>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-label="Passport Trails payment next records"
            style={{
              marginTop: 12,
              borderRadius: 26,
              padding: 14,
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.08)",
              boxShadow: "0 14px 34px rgba(1,56,99,0.07)",
            }}
          >
            <div
              style={{
                color: "#0596A5",
                fontSize: 9,
                fontWeight: 950,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              After checkout
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
                    border:
                      index === 0
                        ? "1px solid rgba(243,174,38,0.24)"
                        : "1px solid rgba(5,150,165,0.12)",
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
            aria-label="Continue checkout"
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
            <Link
              href={checkoutHref}
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
              Continue Checkout
            </Link>
          </section>

          <div aria-hidden="true" style={{ height: 148 }} />
        </div>

        <UniversalTravelerBottomTabBar activeTab="trails" fixed />
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(32,169,183,0.20), transparent 34%), linear-gradient(180deg, #f7fcff 0%, #eef8fb 52%, #f8fafc 100%)",
        padding: "18px 14px 30px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <div style={{ marginBottom: 14 }}>
          <Link
            href="/traveler/home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              minHeight: 40,
              padding: "0 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(47,127,178,0.16)",
              color: "#0b355f",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 900,
              boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
            }}
          >
            ← Back
          </Link>
        </div>

        <KuyaTalaEntryButton
          topic="payment"
          title="Need help?"
          note="Ask about receipts or next steps."
        />

        <header
          style={{
            marginTop: 14,
            borderRadius: 22,
            background: "linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 100%)",
            color: "#013863",
            padding: 18,
            boxShadow: "0 22px 50px rgba(7,59,99,0.24)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              opacity: 0.86,
            }}
          >
            Traveler Wallet
          </p>
          <h1
            style={{
              margin: "6px 0 0",
              fontSize: 23,
              lineHeight: 1,
              letterSpacing: "-0.055em",
              fontWeight: 950,
            }}
          >
            Payments
          </h1>
          <p
            style={{
              margin: "7px 0 0",
              maxWidth: 330,
              fontSize: 13,
              lineHeight: 1.24,
              fontWeight: 750,
              color: "rgba(255,255,255,0.86)",
            }}
          >
            Pay. Track. Keep receipts.
          </p>
        </header>

        <section
          style={{
            marginTop: 14,
            border: "1px solid rgba(36,191,209,0.20)",
            borderRadius: 24,
            background: "rgba(255,255,255,0.92)",
            padding: 18,
            boxShadow: "0 16px 40px rgba(15,23,42,0.07)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#0596A5",
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Wallet Ready
          </p>
          <h2
            style={{
              margin: "6px 0 0",
              color: "#10233f",
              fontSize: 22,
              lineHeight: 1.08,
              fontWeight: 950,
              letterSpacing: "-0.035em",
            }}
          >
            Ready when you book
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              color: "rgba(16,35,63,0.72)",
              fontSize: 13,
              lineHeight: 1.24,
              fontWeight: 700,
            }}
          >
            Checkout and receipts will appear here.
          </p>

          <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
            <ActionLink href="/traveler/explore">Explore</ActionLink>
            <ActionLink href="/traveler/trips" variant="secondary">Trips</ActionLink>
          </div>
        </section>

        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          <PaymentSection eyebrow="Summary" title="Summary" body="Totals appear here." icon="₱" />
          <PaymentSection eyebrow="Action" title="Pending" body="Checkout requests." icon="⌛" />
          <PaymentSection eyebrow="Receipts" title="Receipts" body="Saved after payment." icon="🧾" />
          <PaymentSection eyebrow="Trips" title="Linked Trips" body="Matched to bookings." icon="🧭" />
          <PaymentSection eyebrow="Support" title="Support" body="Open a trip for help." icon="💬" />
        </div>

        <div aria-hidden="true" style={{ height: 120 }} />
        <UniversalTravelerBottomTabBar activeTab="trails" fixed />
      </div>
    </main>
  );
}

