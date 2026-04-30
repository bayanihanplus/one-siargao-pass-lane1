import { getApiBaseUrl, requireAccessToken } from "../../../../src/lib/server-auth";
import KuyaTalaEntryButton from "../../../../src/traveler-assistant/KuyaTalaEntryButton";
import { redirect } from "next/navigation";

type TravelerDictionary = Record<string, string>;

const paymentDetailDictionaryFallback: TravelerDictionary = {
  "paymentDetail.nav.backToTrips": "Back to Trips",
  "paymentDetail.nav.home": "Home",
  "paymentDetail.nav.myTrips": "My Trips",
  "paymentDetail.nav.logout": "Logout",
  "paymentDetail.header.eyebrow": "Payment Record",
  "paymentDetail.title": "Payment Detail",
  "paymentDetail.header.body": "Review payment state, booking linkage, and receipt information.",
  "paymentDetail.status.verified": "Payment Verified",
  "paymentDetail.status.pending": "Payment Pending",
  "paymentDetail.status.attention": "Payment Attention Needed",
  "paymentDetail.status.record": "Payment Record",
  "paymentDetail.status.fallback": "Record",
  "paymentDetail.intentFallback": "Payment intent record",
  "paymentDetail.loadError.title": "Load Error",
  "paymentDetail.receipt.title": "Receipt Summary",
  "paymentDetail.receipt.amount": "Amount",
  "paymentDetail.receipt.currency": "Currency",
  "paymentDetail.receipt.status": "Status",
  "paymentDetail.receipt.provider": "Provider",
  "paymentDetail.fx.displayEstimate": "Display Estimate",
  "paymentDetail.fx.rate": "FX Rate",
  "paymentDetail.fx.source": "FX Source",
  "paymentDetail.fx.asOf": "Rate As Of",
  "paymentDetail.fx.note": "FX is shown as a traveler display estimate only. PHP remains the payment and settlement source of truth.",
  "paymentDetail.state.title": "Payment State",
  "paymentDetail.state.state": "State",
  "paymentDetail.state.paid": "Paid",
  "paymentDetail.state.unpaid": "Unpaid",
  "paymentDetail.state.updated": "Updated",
  "paymentDetail.booking.title": "Booking Linkage",
  "paymentDetail.booking.bookingId": "Booking ID",
  "paymentDetail.booking.intentReference": "Intent Reference",
  "paymentDetail.booking.paymentIntentId": "Payment Intent ID",
  "paymentDetail.booking.lastPaymentIntent": "Last Payment Intent",
  "paymentDetail.timeline.title": "Timeline",
  "paymentDetail.timeline.confirmedAt": "Confirmed At",
  "paymentDetail.timeline.createdAt": "Created At",
  "paymentDetail.timeline.updatedAt": "Updated At",
  "paymentDetail.actions.title": "Next Actions",
  "paymentDetail.actions.note": "Payments are linked to your OSP booking and pass status. Operational changes must come from verified backend records.",
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
      notes: "Traveler clicked Pay via PayMongo / QR PH CTA from Payment Detail page.",
    }),
  }, 8000);

  if (!res.ok) {
    redirect(`/traveler/payments/${encodeURIComponent(intentId)}?payment=failed`);
  }

  redirect(`/traveler/payments/${encodeURIComponent(intentId)}?payment=confirmed`);
}

