import { OspPublicPageShell, PublicSection } from "../../src/components/public/OspPublicPageShell";

export default function OtaTermsPage() {
  return (
    <OspPublicPageShell
      eyebrow="OTA Terms"
      title="OTA and booking partners are provisioning channels, not QR authorities."
      subtitle="Approved OTA and booking partners may connect booking records into OSP workflows, but OSP remains the pass and QR lifecycle authority."
    >
      <PublicSection
        title="OTA boundary"
        body="OTA partners may not issue sovereign QR credentials, override OSP readiness logic, or bypass compliance controls. All partner actions must remain scoped, audited, and governed."
      />
    </OspPublicPageShell>
  );
}
