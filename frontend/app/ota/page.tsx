import OspPublicHeader from "../components/OspPublicHeader";
import OspPublicFooter from "../components/OspPublicFooter";

const partnerTypes = [
  {
    title: "OTA-style partners",
    copy: "For booking channels preparing Siargao-bound guests for OSP-ready travel.",
  },
  {
    title: "Travel & Tours companies",
    copy: "For agencies and coordinators packaging Siargao trips, tours, stays, and transport.",
  },
  {
    title: "Hotel and resort desks",
    copy: "For front desks helping guests continue into tours, trails, transport, and pass readiness.",
  },
  {
    title: "Tour desks",
    copy: "For teams coordinating guest requests, local activities, and island services.",
  },
  {
    title: "Booking coordinators",
    copy: "For teams managing arrivals, groups, itineraries, and assisted traveler flow.",
  },
  {
    title: "Future API partners",
    copy: "For approved partners preparing structured booking-to-pass connectivity.",
  },
];

const routingSteps = [
  "Partner submits traveler or package details",
  "OSP creates or matches the traveler",
  "OSP prepares pass and QR readiness",
  "Approved local fulfillment is routed where needed",
  "Traveler receives the right pass, voucher, entitlement, or readiness output",
];

const routeableLanes = [
  {
    title: "OSP Pass / QR Readiness",
    copy: "Prepare travelers for OSP-linked identity, trip, and access readiness.",
  },
  {
    title: "Tours & Passport Trails",
    copy: "Route guests into approved tour, trail, or request-to-confirm experiences.",
  },
  {
    title: "Stays & Accommodation Readiness",
    copy: "Connect stay records and future QR-supported check-in flows where available.",
  },
  {
    title: "Transport & Arrival Support",
    copy: "Coordinate airport, Dapa, van, private transport, or route support requests.",
  },
  {
    title: "Surf, Rentals & Island Services",
    copy: "Route traveler needs into approved service categories where available.",
  },
  {
    title: "Group & Package Coordination",
    copy: "Support assisted traveler flows, package records, and multi-service requests.",
  },
];

