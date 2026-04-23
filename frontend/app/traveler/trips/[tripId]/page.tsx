import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getApiBaseUrl, getCurrentUser, requireAccessToken } from "../../../../src/lib/server-auth";

type TripPageProps = {
  params: Promise<{
    tripId: string;
  }>;
  searchParams?: Promise<{
    added?: string;
    error?: string;
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

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";

  if (!tripId || !fullName) {
    return;
  }

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

  if (!tripId || !bookingId) {
    return;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
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

  if (!tripId || !intentId) {
    return;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";
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

function Section(props: { title: string; children: any }) {
  const { title, children } = props;

  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>{title}</h2>
      {children}
    </section>
  );
}

function KeyValue(props: { label: string; value: any }) {
  const { label, value } = props;

  return (
    <div style={{ marginBottom: 8 }}>
      <strong>{label}:</strong> {value ?? "—"}
    </div>
  );
}

export default async function TravelerTripDetailPage({
  params,
}: TripPageProps) {
  const { tripId } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=/traveler/trips/${tripId}`);
  }

  const { trip, error } = await getTrip(tripId);

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Traveler Trip Detail</h1>
      <p style={{ marginTop: 0, marginBottom: 24 }}>
        Trip contract viewer for registration, clearance, pass, current
        booking/payment state, and dev-only companion add flow.
      </p>

      <Section title="Trip Access Note">
        <p style={{ marginTop: 0 }}>
          This page uses the authenticated session to load the selected traveler trip.
        </p>
        <p style={{ marginBottom: 0 }}>
          Traveler trip selection remains controlled by the current role-aware entry flow.
        </p>
      </Section>

      {error ? (
        <Section title="Load Error">
          <p style={{ margin: 0 }}>{error}</p>
        </Section>
      ) : null}

      {!trip ? null : (
        <>
          <Section title="Trip Overview">
            <KeyValue label="Trip ID" value={trip.id} />
            <KeyValue label="Trip Status" value={trip.tripStatus} />
            <KeyValue
              label="Registration Status"
              value={trip.registrationStatus}
            />
            <KeyValue label="Clearance Status" value={trip.clearanceStatus} />
            <KeyValue label="Arrival Date" value={trip.arrivalDate} />
            <KeyValue label="Departure Date" value={trip.departureDate} />
            <KeyValue label="Origin" value={trip.originLocation} />
            <KeyValue
              label="Accommodation"
              value={trip.declaredAccommodationName}
            />
          </Section>

          <Section title="Trip Members">
            {Array.isArray(trip.members) && trip.members.length > 0 ? (
              <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                {trip.members.map((member: any) => (
                  <div
                    key={member.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <KeyValue label="Member ID" value={member.id} />
                    <KeyValue label="Type" value={member.memberType} />
                    <KeyValue label="Full Name" value={member.fullName} />
                    <KeyValue
                      label="Nationality"
                      value={member.nationalityCode}
                    />
                    <KeyValue label="Age" value={member.age} />
                    <KeyValue
                      label="Passport / ID Hint"
                      value={member.passportOrIdHint}
                    />
                    <KeyValue
                      label="Primary Traveler"
                      value={String(member.isPrimaryTraveler)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No trip members yet.</p>
            )}

            <form action={addCompanion} style={{ display: "grid", gap: 12 }}>
              <input type="hidden" name="tripId" value={trip.id} />

              <label>
                <div style={{ marginBottom: 4 }}>Companion Full Name</div>
                <input
                  name="fullName"
                  required
                  style={{ width: "100%", padding: 8 }}
                />
              </label>

              <label>
                <div style={{ marginBottom: 4 }}>Nationality Code</div>
                <input
                  name="nationalityCode"
                  placeholder="PH"
                  style={{ width: "100%", padding: 8 }}
                />
              </label>

              <label>
                <div style={{ marginBottom: 4 }}>Age</div>
                <input
                  name="age"
                  type="number"
                  min="0"
                  style={{ width: "100%", padding: 8 }}
                />
              </label>

              <label>
                <div style={{ marginBottom: 4 }}>Passport / ID Hint</div>
                <input
                  name="passportOrIdHint"
                  placeholder="ID-1234"
                  style={{ width: "100%", padding: 8 }}
                />
              </label>

              <button type="submit" style={{ padding: "10px 14px" }}>
                Add Companion
              </button>
            </form>
          </Section>

          <Section title="Booking Summary">
            <KeyValue
              label="Total Linked Bookings"
              value={trip.bookingSummary?.totalLinkedBookings}
            />
            <KeyValue
              label="Paid Bookings"
              value={trip.bookingSummary?.paidBookings}
            />
            <KeyValue
              label="Unpaid Bookings"
              value={trip.bookingSummary?.unpaidBookings}
            />
            <KeyValue
              label="Latest Linked Booking ID"
              value={trip.bookingSummary?.latestLinkedBookingId}
            />
          </Section>

          <Section title="Current Booking">
            <KeyValue label="Booking ID" value={trip.currentBooking?.id} />
            <KeyValue
              label="Booking Reference"
              value={trip.currentBooking?.bookingReference}
            />
            <KeyValue
              label="Booking Status"
              value={trip.currentBooking?.bookingStatus}
            />
            <KeyValue
              label="Booking Total PHP"
              value={trip.currentBooking?.bookingTotalPhp}
            />
            <KeyValue
              label="Currency Code"
              value={trip.currentBooking?.currencyCode}
            />
          </Section>

          <Section title="Current Payment State">
            <KeyValue
              label="Payment State"
              value={trip.currentPaymentState?.state}
            />
            <KeyValue
              label="Paid Amount PHP"
              value={trip.currentPaymentState?.paidAmountPhp}
            />
            <KeyValue
              label="Unpaid Amount PHP"
              value={trip.currentPaymentState?.unpaidAmountPhp}
            />
            <KeyValue
              label="Last Payment Intent ID"
              value={trip.currentPaymentState?.lastPaymentIntentId}
            />
          </Section>

          <Section title="Current Payment Intent">
            <KeyValue label="Intent ID" value={trip.currentPaymentIntent?.id} />
            <KeyValue
              label="Intent Reference"
              value={trip.currentPaymentIntent?.intentReference}
            />
            <KeyValue
              label="Intent Status"
              value={trip.currentPaymentIntent?.status}
            />
            <KeyValue
              label="Amount PHP"
              value={trip.currentPaymentIntent?.amountPhp}
            />
            <KeyValue
              label="Provider"
              value={trip.currentPaymentIntent?.provider}
            />
          </Section>

          <Section title="Payment Actions">
            {!trip.currentBooking?.id ? (
              <p style={{ margin: 0 }}>
                No current booking is linked to this trip yet, so payment actions are unavailable.
              </p>
            ) : (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <form action={createPaymentIntentAction}>
                  <input type="hidden" name="tripId" value={trip.id} />
                  <input type="hidden" name="bookingId" value={trip.currentBooking.id} />
                  <button type="submit" style={{ padding: "10px 14px" }}>
                    Create Payment Intent
                  </button>
                </form>

                {trip.currentPaymentIntent?.id ? (
                  <form action={confirmPaymentIntentAction}>
                    <input type="hidden" name="tripId" value={trip.id} />
                    <input type="hidden" name="intentId" value={trip.currentPaymentIntent.id} />
                    <button type="submit" style={{ padding: "10px 14px" }}>
                      Confirm Payment
                    </button>
                  </form>
                ) : null}
              </div>
            )}
          </Section>

          <Section title="Pass">
            <KeyValue label="Pass Code" value={trip.pass?.passCode} />
            <KeyValue label="Pass Status" value={trip.pass?.passStatus} />
            <KeyValue
              label="QR Version"
              value={trip.pass?.qrCredential?.qrVersion}
            />
          </Section>

          <Section title="Historical Booking Links">
            {Array.isArray(trip.bookingLinks) && trip.bookingLinks.length > 0 ? (
              <div style={{ display: "grid", gap: 12 }}>
                {trip.bookingLinks.map((link: any) => (
                  <div
                    key={link.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <KeyValue label="Link ID" value={link.id} />
                    <KeyValue
                      label="Booking ID"
                      value={link.booking?.id || link.bookingId}
                    />
                    <KeyValue
                      label="Booking Reference"
                      value={link.booking?.bookingReference}
                    />
                    <KeyValue
                      label="Booking Status"
                      value={link.booking?.bookingStatus}
                    />
                    <KeyValue
                      label="Payment State"
                      value={link.booking?.paymentState?.state}
                    />
                    <KeyValue
                      label="Latest Intent Status"
                      value={link.booking?.latestPaymentIntent?.status}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0 }}>No linked bookings found.</p>
            )}
          </Section>
        </>
      )}
    </main>
  );
}
