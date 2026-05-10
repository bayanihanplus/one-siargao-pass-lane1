"use client";

import { CSSProperties, ReactNode, useMemo, useState } from "react";

type SectionKey =
  | "overview"
  | "official-trails"
  | "commercial-offers"
  | "pricing-margins"
  | "diy-addons"
  | "drone-media"
  | "media-readiness"
  | "stamp-rules"
  | "approval-distribution"
  | "schema-gaps";

type NavItem = {
  key: SectionKey;
  label: string;
  eyebrow: string;
};

const navItems: NavItem[] = [
  { key: "overview", label: "Overview", eyebrow: "Control Tower" },
  { key: "official-trails", label: "Official Trails", eyebrow: "Trail Families" },
  { key: "commercial-offers", label: "Commercial Offers", eyebrow: "Sellable Products" },
  { key: "pricing-margins", label: "Pricing & Margins", eyebrow: "Commercial Truth" },
  { key: "diy-addons", label: "DIY Stops & Add-ons", eyebrow: "Custom Route Layer" },
  { key: "drone-media", label: "Drone Shots & Media Services", eyebrow: "Structured Add-ons" },
  { key: "media-readiness", label: "Media Readiness", eyebrow: "Public Display Gate" },
  { key: "stamp-rules", label: "Stamp Rules", eyebrow: "QR / Validation" },
  { key: "approval-distribution", label: "Approval & Distribution", eyebrow: "Governance" },
  { key: "schema-gaps", label: "Schema Gaps", eyebrow: "Backend Contract" },
];

const colors = {
  navy: "#013863",
  navy2: "#003B66",
  teal: "#0596A5",
  teal2: "#0097A7",
  gold: "#F3AE26",
  mist: "#EAFBFA",
  mist2: "#F4FCFA",
  slate: "#50668B",
  border: "#D8F0F1",
  white: "#FFFFFF",
  danger: "#9B1C1C",
  dangerBg: "#FFF7F7",
  warning: "#8A5A00",
  warningBg: "#FFF8E7",
};

