import Link from "next/link";

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
  instantBookingEnabled: boolean;
  requestToConfirmRequired: boolean;
  requiresOperatorAssignment: boolean;
  requiresVesselAssignment: boolean;
  requiresManifest: boolean;
  requiresBoardingQr: boolean;
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

async function getGeneralLunaDcsPreview(): Promise<DcsPreviewResponse> {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const res = await fetch(
      `${API_BASE}/osp-dcs/general-luna/scheduled-trips/preview?departureDate=${today}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      return {
        ok: false,
        error: `DCS preview endpoint failed: HTTP ${res.status}`,
      };
    }

    return res.json();
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || "DCS preview endpoint unavailable",
    };
  }
}

const shellStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 0% 0%, rgba(5,150,165,0.13), transparent 30%), linear-gradient(180deg, #EAFBFA 0%, #F7FCFC 42%, #FFFFFF 100%)",
  padding: "18px",
  boxSizing: "border-box",
};

const frameStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 1280,
  margin: "0 auto",
};

const cardStyle: React.CSSProperties = {
  borderRadius: 26,
  background: "#FFFFFF",
  border: "1px solid rgba(1,56,99,0.10)",
  boxShadow: "0 22px 55px rgba(1,56,99,0.08)",
};

const pillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 30,
  borderRadius: 999,
  padding: "0 10px",
  background: "#F4FCFA",
  border: "1px solid rgba(5,150,165,0.20)",
  color: "#013863",
  fontSize: 12,
  fontWeight: 900,
};

function statusTone(status: string) {
  if (status.includes("ISSUED") || status.includes("READY") || status.includes("OPEN")) return "#0596A5";
  if (status.includes("NOT") || status.includes("SCHEDULED")) return "#50668B";
  if (status.includes("DELAY") || status.includes("EXCEPTION")) return "#F3AE26";
  if (status.includes("CANCEL")) return "#B42318";
  return "#013863";
}

function groupByRoute(trips: DcsTrip[]) {
  return trips.reduce<Record<string, DcsTrip[]>>((acc, trip) => {
    const key = trip.routeShortName || trip.routeName;
    acc[key] = acc[key] || [];
    acc[key].push(trip);
    return acc;
  }, {});
}

export default async function GeneralLunaDcsPreviewPage() {
  const data = await getGeneralLunaDcsPreview();
  const trips = data.trips || [];
  const groupedTrips = groupByRoute(trips);

  return (
    <main style={shellStyle}>
      <div style={frameStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <Link
            href="/admin/control-tower/qr-compliance"
            style={{
              minHeight: 42,
              borderRadius: 14,
              padding: "0 14px",
              display: "inline-flex",
              alignItems: "center",
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.14)",
              color: "#013863",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 900,
            }}
          >
            ← QR / Compliance
          </Link>
          <span style={{ ...pillStyle, background: "#FFF8EA", borderColor: "rgba(243,174,38,0.35)", color: "#8A5A00" }}>
            Registry preview · Not live board
          </span>
        </div>

        <section
          style={{
            borderRadius: 32,
            background: "linear-gradient(135deg, #013863 0%, #003B66 58%, #0596A5 130%)",
            color: "#FFFFFF",
            padding: 24,
            boxShadow: "0 26px 70px rgba(1,56,99,0.22)",
          }}
        >
          <p style={{ margin: 0, color: "#F3AE26", fontSize: 12, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            OSP Departure Control System
          </p>
          <h1 style={{ margin: "9px 0 0", fontSize: 44, lineHeight: 0.9, letterSpacing: "-0.065em", fontWeight: 900 }}>
            General Luna Port Board
          </h1>
          <p style={{ margin: "12px 0 0", maxWidth: 820, color: "rgba(255,255,255,0.90)", fontSize: 15, lineHeight: 1.5, fontWeight: 760 }}>
            Read-only preview of scheduled General Luna island-hopping trip rows generated from the DCS registry. Live booking,
            voucher, assignment, boarding QR, manifest, and movement states will be attached in later lanes.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, marginTop: 18 }}>
            <Metric label="Port" value={data.portCode || "GENERAL_LUNA_PORT"} />
            <Metric label="Trips" value={String(data.totalTrips ?? trips.length)} />
            <Metric label="Date" value={data.departureDate || "—"} />
            <Metric label="Source" value={data.dataSource || "Registry preview"} />
          </div>
        </section>

        {!data.ok ? (
          <section style={{ ...cardStyle, marginTop: 14, padding: 18 }}>
            <p style={{ margin: 0, color: "#B42318", fontSize: 13, fontWeight: 900 }}>DCS preview unavailable</p>
            <h2 style={{ margin: "8px 0 0", color: "#013863", fontSize: 24, letterSpacing: "-0.04em" }}>
              Backend registry endpoint did not return a valid preview.
            </h2>
            <p style={{ margin: "8px 0 0", color: "#50668B", fontSize: 14, lineHeight: 1.45, fontWeight: 700 }}>
              {data.error || "Check backend server and /api/v1/osp-dcs/general-luna/scheduled-trips/preview."}
            </p>
          </section>
        ) : (
          <>
            <section style={{ ...cardStyle, marginTop: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                <div>
                  <p style={{ margin: 0, color: "#0596A5", fontSize: 11, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Board lanes
                  </p>
                  <h2 style={{ margin: "7px 0 0", color: "#013863", fontSize: 26, lineHeight: 1, letterSpacing: "-0.045em" }}>
                    Scheduled rows before live booking events
                  </h2>
                </div>
                <span style={pillStyle}>Sensitive data hidden</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, marginTop: 14 }}>
                <Lane title="NOW BOARDING" value="0" note="Requires boarding-open event" />
                <Lane title="BOARDING SOON" value="0" note="Requires assignment + QR state" />
                <Lane title="SCHEDULED" value={String(trips.length)} note="Registry-generated rows" />
                <Lane title="EXCEPTIONS" value="0" note="Requires compliance events" />
              </div>
            </section>

            {Object.entries(groupedTrips).map(([routeName, rows]) => (
              <section key={routeName} style={{ ...cardStyle, marginTop: 14, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <p style={{ margin: 0, color: "#0596A5", fontSize: 11, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
                      Route product
                    </p>
                    <h3 style={{ margin: "6px 0 0", color: "#013863", fontSize: 22, lineHeight: 1.05, letterSpacing: "-0.04em" }}>
                      {routeName}
                    </h3>
                  </div>
                  <span style={pillStyle}>{rows.length} scheduled rows</span>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  {rows.map((trip) => (
                    <div
                      key={trip.tripNumber}
                      style={{
                        borderRadius: 18,
                        border: "1px solid rgba(1,56,99,0.09)",
                        background: "#F9FEFE",
                        padding: 12,
                        display: "grid",
                        gridTemplateColumns: "1.3fr 0.7fr 0.8fr 0.8fr 0.8fr",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, color: "#013863", fontSize: 13, fontWeight: 950 }}>{trip.tripNumber}</p>
                        <p style={{ margin: "4px 0 0", color: "#50668B", fontSize: 12, fontWeight: 760 }}>
                          {trip.routeProductCode} · {trip.portCode}
                        </p>
                      </div>
                      <BoardCell label="Time" value={trip.departureTimeLocal} />
                      <BoardCell label="Payment" value={trip.paymentStatus} tone={statusTone(trip.paymentStatus)} />
                      <BoardCell label="Assignment" value={trip.assignmentStatus} tone={statusTone(trip.assignmentStatus)} />
                      <BoardCell label="Manifest" value={`${trip.boardedPaxCount}/${trip.bookedPaxCount} · ${trip.manifestStatus}`} tone={statusTone(trip.manifestStatus)} />
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ borderRadius: 18, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", padding: 12 }}>
      <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: 11, fontWeight: 850 }}>{label}</p>
      <strong style={{ display: "block", marginTop: 4, color: "#FFFFFF", fontSize: 14, lineHeight: 1.1 }}>{value}</strong>
    </div>
  );
}

function Lane({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div style={{ borderRadius: 20, background: "#F4FCFA", border: "1px solid rgba(5,150,165,0.16)", padding: 13 }}>
      <p style={{ margin: 0, color: "#0596A5", fontSize: 10, fontWeight: 950, letterSpacing: "0.12em" }}>{title}</p>
      <strong style={{ display: "block", marginTop: 6, color: "#013863", fontSize: 28, letterSpacing: "-0.05em" }}>{value}</strong>
      <p style={{ margin: "4px 0 0", color: "#50668B", fontSize: 12, lineHeight: 1.35, fontWeight: 750 }}>{note}</p>
    </div>
  );
}

function BoardCell({ label, value, tone = "#013863" }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <p style={{ margin: 0, color: "#50668B", fontSize: 10, fontWeight: 850, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
      <strong style={{ display: "block", marginTop: 4, color: tone, fontSize: 12, lineHeight: 1.2 }}>{value}</strong>
    </div>
  );
}
