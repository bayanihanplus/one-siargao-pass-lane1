'use client';

import type { CSSProperties, ReactNode } from 'react';

const OSP = {
  navy: '#013863',
  deepNavy: '#003B66',
  teal: '#0596A5',
  gold: '#F3AE26',
  white: '#FFFFFF',
  mist: '#EAFBFA',
  slate: '#50668B',
  line: 'rgba(1,56,99,0.10)',
  green: '#16846F',
};

function Pill({ children, tone = 'teal' }: { children: ReactNode; tone?: 'teal' | 'gold' | 'green' | 'muted' }) {
  const palette = {
    teal: { background: 'rgba(5,150,165,0.13)', color: OSP.navy },
    gold: { background: 'rgba(243,174,38,0.22)', color: '#7A5200' },
    green: { background: 'rgba(22,132,111,0.12)', color: OSP.green },
    muted: { background: 'rgba(80,102,139,0.10)', color: OSP.slate },
  }[tone];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        minHeight: 22,
        padding: '0 9px',
        fontSize: 9.5,
        fontWeight: 950,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...palette,
      }}
    >
      {children}
    </span>
  );
}

function Card({
  children,
  tone = 'white',
  style,
}: {
  children: ReactNode;
  tone?: 'white' | 'navy' | 'mist' | 'gold';
  style?: CSSProperties;
}) {
  const background =
    tone === 'navy'
      ? `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`
      : tone === 'gold'
      ? 'linear-gradient(135deg, rgba(255,247,230,0.98), rgba(255,255,255,0.96))'
      : tone === 'mist'
      ? 'linear-gradient(135deg, rgba(234,251,250,0.92), rgba(255,255,255,0.98))'
      : OSP.white;

  return (
    <section
      style={{
        borderRadius: 20,
        border: tone === 'navy' ? '1px solid rgba(255,255,255,0.18)' : `1px solid ${OSP.line}`,
        background,
        padding: 13,
        boxShadow: tone === 'navy' ? '0 18px 44px rgba(1,56,99,0.20)' : '0 14px 28px rgba(1,56,99,0.05)',
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function Metric({ label, value, note, tone = 'white' }: { label: string; value: string; note: string; tone?: 'white' | 'gold' | 'teal' }) {
  const bg =
    tone === 'gold'
      ? 'rgba(243,174,38,0.16)'
      : tone === 'teal'
      ? 'rgba(5,150,165,0.11)'
      : 'rgba(255,255,255,0.96)';

  return (
    <article
      style={{
        borderRadius: 16,
        border: `1px solid ${OSP.line}`,
        background: bg,
        padding: 12,
        minHeight: 78,
        boxShadow: '0 10px 20px rgba(1,56,99,0.04)',
      }}
    >
      <p style={{ margin: 0, color: OSP.teal, fontSize: 9.5, fontWeight: 950, letterSpacing: '0.13em', textTransform: 'uppercase' }}>
        {label}
      </p>
      <strong style={{ display: 'block', marginTop: 5, color: OSP.navy, fontSize: 23, lineHeight: 0.95, letterSpacing: '-0.04em' }}>
        {value}
      </strong>
      <small style={{ display: 'block', marginTop: 7, color: OSP.slate, fontSize: 11, lineHeight: 1.28, fontWeight: 720 }}>
        {note}
      </small>
    </article>
  );
}

function ControlLane({
  title,
  status,
  note,
  tone = 'teal',
}: {
  title: string;
  status: string;
  note: string;
  tone?: 'teal' | 'gold' | 'green' | 'muted';
}) {
  return (
    <article
      style={{
        borderRadius: 16,
        border: `1px solid ${OSP.line}`,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.99), rgba(234,251,250,0.68))',
        padding: 12,
        minHeight: 82,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
        <strong style={{ color: OSP.navy, fontSize: 14.5, lineHeight: 1.05 }}>{title}</strong>
        <Pill tone={tone}>{status}</Pill>
      </div>
      <p style={{ margin: '8px 0 0', color: OSP.slate, fontSize: 11.8, lineHeight: 1.35 }}>{note}</p>
    </article>
  );
}

export default function AdminSpmOverviewWorkspace() {
  return (
    <section
      style={{
        borderRadius: 26,
        border: `1px solid ${OSP.line}`,
        background:
          'radial-gradient(circle at top right, rgba(5,150,165,0.10), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.99), rgba(234,251,250,0.95))',
        padding: 14,
        boxShadow: '0 24px 60px rgba(1,56,99,0.09)',
      }}
    >
      <Card tone="navy" style={{ position: 'relative', overflow: 'hidden', padding: 14 }}>
        <div
          style={{
            position: 'absolute',
            right: -80,
            top: -115,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'rgba(243,174,38,0.14)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 190,
            bottom: -155,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(234,251,250,0.07)',
          }}
        />

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 14, alignItems: 'center' }}>
          <div>
            <p style={{ margin: '0 0 6px', color: OSP.gold, fontSize: 10, fontWeight: 950, letterSpacing: '0.17em', textTransform: 'uppercase' }}>
              ADMIN-CT-SPM-09K-2 / Compact Product Command
            </p>
            <h2
              style={{
                margin: 0,
                color: OSP.white,
                fontSize: 'clamp(1.35rem, 2vw, 2rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.055em',
                fontWeight: 760,
                textShadow: '0 3px 22px rgba(0,0,0,0.38)',
              }}
            >
              SPM Product Command
            </h2>
            <p style={{ margin: '9px 0 0', color: 'rgba(255,255,255,0.92)', fontSize: 13, lineHeight: 1.48, maxWidth: 760, fontWeight: 650 }}>
              One protected shell for Passport Map readiness: official trails, nodes, stamp rules, partner mapping, traveler price display,
              and frontend exposure.
            </p>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 11 }}>
              <Pill tone="gold">SPM command</Pill>
              <Pill tone="green">Shell contained</Pill>
              <Pill tone="teal">Approved records only</Pill>
              <Pill tone="muted">No duplicate panels</Pill>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Metric label="Controls" value="7" note="Operational lanes" tone="teal" />
            <Metric label="State" value="OK" note="Read contract visible" tone="gold" />
          </div>
        </div>
      </Card>

      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(120px, 1fr))', gap: 9 }}>
        <Metric label="Trail Families" value="8" note="Official trail structures" />
        <Metric label="Trail Nodes" value="37" note="Map inventory records" />
        <Metric label="Approved Nodes" value="15" note="Traveler-safe node pool" />
        <Metric label="Packages" value="17" note="SPM product candidates" />
      </div>

      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 315px', gap: 10, alignItems: 'start' }}>
        <Card>
          <p style={{ margin: '0 0 5px', color: OSP.teal, fontSize: 10, fontWeight: 950, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            SPM Operating Map
          </p>
          <h3 style={{ margin: 0, color: OSP.navy, fontSize: 22, lineHeight: 0.98, letterSpacing: '-0.05em', fontWeight: 820 }}>
            Seven lanes that make Passport Map publishable
          </h3>

          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(210px, 1fr))', gap: 9 }}>
            <ControlLane title="Passport Map" status="Ready" tone="green" note="Traveler map headline, CTAs, readiness gates, and GPS-deferred boundary." />
            <ControlLane title="Official Trails" status="Live" tone="green" note="Trail families, traveler-facing labels, descriptions, sorting, and active state." />
            <ControlLane title="Nodes / Stops" status="Live" tone="green" note="Approved map inventory under each trail family." />
            <ControlLane title="Stamp Rules" status="Live" tone="green" note="Proof-of-visit behavior from node-level stamp eligibility and validation fields." />
            <ControlLane title="Partner Mapping" status="Planned" tone="gold" note="Package-to-operator supply linkage without raw directory exposure." />
            <ControlLane title="Pricing Logic" status="Gated" tone="gold" note="Traveler-facing price display while central finance remains outside SPM." />
            <ControlLane title="Frontend Exposure" status="Planned" tone="gold" note="Publishing gate for traveler-facing surfaces." />
          </div>
        </Card>

        <div style={{ display: 'grid', gap: 10 }}>
          <Card tone="gold">
            <p style={{ margin: '0 0 5px', color: '#7A5200', fontSize: 10, fontWeight: 950, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Command Boundary
            </p>
            <h3 style={{ margin: 0, color: OSP.navy, fontSize: 18.5, lineHeight: 1.05 }}>
              SPM does not own central money logic
            </h3>
            <p style={{ margin: '8px 0 0', color: OSP.slate, fontSize: 12.2, lineHeight: 1.45 }}>
              SPM prepares traveler-facing product readiness and displayed price references. Central commercial controls stay in Pricing & Margin Governance.
            </p>
          </Card>

          <Card tone="mist">
            <p style={{ margin: '0 0 5px', color: OSP.teal, fontSize: 10, fontWeight: 950, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              VPS Readiness Signal
            </p>
            <h3 style={{ margin: 0, color: OSP.navy, fontSize: 18.5, lineHeight: 1.05 }}>
              Demo-safe only when shell stays contained
            </h3>
            <p style={{ margin: '8px 0 0', color: OSP.slate, fontSize: 12.2, lineHeight: 1.45 }}>
              No duplicate panels. No floating workspaces. No old placeholder blocks. Every SPM control must live inside this shell.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