const s: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(5,150,165,0.18), transparent 34%), linear-gradient(135deg, #EAFBFA 0%, #FFFFFF 50%, #F4FCFA 100%)",
    color: colors.navy,
    padding: "28px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  shell: {
    width: "100%",
    maxWidth: "1500px",
    margin: "0 auto",
  },
  hero: {
    background:
      "linear-gradient(135deg, #013863 0%, #003B66 52%, #0596A5 100%)",
    color: colors.white,
    borderRadius: "32px",
    padding: "34px",
    boxShadow: "0 30px 90px rgba(1,56,99,0.24)",
    border: "1px solid rgba(255,255,255,0.18)",
    overflow: "hidden",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 280px",
    gap: "28px",
    alignItems: "end",
  },
  kicker: {
    color: colors.gold,
    fontSize: "12px",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.28em",
    margin: 0,
  },
  h1: {
    margin: "14px 0 0",
    fontSize: "clamp(34px, 5vw, 58px)",
    lineHeight: 1.02,
    letterSpacing: "-0.045em",
    fontWeight: 950,
  },
  heroText: {
    maxWidth: "880px",
    margin: "18px 0 0",
    color: "rgba(255,255,255,0.82)",
    fontSize: "16px",
    lineHeight: 1.75,
  },
  activeCard: {
    borderRadius: "24px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    padding: "18px",
  },
  activeLabel: {
    color: "rgba(255,255,255,0.62)",
    fontSize: "11px",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    margin: 0,
  },
  activeTitle: {
    margin: "8px 0 0",
    color: colors.white,
    fontSize: "24px",
    fontWeight: 950,
  },
  activeSub: {
    margin: "4px 0 0",
    color: colors.gold,
    fontSize: "14px",
    fontWeight: 800,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "340px minmax(0, 1fr)",
    gap: "24px",
    marginTop: "24px",
    alignItems: "start",
  },
  sidebar: {
    position: "sticky",
    top: "24px",
    borderRadius: "30px",
    background: colors.white,
    border: `1px solid ${colors.border}`,
    padding: "16px",
    boxShadow: "0 24px 70px rgba(1,56,99,0.10)",
  },
  sideIntro: {
    borderRadius: "22px",
    background: colors.mist2,
    border: `1px solid ${colors.border}`,
    padding: "16px",
    marginBottom: "14px",
  },
  sideIntroTitle: {
    color: colors.teal,
    fontSize: "11px",
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: "0.20em",
    margin: 0,
  },
  sideIntroText: {
    margin: "8px 0 0",
    color: colors.slate,
    fontSize: "14px",
    lineHeight: 1.6,
  },
  nav: {
    display: "grid",
    gap: "9px",
  },
  navButton: {
    width: "100%",
    borderRadius: "18px",
    border: `1px solid ${colors.border}`,
    background: colors.white,
    color: colors.navy,
    textAlign: "left",
    padding: "13px 15px",
    cursor: "pointer",
    transition: "all 160ms ease",
  },
  navButtonActive: {
    background: colors.navy,
    color: colors.white,
    border: `1px solid ${colors.navy}`,
    boxShadow: "0 14px 28px rgba(1,56,99,0.22)",
  },
  navEyebrow: {
    display: "block",
    fontSize: "10px",
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: colors.teal,
    marginBottom: "4px",
  },
  navEyebrowActive: {
    color: colors.gold,
  },
  navLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: 950,
  },
  panel: {
    borderRadius: "32px",
    background: colors.white,
    border: `1px solid ${colors.border}`,
    padding: "30px",
    boxShadow: "0 24px 80px rgba(1,56,99,0.10)",
    minHeight: "620px",
  },
  panelKicker: {
    color: colors.teal,
    fontSize: "12px",
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: "0.22em",
    margin: 0,
  },
  panelTitle: {
    margin: "9px 0 24px",
    color: colors.navy,
    fontSize: "clamp(28px, 4vw, 40px)",
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
    fontWeight: 950,
  },
  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "14px",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },
  card: {
    borderRadius: "24px",
    border: `1px solid ${colors.border}`,
    background: colors.mist2,
    padding: "20px",
  },
  whiteCard: {
    borderRadius: "24px",
    border: `1px solid ${colors.border}`,
    background: colors.white,
    padding: "20px",
    boxShadow: "0 12px 30px rgba(1,56,99,0.06)",
  },
  cardLabel: {
    color: colors.slate,
    fontSize: "11px",
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    margin: 0,
  },
  cardValue: {
    margin: "12px 0 0",
    color: colors.navy,
    fontSize: "22px",
    lineHeight: 1.1,
    fontWeight: 950,
  },
  cardText: {
    margin: "9px 0 0",
    color: colors.slate,
    fontSize: "14px",
    lineHeight: 1.65,
  },
  warningBox: {
    borderRadius: "24px",
    border: "1px solid #F7DFA3",
    background: colors.warningBg,
    padding: "20px",
  },
  dangerBox: {
    borderRadius: "24px",
    border: "1px solid #F0D7D7",
    background: colors.dangerBg,
    padding: "20px",
  },
  darkBox: {
    borderRadius: "24px",
    background: colors.navy,
    color: colors.white,
    padding: "22px",
  },
  sectionGap: {
    marginTop: "20px",
  },
  pillWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "18px",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "999px",
    border: "1px solid #BFE9EA",
    background: colors.white,
    color: colors.navy,
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: 850,
    boxShadow: "0 8px 18px rgba(1,56,99,0.05)",
  },
  ruleRow: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    borderRadius: "20px",
    border: `1px solid ${colors.border}`,
    background: colors.mist2,
    padding: "16px",
  },
  number: {
    width: "34px",
    height: "34px",
    borderRadius: "999px",
    background: colors.navy,
    color: colors.white,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: 950,
    flexShrink: 0,
  },
  mono: {
    borderRadius: "18px",
    border: `1px solid ${colors.border}`,
    background: colors.white,
    color: colors.navy,
    padding: "15px",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: "13px",
    fontWeight: 800,
  },
};

