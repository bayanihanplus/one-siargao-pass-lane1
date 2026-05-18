import OspPublicHeader from "../components/OspPublicHeader";
import OspPublicFooter from "../components/OspPublicFooter";
const trailModes = [
  {
    eyebrow: "Partner Tour",
    title: "Siargao Partner Tour",
    body:
      "Book or request approved local partner experiences with Passport Stamps available where configured.",
    action: "Partner-supported route",
  },
  {
    eyebrow: "Curated Trail",
    title: "Passport Trails™ Curated Tour",
    body:
      "Follow curated Siargao routes connected to verified stops, local partner support, and journey progress.",
    action: "Official route logic",
  },
  {
    eyebrow: "Flexible Path",
    title: "Build Your Own Passport Trail",
    body:
      "Plan your own trail and connect selected stops with partner support where service is required.",
    action: "Traveler-planned journey",
  },
];

const supportingTrails = [
  {
    eyebrow: "Lagoon route",
    title: "Sugba Lagoon Island Hopping",
    body: "A selected route for structured access, trip continuity, and partner-supported movement.",
    href: "/traveler/passport-trails/sugba-lagoon/book",
  },
  {
    eyebrow: "Land route",
    title: "Siargao Land Tour Passport Trail",
    body: "South, north, and custom route planning with approved partner support where needed.",
    href: "/traveler/passport-trails/siargao-land-tour",
  },
  {
    eyebrow: "Continue later",
    title: "Return Traveler Continuity",
    body: "Save progress, continue your route, and keep your Siargao memories connected.",
    href: "/traveler/passport-trails/return-traveler-continuity",
  },
];

const howItWorks = [
  ["Choose a trail", "Pick a partner tour, curated route, official trail, or build-your-own path."],
  ["Book or save", "Search publicly first, then sign in when you save, book, or continue."],
  ["Scan and collect", "Use OSP for eligible stamps, access, vouchers, or route proof."],
  ["Continue later", "Keep your journey connected across this visit and future returns."],
];

// OSP_PUBLIC_FOOTER_INSERT_MISSING_01K
// OSP_PUBLIC_FOOTER_RESTORE_INSIDE_MAIN_01N
export default function PassportTrailsPublicPage() {
  return (
    <main className="osp-premium-v3 osp-passport-public-page osp-passport-public-restructure">
      <OspPublicHeader />
      

      <section className="osp-passport-hero osp-passport-hero-restructured">
        <div className="osp-passport-hero-copy">
          <p className="osp-section-kicker">Passport Trails™</p>
          <h1>Follow official trails. Build your Siargao journey.</h1>
          <p>
            Explore curated routes, approved local partner experiences, Passport Stamps,
            and saved progress connected to your One Siargao Pass.
          </p>

          <div className="osp-passport-hero-actions">
            <a href="/traveler/passport-trails" aria-label="View traveler Passport Trails in the app">View Traveler Trails</a>
            <a href="/traveler/passport-map" aria-label="Open the Siargao Passport Map">Open Passport Map</a>
          </div>
        </div>

        <aside className="osp-passport-trail-preview" aria-label="Passport Trail preview">
          <div className="osp-passport-trail-preview-card">
            <div className="osp-passport-trail-preview-topline">
              <span>Official Trail Preview</span>
              <strong>OSP-connected</strong>
            </div>

            <div className="osp-passport-route-line" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="osp-passport-trail-preview-copy">
              <h2>Trail stops, stamps, and progress in one pass.</h2>
              <p>
                Start with a route, connect with approved local partners where needed,
                and keep eligible progress saved for your journey.
              </p>
            </div>

            <div className="osp-passport-preview-chips" aria-label="Trail features">
              <span>Passport Stamps</span>
              <span>Partner Support</span>
              <span>Saved Progress</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="osp-passport-section osp-passport-modes-section osp-passport-choice-section">
        <div className="osp-passport-section-heading">
          <p>Choose your trail mode</p>
          <h2>Three ways to explore with Passport Trails.</h2>
          <span>
            Start with a local partner tour, follow a curated Passport Trail, or build a flexible
            route that fits your stay.
          </span>
        </div>

        <div className="osp-passport-choice-grid">
          {trailModes.map((mode) => (
            <article key={mode.title} className="osp-passport-choice-card">
              <div>
                <span>{mode.eyebrow}</span>
                <h3>{mode.title}</h3>
                <p>{mode.body}</p>
              </div>
              <strong>{mode.action}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="osp-passport-section osp-passport-featured-section osp-passport-editorial-section">
        <div className="osp-passport-section-heading">
          <p>Featured official trails</p>
          <h2>Start with routes built for real Siargao travel behavior.</h2>
          <span>
            Some trails are one-day routes, some continue across your stay, and some
            use approved local partners where service is required.
          </span>
        </div>

        <div className="osp-passport-editorial-grid">
          <a
            href="/traveler/passport-trails/island-hopping/book"
            className="osp-passport-main-trail-card"
          >
            <span>Governed island route</span>
            <h3>Tri-Island Passport Trail</h3>
            <p>
              Naked Island, Daku, Guyam, vouchers, online boarding readiness, and
              Passport Trail progress connected to your OSP Pass.
            </p>
            <strong>View trail</strong>
          </a>

          <div className="osp-passport-supporting-trails">
            {supportingTrails.map((trail) => (
              <a key={trail.title} href={trail.href} className="osp-passport-support-trail-card">
                <span>{trail.eyebrow}</span>
                <h3>{trail.title}</h3>
                <p>{trail.body}</p>
                <strong>View trail</strong>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="osp-passport-section osp-passport-steps-section">
        <div className="osp-passport-section-heading">
          <p>How Passport Trails work</p>
          <h2>Simple public discovery. Connected journey progress.</h2>
        </div>

        <div className="osp-passport-step-grid">
          {howItWorks.map(([title, body], index) => (
            <article key={title} className="osp-passport-step-card">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="osp-passport-local-partner-band osp-passport-local-light-panel">
        <div>
          <p>Local partner support</p>
          <h2>Trails stay local, organized, and easier to continue.</h2>
          <span>
            Local partners remain the people who operate, guide, host, transport,
            teach, and serve. OSP helps make those experiences easier to discover,
            book, validate, and continue through one trusted pass.
          </span>
        </div>
        <a href="/operators" aria-label="Join One Siargao Pass as a local partner">Join as a Local Partner</a>
      </section>

      <section className="osp-passport-final-cta">
        <p>Ready to explore with one connected pass?</p>
        <h2>Start your Passport Trails journey with One Siargao Pass.</h2>
        <div>
          <a href="/traveler/start" aria-label="Get your One Siargao Pass">Get Your Pass</a>
          <a href="/explore" aria-label="Explore Siargao services and trails">Explore Siargao</a>
        </div>
      </section>
    
      <OspPublicFooter />
</main>

  );
}
