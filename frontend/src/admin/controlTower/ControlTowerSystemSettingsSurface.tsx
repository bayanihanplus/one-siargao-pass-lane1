"use client";

import styles from "./controlTower.module.css";
import {
  CONTROL_TOWER_SETTINGS_CONTROLS,
  getEnabledSettingsControls,
  getLockedSettingsControls,
  type SettingsControlContract,
} from "./controlTowerSettingsRegistry";

function SettingsControlCard({ control }: { control: SettingsControlContract }) {
  return (
    <article
      className={`${styles.settingsControlCard} ${
        control.enabled ? "" : styles.settingsControlCardLocked
      }`}
    >
      <div className={styles.settingsControlTopline}>
        <span>{control.section.replaceAll("_", " ")}</span>
        <strong>{control.risk}</strong>
      </div>
      <h4>{control.label}</h4>
      <p>{control.description}</p>

      <div className={styles.settingsControlStateGrid}>
        <div>
          <span>Current state</span>
          <small>{control.currentState}</small>
        </div>
        <div>
          <span>Target control</span>
          <small>{control.targetControl}</small>
        </div>
      </div>

      <div className={styles.settingsControlFooter}>
        <span>{control.mode.replaceAll("_", " ")}</span>
        <span>{control.requiresAuditLog ? "Audit required" : "No live mutation"}</span>
      </div>

      {!control.enabled && control.lockedReason ? (
        <small className={styles.settingsLockedReason}>{control.lockedReason}</small>
      ) : null}
    </article>
  );
}

export function ControlTowerSystemSettingsSurface() {
  const enabledControls = getEnabledSettingsControls();
  const lockedControls = getLockedSettingsControls();

  return (
    <section className={styles.settingsSurface}>
      <div className={styles.settingsSurfaceHero}>
        <p className={styles.settingsSurfaceEyebrow}>
          ADMIN-CT-30 / Frontend control surface
        </p>
        <h3 className={styles.settingsSurfaceTitle}>
          System Settings now shows what the platform can control before live mutation is unlocked.
        </h3>
        <p className={styles.settingsSurfaceText}>
          This is the first real frontend control surface for OSP Command Center.
          It organizes navigation, auth routing, discovery visibility, feature
          flags, payment mode, Kuya Tala™, brand UI doctrine, and VPS readiness
          into governed controls. Runtime mutation remains locked.
        </p>
      </div>

      <div className={styles.settingsSurfaceStats}>
        <article>
          <span>Total controls</span>
          <strong>{CONTROL_TOWER_SETTINGS_CONTROLS.length}</strong>
        </article>
        <article>
          <span>Display/config ready</span>
          <strong>{enabledControls.length}</strong>
        </article>
        <article>
          <span>Mutation locked</span>
          <strong>{lockedControls.length}</strong>
        </article>
      </div>

      <div className={styles.settingsSurfaceGrid}>
        {CONTROL_TOWER_SETTINGS_CONTROLS.map((control) => (
          <SettingsControlCard key={control.key} control={control} />
        ))}
      </div>

      <div className={styles.settingsSurfaceBoundary}>
        <strong>Boundary locked:</strong>
        <span>
          This page can govern frontend control intent now. It cannot change
          middleware, auth redirects, payment mode, feature flags, AI rules, or
          production UI globally until backend settings mutation contracts exist.
        </span>
      </div>
    </section>
  );
}
