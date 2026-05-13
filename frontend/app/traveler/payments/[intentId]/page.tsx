import { getApiBaseUrl, requireAccessToken } from "../../../../src/lib/server-auth";
import KuyaTalaEntryButton from "../../../../src/traveler-assistant/KuyaTalaEntryButton";
import UniversalTravelerBottomTabBar from "../../../../src/components/traveler/UniversalTravelerBottomTabBar";
import { redirect } from "next/navigation";
import { getGlRoutePriceAnchor, SUPPORTED_GL_PAYMENT_SLUGS } from "../../../../src/spm/traveler/glRoutePriceAnchors";

type TravelerDictionary = Record<string, string>;

const paymentDetailDictionaryFallback: TravelerDictionary = {
  "paymentDetail.nav.backToTrips": "Back to Payments",
  "paymentDetail.nav.home": "Home",
  "paymentDetail.nav.myTrips": "Trips",
  "paymentDetail.nav.logout": "Logout",
  "paymentDetail.header.eyebrow": "Payment",
  "paymentDetail.title": "Payment",
  "paymentDetail.header.body": "Review amount, status, receipt, and linked trip.",
  "paymentDetail.status.verified": "Paid",
  "paymentDetail.status.pending": "Pending",
  "paymentDetail.status.attention": "Needs Attention",
  "paymentDetail.status.record": "Payment",
  "paymentDetail.status.fallback": "Record",
  "paymentDetail.intentFallback": "Payment record",
  "paymentDetail.loadError.title": "Load Error",
  "paymentDetail.receipt.title": "Receipt",
  "paymentDetail.receipt.amount": "Amount",
  "paymentDetail.receipt.currency": "Currency",
  "paymentDetail.receipt.status": "Status",
  "paymentDetail.receipt.provider": "Provider",
  "paymentDetail.fx.displayEstimate": "Display Estimate",
  "paymentDetail.fx.rate": "FX Rate",
  "paymentDetail.fx.source": "FX Source",
  "paymentDetail.fx.asOf": "Rate As Of",
  "paymentDetail.fx.note": "PHP remains the settlement amount.",
  "paymentDetail.state.title": "Status",
  "paymentDetail.state.state": "State",
  "paymentDetail.state.paid": "Paid",
  "paymentDetail.state.unpaid": "Unpaid",
  "paymentDetail.state.updated": "Updated",
  "paymentDetail.booking.title": "Linked Booking",
  "paymentDetail.booking.bookingId": "Booking ID",
  "paymentDetail.booking.intentReference": "Intent Reference",
  "paymentDetail.booking.paymentIntentId": "Ref. ID",
  "paymentDetail.booking.lastPaymentIntent": "Last Ref.",
  "paymentDetail.timeline.title": "Timeline",
  "paymentDetail.timeline.confirmedAt": "Confirmed At",
  "paymentDetail.timeline.createdAt": "Created At",
  "paymentDetail.timeline.updatedAt": "Updated At",
  "paymentDetail.actions.title": "Next Step",
  "paymentDetail.actions.note": "Your receipt stays linked to this trip.",
};

async function getTravelerDictionary(languageCode?: string | null): Promise<TravelerDictionary> {
  try {
    const res = await fetchWithTimeout(`${getApiBaseUrl()}/language-packs/${encodeURIComponent(languageCode || "en")}/dictionary?scope=traveler`, {
      cache: "no-store",
    }, 5000);

    if (!res.ok) return paymentDetailDictionaryFallback;

    const payload = await res.json();
    const dictionary = payload?.dictionary;

    if (!dictionary || typeof dictionary !== "object") return paymentDetailDictionaryFallback;

    return {
      ...paymentDetailDictionaryFallback,
      ...dictionary,
    };
  } catch {
    return paymentDetailDictionaryFallback;
  }
}

function t(dictionary: TravelerDictionary, key: string, fallback: string) {
  return dictionary?.[key] || fallback;
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

type PaymentPageProps = {
  params: Promise<{
    intentId: string;
  }>;
  searchParams?: Promise<{
    payment?: string;
    source?: string;
    slug?: string;
    seats?: string;
    time?: string;
    amount?: string;
  }>;
};

async function confirmPaymentIntentAction(formData: FormData) {
  "use server";

  const intentId = String(formData.get("intentId") || "").trim();

  if (!intentId) {
    redirect("/traveler/trips");
  }

  const token = await requireAccessToken();
  const baseUrl = getApiBaseUrl();

  const res = await fetchWithTimeout(`${baseUrl}/payments/intents/${intentId}/confirm`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      providerReference: `SIMULATED-PAYMENT-${intentId}`,
      paymentMethod: "SIMULATED",
      notes: "Traveler clicked Pay via Payment provider / QR PH CTA from Payment page.",
    }),
  }, 8000);

  if (!res.ok) {
    redirect(`/traveler/payments/${encodeURIComponent(intentId)}?payment=failed`);
  }

  redirect(`/traveler/payments/${encodeURIComponent(intentId)}?payment=confirmed`);
}

