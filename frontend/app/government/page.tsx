import { OspPublicPageShell } from "../../src/components/public/OspPublicPageShell";
import { PublicStaticBanner, PublicMediaBanner } from "../../src/components/public/PublicMediaBlocks";

export default function GovernmentPage() {
  return (
    <OspPublicPageShell
      eyebrow="LGU / DOT / Government"
      title="A governed coordination layer for Siargao."
      subtitle="One Siargao Pass gives authorized public-sector stakeholders a responsible pathway for tourism coordination, compliance visibility, and role-scoped destination operations."
      primaryCta={{
        label: "See Government Use Cases",
        href: "#government-use-cases",
      }}
      secondaryCta={{
        label: "Request Authorized Access",
        href: "#authorized-access",
      }}
    >
      <PublicStaticBanner
        eyebrow="Government Access"
        title="Public confidence requires visible separation."
        body="The public government page explains purpose and access. The operational LGU Tourism Coordination Center remains protected behind authorized access."
        variant="government"
        badge="LGU / DOT"
        points={["Public Purpose", "Access Request", "Protected Console", "Responsible Data"]}
      />

      <PublicMediaBanner
        eyebrow="Public-Sector Coordination"
        title="Public information outside. Protected coordination inside."
        body="The government page explains the public-sector value of OSP. Operational intelligence, action queues, and controls remain inside authorized access."
        variant="government"
        items={["Compliance Readiness", "Destination Coordination", "Responsible Access", "Authorized Console"]}
      />

      <section id="government-use-cases" className="osp-public-section osp-government-use-cases">
        <p className="osp-public-eyebrow">Public-sector purpose</p>
        <h2>Built for coordination, not public exposure of operational data.</h2>
        <p className="osp-public-section-lead">
          The Government page explains how OSP can support LGU and DOT coordination.
          Live dashboards, action queues, intervention controls, and operational
          intelligence remain inside protected access.
        </p>

        <div className="osp-public-card-grid three">
          <article className="osp-public-card">
            <h3>Compliance readiness</h3>
            <p>
              Support structured workflows for movement, manifests, QR readiness,
              operator participation, and regulated activity coordination.
            </p>
          </article>

          <article className="osp-public-card">
            <h3>Destination coordination</h3>
            <p>
              Help authorized stakeholders coordinate during normal operations,
              peak periods, public advisories, weather disruption, and official events.
            </p>
          </article>

          <article className="osp-public-card">
            <h3>Responsible access</h3>
            <p>
              Keep sensitive dashboards and decision controls behind login,
              role scope, and audit-aware access policies.
            </p>
          </article>
        </div>
      </section>

      <section className="osp-public-section osp-government-boundary">
        <p className="osp-public-eyebrow">Correct separation</p>
        <h2>Public website outside. Protected LGU console inside.</h2>

        <div className="osp-government-boundary-grid">
          <article>
            <h3>Public website</h3>
            <p>
              Explains OSP, public-sector value, stakeholder pathways, and responsible
              data use without exposing operational dashboards.
            </p>
          </article>

          <article>
            <h3>LGU Tourism Coordination Center</h3>
            <p>
              Provides authorized users with destination signals, coordination queues,
              date filters, municipality views, and operational summaries.
            </p>
          </article>

          <article>
            <h3>Super Admin</h3>
            <p>
              Handles platform-wide governance, system operations, API controls,
              commercial configuration, and restricted administrative oversight.
            </p>
          </article>
        </div>
      </section>

      <section id="authorized-access" className="osp-public-section osp-government-cta">
        <div>
          <p className="osp-public-eyebrow">Authorized access</p>
          <h2>Request access to the LGU Tourism Coordination Center.</h2>
          <p>
            LGU and DOT stakeholders may request authorized access to the protected
            coordination console. Operational dashboards are not public-facing.
          </p>
        </div>

        <a href="/lgu/intelligence" className="osp-public-primary-button">
          Request Authorized Access
        </a>
      </section>
    </OspPublicPageShell>
  );
}
