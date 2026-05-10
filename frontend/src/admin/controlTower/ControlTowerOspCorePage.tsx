"use client";

import type { CSSProperties } from "react";
import shellStyles from "./controlTower.module.css";
import styles from "./controlTowerOspCore.module.css";

const coreMetrics = [
  {
    label: "QR Identity Spine",
    value: "Core",
    state: "Protected",
    note: "Traveler identity, QR credential, OSP Pass, and trip record linkage.",
    gauge: 84,
  },
  {
    label: "Trip Readiness",
    value: "Mapped",
    state: "Controlled",
    note: "Trip dates, pass validity, regulated activity state, and readiness messaging.",
    gauge: 78,
  },
  {
    label: "Route Boundary",
    value: "Guarded",
    state: "Enforced",
    note: "Public discovery separated from protected traveler, operator, LGU, and admin surfaces.",
    gauge: 81,
  },
];

const commandStats = [
  ["Identity Layer", "QR + Traveler"],
  ["Pass Layer", "OSP Pass Code"],
  ["Trip Layer", "Readiness States"],
  ["Boundary Layer", "Public / Protected"],
];

const spineRows = [
  ["Traveler Account", "Captures profile and identity basis", "QR-ready foundation"],
  ["QR Credential", "Links person to verifiable access token", "Protected identity"],
  ["OSP Pass", "Connects traveler to trip validity window", "Pass code issued"],
  ["Trip Record", "Anchors dates, bookings, movement, and readiness", "Operational spine"],
  ["Activity State", "Separates normal travel from regulated trip clearance", "No false friction"],
];

const flowNodes = [
  "Register",
  "QR Identity",
  "OSP Pass",
  "Trip",
  "Explore",
  "Payment",
  "LGU-safe aggregate",
];

const riskControls = [
  ["Traveler QR blocked by trip clearance", "Rejected"],
  ["Non-regulated activities showing LGU review friction", "Rejected"],
  ["Traveler home used as public discovery", "Rejected"],
  ["Private traveler data visible to LGU surface", "Blocked"],
  ["Route continuation using stale next path", "Blocked"],
];

const doctrineCards = [
  {
    title: "QR identity issues early",
    text: "Traveler identity and QR credential should exist immediately after account creation. Clearance changes permission, not basic identity existence.",
    badge: "Identity",
  },
  {
    title: "OSP Pass anchors the trip",
    text: "Pass code and valid dates must be generated from actual trip dates or later booking states, not from arbitrary page flow.",
    badge: "Pass",
  },
  {
    title: "Clearance is activity-specific",
    text: "Island-hopping and regulated movement can require LGU clearance. Normal exploration should not inherit unnecessary review friction.",
    badge: "Compliance",
  },
  {
    title: "Routes must stay role-aware",
    text: "Traveler, operator, admin, and LGU continuation must route to their own surface without stale traveler-home redirect bugs.",
    badge: "Routing",
  },
];

export function ControlTowerOspCorePage() {
  return (
    <section className={shellStyles.content}>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>OSP Core Operating Spine</p>
            <h1>Identity, Pass, Trip, QR, and Route Governance</h1>
            <span>
              Nuclear Super Admin view of the One Siargao Pass core: traveler
              identity, QR credential, OSP Pass, trip readiness, protected route
              boundaries, and LGU-safe operational separation.
            </span>
          </div>

          <div className={styles.heroConsole}>
            {commandStats.map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.metricsDeck}>
          <div className={styles.deckHeader}>
            <div>
              <p className={styles.eyebrow}>Core Readiness Command</p>
              <h2>OSP operating spine control center</h2>
              <span>
                Presentation-grade core architecture dashboard showing how OSP
                links traveler identity, QR, pass, trip validity, role-aware
                routing, and compliance-safe movement states.
              </span>
            </div>

            <div className={styles.modePills}>
              <strong>LGU presentation ready</strong>
              <strong>Core doctrine aligned</strong>
              <strong>Live wiring later</strong>
            </div>
          </div>

          <div className={styles.gaugeGrid}>
            {coreMetrics.map((metric) => (
              <article className={styles.gaugeCard} key={metric.label}>
                <div className={styles.gaugeTop}>
                  <span>{metric.label}</span>
                  <strong>{metric.state}</strong>
                </div>
                <div
                  className={styles.gauge}
                  style={{ "--value": `${metric.gauge * 3.6}deg` } as CSSProperties}
                >
                  <div className={styles.gaugeInner}>
                    <strong>{metric.value}</strong>
                    <small>{metric.gauge}%</small>
                  </div>
                </div>
                <p>{metric.note}</p>
              </article>
            ))}
          </div>

          <div className={styles.spineGrid}>
            <article className={styles.flowPanel}>
              <div className={styles.panelHead}>
                <p>Core Flow Map</p>
                <strong>Traveler operating sequence</strong>
                <span>
                  Static presentation model. Later wiring should connect this to
                  traveler profile, QR credential, pass, trip, booking, and LGU
                  aggregate data sources.
                </span>
              </div>

              <div className={styles.flowLine}>
                {flowNodes.map((node, index) => (
                  <span key={node} className={styles[`node${index}`]}>
                    {node}
                  </span>
                ))}
                <i className={styles.flowPathOne} />
                <i className={styles.flowPathTwo} />
                <i className={styles.flowPathThree} />
              </div>
            </article>

            <article className={styles.spinePanel}>
              <div className={styles.panelHead}>
                <p>Identity Spine Matrix</p>
                <strong>Core record chain</strong>
                <span>
                  Each downstream state must snapshot upstream truth instead of
                  reinterpreting old bookings or old traveler records.
                </span>
              </div>

              <div className={styles.spineRows}>
                {spineRows.map(([label, body, state]) => (
                  <span key={label}>
                    <strong>{label}</strong>
                    <em>{body}</em>
                    <b>{state}</b>
                  </span>
                ))}
              </div>
            </article>
          </div>

          <div className={styles.controlGrid}>
            <article className={styles.doctrinePanel}>
              <div className={styles.panelHead}>
                <p>Locked Core Doctrine</p>
                <strong>Non-negotiable OSP rules</strong>
              </div>

              <div className={styles.doctrineGrid}>
                {doctrineCards.map((card) => (
                  <article key={card.title}>
                    <span>{card.badge}</span>
                    <strong>{card.title}</strong>
                    <p>{card.text}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className={styles.riskPanel}>
              <div className={styles.panelHead}>
                <p>Core Risk Guard</p>
                <strong>Failure states blocked</strong>
              </div>

              <div className={styles.riskList}>
                {riskControls.map(([label, state]) => (
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