async function createPaymentProviderCheckoutAction(formData: FormData) {
  "use server";

  const intentId = String(formData.get("intentId") || "").trim();
  const amountPhp = Number(formData.get("amountPhp") || 0);
  const intentReference = String(formData.get("intentReference") || intentId).trim();

  if (!intentId || !Number.isFinite(amountPhp) || amountPhp <= 0) {
    redirect("/traveler/trips");
  }

  const secretKey =
    process.env.PAYMONGO_TEST_SECRET_KEY ||
    process.env.PAYMONGO_SECRET_KEY ||
    process.env.PAYMONGO_SK_TEST;

  if (!secretKey) {
    redirect(`/traveler/payments/${encodeURIComponent(intentId)}/sandbox-handoff?provider=paymongo&reason=paymongo-key-missing&amount=${encodeURIComponent(String(amountPhp))}`);
  }

  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_BASE_URL ||
    process.env.APP_BASE_URL ||
    process.env.FRONTEND_BASE_URL ||
    "";

  if (appBaseUrl.length === 0) {
    redirect(`/traveler/payments/${encodeURIComponent(intentId)}/sandbox-handoff?provider=paymongo&reason=paymongo-base-url-missing&amount=${encodeURIComponent(String(amountPhp))}`);
  }

  const amountCentavos = Math.round(amountPhp * 100);
  const auth = Buffer.from(`${secretKey}:`).toString("base64");

  const res = await fetchWithTimeout("https://api.paymongo.com/v1/checkout_sessions", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          billing: {
            name: "One Siargao Pass Traveler",
            email: "sales@leadwork.online",
          },
          description: `One Siargao Pass Payment ${intentReference}`,
          line_items: [
            {
              currency: "PHP",
              amount: amountCentavos,
              name: "One Siargao Pass Booking Payment",
              quantity: 1,
            },
          ],
          payment_method_types: ["qrph"],
          send_email_receipt: false,
          show_description: true,
          show_line_items: true,
          success_url: `${appBaseUrl}/traveler/payments/${encodeURIComponent(intentId)}?payment=paymongo-success`,
          cancel_url: `${appBaseUrl}/traveler/payments/${encodeURIComponent(intentId)}?payment=paymongo-cancelled`,
          metadata: {
            osp_payment_intent_id: intentId,
            osp_intent_reference: intentReference,
            integration_mode: "paymongo_sandbox_checkout_qrph",
          },
        },
      },
    }),
  }, 12000);

  let payload: any = null;
  try {
    payload = await res.json();
  } catch {}

  const checkoutUrl = payload?.data?.attributes?.checkout_url;

  if (!res.ok || !checkoutUrl) {
    redirect(`/traveler/payments/${encodeURIComponent(intentId)}?payment=paymongo-checkout-failed`);
  }

  redirect(checkoutUrl);
}

