import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";
import { getPreferredTravelerTrip } from "../../../src/lib/travelerTripSelection";

async function getPassView() {
  const baseUrl = getApiBaseUrl();

  try {
    const token = await requireAccessToken();

    const listRes = await fetch(`${baseUrl}/trips`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!listRes.ok) {
      return {
        error: `Failed to load traveler trips: HTTP ${listRes.status}`,
        trip: null,
      };
    }

    const rows = await listRes.json();
    const trips = Array.isArray(rows) ? rows : [];

    if (trips.length === 0) {
      return {
        error: null,
        trip: null,
      };
    }

    const preferredTrip = getPreferredTravelerTrip(trips);

    if (!preferredTrip?.id) {
      return {
        error: null,
        trip: null,
      };
    }

    const tripRes = await fetch(`${baseUrl}/trips/${preferredTrip.id}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!tripRes.ok) {
      return {
        error: `Failed to load pass view: HTTP ${tripRes.status}`,
        trip: null,
      };
    }

    const trip = await tripRes.json();
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

function buildPassGateReasons(trip: any) {
  const reasons: string[] = [];

  if (!trip?.pass) {
    if (trip?.clearanceStatus !== "APPROVED") {
      reasons.push("Traveler clearance is not yet approved.");
    }

    if (trip?.currentPaymentState?.state !== "PAID") {
      reasons.push("Current booking payment is not yet marked paid.");
    }

    if (!trip?.currentBooking?.id) {
      reasons.push("No current booking is linked to this trip yet.");
    }

    if (
      trip?.clearanceStatus === "APPROVED" &&
      trip?.currentPaymentState?.state === "PAID" &&
      trip?.currentBooking?.id
    ) {
      reasons.push("Pass has not yet been issued for this eligible trip.");
    }
  }

  return reasons;
}

export default async function TravelerPassPage() {
  const { trip, error } = await getPassView();
  const gateReasons = trip ? buildPassGateReasons(trip) : [];

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>OSP Pass</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Traveler-facing pass view with issuance gating based on current trip status.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <a href="/">Home</a>
        <a href="/traveler/trips">My Trips</a>
        <a href="/logout">Logout</a>
      </div>

      <Section title="Pass Access Note">
        <p style={{ marginTop: 0 }}>
          This page uses the authenticated session to load the traveler pass view.
        </p>
        <p style={{ marginBottom: 0 }}>
          If an issued pass already exists, it is prioritized. Otherwise the latest traveler trip is checked for pass eligibility.
        </p>
      </Section>

      {error ? (
        <Section title="Load Error">
          <p style={{ margin: 0 }}>{error}</p>
        </Section>
      ) : null}

      {!trip ? (
        <Section title="No Trips Available">
          <p style={{ margin: 0 }}>
            No traveler trip is available yet for pass viewing.
          </p>
        </Section>
      ) : (
        <>
          <Section title="Pass Eligibility / Status">
            <KeyValue label="Trip ID" value={trip.id} />
            <KeyValue label="Trip Status" value={trip.tripStatus} />
            <KeyValue label="Registration Status" value={trip.registrationStatus} />
            <KeyValue label="Clearance Status" value={trip.clearanceStatus} />
            <KeyValue label="Manifest Listed" value={trip.manifestReadiness?.isManifestListed ? "YES" : "NO"} />
            <KeyValue label="Manifest Status" value={trip.manifestReadiness?.latestManifestStatus} />
            <KeyValue label="Manifest Ref" value={trip.manifestReadiness?.latestManifestReference} />
            <KeyValue label="Payment State" value={trip.currentPaymentState?.state} />
            <KeyValue label="Has Issued Pass" value={trip.pass ? "YES" : "NO"} />
            <KeyValue label="Pass Status" value={trip.pass?.passStatus} />
          </Section>

          {!trip.pass ? (
            <Section title="Pass Blocked">
              {gateReasons.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
                  {gateReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0 }}>
                  Pass is not currently available for this trip.
                </p>
              )}
            </Section>
          ) : (
            <>
              <Section title="Pass Status">
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
            </>
          )}

          <Section title="Traveler / Trip Context">
            <KeyValue label="Origin" value={trip.originLocation} />
            <KeyValue label="Accommodation" value={trip.declaredAccommodationName} />
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
