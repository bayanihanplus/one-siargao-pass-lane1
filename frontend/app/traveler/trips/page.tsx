import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";
import { getPreferredTravelerTrip } from "../../../src/lib/travelerTripSelection";

async function getTrips() {
  const baseUrl = getApiBaseUrl();

  try {
    const token = await requireAccessToken();

    const res = await fetch(`${baseUrl}/trips`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return { rows: [], error: `Failed to load trips: HTTP ${res.status}` };
    }

    const rows = await res.json();
    return { rows: Array.isArray(rows) ? rows : [], error: null };
  } catch (error: any) {
    return {
      rows: [],
      error: error?.message || "Unknown trip list load failure",
    };
  }
}

function formatDate(value: any) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

function normalizeStatus(value: any) {
  if (!value) return "—";
  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusTheme(value: any) {
  const normalized = String(value || "").toUpperCase();

  if (normalized.includes("APPROVED") || normalized.includes("ACTIVE") || normalized.includes("PAID") || normalized.includes("CONFIRMED")) {
    return {
      bg: "#eefdf3",
      border: "#cdeed7",
      color: "#16a34a",
    };
  }

  if (normalized.includes("PENDING") || normalized.includes("UNPAID") || normalized.includes("WAITING")) {
    return {
      bg: "#fff8eb",
      border: "#f6e1b5",
      color: "#d97706",
    };
  }

  if (normalized.includes("DENIED") || normalized.includes("FAILED") || normalized.includes("CANCELLED") || normalized.includes("BLOCKED")) {
    return {
      bg: "#fef2f2",
      border: "#fecaca",
      color: "#dc2626",
    };
  }

  return {
    bg: "#eff6ff",
    border: "#cfe0f7",
    color: "#2563eb",
  };
}

function TripIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M6 5.5h8.5a3.5 3.5 0 0 1 0 7H9.5a3.5 3.5 0 0 0 0 7H18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="6" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="18" cy="19.5" r="2" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

function PassIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M12 3.5 18.5 6v5.2c0 4.2-2.7 7.5-6.5 9.3-3.8-1.8-6.5-5.1-6.5-9.3V6L12 3.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M8.8 12.1 11 14.2l4.4-4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Section(props: { title: string; children: any }) {
  return (
    <section
      style={{
        border: "1px solid #dbe8ef",
        borderRadius: 22,
        padding: 15,
        marginBottom: 13,
        background: "#ffffff",
        boxShadow: "0 12px 30px rgba(15,23,42,0.045)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 12,
          fontSize: 18,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: "#19305a",
        }}
      >
        {props.title}
      </h2>
      {props.children}
    </section>
  );
}

function MetaItem(props: { label: string; value: any; tone?: any; icon?: any }) {
  const theme = props.tone || {
    bg: "#f8fbfd",
    border: "#dbe8ef",
    color: "#19305a",
  };

  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 14,
        padding: "8px 9px",
        background: theme.bg,
        minHeight: 58,
      }}
    >
      {props.icon ? (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 9,
            background: "#ffffff",
            border: `1px solid ${theme.border}`,
            color: theme.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 7,
          }}
        >
          {props.icon}
        </div>
      ) : null}
      <div
        style={{
          fontSize: 8.5,
          fontWeight: 950,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#60759a",
          marginBottom: 5,
          lineHeight: 1.1,
        }}
      >
        {props.label}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 950,
          lineHeight: 1.15,
          color: theme.color,
          wordBreak: "break-word",
        }}
      >
        {props.value ?? "—"}
      </div>
    </div>
  );
}

function PillLink(props: { href: string; label: string; primary?: boolean; icon?: any }) {
  return (
    <a
      href={props.href}
      style={{
        minHeight: 38,
        borderRadius: 999,
        padding: "0 14px",
        background: props.primary ? "#16bfd3" : "#ffffff",
        border: props.primary ? "1px solid #16bfd3" : "1px solid #dbe8ef",
        color: props.primary ? "#ffffff" : "#19305a",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        fontSize: 12,
        fontWeight: 950,
        boxShadow: props.primary ? "0 10px 20px rgba(22,191,211,0.22)" : "0 8px 18px rgba(15,23,42,0.035)",
        whiteSpace: "nowrap",
      }}
    >
      {props.icon}
      {props.label}
    </a>
  );
}

