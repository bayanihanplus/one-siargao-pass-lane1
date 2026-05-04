import type { ControlTowerNavItem } from "./controlTowerNav";
import styles from "./controlTower.module.css";

type Props = {
  item: ControlTowerNavItem;
};

function readinessClass(readiness: ControlTowerNavItem["readiness"]) {
  if (readiness === "Shell Ready") return styles.ready;
  if (readiness === "Migration Pending") return styles.migration;
  return styles.pending;
}

export function ControlTowerModuleCard({ item }: Props) {
  return (
    <article className={styles.moduleCard}>
      <div className={styles.moduleTop}>
        <div className={styles.moduleIdentity}>
          <div className={styles.moduleCode}>{item.code}</div>
          <div>
            <h3 className={styles.moduleTitle}>{item.label}</h3>
            <p className={styles.modulePath}>/{item.key}</p>
          </div>
        </div>

        <span className={`${styles.readiness} ${readinessClass(item.readiness)}`}>
          {item.readiness}
        </span>
      </div>

      <p className={styles.modulePurpose}>{item.purpose}</p>

      <div className={styles.riskBox}>
        <p className={styles.riskLabel}>Control Risk</p>
        <p className={styles.riskText}>{item.risk}</p>
      </div>
    </article>
  );
}
