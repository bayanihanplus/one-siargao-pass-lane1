import Link from "next/link";
import { controlTowerGateData, type ControlTowerGateKey } from "./controlTowerGateData";
import styles from "./controlTower.module.css";

type Props = {
  gateKey: ControlTowerGateKey;
};

function renderList(items: string[]) {
  return items.map((item) => (
    <article key={item} className={styles.gateListItem}>
      <h4 className={styles.gateItemTitle}>{item}</h4>
    </article>
  ));
}

function renderActionList(items: string[]) {
  return items.map((item, index) => (
    <article key={item} className={styles.gateAction}>
      <div className={styles.gateActionTop}>
        <div className={styles.gateActionCode}>{String(index + 1).padStart(2, "0")}</div>
        <div>
          <h4 className={styles.gateActionTitle}>{item}</h4>
          <p className={styles.gateActionText}>
            Control Tower action lane. This is a real operating lane, not a placeholder.
          </p>
        </div>
      </div>
    </article>
  ));
}

export function ControlTowerGatePage({ gateKey }: Props) {
  const gate = controlTowerGateData[gateKey];

  return (
    <section className={styles.content}>
      <div className={styles.gateDeck}>
        <div className={styles.gateHero}>
          <div className={styles.gateHeroInner}>
            <div>
              <div className={styles.gateKicker}>
                <span className={styles.nuclearPulse} />
                Module {gate.code} / Super Admin Gate
              </div>

              <h2 className={styles.gateTitle}>{gate.title}</h2>

              <p className={styles.gateLead}>{gate.subtitle}</p>
            </div>

            <div className={styles.gateHeroGrid}>
              <article className={styles.gateStatusCard}>
                <p className={styles.gateMetricLabel}>Readiness</p>
                <h3 className={styles.gateMetricValue}>{gate.readiness}</h3>
                <p className={styles.gateMetricText}>
                  This route exists as a Control Tower gate page. Live wiring continues in later lanes.
                </p>
              </article>

              <article className={styles.gateStatusCard}>
                <p className={styles.gateMetricLabel}>Data State</p>
                <h3 className={styles.gateMetricValue}>{gate.dataState}</h3>
                <p className={styles.gateMetricText}>
                  No fake live data claims. Unwired values remain explicitly labeled.
                </p>
              </article>

              <article className={styles.gateStatusCard}>
                <p className={styles.gateMetricLabel}>Exposure</p>
                <h3 className={styles.gateMetricValue}>{gate.exposureState}</h3>
                <p className={styles.gateMetricText}>
                  Public visibility must be governed by readiness, permissions, and approval logic.
                </p>
              </article>
            </div>
          </div>
        </div>

        <div className={styles.gateOpsGrid}>
          <section className={styles.gatePanel}>
            <div className={styles.gatePanelHead}>
              <p className={styles.gateEyebrow}>Module Purpose</p>
              <h3 className={styles.gatePanelTitle}>Why this module exists</h3>
              <p className={styles.gatePanelText}>{gate.purpose}</p>
            </div>

            <div className={styles.gateList}>
              <article className={styles.gateListItem}>
                <h4 className={styles.gateItemTitle}>Commercial / Operational Role</h4>
                <p className={styles.gateItemText}>{gate.operationalRole}</p>
              </article>

              <article className={styles.gateListItem}>
                <h4 className={styles.gateItemTitle}>Backend / Schema Dependency</h4>
                <p className={styles.gateItemText}>
                  {gate.backendDependencies.join(" · ")}
                </p>
              </article>
            </div>
          </section>

          <aside className={styles.gateRiskPanel}>
            <div className={styles.gatePanelHead}>
              <p className={styles.gateEyebrow}>Public Exposure Risk</p>
              <h3 className={styles.gatePanelTitle}>What must not leak or drift</h3>
              <p className={styles.gatePanelText}>{gate.publicExposureRisk}</p>
            </div>

            <div className={styles.gateList}>
              {gate.knownBlockers.map((blocker) => (
                <article key={blocker} className={styles.gateListItem}>
                  <h4 className={styles.gateItemTitle}>Known Blocker</h4>
                  <p className={styles.gateItemText}>{blocker}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <section className={styles.gatePanel}>
          <div className={styles.gatePanelHead}>
            <p className={styles.gateEyebrow}>Immediate Action Lanes</p>
            <h3 className={styles.gatePanelTitle}>Next controlled build paths</h3>
            <p className={styles.gatePanelText}>
              These lanes define what this module should absorb next. They are intentionally explicit to prevent scattered console drift.
            </p>
          </div>

          <div className={styles.gateActionGrid}>
            {renderActionList(gate.actionLanes)}
          </div>
        </section>

        <section className={styles.gatePanel}>
          <div className={styles.gatePanelHead}>
            <p className={styles.gateEyebrow}>Connected Existing Routes</p>
            <h3 className={styles.gatePanelTitle}>Current surfaces this module must govern</h3>
            <p className={styles.gatePanelText}>
              These are current or planned surfaces that must plug into this Control Tower module instead of becoming disconnected admin pages.
            </p>
          </div>

          <div className={styles.gateList}>
            {renderList(gate.connectedRoutes)}
          </div>
        </section>

        <section className={styles.gateFooter}>
          <h3>No generic placeholder accepted.</h3>
          <p>
            This gate page exists to define module ownership, operational control,
            blockers, dependencies, action lanes, and exposure risk. It does not
            wire fake live data, delete old routes, redirect legacy pages, touch
            database schema, add backend logic, or create a commit.
          </p>
          <p>
            <Link href="/admin/control-tower/command-center" className={styles.nuclearActionGhost}>
              Back to Command Center
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
}
