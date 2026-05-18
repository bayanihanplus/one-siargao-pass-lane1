import Link from "next/link";
import OspPublicHeader from "../components/OspPublicHeader";
import OspPublicFooter from "../components/OspPublicFooter";

const partnerLanes = [
  {
    eyebrow: "Tours & experiences",
    title: "Tours, routes, and local experiences",
    body: "For island hopping, land routes, culture experiences, private trips, curated activities, and partner-supported journeys.",
  },
  {
    eyebrow: "Stays",
    title: "Hotels, villas, homestays, and accommodations",
    body: "Prepare your stay profile, guest information, service details, and future OSP-connected check-in readiness.",
  },
  {
    eyebrow: "Surf",
    title: "Surf schools, instructors, and board services",
    body: "Make lessons, coaching, board rentals, and surf-day services easier for travelers to find and request.",
  },
  {
    eyebrow: "Rentals & transport",
    title: "Motorbikes, vans, cars, equipment, and local transport",
    body: "Present rental and transport services with clearer details, availability expectations, and traveler-ready coordination.",
  },
  {
    eyebrow: "Food & wellness",
    title: "Restaurants, cafés, wellness, care, and local shops",
    body: "Join discovery paths for food, wellness, recovery, care services, and local stops connected to the Siargao journey.",
  },
  {
    eyebrow: "Travel partners",
    title: "Travel & tours, hotel desks, agencies, and OTA partners",
    body: "Prepare services for wider partner-channel opportunities through organized travel, booking, and coordination flows.",
  },
];

const benefits = [
  {
    title: "Be easier to discover",
    body: "Help travelers and booking partners understand what you offer, where you operate, and how your service fits their Siargao trip.",
  },
  {
    title: "Prepare for bookings",
    body: "Organize service details, photos, inclusions, rates, availability expectations, and request flows before traveler demand arrives.",
  },
  {
    title: "Build traveler trust",
    body: "Present clear service information so travelers know what to expect before they inquire, book, visit, or continue their journey.",
  },
  {
    title: "Connect with partner channels",
    body: "Make your service easier to share with travel agencies, hotel desks, tour coordinators, and approved booking partners.",
  },
];

const appearanceSurfaces = [
  {
    title: "Explore Siargao",
    body: "Traveler-facing discovery for tours, stays, site access, surf, rentals, food, wellness, and care services.",
  },
  {
    title: "Passport Trails™",
    body: "Eligible services may connect to official trails, local stops, stamps, and saved journey progress.",
  },
  {
    title: "Partner Tours",
    body: "Tour and experience partners can prepare services for curated, requested, or operator-supported travel flows.",
  },
  {
    title: "Stays & check-in readiness",
    body: "Accommodation partners can prepare profiles, stay details, booking requests, and future OSP-connected guest flows.",
  },
  {
    title: "Travel partner channels",
    body: "Prepared services can be easier to coordinate with agencies, hotel desks, OTA partners, and tour operators where approved.",
  },
];

const pathway = [
  "Share your business and service details",
  "Prepare photos, rates, inclusions, and availability expectations",
  "Choose the partner lane that fits your service",
  "Connect your service to traveler and partner discovery paths",
  "Keep your operation ready as OSP booking channels expand",
];

