import Link from "next/link";
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
            color: "#0f7890",
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
              color: "#0f7890",
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
              lineHeight: 1.45,
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
        fontSize: 14,
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
    return (
      <main
        data-state="PASSPORT_TRAILS_PAYMENT_GATEWAY_STATE"
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left, rgba(243,174,38,0.18), transparent 34%), radial-gradient(circle at 90% 0%, rgba(5,150,165,0.14), transparent 30%), linear-gradient(180deg, #fffaf0 0%, #f4fcfa 52%, #ffffff 100%)",
          padding: "18px 14px 34px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
          <div style={{ marginBottom: 14 }}>
            <Link
              href={decodedTrail ? `/traveler/passport-trails/${encodeURIComponent(decodedTrail)}` : "/traveler/passport-trails"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                minHeight: 40,
                padding: "0 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.94)",
                border: "1px solid rgba(5,150,165,0.18)",
                color: "#013863",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 900,
                boxShadow: "0 8px 18px rgba(1,56,99,0.06)",
              }}
            >
              ← Back to Trail
            </Link>
          </div>

          <KuyaTalaEntryButton
            topic="payment"
            title="Ask Kuya Tala™ about this trail payment"
            note="Get help understanding why a booking record is required before PayMongo checkout."
          />

          <section
            style={{
              marginTop: 14,
              borderRadius: 30,
              background: "linear-gradient(135deg, #013863 0%, #0596A5 62%, #F3AE26 100%)",
              color: "#ffffff",
              padding: 22,
              boxShadow: "0 24px 54px rgba(1,56,99,0.24)",
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
                color: "rgba(255,255,255,0.86)",
              }}
            >
              Passport Trail Payment Gateway
            </p>
            <h1
              style={{
                margin: "8px 0 0",
                fontSize: 30,
                lineHeight: 1,
                letterSpacing: "-0.055em",
                fontWeight: 950,
              }}
            >
              Secure your trail payment record first.
            </h1>
            <p
              style={{
                margin: "10px 0 0",
                maxWidth: 340,
                fontSize: 14,
                lineHeight: 1.45,
                fontWeight: 760,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              {trailLabel} is payment-aware, but PayMongo checkout needs a booking-linked payment intent before it can open.
            </p>
          </section>

          <section
            style={{
              marginTop: 14,
              border: "1px solid rgba(243,174,38,0.32)",
              borderRadius: 26,
              background: "linear-gradient(135deg, #FFF7E6 0%, #FFFFFF 52%, #EAFBFA 100%)",
              padding: 18,
              boxShadow: "0 18px 42px rgba(1,56,99,0.10)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#B76A00",
                fontSize: 11,
                fontWeight: 950,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Booking record required
            </p>
            <h2
              style={{
                margin: "7px 0 0",
                color: "#013863",
                fontSize: 22,
                lineHeight: 1.08,
                fontWeight: 950,
                letterSpacing: "-0.035em",
              }}
            >
              PayMongo opens after OSP creates your trail payment intent.
            </h2>
            <p
              style={{
                margin: "9px 0 0",
                color: "rgba(1,56,99,0.72)",
                fontSize: 14,
                lineHeight: 1.48,
                fontWeight: 730,
              }}
            >
              A trail slug alone is not enough for checkout. OSP must first create or reuse a trail booking record, attach pricing, then generate a payment intent.
            </p>

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gap: 10,
              }}
            >
              <ActionLink
                href={decodedTrail ? `/traveler/passport-trails/diy-trail-builder?source=${encodeURIComponent(decodedTrail)}&gateway=${encodeURIComponent(gateway || "paymongo")}` : "/traveler/passport-trails/diy-trail-builder"}
              >
                Create Trail Booking Record
              </ActionLink>

              <ActionLink
                href="/traveler/passport-trails/diy-trail-builder/summary"
                variant="secondary"
              >
                Continue Existing Trail Request
              </ActionLink>

              <ActionLink
                href="/traveler/settings?panel=assistant&topic=trail-payment"
                variant="secondary"
              >
                Talk to Kuya Tala™
              </ActionLink>
            </div>
          </section>

          <section
            style={{
              marginTop: 14,
              border: "1px solid rgba(5,150,165,0.18)",
              borderRadius: 24,
              background: "rgba(255,255,255,0.94)",
              padding: 16,
              boxShadow: "0 14px 34px rgba(1,56,99,0.07)",
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
              Payment contract
            </p>
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {[
                "Trail selection creates the traveler intent.",
                "Booking record locks the commercial context.",
                "Payment intent opens the PayMongo checkout page.",
                "Receipt and payment state remain booking-linked.",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #F4FCFA, #FFFFFF)",
                    border: "1px solid rgba(5,150,165,0.14)",
                    padding: "10px 12px",
                    color: "#013863",
                    fontSize: 13,
                    fontWeight: 800,
                    lineHeight: 1.35,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
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
          title="Ask Kuya Tala™ about payments"
          note="Get guided help understanding payment status, receipts, and trip-linked payment actions."
        />

        <header
          style={{
            marginTop: 14,
            borderRadius: 30,
            background: "linear-gradient(135deg, #073b63 0%, #0f7890 58%, #24bfd1 100%)",
            color: "#ffffff",
            padding: 22,
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
              margin: "8px 0 0",
              fontSize: 30,
              lineHeight: 1,
              letterSpacing: "-0.055em",
              fontWeight: 950,
            }}
          >
            Payments & Receipts
          </h1>
          <p
            style={{
              margin: "10px 0 0",
              maxWidth: 330,
              fontSize: 14,
              lineHeight: 1.45,
              fontWeight: 750,
              color: "rgba(255,255,255,0.86)",
            }}
          >
            Your confirmed bookings, trip payments, and receipts will appear here once you start booking through One Siargao Pass.
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
              color: "#0f7890",
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Empty State
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
            No payments yet.
          </h2>
          <p
            style={{
              margin: "8px 0 0",
              color: "rgba(16,35,63,0.72)",
              fontSize: 14,
              lineHeight: 1.45,
              fontWeight: 700,
            }}
          >
            Payment records are created only after a booking or trip action generates a real payment intent. No simulated receipts or placeholder transactions are shown here.
          </p>

          <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
            <ActionLink href="/traveler/explore">Explore Siargao</ActionLink>
            <ActionLink href="/traveler/trips" variant="secondary">View Trips</ActionLink>
          </div>
        </section>

        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          <PaymentSection eyebrow="Summary" title="Payment Summary" body="A real summary will appear after your traveler account has booking-linked payment records." icon="₱" />
          <PaymentSection eyebrow="Action Needed" title="Pending Payments" body="Open payment actions from your trip details when a booking is ready for checkout." icon="⌛" />
          <PaymentSection eyebrow="Records" title="Recent Receipts" body="Paid and issued receipts will be listed here once verified by the payment and booking records." icon="🧾" />
          <PaymentSection eyebrow="Trip Linkage" title="Linked Trips" body="Payments remain tied to the booking or trip that created them, so records stay auditable." icon="🧭" />
          <PaymentSection eyebrow="Support" title="Payment Help" body="For issues, open the trip record first so support can trace the exact booking and payment intent." icon="💬" />
        </div>

        <nav
          style={{
            marginTop: 18,
            border: "1px solid #dbe8ef",
            borderRadius: 26,
            background: "rgba(255,255,255,0.98)",
            padding: "10px 12px",
            boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
            textAlign: "center",
          }}
        >
          <Link href="/traveler/home" style={bottomNavLinkStyle}>Home</Link>
          <Link href="/traveler/trips" style={bottomNavLinkStyle}>Trips</Link>
          <Link href="/traveler/pass" style={bottomNavLinkStyle}>My Pass</Link>
          <Link href="/traveler/settings" style={bottomNavLinkStyle}>Profile</Link>
        </nav>
      </div>
    </main>
  );
}

const bottomNavLinkStyle = {
  minHeight: 42,
  borderRadius: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  color: "#0b355f",
  background: "#f8fafc",
  border: "1px solid rgba(47,127,178,0.10)",
  fontSize: 12,
  fontWeight: 900,
} as const;
