import { OspPublicPageShell, PublicSection } from "../../src/components/public/OspPublicPageShell";

export default function PrivacyPage() {
  return (
    <OspPublicPageShell
      eyebrow="Privacy"
      title="Privacy and traveler data protection."
      subtitle="One Siargao Pass is designed around governed identity, role-scoped access, and minimum necessary data use."
    >
      <PublicSection
        title="Our privacy direction"
        body="Traveler records, QR events, partner activity, and compliance workflows must be handled with clear purpose, limited access, and audit visibility. Public website copy is not a substitute for formal legal review."
      />
    </OspPublicPageShell>
  );
}
