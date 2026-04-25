import { getApiBaseUrl, getCurrentUser, requireAccessToken } from "../src/lib/server-auth";
import { getPreferredTravelerTrip } from "../src/lib/travelerTripSelection";
import { redirect } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

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

async function getTravelerDictionary(languageCode: string): Promise<Record<string, string>> {
  const fallback: Record<string, string> = {
    "home.hero.title": "Trip Active. Pass Ready.",
    "home.cta.showQr": "Show My QR",
    "home.cta.passportMap": "Open Passport Map",
  };

  try {
    const res = await fetch(`${getApiBaseUrl()}/language-packs/${encodeURIComponent(languageCode || "en")}/dictionary?scope=traveler`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return fallback;

    const payload = await res.json();
    const dictionary = payload?.dictionary;

    if (!dictionary || typeof dictionary !== "object") return fallback;

    return {
      ...fallback,
      ...dictionary,
    };
  } catch {
    return fallback;
  }
}

function t(dictionary: Record<string, string> | undefined | null, key: string, fallback: string) {
  return dictionary?.[key] || fallback;
}

function getHomeHeroDictionaryBase(title: string) {
  if (title === "Trip Active. Pass Ready.") return "home.hero.active";
  if (title === "Trip On File. Registration Required.") return "home.hero.registrationRequired";
  if (title === "Trip On File. Manifest Listing Required.") return "home.hero.manifestRequired";
  if (title === "Trip Found. Pass Pending.") return "home.hero.passPending";
  if (title === "Trip On File. Clearance Pending.") return "home.hero.clearancePending";
  if (title === "Trip On File. Payment Pending.") return "home.hero.paymentPending";
  return "home.hero.empty";
}

function formatHeroTitleFromDictionary(value: string) {
  return value;
}

function getLanguageHeaderLabel(languageCode: string | null | undefined) {
  const normalized = String(languageCode || "en").trim();

  const labels: Record<string, string> = {
    en: "EN",
    "zh-Hant": "繁",
    "zh-Hans": "简",
    ko: "KO",
    ja: "JP",
    es: "ES",
    fr: "FR",
    de: "DE",
    it: "IT",
    pt: "PT",
    nl: "NL",
    sv: "SV",
    no: "NO",
    da: "DA",
    pl: "PL",
    fil: "FIL",
    ceb: "CEB",
    sgd: "SGD",
  };

  return labels[normalized] || normalized.slice(0, 3).toUpperCase();
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

function getTripRegistrationStatusRaw(trip: any) {
  return trip?.registrationStatus ?? null;
}

function getTripManifestListedRaw(trip: any) {
  return trip?.manifestReadiness?.isManifestListed ?? null;
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
      title: "Trip Active. Pass Ready.",
      body: "Access your trip status, pass, clearance, and payment in one place.",
      pillBg: "#14a44d",
    };
  }

  const registrationStatus = String(getTripRegistrationStatusRaw(trip) || "").toLowerCase();
  const isManifestListed = getTripManifestListedRaw(trip);

  if (hasTrip && !passIssued) {
    if (!registrationStatus || registrationStatus === "incomplete" || registrationStatus === "rejected") {
      return {
        pill: "PENDING",
        travelerLabel: "Traveler On File",
        title: "Trip On File. Registration Required.",
        body: "Complete your traveler trip registration first so your pass can move forward.",
        pillBg: "#d89a20",
      };
    }

    if (isManifestListed === false) {
      return {
        pill: "PENDING",
        travelerLabel: "Traveler On File",
        title: "Trip On File. Manifest Listing Required.",
        body: "Your registration is on file, but you are not yet listed in the manifest for this trip.",
        pillBg: "#d89a20",
      };
    }

    return {
      pill: "PENDING",
      travelerLabel: "Traveler On File",
      title: "Trip Found. Pass Pending.",
      body: "Your registration is on file. Keep checking your latest trip status as your pass moves forward.",
      pillBg: "#d89a20",
    };
  }

  if (hasTrip && clearanceStatus && clearanceStatus !== "approved") {
    return {
      pill: "PENDING",
      travelerLabel: "Traveler On File",
      title: "Trip On File. Clearance Pending.",
      body: "Your pass may be issued, but clearance is still under review before trip readiness is confirmed.",
      pillBg: "#6f62d8",
    };
  }

  if (hasTrip && paymentState && paymentState !== "paid") {
    return {
      pill: "PAYMENT",
      travelerLabel: "Payment Pending",
      title: "Trip On File. Payment Pending.",
      body: "Access your trip status, pass, clearance, and payment in one place.",
      pillBg: "#0fa8c8",
    };
  }

  return {
    pill: "START",
    travelerLabel: "Traveler Access",
    title: "Start Your One Siargao Pass.",
    body: "Access your trip status, pass, clearance, and payment in one place.",
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

  if (hasTrip && clearanceStatus && clearanceStatus !== "approved") {
    return "#6f62d8";
  }

  if (hasTrip && paymentState && paymentState !== "paid") {
    return "#0fa8c8";
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

function PassCardQrShell(props: { qrToken?: string | null }) {
  const hasQr = Boolean(props.qrToken);

  return (
    <div
      aria-label={hasQr ? "OSP active pass QR code" : "OSP active pass QR unavailable"}
      style={{
        position: "relative",
        width: 164,
        height: 164,
        borderRadius: 24,
        background: "linear-gradient(180deg, #f9fcfe 0%, #edf7fc 100%)",
        border: "1px solid #dbe7ef",
        boxShadow: "0 16px 34px rgba(15,23,42,0.10)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 10,
          borderRadius: 20,
          background: "rgba(255,255,255,0.76)",
          border: "1px solid rgba(219,231,239,0.95)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 10,
          left: 12,
          right: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#6d8398",
          }}
        >
          Official Pass
        </div>

        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: "#17b6c6",
            boxShadow: "0 0 0 3px rgba(23,182,198,0.14)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 14,
          right: 14,
          top: 28,
          bottom: 22,
          borderRadius: 18,
          background: "#ffffff",
          border: "1px solid #e3edf4",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
        }}
      >
        {hasQr ? (
          <QRCodeSVG
            value={props.qrToken as string}
            size={104}
            includeMargin={true}
            level="H"
            bgColor="#FFFFFF"
            fgColor="#111827"
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1.35,
              color: "#7b8ea2",
              padding: "0 10px",
            }}
          >
            QR not available yet
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 7,
          textAlign: "center",
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#6d8398",
        }}
      >
        {hasQr ? "Scan to verify" : "Awaiting QR issuance"}
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

  const registrationStatus = String(getTripRegistrationStatusRaw(trip) || "").toLowerCase();
  const isManifestListed = getTripManifestListedRaw(trip);

  if (hasTrip && !passIssued) {
    if (!registrationStatus || registrationStatus === "incomplete" || registrationStatus === "rejected") {
      return {
        message: "Complete your traveler registration first so your pass can move forward.",
        color: "#b07d19",
      };
    }

    if (isManifestListed === false) {
      return {
        message: "Your registration is on file, but you are not yet listed in the manifest for this trip.",
        color: "#b07d19",
      };
    }

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

function TravelerStatusRowCard(props: {
  title: string;
  value: string;
  icon: any;
  shellBg?: string;
  borderColor?: string;
  chipBg?: string;
  accentColor?: string;
}) {
  const shellBg = props.shellBg || "#ffffff";
  const borderColor = props.borderColor || "#e6e8ed";
  const chipBg = props.chipBg || "#f4f7fb";
  const accentColor = props.accentColor || getStatusRowValueColor(props.value);

  return (
    <div
      style={{
        border: `1px solid ${borderColor}`,
        borderRadius: 16,
        background: shellBg,
        minHeight: 78,
        padding: "7px 8px",
        boxShadow: "0 7px 20px rgba(15,23,42,0.035)",
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          background: chipBg,
          border: `1px solid ${borderColor}`,
          color: accentColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 6,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
        }}
      >
        {props.icon}
      </div>
      <div
        style={{
          fontSize: 7.5,
          fontWeight: 950,
          textTransform: "uppercase",
          color: "#60759a",
          lineHeight: 1.1,
        }}
      >
        {props.title}
      </div>
      <div
        style={{
          marginTop: 3,
          fontSize: 10.5,
          fontWeight: 950,
          lineHeight: 1.05,
          color: accentColor,
        }}
      >
        {props.value}
      </div>
    </div>
  );
}

function TravelerJourneyCard(props: {
  title: string;
  subtitle: string;
  href: string;
  icon: any;
  shellBg: string;
  borderColor: string;
  chipBg: string;
  accentColor: string;
}) {
  return (
    <a
      href={props.href}
      style={{
        border: `1px solid ${props.borderColor}`,
        borderRadius: 18,
        background: props.shellBg,
        padding: "8px 9px",
        minHeight: 96,
        textDecoration: "none",
        boxShadow: "0 8px 22px rgba(15,23,42,0.045)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "inherit",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: props.chipBg,
          border: `1px solid ${props.borderColor}`,
          color: props.accentColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
        }}
      >
        {props.icon}
      </div>

      <div>
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            fontWeight: 950,
            lineHeight: 1.08,
            color: "#19305a",
            letterSpacing: "-0.015em",
          }}
        >
          {props.title}
        </div>
        <div
          style={{
            marginTop: 2,
            fontSize: 8.5,
            fontWeight: 750,
            lineHeight: 1.18,
            color: "#52677f",
          }}
        >
          {props.subtitle}
        </div>
        <div
          style={{
            marginTop: 5,
            fontSize: 8,
            fontWeight: 950,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: props.accentColor,
          }}
        >
          Open
        </div>
      </div>
    </a>
  );
}