const statusCards = [
  {
    label: "Commercial Console Mode",
    value: "Control Tower",
    note: "Click-based right-panel rendering. No long-scroll anchor navigation.",
  },
  {
    label: "Public Exposure Rule",
    value: "Blocked Until Ready",
    note: "No package should go live without pricing, media, approval, and distribution gates.",
  },
  {
    label: "Pricing Doctrine",
    value: "SRP + Hidden Base",
    note: "Traveler sees public SRP. Admin governs operator base rate and OSP/SPM margin.",
  },
  {
    label: "Operator Doctrine",
    value: "Approved Partner Fulfillment",
    note: "Products are operated by approved local partners, not positioned as SPM-operated tours.",
  },
];

const blockerCards = [
  "Commission-inclusive SRP fields are not fully clean in schema yet.",
  "Drone shots must be modeled as structured media/add-on service, not buried in inclusion text.",
  "Some trail package rows are draft or not distribution-ready, causing expected 404s.",
  "Private tour discount logic can double-discount if tier prices are already final SRP.",
];

const actionLanes = [
  {
    title: "Commercial Product Registry",
    body: "Structure Siargao Partner Tours, Passport Trails™ Curated Tours, and DIY request products as governed commercial inventory.",
  },
  {
    title: "Pricing Governance",
    body: "Separate public SRP, hidden operator base, platform margin, discount behavior, and payout logic before public exposure.",
  },
  {
    title: "Readiness Gate",
    body: "Require approved media, inclusions, pickup policy, price/request mode, capability approval, and distribution toggle.",
  },
  {
    title: "Trail Mapping",
    body: "Attach commercial tour offers to official trail families without turning every package into a new official trail.",
  },
];

function merge(...styles: Array<CSSProperties | false | undefined>): CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean));
}

function PanelShell({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker: string;
  children: ReactNode;
}) {
  return (
    <section style={s.panel}>
      <p style={s.panelKicker}>{kicker}</p>
      <h2 style={s.panelTitle}>{title}</h2>
      {children}
    </section>
  );
}

