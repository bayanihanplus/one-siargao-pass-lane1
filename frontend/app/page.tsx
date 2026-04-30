import {
  OspPublicPageShell,
  PublicButton,
  PublicCardGrid,
  PublicSection,
} from "../src/components/public/OspPublicPageShell";

export default function HomePage() {
  return (
    <OspPublicPageShell
      eyebrow="One Siargao Pass"
      title="Powering the Digital Island."
      subtitle="One Siargao Pass helps travelers, local operators, booking partners, and authorized destination stakeholders enter the correct Siargao access path — from OSP Pass and QR readiness to Passport Trails, partner participation, and protected coordination."
      primaryCta={{ label: "Create OSP Pass", href: "/traveler/start" }}
      secondaryCta={{ label: "Choose Access Path", href: "#access-paths" }}
    >
      <section id="access-paths" className="osp-public-section osp-home-routing-section">
        <p className="osp-public-eyebrow">Access Paths</p>
        <h2>Choose the right One Siargao Pass path.</h2>
        <p className="osp-public-section-lead">
          Each user type has a separate route. The public website explains the
          path. Protected app, partner, operator, and government workflows stay
          inside authorized surfaces.
        </p>

        <div className="osp-home-pathway-grid">
          <a href="/travelers" className="osp-home-pathway-card">
            <span>Traveler Path</span>
            <strong>Travelers</strong>
            <p>
              Create or continue your OSP Pass, QR readiness, trips, payments,
              Passport Map, and Passport Trails journey.
            </p>
          </a>

          <a href="/passport-trails" className="osp-home-pathway-card">
            <span>Discovery Path</span>
            <strong>Passport Trails</strong>
            <p>
              Explore Siargao Partner Tours, Passport Trails™ Curated Tours,
              verified stops, and build-your-own trail planning.
            </p>
          </a>

          <a href="/operators" className="osp-home-pathway-card">
            <span>Local Operator Path</span>
            <strong>Local Operators</strong>
            <p>
              Understand approved local participation, verified services, QR
              validation, records, and manifest-aware workflows.
            </p>
          </a>

          <a href="/ota" className="osp-home-pathway-card">
            <span>Partner Access Path</span>
            <strong>OTA / API Partners</strong>
            <p>
              Request reviewed booking-to-pass access for approved booking
              partners, agencies, hotel desks, and integration partners.
            </p>
          </a>

          <a href="/government" className="osp-home-pathway-card">
            <span>Coordination Path</span>
            <strong>LGU / DOT</strong>
            <p>
              Learn how authorized public-sector stakeholders can request
              protected coordination visibility for responsible destination
              operations.
            </p>
          </a>

          <a href="/support" className="osp-home-pathway-card">
            <span>Support Path</span>
            <strong>Support</strong>
            <p>
              Find the right help path for traveler, operator, partner, account,
              or access concerns.
            </p>
          </a>
        </div>
      </section>

      <PublicSection
        eyebrow="Public vs Protected"
        title="Public website outside. Protected systems inside."
        body="The public website explains One Siargao Pass and routes users to the correct path. OSP Pass creation, QR events, trip records, payments, operator records, API credentials, LGU coordination views, and platform controls remain inside authorized app and console surfaces."
      >
        <PublicCardGrid
          cards={[
            {
              title: "Public Website",
              body: "Explains OSP, Passport Trails, user paths, support routes, partner review, and responsible data principles.",
            },
            {
              title: "Traveler App",
              body: "Handles OSP Pass, QR readiness, trips, payments, Passport Map, Passport Trails, and mobile journey actions.",
            },
            {
              title: "Protected Consoles",
              body: "Handles operator records, partner/API access, LGU coordination, support operations, and platform administration.",
            },
          ]}
        />
      </PublicSection>

      <section className="osp-public-section osp-home-authority-band">
        <div>
          <p className="osp-public-eyebrow">Start Correctly</p>
          <h2>Start with the correct path.</h2>
          <p>
            Whether you are visiting Siargao, operating local services, connecting
            bookings, coordinating destination activity, or asking for help — One
            Siargao Pass routes you to the right surface.
          </p>
        </div>

        <div className="osp-home-authority-actions">
          <PublicButton label="Create OSP Pass" href="/traveler/start" />
          <PublicButton label="Choose Access Path" href="#access-paths" variant="light" />
        </div>
      </section>
    </OspPublicPageShell>
  );
}
