"use client";

import type { CSSProperties } from "react";
import shellStyles from "./controlTower.module.css";
import styles from "./controlTowerCommandHome.module.css";


const hardPageStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1240,
  margin: "0 auto",
  padding: "18px 24px 48px",
};

const hardHeroStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 360px",
  gap: 18,
  alignItems: "stretch",
  borderRadius: 28,
  padding: 24,
  background: "linear-gradient(135deg, #013863 0%, #005f7f 52%, #0596a5 100%)",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "0 22px 52px rgba(1,56,99,0.18)",
};

const hardPanelStyle: CSSProperties = {
  marginTop: 18,
  borderRadius: 30,
  padding: 24,
  background: "linear-gradient(180deg, #ffffff 0%, #f4fcfa 100%)",
  border: "1px solid rgba(5,150,165,0.16)",
  boxShadow: "0 18px 46px rgba(1,56,99,0.10)",
};

const hardTileGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 14,
  marginTop: 20,
};

const hardTileStyle: CSSProperties = {
  minHeight: 132,
  borderRadius: 22,
  padding: 18,
  background: "linear-gradient(145deg, #013863 0%, #004d72 58%, #0596a5 100%)",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.16)",
  boxShadow: "0 14px 30px rgba(1,56,99,0.13)",
};

const hardCardGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 14,
  marginTop: 16,
};

const hardCardStyle: CSSProperties = {
  minHeight: 230,
  borderRadius: 24,
  padding: 18,
  background: "#ffffff",
  color: "#013863",
  border: "1px solid rgba(5,150,165,0.13)",
  boxShadow: "0 12px 28px rgba(1,56,99,0.08)",
};


const heroStats = [
  ["Control Mode", "Super Admin"],
  ["Runtime Wiring", "Governed"],
];

const gaugeMetrics = [
  {
    label: "Traveler Flow Readiness",
    value: "84%",
    state: "Strong",
    note: "Traveler routes, app entry, pass visibility, and route continuation.",
    gauge: 84,
  },
  {
    label: "QR / Pass Control",
    value: "78%",
    state: "Protected",
    note: "QR identity, OSP Pass, trip readiness, and regulated activity states.",
    gauge: 78,
  },
  {
    label: "Marketplace Governance",
    value: "71%",
    state: "Gated",
    note: "Operator exposure, category readiness, service media, and pricing guardrails.",
    gauge: 71,
  },
  {
    label: "Public Intelligence Boundary",
    value: "68%",
    state: "Separated",
    note: "Public, LGU, operator, and traveler views remain separated from Super Admin private controls.",
    gauge: 68,
  },
];

const commandTiles = [
  {
    label: "Projected Daily Travelers",
    value: "1.2K",
    delta: "Model range",
    note: "Future live source: registrations, trips, QR scans.",
  },
  {
    label: "QR Touchpoints",
    value: "9",
    delta: "Control layer",
    note: "Arrival, pass, tour, trail, payment, checkpoint, safety, exit.",
  },
  {
    label: "Operator Readiness",
    value: "64%",
    delta: "Governed state",
    note: "Future live source: approvals, media, pricing, compliance.",
  },
  {
    label: "Public Exposure Risk",
    value: "Low",
    delta: "Guarded",
    note: "Incomplete listings and unverified pricing remain blocked.",
  },
];

const barSignals = [
  ["Traveler App", 86],
  ["QR / Pass", 78],
  ["Explore", 74],
  ["Passport Trails", 72],
  ["Operator Exposure", 64],
  ["Payments", 58],
  ["Data Boundary", 68],
];

const distribution = [
  ["Traveler App", "31%"],
  ["Marketplace", "24%"],
  ["QR / Pass", "20%"],
  ["Passport Trails", "14%"],
  ["Payments", "7%"],
  ["Public Intel", "4%"],
];

const trafficPoints = [42, 58, 51, 68, 64, 78, 72, 84, 79, 91, 88, 96];

const readinessRows = [
  ["Traveler identity and profile", "Ready for wiring", "82%"],
  ["OSP Pass and QR identity", "Protected state", "78%"],
  ["Operator marketplace exposure", "Gate required", "64%"],
  ["Payment and receipt visibility", "Sandbox controlled", "58%"],
  ["LGU / DOT aggregate boundary", "Separated", "68%"],
];

const riskRows = [
  ["Unverified operator public listing", "Blocked"],
  ["Raw accommodation import exposure", "Blocked"],
  ["Unapproved AI pricing or inclusion claim", "Blocked"],
  ["Private traveler data in public/LGU view", "Blocked"],
];