export default function TravelPartnersPage() {
  return (
    <main className="osp-ota-page">
      <OspPublicHeader />

      <section className="osp-ota-hero">
        <div className="osp-ota-hero-glow osp-ota-hero-glow-a" />
        <div className="osp-ota-hero-glow osp-ota-hero-glow-b" />

        <div className="osp-ota-shell osp-ota-hero-grid">
          <div className="osp-ota-hero-copy">
            <p className="osp-ota-eyebrow">Travel Partners</p>
            <h1>Route Siargao-bound travelers into OSP Pass, QR readiness, and approved local fulfillment.</h1>
            <p className="osp-ota-subtitle">
              For OTA-style partners, Travel & Tours companies, hotel desks, tour desks, and booking coordinators that already manage traveler demand and need a controlled way to connect guests to One Siargao Pass.
            </p>

            <div className="osp-ota-actions" aria-label="Travel partner actions">
              <a className="osp-ota-button osp-ota-button-primary" href="/ota/apply">
                Request Partner Access
              </a>
              <a className="osp-ota-button osp-ota-button-secondary" href="/local-partners">
                View Local Partner Network
              </a>
            </div>
          </div>

          <div className="osp-ota-hero-card" aria-label="Travel partner routing summary">
            <div className="osp-ota-card-topline">
              <span>Partner source</span>
              <span>OSP readiness</span>
            </div>
            <div className="osp-ota-route-stack">
              <div>Traveler / package source</div>
              <div>OSP Pass or traveler match</div>
              <div>OSP-issued QR readiness</div>
              <div>Approved local fulfillment</div>
            </div>
            <p>
              Travel Partners source demand. OSP supports pass, QR, trip, booking, and local service routing where required.
            </p>
          </div>
        </div>
      </section>

      <section className="osp-ota-section osp-ota-section-light">
        <div className="osp-ota-shell">
          <div className="osp-ota-section-heading">
            <p className="osp-ota-kicker">Traveler-source channels</p>
            <h2>Built for partners who already bring travelers to Siargao.</h2>
            <p>
              This entry is for source-channel partners, not local fulfillment operators. Local operators belong in the Local Partners pathway.
            </p>
          </div>

          <div className="osp-ota-card-grid">
            {partnerTypes.map((item) => (
              <article className="osp-ota-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="osp-ota-section osp-ota-flow-section">
        <div className="osp-ota-shell">
          <div className="osp-ota-section-heading osp-ota-section-heading-dark">
            <p className="osp-ota-kicker">Booking-to-pass workflow</p>
            <h2>From partner booking to OSP Pass readiness.</h2>
            <p>
              Travel Partners do not issue QR credentials. They route approved traveler or package intake into OSP, where QR/pass readiness is issued or attached by One Siargao Pass.
            </p>
          </div>

          <div className="osp-ota-flow">
            {routingSteps.map((step, index) => (
              <div className="osp-ota-flow-step" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="osp-ota-section osp-ota-source-section">
        <div className="osp-ota-shell osp-ota-split">
          <div>
            <p className="osp-ota-kicker">Source-channel protection</p>
            <h2>Your channel remains part of the traveler journey.</h2>
          </div>
          <div className="osp-ota-source-card">
            <p>
              Travel Partners is designed for source-channel coordination. When a traveler or package enters OSP through an approved partner, the partner source can remain attached to the record for coordination, settlement readiness, and future reporting.
            </p>
            <p>
              Your team can continue owning the guest relationship while OSP supports pass readiness, QR connection, and approved local service routing.
            </p>
          </div>
        </div>
      </section>

      <section className="osp-ota-section osp-ota-section-light">
        <div className="osp-ota-shell osp-ota-split osp-ota-fulfillment">
          <div>
            <p className="osp-ota-kicker">Approved local fulfillment</p>
            <h2>Approved local partners fulfill the Siargao experience.</h2>
            <p>
              Travel Partners source traveler demand. OSP supports the pass, QR, trip, and booking coordination layer. Approved local operators, accommodations, transport providers, surf schools, and service partners fulfill the actual Siargao experience where required.
            </p>
          </div>

          <div className="osp-ota-mini-grid">
            <div>Category-aware service routing</div>
            <div>Approved local partner fulfillment</div>
            <div>Request-to-confirm where needed</div>
            <div>Pass, voucher, stay, trail, or service readiness</div>
          </div>
        </div>
      </section>

      <section className="osp-ota-section">
        <div className="osp-ota-shell">
          <div className="osp-ota-section-heading osp-ota-section-heading-dark">
            <p className="osp-ota-kicker">Partner routing lanes</p>
            <h2>What your channel can route into OSP.</h2>
          </div>

          <div className="osp-ota-card-grid osp-ota-dark-grid">
            {routeableLanes.map((item) => (
              <article className="osp-ota-card osp-ota-dark-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="osp-ota-section osp-ota-readiness-section">
        <div className="osp-ota-shell osp-ota-readiness">
          <div>
            <p className="osp-ota-kicker">Controlled QR and API readiness</p>
            <h2>Reviewed access first. QR/pass provisioning through OSP.</h2>
          </div>
          <p>
            QR/pass provisioning and API-based booking intake are enabled only through reviewed partner onboarding where available. OSP remains the issuer of traveler QR credentials and pass-linked records.
          </p>
          <p>
            Developer and API access will be provided through controlled partner onboarding for approved use cases, system-ready workflows, and qualified partners.
          </p>
        </div>
      </section>

      <section className="osp-ota-final-cta">
        <div className="osp-ota-shell osp-ota-final-card">
          <p className="osp-ota-kicker">Partner access</p>
          <h2>Prepare your travel channel for OSP-ready Siargao arrivals.</h2>
          <p>
            Request reviewed partner access for booking-to-pass workflows, traveler QR readiness, and approved local fulfillment where services are required.
          </p>
          <div className="osp-ota-actions osp-ota-actions-center">
            <a className="osp-ota-button osp-ota-button-primary" href="/ota/apply">
              Request Partner Access
            </a>
            <a className="osp-ota-button osp-ota-button-secondary osp-ota-button-light" href="/local-partners">
              View Local Partner Network
            </a>
          </div>
        </div>
      </section>

      <OspPublicFooter />
    </main>
  );
}
