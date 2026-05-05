'use client';

const ADMIN_CT_SPM_09J2_PREMIUM_UI_HARDENED = true;

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';

const OSP = {
  navy: '#013863',
  deepNavy: '#003B66',
  teal: '#0596A5',
  gold: '#F3AE26',
  white: '#FFFFFF',
  mist: '#EAFBFA',
  slate: '#50668B',
  line: 'rgba(1,56,99,0.10)',
};

type MapSurface = 'PUBLIC_PASSPORT_MAP' | 'TRAVELER_PASSPORT_MAP' | 'PASSPORT_TRAILS_HOME' | 'DIY_BUILDER_ENTRY';
type ReadinessState = 'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVED_FOR_FRONTEND' | 'LIVE' | 'SUSPENDED';

const surfaces: Record<MapSurface, string> = {
  PUBLIC_PASSPORT_MAP: 'Public Passport Map',
  TRAVELER_PASSPORT_MAP: 'Traveler Passport Map',
  PASSPORT_TRAILS_HOME: 'Passport Trails Home',
  DIY_BUILDER_ENTRY: 'DIY Builder Entry',
};

const states: Record<ReadinessState, string> = {
  DRAFT: 'Draft',
  READY_FOR_REVIEW: 'Ready for Review',
  APPROVED_FOR_FRONTEND: 'Approved for Frontend',
  LIVE: 'Live',
  SUSPENDED: 'Suspended',
};

function Pill({ children, tone = 'teal' }: { children: ReactNode; tone?: 'teal' | 'gold' | 'navy' | 'green' | 'muted' }) {
  const palette = {
    teal: { background: 'rgba(5,150,165,0.13)', color: OSP.navy },
    gold: { background: 'rgba(243,174,38,0.22)', color: '#7A5200' },
    navy: { background: 'rgba(1,56,99,0.10)', color: OSP.navy },
    green: { background: 'rgba(22,132,111,0.12)', color: '#16846F' },
    muted: { background: 'rgba(80,102,139,0.10)', color: OSP.slate },
  }[tone];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 23,
      borderRadius: 999,
      padding: '0 10px',
      fontSize: 10,
      fontWeight: 950,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...palette,
    }}>
      {children}
    </span>
  );
}

function Card({ children, tone = 'white', style }: { children: ReactNode; tone?: 'white' | 'navy' | 'mist' | 'gold'; style?: CSSProperties }) {
  const background =
    tone === 'navy'
      ? `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`
      : tone === 'gold'
      ? 'linear-gradient(135deg, rgba(255,247,230,0.98), rgba(255,255,255,0.96))'
      : tone === 'mist'
      ? 'linear-gradient(135deg, rgba(234,251,250,0.92), rgba(255,255,255,0.98))'
      : OSP.white;

  return (
    <section style={{
      borderRadius: 22,
      border: tone === 'navy' ? '1px solid rgba(255,255,255,0.20)' : `1px solid ${OSP.line}`,
      background,
      padding: 14,
      boxShadow: tone === 'navy' ? '0 22px 54px rgba(1,56,99,0.24)' : '0 16px 34px rgba(1,56,99,0.055)',
      ...style,
    }}>
      {children}
    </section>
  );
}

function controlStyle(): CSSProperties {
  return {
    width: '100%',
    minHeight: 40,
    borderRadius: 13,
    border: `1px solid ${OSP.line}`,
    background: OSP.white,
    color: OSP.navy,
    padding: '0 12px',
    fontSize: 13,
    fontWeight: 850,
    outline: 'none',
  };
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label style={{ display: 'block', marginBottom: 6, color: OSP.navy, fontSize: 11, fontWeight: 900 }}>{children}</label>;
}

