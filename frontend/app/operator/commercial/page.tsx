import OperatorShell from "../../../src/components/operator/OperatorShell";
import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type TrailProduct = {
  packageId: string;
  packageCode: string;
  packageName: string;
  publicLabel?: string | null;
  productType?: string | null;
  fulfillmentPartnerType?: string | null;
  approvalStatus?: string | null;
  distributionEnabled?: boolean | null;
  operatorCapability?: any;
  operatorPricing?: any;
  commercialTermsAccepted?: boolean;
  marketplaceExposure?: any;
  readiness?: {
    pricingReady?: boolean;
    capabilityReady?: boolean;
    termsAccepted?: boolean;
    marketplaceEnabled?: boolean;
    exposureStatus?: string;
  };
};

async function safeJson(url: string, token: string, fallback: any) {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        ...fallback,
        ok: false,
        statusCode: res.status,
        error: json?.message || json?.error || `Request failed: ${res.status}`,
        sourceUrl: url,
      };
    }

    return json ?? fallback;
  } catch (error) {
    return {
      ...fallback,
      ok: false,
      statusCode: 0,
      error: error instanceof Error ? error.message : "Unknown fetch error",
      sourceUrl: url,
    };
  }
}

async function getCommercialData() {
  const token = await requireAccessToken();
  const baseUrl = getApiBaseUrl();

  const [productsJson, capabilitiesJson, termsJson, acceptancesJson] = await Promise.all([
    safeJson(`${baseUrl}/spm/operator/trail-products`, token, { ok: false, data: [] }),
    safeJson(`${baseUrl}/spm/operator/trail-capabilities`, token, { ok: false, data: [] }),
    safeJson(`${baseUrl}/spm/operator/commercial-terms/required`, token, { ok: false, data: [] }),
    safeJson(`${baseUrl}/spm/operator/commercial-terms/acceptances`, token, { ok: false, data: [] }),
  ]);

  return {
    products: Array.isArray(productsJson?.data) ? productsJson.data : [],
    capabilities: Array.isArray(capabilitiesJson?.data) ? capabilitiesJson.data : [],
    terms: Array.isArray(termsJson?.data) ? termsJson.data : [],
    acceptances: Array.isArray(acceptancesJson?.data) ? acceptancesJson.data : [],
    diagnostics: [productsJson, capabilitiesJson, termsJson, acceptancesJson]
      .filter((item) => item?.ok === false && item?.error)
      .map((item) => ({
        statusCode: item.statusCode,
        error: item.error,
        sourceUrl: item.sourceUrl,
      })),
  };
}

