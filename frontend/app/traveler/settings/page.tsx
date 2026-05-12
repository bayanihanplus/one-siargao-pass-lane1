import KuyaTalaChatBox from "../../../src/traveler-assistant/KuyaTalaChatBox";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getApiBaseUrl, getCurrentUser, requireAccessToken } from "../../../src/lib/server-auth";
import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";
import PassportMapShortcut from "../../../src/components/traveler/PassportMapShortcut";

type PanelKey = "profile" | "language" | "currency" | "assistant" | "notifications";

type TravelerNotification = {
  id: string;
  userId?: string;
  notificationType?: string;
  title: string;
  body: string;
  isRead?: boolean;
  createdAt?: string;
};

type LanguageOption = {
  code: string;
  label: string;
  group: string;
};

const LANGUAGE_GROUP_ORDER = ["International", "European", "Filipino"];

const FALLBACK_LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "en", label: "English", group: "International" },
];

const DISPLAY_CURRENCY_OPTIONS = [
  { code: "PHP", label: "Philippine Peso", note: "Settlement source" },
  { code: "USD", label: "US Dollar", note: "Display estimate" },
  { code: "EUR", label: "Euro", note: "Display estimate" },
  { code: "GBP", label: "British Pound", note: "Display estimate" },
  { code: "JPY", label: "Japanese Yen", note: "Display estimate" },
  { code: "KRW", label: "Korean Won", note: "Display estimate" },
  { code: "CNY", label: "Chinese Yuan", note: "Display estimate" },
  { code: "HKD", label: "Hong Kong Dollar", note: "Display estimate" },
  { code: "TWD", label: "Taiwan Dollar", note: "Display estimate" },
  { code: "AUD", label: "Australian Dollar", note: "Display estimate" },
  { code: "NZD", label: "New Zealand Dollar", note: "Display estimate" },
  { code: "SGD", label: "Singapore Dollar", note: "Display estimate" },
  { code: "CAD", label: "Canadian Dollar", note: "Display estimate" },
  { code: "THB", label: "Thai Baht", note: "Display estimate" },
  { code: "MYR", label: "Malaysian Ringgit", note: "Display estimate" },
  { code: "IDR", label: "Indonesian Rupiah", note: "Display estimate" },
  { code: "VND", label: "Vietnamese Dong", note: "Display estimate" },
  { code: "INR", label: "Indian Rupee", note: "Display estimate" },
  { code: "AED", label: "UAE Dirham", note: "Display estimate" },
  { code: "SAR", label: "Saudi Riyal", note: "Display estimate" },
  { code: "ILS", label: "Israeli New Shekel", note: "Display estimate" },
  { code: "CHF", label: "Swiss Franc", note: "Display estimate" },
  { code: "SEK", label: "Swedish Krona", note: "Display estimate" },
  { code: "NOK", label: "Norwegian Krone", note: "Display estimate" },
  { code: "DKK", label: "Danish Krone", note: "Display estimate" },
];

async function getLanguagePacks(): Promise<LanguageOption[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/language-packs`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return FALLBACK_LANGUAGE_OPTIONS;

    const rows = await res.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return FALLBACK_LANGUAGE_OPTIONS;
    }

    return rows
      .filter((row: any) => row?.languageCode && row?.label && row?.group)
      .map((row: any) => ({
        code: String(row.languageCode),
        label: String(row.label),
        group: String(row.group),
      }));
  } catch {
    return FALLBACK_LANGUAGE_OPTIONS;
  }
}

async function getTravelerDictionary(languageCode: string): Promise<Record<string, string>> {
  const fallback: Record<string, string> = {
    "settings.title": "Traveler Controls",
    "settings.language.title": "Choose your travel language",
  };

  try {
    const res = await fetch(`${getApiBaseUrl()}/language-packs/${encodeURIComponent(languageCode)}/dictionary?scope=traveler`, {
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

function t(dictionary: Record<string, string>, key: string, fallback: string) {
  return dictionary[key] || fallback;
}

async function updatePreferredLanguage(formData: FormData) {
  "use server";

  const preferredLanguage = String(formData.get("preferredLanguage") || "").trim();

  const languagePacks = await getLanguagePacks();

  if (!languagePacks.some((option) => option.code === preferredLanguage)) {
    throw new Error("Unsupported preferred language");
  }

  const token = await requireAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/profile`, {
    method: "PATCH",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ preferredLanguage }),
  });

  if (!res.ok) {
    throw new Error(`Preferred language update failed: HTTP ${res.status}`);
  }

  revalidatePath("/");
  revalidatePath("/traveler/settings");
  redirect("/traveler/settings?panel=language&saved=1");
}

async function updatePreferredDisplayCurrency(formData: FormData) {
  "use server";

  const preferredDisplayCurrencyCode = String(formData.get("preferredDisplayCurrencyCode") || "").trim().toUpperCase();

  if (!DISPLAY_CURRENCY_OPTIONS.some((option) => option.code === preferredDisplayCurrencyCode)) {
    throw new Error("Unsupported display currency");
  }

  const token = await requireAccessToken();

  const res = await fetch(`${getApiBaseUrl()}/profile`, {
    method: "PATCH",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ preferredDisplayCurrencyCode }),
  });

  if (!res.ok) {
    throw new Error(`Preferred currency update failed: HTTP ${res.status}`);
  }

  revalidatePath("/");
  revalidatePath("/traveler/settings");
  revalidatePath("/traveler/trips");
  redirect("/traveler/settings?panel=currency&saved=1");
}


