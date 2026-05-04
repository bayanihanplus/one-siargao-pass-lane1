import Link from "next/link";
import styles from "./controlTower.module.css";

const doctrineCards = [
  {
    label: "Localization Rule",
    value: "Source-grounded",
    text: "Localization can assist conversion, but official safety, payment, QR, and compliance copy must come from approved source truth.",
  },
  {
    label: "Currency Rule",
    value: "Display vs settlement",
    text: "Currency display, FX, booking snapshots, payment processing, traveler totals, and settlement logic must not drift.",
  },
  {
    label: "AI Rule",
    value: "No uncontrolled translation",
    text: "AI translation can assist drafts, but official traveler-facing instructions need approval before production exposure.",
  },
];

const controlLanes = [
  {
    title: "Language Preferences",
    status: "Gate home",
    body: "Govern traveler language preferences, app copy readiness, default fallback language, and language-specific traveler guidance.",
  },
  {
    title: "Official Translation Approval",
    status: "Gate home",
    body: "Prepare approval workflow for safety notes, QR instructions, payment instructions, refund language, and compliance copy.",
  },
  {
    title: "Currency Display",
    status: "Gate home",
    body: "Govern currency display rules, traveler-facing price labels, FX clarity, and separation from actual settlement/payout logic.",
  },
  {
    title: "FX Readiness",
    status: "Gate home",
    body: "Prepare FX display and booking-snapshot rules without changing fee computation or payment backend behavior in this shell lane.",
  },
  {
    title: "Localized Safety Notes",
    status: "Gate home",
    body: "Control official safety, emergency, weather, trip-risk, and LGU/DOT-sensitive messages in approved language variants.",
  },
  {
    title: "Localized Payment / QR Copy",
    status: "Gate home",
    body: "Govern traveler instructions for QR identity, scan actions, payment handoffs, receipts, and pass-readiness states.",
  },
];

const rules = [
  {
    code: "01",
    title: "Official copy needs approval",
    text: "Safety, emergency, payment, QR, compliance, and refund language should not be published from raw AI translation.",
  },
  {
    code: "02",
    title: "Currency display is not settlement",
    text: "Displaying another currency is not the same as changing payout currency, FX computation, or payment settlement logic.",
  },
  {
    code: "03",
    title: "Booking snapshots must stay stable",
    text: "Currency and FX display must respect booking-time snapshots and must not reinterpret old bookings later.",
  },
  {
    code: "04",
    title: "Fallback language must be clear",
    text: "If a translation is missing or unapproved, the system should fall back cleanly instead of showing unsafe mixed copy.",
  },
  {
    code: "05",
    title: "Kuya Tala™ must not over-translate official facts",
    text: "The assistant may help explain, but official instructions must remain source-grounded and approval-aware.",
  },
];

const risks = [
  {
    title: "Unsafe translated instructions",
    text: "Bad translation in safety, QR, payment, or emergency copy can create real-world operational risk.",
  },
  {
    title: "FX confusion",
    text: "Travelers may confuse displayed currency with charged currency, settlement currency, or payout currency.",
  },
  {
    title: "Mixed-language trust damage",
    text: "Uncontrolled mixed copy feels unprofessional and reduces trust before payment or regulated trip clearance.",
  },
  {
    title: "AI translation drift",
    text: "AI-generated translations can change meaning unless official copy is approved and locked.",
  },
];