async function getPaymentIntent(intentId: string) {
  const baseUrl = getApiBaseUrl();

  try {
    const token = await requireAccessToken();

    const res = await fetchWithTimeout(`${baseUrl}/payments/intents/${intentId}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }, 8000);

    if (!res.ok) {
      return {
        error: `Failed to load payment intent: HTTP ${res.status}`,
        intent: null,
      };
    }

    const intent = await res.json();
    return { intent, error: null };
  } catch (error: any) {
    return {
      error: error?.name === "AbortError" ? "Payment detail request timed out. The payment record exists, but the detail API did not respond in time." : error?.message || "Unknown payment intent load failure",
      intent: null,
    };
  }
}

function normalizeStatus(value: any) {
  if (!value) return "—";
  return String(value)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

function formatDate(value: any) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function isPaymentSettled(intent: any, status: string) {
  const normalizedStatus = String(status || "").toUpperCase();
  const normalizedState = String(intent?.paymentState?.state || "").toUpperCase();

  return normalizedStatus === "PAID" || normalizedState === "PAID";
}

function getGatewayStatusMessage(paymentStatus?: string) {
  if (paymentStatus === "paymongo-key-missing") {
    return {
      tone: "amber",
      title: "Payment Checkout key is missing.",
      body: "The payment record is ready, but checkout cannot open until PAYMONGO_TEST_SECRET_KEY is configured in the server environment.",
    };
  }

  if (paymentStatus === "paymongo-base-url-missing") {
    return {
      tone: "amber",
      title: "Payment redirect base URL is missing.",
      body: "Checkout cannot open until APP_BASE_URL, FRONTEND_BASE_URL, or NEXT_PUBLIC_APP_BASE_URL is configured in the server environment.",
    };
  }

  if (paymentStatus === "paymongo-checkout-failed") {
    return {
      tone: "red",
      title: "Payment checkout could not be created.",
      body: "Checkout is temporarily unavailable. Please review payment setup before retrying.",
    };
  }

  if (paymentStatus === "paymongo-cancelled") {
    return {
      tone: "amber",
      title: "Checkout was cancelled.",
      body: "No payment was marked as paid. You can try opening Payment provider QR PH checkout again.",
    };
  }

  if (paymentStatus === "paymongo-success") {
    return {
      tone: "green",
      title: "Returned from payment checkout.",
      body: "Payment confirmation is being checked.",
    };
  }

  return null;
}

function getPaymentProviderGatewayConfig() {
  const secretKey =
    process.env.PAYMONGO_TEST_SECRET_KEY ||
    process.env.PAYMONGO_SECRET_KEY ||
    process.env.PAYMONGO_SK_TEST ||
    "";

  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_BASE_URL ||
    process.env.APP_BASE_URL ||
    process.env.FRONTEND_BASE_URL ||
    "";

  const hasBaseUrl = Boolean(appBaseUrl);
  const isReady = Boolean(secretKey && hasBaseUrl);

  const mode = secretKey.includes("_test_") || secretKey.startsWith("sk_test")
    ? "SANDBOX"
    : secretKey
      ? "PRODUCTION"
      : "NOT_CONFIGURED";

  return {
    hasSecretKey: Boolean(secretKey),
    hasBaseUrl,
    isReady,
    appBaseUrl,
    mode,
  };
}

function formatDateTime(value: any) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

function statusTheme(value: any, dictionary: TravelerDictionary = paymentDetailDictionaryFallback) {
  const normalized = String(value || "").toUpperCase();

  if (
    normalized.includes("PAID") ||
    normalized.includes("CONFIRMED") ||
    normalized.includes("SUCCESS") ||
    normalized.includes("COMPLETED")
  ) {
    return { bg: "#EAFBFA", border: "#BFECEE", color: "#0596A5", label: t(dictionary, "paymentDetail.status.verified", "Paid") };
  }

  if (
    normalized.includes("PENDING") ||
    normalized.includes("UNPAID") ||
    normalized.includes("WAITING") ||
    normalized.includes("PROCESSING")
  ) {
    return { bg: "#fff8eb", border: "#f6e1b5", color: "#d97706", label: t(dictionary, "paymentDetail.status.pending", "Pending") };
  }

  if (
    normalized.includes("FAILED") ||
    normalized.includes("CANCELLED") ||
    normalized.includes("BLOCKED") ||
    normalized.includes("DENIED")
  ) {
    return { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", label: t(dictionary, "paymentDetail.status.attention", "Needs Attention") };
  }

  return { bg: "#F4FCFA", border: "#BFECEE", color: "#013863", label: t(dictionary, "paymentDetail.status.record", "Payment") };
}

function Icon(props: {
  kind:
    | "home"
    | "trips"
    | "logout"
    | "payment"
    | "receipt"
    | "check"
    | "clock"
    | "alert"
    | "booking"
    | "shield"
    | "currency"
    | "calendar";
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

  if (props.kind === "logout") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M10 7V5.5A2.5 2.5 0 0 1 12.5 3H18v18h-5.5A2.5 2.5 0 0 1 10 18.5V17" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 12h10M11 9l3 3-3 3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
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

  if (props.kind === "check") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M5 12.5l4.2 4.2L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (props.kind === "clock") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.9" />
        <path d="M12 7.5V12l3.2 2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (props.kind === "alert") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M12 4.2 21 19H3L12 4.2Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M12 9v4M12 16.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

  if (props.kind === "shield") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M12 3.5 18.5 6v5.2c0 4.2-2.7 7.5-6.5 9.3-3.8-1.8-6.5-5.1-6.5-9.3V6L12 3.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M8.8 12.1 11 14.2l4.4-4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (props.kind === "currency") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
        <path d="M8 4h5.5a4 4 0 0 1 0 8H8V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 12h6a4 4 0 0 1 0 8H8V12ZM6 8h11M6 16h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      <rect x="4" y="6.5" width="16" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 4v4M16 4v4M4 10.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Section(props: { title: string; children: any; icon?: any; tone?: "default" | "green" | "amber" | "blue" | "red" }) {
  const themes: Record<string, any> = {
    default: { bg: "#ffffff", border: "#dbe8ef", color: "#19305a" },
    green: { bg: "#EAFBFA", border: "#BFECEE", color: "#0596A5" },
    amber: { bg: "#fff8eb", border: "#f6e1b5", color: "#d97706" },
    blue: { bg: "#F4FCFA", border: "#BFECEE", color: "#013863" },
    red: { bg: "#fef2f2", border: "#fecaca", color: "#dc2626" },
  };

  const theme = themes[props.tone || "default"];

  return (
    <section
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 13,
        marginBottom: 10,
        background: theme.bg,
        boxShadow: "0 12px 30px rgba(15,23,42,0.045)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
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
        <h2 style={{ margin: 0, fontSize: 17, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#19305a" }}>
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
    teal: { bg: "#0596A5", border: "#0596A5", color: "#ffffff", shadow: "rgba(5,150,165,0.22)" },
    amber: { bg: "#d97706", border: "#d97706", color: "#ffffff", shadow: "rgba(217,119,6,0.22)" },
    green: { bg: "#0596A5", border: "#0596A5", color: "#ffffff", shadow: "rgba(5,150,165,0.20)" },
    blue: { bg: "#013863", border: "#013863", color: "#ffffff", shadow: "rgba(37,99,235,0.20)" },
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


type AccommodationPaymentPreview = {
  intentId: string;
  stayName: string;
  stayType: string;
  location: string;
  amountLabel: string;
  amountPhp: number;
  feeLabel: string;
  totalLabel: string;
  settlementMode: string;
  statusLabel: string;
  detailHref: string;
};

const accommodationPaymentPreviews: AccommodationPaymentPreview[] = [
  {
    intentId: "preview-accommodation-general-luna-surf-stay",
    stayName: "General Luna Surf Stay",
    stayType: "Homestay / Surf Stay",
    location: "General Luna · near surf access",
    amountLabel: "PHP 2,500",
    amountPhp: 2500,
    feeLabel: "Payment fee calculated on confirmed checkout",
    totalLabel: "PHP 2,500 preview",
    settlementMode: "Secure checkout handoff",
    statusLabel: "Checkout ready",
    detailHref: "/traveler/explore/stays/preview-general-luna-surf-stay",
  },
  {
    intentId: "preview-accommodation-cloud-9-family-villa",
    stayName: "Cloud 9 Family Villa",
    stayType: "Villa",
    location: "Cloud 9 / Catangnan area",
    amountLabel: "PHP 6,800",
    amountPhp: 6800,
    feeLabel: "Payment fee calculated on confirmed checkout",
    totalLabel: "PHP 6,800 preview",
    settlementMode: "Secure checkout handoff",
    statusLabel: "Checkout ready",
    detailHref: "/traveler/explore/stays/preview-cloud-9-family-villa",
  },
  {
    intentId: "preview-accommodation-barkada-hostel-siargao",
    stayName: "Barkada Hostel Siargao",
    stayType: "Hostel / Barkada Room",
    location: "Tourism Road access",
    amountLabel: "PHP 950",
    amountPhp: 950,
    feeLabel: "Payment fee calculated on confirmed checkout",
    totalLabel: "PHP 950 preview",
    settlementMode: "Secure checkout handoff",
    statusLabel: "Checkout ready",
    detailHref: "/traveler/explore/stays/preview-barkada-hostel-siargao",
  },
  {
    intentId: "preview-accommodation-town-center-inn",
    stayName: "Town Center Inn",
    stayType: "Guesthouse",
    location: "General Luna town center",
    amountLabel: "PHP 3,200",
    amountPhp: 3200,
    feeLabel: "Payment fee calculated on confirmed checkout",
    totalLabel: "PHP 3,200 preview",
    settlementMode: "Secure checkout handoff",
    statusLabel: "Checkout ready",
    detailHref: "/traveler/explore/stays/preview-town-center-inn",
  },
];

function getAccommodationPaymentPreview(intentId: string) {
  return accommodationPaymentPreviews.find((preview) => preview.intentId === intentId);
}

function AccommodationPaymentGatewayPreview({ preview, paymentStatus }: { preview: AccommodationPaymentPreview; paymentStatus?: string }) {
  const gatewayButtonStyle: React.CSSProperties = {
    minHeight: 58,
    width: "100%",
    borderRadius: 18,
    border: "1px solid #013863",
    background: "linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 100%)",
    color: "#013863",
    fontSize: 15,
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: "0 16px 34px rgba(1,56,99,0.24)",
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
  };

  const gatewayKeyMissing = paymentStatus === "paymongo-key-missing";
  const gatewayReturned = paymentStatus === "paymongo-returned";
  let gatewayStateLabel = "Checkout ready";

  if (gatewayKeyMissing) {
    gatewayStateLabel = "Checkout setup needed";
  }

  if (gatewayReturned) {
    gatewayStateLabel = "Returned";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, rgba(0,151,167,0.08), transparent 28%), linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 48%, #FFFFFF 100%)",
        padding: "12px 12px 44px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <nav style={{ display: "flex", gap: 8, marginBottom: 10, overflowX: "auto", paddingBottom: 2 }}>
          <a
            href={preview.detailHref}
            style={{
              minHeight: 42,
              borderRadius: 16,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.16)",
              color: "#013863",
              fontSize: 12.5,
              fontWeight: 950,
              padding: "0 13px",
              flex: "0 0 auto",
            }}
          >
            ← Back to Stay
          </a>
          <a
            href="/traveler/explore/stays"
            style={{
              minHeight: 42,
              borderRadius: 16,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.16)",
              color: "#013863",
              fontSize: 12.5,
              fontWeight: 950,
              padding: "0 13px",
              flex: "0 0 auto",
            }}
          >
            Change stay
          </a>
        </nav>

        <section
          style={{
            borderRadius: 20,
            background: "linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 100%)",
            color: "#013863",
            padding: 13,
            boxShadow: "0 18px 42px rgba(1,56,99,0.08)",
          }}
        >
          <p style={{ margin: 0, color: "#F3AE26", fontSize: 11, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
            Payment Checkout
          </p>
          <div
            style={{
              marginTop: 9,
              borderRadius: 20,
              background: "#EAFBFA",
              border: "1px solid rgba(5,150,165,0.18)",
              padding: "13px 14px",
              boxShadow: "0 10px 22px rgba(1,56,99,0.08)",
            }}
          >
            <div
              role="heading"
              aria-level={1}
              style={{
                margin: 0,
                fontSize: 20,
                lineHeight: 1.02,
                letterSpacing: "-0.055em",
                fontWeight: 950,
                color: "#013863",
              }}
            >
              Continue to checkout
            </div>
          </div>
          <p style={{ margin: "13px 0 0", color: "#50668B", fontSize: 12.5, lineHeight: 1.22, fontWeight: 800 }}>
            Review the stay amount before checkout.
          </p>
        </section>

        {gatewayKeyMissing || gatewayReturned ? (
          <section
            style={{
              marginTop: 14,
              borderRadius: 20,
              background: gatewayKeyMissing ? "#FFF8EA" : "#F4FCFA",
              border: gatewayKeyMissing ? "1px solid rgba(243,174,38,0.42)" : "1px solid rgba(0,151,167,0.18)",
              padding: 13,
              color: "#013863",
              boxShadow: "0 14px 34px rgba(1,56,99,0.06)",
            }}
          >
            <p style={{ margin: 0, color: gatewayKeyMissing ? "#8A5A00" : "#0097A7", fontSize: 11, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {gatewayStateLabel}
            </p>
            <p style={{ margin: "6px 0 0", color: "#50668B", fontSize: 12.5, lineHeight: 1.22, fontWeight: 800 }}>
              {gatewayKeyMissing
                ? "Payment Checkout credentials are not configured yet. The payment button now opens the OSP payment handoff page for checkout continuity."
                : "Checkout returned. You can retry if needed."}
            </p>
          </section>
        ) : null}

        <section
          style={{
            marginTop: 14,
            borderRadius: 26,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 18px 46px rgba(1,56,99,0.08)",
            padding: 13,
          }}
        >
          <p style={{ margin: 0, color: "#0097A7", fontSize: 11, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
            Selected accommodation
          </p>
          <h2 style={{ margin: "7px 0 0", color: "#013863", fontSize: 20, lineHeight: 1.02, letterSpacing: "-0.045em", fontWeight: 950 }}>
            {preview.stayName}
          </h2>
          <p style={{ margin: "8px 0 0", color: "#50668B", fontSize: 12.5, lineHeight: 1.24, fontWeight: 800 }}>
            {preview.stayType} · {preview.location}
          </p>

          <div style={{ display: "grid", gap: 7, marginTop: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 7,
                borderRadius: 16,
                background: "#F4FCFA",
                border: "1px solid rgba(0,151,167,0.16)",
                padding: "12px 13px",
              }}
            >
              <span style={{ color: "#50668B", fontSize: 12, fontWeight: 900 }}>Amount</span>
              <strong style={{ color: "#013863", fontSize: 12.5, textAlign: "right" }}>{preview.amountLabel}</strong>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 7,
                borderRadius: 16,
                background: "#F4FCFA",
                border: "1px solid rgba(0,151,167,0.16)",
                padding: "12px 13px",
              }}
            >
              <span style={{ color: "#50668B", fontSize: 12, fontWeight: 900 }}>Checkout mode</span>
              <strong style={{ color: "#8A5A00", fontSize: 12.5, textAlign: "right" }}>Payment Checkout</strong>
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop: 14,
            borderRadius: 26,
            background: "linear-gradient(180deg, #FFF8EA 0%, #FFFFFF 100%)",
            border: "1px solid rgba(243,174,38,0.42)",
            boxShadow: "0 18px 46px rgba(1,56,99,0.08)",
            padding: 13,
          }}
        >
          <p style={{ margin: 0, color: "#8A5A00", fontSize: 11, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase" }}>
            Checkout
          </p>
          <h2 style={{ margin: "7px 0 0", color: "#013863", fontSize: 19, lineHeight: 1.08, letterSpacing: "-0.045em", fontWeight: 950 }}>
            {gatewayKeyMissing ? "Continue checkout for this stay." : "Continue checkout for this stay."}
          </h2>
          <p style={{ margin: "9px 0 0", color: "#50668B", fontSize: 12.5, lineHeight: 1.24, fontWeight: 750 }}>
            {gatewayKeyMissing
              ? "The payment action is ready. When payment keys are available, checkout opens here."
              : "This will open secure checkout for the selected amount."}
          </p>

          <form
            action={createPaymentProviderCheckoutAction}
            style={{
              display: "grid",
              gap: 8,
              marginTop: 15,
              position: "relative",
              zIndex: 5,
            }}
          >
            <input type="hidden" name="intentId" value={preview.intentId} />
            <input type="hidden" name="paymentIntentId" value={preview.intentId} />
            <input type="hidden" name="intentReference" value={preview.intentId} />
            <input type="hidden" name="amountPhp" value={String(preview.amountPhp)} />
            <input type="hidden" name="amount" value={String(preview.amountPhp)} />
            <input type="hidden" name="description" value={`Accommodation payment · ${preview.stayName}`} />
            <input type="hidden" name="source" value="ACCOMMODATION_SANDBOX_GATEWAY" />
            <button
              type="submit"
              aria-label={gatewayKeyMissing ? "Retry secure checkout" : "Open secure checkout"}
              style={{
                minHeight: 56,
                width: "100%",
                borderRadius: 18,
                border: "1px solid #013863",
                background: "linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 100%)",
                color: "#013863",
                fontSize: 15,
                fontWeight: 950,
                cursor: "pointer",
                boxShadow: "0 16px 34px rgba(1,56,99,0.24)",
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {gatewayKeyMissing ? "Continue Checkout" : "Open Secure Checkout"}
            </button>
          </form>
        </section>
      </div>
    
        <div aria-hidden="true" style={{ height: 120 }} />
      </main>
  );
}



function TourSandboxPaymentRecordFallback(props: {
  intentId: string;
  paymentStatus?: string;
  slug?: string;
  seats?: string;
  time?: string;
  amount?: string;
}) {
  const isSuccess = props.paymentStatus === "paymongo-success";
  const record = getGlRoutePriceAnchor(props.slug) ?? getGlRoutePriceAnchor("tri-island-joiner");

  if (!record) {
    return null;
  }

  const queryAmount = Number(props.amount || "");
  const hasQueryAmount = Number.isFinite(queryAmount) && queryAmount > 0;
  const querySeatsRaw = Number(props.seats || "");
  const querySeats = Number.isFinite(querySeatsRaw) && querySeatsRaw > 0 ? Math.floor(querySeatsRaw) : 1;
  const queryTime = props.time || "11:00 AM";
  const displayAmountLabel = hasQueryAmount ? `PHP ${queryAmount.toLocaleString("en-PH")}` : record.amountLabel;
  const displayAmountSubcopy = hasQueryAmount
    ? `${querySeats} seat${querySeats === 1 ? "" : "s"} · ${queryTime} Joiner`
    : record.amountSubcopy;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(5,150,165,0.10), transparent 34%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 58%, #EAFBFA 100%)",
        color: "#013863",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <div style={{ width: "min(100%, 430px)", margin: "0 auto", padding: "14px 14px 100px" }}>
        <a
          href="/traveler/payments/tour-sandbox/tri-island-joiner"
          style={{
            display: "inline-flex",
            color: "#0596A5",
            fontSize: 12,
            fontWeight: 850,
            textDecoration: "none",
            marginBottom: 10,
          }}
        >
          ← Back to price review
        </a>

        <section
          style={{
            borderRadius: 20,
            overflow: "hidden",
            background: "linear-gradient(180deg, #FFFFFF 0%, #F4FCFA 100%)",
            boxShadow: "0 18px 42px rgba(1,56,99,0.08)",
            marginBottom: 10,
          }}
        >
          <div style={{ height: 210, position: "relative" }}>
            <img
              src="/osp/temp-tour-posters/tri-island-joiner.png"
              alt={record.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.68 }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(244,252,250,0.96) 100%)",
              }}
            />
            <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, color: "#013863" }}>
              <span
                style={{
                  display: "inline-flex",
                  padding: "7px 11px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.92)",
                  color: "#013863",
                  fontSize: 10.5,
                  fontWeight: 950,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Payment
              </span>
              <h1
                style={{
                  margin: "10px 0 0",
                  color: "#013863",
                  fontSize: 29,
                  lineHeight: 1,
                  letterSpacing: "-0.055em",
                  fontWeight: 950,
                  textShadow: "none",
                }}
              >
                {record.title}
              </h1>
              <p style={{ margin: "8px 0 0", color: "#50668B", fontSize: 12, lineHeight: 1.24, fontWeight: 720 }}>
                {record.tripNo} · {record.port}
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            borderRadius: 26,
            padding: 13,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 12px 28px rgba(1,56,99,0.07)",
            marginBottom: 10,
          }}
        >
          <p style={{ margin: 0, color: "#50668B", fontSize: 10.5, fontWeight: 950, letterSpacing: "0.09em", textTransform: "uppercase" }}>
            Estimated route total
          </p>
          <h2 style={{ margin: "5px 0 0", color: "#013863", fontSize: 28, lineHeight: 1.08, letterSpacing: "-0.055em", fontWeight: 950 }}>
            {displayAmountLabel}
          </h2>
          <p style={{ margin: "9px 0 0", color: "#50668B", fontSize: 12, lineHeight: 1.22, fontWeight: 720 }}>
            {displayAmountSubcopy}
          </p>

          <div
            style={{
              marginTop: 9,
              borderRadius: 18,
              padding: 12,
              background: isSuccess ? "#EAFBFA" : "#FFF8EA",
              border: isSuccess ? "1px solid rgba(5,150,165,0.20)" : "1px solid rgba(243,174,38,0.34)",
            }}
          >
            <p style={{ margin: 0, color: isSuccess ? "#0596A5" : "#8A5A00", fontSize: 10.5, fontWeight: 950, letterSpacing: "0.09em", textTransform: "uppercase" }}>
              {isSuccess ? "Returned" : "Payment"}
            </p>
            <p style={{ margin: "6px 0 0", color: "#013863", fontSize: 11.5, lineHeight: 1.22, fontWeight: 760 }}>
              Live production still requires webhook reconciliation before this record is marked as settled.
            </p>
          </div>
        </section>

        <section
          style={{
            borderRadius: 20,
            padding: 13,
            background: "#F4FCFA",
            border: "1px solid rgba(5,150,165,0.16)",
            marginBottom: 10,
          }}
        >
          <p style={{ margin: 0, color: "#0596A5", fontSize: 10.5, fontWeight: 950, letterSpacing: "0.09em", textTransform: "uppercase" }}>
            Trip
          </p>

          <div style={{ display: "grid", gap: 8, marginTop: 11 }}>
            <KeyValue label="Trip" value="{record.title}" compact />
            <KeyValue label="Trip #" value={record.tripNo} compact />
            <KeyValue label="Route" value={record.route} compact />
            <KeyValue label="Port" value={record.port} compact />
            <KeyValue label="Ref." value={props.intentId} compact />
            <KeyValue label="Status" value={isSuccess ? "Checking" : "Ready"} compact />
          </div>
        </section>

        <section
          style={{
            borderRadius: 20,
            padding: 13,
            background: "#FFFFFF",
            border: "1px solid rgba(1,56,99,0.10)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.07)",
            marginBottom: 10,
          }}
        >
          <p style={{ margin: 0, color: "#013863", fontSize: 10.5, fontWeight: 950, letterSpacing: "0.09em", textTransform: "uppercase" }}>
            Next
          </p>

          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            <KeyValue label="Voucher" value="After payment" compact />
            <KeyValue label="Receipt" value="Saved" compact />
            <KeyValue label="QR" value="When ready" compact />
            <KeyValue label="Boarding" value="At boarding" compact />
          </div>
        </section>

        <section
          style={{
            borderRadius: 20,
            padding: 13,
            background: "#FFF8EA",
            border: "1px solid rgba(243,174,38,0.34)",
          }}
        >
          <p style={{ margin: 0, color: "#8A5A00", fontSize: 10.5, fontWeight: 950, letterSpacing: "0.09em", textTransform: "uppercase" }}>
            Next
          </p>
          <p style={{ margin: "7px 0 0", color: "#013863", fontSize: 12, lineHeight: 1.22, fontWeight: 760 }}>
            Receipt and trip updates stay here.
          </p>
        </section>
      </div>
    
        <div aria-hidden="true" style={{ height: 120 }} />
      </main>
  );
}

export default async function TravelerPaymentIntentPage({ params, searchParams }: PaymentPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const accommodationPaymentPreview = getAccommodationPaymentPreview(resolvedParams.intentId);
  if (accommodationPaymentPreview) {
    return <AccommodationPaymentGatewayPreview preview={accommodationPaymentPreview} paymentStatus={resolvedSearchParams?.payment} />;
  }

const { intentId } = resolvedParams;
  const gatewayStatusMessage = getGatewayStatusMessage(resolvedSearchParams?.payment);
  const supportedTourSandboxSlugs = SUPPORTED_GL_PAYMENT_SLUGS as readonly string[];
  const requestedTourSlug = resolvedSearchParams?.slug || "";
  const isTourSandboxPaymentRecord =
    intentId.startsWith("tour_sandbox_") ||
    (resolvedSearchParams?.source === "tour" && supportedTourSandboxSlugs.includes(requestedTourSlug));

  if (isTourSandboxPaymentRecord) {
    return (
      <TourSandboxPaymentRecordFallback
        intentId={intentId}
        paymentStatus={resolvedSearchParams?.payment}
        slug={resolvedSearchParams?.slug}
        seats={resolvedSearchParams?.seats}
        time={resolvedSearchParams?.time}
        amount={resolvedSearchParams?.amount}
      />
    );
  }

  const { intent, error } = await getPaymentIntent(intentId);
  const dictionary = await getTravelerDictionary("en");

  const backToTripsLabel = t(dictionary, "paymentDetail.nav.backToTrips", "Back to Payments");
  const headerEyebrow = t(dictionary, "paymentDetail.header.eyebrow", "Payment");
  const headerTitle = t(dictionary, "paymentDetail.title", "Payment");
  const headerBody = t(dictionary, "paymentDetail.header.body", "Review amount, status, receipt, and linked trip.");
  const intentFallback = t(dictionary, "paymentDetail.intentFallback", "Payment record");

  const status = intent?.status || intent?.paymentState?.state || t(dictionary, "paymentDetail.status.fallback", "Record");
  const isPaidPayment = isPaymentSettled(intent, status);
  const theme = statusTheme(status, dictionary);
  const currency = intent?.currencyCode || "PHP";
  const paidAmount = intent?.paymentState?.paidAmountPhp;
  const unpaidAmount = intent?.paymentState?.unpaidAmountPhp;
  const fxDisplaySnapshot = intent?.fxDisplaySnapshot ?? null;
  const payMongoGateway = getPaymentProviderGatewayConfig();

  const statusIcon =
    String(status).toUpperCase().includes("PAID") || String(status).toUpperCase().includes("CONFIRMED") ? (
      <Icon kind="check" size={24} />
    ) : String(status).toUpperCase().includes("FAILED") || String(status).toUpperCase().includes("CANCELLED") ? (
      <Icon kind="alert" size={24} />
    ) : (
      <Icon kind="clock" size={24} />
    );

  return (
    <main
      style={{
        maxWidth: 430,
        margin: "0 auto",
        padding: "16px 14px 150px",
        minHeight: "100vh",
        background: "radial-gradient(circle at 0% 0%, rgba(5,150,165,0.08), transparent 30%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 56%, #EAFBFA 100%)",
        color: "#19305a",
        boxSizing: "border-box",
      }}
    >
      <KuyaTalaEntryButton topic="payment" title="Need payment help?" note="Ask about receipts, status, or next steps." />
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
            color: "#0596A5",
            marginBottom: 8,
          }}
        >
          {headerEyebrow}
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            lineHeight: 1.02,
            letterSpacing: "-0.055em",
            color: "#19305a",
          }}
        >
          {headerTitle}
        </h1>
        <p style={{ marginTop: 9, marginBottom: 0, color: "#64748b", lineHeight: 1.22, fontSize: 14 }}>
          {headerBody}
        </p>
      </header>

      {intent && isPaidPayment ? (
        <section
          aria-label="Verified payment settlement"
          style={{
            margin: "0 0 14px",
            borderRadius: 20,
            border: "1px solid rgba(5,150,165,0.24)",
            background: "linear-gradient(180deg, rgba(234,251,250,0.98) 0%, rgba(255,255,255,0.96) 100%)",
            padding: 13,
            color: "#19305a",
            boxShadow: "0 16px 34px rgba(5,150,165,0.10)",
          }}
        >
          <div style={{ fontSize: 10.5, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: "#0596A5" }}>
            Payment Settled
          </div>
          <div style={{ marginTop: 6, fontSize: 19, lineHeight: 1.15, fontWeight: 950, color: "#013863" }}>
            Verified payment received through secure checkout.
          </div>
          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 7, fontSize: 13.5 }}>
              <span style={{ color: "#64748b", fontWeight: 800 }}>Amount paid</span>
              <strong style={{ color: "#013863" }}>{formatMoney(intent.paymentState?.paidAmountPhp || intent.amountPhp, currency)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 7, fontSize: 13.5 }}>
              <span style={{ color: "#64748b", fontWeight: 800 }}>Payment status</span>
              <strong style={{ color: "#013863" }}>{intent.paymentState?.state || intent.status}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 7, fontSize: 13.5 }}>
              <span style={{ color: "#64748b", fontWeight: 800 }}>Confirmed at</span>
              <strong style={{ color: "#013863", textAlign: "right" }}>{formatDate(intent.confirmedAt)}</strong>
            </div>
          </div>
          <p style={{ margin: "12px 0 0", color: "#64748b", fontSize: 12.8, lineHeight: 1.24, fontWeight: 750 }}>
            Paid receipts stay linked to your trip record.
          </p>
        </section>
      ) : null}

      {intent && !isPaidPayment ? (
        <section aria-label="Checkout readiness"
          style={{
            margin: "0 0 12px",
            borderRadius: 18,
            border: payMongoGateway.isReady ? "1px solid rgba(5,150,165,0.20)" : "1px solid rgba(217,119,6,0.24)",
            background: payMongoGateway.isReady ? "rgba(234,251,250,0.92)" : "rgba(255,251,235,0.92)",
            padding: 12,
            color: "#19305a",
          }}
        >
          <div style={{ fontSize: 10.5, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", color: payMongoGateway.isReady ? "#0596A5" : "#b45309" }}>
            Payment Gateway
          </div>
          <div style={{ marginTop: 4, fontSize: 12.5, fontWeight: 900, lineHeight: 1.35 }}>
            {payMongoGateway.isReady
              ? `Payment provider ${payMongoGateway.mode} checkout is configured.`
              : "Checkout is not available yet."}
          </div>
          {payMongoGateway.isReady ? null : (
            <div style={{ marginTop: 5, fontSize: 12, fontWeight: 750, color: "#92400e", lineHeight: 1.35 }}>
              Checkout is waiting for payment setup.
            </div>
          )}
        </section>
      ) : null}

      {gatewayStatusMessage ? (
        <section
          aria-label="Checkout status"
          style={{
            margin: "0 0 12px",
            borderRadius: 18,
            border: gatewayStatusMessage.tone === "red" ? "1px solid rgba(220,38,38,0.22)" : gatewayStatusMessage.tone === "green" ? "1px solid rgba(5,150,165,0.22)" : "1px solid rgba(217,119,6,0.24)",
            background: gatewayStatusMessage.tone === "red" ? "rgba(254,242,242,0.94)" : gatewayStatusMessage.tone === "green" ? "rgba(234,251,250,0.94)" : "rgba(255,251,235,0.94)",
            padding: 12,
            color: "#19305a",
          }}
        >
          <div style={{ fontSize: 12.5, fontWeight: 950, lineHeight: 1.35 }}>
            {gatewayStatusMessage.title}
          </div>
          <div style={{ marginTop: 5, fontSize: 12.4, fontWeight: 750, color: "#64748b", lineHeight: 1.4 }}>
            {gatewayStatusMessage.body}
          </div>
        </section>
      ) : null}

      {intent && !isPaidPayment ? (
        <form action={createPaymentProviderCheckoutAction} style={{ margin: "0 0 16px", display: "grid" }}>
          <input type="hidden" name="intentId" value={intent.id} />
          <input type="hidden" name="amountPhp" value={String(intent.amountPhp || 0)} />
          <input type="hidden" name="intentReference" value={intent.intentReference || intent.id} />
          <button
            type="submit"
            disabled={payMongoGateway.isReady ? false : true}
            aria-disabled={payMongoGateway.isReady ? false : true}
            style={{
              minHeight: 58,
              width: "100%",
              borderRadius: 20,
              border: "1px solid rgba(5,150,165,0.24)",
              background: "linear-gradient(135deg, #013863 0%, #0596A5 50%, #0596A5 100%)",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 950,
              cursor: payMongoGateway.isReady ? "pointer" : "not-allowed",
              opacity: payMongoGateway.isReady ? 1 : 0.62,
              boxShadow: "0 18px 38px rgba(1,56,99,0.22)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {payMongoGateway.isReady ? `Pay with Payment provider QR PH — ${formatMoney(intent.amountPhp, currency)}` : `Checkout unavailable — ${formatMoney(intent.amountPhp, currency)}`}
          </button>
        </form>
      ) : null}

      {error ? (
        <Section title={t(dictionary, "paymentDetail.loadError.title", "Load Error")} icon={<Icon kind="alert" />} tone="red">
          <p style={{ margin: 0, color: "#dc2626", fontSize: 12.5, lineHeight: 1.24, fontWeight: 800 }}>{error}</p>
        </Section>
      ) : null}

      {!intent ? null : (
        <>
          <section
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
              background: `linear-gradient(180deg, ${theme.bg} 0%, #ffffff 100%)`,
              padding: 13,
              marginBottom: 10,
              boxShadow: "0 14px 34px rgba(15,23,42,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  background: "#ffffff",
                  border: `1px solid ${theme.border}`,
                  color: theme.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "0 0 auto",
                }}
              >
                {statusIcon}
              </div>

              <div style={{ minWidth: 0, flex: "1 1 auto" }}>
                <div style={{ fontSize: 11, fontWeight: 950, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.color }}>
                  {theme.label}
                </div>
                <h2
                  style={{
                    margin: "6px 0 0",
                    fontSize: 20,
                    lineHeight: 1.05,
                    letterSpacing: "-0.045em",
                    color: "#19305a",
                  }}
                >
                  {normalizeStatus(status)}
                </h2>
                <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 12.5, lineHeight: 1.35, fontWeight: 750 }}>
                  {intent.intentReference || intentFallback}
                </p>
              </div>
            </div>
          </section>

          <Section title={t(dictionary, "paymentDetail.receipt.title", "Receipt")} icon={<Icon kind="receipt" />} tone="green">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              <KeyValue label={t(dictionary, "paymentDetail.receipt.amount", "Amount")} value={formatMoney(intent.amountPhp, currency)} tone={theme} />
              <KeyValue label={t(dictionary, "paymentDetail.receipt.currency", "Currency")} value={currency} tone={{ bg: "#F4FCFA", border: "#BFECEE", color: "#013863" }} />
              <KeyValue label={t(dictionary, "paymentDetail.receipt.status", "Status")} value={normalizeStatus(intent.status)} tone={theme} />
              <KeyValue label={t(dictionary, "paymentDetail.receipt.provider", "Provider")} value={intent.provider} />
            </div>

            {fxDisplaySnapshot ? (
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
                    label={t(dictionary, "paymentDetail.fx.displayEstimate", "Display Estimate")}
                    value={formatFxDisplayAmount(fxDisplaySnapshot)}
                    tone={{ bg: "#F4FCFA", border: "#BFECEE", color: "#013863" }}
                  />
                  <KeyValue
                    label={t(dictionary, "paymentDetail.fx.rate", "FX Rate")}
                    value={formatFxRate(fxDisplaySnapshot)}
                    tone={{ bg: "#f8fafc", border: "#e2e8f0", color: "#475569" }}
                  />
                  <KeyValue
                    label={t(dictionary, "paymentDetail.fx.source", "FX Source")}
                    value={fxDisplaySnapshot.fxSource}
                    tone={{ bg: "#f8fafc", border: "#e2e8f0", color: "#475569" }}
                  />
                  <KeyValue
                    label={t(dictionary, "paymentDetail.fx.asOf", "Rate As Of")}
                    value={formatDateTime(fxDisplaySnapshot.fxAsOf)}
                    tone={{ bg: "#f8fafc", border: "#e2e8f0", color: "#475569" }}
                  />
                </div>

                <p style={{ margin: "9px 0 0", color: "#64748b", fontSize: 11.5, lineHeight: 1.35, fontWeight: 750 }}>
                  {t(dictionary, "paymentDetail.fx.note", "PHP remains the settlement amount.")}
                </p>
              </div>
            ) : null}
          </Section>

          <Section title={t(dictionary, "paymentDetail.state.title", "Status")} icon={<Icon kind="payment" />} tone="amber">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              <KeyValue label={t(dictionary, "paymentDetail.state.state", "State")} value={normalizeStatus(intent.paymentState?.state)} tone={statusTheme(intent.paymentState?.state, dictionary)} />
              <KeyValue label={t(dictionary, "paymentDetail.state.paid", "Paid")} value={formatMoney(paidAmount, currency)} tone={statusTheme("PAID", dictionary)} />
              <KeyValue label={t(dictionary, "paymentDetail.state.unpaid", "Unpaid")} value={formatMoney(unpaidAmount, currency)} tone={statusTheme("UNPAID", dictionary)} />
              <KeyValue label={t(dictionary, "paymentDetail.state.updated", "Updated")} value={formatDateTime(intent.paymentState?.stateUpdatedAt)} />
            </div>
          </Section>

          <Section title={t(dictionary, "paymentDetail.booking.title", "Linked Booking")} icon={<Icon kind="booking" />} tone="blue">
            <div style={{ display: "grid", gap: 8 }}>
              <KeyValue label={t(dictionary, "paymentDetail.booking.bookingId", "Booking ID")} value={intent.bookingId} />
              <KeyValue label={t(dictionary, "paymentDetail.booking.intentReference", "Intent Reference")} value={intent.intentReference} />
              <KeyValue label={t(dictionary, "paymentDetail.booking.paymentIntentId", "Ref. ID")} value={intent.id} />
              <KeyValue label={t(dictionary, "paymentDetail.booking.lastPaymentIntent", "Last Ref.")} value={intent.paymentState?.lastPaymentIntentId} />
            </div>
          </Section>

          <Section title={t(dictionary, "paymentDetail.timeline.title", "Timeline")} icon={<Icon kind="calendar" />} tone="default">
            <div style={{ display: "grid", gap: 8 }}>
              <KeyValue label={t(dictionary, "paymentDetail.timeline.confirmedAt", "Confirmed At")} value={formatDateTime(intent.confirmedAt)} />
              <KeyValue label={t(dictionary, "paymentDetail.timeline.createdAt", "Created At")} value={formatDateTime(intent.createdAt)} />
              <KeyValue label={t(dictionary, "paymentDetail.timeline.updatedAt", "Updated At")} value={formatDateTime(intent.updatedAt)} />
            </div>
          </Section>

          <Section title={t(dictionary, "paymentDetail.actions.title", "Next Step")} icon={<Icon kind="shield" />} tone="default">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
{intent && !isPaidPayment ? (
                <form action={createPaymentProviderCheckoutAction} style={{ width: "100%", margin: "0", display: "grid" }}>
                  <input type="hidden" name="intentId" value={intent.id} />
                  <input type="hidden" name="amountPhp" value={String(intent.amountPhp || 0)} />
                  <input type="hidden" name="intentReference" value={intent.intentReference || intent.id} />
                  <button
                    type="submit"
                    disabled={payMongoGateway.isReady ? false : true}
                    aria-disabled={payMongoGateway.isReady ? false : true}
                    style={{
                      minHeight: 56,
                      width: "100%",
                      borderRadius: 18,
                      border: "1px solid rgba(5,150,165,0.22)",
                      background: "linear-gradient(135deg, #013863 0%, #0596A5 52%, #0596A5 100%)",
                      color: "#ffffff",
                      fontSize: 12.5,
                      fontWeight: 950,
                      cursor: payMongoGateway.isReady ? "pointer" : "not-allowed",
                      opacity: payMongoGateway.isReady ? 1 : 0.62,
                      boxShadow: "0 16px 34px rgba(1,56,99,0.20)",
                    }}
                  >
                    {payMongoGateway.isReady ? `Pay with Payment provider QR PH — ${formatMoney(intent.amountPhp, currency)}` : `Checkout unavailable — ${formatMoney(intent.amountPhp, currency)}`}
                  </button>
                </form>
              ) : null}
            </div>

            <p style={{ margin: "12px 0 0", color: "#64748b", fontSize: 12.5, lineHeight: 1.24, fontWeight: 650 }}>
              {isPaidPayment
            ? "Your payment is settled. Keep this page as your payment record. Clearance and activity approvals remain separate from payment."
            : t(dictionary, "paymentDetail.actions.note", "Your receipt stays linked to this trip.")}
            </p>
          </Section>
        </>
      )}
    
      <div aria-hidden="true" style={{ height: 120 }} />
      <UniversalTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