async function updateTravelerProfile(formData: FormData) {
  "use server";

  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const displayName = String(formData.get("displayName") || "").trim();
  const mobileNumber = String(formData.get("mobileNumber") || "").trim();
  const nationalityCode = String(formData.get("nationalityCode") || "").trim().toUpperCase();
  const homeCountry = String(formData.get("homeCountry") || "").trim();
  const birthDate = String(formData.get("birthDate") || "").trim();

  if (!fullName) {
    redirect("/traveler/settings?panel=profile&profileError=missing-name");
  }

  let token = "";

  try {
    token = await requireAccessToken();
  } catch {
    redirect("/login?mode=returning");
  }

  const body: Record<string, string> = {
    fullName,
    email,
    displayName,
    mobileNumber,
    nationalityCode,
    homeCountry,
    birthDate,
  };

  Object.keys(body).forEach((key) => {
    if (!body[key]) delete body[key];
  });

  try {
    const res = await fetch(`${getApiBaseUrl()}/profile`, {
      method: "PATCH",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.status === 401 || res.status === 403) {
      redirect("/login?mode=returning");
    }

    if (!res.ok) {
      redirect("/traveler/settings?panel=profile&profileError=save-failed");
    }
  } catch {
    redirect("/traveler/settings?panel=profile&profileError=save-failed");
  }

  revalidatePath("/");
  revalidatePath("/traveler/settings");
  revalidatePath("/traveler/home");
  redirect("/traveler/settings?panel=profile&saved=1");
}

function getPanel(searchParams?: { [key: string]: string | string[] | undefined }): PanelKey {
  const raw = searchParams?.panel;
  const value = Array.isArray(raw) ? raw[0] : raw;

  if (value === "profile") return "profile";
  if (value === "currency") return "currency";
  if (value === "assistant") return "assistant";
  if (value === "notifications") return "notifications";
  return "language";
}

function getSingleSearchParam(
  searchParams: { [key: string]: string | string[] | undefined } | undefined,
  key: string,
) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function getSaved(searchParams?: { [key: string]: string | string[] | undefined }) {
  const raw = searchParams?.saved;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "1";
}


async function getAssistantJson(pathname: string) {
  try {
    const token = await requireAccessToken();
    const res = await fetch(`${getApiBaseUrl()}${pathname}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `Assistant endpoint unavailable: HTTP ${res.status}`,
      };
    }

    return await res.json();
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || "Assistant endpoint unavailable.",
    };
  }
}

async function getKuyaTalaAssistantData() {
  const [travelerContext, knowledgeSpine] = await Promise.all([
    getAssistantJson("/assistant/traveler-context"),
    getAssistantJson("/assistant/knowledge-spine"),
  ]);

  return {
    travelerContext,
    knowledgeSpine,
  };
}

function PanelIcon(props: { panel: PanelKey }) {
  if (props.panel === "language") {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.8 12h16.4M12 3.5c2 2.2 3 5.1 3 8.5s-1 6.3-3 8.5c-2-2.2-3-5.1-3-8.5s1-6.3 3-8.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }

  if (props.panel === "currency") {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M8 4h5.5a4 4 0 0 1 0 8H8V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 12h6a4 4 0 0 1 0 8H8V12ZM6 8h11M6 16h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (props.panel === "assistant") {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path d="M12 3.5l1.4 4.2 4.1 1.4-4.1 1.4L12 14.7l-1.4-4.2-4.1-1.4 4.1-1.4L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M18 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
      <path d="M18 8.5a6 6 0 1 0-12 0c0 7-2.5 7.7-2.5 9h17c0-1.3-2.5-2-2.5-9Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.8 20.2a2.4 2.4 0 0 0 4.4 0" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function panelCopy(panel: PanelKey, dictionary: Record<string, string>) {
  if (panel === "profile") {
    return {
      eyebrow: "OSP Identity Profile",
      title: "Your traveler identity details",
      body: "Manage the identity details connected to your official traveler QR, OSP Pass, trip records, and future verification flows.",
      accent: "#0596A5",
      border: "rgba(5,150,165,0.22)",
      bg: "linear-gradient(135deg, rgba(234,251,250,0.96), rgba(255,255,255,0.98))",
      chips: ["QR identity", "OSP Pass", "Trip records", "Verification ready"],
    };
  }

  if (panel === "language") {
    return {
      eyebrow: "Language Access",
      title: t(dictionary, "settings.language.title", "Choose your travel language"),
      body: "Your selected language is now saved to your OSP profile. Full translated content packs will be wired later through governed language dictionaries.",
      accent: "#0ea5b7",
      bg: "#ecfeff",
      border: "#bfeaf0",
    };
  }

  if (panel === "currency") {
    return {
      eyebrow: "Currency / FX",
      title: "Review traveler currency options",
      body: "Choose the currency used for traveler display estimates. PHP remains the booking, payment, and settlement source of truth.",
      chips: ["PHP", "USD", "EUR", "GBP", "JPY", "KRW", "CNY", "HKD", "TWD", "AUD", "NZD", "SGD", "CAD", "THB", "MYR", "ILS"],
      accent: "#d97706",
      bg: "#fff8eb",
      border: "#f6e1b5",
    };
  }

  if (panel === "assistant") {
    return {
      eyebrow: "OSP Travel Assistant",
      title: "Ask Kuya Tala™ for trip guidance",
      body: "Kuya Tala™ helps you understand trip readiness, QR/pass status, Passport Trails, verified stops, payments, Siargao access, and responsible movement. It cannot approve, issue, unlock, book, or confirm anything without system records.",
      chips: ["Pass help", "Trip status", "QR guidance", "Passport Map", "Payment status", "Language help"],
      accent: "#7c3aed",
      bg: "#f5f3ff",
      border: "#ddd6fe",
    };
  }

  return {
    eyebrow: "Notifications",
    title: "Traveler alerts and updates",
    body: "See important trip, pass, payment, safety, and Passport Trail updates in one place.",
    chips: ["Pass updates", "Trip alerts", "Payment updates", "Checkpoint notices"],
    accent: "#2563eb",
    bg: "#eff6ff",
    border: "#cfe0f7",
  };
}

function LanguageSelector(props: {
  currentLanguage: string;
  accent: string;
  border: string;
  saved: boolean;
  languageOptions: LanguageOption[];
}) {
  const normalizedOptions = props.languageOptions
    .filter((option) => option?.code && option?.label)
    .sort((a, b) => {
      const aGroupIndex = LANGUAGE_GROUP_ORDER.indexOf(a.group);
      const bGroupIndex = LANGUAGE_GROUP_ORDER.indexOf(b.group);

      if (aGroupIndex !== bGroupIndex) {
        if (aGroupIndex === -1) return 1;
        if (bGroupIndex === -1) return -1;
        return aGroupIndex - bGroupIndex;
      }

      return a.label.localeCompare(b.label);
    });

  const activeOption =
    normalizedOptions.find((option) => option.code === props.currentLanguage) ||
    normalizedOptions[0] ||
    FALLBACK_LANGUAGE_OPTIONS[0];

  return (
    <div style={{ marginTop: 16, display: "grid", gap: 14 }}>
      {props.saved ? (
        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(5,150,165,0.20)",
            background: "linear-gradient(135deg, #ecfeff, #ffffff)",
            color: "#013863",
            padding: "12px 14px",
            fontSize: 12,
            fontWeight: 900,
            boxShadow: "0 12px 28px rgba(1,56,99,0.08)",
          }}
        >
          Language preference saved to your OSP profile.
        </div>
      ) : null}

      <section
        style={{
          borderRadius: 24,
          border: `1px solid ${props.border}`,
          background: "linear-gradient(180deg, #ffffff 0%, #f7fdff 100%)",
          padding: 16,
          boxShadow: "0 18px 42px rgba(1,56,99,0.10)",
          display: "grid",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: props.accent,
              marginBottom: 6,
            }}
          >
            Active Travel Language
          </div>

          <div
            style={{
              borderRadius: 20,
              border: "1px solid rgba(5,150,165,0.16)",
              background: "linear-gradient(135deg, rgba(234,251,250,0.95), rgba(255,255,255,0.98))",
              padding: "12px 14px",
              display: "grid",
              gap: 4,
            }}
          >
            <strong
              style={{
                color: "#013863",
                fontSize: 17,
                lineHeight: 1.15,
                fontWeight: 950,
                letterSpacing: "-0.025em",
              }}
            >
              {activeOption.label}
            </strong>
            <span
              style={{
                color: "#50668B",
                fontSize: 12,
                lineHeight: 1.35,
                fontWeight: 750,
              }}
            >
              Current setting: {activeOption.code.toUpperCase()} · {activeOption.group || "Language Pack"}
            </span>
          </div>
        </div>

        <form action={updatePreferredLanguage} style={{ display: "grid", gap: 10 }}>
          <label
            style={{
              display: "grid",
              gap: 7,
              color: "#013863",
              fontSize: 13,
              fontWeight: 900,
            }}
          >
            Choose language pack
            <select
              name="preferredLanguage"
              defaultValue={activeOption.code}
              aria-label="Choose traveler language pack"
              style={{
                width: "100%",
                minHeight: 52,
                borderRadius: 18,
                border: `1px solid ${props.border}`,
                background: "#ffffff",
                color: "#013863",
                padding: "0 14px",
                fontSize: 15,
                fontWeight: 850,
                outline: "none",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.80)",
              }}
            >
              {normalizedOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label} · {option.group || "Language Pack"}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            style={{
              minHeight: 50,
              border: 0,
              borderRadius: 18,
              background: "linear-gradient(135deg, #013863, #0596A5)",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 950,
              cursor: "pointer",
              boxShadow: "0 14px 30px rgba(1,56,99,0.18)",
            }}
          >
            Save language preference
          </button>
        </form>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: 12,
            lineHeight: 1.45,
            fontWeight: 700,
          }}
        >
          This controls traveler-facing labels where approved language pack dictionary values are available. Missing translations safely fall back to English.
        </p>
      </section>
    </div>
  );
}


function CurrencySelector(props: {
  currentCurrency: string;
  accent: string;
  border: string;
  saved: boolean;
}) {
  const normalizedCurrency = String(props.currentCurrency || "PHP").trim().toUpperCase();
  const activeOption =
    DISPLAY_CURRENCY_OPTIONS.find((option) => option.code === normalizedCurrency) ||
    DISPLAY_CURRENCY_OPTIONS.find((option) => option.code === "PHP") ||
    DISPLAY_CURRENCY_OPTIONS[0];

  const settlementOption = DISPLAY_CURRENCY_OPTIONS.find((option) => option.code === "PHP") || DISPLAY_CURRENCY_OPTIONS[0];

  return (
    <div style={{ marginTop: 16, display: "grid", gap: 14 }}>
      {props.saved ? (
        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(243,174,38,0.34)",
            background: "linear-gradient(135deg, rgba(255,247,237,0.96), rgba(255,255,255,0.98))",
            color: "#013863",
            padding: "12px 14px",
            fontSize: 12,
            fontWeight: 900,
            boxShadow: "0 12px 28px rgba(1,56,99,0.08)",
          }}
        >
          Currency display preference saved to your OSP profile.
        </div>
      ) : null}

      <section
        style={{
          borderRadius: 24,
          border: `1px solid ${props.border}`,
          background: "linear-gradient(180deg, #ffffff 0%, #fffaf0 100%)",
          padding: 16,
          boxShadow: "0 18px 42px rgba(1,56,99,0.10)",
          display: "grid",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: props.accent,
              marginBottom: 6,
            }}
          >
            Active Display Currency
          </div>

          <div
            style={{
              borderRadius: 20,
              border: "1px solid rgba(243,174,38,0.26)",
              background: "linear-gradient(135deg, rgba(255,247,237,0.96), rgba(255,255,255,0.98))",
              padding: "13px 14px",
              display: "grid",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <strong
                style={{
                  color: "#013863",
                  fontSize: 22,
                  lineHeight: 1,
                  fontWeight: 950,
                  letterSpacing: "-0.035em",
                }}
              >
                {activeOption.code}
              </strong>

              <span
                style={{
                  borderRadius: 999,
                  background: activeOption.code === "PHP" ? "rgba(243,174,38,0.24)" : "rgba(5,150,165,0.12)",
                  color: activeOption.code === "PHP" ? "#7a4a00" : "#013863",
                  padding: "6px 9px",
                  fontSize: 10,
                  fontWeight: 950,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap",
                }}
              >
                {activeOption.note}
              </span>
            </div>

            <span
              style={{
                color: "#50668B",
                fontSize: 12,
                lineHeight: 1.35,
                fontWeight: 750,
              }}
            >
              {activeOption.label}
            </span>
          </div>
        </div>

        <form action={updatePreferredDisplayCurrency} style={{ display: "grid", gap: 10 }}>
          <label
            style={{
              display: "grid",
              gap: 7,
              color: "#013863",
              fontSize: 13,
              fontWeight: 900,
            }}
          >
            Choose display currency
            <select
              name="preferredDisplayCurrencyCode"
              defaultValue={activeOption.code}
              aria-label="Choose traveler display currency"
              style={{
                width: "100%",
                minHeight: 52,
                borderRadius: 18,
                border: `1px solid ${props.border}`,
                background: "#ffffff",
                color: "#013863",
                padding: "0 14px",
                fontSize: 15,
                fontWeight: 850,
                outline: "none",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.80)",
              }}
            >
              {DISPLAY_CURRENCY_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.code} · {option.label} · {option.note}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            style={{
              minHeight: 50,
              border: 0,
              borderRadius: 18,
              background: "linear-gradient(135deg, #013863, #F3AE26)",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 950,
              cursor: "pointer",
              boxShadow: "0 14px 30px rgba(1,56,99,0.18)",
            }}
          >
            Save currency preference
          </button>
        </form>

        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(1,56,99,0.12)",
            background: "rgba(255,255,255,0.78)",
            padding: 12,
            display: "grid",
            gap: 6,
          }}
        >
          <strong style={{ color: "#013863", fontSize: 12, fontWeight: 950 }}>
            Settlement remains {settlementOption.code}
          </strong>
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: 12,
              lineHeight: 1.45,
              fontWeight: 700,
            }}
          >
            This changes traveler display estimates only. Booking totals, payment settlement, operator payout, and official receipts remain governed by PHP records and booking-time FX snapshots.
          </p>
        </div>
      </section>
    </div>
  );
}




function formatAlertDate(value?: string) {
  if (!value) return "Now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Now";

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
}

function AlertsPanel(props: {
  accent: string;
  border: string;
  notifications: TravelerNotification[];
}) {
  const notifications = Array.isArray(props.notifications) ? props.notifications : [];
  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const totalCount = notifications.length;
  const readCount = Math.max(totalCount - unreadCount, 0);

  const alertCards = [
    {
      title: "Trip updates",
      label: "Itinerary",
      body: "Trip date changes, booking movement, and readiness updates appear here.",
      icon: "✦",
      href: "/traveler/trips",
      bg: "#F1FAFF",
      border: "rgba(125,211,252,0.62)",
      iconBg: "#E0F7FF",
      iconColor: "#05788A",
    },
    {
      title: "Pass & QR",
      label: "Credential",
      body: "Pass status, QR readiness, and access reminders stay connected here.",
      icon: "⌁",
      href: "/traveler/pass",
      bg: "#F4FCFA",
      border: "rgba(153,226,218,0.72)",
      iconBg: "#DDF8F3",
      iconColor: "#078DA0",
    },
    {
      title: "Payments",
      label: "Receipts",
      body: "Payment status, receipts, and settlement notes are grouped clearly.",
      icon: "₱",
      href: "/traveler/payments",
      bg: "#FFF8EA",
      border: "rgba(243,174,38,0.38)",
      iconBg: "#FFF0C8",
      iconColor: "#B96B00",
    },
    {
      title: "Email alerts",
      label: "Inbox",
      body: "Important OSP updates can also be followed through your account email.",
      icon: "@",
      href: "/traveler/settings?panel=notifications",
      bg: "#F8FAFF",
      border: "rgba(191,219,254,0.68)",
      iconBg: "#EAF2FF",
      iconColor: "#2563EB",
    },
    {
      title: "Safety & access",
      label: "Priority",
      body: "Emergency, safety, and access notices are kept close to your trip.",
      icon: "!",
      href: "/traveler/emergency-safety",
      bg: "#FFF7F5",
      border: "rgba(251,146,60,0.34)",
      iconBg: "#FFE8DF",
      iconColor: "#C2410C",
    },
    {
      title: "Passport Trails",
      label: "Journey",
      body: "Trail progress, Passport Map reminders, and stop updates appear here.",
      icon: "⌖",
      href: "/traveler/passport-trails",
      bg: "#F7F7FF",
      border: "rgba(196,181,253,0.46)",
      iconBg: "#ECE9FF",
      iconColor: "#6D4AFF",
    },
  ];

  const displayAlerts =
    notifications.length > 0
      ? notifications.slice(0, 5).map((item) => ({
          id: item.id,
          title: item.title,
          body: item.body || "Open this update for more details.",
          time: formatAlertDate(item.createdAt),
          icon: item.isRead ? "✓" : "•",
          isRead: Boolean(item.isRead),
          bg: item.isRead ? "#F8FCFF" : "#F4FCFA",
          border: item.isRead ? "rgba(219,232,239,0.95)" : "rgba(153,226,218,0.72)",
          color: item.isRead ? "#19305A" : "#078DA0",
        }))
      : [
          {
            id: "",
            title: "No urgent alerts",
            body: "Your important OSP updates will appear here as your journey moves forward.",
            time: "Now",
            icon: "✓",
            isRead: true,
            bg: "#F4FCFA",
            border: "rgba(153,226,218,0.72)",
            color: "#078DA0",
          },
        ];

  return (
    <section
      aria-label="Traveler alerts center"
      style={{
        marginTop: 16,
        display: "grid",
        gap: 14,
      }}
    >
      <div
        style={{
          borderRadius: 32,
          background: "#FFFFFF",
          border: "1px solid rgba(219,232,239,0.95)",
          boxShadow: "0 22px 58px rgba(1,56,99,0.10)",
          padding: 16,
          display: "grid",
          gap: 14,
        }}
      >
        <div
          style={{
            borderRadius: 28,
            background: "#F4FCFA",
            border: "1px solid rgba(153,226,218,0.72)",
            padding: 16,
            display: "grid",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div
              aria-hidden="true"
              style={{
                width: 54,
                height: 54,
                borderRadius: 22,
                background: "#DDF8F3",
                color: "#078DA0",
                display: "grid",
                placeItems: "center",
                fontSize: 24,
                fontWeight: 950,
                flex: "0 0 auto",
                boxShadow: "0 12px 26px rgba(7,141,160,0.12)",
              }}
            >
              ✓
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#078DA0",
                  marginBottom: 5,
                }}
              >
                Alert status
              </div>
              <h3
                style={{
                  margin: 0,
                  color: "#013863",
                  fontSize: 24,
                  lineHeight: 0.98,
                  letterSpacing: "-0.055em",
                  fontWeight: 860,
                }}
              >
                {unreadCount > 0 ? `${unreadCount} new alert${unreadCount === 1 ? "" : "s"}` : "No urgent alerts"}
              </h3>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#50668B",
                  fontSize: 12.8,
                  lineHeight: 1.42,
                  fontWeight: 680,
                }}
              >
                Your OSP journey updates stay organized here, from trip movement to pass, payment, safety, and Passport Trail reminders.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            {[
              ["New", String(unreadCount)],
              ["Total", String(totalCount)],
              ["Read", String(readCount)],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(153,226,218,0.42)",
                  padding: "10px 8px",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "#013863", fontSize: 18, lineHeight: 1, fontWeight: 950 }}>{value}</div>
                <div style={{ marginTop: 4, color: "#64748B", fontSize: 10, fontWeight: 850 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          {alertCards.map((item) => (
            <a
              key={item.title}
              href={item.href}
              style={{
                minHeight: 148,
                borderRadius: 26,
                background: item.bg,
                border: `1px solid ${item.border}`,
                padding: 13,
                color: "#10234A",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 11,
                boxShadow: "0 14px 34px rgba(15,23,42,0.055)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 17,
                    background: item.iconBg,
                    color: item.iconColor,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 18,
                    fontWeight: 950,
                    flex: "0 0 auto",
                  }}
                >
                  {item.icon}
                </span>

                <span
                  style={{
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.82)",
                    border: `1px solid ${item.border}`,
                    color: item.iconColor,
                    padding: "5px 8px",
                    fontSize: 9.5,
                    lineHeight: 1,
                    fontWeight: 950,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </span>
              </div>

              <div>
                <h4
                  style={{
                    margin: 0,
                    color: "#013863",
                    fontSize: 15.5,
                    lineHeight: 1.05,
                    fontWeight: 920,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#50668B",
                    fontSize: 11.6,
                    lineHeight: 1.36,
                    fontWeight: 680,
                  }}
                >
                  {item.body}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          borderRadius: 30,
          background: "#FFFFFF",
          border: "1px solid rgba(219,232,239,0.95)",
          boxShadow: "0 18px 46px rgba(1,56,99,0.08)",
          padding: 15,
          display: "grid",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#078DA0",
              }}
            >
              Recent alerts
            </div>
            <h3
              style={{
                margin: "5px 0 0",
                color: "#013863",
                fontSize: 20,
                lineHeight: 1,
                letterSpacing: "-0.045em",
                fontWeight: 850,
              }}
            >
              Latest updates
            </h3>
          </div>

          <span
            style={{
              borderRadius: 999,
              background: "#F4FCFA",
              border: "1px solid rgba(153,226,218,0.72)",
              color: "#078DA0",
              padding: "7px 9px",
              fontSize: 10,
              fontWeight: 950,
              whiteSpace: "nowrap",
            }}
          >
            {totalCount} total
          </span>
        </div>

        <div style={{ display: "grid", gap: 9 }}>
          {displayAlerts.map((alert) => (
            <div
              key={alert.id || alert.title}
              style={{
                borderRadius: 22,
                background: alert.bg,
                border: `1px solid ${alert.border}`,
                padding: 12,
                boxShadow: "0 12px 28px rgba(15,23,42,0.045)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 15,
                    background: "#FFFFFF",
                    color: alert.color,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 15,
                    fontWeight: 950,
                    flex: "0 0 auto",
                  }}
                >
                  {alert.icon}
                </span>

                <span style={{ minWidth: 0, flex: 1 }}>
                  <strong
                    style={{
                      display: "block",
                      color: "#013863",
                      fontSize: 13.4,
                      lineHeight: 1.14,
                      fontWeight: 920,
                    }}
                  >
                    {alert.title}
                  </strong>
                  <span
                    style={{
                      display: "block",
                      marginTop: 4,
                      color: "#50668B",
                      fontSize: 11.7,
                      lineHeight: 1.38,
                      fontWeight: 680,
                    }}
                  >
                    {alert.body}
                  </span>
                </span>

                <span
                  style={{
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.82)",
                    border: `1px solid ${alert.border}`,
                    color: alert.color,
                    padding: "5px 8px",
                    fontSize: 9.5,
                    fontWeight: 950,
                    whiteSpace: "nowrap",
                  }}
                >
                  {alert.time}
                </span>
              </div>

              {alert.id && !alert.isRead ? (
                <form action={markTravelerNotificationRead} style={{ marginTop: 10 }}>
                  <input type="hidden" name="notificationId" value={alert.id} />
                  <button
                    type="submit"
                    style={{
                      minHeight: 38,
                      width: "100%",
                      borderRadius: 999,
                      border: "1px solid rgba(153,226,218,0.72)",
                      background: "#FFFFFF",
                      color: "#078DA0",
                      fontSize: 11,
                      fontWeight: 950,
                      cursor: "pointer",
                    }}
                  >
                    Mark as read
                  </button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


async function getTravelerNotifications(): Promise<TravelerNotification[]> {
  try {
    const token = await requireAccessToken();

    const res = await fetch(`${getApiBaseUrl()}/notifications`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return [];

    const payload = await res.json().catch(() => null);
    const rows = Array.isArray(payload) ? payload : Array.isArray(payload?.notifications) ? payload.notifications : [];

    return rows
      .map((row: any) => ({
        id: String(row?.id || ""),
        userId: row?.userId ? String(row.userId) : undefined,
        notificationType: row?.notificationType ? String(row.notificationType) : "GENERAL",
        title: String(row?.title || "OSP update"),
        body: String(row?.body || ""),
        isRead: Boolean(row?.isRead),
        createdAt: row?.createdAt ? String(row.createdAt) : undefined,
      }))
      .filter((row: TravelerNotification) => row.id && row.title);
  } catch {
    return [];
  }
}

async function markTravelerNotificationRead(formData: FormData) {
  "use server";

  const notificationId = String(formData.get("notificationId") || "").trim();

  if (!notificationId) {
    redirect("/traveler/settings?panel=notifications");
  }

  try {
    const token = await requireAccessToken();

    await fetch(`${getApiBaseUrl()}/notifications/read`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationId }),
    });
  } catch {
    // Keep the traveler page stable if read-state update fails.
  }

  revalidatePath("/traveler/settings");
  redirect("/traveler/settings?panel=notifications");
}

async function sendKuyaTalaChatMessage(formData: FormData) {
  "use server";

  const message = String(formData.get("message") || "").trim();

  if (!message) {
    redirect("/traveler/settings?panel=assistant&assistantStatus=empty");
  }

  try {
    const token = await requireAccessToken();
    const res = await fetch(`${getApiBaseUrl()}/assistant/chat/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        source: "traveler-settings-assistant",
        message,
      }),
    });

    const payload = await res.json().catch(() => null);
    const status = res.ok && payload?.ok ? "sent" : "failed";

    const params = new URLSearchParams({
      panel: "assistant",
      assistantStatus: status,
      assistantMessage: message.slice(0, 280),
    });

    redirect(`/traveler/settings?${params.toString()}`);
  } catch {
    const params = new URLSearchParams({
      panel: "assistant",
      assistantStatus: "failed",
      assistantMessage: message.slice(0, 280),
    });

    redirect(`/traveler/settings?${params.toString()}`);
  }
}