export function ControlTowerCommandCenter() {
  return (
    <section className={shellStyles.content}>
      <div className={styles.page} style={hardPageStyle}>
        <section className={styles.commandStrip} style={hardHeroStyle}>
          <div className={styles.commandIdentity}>
            <p className={styles.kicker}>Super Admin Operating Console</p>
            <h1 className={styles.commandTitle}>One Siargao Pass Command Center</h1>
            <span>
              Protected operating cockpit for OSP, SPM, commercial governance, QR compliance, marketplace exposure, payments, AI behavior, API readiness, and platform settings. Live runtime wiring must remain governed and audit-safe.
            </span>
          </div>

          <div className={styles.heroStats}>
            {heroStats.map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.dataCenter} style={hardPanelStyle}>
          <div className={styles.dataHeader}>
            <div>
              <p className={styles.eyebrow}>OSP Command Metrics Cockpit</p>
              <h2>Destination Operations Data Center</h2>
              <span>
                Super Admin command cockpit showing traveler readiness, QR/pass governance, operator exposure control, marketplace integrity, payment readiness, and public launch safety.
              </span>
            </div>

            <div className={styles.modeStack}>
              <strong>Governed metrics mode</strong>
              <strong>Runtime wiring governed</strong>
              <strong>No fake live data</strong>
            </div>
          </div>

          <div className={styles.commandTileGrid} style={hardTileGridStyle}>
            {commandTiles.map((tile) => (
              <article className={styles.commandTile} style={hardTileStyle} key={tile.label}>
                <span>{tile.label}</span>
                <div>
                  <strong>{tile.value}</strong>
                  <em>{tile.delta}</em>
                </div>
                <small>{tile.note}</small>
              </article>
            ))}
          </div>

          <div className={styles.gaugeGrid} style={hardCardGridStyle}>
            {gaugeMetrics.map((metric) => (
              <article className={styles.gaugeCard} style={hardCardStyle} key={metric.label}>
                <div className={styles.gaugeTop}>
                  <span>{metric.label}</span>
                  <strong>{metric.state}</strong>
                </div>

                <div
                  className={styles.gauge}
                  style={{ "--value": `${metric.gauge * 3.6}deg` } as CSSProperties}
                >
                  <div className={styles.gaugeNeedle} />
                  <div className={styles.gaugeInner}>
                    <strong>{metric.value}</strong>
                    <small>governed state</small>
                  </div>
                </div>

                <p>{metric.note}</p>
              </article>
            ))}
          </div>

          <div className={styles.visualGrid}>
            <article className={styles.chartPanelDark}>
              <div className={styles.panelHead}>
                <p>Traveler Demand Signal</p>
                <strong>Projected movement trend</strong>
                <span>Reserved chart surface for future traveler and QR event data.</span>
              </div>
              <div className={styles.lineChart}>
                {trafficPoints.map((point, index) => (
                  <i
                    key={`${point}-${index}`}
                    style={{
                      height: `${point}%`,
                      left: `${(index / (trafficPoints.length - 1)) * 100}%`,
                    }}
                  />
                ))}
                <div className={styles.chartGrid} />
              </div>
            </article>

            <article className={styles.chartPanel}>
              <div className={styles.panelHead}>
                <p>Governance Distribution</p>
                <strong>Control surface mix</strong>
                <span>Shows which operating lanes the Command Center is built to govern.</span>
              </div>

              <div className={styles.donutWrap}>
                <div className={styles.donut}>
                  <span>OSP</span>
                  <strong>Control</strong>
                </div>

                <div className={styles.legend}>
                  {distribution.map(([label, value]) => (
                    <span key={label}>
                      <i />
                      <strong>{label}</strong>
                      <em>{value}</em>
                    </span>
                  ))}
                </div>
              </div>
            </article>

            <article className={styles.chartPanel}>
              <div className={styles.panelHead}>
                <p>Module Readiness Graph</p>
                <strong>Launch control signals</strong>
                <span>Readiness bars reserved for route, schema, and admin workflow state wiring.</span>
              </div>

              <div className={styles.barChart}>
                {barSignals.map(([label, value]) => (
                  <div className={styles.barRow} key={label}>
                    <span>{label}</span>
                    <div>
                      <i style={{ width: `${value}%` }} />
                    </div>
                    <strong>{value}%</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className={styles.mapPanel}>
              <div className={styles.panelHead}>
                <p>Destination Flow Map</p>
                <strong>Traveler operating path</strong>
                <span>Reserved map surface for arrivals, pass issuance, discovery, QR validation, and aggregate intelligence.</span>
              </div>

              <div className={styles.flowMap}>
                <span className={styles.nodeA}>Arrival</span>
                <span className={styles.nodeB}>OSP Pass</span>
                <span className={styles.nodeC}>Explore</span>
                <span className={styles.nodeD}>QR Scan</span>
                <span className={styles.nodeE}>Aggregate View</span>
                <i className={styles.pathOne} />
                <i className={styles.pathTwo} />
                <i className={styles.pathThree} />
              </div>
            </article>
          </div>

          <div className={styles.opsGrid}>
            <article className={styles.readinessPanel}>
              <div className={styles.panelHead}>
                <p>Readiness Matrix</p>
                <strong>Control Tower live-wiring roadmap</strong>
              </div>

              <div className={styles.readinessTable}>
                {readinessRows.map(([label, state, value]) => (
                  <span key={label}>
                    <strong>{label}</strong>
                    <em>{state}</em>
                    <b>{value}</b>
                  </span>
                ))}
              </div>
            </article>

            <article className={styles.riskPanel}>
              <div className={styles.panelHead}>
                <p>Risk Guard</p>
                <strong>Unsafe public states blocked</strong>
              </div>

              <div className={styles.riskList}>
                {riskRows.map(([label, state]) => (
                  <span key={label}>
                    <strong>{label}</strong>
                    <em>{state}</em>
                  </span>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}
