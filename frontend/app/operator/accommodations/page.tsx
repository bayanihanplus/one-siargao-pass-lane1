import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import React, { type ReactNode } from "react";
import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

export const dynamic = "force-dynamic";

type StatusChip = {
  label?: string;
  tone?: string;
  description?: string;
};

type OperatorAction = {
  label?: string;
  mode?: string;
  href?: string;
};

type AccommodationCard = {
  accommodationId?: string;
  displayTitle?: string;
  propertyReadinessChip?: StatusChip;
  roomReadinessChip?: StatusChip;
  inventoryReadinessChip?: StatusChip;
  qrCheckInReadinessChip?: StatusChip;
  requestQueueLabel?: string;
  stayQueueLabel?: string;
  voucherQueueLabel?: string;
  settlementWording?: string;
  primaryAction?: OperatorAction;
  secondaryAction?: OperatorAction;
};

type RoomCard = {
  roomTypeId?: string;
  accommodationId?: string;
  title?: string;
  roomUnitType?: string;
  supplyType?: string;
  maxOccupancy?: number;
  baseCapacity?: number;
  basePricePhp?: string | null;
  pricingReady?: boolean;
  isActive?: boolean;
  unitCount?: number;
  inventoryDateCount?: number;
  primaryAction?: OperatorAction;
};

type MediaCard = {
  mediaId?: string;
  accommodationId?: string;
  mediaType?: string;
  url?: string | null;
  caption?: string | null;
  mediaStatus?: string;
  sortOrder?: number;
  publicReady?: boolean;
  visualTruth?: string;
  fallbackGradient?: string;
  travelerRenderMode?: string;
  videoRecommended?: boolean;
  videoRequired?: boolean;
  performanceWording?: string;
  marketingWording?: string;
  mediaGovernance?: {
    canDisplayPublicly?: boolean;
    currentSource?: string;
    photoOnlyAccepted?: boolean;
    videoBlocksDraft?: boolean;
    rawVideoBlocksPageLoad?: boolean;
    note?: string;
  };
};

type AccommodationWorkspace = {
  profile: AccommodationCard;
  rooms: RoomCard[];
  media: MediaCard[];
};

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function getOptionalText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value || undefined;
}

async function apiRequest(path: string, options: { method: string; token: string; body?: Record<string, unknown> }) {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.token}`,
    },
    cache: "no-store",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let json: any = null;
  try {
    json = await res.json();
  } catch {}

  if (!res.ok) {
    const message = json?.message || json?.error || `Request failed with HTTP ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(", ") : String(message));
  }

  return json;
}

async function safeJson<T>(path: string, token: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return fallback;

    const json = await res.json().catch(() => fallback);
    return json ?? fallback;
  } catch {
    return fallback;
  }
}

async function createAccommodationDraftAction(formData: FormData) {
  "use server";

  const token = await requireAccessToken();
  const displayName = getText(formData, "displayName");

  if (!displayName) {
    redirect("/operator/accommodations?error=Accommodation%20name%20is%20required");
  }

  try {
    await apiRequest("/operator/accommodations", {
      method: "POST",
      token,
      body: {
        displayName,
        propertyType: getOptionalText(formData, "propertyType") || "HOMESTAY",
        municipalityName: getOptionalText(formData, "municipalityName") || "General Luna",
        barangayName: getOptionalText(formData, "barangayName"),
        addressLine: getOptionalText(formData, "addressLine"),
        shortDescription: getOptionalText(formData, "shortDescription"),
      },
    });

    revalidatePath("/operator/accommodations");
    redirect("/operator/accommodations?success=Accommodation%20draft%20created");
  } catch (error: any) {
    redirect(`/operator/accommodations?error=${encodeURIComponent(error?.message || "Unable to create accommodation draft")}`);
  }
}

async function updateAccommodationProfileAction(formData: FormData) {
  "use server";

  const token = await requireAccessToken();
  const accommodationId = getText(formData, "accommodationId");

  if (!accommodationId) {
    redirect("/operator/accommodations?error=Missing%20accommodation%20ID");
  }

  try {
    await apiRequest(`/operator/accommodations/${encodeURIComponent(accommodationId)}`, {
      method: "PATCH",
      token,
      body: {
        displayName: getOptionalText(formData, "displayName"),
        propertyType: getOptionalText(formData, "propertyType"),
        municipalityName: getOptionalText(formData, "municipalityName"),
        barangayName: getOptionalText(formData, "barangayName"),
        addressLine: getOptionalText(formData, "addressLine"),
        shortDescription: getOptionalText(formData, "shortDescription"),
      },
    });

    revalidatePath("/operator/accommodations");
    redirect("/operator/accommodations?success=Accommodation%20profile%20updated");
  } catch (error: any) {
    redirect(`/operator/accommodations?error=${encodeURIComponent(error?.message || "Unable to update accommodation profile")}`);
  }
}