export default function OperatorsPage() {
  return (
    <main className="osp-local-partners-page">
      <OspPublicHeader />

      <section className="osp-local-partners-hero" aria-labelledby="local-partners-title">
        <div className="osp-local-partners-hero-shell">
          <div className="osp-local-partners-hero-copy">
            <p className="osp-local-partners-eyebrow">Local Partners Gateway</p>
            <h1 id="local-partners-title">Bring your local service into Siargao’s connected travel journey.</h1>
            <p>
              One Siargao Pass helps local partners become easier to discover, prepare, and connect with travelers,
              travel agencies, hotel desks, tour coordinators, and approved booking partners.
            </p>

            <div className="osp-local-partners-actions" aria-label="Local partner actions">
              <Link href="/ota" className="osp-local-partners-primary">
                Join as a Local Partner
              </Link>
              <a href="#partner-lanes" className="osp-local-partners-secondary">
                Explore Partner Lanes
              </a>
            </div>

            <div className="osp-local-partners-trust-row" aria-label="Local partner focus areas">
              {["Visibility", "Booking readiness", "Traveler trust", "Partner-channel access", "Local participation"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <aside className="osp-local-partners-hero-panel" aria-label="Partner gateway preview">
            <div className="osp-local-partners-panel-top">
              <span>OSP Partner Gateway</span>
              <strong>Prepare once. Connect across the journey.</strong>
              <p>Partner services can be organized for discovery, booking interest, traveler support, and wider channel coordination.</p>
            </div>

            <div className="osp-local-partners-mini-grid">
              {["Tours", "Stays", "Surf", "Rentals", "Food", "Wellness", "Travel Partners", "Passport Trails™"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section id="partner-lanes" className="osp-local-partners-section osp-local-partners-lanes">
        <div className="osp-local-partners-section-heading">
          <p className="osp-local-partners-eyebrow">Who can join</p>
          <h2>Choose the lane that fits your service.</h2>
          <p>
            OSP is built for the people and businesses who host, guide, transport, teach, serve, support, and fulfill
            real Siargao experiences.
          </p>
        </div>

        <div className="osp-local-partners-card-grid">
          {partnerLanes.map((lane) => (
            <article key={lane.title} className="osp-local-partners-card">
              <p>{lane.eyebrow}</p>
              <h3>{lane.title}</h3>
              <span>{lane.body}</span>
              <Link href="/ota" className="osp-local-partners-card-cta" aria-label={`Join the ${lane.title} partner lane`}>
                <span>Join this lane</span>
                <strong aria-hidden="true">→</strong>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="osp-local-partners-section osp-local-partners-benefits">
        <div className="osp-local-partners-section-heading">
          <p className="osp-local-partners-eyebrow">How OSP helps</p>
          <h2>More visibility, clearer service readiness, and better traveler trust.</h2>
          <p>
            This is not a crowded listing board. The goal is to help local partners present services clearly and prepare
            for traveler and partner-channel demand.
          </p>
        </div>

        <div className="osp-local-partners-benefit-grid">
          {benefits.map((benefit) => (
            <article key={benefit.title}>
              <h3>{benefit.title}</h3>
              <p>{benefit.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="osp-local-partners-section osp-local-partners-pathway">
        <div className="osp-local-partners-pathway-card">
          <div>
            <p className="osp-local-partners-eyebrow">Partner readiness path</p>
            <h2>Start simple. Prepare your service step by step.</h2>
            <p>
              Local partners keep operating their own services. OSP helps structure how those services are presented,
              requested, discovered, and connected across the traveler journey.
            </p>
          </div>

          <ol>
            {pathway.map((step) => (
              <li key={step}>
                <span />
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="osp-local-partners-section osp-local-partners-surfaces">
        <div className="osp-local-partners-section-heading">
          <p className="osp-local-partners-eyebrow">Where your service can appear</p>
          <h2>Distribution surfaces, not competitor listings.</h2>
          <p>
            This page does not show live operator listings. It shows the commercial pathways where prepared services
            can become easier to discover, request, coordinate, and share.
          </p>
        </div>

        <div className="osp-local-partners-surface-grid">
          {appearanceSurfaces.map((surface) => (
            <article key={surface.title}>
              <h3>{surface.title}</h3>
              <p>{surface.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="osp-local-partners-section osp-local-partners-control">
        <div className="osp-local-partners-control-card">
          <p className="osp-local-partners-eyebrow">Your service remains yours</p>
          <h2>You remain the local operator, host, guide, instructor, driver, merchant, or service provider.</h2>
          <p>
            OSP helps organize the journey layer around your service. You continue to operate, host, guide, transport,
            teach, serve, and fulfill the real experience.
          </p>
          <Link href="/ota" className="osp-local-partners-primary">
            Start Local Partner Onboarding
          </Link>
        </div>
      </section>

      <section className="osp-local-partners-final-cta">
        <div>
          <p className="osp-local-partners-eyebrow">Start with your partner lane</p>
          <h2>Prepare your service for Siargao’s connected traveler journey.</h2>
          <p>
            Build visibility, booking readiness, traveler trust, and partner-channel access without turning your
            business into a generic listing.
          </p>
        </div>

        <Link href="/ota" className="osp-local-partners-primary">
          Join as a Local Partner
        </Link>
      </section>

      <OspPublicFooter />
    </main>
  );
}
