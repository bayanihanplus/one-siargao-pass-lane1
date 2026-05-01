import OperatorShell from "../../../src/components/operator/OperatorShell";
import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

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

    if (!res.ok) return fallback;
    return await res.json().catch(() => fallback);
  } catch {
    return fallback;
  }
}

async function getCommercialData() {
  const token = await requireAccessToken();
  const baseUrl = getApiBaseUrl();

  const [productsJson, capabilitiesJson, termsJson] = await Promise.all([
    safeJson(`${baseUrl}/spm/operator/trail-products`, token, { ok: false, data: [] }),
    safeJson(`${baseUrl}/spm/operator/trail-capabilities`, token, { ok: false, data: [] }),
    safeJson(`${baseUrl}/spm/operator/commercial-terms/required`, token, { ok: false, data: [] }),
  ]);

  return {
    products: Array.isArray(productsJson?.data) ? productsJson.data : [],
    capabilities: Array.isArray(capabilitiesJson?.data) ? capabilitiesJson.data : [],
    terms: Array.isArray(termsJson?.data) ? termsJson.data : [],
  };
}

function statusTone(status?: string | null) {
  if (status === "APPROVED" || status === "ELIGIBLE" || status === "VISIBLE") {
    return { bg: "#ecfdf5", border: "#86efac", color: "#166534" };
  }

  if (status === "PENDING_REVIEW" || status === "NOT_READY" || status === "DRAFT") {
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
    </article>
  );
}

export default async function OperatorCommercialPage() {
  const { products, capabilities, terms } = await getCommercialData();

  const approvedCapabilities = capabilities.filter((item: any) => item.approvalStatus === "APPROVED").length;
  const pendingCapabilities = capabilities.filter((item: any) => item.approvalStatus === "PENDING_REVIEW").length;
  const pricedProducts = products.filter((item: TrailProduct) => item.readiness?.pricingReady).length;
  const termsAccepted = products.filter((item: TrailProduct) => item.readiness?.termsAccepted).length;

  return (
    <OperatorShell
      currentPath="/operator/commercial"
      title="Commercial"
      subtitle="Manage Passport Trails product readiness, operator capability status, terms acceptance, and marketplace exposure readiness."
    >
      <div style={{ display: "grid", gap: 22 }}>
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
              {terms.map((term: any) => (
                <div
                  key={term.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                  }}
                >
                  <div>
                    <strong>{term.title}</strong>
                    <div style={{ color: "#64748b", fontSize: 13 }}>
                      {term.termsType} · {term.version}
                    </div>
                  </div>
                  <Pill
                    label={term.acceptedByOperator ? "ACCEPTED" : "NOT ACCEPTED"}
                    status={term.acceptedByOperator ? "APPROVED" : "DRAFT"}
                  />
                </div>
              ))}
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