function TripsNavIcon(props: { kind: "HOME" | "PASS" | "LOGOUT" | "VIEW" }) {
  if (props.kind === "HOME") {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
        <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.8Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      </svg>
    );
  }

  if (props.kind === "PASS") {
    return <PassIcon />;
  }

  if (props.kind === "VIEW") {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
        <path d="M5 12s2.4-5 7-5 7 5 7 5-2.4 5-7 5-7-5-7-5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.9" />
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

function SummaryIcon(props: { kind: "VISIBLE" | "ACTIVE" | "PASSES" }) {
  if (props.kind === "ACTIVE") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M6 5.5h8.5a3.5 3.5 0 0 1 0 7H9.5a3.5 3.5 0 0 0 0 7H18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <circle cx="6" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="18" cy="19.5" r="2" stroke="currentColor" strokeWidth="1.9" />
      </svg>
    );
  }

  if (props.kind === "PASSES") {
    return <PassIcon />;
  }

  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <rect x="5" y="4" width="14" height="16" rx="3" stroke="currentColor" strokeWidth="1.9" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export default async function TravelerTripsPage() {
  const { rows, error } = await getTrips();
  const preferredTrip = getPreferredTravelerTrip(rows);
  const activeTrips = rows.filter((trip: any) => String(trip.tripStatus || "").toUpperCase().includes("ACTIVE")).length;
  const passReadyTrips = rows.filter((trip: any) => Boolean(trip.pass)).length;

  return (
    <main
      style={{
        maxWidth: 430,
        margin: "0 auto",
        padding: "18px 14px 22px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fcff 0%, #ffffff 58%)",
        color: "#19305a",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 34,
            borderRadius: 999,
            border: "1px solid #dbe8ef",
            padding: "0 12px",
            background: "#ffffff",
            color: "#19305a",
            textDecoration: "none",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          ← Back to Home
        </a>
      </div>

      <header style={{ marginBottom: 16 }}>
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
          Traveler Records
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
          My Trips
        </h1>
        <p style={{ marginTop: 9, marginBottom: 0, color: "#64748b", lineHeight: 1.4, fontSize: 14 }}>
          Review your registered trips, clearance state, and pass access.
        </p>
      </header>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <PillLink href="/" label="Home" icon={<TripsNavIcon kind="HOME" />} />
        <PillLink href="/traveler/pass" label="Traveler Pass" icon={<TripsNavIcon kind="PASS" />} />
        <PillLink href="/logout" label="Logout" icon={<TripsNavIcon kind="LOGOUT" />} />
      </div>

      {error ? (
        <Section title="Trip Load Error">
          <div style={{ color: "#dc2626", fontSize: 14, fontWeight: 800 }}>{error}</div>
        </Section>
      ) : null}

      <Section title="Trip Summary">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 7,
          }}
        >
          <MetaItem label="Visible" value={rows.length} icon={<SummaryIcon kind="VISIBLE" />} tone={{ bg: "#eff6ff", border: "#cfe0f7", color: "#2563eb" }} />
          <MetaItem label="Active" value={activeTrips} icon={<SummaryIcon kind="ACTIVE" />} tone={{ bg: "#ecfeff", border: "#bfeaf0", color: "#0ea5b7" }} />
          <MetaItem label="Passes" value={passReadyTrips} icon={<SummaryIcon kind="PASSES" />} tone={{ bg: "#eefdf3", border: "#cdeed7", color: "#16a34a" }} />
        </div>

        <div
          style={{
            marginTop: 12,
            borderRadius: 18,
            border: "1px solid #bfeaf0",
            background: "#ecfeff",
            padding: 12,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 950, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0e7490" }}>
            Preferred Traveler Trip
          </div>
          <div style={{ marginTop: 5, fontSize: 15, fontWeight: 950, color: "#19305a", lineHeight: 1.2 }}>
            {preferredTrip ? preferredTrip.tripTitle || "Current selected trip" : "—"}
          </div>
        </div>
      </Section>

      <Section title="My Trips">
        {rows.length === 0 ? (
          <div
            style={{
              borderRadius: 18,
              border: "1px solid #dbe8ef",
              background: "#f8fbfd",
              padding: 16,
              color: "#64748b",
              fontSize: 14,
              lineHeight: 1.45,
              fontWeight: 650,
            }}
          >
            No trips found yet. Once you register or link a trip, it will appear here.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {rows.map((trip: any) => {
              const isPreferredTrip = preferredTrip?.id === trip.id;
              const clearanceTheme = statusTheme(trip.clearanceStatus);
              const tripTheme = statusTheme(trip.tripStatus);

              return (
                <article
                  key={trip.id}
                  style={{
                    border: isPreferredTrip ? "1.5px solid #16bfd3" : "1px solid #dbe8ef",
                    borderRadius: 22,
                    padding: 13,
                    background: isPreferredTrip ? "linear-gradient(180deg, #ecfeff 0%, #ffffff 100%)" : "#ffffff",
                    boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 15,
                        background: isPreferredTrip ? "#d6f6f8" : "#eff6ff",
                        border: isPreferredTrip ? "1px solid #bfeaf0" : "1px solid #cfe0f7",
                        color: isPreferredTrip ? "#0ea5b7" : "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: "0 0 auto",
                      }}
                    >
                      <TripIcon />
                    </div>

                    <div style={{ minWidth: 0, flex: "1 1 auto" }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 18,
                          lineHeight: 1.08,
                          letterSpacing: "-0.035em",
                          color: "#19305a",
                        }}
                      >
                        {trip.tripTitle || "Traveler Trip"}
                      </h3>
                      <div style={{ marginTop: 6, color: "#64748b", fontSize: 12, fontWeight: 800 }}>
                        {formatDate(trip.arrivalDate)} – {formatDate(trip.departureDate)}
                      </div>
                      {isPreferredTrip ? (
                        <div style={{ marginTop: 7, fontSize: 11, fontWeight: 950, color: "#0e7490" }}>
                          Current traveler trip
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <MetaItem label="Trip Status" value={normalizeStatus(trip.tripStatus)} tone={tripTheme} />
                    <MetaItem label="Clearance" value={normalizeStatus(trip.clearanceStatus)} tone={clearanceTheme} />
                    <MetaItem label="Arrival" value={formatDate(trip.arrivalDate)} />
                    <MetaItem label="Departure" value={formatDate(trip.departureDate)} />
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <PillLink href={`/traveler/trips/${trip.id}`} label="View Trip" primary icon={<TripsNavIcon kind="VIEW" />} />
                    {trip.pass ? <PillLink href="/traveler/pass" label="Open Pass" icon={<PassIcon />} /> : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Section>
    </main>
  );
}