function OverviewPanel() {
  return (
    <PanelShell title="Admin Commercial Control Tower" kicker="Premium overview">
      <div style={s.warningBox}>
        <p style={{ ...s.cardLabel, color: colors.warning }}>Old shell rejected</p>
        <p style={{ ...s.cardText, color: "#6B4A0A" }}>
          This console must not behave like the old generic compliance document shell. Navigation must
          switch the right-side control panel. It must not jump, scroll, or bury content at the bottom.
        </p>
      </div>

      <div style={{ ...s.grid4, ...s.sectionGap }}>
        {statusCards.map((card) => (
          <div key={card.label} style={s.card}>
            <p style={s.cardLabel}>{card.label}</p>
            <p style={s.cardValue}>{card.value}</p>
            <p style={s.cardText}>{card.note}</p>
          </div>
        ))}
      </div>

      <div style={{ ...s.grid2, marginTop: "22px" }}>
        <div style={s.dangerBox}>
          <p style={{ ...s.cardLabel, color: colors.danger }}>Current blockers</p>
          <div style={{ display: "grid", gap: "10px", marginTop: "14px" }}>
            {blockerCards.map((item) => (
              <div key={item} style={{ ...s.whiteCard, padding: "14px", color: "#5F2730" }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={s.darkBox}>
          <p style={{ ...s.cardLabel, color: colors.gold }}>Immediate action lanes</p>
          <div style={{ ...s.grid2, marginTop: "14px" }}>
            {actionLanes.map((lane) => (
              <div
                key={lane.title}
                style={{
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.10)",
                  padding: "16px",
                }}
              >
                <p style={{ margin: 0, fontWeight: 950 }}>{lane.title}</p>
                <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>
                  {lane.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

function OfficialTrailsPanel() {
  const trails = [
    "Island Hopping",
    "Surf Explorer",
    "North Siargao",
    "Inland Discovery",
    "Culture & Community",
    "Sunset & Scenic Stops",
    "Adventure",
    "Return Traveler Continuity",
  ];

  return (
    <PanelShell title="Official Trails" kicker="Destination product families">
      <div style={s.card}>
        <p style={s.cardText}>
          Official trails are destination journey products. Commercial tour packages attach to these
          trails as fulfillment offers. Do not create a new official trail for every operator package.
        </p>
      </div>
      <div style={{ ...s.grid4, ...s.sectionGap }}>
        {trails.map((trail) => (
          <div key={trail} style={s.whiteCard}>
            <p style={{ margin: 0, color: colors.navy, fontWeight: 950 }}>{trail}</p>
            <p style={{ ...s.cardLabel, color: colors.teal, marginTop: "10px" }}>Official family</p>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

function CommercialOffersPanel() {
  const offers = [
    ["Joiner Tours", "Fixed per-head or tiered public SRP with controlled group discounts."],
    ["Private Tours", "Pax-tiered per-head products with discount mode protection."],
    ["Premium Private", "Higher-value pax-tiered packages with richer inclusions and media expectations."],
    ["VVIP Package", "Flat package rate, not per-head pricing unless max pax rules are later added."],
  ];

  return (
    <PanelShell title="Commercial Offers" kicker="Sellable tour inventory">
      <div style={s.grid2}>
        {offers.map(([title, body]) => (
          <div key={title} style={s.card}>
            <p style={s.cardValue}>{title}</p>
            <p style={s.cardText}>{body}</p>
          </div>
        ))}
      </div>
      <div style={{ ...s.warningBox, marginTop: "20px" }}>
        <p style={{ margin: 0, color: colors.warning, fontWeight: 950 }}>Hard rule</p>
        <p style={{ ...s.cardText, color: "#6B4A0A" }}>
          Use approved traveler-facing categories: Siargao Partner Tour, Passport Trails™ Curated Tour,
          and Build Your Own Passport Trail. Do not use Classic Tour, SPM-operated tour, or OTA-led tour.
        </p>
      </div>
    </PanelShell>
  );
}

function PricingMarginsPanel() {
  return (
    <PanelShell title="Pricing & Margins" kicker="Commercial truth layer">
      <div style={s.grid3}>
        {[
          ["Public SRP", "Traveler-facing price. Clean, simple, and psychologically safe."],
          ["Operator Base Rate", "Hidden internal payout basis. Not shown to travelers."],
          ["OSP/SPM Margin", "Commission-inclusive platform margin controlled by Admin."],
        ].map(([title, body]) => (
          <div key={title} style={s.whiteCard}>
            <p style={s.cardValue}>{title}</p>
            <p style={s.cardText}>{body}</p>
          </div>
        ))}
      </div>
      <div style={{ ...s.darkBox, marginTop: "20px" }}>
        <p style={{ margin: 0, color: colors.gold, fontWeight: 950 }}>Validation requirement</p>
        <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.84)", lineHeight: 1.65 }}>
          Block publishing if operator base rate is greater than or equal to public SRP, margin is zero
          or negative, pricing mode is missing, discount behavior is ambiguous, or pricing approval is pending.
        </p>
      </div>
    </PanelShell>
  );
}

function DiyAddonsPanel() {
  return (
    <PanelShell title="DIY Stops & Add-ons" kicker="Custom route governance">
      <div style={s.card}>
        <p style={s.cardText}>
          DIY is a governed planning layer. It can trigger booking-required nodes, operator support,
          transport support, guide support, restaurant reservations, and eligible stamp events. It must
          not fake official trail completion.
        </p>
      </div>
      <div style={s.pillWrap}>
        {[
          "Guide support",
          "Transport pickup",
          "Restaurant reservation",
          "Party boat",
          "Premium food",
          "Photo support",
          "Airport pickup",
          "Seaport pickup",
        ].map((item) => (
          <span key={item} style={s.pill}>
            {item}
          </span>
        ))}
      </div>
    </PanelShell>
  );
}

function DroneMediaPanel() {
  return (
    <PanelShell title="Drone Shots & Media Services" kicker="Structured media add-ons">
      <div style={s.grid2}>
        <div style={s.whiteCard}>
          <p style={s.cardValue}>Drone shots are not paragraph copy</p>
          <p style={s.cardText}>
            Drone shots must be modeled as structured inclusion, add-on, or media service depending
            on the package. Some products include it; others need optional or conditional treatment.
          </p>
        </div>
        <div style={s.warningBox}>
          <p style={{ margin: 0, color: colors.warning, fontWeight: 950, fontSize: "20px" }}>
            Commercial risk
          </p>
          <p style={{ ...s.cardText, color: "#6B4A0A" }}>
            If media services are not structured, traveler expectations become unclear and operators
            may be forced into inclusions they did not price.
          </p>
        </div>
      </div>
    </PanelShell>
  );
}

function MediaReadinessPanel() {
  return (
    <PanelShell title="Media Readiness" kicker="Public display gate">
      <div style={s.grid3}>
        {[
          ["Media Uploaded", "Operator/admin media exists for the product."],
          ["Admin Approved", "Media approval status is approved."],
          ["Public Display Enabled", "Only approved public media can render in Explore/SPM."],
        ].map(([title, body]) => (
          <div key={title} style={s.card}>
            <p style={{ margin: 0, color: colors.navy, fontWeight: 950 }}>{title}</p>
            <p style={s.cardText}>{body}</p>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

function StampRulesPanel() {
  return (
    <PanelShell title="Stamp Rules" kicker="QR validation and anti-bypass">
      <div style={s.darkBox}>
        <p style={{ margin: 0, color: colors.gold, fontSize: "20px", fontWeight: 950 }}>
          Passport Stamps are engagement outputs
        </p>
        <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.84)", lineHeight: 1.65 }}>
          QR events are the stronger compliance rail. Where QR validation exists, stamp outcome must
          connect to governed QR, booking, operator, guide, partner, or manifest validation.
        </p>
      </div>
      <div style={{ ...s.grid2, marginTop: "20px" }}>
        {[
          "Booking-linked validation",
          "Operator confirmation",
          "Guide confirmation",
          "Approved partner check-in",
          "Manifest-linked participation",
          "QR scan tied to activity",
        ].map((item) => (
          <div key={item} style={{ ...s.whiteCard, fontWeight: 950 }}>
            {item}
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

function ApprovalDistributionPanel() {
  return (
    <PanelShell title="Approval & Distribution" kicker="Governance gates">
      <div style={{ display: "grid", gap: "12px" }}>
        {[
          "Product/package approval is separate from operator capability approval.",
          "Pricing approval is separate from public distribution.",
          "Media approval is required before public rendering.",
          "Commercial terms acceptance is required for operator-specific exposure.",
          "Distribution enabled does not override readiness, compliance, or media gates.",
        ].map((rule, index) => (
          <div key={rule} style={s.ruleRow}>
            <div style={s.number}>{index + 1}</div>
            <p style={{ margin: 0, color: colors.slate, lineHeight: 1.6 }}>{rule}</p>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

function SchemaGapsPanel() {
  return (
    <PanelShell title="Schema Gaps" kicker="Known backend contract gaps">
      <div style={{ display: "grid", gap: "10px" }}>
        {[
          "SpmPricingRule.operatorBaseRate",
          "SpmPricingRule.publicSrp",
          "SpmPricingRule.commissionInclusive",
          "SpmPaxTierPrice.publicPricePerHead",
          "SpmPaxTierPrice.operatorBasePerHead",
          "SpmPaxTierPrice.platformMarginPerHead",
          "SpmDiscountRule.marginAbsorptionMode",
        ].map((field) => (
          <div key={field} style={s.mono}>
            {field}
          </div>
        ))}
      </div>
      <div style={{ ...s.dangerBox, marginTop: "20px" }}>
        <p style={{ margin: 0, color: colors.danger, fontWeight: 950 }}>No schema patch in this lane</p>
        <p style={{ ...s.cardText, color: "#5F2730" }}>
          This page may expose schema gaps, but TOUR-COMMERCIAL-03.5 is frontend-only unless build
          fails. Backend/schema changes belong in a separate controlled lane.
        </p>
      </div>
    </PanelShell>
  );
}

export default function AdminCommercialTourArchitecturePage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");

  const activeNav = useMemo(
    () => navItems.find((item) => item.key === activeSection) ?? navItems[0],
    [activeSection],
  );

  const renderedPanel = useMemo(() => {
    switch (activeSection) {
      case "overview":
        return <OverviewPanel />;
      case "official-trails":
        return <OfficialTrailsPanel />;
      case "commercial-offers":
        return <CommercialOffersPanel />;
      case "pricing-margins":
        return <PricingMarginsPanel />;
      case "diy-addons":
        return <DiyAddonsPanel />;
      case "drone-media":
        return <DroneMediaPanel />;
      case "media-readiness":
        return <MediaReadinessPanel />;
      case "stamp-rules":
        return <StampRulesPanel />;
      case "approval-distribution":
        return <ApprovalDistributionPanel />;
      case "schema-gaps":
        return <SchemaGapsPanel />;
      default:
        return <OverviewPanel />;
    }
  }, [activeSection]);

  return (
    <main style={s.page}>
      <style>{`
        @media (max-width: 1100px) {
          .osp-commercial-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .osp-commercial-layout {
            grid-template-columns: 1fr !important;
          }
          .osp-commercial-sidebar {
            position: relative !important;
            top: auto !important;
          }
        }

        @media (max-width: 900px) {
          .osp-grid-4,
          .osp-grid-3,
          .osp-grid-2 {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .osp-page {
            padding: 14px !important;
          }
          .osp-hero,
          .osp-panel {
            border-radius: 24px !important;
            padding: 22px !important;
          }
        }
      `}</style>

      <div style={s.shell}>
        <header className="osp-hero" style={s.hero}>
          <div className="osp-commercial-hero-grid" style={s.heroGrid}>
            <div>
              <p style={s.kicker}>Admin Commercial Console</p>
              <h1 style={s.h1}>Tour Architecture Control Tower</h1>
              <p style={s.heroText}>
                Govern official trail families, commercial tour offers, pricing readiness, media gates,
                stamp rules, approval states, and schema gaps from a click-based side navigation console.
              </p>
            </div>

            <div style={s.activeCard}>
              <p style={s.activeLabel}>Active Panel</p>
              <p style={s.activeTitle}>{activeNav.label}</p>
              <p style={s.activeSub}>{activeNav.eyebrow}</p>
            </div>
          </div>
        </header>

        <div className="osp-commercial-layout" style={s.layout}>
          <aside className="osp-commercial-sidebar" style={s.sidebar}>
            <div style={s.sideIntro}>
              <p style={s.sideIntroTitle}>Side Navigation</p>
              <p style={s.sideIntroText}>
                Buttons switch the right panel. No anchor links. No scroll-to-bottom UX.
              </p>
            </div>

            <nav style={s.nav} aria-label="Admin Commercial Console sections">
              {navItems.map((item) => {
                const isActive = item.key === activeSection;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveSection(item.key)}
                    style={merge(s.navButton, isActive && s.navButtonActive)}
                  >
                    <span style={merge(s.navEyebrow, isActive && s.navEyebrowActive)}>
                      {item.eyebrow}
                    </span>
                    <span style={s.navLabel}>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="osp-panel" style={{ minWidth: 0 }}>
            {renderedPanel}
          </div>
        </div>
      </div>
    </main>
  );
}
