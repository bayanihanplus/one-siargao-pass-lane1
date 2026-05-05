'use client';

import Link from 'next/link';
import styles from './controlTowerSpm.module.css';
import AdminSpmOperationalControlsShell from './AdminSpmOperationalControlsShell';

export default function ControlTowerSpmPage() {
  return (
    <main className={styles.surface}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>SPM / Passport Trails Control Tower</p>
          <h1>SPM Control</h1>
          <p className={styles.lede}>
            Govern the traveler-facing Passport Map product from one protected control surface:
            trail families, map nodes, stamp rules, partner mapping, pricing-rule assignment,
            media readiness, and frontend exposure.
          </p>

          <div className={styles.heroActions}>
            <Link href="/admin/control-tower" className={styles.secondaryButton}>
              Back to Command Center
            </Link>
            <Link href="/admin/control-tower/pricing" className={styles.primaryButton}>
              Open Pricing Governance
            </Link>
          </div>
        </div>

        <div className={styles.heroMeta} aria-label="SPM operating boundaries">
          <div>
            <span>Final home</span>
            <strong>/admin/control-tower/spm</strong>
          </div>
          <div>
            <span>Traveler rule</span>
            <strong>Approved + published only</strong>
          </div>
          <div>
            <span>Build lane</span>
            <strong>ADMIN-CT-SPM-09E</strong>
          </div>
        </div>
      </section>

      <AdminSpmOperationalControlsShell />
    </main>
  );
}
