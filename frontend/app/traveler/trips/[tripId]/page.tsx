import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getApiBaseUrl, getCurrentUser, requireAccessToken } from "../../../../src/lib/server-auth";
import KuyaTalaEntryButton from "../../../../src/traveler-assistant/KuyaTalaEntryButton";

type TravelerDictionary = Record<string, string>;

const tripDetailDictionaryFallback: TravelerDictionary = {
  "tripDetail.nav.backToTrips": "Back to Trips",
  "tripDetail.nav.home": "Home",
  "tripDetail.nav.pass": "Pass",
  "tripDetail.nav.passportMap": "Passport Map",
  "tripDetail.nav.logout": "Logout",
  "tripDetail.header.eyebrow": "Trip Command Screen",
  "tripDetail.title": "View Trip",
  "tripDetail.header.body": "Review your trip, clearance, booking, payment, and pass state.",
  "tripDetail.hero.activeRecord": "Active Trip Record",
  "tripDetail.tripFallbackTitle": "Traveler Trip",
  "tripDetail.loadError.title": "Load Error",
  "tripDetail.coreStatus.title": "Core Status",
  "tripDetail.coreStatus.trip": "Trip",
  "tripDetail.coreStatus.clearance": "Clearance",
  "tripDetail.coreStatus.manifest": "Manifest",
  "tripDetail.coreStatus.pass": "Pass",
  "tripDetail.status.listed": "Listed",
  "tripDetail.status.notListed": "Not Listed",
  "tripDetail.status.notIssued": "Not Issued",
  "tripDetail.details.title": "Trip Details",
  "tripDetail.details.arrival": "Arrival",
  "tripDetail.details.departure": "Departure",
  "tripDetail.details.origin": "Origin",
  "tripDetail.details.accommodation": "Accommodation",
  "tripDetail.members.title": "Trip Members",
  "tripDetail.members.fallbackName": "Trip Member",
  "tripDetail.members.type": "Type",
  "tripDetail.members.nationality": "Nationality",
  "tripDetail.members.age": "Age",
  "tripDetail.members.primary": "Primary",
  "tripDetail.members.yes": "Yes",
  "tripDetail.members.no": "No",
  "tripDetail.members.empty": "No trip members yet.",
  "tripDetail.companion.title": "Add Companion",
  "tripDetail.companion.fullNamePlaceholder": "Companion full name",
  "tripDetail.companion.nationalityPlaceholder": "PH",
  "tripDetail.companion.agePlaceholder": "Age",
  "tripDetail.companion.passportPlaceholder": "Passport / ID hint",
  "tripDetail.companion.submit": "Add Companion",
  "tripDetail.bookingSummary.title": "Booking Summary",
  "tripDetail.bookingSummary.total": "Total",
  "tripDetail.bookingSummary.paid": "Paid",
  "tripDetail.bookingSummary.unpaid": "Unpaid",
  "tripDetail.bookingSummary.latestRef": "Latest Ref",
  "tripDetail.currentBooking.title": "Current Booking",
  "tripDetail.currentBooking.reference": "Booking Reference",
  "tripDetail.currentBooking.status": "Booking Status",
  "tripDetail.currentBooking.total": "Booking Total",
  "tripDetail.currentBooking.currency": "Currency",
  "tripDetail.fx.displayEstimate": "Display Estimate",
  "tripDetail.fx.rate": "FX Rate",
  "tripDetail.fx.source": "FX Source",
  "tripDetail.fx.asOf": "Rate As Of",
  "tripDetail.fx.note": "FX is shown as a traveler display estimate only. PHP remains the booking and settlement source of truth.",
  "tripDetail.paymentStatus.title": "Payment Status",
  "tripDetail.paymentStatus.state": "State",
  "tripDetail.paymentStatus.paid": "Paid",
  "tripDetail.paymentStatus.unpaid": "Unpaid",
  "tripDetail.paymentStatus.intent": "Intent",
  "tripDetail.paymentActions.title": "Payment Actions",
  "tripDetail.paymentActions.noBooking": "No current booking is linked to this trip yet, so payment actions are unavailable.",
  "tripDetail.paymentActions.create": "Create Payment",
  "tripDetail.paymentActions.confirm": "Confirm Payment",
  "tripDetail.paymentActions.detail": "Payment Detail",
  "tripDetail.passAccess.title": "Pass Access",
  "tripDetail.passAccess.passCode": "Pass Code",
  "tripDetail.passAccess.passStatus": "Pass Status",
  "tripDetail.passAccess.qrVersion": "QR Version",
  "tripDetail.passAccess.openPass": "Open Pass",
  "tripDetail.passAccess.passportMap": "Passport Map",
  "tripDetail.paymentHistory.title": "Payment History",
  "tripDetail.paymentHistory.bookingReference": "Booking Reference",
  "tripDetail.paymentHistory.bookingStatus": "Booking Status",
  "tripDetail.paymentHistory.paymentState": "Payment State",
  "tripDetail.paymentHistory.latestIntent": "Latest Intent",
  "tripDetail.technical.title": "Technical Record",
  "tripDetail.technical.tripId": "Trip ID",
  "tripDetail.technical.manifestRef": "Manifest Ref",
  "tripDetail.technical.bookingId": "Booking ID",
  "tripDetail.technical.paymentIntentId": "Payment Intent ID",
};

