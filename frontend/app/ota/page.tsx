import {
  OspPublicPageShell,
  PublicButton,
  PublicCardGrid,
  PublicSection,
} from "../../src/components/public/OspPublicPageShell";
import { PublicStaticBanner } from "../../src/components/public/PublicMediaBlocks";
import OtaPartnerRequestForm from "../../src/components/public/OtaPartnerRequestForm";

export default function OtaPage() {
  return (
    <OspPublicPageShell
      eyebrow="OTA / API Partners"
      title="Connect confirmed bookings to One Siargao Pass."
      subtitle="Approved OTA, travel agency, hotel desk, and booking partners can connect traveler booking records into OSP pass and QR workflows through governed partner access."
      primaryCta={{ label: "Request Partner Access", href: "/ota#partner-request" }}
      secondaryCta={{ label: "View Developer Overview", href: "/developers" }}
    >
      <PublicStaticBanner
        eyebrow="Partner / API Access"
        title="Partner access begins with review, not token issuance."
        body="OTA, agency, hotel desk, and booking partners can request access, but API activation and production workflows remain governed."
        variant="partner"
        badge="Partner"
        points={["Request Review", "Booking Context", "Scoped Access", "Audit Trail"]}
      />

      <PublicSection
        title="Partner access is reviewed before activation."
        body="OSP partner access is governed. Booking partners may request access, but QR/pass workflows remain OSP-issued and OSP-controlled."
      >
        <div className="osp-ota-intro-grid">
          <PublicCardGrid
            cards={[
              {
                title: "Pre-arrival readiness",
                body: "Connect traveler booking references to OSP pass workflows before arrival where approved.",
              },
              {
                title: "External booking reference",
                body: "Preserve OTA or agency booking context without creating a separate identity authority.",
              },
              {
                title: "Governed QR status",
                body: "Partners can support OSP-issued pass and QR readiness through approved workflows only.",
              },
            ]}
          />

          <aside className="osp-ota-checklist-card">
            <h3>What partner access can support</h3>
            <p>
              The request process helps OSP understand your booking model before any API, sandbox, or production access is activated.
            </p>
            <ul className="osp-ota-steps">
              <li>
                <span className="osp-ota-step-number">1</span>
                <span>Submit your organization and use case.</span>
              </li>
              <li>
                <span className="osp-ota-step-number">2</span>
                <span>OSP reviews the partner type, booking flow, and operational fit.</span>
              </li>
              <li>
                <span className="osp-ota-step-number">3</span>
                <span>Approved partners can move toward sandbox/API onboarding.</span>
              </li>
            </ul>
          </aside>
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Partner Request"
        title="Request OSP partner access."
        body="Submit your organization details and intended booking or integration use case. Partner review is required before API access, sandbox workflows, token issuance, or production booking-to-pass integration."
      >
        <div id="partner-request" className="osp-ota-form-layout">
          <OtaPartnerRequestForm />

          <aside className="osp-ota-sidebar">
            <span className="osp-ota-status-pill">Review Required</span>
            <h3>No automatic API activation.</h3>
            <p>
              This form creates a partner request for review. It does not create API tokens, production credentials, or independent QR issuance rights.
            </p>
            <ul className="osp-ota-sidebar-list">
              <li>Partner account starts as pending review.</li>
              <li>Token issuance remains blocked until approved.</li>
              <li>OSP remains the pass and QR lifecycle authority.</li>
              <li>Partner activity is designed to be audited.</li>
            </ul>
            <div style={{ marginTop: "20px" }}>
              <PublicButton label="Read API Terms" href="/api-terms" variant="light" />
            </div>
          </aside>
        </div>
      </PublicSection>
    </OspPublicPageShell>
  );
}
