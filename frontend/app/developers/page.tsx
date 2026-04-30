import {
  OspPublicPageShell,
  PublicButton,
  PublicCardGrid,
  PublicSection,
} from "../../src/components/public/OspPublicPageShell";

const apiCards = [
  {
    title: "Partner Account",
    body: "Every integration starts with an approved partner account. Public requests are reviewed before sandbox or production access is activated.",
  },
  {
    title: "Booking-to-Pass Intake",
    body: "Approved partners may connect confirmed booking references into OSP-managed traveler pass and QR workflows.",
  },
  {
    title: "Audit-Ready Events",
    body: "Partner actions are designed to be logged for governance, troubleshooting, and compliance review.",
  },
];

const endpointRows = [
  {
    method: "POST",
    path: "/api/v1/partners/apply",
    description: "Public partner access request intake. Creates a pending-review partner application and audit record.",
    status: "Live intake",
  },
  {
    method: "GET",
    path: "/api/v1/partners/applications/:id/status",
    description: "Partner application status lookup for submitted requests.",
    status: "Available",
  },
  {
    method: "POST",
    path: "/api/v1/partners/admin/api-tokens",
    description: "Token issuance route remains intentionally blocked until approval, guard policy, and token scope controls are complete.",
    status: "Blocked by design",
  },
  {
    method: "POST",
    path: "/api/v1/ota/trips/intake",
    description: "Future approved-partner booking-to-pass intake endpoint for external booking references.",
    status: "Planned",
  },
];

export default function DevelopersPage() {
  return (
    <OspPublicPageShell
      eyebrow="Developers"
      title="Build with the One Siargao Pass API."
      subtitle="Approved partners can connect booking references, traveler records, pass status, QR readiness, and governed webhook workflows into OSP through reviewed partner access."
      primaryCta={{ label: "Request API Access", href: "/ota#partner-request" }}
      secondaryCta={{ label: "Read API Terms", href: "/api-terms" }}
    >
      <PublicSection
        title="The API is for approved partner integrations."
        body="OSP APIs are not open anonymous endpoints. They are governed access paths for reviewed partners who need to connect booking records, traveler context, pass readiness, and QR-backed workflows."
      >
        <div className="osp-dev-overview-grid">
          <div>
            <PublicCardGrid cards={apiCards} />

            <div className="osp-dev-api-panel" style={{ marginTop: "24px" }}>
              <h3>Approved partner flow</h3>
              <p>
                The integration journey starts with review, then moves into scoped access. OSP remains the pass and QR lifecycle authority throughout the flow.
              </p>
              <ul className="osp-dev-flow-list">
                <li>
                  <span className="osp-dev-flow-number">1</span>
                  <span>
                    <span className="osp-dev-flow-title">Submit partner request</span>
                    <span className="osp-dev-flow-body">Provide organization details, partner type, contact email, and integration use case.</span>
                  </span>
                </li>
                <li>
                  <span className="osp-dev-flow-number">2</span>
                  <span>
                    <span className="osp-dev-flow-title">OSP reviews access</span>
                    <span className="osp-dev-flow-body">Partner type, booking model, operational fit, and compliance boundaries are reviewed.</span>
                  </span>
                </li>
                <li>
                  <span className="osp-dev-flow-number">3</span>
                  <span>
                    <span className="osp-dev-flow-title">Scoped API access</span>
                    <span className="osp-dev-flow-body">Approved partners may proceed to sandbox or production access only after token policy is active.</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <aside className="osp-dev-boundary-card">
            <h3>OSP remains the QR authority.</h3>
            <p>
              API partners do not issue independent QR credentials. Partners connect booking context into OSP-managed pass and QR workflows.
            </p>
            <ul className="osp-dev-boundary-list">
              <li>No public token generation.</li>
              <li>No independent QR issuance by partners.</li>
              <li>No bypass of OSP pass readiness.</li>
              <li>No manifest override through partner API.</li>
              <li>Partner actions must remain auditable.</li>
            </ul>
            <div style={{ marginTop: "20px" }}>
              <PublicButton label="Request Review" href="/ota#partner-request" variant="light" />
            </div>
          </aside>
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="API Surface"
        title="Current and planned partner API surfaces."
        body="These routes communicate the integration direction without exposing fake token UI or unapproved production access."
      >
        <div className="osp-dev-endpoint-table">
          {endpointRows.map((row) => (
            <div className="osp-dev-endpoint-row" key={`${row.method}-${row.path}`}>
              <div>
                <span className="osp-dev-method">{row.method}</span>
              </div>
              <div>
                <div className="osp-dev-path">{row.path}</div>
                <div className="osp-dev-description">{row.description}</div>
              </div>
              <div>
                <span className="osp-dev-status">{row.status}</span>
              </div>
            </div>
          ))}
        </div>
      </PublicSection>
    </OspPublicPageShell>
  );
}