async function getTravelerDictionary(languageCode?: string | null): Promise<TravelerDictionary> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/language-packs/${encodeURIComponent(languageCode || "en")}/dictionary?scope=traveler`, {
      cache: "no-store",
    });

    if (!res.ok) return tripDetailDictionaryFallback;

    const payload = await res.json();
    const dictionary = payload?.dictionary;

    if (!dictionary || typeof dictionary !== "object") return tripDetailDictionaryFallback;

    return {
      ...tripDetailDictionaryFallback,
      ...dictionary,
    };
  } catch {
    return tripDetailDictionaryFallback;
  }
}

function t(dictionary: TravelerDictionary, key: string, fallback: string) {
  return dictionary?.[key] || fallback;
}

type TripPageProps = {
  params: Promise<{
    tripId: string;
  }>;
  searchParams?: Promise<{
    added?: string;
    error?: string;
    submitted?: string;
    submitError?: string;
  }>;
};

type TripResponse = any;

async function getTrip(tripId: string): Promise<{
  error: string | null;
  trip: TripResponse | null;
}> {
  const baseUrl = getApiBaseUrl();

  try {
    const token = await requireAccessToken();

    const res = await fetch(`${baseUrl}/trips/${tripId}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return {
        error: `Failed to load trip: HTTP ${res.status}`,
        trip: null,
      };
    }

    const trip = await res.json();
    return { trip, error: null };
  } catch (error: any) {
    return {
      error: error?.message || "Unknown trip load failure",
      trip: null,
    };
  }
}

async function addCompanion(formData: FormData) {
  "use server";

  const tripId = String(formData.get("tripId") || "");
  const fullName = String(formData.get("fullName") || "").trim();
  const nationalityCode = String(formData.get("nationalityCode") || "").trim();
  const ageRaw = String(formData.get("age") || "").trim();
  const passportOrIdHint = String(formData.get("passportOrIdHint") || "").trim();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";

  if (!tripId || !fullName) return;

  const token = await requireAccessToken();

  const body: Record<string, any> = {
    memberType: "COMPANION",
    fullName,
    isPrimaryTraveler: false,
  };

  if (nationalityCode) body.nationalityCode = nationalityCode;
  if (passportOrIdHint) body.passportOrIdHint = passportOrIdHint;
  if (ageRaw) body.age = Number(ageRaw);

  const res = await fetch(`${baseUrl}/trips/${tripId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Add companion failed: HTTP ${res.status}`);
  }

  revalidatePath(`/traveler/trips/${tripId}`);
  redirect(`/traveler/trips/${tripId}`);
}

async function createPaymentIntentAction(formData: FormData) {
  "use server";

  const tripId = String(formData.get("tripId") || "");
  const bookingId = String(formData.get("bookingId") || "");

  if (!tripId || !bookingId) return;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
  const token = await requireAccessToken();

  const res = await fetch(`${baseUrl}/payments/intents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify({ bookingId }),
  });

  if (!res.ok) {
    throw new Error(`Create payment intent failed: HTTP ${res.status}`);
  }

  revalidatePath(`/traveler/trips/${tripId}`);
  redirect(`/traveler/trips/${tripId}`);
}

async function confirmPaymentIntentAction(formData: FormData) {
  "use server";

  const tripId = String(formData.get("tripId") || "");
  const intentId = String(formData.get("intentId") || "");

  if (!tripId || !intentId) return;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
  const token = await requireAccessToken();

  const res = await fetch(`${baseUrl}/payments/intents/${intentId}/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify({ eventKey: `traveler-confirm:${intentId}` }),
  });

  if (!res.ok) {
    throw new Error(`Confirm payment intent failed: HTTP ${res.status}`);
  }

  revalidatePath(`/traveler/trips/${tripId}`);
  redirect(`/traveler/trips/${tripId}`);
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

function formatMoney(value: any, currency = "PHP") {
  if (value === null || value === undefined || value === "") return "—";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return `${currency} ${amount.toLocaleString("en-PH")}`;
}

function formatFxDisplayAmount(snapshot: any) {
  if (!snapshot?.convertedDisplayAmount || !snapshot?.displayCurrencyCode) return "—";
  return formatMoney(snapshot.convertedDisplayAmount, snapshot.displayCurrencyCode);
}

function formatFxRate(snapshot: any) {
  if (!snapshot?.fxRate || !snapshot?.sourceCurrencyCode || !snapshot?.displayCurrencyCode) return "—";
  return `1 ${snapshot.sourceCurrencyCode} = ${snapshot.fxRate} ${snapshot.displayCurrencyCode}`;
}