async function createRoomDraftAction(formData: FormData) {
  "use server";

  const token = await requireAccessToken();
  const accommodationId = getText(formData, "accommodationId");

  if (!accommodationId) {
    redirect("/operator/accommodations?error=Missing%20accommodation%20ID");
  }

  try {
    await apiRequest(`/operator/accommodations/${encodeURIComponent(accommodationId)}/rooms`, {
      method: "POST",
      token,
      body: {
        title: getText(formData, "title"),
        description: getOptionalText(formData, "description"),
        roomUnitType: getOptionalText(formData, "roomUnitType") || "STANDARD_ROOM",
        maxOccupancy: Number(getText(formData, "maxOccupancy") || 1),
        baseCapacity: Number(getText(formData, "baseCapacity") || 1),
      },
    });

    revalidatePath("/operator/accommodations");
    redirect("/operator/accommodations?success=Room%20draft%20created");
  } catch (error: any) {
    redirect(`/operator/accommodations?error=${encodeURIComponent(error?.message || "Unable to create room draft")}`);
  }
}

async function updateRoomPricingAction(formData: FormData) {
  "use server";

  const token = await requireAccessToken();
  const accommodationId = getText(formData, "accommodationId");
  const roomTypeId = getText(formData, "roomTypeId");

  if (!accommodationId || !roomTypeId) {
    redirect("/operator/accommodations?error=Missing%20room%20or%20accommodation%20ID");
  }

  try {
    await apiRequest(`/operator/accommodations/${encodeURIComponent(accommodationId)}/rooms/${encodeURIComponent(roomTypeId)}`, {
      method: "PATCH",
      token,
      body: {
        title: getOptionalText(formData, "title"),
        roomUnitType: getOptionalText(formData, "roomUnitType"),
        maxOccupancy: Number(getText(formData, "maxOccupancy") || 1),
        baseCapacity: Number(getText(formData, "baseCapacity") || 1),
        basePricePhp: getText(formData, "basePricePhp"),
        isActive: formData.get("isActive") === "on",
      },
    });

    revalidatePath("/operator/accommodations");
    redirect("/operator/accommodations?success=Room%20pricing%20updated");
  } catch (error: any) {
    redirect(`/operator/accommodations?error=${encodeURIComponent(error?.message || "Unable to update room pricing")}`);
  }
}

async function registerMediaAction(formData: FormData) {
  "use server";

  const token = await requireAccessToken();
  const accommodationId = getText(formData, "accommodationId");

  if (!accommodationId) {
    redirect("/operator/accommodations?error=Missing%20accommodation%20ID");
  }

  try {
    await apiRequest(`/operator/accommodations/${encodeURIComponent(accommodationId)}/media`, {
      method: "POST",
      token,
      body: {
        mediaType: getOptionalText(formData, "mediaType") || "HERO",
        url: getText(formData, "url"),
        caption: getOptionalText(formData, "caption"),
        sortOrder: Number(getText(formData, "sortOrder") || 0),
      },
    });

    revalidatePath("/operator/accommodations");
    redirect("/operator/accommodations?success=Media%20metadata%20registered%20for%20review");
  } catch (error: any) {
    redirect(`/operator/accommodations?error=${encodeURIComponent(error?.message || "Unable to register media")}`);
  }
}

async function hideMediaAction(formData: FormData) {
  "use server";

  const token = await requireAccessToken();
  const accommodationId = getText(formData, "accommodationId");
  const mediaId = getText(formData, "mediaId");

  if (!accommodationId || !mediaId) {
    redirect("/operator/accommodations?error=Missing%20media%20or%20accommodation%20ID");
  }

  try {
    await apiRequest(`/operator/accommodations/${encodeURIComponent(accommodationId)}/media/${encodeURIComponent(mediaId)}/hide`, {
      method: "PATCH",
      token,
    });

    revalidatePath("/operator/accommodations");
    redirect("/operator/accommodations?success=Media%20hidden");
  } catch (error: any) {
    redirect(`/operator/accommodations?error=${encodeURIComponent(error?.message || "Unable to hide media")}`);
  }
}

