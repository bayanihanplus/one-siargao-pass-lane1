import Link from "next/link";
import styles from "./controlTower.module.css";

const doctrineCards = [
  {
    label: "Persona Rule",
    value: "Kuya Tala™",
    text: "Kuya Tala™ is the OSP journey guide, not a generic chatbot or uncontrolled AI answer machine.",
  },
  {
    label: "Knowledge Rule",
    value: "Approved sources",
    text: "The assistant must answer from approved OSP, SPM, operator, accommodation, pricing, safety, and route knowledge only.",
  },
  {
    label: "Safety Rule",
    value: "No invention",
    text: "No invented prices, inclusions, safety claims, operator promises, LGU/DOT statements, or emergency instructions.",
  },
];

const controlLanes = [
  {
    title: "Persona & Tone",
    status: "Gate home",
    body: "Govern Kuya Tala™ identity, Filipino-friendly tone, traveler guidance behavior, professional boundaries, and non-clownish assistant presence.",
  },
  {
    title: "Approved Knowledge",
    status: "Gate home",
    body: "Control which OSP, SPM, tour, accommodation, payment, QR, emergency, and policy facts the assistant can use.",
  },
  {
    title: "Rejected Answers",
    status: "Gate home",
    body: "Prepare review surfaces for hallucinated, unsafe, incomplete, pricing-unsafe, safety-unsafe, or unsupported assistant answers.",
  },
  {
    title: "Safety & Escalation",
    status: "Gate home",
    body: "Govern emergency fallback, official safety broadcast awareness, escalation messaging, and boundary-safe LGU/DOT references.",
  },
  {
    title: "Language Behavior",
    status: "Gate home",
    body: "Prepare controlled multilingual behavior without allowing uncontrolled AI translation for official safety, payment, QR, or compliance instructions.",
  },
  {
    title: "Conversation Review",
    status: "Gate home",
    body: "Prepare future audit of assistant conversations, unsafe fallbacks, missing knowledge, and traveler confusion patterns.",
  },
];

const rules = [
  {
    code: "01",
    title: "No unsupported pricing",
    text: "Kuya Tala™ must not quote prices, fees, inclusions, discounts, payouts, or package claims unless approved source data exists.",
  },
  {
    code: "02",
    title: "No invented operator promises",
    text: "Operator services, availability, guide assignment, accreditation, pickup, and fulfillment details must be source-grounded.",
  },
  {
    code: "03",
    title: "No unsafe safety advice",
    text: "Safety, weather, emergency, and LGU/DOT-related guidance must be conservative, official-source-aware, and escalation-safe.",
  },
  {
    code: "04",
    title: "No fake system capability",
    text: "The assistant must not claim it booked, paid, approved, scanned, cleared, or confirmed something unless the system state supports it.",
  },
  {
    code: "05",
    title: "Fallback must be honest",
    text: "When knowledge is missing, Kuya Tala™ should say it needs official confirmation instead of guessing.",
  },
];

const risks = [
  {
    title: "Hallucinated commercial facts",
    text: "Wrong pricing, inclusions, availability, or operator claims create refund, dispute, and trust risk.",
  },
  {
    title: "Unsafe public authority claims",
    text: "The assistant must not speak as LGU/DOT or issue official safety instructions without approved source control.",
  },
  {
    title: "Traveler overtrust",
    text: "Low-trust travelers may treat AI responses as official confirmation. The assistant must distinguish guidance from system confirmation.",
  },
  {
    title: "Knowledge drift",
    text: "As operator, accommodation, and pricing data grows, the assistant must not use stale or unapproved knowledge.",
  },
];

export function ControlTowerAiAssistantPage() {
  return (
    <section className={styles.content}>
      <div className={styles.operatorDeck}>
        <div className={styles.operatorHero}>
          <div className={styles.operatorHeroInner}>
            <div>
              <div className={styles.operatorKicker}>
                <span className={styles.nuclearPulse} />
                ADMIN-CT-12 / AI Governance
              </div>

              <h2 className={styles.operatorTitle}>
                AI Assistant Control Center
              </h2>

              <p className={styles.operatorLead}>
                The Super Admin governance surface for Kuya Tala™ — persona,
                approved knowledge, rejected answers, safety rules, language
                behavior, fallback logic, escalation, and hallucination guards.
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
              <p className={styles.operatorEyebrow}>AI Governance Control</p>
              <h3 className={styles.operatorPanelTitle}>
                Kuya Tala™ must guide travelers without inventing operational truth
              </h3>
              <p className={styles.operatorPanelText}>
                This module gives the assistant a permanent Super Admin control
                home without changing assistant backend logic, model behavior,
                knowledge ingestion, API routes, database schema, or traveler UI
                in this lane.
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
              <p className={styles.operatorEyebrow}>Assistant Safety Rules</p>
              <h3 className={styles.operatorPanelTitle}>
                Helpful does not mean uncontrolled
              </h3>
              <p className={styles.operatorPanelText}>
                Kuya Tala™ can be warm, useful, and conversational while staying
                source-grounded and operationally safe.
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
              AI governance connects to OSP Core, SPM, Explore, Pricing, QR Compliance, Localization, and Safety
            </h3>
            <p className={styles.operatorPanelText}>
              Kuya Tala™ should not become an isolated chatbot. Its answers must
              respect the same governed truth used by OSP Core, Passport Trails,
              marketplace exposure, pricing, payments, QR compliance, and
              official safety flows.
            </p>
          </div>

          <div className={styles.operatorLaneGrid}>
            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>OSP Core</h4>
                <span className={styles.operatorLaneStatus}>Identity context</span>
              </div>
              <p className={styles.operatorLaneText}>
                The assistant may guide users around identity, pass, trip, and account surfaces without claiming system confirmation unless state exists.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>SPM / Passport Trails</h4>
                <span className={styles.operatorLaneStatus}>Trail guidance</span>
              </div>
              <p className={styles.operatorLaneText}>
                Trail, stamp, DIY route, and partner-tour answers must follow approved SPM knowledge and commercial readiness.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Pricing & Payments</h4>
                <span className={styles.operatorLaneStatus}>Commercial safety</span>
              </div>
              <p className={styles.operatorLaneText}>
                Pricing, payment, refund, payout, and settlement answers require approved source data and should never be guessed.
              </p>
            </article>

            <article className={styles.operatorLaneCard}>
              <div className={styles.operatorLaneTop}>
                <h4 className={styles.operatorLaneTitle}>Localization</h4>
                <span className={styles.operatorLaneStatus}>Language control</span>
              </div>
              <p className={styles.operatorLaneText}>
                AI translation can assist, but official safety, payment, QR, and compliance content needs source-grounded approval.
              </p>
            </article>
          </div>
        </section>

        <section className={styles.operatorBoundary}>
          <h3>Build boundary: AI governance shell only, no assistant runtime changes.</h3>
          <p>
            ADMIN-CT-12 creates the AI Assistant Control Center shell. It does
            not modify assistant backend logic, model prompts, knowledge
            ingestion, database schema, traveler chat UI, safety broadcast logic,
            API routes, redirects, or create a commit.
          </p>
          <p>
            <Link href="/traveler/settings" className={styles.nuclearActionGhost}>
              View Traveler Settings
            </Link>{" "}
            <Link href="/admin/control-tower/localization" className={styles.nuclearActionGhost}>
              Review Localization Control
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
