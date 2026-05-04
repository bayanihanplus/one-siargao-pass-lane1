import Link from "next/link";
import styles from "./controlTower.module.css";

const doctrineCards = [
  {
    label: "Supply Rule",
    value: "Lenient import",
    text: "Accommodations may enter as imported, claimed, draft, assisted, or request-to-confirm records.",
  },
  {
    label: "Bookability Rule",
    value: "Strict readiness",
    text: "No accommodation becomes public bookable until owner, profile, media, rooms, pricing, availability, and terms gates pass.",
  },
  {
    label: "Exposure Rule",
    value: "No raw dump",
    text: "Imported accommodation records must never become a blind public directory or instant marketplace inventory.",
  },
];

const accomLanes = [
  {
    title: "Accommodation Profiles",
    status: "Gate home",
    body: "Govern property identity, claim state, owner readiness, location, media, descriptions, and profile completeness.",
  },
  {
    title: "Owner Onboarding",
    status: "Gate home",
    body: "Support claim, draft, assisted setup, incomplete records, and operator-accommodation ownership boundaries.",
  },
  {
    title: "Rooms & Units",
    status: "Gate home",
    body: "Control room/unit types, capacity, inclusions, media, booking rules, and readiness before public display.",
  },
  {
    title: "Availability & Booking Modes",
    status: "Gate home",
    body: "Separate request-to-confirm, save-only, not bookable, confirmed stay, and future instant-book states.",
  },
  {
    title: "QR Check-in / Check-out",
    status: "Gate home",
    body: "Prepare accommodation stay validation as part of OSP QR operating infrastructure, not only traveler discovery.",
  },
  {
    title: "Marketplace Readiness",
    status: "Gate home",
    body: "Govern public exposure, accommodation intelligence, package-linked stays, OTA-sourced stays, and Travel & Tours-sourced stays.",
  },
];

const rules = [
  {
    code: "01",
    title: "Imported is not public",
    text: "A property can exist internally before it is claim-ready, owner-ready, or marketplace-ready.",
  },
  {
    code: "02",
    title: "Claim state matters",
    text: "Claimed, unclaimed, draft, assisted, and verified properties must be visually and operationally different.",
  },
  {
    code: "03",
    title: "Bookability is separate",
    text: "A visible accommodation card is not the same as a confirmed booking-ready accommodation.",
  },
  {
    code: "04",
    title: "Rooms drive fulfillment",
    text: "Accommodation profiles without rooms/units, capacity, terms, and availability cannot become serious inventory.",
  },
  {
    code: "05",
    title: "Payouts need governance",
    text: "Payments, statements, payout holds, and settlement rules must connect to finance control, not stay hidden in stay pages.",
  },
];

const risks = [
  {
    title: "550-property raw dump",
    text: "Blindly publishing raw accommodation records damages traveler trust and operator credibility.",
  },
  {
    title: "False bookability",
    text: "A traveler-facing card that cannot actually be fulfilled creates support, refund, and reputation risk.",
  },
  {
    title: "Owner confusion",
    text: "Unclaimed or partially claimed properties need careful governance before edits, payouts, or public visibility.",
  },
  {
    title: "Package mismatch",
    text: "Package-linked stays must align with tours, rentals, payments, QR, and fulfillment logic.",
  },
];