function chipToneStyle(tone?: string): React.CSSProperties {
  const normalized = String(tone || "").toUpperCase();

  if (normalized === "READY") {
    return {
      background: "#F4FCFA",
      color: "#013863",
      border: "1px solid rgba(0,151,167,0.28)",
    };
  }

  if (normalized === "INFO") {
    return {
      background: "#EFF6FF",
      color: "#003B66",
      border: "1px solid rgba(0,59,102,0.18)",
    };
  }

  return {
    background: "#FFF7E8",
    color: "#7A4A00",
    border: "1px solid rgba(243,174,38,0.38)",
  };
}

function fieldStyle(): React.CSSProperties {
  return {
    width: "100%",
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    padding: "11px 12px",
    fontSize: 14,
    color: "#0F172A",
    background: "#FFFFFF",
    outline: "none",
  };
}

function labelStyle(): React.CSSProperties {
  return {
    display: "grid",
    gap: 6,
    fontSize: 12,
    fontWeight: 900,
    color: "#334155",
  };
}

function ActionButton(props: { children: React.ReactNode; tone?: "primary" | "gold" | "muted" }) {
  const tone = props.tone || "primary";
  const theme =
    tone === "gold"
      ? { background: "#F3AE26", color: "#013863", border: "1px solid rgba(243,174,38,0.42)" }
      : tone === "muted"
        ? { background: "#F8FAFC", color: "#013863", border: "1px solid #CBD5E1" }
        : { background: "#013863", color: "#FFFFFF", border: "1px solid #013863" };

  return (
    <button
      type="submit"
      style={{
        ...theme,
        borderRadius: 14,
        padding: "11px 14px",
        fontSize: 14,
        fontWeight: 950,
        cursor: "pointer",
      }}
    >
      {props.children}
    </button>
  );
}

function StatusBlock(props: { title: string; chip?: StatusChip }) {
  const chip = props.chip || {};
  return (
    <article
      style={{
        border: "1px solid #E2E8F0",
        borderRadius: 18,
        padding: 16,
        background: "#FFFFFF",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 900, color: "#50668B", letterSpacing: 0.6, textTransform: "uppercase" }}>
        {props.title}
      </div>
      <div
        style={{
          ...chipToneStyle(chip.tone),
          display: "inline-flex",
          marginTop: 10,
          borderRadius: 999,
          padding: "7px 10px",
          fontSize: 13,
          fontWeight: 900,
        }}
      >
        {chip.label || "Not configured"}
      </div>
      <p style={{ margin: "10px 0 0", color: "#475569", fontSize: 14, lineHeight: 1.45 }}>
        {chip.description || "No readiness detail returned yet."}
      </p>
    </article>
  );
}

function QueuePill(props: { label?: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        borderRadius: 999,
        padding: "8px 11px",
        background: "#F8FAFC",
        border: "1px solid #CBD5E1",
        color: "#0F172A",
        fontSize: 13,
        fontWeight: 800,
      }}
    >
      {props.label || "0 records"}
    </span>
  );
}

function Notice(props: { type: "success" | "error"; text?: string }) {
  if (!props.text) return null;

  return (
    <div
      style={{
        borderRadius: 16,
        padding: "12px 14px",
        border: props.type === "success" ? "1px solid rgba(0,151,167,0.18)" : "1px solid rgba(185,28,28,0.22)",
        background: props.type === "success" ? "#F4FCFA" : "#FEF2F2",
        color: props.type === "success" ? "#013863" : "#991B1B",
        fontWeight: 850,
        lineHeight: 1.4,
      }}
    >
      {props.text}
    </div>
  );
}


function SetupPanel(props: { eyebrow: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,253,255,0.96))",
        border: "1px solid rgba(0,151,167,0.14)",
        borderRadius: 26,
        padding: 24,
        boxShadow: "0 18px 44px rgba(1, 56, 99, 0.08)",
        display: "grid",
        gap: 18,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0 auto 0 0",
          width: 6,
          background: "linear-gradient(180deg, #013863, #003B66, #F3AE26)",
        }}
      />
      <div style={{ position: "relative", paddingLeft: 8 }}>
        <p
          style={{
            margin: 0,
            color: "#0097A7",
            fontSize: 12,
            fontWeight: 950,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          {props.eyebrow}
        </p>
        <h2 style={{ margin: "7px 0 0", fontSize: 24, lineHeight: 1.1, color: "#013863" }}>
          {props.title}
        </h2>
        <p style={{ margin: "8px 0 0", color: "#475569", lineHeight: 1.5 }}>
          {props.body}
        </p>
      </div>
      <div style={{ position: "relative", paddingLeft: 8 }}>
        {props.children}
      </div>
    </section>
  );
}

