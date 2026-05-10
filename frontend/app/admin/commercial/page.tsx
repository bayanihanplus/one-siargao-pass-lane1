import { revalidatePath } from "next/cache";
import Link from "next/link";
import { getApiBaseUrl, requireAccessToken } from "../../../src/lib/server-auth";

type Capability = {
  id: string;
  operatorUserId?: string | null;
  approvalStatus?: string | null;
  marketplaceEnabled?: boolean | null;
  title?: string | null;
  description?: string | null;
  inclusions?: string | null;
  exclusions?: string | null;
  minPax?: number | null;
  maxPax?: number | null;
  dailyCapacity?: number | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  updatedAt?: string | null;
};

type PricingReview = {
  pricingRuleId: string;
  operatorUserId?: string | null;
  pricingMode?: string | null;
  currencyCode?: string | null;
  basePrice?: string | null;
  priceRangeMin?: string | null;
  priceRangeMax?: string | null;
  packageFlatRate?: string | null;
  requestToConfirmRequired?: boolean | null;
  instantCheckoutAllowed?: boolean | null;
  approvalStatus?: string | null;
  updatedAt?: string | null;
  package?: {
    packageCode?: string | null;
    packageName?: string | null;
    publicLabel?: string | null;
    approvalStatus?: string | null;
    distributionEnabled?: boolean | null;
    bookabilityStatus?: string | null;
  } | null;
};

type CommercialTerms = {
  id: string;
  termsType?: string | null;
  version?: string | null;
  title?: string | null;
  approvalStatus?: string | null;
  isActive?: boolean | null;
  effectiveAt?: string | null;
};

type Exposure = {
  id: string;
  trailPackageId?: string | null;
  operatorUserId?: string | null;
  category?: string | null;
  exposureStatus?: string | null;
  isVisible?: boolean | null;
  readinessScore?: number | null;
  finalExposureScore?: number | null;
  placementTier?: string | null;
  updatedAt?: string | null;
};

type SectionKey = "overview" | "capabilities" | "pricing" | "terms" | "exposure";

async function apiGet(path: string, token: string, fallback: any) {
  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
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
        error: json?.message || json?.error || `HTTP ${res.status}`,
        statusCode: res.status,
      };
    }

    return json ?? fallback;
  } catch (error) {
    return {
      ...fallback,
      ok: false,
      error: error instanceof Error ? error.message : "Unknown API error",
      statusCode: 0,
    };
  }
}

async function apiPatch(path: string, body: any) {
  "use server";

  const token = await requireAccessToken();

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body || {}),
    cache: "no-store",
  });

  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message || json?.error || `Admin action failed: HTTP ${res.status}`);
  }

  revalidatePath("/admin/commercial");
}

async function approveCapabilityAction(formData: FormData) {
  "use server";

  const capabilityId = String(formData.get("capabilityId") || "");
  if (!capabilityId) throw new Error("Missing capabilityId");

  await apiPatch(`/spm/admin/operator-capabilities/${capabilityId}/approve`, {
    marketplaceEnabled: true,
  });
}

async function suspendCapabilityAction(formData: FormData) {
  "use server";

  const capabilityId = String(formData.get("capabilityId") || "");
  if (!capabilityId) throw new Error("Missing capabilityId");

  await apiPatch(`/spm/admin/operator-capabilities/${capabilityId}/suspend`, {
    reason: "Suspended from Admin Commercial Governance page.",
  });
}

async function approvePricingAction(formData: FormData) {
  "use server";

  const pricingRuleId = String(formData.get("pricingRuleId") || "");
  if (!pricingRuleId) throw new Error("Missing pricingRuleId");

  await apiPatch(`/spm/admin/pricing/review/${pricingRuleId}`, {
    approvalStatus: "APPROVED",
  });
}

async function rejectPricingAction(formData: FormData) {
  "use server";

  const pricingRuleId = String(formData.get("pricingRuleId") || "");
  if (!pricingRuleId) throw new Error("Missing pricingRuleId");

  await apiPatch(`/spm/admin/pricing/review/${pricingRuleId}`, {
    approvalStatus: "REJECTED",
  });
}

async function recalculateExposureAction(formData: FormData) {
  "use server";

  const exposureId = String(formData.get("exposureId") || "");
  if (!exposureId) throw new Error("Missing exposureId");

  await apiPatch(`/spm/admin/marketplace-exposures/${exposureId}/recalculate`, {});
}

