import LegacyTourArchitecturePage from "../../../commercial/tour-architecture/page";
import styles from "../../../../../src/admin/controlTower/controlTower.module.css";

export default function ControlTowerSpmTourArchitecturePage() {
  return (
    <section className={styles.content}>
      <div className={styles.migrationBanner}>
        <p className={styles.migrationBannerLabel}>
          ADMIN-CT-04 / Migrated Module
        </p>
        <h2 className={styles.migrationBannerTitle}>
          SPM Tour Architecture now lives inside Super Admin Control Tower
        </h2>
        <p className={styles.migrationBannerText}>
          This page is no longer treated as an isolated Admin Commercial console.
          It now sits under Super Admin Control Tower → SPM / Passport Trails.
          The old /admin/commercial/tour-architecture route remains untouched
          until ADMIN-CT-05 route audit and classification.
        </p>
      </div>

      <LegacyTourArchitecturePage />
    </section>
  );
}
