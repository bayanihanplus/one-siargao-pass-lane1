import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getApiBaseUrl, getCurrentUser, requireAccessToken } from "../../../src/lib/server-auth";

type PanelKey = "language" | "currency" | "assistant" | "notifications";

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
  { code: "JPY", label: "Japanese Yen", note: "Display estimate" },
  { code: "KRW", label: "Korean Won", note: "Display estimate" },
  { code: "CNY", label: "Chinese Yuan", note: "Display estimate" },
  { code: "HKD", label: "Hong Kong Dollar", note: "Display estimate" },
  { code: "AUD", label: "Australian Dollar", note: "Display estimate" },
  { code: "SGD", label: "Singapore Dollar", note: "Display estimate" },
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

function getPanel(searchParams?: { [key: string]: string | string[] | undefined }): PanelKey {
  const raw = searchParams?.panel;
  const value = Array.isArray(raw) ? raw[0] : raw;

  if (value === "currency") return "currency";
  if (value === "assistant") return "assistant";
  if (value === "notifications") return "notifications";
  return "language";
}

function getSaved(searchParams?: { [key: string]: string | string[] | undefined }) {
  const raw = searchParams?.saved;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "1";
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
      chips: ["PHP", "USD", "EUR", "JPY", "KRW", "CNY", "HKD", "AUD", "SGD"],
      accent: "#d97706",
      bg: "#fff8eb",
      border: "#f6e1b5",
    };
  }

  if (panel === "assistant") {
    return {
      eyebrow: "OSP Travel Assistant",
      title: "Ask for pass, trip, QR, or map guidance",
      body: "The assistant will explain and guide. It must not approve clearance, issue passes, override payment, or invent booking or stamp records.",
      chips: ["Pass help", "Trip status", "QR guidance", "Passport Map", "Payment status", "Language help"],
      accent: "#7c3aed",
      bg: "#f5f3ff",
      border: "#ddd6fe",
    };
  }

  return {
    eyebrow: "Notifications",
    title: "Traveler alerts and updates",
    body: "Notifications will support traveler attention and status awareness. Operational approvals still depend on governed backend records.",
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
  const groups = Array.from(new Set(props.languageOptions.map((option) => option.group))).sort((a, b) => {
    const aIndex = LANGUAGE_GROUP_ORDER.indexOf(a);
    const bIndex = LANGUAGE_GROUP_ORDER.indexOf(b);

    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div style={{ marginTop: 16, display: "grid", gap: 14 }}>
      {props.saved ? (
        <div
          style={{
            borderRadius: 16,
            border: "1px solid #cdeed7",
            background: "#eefdf3",
            color: "#11843d",
            padding: "10px 12px",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          Language preference saved to your OSP profile.
        </div>
      ) : null}

      {groups.map((group) => {
        const options = props.languageOptions.filter((option) => option.group === group);

        return (
          <div key={group}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: props.accent,
                marginBottom: 8,
              }}
            >
              {group} Pack
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {options.map((option) => {
                const active = option.code === props.currentLanguage;

                return (
                  <form key={option.code} action={updatePreferredLanguage}>
                    <input type="hidden" name="preferredLanguage" value={option.code} />
                    <button
                      type="submit"
                      aria-label={`Set language to ${option.label}`}
                      style={{
                        minHeight: 42,
                        borderRadius: 999,
                        border: active ? `1px solid ${props.accent}` : `1px solid ${props.border}`,
                        background: active ? props.accent : "#ffffff",
                        color: active ? "#ffffff" : "#19305a",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "0 12px",
                        fontSize: 12,
                        fontWeight: 950,
                        boxShadow: active ? "0 10px 20px rgba(14,165,183,0.18)" : "none",
                      }}
                    >
                      {active ? "✓ " : ""}
                      {option.label}
                    </button>
                  </form>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CurrencySelector(props: {
  currentCurrency: string;
  accent: string;
  border: string;
  saved: boolean;
}) {
  return (
    <div style={{ marginTop: 16, display: "grid", gap: 14 }}>
      {props.saved ? (
        <div
          style={{
            borderRadius: 16,
            border: "1px solid #cdeed7",
            background: "#eefdf3",
            color: "#11843d",
            padding: "10px 12px",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          Currency display preference saved to your OSP profile.
        </div>
      ) : null}

      <div
        style={{
          borderRadius: 18,
          border: `1px solid ${props.border}`,
          background: "linear-gradient(135deg, #ffffff, #f4fdff)",
          padding: 12,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 950,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: props.accent,
            marginBottom: 8,
          }}
        >
          Display Currency
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {DISPLAY_CURRENCY_OPTIONS.map((option) => {
            const active = option.code === props.currentCurrency;

            return (
              <form key={option.code} action={updatePreferredDisplayCurrency}>
                <input type="hidden" name="preferredDisplayCurrencyCode" value={option.code} />
                <button
                  type="submit"
                  aria-label={`Set display currency to ${option.code}`}
                  style={{
                    width: "100%",
                    minHeight: 46,
                    borderRadius: 14,
                    border: active ? `1px solid ${props.accent}` : `1px solid ${props.border}`,
                    background: active ? props.accent : "#ffffff",
                    color: active ? "#ffffff" : "#19305a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "8px 12px",
                    fontSize: 13,
                    fontWeight: 950,
                    textAlign: "left",
                    boxShadow: active ? "0 10px 20px rgba(217,119,6,0.18)" : "none",
                  }}
                >
                  <span>
                    {active ? "✓ " : ""}
                    {option.code}
                    <span style={{ display: "block", fontSize: 11, fontWeight: 750, opacity: active ? 0.9 : 0.68 }}>
                      {option.label}
                    </span>
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 900, opacity: active ? 0.9 : 0.66 }}>
                    {option.note}
                  </span>
                </button>
              </form>
            );
          })}
        </div>

        <p style={{ margin: "10px 0 0", color: "#64748b", fontSize: 12, lineHeight: 1.4, fontWeight: 700 }}>
          This changes display estimates only. PHP remains the settlement amount for bookings and payments.
        </p>
      </div>
    </div>
  );
}

export default async function TravelerSettingsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const user = await getCurrentUser();
  const languageOptions = await getLanguagePacks();
  const activePanel = getPanel(searchParams);
  const saved = getSaved(searchParams);
  const currentLanguage = user?.preferredLanguage || "en";
  const currentDisplayCurrency = user?.preferredDisplayCurrencyCode || "USD";
  const dictionary = await getTravelerDictionary(currentLanguage);
  const copy = panelCopy(activePanel, dictionary);

  const tabs: { key: PanelKey; label: string; href: string }[] = [
    { key: "language", label: "Language", href: "/traveler/settings?panel=language" },
    { key: "currency", label: "Currency", href: "/traveler/settings?panel=currency" },
    { key: "assistant", label: "AI", href: "/traveler/settings?panel=assistant" },
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
          href="/"
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
          ← Back to Home
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
          Language, currency, assistant access, and alerts.
        </p>
      </header>

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

      <section
        style={{
          marginTop: 14,
          border: "1px solid #dbe8ef",
          borderRadius: 20,
          background: "linear-gradient(135deg, #ffffff, #f4fdff)",
          padding: 16,
          boxShadow: "0 10px 26px rgba(15,23,42,0.04)",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 950, color: "#19305a", marginBottom: 6 }}>
          Controlled access only
        </div>
        <p style={{ margin: 0, color: "#64748b", fontSize: 13, lineHeight: 1.45 }}>
          Language and currency display preferences can now be saved to your OSP profile. Live FX providers, settlement FX, and AI runtime remain controlled future layers.
        </p>
      </section>
    </main>
  );
}
