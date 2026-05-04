import Link from "next/link";
import styles from "./controlTower.module.css";

const doctrineCards = [
  {
    label: "Ownership Rule",
    value: "Finance control",
    text: "Traveler payment screens execute payment flow. They do not own payment operations, payout governance, or settlement truth.",
  },
  {
    label: "Mode Rule",
    value: "Sandbox vs live",
    text: "Gateway mode, failed handoffs, receipts, refunds, and exceptions must be visible to Super Admin before VPS.",
  },
  {
    label: "Data Rule",
    value: "No fake counters",
    text: "This shell shows financial operations doctrine only. Live payment metrics are not claimed until backend wiring exists.",
  },
];

const paymentLanes = [
  {
    title: "Payment Intents",
    status: "Gate home",
    body: "Govern payment-intent state, booking linkage, gateway handoff, timeout, failure, retry, and manual-review readiness.",
  },
  {
    title: "PayMongo Gateway Status",
    status: "Gate home",
    body: "Separate sandbox/live status, missing key states, gateway handoff links, QR PH readiness, and payment-provider warnings.",
  },
  {
    title: "Receipts",
    status: "Gate home",
    body: "Govern traveler receipts, acknowledgement records, payment confirmation states, and printable/email-ready receipt logic.",
  },
  {
    title: "Refunds",
    status: "Gate home",
    body: "Prepare refund review, cancellation impact, weather cancellation handling, manual exception review, and audit notes.",
  },
  {
    title: "Payout Holds",
    status: "Gate home",
    body: "Control payout holds for incomplete fulfillment, missing operator readiness, disputed transactions, or compliance exceptions.",
  },
  {
    title: "Statements & Settlements",
    status: "Gate home",
    body: "Govern operator statements, accommodation statements, OTA/partner settlements, payment failures, and finance review lanes.",
  },
];

const rules = [
  {
    code: "01",
    title: "Traveler payment page is not finance ops",
    text: "Traveler-facing payment pages should not become the control center for payment governance.",
  },
  {
    code: "02",
    title: "Booking must anchor payment",
    text: "Payments attach to bookings; payouts and statements should follow completed booking and fulfillment states.",
  },
  {
    code: "03",
    title: "Processing is pass-through",
    text: "Payment processing amount is traveler-carried pass-through and must stay separate from platform share and operator payout.",
  },
  {
    code: "04",
    title: "Failures need admin visibility",
    text: "Failed, missing-key, sandbox-only, expired, reversed, or disputed payment states need Super Admin review surfaces.",
  },
  {
    code: "05",
    title: "Payout waits for fulfillment",
    text: "Operator and accommodation payouts should not release blindly before fulfillment, completion, and exception checks.",
  },
];

const risks = [
  {
    title: "Gateway handoff confusion",
    text: "If payment handoff states are unclear, traveler trust and conversion drop immediately.",
  },
  {
    title: "Wrong payout release",
    text: "Payouts released before completed booking or exception clearance create financial risk.",
  },
  {
    title: "Settlement disputes",
    text: "Operators, accommodations, OTAs, and partners need explainable statements and role-safe visibility.",
  },
  {
    title: "Hidden payment failures",
    text: "If failed or missing-key states live only in traveler pages, Super Admin cannot operate the platform.",
  },
];

