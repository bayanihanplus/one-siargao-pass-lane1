import Link from "next/link";
import styles from "./controlTower.module.css";

const doctrineCards = [
  {
    label: "Ownership Rule",
    value: "Central truth",
    text: "Pricing belongs to Control Tower governance, not isolated tour, stay, operator, or payment pages.",
  },
  {
    label: "Snapshot Rule",
    value: "Booking-locked",
    text: "Every completed booking must preserve pricing truth as a snapshot. Old bookings must not be reinterpreted later.",
  },
  {
    label: "Exposure Rule",
    value: "No hidden drift",
    text: "Public SRP, operator base, platform margin, traveler fees, OTA fees, FX, and payouts must remain explainable.",
  },
];

const pricingLanes = [
  {
    title: "Fee Matrix",
    status: "Gate home",
    body: "Govern traveler fees, OTA fees, platform share logic, category-specific fee rules, and later sponsored/featured placement rules.",
  },
  {
    title: "Tour Pricing Rules",
    status: "Gate home",
    body: "Separate public SRP, operator base, platform margin, traveler fees, OTA fees, discounts, inclusions, and payout expectation.",
  },
  {
    title: "Accommodation Pricing Rules",
    status: "Gate home",
    body: "Control rooms/units pricing, request-to-confirm logic, package-linked stay pricing, OTA-sourced stays, and payout rules.",
  },
  {
    title: "Commissions & Margin",
    status: "Gate home",
    body: "Govern inclusive commission, margin absorption, operator payout, platform share, and financial visibility boundaries.",
  },
  {
    title: "Discounts & Adjustments",
    status: "Gate home",
    body: "Control discount rules, commercial adjustments, manual overrides, refund impact, and approved exception handling.",
  },
  {
    title: "Currency / FX",
    status: "Gate home",
    body: "Keep FX and currency display booking-linked and snapshot-aware. FX must not silently change old booking economics.",
  },
];

const formulas = [
  {
    label: "Traveler Total",
    code: "traveler_total_amount = base_supply_amount + traveler_fee_matrix_amount + currency_fx_amount + payment_processing_amount",
  },
  {
    label: "Platform Share",
    code: "platform_share_amount = traveler_fee_matrix_amount + ota_fee_matrix_amount + currency_fx_amount",
  },
  {
    label: "Operator Payout",
    code: "operator_payout_amount = base_supply_amount",
  },
  {
    label: "Processing Rule",
    code: "payment_processing_amount = traveler-carried pass-through; excluded from platform share and operator payout",
  },
];

const risks = [
  {
    title: "Margin leakage",
    text: "If pricing logic lives inside feature pages, traveler totals, payouts, and platform margins will drift.",
  },
  {
    title: "Operator dispute",
    text: "Operators need clear base rate and payout logic. Vague pricing creates low-trust complaints.",
  },
  {
    title: "Traveler trust damage",
    text: "Final prices must be explainable. Hidden fee surprises will damage conversion and credibility.",
  },
  {
    title: "Old booking reinterpretation",
    text: "Completed bookings must use snapshots. Never recompute old bookings from current fee rules.",
  },
];

