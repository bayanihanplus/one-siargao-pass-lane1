import Link from "next/link";
import styles from "./controlTower.module.css";

const doctrineCards = [
  {
    label: "Visibility Rule",
    value: "Full vs aggregated",
    text: "Super Admin can govern full platform intelligence. LGU/DOT views must remain separate and aggregated.",
  },
  {
    label: "Data Boundary",
    value: "Role-safe insights",
    text: "Operators, accommodations, partners, LGU/DOT, and Super Admin must not see the same intelligence surface.",
  },
  {
    label: "Data Rule",
    value: "No fake analytics",
    text: "This shell defines intelligence governance only. It does not claim live charts, counters, forecasts, or operational metrics.",
  },
];

const controlLanes = [
  {
    title: "Traveler Flow",
    status: "Gate home",
    body: "Govern traveler volume, trip dates, arrival/departure patterns, domestic/international mix, returning travelers, and readiness signals.",
  },
  {
    title: "Trip & Booking Demand",
    status: "Gate home",
    body: "Prepare demand intelligence across trips, Passport Trails, tours, DIY requests, accommodations, rentals, payments, and conversion paths.",
  },
  {
    title: "QR Event Intelligence",
    status: "Gate home",
    body: "Prepare QR identity, scan, stamp, movement, compliance, checkpoint, ingress/egress, and exception intelligence without exposing private records.",
  },
  {
    title: "Operator Performance",
    status: "Gate home",
    body: "Govern operator readiness, marketplace exposure, conversion, fulfillment, complaint risk, completion, payout, and category performance.",
  },
  {
    title: "Accommodation Capacity",
    status: "Gate home",
    body: "Prepare stay intelligence across claimed/unclaimed supply, rooms, availability, bookings, package-linked stays, occupancy signals, and payout state.",
  },
  {
    title: "LGU/DOT Aggregated Views",
    status: "Separate surface",
    body: "Define aggregated tourism coordination outputs without mixing LGU/DOT access with private Super Admin controls or commercial intelligence.",
  },
];

const rules = [
  {
    code: "01",
    title: "Super Admin sees full platform intelligence",
    text: "Private platform intelligence belongs inside Control Tower and should remain protected by role boundaries.",
  },
  {
    code: "02",
    title: "LGU/DOT sees aggregated coordination views",
    text: "LGU/DOT should not receive private commercial controls, traveler-identifiable records, payout detail, or operator-sensitive data.",
  },
  {
    code: "03",
    title: "Operators see their own operational truth",
    text: "Operator dashboards can show their own bookings, performance, payouts, and readiness — not destination-wide private intelligence.",
  },
  {
    code: "04",
    title: "No fake live dashboards",
    text: "Do not show charts, counts, forecasts, or executive metrics as live until backend source models and aggregation rules are confirmed.",
  },
  {
    code: "05",
    title: "Intelligence must be decision-grade",
    text: "Panels should support actual operating decisions: readiness, risk, demand, capacity, payment failure, movement pressure, and compliance exceptions.",
  },
];

const risks = [
  {
    title: "Privacy breach",
    text: "Mixing Super Admin intelligence with LGU/DOT or operator views can expose traveler, commercial, or partner-sensitive data.",
  },
  {
    title: "Fake authority dashboard",
    text: "Charts without source wiring create false confidence and damage trust in stakeholder meetings.",
  },
  {
    title: "Commercial leakage",
    text: "Operator payouts, exposure, conversion, complaints, and category performance are sensitive and must remain role-scoped.",
  },
  {
    title: "Bad policy decisions",
    text: "Weak aggregation or wrong interpretation can mislead LGU/DOT, tourism offices, operators, or investors.",
  },
];