function CreateAccommodationPanel() {
  return (
    <SetupPanel
      eyebrow="Step 1 · Accommodation draft"
      title="Create an accommodation profile draft"
      body="This creates the operator-owned accommodation record only. Traveler exposure still requires profile completion, room pricing, media approval, and admin publishing."
    >
      <form action={createAccommodationDraftAction} style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <label style={labelStyle()}>
            Accommodation name
            <input name="displayName" required placeholder="Example: General Luna Surf Stay" style={fieldStyle()} />
          </label>
          <label style={labelStyle()}>
            Property type
            <select name="propertyType" defaultValue="HOMESTAY" style={fieldStyle()}>
              <option value="HOMESTAY">Homestay</option>
              <option value="HOTEL">Hotel</option>
              <option value="HOSTEL">Hostel</option>
              <option value="RESORT">Resort</option>
              <option value="VILLA">Villa</option>
              <option value="GUESTHOUSE">Guesthouse</option>
            </select>
          </label>
          <label style={labelStyle()}>
            Municipality
            <input name="municipalityName" defaultValue="General Luna" style={fieldStyle()} />
          </label>
          <label style={labelStyle()}>
            Barangay / area
            <input name="barangayName" placeholder="Example: Catangnan" style={fieldStyle()} />
          </label>
        </div>
        <label style={labelStyle()}>
          Address / location hint
          <input name="addressLine" placeholder="Short location reference for operator setup" style={fieldStyle()} />
        </label>
        <label style={labelStyle()}>
          Short description
          <textarea name="shortDescription" rows={3} placeholder="Describe the stay in clear commercial language." style={fieldStyle()} />
        </label>
        <div>
          <ActionButton>Create accommodation draft</ActionButton>
        </div>
      </form>
    </SetupPanel>
  );
}

function ProfileSetupPanel({ profile }: { profile: AccommodationCard }) {
  return (
    <SetupPanel
      eyebrow="Step 2 · Profile setup"
      title="Complete commercial profile details"
      body="This prepares the accommodation record for review. It does not publish to traveler discovery by itself."
    >
      <form action={updateAccommodationProfileAction} style={{ display: "grid", gap: 14 }}>
        <input type="hidden" name="accommodationId" value={profile.accommodationId || ""} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <label style={labelStyle()}>
            Display name
            <input name="displayName" defaultValue={profile.displayTitle || ""} style={fieldStyle()} />
          </label>
          <label style={labelStyle()}>
            Property type
            <select name="propertyType" defaultValue="HOMESTAY" style={fieldStyle()}>
              <option value="HOMESTAY">Homestay</option>
              <option value="HOTEL">Hotel</option>
              <option value="HOSTEL">Hostel</option>
              <option value="RESORT">Resort</option>
              <option value="VILLA">Villa</option>
              <option value="GUESTHOUSE">Guesthouse</option>
            </select>
          </label>
          <label style={labelStyle()}>
            Municipality
            <input name="municipalityName" defaultValue="General Luna" style={fieldStyle()} />
          </label>
          <label style={labelStyle()}>
            Barangay / area
            <input name="barangayName" placeholder="Example: Catangnan" style={fieldStyle()} />
          </label>
        </div>
        <label style={labelStyle()}>
          Address / location hint
          <input name="addressLine" placeholder="Short location reference for operators and review" style={fieldStyle()} />
        </label>
        <label style={labelStyle()}>
          Short description
          <textarea name="shortDescription" rows={3} placeholder="Clear stay description for review and future traveler exposure." style={fieldStyle()} />
        </label>
        <div>
          <ActionButton>Save profile setup</ActionButton>
        </div>
      </form>
    </SetupPanel>
  );
}

