import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getApiBaseUrl, getAuthCookieName } from "../../../src/lib/server-auth";
import { PasswordField, ConsentAndSubmit } from "./RegisterOnboardingControls";

/*
 * ONBOARD-03 LOCK:
 * /traveler/register is the mobile-first One Siargao QR onboarding screen.
 * It is not a generic account form.
 * It collects enum-driven onboarding context only: no random paragraph answers.
 * Backend registration contract was locked in ONBOARD-01/02.
 * This page must remain psychologically easy, traveler-first, and app-ready.
 */

type Option = {
  value: string;
  label: string;
  hint?: string;
};

const participantTypes: Option[] = [
  {
    value: "VISITOR_TOURIST",
    label: "Visitor / Tourist",
    hint: "For domestic and international travelers visiting Siargao.",
  },
  {
    value: "LOCAL_RESIDENT",
    label: "Siargao Local Resident",
    hint: "For locals who need a One Siargao QR for services, events, and participation.",
  },
  {
    value: "LONG_TERM_RESIDENT",
    label: "Long-Term Resident / Nomad",
    hint: "For Filipinos, foreigners, nomads, and long-stay residents based in Siargao.",
  },
  {
    value: "BUSINESS_OPERATOR",
    label: "Business / Operator",
    hint: "For future operator, accommodation, rental, transport, event, or merchant readiness.",
  },
  {
    value: "EVENT_PARTICIPANT",
    label: "Event Participant",
    hint: "For traveler events, weddings, private events, community events, and destination events.",
  },
  {
    value: "DESTINATION_AUTHORITY_USER",
    label: "Destination / Public Service User",
    hint: "For official destination or public-service access requests. Privileged access still requires approval.",
  },
];

const qrPurposes: Option[] = [
  { value: "TRAVEL_TO_SIARGAO", label: "Travel to Siargao" },
  { value: "TRIP_READINESS", label: "Prepare my trip / OSP Pass" },
  { value: "OSP_PASS_OR_QR_ACCESS", label: "Use my QR for Siargao access" },
  { value: "ACCOMMODATION_CHECK_IN", label: "Accommodation check-in" },
  { value: "RENTAL_OR_SERVICE_ACCESS", label: "Rental or service access" },
  { value: "TOUR_OR_ACTIVITY_CHECK_IN", label: "Tour or activity check-in" },
  { value: "PASSPORT_TRAILS_PARTICIPATION", label: "Passport Trails participation" },
  { value: "PAYMENT_OR_RECEIPT_REFERENCE", label: "Payment or receipt reference" },
  { value: "FAMILY_OR_VISITOR_SPONSOR", label: "Sponsor family or visitors" },
  { value: "PAY_FOR_FAMILY_OR_VISITOR", label: "Pay for family or visitors" },
  { value: "EVENT_ENTRY", label: "Event entry" },
  { value: "WEDDING_OR_PRIVATE_EVENT", label: "Wedding or private event" },
  { value: "LOCAL_ACTIVITY_PARTICIPATION", label: "Local activity participation" },
  { value: "BUSINESS_OR_OPERATOR_REFERENCE", label: "Business / operator reference" },
  { value: "WORK_OR_STAFF_ACCESS", label: "Work or staff access" },
  { value: "RESTAURANT_OR_MERCHANT_PARTICIPATION", label: "Restaurant / merchant participation" },
  { value: "HEALTH_WELLNESS_SERVICE_ACCESS", label: "Health / wellness service access" },
  { value: "EMERGENCY_ADVISORY_ACCESS", label: "Emergency advisory access" },
  { value: "COMMUNITY_PROGRAM", label: "Community program" },
  { value: "COMMUNITY_EVENT", label: "Community event" },
  { value: "DESTINATION_EVENT", label: "Destination event" },
  { value: "PUBLIC_SERVICE_ACCESS", label: "Public service access" },
  { value: "OTHER", label: "Other approved purpose" },
];