async function createPayMongoCheckoutAction(formData: FormData) {
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
    redirect(`/traveler/payments/${encodeURIComponent(intentId)}?payment=paymongo-key-missing`);
  }

  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_BASE_URL ||
    process.env.APP_BASE_URL ||
    "http://localhost:3000";

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
              name: "One Siargao Pass Island Hopping Request",
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
      title: "PayMongo sandbox key is missing.",
      body: "The payment record is ready, but checkout cannot open until PAYMONGO_TEST_SECRET_KEY is configured in the server environment.",
    };
  }

  if (paymentStatus === "paymongo-checkout-failed") {
    return {
      tone: "red",
      title: "PayMongo checkout could not be created.",
      body: "The gateway rejected or did not return a checkout URL. Check the PayMongo sandbox key, QR PH availability, and payment_method_types.",
    };
  }

  if (paymentStatus === "paymongo-cancelled") {
    return {
      tone: "amber",
      title: "Checkout was cancelled.",
      body: "No payment was marked as paid. You can try opening PayMongo QR PH checkout again.",
    };
  }

  if (paymentStatus === "paymongo-success") {
    return {
      tone: "green",
      title: "Returned from PayMongo checkout.",
      body: "Payment confirmation still requires backend verification or webhook reconciliation before marking this record as settled.",
    };
  }

  return null;
}