export function ControlTowerPaymentsPage() {
  return (
    <section className={styles.content}>
      <div className={styles.paymentsDeck}>
        <div className={styles.paymentsHero}>
          <div className={styles.paymentsHeroInner}>
            <div>
              <div className={styles.paymentsKicker}>
                <span className={styles.nuclearPulse} />
                ADMIN-CT-09 / Financial Operations
              </div>

              <h2 className={styles.paymentsTitle}>
                Payments, Payouts & Statements
              </h2>

              <p className={styles.paymentsLead}>
                The Super Admin financial control surface for payment intents,
                PayMongo mode, gateway handoffs, receipts, refunds, payout holds,
                operator payouts, accommodation payouts, OTA/partner settlements,
                statements, payment failures, and manual review.
              </p>
            </div>

            <div className={styles.paymentsDoctrineWall}>
              {doctrineCards.map((card) => (
                <article key={card.label} className={styles.paymentsDoctrineCard}>
                  <p className={styles.paymentsDoctrineLabel}>{card.label}</p>
                  <h3 className={styles.paymentsDoctrineValue}>{card.value}</h3>
                  <p className={styles.paymentsDoctrineText}>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.paymentsOpsGrid}>
          <section className={styles.paymentsPanel}>
            <div className={styles.paymentsPanelHead}>
              <p className={styles.paymentsEyebrow}>Financial Operations Control</p>
              <h3 className={styles.paymentsPanelTitle}>
                Payments execute on traveler pages, but governance lives here
              </h3>
              <p className={styles.paymentsPanelText}>
                This module gives payment operations a permanent home without
                rewriting traveler payment screens or pretending that live
                financial counters are already wired.
              </p>
            </div>

            <div className={styles.paymentsLaneGrid}>
              {paymentLanes.map((lane) => (
                <article key={lane.title} className={styles.paymentsLaneCard}>
                  <div className={styles.paymentsLaneTop}>
                    <h4 className={styles.paymentsLaneTitle}>{lane.title}</h4>
                    <span className={styles.paymentsLaneStatus}>{lane.status}</span>
                  </div>
                  <p className={styles.paymentsLaneText}>{lane.body}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className={styles.paymentsPanel}>
            <div className={styles.paymentsPanelHead}>
              <p className={styles.paymentsEyebrow}>Financial Rules</p>
              <h3 className={styles.paymentsPanelTitle}>
                Payment state must stay booking-linked and explainable
              </h3>
              <p className={styles.paymentsPanelText}>
                This is finance command logic only. It does not change PayMongo
                code, payout computation, database schema, or payment execution.
              </p>
            </div>

            <div className={styles.paymentsRuleGrid}>
              {rules.map((rule) => (
                <article key={rule.code} className={styles.paymentsRule}>
                  <div className={styles.paymentsRuleCode}>{rule.code}</div>
                  <div>
                    <h4 className={styles.paymentsRuleTitle}>{rule.title}</h4>
                    <p className={styles.paymentsRuleText}>{rule.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.paymentsRiskStrip}>
              {risks.map((risk) => (
                <article key={risk.title} className={styles.paymentsRiskItem}>
                  <span className={styles.paymentsRiskDot} />
                  <div>
                    <h4 className={styles.paymentsRiskTitle}>{risk.title}</h4>
                    <p className={styles.paymentsRiskText}>{risk.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <section className={styles.paymentsPanel}>
          <div className={styles.paymentsPanelHead}>
            <p className={styles.paymentsEyebrow}>Control Tower Relationships</p>
            <h3 className={styles.paymentsPanelTitle}>
              Payments connect to Pricing, Bookings, Accommodations, Operators, and QR/Compliance
            </h3>
            <p className={styles.paymentsPanelText}>
              Payment execution relies on pricing snapshots and booking state.
              Payout readiness depends on fulfillment, completion, exceptions,
              and settlement rules.
            </p>
          </div>

          <div className={styles.paymentsLaneGrid}>
            <article className={styles.paymentsLaneCard}>
              <div className={styles.paymentsLaneTop}>
                <h4 className={styles.paymentsLaneTitle}>Pricing & Margin Governance</h4>
                <span className={styles.paymentsLaneStatus}>Snapshot source</span>
              </div>
              <p className={styles.paymentsLaneText}>
                Payments reference booking pricing snapshots. Payment pages must not recompute commercial truth.
              </p>
            </article>

            <article className={styles.paymentsLaneCard}>
              <div className={styles.paymentsLaneTop}>
                <h4 className={styles.paymentsLaneTitle}>Accommodation Control</h4>
                <span className={styles.paymentsLaneStatus}>Stay settlement</span>
              </div>
              <p className={styles.paymentsLaneText}>
                Accommodation payouts and statements depend on stay readiness, fulfillment, and settlement rules.
              </p>
            </article>

            <article className={styles.paymentsLaneCard}>
              <div className={styles.paymentsLaneTop}>
                <h4 className={styles.paymentsLaneTitle}>Operator Governance</h4>
                <span className={styles.paymentsLaneStatus}>Payout identity</span>
              </div>
              <p className={styles.paymentsLaneText}>
                Operator payouts require verified operator identity, terms, and payout readiness.
              </p>
            </article>

            <article className={styles.paymentsLaneCard}>
              <div className={styles.paymentsLaneTop}>
                <h4 className={styles.paymentsLaneTitle}>QR, Compliance & Movement</h4>
                <span className={styles.paymentsLaneStatus}>Clearance dependency</span>
              </div>
              <p className={styles.paymentsLaneText}>
                Some regulated trips require payment, clearance, manifest, and QR state to remain aligned.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.paymentsBoundary}>
          <h3>Build boundary: financial operations shell only, no payment execution changes.</h3>
          <p>
            ADMIN-CT-09 creates the Payments, Payouts & Statements control
            surface. It does not modify PayMongo logic, alter database schema,
            rewrite traveler payment pages, create refunds, release payouts,
            redirect routes, or create a commit.
          </p>
          <p>
            <Link href="/admin/control-tower/pricing" className={styles.nuclearActionGhost}>
              Review Pricing Control
            </Link>{" "}
            <Link href="/traveler/payments" className={styles.nuclearActionGhost}>
              View Traveler Payments
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
}