function RoomSetupPanel({ profile, rooms }: { profile: AccommodationCard; rooms: RoomCard[] }) {
  return (
    <SetupPanel
      eyebrow="Step 3 · Rooms and pricing"
      title="Create room supply and mark pricing readiness"
      body="Rooms can be drafted first. Pricing readiness turns on only when a valid base price is saved."
    >
      <form action={createRoomDraftAction} style={{ display: "grid", gap: 14 }}>
        <input type="hidden" name="accommodationId" value={profile.accommodationId || ""} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
          <label style={labelStyle()}>
            Room title
            <input name="title" required placeholder="Example: Standard Queen Room" style={fieldStyle()} />
          </label>
          <label style={labelStyle()}>
            Room type
            <select name="roomUnitType" defaultValue="STANDARD_ROOM" style={fieldStyle()}>
              <option value="STANDARD_ROOM">Standard room</option>
              <option value="DELUXE_ROOM">Deluxe room</option>
              <option value="FAMILY_ROOM">Family room</option>
              <option value="PRIVATE_VILLA">Private villa</option>
              <option value="DORM_BED">Dorm bed</option>
              <option value="BARKADA_ROOM">Barkada room</option>
              <option value="COUPLE_ROOM">Couple room</option>
              <option value="BEACHFRONT_ROOM">Beachfront room</option>
              <option value="SURF_STAY_ROOM">Surf stay room</option>
              <option value="LONG_STAY_UNIT">Long-stay unit</option>
            </select>
          </label>
          <label style={labelStyle()}>
            Max occupancy
            <input name="maxOccupancy" type="number" min="1" defaultValue="2" style={fieldStyle()} />
          </label>
          <label style={labelStyle()}>
            Base capacity
            <input name="baseCapacity" type="number" min="1" defaultValue="2" style={fieldStyle()} />
          </label>
        </div>
        <label style={labelStyle()}>
          Description
          <input name="description" placeholder="Short room note" style={fieldStyle()} />
        </label>
        <div>
          <ActionButton tone="gold">Create room draft</ActionButton>
        </div>
      </form>

      <div style={{ display: "grid", gap: 12 }}>
        {rooms.length ? (
          rooms.map((room) => (
            <article
              key={room.roomTypeId}
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: 18,
                padding: 16,
                background: "#F8FAFC",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <strong style={{ color: "#013863", fontSize: 17 }}>{room.title || "Untitled room"}</strong>
                  <p style={{ margin: "5px 0 0", color: "#64748B", fontSize: 13 }}>
                    {room.roomUnitType || "ROOM"} · {room.supplyType || "LIMITED_ROOM_SUPPLY"} · Units: {room.unitCount ?? 0}
                  </p>
                </div>
                <span
                  style={{
                    ...chipToneStyle(room.pricingReady ? "READY" : "PENDING"),
                    borderRadius: 999,
                    padding: "7px 10px",
                    fontSize: 12,
                    fontWeight: 950,
                    height: "fit-content",
                  }}
                >
                  {room.pricingReady ? `Priced · PHP ${room.basePricePhp}` : "Pricing incomplete"}
                </span>
              </div>

              <form action={updateRoomPricingAction} style={{ display: "grid", gap: 12, marginTop: 14 }}>
                <input type="hidden" name="accommodationId" value={profile.accommodationId || ""} />
                <input type="hidden" name="roomTypeId" value={room.roomTypeId || ""} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                  <label style={labelStyle()}>
                    Room title
                    <input name="title" defaultValue={room.title || ""} style={fieldStyle()} />
                  </label>
                  <label style={labelStyle()}>
                    Room type
                    <select name="roomUnitType" defaultValue={room.roomUnitType || "STANDARD_ROOM"} style={fieldStyle()}>
                      <option value="STANDARD_ROOM">Standard room</option>
                      <option value="DELUXE_ROOM">Deluxe room</option>
                      <option value="FAMILY_ROOM">Family room</option>
                      <option value="PRIVATE_VILLA">Private villa</option>
                      <option value="DORM_BED">Dorm bed</option>
                      <option value="BARKADA_ROOM">Barkada room</option>
                      <option value="COUPLE_ROOM">Couple room</option>
                      <option value="BEACHFRONT_ROOM">Beachfront room</option>
                      <option value="SURF_STAY_ROOM">Surf stay room</option>
                      <option value="LONG_STAY_UNIT">Long-stay unit</option>
                    </select>
                  </label>
                  <label style={labelStyle()}>
                    Max occupancy
                    <input name="maxOccupancy" type="number" min="1" defaultValue={room.maxOccupancy || 1} style={fieldStyle()} />
                  </label>
                  <label style={labelStyle()}>
                    Base capacity
                    <input name="baseCapacity" type="number" min="1" defaultValue={room.baseCapacity || 1} style={fieldStyle()} />
                  </label>
                  <label style={labelStyle()}>
                    Base price PHP
                    <input name="basePricePhp" type="number" min="0" step="0.01" defaultValue={room.basePricePhp || ""} placeholder="Example: 2500" style={fieldStyle()} />
                  </label>
                  <label style={{ ...labelStyle(), alignContent: "end" }}>
                    Active
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 42 }}>
                      <input name="isActive" type="checkbox" defaultChecked={room.isActive !== false} />
                      <span>Room is active</span>
                    </span>
                  </label>
                </div>
                <div>
                  <ActionButton>Save room pricing</ActionButton>
                </div>
              </form>
            </article>
          ))
        ) : (
          <p style={{ margin: 0, color: "#64748B", fontWeight: 750 }}>
            No room drafts yet. Create at least one room before this accommodation can become traveler-ready.
          </p>
        )}
      </div>
    </SetupPanel>
  );
}