export function ControlTowerIntelligencePage() {
  return (
    <section className={styles.content}>
      <div className={styles.operatorDeck}>
        <div className={styles.operatorHero}>
          <div className={styles.operatorHeroInner}>
            <div>
              <div className={styles.operatorKicker}>
                <span className={styles.nuclearPulse} />
                ADMIN-CT-15 / Intelligence Governance
              </div>

              <h2 className={styles.operatorTitle}>
                Intelligence & Data Center
              </h2>

              <p className={styles.operatorLead}>
                The Super Admin governance surface for traveler flow, trip
                volume, QR events, demand signals, operator performance,
                accommodation capacity, booking conversion, payment failures,
                compliance exceptions, forecasts, and LGU/DOT aggregated views.
              </p>
            </div>

            <div className={styles.operatorDoctrineWall}>
              {doctrineCards.map((card) => (
                <article key={card.label} className={styles.operatorDoctrineCard}>
                  <p className={styles.operatorDoctrineLabel}>{card.label}</p>
                  <h3 className={styles.operatorDoctrineValue}>{card.value}</h3>
                  <p className={styles.operatorDoctrineText}>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.operatorOpsGrid}>
          <section className={styles.operatorPanel}>
            <div className={styles.operatorPanelHead}>
              <p className={styles.operatorEyebrow}>Destination Intelligence Control</p>
              <h3 className={styles.operatorPanelTitle}>
                Intelligence must be role-safe, source-grounded, and decision-grade
              </h3>
              <p className={styles.operatorPanelText}>
                This module creates the Intelligence & Data Center shell only.
                It does not wire live analytics, create charts, add backend
                aggregation, modify schema, change LGU/DOT pages, or expose
                private commercial intelligence in this lane.
              </p>
            </div>

            <div className={styles.operatorLaneGrid}>
              {controlLanes.map((lane) => (
                <article key={lane.title} className={styles.operatorLaneCard}>
                  <div className={styles.operatorLaneTop}>
                    <h4 className={styles.operatorLaneTitle}>{lane.title}</h4>
                    <span className={styles.operatorLaneStatus}>{lane.status}</span>
                  </div>
                  <p className={styles.operatorLaneText}>{lane.body}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className={styles.operatorPanel}>
            <div className={styles.operatorPanelHead}>
              <p className={styles.operatorEyebrow}>Intelligence Safety Rules</p>
              <h3 className={styles.operatorPanelTitle}>
                Full data, aggregated data, and owned data must remain separate
              </h3>
              <p className={styles.operatorPanelText}>
                Super Admin, LGU/DOT, operator, accommodation, OTA, and partner
                intelligence surfaces must not collapse into one dashboard.
              </p>
            </div>

            <div className={styles.operatorMatrix}>
              {rules.map((rule) => (
                <article key={rule.code} className={styles.operatorRule}>
                  <div className={styles.operatorRuleCode}>{rule.code}</div>
                  <div>
                    <h4 className={styles.operatorRuleTitle}>{rule.title}</h4>
                    <p className={styles.operatorRuleText}>{rule.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.operatorRiskStrip}>
              {risks.map((risk) => (
                <article key={risk.title} className={styles.operatorRiskItem}>
                  <span className={styles.operatorRiskDot} />
                  <div>
                    <h4 className={styles.operatorRiskTitle}>{risk.title}</h4>
                    <p className={styles.operatorRiskText}>{risk.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <section className={styles.operatorPanel}>
          <div className={styles.operatorPanelHead}>
            <p className={styles.operatorEyebrow}>Control Tower Relationships</p>
            <h3 className={styles.operatorPanelTitle}>
              Intelligence connects to QR Compliance, Payments, Marketplace Exposure, Operators, Accommodations, API, and LGU/DOT
            </h3>
            <p className={styles.operatorPanelText}>
              Intelligence should receive governed signals from across the
              platform, but each consuming surface must receive only the data
              it is allowed to see.
            </p>
          </div>

          <div className={styles.operatorLaneGrid}>
            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>QR, Compliance & Movement</h4>
                <span className={styles.operatorLaneStatus}>Movement signals</span>
              </div>
              <p className={styles.operatorLaneText}>
                QR events can feed flow, movement, checkpoint, regulated-trip, and exception intelligence when aggregation rules are safe.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Payments, Payouts & Statements</h4>
                <span className={styles.operatorLaneStatus}>Financial signals</span>
              </div>
              <p className={styles.operatorLaneText}>
                Payment failures, conversion, refunds, payout holds, and settlements must remain role-safe and never become public intelligence.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Marketplace Exposure Engine</h4>
                <span className={styles.operatorLaneStatus}>Demand signals</span>
              </div>
              <p className={styles.operatorLaneText}>
                Exposure, impressions, category performance, suppression, and conversion should inform marketplace governance later.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>LGU/DOT Surfaces</h4>
                <span className={styles.operatorLaneStatus}>Aggregated only</span>
              </div>
              <p className={styles.operatorLaneText}>
                LGU/DOT dashboards should remain separate protected views with aggregated tourism coordination data only.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.operatorBoundary}>
          <h3>Build boundary: intelligence shell only, no analytics runtime changes.</h3>
          <p>
            ADMIN-CT-15 creates the Intelligence & Data Center shell. It does
            not wire live analytics, add charts, modify aggregation logic,
            change schema, alter LGU/DOT pages, expose private records, redirect
            routes, change backend logic, or create a commit.
          </p>
          <p>
            <Link href="/lgu/intelligence" className={styles.nuclearActionGhost}>
              View LGU Intelligence Surface
            </Link>{" "}
            <Link href="/admin/intelligence" className={styles.nuclearActionGhost}>
              View Existing Admin Intelligence
            </Link>{" "}
            <Link href="/admin/control-tower/qr-compliance" className={styles.nuclearActionGhost}>
              Review QR Compliance
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
}
