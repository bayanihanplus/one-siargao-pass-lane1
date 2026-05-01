import Link from "next/link";
import KuyaTalaEntryButton from "../../../src/traveler-assistant/KuyaTalaEntryButton";

type PaymentSectionProps = {
  title: string;
  eyebrow: string;
  body: string;
  icon: string;
};

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

export default function TravelerPaymentsPage() {
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
