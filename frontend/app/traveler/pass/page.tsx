import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

async function getPassView() {
  const baseUrl = getApiBaseUrl();
  const tripId =
    process.env.NEXT_PUBLIC_DEV_TRIP_ID || "cmo77j9oe0001nlduxl7ta5qp";

  try {
    const token = await requireAccessToken();

    const res = await fetch(`${baseUrl}/trips/${tripId}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return {
        error: `Failed to load pass view: HTTP ${res.status}`,
        trip: null,
      };
    }

    const trip = await res.json();
    return { trip, error: null };
  } catch (error: any) {
    return {
      error: error?.message || "Unknown pass load failure",
      trip: null,
    };
  }
}

function Section(props: { title: string; children: any }) {
  const { title, children } = props;

  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>{title}</h2>
      {children}
    </section>
  );
}

function KeyValue(props: { label: string; value: any }) {
  const { label, value } = props;

  return (
    <div style={{ marginBottom: 8 }}>
      <strong>{label}:</strong> {value ?? "—"}
    </div>
  );
}

export default async function TravelerPassPage() {
  const { trip, error } = await getPassView();

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>OSP Pass</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Dev-bridge pass viewer using the current trip contract.
      </p>

      <Section title="Pass Access Note">
        <p style={{ marginTop: 0 }}>
          This page uses the authenticated session to load the traveler pass view.
        </p>
        <p style={{ marginBottom: 0 }}>
          Trip selection for the pass view is still tied to the current traveler entry flow.
        </p>
      </Section>

      {error ? (
        <Section title="Load Error">
          <p style={{ margin: 0 }}>{error}</p>
        </Section>
      ) : null}

      {!trip ? null : (
        <>
          <Section title="Pass Status">
            <KeyValue label="Trip ID" value={trip.id} />
            <KeyValue label="Trip Status" value={trip.tripStatus} />
            <KeyValue
              label="Registration Status"
              value={trip.registrationStatus}
            />
            <KeyValue label="Clearance Status" value={trip.clearanceStatus} />
            <KeyValue label="Pass Code" value={trip.pass?.passCode} />
            <KeyValue label="Pass Status" value={trip.pass?.passStatus} />
            <KeyValue label="Issued At" value={trip.pass?.issuedAt} />
            <KeyValue label="Expires At" value={trip.pass?.expiresAt} />
            <KeyValue label="Revoked At" value={trip.pass?.revokedAt} />
          </Section>

          <Section title="QR Credential">
            <KeyValue label="QR Version" value={trip.pass?.qrCredential?.qrVersion} />
            <KeyValue
              label="Last Regenerated At"
              value={trip.pass?.qrCredential?.lastRegeneratedAt}
            />
          </Section>

          <Section title="Traveler / Trip Context">
            <KeyValue label="Origin" value={trip.originLocation} />
            <KeyValue
              label="Accommodation"
              value={trip.declaredAccommodationName}
            />
            <KeyValue label="Arrival Date" value={trip.arrivalDate} />
            <KeyValue label="Departure Date" value={trip.departureDate} />
          </Section>

          <Section title="Current Booking / Payment Snapshot">
            <KeyValue label="Current Booking ID" value={trip.currentBooking?.id} />
            <KeyValue
              label="Current Booking Reference"
              value={trip.currentBooking?.bookingReference}
            />
            <KeyValue
              label="Payment State"
              value={trip.currentPaymentState?.state}
            />
            <KeyValue
              label="Current Intent Reference"
              value={trip.currentPaymentIntent?.intentReference}
            />
          </Section>
        </>
      )}
    </main>
  );
}
