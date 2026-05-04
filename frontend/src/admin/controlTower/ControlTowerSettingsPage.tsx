import Link from "next/link";
import styles from "./controlTower.module.css";

const doctrineCards = [
  {
    label: "Control Rule",
    value: "Governed settings",
    text: "System settings should govern platform behavior intentionally, not through scattered hardcoded route and UI decisions.",
  },
  {
    label: "Auth Rule",
    value: "No redirect drift",
    text: "Auth, role-aware routing, protected routes, and traveler home redirects must remain controlled and auditable.",
  },
  {
    label: "Data Rule",
    value: "No fake toggles",
    text: "This shell defines setting homes only. It does not wire live feature flags, RBAC, payment modes, or runtime configuration.",
  },
];

const controlLanes = [
  {
    title: "Users & Admin Roles",
    status: "Gate home",
    body: "Govern Super Admin users, admin staff, LGU roles, operator roles, staff roles, and future permission boundaries.",
  },
  {
    title: "Permissions & RBAC",
    status: "Gate home",
    body: "Prepare role-based access control surfaces without overbuilding permission execution or changing backend auth behavior in this lane.",
  },
  {
    title: "Navigation Rules",
    status: "Gate home",
    body: "Govern public, traveler, operator, admin, LGU, and Control Tower navigation boundaries so route drift does not return.",
  },
  {
    title: "Auth Redirects",
    status: "Gate home",
    body: "Control destructive redirect prevention, role-aware continuation, stale next parameters, and traveler-home redirect safety.",
  },
  {
    title: "Feature Flags",
    status: "Gate home",
    body: "Prepare safe enable/disable gates for modules, experiments, public surfaces, payment modes, AI features, and API partner access.",
  },
  {
    title: "Platform Configuration",
    status: "Gate home",
    body: "Govern brand defaults, payment mode, language defaults, currency defaults, emergency defaults, AI defaults, and audit settings.",
  },
];

const rules = [
  {
    code: "01",
    title: "Settings must not be scattered",
    text: "Auth redirects, feature flags, navigation rules, payment mode, AI settings, and localization defaults need a governed home.",
  },
  {
    code: "02",
    title: "Traveler home redirect stays protected",
    text: "Do not reintroduce next=/traveler/home redirect patterns that route unauthenticated users into destructive loops.",
  },
  {
    code: "03",
    title: "Frontend hiding is not security",
    text: "Role and permission settings must eventually be backend-enforced. UI visibility alone is not access control.",
  },
  {
    code: "04",
    title: "Feature flags need auditability",
    text: "High-impact features should eventually record who changed the setting, when, why, and what surface was affected.",
  },
  {
    code: "05",
    title: "System mode must be explicit",
    text: "Sandbox/live payments, AI answer mode, API access, public exposure, and emergency mode must never be ambiguous.",
  },
];

const risks = [
  {
    title: "Auth routing regression",
    text: "One wrong redirect rule can send travelers, operators, admins, or LGU users to the wrong surface.",
  },
  {
    title: "Permission leakage",
    text: "If RBAC is handled only in UI, protected Super Admin, LGU, operator, and traveler surfaces can leak.",
  },
  {
    title: "Feature flag confusion",
    text: "Untracked toggles can expose unfinished modules, payment paths, AI behavior, or marketplace surfaces prematurely.",
  },
  {
    title: "Operational ambiguity",
    text: "Payment mode, API access, emergency settings, and localization defaults must be clear before VPS.",
  },
];

export function ControlTowerSettingsPage() {
  return (
    <section className={styles.content}>
      <div className={styles.operatorDeck}>
        <div className={styles.operatorHero}>
          <div className={styles.operatorHeroInner}>
            <div>
              <div className={styles.operatorKicker}>
                <span className={styles.nuclearPulse} />
                ADMIN-CT-16 / System Governance
              </div>

              <h2 className={styles.operatorTitle}>
                System Settings
              </h2>

              <p className={styles.operatorLead}>
                The Super Admin governance surface for users, roles, permissions,
                navigation rules, feature flags, auth redirects, platform
                defaults, payment mode, language and currency defaults, AI
                settings, emergency settings, and audit configuration.
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
              <p className={styles.operatorEyebrow}>Platform Settings Control</p>
              <h3 className={styles.operatorPanelTitle}>
                System settings must prevent drift, not create hidden switches
              </h3>
              <p className={styles.operatorPanelText}>
                This module creates the System Settings shell only. It does not
                implement RBAC, change middleware, alter login logic, add feature
                flags, modify schema, change payment mode, or update runtime
                configuration in this lane.
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
              <p className={styles.operatorEyebrow}>Settings Safety Rules</p>
              <h3 className={styles.operatorPanelTitle}>
                Runtime behavior must not be changed casually
              </h3>
              <p className={styles.operatorPanelText}>
                Settings are powerful. They must be explicit, auditable, and
                role-safe before they control production behavior.
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
              Settings connects to Auth, Navigation, Payments, AI, Localization, API, Emergency, and Audit
            </h3>
            <p className={styles.operatorPanelText}>
              System Settings must eventually control high-impact platform
              behavior without mixing Super Admin, LGU/DOT, Operator, Traveler,
              and public surfaces.
            </p>
          </div>

          <div className={styles.operatorLaneGrid}>
            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Auth & Login</h4>
                <span className={styles.operatorLaneStatus}>Redirect safety</span>
              </div>
              <p className={styles.operatorLaneText}>
                Role-aware continuation and destructive traveler-home redirect prevention belong under governed settings.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Payments</h4>
                <span className={styles.operatorLaneStatus}>Mode control</span>
              </div>
              <p className={styles.operatorLaneText}>
                Sandbox/live payment mode, gateway readiness, and payment warnings need explicit Super Admin governance.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>AI Assistant</h4>
                <span className={styles.operatorLaneStatus}>Behavior defaults</span>
              </div>
              <p className={styles.operatorLaneText}>
                Kuya Tala™ behavior, fallback mode, language defaults, and safety escalation should be governed, not hidden.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>API Control</h4>
                <span className={styles.operatorLaneStatus}>Access settings</span>
              </div>
              <p className={styles.operatorLaneText}>
                API partner access, token policy, scopes, rate limits, and suspension defaults need a settings relationship.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.operatorBoundary}>
          <h3>Build boundary: settings shell only, no runtime configuration changes.</h3>
          <p>
            ADMIN-CT-16 creates the System Settings shell. It does not modify
            middleware, login redirects, RBAC, auth enforcement, schema, backend
            logic, feature flag runtime, payment mode, AI runtime, API access,
            emergency settings, navigation behavior, or create a commit.
          </p>
          <p>
            <Link href="/login" className={styles.nuclearActionGhost}>
              View Login
            </Link>{" "}
            <Link href="/admin/control-tower/api" className={styles.nuclearActionGhost}>
              Review API Control
            </Link>{" "}
            <Link href="/admin/control-tower/ai-assistant" className={styles.nuclearActionGhost}>
              Review AI Control
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
}
