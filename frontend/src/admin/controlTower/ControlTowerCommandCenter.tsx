import Link from "next/link";
import { controlTowerNav } from "./controlTowerNav";
import styles from "./controlTower.module.css";
import { ControlTowerContractStatus } from "./ControlTowerContractStatus";
import { ControlTowerReadinessBoard } from "./ControlTowerReadinessBoard";

const heroMetrics = [
  {
    label: "Control Spine",
    value: "A–O",
    text: "Final Super Admin module homes established.",
  },
  {
    label: "Data Claims",
    value: "0",
    text: "No fake live counters. Control-state only.",
  },
  {
    label: "Build Mode",
    value: "No Commit",
    text: "Browser QA must pass before commit guidance.",
  },
];

const executiveBlocks = [
  {
    title: "Platform Health",
    state: "Shell online",
    body:
      "The Control Tower route, shell, active navigation, module registry, and command-center surface are present. Live health data is not wired yet.",
  },
  {
    title: "Pending Approvals",
    state: "Not wired yet",
    body:
      "Future source: operator approvals, accommodation readiness, service exposure, media review, pricing review, and compliance exceptions.",
  },
  {
    title: "Commercial Blockers",
    state: "Control-state only",
    body:
      "Future source: missing base rates, missing public SRP, incomplete payout rules, PayMongo readiness, and marketplace exposure suppression.",
  },
  {
    title: "QR / Movement Signals",
    state: "Not wired yet",
    body:
      "Future source: QR identity checks, pass validation, trail stamps, ingress, egress, activity check-in, boarding, disembarkation, and exceptions.",
  },
  {
    title: "AI Assistant Risk",
    state: "Control-state only",
    body:
      "Future source: Kuya Tala™ rejected answers, unsafe fallback attempts, missing approved knowledge, emergency escalation, and pricing guardrails.",
  },
  {
    title: "API Partner Status",
    state: "Not wired yet",
    body:
      "Future source: partner tokens, scopes, webhook logs, rate limits, booking intake, QR issuance API, and suspension state.",
  },
];

const commandRail = [
  {
    code: "01",
    title: "Protect the parent spine",
    text:
      "Every future admin feature must declare its Control Tower home before code. No standalone console drift.",
  },
  {
    code: "02",
    title: "Separate public exposure from onboarding",
    text:
      "Operators and accommodations may enter early, but they do not become public-ready until gates pass.",
  },
  {
    code: "03",
    title: "Centralize money logic",
    text:
      "Pricing, margins, commissions, fees, FX, payouts, and refunds belong in governance, not feature pages.",
  },
  {
    code: "04",
    title: "Keep LGU/DOT views protected",
    text:
      "Super Admin sees private platform intelligence. LGU/DOT gets aggregated views only, never commercial control.",
  },
];

const criticalRules = [
  {
    title: "No generic SaaS dashboard",
    text:
      "Every panel must describe an actual OSP/SPM operating decision, risk, dependency, or control action.",
  },
  {
    title: "No invisible hero header",
    text:
      "Main headers on dark, teal, navy, or gradient shells must remain white or high-contrast light foreground.",
  },
  {
    title: "No bulky typography",
    text:
      "Use refined command-center hierarchy: strong but not blocky, premium, readable, and executive-grade.",
  },
  {
    title: "No fake live data",
    text:
      "Unwired metrics must be labeled as not wired, control-state only, or future source. Never pretend.",
  },
];

