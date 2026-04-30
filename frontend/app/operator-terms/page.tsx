import { OspPublicPageShell, PublicSection } from "../../src/components/public/OspPublicPageShell";

export default function OperatorTermsPage() {
  return (
    <OspPublicPageShell
      eyebrow="Operator Terms"
      title="Operator participation must remain verified and scoped."
      subtitle="Local operators participate through approved access, service eligibility, QR validation, and operational records."
    >
      <PublicSection
        title="Operator boundary"
        body="Operators manage their own approved services and scoped records. Operator access does not grant admin powers, unrelated traveler visibility, or unrestricted platform control."
      />
    </OspPublicPageShell>
  );
}
