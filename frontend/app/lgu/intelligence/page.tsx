"use client";

import { useEffect, useMemo, useState } from "react";
import CommandCenterShell from "../../../src/components/intelligence/CommandCenterShell";
import { SIARGAO_MUNICIPALITIES } from "../../../src/lib/siargaoMunicipalities";
import { OSP_EVENT_MODES } from "../../../src/lib/ospEventModes";

function getApiBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  return "http://localhost:8001/api/v1";
}

function defaultEndDate() {
  return new Date().toISOString().slice(0, 10);
}

function defaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().slice(0, 10);
}

function humanize(value: string | number | undefined | null) {
  if (value === null || value === undefined) return "Not Available";
  return String(value)
    .replace(/^osp_/i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function friendlySource(value: string | undefined | null) {
  if (!value) return "Source not active yet";

  const map: Record<string, string> = {
    partner_accounts: "Partner Records",
    partner_api_audit_logs: "Partner Review Logs",
    partner_api_tokens: "Partner Access Governance",
    osp_qr_events: "QR Event Records",
    inter_island_movements: "Inter-Island Movement Records",
    spm_traveler_stamps: "Passport Trail Stamp Records",
    spm_traveler_trail_progress: "Passport Trail Progress Records",
    OspPass: "OSP Pass Records",
    QrCredential: "QR Credential Records",
    Manifest: "Manifest Records",
    ManifestMember: "Manifest Member Records",
    Trip: "Trip Records",
  };

  return value
    .split(",")
    .map((item) => map[item.trim()] || humanize(item.trim()))
    .join(", ");
}

function friendlyHelper(value: string | undefined | null) {
  if (!value) return "";
  return String(value)
    .replaceAll("Source: partner_accounts", "Source: Partner Records")
    .replaceAll("Source: partner_api_audit_logs", "Source: Partner Review Logs")
    .replaceAll("Source: osp_qr_events", "Source: QR Event Records")
    .replaceAll("Source: inter_island_movements", "Source: Inter-Island Movement Records")
    .replaceAll("Source: spm_traveler_stamps", "Source: Passport Trail Stamp Records")
    .replaceAll("Date column: createdAt", "Date field active")
    .replaceAll("Date column: created_at", "Date field active")
    .replaceAll("Date column: updatedAt", "Date field active")
    .replaceAll("Date column: updated_at", "Date field active");
}

function friendlyStatus(value: string | undefined | null) {
  const normalized = String(value || "");
  const map: Record<string, string> = {
    TABLE_ACTIVE_COLUMN_BUILD_TARGET: "Municipality Mapping Pending",
    SOURCE_BUILD_TARGET: "Source Build Target",
    ACTIVE_BREAKDOWN: "Municipality Breakdown Active",
    BUILD_TARGET: "Build Target",
    REVIEW_REQUIRED: "Review Required",
    ACTIVE: "Active",
    CLEAR: "Clear",
    LGU_SAFE: "LGU Safe",
    AGGREGATED: "Aggregated",
    OPERATIONAL: "Operational",
    HIGH: "High",
    REVIEW: "Review",
  };
  return map[normalized] || humanize(normalized);
}

function BarChart({ title, distribution }: { title: string; distribution?: any }) {
  const rows = distribution?.rows || [];
  const max = Math.max(...rows.map((row: any) => row.value), 1);

  return (
    <section className="osp-command-panel">
      <div className="osp-command-chart-head">
        <h4>{title}</h4>
        <span>{friendlySource(distribution?.table)}</span>
      </div>
      {rows.length === 0 ? (
        <div className="osp-command-empty-state">
          No active rows yet. This source is tracked, but the needed status or category field is still a build target.
        </div>
      ) : (
        rows.map((row: any) => (
          <div className="osp-command-bar-row" key={row.label}>
            <span>{humanize(row.label)}</span>
            <div className="osp-command-bar-track">
              <div
                className="osp-command-bar-fill"
                style={{ width: `${Math.max(4, Math.round((row.value / max) * 100))}%` }}
              />
            </div>
            <strong>{row.value}</strong>
          </div>
        ))
      )}
    </section>
  );
}


function findQueueCount(data: any, keyword: string) {
  const queue = (data?.operationalQueues || []).find((item: any) =>
    String(item.queue || "").toLowerCase().includes(keyword.toLowerCase())
  );
  return Number(queue?.count || 0);
}

function findSummaryValue(data: any, label: string) {
  const item = (data?.dateRangeOperationalSummary || []).find((entry: any) =>
    String(entry.label || "").toLowerCase().includes(label.toLowerCase())
  );
  return Number(item?.value || 0);
}

function buildDestinationActionPlan(data: any) {
  const pendingPartners = findQueueCount(data, "Partner");
  const manifestQueue = findQueueCount(data, "Manifest");
  const qrActivity = findQueueCount(data, "QR");
  const eventCoordination = findQueueCount(data, "Event-Wide");

  const manifestRange = findSummaryValue(data, "Manifests");
  const movementsRange = findSummaryValue(data, "Inter-Island");
  const qrRange = findSummaryValue(data, "QR Events");

  const pressureScore =
    pendingPartners * 2 +
    Math.min(manifestQueue, 100) +
    Math.min(qrActivity * 2, 60) +
    Math.min(eventCoordination, 120);

  const operatingLevel =
    pressureScore >= 180 ? "High Coordination"
    : pressureScore >= 90 ? "Active Monitoring"
    : "Normal Operations";

  const mayorBrief =
    operatingLevel === "High Coordination"
      ? "Destination activity is elevated. LGU should activate coordinated monitoring across movement, partner readiness, and public advisories."
      : operatingLevel === "Active Monitoring"
      ? "Destination activity is active but manageable. LGU should monitor movement signals, manifest activity, and partner readiness."
      : "Destination activity is within normal operating range. Maintain monitoring and readiness checks.";

  return {
    operatingLevel,
    pressureScore,
    mayorBrief,
    actions: [
      {
        title: "Review pending partner readiness",
        owner: "Tourism / Admin Coordination",
        trigger: `${pendingPartners} pending partner item${pendingPartners === 1 ? "" : "s"}`,
        action:
          pendingPartners > 0
            ? "Review partner applications, confirm legitimacy, and classify readiness before allowing deeper workflow access."
            : "No immediate partner review required.",
        priority: pendingPartners > 0 ? "Today" : "Monitor",
      },
      {
        title: "Monitor manifest and movement pressure",
        owner: "LGU Compliance / Operations",
        trigger: `${manifestQueue || manifestRange} manifest-linked record${(manifestQueue || manifestRange) === 1 ? "" : "s"}`,
        action:
          manifestQueue > 0 || manifestRange > 0
            ? "Use manifest and movement records to identify coordination load, regulated trips, and operational pressure points."
            : "Manifest activity is not yet producing enough signal for intervention.",
        priority: manifestQueue > 50 || manifestRange > 50 ? "High" : "Monitor",
      },
      {
        title: "Watch QR and checkpoint activity",
        owner: "Movement Monitoring",
        trigger: `${qrActivity || qrRange} QR/checkpoint signal${(qrActivity || qrRange) === 1 ? "" : "s"}`,
        action:
          qrActivity > 0 || qrRange > 0
            ? "Monitor scan patterns, ingress/egress signals, and unusual spikes for coordination or advisory action."
            : "QR activity is low. Continue readiness monitoring.",
        priority: qrActivity > 15 || qrRange > 15 ? "Active" : "Monitor",
      },
      {
        title: "Prepare event / peak-period coordination",
        owner: "Mayor / Tourism / Operations",
        trigger: `${eventCoordination} event-wide coordination signal${eventCoordination === 1 ? "" : "s"}`,
        action:
          eventCoordination > 0
            ? "Prepare public-facing coordination advisories, operator reminders, and inter-agency updates for peak activity."
            : "No active event-wide pressure requiring escalation.",
        priority: eventCoordination > 50 ? "Today" : "Monitor",
      },
    ],
    protocols: [
      {
        level: "Monitor",
        condition: "Normal movement and partner activity",
        lguMove: "Keep dashboard open, refresh date range, and review partner/manifest queues daily.",
      },
      {
        level: "Coordinate",
        condition: "Rising manifest, QR, partner, or event activity",
        lguMove: "Notify tourism operations, review partner readiness, and coordinate with operators before public congestion appears.",
      },
      {
        level: "Intervene",
        condition: "High movement pressure, repeated incidents, or public-order concern",
        lguMove: "Issue advisories, activate field coordination, request operator compliance checks, and prepare Mayor/DOT update.",
      },
    ],
    advisories: [
      "Remind operators to keep traveler manifests and movement records updated.",
      "Remind partners that access and integration require review before activation.",
      "Use QR and movement signals as coordination indicators, not as public accusation tools.",
      "Escalate only when operating signals show repeated pressure, risk, or compliance breakdown.",
    ],
  };
}


function MetricGrid({ items }: { items: any[] }) {
  return (
    <section className="osp-command-card-grid">
      {items.map((card: any) => (
        <article className="osp-command-card" key={card.label}>
          <p>{card.label}</p>
          <strong>{card.value}</strong>
          <span>{card.helper}</span>
          <small>{friendlySource(card.source)}</small>
        </article>
      ))}
    </section>
  );
}

export default function LguIntelligencePage() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [municipality, setMunicipality] = useState("ALL_SIARGAO");
  const [eventMode, setEventMode] = useState("NORMAL");
  const [startDate, setStartDate] = useState(defaultStartDate());
  const [endDate, setEndDate] = useState(defaultEndDate());
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [meetingMode, setMeetingMode] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(
          `${apiBaseUrl}/lgu/intelligence/overview?municipality=${municipality}&eventMode=${eventMode}&startDate=${startDate}&endDate=${endDate}`,
          { cache: "no-store" }
        );
        const json = await response.json();
        if (!response.ok || !json?.ok) {
          setError(json?.message || "Unable to load LGU Tourism Coordination Center.");
          return;
        }
        setData(json);
        setError("");
      } catch {
        setError("Unable to reach the OSP API. Please make sure the backend is running and try again.");
      }
    }
    loadData();
  }, [apiBaseUrl, municipality, eventMode, startDate, endDate]);

  const navItems = [
    { label: "Overview", anchor: "overview", active: true },
    { label: "Decision Board", anchor: "decision-board" },
    { label: "Action Queue", anchor: "action-queue" },
    { label: "Activity Counts", anchor: "activity-counts" },
    { label: "Peak-Period Summary", anchor: "event-summary" },
    { label: "System Readiness", anchor: "system-readiness" },
    { label: "Distribution Graphs", anchor: "distribution-graphs" },
    { label: "Municipality View", anchor: "municipality-view" },
    { label: "Coordination Matrix", anchor: "coordination-matrix" },
  ];

  return (
    <CommandCenterShell
      productName="LGU Tourism Coordination Center"
      productSubtitle="Role-scoped tourism operations, compliance coordination, and destination insights for Siargao LGU stakeholders."
      navItems={navItems}
      municipality={municipality}
      municipalities={[...SIARGAO_MUNICIPALITIES]}
      onMunicipalityChange={setMunicipality}
      eventMode={eventMode}
      eventModes={[...OSP_EVENT_MODES]}
      onEventModeChange={setEventMode}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
    >
      {error ? <div className="osp-command-alert">{error}</div> : null}
      {!data ? (
        <div className="osp-command-panel">Loading coordination center...</div>
      ) : (
        <div className={meetingMode ? "osp-command-meeting-mode" : ""}>
          <section className="osp-command-presentation-bar">
            <div>
              <p>Meeting presentation mode</p>
              <strong>DOT / LGU / Mayor briefing view</strong>
              <span>Use this view to explain destination coordination, movement visibility, compliance readiness, and responsible data use.</span>
            </div>

            <div className="osp-command-presentation-actions">
              <button type="button" onClick={() => setMeetingMode(!meetingMode)}>
                {meetingMode ? "Exit Meeting Mode" : "Enable Meeting Mode"}
              </button>
              <button type="button" onClick={() => window.print()}>
                Print / Save PDF
              </button>
            </div>
          </section>

          <section className="osp-command-briefing-strip">
            <article>
              <span>Purpose</span>
              <strong>Coordinate tourism operations</strong>
              <p>OSP helps LGU teams see operating pressure, movement signals, partner readiness, and coordination queues in one governed view.</p>
            </article>
            <article>
              <span>Operational value</span>
              <strong>From manual reporting to live visibility</strong>
              <p>Trip, QR, manifest, partner, and Passport Trails layers can feed a clearer destination operating picture.</p>
            </article>
            <article>
              <span>Public-sector posture</span>
              <strong>Coordination, not surveillance</strong>
              <p>The LGU view is designed for aggregated coordination signals while sensitive records remain protected.</p>
            </article>
          </section>

          {(() => {
            const plan = buildDestinationActionPlan(data);
            return (
              <section id="decision-board" className="osp-destination-action-board">
                <div className="osp-destination-action-head">
                  <div>
                    <p>Destination Authority Layer</p>
                    <h3>Destination Action Board</h3>
                    <span>{plan.mayorBrief}</span>
                  </div>
                  <div className="osp-destination-pressure">
                    <span>Operating Level</span>
                    <strong>{plan.operatingLevel}</strong>
                    <em>Pressure score: {plan.pressureScore}</em>
                  </div>
                </div>

                <div className="osp-destination-action-grid">
                  {plan.actions.map((item) => (
                    <article key={item.title} className="osp-destination-action-card">
                      <div>
                        <span>{item.priority}</span>
                        <strong>{item.title}</strong>
                      </div>
                      <p>{item.action}</p>
                      <small>{item.owner}</small>
                      <em>{item.trigger}</em>
                    </article>
                  ))}
                </div>

                <div className="osp-destination-protocols">
                  <div>
                    <p className="osp-destination-mini-eyebrow">Intervention protocol</p>
                    <h4>When should LGU act?</h4>
                  </div>
                  {plan.protocols.map((item) => (
                    <article key={item.level}>
                      <strong>{item.level}</strong>
                      <span>{item.condition}</span>
                      <p>{item.lguMove}</p>
                    </article>
                  ))}
                </div>

                <div className="osp-destination-advisory">
                  <strong>Recommended coordination reminders</strong>
                  <ul>
                    {plan.advisories.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })()}
          <section id="executive-summary" className="osp-command-executive-grid">
            {(data.executiveSummaryPanels || []).map((panel: any) => (
              <article className="osp-command-executive-card" key={panel.label}>
                <p>{panel.label}</p>
                <strong>{panel.value}</strong>
                <span>{panel.helper}</span>
                <small>{friendlyStatus(panel.priority)} · LGU Safe</small>
              </article>
            ))}
          </section>

          <h3 id="action-queue" className="osp-command-section-title">Operational Queues</h3>
          <section className="osp-command-queue-grid">
            {(data.operationalQueues || []).map((queue: any) => (
              <article className="osp-command-queue-card" key={queue.queue}>
                <div>
                  <p>{queue.queue}</p>
                  <strong>{queue.count}</strong>
                </div>
                <span>{friendlyStatus(queue.severity)}</span>
                <small>{queue.ownerSurface}</small>
                <em>{queue.action}</em>
              </article>
            ))}
          </section>

          <h3 id="activity-counts" className="osp-command-section-title">Date-Scoped Activity Counts</h3>
          <section className="osp-command-date-grid">
            {(data.dateRangeOperationalSummary || []).map((item: any) => (
              <article className="osp-command-date-card" key={item.label}>
                <p>{item.label}</p>
                <strong>{item.value}</strong>
                <span>{friendlyHelper(item.helper)}</span>
                <small>{friendlyStatus(item.visibility)} · {friendlyStatus(item.dataClass)}</small>
              </article>
            ))}
          </section>

          <h3 id="event-summary" className="osp-command-section-title">Event / Peak-Period Coordination Summary</h3>
          <section className="osp-command-event-grid">
            {(data.eventWideSummary || []).map((item: any) => (
              <article className="osp-command-event-card" key={item.label}>
                <p>{item.label}</p>
                <strong>{humanize(item.value)}</strong>
                <span>{friendlyHelper(item.helper)}</span>
              </article>
            ))}
          </section>

          <MetricGrid items={data.summaryCards || []} />

          <h3 id="system-readiness" className="osp-command-section-title">System Readiness Gauges</h3>
          <section className="osp-command-gauge-grid">
            {(data.gauges || []).map((gauge: any) => (
              <article className="osp-command-panel osp-command-gauge" key={gauge.label}>
                <div className="osp-command-gauge-ring" style={{ ["--gauge-value" as any]: gauge.value }}>
                  <div className="osp-command-gauge-inner">{gauge.value}%</div>
                </div>
                <h4>{gauge.label}</h4>
                <span>{friendlyStatus(gauge.status)}</span>
                <p>{gauge.interpretation}</p>
              </article>
            ))}
          </section>

          <h3 id="distribution-graphs" className="osp-command-section-title">Distribution Graphs</h3>
          <section className="osp-command-chart-grid">
            <BarChart title="QR Event Distribution" distribution={data.distributions?.qrEvents} />
            <BarChart title="Partner Status Distribution" distribution={data.distributions?.partnerStatus} />
            <BarChart title="Partner Type Distribution" distribution={data.distributions?.partnerType} />
            <BarChart title="Audit Event Distribution" distribution={data.distributions?.auditEvents} />
          </section>

          <h3 id="municipality-view" className="osp-command-section-title">Municipality View Readiness</h3>
          <section className="osp-command-muni-grid">
            {(data.municipalityBreakdowns || []).map((item: any) => (
              <article className="osp-command-muni-card" key={item.label}>
                <div>
                  <p>{item.label}</p>
                  <strong>{item.rows?.length || 0}</strong>
                </div>
                <span>{friendlyStatus(item.status)}</span>
                <small>Source: {friendlySource(item.table)} · Municipality field: {item.column ? "Active" : "Pending"}</small>
                {item.rows?.length ? (
                  <div className="osp-command-mini-bars">
                    {item.rows.map((row: any) => (
                      <div className="osp-command-mini-bar" key={row.label}>
                        <span>{humanize(row.label)}</span>
                        <strong>{row.value}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <em>This source is active, but municipality-level tagging is not yet available.</em>
                )}
              </article>
            ))}
          </section>

          <h3 id="coordination-matrix" className="osp-command-section-title">Inter-Layer Coordination Matrix</h3>
          <section className="osp-command-table">
            {(data.intelligenceLayers || []).map((layer: any) => (
              <div className="osp-command-table-row" key={layer.layer}>
                <div>
                  <strong>{layer.layer}</strong>
                  <span>{layer.spineStatus}</span>
                </div>
                <div>{layer.records}</div>
                <div>{(layer.parameters || []).join(" · ")}</div>
                <div>{layer.lguOutput}</div>
              </div>
            ))}
          </section>
          <section id="responsible-data" className="osp-command-subtle-note">
            <strong>Responsible data use</strong>
            <span>
              This view is prepared for tourism coordination and destination operations. Sensitive personal,
              commercial, and restricted platform records remain protected by authorized access.
            </span>
          </section>
        </div>
      )}
    </CommandCenterShell>
  );
}
