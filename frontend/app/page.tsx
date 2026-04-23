import { getCurrentUser, requireAccessToken } from "../src/lib/server-auth";
import { getPreferredTravelerTrip } from "../src/lib/travelerTripSelection";

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

function LinkList(props: { items: Array<{ href: string; label: string }> }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
      {props.items.map((item) => (
        <li key={item.href}>
          <a href={item.href}>{item.label}</a>
        </li>
      ))}
    </ul>
  );
}

function isOperatorRole(role: string | null | undefined) {
  return ["OPERATOR_OWNER", "OPERATOR_MANAGER", "OPERATOR_STAFF"].includes(role || "");
}

async function getTravelerLatestTrip() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";

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
      return { trip: null, error: `Failed to load latest traveler trip: HTTP ${listRes.status}` };
    }

    const rows = await listRes.json();
    const trips = Array.isArray(rows) ? rows : [];
    const preferredTrip = getPreferredTravelerTrip(trips);

    if (!preferredTrip?.id) {
      return { trip: null, error: null };
    }

    const detailRes = await fetch(`${baseUrl}/trips/${preferredTrip.id}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!detailRes.ok) {
      return {
        trip: null,
        error: `Failed to load latest traveler trip detail: HTTP ${detailRes.status}`,
      };
    }

    const trip = await detailRes.json();
    return { trip, error: null };
  } catch (error: any) {
    return {
      trip: null,
      error: error?.message || "Unknown traveler trip load failure",
    };
  }
}

function getTripPass(trip: any) {
  return trip?.pass ?? null;
}

function getTripPassIssued(trip: any) {
  return Boolean(getTripPass(trip));
}

function getTripPassStatusRaw(trip: any) {
  return trip?.pass?.passStatus ?? null;
}

function getTripPassCodeRaw(trip: any) {
  return trip?.pass?.passCode ?? null;
}

function getTripPaymentStateRaw(trip: any) {
  return trip?.currentPaymentState?.state ?? null;
}

function getTripArrivalDateRaw(trip: any) {
  return trip?.arrivalDate ?? null;
}

function getTripDepartureDateRaw(trip: any) {
  return trip?.departureDate ?? null;
}

function normalizeLabel(value: any) {
  if (!value) return "—";
  return String(value)
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: any) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getHeroState(trip: any) {
  const passIssued = getTripPassIssued(trip);
  const passStatus = String(getTripPassStatusRaw(trip) || "").toLowerCase();
  const clearanceStatus = String(trip?.clearanceStatus || "").toLowerCase();
  const paymentState = String(getTripPaymentStateRaw(trip) || "").toLowerCase();
  const hasTrip = Boolean(trip);

  if (
    hasTrip &&
    passIssued &&
    (passStatus === "active" || passStatus === "issued" || passStatus === "valid") &&
    clearanceStatus === "approved" &&
    paymentState === "paid"
  ) {
    return {
      pill: "ACTIVE",
      travelerLabel: "Verified Traveler",
      title: "Trip Active.\nPass Ready.",
      body: "Access your trip status,\npass, clearance, and\npayment in one place.",
      pillBg: "#14a44d",
    };
  }

  if (hasTrip && !passIssued) {
    return {
      pill: "PENDING",
      travelerLabel: "Traveler On File",
      title: "Trip Found.\nPass Pending.",
      body: "Access your trip status,\npass, clearance, and\npayment in one place.",
      pillBg: "#d89a20",
    };
  }

  if (hasTrip && clearanceStatus && clearanceStatus !== "approved") {
    return {
      pill: "PENDING",
      travelerLabel: "Traveler On File",
      title: "Trip On File.\nClearance Pending.",
      body: "Your pass may be issued, but clearance is still under review before trip readiness is confirmed.",
      pillBg: "#6f62d8",
    };
  }

  if (hasTrip && paymentState && paymentState !== "paid") {
    return {
      pill: "PAYMENT",
      travelerLabel: "Payment Pending",
      title: "Trip On File.\nPayment Pending.",
      body: "Access your trip status,\npass, clearance, and\npayment in one place.",
      pillBg: "#0fa8c8",
    };
  }

  return {
    pill: "START",
    travelerLabel: "Traveler Access",
    title: "Start Your\nOne Siargao Pass.",
    body: "Access your trip status,\npass, clearance, and\npayment in one place.",
    pillBg: "#64748b",
  };
}

function getTravelerNameForPassCard(user: any) {
  return user?.fullName || user?.email || user?.id || "Traveler";
}

function getPassCardValidDates(trip: any) {
  const startLabel = formatDate(getTripArrivalDateRaw(trip));
  const endLabel = formatDate(getTripDepartureDateRaw(trip));

  if (startLabel !== "—" && endLabel !== "—") {
    return startLabel + " – " + endLabel;
  }

  if (startLabel !== "—") {
    return startLabel;
  }

  return "—";
}

function getPassCardTripMeta(trip: any) {
  const arrivalValue = getTripArrivalDateRaw(trip);
  const departureValue = getTripDepartureDateRaw(trip);

  if (arrivalValue && departureValue) {
    const startDate = new Date(arrivalValue);
    const endDate = new Date(departureValue);

    if (!Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime())) {
      const diffDays = Math.max(
        1,
        Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
      );
      const nights = Math.max(0, diffDays - 1);

      return (
        String(nights) +
        " Night" +
        (nights === 1 ? "" : "s") +
        " / " +
        String(diffDays) +
        " Day" +
        (diffDays === 1 ? "" : "s")
      );
    }
  }

  if (trip?.currentBooking?.bookingReference) {
    return String(trip.currentBooking.bookingReference);
  }

  if (trip?.declaredAccommodationName) {
    return String(trip.declaredAccommodationName);
  }

  if (trip?.originLocation) {
    return String(trip.originLocation);
  }

  return "—";
}

function getPassCardPassCode(trip: any) {
  const passCode = getTripPassCodeRaw(trip);
  return passCode ? String(passCode) : "—";
}

function getPassCardPassStatus(trip: any) {
  const passStatus = getTripPassStatusRaw(trip);
  if (passStatus) return normalizeLabel(passStatus);
  return getTripPassIssued(trip) ? "Issued" : "Not Issued";
}

function getPassCardBadgeColor(trip: any) {
  const passIssued = getTripPassIssued(trip);
  const passStatus = String(getTripPassStatusRaw(trip) || "").toLowerCase();
  const clearanceStatus = String(trip?.clearanceStatus || "").toLowerCase();
  const paymentState = String(getTripPaymentStateRaw(trip) || "").toLowerCase();
  const hasTrip = Boolean(trip);

  if (
    hasTrip &&
    passIssued &&
    (passStatus === "active" || passStatus === "issued" || passStatus === "valid") &&
    clearanceStatus === "approved" &&
    paymentState === "paid"
  ) {
    return "#11a36a";
  }

  if (hasTrip && !passIssued) {
    return "#d89a20";
  }

  if (hasTrip && paymentState && paymentState !== "paid") {
    return "#0fa8c8";
  }

  if (hasTrip && clearanceStatus && clearanceStatus !== "approved") {
    return "#6f62d8";
  }

  return "#64748b";
}

function getPassCardVerificationLabel(trip: any) {
  const passIssued = getTripPassIssued(trip);
  const passStatus = String(getTripPassStatusRaw(trip) || "").toLowerCase();
  const clearanceStatus = String(trip?.clearanceStatus || "").toLowerCase();
  const paymentState = String(getTripPaymentStateRaw(trip) || "").toLowerCase();

  if (
    passIssued &&
    (passStatus === "active" || passStatus === "issued" || passStatus === "valid") &&
    clearanceStatus === "approved" &&
    paymentState === "paid"
  ) {
    return "VERIFIED";
  }

  if (passIssued && (passStatus === "active" || passStatus === "issued" || passStatus === "valid")) {
    return "PASS ISSUED";
  }

  return "NOT ISSUED";
}

function PassCardQrShell() {
  return (
    <div
      style={{
        position: "relative",
        width: 150,
        height: 150,
        borderRadius: 18,
        background: "#ffffff",
        boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 12,
          borderRadius: 14,
          border: "1px solid #e3e8ee",
          background: "#fbfdff",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 18,
          width: 26,
          height: 26,
          borderRadius: 6,
          border: "3px solid #0f172a",
          background: "#ffffff",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 18,
          top: 18,
          width: 26,
          height: 26,
          borderRadius: 6,
          border: "3px solid #0f172a",
          background: "#ffffff",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 18,
          bottom: 18,
          width: 26,
          height: 26,
          borderRadius: 6,
          border: "3px solid #0f172a",
          background: "#ffffff",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 16,
            border: "2px solid #dce6ee",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              borderRadius: 999,
              border: "2px solid #17b6c6",
              background: "#ffffff",
              padding: "8px 10px",
              textAlign: "center",
              fontSize: 7,
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 1.15,
              color: "#17b6c6",
            }}
          >
            <span>
              One
              <br />
              Siargao
              <br />
              Pass
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusRowTripDates(trip: any) {
  const startValue = getTripArrivalDateRaw(trip);
  const endValue = getTripDepartureDateRaw(trip);

  const shortFormat = (value: any) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const startLabel = shortFormat(startValue);
  const endLabel = shortFormat(endValue);

  if (startLabel !== "—" && endLabel !== "—") {
    return startLabel + " – " + endLabel;
  }

  if (startLabel !== "—") {
    return startLabel;
  }

  return "—";
}

function getStatusRowPassStatus(trip: any) {
  const passIssued = getTripPassIssued(trip);
  const passStatus = getTripPassStatusRaw(trip);

  if (passIssued && passStatus) return normalizeLabel(passStatus);
  return passIssued ? "Issued" : "Not Issued";
}

function getStatusRowClearanceStatus(trip: any) {
  return normalizeLabel(trip?.clearanceStatus);
}

function getStatusRowPaymentStatus(trip: any) {
  return normalizeLabel(getTripPaymentStateRaw(trip));
}

function getStatusRowValueColor(value: string) {
  const normalized = value.toLowerCase();

  if (
    normalized === "approved" ||
    normalized === "paid" ||
    normalized === "active" ||
    normalized === "issued" ||
    normalized === "valid"
  ) {
    return "#17a34a";
  }

  if (normalized === "pending" || normalized === "review" || normalized === "processing") {
    return "#d89a20";
  }

  if (normalized === "not issued" || normalized === "unpaid" || normalized === "failed") {
    return "#dc2626";
  }

  return "#334155";
}

function getTravelerReassuranceMessage(trip: any) {
  const passIssued = getTripPassIssued(trip);
  const passStatus = String(getTripPassStatusRaw(trip) || "").toLowerCase();
  const clearanceStatus = String(trip?.clearanceStatus || "").toLowerCase();
  const paymentState = String(getTripPaymentStateRaw(trip) || "").toLowerCase();
  const hasTrip = Boolean(trip);

  if (
    hasTrip &&
    passIssued &&
    (passStatus === "active" || passStatus === "issued" || passStatus === "valid") &&
    clearanceStatus === "approved" &&
    paymentState === "paid"
  ) {
    return {
      message: "You’re all set! Enjoy your trip and keep your pass handy.",
      color: "#2998b4",
    };
  }

  if (hasTrip && !passIssued) {
    return {
      message: "Your trip is on file. Complete the remaining requirements before your pass is issued.",
      color: "#b07d19",
    };
  }

  if (hasTrip && clearanceStatus && clearanceStatus !== "approved") {
    return {
      message: "Clearance is still under review. Keep checking your latest trip status.",
      color: "#6f62d8",
    };
  }

  if (hasTrip && paymentState && paymentState !== "paid") {
    return {
      message: "Payment is still pending. Settle it to keep your trip moving.",
      color: "#2998b4",
    };
  }

  return {
    message: "You do not have an active trip yet. Start from your traveler trip record.",
    color: "#64748b",
  };
}

function TravelerStatusRowCard(props: { title: string; value: string; icon: any }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        background: "#ffffff",
        padding: "10px 8px",
        minHeight: 88,
        boxShadow: "0 6px 18px rgba(15,23,42,0.04)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            background: "#f3f6fa",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "0 0 auto",
          }}
        >
          {props.icon}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 7,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#334155",
            }}
          >
            {props.title}
          </div>
          <div
            style={{
              marginTop: 2,
              fontSize: 10,
              lineHeight: 1.15,
              fontWeight: 700,
              color: getStatusRowValueColor(props.value),
            }}
          >
            {props.value}
          </div>
        </div>
      </div>
    </div>
  );
}

function TravelerJourneyCard(props: {
  title: string;
  subtitle: string;
  href: string;
  icon: any;
}) {
  return (
    <a
      href={props.href}
      style={{
        border: "1px solid #e6e8ed",
        borderRadius: 18,
        background: "#ffffff",
        padding: 12,
        minHeight: 124,
        textDecoration: "none",
        boxShadow: "0 8px 26px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "#f4f7fb",
          color: "#60759a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.icon}
      </div>
      <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, lineHeight: 1.15, color: "#1d2f5c" }}>
        {props.title}
      </div>
      <div style={{ marginTop: 3, fontSize: 10, lineHeight: 1.2, color: "#64748b" }}>{props.subtitle}</div>
    </a>
  );
}

function TravelerBottomNavLink(props: {
  href: string;
  label: string;
  active?: boolean;
  icon: any;
}) {
  const color = props.active ? "#12a9ba" : "#6b7f9f";

  return (
    <a
      href={props.href}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontWeight: 500,
        color,
        textDecoration: "none",
      }}
    >
      {props.icon}
      <span>{props.label}</span>
    </a>
  );
}

function TravelerShellFrame(props: {
  latestTravelerTrip: any;
}) {
  const hero = getHeroState(props.latestTravelerTrip);

  return (
    <header
      style={{
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: "2px solid #17b6c6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 1.15,
              color: "#17b6c6",
              flex: "0 0 auto",
            }}
          >
            <span>
              One
              <br />
              Siargao
              <br />
              Pass
            </span>
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#19305a",
              }}
            >
              One Siargao Pass
            </h1>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#64748b",
              }}
            >
              <span>Official Traveler Pass</span>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" style={{ color: "#17b6c6" }}>
                <path
                  d="M12 3l7 3v5c0 4.5-3 8.1-7 10-4-1.9-7-5.5-7-10V6l7-3z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 12.2l2.2 2.2 4.8-5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          style={{
            position: "relative",
            width: 44,
            height: 44,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#19305a",
            background: "transparent",
            border: "none",
            padding: 0,
          }}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
            <path
              d="M6.5 17.5h11l-1.4-1.6a2.5 2.5 0 0 1-.6-1.6V11a5.5 5.5 0 1 0-11 0v3.3c0 .6-.2 1.2-.6 1.6L6.5 17.5z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#ff6a45",
            }}
          />
        </button>
      </div>

      <section
        style={{
          overflow: "hidden",
          borderRadius: 28,
          background: "#083d67",
          boxShadow: "0 20px 60px rgba(8,61,103,0.22)",
        }}
      >
        <div
          style={{
            position: "relative",
            minHeight: 446,
            overflow: "hidden",
            padding: "20px 20px 20px",
            color: "#ffffff",
            backgroundImage:
              'linear-gradient(90deg, rgba(5,39,82,0.99) 0%, rgba(6,59,108,0.97) 33%, rgba(7,92,140,0.58) 53%, rgba(7,110,164,0.12) 69%), url("/osp/osp-hero-map.png")',
            backgroundSize: "cover",
            backgroundPosition: "60% center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at top right, rgba(255,255,255,0.12), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.06) 100%)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, maxWidth: "46%" }}>
            <div
              style={{
                marginBottom: 12,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  borderRadius: 999,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  background: hero.pillBg,
                  color: "#ffffff",
                }}
              >
                {hero.pill}
              </span>

              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" style={{ color: "#91f0cf" }}>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M8 12.3l2.5 2.5L16.5 9"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {hero.travelerLabel}
              </span>
            </div>

            <h2
              style={{
                margin: 0,
                whiteSpace: "pre-line",
                fontSize: 32,
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: "-0.05em",
                color: "#ffffff",
              }}
            >
              {hero.title}
            </h2>

            <p
              style={{
                marginTop: 18,
                marginBottom: 0,
                whiteSpace: "pre-line",
                fontSize: 14,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {hero.body}
            </p>

            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
              <a
                href="/traveler/pass"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minWidth: 186,
                  height: 54,
                  borderRadius: 999,
                  background: "#16bfd3",
                  padding: "0 18px",
                  fontSize: 15,
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  color: "#ffffff",
                  textDecoration: "none",
                  boxShadow: "0 12px 30px rgba(22,191,211,0.35)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                    <path
                      d="M4 9h5V4H4v5zm11 0h5V4h-5v5zM4 20h5v-5H4v5zm11 0h5v-5h-5v5z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 6h6M12 9V15M15 18H9"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  Show My QR
                </span>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <a
                href={props.latestTravelerTrip?.id ? `/traveler/trips/${props.latestTravelerTrip.id}` : "/traveler/trips"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  minWidth: 186,
                  height: 50,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.45)",
                  background: "transparent",
                  padding: "0 18px",
                  fontSize: 15,
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  color: "#ffffff",
                  textDecoration: "none",
                }}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <path
                    d="M3 6.8l6-2.3 6 2.3 6-2.3v12.7l-6 2.3-6-2.3-6 2.3V6.8z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path d="M9 4.5v12.7M15 6.8v12.7" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                Open Passport Map
              </a>
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}

function TravelerPassCard(props: {
  user: any;
  latestTravelerTrip: any;
}) {
  const travelerName = getTravelerNameForPassCard(props.user);
  const passCode = getPassCardPassCode(props.latestTravelerTrip);
  const passStatus = getPassCardPassStatus(props.latestTravelerTrip);
  const validDates = getPassCardValidDates(props.latestTravelerTrip);
  const tripMeta = getPassCardTripMeta(props.latestTravelerTrip);
  const verificationLabel = getPassCardVerificationLabel(props.latestTravelerTrip);
  const badgeColor = getPassCardBadgeColor(props.latestTravelerTrip);

  return (
    <section
      style={{
        marginTop: 16,
        border: "1px solid #dbeaf2",
        borderRadius: 24,
        background: "#eef7fc",
        padding: 16,
        boxShadow: "0 12px 36px rgba(15,23,42,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 10,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#7a93ad",
            }}
          >
            One Siargao Pass
          </div>

          <h3
            style={{
              marginTop: 12,
              marginBottom: 0,
              fontSize: 17,
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#1d2f5c",
            }}
          >
            {travelerName}
          </h3>

          <div style={{ marginTop: 20 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#7a93ad",
              }}
            >
              Pass Code
            </div>
            <div
              style={{
                marginTop: 4,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.02em",
                color: "#0f172a",
              }}
            >
              {passCode}
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#7a93ad",
              }}
            >
              Valid Dates
            </div>
            <div
              style={{
                marginTop: 4,
              fontSize: 14,
              fontWeight: 500,
              color: "#0f172a",
              }}
            >
              {validDates}
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              color: "#66819e",
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M7 3.8v3.4M17 3.8v3.4M3.5 9.5h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {tripMeta}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            minWidth: 144,
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span
            style={{
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 700,
              background: badgeColor,
              color: "#ffffff",
            }}
          >
            PASS {passStatus.toUpperCase()}
          </span>

          <div style={{ marginTop: 20 }}>
            <PassCardQrShell />
          </div>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 700,
              color: "#17b6c6",
            }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
              <path
                d="M12 3l7 3v5c0 4.5-3 8.1-7 10-4-1.9-7-5.5-7-10V6l7-3z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 12.2l2.2 2.2 4.8-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {verificationLabel}
          </div>
        </div>
      </div>
    </section>
  );
}

function TravelerCompactStatusRow(props: {
  latestTravelerTrip: any;
}) {
  const clearanceStatus = getStatusRowClearanceStatus(props.latestTravelerTrip);
  const paymentStatus = getStatusRowPaymentStatus(props.latestTravelerTrip);
  const passStatus = getStatusRowPassStatus(props.latestTravelerTrip);
  const tripDates = getStatusRowTripDates(props.latestTravelerTrip);

  return (
    <section
      style={{
        marginTop: 14,
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 6,
      }}
    >
      <TravelerStatusRowCard
        title="Clearance Status"
        value={clearanceStatus}
        icon={
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <rect x="5" y="3.5" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8.5 8.5h7M8.5 12h4.5M9 16l1.6 1.6 3.4-3.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />

      <TravelerStatusRowCard
        title="Payment Status"
        value={paymentStatus}
        icon={
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <rect x="3.5" y="6" width="17" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3.5 10.2h17" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        }
      />

      <TravelerStatusRowCard
        title="Pass Status"
        value={passStatus}
        icon={
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path
              d="M12 3l7 3v5c0 4.5-3 8.1-7 10-4-1.9-7-5.5-7-10V6l7-3z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 12.2l2.2 2.2 4.8-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />

      <TravelerStatusRowCard
        title="Trip Dates"
        value={tripDates}
        icon={
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M7 3.8v3.4M17 3.8v3.4M3.5 9.5h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        }
      />
    </section>
  );
}

function TravelerReassuranceAndJourney(props: {
  latestTravelerTrip: any;
}) {
  const reassurance = getTravelerReassuranceMessage(props.latestTravelerTrip);

  return (
    <>
      <section
        style={{
          marginTop: 14,
          border: "1px solid #cfe8ef",
          borderRadius: 16,
          background: "#e7f6fb",
          padding: "12px 14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#ffffff",
              color: "#17b6c6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto",
            }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path d="M12 3l7 3v5c0 4.5-3 8.1-7 10-4-1.9-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.35, fontWeight: 500, color: reassurance.color }}>
            {reassurance.message}
          </p>
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            color: "#1d2f5c",
          }}
        >
          Continue Your Journey
        </h3>

        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          <TravelerJourneyCard
            href="/traveler/trips"
            title="Trips"
            subtitle="View Your Trips"
            icon={
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
                <rect x="4" y="7" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 7V5M16 7V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          />

          <TravelerJourneyCard
            href="/traveler/pass"
            title="Payments"
            subtitle="Receipts & History"
            icon={
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" style={{ color: "#16bfd3" }}>
                <rect x="3.5" y="6" width="17" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3.5 10.2h17" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            }
          />

          <TravelerJourneyCard
            href="/traveler/trips"
            title="Passport Map"
            subtitle="Explore Siargao"
            icon={
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" style={{ color: "#16bfd3" }}>
                <path
                  d="M3 6.8l6-2.3 6 2.3 6-2.3v12.7l-6 2.3-6-2.3-6 2.3V6.8z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="M9 4.5v12.7M15 6.8v12.7" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            }
          />

          <TravelerJourneyCard
            href="/traveler/trips"
            title="Checkpoints"
            subtitle="Entry Locations"
            icon={
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
                <path
                  d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            }
          />
        </div>
      </section>
    </>
  );
}

function TravelerBottomNav() {
  return (
    <nav
      style={{
        marginTop: 22,
        border: "1px solid #e5e7eb",
        borderRadius: 24,
        background: "#ffffff",
        padding: "10px 16px 12px",
        boxShadow: "0 8px 30px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <TravelerBottomNavLink
          href="/"
          label="Home"
          active
          icon={
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M4 11.2L12 4l8 7.2V20a1 1 0 0 1-1 1h-5.2v-6h-3.6v6H5a1 1 0 0 1-1-1v-8.8z" />
            </svg>
          }
        />

        <TravelerBottomNavLink
          href="/traveler/trips"
          label="Trips"
          icon={
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
              <rect x="4" y="7" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 7V5M16 7V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          }
        />

        <a
          href="/traveler/pass"
          style={{
            marginTop: -22,
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#12b0c4",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 14px 30px rgba(18,176,196,0.35)",
            textDecoration: "none",
          }}
          aria-label="Center action"
        >
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
            <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12 3.5v3M12 17.5v3M20.5 12h-3M6.5 12h-3M17.7 6.3l-2.1 2.1M8.4 15.6l-2.1 2.1M17.7 17.7l-2.1-2.1M8.4 8.4L6.3 6.3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </a>

        <TravelerBottomNavLink
          href="/traveler/pass"
          label="Payments"
          icon={
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
              <rect x="3.5" y="6" width="17" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3.5 10.2h17" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          }
        />

        <TravelerBottomNavLink
          href="/traveler/trips"
          label="Profile"
          icon={
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M5.5 19.5c1.9-2.8 4-4 6.5-4s4.6 1.2 6.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          }
        />
      </div>
    </nav>
  );
}

function TravelerShell(props: {
  user: any;
  latestTravelerTrip: any;
}) {
  return (
    <div
      style={{
        maxWidth: 430,
        margin: "0 auto",
        paddingTop: 2,
        paddingBottom: 18,
      }}
    >
      <TravelerShellFrame latestTravelerTrip={props.latestTravelerTrip} />
      <TravelerPassCard user={props.user} latestTravelerTrip={props.latestTravelerTrip} />
      <TravelerCompactStatusRow latestTravelerTrip={props.latestTravelerTrip} />
      <TravelerReassuranceAndJourney latestTravelerTrip={props.latestTravelerTrip} />
      <TravelerBottomNav />
    </div>
  );
}

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
        <h1 style={{ marginBottom: 8 }}>One Siargao Pass</h1>
        <p style={{ marginTop: 0, marginBottom: 24 }}>
          Role-aware landing flow is now active. Please log in to continue.
        </p>

        <Section title="Get Started">
          <LinkList
            items={[
              { href: "/login", label: "Login" },
              { href: "/dev", label: "Open Dev Route Index" },
            ]}
          />
        </Section>
      </main>
    );
  }

  const travelerTripResult =
    user.primaryRole === "TRAVELER" ? await getTravelerLatestTrip() : { trip: null, error: null };

  const latestTravelerTrip = travelerTripResult.trip;

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      {user.primaryRole === "TRAVELER" ? (
        <>
          {travelerTripResult.error ? (
            <Section title="Traveler Trip Load Error">
              <div>{travelerTripResult.error}</div>
            </Section>
          ) : null}

          <TravelerShell user={user} latestTravelerTrip={latestTravelerTrip} />
        </>
      ) : (
        <>
          <h1 style={{ marginBottom: 8 }}>One Siargao Pass</h1>
          <p style={{ marginTop: 0, marginBottom: 24 }}>
            Welcome back, {user.fullName || user.email || user.id}.
          </p>

          <Section title="Session">
            <div style={{ marginBottom: 8 }}><strong>Email:</strong> {user.email ?? "—"}</div>
            <div style={{ marginBottom: 8 }}><strong>Role:</strong> {user.primaryRole ?? "—"}</div>
            <div style={{ marginBottom: 8 }}><strong>Status:</strong> {user.accountStatus ?? "—"}</div>
          </Section>

          {user.primaryRole === "ADMIN" ? (
            <Section title="Admin Landing">
              <LinkList
                items={[
                  { href: "/admin/activities", label: "Admin Activities" },
                  { href: "/admin/manifest-approvals", label: "Manifest Approval Queue" },
                  { href: "/admin/manifests/history", label: "Manifest History" },
                  { href: "/dev", label: "Dev Route Index" },
                  { href: "/logout", label: "Logout" },
                ]}
              />
            </Section>
          ) : null}

          {isOperatorRole(user.primaryRole) ? (
            <Section title="Operator Landing">
              <LinkList
                items={[
                  { href: "/operator/activities", label: "Operator Activities" },
                  { href: "/operator/manifests", label: "Operator Manifests" },
                  { href: "/dev", label: "Dev Route Index" },
                  { href: "/logout", label: "Logout" },
                ]}
              />
            </Section>
          ) : null}
        </>
      )}
    </main>
  );
}
