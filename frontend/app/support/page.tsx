import { OspPublicPageShell, PublicCardGrid, PublicSection } from "../../src/components/public/OspPublicPageShell";
import { PublicStaticBanner, PublicMediaBanner } from "../../src/components/public/PublicMediaBlocks";

export default function SupportPage() {
  return (
    <OspPublicPageShell
      eyebrow="Support"
      title="Need help with One Siargao Pass?"
      subtitle="Get help with traveler passes, QR access, Passport Trails, operator onboarding, partner access, and account support."
      primaryCta={{ label: "Traveler Login", href: "/login?mode=returning" }}
      secondaryCta={{ label: "Create OSP Pass", href: "/traveler/start" }}
    >
      <PublicStaticBanner
        eyebrow="Support Routing"
        title="Support should route the user to the right help path."
        body="The support page separates traveler, operator, partner, and account help so public users are not pushed into the wrong workflow."
        variant="support"
        badge="Support"
        points={["Traveler Help", "Operator Help", "Partner Help", "Account Help"]}
      />

      <PublicMediaBanner
        eyebrow="Support Pathways"
        title="Help routes should match the user, not mix workflows."
        body="Travelers, operators, partners, and government stakeholders each need a clear support path without exposing internal admin tooling."
        variant="support"
        items={["Traveler Help", "Operator Help", "Partner Help", "Account Support"]}
      />

      <PublicSection
        title="Choose the right support path."
        body="OSP support should guide each user type to the correct surface instead of mixing traveler, operator, partner, and LGU workflows."
      >
        <PublicCardGrid
          cards={[
            {
              title: "Travelers",
              body: "Help with pass creation, QR access, Passport Map, Passport Trails, and trip records.",
            },
            {
              title: "Operators",
              body: "Help with operator access, scans, service participation, manifests, and records.",
            },
            {
              title: "Partners",
              body: "Help with partner review, approved access, integration planning, and API documentation.",
            },
          ]}
        />
      </PublicSection>
    </OspPublicPageShell>
  );
}
