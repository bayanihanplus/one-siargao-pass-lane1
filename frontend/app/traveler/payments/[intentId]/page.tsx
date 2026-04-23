import { getApiBaseUrl, requireAccessToken } from "../../../../src/lib/server-auth";

type PaymentPageProps = {
  params: Promise<{
    intentId: string;
  }>;
};

async function getPaymentIntent(intentId: string) {
  const baseUrl = getApiBaseUrl();

  try {
    const token = await requireAccessToken();

    const res = await fetch(`${baseUrl}/payments/intents/${intentId}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return {
        error: `Failed to load payment intent: HTTP ${res.status}`,
        intent: null,
      };
    }

    const intent = await res.json();
    return { intent, error: null };
  } catch (error: any) {
    return {
      error: error?.message || "Unknown payment intent load failure",
      intent: null,
    };
  }
}

function Section(props: { title: string; children: any }) {
  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>{props.title}</h2>
      {props.children}
    </section>
  );
}

function KeyValue(props: { label: string; value: any }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <strong>{props.label}:</strong> {props.value ?? "—"}
    </div>
  );
}

export default async function TravelerPaymentIntentPage({
  params,
}: PaymentPageProps) {
  const { intentId } = await params;
  const { intent, error } = await getPaymentIntent(intentId);

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Traveler Payment Detail</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Authenticated traveler view of the selected payment intent and booking payment state.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <a href="/">Home</a>
        <a href="/traveler/trips">My Trips</a>
        <a href="/logout">Logout</a>
      </div>

      {error ? (
        <Section title="Load Error">
          <div>{error}</div>
        </Section>
      ) : null}

      {!intent ? null : (
        <>
          <Section title="Payment Intent">
            <KeyValue label="Intent ID" value={intent.id} />
            <KeyValue label="Booking ID" value={intent.bookingId} />
            <KeyValue label="Intent Reference" value={intent.intentReference} />
            <KeyValue label="Status" value={intent.status} />
            <KeyValue label="Amount PHP" value={intent.amountPhp} />
            <KeyValue label="Currency Code" value={intent.currencyCode} />
            <KeyValue label="Provider" value={intent.provider} />
            <KeyValue label="Confirmed At" value={intent.confirmedAt} />
            <KeyValue label="Created At" value={intent.createdAt} />
            <KeyValue label="Updated At" value={intent.updatedAt} />
          </Section>

          <Section title="Payment State">
            <KeyValue label="State" value={intent.paymentState?.state} />
            <KeyValue label="Paid Amount PHP" value={intent.paymentState?.paidAmountPhp} />
            <KeyValue label="Unpaid Amount PHP" value={intent.paymentState?.unpaidAmountPhp} />
            <KeyValue label="Last Payment Intent ID" value={intent.paymentState?.lastPaymentIntentId} />
            <KeyValue label="State Updated At" value={intent.paymentState?.stateUpdatedAt} />
          </Section>
        </>
      )}
    </main>
  );
}