async function suppressExposureAction(formData: FormData) {
  "use server";

  const exposureId = String(formData.get("exposureId") || "");
  if (!exposureId) throw new Error("Missing exposureId");

  await apiPatch(`/spm/admin/marketplace-exposures/${exposureId}/suppress`, {
    reason: "Suppressed from Admin Commercial Governance page.",
  });
}

function statusTone(status?: string | null) {
  const value = String(status || "").toUpperCase();

  if (["APPROVED", "VISIBLE", "ELIGIBLE", "ACCEPTED"].includes(value)) {
    return { bg: "#ecfdf5", border: "#86efac", color: "#166534" };
  }

  if (["PENDING_REVIEW", "DRAFT", "NOT_READY"].includes(value)) {
    return { bg: "#fff7ed", border: "#fdba74", color: "#9a3412" };
  }

  if (["REJECTED", "SUSPENDED", "SUPPRESSED"].includes(value)) {
    return { bg: "#fef2f2", border: "#fca5a5", color: "#991b1b" };
  }

  return { bg: "#f8fafc", border: "#cbd5e1", color: "#334155" };
}

function Pill({ label, status }: { label: string; status?: string | null }) {
  const tone = statusTone(status || label);

  return (
    <span
      style={{
        display: "inline-block",
        padding: "7px 10px",
        borderRadius: 999,
        border: `1px solid ${tone.border}`,
        background: tone.bg,
        color: tone.color,
        fontSize: 12,
        fontWeight: 950,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function ActionButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "danger" | "secondary";
}) {
  const styles =
    variant === "danger"
      ? { background: "#991b1b", border: "#991b1b", color: "#ffffff" }
      : variant === "secondary"
        ? { background: "#ffffff", border: "#0f172a", color: "#0f172a" }
        : { background: "#0f172a", border: "#0f172a", color: "#ffffff" };

  return (
    <button
      type="submit"
      style={{
        border: `1px solid ${styles.border}`,
        background: styles.background,
        color: styles.color,
        borderRadius: 12,
        padding: "10px 13px",
        fontWeight: 950,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function StatCard({ title, value, note }: { title: string; value: string | number; note: string }) {
  return (
    <section
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        padding: 16,
        background: "#ffffff",
        boxShadow: "0 10px 28px rgba(15,23,42,0.05)",
      }}
    >
      <div style={{ color: "#475569", fontSize: 12, fontWeight: 950, textTransform: "uppercase" }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 30, fontWeight: 950, color: "#0f172a" }}>{value}</div>
      <div style={{ marginTop: 4, color: "#64748b", fontSize: 13 }}>{note}</div>
    </section>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        border: "1px solid #cbd5e1",
        borderRadius: 20,
        padding: 18,
        background: "#ffffff",
        boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
      }}
    >
      <h2 style={{ margin: 0, fontSize: 24 }}>{title}</h2>
      <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.55 }}>{subtitle}</p>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px dashed #cbd5e1",
        borderRadius: 16,
        padding: 18,
        background: "#f8fafc",
        fontWeight: 750,
      }}
    >
      {children}
    </div>
  );
}

