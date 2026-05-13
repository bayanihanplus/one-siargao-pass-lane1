type PaymentSandboxPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function readParam(
  searchParams: PaymentSandboxPageProps["searchParams"],
  key: string,
  fallback = "",
) {
  const value = searchParams?.[key];
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
}

function productLabel(product: string) {
  if (product === "private-island-route") return "Private Boat";
  return "Joiner Seat";
}

function pickupLabel(value: string) {
  if (value === "pickup-help") return "Ask pickup help";
  return "General Luna";
}

function peso(value: string) {
  const amount = Number(value || 0);
  return `PHP ${amount.toLocaleString("en-PH")}`;
}

export default function IslandHoppingPaymentSandboxPage({
  searchParams,
}: PaymentSandboxPageProps) {
  const product = readParam(searchParams, "product", "tri-island-joiner");
  const date = readParam(searchParams, "date", "To confirm");
  const departureWindow = readParam(searchParams, "departureWindow", "08:00");
  const pickup = readParam(searchParams, "pickup", "general-luna");
  const pax = readParam(searchParams, "pax", "2");
  const boatClass = readParam(searchParams, "boatClass", "JOINER");
  const matrixTotal = readParam(searchParams, "matrixTotal", "0");
  const tripNo = readParam(searchParams, "tripNo", "GL-ISL-01");

  const seatsParams = new URLSearchParams({
    intent: "island-hopping-seats-confirmed",
    trail: "island-hopping",
    officialTrail: "Island Hopping",
    routeType: readParam(searchParams, "routeType", "GL_TRI_ISLAND_STANDARD"),
    routeCode: readParam(searchParams, "routeCode", "gl-tri-island-standard"),
    routeProduct: product,
    tripNo,
    departurePort: readParam(searchParams, "departurePort", "GENERAL_LUNA_PORT"),
    routeReadiness: "pending",
    departureReadiness: "required",
    boardingFlow: "online",
    voucher: "after-payment",
    onlineBoarding: "after-payment",
    boardingQr: "after-assignment",
    manifest: "after-boarding",
    movementRecord: "after-boarding",
    paymentTiming: "after-route-readiness",
    fulfillment: "boat-guide-operator-assignment",
    step: "seats-confirmed",
    product,
    pricingMode: readParam(searchParams, "pricingMode", "per-head"),
    source: "spm-official-trail",
    bookingPath: readParam(searchParams, "bookingPath", "joiner"),
    date,
    departureWindow,
    pickup,
    pax,
    regularPax: readParam(searchParams, "regularPax", pax),
    seniorPax: readParam(searchParams, "seniorPax", "0"),
    boatClass,
    matrixTotal,
  });

  const paymentSuccessParams = new URLSearchParams({
    intent: "island-hopping-payment-success-sandbox",
    trail: "island-hopping",
    officialTrail: "Island Hopping",
    routeType: readParam(searchParams, "routeType", "GL_TRI_ISLAND_STANDARD"),
    routeCode: readParam(searchParams, "routeCode", "gl-tri-island-standard"),
    routeProduct: product,
    tripNo,
    departurePort: readParam(searchParams, "departurePort", "GENERAL_LUNA_PORT"),
    routeReadiness: "confirmed",
    departureReadiness: "required",
    boardingFlow: "online",
    voucher: "pending-issuance",
    onlineBoarding: "pending",
    boardingQr: "after-assignment",
    manifest: "after-boarding",
    movementRecord: "after-boarding",
    paymentTiming: "sandbox-paid",
    fulfillment: "boat-guide-operator-assignment",
    step: "payment-success-sandbox",
    product,
    pricingMode: readParam(searchParams, "pricingMode", "per-head"),
    source: "spm-official-trail",
    bookingPath: readParam(searchParams, "bookingPath", "joiner"),
    date,
    departureWindow,
    pickup,
    pax,
    regularPax: readParam(searchParams, "regularPax", pax),
    seniorPax: readParam(searchParams, "seniorPax", "0"),
    boatClass,
    matrixTotal,
    paymentProvider: "sandbox",
  });

  const summary = [
    ["Route", "GL Tri-Island"],
    ["Date", date],
    ["Time", departureWindow],
    ["Travelers", `${pax} pax`],
    ["Pickup", pickupLabel(pickup)],
    ["Setup", productLabel(product)],
    ["Boat class", boatClass],
    ["Amount to pay", peso(matrixTotal)],
  ];

  const paymentStates = [
    ["Seats", "Confirmed"],
    ["Payment", "Sandbox"],
    ["Voucher", "After payment"],
    ["Boarding QR", "After assignment"],
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% -12%, rgba(5,150,165,0.12), transparent 30%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 48%, #EAFBFA 100%)",
        color: "#013863",
        padding: "12px 14px calc(120px + env(safe-area-inset-bottom))",
      }}
    >
      <div style={{ width: "100%", maxWidth: 390, margin: "0 auto" }}>
        <section
          aria-label="Official Trail payment sandbox"
          style={{
            borderRadius: 30,
            padding: 14,
            background:
              "linear-gradient(145deg, #FFFFFF 0%, #F4FCFA 56%, #EAFBFA 100%)",
            boxShadow: "0 20px 44px rgba(1,56,99,0.10)",
            border: "1px solid rgba(5,150,165,0.16)",
            color: "#013863",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <a
            href={`/traveler/passport-trails/island-hopping/seats-confirmed?${seatsParams.toString()}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: 999,
              padding: "7px 10px",
              background: "rgba(1,56,99,0.06)",
              color: "#013863",
              textDecoration: "none",
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            ‹ Seats confirmed
          </a>

          <h1
            style={{
              margin: "13px 0 0",
              color: "#013863",
              fontSize: 26,
              lineHeight: 0.98,
              fontWeight: 940,
              letterSpacing: "-0.055em",
            }}
          >
            Payment sandbox
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#50668B",
              fontSize: 12,
              lineHeight: 1.25,
              fontWeight: 760,
            }}
          >
            {productLabel(product)} · {tripNo}
          </p>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 7,
            }}
          >
            {paymentStates.map(([label, value]) => (
              <div
                key={label}
                style={{
                  minHeight: 54,
                  borderRadius: 16,
                  padding: "8px 6px",
                  background: "#FFFFFF",
                  color: "#013863",
                  border: "1px solid rgba(5,150,165,0.14)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#F3AE26",
                  }}
                />
                <strong style={{ fontSize: 8.6, lineHeight: 1, fontWeight: 900 }}>
                  {label}
                </strong>
                <span style={{ color: "#50668B", fontSize: 7.4, lineHeight: 1, fontWeight: 760, textAlign: "center" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Payment amount"
          style={{
            marginTop: 12,
            borderRadius: 26,
            padding: 13,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
          }}
        >
          <div
            style={{
              color: "#0596A5",
              fontSize: 9.4,
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Amount to pay
          </div>

          <strong
            style={{
              display: "block",
              marginTop: 9,
              color: "#013863",
              fontSize: 30,
              lineHeight: 1,
              fontWeight: 940,
              letterSpacing: "-0.055em",
            }}
          >
            {peso(matrixTotal)}
          </strong>

          <div style={{ marginTop: 13, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {summary.map(([label, value]) => (
              <div
                key={label}
                style={{
                  borderRadius: 17,
                  padding: "10px",
                  background: "#F4FCFA",
                  border: "1px solid rgba(5,150,165,0.11)",
                }}
              >
                <div
                  style={{
                    color: "#50668B",
                    fontSize: 8.5,
                    lineHeight: 1,
                    fontWeight: 860,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </div>
                <strong
                  style={{
                    display: "block",
                    marginTop: 6,
                    color: "#013863",
                    fontSize: 11.2,
                    lineHeight: 1.1,
                    fontWeight: 900,
                  }}
                >
                  {value}
                </strong>
              </div>
            ))}
          </div>

          <a
            href={`/traveler/passport-trails/island-hopping/payment-success-sandbox?${paymentSuccessParams.toString()}`}
            style={{
              marginTop: 12,
              minHeight: 52,
              borderRadius: 18,
              background: "#013863",
              color: "#FFFFFF",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13.2,
              fontWeight: 930,
              boxShadow: "0 16px 32px rgba(1,56,99,0.18)",
            }}
          >
            Pay Sandbox
          </a>

          <a
            href={`/traveler/passport-trails/island-hopping/seats-confirmed?${seatsParams.toString()}`}
            style={{
              marginTop: 8,
              minHeight: 46,
              borderRadius: 16,
              background: "#FFFFFF",
              color: "#013863",
              border: "1px solid rgba(1,56,99,0.10)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 880,
            }}
          >
            Back to Seats
          </a>
        </section>
      </div>
    </main>
  );
}
