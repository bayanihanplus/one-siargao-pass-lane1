import { OspPublicPageShell, PublicCardGrid, PublicSection } from "../../src/components/public/OspPublicPageShell";

export default function OspPassPage() {
  return (
    <OspPublicPageShell
      eyebrow="OSP Pass"
      title="Your digital access identity for Siargao."
      subtitle="The OSP Pass connects your traveler record, QR identity, trip details, and eligible island experiences. It is an identity anchor, not a shortcut around booking, payment, operator confirmation, or required compliance checks."
      primaryCta={{ label: "Create OSP Pass", href: "/traveler/start" }}
      secondaryCta={{ label: "Traveler Login", href: "/login?mode=returning" }}
    >
      <PublicSection
        title="What your OSP QR supports."
        body="Your OSP QR helps authorized parties resolve the correct traveler context for access, validation, emergency reference, and service participation where OSP is enabled."
      >
        <PublicCardGrid
          cards={[
            {
              title: "Traveler identity",
              body: "Connect your pass and trip record to one governed traveler identity inside OSP.",
            },
            {
              title: "Service validation",
              body: "Use your QR for eligible OSP-enabled activities, trails, scans, and partner flows.",
            },
            {
              title: "Governed actions",
              body: "Payments, tipping, manifest validation, and clearance remain separate controlled layers behind the identity.",
            },
          ]}
        />
      </PublicSection>
    </OspPublicPageShell>
  );
}