export function ControlTowerAccommodationsPage() {
  return (
    <section className={styles.content}>
      <div className={styles.accomDeck}>
        <div className={styles.accomHero}>
          <div className={styles.accomHeroInner}>
            <div>
              <div className={styles.accomKicker}>
                <span className={styles.nuclearPulse} />
                ADMIN-CT-07 / Accommodation Control
              </div>

              <h2 className={styles.accomTitle}>
                Accommodation Control Center
              </h2>

              <p className={styles.accomLead}>
                A Super Admin operating surface for accommodation supply,
                owner onboarding, rooms, availability, QR check-in, package-linked
                stays, payouts, statements, marketplace readiness, and intelligence.
              </p>
            </div>

            <div className={styles.accomDoctrineWall}>
              {doctrineCards.map((card) => (
                <article key={card.label} className={styles.accomDoctrineCard}>
                  <p className={styles.accomDoctrineLabel}>{card.label}</p>
                  <h3 className={styles.accomDoctrineValue}>{card.value}</h3>
                  <p className={styles.accomDoctrineText}>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.accomOpsGrid}>
          <section className={styles.accomPanel}>
            <div className={styles.accomPanelHead}>
              <p className={styles.accomEyebrow}>Accommodation Supply Governance</p>
              <h3 className={styles.accomPanelTitle}>
                Properties may enter early. Public bookability waits.
              </h3>
              <p className={styles.accomPanelText}>
                This is not a generic stays marketplace. It is the control layer
                for accommodation supply, claim readiness, room/unit readiness,
                booking modes, QR validation, payment/payout relationships, and
                marketplace exposure.
              </p>
            </div>

            <div className={styles.accomLaneGrid}>
              {accomLanes.map((lane) => (
                <article key={lane.title} className={styles.accomLaneCard}>
                  <div className={styles.accomLaneTop}>
                    <h4 className={styles.accomLaneTitle}>{lane.title}</h4>
                    <span className={styles.accomLaneStatus}>{lane.status}</span>
                  </div>
                  <p className={styles.accomLaneText}>{lane.body}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className={styles.accomPanel}>
            <div className={styles.accomPanelHead}>
              <p className={styles.accomEyebrow}>Readiness Rules</p>
              <h3 className={styles.accomPanelTitle}>
                Lenient preparation without careless public exposure
              </h3>
              <p className={styles.accomPanelText}>
                The system can prepare accommodation supply early, but cannot
                let unclaimed, incomplete, or unpriced stays become public
                bookable inventory.
              </p>
            </div>

            <div className={styles.accomRuleGrid}>
              {rules.map((rule) => (
                <article key={rule.code} className={styles.accomRule}>
                  <div className={styles.accomRuleCode}>{rule.code}</div>
                  <div>
                    <h4 className={styles.accomRuleTitle}>{rule.title}</h4>
                    <p className={styles.accomRuleText}>{rule.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.accomRiskStrip}>
              {risks.map((risk) => (
                <article key={risk.title} className={styles.accomRiskItem}>
                  <span className={styles.accomRiskDot} />
                  <div>
                    <h4 className={styles.accomRiskTitle}>{risk.title}</h4>
                    <p className={styles.accomRiskText}>{risk.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <section className={styles.accomPanel}>
          <div className={styles.accomPanelHead}>
            <p className={styles.accomEyebrow}>Control Tower Relationships</p>
            <h3 className={styles.accomPanelTitle}>
              Accommodation Control connects to Operator Governance, Explore, Payments, QR, and Pricing
            </h3>
            <p className={styles.accomPanelText}>
              Accommodation Control owns stay readiness and fulfillment governance.
              It connects to other Control Tower modules without collapsing into
              them.
            </p>
          </div>

          <div className={styles.accomLaneGrid}>
            <article className={styles.accomLaneCard}>
              <div className={styles.accomLaneTop}>
                <h4 className={styles.accomLaneTitle}>Operator Governance</h4>
                <span className={styles.accomLaneStatus}>Owner readiness</span>
              </div>
              <p className={styles.accomLaneText}>
                Accommodation owners and operators can enter early, but readiness and public exposure remain separate.
              </p>
            </article>

            <article className={styles.accomLaneCard}>
              <div className={styles.accomLaneTop}>
                <h4 className={styles.accomLaneTitle}>Explore Siargao</h4>
                <span className={styles.accomLaneStatus}>Public discovery</span>
              </div>
              <p className={styles.accomLaneText}>
                Explore receives only exposure-eligible stay cards. It must not pull from raw imported accommodation records.
              </p>
            </article>

            <article className={styles.accomLaneCard}>
              <div className={styles.accomLaneTop}>
                <h4 className={styles.accomLaneTitle}>Payments, Payouts & Statements</h4>
                <span className={styles.accomLaneStatus}>Financial ops</span>
              </div>
              <p className={styles.accomLaneText}>
                Accommodation payments, payout holds, statements, refunds, and settlement modes belong to finance governance.
              </p>
            </article>

            <article className={styles.accomLaneCard}>
              <div className={styles.accomLaneTop}>
                <h4 className={styles.accomLaneTitle}>QR, Compliance & Movement</h4>
                <span className={styles.accomLaneStatus}>Stay validation</span>
              </div>
              <p className={styles.accomLaneText}>
                QR check-in and check-out should support stay validation and trip readiness without exposing private traveler data.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.accomBoundary}>
          <h3>Build boundary: accommodation control surface only, no destructive wiring.</h3>
          <p>
            ADMIN-CT-07 creates the Accommodation Control Center as a serious
            Super Admin operating surface. It does not publish accommodations,
            delete old routes, redirect operator pages, modify backend logic,
            change database schema, create bookable inventory, or create a commit.
          </p>
          <p>
            <Link href="/traveler/explore/stays" className={styles.nuclearActionGhost}>
              View Traveler Stays Surface
            </Link>{" "}
            <Link href="/operator/accommodations" className={styles.nuclearActionGhost}>
              View Operator Accommodation Surface
            </Link>
          </p>
        </section>
      </div>
    </section>
  );
}
