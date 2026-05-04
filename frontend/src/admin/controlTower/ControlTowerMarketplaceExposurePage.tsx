import Link from "next/link";
import styles from "./controlTower.module.css";

const doctrineCards = [
  {
    label: "Exposure Rule",
    value: "Governed visibility",
    text: "Marketplace exposure is not raw listing display. It must be driven by readiness, category match, fairness, and risk state.",
  },
  {
    label: "Operator Rule",
    value: "No flat directory",
    text: "Never publish a blind list of operators or accommodations. Exposure must be explainable, scored, and auditable.",
  },
  {
    label: "Data Rule",
    value: "No fake scores",
    text: "This shell defines exposure governance only. Live readiness scores and placement logs are not claimed until wiring exists.",
  },
];

const exposureLanes = [
  {
    title: "Readiness Scores",
    status: "Gate home",
    body: "Govern profile completeness, DOT/accreditation readiness, media quality, pricing readiness, service details, availability, and unresolved-risk checks.",
  },
  {
    title: "Exposure Scores",
    status: "Gate home",
    body: "Prepare weighted exposure logic across readiness, match quality, availability, fairness, performance, freshness, and risk penalties.",
  },
  {
    title: "Category Pools",
    status: "Gate home",
    body: "Group operators and services by actual traveler intent: island hopping, surf, land tour, north Siargao, stays, rentals, food, culture, health, and services.",
  },
  {
    title: "Placement Tiers",
    status: "Gate home",
    body: "Govern Featured Verified, Recommended, Available Soon, Local Verified Partner, group-friendly, budget/joiner, private, and premium positioning.",
  },
  {
    title: "Suppression & Suspension",
    status: "Gate home",
    body: "Control unresolved complaints, missing readiness, expired accreditation, unsafe claims, pricing gaps, and public exposure blocks.",
  },
  {
    title: "Placement Logs",
    status: "Gate home",
    body: "Prepare auditable records of why a service was shown, suppressed, rotated, featured, or withheld from public discovery.",
  },
];

const rules = [
  {
    code: "01",
    title: "Readiness before visibility",
    text: "A service can exist internally before it becomes eligible for public discovery.",
  },
  {
    code: "02",
    title: "Operators compete inside niches",
    text: "Operators should compete inside their category and service niche, not one global public list.",
  },
  {
    code: "03",
    title: "Fairness is weighted, not blind",
    text: "Round robin must not be blind. Fairness needs readiness, match, availability, performance, freshness, and risk context.",
  },
  {
    code: "04",
    title: "Suppression must be explainable",
    text: "Admins and operators need clear reasons for pending, hidden, suppressed, suspended, or not-ranked exposure states.",
  },
  {
    code: "05",
    title: "Sponsored is later",
    text: "Sponsored or featured placement must not bypass readiness, safety, compliance, or traveler trust gates.",
  },
];

const risks = [
  {
    title: "Flat 85-operator failure",
    text: "A raw directory overwhelms travelers, damages trust, and weakens the OSP moat.",
  },
  {
    title: "Exposure bypass",
    text: "Unready operators or accommodations going public create complaints, refunds, and reputational damage.",
  },
  {
    title: "Low-trust operator dispute",
    text: "Operators will ask why others are shown first. Exposure needs explainable governance.",
  },
  {
    title: "Category mismatch",
    text: "Showing the wrong operator for the wrong traveler intent destroys conversion and service trust.",
  },
];

export function ControlTowerMarketplaceExposurePage() {
  return (
    <section className={styles.content}>
      <div className={styles.operatorDeck}>
        <div className={styles.operatorHero}>
          <div className={styles.operatorHeroInner}>
            <div>
              <div className={styles.operatorKicker}>
                <span className={styles.nuclearPulse} />
                ADMIN-CT-11 / Exposure Governance
              </div>

              <h2 className={styles.operatorTitle}>
                Marketplace Exposure Engine
              </h2>

              <p className={styles.operatorLead}>
                The Super Admin control surface for readiness scores, exposure
                scores, category pools, placement tiers, fairness rotation,
                suppression, suspension, sponsored-later controls, and placement
                logs across Explore Siargao, SPM, operators, accommodations, and
                commercial services.
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
              <p className={styles.operatorEyebrow}>Visibility Control</p>
              <h3 className={styles.operatorPanelTitle}>
                Public marketplace exposure must be earned, not dumped
              </h3>
              <p className={styles.operatorPanelText}>
                This module gives exposure governance a permanent Super Admin
                home without wiring live scores, altering public discovery,
                changing backend logic, or creating fake ranking claims.
              </p>
            </div>

            <div className={styles.operatorLaneGrid}>
              {exposureLanes.map((lane) => (
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
              <p className={styles.operatorEyebrow}>Exposure Rules</p>
              <h3 className={styles.operatorPanelTitle}>
                No flat lists. No blind rotation. No approval bypass.
              </h3>
              <p className={styles.operatorPanelText}>
                Public visibility must protect traveler trust, operator fairness,
                and commercial readiness at the same time.
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
              Exposure connects to Explore, Operator Governance, Accommodation Control, Pricing, and SPM
            </h3>
            <p className={styles.operatorPanelText}>
              Marketplace exposure does not own the service itself. It governs
              whether approved services should appear, where they appear, why
              they appear, and when they should be suppressed.
            </p>
          </div>

          <div className={styles.operatorLaneGrid}>
            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Explore Siargao</h4>
                <span className={styles.operatorLaneStatus}>Public discovery</span>
              </div>
              <p className={styles.operatorLaneText}>
                Explore consumes exposure-eligible services only. It must not show raw operator or accommodation records.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Operator Governance</h4>
                <span className={styles.operatorLaneStatus}>Operator readiness</span>
              </div>
              <p className={styles.operatorLaneText}>
                Operators may enter early, but public visibility waits for readiness, category, media, pricing, and approval gates.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Accommodation Control</h4>
                <span className={styles.operatorLaneStatus}>Stay readiness</span>
              </div>
              <p className={styles.operatorLaneText}>
                Accommodation exposure must depend on claim, profile, rooms, pricing, availability, and marketplace readiness.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Pricing & Margin Governance</h4>
                <span className={styles.operatorLaneStatus}>Commercial readiness</span>
              </div>
              <p className={styles.operatorLaneText}>
                Services with missing, unsafe, or unclear pricing must not be treated as fully exposure-ready.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.operatorBoundary}>
          <h3>Build boundary: exposure governance shell only, no ranking execution.</h3>
          <p>
            ADMIN-CT-11 creates the Marketplace Exposure Engine control surface.
            It does not wire live scores, change marketplace APIs, publish
            operators, expose accommodations, modify schema, alter backend logic,
            redirect routes, add sponsored billing, or create a commit.
          </p>
          <p>
            <Link href="/admin/control-tower/explore" className={styles.nuclearActionGhost}>
              Review Explore Control
            </Link>{" "}
            <Link href="/traveler/explore" className={styles.nuclearActionGhost}>
              View Traveler Explore
            </Link>{" "}
            <Link href="/admin/control-tower/operators" className={styles.nuclearActionGhost}>
              Review Operator Governance
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
}