function MediaSetupPanel({ profile, media }: { profile: AccommodationCard; media: MediaCard[] }) {
  return (
    <SetupPanel
      eyebrow="Step 4 · Photos and video metadata"
      title="Register media for review"
      body="Photo-only setup is accepted for MVP. Video is recommended for conversion but must not block draft setup or page load."
    >
      <form action={registerMediaAction} style={{ display: "grid", gap: 14 }}>
        <input type="hidden" name="accommodationId" value={profile.accommodationId || ""} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
          <label style={labelStyle()}>
            Media type
            <select name="mediaType" defaultValue="HERO" style={fieldStyle()}>
              <option value="HERO">Hero photo</option>
              <option value="PHOTO">Photo</option>
              <option value="GALLERY">Gallery photo</option>
              <option value="VIDEO">Video</option>
            </select>
          </label>
          <label style={labelStyle()}>
            Sort order
            <input name="sortOrder" type="number" min="0" defaultValue="0" style={fieldStyle()} />
          </label>
        </div>
        <label style={labelStyle()}>
          Media URL
          <input name="url" required placeholder="https://cdn.example.com/accommodation/photo-1280.webp" style={fieldStyle()} />
        </label>
        <label style={labelStyle()}>
          Caption
          <input name="caption" placeholder="Short caption for review" style={fieldStyle()} />
        </label>
        <div>
          <ActionButton tone="gold">Register media metadata</ActionButton>
        </div>
      </form>

      <div style={{ display: "grid", gap: 12 }}>
        {media.length ? (
          media.map((item) => (
            <article
              key={item.mediaId}
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: 18,
                padding: 16,
                background: item.fallbackGradient || "#F8FAFC",
                color: item.fallbackGradient ? "#FFFFFF" : "#0F172A",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <strong style={{ fontSize: 16 }}>{item.mediaType || "MEDIA"} · {item.mediaStatus || "PENDING"}</strong>
                  <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.9 }}>
                    {item.caption || "No caption"} · Sort {item.sortOrder ?? 0}
                  </p>
                </div>
                <span style={{ borderRadius: 999, padding: "7px 10px", background: "rgba(255,255,255,0.18)", fontSize: 12, fontWeight: 950 }}>
                  {item.publicReady ? "Public-ready" : "Not traveler-public"}
                </span>
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 13, lineHeight: 1.45, opacity: 0.92 }}>
                {item.marketingWording || "Media metadata is registered for controlled review."}
              </p>
              <p style={{ margin: "7px 0 0", fontSize: 12, lineHeight: 1.45, opacity: 0.86 }}>
                {item.performanceWording || "Fast rendering requires optimized derivatives later."}
              </p>
              {item.mediaStatus !== "HIDDEN" ? (
                <form action={hideMediaAction} style={{ marginTop: 12 }}>
                  <input type="hidden" name="accommodationId" value={profile.accommodationId || ""} />
                  <input type="hidden" name="mediaId" value={item.mediaId || ""} />
                  <ActionButton tone="muted">Hide media</ActionButton>
                </form>
              ) : null}
            </article>
          ))
        ) : (
          <p style={{ margin: 0, color: "#64748B", fontWeight: 750 }}>
            No media registered yet. A strong hero photo is the minimum commercial proof. Video can follow later.
          </p>
        )}
      </div>
    </SetupPanel>
  );
}

