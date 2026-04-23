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

function MetaItem(props: { label: string; value: any }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 10,
        minWidth: 180,
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>{props.label}</div>
      <div style={{ fontWeight: 600 }}>{props.value ?? "—"}</div>
    </div>
  );
}

export default async function TravelerTripsPage() {
  const { rows, error } = await getTrips();
  const preferredTrip = getPreferredTravelerTrip(rows);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Traveler Trips</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Authenticated traveler view of registered trips and trip detail access.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <a href="/">Home</a>
        <a href="/traveler/pass">Traveler Pass</a>
        <a href="/logout">Logout</a>
      </div>

      {error ? (
        <Section title="Trip Load Error">
          <div>{error}</div>
        </Section>
      ) : null}

      <Section title="Trip Summary">
        <div style={{ marginBottom: 8 }}><strong>Visible Trips:</strong> {rows.length}</div>
        <div>
          <strong>Preferred Traveler Trip:</strong>{" "}
          {preferredTrip ? (preferredTrip.tripTitle || preferredTrip.id) : "—"}
        </div>
      </Section>

      <Section title="My Trips">
        {rows.length === 0 ? (
          <div>No trips found.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {rows.map((trip: any) => {
              const isPreferredTrip = preferredTrip?.id === trip.id;

              return (
              <article
                key={trip.id}
                style={{
                  border: isPreferredTrip ? "2px solid #17b6c6" : "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 16,
                  background: isPreferredTrip ? "#f7fdff" : "#ffffff",
                }}
              >
                <div style={{ marginBottom: 12 }}>
                  <strong>{trip.tripTitle || `Trip ${trip.id}`}</strong>
                  {isPreferredTrip ? (
                    <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: "#0f8ea0" }}>
                      Current traveler trip selection
                    </div>
                  ) : null}
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                  <MetaItem label="Arrival" value={trip.arrivalDate} />
                  <MetaItem label="Departure" value={trip.departureDate} />
                  <MetaItem label="Status" value={trip.tripStatus} />
                  <MetaItem label="Clearance" value={trip.clearanceStatus} />
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a href={`/traveler/trips/${trip.id}`}>Open Trip Detail</a>
                  {trip.pass ? <a href="/traveler/pass">Open Pass View</a> : null}
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
