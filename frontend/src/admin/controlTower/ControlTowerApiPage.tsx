import Link from "next/link";
import styles from "./controlTower.module.css";

const doctrineCards = [
  {
    label: "Access Rule",
    value: "Governed API",
    text: "API access is destination infrastructure, not open public access. Tokens, scopes, partners, and webhooks require approval.",
  },
  {
    label: "Partner Rule",
    value: "Scoped integration",
    text: "OTA, Travel & Tours, hotel desks, API partners, and future affiliates need controlled scopes, not unrestricted system access.",
  },
  {
    label: "Data Rule",
    value: "No fake tokens",
    text: "This shell defines API governance only. It does not issue tokens, create scopes, wire webhooks, or expose partner APIs.",
  },
];

const controlLanes = [
  {
    title: "API Partners",
    status: "Gate home",
    body: "Govern partner applications, OTA access, Travel & Tours access, partner type, approval state, suspension, and account ownership.",
  },
  {
    title: "Tokens",
    status: "Gate home",
    body: "Prepare token issuance governance, token visibility boundaries, rotation, revocation, expiration, and audit requirements.",
  },
  {
    title: "Scopes",
    status: "Gate home",
    body: "Control allowed partner capabilities such as booking intake, QR issuance, passport validation, catalog read, and webhook access.",
  },
  {
    title: "Webhooks",
    status: "Gate home",
    body: "Prepare event delivery governance for booking intake, payment state, pass creation, QR issuance, cancellation, and confirmation events.",
  },
  {
    title: "API Logs",
    status: "Gate home",
    body: "Prepare audit logs for partner calls, failed calls, rate limits, invalid scopes, token misuse, and operational exceptions.",
  },
  {
    title: "Suspension & Rate Limits",
    status: "Gate home",
    body: "Govern partner suspension, quota, misuse warnings, high-risk traffic, and emergency API shutdown controls.",
  },
];

const rules = [
  {
    code: "01",
    title: "No open token issuance",
    text: "Partners must not self-generate production tokens without approval, scope assignment, and audit visibility.",
  },
  {
    code: "02",
    title: "Scopes must be explicit",
    text: "Booking intake, QR issuance, passport validation, catalog reads, and webhook events must be separately scoped.",
  },
  {
    code: "03",
    title: "Partner data must be bounded",
    text: "API partners should only access the data required for their approved workflow, never private Super Admin surfaces.",
  },
  {
    code: "04",
    title: "Webhooks need traceability",
    text: "Every webhook event should eventually be traceable by partner, event type, payload class, delivery state, and retry state.",
  },
  {
    code: "05",
    title: "Suspension must be fast",
    text: "Super Admin must eventually be able to suspend risky partners, tokens, scopes, or webhooks quickly.",
  },
];

const risks = [
  {
    title: "Uncontrolled API access",
    text: "Open or loosely scoped API access can expose traveler, booking, payment, QR, and partner data.",
  },
  {
    title: "Partner overreach",
    text: "OTA or Travel & Tours partners may try to access more than the approved commercial workflow requires.",
  },
  {
    title: "Webhook confusion",
    text: "Without logs and retry visibility, failed partner workflows become hard to diagnose before VPS.",
  },
  {
    title: "Token leakage",
    text: "Production tokens must eventually have rotation, revocation, scope, and audit controls.",
  },
];

export function ControlTowerApiPage() {
  return (
    <section className={styles.content}>
      <div className={styles.operatorDeck}>
        <div className={styles.operatorHero}>
          <div className={styles.operatorHeroInner}>
            <div>
              <div className={styles.operatorKicker}>
                <span className={styles.nuclearPulse} />
                ADMIN-CT-14 / API Governance
              </div>

              <h2 className={styles.operatorTitle}>
                API Control Center
              </h2>

              <p className={styles.operatorLead}>
                The Super Admin governance surface for API partners, OTA access,
                Travel & Tours access, tokens, scopes, webhooks, logs, rate
                limits, booking intake, QR issuance, passport validation, and
                partner suspension controls.
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
              <p className={styles.operatorEyebrow}>API Governance Control</p>
              <h3 className={styles.operatorPanelTitle}>
                Partner integrations must be approved, scoped, logged, and suspendable
              </h3>
              <p className={styles.operatorPanelText}>
                This module creates the API governance shell only. It does not
                create tokens, wire partner APIs, add backend endpoints, change
                authentication, modify schema, expose private data, or alter
                public developer pages in this lane.
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
              <p className={styles.operatorEyebrow}>API Safety Rules</p>
              <h3 className={styles.operatorPanelTitle}>
                API access is governed infrastructure, not a public shortcut
              </h3>
              <p className={styles.operatorPanelText}>
                API partners can create distribution leverage only if tokens,
                scopes, logs, and suspension controls are strict from the start.
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
              API governance connects to OSP Core, Payments, QR Compliance, Marketplace Exposure, Operators, and Intelligence
            </h3>
            <p className={styles.operatorPanelText}>
              Partner APIs must respect the same control boundaries as the rest
              of the platform: booking truth, payment state, QR identity, operator
              readiness, exposure eligibility, privacy, and audit history.
            </p>
          </div>

          <div className={styles.operatorLaneGrid}>
            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>OSP Core</h4>
                <span className={styles.operatorLaneStatus}>Pass issuance</span>
              </div>
              <p className={styles.operatorLaneText}>
                Partner booking intake and pass creation must align with traveler identity, trip validity, and QR credential rules.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Payments, Payouts & Statements</h4>
                <span className={styles.operatorLaneStatus}>Payment state</span>
              </div>
              <p className={styles.operatorLaneText}>
                API partners must not override payment state, settlement logic, payout visibility, or receipt truth.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>QR, Compliance & Movement</h4>
                <span className={styles.operatorLaneStatus}>Validation scope</span>
              </div>
              <p className={styles.operatorLaneText}>
                QR issuance and passport validation APIs require strict scopes and audit logs.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Marketplace Exposure Engine</h4>
                <span className={styles.operatorLaneStatus}>Catalog safety</span>
              </div>
              <p className={styles.operatorLaneText}>
                API catalog access must not expose suppressed, unapproved, incomplete, or unsafe marketplace records.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.operatorBoundary}>
          <h3>Build boundary: API governance shell only, no API runtime changes.</h3>
          <p>
            ADMIN-CT-14 creates the API Control Center shell. It does not create
            API tokens, add endpoints, modify auth, change backend modules,
            alter schema, expose partner data, wire webhooks, redirect routes,
            change public developer pages, or create a commit.
          </p>
          <p>
            <Link href="/developers" className={styles.nuclearActionGhost}>
              View Public Developers Page
            </Link>{" "}
            <Link href="/api-terms" className={styles.nuclearActionGhost}>
              View API Terms
            </Link>{" "}
            <Link href="/admin/control-tower/settings" className={styles.nuclearActionGhost}>
              Review System Settings
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
}
