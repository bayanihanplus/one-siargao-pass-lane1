import Link from "next/link";

export const dynamic = "force-dynamic";

type LguDcsTrip = {
  tripNumber: string;
  routeProductCode: string;
  routeName: string;
  routeShortName?: string;
  portCode: string;
  departureDate: string;
  departureTimeLocal: string;
  departureTimeHHmm: string;
  pricingMode: string;
  bookabilityStatus: string;
  dcsState: string;
  paymentStatus: string;
  voucherStatus: string;
  assignmentStatus: string;
  boardingQrStatus: string;
  manifestStatus: string;
  bookedPaxCount: number;
  boardedPaxCount: number;
  sensitiveDataHidden: boolean;
};

type LguDcsPreviewResponse = {
  ok: boolean;
  portCode?: string;
  departureDate?: string;
  totalTrips?: number;
  displayMode?: string;
  dataSource?: string;
  trips?: LguDcsTrip[];
  error?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:8001/api/v1";

async function getGeneralLunaPortBoard(): Promise<LguDcsPreviewResponse> {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const res = await fetch(
      `${API_BASE}/osp-dcs/general-luna/scheduled-trips/preview?departureDate=${today}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      return {
        ok: false,
        error: `Departure board endpoint failed: HTTP ${res.status}`,
      };
    }

    return res.json();
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || "Departure board endpoint unavailable",
    };
  }
}

const colors = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  mist: "#EAFBFA",
  slate: "#50668B",
  white: "#FFFFFF",
  border: "rgba(1,56,99,0.12)",
};

const shellStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 0% 0%, rgba(5,150,165,0.12), transparent 32%), linear-gradient(180deg, #EAFBFA 0%, #F7FCFC 45%, #FFFFFF 100%)",
  padding: "18px",
  boxSizing: "border-box",
};

const frameStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 1260,
  margin: "0 auto",
};

const cardStyle: React.CSSProperties = {
  borderRadius: 24,
  background: colors.white,
  border: `1px solid ${colors.border}`,
  boxShadow: "0 20px 50px rgba(1,56,99,0.08)",
};

function groupByRoute(trips: LguDcsTrip[]) {
  return trips.reduce<Record<string, LguDcsTrip[]>>((acc, trip) => {
    const key = trip.routeShortName || trip.routeName;
    acc[key] = acc[key] || [];
    acc[key].push(trip);
    return acc;
  }, {});
}

function statusTone(status: string) {
  if (status.includes("OPEN") || status.includes("ISSUED") || status.includes("READY")) return colors.teal;
  if (status.includes("DELAY") || status.includes("EXCEPTION")) return colors.gold;
  if (status.includes("CANCEL")) return "#B42318";
  return colors.slate;
}

export default async function LguGeneralLunaDepartureControlPage() {
  const data = await getGeneralLunaPortBoard();
  const trips = data.trips || [];
  const groupedTrips = groupByRoute(trips);

  return (
    <main style={shellStyle}>
      <div style={frameStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href="/lgu?panel=departure-control"
              style={{
                minHeight: 42,
                borderRadius: 14,
                padding: "0 14px",
                display: "inline-flex",
                alignItems: "center",
                background: colors.white,
                border: `1px solid ${colors.border}`,
                color: colors.navy,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              ← LGU Departure Control
            </Link>

            <Link
              href="/lgu/departure-control/general-luna/board"
              style={{
                minHeight: 42,
                borderRadius: 14,
                padding: "0 14px",
                display: "inline-flex",
                alignItems: "center",
                background: colors.navy,
                border: "1px solid rgba(1,56,99,0.18)",
                color: colors.white,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 900,
              }}
            >
              Open Big Screen Board →
            </Link>
          </div>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 30,
              borderRadius: 999,
              padding: "0 11px",
              background: "#FFF8EA",
              border: "1px solid rgba(243,174,38,0.35)",
              color: "#8A5A00",
              fontSize: 12,
              fontWeight: 900,
            }}
          >
            Schedule preview · Operations view
          </span>
        </div>

        <section
          style={{
            borderRadius: 32,
            background: "linear-gradient(135deg, #013863 0%, #003B66 58%, #0596A5 128%)",
            color: colors.white,
            padding: 24,
            boxShadow: "0 28px 70px rgba(1,56,99,0.23)",
          }}
        >
          <p style={{ margin: 0, color: colors.gold, fontSize: 12, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            LGU Departure Control
          </p>

          <h1
            style={{
              margin: "10px 0 0",
              maxWidth: 900,
              color: colors.white,
              fontSize: 46,
              lineHeight: 0.94,
              letterSpacing: "-0.065em",
              fontWeight: 880,
              textShadow: "0 18px 45px rgba(0,0,0,0.24)",
            }}
          >
            General Luna Port Departure Board
          </h1>

          <p style={{ margin: "12px 0 0", maxWidth: 820, color: "rgba(255,255,255,0.9)", fontSize: 15, lineHeight: 1.5, fontWeight: 760 }}>
            Official LGU operations view for scheduled General Luna island-hopping departures. This presentation board shows the port flow before live booking, boarding scan, manifest, delay, cancellation, reassignment, and exception events are connected.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, marginTop: 18 }}>
            <Metric label="Port" value="General Luna" />
            <Metric label="Scheduled rows" value={String(data.totalTrips ?? trips.length)} />
            <Metric label="Date" value={data.departureDate || "—"} />
            <Metric label="Access" value="GL scoped" />
          </div>
        </section>

        <section
          style={{
            marginTop: 14,
            borderRadius: 22,
            background: "#FFF8EA",
            border: "1px solid rgba(243,174,38,0.34)",
            padding: 14,
          }}
        >
          <p style={{ margin: 0, color: "#8A5A00", fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            General Luna authorized surface
          </p>
          <p style={{ margin: "6px 0 0", color: colors.navy, fontSize: 13, lineHeight: 1.45, fontWeight: 780 }}>
            This board is scoped to General Luna Port. Dapa and Del Carmen require separate LGU/DOT port authority and must not be accessible from this port module.
          </p>
        </section>

        <section
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <ApprovalTile
            label="Board purpose"
            title="Flow approval"
            body="Validates the LGU-facing board before real booking, assignment, QR, and manifest events are attached."
          />
          <ApprovalTile
            label="Access boundary"
            title="General Luna only"
            body="This screen must not unlock Dapa or Del Carmen operations for a General Luna-scoped account."
          />
          <ApprovalTile
            label="Data boundary"
            title="No commercial internals"
            body="Payouts, platform margin, OTA ownership, and Super Admin controls remain hidden."
          />
        </section>

        {!data.ok ? (
          <section style={{ ...cardStyle, marginTop: 14, padding: 18 }}>
            <p style={{ margin: 0, color: "#B42318", fontSize: 13, fontWeight: 900 }}>Departure board unavailable</p>
            <h2 style={{ margin: "8px 0 0", color: colors.navy, fontSize: 24, letterSpacing: "-0.04em" }}>
              General Luna DCS preview endpoint did not return a valid response.
            </h2>
            <p style={{ margin: "8px 0 0", color: colors.slate, fontSize: 14, lineHeight: 1.45, fontWeight: 700 }}>
              {data.error || "Check backend server and the General Luna DCS preview endpoint."}
            </p>
          </section>
        ) : (
          <>
            <section style={{ ...cardStyle, marginTop: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                <div>
                  <p style={{ margin: 0, color: colors.teal, fontSize: 11, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Port board status
                  </p>
                  <h2 style={{ margin: "7px 0 0", color: colors.navy, fontSize: 26, lineHeight: 1, letterSpacing: "-0.045em" }}>
                    Scheduled departures for LGU flow approval
                  </h2>
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    minHeight: 30,
                    borderRadius: 999,
                    padding: "0 10px",
                    background: "#F4FCFA",
                    border: "1px solid rgba(5,150,165,0.20)",
                    color: colors.navy,
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  Sensitive data hidden
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, marginTop: 14 }}>
                <Lane title="BOARDING NOW" value="0" note="Will activate after boarding scan window is connected" />
                <Lane title="BOARDING SOON" value="0" note="Will activate after assignment and boarding QR issuance" />
                <Lane title="SCHEDULED" value={String(trips.length)} note="Generated from the DCS schedule registry" />
                <Lane title="EXCEPTIONS" value="0" note="Will activate after delay, cancellation, or compliance event" />
              </div>
            </section>

            {Object.entries(groupedTrips).map(([routeName, rows]) => (
              <section key={routeName} style={{ ...cardStyle, marginTop: 14, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <p style={{ margin: 0, color: colors.teal, fontSize: 11, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
                      Route
                    </p>
                    <h3 style={{ margin: "6px 0 0", color: colors.navy, fontSize: 22, lineHeight: 1.05, letterSpacing: "-0.04em" }}>
                      {routeName}
                    </h3>
                  </div>
                  <span
                    style={{
                      borderRadius: 999,
                      padding: "8px 11px",
                      background: "#F4FCFA",
                      color: colors.navy,
                      border: "1px solid rgba(5,150,165,0.18)",
                      fontSize: 12,
                      fontWeight: 900,
                    }}
                  >
                    {rows.length} scheduled rows
                  </span>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  {rows.map((trip) => (
                    <div
                      key={trip.tripNumber}
                      style={{
                        borderRadius: 18,
                        border: `1px solid ${colors.border}`,
                        background: "linear-gradient(180deg, #F9FEFE 0%, #FFFFFF 100%)",
                        boxShadow: "0 12px 28px rgba(1,56,99,0.045)",
                        padding: 13,
                        display: "grid",
                        gridTemplateColumns: "1.25fr 0.7fr 0.7fr 0.8fr 0.8fr",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, color: colors.navy, fontSize: 13, fontWeight: 950 }}>{trip.tripNumber}</p>
                        <p style={{ margin: "4px 0 0", color: colors.slate, fontSize: 12, fontWeight: 760 }}>
                          {trip.routeProductCode}
                        </p>
                      </div>

                      <BoardCell label="Time" value={trip.departureTimeLocal} />
                      <BoardCell label="Booked" value={String(trip.bookedPaxCount)} />
                      <BoardCell label="Boarded" value={`${trip.boardedPaxCount}/${trip.bookedPaxCount}`} />
                      <BoardCell label="Manifest" value={trip.manifestStatus} tone={statusTone(trip.manifestStatus)} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </main>
  );
}

function ApprovalTile({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div
      style={{
        borderRadius: 22,
        background: colors.white,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 18px 42px rgba(1,56,99,0.07)",
        padding: 15,
      }}
    >
      <p style={{ margin: 0, color: colors.teal, fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </p>
      <strong style={{ display: "block", marginTop: 7, color: colors.navy, fontSize: 18, lineHeight: 1.08, letterSpacing: "-0.03em" }}>
        {title}
      </strong>
      <p style={{ margin: "8px 0 0", color: colors.slate, fontSize: 12, lineHeight: 1.42, fontWeight: 720 }}>
        {body}
      </p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ borderRadius: 18, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", padding: 12 }}>
      <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: 11, fontWeight: 850 }}>{label}</p>
      <strong style={{ display: "block", marginTop: 4, color: colors.white, fontSize: 14, lineHeight: 1.1 }}>{value}</strong>
    </div>
  );
}

function Lane({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div style={{ borderRadius: 20, background: "#F4FCFA", border: "1px solid rgba(5,150,165,0.16)", padding: 13 }}>
      <p style={{ margin: 0, color: colors.teal, fontSize: 10, fontWeight: 950, letterSpacing: "0.12em" }}>{title}</p>
      <strong style={{ display: "block", marginTop: 6, color: colors.navy, fontSize: 28, letterSpacing: "-0.05em" }}>{value}</strong>
      <p style={{ margin: "4px 0 0", color: colors.slate, fontSize: 12, lineHeight: 1.35, fontWeight: 750 }}>{note}</p>
    </div>
  );
}

function BoardCell({ label, value, tone = colors.navy }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <p style={{ margin: 0, color: colors.slate, fontSize: 10, fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
      <strong style={{ display: "block", marginTop: 4, color: tone, fontSize: 12, lineHeight: 1.2 }}>{value}</strong>
    </div>
  );
}
