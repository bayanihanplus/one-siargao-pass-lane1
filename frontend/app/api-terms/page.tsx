import { OspPublicPageShell, PublicSection } from "../../src/components/public/OspPublicPageShell";

export default function ApiTermsPage() {
  return (
    <OspPublicPageShell
      eyebrow="API Terms"
      title="API access is approved, scoped, and governed."
      subtitle="OSP APIs are for reviewed partners only. Token creation, production access, and booking-to-pass workflows require approval and audit controls."
    >
      <PublicSection
        title="Partner API boundary"
        body="Partners may connect booking records into OSP workflows only through approved access. OSP remains the authority for pass and QR lifecycle. Partners may not create independent QR identities or bypass OSP status logic."
      />
    </OspPublicPageShell>
  );
}
