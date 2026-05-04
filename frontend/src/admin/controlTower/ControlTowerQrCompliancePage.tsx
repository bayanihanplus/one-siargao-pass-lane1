import Link from "next/link";
import styles from "./controlTower.module.css";

const doctrineCards = [
  {
    label: "QR Doctrine",
    value: "Compliance rail",
    text: "QR is not only for Passport Trail stamps. It validates identity, movement, activity, manifest, checkpoint, and regulated-trip states.",
  },
  {
    label: "Boundary Rule",
    value: "Role-safe views",
    text: "Super Admin sees full operational truth. LGU/DOT should receive protected aggregated visibility, not private commercial controls.",
  },
  {
    label: "Data Rule",
    value: "No fake events",
    text: "This shell defines compliance control homes only. It does not claim live QR event counts until backend wiring exists.",
  },
];

const qrLanes = [
  {
    title: "QR Credentials",
    status: "Gate home",
    body: "Govern traveler QR identity, pass linkage, token state, scan-readiness, lifecycle, and protected identity boundaries.",
  },
  {
    title: "OSP QR Events",
    status: "Gate home",
    body: "Govern scan events, stamp events, access validation, operator scans, traveler scans, and audit event classification.",
  },
  {
    title: "Traveler Ingress / Egress",
    status: "Gate home",
    body: "Prepare entry and exit movement readiness without turning LGU/DOT views into private Super Admin control surfaces.",
  },
  {
    title: "Island Hopping Movement",
    status: "Gate home",
    body: "Govern regulated trip clearance dependencies, departure, boarding, boat movement, disembarkation, and exception review.",
  },
  {
    title: "Manifests, Vessels & Checkpoints",
    status: "Gate home",
    body: "Prepare manifest participation, vessel dependency, checkpoint validation, manual review, and protected audit visibility.",
  },
  {
    title: "Compliance Exceptions",
    status: "Gate home",
    body: "Control mismatch states, missing clearance, failed scan, payment mismatch, operator issue, route issue, and manual review flags.",
  },
];

const rules = [
  {
    code: "01",
    title: "QR identity is issued early",
    text: "Traveler QR identity should not wait for island-hopping clearance. Clearance changes regulated activity permission, not basic identity.",
  },
  {
    code: "02",
    title: "Regulated trips need gates",
    text: "Island hopping and similar regulated activities need approved manifest/operator/vessel/checkpoint/payment alignment where required.",
  },
  {
    code: "03",
    title: "Stamp is not the whole QR system",
    text: "Passport stamps are one QR use case. Compliance movement and operational validation are separate responsibilities.",
  },
  {
    code: "04",
    title: "LGU/DOT visibility is bounded",
    text: "LGU/DOT views should show protected aggregated coordination signals, not private traveler or commercial operator detail.",
  },
  {
    code: "05",
    title: "Exception review must be explicit",
    text: "Manual review and compliance exceptions must be visible as operating states, not hidden in traveler or operator screens.",
  },
];

const risks = [
  {
    title: "QR reduced to stamps",
    text: "If QR is treated only as Passport Trail gamification, OSP loses its operating compliance spine.",
  },
  {
    title: "LGU/DOT overexposure",
    text: "Mixing Super Admin private controls with LGU/DOT coordination views creates privacy and commercial-trust risk.",
  },
  {
    title: "Movement without clearance",
    text: "Regulated trip movement without manifest/operator/vessel/payment/QR alignment creates operational failure.",
  },
  {
    title: "Hidden exceptions",
    text: "If failed scans or mismatches are not surfaced, the platform cannot operate safely before VPS.",
  },
];