async function submitTripRegistrationAction(formData: FormData) {
  "use server";

  const tripId = String(formData.get("tripId") || "").trim();

  if (!tripId) {
    redirect("/traveler/trips?error=missing-trip");
  }

  const token = await requireAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/trips/${tripId}/submit-registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      message = json?.message || json?.error || message;
    } catch {}

    redirect(`/traveler/trips/${tripId}?submitError=${encodeURIComponent(message)}`);
  }

  revalidatePath(`/traveler/trips/${tripId}`);
  revalidatePath("/traveler/trips");
  redirect(`/traveler/trips/${tripId}?submitted=1`);
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

  if (
    normalized.includes("APPROVED") ||
    normalized.includes("ACTIVE") ||
    normalized.includes("PAID") ||
    normalized.includes("CONFIRMED") ||
    normalized.includes("LISTED")
  ) {
    return { bg: "#eefdf3", border: "#cdeed7", color: "#16a34a" };
  }

  if (
    normalized.includes("PENDING") ||
    normalized.includes("UNPAID") ||
    normalized.includes("WAITING") ||
    normalized.includes("REGISTERED")
  ) {
    return { bg: "#fff8eb", border: "#f6e1b5", color: "#d97706" };
  }

  if (
    normalized.includes("DENIED") ||
    normalized.includes("FAILED") ||
    normalized.includes("CANCELLED") ||
    normalized.includes("BLOCKED")
  ) {
    return { bg: "#fef2f2", border: "#fecaca", color: "#dc2626" };
  }

  return { bg: "#eff6ff", border: "#cfe0f7", color: "#2563eb" };
}

function Icon(props: {
  kind:
    | "home"
    | "trips"
    | "pass"
    | "logout"
    | "view"
    | "payment"
    | "receipt"
    | "plus"
    | "check"
    | "calendar"
    | "manifest"
    | "booking"
    | "person"
    | "map"
    | "shield";
  size?: number;
}) {
  const size = props.size || 18;

  if (props.kind === "home") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.8Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
      </svg>
    );
  }

  if (props.kind === "trips") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M6 5.5h8.5a3.5 3.5 0 0 1 0 7H9.5a3.5 3.5 0 0 0 0 7H18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        <circle cx="6" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="18" cy="19.5" r="2" stroke="currentColor" strokeWidth="1.9" />
      </svg>
    );
  }

  if (props.kind === "pass" || props.kind === "shield") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M12 3.5 18.5 6v5.2c0 4.2-2.7 7.5-6.5 9.3-3.8-1.8-6.5-5.1-6.5-9.3V6L12 3.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M8.8 12.1 11 14.2l4.4-4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (props.kind === "logout") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M10 7V5.5A2.5 2.5 0 0 1 12.5 3H18v18h-5.5A2.5 2.5 0 0 1 10 18.5V17" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 12h10M11 9l3 3-3 3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (props.kind === "view") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M5 12s2.4-5 7-5 7 5 7 5-2.4 5-7 5-7-5-7-5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.9" />
      </svg>
    );
  }

  if (props.kind === "payment") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <rect x="3.5" y="6" width="17" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.5 10.2h17" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (props.kind === "receipt") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M6 3.8h12v16.4l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2-2 1.2V3.8Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M9 8h6M9 11.5h6M9 15h3.4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }

  if (props.kind === "plus") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (props.kind === "check") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (props.kind === "calendar") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <rect x="4" y="6.5" width="16" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 4v4M16 4v4M4 10.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (props.kind === "manifest") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <rect x="5" y="4" width="14" height="16" rx="3" stroke="currentColor" strokeWidth="1.9" />
        <path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }

  if (props.kind === "booking") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M6 4.5h12v15H6z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }

  if (props.kind === "person") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.9" />
        <path d="M5.5 19.2c1.9-2.8 4-4 6.5-4s4.6 1.2 6.5 4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <path d="M3 6.8l6-2.3 6 2.3 6-2.3v12.7l-6 2.3-6-2.3-6 2.3V6.8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 4.5v12.7M15 6.8v12.7" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="11.2" r="1.4" fill="currentColor" />
    </svg>
  );
}

function Section(props: { title: string; children: any; icon?: any; tone?: "default" | "teal" | "green" | "amber" | "blue" | "red" }) {
  const themes: Record<string, any> = {
    default: { bg: "#ffffff", border: "#dbe8ef", color: "#19305a" },
    teal: { bg: "#ecfeff", border: "#bfeaf0", color: "#0ea5b7" },
    green: { bg: "#eefdf3", border: "#cdeed7", color: "#16a34a" },
    amber: { bg: "#fff8eb", border: "#f6e1b5", color: "#d97706" },
    blue: { bg: "#eff6ff", border: "#cfe0f7", color: "#2563eb" },
    red: { bg: "#fef2f2", border: "#fecaca", color: "#dc2626" },
  };

  const theme = themes[props.tone || "default"];

  return (
    <section
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 22,
        padding: 16,
        marginBottom: 14,
        background: theme.bg,
        boxShadow: "0 12px 30px rgba(15,23,42,0.045)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        {props.icon ? (
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: "#ffffff",
              border: `1px solid ${theme.border}`,
              color: theme.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto",
            }}
          >
            {props.icon}
          </div>
        ) : null}
        <h2
          style={{
            margin: 0,
            fontSize: 18,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "#19305a",
          }}
        >
          {props.title}
        </h2>
      </div>
      {props.children}
    </section>
  );
}

function KeyValue(props: { label: string; value: any; tone?: any; compact?: boolean }) {
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
        padding: props.compact ? "8px 9px" : "9px 10px",
        background: theme.bg,
        minHeight: props.compact ? 54 : 60,
      }}
    >
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