const qrSubjectRelations: Option[] = [
  {
    value: "SELF",
    label: "Myself",
    hint: "I am creating this QR for my own use.",
  },
  {
    value: "FAMILY_MEMBER",
    label: "My family member",
    hint: "For a family member I am helping manage.",
  },
  {
    value: "SENIOR_COMPANION",
    label: "Senior / elderly companion",
    hint: "For an elderly companion who may not operate a phone.",
  },
  {
    value: "CHILD_MINOR",
    label: "Child / minor",
    hint: "For a child or minor traveling with a guardian.",
  },
  {
    value: "ASSISTED_GUEST",
    label: "Guest or visitor I am assisting",
    hint: "For a guest, relative, or visitor I am helping register.",
  },
  {
    value: "GROUP_PARTICIPANT",
    label: "Group participant",
    hint: "For group travel, events, tours, or family trips.",
  },
];

const residentTypes: Option[] = [
  { value: "", label: "Not applicable / visitor" },
  { value: "SIARGAO_BORN_LOCAL", label: "Siargao-born local" },
  { value: "FILIPINO_RELOCATED_TO_SIARGAO", label: "Filipino relocated to Siargao" },
  { value: "FOREIGN_LONG_TERM_RESIDENT", label: "Foreign long-term resident" },
  { value: "DIGITAL_NOMAD_BASED_IN_SIARGAO", label: "Digital nomad based in Siargao" },
  { value: "WORKER_BASED_IN_SIARGAO", label: "Worker based in Siargao" },
  { value: "STUDENT", label: "Student" },
  { value: "SEASONAL_RESIDENT", label: "Seasonal resident" },
  { value: "RETURNING_FAMILY_CONNECTION", label: "Returning family connection" },
  { value: "OTHER", label: "Other resident context" },
];

