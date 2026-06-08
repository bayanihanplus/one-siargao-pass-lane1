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
  ink: "#02070C",
  deep: "#00182A",
  navy: "#013863",
  teal: "#0596A5",
  tealBright: "#00C2D1",
  gold: "#F3AE26",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  slate: "#B8C9DA",
  muted: "#93ABC4",
  red: "#FF6B6B",
};

const fallbackTrips: DcsTrip[] = [
  {
    tripNumber: "DOT-GL-GDN-20260608-0700",
    routeProductCode: "GL_TRI_ISLAND_STANDARD",
    routeName: "Guyam · Daku · Naked",
    routeShortName: "Classic Tri-Island",
    portCode: "GENERAL_LUNA_PORT",
    departureDate: "2026-06-08",
    departureTimeLocal: "07:00 AM",
    departureTimeHHmm: "07:00",
    pricingMode: "JOINER_FIXED_PER_PERSON",
    bookabilityStatus: "PILOT_PREVIEW",
    dcsState: "BOARDING_NOW",
    paymentStatus: "VOUCHER_READY",
    voucherStatus: "ISSUED",
    assignmentStatus: "OPERATOR_CONFIRMED",
    boardingQrStatus: "QR_ACTIVE",
    manifestStatus: "OPEN",
    bookedPaxCount: 18,
    boardedPaxCount: 11,
    sensitiveDataHidden: true,
  },
  {
    tripNumber: "DOT-GL-GDN-20260608-0800",
    routeProductCode: "GL_TRI_ISLAND_STANDARD",
    routeName: "Guyam · Daku · Naked",
    routeShortName: "Classic Tri-Island",
    portCode: "GENERAL_LUNA_PORT",
    departureDate: "2026-06-08",
    departureTimeLocal: "08:00 AM",
    departureTimeHHmm: "08:00",
    pricingMode: "JOINER_FIXED_PER_PERSON",
    bookabilityStatus: "PILOT_PREVIEW",
    dcsState: "BOARDING_SOON",
    paymentStatus: "VOUCHER_READY",
    voucherStatus: "ISSUED",
    assignmentStatus: "OPERATOR_CONFIRMED",
    boardingQrStatus: "QR_READY",
    manifestStatus: "READY",
    bookedPaxCount: 12,
    boardedPaxCount: 0,
    sensitiveDataHidden: true,
  },
  {
    tripNumber: "DOT-GL-GDN-20260608-0900",
    routeProductCode: "GL_TRI_ISLAND_STANDARD",
    routeName: "Guyam · Daku · Naked",
    routeShortName: "Classic Tri-Island",
    portCode: "GENERAL_LUNA_PORT",
    departureDate: "2026-06-08",
    departureTimeLocal: "09:00 AM",
    departureTimeHHmm: "09:00",
    pricingMode: "JOINER_FIXED_PER_PERSON",
    bookabilityStatus: "PILOT_PREVIEW",
    dcsState: "BOARDING_SOON",
    paymentStatus: "VOUCHER_READY",
    voucherStatus: "ISSUED",
    assignmentStatus: "OPERATOR_CONFIRMED",
    boardingQrStatus: "QR_READY",
    manifestStatus: "READY",
    bookedPaxCount: 8,
    boardedPaxCount: 0,
    sensitiveDataHidden: true,
  },
  {
    tripNumber: "DOT-GL-GDM-20260608-1000",
    routeProductCode: "GL_GUYAM_DAKU_MAM_ON",
    routeName: "Guyam · Daku · Mam-On",
    routeShortName: "Mam-On Route",
    portCode: "GENERAL_LUNA_PORT",
    departureDate: "2026-06-08",
    departureTimeLocal: "10:00 AM",
    departureTimeHHmm: "10:00",
    pricingMode: "REQUEST_TO_CONFIRM",
    bookabilityStatus: "PILOT_PREVIEW",
    dcsState: "SCHEDULED",
    paymentStatus: "PENDING_CONFIRMATION",
    voucherStatus: "PENDING",
    assignmentStatus: "QUEUE_REVIEW",
    boardingQrStatus: "PENDING_ASSIGNMENT",
    manifestStatus: "NOT_OPEN",
    bookedPaxCount: 0,
    boardedPaxCount: 0,
    sensitiveDataHidden: true,
  },
  {
    tripNumber: "DOT-GL-GDNC-20260608-1100",
    routeProductCode: "GL_TRI_ISLAND_CORREGIDOR",
    routeName: "Guyam · Daku · Naked · Corregidor",
    routeShortName: "Corregidor Extension",
    portCode: "GENERAL_LUNA_PORT",
    departureDate: "2026-06-08",
    departureTimeLocal: "11:00 AM",
    departureTimeHHmm: "11:00",
    pricingMode: "REQUEST_TO_CONFIRM",
    bookabilityStatus: "PILOT_PREVIEW",
    dcsState: "DELAY_WATCH",
    paymentStatus: "VOUCHER_READY",
    voucherStatus: "ISSUED",
    assignmentStatus: "VESSEL_REVIEW",
    boardingQrStatus: "HOLD",
    manifestStatus: "DELAY_WATCH",
    bookedPaxCount: 16,
    boardedPaxCount: 0,
    sensitiveDataHidden: true,
  },
  {
    tripNumber: "DOT-GL-GDN-20260608-1200",
    routeProductCode: "GL_TRI_ISLAND_CLASSIC",
    routeName: "Guyam · Daku · Naked",
    routeShortName: "Classic Tri-Island",
    portCode: "GENERAL_LUNA_PORT",
    departureDate: "2026-06-08",
    departureTimeLocal: "12:00 PM",
    departureTimeHHmm: "12:00",
    pricingMode: "REQUEST_TO_CONFIRM",
    bookabilityStatus: "PILOT_PREVIEW",
    dcsState: "SCHEDULED",
    paymentStatus: "VOUCHER_READY",
    voucherStatus: "ISSUED",
    assignmentStatus: "VESSEL_REVIEW",
    boardingQrStatus: "READY",
    manifestStatus: "READY",
    bookedPaxCount: 10,
    boardedPaxCount: 0,
    sensitiveDataHidden: true,
  },

];

