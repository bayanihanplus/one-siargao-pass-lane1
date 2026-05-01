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

function ReadinessDot(props: { label: string; ready?: boolean }) {
  return (
    <div
      style={{
        border: `1px solid ${props.ready ? "#86efac" : "#cbd5e1"}`,
        background: props.ready ? "#ecfdf5" : "#f8fafc",
        color: props.ready ? "#166534" : "#334155",
        padding: "9px 10px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 800,
      }}
    >
      {props.ready ? "✓" : "○"} {props.label}
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
          <button
            type="submit"
            form={`commercial-details-${p.packageCode}`}
            style={{
              border: "1px solid #0f172a",
              background: "#0f172a",
              color: "#ffffff",
              borderRadius: 12,
              padding: "11px 14px",
              fontWeight: 950,
              cursor: "pointer",
            }}
          >
            {c.id ? "Save Commercial Details" : "Activate Capability"}
          </button>

          {c.id && !isApproved && !isPending ? (
            <form action={submitReviewAction}>
              <input type="hidden" name="packageCode" value={p.packageCode} />
              <button
                type="submit"
                style={{
                  border: "1px solid #0369a1",
                  background: "#0369a1",
                  color: "#ffffff",
                  borderRadius: 12,
                  padding: "11px 14px",
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
          <button
            type="submit"
            style={{
              border: "1px solid #0f172a",
              background: "#0f172a",
              color: "#ffffff",
              borderRadius: 12,
              padding: "11px 14px",
              fontWeight: 950,
              cursor: "pointer",
            }}
          >
            {c.id ? "Save Commercial Details" : "Activate Capability"}
          </button>
        </div>
      </form>

      {c.id && !isApproved && !isPending ? (
        <form action={submitReviewAction} style={{ marginTop: 10 }}>
          <input type="hidden" name="packageCode" value={p.packageCode} />
          <button
            type="submit"
            style={{
              border: "1px solid #0369a1",
              background: "#0369a1",
              color: "#ffffff",
              borderRadius: 12,
              padding: "11px 14px",
              fontWeight: 950,
              cursor: "pointer",
            }}
          >
            Submit for Review
          </button>
        </form>
      ) : null}

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

function ProductRow(props: { product: TrailProduct }) {
  const p = props.product;
  const readiness = p.readiness || {};
  const capabilityStatus = p.operatorCapability?.approvalStatus || "NO CAPABILITY";
  const pricingStatus = p.operatorPricing?.approvalStatus || "NO PRICING";
  const exposureStatus = readiness.exposureStatus || "NOT_READY";

  return (
    <article
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        background: "#ffffff",
        padding: 20,
        boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ color: "#64748b", fontSize: 12, fontWeight: 900, letterSpacing: 0.4 }}>
            {p.publicLabel || p.productType || "Trail Product"}
          </div>
          <h2 style={{ margin: "6px 0 8px", fontSize: 22 }}>{p.packageName}</h2>
          <div style={{ color: "#475569", fontSize: 13, fontWeight: 700 }}>
            {p.packageCode} · {p.fulfillmentPartnerType || "LOCAL_OPERATOR"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "start" }}>
          <Pill label={p.approvalStatus || "UNKNOWN"} status={p.approvalStatus} />
          <Pill label={capabilityStatus} status={capabilityStatus} />
          <Pill label={pricingStatus} status={pricingStatus} />
          <Pill label={exposureStatus} status={exposureStatus} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 10,
          marginTop: 18,
        }}
      >
        <ReadinessDot label="Pricing ready" ready={readiness.pricingReady} />
        <ReadinessDot label="Capability approved" ready={readiness.capabilityReady} />
        <ReadinessDot label="Terms accepted" ready={readiness.termsAccepted} />
        <ReadinessDot label="Marketplace enabled" ready={readiness.marketplaceEnabled} />
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
          <div style={{ display: "grid", gap: 14 }}>
            {products.length === 0 ? (
              <div style={{ color: "#475569" }}>No trail products available.</div>
            ) : (
              products.map((product: TrailProduct) => (
                <ProductRow key={product.packageId} product={product} />
              ))
            )}
          </div>
        </section>
      </div>
    </OperatorShell>
  );
}
