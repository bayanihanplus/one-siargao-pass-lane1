"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./controlTower.module.css";
import {
  loadControlTowerOverviewContract,
  type ControlTowerAreaContract,
  type ControlTowerContractLoadState,
} from "./controlTowerContractApi";

const riskOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;

function groupByRisk(areas: ControlTowerAreaContract[]) {
  return riskOrder
    .map((riskLevel) => ({
      riskLevel,
      areas: areas.filter((area) => area.riskLevel === riskLevel),
    }))
    .filter((group) => group.areas.length > 0);
}

function groupByReadiness(areas: ControlTowerAreaContract[]) {
  const groups = new Map<string, ControlTowerAreaContract[]>();

  for (const area of areas) {
    const existing = groups.get(area.readiness) || [];
    existing.push(area);
    groups.set(area.readiness, existing);
  }

  return Array.from(groups.entries()).map(([readiness, groupAreas]) => ({
    readiness,
    areas: groupAreas,
  }));
}

export function ControlTowerReadinessBoard() {
  const [state, setState] = useState<ControlTowerContractLoadState | null>(null);

  useEffect(() => {
    let mounted = true;

    loadControlTowerOverviewContract().then((result) => {
      if (mounted) setState(result);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const areas = state?.status === "ready" ? state.data.areas : [];

  const readinessGroups = useMemo(() => groupByReadiness(areas), [areas]);
  const riskGroups = useMemo(() => groupByRisk(areas), [areas]);

  return (
    <section className={styles.readinessBoard}>
      <div className={styles.readinessBoardHeader}>
        <p className={styles.readinessBoardEyebrow}>
          ADMIN-CT-26 / Read-only contract wiring
        </p>
        <h3 className={styles.readinessBoardTitle}>
          Module readiness is now grouped from backend command-center contract truth.
        </h3>
        <p className={styles.readinessBoardText}>
          This board uses the existing contract endpoint only. It groups
          OSP Command Center modules by readiness and risk classification. It does
          not query Prisma, count travelers, calculate revenue, expose QR
          movement totals, or claim live operational intelligence.
        </p>
      </div>

      {state?.status === "unavailable" ? (
        <div className={styles.readinessBoardWarning}>
          <strong>Read-only contract board unavailable.</strong>
          <span>{state.error}</span>
        </div>
      ) : null}

      <div className={styles.readinessBoardGrid}>
        <article className={styles.readinessColumn}>
          <div className={styles.readinessColumnHead}>
            <span>Readiness grouping</span>
            <strong>{areas.length || "—"} areas</strong>
          </div>

          {readinessGroups.length ? (
            readinessGroups.map((group) => (
              <div key={group.readiness} className={styles.readinessGroup}>
                <div className={styles.readinessGroupHead}>
                  <strong>{group.readiness.replaceAll("_", " ")}</strong>
                  <span>{group.areas.length}</span>
                </div>
                <div className={styles.readinessAreaList}>
                  {group.areas.map((area) => (
                    <a
                      key={area.area}
                      href={area.route}
                      className={styles.readinessAreaLink}
                    >
                      <span>{area.title}</span>
                      <small>{area.nextBackendLane}</small>
                    </a>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className={styles.readinessEmpty}>
              Waiting for ADMIN_CT_V1 contract response.
            </p>
          )}
        </article>

        <article className={styles.readinessColumn}>
          <div className={styles.readinessColumnHead}>
            <span>Risk grouping</span>
            <strong>classification only</strong>
          </div>

          {riskGroups.length ? (
            riskGroups.map((group) => (
              <div key={group.riskLevel} className={styles.readinessGroup}>
                <div className={styles.readinessGroupHead}>
                  <strong>{group.riskLevel}</strong>
                  <span>{group.areas.length}</span>
                </div>
                <div className={styles.readinessAreaList}>
                  {group.areas.map((area) => (
                    <div key={area.area} className={styles.riskAreaCard}>
                      <strong>{area.title}</strong>
                      <p>{area.hardBoundary}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className={styles.readinessEmpty}>
              Risk classification will appear after contract load.
            </p>
          )}
        </article>
      </div>

      <div className={styles.readinessBoundary}>
        <strong>Boundary locked:</strong>
        <span>
          Contract grouping only. No live metrics. No DB-backed counts. No
          mutation actions. No LGU/DOT intelligence leakage.
        </span>
      </div>
    </section>
  );
}
