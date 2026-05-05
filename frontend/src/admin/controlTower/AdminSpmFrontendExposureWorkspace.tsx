'use client';

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';

const OSP = {
  navy: '#013863',
  deepNavy: '#003B66',
  teal: '#0596A5',
  tealDark: '#007B88',
  gold: '#F3AE26',
  mist: '#EAFBFA',
  white: '#FFFFFF',
  slate: '#50668B',
  softSlate: '#6C7FA5',
  line: 'rgba(1,56,99,0.10)',
  danger: '#B54708',
  green: '#16846F',
};

type ExposureSurface =
  | 'PASSPORT_TRAILS_HOME'
  | 'PARTNER_TOURS_PAGE'
  | 'EXPLORE_SIARGAO'
  | 'DIY_BUILDER'
  | 'TRAVELER_RECOMMENDATIONS';

type ExposureState =
  | 'PRIVATE_ADMIN_ONLY'
  | 'READY_FOR_REVIEW'
  | 'APPROVED_FOR_FRONTEND'
  | 'LIVE_ON_TRAVELER_UI'
  | 'HIDDEN'
  | 'SUSPENDED';

type PriorityBand = 'FEATURED_READY' | 'STANDARD' | 'LOW_PRIORITY' | 'SUPPRESSED';

type ExposureLane = 'PASSPORT_TRAIL' | 'PARTNER_TOUR' | 'DIY_ROUTE' | 'EXPLORE_CARD';

const products = [
  {
    code: 'TRI_ISLAND_JOINER',
    title: 'Tri-Island Passport Trail — Joiner',
    productType: 'Joiner Tour',
    lane: 'PASSPORT_TRAIL' as ExposureLane,
    surface: 'PASSPORT_TRAILS_HOME' as ExposureSurface,
    state: 'READY_FOR_REVIEW' as ExposureState,
    priority: 'STANDARD' as PriorityBand,
    cardTitle: 'Tri-Island Passport Trail — Joiner',
    cardSubtitle: 'Guyam · Naked · Daku · Secret Island when tide allows',
    cta: 'Request Availability',
  },
  {
    code: 'CORREGIDOR_TRI_ISLAND',
    title: 'Corregidor + Tri-Island Joiner',
    productType: 'Joiner Tour',
    lane: 'PARTNER_TOUR' as ExposureLane,
    surface: 'PARTNER_TOURS_PAGE' as ExposureSurface,
    state: 'READY_FOR_REVIEW' as ExposureState,
    priority: 'STANDARD' as PriorityBand,
    cardTitle: 'Corregidor + Tri-Island',
    cardSubtitle: 'Extended island route with staff confirmation',
    cta: 'Request Availability',
  },
  {
    code: 'LAND_TOUR_PRIVATE',
    title: 'Private DIY Land Tour',
    productType: 'Private Tour',
    lane: 'DIY_ROUTE' as ExposureLane,
    surface: 'DIY_BUILDER' as ExposureSurface,
    state: 'PRIVATE_ADMIN_ONLY' as ExposureState,
    priority: 'LOW_PRIORITY' as PriorityBand,
    cardTitle: 'Private DIY Land Tour',
    cardSubtitle: 'Custom route planning with OSP staff assistance',
    cta: 'Ask OSP to Assist',
  },
  {
    code: 'TRI_ISLAND_VVIP',
    title: 'Tri-Island Private VVIP',
    productType: 'VVIP Package',
    lane: 'EXPLORE_CARD' as ExposureLane,
    surface: 'PARTNER_TOURS_PAGE' as ExposureSurface,
    state: 'READY_FOR_REVIEW' as ExposureState,
    priority: 'FEATURED_READY' as PriorityBand,
    cardTitle: 'Tri-Island Private VVIP',
    cardSubtitle: 'Premium private package with staff confirmation',
    cta: 'Request Private Quote',
  },
];