const ageBrackets: Option[] = [
  { value: "UNDER_18", label: "Under 18" },
  { value: "AGE_18_24", label: "18–24" },
  { value: "AGE_25_34", label: "25–34" },
  { value: "AGE_35_44", label: "35–44" },
  { value: "AGE_45_54", label: "45–54" },
  { value: "AGE_55_64", label: "55–64" },
  { value: "AGE_65_PLUS", label: "65+" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

const travelerTypes: Option[] = [
  { value: "DOMESTIC_TOURIST", label: "Domestic tourist" },
  { value: "FOREIGN_TOURIST", label: "Foreign tourist" },
  { value: "BALIKBAYAN_RETURNING_FILIPINO", label: "Balikbayan / returning Filipino" },
  { value: "LOCAL_RESIDENT", label: "Local resident" },
  { value: "LONG_STAY_VISITOR", label: "Long-stay visitor" },
  { value: "DIGITAL_NOMAD", label: "Digital nomad" },
  { value: "BUSINESS_TRAVELER", label: "Business traveler" },
  { value: "EVENT_GUEST", label: "Event guest" },
  { value: "FAMILY_VISITOR", label: "Visiting family or friends" },
  { value: "OTHER", label: "Other" },
];

const siargaoBases: Option[] = [
  { value: "GENERAL_LUNA", label: "General Luna" },
  { value: "DAPA", label: "Dapa" },
  { value: "DEL_CARMEN", label: "Del Carmen" },
  { value: "SAN_ISIDRO", label: "San Isidro" },
  { value: "BURGOS", label: "Burgos" },
  { value: "PILAR", label: "Pilar" },
  { value: "SANTA_MONICA", label: "Santa Monica" },
  { value: "SAN_BENITO", label: "San Benito" },
  { value: "SOCORRO", label: "Socorro" },
  { value: "NOT_SURE_YET", label: "Not sure yet" },
  { value: "OTHER", label: "Other" },
];

const accommodationTypes: Option[] = [
  { value: "HOTEL_RESORT", label: "Hotel / resort" },
  { value: "HOSTEL", label: "Hostel" },
  { value: "HOMESTAY_GUESTHOUSE", label: "Homestay / guesthouse" },
  { value: "VACATION_RENTAL", label: "Vacation rental" },
  { value: "LONG_TERM_RENTAL", label: "Long-term rental" },
  { value: "STAYING_WITH_FAMILY_OR_FRIENDS", label: "Staying with family or friends" },
  { value: "STAFF_HOUSING", label: "Staff housing" },
  { value: "NOT_BOOKED_YET", label: "Not booked yet" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
  { value: "OTHER", label: "Other" },
];

const visitPurposes: Option[] = [
  { value: "LEISURE_VACATION", label: "Leisure / vacation" },
  { value: "SURFING", label: "Surfing" },
  { value: "ISLAND_HOPPING", label: "Island hopping" },
  { value: "NATURE_LAGOONS_BEACHES", label: "Nature, lagoons, and beaches" },
  { value: "FOOD_CULTURE", label: "Food and culture" },
  { value: "PASSPORT_TRAILS", label: "Passport Trails" },
  { value: "EVENT_FESTIVAL", label: "Event / festival" },
  { value: "WEDDING", label: "Wedding" },
  { value: "WORKATION_DIGITAL_NOMAD", label: "Workation / digital nomad" },
  { value: "BUSINESS", label: "Business" },
  { value: "VISITING_FAMILY_FRIENDS", label: "Visiting family or friends" },
  { value: "WELLNESS", label: "Wellness" },
  { value: "COMMUNITY_ACTIVITY", label: "Community activity" },
  { value: "OTHER", label: "Other" },
];

const partyTypes: Option[] = [
  { value: "SOLO", label: "Solo" },
  { value: "COUPLE", label: "Couple" },
  { value: "FAMILY_WITH_CHILDREN", label: "Family with children" },
  { value: "FRIENDS_GROUP", label: "Friends / group" },
  { value: "CORPORATE_GROUP", label: "Corporate group" },
  { value: "SCHOOL_OR_ORG_GROUP", label: "School / organization group" },
  { value: "TOUR_GROUP", label: "Tour group" },
  { value: "WEDDING_GROUP", label: "Wedding group" },
  { value: "EVENT_GROUP", label: "Event group" },
  { value: "OTHER", label: "Other" },
];

const partySizes: Option[] = [
  { value: "ONE", label: "1" },
  { value: "TWO", label: "2" },
  { value: "THREE_TO_FIVE", label: "3–5" },
  { value: "SIX_TO_TEN", label: "6–10" },
  { value: "ELEVEN_TO_TWENTY", label: "11–20" },
  { value: "TWENTY_ONE_PLUS", label: "21+" },
];

const countryOptions: Option[] = [
  { value: "PH", label: "Philippines" },
  { value: "AU", label: "Australia" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
  { value: "KR", label: "South Korea" },
  { value: "JP", label: "Japan" },
  { value: "CN", label: "China" },
  { value: "HK", label: "Hong Kong" },
  { value: "TW", label: "Taiwan" },
  { value: "IL", label: "Israel" },
  { value: "CA", label: "Canada" },
  { value: "OTHER", label: "Other" },
];

async function registerTravelerAction(formData: FormData) {
  "use server";

  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const mobileNumber = String(formData.get("mobileNumber") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const confirmPassword = String(formData.get("confirmPassword") || "").trim();

  if (!fullName) redirect("/traveler/register?error=missing-name");
  if (!email && !mobileNumber) redirect("/traveler/register?error=missing-contact");
  if (!password || password.length < 8) redirect("/traveler/register?error=weak-password");
  if (password !== confirmPassword) redirect("/traveler/register?error=password-mismatch");

  const privacyConsent = formData.get("privacyConsent") === "on";
  const rulesAcknowledgement = formData.get("rulesAcknowledgement") === "on";
  const dataUsePurposeAcknowledgement = formData.get("dataUsePurposeAcknowledgement") === "on";

  if (!privacyConsent) redirect("/traveler/register?error=missing-privacy-consent");
  if (!rulesAcknowledgement) redirect("/traveler/register?error=missing-rules-acknowledgement");
  if (!dataUsePurposeAcknowledgement) redirect("/traveler/register?error=missing-data-use-consent");

  const getValue = (name: string) => String(formData.get(name) || "").trim();

  const payload: Record<string, string | boolean> = {
    fullName,
    password,
    participantType: getValue("participantType") || "VISITOR_TOURIST",
    qrRegistrationPurpose: getValue("qrRegistrationPurpose") || "TRAVEL_TO_SIARGAO",
    qrSubjectRelation: getValue("qrSubjectRelation") || "SELF",
    residentType: getValue("residentType"),
    nationalityCode: getValue("nationalityCode"),
    countryOfResidence: getValue("countryOfResidence"),
    ageBracket: getValue("ageBracket"),
    travelerType: getValue("travelerType"),
    arrivalDate: getValue("arrivalDate"),
    departureDate: getValue("departureDate"),
    mainSiargaoBase: getValue("mainSiargaoBase"),
    municipality: getValue("municipality"),
    barangay: getValue("barangay"),
    accommodationType: getValue("accommodationType"),
    visitPurpose: getValue("visitPurpose"),
    travelPartyType: getValue("travelPartyType"),
    partySizeRange: getValue("partySizeRange"),
    emergencyContactName: getValue("emergencyContactName"),
    emergencyContactMobile: getValue("emergencyContactMobile"),
    emergencyContactRelationship: getValue("emergencyContactRelationship") || "Emergency contact",
    privacyConsent,
    rulesAcknowledgement,
    dataUsePurposeAcknowledgement,
  };

  if (email) payload.email = email;
  if (mobileNumber) payload.mobileNumber = mobileNumber;

  const res = await fetch(`${getApiBaseUrl()}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {}

  if (!res.ok || !json?.accessToken) {
    const message = encodeURIComponent(json?.message || json?.error || `Registration failed: HTTP ${res.status}`);
    redirect(`/traveler/register?error=register-failed&message=${message}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(getAuthCookieName(), json.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  redirect("/traveler/app");
}

function getErrorMessage(error?: string, message?: string) {
  if (!error) return null;

  if (error === "missing-name") return "Please enter your full name.";
  if (error === "missing-contact") return "Please enter either an email or mobile number.";
  if (error === "weak-password") return "Password must be at least 8 characters.";
  if (error === "password-mismatch") return "Password and confirmation do not match.";
  if (error === "missing-privacy-consent") return "Please accept the privacy consent to continue.";
  if (error === "missing-rules-acknowledgement") return "Please acknowledge the One Siargao rules to continue.";
  if (error === "missing-data-use-consent") return "Please acknowledge the data-use purpose to continue.";
  if (error === "register-failed") return message ? decodeURIComponent(message) : "Registration failed. Please try again.";

  return "Registration could not continue. Please check your details.";
}

function Pill(props: { children: string; tone?: "light" | "blue" | "green" | "gold" | "slate" }) {
  const theme = {
    light: ["rgba(255,255,255,0.16)", "#ffffff", "rgba(255,255,255,0.24)"],
    blue: ["rgba(14,165,233,0.10)", "#0369a1", "rgba(14,165,233,0.18)"],
    green: ["rgba(5,150,165,0.10)", "#013863", "rgba(5,150,165,0.16)"],
    gold: ["rgba(243,174,38,0.12)", "#7A4A00", "rgba(243,174,38,0.22)"],
    slate: ["rgba(1,56,99,0.06)", "#013863", "rgba(1,56,99,0.10)"],
  }[props.tone ?? "slate"];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        borderRadius: 999,
        padding: "6px 9px",
        background: theme[0],
        color: theme[1],
        border: `1px solid ${theme[2]}`,
        fontSize: 11,
        fontWeight: 950,
        whiteSpace: "nowrap",
      }}
    >
      {props.children}
    </span>
  );
}

function Field(props: {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label htmlFor={props.id} style={{ display: "block" }}>
      <FieldLabel label={props.label} required={props.required} />
      <input
        id={props.id}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        required={props.required}
        autoComplete={props.autoComplete}
        style={fieldStyle}
      />
    </label>
  );
}

function SelectField(props: {
  id: string;
  name: string;
  label: string;
  options: Option[];
  required?: boolean;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <label htmlFor={props.id} style={{ display: "block" }}>
      <FieldLabel label={props.label} required={props.required} />
      <select
        id={props.id}
        name={props.name}
        required={props.required}
        defaultValue={props.defaultValue ?? ""}
        style={{
          ...fieldStyle,
          appearance: "none",
          backgroundImage:
            "linear-gradient(45deg, transparent 50%, #0596A5 50%), linear-gradient(135deg, #0596A5 50%, transparent 50%)",
          backgroundPosition: "calc(100% - 18px) 18px, calc(100% - 12px) 18px",
          backgroundSize: "6px 6px, 6px 6px",
          backgroundRepeat: "no-repeat",
        }}
      >
        {!props.defaultValue ? <option value="">Select...</option> : null}
        {props.options.map((option) => (
          <option key={`${props.name}-${option.value || "blank"}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {props.hint ? (
        <div style={{ marginTop: 5, fontSize: 11.2, lineHeight: 1.35, color: "rgba(80,102,139,0.72)", fontWeight: 720 }}>
          {props.hint}
        </div>
      ) : null}
    </label>
  );
}

function FieldLabel(props: { label: string; required?: boolean }) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 7,
        fontSize: 12.5,
        fontWeight: 920,
        color: "#334155",
      }}
    >
      <span>{props.label}</span>
      {props.required ? (
        <span style={{ fontSize: 10, fontWeight: 950, color: "#0596A5", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Required
        </span>
      ) : null}
    </span>
  );
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: 45,
  padding: "11px 12px",
  borderRadius: 15,
  border: "1px solid rgba(14,116,144,0.18)",
  backgroundColor: "rgba(255,255,255,0.96)",
  color: "#013863",
  fontSize: 14,
  fontWeight: 760,
  outline: "none",
  boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
};

function SectionCard(props: {
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
  tone?: "blue" | "green" | "gold";
}) {
  const accent = props.tone === "gold" ? "#F3AE26" : props.tone === "green" ? "#0596A5" : "#013863";

  return (
    <section
      style={{
        marginTop: 13,
        borderRadius: 26,
        background: "linear-gradient(180deg, rgba(255,255,255,0.99), rgba(248,253,255,0.95))",
        border: "1px solid rgba(5,150,165,0.14)",
        boxShadow: "0 16px 36px rgba(1,56,99,0.08)",
        padding: 14,
      }}
    >
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 950,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: accent,
        }}
      >
        {props.eyebrow}
      </div>
      <h2 style={{ margin: "6px 0 0", fontSize: 20, lineHeight: 1.08, letterSpacing: "-0.025em", fontWeight: 950 }}>
        {props.title}
      </h2>
      <p style={{ margin: "8px 0 0", fontSize: 12.7, lineHeight: 1.43, color: "rgba(80,102,139,0.86)", fontWeight: 720 }}>
        {props.body}
      </p>
      <div style={{ marginTop: 13, display: "grid", gap: 12 }}>{props.children}</div>
    </section>
  );
}

function FlowStep(props: { number: string; title: string; body: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        borderRadius: 18,
        background: "rgba(255,255,255,0.76)",
        border: "1px solid rgba(1,56,99,0.10)",
        padding: "10px 11px",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #013863 0%, #003B66 42%, #0596A5 100%)",
          color: "#ffffff",
          fontSize: 12,
          fontWeight: 950,
          flex: "0 0 auto",
        }}
      >
        {props.number}
      </span>
      <span>
        <span style={{ display: "block", fontSize: 12.8, lineHeight: 1.18, fontWeight: 950, color: "#013863" }}>
          {props.title}
        </span>
        <span style={{ display: "block", marginTop: 3, fontSize: 11.5, lineHeight: 1.34, color: "rgba(80,102,139,0.78)", fontWeight: 720 }}>
          {props.body}
        </span>
      </span>
    </div>
  );
}

/* OSP-TRAVELER-REGISTER-GLOBAL-TRUST-UI-01: Premium trust-first OSP QR identity registration. Public-safe wording only. */
export default async function TravelerRegisterPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; message?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const errorMessage = getErrorMessage(resolvedSearchParams?.error, resolvedSearchParams?.message);

  return (
    <main
      data-osp-entry-page="true"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 12% -4%, rgba(5,150,165,0.16), transparent 34%), radial-gradient(circle at 94% 4%, rgba(243,174,38,0.16), transparent 28%), linear-gradient(180deg, #F8FDFF 0%, #F4FCFA 46%, #FFFFFF 100%)",
        color: "#013863",
        padding: "14px 12px 96px",
      }}
    >
      <div style={{ maxWidth: 468, margin: "0 auto" }}>
        <header
          style={{
            borderRadius: 28,
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,253,255,0.96))",
            border: "1px solid rgba(5,150,165,0.16)",
            boxShadow: "0 18px 38px rgba(1,56,99,0.10)",
            padding: 14,
            color: "#013863",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <a
              href="/traveler/login"
              aria-label="Back to login"
              style={{
                width: 40,
                height: 40,
                borderRadius: 16,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                background: "#FFFFFF",
                color: "#013863",
                border: "1px solid rgba(5,150,165,0.18)",
                boxShadow: "0 8px 18px rgba(1,56,99,0.08)",
                fontWeight: 950,
              }}
            >
              ←
            </a>

            <div
              aria-label="One Siargao Pass"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                minWidth: 0,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 13,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #013863 0%, #003B66 48%, #0596A5 100%)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.55)",
                  boxShadow: "0 10px 22px rgba(1,56,99,0.18)",
                  fontSize: 17,
                  fontWeight: 950,
                  flex: "0 0 auto",
                }}
              >
                ▣
              </span>
              <span style={{ display: "grid", minWidth: 0 }}>
                <span
                  style={{
                    fontSize: 10,
                    lineHeight: 1,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#0596A5",
                    fontWeight: 950,
                    whiteSpace: "nowrap",
                  }}
                >
                  One Siargao Pass
                </span>
                <span
                  style={{
                    marginTop: 4,
                    fontSize: 13,
                    lineHeight: 1.1,
                    color: "#013863",
                    fontWeight: 950,
                    whiteSpace: "nowrap",
                  }}
                >
                  QR Onboarding
                </span>
              </span>
            </div>

            <span
              style={{
                borderRadius: 999,
                padding: "7px 10px",
                background: "rgba(243,174,38,0.13)",
                color: "#7A4A00",
                border: "1px solid rgba(243,174,38,0.25)",
                fontSize: 10.5,
                fontWeight: 950,
                whiteSpace: "nowrap",
              }}
            >
              Island Access
            </span>
          </div>

          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 950,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#0596A5",
              }}
            >
              Universal island access
            </div>
            <h1
              style={{
                margin: "6px 0 0",
                fontSize: 30,
                lineHeight: 0.98,
                letterSpacing: "-0.045em",
                fontWeight: 950,
                color: "#013863",
              }}
            >
              Create your OSP Pass
            </h1>
            <p style={{ margin: "9px 0 0", color: "#50668B", fontSize: 14.2, lineHeight: 1.36, fontWeight: 780 }}>
              Create one QR identity for your trips, local services, site access, and saved Siargao journey.
            </p>
            <p style={{ margin: "7px 0 0", color: "#50668B", fontSize: 12.2, lineHeight: 1.38, fontWeight: 700 }}>
              Your account creates your OSP Pass, traveler QR, and protected journey record.
            </p>
          </div>

          <div style={{ marginTop: 13, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
            <span style={compactChipStyle}>
              <span aria-hidden="true">▣</span>
              QR Identity
            </span>
            <span style={compactChipStyle}>
              <span aria-hidden="true">🧭</span>
              Trip Ready
            </span>
            <span style={compactChipStyle}>
              <span aria-hidden="true">🛟</span>
              Safety Support
            </span>
          </div>
        </header>
        <section
          style={{
            marginTop: 13,
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(255,255,255,0.99), rgba(248,253,255,0.94))",
            color: "#013863",
            border: "1px solid rgba(5,150,165,0.16)",
            boxShadow: "0 16px 36px rgba(1,56,99,0.08)",
            padding: 14,
          }}
        >
          <Pill tone="green">How this works</Pill>
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            <FlowStep number="1" title="Create your account" body="Use email or mobile. Your QR identity starts here." />
            <FlowStep number="2" title="Tell us your context" body="Visitor, resident, event participant, or operator pathway." />
            <FlowStep number="3" title="Use your QR" body="Trips, events, check-ins, services, and future One Siargao participation." />
          </div>
        </section>

        {errorMessage ? (
          <section
            style={{
              marginTop: 13,
              borderRadius: 20,
              background: "rgba(217,119,6,0.10)",
              border: "1px solid rgba(217,119,6,0.18)",
              color: "#92400e",
              padding: "11px 12px",
              fontSize: 12.5,
              lineHeight: 1.38,
              fontWeight: 820,
            }}
          >
            {errorMessage}
          </section>
        ) : null}

        <form action={registerTravelerAction}>
          <SectionCard
            eyebrow="Step 1"
            title="Account basics"
            body="Start with the minimum account details. You can use email or mobile number."
            tone="blue"
          >
            <Field id="fullName" name="fullName" type="text" label="Full name" placeholder="Enter your full name..." required autoComplete="name" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field id="email" name="email" type="email" label="Email" placeholder="email@example.com" autoComplete="email" />
              <Field id="mobileNumber" name="mobileNumber" type="tel" label="Mobile" placeholder="09xx..." autoComplete="tel" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <PasswordField id="password" name="password" label="Password" placeholder="Minimum 8 characters" required autoComplete="new-password" />
              <PasswordField id="confirmPassword" name="confirmPassword" label="Confirm" placeholder="Re-enter password" required autoComplete="new-password" />
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Step 2"
            title="Choose your QR context"
            body="All answers are controlled choices. You may register for yourself or help family, seniors, children, guests, or group participants."
            tone="green"
          >
            <SelectField
              id="participantType"
              name="participantType"
              label="What best describes you?"
              options={participantTypes}
              defaultValue="VISITOR_TOURIST"
              required
            />
            <SelectField
              id="qrRegistrationPurpose"
              name="qrRegistrationPurpose"
              label="Main purpose for this QR"
              options={qrPurposes}
              defaultValue="TRAVEL_TO_SIARGAO"
              required
              hint="Traveler and service purposes come first. Community and public-service purposes are supported with clear, respectful records."
            />
            <SelectField
              id="qrSubjectRelation"
              name="qrSubjectRelation"
              label="Who is this QR for?"
              options={qrSubjectRelations}
              defaultValue="SELF"
              required
              hint="You can add more family members, senior companions, children, or guests inside My Trips after account creation."
            />
            <SelectField
              id="residentType"
              name="residentType"
              label="Resident context"
              options={residentTypes}
              defaultValue=""
              hint="Use this if you are a Siargao local, relocated Filipino, long-term foreign resident, nomad, worker, or seasonal resident."
            />
          </SectionCard>

          <SectionCard
            eyebrow="Step 3"
            title="Visitor and trip profile"
            body="This helps keep access, support, and journey records organized while protecting your private details."
            tone="blue"
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <SelectField id="nationalityCode" name="nationalityCode" label="Nationality" options={countryOptions} defaultValue="PH" required />
              <SelectField id="countryOfResidence" name="countryOfResidence" label="Country of residence" options={countryOptions} defaultValue="PH" required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <SelectField id="ageBracket" name="ageBracket" label="Age bracket" options={ageBrackets} defaultValue="AGE_25_34" required />
              <SelectField id="travelerType" name="travelerType" label="Traveler type" options={travelerTypes} defaultValue="DOMESTIC_TOURIST" required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field id="arrivalDate" name="arrivalDate" type="date" label="Arrival date" placeholder="" required />
              <Field id="departureDate" name="departureDate" type="date" label="Departure date" placeholder="" required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <SelectField id="mainSiargaoBase" name="mainSiargaoBase" label="Main Siargao base" options={siargaoBases} defaultValue="GENERAL_LUNA" required />
              <Field id="municipality" name="municipality" type="text" label="Municipality label" placeholder="General Luna" />
            </div>
            <Field id="barangay" name="barangay" type="text" label="Local area" placeholder="Optional for now" />
            <SelectField id="accommodationType" name="accommodationType" label="Accommodation type" options={accommodationTypes} defaultValue="HOTEL_RESORT" required />
            <SelectField id="visitPurpose" name="visitPurpose" label="Purpose of visit" options={visitPurposes} defaultValue="LEISURE_VACATION" required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <SelectField id="travelPartyType" name="travelPartyType" label="Travel party" options={partyTypes} defaultValue="SOLO" required />
              <SelectField id="partySizeRange" name="partySizeRange" label="Party size" options={partySizes} defaultValue="ONE" required />
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Step 4"
            title="Safety contact"
            body="Used for traveler support, emergency readiness, and safer check-in experiences."
            tone="gold"
          >
            <Field id="emergencyContactName" name="emergencyContactName" type="text" label="Emergency contact name" placeholder="Full name" required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field id="emergencyContactMobile" name="emergencyContactMobile" type="tel" label="Emergency mobile" placeholder="+63..." required />
              <Field id="emergencyContactRelationship" name="emergencyContactRelationship" type="text" label="Relationship" placeholder="Family / friend" />
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Step 5"
            title="Consent and local rules"
            body="Your private records stay protected. OSP uses only the details needed for access, support, safety, and your saved journey."
            tone="green"
          >
<ConsentAndSubmit />
          </SectionCard>
        </form>
      </div>
    </main>
  );
}

const compactChipStyle: React.CSSProperties = {
  minHeight: 34,
  borderRadius: 15,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  background: "rgba(255,255,255,0.92)",
  color: "#013863",
  border: "1px solid rgba(5,150,165,0.16)",
  boxShadow: "0 8px 18px rgba(1,56,99,0.06)",
  fontSize: 11.2,
  lineHeight: 1,
  fontWeight: 920,
  whiteSpace: "nowrap",
};
