import { OspPublicPageShell, PublicSection } from "../../src/components/public/OspPublicPageShell";

export default function TermsPage() {
  return (
    <OspPublicPageShell
      eyebrow="Terms"
      title="One Siargao Pass terms of use."
      subtitle="OSP access depends on role, service type, partner approval, and applicable operational requirements."
    >
      <PublicSection
        title="Platform use"
        body="The OSP platform supports traveler access, QR identity, verified experience discovery, partner workflows, and governed compliance records. Formal legal terms should be reviewed before public launch."
      />
    </OspPublicPageShell>
  );
}