export function ControlTowerQrCompliancePage() {
  return (
    <section className={styles.content}>
      <div className={styles.qrDeck}>
        <div className={styles.qrHero}>
          <div className={styles.qrHeroInner}>
            <div>
              <div className={styles.qrKicker}>
                <span className={styles.nuclearPulse} />
                ADMIN-CT-10 / Compliance Rail
              </div>

              <h2 className={styles.qrTitle}>
                QR, Compliance & Movement
              </h2>

              <p className={styles.qrLead}>
                The Super Admin command surface for QR credentials, OSP QR
                events, traveler ingress and egress, island hopping movement,
                boat boarding, disembarkation, manifests, checkpoints, vessels,
                activity validation, compliance exceptions, and manual review.
              </p>
            </div>

            <div className={styles.qrDoctrineWall}>
              {doctrineCards.map((card) => (
                <article key={card.label} className={styles.qrDoctrineCard}>
                  <p className={styles.qrDoctrineLabel}>{card.label}</p>
                  <h3 className={styles.qrDoctrineValue}>{card.value}</h3>
                  <p className={styles.qrDoctrineText}>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.qrOpsGrid}>
          <section className={styles.qrPanel}>
            <div className={styles.qrPanelHead}>
              <p className={styles.qrEyebrow}>Operational Validation Control</p>
              <h3 className={styles.qrPanelTitle}>
                QR is the operating compliance rail, not only a stamp tool
              </h3>
              <p className={styles.qrPanelText}>
                This module gives QR and movement logic a permanent Super Admin
                home without changing schema, backend, traveler QR screens, LGU
                views, or operator scan screens in this lane.
              </p>
            </div>

            <div className={styles.qrLaneGrid}>
              {qrLanes.map((lane) => (
                <article key={lane.title} className={styles.qrLaneCard}>
                  <div className={styles.qrLaneTop}>
                    <h4 className={styles.qrLaneTitle}>{lane.title}</h4>
                    <span className={styles.qrLaneStatus}>{lane.status}</span>
                  </div>
                  <p className={styles.qrLaneText}>{lane.body}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className={styles.qrPanel}>
            <div className={styles.qrPanelHead}>
              <p className={styles.qrEyebrow}>Compliance Rules</p>
              <h3 className={styles.qrPanelTitle}>
                Identity, pass, clearance, payment, and movement are separate states
              </h3>
              <p className={styles.qrPanelText}>
                Travelers can hold identity and passes before regulated-trip
                approval. Regulated activities require their own operational
                gates.
              </p>
            </div>

            <div className={styles.qrRuleGrid}>
              {rules.map((rule) => (
                <article key={rule.code} className={styles.qrRule}>
                  <div className={styles.qrRuleCode}>{rule.code}</div>
                  <div>
                    <h4 className={styles.qrRuleTitle}>{rule.title}</h4>
                    <p className={styles.qrRuleText}>{rule.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.qrRiskStrip}>
              {risks.map((risk) => (
                <article key={risk.title} className={styles.qrRiskItem}>
                  <span className={styles.qrRiskDot} />
                  <div>
                    <h4 className={styles.qrRiskTitle}>{risk.title}</h4>
                    <p className={styles.qrRiskText}>{risk.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <section className={styles.qrPanel}>
          <div className={styles.qrPanelHead}>
            <p className={styles.qrEyebrow}>Control Tower Relationships</p>
            <h3 className={styles.qrPanelTitle}>
              QR Compliance connects to OSP Core, Payments, Operator Governance, Accommodation Control, and Intelligence
            </h3>
            <p className={styles.qrPanelText}>
              QR and movement validation must be interpreted against traveler
              identity, pass state, booking/payment state, operator readiness,
              manifest compliance, and protected intelligence boundaries.
            </p>
          </div>

          <div className={styles.qrLaneGrid}>
            <article className={styles.qrLaneCard}>
              <div className={styles.qrLaneTop}>
                <h4 className={styles.qrLaneTitle}>OSP Core</h4>
                <span className={styles.qrLaneStatus}>Identity anchor</span>
              </div>
              <p className={styles.qrLaneText}>
                Traveler QR identity, OSP pass, trip dates, and profile readiness anchor QR interpretation.
              </p>
            </article>

            <article className={styles.qrLaneCard}>
              <div className={styles.qrLaneTop}>
                <h4 className={styles.qrLaneTitle}>Payments, Payouts & Statements</h4>
                <span className={styles.qrLaneStatus}>Payment clearance</span>
              </div>
              <p className={styles.qrLaneText}>
                Regulated bookings may require payment state alignment before movement clearance or payout release.
              </p>
            </article>

            <article className={styles.qrLaneCard}>
              <div className={styles.qrLaneTop}>
                <h4 className={styles.qrLaneTitle}>Operator Governance</h4>
                <span className={styles.qrLaneStatus}>Operator readiness</span>
              </div>
              <p className={styles.qrLaneText}>
                Activity validation depends on approved operators, service readiness, staff boundaries, and compliance status.
              </p>
            </article>

            <article className={styles.qrLaneCard}>
              <div className={styles.qrLaneTop}>
                <h4 className={styles.qrLaneTitle}>Intelligence & Data Center</h4>
                <span className={styles.qrLaneStatus}>Aggregated visibility</span>
              </div>
              <p className={styles.qrLaneText}>
                QR events can feed intelligence, but LGU/DOT visibility must remain protected and aggregated.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.qrBoundary}>
          <h3>Build boundary: QR compliance shell only, no schema or backend drift.</h3>
          <p>
            ADMIN-CT-10 creates the QR, Compliance & Movement control surface.
            It does not modify QrCredential, OspQrEvent, manifest, vessel,
            checkpoint, payment, trip, or backend logic. It does not redirect
            routes, expose LGU/DOT private controls, alter traveler QR screens,
            or create a commit.
          </p>
          <p>
            <Link href="/traveler/pass" className={styles.nuclearActionGhost}>
              View Traveler Pass
            </Link>{" "}
            <Link href="/operator/access-scan" className={styles.nuclearActionGhost}>
              View Operator Scan Surface
            </Link>{" "}
            <Link href="/lgu/intelligence" className={styles.nuclearActionGhost}>
              View LGU Intelligence Surface
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
}