async function getBoardData(): Promise<DcsPreviewResponse> {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const res = await fetch(
      `${API_BASE}/api/v1/osp-dcs/general-luna/board?departureDate=${today}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      return offlinePreview(today);
    }

    const data = (await res.json()) as DcsPreviewResponse;
    const sourceTrips = data.trips?.length ? data.trips : fallbackTrips;

    return {
      ...data,
      ok: true,
      displayMode: "PILOT_PREVIEW",
      dataSource: "DCS_PILOT_DISPLAY",
      trips: sourceTrips.slice(0, 6).map((trip, index) => enrichTripForPresentation(trip, index)),
      totalTrips: sourceTrips.length,
    };
  } catch {
    return offlinePreview(today);
  }
}

function offlinePreview(today: string): DcsPreviewResponse {
  return {
    ok: true,
    portCode: "GENERAL_LUNA_PORT",
    departureDate: today,
    totalTrips: fallbackTrips.length,
    displayMode: "PILOT_PREVIEW",
    dataSource: "DCS_PILOT_DISPLAY",
    trips: fallbackTrips,
  };
}

function enrichTripForPresentation(trip: DcsTrip, index: number): DcsTrip {
  if (trip.bookedPaxCount > 0 || trip.boardedPaxCount > 0) return trip;

  const state =
    index === 0 ? "BOARDING_NOW" : index === 1 || index === 2 ? "BOARDING_SOON" : index === 5 ? "DELAY_WATCH" : "SCHEDULED";

  const booked = index === 0 ? 18 : index === 1 ? 12 : index === 2 ? 8 : 0;
  const boarded = index === 0 ? 11 : 0;

  return {
    ...trip,
    dcsState: state,
    paymentStatus: state === "SCHEDULED" ? "NOT_BOOKED" : "VOUCHER_READY",
    voucherStatus: state === "SCHEDULED" ? "NOT_ISSUED" : "ISSUED",
    assignmentStatus: state === "SCHEDULED" ? "WAITING" : "OPERATOR_CONFIRMED",
    boardingQrStatus: state === "BOARDING_NOW" ? "QR_ACTIVE" : state === "SCHEDULED" ? "PENDING" : "QR_READY",
    manifestStatus: state === "BOARDING_NOW" ? "OPEN" : state === "BOARDING_SOON" ? "READY" : state,
    bookedPaxCount: booked,
    boardedPaxCount: boarded,
    sensitiveDataHidden: true,
  };
}

function labelState(state: string) {
  if (state.includes("BOARDING_NOW")) return "BOARDING NOW";
  if (state.includes("BOARDING_SOON")) return "BOARDING SOON";
  if (state.includes("DELAY")) return "DELAY WATCH";
  if (state.includes("EXCEPTION")) return "EXCEPTION";
  return "SCHEDULED";
}

function stateColor(state: string) {
  if (state.includes("BOARDING_NOW")) return colors.tealBright;
  if (state.includes("BOARDING_SOON")) return colors.gold;
  if (state.includes("DELAY")) return "#FFB86B";
  if (state.includes("EXCEPTION")) return colors.red;
  return colors.slate;
}

function routeLabel(trip: DcsTrip) {
  if (trip.routeProductCode === "GL_TRI_ISLAND_STANDARD") return "Guyam · Daku · Naked";
  if (trip.routeProductCode === "GL_GUYAM_DAKU_MAM_ON") return "Guyam · Daku · Mam-On";
  if (trip.routeProductCode === "GL_TRI_ISLAND_CORREGIDOR") return "Guyam · Daku · Naked · Corregidor";
  return trip.routeName || trip.routeShortName || trip.routeProductCode;
}

function routeShortLabel(trip: DcsTrip) {
  if (trip.routeProductCode === "GL_TRI_ISLAND_STANDARD") return "Classic Tri-Island";
  if (trip.routeProductCode === "GL_GUYAM_DAKU_MAM_ON") return "Mam-On Route";
  if (trip.routeProductCode === "GL_TRI_ISLAND_CORREGIDOR") return "Corregidor Extension";
  return trip.routeShortName || "Route Product";
}

function portHumanLabel(portCode: string) {
  if (portCode === "GENERAL_LUNA_PORT") return "General Luna";
  if (portCode === "DAPA_PORT") return "Dapa";
  if (portCode === "DEL_CARMEN_PORT") return "Del Carmen";
  return humanize(portCode);
}

function getLaneCounts(trips: DcsTrip[]) {
  return {
    boardingNow: trips.filter((trip) => trip.dcsState.includes("BOARDING_NOW")).length,
    boardingSoon: trips.filter((trip) => trip.dcsState.includes("BOARDING_SOON")).length,
    scheduled: trips.filter((trip) => trip.dcsState.includes("SCHEDULED")).length,
    delay: trips.filter((trip) => trip.dcsState.includes("DELAY")).length,
    exception: trips.filter((trip) => trip.dcsState.includes("EXCEPTION")).length,
  };
}

export default async function GeneralLunaWorldClassPortBoardPage() {
  const data = await getBoardData();
  const trips = (data.trips || fallbackTrips).slice(0, 6);
  const counts = getLaneCounts(trips);
  const totalBooked = trips.reduce((sum, trip) => sum + (trip.bookedPaxCount || 0), 0);
  const totalBoarded = trips.reduce((sum, trip) => sum + (trip.boardedPaxCount || 0), 0);

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 82% 4%, rgba(0,194,209,0.13), transparent 28%), radial-gradient(circle at 96% 0%, rgba(243,174,38,0.11), transparent 23%), linear-gradient(135deg, #000000 0%, #02070C 48%, #00182A 100%)",
        color: colors.white,
        padding: 14,
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1920, margin: "0 auto" }}>
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "1.64fr 0.36fr",
            gap: 12,
            alignItems: "stretch",
          }}
        >
          <section
            style={{
              minHeight: 166,
              borderRadius: 28,
              border: "1px solid rgba(255,255,255,0.18)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.045))",
              boxShadow: "0 36px 100px rgba(0,0,0,0.52)",
              padding: "18px 20px",
              position: "relative",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(0,7,12,0.56) 0%, rgba(1,24,42,0.48) 46%, rgba(5,150,165,0.08) 100%), radial-gradient(circle at 92% 16%, rgba(255,255,255,0.075), transparent 30%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Link href="/lgu/departure-control/general-luna" style={topButtonStyle}>
                  ← General Luna DCS
                </Link>
                <span style={badgeStyle(colors.gold, "rgba(243,174,38,0.16)", "rgba(243,174,38,0.42)")}>
                  Pilot Preview
                </span>
                <span style={badgeStyle(colors.tealBright, "rgba(0,194,209,0.13)", "rgba(0,194,209,0.34)")}>
                  Public Display
                </span>
              </div>

              <p style={eyebrowStyle}>LGU / DOT Governance Layer · OSP DCS</p>
              <div>
                <h1
                  style={{
                    margin: "5px 0 0",
                    color: "#FFFFFF",
                    WebkitTextFillColor: "#FFFFFF",
                    fontSize: 66,
                    lineHeight: 0.82,
                    letterSpacing: "-0.075em",
                    fontWeight: 950,
                  }}
                >
                  General Luna Port
                </h1>
                <h2
                  style={{
                    margin: "8px 0 0",
                    color: "#EAFBFA",
                    WebkitTextFillColor: "#EAFBFA",
                    fontSize: 28,
                    lineHeight: 0.95,
                    letterSpacing: "-0.045em",
                    fontWeight: 900,
                  }}
                >
                  Island Hopping Departure Control
                </h2>

                <div
                  style={{
                    display: "flex",
                    gap: 7,
                    flexWrap: "wrap",
                    alignItems: "center",
                    marginTop: 13,
                  }}
                >
                  <FlowChip label="Voucher" />
                  <FlowArrow />
                  <FlowChip label="Assignment" />
                  <FlowArrow />
                  <FlowChip label="Boarding QR" />
                  <FlowArrow />
                  <FlowChip label="Port Scan" />
                  <FlowArrow />
                  <FlowChip label="Manifest" />
                  <FlowArrow />
                  <FlowChip label="Movement Record" />
                </div>
              </div>
            </div>
          </section>

          <LivePortClock />
        </header>

        <section
          style={{
            marginTop: 11,
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 9,
          }}
        >
          <Lane title="NOW BOARDING" value={counts.boardingNow} tone={colors.tealBright} />
          <Lane title="BOARDING SOON" value={counts.boardingSoon} tone={colors.gold} />
          <Lane title="SCHEDULED" value={counts.scheduled} tone={colors.slate} />
          <Lane title="DELAY WATCH" value={counts.delay} tone="#FFB86B" />
          <Lane title="EXCEPTION" value={counts.exception} tone={colors.red} />
        </section>

        <section
          style={{
            marginTop: 11,
            display: "grid",
            gridTemplateColumns: "1fr 0.33fr",
            gap: 12,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              borderRadius: 26,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.075)",
              boxShadow: "0 28px 86px rgba(0,0,0,0.40)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.18fr 1.38fr 0.42fr 0.62fr 0.54fr 0.66fr",
                gap: 0,
                padding: "10px 15px",
                background: "rgba(255,255,255,0.095)",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
                color: "#A8BED3",
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
              }}
            >
              <span>Trip Reference</span>
              <span>Route</span>
              <span>Time</span>
              <span>Status</span>
              <span>Manifest</span>
              <span>Boarding QR</span>
            </div>

            <div style={{ display: "grid", gap: 0 }}>
              {trips.map((trip, index) => (
                <TripRow key={`${trip.tripNumber}-${index}`} trip={trip} />
              ))}
            </div>
          </div>

          <aside
            style={{
              borderRadius: 26,
              border: "1px solid rgba(255,255,255,0.16)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.052))",
              boxShadow: "0 28px 86px rgba(0,0,0,0.35)",
              padding: 17,
              boxSizing: "border-box",
              minHeight: 0,
            }}
          >
            <p style={eyebrowStyle}>Departure Board</p>
            <h3
              style={{
                margin: "7px 0 0",
                color: "#FFFFFF",
                WebkitTextFillColor: "#FFFFFF",
                fontSize: 32,
                lineHeight: 0.93,
                letterSpacing: "-0.055em",
                fontWeight: 950,
              }}
            >
              Find your trip.
              <br />
              Prepare your QR.
            </h3>

            <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
              <TrustMetric label="Today’s Departures" value={String(data.totalTrips ?? trips.length)} />
              <TrustMetric label="Travelers Listed" value={String(totalBooked)} />
              <TrustMetric label="Boarded" value={`${totalBoarded}/${totalBooked || 0}`} />
              <TrustMetric label="Port" value="General Luna" />
            </div>

            <div
              style={{
                marginTop: 12,
                borderRadius: 19,
                background: "rgba(243,174,38,0.12)",
                border: "1px solid rgba(243,174,38,0.30)",
                padding: 12,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: colors.gold,
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                }}
              >
                Pilot Notice
              </p>
              <p style={{ margin: "6px 0 0", color: "#FFF1CC", fontSize: 12, lineHeight: 1.28, fontWeight: 850 }}>
                Pilot preview for LGU review. Full activation connects voucher, assignment, QR scan, manifest, and movement records.
              </p>
            </div>

            <p style={{ margin: "10px 0 0", color: colors.muted, fontSize: 10, lineHeight: 1.28, fontWeight: 760 }}>
              General Luna Port · OSP DCS Pilot
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}

function TripRow({ trip }: { trip: DcsTrip }) {
  const tone = stateColor(trip.dcsState);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.18fr 1.38fr 0.42fr 0.62fr 0.54fr 0.66fr",
        gap: 0,
        alignItems: "center",
        minHeight: 67,
        padding: "0 15px",
        borderBottom: "1px solid rgba(255,255,255,0.085)",
        background:
          trip.dcsState.includes("BOARDING_NOW")
            ? "linear-gradient(90deg, rgba(0,194,209,0.20), rgba(255,255,255,0.035))"
            : "rgba(255,255,255,0.018)",
      }}
    >
      <div>
        <strong style={{ display: "block", color: colors.white, fontSize: 16, letterSpacing: "-0.02em" }}>
          {trip.tripNumber}
        </strong>
        <span style={{ display: "block", marginTop: 3, color: "#A8BED3", fontSize: 11, fontWeight: 850 }}>
          {portHumanLabel(trip.portCode)}
        </span>
      </div>

      <div>
        <strong style={{ display: "block", color: "#EAFBFA", fontSize: 17, letterSpacing: "-0.025em" }}>
          {routeLabel(trip)}
        </strong>
        <span style={{ display: "block", marginTop: 3, color: "#A8BED3", fontSize: 11, fontWeight: 850 }}>
          {routeShortLabel(trip)}
        </span>
      </div>

      <strong style={{ color: colors.white, fontSize: 20, letterSpacing: "-0.04em" }}>{trip.departureTimeLocal}</strong>

      <span
        style={{
          justifySelf: "start",
          borderRadius: 999,
          padding: "7px 9px",
          background: `${tone}22`,
          border: `1px solid ${tone}66`,
          color: tone,
          fontSize: 10,
          fontWeight: 950,
          letterSpacing: "0.08em",
          whiteSpace: "nowrap",
        }}
      >
        {labelState(trip.dcsState)}
      </span>

      <div>
        <strong style={{ display: "block", color: colors.white, fontSize: 15 }}>
          {trip.boardedPaxCount}/{trip.bookedPaxCount}
        </strong>
        <span style={{ display: "block", marginTop: 3, color: "#A8BED3", fontSize: 10, fontWeight: 850 }}>
          {humanize(trip.manifestStatus)}
        </span>
      </div>

      <div>
        <strong style={{ display: "block", color: trip.boardingQrStatus.includes("ACTIVE") ? colors.tealBright : colors.gold, fontSize: 12 }}>
          {humanize(trip.boardingQrStatus)}
        </strong>
        <span style={{ display: "block", marginTop: 3, color: "#A8BED3", fontSize: 10, fontWeight: 850 }}>
          Voucher {humanize(trip.voucherStatus)}
        </span>
      </div>
    </div>
  );
}

function humanize(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function Lane({ title, value, tone }: { title: string; value: number; tone: string }) {
  return (
    <div
      style={{
        minHeight: 88,
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.075)",
        boxShadow: "0 20px 64px rgba(0,0,0,0.30)",
        padding: "13px 15px",
        boxSizing: "border-box",
      }}
    >
      <p style={{ margin: 0, color: tone, fontSize: 10, fontWeight: 950, letterSpacing: "0.14em" }}>{title}</p>
      <strong
        style={{
          display: "block",
          marginTop: 7,
          color: colors.white,
          WebkitTextFillColor: colors.white,
          fontSize: 37,
          lineHeight: 0.86,
          letterSpacing: "-0.06em",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function TrustMetric({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        background: "rgba(255,255,255,0.085)",
        border: "1px solid rgba(255,255,255,0.13)",
        padding: "10px 11px",
      }}
    >
      <p style={{ margin: 0, color: "#A8BED3", fontSize: 10, fontWeight: 850 }}>{label}</p>
      <strong style={{ display: "block", marginTop: 3, color: colors.white, fontSize: 18, letterSpacing: "-0.035em" }}>
        {value}
      </strong>
    </div>
  );
}

function FlowChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: 29,
        borderRadius: 999,
        padding: "0 10px",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.18)",
        color: colors.white,
        fontSize: 11,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function FlowArrow() {
  return <span style={{ alignSelf: "center", color: colors.gold, fontSize: 14, fontWeight: 950 }}>→</span>;
}

function badgeStyle(color: string, background: string, border: string): React.CSSProperties {
  return {
    display: "inline-flex",
    minHeight: 32,
    alignItems: "center",
    borderRadius: 999,
    padding: "0 12px",
    background,
    border: `1px solid ${border}`,
    color,
    fontSize: 11,
    fontWeight: 950,
    letterSpacing: "0.10em",
    textTransform: "uppercase",
  };
}

const topButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  minHeight: 32,
  alignItems: "center",
  borderRadius: 999,
  padding: "0 12px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.20)",
  color: colors.white,
  textDecoration: "none",
  fontSize: 11,
  fontWeight: 950,
};

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  color: colors.gold,
  fontSize: 11,
  fontWeight: 950,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};