function safeList(value: any) {
  return Array.isArray(value) ? value : [];
}

function safeText(value: any, fallback = "Not confirmed") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

function KuyaTalaChatShell(props: { topic?: string }) {
  return <KuyaTalaChatBox topic={props.topic} />;
}

function KuyaTalaAssistantPanel(props: {
  assistantData: any;
  submittedMessage?: string;
  assistantStatus?: string;
  topic?: string;
}) {
  const assistantDataSafe = props.assistantData || {};
  const context = assistantDataSafe?.travelerContext || { ok: false, error: "Traveler context not loaded yet." };
  const spine = assistantDataSafe?.knowledgeSpine || { ok: false, error: "Knowledge spine not loaded yet." };
  const greeting =
    spine?.responsePolicy?.simpleGreeting ||
    "Maayong adlaw — I’m Kuya Tala™, your Siargao Journey Guide. I can help you understand your trip readiness, QR/pass status, Passport Trails, verified stops, payments, and responsible movement around Siargao. What would you like help with today?";

  const tripState = context?.tripLifecycle?.returnContinuityState || "Not confirmed";
  const latestTrip = context?.latestTrip;
  const passAndQr = context?.passAndQr || {};
  const bookingPaymentManifest = context?.bookingPaymentManifest || {};
  const coverage = spine?.spineCoverage || {};
  const domains = spine?.knowledgeDomains || {};
  const dbKnowledge = spine?.dbKnowledge || {};
  const siargaoTourism = safeList(domains?.siargaoTourismAndGlobalAccess);
  const hardLimits = safeList(spine?.doctrine?.hardLimits);
  const hasContext = Boolean(context?.ok);
  const hasSpine = Boolean(spine?.ok);

  const shellStyle = {
    borderRadius: 26,
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(240,253,250,0.92))",
    border: "1px solid rgba(191,231,238,0.92)",
    boxShadow: "0 18px 46px rgba(15,23,42,0.08)",
    padding: 14,
  };

  const chipStyle = {
    borderRadius: 999,
    padding: "8px 10px",
    background: "#f8fafc",
    border: "1px solid #dbeafe",
    color: "#53657d",
    fontSize: 10.5,
    fontWeight: 820,
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
  };

  function ValueCard(props: {
    label: string;
    value: any;
    note?: string;
    tone?: "teal" | "green" | "amber" | "blue";
  }) {
    const toneMap = {
      teal: { bg: "#ecfeff", border: "#a5f3fc", color: "#078da0" },
      green: { bg: "#f0fdf4", border: "#bbf7d0", color: "#15803d" },
      amber: { bg: "#fffbeb", border: "#fde68a", color: "#b45309" },
      blue: { bg: "#eff6ff", border: "#bfdbfe", color: "#2563eb" },
    };
    const tone = toneMap[props.tone || "blue"];

    return (
      <div
        style={{
          borderRadius: 18,
          padding: 12,
          background: tone.bg,
          border: `1px solid ${tone.border}`,
          minHeight: 86,
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: tone.color,
          }}
        >
          {props.label}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 15,
            lineHeight: 1.08,
            fontWeight: 900,
            color: "#10234a",
            overflowWrap: "anywhere",
          }}
        >
          {safeText(props.value)}
        </div>
        {props.note ? (
          <div
            style={{
              marginTop: 5,
              fontSize: 10.5,
              lineHeight: 1.3,
              fontWeight: 650,
              color: "#64748b",
            }}
          >
            {safeText(props.note, "")}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <section
      aria-label="Kuya Tala AI Assistant"
      style={{
        marginTop: 18,
        display: "grid",
        gap: 12,
      }}
    >
      <div
        style={{
          borderRadius: 30,
          padding: 13,
          background:
            "radial-gradient(circle at 12% 0%, rgba(20,184,198,0.22), transparent 34%), radial-gradient(circle at 95% 12%, rgba(245,158,11,0.14), transparent 32%), linear-gradient(145deg, rgba(236,254,255,0.98), rgba(255,255,255,0.94))",
          border: "1px solid rgba(125,211,252,0.76)",
          boxShadow:
            "0 24px 70px rgba(8,61,103,0.12), inset 0 1px 0 rgba(255,255,255,0.92)",
        }}
      >
        <div style={shellStyle}>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 54,
                height: 54,
                borderRadius: 21,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #14b8c6, #078da0)",
                color: "#ffffff",
                fontSize: 17,
                fontWeight: 950,
                boxShadow: "0 14px 30px rgba(7,141,160,0.22)",
                flex: "0 0 54px",
              }}
            >
              AI
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 950,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#078da0",
                }}
              >
                Kuya Tala™
              </div>
              <h2
                style={{
                  margin: "5px 0 6px",
                  fontSize: 24,
                  lineHeight: 1,
                  letterSpacing: "-0.06em",
                  fontWeight: 820,
                  color: "#10234a",
                }}
              >
                Your Siargao Journey Guide
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 12.3,
                  lineHeight: 1.45,
                  fontWeight: 650,
                  color: "#53657d",
                }}
              >
                {greeting}
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: 13,
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 9,
            }}
          >
            <a
              href="/traveler/pass"
              style={{
                minHeight: 48,
                borderRadius: 17,
                background: "linear-gradient(135deg, #14b8c6, #078da0)",
                color: "#ffffff",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 13px",
                fontSize: 12,
                fontWeight: 900,
                boxShadow: "0 10px 24px rgba(7,141,160,0.2)",
              }}
            >
              <span>Check Pass / QR</span>
              <span aria-hidden="true">›</span>
            </a>
            <a
              href="/traveler/trips"
              style={{
                minHeight: 48,
                borderRadius: 17,
                background: "#ffffff",
                color: "#10234a",
                border: "1px solid rgba(191,231,238,0.92)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 13px",
                fontSize: 12,
                fontWeight: 900,
                boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
              }}
            >
              <span>View Trip Updates</span>
              <span aria-hidden="true">›</span>
            </a>
          </div>
        </div>
      </div>

      <div style={shellStyle}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 950,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#078da0",
          }}
        >
          Live DB Context
        </div>
        <div
          style={{
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 9,
          }}
        >
          <ValueCard
            label="Assistant Context"
            value={hasContext ? "Connected" : "Unavailable"}
            note={context?.source || context?.error || "DB read-only context"}
            tone={hasContext ? "green" : "amber"}
          />
          <ValueCard
            label="Knowledge Spine"
            value={hasSpine ? "Connected" : "Unavailable"}
            note={spine?.source || spine?.error || "Approved OSP/SPM doctrine"}
            tone={hasSpine ? "green" : "amber"}
          />
          <ValueCard
            label="Return State"
            value={tripState}
            note="Ingress/egress derived, not invented."
            tone="teal"
          />
          <ValueCard
            label="Pass / QR"
            value={passAndQr?.hasQrCredential ? "QR available" : "Not confirmed"}
            note={`Pass status: ${passAndQr?.latestPassStatus || "Not confirmed"}`}
            tone={passAndQr?.hasQrCredential ? "green" : "blue"}
          />
          <ValueCard
            label="Payment"
            value={bookingPaymentManifest?.latestPaymentState || "Not confirmed"}
            note={`Booking: ${bookingPaymentManifest?.latestBookingStatus || "Not confirmed"}`}
            tone="amber"
          />
          <ValueCard
            label="Trip"
            value={latestTrip?.tripStatus || "Not confirmed"}
            note={latestTrip?.id ? `Trip ID: ${latestTrip.id}` : "No visible trip record"}
            tone="blue"
          />
        </div>
      </div>

      <div style={shellStyle}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 950,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#078da0",
          }}
        >
          Covered Knowledge
        </div>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            flexWrap: "wrap",
            gap: 7,
          }}
        >
          {[
            ["OSP Core", coverage?.ospCore],
            ["Trip Readiness", coverage?.travelerTripLifecycle],
            ["Pass + QR", coverage?.passAndQrCredential],
            ["Payments", coverage?.bookingPaymentManifest],
            ["Passport Trails", coverage?.spmPassportTrails],
            ["Partner-led Tours", coverage?.partnerLedTours],
            ["Curated Tours", coverage?.passportTrailsCuratedTours],
            ["DIY Tour-led Activities", coverage?.diyTourLedActivities],
            ["Siargao Tourism", coverage?.siargaoTourismAndGlobalAccess],
            ["Language + FX", coverage?.languageAndFx],
            ["Safety + Compliance", coverage?.safetyAndCompliance],
          ].map(([label, enabled]) => (
            <span key={String(label)} style={chipStyle}>
              <span aria-hidden="true">{enabled ? "✓" : "•"}</span>
              {label}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: 12,
            borderRadius: 20,
            padding: 12,
            background: "linear-gradient(135deg, #ecfeff, #ffffff)",
            border: "1px solid rgba(125,211,252,0.76)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 950,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#078da0",
            }}
          >
            Siargao Tourism Guidance
          </div>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 11.5,
              lineHeight: 1.42,
              fontWeight: 650,
              color: "#53657d",
            }}
          >
            {siargaoTourism[0] ||
              "Kuya Tala™ can guide travelers on Siargao tourism and responsible access planning, but live schedules, fares, weather, advisories, and entry rules require verified sources."}
          </p>
        </div>
      </div>

      <KuyaTalaChatShell topic={props.topic} />
    </section>
  );
}


