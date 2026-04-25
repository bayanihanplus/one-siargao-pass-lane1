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
        border: "1px solid #dbe8ef",
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        background: "#ffffff",
        boxShadow: "0 12px 30px rgba(15,23,42,0.045)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 14,
          fontSize: 18,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: "#19305a",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function KeyValue(props: { label: string; value: any }) {
  const { label, value } = props;

  return (
    <div
      style={{
        marginBottom: 10,
        paddingBottom: 10,
        borderBottom: "1px solid #eef3f7",
        fontSize: 14,
        lineHeight: 1.35,
        color: "#334155",
        wordBreak: "break-word",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#7a93ad",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontWeight: 750, color: "#0f172a" }}>{value ?? "—"}</div>
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
        border: "1px solid #dbe8ef",
        borderRadius: 16,
        padding: "12px 13px",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fbfd 100%)",
        boxShadow: "0 8px 20px rgba(15,23,42,0.035)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#7a93ad",
          marginBottom: 5,
        }}
      >
        {props.label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 900, color: "#19305a" }}>{props.value ?? "—"}</div>
    </div>
  );
}

function PassNavIcon(props: { kind: "HOME" | "TRIPS" | "MAP" | "LOGOUT" }) {
  if (props.kind === "HOME") {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
        <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.8Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      </svg>
    );
  }

  if (props.kind === "TRIPS") {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
        <path d="M6 5.5h8.5a3.5 3.5 0 0 1 0 7H9.5a3.5 3.5 0 0 0 0 7H18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <circle cx="6" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="18" cy="19.5" r="2" stroke="currentColor" strokeWidth="1.9" />
      </svg>
    );
  }

  if (props.kind === "MAP") {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
        <path d="M3 6.8l6-2.3 6 2.3 6-2.3v12.7l-6 2.3-6-2.3-6 2.3V6.8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 4.5v12.7M15 6.8v12.7" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="11.2" r="1.4" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M10 7V5.5A2.5 2.5 0 0 1 12.5 3H18v18h-5.5A2.5 2.5 0 0 1 10 18.5V17" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12h10M11 9l3 3-3 3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function TravelerPassPage() {
  const { trip, error } = await getPassView();
  const gateReasons = trip ? buildPassGateReasons(trip) : [];
  const passUsageWarnings = trip ? buildPassUsageWarnings(trip) : [];
  const readiness = getPassReadinessSummary(trip, passUsageWarnings);

  return (
    <main
      style={{
        maxWidth: 430,
        margin: "0 auto",
        padding: "18px 14px 22px",
        background: "linear-gradient(180deg, #f8fcff 0%, #ffffff 58%)",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: 18,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 950,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#0e7490",
              marginBottom: 8,
            }}
          >
            Official Traveler Pass
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 34,
              lineHeight: 0.98,
              letterSpacing: "-0.055em",
              color: "#19305a",
            }}
          >
            OSP Pass
          </h1>
          <p style={{ marginTop: 9, marginBottom: 0, color: "#64748b", lineHeight: 1.4, fontSize: 14 }}>
            View your issued pass, QR credential, trip status, and Passport Map bridge.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        {[
          { href: "/", label: "Home", icon: <PassNavIcon kind="HOME" /> },
          { href: "/traveler/trips", label: "My Trips", icon: <PassNavIcon kind="TRIPS" /> },
          { href: "/traveler/passport-map", label: "Passport Map", icon: <PassNavIcon kind="MAP" /> },
          { href: "/logout", label: "Logout", icon: <PassNavIcon kind="LOGOUT" /> },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              minHeight: 36,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              borderRadius: 999,
              padding: "0 12px",
              border: "1px solid #dbe8ef",
              background: "#ffffff",
              color: "#19305a",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 850,
              boxShadow: "0 8px 18px rgba(15,23,42,0.035)",
            }}
          >
            {item.icon}
            {item.label}
          </a>
        ))}
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
                padding: 15,
                borderRadius: 16,
                background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "#ffffff",
                    border: "1px solid #dbe8ef",
                    color: readiness.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "0 0 auto",
                  }}
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                    <path d="M12 3.5 18.5 6v5.2c0 4.2-2.7 7.5-6.5 9.3-3.8-1.8-6.5-5.1-6.5-9.3V6L12 3.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
                    <path d="M8.8 12.1 11 14.2l4.4-4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 950, lineHeight: 1.02, color: "#19305a", letterSpacing: "-0.04em" }}>{readiness.title}</div>
                  <p style={{ marginTop: 7, marginBottom: 0, fontSize: 14, lineHeight: 1.4, color: "#475569", fontWeight: 650 }}>{readiness.body}</p>
                </div>
              </div>
            </div>
          </Section>

          <Section title="QR Credential">
            {trip.pass?.qrCredential?.qrToken ? (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, color: "#0e7490", fontWeight: 900 }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                    <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.9" />
                    <rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.9" />
                    <rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.9" />
                    <path d="M14 14h2.5v2.5H19V20h-5v-6Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
                  </svg>
                  Active Pass QR Credential
                </div>
                <div
                  style={{
                    display: "inline-block",
                    padding: 12,
                    borderRadius: 20,
                    background: "#ffffff",
                    border: "1px solid #dbe8ef",
                    boxShadow: "0 14px 32px rgba(15,23,42,0.07)",
                    opacity: passUsageWarnings.length > 0 ? 0.35 : 1,
                  }}
                >
                  <QRCodeSVG
                    value={trip.pass.qrCredential.qrToken}
                    size={190}
                    includeMargin={true}
                    level="H"
                    bgColor="#FFFFFF"
                    fgColor="#111827"
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
                border: "1px solid #b8e7ef",
                borderRadius: 22,
                padding: 16,
                background: "linear-gradient(135deg, #ecfeff 0%, #ffffff 100%)",
                boxShadow: "0 14px 32px rgba(14,116,144,0.08)",
                display: "grid",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: "0.08em", color: "#0e7490", textTransform: "uppercase" }}>
                  Second Screen
                </div>
                <h2 style={{ margin: "6px 0 0", fontSize: 24, lineHeight: 1.05 }}>
                  Continue to your Passport Map
                </h2>
                <p style={{ margin: "8px 0 0", color: "#475569", lineHeight: 1.45, fontSize: 14 }}>
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
                  minHeight: 42,
                  borderRadius: 999,
                  padding: "0 16px",
                  background: "#0e7490",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 900,
                  boxShadow: "0 10px 20px rgba(14,116,144,0.18)",
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true" style={{ marginRight: 8 }}>
                  <path d="M3 6.8l6-2.3 6 2.3 6-2.3v12.7l-6 2.3-6-2.3-6 2.3V6.8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M9 4.5v12.7M15 6.8v12.7" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="11.2" r="1.4" fill="currentColor" />
                </svg>
                Open Siargao Passport Map
              </a>
            </div>
          </Section>

          <Section title="Key Status Summary">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