function CapabilityQueue({ capabilities }: { capabilities: Capability[] }) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <SectionHeader
        title="Operator Capability Review"
        subtitle="Approve the operator’s ability to fulfill a product. This does not publish the product to Siargao Explore."
      />

      {capabilities.length === 0 ? (
        <EmptyState>No operator capability records yet.</EmptyState>
      ) : (
        capabilities.map((item) => {
          const isApproved = item.approvalStatus === "APPROVED";
          const isSuspended = item.approvalStatus === "SUSPENDED";

          return (
            <article key={item.id} style={{ border: "1px solid #e2e8f0", borderRadius: 18, padding: 18, background: "#ffffff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ margin: "0 0 6px" }}>{item.title || "Untitled capability"}</h3>
                  <div style={{ fontSize: 13 }}>
                    Operator: {item.operatorUserId || "—"} · Capacity: {item.dailyCapacity ?? "—"} / day · Pax: {item.minPax ?? "—"}–{item.maxPax ?? "—"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Pill label={item.approvalStatus || "UNKNOWN"} status={item.approvalStatus} />
                  <Pill label={item.marketplaceEnabled ? "MARKETPLACE REQUESTED" : "MARKETPLACE OFF"} status={item.marketplaceEnabled ? "PENDING_REVIEW" : "NOT_READY"} />
                </div>
              </div>

              {item.description ? <p style={{ margin: "12px 0", lineHeight: 1.5 }}>{item.description}</p> : null}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                {!isApproved && !isSuspended ? (
                  <form action={approveCapabilityAction}>
                    <input type="hidden" name="capabilityId" value={item.id} />
                    <ActionButton>Approve Capability</ActionButton>
                  </form>
                ) : null}

                {!isSuspended ? (
                  <form action={suspendCapabilityAction}>
                    <input type="hidden" name="capabilityId" value={item.id} />
                    <ActionButton variant="danger">Suspend</ActionButton>
                  </form>
                ) : null}
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}

function PricingQueue({ pricing }: { pricing: PricingReview[] }) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <SectionHeader
        title="Pricing Review"
        subtitle="Approve pricing only after the commercial structure is usable. Pricing approval still does not create public exposure."
      />

      {pricing.length === 0 ? (
        <EmptyState>No pricing records in review.</EmptyState>
      ) : (
        pricing.map((item) => {
          const isApproved = item.approvalStatus === "APPROVED";
          const isRejected = item.approvalStatus === "REJECTED";

          return (
            <article key={item.pricingRuleId} style={{ border: "1px solid #e2e8f0", borderRadius: 18, padding: 18, background: "#ffffff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ margin: "0 0 6px" }}>{item.package?.packageName || "Unknown package"}</h3>
                  <div style={{ fontSize: 13 }}>
                    {item.package?.packageCode || "—"} · {item.pricingMode || "—"} · {item.currencyCode || "PHP"} {item.basePrice || item.packageFlatRate || "Request"}
                  </div>
                </div>
                <Pill label={item.approvalStatus || "UNKNOWN"} status={item.approvalStatus} />
              </div>

              <div style={{ marginTop: 10, fontSize: 13 }}>
                Request-to-confirm: {item.requestToConfirmRequired ? "Yes" : "No"} · Instant checkout: {item.instantCheckoutAllowed ? "Yes" : "No"} · Package distribution: {item.package?.distributionEnabled ? "Enabled" : "Disabled"}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                {!isApproved && !isRejected ? (
                  <form action={approvePricingAction}>
                    <input type="hidden" name="pricingRuleId" value={item.pricingRuleId} />
                    <ActionButton>Approve Pricing</ActionButton>
                  </form>
                ) : null}

                {!isRejected ? (
                  <form action={rejectPricingAction}>
                    <input type="hidden" name="pricingRuleId" value={item.pricingRuleId} />
                    <ActionButton variant="danger">Reject Pricing</ActionButton>
                  </form>
                ) : null}
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}

function TermsQueue({ terms }: { terms: CommercialTerms[] }) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <SectionHeader
        title="Commercial Terms"
        subtitle="Terms must be created and accepted before operator readiness can become complete."
      />

      {terms.length === 0 ? (
        <EmptyState>No commercial terms published yet. Next lane should add terms creation and operator acceptance workflow.</EmptyState>
      ) : (
        terms.map((item) => (
          <article key={item.id} style={{ border: "1px solid #e2e8f0", borderRadius: 18, padding: 18, background: "#ffffff", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <strong>{item.title || "Untitled terms"}</strong>
              <div style={{ fontSize: 13 }}>
                {item.termsType || "GENERAL"} · {item.version || "v1"} · Active: {item.isActive ? "Yes" : "No"}
              </div>
            </div>
            <Pill label={item.approvalStatus || "UNKNOWN"} status={item.approvalStatus} />
          </article>
        ))
      )}
    </div>
  );
}

function ExposureQueue({ exposures }: { exposures: Exposure[] }) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <SectionHeader
        title="Marketplace Exposure"
        subtitle="This is the final gate before Siargao Explore. Empty means nothing can be publicly exposed yet."
      />

      {exposures.length === 0 ? (
        <EmptyState>No marketplace exposure records yet. Approved capability and pricing are not enough; exposure creation is the next backend lane.</EmptyState>
      ) : (
        exposures.map((item) => (
          <article key={item.id} style={{ border: "1px solid #e2e8f0", borderRadius: 18, padding: 18, background: "#ffffff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <strong>{item.operatorUserId || "Unknown operator"}</strong>
                <div style={{ fontSize: 13 }}>
                  Category: {item.category || "—"} · Score: {item.finalExposureScore ?? item.readinessScore ?? "—"} · Tier: {item.placementTier || "—"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Pill label={item.exposureStatus || "UNKNOWN"} status={item.exposureStatus} />
                <Pill label={item.isVisible ? "VISIBLE" : "NOT PUBLIC"} status={item.isVisible ? "VISIBLE" : "NOT_READY"} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <form action={recalculateExposureAction}>
                <input type="hidden" name="exposureId" value={item.id} />
                <ActionButton variant="secondary">Recalculate</ActionButton>
              </form>

              <form action={suppressExposureAction}>
                <input type="hidden" name="exposureId" value={item.id} />
                <ActionButton variant="danger">Suppress</ActionButton>
              </form>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

function Overview({
  capabilities,
  pricing,
  terms,
  exposures,
}: {
  capabilities: Capability[];
  pricing: PricingReview[];
  terms: CommercialTerms[];
  exposures: Exposure[];
}) {
  const pendingCapabilities = capabilities.filter((item) => item.approvalStatus === "PENDING_REVIEW").length;
  const approvedCapabilities = capabilities.filter((item) => item.approvalStatus === "APPROVED").length;
  const draftPricing = pricing.filter((item) => item.approvalStatus === "DRAFT").length;
  const approvedPricing = pricing.filter((item) => item.approvalStatus === "APPROVED").length;
  const visibleExposures = exposures.filter((item) => item.isVisible === true).length;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14 }}>
        <StatCard title="Capabilities" value={capabilities.length} note={`${pendingCapabilities} pending · ${approvedCapabilities} approved`} />
        <StatCard title="Pricing Reviews" value={pricing.length} note={`${draftPricing} draft · ${approvedPricing} approved`} />
        <StatCard title="Commercial Terms" value={terms.length} note="Required before terms readiness" />
        <StatCard title="Marketplace Exposure" value={exposures.length} note={`${visibleExposures} visible`} />
      </div>

      <section
        style={{
          border: "1px solid #fdba74",
          background: "#fff7ed",
          borderRadius: 18,
          padding: 16,
          fontWeight: 850,
          lineHeight: 1.5,
        }}
      >
        Governance lock: approving capability or pricing does not automatically publish to Siargao Explore.
        Marketplace exposure still requires an exposure record and visibility controls.
      </section>

      <SectionHeader
        title="Governance sequence"
        subtitle="Operator Commercial → Admin Capability Review → Admin Pricing Review → Terms Acceptance → Marketplace Exposure → Traveler Explore."
      />
    </div>
  );
}

function SidebarLink({
  section,
  active,
  label,
  count,
}: {
  section: SectionKey;
  active: SectionKey;
  label: string;
  count?: number;
}) {
  const isActive = section === active;

  return (
    <Link
      href={`/admin/commercial?section=${section}`}
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        textDecoration: "none",
        color: isActive ? "#ffffff" : "#334155",
        background: isActive ? "#0f172a" : "#ffffff",
        border: `1px solid ${isActive ? "#0f172a" : "#e2e8f0"}`,
        borderRadius: 14,
        padding: "12px 13px",
        fontWeight: 950,
        fontSize: 14,
      }}
    >
      <span>{label}</span>
      {typeof count === "number" ? <span>{count}</span> : null}
    </Link>
  );
}

export default async function AdminCommercialPage({
  searchParams,
}: {
  searchParams?: { section?: string };
}) {
  const token = await requireAccessToken();
  const rawSection = String(searchParams?.section || "overview");
  const activeSection: SectionKey = ["overview", "capabilities", "pricing", "terms", "exposure"].includes(rawSection)
    ? (rawSection as SectionKey)
    : "overview";

  const [capabilitiesJson, pricingJson, termsJson, exposuresJson] = await Promise.all([
    apiGet("/spm/admin/operator-capabilities", token, { ok: false, data: [] }),
    apiGet("/spm/admin/pricing/review", token, { ok: false, data: [] }),
    apiGet("/spm/admin/commercial-terms", token, { ok: false, data: [] }),
    apiGet("/spm/admin/marketplace-exposures", token, { ok: false, data: [] }),
  ]);

  const capabilities: Capability[] = Array.isArray(capabilitiesJson?.data) ? capabilitiesJson.data : [];
  const pricing: PricingReview[] = Array.isArray(pricingJson?.data) ? pricingJson.data : [];
  const terms: CommercialTerms[] = Array.isArray(termsJson?.data) ? termsJson.data : [];
  const exposures: Exposure[] = Array.isArray(exposuresJson?.data) ? exposuresJson.data : [];
  const diagnostics = [capabilitiesJson, pricingJson, termsJson, exposuresJson].filter((item) => item?.ok === false && item?.error);

  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ display: "grid", gridTemplateColumns: "290px 1fr", minHeight: "100vh" }}>
        <aside
          style={{
            borderRight: "1px solid #e2e8f0",
            background: "#ffffff",
            padding: 20,
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <div style={{ color: "#0369a1", fontSize: 12, fontWeight: 950, letterSpacing: 0.9, textTransform: "uppercase" }}>ADMIN CONSOLE</div>
          <h1 style={{ margin: "7px 0 6px", fontSize: 24, lineHeight: 1.1, color: "#0f172a", fontWeight: 950 }}>Commercial Governance</h1>
          <p style={{ margin: "0 0 18px", fontSize: 13, lineHeight: 1.45 }}>
            Review readiness before products reach Siargao Explore.
          </p>
          <div style={{ marginTop: 14 }}>
            <a
              href="/admin/commercial/tour-architecture"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 38,
                borderRadius: 999,
                background: "#F3AE26",
                color: "#013863",
                WebkitTextFillColor: "#013863",
                padding: "0 15px",
                fontSize: 13,
                fontWeight: 950,
                textDecoration: "none",
                boxShadow: "0 10px 22px rgba(243,174,38,0.20)",
              }}
            >
              Open Tour Commercial Architecture
            </a>
          </div>

          <nav style={{ display: "grid", gap: 9 }}>
            <SidebarLink section="overview" active={activeSection} label="Overview" />
            <SidebarLink section="capabilities" active={activeSection} label="Capabilities" count={capabilities.length} />
            <SidebarLink section="pricing" active={activeSection} label="Pricing" count={pricing.length} />
            <SidebarLink section="terms" active={activeSection} label="Terms" count={terms.length} />
            <SidebarLink section="exposure" active={activeSection} label="Marketplace Exposure" count={exposures.length} />
          </nav>

          <div
            style={{
              marginTop: 18,
              border: "1px solid #fdba74",
              borderRadius: 16,
              background: "#fff7ed",
              padding: 13,
              fontSize: 12,
              fontWeight: 850,
              lineHeight: 1.45,
            }}
          >
            Explore exposure is never automatic. Final visibility must pass marketplace governance.
          </div>
        </aside>

        <section style={{ padding: 24, overflow: "auto", maxHeight: "100vh" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18 }}>
            <section
              style={{
                border: "1px solid #0f172a",
                background: "linear-gradient(135deg, #020617 0%, #0f172a 55%, #075985 100%)",
                borderRadius: 24,
                padding: 24,
                boxShadow: "0 18px 42px rgba(15,23,42,0.18)",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 950, letterSpacing: 0.8 }}>
                ADMIN COMMERCIAL GOVERNANCE
              </div>
              <h2 style={{ margin: "8px 0", fontSize: 30, color: "#ffffff", fontWeight: 950, letterSpacing: -0.4 }}>Approve readiness before Explore exposure.</h2>
              <p style={{ margin: 0, maxWidth: 880, color: "#e0f2fe", lineHeight: 1.6 }}>
                Operators can submit capability and pricing, but traveler visibility requires governed admin review,
                commercial terms readiness, and marketplace exposure controls.
              </p>
            </section>

            {diagnostics.length ? (
              <section
                style={{
                  border: "1px solid #fca5a5",
                  background: "#fef2f2",
                  color: "#991b1b",
                  borderRadius: 16,
                  padding: 16,
                  fontWeight: 850,
                }}
              >
                <strong>Some admin governance data failed to load.</strong>
                <div style={{ marginTop: 8, display: "grid", gap: 5 }}>
                  {diagnostics.map((item: any, index: number) => (
                    <div key={index}>HTTP {item.statusCode}: {item.error}</div>
                  ))}
                </div>
              </section>
            ) : null}

            {activeSection === "overview" ? (
              <Overview capabilities={capabilities} pricing={pricing} terms={terms} exposures={exposures} />
            ) : null}

            {activeSection === "capabilities" ? <CapabilityQueue capabilities={capabilities} /> : null}
            {activeSection === "pricing" ? <PricingQueue pricing={pricing} /> : null}
            {activeSection === "terms" ? <TermsQueue terms={terms} /> : null}
            {activeSection === "exposure" ? <ExposureQueue exposures={exposures} /> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