const surfaceLabels: Record<ExposureSurface, string> = {
  PASSPORT_TRAILS_HOME: 'Passport Trails Home',
  PARTNER_TOURS_PAGE: 'Partner Tours Page',
  EXPLORE_SIARGAO: 'Explore Siargao',
  DIY_BUILDER: 'DIY Builder',
  TRAVELER_RECOMMENDATIONS: 'Traveler Recommendations',
};

const stateLabels: Record<ExposureState, string> = {
  PRIVATE_ADMIN_ONLY: 'Private Admin Only',
  READY_FOR_REVIEW: 'Ready for Review',
  APPROVED_FOR_FRONTEND: 'Approved for Frontend',
  LIVE_ON_TRAVELER_UI: 'Live on Traveler UI',
  HIDDEN: 'Hidden',
  SUSPENDED: 'Suspended',
};

const priorityLabels: Record<PriorityBand, string> = {
  FEATURED_READY: 'Featured Ready',
  STANDARD: 'Standard',
  LOW_PRIORITY: 'Low Priority',
  SUPPRESSED: 'Suppressed',
};

const laneLabels: Record<ExposureLane, string> = {
  PASSPORT_TRAIL: 'Passport Trail',
  PARTNER_TOUR: 'Partner Tour',
  DIY_ROUTE: 'DIY Route',
  EXPLORE_CARD: 'Explore Card',
};

function Pill({
  children,
  tone = 'teal',
}: {
  children: ReactNode;
  tone?: 'teal' | 'gold' | 'navy' | 'danger' | 'muted' | 'green';
}) {
  const palette = {
    teal: { background: 'rgba(5,150,165,0.13)', color: OSP.navy },
    gold: { background: 'rgba(243,174,38,0.22)', color: '#7A5200' },
    navy: { background: 'rgba(1,56,99,0.10)', color: OSP.navy },
    danger: { background: 'rgba(181,71,8,0.12)', color: OSP.danger },
    muted: { background: 'rgba(80,102,139,0.10)', color: OSP.slate },
    green: { background: 'rgba(22,132,111,0.12)', color: OSP.green },
  }[tone];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        minHeight: 23,
        padding: '0 10px',
        fontSize: 10,
        fontWeight: 950,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...palette,
      }}
    >
      {children}
    </span>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label style={{ display: 'block', marginBottom: 6, color: OSP.navy, fontSize: 11, fontWeight: 900 }}>
      {children}
    </label>
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
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75)',
  };
}