function getSettingsKuyaTalaConfig(panel: string) {
  if (panel === "language") {
    return {
      eyebrow: "Kuya Tala™ Settings Help",
      title: "Choose the language you are comfortable using.",
      body: "Language settings should help you navigate OSP clearly. This screen is for choosing the app language, not opening the Passport Map.",
      primaryLabel: "Apply language setting",
      primaryHref: "/traveler/settings?panel=language",
      secondaryLabel: "Back to Settings",
      secondaryHref: "/traveler/settings",
    };
  }

  if (panel === "currency") {
    return {
      eyebrow: "Kuya Tala™ Settings Help",
      title: "Choose how prices are displayed.",
      body: "Currency settings affect how prices are shown while browsing and booking. Final payment amounts may still depend on provider, fees, and payment method.",
      primaryLabel: "Apply currency setting",
      primaryHref: "/traveler/settings?panel=currency",
      secondaryLabel: "View payments",
      secondaryHref: "/traveler/payments",
    };
  }

  return {
    eyebrow: "Kuya Tala™ Profile Help",
    title: "Keep your traveler profile ready.",
    body: "Your profile supports your OSP Pass, emergency details, trip records, and safer traveler assistance while in Siargao.",
    primaryLabel: "View OSP Pass",
    primaryHref: "/traveler/pass",
    secondaryLabel: "Update emergency contact",
    secondaryHref: "/traveler/emergency-safety",
  };
}