export function ControlTowerCommandCenter() {
  return (
    <section className={styles.content}>
      <ControlTowerContractStatus />
      <ControlTowerReadinessBoard />
      <div className={styles.commandDeck}>
        <div className={styles.nuclearHero}>
          <div className={styles.nuclearHeroInner}>
            <div className={styles.nuclearHeroTop}>
              <div>
                <div className={styles.nuclearKicker}>
                  <span className={styles.nuclearPulse} />
                  ADMIN-CT-02A / Nuclear Command Build
                </div>

                <h2 className={styles.nuclearTitle}>
                  One Siargao Pass Command Center
                </h2>

                <p className={styles.nuclearLead}>
                  A real operating console for governing OSP, SPM, marketplace
                  exposure, commercial readiness, pricing, payments, QR
                  compliance, AI behavior, API access, and destination
                  intelligence from one protected command spine.
                </p>

                <div className={styles.nuclearHeroActions}>
                  <Link
                    href="/admin/control-tower/spm"
                    className={styles.nuclearActionPrimary}
                  >
                    Open SPM Control Lane
                  </Link>
                  <Link
                    href="/admin/control-tower/settings"
                    className={styles.nuclearActionGhost}
                  >
                    Review System Settings
                  </Link>
                </div>
              </div>
            </div>

            <div className={styles.nuclearStatusWall}>
              {heroMetrics.map((metric) => (
                <article key={metric.label} className={styles.nuclearStatusCard}>
                  <p className={styles.nuclearMetricLabel}>{metric.label}</p>
                  <h3 className={styles.nuclearMetricValue}>{metric.value}</h3>
                  <p className={styles.nuclearMetricText}>{metric.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.opsGrid}>
          <section className={styles.opsPanel}>
            <div className={styles.opsPanelHead}>
              <p className={styles.opsEyebrow}>Executive Readiness Board</p>
              <h3 className={styles.opsTitle}>
                Control-state signals without fake production counters
              </h3>
              <p className={styles.opsText}>
                This is the OSP Command Center view of operational readiness. It is
                designed to show what the platform controls, what is blocked,
                what is not wired yet, and where risk lives before VPS.
              </p>
            </div>

            <div className={styles.controlMatrix}>
              {executiveBlocks.map((block) => (
                <article key={block.title} className={styles.controlCell}>
                  <div className={styles.controlTop}>
                    <h4 className={styles.controlLabel}>{block.title}</h4>
                    <span className={styles.controlState}>{block.state}</span>
                  </div>
                  <p className={styles.controlBody}>{block.body}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className={styles.opsPanel}>
            <div className={styles.opsPanelHead}>
              <p className={styles.opsEyebrow}>Command Doctrine</p>
              <h3 className={styles.opsTitle}>What this console must enforce</h3>
              <p className={styles.opsText}>
                These are not decorative cards. They are operating controls that
                prevent page sprawl, commercial drift, exposure mistakes, and
                governance failure.
              </p>
            </div>

            <div className={styles.commandRail}>
              {commandRail.map((item) => (
                <article key={item.code} className={styles.railItem}>
                  <div className={styles.railCode}>{item.code}</div>
                  <div>
                    <h4 className={styles.railTitle}>{item.title}</h4>
                    <p className={styles.railText}>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.criticalStrip}>
              {criticalRules.map((rule) => (
                <article key={rule.title} className={styles.criticalItem}>
                  <span className={styles.criticalDot} />
                  <div>
                    <h4 className={styles.criticalTitle}>{rule.title}</h4>
                    <p className={styles.criticalText}>{rule.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <section className={styles.opsPanel}>
          <div className={styles.opsPanelHead}>
            <p className={styles.opsEyebrow}>A–O Super Admin Module Map</p>
            <h3 className={styles.opsTitle}>
              Every future admin page must live inside this command structure
            </h3>
            <p className={styles.opsText}>
              This is the platform governance map before VPS. Gate pages,
              migrations, and data wiring continue in the next ADMIN-CT lanes.
            </p>
          </div>

          <div className={styles.moduleCommandGrid}>
            {controlTowerNav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={styles.moduleCommandCard}
              >
                <div className={styles.moduleCommandTop}>
                  <div className={styles.moduleCommandCode}>{item.code}</div>
                  <div>
                    <h4 className={styles.moduleCommandTitle}>{item.label}</h4>
                    <p className={styles.moduleCommandMeta}>{item.readiness}</p>
                  </div>
                </div>
                <p className={styles.moduleCommandText}>{item.purpose}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.nuclearFooterNote}>
          <h3>Build boundary: nuclear UI, no destructive architecture change.</h3>
          <p>
            ADMIN-CT-02A upgrades the One Siargao Pass Command Center into a serious
            executive-grade operating console. It does not delete old routes,
            redirect legacy pages, wire fake counters, touch database schema,
            add backend logic, or create a commit.
          </p>
        </section>
      </div>
    </section>
  );
}
