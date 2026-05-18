// OSP_PUBLIC_EXPLORE_PREMIUM_REBUILD_01C
// OSP_PUBLIC_EXPLORE_FINISH_COPY_01E
import Link from "next/link";
import OspPublicHeader from "../components/OspPublicHeader";

import OspPublicFooter from "../components/OspPublicFooter";
const discoveryPillars = [
  {
    eyebrow: "Official route layer",
    title: "Passport Trails™",
    body: "Curated trail families, verified stops, stamps, and continuation paths for travelers who want structure without losing island freedom.",
    href: "/passport-trails",
    cta: "View Trails",
    tone: "navy",
  },
  {
    eyebrow: "Local operator layer",
    title: "Tours & Island Routes",
    body: "Island hopping, land routes, Sugba Lagoon, Bucas Grande, surf routes, and other partner-operated experiences.",
    href: "/operators",
    cta: "View Local Partners",
    tone: "teal",
  },
  {
    eyebrow: "Stay readiness layer",
    title: "Stays & Check-in",
    body: "Accommodation discovery that prepares for verified stays, OSP Pass continuity, and future QR-connected check-in records.",
    href: "/operators",
    cta: "Explore Stay Partners",
    tone: "mist",
  },
  {
    eyebrow: "Island services layer",
    title: "Rentals, Surf, Food & Care",
    body: "Transport, gear, surf schools, food culture, wellness, beauty, health, and local support lanes organized for traveler clarity.",
    href: "/operators",
    cta: "See Service Partners",
    tone: "sand",
  },
];

const appBridge = [
  ["Public website", "Learn what OSP connects before entering app-only actions."],
  ["Traveler App", "Use saved progress, pass identity, QR, scan, bookings, and payments when ready."],
  ["Local partners", "Keep fulfillment partner-operated while OSP improves discovery, trust, and routing."],
  ["Destination layer", "Prepare for clearer visibility, smoother coordination, and better journey continuity."],
];

const routeCards = [
  {
    label: "Official Passport Trails",
    text: "Use the public Passport Trails gateway for trail families and official route education.",
    href: "/passport-trails",
  },
  {
    label: "Local Partners",
    text: "For operator, stay, rental, surf, food, wellness, and care partner discovery.",
    href: "/operators",
  },
  {
    label: "Booking Partners",
    text: "For OTA, travel agency, and distribution partner access.",
    href: "/ota",
  },
];

// OSP_PUBLIC_FOOTER_INSERT_MISSING_01K
// OSP_PUBLIC_FOOTER_RESTORE_INSIDE_MAIN_01N
export default function PublicExplorePage() {
  return (
    <main className="osp-premium-v3 osp-public-explore-page">
      <OspPublicHeader />
      

      <section className="osp-public-explore-hero" aria-labelledby="public-explore-title">
        <div className="osp-public-explore-hero-copy">
          <p className="osp-public-kicker">Explore Siargao</p>
          <h1 id="public-explore-title">Discover Siargao through trusted trails, stays, tours, and local partners.</h1>
          <p>
            This public Explore gateway helps travelers understand what One Siargao Pass connects:
            official trails, local tours, stays, rentals, surf schools, food culture, wellness,
            and partner-operated island services.
          </p>

          <div className="osp-public-explore-actions">
            <Link href="/passport-trails">Explore Passport Trails</Link>
            <Link href="/traveler/start">Get Your Pass</Link>
          </div>
        </div>

        <aside className="osp-public-explore-command-card" aria-label="Explore gateway summary">
          <span>Public Website Gateway</span>
          <h2>Explore publicly. Continue inside the pass when action is needed.</h2>
          <p>
            The website explains the island ecosystem. The Traveler App handles saved progress,
            QR identity, scans, booking continuation, and payment-linked journey records.
          </p>

          <div className="osp-public-explore-signal-grid">
            {appBridge.map(([label, text]) => (
              <article key={label}>
                <strong>{label}</strong>
                <small>{text}</small>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="osp-public-explore-section" aria-labelledby="explore-layers-title">
        <div className="osp-public-explore-heading">
          <p className="osp-public-kicker">Discovery layers</p>
          <h2 id="explore-layers-title">One public gateway for the major ways travelers experience Siargao.</h2>
          <span>
            Explore is not just a list of services. It is the public-facing map of how OSP connects
            travelers, local partners, official trails, access points, and trusted journey coordination.
          </span>
        </div>

        <div className="osp-public-explore-layer-grid">
          {discoveryPillars.map((pillar) => (
            <Link href={pillar.href} className={`osp-public-explore-layer osp-public-explore-layer-${pillar.tone}`} key={pillar.title}>
              <span>{pillar.eyebrow}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
              <strong>{pillar.cta}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="osp-public-explore-bridge" aria-labelledby="public-to-app-title">
        <div>
          <p className="osp-public-kicker">Website to app flow</p>
          <h2 id="public-to-app-title">Explore first. Continue in the app when action is needed.</h2>
        </div>

        <div className="osp-public-explore-bridge-grid">
          <article>
            <span>Public Explore</span>
            <h3>Website discovery</h3>
            <p>
              Explains the ecosystem, improves trust, and routes visitors into the right public
              or partner gateway without forcing them into app-only screens too early.
            </p>
          </article>

          <article>
            <span>Traveler Explore</span>
            <h3>Traveler App experience</h3>
            <p>
              Handles app-shell browsing, saved traveler state, booking continuation, QR-linked
              journeys, and personalized traveler actions.
            </p>
          </article>
        </div>
      </section>

      <section className="osp-public-explore-route-section" aria-labelledby="route-safely-title">
        <div className="osp-public-explore-heading">
          <p className="osp-public-kicker">Route safely</p>
          <h2 id="route-safely-title">Choose the right gateway depending on what you need next.</h2>
        </div>

        <div className="osp-public-explore-route-grid">
          {routeCards.map((card) => (
            <Link href={card.href} className="osp-public-explore-route-card" key={card.label}>
              <h3>{card.label}</h3>
              <p>{card.text}</p>
              <strong>Continue</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="osp-public-explore-cta">
        <p className="osp-public-kicker">Ready to continue?</p>
        <h2>Move from public discovery into your connected Siargao journey.</h2>
        <div>
          <Link href="/traveler/start">Get Your Pass</Link>
          <Link href="/passport-trails">View Passport Trails</Link>
        </div>
      </section>
    
      <OspPublicFooter />
</main>
  );
}