function AppLink(props: { href: string; label: string; icon: any; primary?: boolean; tone?: "teal" | "amber" | "green" | "blue" | "red" }) {
  const colors: Record<string, any> = {
    teal: { bg: "#16bfd3", border: "#16bfd3", color: "#ffffff", shadow: "rgba(22,191,211,0.22)" },
    amber: { bg: "#d97706", border: "#d97706", color: "#ffffff", shadow: "rgba(217,119,6,0.22)" },
    green: { bg: "#16a34a", border: "#16a34a", color: "#ffffff", shadow: "rgba(22,163,74,0.20)" },
    blue: { bg: "#2563eb", border: "#2563eb", color: "#ffffff", shadow: "rgba(37,99,235,0.20)" },
    red: { bg: "#dc2626", border: "#dc2626", color: "#ffffff", shadow: "rgba(220,38,38,0.18)" },
  };

  const active = props.primary ? colors[props.tone || "teal"] : null;

  return (
    <a
      href={props.href}
      style={{
        minHeight: 38,
        borderRadius: 999,
        padding: "0 14px",
        background: active ? active.bg : "#ffffff",
        border: active ? `1px solid ${active.border}` : "1px solid #dbe8ef",
        color: active ? active.color : "#19305a",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        fontSize: 12,
        fontWeight: 950,
        boxShadow: active ? `0 10px 20px ${active.shadow}` : "0 8px 18px rgba(15,23,42,0.035)",
        whiteSpace: "nowrap",
      }}
    >
      {props.icon}
      {props.label}
    </a>
  );
}

function AppButton(props: { label: string; icon: any; tone?: "teal" | "amber" | "green" | "blue"; disabled?: boolean }) {
  const tones: Record<string, any> = {
    teal: { bg: "#16bfd3", border: "#16bfd3" },
    amber: { bg: "#d97706", border: "#d97706" },
    green: { bg: "#16a34a", border: "#16a34a" },
    blue: { bg: "#2563eb", border: "#2563eb" },
  };
  const tone = tones[props.tone || "teal"];

  return (
    <button
      type="submit"
      disabled={props.disabled}
      style={{
        minHeight: 38,
        borderRadius: 999,
        padding: "0 14px",
        background: props.disabled ? "#94a3b8" : tone.bg,
        border: props.disabled ? "1px solid #94a3b8" : `1px solid ${tone.border}`,
        color: "#ffffff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        fontSize: 12,
        fontWeight: 950,
        boxShadow: props.disabled ? "none" : "0 10px 20px rgba(22,191,211,0.18)",
        whiteSpace: "nowrap",
      }}
    >
      {props.icon}
      {props.label}
    </button>
  );
}