export default async function TravelerSettingsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const user = await getCurrentUser();
  const languageOptions = await getLanguagePacks();
  const activePanel = getPanel(searchParams);
  const kuyaTalaSettingsConfig = getSettingsKuyaTalaConfig(activePanel);

  const saved = getSaved(searchParams);
  const currentLanguage = user?.preferredLanguage || "en";
  const currentDisplayCurrency = user?.preferredDisplayCurrencyCode || "USD";
  const travelerProfile = user?.travelerProfile || null;
  const currentBirthDate = travelerProfile?.birthDate ? String(travelerProfile.birthDate).slice(0, 10) : "";
  const profileDefaults = {
    fullName: user?.fullName || "",
    email: user?.email || "",
    displayName: user?.displayName || "",
    mobileNumber: user?.mobileNumber || "",
    nationalityCode: travelerProfile?.nationalityCode || "PH",
    homeCountry: travelerProfile?.homeCountry || "",
    birthDate: currentBirthDate,
  };
  const dictionary = await getTravelerDictionary(currentLanguage);
  const assistantData = activePanel === "assistant" ? await getKuyaTalaAssistantData() : null;
  const notifications = activePanel === "notifications" ? await getTravelerNotifications() : [];
  const assistantStatus = getSingleSearchParam(searchParams, "assistantStatus");
  const assistantMessage = getSingleSearchParam(searchParams, "assistantMessage");
  const assistantTopic = getSingleSearchParam(searchParams, "topic");
  const profileError = getSingleSearchParam(searchParams, "profileError");
  const copy = panelCopy(activePanel, dictionary);

  const tabs: { key: PanelKey; label: string; href: string }[] = [
    { key: "profile", label: "Profile", href: "/traveler/settings?panel=profile" },
    { key: "language", label: "Language", href: "/traveler/settings?panel=language" },
    { key: "currency", label: "Currency", href: "/traveler/settings?panel=currency" },
    { key: "assistant", label: "AI Guide", href: "/traveler/settings?panel=assistant" },
    { key: "notifications", label: "Alerts", href: "/traveler/settings?panel=notifications" },
  ];

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
      <div style={{ marginBottom: 16 }}>
        <a
          href="/traveler/home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: 42,
            borderRadius: 999,
            border: "1px solid #dbe8ef",
            padding: "0 12px",
            background: "linear-gradient(135deg, #ffffff, #f4fdff)",
            color: "#19305a",
            textDecoration: "none",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          ← Back
        </a>
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
          One Siargao Pass
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
          {t(dictionary, "settings.title", "Traveler Controls")}
        </h1>
        <p style={{ marginTop: 9, marginBottom: 0, color: "#64748b", lineHeight: 1.4, fontSize: 14 }}>
          Profile, language, currency, assistant access, emergency safety, and alerts.
        </p>
      </header>

      <a
        href="/traveler/emergency-safety"
        aria-label="Open Emergency and Safety"
        title="Emergency & Safety primary traveler control"
        style={{
          width: "100%",
          minHeight: 78,
          borderRadius: 24,
          padding: "13px 14px",
          marginBottom: 14,
          background:
            "linear-gradient(135deg, rgba(255,241,242,0.98), rgba(255,255,255,0.96))",
          border: "1px solid rgba(254,202,202,0.95)",
          color: "#10234a",
          textDecoration: "none",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 14px 34px rgba(220,38,38,0.10)",
          boxSizing: "border-box",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 46,
            height: 46,
            borderRadius: 18,
            background: "linear-gradient(135deg, #ef4444, #b91c1c)",
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            fontSize: 22,
            fontWeight: 950,
            boxShadow: "0 12px 26px rgba(220,38,38,0.18)",
          }}
        >
          !
        </span>

        <span style={{ display: "grid", gap: 3, minWidth: 0 }}>
          <strong
            style={{
              fontSize: 14,
              lineHeight: 1.05,
              fontWeight: 950,
              letterSpacing: "-0.025em",
              color: "#10234a",
            }}
          >
            Emergency & Safety
          </strong>
          <span
            style={{
              fontSize: 11.2,
              lineHeight: 1.35,
              fontWeight: 680,
              color: "#64748b",
            }}
          >
            Quickly access trip safety guidance, OSP Pass / QR, and emergency readiness information.
          </span>
        </span>

        <span
          aria-hidden="true"
          style={{
            width: 30,
            height: 30,
            borderRadius: 13,
            background: "#ffffff",
            border: "1px solid rgba(254,202,202,0.95)",
            color: "#b91c1c",
            display: "grid",
            placeItems: "center",
            fontSize: 18,
            fontWeight: 950,
          }}
        >
          ›
        </span>
      </a>

      <nav
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 7,
          marginBottom: 14,
        }}
      >
        {tabs.map((tab) => {
          const active = tab.key === activePanel;
          return (
            <a
              key={tab.key}
              href={tab.href}
              style={{
                minHeight: 42,
                borderRadius: 999,
                border: active ? "1px solid #16bfd3" : "1px solid #dbe8ef",
                background: active ? "#ecfeff" : "#ffffff",
                color: active ? "#0e7490" : "#19305a",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 950,
                boxShadow: "0 8px 18px rgba(15,23,42,0.035)",
              }}
            >
              {tab.label}
            </a>
          );
        })}
      </nav>

      <section
        style={{
          border: `1px solid ${copy.border}`,
          borderRadius: 24,
          background: copy.bg,
          padding: 18,
          boxShadow: "0 14px 34px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            width: 48,
            minHeight: 48,
            borderRadius: 16,
            border: `1px solid ${copy.border}`,
            background: "linear-gradient(135deg, #ffffff, #f4fdff)",
            color: copy.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          <PanelIcon panel={activePanel} />
        </div>

        <div
          style={{
            fontSize: 11,
            fontWeight: 950,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: copy.accent,
          }}
        >
          {copy.eyebrow}
        </div>

        <h2
          style={{
            margin: "7px 0 0",
            fontSize: 26,
            lineHeight: 1.04,
            letterSpacing: "-0.045em",
            color: "#19305a",
          }}
        >
          {copy.title}
        </h2>

        <p style={{ margin: "10px 0 0", color: "#475569", fontSize: 14, lineHeight: 1.45, fontWeight: 650 }}>
          {copy.body}
        </p>

        {activePanel === "profile" ? (
          <section
            style={{
              border: "1px solid rgba(5,150,165,0.20)",
              background: "linear-gradient(180deg, #ffffff 0%, #f7fdff 100%)",
              borderRadius: 30,
              padding: 18,
              boxShadow: "0 20px 48px rgba(1,56,99,0.12)",
              display: "grid",
              gap: 16,
            }}
          >
            {saved ? (
              <div
                style={{
                  border: "1px solid rgba(5,150,165,0.18)",
                  background: "rgba(234,251,250,0.92)",
                  borderRadius: 22,
                  padding: 16,
                  color: "#013863",
                  fontWeight: 800,
                }}
              >
                Traveler identity profile saved to your OSP account.
              </div>
            ) : null}

            <div>
              <p
                style={{
                  margin: 0,
                  color: "#0596A5",
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                OSP Identity Profile
              </p>
              <h2 style={{ margin: "6px 0 0", color: "#013863", fontSize: 22, lineHeight: 1.1 }}>
                Your traveler identity details
              </h2>
              <p style={{ margin: "8px 0 0", color: "#50668B", lineHeight: 1.55 }}>
                These details support your official traveler QR identity, OSP Pass, trip records, and future verification flows.
              </p>
            </div>

            {profileError ? (
              <div
                style={{
                  border: "1px solid rgba(248,113,113,0.26)",
                  background: "rgba(255,241,242,0.94)",
                  borderRadius: 22,
                  padding: 16,
                  color: "#991b1b",
                  fontWeight: 800,
                  lineHeight: 1.4,
                }}
              >
                {profileError === "missing-name"
                  ? "Please enter your full name before saving."
                  : "We could not save your profile yet. Please sign in again or try later."}
              </div>
            ) : null}

            <form action={updateTravelerProfile} style={{ display: "grid", gap: 12 }}>
              <label style={{ display: "grid", gap: 6, color: "#013863", fontWeight: 800 }}>
                Full name
                <input
                  name="fullName"
                  defaultValue={profileDefaults.fullName}
                  autoComplete="name"
                  required
                  style={{ border: "1px solid rgba(1,56,99,0.18)", borderRadius: 16, padding: "12px 14px", fontSize: 15 }}
                />
              </label>

              <label style={{ display: "grid", gap: 6, color: "#013863", fontWeight: 800 }}>
                Email address
                <input
                  type="email"
                  name="email"
                  defaultValue={profileDefaults.email}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  style={{ border: "1px solid rgba(1,56,99,0.18)", borderRadius: 16, padding: "12px 14px", fontSize: 15 }}
                />
              </label>

              <label style={{ display: "grid", gap: 6, color: "#013863", fontWeight: 800 }}>
                Display name
                <input
                  name="displayName"
                  defaultValue={profileDefaults.displayName}
                  style={{ border: "1px solid rgba(1,56,99,0.18)", borderRadius: 16, padding: "12px 14px", fontSize: 15 }}
                />
              </label>

              <label style={{ display: "grid", gap: 6, color: "#013863", fontWeight: 800 }}>
                Mobile number
                <input
                  name="mobileNumber"
                  defaultValue={profileDefaults.mobileNumber}
                  autoComplete="tel"
                  inputMode="tel"
                  style={{ border: "1px solid rgba(1,56,99,0.18)", borderRadius: 16, padding: "12px 14px", fontSize: 15 }}
                />
              </label>

              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }}>
                <label style={{ display: "grid", gap: 6, color: "#013863", fontWeight: 800 }}>
                  Nationality code
                  <input
                    name="nationalityCode"
                    defaultValue={profileDefaults.nationalityCode}
                    maxLength={3}
                    style={{
                      border: "1px solid rgba(1,56,99,0.18)",
                      borderRadius: 16,
                      padding: "12px 14px",
                      fontSize: 15,
                      textTransform: "uppercase",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: 6, color: "#013863", fontWeight: 800 }}>
                  Home country
                  <input
                    name="homeCountry"
                    defaultValue={profileDefaults.homeCountry}
                    style={{ border: "1px solid rgba(1,56,99,0.18)", borderRadius: 16, padding: "12px 14px", fontSize: 15 }}
                  />
                </label>
              </div>

              <label style={{ display: "grid", gap: 6, color: "#013863", fontWeight: 800 }}>
                Birth date
                <input
                  type="date"
                  name="birthDate"
                  defaultValue={profileDefaults.birthDate}
                  style={{ border: "1px solid rgba(1,56,99,0.18)", borderRadius: 16, padding: "12px 14px", fontSize: 15 }}
                />
              </label>

              <button
                type="submit"
                style={{
                  border: 0,
                  borderRadius: 18,
                  padding: "13px 16px",
                  background: "linear-gradient(135deg, #013863, #0596A5)",
                  color: "#ffffff",
                  fontWeight: 900,
                  cursor: "pointer",
                  boxShadow: "0 14px 30px rgba(1,56,99,0.18)",
                }}
              >
                Save traveler profile
              </button>
            </form>
          </section>
        ) : null}

        {activePanel === "language" ? (
          <LanguageSelector
            currentLanguage={currentLanguage}
            accent={copy.accent}
            border={copy.border}
            saved={saved}
            languageOptions={languageOptions}
          />
        ) : activePanel === "currency" ? (
          <CurrencySelector
            currentCurrency={currentDisplayCurrency}
            accent={copy.accent}
            border={copy.border}
            saved={saved}
          />
        ) : activePanel === "notifications" ? (
          <AlertsPanel accent={copy.accent} border={copy.border} notifications={notifications} />
        ) : (
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {(copy.chips || []).map((chip) => (
              <span
                key={chip}
                style={{
                  minHeight: 42,
                  borderRadius: 999,
                  border: `1px solid ${copy.border}`,
                  background: "linear-gradient(135deg, #ffffff, #f4fdff)",
                  color: "#19305a",
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0 11px",
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </section>

      {activePanel === "assistant" ? (
        <section
          style={{
            marginTop: 14,
          }}
        >
          <KuyaTalaAssistantPanel
            assistantData={assistantData}
            submittedMessage={assistantMessage}
            assistantStatus={assistantStatus}
            topic={assistantTopic}
          />
        </section>
      ) : null}
      {activePanel !== "notifications" ? (
        <div
          style={{
            marginTop: 10,
            paddingBottom: "calc(132px + env(safe-area-inset-bottom))",
          }}
        >
          <PassportMapShortcut
            compact
            title={kuyaTalaSettingsConfig.primaryLabel}
            body={kuyaTalaSettingsConfig.body}
            href={kuyaTalaSettingsConfig.primaryHref}
          />
        </div>
      ) : null}
      <UniversalTravelerBottomTabBar activeTab="profile" fixed />
    </main>
  );
}
