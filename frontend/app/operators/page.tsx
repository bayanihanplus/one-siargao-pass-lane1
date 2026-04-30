import { OspPublicPageShell, PublicCardGrid, PublicSection } from "../../src/components/public/OspPublicPageShell";
import { PublicMediaBanner, PublicStaticBanner } from "../../src/components/public/PublicMediaBlocks";

export default function OperatorsPage() {
  return (
    <OspPublicPageShell
      eyebrow="For Local Operators"
      title="Bring your local experiences into the One Siargao Pass ecosystem."
      subtitle="Approved operators can activate Passport-enabled services, validate guests through QR workflows, manage operational records, and improve visibility for verified experiences."
      primaryCta={{ label: "Request Operator Access", href: "/ota" }}
      secondaryCta={{ label: "Operator Login", href: "/operator" }}
    >
      <PublicStaticBanner
        eyebrow="Operator Readiness"
        title="Local operators need verified participation, not random listings."
        body="OSP presents operator participation as a governed pathway for approved services, QR validation, operational records, and manifest-aware workflows."
        variant="operator"
        badge="Operator"
        points={["Verified Services", "QR Validation", "Records", "Manifest Support"]}
      />

      <PublicMediaBanner
        eyebrow="Operator Participation"
        title="Verified local services connected to governed traveler flows."
        body="Operators can participate through approved services, QR-backed validation, service records, and manifest-aware workflows where required."
        variant="operator"
        items={["Verified Services", "QR Validation", "Operational Records", "Manifest Support"]}
      />

      <PublicSection
        title="Built for governed local participation."
        body="OSP is designed to support local operators without turning the platform into an uncontrolled listing board."
      >
        <PublicCardGrid
          cards={[
            {
              title: "Verified services",
              body: "Connect approved experiences to Passport Trails, partner tours, and OSP-enabled traveler flows.",
            },
            {
              title: "QR validation",
              body: "Validate traveler participation through governed QR-backed access and event records.",
            },
            {
              title: "Operational records",
              body: "Support manifests, scans, acknowledgements, and records where required by the service type.",
            },
          ]}
        />
      </PublicSection>
    </OspPublicPageShell>
  );
}