export function ControlTowerLocalizationPage() {
  return (
    <section className={styles.content}>
      <div className={styles.operatorDeck}>
        <div className={styles.operatorHero}>
          <div className={styles.operatorHeroInner}>
            <div>
              <div className={styles.operatorKicker}>
                <span className={styles.nuclearPulse} />
                ADMIN-CT-13 / Localization Governance
              </div>

              <h2 className={styles.operatorTitle}>
                Language, Currency & Localization
              </h2>

              <p className={styles.operatorLead}>
                The Super Admin governance surface for language preferences,
                approved translations, localized safety notes, payment copy, QR
                instructions, currency display, FX readiness, booking snapshots,
                and official traveler-facing copy control.
              </p>
            </div>

            <div className={styles.operatorDoctrineWall}>
              {doctrineCards.map((card) => (
                <article key={card.label} className={styles.operatorDoctrineCard}>
                  <p className={styles.operatorDoctrineLabel}>{card.label}</p>
                  <h3 className={styles.operatorDoctrineValue}>{card.value}</h3>
                  <p className={styles.operatorDoctrineText}>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.operatorOpsGrid}>
          <section className={styles.operatorPanel}>
            <div className={styles.operatorPanelHead}>
              <p className={styles.operatorEyebrow}>Localization Control</p>
              <h3 className={styles.operatorPanelTitle}>
                Translation can support travelers, but official meaning must be governed
              </h3>
              <p className={styles.operatorPanelText}>
                This module creates a permanent Super Admin home for localization
                governance without changing database schema, FX logic, payment
                logic, AI translation behavior, or traveler-facing runtime copy
                in this lane.
              </p>
            </div>

            <div className={styles.operatorLaneGrid}>
              {controlLanes.map((lane) => (
                <article key={lane.title} className={styles.operatorLaneCard}>
                  <div className={styles.operatorLaneTop}>
                    <h4 className={styles.operatorLaneTitle}>{lane.title}</h4>
                    <span className={styles.operatorLaneStatus}>{lane.status}</span>
                  </div>
                  <p className={styles.operatorLaneText}>{lane.body}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className={styles.operatorPanel}>
            <div className={styles.operatorPanelHead}>
              <p className={styles.operatorEyebrow}>Localization Safety Rules</p>
              <h3 className={styles.operatorPanelTitle}>
                Helpful multilingual support cannot bypass official approval
              </h3>
              <p className={styles.operatorPanelText}>
                Localization must improve accessibility without weakening safety,
                payment clarity, QR instructions, or compliance boundaries.
              </p>
            </div>

            <div className={styles.operatorMatrix}>
              {rules.map((rule) => (
                <article key={rule.code} className={styles.operatorRule}>
                  <div className={styles.operatorRuleCode}>{rule.code}</div>
                  <div>
                    <h4 className={styles.operatorRuleTitle}>{rule.title}</h4>
                    <p className={styles.operatorRuleText}>{rule.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.operatorRiskStrip}>
              {risks.map((risk) => (
                <article key={risk.title} className={styles.operatorRiskItem}>
                  <span className={styles.operatorRiskDot} />
                  <div>
                    <h4 className={styles.operatorRiskTitle}>{risk.title}</h4>
                    <p className={styles.operatorRiskText}>{risk.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <section className={styles.operatorPanel}>
          <div className={styles.operatorPanelHead}>
            <p className={styles.operatorEyebrow}>Control Tower Relationships</p>
            <h3 className={styles.operatorPanelTitle}>
              Localization connects to AI Assistant, Pricing, Payments, QR Compliance, OSP Core, and Traveler Settings
            </h3>
            <p className={styles.operatorPanelText}>
              Language and currency behavior must align with the same source
              truth used by traveler identity, trip readiness, pricing snapshots,
              payment handoffs, QR actions, safety notes, and Kuya Tala™.
            </p>
          </div>

          <div className={styles.operatorLaneGrid}>
            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>AI Assistant Control Center</h4>
                <span className={styles.operatorLaneStatus}>Translation guard</span>
              </div>
              <p className={styles.operatorLaneText}>
                Kuya Tala™ may explain in traveler-friendly language, but official safety, pricing, payment, and QR facts need approval.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Pricing & Margin Governance</h4>
                <span className={styles.operatorLaneStatus}>FX boundary</span>
              </div>
              <p className={styles.operatorLaneText}>
                Currency display must not alter canonical pricing formulas, payment processing treatment, or booking snapshots.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Payments, Payouts & Statements</h4>
                <span className={styles.operatorLaneStatus}>Payment clarity</span>
              </div>
              <p className={styles.operatorLaneText}>
                Payment instructions, receipt language, refund copy, and gateway handoff copy must remain role-safe and approval-aware.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>QR, Compliance & Movement</h4>
                <span className={styles.operatorLaneStatus}>Instruction safety</span>
              </div>
              <p className={styles.operatorLaneText}>
                QR scan, pass, checkpoint, movement, and emergency instructions must not be mistranslated or over-simplified.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.operatorBoundary}>
          <h3>Build boundary: localization shell only, no runtime translation or FX changes.</h3>
          <p>
            ADMIN-CT-13 creates the Language, Currency & Localization control
            surface. It does not modify schema, translation runtime, AI prompts,
            FX computation, pricing formulas, payment logic, traveler settings,
            QR instructions, redirects, or create a commit.
          </p>
          <p>
            <Link href="/admin/control-tower/ai-assistant" className={styles.nuclearActionGhost}>
              Review AI Control
            </Link>{" "}
            <Link href="/admin/control-tower/pricing" className={styles.nuclearActionGhost}>
              Review Pricing Control
            </Link>{" "}
            <Link href="/traveler/settings" className={styles.nuclearActionGhost}>
              View Traveler Settings
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
}