function AccommodationReadinessCard({ workspace }: { workspace: AccommodationWorkspace }) {
  const item = workspace.profile;

  return (
    <article
      style={{
        background: "#FFFFFF",
        border: "1px solid #DDE7F0",
        borderRadius: 24,
        padding: 22,
        boxShadow: "0 12px 34px rgba(1, 56, 99, 0.08)",
        display: "grid",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 18,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#0097A7",
              fontSize: 12,
              fontWeight: 950,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            Active accommodation setup
          </p>
          <h2 style={{ margin: "8px 0 0", fontSize: 26, lineHeight: 1.08, color: "#013863" }}>
            {item.displayTitle || "Untitled accommodation"}
          </h2>
          <p style={{ margin: "8px 0 0", color: "#64748B", fontSize: 13 }}>
            ID: {item.accommodationId || "Not returned"}
          </p>
        </div>

        <div
          style={{
            borderRadius: 18,
            padding: "12px 14px",
            background: "#013863",
            color: "#FFFFFF",
            minWidth: 220,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 900, color: "#F3AE26", textTransform: "uppercase" }}>
            Traveler exposure path
          </div>
          <p style={{ margin: "7px 0 0", fontSize: 13, lineHeight: 1.4 }}>
            Draft → Profile → Rooms/Pricing → Media Review → Admin Publish.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        <StatusBlock title="Profile" chip={item.propertyReadinessChip} />
        <StatusBlock title="Rooms" chip={item.roomReadinessChip} />
        <StatusBlock title="Availability" chip={item.inventoryReadinessChip} />
        <StatusBlock title="QR Check-in" chip={item.qrCheckInReadinessChip} />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <QueuePill label={item.requestQueueLabel} />
        <QueuePill label={item.stayQueueLabel} />
        <QueuePill label={item.voucherQueueLabel} />
      </div>
    </article>
  );
}


function AccommodationWorkspaceShell({ children }: { children: ReactNode }) {
  const navItems = [
    { href: "/operator/accommodations", label: "Setup Overview", active: true },
    { href: "/operator/accommodations#draft", label: "Draft" },
    { href: "/operator/accommodations#profile", label: "Profile" },
    { href: "/operator/accommodations#rooms", label: "Rooms & Pricing" },
    { href: "/operator/accommodations#media", label: "Media Review" },
    { href: "/operator/accommodations#exposure", label: "Exposure Gate" },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 92% 0%, rgba(243,174,38,0.10), transparent 30%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 48%, #F8FAFC 100%)",
        color: "#013863",
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "292px minmax(0, 1fr)",
          minHeight: "100vh",
        }}
      >
        <aside
          style={{
            borderRight: "1px solid rgba(1,56,99,0.10)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,252,250,0.94))",
            padding: 22,
            position: "sticky",
            top: 0,
            alignSelf: "start",
            minHeight: "100vh",
          }}
        >
          <section
            style={{
              borderRadius: 24,
              padding: 18,
              background: "linear-gradient(135deg, #013863 0%, #003B66 64%, #014B78 100%)",
              color: "#FFFFFF",
              boxShadow: "0 18px 42px rgba(1,56,99,0.18)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#F3AE26",
                fontSize: 11,
                fontWeight: 950,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Accommodation Workspace
            </p>
            <h1
              style={{
                margin: "8px 0 0",
                fontSize: 25,
                lineHeight: 1.04,
                letterSpacing: "-0.035em",
              }}
            >
              Stay Supply Console
            </h1>
            <p
              style={{
                margin: "9px 0 0",
                color: "#FFFFFF",
                opacity: 0.88,
                fontSize: 13.5,
                lineHeight: 1.42,
                fontWeight: 650,
              }}
            >
              Build stay drafts, room pricing, media readiness, and controlled Traveler App exposure.
            </p>
          </section>

          <nav aria-label="Accommodation setup navigation" style={{ display: "grid", gap: 9, marginTop: 18 }}>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  textDecoration: "none",
                  padding: "12px 14px",
                  borderRadius: 16,
                  fontWeight: 900,
                  fontSize: 14,
                  background: item.active ? "#013863" : "#FFFFFF",
                  color: item.active ? "#FFFFFF" : "#013863",
                  border: item.active ? "1px solid #013863" : "1px solid rgba(1,56,99,0.18)",
                  boxShadow: item.active ? "0 10px 24px rgba(1,56,99,0.14)" : "none",
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <section
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: "1px solid rgba(1,56,99,0.12)",
              display: "grid",
              gap: 8,
            }}
          >
            <p
              style={{
                margin: "0 0 2px",
                color: "#50668B",
                fontSize: 11,
                fontWeight: 950,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Related controls
            </p>
            <a href="/operator/commercial" style={{ textDecoration: "none", color: "#013863", fontWeight: 850, fontSize: 13.5 }}>
              Commercial Console
            </a>
            <a href="/operator/settings" style={{ textDecoration: "none", color: "#013863", fontWeight: 850, fontSize: 13.5 }}>
              Operator Settings
            </a>
            <a href="/operator" style={{ textDecoration: "none", color: "#013863", fontWeight: 850, fontSize: 13.5 }}>
              Operator Home
            </a>
            <a href="/logout" style={{ textDecoration: "none", color: "#7A4A00", fontWeight: 900, fontSize: 13.5 }}>
              Logout
            </a>
          </section>
        </aside>

        <section style={{ padding: 30 }}>
          <header
            style={{
              marginBottom: 22,
              borderRadius: 28,
              padding: 24,
              background: "#FFFFFF",
              border: "1px solid rgba(1,56,99,0.10)",
              boxShadow: "0 18px 44px rgba(1,56,99,0.06)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#0097A7",
                fontSize: 11,
                fontWeight: 950,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Operator Accommodation Module
            </p>
            <h2
              style={{
                margin: "8px 0 0",
                fontSize: 34,
                lineHeight: 1.02,
                letterSpacing: "-0.045em",
                color: "#013863",
              }}
            >
              Accommodation Console
            </h2>
            <p
              style={{
                margin: "9px 0 0",
                maxWidth: 880,
                color: "#50668B",
                fontSize: 15,
                lineHeight: 1.5,
                fontWeight: 650,
              }}
            >
              Production setup workspace for accommodation drafts, room pricing, photo/video metadata, readiness review, and controlled Traveler App exposure.
            </p>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}


export default async function OperatorAccommodationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  const token = await requireAccessToken();
  const resolvedSearchParams = await searchParams;
  const accommodations = await safeJson<AccommodationCard[]>("/operator/accommodations", token, []);

  const workspaces: AccommodationWorkspace[] = await Promise.all(
    accommodations.map(async (profile) => {
      const accommodationId = profile.accommodationId || "";
      const [rooms, media] = accommodationId
        ? await Promise.all([
            safeJson<RoomCard[]>(`/operator/accommodations/${encodeURIComponent(accommodationId)}/rooms`, token, []),
            safeJson<MediaCard[]>(`/operator/accommodations/${encodeURIComponent(accommodationId)}/media`, token, []),
          ])
        : [[], []];

      return { profile, rooms, media };
    }),
  );

  return (
    <AccommodationWorkspaceShell>
      <section style={{ display: "grid", gap: 18 }}>
        <Notice type="success" text={resolvedSearchParams?.success} />
        <Notice type="error" text={resolvedSearchParams?.error} />

        <div
          style={{
            borderRadius: 24,
            padding: 22,
            background:
              "radial-gradient(circle at 88% 12%, rgba(243,174,38,0.22), transparent 30%), linear-gradient(135deg, #013863 0%, #003B66 58%, #014B78 100%)",
            color: "#FFFFFF",
            boxShadow: "0 22px 54px rgba(1, 56, 99, 0.22)",
            display: "grid",
            gap: 14,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#F3AE26",
              fontSize: 12,
              fontWeight: 950,
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            ACCOM-23D · Accommodation workspace
          </p>
          <h2 style={{ margin: 0, fontSize: 32, lineHeight: 1.02, letterSpacing: "-0.035em", maxWidth: 960 }}>
            Build the accommodation supply path before traveler exposure.
          </h2>
          <p style={{ margin: 0, maxWidth: 900, color: "#FFFFFF", lineHeight: 1.55, fontWeight: 650 }}>
            This console now exposes the real setup sequence: create draft, complete profile, create rooms, set room pricing, register photos/video metadata, and wait for admin media approval before public traveler visibility.
          </p>
        </div>

        <CreateAccommodationPanel />

        {workspaces.length ? (
          workspaces.map((workspace) => (
            <div key={workspace.profile.accommodationId || workspace.profile.displayTitle} style={{ display: "grid", gap: 18 }}>
              <AccommodationReadinessCard workspace={workspace} />
              <ProfileSetupPanel profile={workspace.profile} />
              <RoomSetupPanel profile={workspace.profile} rooms={workspace.rooms} />
              <MediaSetupPanel profile={workspace.profile} media={workspace.media} />
            </div>
          ))
        ) : (
          <article
            style={{
              background: "#FFFFFF",
              border: "1px solid #DDE7F0",
              borderRadius: 24,
              padding: 26,
              boxShadow: "0 12px 34px rgba(1, 56, 99, 0.06)",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#0097A7",
                fontSize: 12,
                fontWeight: 950,
                letterSpacing: 0.8,
                textTransform: "uppercase",
              }}
            >
              No accommodation profile returned
            </p>
            <h2 style={{ margin: "8px 0 0", fontSize: 26, color: "#013863" }}>
              Start with one clean accommodation draft — not a fake public listing.
            </h2>
            <p style={{ margin: "10px 0 0", color: "#475569", lineHeight: 1.55 }}>
              A traveler-facing stay cannot exist from a blank shell. The operator needs a profile, rooms, pricing, approved media, and admin publishing before public exposure.
            </p>
          </article>
        )}
      </section>
    </AccommodationWorkspaceShell>
  );
}
