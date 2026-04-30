import { OspPublicPageShell, PublicCardGrid, PublicSection } from "../../src/components/public/OspPublicPageShell";

export default function DataGovernancePage() {
  return (
    <OspPublicPageShell
      eyebrow="Data Governance"
      title="Governed tourism data, not uncontrolled visibility."
      subtitle="One Siargao Pass separates traveler identity, partner workflows, compliance records, and institutional reporting through role-scoped access."
    >
      <PublicSection title="Core principles">
        <PublicCardGrid
          cards={[
            {
              title: "Role-scoped access",
              body: "Travelers, operators, partners, LGU, and admin users should only access the data needed for their role.",
            },
            {
              title: "Audit-ready events",
              body: "QR scans, partner activity, manifest workflows, and compliance actions should leave traceable records.",
            },
            {
              title: "Minimum necessary exposure",
              body: "Institutional visibility should support safety and planning without exposing unnecessary commercial or personal data.",
            },
          ]}
        />
      </PublicSection>
    </OspPublicPageShell>
  );
}