function getPayMongoGatewayConfig() {
  const secretKey =
    process.env.PAYMONGO_TEST_SECRET_KEY ||
    process.env.PAYMONGO_SECRET_KEY ||
    process.env.PAYMONGO_SK_TEST ||
    "";

  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_BASE_URL ||
    process.env.APP_BASE_URL ||
    "http://localhost:3000";

  const mode = secretKey.includes("_test_") || secretKey.startsWith("sk_test")
    ? "SANDBOX"
    : secretKey
      ? "PRODUCTION"
      : "NOT_CONFIGURED";

  return {
    hasSecretKey: Boolean(secretKey),
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
    return { bg: "#eefdf3", border: "#cdeed7", color: "#16a34a", label: t(dictionary, "paymentDetail.status.verified", "Payment Verified") };
  }

  if (
    normalized.includes("PENDING") ||
    normalized.includes("UNPAID") ||
    normalized.includes("WAITING") ||
    normalized.includes("PROCESSING")
  ) {
    return { bg: "#fff8eb", border: "#f6e1b5", color: "#d97706", label: t(dictionary, "paymentDetail.status.pending", "Payment Pending") };
  }

  if (
    normalized.includes("FAILED") ||
    normalized.includes("CANCELLED") ||
    normalized.includes("BLOCKED") ||
    normalized.includes("DENIED")
  ) {
    return { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", label: t(dictionary, "paymentDetail.status.attention", "Payment Attention Needed") };
  }

  return { bg: "#eff6ff", border: "#cfe0f7", color: "#2563eb", label: t(dictionary, "paymentDetail.status.record", "Payment Record") };
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
        <h2 style={{ margin: 0, fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#19305a" }}>
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

export default async function TravelerPaymentIntentPage({ params, searchParams }: PaymentPageProps) {
  const { intentId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const gatewayStatusMessage = getGatewayStatusMessage(resolvedSearchParams?.payment);
  const { intent, error } = await getPaymentIntent(intentId);
  const dictionary = await getTravelerDictionary("en");

  const backToTripsLabel = t(dictionary, "paymentDetail.nav.backToTrips", "Back to Trips");
  const headerEyebrow = t(dictionary, "paymentDetail.header.eyebrow", "Payment Record");
  const headerTitle = t(dictionary, "paymentDetail.title", "Payment Detail");
  const headerBody = t(dictionary, "paymentDetail.header.body", "Review payment state, booking linkage, and receipt information.");
  const intentFallback = t(dictionary, "paymentDetail.intentFallback", "Payment intent record");

  const status = intent?.status || intent?.paymentState?.state || t(dictionary, "paymentDetail.status.fallback", "Record");
  const isPaidPayment = isPaymentSettled(intent, status);
  const theme = statusTheme(status, dictionary);
  const currency = intent?.currencyCode || "PHP";
  const paidAmount = intent?.paymentState?.paidAmountPhp;
  const unpaidAmount = intent?.paymentState?.unpaidAmountPhp;
  const fxDisplaySnapshot = intent?.fxDisplaySnapshot ?? null;
  const payMongoGateway = getPayMongoGatewayConfig();

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
        padding: "18px 14px 22px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fcff 0%, #ffffff 58%)",
        color: "#19305a",
        boxSizing: "border-box",
      }}
    >
      <KuyaTalaEntryButton topic="payment" title="Ask Kuya Tala™ about this payment" note="Get guided help understanding payment state, display currency estimates, and next safe steps." />
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
          {headerTitle}
        </h1>
        <p style={{ marginTop: 9, marginBottom: 0, color: "#64748b", lineHeight: 1.4, fontSize: 14 }}>
          {headerBody}
        </p>
      </header>

      {intent && isPaidPayment ? (
        <section
          aria-label="Verified payment settlement"
          style={{
            margin: "0 0 14px",
            borderRadius: 22,
            border: "1px solid rgba(22,163,74,0.24)",
            background: "linear-gradient(180deg, rgba(240,253,244,0.98) 0%, rgba(255,255,255,0.96) 100%)",
            padding: 16,
            color: "#19305a",
            boxShadow: "0 16px 34px rgba(22,163,74,0.10)",
          }}
        >
          <div style={{ fontSize: 10.5, fontWeight: 950, letterSpacing: "0.13em", textTransform: "uppercase", color: "#15803d" }}>
            Payment Settled
          </div>
          <div style={{ marginTop: 6, fontSize: 19, lineHeight: 1.15, fontWeight: 950, color: "#14532d" }}>
            Verified payment received through {intent.provider || "payment gateway"}.
          </div>
          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5 }}>
              <span style={{ color: "#64748b", fontWeight: 800 }}>Amount paid</span>
              <strong style={{ color: "#14532d" }}>{formatMoney(intent.paymentState?.paidAmountPhp || intent.amountPhp, currency)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5 }}>
              <span style={{ color: "#64748b", fontWeight: 800 }}>Payment status</span>
              <strong style={{ color: "#14532d" }}>{intent.paymentState?.state || intent.status}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13.5 }}>
              <span style={{ color: "#64748b", fontWeight: 800 }}>Confirmed at</span>
              <strong style={{ color: "#14532d", textAlign: "right" }}>{formatDate(intent.confirmedAt)}</strong>
            </div>
          </div>
          <p style={{ margin: "12px 0 0", color: "#64748b", fontSize: 12.8, lineHeight: 1.45, fontWeight: 750 }}>
            This confirms payment settlement only. Regulated activity clearance, manifest approval, and operational readiness remain separate OSP records.
          </p>
        </section>
      ) : null}

      {intent && !isPaidPayment ? (
        <section aria-label="Payment gateway readiness"
          style={{
            margin: "0 0 12px",
            borderRadius: 18,
            border: payMongoGateway.hasSecretKey ? "1px solid rgba(22,163,74,0.20)" : "1px solid rgba(217,119,6,0.24)",
            background: payMongoGateway.hasSecretKey ? "rgba(240,253,244,0.92)" : "rgba(255,251,235,0.92)",
            padding: 12,
            color: "#19305a",
          }}
        >
          <div style={{ fontSize: 10.5, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase", color: payMongoGateway.hasSecretKey ? "#15803d" : "#b45309" }}>
            Payment Gateway
          </div>
          <div style={{ marginTop: 4, fontSize: 13.5, fontWeight: 900, lineHeight: 1.35 }}>
            {payMongoGateway.hasSecretKey
              ? `PayMongo ${payMongoGateway.mode} checkout is configured.`
              : "PayMongo sandbox key is not configured yet."}
          </div>
          {!payMongoGateway.hasSecretKey ? (
            <div style={{ marginTop: 5, fontSize: 12.2, fontWeight: 750, color: "#92400e", lineHeight: 1.35 }}>
              Add PAYMONGO_TEST_SECRET_KEY and NEXT_PUBLIC_APP_BASE_URL on VPS before this button can redirect to PayMongo checkout.
            </div>
          ) : null}
        </section>
      ) : null}

      {gatewayStatusMessage ? (
        <section
          aria-label="Payment gateway status"
          style={{
            margin: "0 0 12px",
            borderRadius: 18,
            border: gatewayStatusMessage.tone === "red" ? "1px solid rgba(220,38,38,0.22)" : gatewayStatusMessage.tone === "green" ? "1px solid rgba(22,163,74,0.22)" : "1px solid rgba(217,119,6,0.24)",
            background: gatewayStatusMessage.tone === "red" ? "rgba(254,242,242,0.94)" : gatewayStatusMessage.tone === "green" ? "rgba(240,253,244,0.94)" : "rgba(255,251,235,0.94)",
            padding: 12,
            color: "#19305a",
          }}
        >
          <div style={{ fontSize: 13.5, fontWeight: 950, lineHeight: 1.35 }}>
            {gatewayStatusMessage.title}
          </div>
          <div style={{ marginTop: 5, fontSize: 12.4, fontWeight: 750, color: "#64748b", lineHeight: 1.4 }}>
            {gatewayStatusMessage.body}
          </div>
        </section>
      ) : null}

      {intent && !isPaidPayment ? (
        <form action={createPayMongoCheckoutAction} style={{ margin: "0 0 16px", display: "grid" }}>
          <input type="hidden" name="intentId" value={intent.id} />
          <input type="hidden" name="amountPhp" value={String(intent.amountPhp || 0)} />
          <input type="hidden" name="intentReference" value={intent.intentReference || intent.id} />
          <button
            type="submit"
            style={{
              minHeight: 58,
              width: "100%",
              borderRadius: 20,
              border: "1px solid rgba(7,141,160,0.28)",
              background: "linear-gradient(135deg, #034e5d 0%, #067889 50%, #089fa5 100%)",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 950,
              cursor: payMongoGateway.hasSecretKey ? "pointer" : "not-allowed",
              opacity: payMongoGateway.hasSecretKey ? 1 : 0.62,
              boxShadow: "0 18px 38px rgba(6,120,137,0.28)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            Pay with PayMongo QR PH — {formatMoney(intent.amountPhp, currency)}
          </button>
        </form>
      ) : null}

      {error ? (
        <Section title={t(dictionary, "paymentDetail.loadError.title", "Load Error")} icon={<Icon kind="alert" />} tone="red">
          <p style={{ margin: 0, color: "#dc2626", fontSize: 14, lineHeight: 1.45, fontWeight: 800 }}>{error}</p>
        </Section>
      ) : null}

      {!intent ? null : (
        <>
          <section
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: 24,
              background: `linear-gradient(180deg, ${theme.bg} 0%, #ffffff 100%)`,
              padding: 16,
              marginBottom: 14,
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
                    fontSize: 25,
                    lineHeight: 1.05,
                    letterSpacing: "-0.045em",
                    color: "#19305a",
                  }}
                >
                  {normalizeStatus(status)}
                </h2>
                <p style={{ margin: "8px 0 0", color: "#64748b", fontSize: 13, lineHeight: 1.35, fontWeight: 750 }}>
                  {intent.intentReference || intentFallback}
                </p>
              </div>
            </div>
          </section>

          <Section title={t(dictionary, "paymentDetail.receipt.title", "Receipt Summary")} icon={<Icon kind="receipt" />} tone="green">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              <KeyValue label={t(dictionary, "paymentDetail.receipt.amount", "Amount")} value={formatMoney(intent.amountPhp, currency)} tone={theme} />
              <KeyValue label={t(dictionary, "paymentDetail.receipt.currency", "Currency")} value={currency} tone={{ bg: "#eff6ff", border: "#cfe0f7", color: "#2563eb" }} />
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
                    tone={{ bg: "#eff6ff", border: "#cfe0f7", color: "#2563eb" }}
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
                  {t(dictionary, "paymentDetail.fx.note", "FX is shown as a traveler display estimate only. PHP remains the payment and settlement source of truth.")}
                </p>
              </div>
            ) : null}
          </Section>

          <Section title={t(dictionary, "paymentDetail.state.title", "Payment State")} icon={<Icon kind="payment" />} tone="amber">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              <KeyValue label={t(dictionary, "paymentDetail.state.state", "State")} value={normalizeStatus(intent.paymentState?.state)} tone={statusTheme(intent.paymentState?.state, dictionary)} />
              <KeyValue label={t(dictionary, "paymentDetail.state.paid", "Paid")} value={formatMoney(paidAmount, currency)} tone={statusTheme("PAID", dictionary)} />
              <KeyValue label={t(dictionary, "paymentDetail.state.unpaid", "Unpaid")} value={formatMoney(unpaidAmount, currency)} tone={statusTheme("UNPAID", dictionary)} />
              <KeyValue label={t(dictionary, "paymentDetail.state.updated", "Updated")} value={formatDateTime(intent.paymentState?.stateUpdatedAt)} />
            </div>
          </Section>

          <Section title={t(dictionary, "paymentDetail.booking.title", "Booking Linkage")} icon={<Icon kind="booking" />} tone="blue">
            <div style={{ display: "grid", gap: 8 }}>
              <KeyValue label={t(dictionary, "paymentDetail.booking.bookingId", "Booking ID")} value={intent.bookingId} />
              <KeyValue label={t(dictionary, "paymentDetail.booking.intentReference", "Intent Reference")} value={intent.intentReference} />
              <KeyValue label={t(dictionary, "paymentDetail.booking.paymentIntentId", "Payment Intent ID")} value={intent.id} />
              <KeyValue label={t(dictionary, "paymentDetail.booking.lastPaymentIntent", "Last Payment Intent")} value={intent.paymentState?.lastPaymentIntentId} />
            </div>
          </Section>

          <Section title={t(dictionary, "paymentDetail.timeline.title", "Timeline")} icon={<Icon kind="calendar" />} tone="default">
            <div style={{ display: "grid", gap: 8 }}>
              <KeyValue label={t(dictionary, "paymentDetail.timeline.confirmedAt", "Confirmed At")} value={formatDateTime(intent.confirmedAt)} />
              <KeyValue label={t(dictionary, "paymentDetail.timeline.createdAt", "Created At")} value={formatDateTime(intent.createdAt)} />
              <KeyValue label={t(dictionary, "paymentDetail.timeline.updatedAt", "Updated At")} value={formatDateTime(intent.updatedAt)} />
            </div>
          </Section>

          <Section title={t(dictionary, "paymentDetail.actions.title", "Next Actions")} icon={<Icon kind="shield" />} tone="default">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
{intent && !isPaidPayment ? (
                <form action={createPayMongoCheckoutAction} style={{ width: "100%", margin: "0", display: "grid" }}>
                  <input type="hidden" name="intentId" value={intent.id} />
                  <input type="hidden" name="amountPhp" value={String(intent.amountPhp || 0)} />
                  <input type="hidden" name="intentReference" value={intent.intentReference || intent.id} />
                  <button
                    type="submit"
                    style={{
                      minHeight: 56,
                      width: "100%",
                      borderRadius: 18,
                      border: "1px solid rgba(7,141,160,0.24)",
                      background: "linear-gradient(135deg, #045f70 0%, #067889 52%, #089fa5 100%)",
                      color: "#ffffff",
                      fontSize: 14,
                      fontWeight: 950,
                      cursor: "pointer",
                      boxShadow: "0 16px 34px rgba(6,120,137,0.24)",
                    }}
                  >
                    Pay with PayMongo QR PH — {formatMoney(intent.amountPhp, currency)}
                  </button>
                </form>
              ) : null}
            </div>

            <p style={{ margin: "12px 0 0", color: "#64748b", fontSize: 13, lineHeight: 1.45, fontWeight: 650 }}>
              {isPaidPayment
            ? "Your payment is settled. Keep this page as your payment record. Clearance and activity approvals remain separate from payment."
            : t(dictionary, "paymentDetail.actions.note", "Payments are linked to your OSP booking and pass status. Operational changes must come from verified backend records.")}
            </p>
          </Section>
        </>
      )}
    </main>
  );
}