function TravelerBottomNavLink(props: {
  href: string;
  label: string;
  active?: boolean;
  icon: any;
}) {
  const color = props.active ? "#0f9fb1" : "#6b7f9f";
  const background = props.active ? "rgba(18,176,196,0.10)" : "transparent";

  return (
    <a
      href={props.href}
      aria-current={props.active ? "page" : undefined}
      style={{
        minWidth: 54,
        minHeight: 54,
        borderRadius: 16,
        padding: "6px 5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        fontSize: 9.5,
        fontWeight: 900,
        letterSpacing: "-0.01em",
        color,
        background,
        textDecoration: "none",
      }}
    >
      {props.icon}
      <span>{props.label}</span>
    </a>
  );
}

function HeaderControlButton(props: {
  label: string;
  ariaLabel: string;
  href?: string;
  icon: "language" | "currency" | "assistant";
}) {
  const icon =
    props.icon === "language" ? (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.8 12h16.4M12 3.5c2 2.2 3 5.1 3 8.5s-1 6.3-3 8.5c-2-2.2-3-5.1-3-8.5s1-6.3 3-8.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ) : props.icon === "currency" ? (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
        <path d="M8 4h5.5a4 4 0 0 1 0 8H8V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 12h6a4 4 0 0 1 0 8H8V12ZM6 8h11M6 16h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
        <path d="M12 3.5l1.4 4.2 4.1 1.4-4.1 1.4L12 14.7l-1.4-4.2-4.1-1.4 4.1-1.4L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M18 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );

  const content = (
    <>
      {icon}
      <span>{props.label}</span>
    </>
  );

  const style = {
    minWidth: 34,
    height: 32,
    borderRadius: 999,
    border: "1px solid #dbe8ef",
    background: "#ffffff",
    color: "#19305a",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    padding: "0 7px",
    fontSize: 9.5,
    fontWeight: 950,
    textDecoration: "none",
    boxShadow: "0 8px 18px rgba(15,23,42,0.045)",
  } as const;

  if (props.href) {
    return (
      <a href={props.href} aria-label={props.ariaLabel} style={style}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" aria-label={props.ariaLabel} style={style}>
      {content}
    </button>
  );
}

function TravelerShellFrame(props: {
  latestTravelerTrip: any;
  dictionary: Record<string, string>;
  preferredLanguage?: string | null;
}) {
  const hero = getHeroState(props.latestTravelerTrip);
  const heroBaseKey = getHomeHeroDictionaryBase(hero.title);
  const heroTitle = formatHeroTitleFromDictionary(t(props.dictionary, `${heroBaseKey}.title`, hero.title));
  const heroBody = t(props.dictionary, `${heroBaseKey}.body`, hero.body);
  const heroTravelerLabel = t(props.dictionary, `${heroBaseKey}.travelerLabel`, hero.travelerLabel);
  const showQrLabel = t(props.dictionary, "home.cta.showQr", "Show My QR");
  const passportMapLabel = t(props.dictionary, "home.cta.passportMap", "Open Passport Map");
  const officialTravelerPassLabel = t(props.dictionary, "home.header.officialTravelerPass", "Official Traveler Pass");
  const languageAriaLabel = t(props.dictionary, "home.header.language.ariaLabel", "Open language selector");
  const currencyAriaLabel = t(props.dictionary, "home.header.currency.ariaLabel", "Open currency selector");
  const assistantAriaLabel = t(props.dictionary, "home.header.assistant.ariaLabel", "Open OSP Travel Assistant");
  const notificationsAriaLabel = t(props.dictionary, "home.header.notifications.ariaLabel", "Notifications");
  const languageLabel = getLanguageHeaderLabel(props.preferredLanguage);

  return (
    <header
      style={{
        width: "100%",
        maxWidth: 430,
        margin: "0 auto 14px",
        overflow: "hidden",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, width: "100%", whiteSpace: "nowrap" }}>
          <img
            src="/osp/osp-official-logo.png"
            alt="One Siargao Pass official logo"
            style={{
              width: 44,
              height: 44,
              borderRadius: 16,
              objectFit: "cover",
              flex: "0 0 auto",
              boxShadow: "0 8px 18px rgba(15,23,42,0.08)",
              background: "#ffffff",
            }}
          />

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 850,
                lineHeight: 0.98,
                letterSpacing: "-0.035em",
                color: "#19305a",
              }}
            >
              One Siargao Pass
            </h1>
            <div
              style={{
                marginTop: 7,
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 12,
                fontWeight: 700,
                color: "#64748b",
              }}
            >
              <span>{officialTravelerPassLabel}</span>
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 6,
            flex: "0 0 auto",
          }}
        >
          <HeaderControlButton label={languageLabel} ariaLabel={languageAriaLabel} href="/traveler/settings?panel=language" icon="language" />
          <HeaderControlButton label="PHP" ariaLabel={currencyAriaLabel} href="/traveler/settings?panel=currency" icon="currency" />
          <HeaderControlButton label="AI" ariaLabel={assistantAriaLabel} href="/traveler/settings?panel=assistant" icon="assistant" />

          <a
            href="/traveler/settings?panel=notifications"
            aria-label={notificationsAriaLabel}
            style={{
              position: "relative",
              width: 34,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#19305a",
              background: "#ffffff",
              border: "1px solid #dbe8ef",
              padding: 0,
              boxShadow: "0 8px 18px rgba(15,23,42,0.045)",
            }}
          >
          <svg viewBox="0 0 24 24" width="23" height="23" fill="none">
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
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#ff6a45",
              }}
            />
          </a>
        </div>
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
            minHeight: 390,
            overflow: "hidden",
            padding: "20px 18px 18px",
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

          <div style={{ position: "relative", zIndex: 1, maxWidth: 252 }}>
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
                  fontSize: 12,
                  fontWeight: 850,
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
                  fontSize: 13,
                  fontWeight: 750,
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" style={{ color: "#91f0cf" }}>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M8 12.3l2.5 2.5L16.5 9"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {heroTravelerLabel}
              </span>
            </div>

            <h2
              style={{
                margin: 0,
                whiteSpace: "normal",
                fontSize: 28,
                fontWeight: 720,
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
                color: "#ffffff",
              }}
            >
              {heroTitle}
            </h2>

            <p
              style={{
                marginTop: 16,
                marginBottom: 0,
                whiteSpace: "normal",
                fontSize: 12.5,
                lineHeight: 1.42,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {heroBody}
            </p>

            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <a
                href="/traveler/pass"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  maxWidth: 188,
                  height: 48,
                  borderRadius: 999,
                  background: "#16bfd3",
                  padding: "0 18px",
                  fontSize: 12.5,
                  whiteSpace: "nowrap",
                  fontWeight: 760,
                  color: "#ffffff",
                  textDecoration: "none",
                  boxShadow: "0 12px 30px rgba(22,191,211,0.35)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                    <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.9" />
                    <rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.9" />
                    <rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.9" />
                    <path d="M14 14h2.5v2.5H19V20h-5v-6Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
                  </svg>
                  {showQrLabel}
                </span>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
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
                href="/traveler/passport-map"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  minWidth: 188,
                  height: 48,
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.48)",
                  background: "rgba(255,255,255,0.08)",
                  padding: "0 18px",
                  fontSize: 12.5,
                  whiteSpace: "nowrap",
                  fontWeight: 720,
                  color: "#ffffff",
                  textDecoration: "none",
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <path
                    d="M3 6.8l6-2.3 6 2.3 6-2.3v12.7l-6 2.3-6-2.3-6 2.3V6.8z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path d="M9 4.5v12.7M15 6.8v12.7" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="11.2" r="1.7" fill="currentColor" />
                </svg>
                {passportMapLabel}
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
  dictionary: Record<string, string>;
}) {
  const travelerName = getTravelerNameForPassCard(props.user);
  const passCode = getPassCardPassCode(props.latestTravelerTrip);
  const passStatus = getPassCardPassStatus(props.latestTravelerTrip);
  const validDates = getPassCardValidDates(props.latestTravelerTrip);
  const tripMeta = getPassCardTripMeta(props.latestTravelerTrip);
  const verificationLabel = getPassCardVerificationLabel(props.latestTravelerTrip);
  const badgeColor = getPassCardBadgeColor(props.latestTravelerTrip);
  const passCodeLabel = t(props.dictionary, "home.passCard.passCode", "Pass Code");
  const validDatesLabel = t(props.dictionary, "home.passCard.validDates", "Valid Dates");
  const passBadgePrefix = t(props.dictionary, "home.passCard.badgePrefix", "PASS");

  return (
    <section
      style={{
        marginTop: 16,
        border: "1px solid #d3e8f2",
        borderRadius: 26,
        background: "linear-gradient(180deg, #f3fbff 0%, #e9f6fc 100%)",
        padding: 18,
        boxShadow: "0 16px 42px rgba(15,23,42,0.075)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6f879f",
            }}
          >
            One Siargao Pass
          </div>

          <h3
            style={{
              marginTop: 10,
              marginBottom: 0,
              fontSize: 18,
              fontWeight: 900,
              lineHeight: 1.12,
              color: "#1d2f5c",
            }}
          >
            {travelerName}
          </h3>

          <div style={{ marginTop: 18 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#7a93ad",
              }}
            >
              {passCodeLabel}
            </div>
            <div
              style={{
                marginTop: 5,
                fontSize: 15,
                fontWeight: 850,
                letterSpacing: "0.02em",
                color: "#0f172a",
                wordBreak: "break-word",
              }}
            >
              {passCode}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#7a93ad",
              }}
            >
              {validDatesLabel}
            </div>
            <div
              style={{
                marginTop: 5,
                fontSize: 14,
                fontWeight: 750,
                color: "#0f172a",
              }}
            >
              {validDates}
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
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
            minWidth: 168,
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <span
            style={{
              borderRadius: 999,
              padding: "7px 14px",
              fontSize: 12,
              fontWeight: 950,
              letterSpacing: "0.05em",
              background: badgeColor,
              color: "#ffffff",
            }}
          >
            {passBadgePrefix} {passStatus.toUpperCase()}
          </span>

          <div style={{ marginTop: 16 }}>
            <PassCardQrShell qrToken={props.latestTravelerTrip?.pass?.qrCredential?.qrToken} />
          </div>

          <div
            style={{
              marginTop: 13,
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: 13,
              fontWeight: 900,
              color: "#1195a7",
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
  dictionary: Record<string, string>;
}) {
  const clearanceStatus = getStatusRowClearanceStatus(props.latestTravelerTrip);
  const paymentStatus = getStatusRowPaymentStatus(props.latestTravelerTrip);
  const passStatus = getStatusRowPassStatus(props.latestTravelerTrip);
  const tripDates = getStatusRowTripDates(props.latestTravelerTrip);
  const clearanceStatusTitle = t(props.dictionary, "home.status.clearance", "Clearance Status");
  const paymentStatusTitle = t(props.dictionary, "home.status.payment", "Payment Status");
  const passStatusTitle = t(props.dictionary, "home.status.pass", "Pass Status");
  const tripDatesTitle = t(props.dictionary, "home.status.tripDates", "Trip Dates");

  return (
    <section
      style={{
        marginTop: 10,
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 7,
      }}
    >
      <TravelerStatusRowCard
        title={clearanceStatusTitle}
        value={clearanceStatus}
        shellBg="#eefdf3"
        borderColor="#cdeed7"
        chipBg="#dcfce7"
        accentColor="#16a34a"
        icon={
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <rect x="5" y="3.5" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8.5 8.5h7M8.5 12h4.5M9 16l1.6 1.6 3.4-3.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />

      <TravelerStatusRowCard
        title={paymentStatusTitle}
        value={paymentStatus}
        shellBg="#fff8eb"
        borderColor="#f6e1b5"
        chipBg="#fef0c7"
        accentColor="#d97706"
        icon={
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <rect x="3.5" y="6" width="17" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M3.5 10.2h17" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        }
      />

      <TravelerStatusRowCard
        title={passStatusTitle}
        value={passStatus}
        shellBg="#ecfeff"
        borderColor="#bfeaf0"
        chipBg="#d6f6f8"
        accentColor="#0ea5b7"
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
        title={tripDatesTitle}
        value={tripDates}
        shellBg="#eff6ff"
        borderColor="#cfe0f7"
        chipBg="#dceeff"
        accentColor="#2563eb"
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
  dictionary: Record<string, string>;
}) {
  const reassurance = getTravelerReassuranceMessage(props.latestTravelerTrip);
  const reassuranceMessage = t(props.dictionary, "home.reassurance.message", reassurance.message);
  const continueJourneyTitle = t(props.dictionary, "home.journey.title", "Continue Your Journey");
  const tripsTitle = t(props.dictionary, "home.journey.trips.title", "Trips");
  const tripsSubtitle = t(props.dictionary, "home.journey.trips.subtitle", "Plans & records");
  const paymentsTitle = t(props.dictionary, "home.journey.payments.title", "Payments");
  const paymentsSubtitle = t(props.dictionary, "home.journey.payments.subtitle", "Status & receipts");
  const passportMapTitle = t(props.dictionary, "home.journey.passportMap.title", "Passport Map");
  const passportMapSubtitle = t(props.dictionary, "home.journey.passportMap.subtitle", "Trails & stamps");
  const checkpointsTitle = t(props.dictionary, "home.journey.checkpoints.title", "Checkpoints");
  const checkpointsSubtitle = t(props.dictionary, "home.journey.checkpoints.subtitle", "QR & access state");

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
            {reassuranceMessage}
          </p>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 950,
            color: "#1d2f5c",
            letterSpacing: "-0.025em",
          }}
        >
          {continueJourneyTitle}
        </h3>

        <div
          style={{
            marginTop: 9,
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 7,
          }}
        >
          <TravelerJourneyCard
            href="/traveler/trips"
            title={tripsTitle}
            subtitle={tripsSubtitle}
            shellBg="#eff6ff"
            borderColor="#cfe0f7"
            chipBg="#dceeff"
            accentColor="#2563eb"
            icon={
              <svg viewBox="0 0 24 24" width="23" height="23" fill="none">
                <path d="M6 5.5h8.5a3.5 3.5 0 0 1 0 7H9.5a3.5 3.5 0 0 0 0 7H18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                <circle cx="6" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.9" />
                <circle cx="18" cy="19.5" r="2" stroke="currentColor" strokeWidth="1.9" />
              </svg>
            }
          />

          <TravelerJourneyCard
            href="/traveler/trips"
            title={paymentsTitle}
            subtitle={paymentsSubtitle}
            shellBg="#fff8eb"
            borderColor="#f6e1b5"
            chipBg="#fef0c7"
            accentColor="#d97706"
            icon={
              <svg viewBox="0 0 24 24" width="23" height="23" fill="none" style={{ color: "#16bfd3" }}>
                <path d="M6 3.8h12v16.4l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2-2 1.2V3.8Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
                <path d="M9 8h6M9 11.5h6M9 15h3.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            }
          />

          <TravelerJourneyCard
            href="/traveler/passport-map"
            title={passportMapTitle}
            subtitle={passportMapSubtitle}
            shellBg="#ecfeff"
            borderColor="#bfeaf0"
            chipBg="#d6f6f8"
            accentColor="#0ea5b7"
            icon={
              <svg viewBox="0 0 24 24" width="23" height="23" fill="none" style={{ color: "#16bfd3" }}>
                <path
                  d="M3 6.8l6-2.3 6 2.3 6-2.3v12.7l-6 2.3-6-2.3-6 2.3V6.8z"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinejoin="round"
                />
                <path d="M9 4.5v12.7M15 6.8v12.7" stroke="currentColor" strokeWidth="1.9" />
                <path d="M12 9.2c1.2 0 2.1.9 2.1 2.1 0 1.8-2.1 3.6-2.1 3.6s-2.1-1.8-2.1-3.6c0-1.2.9-2.1 2.1-2.1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                <circle cx="12" cy="11.25" r=".65" fill="currentColor" />
              </svg>
            }
          />

          <TravelerJourneyCard
            href="/traveler/pass"
            title={checkpointsTitle}
            subtitle={checkpointsSubtitle}
            shellBg="#eefdf3"
            borderColor="#cdeed7"
            chipBg="#dcfce7"
            accentColor="#16a34a"
            icon={
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
                <path d="M12 3.5 18.5 6v5.2c0 4.2-2.7 7.5-6.5 9.3-3.8-1.8-6.5-5.1-6.5-9.3V6L12 3.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
                <path d="M8.8 12.1 11 14.2l4.4-4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>
      </section>
    </>
  );
}

function TravelerBottomNav(props: {
  dictionary: Record<string, string>;
}) {
  const homeLabel = t(props.dictionary, "home.bottomNav.home", "Home");
  const tripsLabel = t(props.dictionary, "home.bottomNav.trips", "Trips");
  const paymentsLabel = t(props.dictionary, "home.bottomNav.payments", "Payments");
  const profileLabel = t(props.dictionary, "home.bottomNav.profile", "Profile");
  const openQrAriaLabel = t(props.dictionary, "home.pass.openQr.ariaLabel", "Open active pass QR");

  return (
    <nav
      style={{
        marginTop: 22,
        border: "1px solid #dbe8ef",
        borderRadius: 26,
        background: "rgba(255,255,255,0.98)",
        padding: "10px 12px 12px",
        boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <TravelerBottomNavLink
          href="/"
          label={homeLabel}
          active
          icon={
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M4 11.2L12 4l8 7.2V20a1 1 0 0 1-1 1h-5.2v-6h-3.6v6H5a1 1 0 0 1-1-1v-8.8z" />
            </svg>
          }
        />

        <TravelerBottomNavLink
          href="/traveler/trips"
          label={tripsLabel}
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
            marginTop: -24,
            width: 66,
            height: 66,
            borderRadius: "50%",
            background: "linear-gradient(180deg, #19c7d8 0%, #0c9bad 100%)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 16px 34px rgba(18,176,196,0.40)",
            textDecoration: "none",
            border: "4px solid #ffffff",
          }}
          aria-label={openQrAriaLabel}
        >
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
            <rect x="4.5" y="4.5" width="5.5" height="5.5" rx="1.3" stroke="currentColor" strokeWidth="1.9" />
            <rect x="14" y="4.5" width="5.5" height="5.5" rx="1.3" stroke="currentColor" strokeWidth="1.9" />
            <rect x="4.5" y="14" width="5.5" height="5.5" rx="1.3" stroke="currentColor" strokeWidth="1.9" />
            <path d="M14 14h2.4v2.4h3.1v3.1H14V14Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
          </svg>
        </a>

        <TravelerBottomNavLink
          href="/traveler/trips"
          label={paymentsLabel}
          icon={
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
              <rect x="3.5" y="6" width="17" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3.5 10.2h17" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          }
        />

        <TravelerBottomNavLink
          href="/traveler/pass"
          label={profileLabel}
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
  dictionary: Record<string, string>;
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 430,
        margin: "0 auto",
        padding: "2px 10px 18px",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <TravelerShellFrame
        latestTravelerTrip={props.latestTravelerTrip}
        dictionary={props.dictionary}
        preferredLanguage={props.user?.preferredLanguage}
      />
      <TravelerPassCard user={props.user} latestTravelerTrip={props.latestTravelerTrip} dictionary={props.dictionary} />
      <TravelerCompactStatusRow latestTravelerTrip={props.latestTravelerTrip} dictionary={props.dictionary} />
      <TravelerReassuranceAndJourney latestTravelerTrip={props.latestTravelerTrip} dictionary={props.dictionary} />
      <TravelerBottomNav dictionary={props.dictionary} />
    </div>
  );
}

export default async function HomePage() {
  const user = await getCurrentUser();
  const dictionary = await getTravelerDictionary(user?.preferredLanguage || "en");

  const userRole = user?.primaryRole || user?.role || "";

  if (isOperatorRole(userRole)) {
    redirect("/operator");
  }
  if (
    userRole === "SILENT_LGU_ANALYTICS" ||
    userRole === "LGU_APPROVER" ||
    userRole === "LGU_FEE_EDITOR"
  ) {
    redirect("/lgu?panel=overview");
  }

  if (!user) {
    return (
      <main style={{ width: "100%", maxWidth: 960, margin: "0 auto", padding: "8px 0 24px", boxSizing: "border-box" }}>
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
    <main style={{ width: "100%", maxWidth: 960, margin: "0 auto", padding: "8px 0 24px", boxSizing: "border-box" }}>
      {user.primaryRole === "TRAVELER" ? (
        <>
          {travelerTripResult.error ? (
            <Section title="Traveler Trip Load Error">
              <div>{travelerTripResult.error}</div>
            </Section>
          ) : null}

          <TravelerShell user={user} latestTravelerTrip={latestTravelerTrip} dictionary={dictionary} />
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
                  { href: "/admin/checkpoint", label: "Checkpoint Scan" },
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