function SubmitRegistrationPanel(props: {
  tripId: string;
  canSubmit: boolean;
  submitted?: boolean;
  submitError?: string;
}) {
  if (!props.canSubmit && !props.submitted && !props.submitError) return null;

  return (
    <Section title="Registration Step" icon={<Icon kind="shield" />} tone={props.canSubmit ? "green" : "blue"}>
      <div
        style={{
          borderRadius: 20,
          padding: 12,
          background: props.canSubmit
            ? "linear-gradient(180deg, rgba(240,253,250,0.98), rgba(220,252,231,0.86))"
            : "rgba(255,255,255,0.92)",
          border: props.canSubmit ? "1px solid rgba(22,163,74,0.18)" : "1px solid rgba(14,116,144,0.12)",
          boxShadow: "0 12px 24px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            borderRadius: 999,
            padding: "6px 9px",
            background: props.canSubmit ? "rgba(22,163,74,0.10)" : "rgba(14,165,233,0.10)",
            border: props.canSubmit ? "1px solid rgba(22,163,74,0.16)" : "1px solid rgba(14,165,233,0.16)",
            color: props.canSubmit ? "#166534" : "#0369a1",
            fontSize: 11,
            fontWeight: 950,
            whiteSpace: "nowrap",
          }}
        >
          <span aria-hidden="true">{props.canSubmit ? "🧾" : "✓"}</span>
          {props.canSubmit ? "Ready to submit" : "Submission state"}
        </div>

        <h2 style={{ margin: "9px 0 0", fontSize: 19, lineHeight: 1.1, fontWeight: 950, color: "#10234a" }}>
          {props.canSubmit ? "Submit your trip registration" : "Registration submitted"}
        </h2>

        <p style={{ margin: "7px 0 0", fontSize: 12.7, lineHeight: 1.42, color: "rgba(15,23,42,0.66)", fontWeight: 720 }}>
          {props.canSubmit
            ? "This moves your trip from draft to submitted registration. Pass, QR, booking, manifest, payment, and clearance remain separate controlled steps."
            : "Your trip registration has been submitted. Clearance remains pending until review and downstream readiness checks are complete."}
        </p>

        {props.submitError ? (
          <div
            style={{
              marginTop: 12,
              borderRadius: 16,
              padding: "10px 11px",
              background: "rgba(217,119,6,0.10)",
              border: "1px solid rgba(217,119,6,0.18)",
              color: "#92400e",
              fontSize: 12,
              lineHeight: 1.35,
              fontWeight: 820,
            }}
          >
            {props.submitError}
          </div>
        ) : null}

        {props.canSubmit ? (
          <form action={submitTripRegistrationAction} style={{ marginTop: 12 }}>
            <input type="hidden" name="tripId" value={props.tripId} />
            <button
              type="submit"
              style={{
                width: "100%",
                minHeight: 44,
                borderRadius: 16,
                border: "1px solid rgba(7,141,160,0.24)",
                background: "linear-gradient(135deg, #078da0, #0f766e)",
                color: "#ffffff",
                fontSize: 13.4,
                fontWeight: 950,
                cursor: "pointer",
                boxShadow: "0 14px 28px rgba(7,141,160,0.22)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span aria-hidden="true">🧭</span>
              Submit Registration
              <span aria-hidden="true">→</span>
            </button>
          </form>
        ) : null}
      </div>
    </Section>
  );
}

export default async function TravelerTripDetailPage({ params, searchParams }: TripPageProps) {
  const { tripId } = await params;
  const resolvedSearchParams = await searchParams;
  const submitted = resolvedSearchParams?.submitted === "1";
  const submitError = resolvedSearchParams?.submitError ? decodeURIComponent(resolvedSearchParams.submitError) : undefined;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=/traveler/trips/${tripId}`);
  }

  const { trip, error } = await getTrip(tripId);
  const dictionary = await getTravelerDictionary(user?.preferredLanguage || "en");

  const backToTripsLabel = t(dictionary, "tripDetail.nav.backToTrips", "Back to Trips");
  const navHomeLabel = t(dictionary, "tripDetail.nav.home", "Home");
  const navPassLabel = t(dictionary, "tripDetail.nav.pass", "Pass");
  const navPassportMapLabel = t(dictionary, "tripDetail.nav.passportMap", "Passport Map");
  const navLogoutLabel = t(dictionary, "tripDetail.nav.logout", "Logout");
  const headerEyebrow = t(dictionary, "tripDetail.header.eyebrow", "Trip Command Screen");
  const headerTitle = t(dictionary, "tripDetail.title", "View Trip");
  const headerBody = t(dictionary, "tripDetail.header.body", "Review your trip, clearance, booking, payment, and pass state.");
  const activeTripRecordLabel = t(dictionary, "tripDetail.hero.activeRecord", "Active Trip Record");
  const tripFallbackTitle = t(dictionary, "tripDetail.tripFallbackTitle", "Traveler Trip");
  const listedLabel = t(dictionary, "tripDetail.status.listed", "Listed");
  const notListedLabel = t(dictionary, "tripDetail.status.notListed", "Not Listed");
  const notIssuedLabel = t(dictionary, "tripDetail.status.notIssued", "Not Issued");

  const tripTitle = trip?.tripTitle || tripFallbackTitle;
  const tripStatusTheme = statusTheme(trip?.tripStatus);
  const clearanceTheme = statusTheme(trip?.clearanceStatus);
  const paymentTheme = statusTheme(trip?.currentPaymentState?.state);
  const passTheme = statusTheme(trip?.pass?.passStatus);
  const manifestTheme = statusTheme(trip?.manifestReadiness?.isManifestListed ? "LISTED" : "NOT LISTED");
  const bookingCurrency = trip?.currentBooking?.currencyCode || "PHP";
  const currentBookingFxDisplaySnapshot = trip?.currentBooking?.fxDisplaySnapshot ?? null;
  const canSubmitRegistration =
    String(trip?.tripStatus || "").toUpperCase() === "DRAFT" &&
    String(trip?.registrationStatus || "").toUpperCase() === "INCOMPLETE";

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
      <KuyaTalaEntryButton topic="trip" title="Ask Kuya Tala™ about this trip" note="Get guided help reading this trip, status, QR/pass context, payments, and readiness notes." />
      <div style={{ marginBottom: 16 }}>
        <AppLink href="/traveler/trips" label={backToTripsLabel} icon={<Icon kind="trips" />} />
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
          {headerEyebrow}
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
          View Trip
        </h1>
        <p style={{ marginTop: 9, marginBottom: 0, color: "#64748b", lineHeight: 1.4, fontSize: 14 }}>
          {headerBody}
        </p>
      </header>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <AppLink href="/traveler/home" label={navHomeLabel} icon={<Icon kind="home" />} />
        <AppLink href="/traveler/pass" label={navPassLabel} icon={<Icon kind="pass" />} />
        <AppLink href="/traveler/passport-map" label={navPassportMapLabel} icon={<Icon kind="map" />} />
        <AppLink href="/logout" label={navLogoutLabel} icon={<Icon kind="logout" />} />
      </div>

      {error ? (
        <Section title={t(dictionary, "tripDetail.loadError.title", "Load Error")} icon={<Icon kind="shield" />} tone="red">
          <p style={{ margin: 0, color: "#dc2626", fontSize: 14, lineHeight: 1.45, fontWeight: 800 }}>{error}</p>
        </Section>
      ) : null}

      {!trip ? null : (
        <>
          <section
            style={{
              border: "1px solid #bfeaf0",
              borderRadius: 24,
              background: "linear-gradient(180deg, #ecfeff 0%, #ffffff 100%)",
              padding: 16,
              marginBottom: 14,
              boxShadow: "0 14px 34px rgba(15,23,42,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: "#d6f6f8",
                  border: "1px solid #bfeaf0",
                  color: "#0ea5b7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "0 0 auto",
                }}
              >
                <Icon kind="trips" size={24} />
              </div>

              <div style={{ minWidth: 0, flex: "1 1 auto" }}>
                <div style={{ fontSize: 11, fontWeight: 950, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0e7490" }}>
                  Active Trip Record
                </div>
                <h2
                  style={{
                    margin: "6px 0 0",
                    fontSize: 24,
                    lineHeight: 1.05,
                    letterSpacing: "-0.045em",
                    color: "#19305a",
                  }}
                >
                  {tripTitle}
                </h2>
                <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 13, lineHeight: 1.35, fontWeight: 750 }}>
                  {formatDate(trip.arrivalDate)} – {formatDate(trip.departureDate)}
                </p>
              </div>
            </div>
          </section>

          <Section title={t(dictionary, "tripDetail.coreStatus.title", "Core Status")} icon={<Icon kind="shield" />} tone="default">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              <KeyValue label={t(dictionary, "tripDetail.coreStatus.trip", "Trip")} value={normalizeStatus(trip.tripStatus)} tone={tripStatusTheme} />
              <KeyValue label={t(dictionary, "tripDetail.coreStatus.clearance", "Clearance")} value={normalizeStatus(trip.clearanceStatus)} tone={clearanceTheme} />
              <KeyValue label={t(dictionary, "tripDetail.coreStatus.manifest", "Manifest")} value={trip.manifestReadiness?.isManifestListed ? listedLabel : notListedLabel} tone={manifestTheme} />
              <KeyValue label={t(dictionary, "tripDetail.coreStatus.pass", "Pass")} value={normalizeStatus(trip.pass?.passStatus || notIssuedLabel)} tone={passTheme} />
            </div>
          </Section>

          <SubmitRegistrationPanel
            tripId={trip.id}
            canSubmit={canSubmitRegistration}
            submitted={submitted}
            submitError={submitError}
          />

          <Section title={t(dictionary, "tripDetail.details.title", "Trip Details")} icon={<Icon kind="calendar" />} tone="blue">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              <KeyValue label={t(dictionary, "tripDetail.details.arrival", "Arrival")} value={formatDate(trip.arrivalDate)} />
              <KeyValue label={t(dictionary, "tripDetail.details.departure", "Departure")} value={formatDate(trip.departureDate)} />
              <KeyValue label={t(dictionary, "tripDetail.details.origin", "Origin")} value={trip.originLocation} />
              <KeyValue label={t(dictionary, "tripDetail.details.accommodation", "Accommodation")} value={trip.declaredAccommodationName} />
            </div>
          </Section>

          <Section title={t(dictionary, "tripDetail.members.title", "Trip Members")} icon={<Icon kind="person" />} tone="default">
            {Array.isArray(trip.members) && trip.members.length > 0 ? (
              <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
                {trip.members.map((member: any) => (
                  <div
                    key={member.id}
                    style={{
                      border: "1px solid #dbe8ef",
                      borderRadius: 18,
                      padding: 12,
                      background: "#ffffff",
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 950, color: "#19305a", marginBottom: 8 }}>
                      {member.fullName || t(dictionary, "tripDetail.members.fallbackName", "Trip Member")}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                      <KeyValue label={t(dictionary, "tripDetail.members.type", "Type")} value={normalizeStatus(member.memberType)} compact />
                      <KeyValue label={t(dictionary, "tripDetail.members.nationality", "Nationality")} value={member.nationalityCode} compact />
                      <KeyValue label={t(dictionary, "tripDetail.members.age", "Age")} value={member.age} compact />
                      <KeyValue label={t(dictionary, "tripDetail.members.primary", "Primary")} value={member.isPrimaryTraveler ? t(dictionary, "tripDetail.members.yes", "Yes") : t(dictionary, "tripDetail.members.no", "No")} compact />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ marginTop: 0, color: "#64748b", fontSize: 14, lineHeight: 1.45 }}>{t(dictionary, "tripDetail.members.empty", "No trip members yet.")}</p>
            )}

            <div
              style={{
                border: "1px solid #dbe8ef",
                borderRadius: 18,
                background: "#f8fbfd",
                padding: 12,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 950, color: "#19305a", marginBottom: 10 }}>
                {t(dictionary, "tripDetail.companion.title", "Add Companion")}
              </div>

              <form action={addCompanion} style={{ display: "grid", gap: 10 }}>
                <input type="hidden" name="tripId" value={trip.id} />

                <input
                  name="fullName"
                  required
                  placeholder={t(dictionary, "tripDetail.companion.fullNamePlaceholder", "Companion full name")}
                  style={{
                    minHeight: 40,
                    borderRadius: 12,
                    border: "1px solid #dbe8ef",
                    padding: "0 12px",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                  <input
                    name="nationalityCode"
                    placeholder={t(dictionary, "tripDetail.companion.nationalityPlaceholder", "PH")}
                    style={{
                      minHeight: 40,
                      borderRadius: 12,
                      border: "1px solid #dbe8ef",
                      padding: "0 12px",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  />
                  <input
                    name="age"
                    type="number"
                    min="0"
                    placeholder={t(dictionary, "tripDetail.companion.agePlaceholder", "Age")}
                    style={{
                      minHeight: 40,
                      borderRadius: 12,
                      border: "1px solid #dbe8ef",
                      padding: "0 12px",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  />
                </div>

                <input
                  name="passportOrIdHint"
                  placeholder={t(dictionary, "tripDetail.companion.passportPlaceholder", "Passport / ID hint")}
                  style={{
                    minHeight: 40,
                    borderRadius: 12,
                    border: "1px solid #dbe8ef",
                    padding: "0 12px",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                />

                <div>
                  <AppButton label={t(dictionary, "tripDetail.companion.submit", "Add Companion")} icon={<Icon kind="plus" />} tone="teal" />
                </div>
              </form>
            </div>
          </Section>

          <Section title={t(dictionary, "tripDetail.bookingSummary.title", "Booking Summary")} icon={<Icon kind="booking" />} tone="blue">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              <KeyValue label={t(dictionary, "tripDetail.bookingSummary.total", "Total")} value={trip.bookingSummary?.totalLinkedBookings} />
              <KeyValue label={t(dictionary, "tripDetail.bookingSummary.paid", "Paid")} value={trip.bookingSummary?.paidBookings} tone={statusTheme("PAID")} />
              <KeyValue label={t(dictionary, "tripDetail.bookingSummary.unpaid", "Unpaid")} value={trip.bookingSummary?.unpaidBookings} tone={statusTheme("UNPAID")} />
              <KeyValue label={t(dictionary, "tripDetail.bookingSummary.latestRef", "Latest Ref")} value={trip.currentBooking?.bookingReference || "—"} />
            </div>
          </Section>

          <Section title={t(dictionary, "tripDetail.currentBooking.title", "Current Booking")} icon={<Icon kind="receipt" />} tone="default">
            <div style={{ display: "grid", gap: 8 }}>
              <KeyValue label={t(dictionary, "tripDetail.currentBooking.reference", "Booking Reference")} value={trip.currentBooking?.bookingReference} />
              <KeyValue label={t(dictionary, "tripDetail.currentBooking.status", "Booking Status")} value={normalizeStatus(trip.currentBooking?.bookingStatus)} tone={statusTheme(trip.currentBooking?.bookingStatus)} />
              <KeyValue label={t(dictionary, "tripDetail.currentBooking.total", "Booking Total")} value={formatMoney(trip.currentBooking?.bookingTotalPhp, bookingCurrency)} />
              <KeyValue label={t(dictionary, "tripDetail.currentBooking.currency", "Currency")} value={bookingCurrency} />
            </div>

            {currentBookingFxDisplaySnapshot ? (
              <div
                style={{
                  marginTop: 10,
                  borderRadius: 18,
                  border: "1px solid rgba(37,99,235,0.16)",
                  background: "linear-gradient(180deg, rgba(239,246,255,0.92) 0%, rgba(255,255,255,0.98) 100%)",
                  padding: 11,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                  <KeyValue
                    label={t(dictionary, "tripDetail.fx.displayEstimate", "Display Estimate")}
                    value={formatFxDisplayAmount(currentBookingFxDisplaySnapshot)}
                    tone={{ bg: "#eff6ff", border: "#cfe0f7", color: "#2563eb" }}
                  />
                  <KeyValue
                    label={t(dictionary, "tripDetail.fx.rate", "FX Rate")}
                    value={formatFxRate(currentBookingFxDisplaySnapshot)}
                    tone={{ bg: "#f8fafc", border: "#e2e8f0", color: "#475569" }}
                  />
                  <KeyValue
                    label={t(dictionary, "tripDetail.fx.source", "FX Source")}
                    value={currentBookingFxDisplaySnapshot.fxSource}
                    tone={{ bg: "#f8fafc", border: "#e2e8f0", color: "#475569" }}
                  />
                  <KeyValue
                    label={t(dictionary, "tripDetail.fx.asOf", "Rate As Of")}
                    value={formatDate(currentBookingFxDisplaySnapshot.fxAsOf)}
                    tone={{ bg: "#f8fafc", border: "#e2e8f0", color: "#475569" }}
                  />
                </div>

                <p style={{ margin: "9px 0 0", color: "#64748b", fontSize: 11.5, lineHeight: 1.35, fontWeight: 750 }}>
                  {t(dictionary, "tripDetail.fx.note", "FX is shown as a traveler display estimate only. PHP remains the booking and settlement source of truth.")}
                </p>
              </div>
            ) : null}
          </Section>

          <Section title={t(dictionary, "tripDetail.paymentStatus.title", "Payment Status")} icon={<Icon kind="payment" />} tone="amber">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              <KeyValue label={t(dictionary, "tripDetail.paymentStatus.state", "State")} value={normalizeStatus(trip.currentPaymentState?.state)} tone={paymentTheme} />
              <KeyValue label={t(dictionary, "tripDetail.paymentStatus.paid", "Paid")} value={formatMoney(trip.currentPaymentState?.paidAmountPhp, bookingCurrency)} tone={statusTheme("PAID")} />
              <KeyValue label={t(dictionary, "tripDetail.paymentStatus.unpaid", "Unpaid")} value={formatMoney(trip.currentPaymentState?.unpaidAmountPhp, bookingCurrency)} tone={statusTheme("UNPAID")} />
              <KeyValue label={t(dictionary, "tripDetail.paymentStatus.intent", "Intent")} value={trip.currentPaymentIntent?.intentReference || "—"} />
            </div>
          </Section>

          <Section title={t(dictionary, "tripDetail.paymentActions.title", "Payment Actions")} icon={<Icon kind="payment" />} tone="amber">
            {!trip.currentBooking?.id ? (
              <p style={{ margin: 0, color: "#64748b", fontSize: 14, lineHeight: 1.45 }}>
                {t(dictionary, "tripDetail.paymentActions.noBooking", "No current booking is linked to this trip yet, so payment actions are unavailable.")}
              </p>
            ) : (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <form action={createPaymentIntentAction}>
                  <input type="hidden" name="tripId" value={trip.id} />
                  <input type="hidden" name="bookingId" value={trip.currentBooking.id} />
                  <AppButton label={t(dictionary, "tripDetail.paymentActions.create", "Create Payment")} icon={<Icon kind="plus" />} tone="amber" />
                </form>

                {trip.currentPaymentIntent?.id ? (
                  <>
                    <form action={confirmPaymentIntentAction}>
                      <input type="hidden" name="tripId" value={trip.id} />
                      <input type="hidden" name="intentId" value={trip.currentPaymentIntent.id} />
                      <AppButton label={t(dictionary, "tripDetail.paymentActions.confirm", "Confirm Payment")} icon={<Icon kind="check" />} tone="green" />
                    </form>

                    <AppLink
                      href={`/traveler/payments/${trip.currentPaymentIntent.id}`}
                      label={t(dictionary, "tripDetail.paymentActions.detail", "Payment Detail")}
                      icon={<Icon kind="receipt" />}
                      primary
                      tone="blue"
                    />
                  </>
                ) : null}
              </div>
            )}
          </Section>

          <Section title={t(dictionary, "tripDetail.passAccess.title", "Pass Access")} icon={<Icon kind="pass" />} tone="green">
            <div style={{ display: "grid", gap: 8 }}>
              <KeyValue label={t(dictionary, "tripDetail.passAccess.passCode", "Pass Code")} value={trip.pass?.passCode} />
              <KeyValue label={t(dictionary, "tripDetail.passAccess.passStatus", "Pass Status")} value={normalizeStatus(trip.pass?.passStatus || notIssuedLabel)} tone={passTheme} />
              <KeyValue label={t(dictionary, "tripDetail.passAccess.qrVersion", "QR Version")} value={trip.pass?.qrCredential?.qrVersion} />
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <AppLink href="/traveler/pass" label={t(dictionary, "tripDetail.passAccess.openPass", "Open Pass")} icon={<Icon kind="pass" />} primary tone="green" />
              <AppLink href="/traveler/passport-map" label={t(dictionary, "tripDetail.passAccess.passportMap", "Passport Map")} icon={<Icon kind="map" />} />
            </div>
          </Section>

          {Array.isArray(trip.bookingLinks) && trip.bookingLinks.length > 0 ? (
            <Section title={t(dictionary, "tripDetail.paymentHistory.title", "Payment History")} icon={<Icon kind="receipt" />} tone="default">
              <div style={{ display: "grid", gap: 10 }}>
                {trip.bookingLinks.map((link: any) => (
                  <div
                    key={link.id}
                    style={{
                      border: "1px solid #dbe8ef",
                      borderRadius: 18,
                      background: "#ffffff",
                      padding: 12,
                    }}
                  >
                    <div style={{ display: "grid", gap: 8 }}>
                      <KeyValue label={t(dictionary, "tripDetail.paymentHistory.bookingReference", "Booking Reference")} value={link.booking?.bookingReference} />
                      <KeyValue label={t(dictionary, "tripDetail.paymentHistory.bookingStatus", "Booking Status")} value={normalizeStatus(link.booking?.bookingStatus)} tone={statusTheme(link.booking?.bookingStatus)} />
                      <KeyValue label={t(dictionary, "tripDetail.paymentHistory.paymentState", "Payment State")} value={normalizeStatus(link.booking?.paymentState?.state)} tone={statusTheme(link.booking?.paymentState?.state)} />
                      <KeyValue label={t(dictionary, "tripDetail.paymentHistory.latestIntent", "Latest Intent")} value={link.booking?.latestPaymentIntent?.intentReference} />
                    </div>

                    {link.booking?.latestPaymentIntent?.id ? (
                      <div style={{ marginTop: 10 }}>
                        <AppLink
                          href={`/traveler/payments/${link.booking.latestPaymentIntent.id}`}
                          label={t(dictionary, "tripDetail.paymentActions.detail", "Payment Detail")}
                          icon={<Icon kind="receipt" />}
                          primary
                          tone="blue"
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </Section>
          ) : null}

          <Section title={t(dictionary, "tripDetail.technical.title", "Technical Record")} icon={<Icon kind="manifest" />} tone="default">
            <div style={{ display: "grid", gap: 8 }}>
              <KeyValue label={t(dictionary, "tripDetail.technical.tripId", "Trip ID")} value={trip.id} />
              <KeyValue label={t(dictionary, "tripDetail.technical.manifestRef", "Manifest Ref")} value={trip.manifestReadiness?.latestManifestReference} />
              <KeyValue label={t(dictionary, "tripDetail.technical.bookingId", "Booking ID")} value={trip.currentBooking?.id} />
              <KeyValue label={t(dictionary, "tripDetail.technical.paymentIntentId", "Payment Intent ID")} value={trip.currentPaymentIntent?.id} />
            </div>
          </Section>
        </>
      )}
    </main>
  );
}