export function ControlTowerPricingPage() {
  return (
    <section className={styles.content}>
      <div className={styles.pricingDeck}>
        <div className={styles.pricingHero}>
          <div className={styles.pricingHeroInner}>
            <div>
              <div className={styles.pricingKicker}>
                <span className={styles.nuclearPulse} />
                ADMIN-CT-08 / Pricing Governance
              </div>

              <h2 className={styles.pricingTitle}>
                Pricing & Margin Governance
              </h2>

              <p className={styles.pricingLead}>
                The central command surface for fee matrix logic, public SRP,
                operator base rates, platform margin, traveler fees, OTA fees,
                payment processing, FX, discounts, payout rules, refunds, and
                commercial snapshots.
              </p>
            </div>

            <div className={styles.pricingDoctrineWall}>
              {doctrineCards.map((card) => (
                <article key={card.label} className={styles.pricingDoctrineCard}>
                  <p className={styles.pricingDoctrineLabel}>{card.label}</p>
                  <h3 className={styles.pricingDoctrineValue}>{card.value}</h3>
                  <p className={styles.pricingDoctrineText}>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.pricingOpsGrid}>
          <section className={styles.pricingPanel}>
            <div className={styles.pricingPanelHead}>
              <p className={styles.pricingEyebrow}>Money Logic Control</p>
              <h3 className={styles.pricingPanelTitle}>
                Pricing must be governed centrally, then referenced by modules
              </h3>
              <p className={styles.pricingPanelText}>
                Tours, accommodations, rentals, payments, operators, OTAs, and
                marketplace exposure can reference pricing rules. They must not
                become independent pricing authorities.
              </p>
            </div>

            <div className={styles.pricingLaneGrid}>
              {pricingLanes.map((lane) => (
                <article key={lane.title} className={styles.pricingLaneCard}>
                  <div className={styles.pricingLaneTop}>
                    <h4 className={styles.pricingLaneTitle}>{lane.title}</h4>
                    <span className={styles.pricingLaneStatus}>{lane.status}</span>
                  </div>
                  <p className={styles.pricingLaneText}>{lane.body}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className={styles.pricingPanel}>
            <div className={styles.pricingPanelHead}>
              <p className={styles.pricingEyebrow}>Canonical Commercial Formulas</p>
              <h3 className={styles.pricingPanelTitle}>
                These fields must not drift
              </h3>
              <p className={styles.pricingPanelText}>
                Formula display is control-state only. It confirms doctrine, not
                live fee-matrix execution.
              </p>
            </div>

            <div className={styles.pricingFormulaGrid}>
              {formulas.map((formula) => (
                <article key={formula.label} className={styles.pricingFormula}>
                  <p className={styles.pricingFormulaLabel}>{formula.label}</p>
                  <p className={styles.pricingFormulaCode}>{formula.code}</p>
                </article>
              ))}
            </div>

            <div className={styles.pricingRiskStrip}>
              {risks.map((risk) => (
                <article key={risk.title} className={styles.pricingRiskItem}>
                  <span className={styles.pricingRiskDot} />
                  <div>
                    <h4 className={styles.pricingRiskTitle}>{risk.title}</h4>
                    <p className={styles.pricingRiskText}>{risk.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <section className={styles.pricingPanel}>
          <div className={styles.pricingPanelHead}>
            <p className={styles.pricingEyebrow}>Control Tower Relationships</p>
            <h3 className={styles.pricingPanelTitle}>
              Pricing connects to Explore, Accommodations, Payments, Operator Governance, and Marketplace Exposure
            </h3>
            <p className={styles.pricingPanelText}>
              Pricing Governance owns the commercial logic. Other modules may
              expose, collect, display, or settle transactions — but must not
              reinterpret money rules independently.
            </p>
          </div>

          <div className={styles.pricingLaneGrid}>
            <article className={styles.pricingLaneCard}>
              <div className={styles.pricingLaneTop}>
                <h4 className={styles.pricingLaneTitle}>Explore Siargao</h4>
                <span className={styles.pricingLaneStatus}>Public price display</span>
              </div>
              <p className={styles.pricingLaneText}>
                Explore displays pricing only after readiness and public exposure rules allow it.
              </p>
            </article>

            <article className={styles.pricingLaneCard}>
              <div className={styles.pricingLaneTop}>
                <h4 className={styles.pricingLaneTitle}>Payments, Payouts & Statements</h4>
                <span className={styles.pricingLaneStatus}>Financial execution</span>
              </div>
              <p className={styles.pricingLaneText}>
                Payment execution references pricing snapshots. It must not own pricing truth.
              </p>
            </article>

            <article className={styles.pricingLaneCard}>
              <div className={styles.pricingLaneTop}>
                <h4 className={styles.pricingLaneTitle}>Operator Governance</h4>
                <span className={styles.pricingLaneStatus}>Base rate trust</span>
              </div>
              <p className={styles.pricingLaneText}>
                Operators need clear base rate and payout logic before public offer exposure.
              </p>
            </article>

            <article className={styles.pricingLaneCard}>
              <div className={styles.pricingLaneTop}>
                <h4 className={styles.pricingLaneTitle}>Marketplace Exposure Engine</h4>
                <span className={styles.pricingLaneStatus}>Commercial eligibility</span>
              </div>
              <p className={styles.pricingLaneText}>
                Services with missing or unsafe pricing must be suppressed or marked request-to-confirm.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.pricingBoundary}>
          <h3>Build boundary: pricing governance shell only, no fee execution.</h3>
          <p>
            ADMIN-CT-08 creates the Pricing & Margin Governance control surface.
            It does not finalize recommended fees, compute live charges, alter
            database schema, modify payment logic, rewrite traveler payment pages,
            redirect routes, or create a commit.
          </p>
          <p>
            <Link href="/admin/control-tower/payments" className={styles.nuclearActionGhost}>
              Review Payments Control
            </Link>{" "}
            <Link href="/traveler/payments" className={styles.nuclearActionGhost}>
              View Traveler Payments Surface
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
}
