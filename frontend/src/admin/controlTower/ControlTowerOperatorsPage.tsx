import Link from "next/link";
import styles from "./controlTower.module.css";

const doctrineCards = [
  {
    label: "Onboarding Rule",
    value: "Lenient entry",
    text: "Operators may enter as draft, incomplete, internal, claim-assisted, or request-to-confirm participants.",
  },
  {
    label: "Exposure Rule",
    value: "Strict public gates",
    text: "No operator becomes public-visible until readiness, approval, category, pricing, media, and safety gates pass.",
  },
  {
    label: "Surface Boundary",
    value: "Separate consoles",
    text: "Operator Console remains for authoring. Super Admin governs approval, exposure, readiness, and risk.",
  },
];

const operatorLanes = [
  {
    title: "Tour Operators",
    status: "Gate home",
    body: "Govern DOT accreditation, capability categories, package readiness, guide requirements, pricing readiness, media quality, and exposure eligibility.",
  },
  {
    title: "Accommodation Operators",
    status: "Gate home",
    body: "Govern accommodation owners, claim readiness, rooms/units, booking modes, QR check-in dependency, marketplace readiness, and public bookability.",
  },
  {
    title: "Guides",
    status: "Future lane",
    body: "Keep guide assignment as future/placeholder operational capability. Do not overbuild guide workflows before service and fulfillment readiness.",
  },
  {
    title: "Transport Operators",
    status: "Gate home",
    body: "Govern transport-support providers, category assignment, compliance readiness, route/service boundaries, and future dispatch relationship.",
  },
  {
    title: "Food / Culture Partners",
    status: "Gate home",
    body: "Govern local partner participation, category readiness, public discovery eligibility, content approval, and marketplace exposure.",
  },
  {
    title: "Health / Beauty / Services",
    status: "Gate home",
    body: "Govern non-tour commercial service providers without allowing raw public directory exposure or unreviewed service claims.",
  },
];

const rules = [
  {
    code: "01",
    title: "Draft is allowed",
    text: "Operators may be created or assisted internally before their profile is public-ready.",
  },
  {
    code: "02",
    title: "Incomplete is not public",
    text: "Incomplete records can exist in Super Admin, but public marketplace exposure remains blocked.",
  },
  {
    code: "03",
    title: "Approval is multi-layered",
    text: "Profile, DOT accreditation, media, pricing, service details, category, and exposure are separate readiness dimensions.",
  },
  {
    code: "04",
    title: "Operator authoring stays separate",
    text: "The operator dashboard is not the Super Admin console. Super Admin reviews, governs, and controls exposure.",
  },
  {
    code: "05",
    title: "Exposure must be explainable",
    text: "Operators must be able to understand why they are visible, suppressed, pending, or not ranked.",
  },
];

const risks = [
  {
    title: "Approval confusion",
    text: "A vague approved flag can accidentally publish unready operators or services.",
  },
  {
    title: "Flat directory failure",
    text: "A raw list of operators destroys trust and bypasses readiness, category matching, and fairness logic.",
  },
  {
    title: "Low-trust operator complaints",
    text: "Operators will ask why they are not visible, who approved them, and what they need to fix.",
  },
  {
    title: "Console mixing",
    text: "Super Admin must not become an operator editing screen. Boundaries protect security and usability.",
  },
];

export function ControlTowerOperatorsPage() {
  return (
    <section className={styles.content}>
      <div className={styles.operatorDeck}>
        <div className={styles.operatorHero}>
          <div className={styles.operatorHeroInner}>
            <div>
              <div className={styles.operatorKicker}>
                <span className={styles.nuclearPulse} />
                ADMIN-CT-06 / Operator Governance
              </div>

              <h2 className={styles.operatorTitle}>
                Operator Governance Leniency Layer
              </h2>

              <p className={styles.operatorLead}>
                A Super Admin control surface for letting operators enter the
                system early while blocking unsafe or incomplete public exposure.
                This is governance, not operator authoring.
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
              <p className={styles.operatorEyebrow}>Governed Operator Lanes</p>
              <h3 className={styles.operatorPanelTitle}>
                Operators may enter early. Public exposure waits.
              </h3>
              <p className={styles.operatorPanelText}>
                This module gives every operator type a correct Super Admin home
                without turning Super Admin into an operator dashboard. Draft,
                claim, incomplete, and assisted states are allowed internally;
                public visibility remains locked behind readiness gates.
              </p>
            </div>

            <div className={styles.operatorLaneGrid}>
              {operatorLanes.map((lane) => (
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
              <p className={styles.operatorEyebrow}>Leniency Rules</p>
              <h3 className={styles.operatorPanelTitle}>
                The system can be friendly without being careless
              </h3>
              <p className={styles.operatorPanelText}>
                The MVP cannot overblock onboarding, but it also cannot let
                incomplete operators become public inventory.
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
              Operator Governance connects to Explore, Marketplace Exposure, Pricing, and Accommodations
            </h3>
            <p className={styles.operatorPanelText}>
              Operator Governance does not own every downstream decision alone.
              It supervises operator readiness, then hands public visibility,
              commercial pricing, accommodation bookability, and marketplace
              placement to their correct Control Tower modules.
            </p>
          </div>

          <div className={styles.operatorLaneGrid}>
            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Explore Siargao</h4>
                <span className={styles.operatorLaneStatus}>Public display</span>
              </div>
              <p className={styles.operatorLaneText}>
                Explore receives only approved and exposure-eligible services. It must not pull from raw operator records.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Marketplace Exposure Engine</h4>
                <span className={styles.operatorLaneStatus}>Ranking logic</span>
              </div>
              <p className={styles.operatorLaneText}>
                Exposure, suppression, fairness, category pools, and placement logs belong to the exposure engine.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Pricing & Margin Governance</h4>
                <span className={styles.operatorLaneStatus}>Money logic</span>
              </div>
              <p className={styles.operatorLaneText}>
                Operator base rates, public SRP, traveler fees, OTA fees, margins, and payouts must remain centrally governed.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Accommodation Control Center</h4>
                <span className={styles.operatorLaneStatus}>Stay readiness</span>
              </div>
              <p className={styles.operatorLaneText}>
                Accommodation operators connect here, but accommodation profiles, rooms, QR check-in, and bookability have their own control center.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.operatorBoundary}>
          <h3>Build boundary: governance surface only, no destructive wiring.</h3>
          <p>
            ADMIN-CT-06 creates the Operator Governance Leniency Layer as a
            serious Super Admin operating surface. It does not delete old routes,
            redirect operator pages, modify backend logic, change database
            schema, publish operators, or create a commit.
          </p>
          <p>
            <Link href="/operator/commercial" className={styles.nuclearActionGhost}>
              View Operator Commercial Surface
            </Link>{" "}
            <Link href="/admin/control-tower/marketplace-exposure" className={styles.nuclearActionGhost}>
              Review Exposure Engine
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
}