function Card({
  children,
  tone = 'white',
  style,
}: {
  children: ReactNode;
  tone?: 'white' | 'mist' | 'gold' | 'navy' | 'danger';
  style?: CSSProperties;
}) {
  const background =
    tone === 'navy'
      ? `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.tealDark})`
      : tone === 'gold'
      ? 'linear-gradient(135deg, rgba(255,247,230,0.98), rgba(255,255,255,0.96))'
      : tone === 'danger'
      ? 'linear-gradient(135deg, rgba(255,247,230,0.98), rgba(255,255,255,0.98))'
      : tone === 'mist'
      ? 'linear-gradient(135deg, rgba(234,251,250,0.88), rgba(255,255,255,0.98))'
      : OSP.white;

  return (
    <section
      style={{
        borderRadius: 22,
        border: tone === 'navy' ? '1px solid rgba(255,255,255,0.20)' : `1px solid ${OSP.line}`,
        background,
        padding: 14,
        boxShadow: tone === 'navy' ? '0 22px 54px rgba(1,56,99,0.24)' : '0 16px 34px rgba(1,56,99,0.055)',
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function CommandMetric({ label, value, note, tone = 'white' }: { label: string; value: string; note: string; tone?: 'white' | 'gold' | 'teal' }) {
  const background =
    tone === 'gold'
      ? 'rgba(243,174,38,0.18)'
      : tone === 'teal'
      ? 'rgba(5,150,165,0.12)'
      : 'rgba(255,255,255,0.92)';

  return (
    <article
      style={{
        borderRadius: 18,
        background,
        border: '1px solid rgba(255,255,255,0.24)',
        padding: 12,
        boxShadow: '0 12px 26px rgba(1,56,99,0.10)',
      }}
    >
      <div style={{ color: tone === 'gold' ? '#7A5200' : OSP.teal, fontSize: 10, fontWeight: 950, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <strong style={{ display: 'block', marginTop: 6, color: OSP.navy, fontSize: 18, lineHeight: 1.05, fontWeight: 950 }}>
        {value}
      </strong>
      <p style={{ margin: '6px 0 0', color: OSP.slate, fontSize: 11.5, lineHeight: 1.3, fontWeight: 720 }}>
        {note}
      </p>
    </article>
  );
}

function GateRail({
  title,
  checked,
  onChange,
  description,
}: {
  title: string;
  checked: boolean;
  onChange: () => void;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: '100%',
        minHeight: 64,
        borderRadius: 16,
        border: `1px solid ${checked ? 'rgba(5,150,165,0.30)' : 'rgba(243,174,38,0.38)'}`,
        background: checked ? 'rgba(5,150,165,0.10)' : 'rgba(243,174,38,0.13)',
        color: OSP.navy,
        cursor: 'pointer',
        textAlign: 'left',
        padding: 12,
        display: 'grid',
        gridTemplateColumns: '92px 1fr',
        gap: 10,
        alignItems: 'center',
      }}
    >
      <Pill tone={checked ? 'green' : 'gold'}>{checked ? 'Cleared' : 'Blocker'}</Pill>
      <span>
        <strong style={{ display: 'block', fontSize: 13, lineHeight: 1.15 }}>{title}</strong>
        <small style={{ display: 'block', marginTop: 4, color: OSP.slate, fontSize: 11.5, lineHeight: 1.25, fontWeight: 720 }}>
          {description}
        </small>
      </span>
    </button>
  );
}

function ExposureStageBoard({
  pricingReady,
  contentReady,
  mediaReady,
  mappingReady,
  bookingReady,
  operatorReady,
}: {
  pricingReady: boolean;
  contentReady: boolean;
  mediaReady: boolean;
  mappingReady: boolean;
  bookingReady: boolean;
  operatorReady: boolean;
}) {
  const steps = [
    { label: 'Pricing', ready: pricingReady },
    { label: 'Content', ready: contentReady },
    { label: 'Media', ready: mediaReady },
    { label: 'Trail Map', ready: mappingReady },
    { label: 'Booking', ready: bookingReady },
    { label: 'Operator', ready: operatorReady },
  ];

  return (
    <div
      style={{
        borderRadius: 22,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(234,251,250,0.78))',
        border: `1px solid ${OSP.line}`,
        padding: 14,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: OSP.teal, fontSize: 10, fontWeight: 950, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Exposure Release Pipeline
          </p>
          <h3 style={{ margin: '5px 0 0', color: OSP.navy, fontSize: 20, lineHeight: 1, letterSpacing: '-0.035em' }}>
            From private inventory to traveler visibility
          </h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 7, marginTop: 13 }}>
        {steps.map((step, index) => (
          <article
            key={step.label}
            style={{
              borderRadius: 15,
              minHeight: 82,
              padding: 10,
              background: step.ready ? 'rgba(5,150,165,0.11)' : 'rgba(243,174,38,0.13)',
              border: `1px solid ${step.ready ? 'rgba(5,150,165,0.24)' : 'rgba(243,174,38,0.28)'}`,
            }}
          >
            <div style={{ color: OSP.softSlate, fontSize: 10, fontWeight: 950 }}>0{index + 1}</div>
            <strong style={{ display: 'block', marginTop: 8, color: OSP.navy, fontSize: 13, lineHeight: 1.05 }}>{step.label}</strong>
            <div style={{ marginTop: 8 }}>
              <Pill tone={step.ready ? 'green' : 'gold'}>{step.ready ? 'OK' : 'Hold'}</Pill>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TravelerSurfacePreview({
  cardTitle,
  cardSubtitle,
  surface,
  cta,
  state,
  priority,
}: {
  cardTitle: string;
  cardSubtitle: string;
  surface: ExposureSurface;
  cta: string;
  state: ExposureState;
  priority: PriorityBand;
}) {
  const live = state === 'LIVE_ON_TRAVELER_UI' || state === 'APPROVED_FOR_FRONTEND';

  return (
    <Card tone="navy" style={{ padding: 10 }}>
      <div
        style={{
          borderRadius: 22,
          background: 'linear-gradient(180deg, #FFFFFF, #F4FCFA)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${OSP.deepNavy}, ${OSP.teal})`,
            padding: 14,
            color: OSP.white,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: '0.14em', fontWeight: 950, color: OSP.gold }}>
              SURFACE PREVIEW
            </div>
            <Pill tone={live ? 'green' : 'gold'}>{live ? 'Visible' : 'Hidden'}</Pill>
          </div>
          <h4 style={{ margin: '12px 0 0', fontSize: 20, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 820 }}>
            {surfaceLabels[surface]}
          </h4>
        </div>

        <div style={{ padding: 13 }}>
          <article
            style={{
              borderRadius: 18,
              border: `1px solid ${OSP.line}`,
              background: OSP.white,
              padding: 13,
              boxShadow: '0 12px 24px rgba(1,56,99,0.055)',
            }}
          >
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
              <Pill tone={priority === 'FEATURED_READY' ? 'gold' : 'teal'}>{priorityLabels[priority]}</Pill>
              <Pill tone="muted">{stateLabels[state]}</Pill>
            </div>
            <strong style={{ display: 'block', color: OSP.navy, fontSize: 18, lineHeight: 1.05 }}>{cardTitle}</strong>
            <p style={{ margin: '8px 0 0', color: OSP.slate, fontSize: 12.5, lineHeight: 1.42 }}>{cardSubtitle}</p>
          </article>

          <button
            type="button"
            style={{
              marginTop: 13,
              width: '100%',
              minHeight: 44,
              border: 0,
              borderRadius: 999,
              background: live ? OSP.gold : 'rgba(80,102,139,0.18)',
              color: OSP.navy,
              fontWeight: 950,
              fontSize: 13,
              cursor: 'default',
            }}
          >
            {live ? cta : 'Hidden Until Approved'}
          </button>
        </div>
      </div>
    </Card>
  );
}

export default function AdminSpmFrontendExposureWorkspace() {
  const [selectedCode, setSelectedCode] = useState(products[0].code);
  const selected = products.find((item) => item.code === selectedCode) ?? products[0];

  const [surface, setSurface] = useState<ExposureSurface>(selected.surface);
  const [state, setState] = useState<ExposureState>(selected.state);
  const [priority, setPriority] = useState<PriorityBand>(selected.priority);
  const [cardTitle, setCardTitle] = useState(selected.cardTitle);
  const [cardSubtitle, setCardSubtitle] = useState(selected.cardSubtitle);
  const [cta, setCta] = useState(selected.cta);

  const [pricingReady, setPricingReady] = useState(true);
  const [contentReady, setContentReady] = useState(true);
  const [mediaReady, setMediaReady] = useState(false);
  const [mappingReady, setMappingReady] = useState(true);
  const [bookingReady, setBookingReady] = useState(false);
  const [operatorReady, setOperatorReady] = useState(false);
  const [showContract, setShowContract] = useState(false);

  const issues = useMemo(() => {
    const warnings: string[] = [];

    if (!pricingReady) warnings.push('Pricing display is not ready.');
    if (!contentReady) warnings.push('Traveler-facing content is not ready.');
    if (!mediaReady) warnings.push('Media readiness is missing.');
    if (!mappingReady) warnings.push('Trail/node/stamp mapping is not ready.');
    if (!bookingReady) warnings.push('Booking behavior is not ready.');
    if (!operatorReady) warnings.push('Operator/service mapping is not ready where required.');
    if (!cardTitle.trim()) warnings.push('Traveler card title is missing.');
    if (!cardSubtitle.trim()) warnings.push('Traveler card subtitle is missing.');
    if ((state === 'LIVE_ON_TRAVELER_UI' || state === 'APPROVED_FOR_FRONTEND') && warnings.length > 0) {
      warnings.push('Cannot approve or expose until all readiness gates pass.');
    }
    if (priority === 'FEATURED_READY' && state !== 'LIVE_ON_TRAVELER_UI' && state !== 'APPROVED_FOR_FRONTEND') {
      warnings.push('Featured priority requires approved or live frontend state.');
    }

    return warnings;
  }, [pricingReady, contentReady, mediaReady, mappingReady, bookingReady, operatorReady, cardTitle, cardSubtitle, state, priority]);

  const exposureVerdict = issues.length ? 'EXPOSURE BLOCKED' : state === 'LIVE_ON_TRAVELER_UI' ? 'LIVE READY' : 'READY FOR FRONTEND';

  function handleProductChange(nextCode: string) {
    const next = products.find((item) => item.code === nextCode) ?? products[0];

    setSelectedCode(next.code);
    setSurface(next.surface);
    setState(next.state);
    setPriority(next.priority);
    setCardTitle(next.cardTitle);
    setCardSubtitle(next.cardSubtitle);
    setCta(next.cta);
    setPricingReady(true);
    setContentReady(true);
    setMediaReady(false);
    setMappingReady(true);
    setBookingReady(false);
    setOperatorReady(false);
  }

  const frontendExposureContract = {
    lane: 'ADMIN-CT-SPM-09H-2',
    purpose: 'Control Traveler UI exposure readiness for SPM products',
    backendWrite: false,
    dbWrite: false,
    noFlatOperatorDirectory: true,
    travelerFrontendExposureConfig: {
      productCode: selectedCode,
      productTitle: selected.title,
      productType: selected.productType,
      travelerSurface: surface,
      exposureState: state,
      priorityBand: priority,
      cardTitle,
      cardSubtitle,
      cta,
      readiness: {
        pricingReady,
        contentReady,
        mediaReady,
        mappingReady,
        bookingReady,
        operatorReady,
      },
      exposureWarnings: issues,
    },
  };

  return (
    <section
      style={{
        borderRadius: 30,
        border: `1px solid ${OSP.line}`,
        background:
          'radial-gradient(circle at top right, rgba(5,150,165,0.12), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.99), rgba(234,251,250,0.96))',
        padding: 15,
        boxShadow: '0 30px 76px rgba(1,56,99,0.11)',
      }}
    >
      <Card tone="navy" style={{ padding: 15, overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            right: -80,
            top: -110,
            width: 290,
            height: 290,
            borderRadius: '50%',
            background: 'rgba(243,174,38,0.18)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 120,
            bottom: -150,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(234,251,250,0.08)',
          }}
        />

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 14, alignItems: 'center' }}>
          <div>
            <p
              style={{
                margin: '0 0 8px',
                color: OSP.gold,
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: '0.17em',
                textTransform: 'uppercase',
              }}
            >
              ADMIN-CT-SPM-09H-2 / Exposure Gate Command Board
            </p>

            <h2
              style={{
                margin: 0,
                color: OSP.white,
                fontSize: 'clamp(1.45rem, 2.1vw, 2.1rem)',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                fontWeight: 760,
                textShadow: '0 2px 18px rgba(0,0,0,0.34)',
              }}
            >
              Decide what becomes visible to travelers
            </h2>

            <p style={{ margin: '10px 0 0', color: 'rgba(255,255,255,0.88)', fontSize: 13, lineHeight: 1.5, maxWidth: 760 }}>
              This is a publishing gate, not a pricing form. It controls whether approved SPM products can appear on Passport Trails,
              Partner Tours, Explore, DIY Builder, or recommendations after readiness gates are clean.
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              <Pill tone="gold">Traveler visibility gate</Pill>
              <Pill tone="teal">Approved records only</Pill>
              <Pill tone={issues.length ? 'gold' : 'green'}>{exposureVerdict}</Pill>
              <Pill tone="muted">No raw operator exposure</Pill>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            <CommandMetric label="Candidate" value="1" note="Selected product" tone="white" />
            <CommandMetric label="Surface" value={surfaceLabels[surface]} note="Publishing target" tone="teal" />
            <CommandMetric label="State" value={stateLabels[state]} note="Visibility status" tone="gold" />
            <CommandMetric label="Priority" value={priorityLabels[priority]} note="Exposure treatment" tone="white" />
          </div>
        </div>
      </Card>

      <div style={{ marginTop: 10 }}>
        <ExposureStageBoard
          pricingReady={pricingReady}
          contentReady={contentReady}
          mediaReady={mediaReady}
          mappingReady={mappingReady}
          bookingReady={bookingReady}
          operatorReady={operatorReady}
        />
      </div>

      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 10, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 10 }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
              <div>
                <p
                  style={{
                    margin: '0 0 6px',
                    color: OSP.teal,
                    fontSize: 10,
                    fontWeight: 950,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}
                >
                  Exposure Decision Panel
                </p>
                <h3 style={{ margin: 0, color: OSP.navy, fontSize: 22, lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 820 }}>
                  Select the product and decide its traveler surface
                </h3>
              </div>
              <Pill tone={issues.length ? 'gold' : 'green'}>{exposureVerdict}</Pill>
            </div>

            <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(130px, 1fr))', gap: 9 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <FieldLabel>SPM product / package</FieldLabel>
                <select value={selectedCode} onChange={(event) => handleProductChange(event.target.value)} style={controlStyle()}>
                  {products.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel>Traveler surface</FieldLabel>
                <select value={surface} onChange={(event) => setSurface(event.target.value as ExposureSurface)} style={controlStyle()}>
                  <option value="PASSPORT_TRAILS_HOME">Passport Trails Home</option>
                  <option value="PARTNER_TOURS_PAGE">Partner Tours Page</option>
                  <option value="EXPLORE_SIARGAO">Explore Siargao</option>
                  <option value="DIY_BUILDER">DIY Builder</option>
                  <option value="TRAVELER_RECOMMENDATIONS">Traveler Recommendations</option>
                </select>
              </div>

              <div>
                <FieldLabel>Exposure state</FieldLabel>
                <select value={state} onChange={(event) => setState(event.target.value as ExposureState)} style={controlStyle()}>
                  <option value="PRIVATE_ADMIN_ONLY">Private Admin Only</option>
                  <option value="READY_FOR_REVIEW">Ready for Review</option>
                  <option value="APPROVED_FOR_FRONTEND">Approved for Frontend</option>
                  <option value="LIVE_ON_TRAVELER_UI">Live on Traveler UI</option>
                  <option value="HIDDEN">Hidden</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>

              <div>
                <FieldLabel>Priority band</FieldLabel>
                <select value={priority} onChange={(event) => setPriority(event.target.value as PriorityBand)} style={controlStyle()}>
                  <option value="FEATURED_READY">Featured Ready</option>
                  <option value="STANDARD">Standard</option>
                  <option value="LOW_PRIORITY">Low Priority</option>
                  <option value="SUPPRESSED">Suppressed</option>
                </select>
              </div>

              <div>
                <FieldLabel>Traveler CTA</FieldLabel>
                <input value={cta} onChange={(event) => setCta(event.target.value)} style={controlStyle()} />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <FieldLabel>Traveler card title</FieldLabel>
                <input value={cardTitle} onChange={(event) => setCardTitle(event.target.value)} style={controlStyle()} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <FieldLabel>Traveler card subtitle</FieldLabel>
                <textarea
                  value={cardSubtitle}
                  onChange={(event) => setCardSubtitle(event.target.value)}
                  style={{
                    ...controlStyle(),
                    minHeight: 66,
                    paddingTop: 12,
                    resize: 'vertical',
                    lineHeight: 1.45,
                  }}
                />
              </div>
            </div>
          </Card>

          <Card>
            <p
              style={{
                margin: '0 0 6px',
                color: OSP.teal,
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Publishing Gate Checklist
            </p>
            <h3 style={{ margin: 0, color: OSP.navy, fontSize: 22, lineHeight: 1, letterSpacing: '-0.04em' }}>
              Clear blockers before exposure
            </h3>
            <p style={{ margin: '8px 0 0', color: OSP.slate, fontSize: 12.5, lineHeight: 1.45 }}>
              This gate prevents unfinished products from leaking to traveler pages and protects trust before VPS.
            </p>

            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 9 }}>
              <GateRail title="Pricing ready" checked={pricingReady} onChange={() => setPricingReady((value) => !value)} description="Traveler price display is configured." />
              <GateRail title="Content ready" checked={contentReady} onChange={() => setContentReady((value) => !value)} description="Card title, subtitle, and CTA are usable." />
              <GateRail title="Media ready" checked={mediaReady} onChange={() => setMediaReady((value) => !value)} description="Traveler surface has usable product media." />
              <GateRail title="Trail mapping ready" checked={mappingReady} onChange={() => setMappingReady((value) => !value)} description="Trail, node, or stamp context is mapped." />
              <GateRail title="Booking ready" checked={bookingReady} onChange={() => setBookingReady((value) => !value)} description="Booking behavior will not confuse travelers." />
              <GateRail title="Operator mapping ready" checked={operatorReady} onChange={() => setOperatorReady((value) => !value)} description="Operator/service dependency is governed." />
            </div>

            <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              {issues.length ? (
                issues.map((issue) => (
                  <div
                    key={issue}
                    style={{
                      borderRadius: 14,
                      background: 'rgba(243,174,38,0.18)',
                      border: '1px solid rgba(243,174,38,0.30)',
                      padding: 10,
                      color: OSP.navy,
                      fontSize: 12,
                      fontWeight: 820,
                      lineHeight: 1.45,
                    }}
                  >
                    {issue}
                  </div>
                ))
              ) : (
                <div
                  style={{
                    borderRadius: 14,
                    background: 'rgba(5,150,165,0.12)',
                    border: '1px solid rgba(5,150,165,0.22)',
                    padding: 12,
                    color: OSP.navy,
                    fontSize: 12,
                    fontWeight: 850,
                  }}
                >
                  This product is ready for traveler exposure review.
                </div>
              )}
            </div>
          </Card>

          <Card tone="mist">
            <button
              type="button"
              onClick={() => setShowContract((value) => !value)}
              style={{
                width: '100%',
                minHeight: 46,
                borderRadius: 16,
                border: `1px solid ${OSP.line}`,
                background: OSP.white,
                color: OSP.navy,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 950,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 14px',
              }}
            >
              <span>Frontend Exposure Contract Preview</span>
              <span>{showContract ? 'Hide Preview' : 'Show Preview'}</span>
            </button>

            {showContract ? (
              <pre
                style={{
                  margin: '12px 0 0',
                  maxHeight: 300,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  borderRadius: 18,
                  background: '#012B4A',
                  color: '#EAFBFA',
                  padding: 14,
                  fontSize: 11.5,
                  lineHeight: 1.55,
                }}
              >
                {JSON.stringify(frontendExposureContract, null, 2)}
              </pre>
            ) : (
              <p style={{ margin: '10px 0 0', color: OSP.slate, fontSize: 12.5, lineHeight: 1.45 }}>
                Contract preview is hidden by default. This surface models traveler visibility only; it does not publish to backend or database.
              </p>
            )}
          </Card>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          <TravelerSurfacePreview
            cardTitle={cardTitle}
            cardSubtitle={cardSubtitle}
            surface={surface}
            cta={cta}
            state={state}
            priority={priority}
          />

          <Card tone="gold">
            <p
              style={{
                margin: '0 0 6px',
                color: '#7A5200',
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Exposure Boundary
            </p>
            <h3 style={{ margin: 0, color: OSP.navy, fontSize: 20, lineHeight: 1.05 }}>
              Not a raw inventory switch
            </h3>
            <p style={{ margin: '8px 0 0', color: OSP.slate, fontSize: 12.5, lineHeight: 1.5 }}>
              Frontend Exposure controls traveler visibility after product readiness is clean. It does not bypass pricing,
              operator mapping, booking readiness, content, or media gates.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
