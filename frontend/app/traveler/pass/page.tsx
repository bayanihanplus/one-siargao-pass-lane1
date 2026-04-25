import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";
import { getPreferredTravelerTrip } from "../../../src/lib/travelerTripSelection";
import { QRCodeSVG } from "qrcode.react";

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

function buildPassUsageWarnings(trip: any) {
  const warnings: string[] = [];

  if (!trip?.pass) {
    return warnings;
  }

  if (trip?.manifestReadiness?.isManifestListed === false) {
    warnings.push("This pass is on record, but the trip is not yet listed in a manifest.");
  }

  if (trip?.clearanceStatus !== "APPROVED") {
    warnings.push("This pass is not ready for use because traveler clearance is not approved.");
  }

  if (trip?.currentBooking?.id && trip?.currentPaymentState?.state !== "PAID") {
    warnings.push("This pass is not ready for use because the current booking payment is not marked paid.");
  }

  if (!trip?.currentBooking?.id) {
    warnings.push("This pass is on record, but no current booking is linked to this trip.");
  }

  return warnings;
}

function getPassReadinessSummary(trip: any, passUsageWarnings: string[]) {
  if (!trip) {
    return {
      title: "No Trip Available",
      body: "No traveler trip is available yet for pass viewing.",
      accent: "#64748b",
    };
  }

  if (trip?.pass && passUsageWarnings.length === 0) {
    return {
      title: "Pass Ready",
      body: "Your pass is on file and ready for operational use.",
      accent: "#16a34a",
    };
  }

  if (trip?.pass && passUsageWarnings.length > 0) {
    return {
      title: "Pass On Record",
      body: passUsageWarnings[0],
      accent: "#b45309",
    };
  }

  return {
    title: "Pass Pending",
    body: "Your traveler pass is not yet available. Check the status summary below for the next requirement.",
    accent: "#b45309",
  };
}

function StatusChip(props: { label: string; value: any }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "10px 12px",
        background: "#ffffff",
      }}
    >
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{props.label}</div>
      <div style={{ fontSize: 16, fontWeight: 700 }}>{props.value ?? "—"}</div>
    </div>
  );
}

export default async function TravelerPassPage() {
  const { trip, error } = await getPassView();
  const gateReasons = trip ? buildPassGateReasons(trip) : [];
  const passUsageWarnings = trip ? buildPassUsageWarnings(trip) : [];
  const readiness = getPassReadinessSummary(trip, passUsageWarnings);

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>OSP Pass</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Traveler-facing pass view with issuance gating based on current trip status.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <a href="/">Home</a>
        <a href="/traveler/trips">My Trips</a>
        <a href="/traveler/passport-map">Passport Map</a>
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
          <Section title="Pass Readiness">
            <div
              style={{
                borderLeft: `6px solid ${readiness.accent}`,
                padding: 16,
                borderRadius: 12,
                background: "#f8fafc",
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.05 }}>{readiness.title}</div>
              <p style={{ marginTop: 8, marginBottom: 0, fontSize: 16 }}>{readiness.body}</p>
            </div>
          </Section>

          <Section title="QR Credential">
            {trip.pass?.qrCredential?.qrToken ? (
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: 12,
                    borderRadius: 12,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    opacity: passUsageWarnings.length > 0 ? 0.35 : 1,
                  }}
                >
                  <QRCodeSVG
                    value={trip.pass.qrCredential.qrToken}
                    size={220}
                    includeMargin={true}
                  />
                </div>
                {passUsageWarnings.length > 0 ? (
                  <p style={{ marginTop: 12, marginBottom: 0, color: "#b45309", fontWeight: 600 }}>
                    QR is on record but not ready for operational use yet.
                  </p>
                ) : null}
              </div>
            ) : (
              <p style={{ marginTop: 0 }}>QR token is not available for this pass yet.</p>
            )}
          </Section>

          {passUsageWarnings.length > 0 ? (
            <Section title="Action Required">
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
                {passUsageWarnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </Section>
          ) : null}

          {!trip.pass && gateReasons.length > 0 ? (
            <Section title="Pass Blocked">
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
                {gateReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </Section>
          ) : null}


          <Section title="Siargao Passport Map">
            <div
              style={{
                border: "1px solid #bae6fd",
                borderRadius: 18,
                padding: 18,
                background: "linear-gradient(135deg, #ecfeff 0%, #f8fafc 100%)",
                display: "grid",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: "0.08em", color: "#0e7490", textTransform: "uppercase" }}>
                  Second Screen
                </div>
                <h2 style={{ margin: "6px 0 0", fontSize: 28, lineHeight: 1.05 }}>
                  Continue to your Passport Map
                </h2>
                <p style={{ margin: "8px 0 0", color: "#475569", lineHeight: 1.5 }}>
                  Your SPM trail progress uses governed OSP QR, stamp, pass, and trip records when available. Preview layout cards may appear only to preserve the approved map geometry.
                </p>
              </div>

              <a
                href="/traveler/passport-map"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "fit-content",
                  minHeight: 44,
                  borderRadius: 999,
                  padding: "0 18px",
                  background: "#0e7490",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 900,
                  boxShadow: "0 10px 20px rgba(14,116,144,0.18)",
                }}
              >
                Open Siargao Passport Map
              </a>
            </div>
          </Section>

          <Section title="Key Status Summary">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              <StatusChip label="Registration" value={trip.registrationStatus} />
              <StatusChip label="Manifest" value={trip.manifestReadiness?.isManifestListed ? "LISTED" : "NOT LISTED"} />
              <StatusChip label="Clearance" value={trip.clearanceStatus} />
              <StatusChip label="Payment" value={trip.currentPaymentState?.state} />
              <StatusChip label="Pass" value={trip.pass?.passStatus ?? "NOT ISSUED"} />
            </div>
          </Section>
          <Section title="Trip Details">
            <KeyValue label="Origin" value={trip.originLocation} />
            <KeyValue label="Accommodation" value={trip.declaredAccommodationName} />
            <KeyValue label="Arrival Date" value={trip.arrivalDate} />
            <KeyValue label="Departure Date" value={trip.departureDate} />
          </Section>

          <Section title="Booking & Payment Details">
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
