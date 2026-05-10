import Link from "next/link";
import LivePortClock from "./LivePortClock";

export const dynamic = "force-dynamic";

type DcsTrip = {
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

type DcsPreviewResponse = {
  ok: boolean;
  portCode?: string;
  departureDate?: string;
  totalTrips?: number;
  displayMode?: string;
  dataSource?: string;
  trips?: DcsTrip[];
  error?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:8001/api/v1";

const colors = {
  deep: "#00182A",
  navy: "#013863",
  navy2: "#003B66",
  teal: "#0596A5",
  teal2: "#00B7C7",
  gold: "#F3AE26",
  white: "#FFFFFF",
  mist: "#DFF8F8",
  slate: "#B8C9DA",
  muted: "#86A1BA",
};

async function getBoardData(): Promise<DcsPreviewResponse> {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const res = await fetch(
      `${API_BASE}/osp-dcs/general-luna/scheduled-trips/preview?departureDate=${today}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      return {
        ok: false,
        error: `DCS board endpoint failed: HTTP ${res.status}`,
      };
    }

    return res.json();
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || "DCS board endpoint unavailable",
    };
  }
}

function groupByRoute(trips: DcsTrip[]) {
  return trips.reduce<Record<string, DcsTrip[]>>((acc, trip) => {
    const key = trip.routeShortName || trip.routeName;
    acc[key] = acc[key] || [];
    acc[key].push(trip);
    return acc;
  }, {});
}

function nextRows(trips: DcsTrip[]) {
  return trips.slice(0, 6);
}

function getDemoStatus(index: number) {
  if (index === 0) return "BOARDING_NOW";
  if (index === 1 || index === 2) return "BOARDING_SOON";
  if (index === 5) return "DELAY_WATCH";
  return "SCHEDULED";
}

function getDemoBookedCount(index: number) {
  if (index === 0) return 18;
  if (index === 1) return 12;
  if (index === 2) return 8;
  if (index === 5) return 16;
  return 0;
}

function getDemoBoardedCount(index: number) {
  if (index === 0) return 11;
  if (index === 1 || index === 2) return 0;
  return 0;
}

function getDemoManifestStatus(index: number) {
  if (index === 0) return "OPEN";
  if (index === 1 || index === 2) return "READY";
  if (index === 5) return "DELAY_WATCH";
  return "NOT_OPEN";
}

function getDemoStatusLabel(status: string) {
  if (status === "BOARDING_NOW") return "BOARDING NOW";
  if (status === "BOARDING_SOON") return "BOARDING SOON";
  if (status === "DELAY_WATCH") return "DELAY WATCH";
  return "SCHEDULED";
}

function getDemoStatusColor(status: string) {
  if (status === "BOARDING_NOW") return colors.teal2;
  if (status === "BOARDING_SOON") return colors.gold;
  if (status === "DELAY_WATCH") return "#FFB86B";
  return colors.slate;
}

export default async function GeneralLunaBigScreenBoardPage() {
  const data = await getBoardData();
  const trips = data.trips || [];
  const grouped = groupByRoute(trips);
  const queueRows = nextRows(trips);

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
        background:
          "radial-gradient(circle at 14% -10%, rgba(5,150,165,0.18), transparent 30%), radial-gradient(circle at 92% 0%, rgba(243,174,38,0.10), transparent 24%), linear-gradient(135deg, #000000 0%, #02070C 42%, #00111F 100%)",
        color: colors.white,
        padding: "14px 16px 16px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1920, margin: "0 auto" }}>
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "1.35fr 0.65fr",
            gap: 14,
            alignItems: "stretch",
            marginBottom: 12,
          }}
        >
          <section
            style={{
              minHeight: 236,
              borderRadius: 34,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.045) 100%)",
              border: "1px solid rgba(255,255,255,0.20)",
              boxShadow: "0 40px 110px rgba(0,0,0,0.55)",
              padding: 20,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(5,150,165,0.15), transparent 54%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.10), transparent 28%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <Link
                  href="/lgu/departure-control/general-luna"
                  style={{
                    display: "inline-flex",
                    minHeight: 38,
                    alignItems: "center",
                    borderRadius: 999,
                    padding: "0 14px",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.20)",
                    color: colors.white,
                    textDecoration: "none",
                    fontSize: 12,
                    fontWeight: 950,
                  }}
                >
                  ← Port Board
                </Link>

                <span
                  style={{
                    display: "inline-flex",
                    minHeight: 38,
                    alignItems: "center",
                    borderRadius: 999,
                    padding: "0 14px",
                    background: "rgba(243,174,38,0.16)",
                    border: "1px solid rgba(243,174,38,0.42)",
                    color: colors.gold,
                    fontSize: 12,
                    fontWeight: 950,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                  }}
                >
                  Big Screen · LIVE DEMO
                </span>
              </div>

              <p
                style={{
                  margin: 0,
                  color: colors.gold,
                  fontSize: 13,
                  fontWeight: 950,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                LGU Departure Control System
              </p>

              <h1
                data-board-title="general-luna-scheduled-departures"
                style={{
                  margin: "9px 0 0",
                  color: "#FFFFFF",
                  WebkitTextFillColor: "#FFFFFF",
                  background: "transparent",
                  backgroundImage: "none",
                  backgroundClip: "border-box",
                  WebkitBackgroundClip: "border-box",
                  opacity: 1,
                  filter: "none",
                  mixBlendMode: "normal",
                  fontSize: 64,
                  lineHeight: 0.88,
                  letterSpacing: "-0.075em",
                  fontWeight: 920,
                  textShadow: "0 28px 90px rgba(0,0,0,0.72)",
                }}
              >
                General Luna Port
                <br />
                Scheduled Departures
              </h1>

              <p
                style={{
                  margin: "12px 0 0",
                  maxWidth: 980,
                  color: "rgba(255,255,255,0.90)",
                  fontSize: 14,
                  lineHeight: 1.38,
                  fontWeight: 760,
                  textShadow: "0 10px 26px rgba(0,0,0,0.30)",
                }}
              >
                Infrastructure-grade presentation board for LGU review. Demo live states are shown for stakeholder approval only;
                production boarding, manifest, delay, cancellation, reassignment, and exception events must be event-backed later.
              </p>
            </div>
          </section>

          <aside
            style={{
              display: "grid",
              gridTemplateRows: "auto 1fr",
              gap: 12,
            }}
          >
            <LivePortClock />

            <div
              style={{
                borderRadius: 28,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.055) 100%)",
                border: "1px solid rgba(255,255,255,0.20)",
                boxShadow: "0 32px 90px rgba(0,0,0,0.46)",
                padding: 16,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: colors.gold,
                  fontSize: 11,
                  fontWeight: 950,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                Live demo status
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 12 }}>
                <BoardStatus label="Scheduled rows" value={String(data.totalTrips ?? trips.length)} emphasis />
                <BoardStatus label="Port" value="General Luna" />
                <BoardStatus label="Date" value={data.departureDate || "—"} />
                <BoardStatus label="Visibility" value="LGU-safe" />
              </div>
            </div>
          </aside>
        </header>

        {!data.ok ? (
          <section
            style={{
              borderRadius: 34,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.20)",
              padding: 26,
            }}
          >
            <p style={{ margin: 0, color: colors.gold, fontSize: 12, fontWeight: 950, letterSpacing: "0.16em" }}>
              BOARD UNAVAILABLE
            </p>
            <h2 style={{ margin: "8px 0 0", color: colors.white, fontSize: 34, letterSpacing: "-0.055em" }}>
              General Luna scheduled departures could not be loaded.
            </h2>
            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.78)", fontSize: 16, fontWeight: 720 }}>
              {data.error || "Check backend DCS preview endpoint."}
            </p>
          </section>
        ) : (
          <>
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 14,
                marginBottom: 12,
              }}
            >
              <StatusTile label="BOARDING NOW" value="1" note="Demo: one trip in active boarding window" tone="teal" />
              <StatusTile label="BOARDING SOON" value="2" note="Demo: next departures preparing for boarding" tone="gold" />
              <StatusTile label="SCHEDULED" value={String(Math.max(trips.length - 4, 0))} note="Remaining scheduled registry rows" tone="white" />
              <StatusTile label="EXCEPTIONS" value="1" note="Demo: one delay watch advisory" tone="red" />
            </section>

            <section
              style={{
                display: "grid",
                gridTemplateColumns: "1.18fr 0.82fr",
                gap: 14,
                alignItems: "start",
              }}
            >
              <section
                style={{
                  borderRadius: 28,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.045) 100%)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  boxShadow: "0 38px 100px rgba(0,0,0,0.52)",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        color: colors.gold,
                        fontSize: 12,
                        fontWeight: 950,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                      }}
                    >
                      Next scheduled departures
                    </p>
                    <h2
                      style={{
                        margin: "7px 0 0",
                        color: "#FFFFFF",
                        fontSize: 44,
                        lineHeight: 0.94,
                        letterSpacing: "-0.065em",
                        fontWeight: 900,
                        textShadow: "0 20px 60px rgba(0,0,0,0.48)",
                      }}
                    >
                      Live Schedule Queue
                    </h2>
                  </div>

                  <span
                    style={{
                      borderRadius: 999,
                      padding: "10px 14px",
                      background: "rgba(5,150,165,0.24)",
                      color: colors.white,
                      border: "1px solid rgba(5,150,165,0.42)",
                      fontSize: 12,
                      fontWeight: 950,
                    }}
                  >
                    Sensitive data hidden
                  </span>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {queueRows.map((trip, index) => (
                    <QueueRow key={trip.tripNumber} trip={trip} index={index} />
                  ))}
                </div>
              </section>

              <section style={{ display: "grid", gap: 14 }}>
                {Object.entries(grouped).map(([routeName, rows]) => (
                  <RoutePanel key={routeName} routeName={routeName} rows={rows} />
                ))}
              </section>
            </section>

            <section
              style={{
                marginTop: 16,
                borderRadius: 24,
                background:
                  "linear-gradient(90deg, rgba(243,174,38,0.16) 0%, rgba(5,150,165,0.12) 100%)",
                border: "1px solid rgba(243,174,38,0.34)",
                padding: 14,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 16,
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: colors.gold,
                    fontSize: 12,
                    fontWeight: 950,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  Operating boundary
                </p>
                <h3
                  style={{
                    margin: "7px 0 0",
                    color: colors.white,
                    fontSize: 26,
                    lineHeight: 1,
                    letterSpacing: "-0.045em",
                    fontWeight: 880,
                  }}
                >
                  LIVE DEMO display only. Production control remains inactive.
                </h3>
                <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.82)", fontSize: 14, lineHeight: 1.45, fontWeight: 730 }}>
                  LGU / DOT governs DCS configuration. These live-looking values are for presentation approval only. Production states must come from booking, QR, manifest, and scan events.
                </p>
              </div>

              <Link
                href="/lgu/departure-control"
                style={{
                  minHeight: 48,
                  borderRadius: 16,
                  padding: "0 18px",
                  background: colors.white,
                  color: colors.navy,
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 950,
                }}
              >
                Back to Approval Console
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function BoardStatus({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div
      style={{
        borderRadius: 22,
        background: emphasis ? "rgba(5,150,165,0.24)" : "rgba(255,255,255,0.12)",
        border: emphasis ? "1px solid rgba(5,150,165,0.42)" : "1px solid rgba(255,255,255,0.16)",
        padding: 14,
      }}
    >
      <p style={{ margin: 0, color: "rgba(255,255,255,0.70)", fontSize: 11, fontWeight: 900 }}>
        {label}
      </p>
      <strong style={{ display: "block", marginTop: 5, color: "#FFFFFF", fontSize: emphasis ? 25 : 21, lineHeight: 1 }}>
        {value}
      </strong>
    </div>
  );
}

function StatusTile({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone: "teal" | "gold" | "white" | "red";
}) {
  const accent =
    tone === "teal" ? colors.teal2 : tone === "gold" ? colors.gold : tone === "red" ? "#FF7A7A" : colors.white;

  return (
    <div
      style={{
        minHeight: 88,
        borderRadius: 24,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.045) 100%)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 28px 80px rgba(0,0,0,0.48)",
        padding: 14,
      }}
    >
      <p style={{ margin: 0, color: accent, fontSize: 12, fontWeight: 950, letterSpacing: "0.16em", textTransform: "uppercase" }}>
        {label}
      </p>
      <strong
        style={{
          display: "block",
          marginTop: 8,
          color: colors.white,
          fontSize: 38,
          lineHeight: 0.9,
          letterSpacing: "-0.065em",
          fontWeight: 900,
        }}
      >
        {value}
      </strong>
      <p style={{ margin: "9px 0 0", color: "rgba(255,255,255,0.80)", fontSize: 13, lineHeight: 1.35, fontWeight: 760 }}>
        {note}
      </p>
    </div>
  );
}

function QueueRow({ trip, index }: { trip: DcsTrip; index: number }) {
  const demoStatus = getDemoStatus(index);
  const booked = getDemoBookedCount(index);
  const boarded = getDemoBoardedCount(index);
  const manifest = getDemoManifestStatus(index);
  const statusColor = getDemoStatusColor(demoStatus);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 0.38fr 0.38fr 0.48fr",
        gap: 12,
        alignItems: "center",
        borderRadius: 24,
        background:
          "linear-gradient(90deg, rgba(255,255,255,0.17) 0%, rgba(255,255,255,0.10) 100%)",
        border: "1px solid rgba(255,255,255,0.22)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
        padding: "12px 14px",
      }}
    >
      <div>
        <p style={{ margin: 0, color: "#FFFFFF", fontSize: 17, fontWeight: 950, letterSpacing: "-0.02em" }}>
          {trip.tripNumber}
        </p>
        <p style={{ margin: "5px 0 0", color: colors.slate, fontSize: 12, fontWeight: 820 }}>
          {trip.routeProductCode}
        </p>
      </div>
      <BoardCell label="Time" value={trip.departureTimeLocal} />
      <BoardCell label="Status" value={getDemoStatusLabel(demoStatus)} customColor={statusColor} />
      <BoardCell label="Pax" value={`${boarded}/${booked}`} />
      <BoardCell label="Manifest" value={manifest} customColor={statusColor} />
    </div>
  );
}

function RoutePanel({ routeName, rows }: { routeName: string; rows: DcsTrip[] }) {
  return (
    <article
      style={{
        borderRadius: 26,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.045) 100%)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 32px 88px rgba(0,0,0,0.50)",
        padding: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14 }}>
        <div>
          <p style={{ margin: 0, color: colors.gold, fontSize: 11, fontWeight: 950, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Route
          </p>
          <h3
            style={{
              margin: "6px 0 0",
              color: "#FFFFFF",
              fontSize: 24,
              lineHeight: 0.96,
              letterSpacing: "-0.055em",
              fontWeight: 900,
              textShadow: "0 18px 50px rgba(0,0,0,0.46)",
            }}
          >
            {routeName}
          </h3>
        </div>

        <span
          style={{
            borderRadius: 999,
            padding: "9px 12px",
            color: colors.white,
            background: "rgba(5,150,165,0.25)",
            border: "1px solid rgba(5,150,165,0.42)",
            fontSize: 12,
            fontWeight: 950,
          }}
        >
          {rows.length} rows
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
        {rows.map((trip, index) => {
          const demoStatus = getDemoStatus(index);
          return (
          <div
            key={trip.tripNumber}
            style={{
              borderRadius: 18,
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.20)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
              padding: "9px 10px",
            }}
          >
            <p style={{ margin: 0, color: "#FFFFFF", fontSize: 16, fontWeight: 950 }}>{trip.departureTimeLocal}</p>
            <p style={{ margin: "5px 0 0", color: getDemoStatusColor(demoStatus), fontSize: 10, fontWeight: 900, letterSpacing: "0.05em" }}>
              {getDemoStatusLabel(demoStatus)}
            </p>
          </div>
          );
        })}
      </div>
    </article>
  );
}

function BoardCell({ label, value, accent = false, customColor }: { label: string; value: string; accent?: boolean; customColor?: string }) {
  return (
    <div>
      <p style={{ margin: 0, color: colors.slate, fontSize: 10, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </p>
      <strong
        style={{
          display: "block",
          marginTop: 5,
          color: customColor || (accent ? colors.teal2 : "#FFFFFF"),
          fontSize: 15,
          lineHeight: 1.1,
          fontWeight: 920,
        }}
      >
        {value}
      </strong>
    </div>
  );
}
