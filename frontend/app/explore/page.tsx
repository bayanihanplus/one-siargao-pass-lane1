import Link from "next/link";
import OspPublicFooter from "../components/OspPublicFooter";
import OspPublicHeader from "../components/OspPublicHeader";

const discoveryLayers = [
  {
    eyebrow: "Official Route Layer",
    title: "Passport Trails™",
    body:
      "Curated trail families, verified stops, stamps, and continuation paths for travelers who want structure without losing island freedom.",
    href: "/passport-trails",
    cta: "View Trails",
  },
  {
    eyebrow: "Local Operator Layer",
    title: "Tours & Island Routes",
    body:
      "Island hopping, land routes, Sugba Lagoon, Bucas Grande, surf routes, and partner-operated experiences organized for clearer discovery.",
    href: "/operators",
    cta: "View Local Partners",
  },
  {
    eyebrow: "Stay Readiness Layer",
    title: "Stays & Check-in",
    body:
      "Accommodation discovery that prepares for verified stays, OSP Pass continuity, and future QR-connected check-in records.",
    href: "/operators",
    cta: "Explore Stay Partners",
  },
  {
    eyebrow: "Island Services Layer",
    title: "Rentals, Surf, Food & Care",
    body:
      "Transport, gear, surf schools, food culture, wellness, beauty, health, and local support lanes organized for traveler clarity.",
    href: "/operators",
    cta: "See Service Partners",
  },
];

const appFlow = [
  {
    eyebrow: "Public Website",
    title: "Explore before entering app-only actions",
    body:
      "The public website explains the Siargao ecosystem, builds trust, and routes visitors into the right gateway before requiring saved app state.",
  },
  {
    eyebrow: "Traveler Pass",
    title: "Continue when the journey needs identity",
    body:
      "The Traveler App handles saved progress, QR identity, scans, booking continuation, and payment-linked journey records when action is needed.",
  },
];

const gateways = [
  {
    title: "Passport Trails",
    body: "For official route education, trail families, stamps, stops, and structured island exploration.",
    href: "/passport-trails",
    cta: "Open Trails",
  },
  {
    title: "Local Partners",
    body: "For tours, stays, rentals, surf, food, wellness, health, care, and local service participation.",
    href: "/operators",
    cta: "View Partners",
  },
  {
    title: "Travel Partners",
    body: "For travel agencies, tour desks, booking partners, and distribution channels preparing Siargao access.",
    href: "/ota",
    cta: "Partner Access",
  },
];

export default function ExplorePage() {
  return (
    <main className="osp-public-discovery-page">
      <OspPublicHeader />

      <section className="osp-public-discovery-hero">
        <div className="osp-public-discovery-hero-inner">
          <div className="osp-public-discovery-copy">
            <p className="osp-public-discovery-kicker">Explore Siargao</p>
            <h1>Discover Siargao through trusted trails, stays, tours, and local partners.</h1>
            <p className="osp-public-discovery-lede">
              One Siargao Pass™ gives travelers a clearer public gateway for understanding official
              trails, local tours, stays, rentals, surf schools, food culture, wellness, and
              partner-operated island services.
            </p>

            <div className="osp-public-discovery-actions">
              <Link href="/passport-trails" className="osp-public-discovery-primary">
                Explore Passport Trails
              </Link>
              <Link href="/traveler/start" className="osp-public-discovery-secondary">
                Get Your Pass
              </Link>
            </div>
          </div>

          <aside className="osp-public-discovery-pass-card" aria-label="Public website gateway">
            <p className="osp-public-discovery-pass-pill">Public Website Gateway</p>
            <h2>Explore publicly. Continue inside the pass when action is needed.</h2>
            <p>
              The website explains the island ecosystem. The Traveler App handles saved progress,
              QR identity, scans, booking continuation, and payment-linked journey records.
            </p>

            <div className="osp-public-discovery-pass-grid">
              <div>
                <strong>Public website</strong>
                <span>Understand what OSP connects before entering app-only actions.</span>
              </div>
              <div>
                <strong>Traveler App</strong>
                <span>Use saved progress, pass identity, QR, scan, bookings, and payments when ready.</span>
              </div>
              <div>
                <strong>Local partners</strong>
                <span>Keep fulfillment partner-operated while OSP improves discovery and routing.</span>
              </div>
              <div>
                <strong>Destination layer</strong>
                <span>Prepare for clearer visibility, smoother coordination, and journey continuity.</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="osp-public-discovery-section">
        <div className="osp-public-discovery-section-head">
          <p className="osp-public-discovery-kicker">Discovery Layers</p>
          <h2>One public gateway for the major ways travelers experience Siargao.</h2>
          <p>
            Explore is not a generic list of services. It is the public-facing map of how OSP connects
            travelers, official trails, local partners, access points, and trusted journey pathways.
          </p>
        </div>

        <div className="osp-public-discovery-card-grid">
          {discoveryLayers.map((item) => (
            <article className="osp-public-discovery-card" key={item.title}>
              <p className="osp-public-discovery-card-kicker">{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <Link href={item.href}>{item.cta}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="osp-public-discovery-flow">
        <div className="osp-public-discovery-flow-copy">
          <p className="osp-public-discovery-kicker">Website to App Flow</p>
          <h2>Explore first. Continue in the app when action is needed.</h2>
        </div>

        <div className="osp-public-discovery-flow-stack">
          {appFlow.map((item) => (
            <article className="osp-public-discovery-flow-card" key={item.title}>
              <p className="osp-public-discovery-card-kicker">{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="osp-public-discovery-section">
        <div className="osp-public-discovery-section-head">
          <p className="osp-public-discovery-kicker">Choose the Right Gateway</p>
          <h2>Route visitors clearly depending on what they need next.</h2>
        </div>

        <div className="osp-public-discovery-gateway-grid">
          {gateways.map((item) => (
            <article className="osp-public-discovery-gateway-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <Link href={item.href}>{item.cta}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="osp-public-discovery-final">
        <p className="osp-public-discovery-kicker">Ready to Continue?</p>
        <h2>Move from public discovery into your connected Siargao journey.</h2>

        <div className="osp-public-discovery-actions osp-public-discovery-actions-center">
          <Link href="/traveler/start" className="osp-public-discovery-primary">
            Get Your Pass
          </Link>
          <Link href="/passport-trails" className="osp-public-discovery-secondary">
            View Passport Trails
          </Link>
        </div>
      </section>

      <OspPublicFooter />
    </main>
  );
}
