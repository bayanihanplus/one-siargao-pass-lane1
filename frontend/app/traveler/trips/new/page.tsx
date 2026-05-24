import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getApiBaseUrl, getAuthCookieName, getCurrentUser } from "../../../../src/lib/server-auth";

/*
 * OSP-LOGIN-05 LOCK:
 * /traveler/trips/new creates the first guided traveler trip using existing POST /trips.
 * It does not issue OSP Pass.
 * It does not issue QR.
 * It does not create booking, payment, manifest, or clearance approval.
 * After trip creation, redirect to /traveler/trips/[tripId].
 */

async function createTripAction(formData: FormData) {
  "use server";

  const tripTitle = String(formData.get("tripTitle") || "").trim();
  const arrivalDate = String(formData.get("arrivalDate") || "").trim();
  const departureDate = String(formData.get("departureDate") || "").trim();
  const originLocation = String(formData.get("originLocation") || "").trim();
  const declaredAccommodationName = String(formData.get("declaredAccommodationName") || "").trim();

  if (!arrivalDate || !departureDate) {
    redirect("/traveler/trips/new?error=missing-dates");
  }

  if (arrivalDate > departureDate) {
    redirect("/traveler/trips/new?error=invalid-date-range");
  }

  const body: Record<string, string> = {
    arrivalDate,
    departureDate,
  };

  if (tripTitle) body.tripTitle = tripTitle;
  if (originLocation) body.originLocation = originLocation;
  if (declaredAccommodationName) body.declaredAccommodationName = declaredAccommodationName;

  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value;

  if (!token) {
    redirect("/traveler/login?mode=returning");
  }

  const res = await fetch(`${getApiBaseUrl()}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify(body),
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {}

  if (!res.ok || !json?.id) {
    const message = encodeURIComponent(json?.message || json?.error || `Trip creation failed: HTTP ${res.status}`);
    redirect(`/traveler/trips/new?error=create-failed&message=${message}`);
  }

  redirect(`/traveler/trips/${json.id}`);
}

function getErrorMessage(error?: string, message?: string) {
  if (!error) return null;
  if (error === "missing-dates") return "Arrival and departure dates are required.";
  if (error === "invalid-date-range") return "Departure date must be after arrival date.";
  if (error === "create-failed") return message ? decodeURIComponent(message) : "Trip could not be created. Please try again.";
  return "Trip setup could not continue. Please check your details.";
}

function Pill(props: { children: string; tone?: "green" | "blue" | "gold" }) {
  const theme = {
    green: ["rgba(22,163,74,0.10)", "#166534", "rgba(22,163,74,0.18)"],
    blue: ["rgba(14,165,233,0.10)", "#0369a1", "rgba(14,165,233,0.18)"],
    gold: ["rgba(217,119,6,0.10)", "#92400e", "rgba(217,119,6,0.18)"],
  }[props.tone ?? "blue"];

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
      <span
        style={{
          display: "block",
          marginBottom: 7,
          fontSize: 12.5,
          fontWeight: 900,
          color: "#334155",
        }}
      >
        {props.label}
      </span>
      <input
        id={props.id}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        required={props.required}
        autoComplete={props.autoComplete}
        style={{
          width: "100%",
          boxSizing: "border-box",
          minHeight: 42,
          padding: "10px 12px",
          borderRadius: 14,
          border: "1px solid rgba(14,116,144,0.18)",
          background: "rgba(255,255,255,0.94)",
          color: "#10234a",
          fontSize: 14,
          fontWeight: 720,
          outline: "none",
          boxShadow: "0 8px 18px rgba(15,23,42,0.05)",
        }}
      />
    </label>
  );
}

function SubmitButton() {
  return (
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
      Create Trip
      <span aria-hidden="true">→</span>
    </button>
  );
}

function ActionLink(props: { href: string; icon: string; children: string }) {
  return (
    <a
      href={props.href}
      style={{
        minHeight: 40,
        borderRadius: 15,
        padding: "9px 11px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        textDecoration: "none",
        fontSize: 12.4,
        fontWeight: 950,
        background: "rgba(255,255,255,0.90)",
        color: "#075985",
        border: "1px solid rgba(14,116,144,0.16)",
        boxShadow: "0 8px 18px rgba(15,23,42,0.07)",
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden="true">{props.icon}</span>
      {props.children}
    </a>
  );
}

export default async function NewTravelerTripPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; message?: string }>;
}) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const errorMessage = getErrorMessage(resolvedSearchParams?.error, resolvedSearchParams?.message);

  if (!user) {
    redirect("/traveler/login?mode=returning");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 14% -2%, rgba(45,212,191,0.24), transparent 34%), radial-gradient(circle at 96% 2%, rgba(251,191,36,0.20), transparent 30%), linear-gradient(180deg, #f8fdff 0%, #eefbf7 44%, #f8fafc 100%)",
        color: "#10234a",
        padding: "14px 12px 92px",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <header
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 30,
            background:
              "linear-gradient(145deg, rgba(12,74,110,0.98), rgba(8,145,178,0.92), rgba(20,184,166,0.82))",
            boxShadow: "0 22px 50px rgba(15,23,42,0.19)",
            padding: 16,
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <a
              href="/traveler/start"
              aria-label="Back to traveler start"
              style={{
                width: 42,
                height: 42,
                borderRadius: 17,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                background: "rgba(255,255,255,0.16)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.20)",
                fontWeight: 950,
              }}
            >
              ←
            </a>
            <span
              style={{
                borderRadius: 999,
                padding: "6px 9px",
                background: "rgba(255,255,255,0.16)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.24)",
                fontSize: 11,
                fontWeight: 950,
              }}
            >
              Trip setup
            </span>
          </div>

          <div style={{ marginTop: 22 }}>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 950,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.78)",
              }}
            >
              One Siargao Pass
            </div>
            <h1 style={{ margin: "7px 0 0", fontSize: 31, lineHeight: 1, letterSpacing: "-0.045em", fontWeight: 950 }}>
              Create your first trip
            </h1>
            <p style={{ margin: "10px 0 0", color: "#fef9c3", fontSize: 15.8, lineHeight: 1.22, fontWeight: 950 }}>
              Add your Siargao dates and starting details.
            </p>
            <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.84)", fontSize: 12.8, lineHeight: 1.42, fontWeight: 700 }}>
              This creates a trip record only. Pass, QR, payment, manifest, and clearance remain separate steps.
            </p>
          </div>
        </header>

        <section
          style={{
            marginTop: 13,
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(240,253,250,0.92))",
            border: "1px solid rgba(14,116,144,0.14)",
            boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
            padding: 14,
          }}
        >
          <Pill tone="green">Guided trip setup</Pill>
          <h2 style={{ margin: "8px 0 0", fontSize: 20, lineHeight: 1.1, fontWeight: 950 }}>
            Start with required dates.
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 12.6, lineHeight: 1.42, color: "rgba(15,23,42,0.66)", fontWeight: 720 }}>
            Add your arrival and departure dates. Accommodation and origin can be added now if available.
          </p>

          {errorMessage ? (
            <div
              style={{
                marginTop: 12,
                borderRadius: 16,
                background: "rgba(217,119,6,0.09)",
                border: "1px solid rgba(217,119,6,0.16)",
                color: "#92400e",
                padding: "10px 11px",
                fontSize: 12,
                lineHeight: 1.35,
                fontWeight: 820,
              }}
            >
              {errorMessage}
            </div>
          ) : null}

          <form action={createTripAction} style={{ marginTop: 13, display: "grid", gap: 12 }}>
            <Field
              id="tripTitle"
              name="tripTitle"
              type="text"
              label="Trip name"
              placeholder="Example: Siargao April Trip"
              autoComplete="off"
            />

            <Field
              id="arrivalDate"
              name="arrivalDate"
              type="date"
              label="Arrival date"
              placeholder="Arrival date"
              required
            />

            <Field
              id="departureDate"
              name="departureDate"
              type="date"
              label="Departure date"
              placeholder="Departure date"
              required
            />

            <Field
              id="originLocation"
              name="originLocation"
              type="text"
              label="Coming from"
              placeholder="Example: Manila, Cebu, Hong Kong..."
              autoComplete="address-level2"
            />

            <Field
              id="declaredAccommodationName"
              name="declaredAccommodationName"
              type="text"
              label="Accommodation"
              placeholder="Hotel, hostel, villa, or area..."
              autoComplete="organization"
            />

            <SubmitButton />
          </form>
        </section>

        <section
          style={{
            marginTop: 13,
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(240,253,250,0.98), rgba(220,252,231,0.88))",
            color: "#10234a",
            border: "1px solid rgba(22,163,74,0.16)",
            boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
            padding: 14,
          }}
        >
          <Pill tone="blue">Boundary</Pill>
          <h2 style={{ margin: "8px 0 0", fontSize: 18, lineHeight: 1.1, fontWeight: 950 }}>
            Trip record first. Pass later.
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: 12.5, lineHeight: 1.42, color: "rgba(15,23,42,0.66)", fontWeight: 720 }}>
            Creating a trip does not issue OSP Pass or QR. The pass screen will check readiness after trip, payment, manifest, and clearance conditions.
          </p>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <ActionLink href="/traveler/trips" icon="🧭">
              My Trips
            </ActionLink>
            <ActionLink href="/traveler/pass" icon="◈">
              Pass
            </ActionLink>
          </div>
        </section>
      </div>
    </main>
  );
}
