"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SummaryCard = {
  label: string;
  value: number;
  helper: string;
  source: string;
};

type Gauge = {
  label: string;
  value: number;
  interpretation: string;
  status: string;
};

type Distribution = {
  table: string | null;
  rows: { label: string; value: number }[];
};

type IntelligenceLayer = {
  layer: string;
  spineStatus: string;
  records: number;
  parameters: string[];
  lguOutput: string;
};

type Overview = {
  ok: boolean;
  generatedAt: string;
  dataStatus: {
    activeTableCount: number;
    activeTables: string[];
    mode: string;
    warning: string;
  };
  summaryCards: SummaryCard[];
  gauges: Gauge[];
  distributions: {
    partnerStatus: Distribution;
    partnerType: Distribution;
    auditEvents: Distribution;
    qrEvents: Distribution;
    manifestStatus: Distribution;
  };
  intelligenceLayers: IntelligenceLayer[];
  governanceBoundaries: string[];
};

function getApiBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  return "http://localhost:8001/api/v1";
}

function MiniGauge(props: { gauge: Gauge }) {
  return (
    <article className="osp-gov-live-gauge-card">
      <div
        className="osp-gov-live-gauge-ring"
        style={{ ["--gauge-value" as any]: props.gauge.value }}
      >
        <div className="osp-gov-live-gauge-inner">{props.gauge.value}%</div>
      </div>
      <h4>{props.gauge.label}</h4>
      <span>{props.gauge.status}</span>
      <p>{props.gauge.interpretation}</p>
    </article>
  );
}

function MiniBarChart(props: { title: string; distribution?: Distribution }) {
  const rows = props.distribution?.rows || [];
  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <article className="osp-gov-live-chart-card">
      <h4>{props.title}</h4>
      {rows.length === 0 ? (
        <p className="osp-gov-live-empty">No distribution rows available yet.</p>
      ) : (
        rows.map((row) => (
          <div className="osp-gov-live-bar-row" key={row.label}>
            <span className="osp-gov-live-bar-label">{row.label}</span>
            <span className="osp-gov-live-bar-track">
              <span
                className="osp-gov-live-bar-fill"
                style={{ width: `${Math.max(4, Math.round((row.value / max) * 100))}%` }}
              />
            </span>
            <span className="osp-gov-live-bar-value">{row.value}</span>
          </div>
        ))
      )}
      <p className="osp-gov-live-source">Source: {props.distribution?.table || "not available yet"}</p>
    </article>
  );
}

export default function LguIntelligencePreview() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      try {
        const response = await fetch(`${apiBaseUrl}/lgu/intelligence/overview`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (cancelled) return;

        if (!response.ok || !data?.ok) {
          setError(data?.message || "Unable to load LGU intelligence overview.");
          return;
        }

        setOverview(data);
      } catch {
        if (!cancelled) {
          setError("Unable to reach OSP Intelligence API. Start the backend on port 8001.");
        }
      }
    }

    loadOverview();

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl]);

  if (error) {
    return (
      <section className="osp-gov-live-dashboard">
        <div className="osp-gov-live-dashboard-head">
          <div>
            <p className="osp-gov-live-eyebrow">Live Intelligence Dashboard</p>
            <h3>DB-wired LGU intelligence preview</h3>
          </div>
        </div>
        <div className="osp-gov-live-error">{error}</div>
      </section>
    );
  }

  if (!overview) {
    return (
      <section className="osp-gov-live-dashboard">
        <div className="osp-gov-live-loading">Loading DB-wired LGU intelligence...</div>
      </section>
    );
  }

  const topGauges = overview.gauges.slice(0, 5);
  const topLayers = overview.intelligenceLayers.slice(0, 6);

  return (
    <section className="osp-gov-live-dashboard">
      <div className="osp-gov-live-dashboard-head">
        <div>
          <p className="osp-gov-live-eyebrow">Live Intelligence Dashboard</p>
          <h3>DB-wired DOT/LGU operating picture</h3>
          <p>
            This preview reads from the OSP Intelligence API. It is not static copy. Available tables are counted and surfaced; missing layers remain visible as build targets.
          </p>
        </div>
        <Link href="/lgu/intelligence" className="osp-gov-live-open-link">
          Open Full Dashboard
        </Link>
      </div>

      <div className="osp-gov-live-status-strip">
        <span>Mode: {overview.dataStatus.mode}</span>
        <span>Active tables: {overview.dataStatus.activeTableCount}</span>
        <span>Generated: {new Date(overview.generatedAt).toLocaleString()}</span>
      </div>

      <div className="osp-gov-live-summary-grid">
        {overview.summaryCards.map((card) => (
          <article className="osp-gov-live-summary-card" key={card.label}>
            <p>{card.label}</p>
            <strong>{card.value}</strong>
            <span>{card.helper}</span>
            <small>Source: {card.source}</small>
          </article>
        ))}
      </div>

      <h4 className="osp-gov-live-section-title">System Gauges</h4>
      <div className="osp-gov-live-gauge-grid">
        {topGauges.map((gauge) => (
          <MiniGauge gauge={gauge} key={gauge.label} />
        ))}
      </div>

      <h4 className="osp-gov-live-section-title">Live Distribution Graphs</h4>
      <div className="osp-gov-live-chart-grid">
        <MiniBarChart title="QR Event Distribution" distribution={overview.distributions.qrEvents} />
        <MiniBarChart title="Manifest Status Distribution" distribution={overview.distributions.manifestStatus} />
        <MiniBarChart title="Partner Status Distribution" distribution={overview.distributions.partnerStatus} />
      </div>

      <h4 className="osp-gov-live-section-title">Inter-Layer Intelligence Matrix</h4>
      <div className="osp-gov-live-layer-table">
        {topLayers.map((layer) => (
          <div className="osp-gov-live-layer-row" key={layer.layer}>
            <div>
              <strong>{layer.layer}</strong>
              <span>{layer.spineStatus}</span>
            </div>
            <div className="osp-gov-live-layer-records">{layer.records}</div>
            <div>{layer.parameters.join(" · ")}</div>
            <div>{layer.lguOutput}</div>
          </div>
        ))}
      </div>

      <div className="osp-gov-live-boundary">
        <strong>Governance boundary:</strong> {overview.governanceBoundaries.join(" ")}
      </div>
    </section>
  );
}