function getText(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

async function activateCapabilityAction(formData: FormData) {
  "use server";

  const token = await requireAccessToken();
  const packageCode = getText(formData, "packageCode");

  if (!packageCode) {
    redirect("/operator/commercial?error=Missing%20package%20code");
  }

  const payload = {
    marketplaceEnabled: formData.get("marketplaceEnabled") === "on",
    title: getText(formData, "title"),
    description: getText(formData, "description"),
    inclusions: getText(formData, "inclusions"),
    exclusions: getText(formData, "exclusions"),
    pickupPolicy: getText(formData, "pickupPolicy"),
    weatherPolicy: getText(formData, "weatherPolicy"),
    cancellationPolicy: getText(formData, "cancellationPolicy"),
    complianceNotes: getText(formData, "complianceNotes"),
    minPax: Number(getText(formData, "minPax") || 0) || null,
    maxPax: Number(getText(formData, "maxPax") || 0) || null,
    dailyCapacity: Number(getText(formData, "dailyCapacity") || 0) || null,
    availableDaysJson: getText(formData, "availableDaysJson"),
    blackoutDatesJson: getText(formData, "blackoutDatesJson"),
  };

  const res = await fetch(`${getApiBaseUrl()}/spm/operator/trail-products/${packageCode}/activate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    redirect(`/operator/commercial?error=${encodeURIComponent("Unable to activate capability")}`);
  }

  revalidatePath("/operator/commercial");
  redirect("/operator/commercial?success=Capability%20saved");
}

async function submitReviewAction(formData: FormData) {
  "use server";

  const token = await requireAccessToken();
  const packageCode = getText(formData, "packageCode");

  if (!packageCode) {
    redirect("/operator/commercial?error=Missing%20package%20code");
  }

  const res = await fetch(`${getApiBaseUrl()}/spm/operator/trail-products/${packageCode}/submit-review`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect(`/operator/commercial?error=${encodeURIComponent("Unable to submit capability for review")}`);
  }

  revalidatePath("/operator/commercial");
  redirect("/operator/commercial?success=Submitted%20for%20review");
}


async function submitPricingAction(formData: FormData) {
  "use server";

  const token = await requireAccessToken();
  const packageCode = getText(formData, "packageCode");

  if (!packageCode) {
    redirect("/operator/commercial?error=Missing%20package%20code");
  }

  const payload = {
    pricingRuleId: getText(formData, "pricingRuleId") || undefined,
    pricingMode: getText(formData, "pricingMode") || "FIXED_PER_HEAD",
    currencyCode: getText(formData, "currencyCode") || "PHP",
    basePrice: getText(formData, "basePrice"),
    priceRangeMin: getText(formData, "priceRangeMin"),
    priceRangeMax: getText(formData, "priceRangeMax"),
    packageFlatRate: getText(formData, "packageFlatRate"),
    requestToConfirmRequired: formData.get("requestToConfirmRequired") === "on",
    instantCheckoutAllowed: formData.get("instantCheckoutAllowed") === "on",
  };

  const res = await fetch(`${getApiBaseUrl()}/spm/operator/trail-products/${packageCode}/pricing`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    redirect(`/operator/commercial?error=${encodeURIComponent("Unable to save operator pricing")}`);
  }

  revalidatePath("/operator/commercial");
  redirect("/operator/commercial?success=Pricing%20saved%20for%20review");
}

async function acceptTermsAction(formData: FormData) {
  "use server";

  const token = await requireAccessToken();
  const termsId = getText(formData, "termsId");

  if (!termsId) {
    redirect("/operator/commercial?error=Missing%20terms%20id");
  }

  const payload = {
    userAgent: "operator-commercial-ui",
  };

  const res = await fetch(`${getApiBaseUrl()}/spm/operator/commercial-terms/${termsId}/accept`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    redirect(`/operator/commercial?error=${encodeURIComponent("Unable to accept commercial terms")}`);
  }

  revalidatePath("/operator/commercial");
  redirect("/operator/commercial?success=Terms%20accepted");
}

function statusTone(status?: string | null) {
  if (status === "APPROVED" || status === "ELIGIBLE" || status === "VISIBLE" || status === "ACCEPTED") {
    return { bg: "#ecfdf5", border: "#86efac", color: "#166534" };
  }

  if (status === "PENDING_REVIEW" || status === "NOT_READY" || status === "DRAFT" || status === "NOT ACCEPTED") {
    return { bg: "#fff7ed", border: "#fdba74", color: "#9a3412" };
  }

  if (status === "SUSPENDED" || status === "REJECTED" || status === "SUPPRESSED") {
    return { bg: "#fef2f2", border: "#fca5a5", color: "#991b1b" };
  }

  return { bg: "#f8fafc", border: "#cbd5e1", color: "#334155" };
}

function Pill(props: { label: string; status?: string | null }) {
  const tone = statusTone(props.status || props.label);
  return (
    <span
      style={{
        display: "inline-block",
        padding: "7px 10px",
        borderRadius: 999,
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        color: tone.color,
        fontSize: 12,
        fontWeight: 900,
        whiteSpace: "nowrap",
      }}
    >
      {props.label}
    </span>
  );
}

function Card(props: { title: string; value: any; note?: string }) {
  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        background: "#ffffff",
        padding: 20,
        boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
      }}
    >
      <div style={{ color: "#475569", fontSize: 13, fontWeight: 900 }}>{props.title}</div>
      <div style={{ marginTop: 8, color: "#0f172a", fontSize: 34, lineHeight: 1, fontWeight: 950 }}>
        {props.value}
      </div>
      {props.note ? <div style={{ marginTop: 8, color: "#64748b", fontSize: 13 }}>{props.note}</div> : null}
    </section>
  );
}

function progressTone(status?: string | null) {
  const value = String(status || "").toUpperCase();

  if (["READY", "APPROVED", "ACCEPTED", "VISIBLE"].includes(value)) {
    return { bg: "#ecfdf5", border: "#86efac", color: "#166534", icon: "✓" };
  }

  if (["DRAFT", "PENDING_REVIEW", "ENABLED", "SUBMITTED"].includes(value)) {
    return { bg: "#fff7ed", border: "#fdba74", color: "#9a3412", icon: "●" };
  }

  if (["NOT_READY", "NO PRICING", "NO CAPABILITY", "NOT ACCEPTED", "DISABLED"].includes(value)) {
    return { bg: "#f8fafc", border: "#cbd5e1", color: "#334155", icon: "○" };
  }

  if (["REJECTED", "SUSPENDED", "SUPPRESSED"].includes(value)) {
    return { bg: "#fef2f2", border: "#fca5a5", color: "#991b1b", icon: "!" };
  }

  return { bg: "#f8fafc", border: "#cbd5e1", color: "#334155", icon: "○" };
}

function ProgressStateCard(props: { title: string; status: string; detail: string }) {
  const tone = progressTone(props.status);

  return (
    <div
      style={{
        border: `1px solid ${tone.border}`,
        background: tone.bg,
        color: tone.color,
        padding: "11px 12px",
        borderRadius: 13,
        display: "grid",
        gap: 4,
        minHeight: 66,
      }}
    >
      <div style={{ display: "flex", gap: 7, alignItems: "center", fontSize: 13, fontWeight: 950 }}>
        <span>{tone.icon}</span>
        <span>{props.title}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 950, letterSpacing: 0.2 }}>
        {props.status}
      </div>
      <div style={{ fontSize: 12, fontWeight: 750, color: tone.color, opacity: 0.86 }}>
        {props.detail}
      </div>
    </div>
  );
}

function TextField(props: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  multiline?: boolean;
  type?: string;
}) {
  const baseStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "11px 12px",
    borderRadius: 10,
    border: "1px solid #334155",
    color: "#0f172a",
    background: "#ffffff",
    fontWeight: 700,
  };

  return (
    <label style={{ display: "grid", gap: 7 }}>
      <span style={{ fontWeight: 900, fontSize: 13 }}>{props.label}</span>
      {props.multiline ? (
        <textarea
          name={props.name}
          defaultValue={props.defaultValue == null ? "" : String(props.defaultValue)}
          placeholder={props.placeholder || ""}
          rows={3}
          style={baseStyle}
        />
      ) : (
        <input
          name={props.name}
          type={props.type || "text"}
          defaultValue={props.defaultValue == null ? "" : String(props.defaultValue)}
          placeholder={props.placeholder || ""}
          style={baseStyle}
        />
      )}
    </label>
  );
}


function SelectField(props: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label style={{ display: "grid", gap: 7 }}>
      <span style={{ fontWeight: 900, fontSize: 13 }}>{props.label}</span>
      <select
        name={props.name}
        defaultValue={props.defaultValue || ""}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "11px 12px",
          borderRadius: 10,
          border: "1px solid #334155",
          color: "#0f172a",
          background: "#ffffff",
          fontWeight: 800,
        }}
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}


function PricingForm(props: { product: TrailProduct }) {
  const p = props.product;
  const pricing = p.operatorPricing || {};
  const pricingMode = pricing.pricingMode || "FIXED_PER_HEAD";
  const approvalStatus = pricing.approvalStatus || "NO PRICING";

  return (
    <section
      style={{
        marginTop: 16,
        border: "1px solid #bbf7d0",
        background: "#f0fdf4",
        borderRadius: 16,
        padding: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #86efac",
          background: "#ffffff",
          borderRadius: 14,
          padding: 12,
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontWeight: 950 }}>Pricing logic required</div>
          <div style={{ color: "#166534", fontSize: 13, marginTop: 3 }}>
            Operator pricing stays draft until admin/pricing governance approves it.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Pill label={approvalStatus} status={approvalStatus} />
        </div>
      </div>

      <form id={`pricing-${p.packageCode}`} action={submitPricingAction} style={{ display: "grid", gap: 14 }}>
        <input type="hidden" name="packageCode" value={p.packageCode} />
        <input type="hidden" name="pricingRuleId" value={pricing.id || ""} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
          <SelectField
            label="Pricing mode"
            name="pricingMode"
            defaultValue={pricingMode}
            options={[
              { value: "FIXED_PER_HEAD", label: "Fixed per head" },
              { value: "PAX_TIERED_PER_HEAD", label: "Pax-tiered per head" },
              { value: "PACKAGE_FLAT_RATE", label: "Package flat rate" },
              { value: "PRICE_RANGE", label: "Price range" },
              { value: "REQUEST_TO_CONFIRM", label: "Request to confirm" },
              { value: "FILLABLE_PRICE_REQUIRED", label: "Fillable price required" },
            ]}
          />

          <TextField label="Currency" name="currencyCode" defaultValue={pricing.currencyCode || "PHP"} />
          <TextField label="Base price" name="basePrice" type="number" defaultValue={pricing.basePrice || ""} />
          <TextField label="Price range min" name="priceRangeMin" type="number" defaultValue={pricing.priceRangeMin || ""} />
          <TextField label="Price range max" name="priceRangeMax" type="number" defaultValue={pricing.priceRangeMax || ""} />
          <TextField label="Package flat rate" name="packageFlatRate" type="number" defaultValue={pricing.packageFlatRate || ""} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              fontWeight: 900,
              border: "1px solid #86efac",
              padding: 12,
              borderRadius: 12,
              background: "#ffffff",
            }}
          >
            <input
              type="checkbox"
              name="requestToConfirmRequired"
              defaultChecked={Boolean(pricing.requestToConfirmRequired)}
            />
            Request-to-confirm required
          </label>

          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              fontWeight: 900,
              border: "1px solid #86efac",
              padding: 12,
              borderRadius: 12,
              background: "#ffffff",
            }}
          >
            <input
              type="checkbox"
              name="instantCheckoutAllowed"
              defaultChecked={Boolean(pricing.instantCheckoutAllowed)}
            />
            Instant checkout allowed
          </label>
        </div>

        <div
          style={{
            border: "1px solid #fde68a",
            background: "#fffbeb",
            color: "#92400e",
            borderRadius: 12,
            padding: 12,
            fontWeight: 850,
            fontSize: 13,
          }}
        >
          Pricing submission does not publish the product. Public exposure still requires approved capability, accepted terms, approved media, and marketplace eligibility.
        </div>
      </form>
    </section>
  );
}


function FinalProductActionPanel(props: { product: TrailProduct }) {
  const p = props.product;
  const c = p.operatorCapability || {};
  const isApproved = c.approvalStatus === "APPROVED";
  const isPending = c.approvalStatus === "PENDING_REVIEW";
  const hasCapability = Boolean(c.id);

  return (
    <section
      style={{
        marginTop: 16,
        border: "1px solid #0f172a",
        background: "#ffffff",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontWeight: 950, fontSize: 18 }}>Final operator actions</div>
          <div style={{ color: "#475569", fontSize: 13, marginTop: 4, fontWeight: 750 }}>
            Save service details and pricing first. Submit for review only after the capability record exists.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="submit"
            form={`commercial-details-${p.packageCode}`}
            style={{
              border: "1px solid #0f172a",
              background: "#0f172a",
              color: "#ffffff",
              borderRadius: 12,
              padding: "12px 15px",
              fontWeight: 950,
              cursor: "pointer",
            }}
          >
            {hasCapability ? "Save Commercial Details" : "Activate Capability"}
          </button>

          <button
            type="submit"
            form={`pricing-${p.packageCode}`}
            style={{
              border: "1px solid #166534",
              background: "#166534",
              color: "#ffffff",
              borderRadius: 12,
              padding: "12px 15px",
              fontWeight: 950,
              cursor: "pointer",
            }}
          >
            Save Pricing
          </button>

          {hasCapability && !isApproved && !isPending ? (
            <form action={submitReviewAction} style={{ margin: 0 }}>
              <input type="hidden" name="packageCode" value={p.packageCode} />
              <button
                type="submit"
                style={{
                  border: "1px solid #0369a1",
                  background: "#0369a1",
                  color: "#ffffff",
                  borderRadius: 12,
                  padding: "12px 15px",
                  fontWeight: 950,
                  cursor: "pointer",
                }}
              >
                Submit for Review
              </button>
            </form>
          ) : null}
        </div>
      </div>

      {isPending ? (
        <div style={{ marginTop: 12, color: "#9a3412", fontWeight: 900 }}>
          Submitted. Waiting for admin review.
        </div>
      ) : null}

      {isApproved ? (
        <div style={{ marginTop: 12, color: "#166534", fontWeight: 900 }}>
          Capability approved. Public visibility still requires pricing, terms, media, and exposure eligibility.
        </div>
      ) : null}
    </section>
  );
}

function CapabilityForm(props: { product: TrailProduct }) {
  const p = props.product;
  const c = p.operatorCapability || {};
  const isApproved = c.approvalStatus === "APPROVED";
  const isPending = c.approvalStatus === "PENDING_REVIEW";

  return (
    <section
      style={{
        marginTop: 16,
        border: "1px solid #dbeafe",
        background: "#f8fbff",
        borderRadius: 16,
        padding: 16,
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 10 }}>Operator Commercial Details</h3>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #cbd5e1",
          background: "#ffffff",
          borderRadius: 14,
          padding: 12,
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontWeight: 950 }}>Commercial action required</div>
          <div style={{ color: "#475569", fontSize: 13, marginTop: 3 }}>
            Save details first. Submit for review only appears after a capability record exists.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>

        </div>
      </div>

      <form id={`commercial-details-${p.packageCode}`} action={activateCapabilityAction} style={{ display: "grid", gap: 14 }}>
        <input type="hidden" name="packageCode" value={p.packageCode} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          <TextField label="Service title" name="title" defaultValue={c.title || `${p.packageName} Operator Capability`} />
          <TextField label="Daily capacity" name="dailyCapacity" type="number" defaultValue={c.dailyCapacity || ""} />
          <TextField label="Minimum pax" name="minPax" type="number" defaultValue={c.minPax || ""} />
          <TextField label="Maximum pax" name="maxPax" type="number" defaultValue={c.maxPax || ""} />
        </div>

        <TextField label="Service description" name="description" multiline defaultValue={c.description || ""} />
        <TextField label="Inclusions" name="inclusions" multiline defaultValue={c.inclusions || ""} />
        <TextField label="Exclusions" name="exclusions" multiline defaultValue={c.exclusions || ""} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
          <TextField label="Pickup policy" name="pickupPolicy" multiline defaultValue={c.pickupPolicy || ""} />
          <TextField label="Weather policy" name="weatherPolicy" multiline defaultValue={c.weatherPolicy || ""} />
          <TextField label="Cancellation policy" name="cancellationPolicy" multiline defaultValue={c.cancellationPolicy || ""} />
        </div>

        <TextField label="Compliance notes" name="complianceNotes" multiline defaultValue={c.complianceNotes || ""} />
        <TextField label="Available days JSON" name="availableDaysJson" defaultValue={c.availableDaysJson || ""} placeholder='Example: ["MON","TUE","FRI"]' />
        <TextField label="Blackout dates JSON" name="blackoutDatesJson" defaultValue={c.blackoutDatesJson || ""} placeholder='Example: ["2026-05-10"]' />

        <label
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            fontWeight: 900,
            border: "1px solid #cbd5e1",
            padding: 12,
            borderRadius: 12,
            background: "#ffffff",
          }}
        >
          <input type="checkbox" name="marketplaceEnabled" defaultChecked={Boolean(c.marketplaceEnabled)} />
          Enable marketplace readiness request
        </label>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        </div>
      </form>


      {isPending ? (
        <div style={{ marginTop: 10, color: "#9a3412", fontWeight: 900 }}>
          Submitted. Waiting for admin review.
        </div>
      ) : null}

      {isApproved ? (
        <div style={{ marginTop: 10, color: "#166534", fontWeight: 900 }}>
          Capability approved. Public visibility still requires pricing, terms, media, and exposure eligibility.
        </div>
      ) : null}
    </section>
  );
}

function ProductRow(props: { product: TrailProduct; index: number }) {
  const p = props.product;
  const productNumber = props.index + 1;
  const accentPalette = ["#0f766e", "#0369a1", "#7c3aed", "#b45309", "#166534", "#be123c"];
  const accent = accentPalette[props.index % accentPalette.length];
  const readiness = p.readiness || {};
  const capabilityStatus = p.operatorCapability?.approvalStatus || "NO CAPABILITY";
  const pricingStatus = p.operatorPricing?.approvalStatus || "NO PRICING";
  const exposureStatus = readiness.exposureStatus || "NOT_READY";

  const pricingProgressStatus = readiness.pricingReady ? "READY" : pricingStatus;
  const pricingProgressDetail = readiness.pricingReady
    ? "Approved pricing can support marketplace readiness."
    : p.operatorPricing?.id
      ? "Pricing exists but still needs approval."
      : "Operator pricing has not been submitted.";

  const capabilityProgressStatus = readiness.capabilityReady ? "APPROVED" : capabilityStatus;
  const capabilityProgressDetail = readiness.capabilityReady
    ? "Operator capability has passed review."
    : p.operatorCapability?.id
      ? "Capability exists but is not approved yet."
      : "Capability details have not been activated.";

  const termsProgressStatus = readiness.termsAccepted ? "ACCEPTED" : "NOT ACCEPTED";
  const termsProgressDetail = readiness.termsAccepted
    ? "Required commercial terms are accepted."
    : "Required commercial terms still need acceptance.";

  const marketplaceProgressStatus = p.marketplaceExposure?.isVisible
    ? "VISIBLE"
    : readiness.marketplaceEnabled
      ? exposureStatus === "NOT_READY" ? "ENABLED" : exposureStatus
      : "DISABLED";
  const marketplaceProgressDetail = p.marketplaceExposure?.isVisible
    ? "This product is visible through governed exposure."
    : readiness.marketplaceEnabled
      ? "Marketplace request is enabled but not publicly visible."
      : "Marketplace readiness request is off.";

  return (
    <article
      style={{
        border: "1px solid #cbd5e1",
        borderLeft: `7px solid ${accent}`,
        borderRadius: 22,
        background: "#ffffff",
        padding: 0,
        boxShadow: "0 18px 42px rgba(15,23,42,0.08)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "linear-gradient(90deg, #f8fafc 0%, #ffffff 100%)",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: accent,
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontWeight: 950,
              boxShadow: "0 8px 20px rgba(15,23,42,0.16)",
              flex: "0 0 auto",
            }}
          >
            {productNumber}
          </div>

          <div>
            <div style={{ color: accent, fontSize: 12, fontWeight: 950, letterSpacing: 0.6, textTransform: "uppercase" }}>
              {p.publicLabel || p.productType || "Trail Product"}
            </div>
            <h2 style={{ margin: "6px 0 8px", fontSize: 24, lineHeight: 1.08 }}>{p.packageName}</h2>
            <div style={{ color: "#475569", fontSize: 13, fontWeight: 800 }}>
              {p.packageCode} · {p.fulfillmentPartnerType || "LOCAL_OPERATOR"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "start" }}>
          <Pill label={p.approvalStatus || "UNKNOWN"} status={p.approvalStatus} />
          <Pill label={capabilityStatus} status={capabilityStatus} />
          <Pill label={pricingStatus} status={pricingStatus} />
          <Pill label={exposureStatus} status={exposureStatus} />
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 14,
            color: "#334155",
            fontSize: 13,
            fontWeight: 950,
            letterSpacing: 0.3,
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 28, height: 3, borderRadius: 999, background: accent }} />
          Commercial setup sequence
        </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 10,
          marginTop: 18,
        }}
      >
        <ProgressStateCard title="Pricing" status={pricingProgressStatus} detail={pricingProgressDetail} />
        <ProgressStateCard title="Capability" status={capabilityProgressStatus} detail={capabilityProgressDetail} />
        <ProgressStateCard title="Terms" status={termsProgressStatus} detail={termsProgressDetail} />
        <ProgressStateCard title="Marketplace" status={marketplaceProgressStatus} detail={marketplaceProgressDetail} />
      </div>

      <div
        style={{
          marginTop: 16,
          border: "1px solid #fde68a",
          background: "#fffbeb",
          borderRadius: 14,
          padding: 14,
          color: "#92400e",
          fontWeight: 800,
          fontSize: 13,
        }}
      >
        Visibility is controlled by admin exposure rules. Operator readiness alone does not publish this service publicly.
      </div>

      <CapabilityForm product={p} />
      <PricingForm product={p} />
      <FinalProductActionPanel product={p} />
      </div>
    </article>
  );
}

export default async function OperatorCommercialPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) || {};
  const success = typeof params.success === "string" ? params.success : "";
  const error = typeof params.error === "string" ? params.error : "";

  const { products, capabilities, terms, acceptances, diagnostics } = await getCommercialData();

  const approvedCapabilities = capabilities.filter((item: any) => item.approvalStatus === "APPROVED").length;
  const pendingCapabilities = capabilities.filter((item: any) => item.approvalStatus === "PENDING_REVIEW").length;
  const pricedProducts = products.filter((item: TrailProduct) => item.readiness?.pricingReady).length;
  const termsAccepted = products.filter((item: TrailProduct) => item.readiness?.termsAccepted).length;
  const acceptedTermsIds = new Set(acceptances.filter((item: any) => item.status === "ACCEPTED").map((item: any) => item.commercialTermsId));

  return (
    <OperatorShell
      currentPath="/operator/commercial"
      title="Commercial"
      subtitle="Manage Passport Trails product readiness, operator capability status, terms acceptance, and marketplace exposure readiness."
    >
      <div style={{ display: "grid", gap: 22 }}>
        {success ? (
          <section style={{ border: "1px solid #86efac", background: "#ecfdf5", color: "#166534", borderRadius: 16, padding: 14, fontWeight: 900 }}>
            {success}
          </section>
        ) : null}

        {error ? (
          <section style={{ border: "1px solid #fca5a5", background: "#fef2f2", color: "#991b1b", borderRadius: 16, padding: 14, fontWeight: 900 }}>
            {error}
          </section>
        ) : null}

        {diagnostics.length > 0 ? (
          <section style={{ border: "1px solid #fca5a5", background: "#fef2f2", color: "#991b1b", borderRadius: 16, padding: 16, fontWeight: 850 }}>
            <strong>Operator commercial data could not load.</strong>
            <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
              {diagnostics.map((item: any, index: number) => (
                <div key={index}>
                  HTTP {item.statusCode}: {item.error}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, color: "#7f1d1d" }}>
              Use an OPERATOR_OWNER, OPERATOR_MANAGER, or OPERATOR_STAFF account. Traveler accounts cannot load operator commercial products.
            </div>
          </section>
        ) : null}

        <section
          style={{
            border: "1px solid #0f172a",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "#ffffff",
            borderRadius: 22,
            padding: 24,
            boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
          }}
        >
          <div style={{ color: "#bae6fd", fontSize: 13, fontWeight: 900, letterSpacing: 0.8 }}>
            COMMERCIAL SPINE
          </div>
          <h2 style={{ margin: "8px 0", fontSize: 28 }}>Operator participation is governed before public exposure.</h2>
          <p style={{ margin: 0, color: "#dbeafe", maxWidth: 880, lineHeight: 1.6 }}>
            Products, pricing, capability approval, terms, and marketplace exposure are checked separately.
            This prevents random listings and protects traveler trust before services become visible.
          </p>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
          <Card title="Trail Products" value={products.length} note="SPM and partner tour products available to this operator." />
          <Card title="Priced Products" value={pricedProducts} note="Operator pricing approved or ready." />
          <Card title="Approved Capabilities" value={approvedCapabilities} note="Capabilities reviewed by admin." />
          <Card title="Pending Review" value={pendingCapabilities} note="Submitted capabilities awaiting admin action." />
        </div>

        <section
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 18,
            background: "#ffffff",
            padding: 20,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Commercial Terms</h2>
          {terms.length === 0 ? (
            <p style={{ color: "#475569", marginBottom: 0 }}>
              No active required terms are currently published. Operators cannot be treated as fully ready until required terms are active and accepted.
            </p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {terms.map((term: any) => {
                const accepted = term.acceptedByOperator || acceptedTermsIds.has(term.id);
                return (
                  <div
                    key={term.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 14,
                      padding: 14,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 14,
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>{term.title}</strong>
                      <div style={{ color: "#64748b", fontSize: 13 }}>
                        {term.termsType} · {term.version}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <Pill label={accepted ? "ACCEPTED" : "NOT ACCEPTED"} status={accepted ? "ACCEPTED" : "NOT ACCEPTED"} />
                      {!accepted ? (
                        <form action={acceptTermsAction}>
                          <input type="hidden" name="termsId" value={term.id} />
                          <button
                            type="submit"
                            style={{
                              border: "1px solid #0f172a",
                              background: "#0f172a",
                              color: "#ffffff",
                              borderRadius: 12,
                              padding: "10px 12px",
                              fontWeight: 950,
                              cursor: "pointer",
                            }}
                          >
                            Accept Terms
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2>Trail Products</h2>
          <div style={{ display: "grid", gap: 28 }}>
            {products.length === 0 ? (
              <div style={{ color: "#475569" }}>No trail products available.</div>
            ) : (
              products.map((product: TrailProduct, index: number) => (
                <ProductRow key={product.packageId} product={product} index={index} />
              ))
            )}
          </div>
        </section>
      </div>
    </OperatorShell>
  );
}
