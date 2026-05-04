"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./controlTower.module.css";
import {
  loadControlTowerOverviewContract,
  type ControlTowerContractLoadState,
} from "./controlTowerContractApi";

export function ControlTowerContractStatus() {
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

  const summary = useMemo(() => {
    if (!state || state.status !== "ready") {
      return {
        totalAreas: "—",
        contractReady: "—",
        highRisk: "—",
      };
    }

    return {
      totalAreas: String(state.data.areas.length),
      contractReady: String(
        state.data.areas.filter((area) => area.readiness === "CONTRACT_READY")
          .length,
      ),
      highRisk: String(
        state.data.areas.filter(
          (area) => area.riskLevel === "HIGH" || area.riskLevel === "CRITICAL",
        ).length,
      ),
    };
  }, [state]);

  return (
    <section className={styles.contractAdapterPanel}>
      <div>
        <p className={styles.contractAdapterEyebrow}>
          Backend Contract Adapter / No Live Metrics
        </p>
        <h3 className={styles.contractAdapterTitle}>
          OSP Command Center is now reading contract readiness from the backend.
        </h3>
        <p className={styles.contractAdapterText}>
          This adapter reads the ADMIN_CT_V1 CONTRACT_ONLY endpoint. It does not
          display live analytics, fake counters, payout values, QR movement
          totals, traveler data, LGU/DOT intelligence, or DB-backed operational
          metrics.
        </p>
      </div>

      <div className={styles.contractAdapterGrid}>
        <article className={styles.contractAdapterCard}>
          <span>Contract endpoint</span>
          <strong>{state?.status === "ready" ? "Connected" : "Checking"}</strong>
          <small>{state?.endpoint || "Resolving backend endpoint..."}</small>
        </article>

        <article className={styles.contractAdapterCard}>
          <span>Contract areas</span>
          <strong>{summary.totalAreas}</strong>
          <small>Backend-declared OSP Command Center areas only.</small>
        </article>

        <article className={styles.contractAdapterCard}>
          <span>Contract-ready areas</span>
          <strong>{summary.contractReady}</strong>
          <small>Readiness labels, not live performance metrics.</small>
        </article>

        <article className={styles.contractAdapterCard}>
          <span>High-risk contract lanes</span>
          <strong>{summary.highRisk}</strong>
          <small>Risk classification only; no live risk scoring.</small>
        </article>
      </div>

      {state?.status === "unavailable" ? (
        <div className={styles.contractAdapterWarning}>
          <strong>Contract endpoint unavailable.</strong>
          <span>{state.error}</span>
        </div>
      ) : null}

      {state?.status === "ready" ? (
        <div className={styles.contractAdapterBoundary}>
          <strong>Boundary:</strong>
          <span>
            {state.data.mode}. {state.data.globalBlockers[0]}
          </span>
        </div>
      ) : null}
    </section>
  );
}