function Gate({ title, ready, onClick, note }: { title: string; ready: boolean; onClick: () => void; note: string }) {
  return (
    <button type="button" onClick={onClick} style={{
      border: `1px solid ${ready ? 'rgba(5,150,165,0.30)' : 'rgba(243,174,38,0.38)'}`,
      background: ready ? 'rgba(5,150,165,0.10)' : 'rgba(243,174,38,0.13)',
      borderRadius: 16,
      minHeight: 76,
      padding: 12,
      textAlign: 'left',
      color: OSP.navy,
      cursor: 'pointer',
    }}>
      <Pill tone={ready ? 'green' : 'gold'}>{ready ? 'Ready' : 'Hold'}</Pill>
      <strong style={{ display: 'block', marginTop: 8, fontSize: 13 }}>{title}</strong>
      <small style={{ display: 'block', marginTop: 4, color: OSP.slate, fontSize: 11.5, lineHeight: 1.3 }}>{note}</small>
    </button>
  );
}

export default function AdminSpmPassportMapWorkspace() {
  const [surface, setSurface] = useState<MapSurface>('PUBLIC_PASSPORT_MAP');
  const [state, setState] = useState<ReadinessState>('READY_FOR_REVIEW');
  const [heroTitle, setHeroTitle] = useState('Siargao Passport Map');
  const [heroSubtitle, setHeroSubtitle] = useState('Collect stamps. Unlock trails. Create memories that last.');
  const [primaryCta, setPrimaryCta] = useState('Explore Passport Trails');
  const [secondaryCta, setSecondaryCta] = useState('Build Your Own Trail');

  const [labelsReady, setLabelsReady] = useState(true);
  const [routesReady, setRoutesReady] = useState(true);
  const [nodesReady, setNodesReady] = useState(true);
  const [stampRulesReady, setStampRulesReady] = useState(false);
  const [pricingReady, setPricingReady] = useState(false);
  const [exposureReady, setExposureReady] = useState(false);

  const blockers = useMemo(() => {
    const list: string[] = [];
    if (!labelsReady) list.push('Traveler-facing labels are not ready.');
    if (!routesReady) list.push('CTA routes are not ready.');
    if (!nodesReady) list.push('Map-ready nodes are not approved.');
    if (!stampRulesReady) list.push('Stamp rules are not ready.');
    if (!pricingReady) list.push('Pricing display is not ready.');
    if (!exposureReady) list.push('Frontend exposure gate is not ready.');
    if ((state === 'LIVE' || state === 'APPROVED_FOR_FRONTEND') && list.length) {
      list.push('Cannot approve Passport Map frontend until all readiness gates pass.');
    }
    return list;
  }, [labelsReady, routesReady, nodesReady, stampRulesReady, pricingReady, exposureReady, state]);

  const verdict = blockers.length ? 'MAP READINESS BLOCKED' : state === 'LIVE' ? 'LIVE READY' : 'READY FOR FRONTEND REVIEW';

  return (
    <section style={{
      borderRadius: 30,
      border: `1px solid ${OSP.line}`,
      background: 'radial-gradient(circle at top right, rgba(5,150,165,0.12), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.99), rgba(234,251,250,0.96))',
      padding: 15,
      boxShadow: '0 30px 76px rgba(1,56,99,0.11)',
    }}>
      <Card tone="navy" style={{ overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', right: -70, top: -90, width: 260, height: 260, borderRadius: '50%', background: 'rgba(243,174,38,0.16)' }} />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: 14, alignItems: 'center' }}>
          <div>
            <p style={{ margin: '0 0 8px', color: OSP.gold, fontSize: 10, fontWeight: 950, letterSpacing: '0.17em', textTransform: 'uppercase' }}>
              ADMIN-CT-SPM-09J-1 / Passport Map Frontend Readiness
            </p>
            <h2 style={{ margin: 0, color: '#FFFFFF', fontSize: 'clamp(1.55rem, 2.25vw, 2.35rem)', lineHeight: 0.96, letterSpacing: '-0.055em', fontWeight: 760, textShadow: '0 3px 24px rgba(0,0,0,0.38)' }}>
              Passport Map Publishing Control
            </h2>
            <p style={{ margin: '10px 0 0', color: 'rgba(255,255,255,0.92)', fontSize: 13.5, lineHeight: 1.55, maxWidth: 760, fontWeight: 650 }}>
              Control the Passport Map traveler surface before it goes public: headline, CTAs, route readiness, approved node visibility, stamp dependency, pricing dependency, and exposure gate.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              <Pill tone="gold">Traveler map surface</Pill>
              <Pill tone="teal">Approved labels only</Pill>
              <Pill tone={blockers.length ? 'gold' : 'green'}>{verdict}</Pill>
              <Pill tone="muted">GPS deferred</Pill>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 9 }}>
            <div style={{ borderRadius: 18, background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(255,255,255,0.26)', padding: 13, boxShadow: '0 16px 34px rgba(1,56,99,0.16)' }}>
              <p style={{ margin: 0, color: OSP.teal, fontSize: 10, fontWeight: 950, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Surface</p>
              <strong style={{ display: 'block', marginTop: 6, color: OSP.navy, fontSize: 16, lineHeight: 1.05 }}>{surfaces[surface]}</strong>
            </div>
            <div style={{ borderRadius: 18, background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(255,255,255,0.26)', padding: 13, boxShadow: '0 16px 34px rgba(1,56,99,0.16)' }}>
              <p style={{ margin: 0, color: OSP.teal, fontSize: 10, fontWeight: 950, letterSpacing: '0.14em', textTransform: 'uppercase' }}>State</p>
              <strong style={{ display: 'block', marginTop: 6, color: OSP.navy, fontSize: 16, lineHeight: 1.05 }}>{states[state]}</strong>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 12, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 10 }}>
          <Card>
            <p style={{ margin: '0 0 6px', color: OSP.teal, fontSize: 10, fontWeight: 950, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Traveler Map Copy + Route Setup
            </p>
            <h3 style={{ margin: 0, color: OSP.navy, fontSize: 22, lineHeight: 1, letterSpacing: '-0.04em' }}>
              Configure the Passport Map traveler experience
            </h3>

            <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(180px, 1fr))', gap: 12 }}>
              <div>
                <FieldLabel>Map surface</FieldLabel>
                <select value={surface} onChange={(event) => setSurface(event.target.value as MapSurface)} style={controlStyle()}>
                  <option value="PUBLIC_PASSPORT_MAP">Public Passport Map</option>
                  <option value="TRAVELER_PASSPORT_MAP">Traveler Passport Map</option>
                  <option value="PASSPORT_TRAILS_HOME">Passport Trails Home</option>
                  <option value="DIY_BUILDER_ENTRY">DIY Builder Entry</option>
                </select>
              </div>

              <div>
                <FieldLabel>Frontend state</FieldLabel>
                <select value={state} onChange={(event) => setState(event.target.value as ReadinessState)} style={controlStyle()}>
                  <option value="DRAFT">Draft</option>
                  <option value="READY_FOR_REVIEW">Ready for Review</option>
                  <option value="APPROVED_FOR_FRONTEND">Approved for Frontend</option>
                  <option value="LIVE">Live</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>

              <div>
                <FieldLabel>Hero title</FieldLabel>
                <input value={heroTitle} onChange={(event) => setHeroTitle(event.target.value)} style={controlStyle()} />
              </div>

              <div>
                <FieldLabel>Primary CTA</FieldLabel>
                <input value={primaryCta} onChange={(event) => setPrimaryCta(event.target.value)} style={controlStyle()} />
              </div>

              <div>
                <FieldLabel>Secondary CTA</FieldLabel>
                <input value={secondaryCta} onChange={(event) => setSecondaryCta(event.target.value)} style={controlStyle()} />
              </div>

              <div>
                <FieldLabel>GPS mode</FieldLabel>
                <input value="Deferred — map readiness is not GPS-based yet" readOnly style={controlStyle()} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <FieldLabel>Hero subtitle</FieldLabel>
                <textarea value={heroSubtitle} onChange={(event) => setHeroSubtitle(event.target.value)} style={{ ...controlStyle(), minHeight: 70, paddingTop: 12, resize: 'vertical', lineHeight: 1.45 }} />
              </div>
            </div>
          </Card>

          <Card>
            <p style={{ margin: '0 0 6px', color: OSP.teal, fontSize: 10, fontWeight: 950, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Passport Map Readiness Gates
            </p>
            <h3 style={{ margin: 0, color: OSP.navy, fontSize: 22, lineHeight: 1, letterSpacing: '-0.045em', fontWeight: 820 }}>
              Clear the map before traveler exposure
            </h3>

            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 9 }}>
              <Gate title="Labels ready" ready={labelsReady} onClick={() => setLabelsReady((v) => !v)} note="Traveler-facing map labels are clean." />
              <Gate title="CTA routes ready" ready={routesReady} onClick={() => setRoutesReady((v) => !v)} note="Buttons land on correct traveler pages." />
              <Gate title="Nodes ready" ready={nodesReady} onClick={() => setNodesReady((v) => !v)} note="Only approved nodes should be visible." />
              <Gate title="Stamp rules ready" ready={stampRulesReady} onClick={() => setStampRulesReady((v) => !v)} note="Proof-of-visit behavior is clear." />
              <Gate title="Pricing dependency ready" ready={pricingReady} onClick={() => setPricingReady((v) => !v)} note="Shown products have traveler prices." />
              <Gate title="Exposure gate ready" ready={exposureReady} onClick={() => setExposureReady((v) => !v)} note="Frontend Exposure allows publishing." />
            </div>

            <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              {blockers.length ? blockers.map((blocker) => (
                <div key={blocker} style={{ borderRadius: 14, background: 'rgba(243,174,38,0.18)', border: '1px solid rgba(243,174,38,0.30)', padding: 10, color: OSP.navy, fontSize: 12, fontWeight: 820 }}>
                  {blocker}
                </div>
              )) : (
                <div style={{ borderRadius: 14, background: 'rgba(5,150,165,0.12)', border: '1px solid rgba(5,150,165,0.22)', padding: 12, color: OSP.navy, fontSize: 12, fontWeight: 850 }}>
                  Passport Map frontend is ready for review.
                </div>
              )}
            </div>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          <Card tone="navy" style={{ padding: 10 }}>
            <div style={{ borderRadius: 22, background: 'linear-gradient(180deg, #FFFFFF, #F4FCFA)', overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`, padding: 16, color: OSP.white }}>
                <p style={{ margin: 0, color: OSP.gold, fontSize: 10, fontWeight: 950, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  TRAVELER MAP PREVIEW
                </p>
                <h4 style={{ margin: '12px 0 0', fontSize: 23, lineHeight: 0.98, letterSpacing: '-0.05em', fontWeight: 800 }}>{heroTitle}</h4>
                <p style={{ margin: '8px 0 0', fontSize: 12.5, lineHeight: 1.4, color: 'rgba(255,255,255,0.88)' }}>{heroSubtitle}</p>
              </div>
              <div style={{ padding: 14 }}>
                <Pill tone={blockers.length ? 'gold' : 'green'}>{verdict}</Pill>
                <div style={{ display: 'grid', gap: 9, marginTop: 12 }}>
                  <button type="button" style={{ minHeight: 42, border: 0, borderRadius: 999, background: OSP.gold, color: OSP.navy, fontWeight: 950 }}>
                    {primaryCta}
                  </button>
                  <button type="button" style={{ minHeight: 42, borderRadius: 999, background: OSP.white, color: OSP.navy, fontWeight: 950, border: `1px solid ${OSP.line}` }}>
                    {secondaryCta}
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card tone="gold">
            <p style={{ margin: '0 0 6px', color: '#7A5200', fontSize: 10, fontWeight: 950, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Boundary Lock
            </p>
            <h3 style={{ margin: 0, color: OSP.navy, fontSize: 20, lineHeight: 1.05 }}>
              Map control is not GPS dispatch
            </h3>
            <p style={{ margin: '8px 0 0', color: OSP.slate, fontSize: 12.5, lineHeight: 1.5 }}>
              This tab controls Passport Map frontend readiness only. GPS logic, live location tracking, and real movement validation remain deferred.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
