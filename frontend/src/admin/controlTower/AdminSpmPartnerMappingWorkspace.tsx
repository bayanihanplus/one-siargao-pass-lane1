'use client';

import { useMemo, useState, type CSSProperties } from 'react';

const OSP = {
  deepNavy: '#013863',
  navy2: '#003B66',
  teal: '#0596A5',
  gold: '#F3AE26',
  white: '#FFFFFF',
  mist: '#EAFBFA',
  soft: '#F4FCFA',
  slate: '#50668B',
  danger: '#B42318',
};

type TabKey = 'packageMapping' | 'operatorServices' | 'staffReview' | 'notifications' | 'contractPreview';
type SourceType = 'SPM Curated' | 'Operator Partner' | 'DIY Assisted' | 'OTA Assisted';
type BookingMode = 'Instant Book' | 'Request to Confirm' | 'Admin Assisted' | 'Not Bookable';
type ReadinessState = 'Draft' | 'For Review' | 'Approved' | 'Live' | 'Suspended';
type ReviewState = 'Submitted' | 'Under Review' | 'Approved' | 'Needs Revision' | 'Rejected';

type PackageOption = {
  id: string;
  title: string;
  lane: string;
  description: string;
};

type NodeOption = {
  id: string;
  title: string;
  family: string;
  stampLabel: string;
};

type OperatorServiceOption = {
  id: string;
  operatorName: string;
  serviceTitle: string;
  serviceType: string;
  readiness: string;
};

type MappingRecord = {
  id: string;
  packageTitle: string;
  nodeTitle: string;
  operatorName: string;
  serviceTitle: string;
  sourceType: SourceType;
  bookingMode: BookingMode;
  readiness: ReadinessState;
  staffNotes: string;
};

type OperatorSubmission = {
  id: string;
  operatorName: string;
  operatorEmail: string;
  serviceTitle: string;
  serviceType: string;
  packageTitle: string;
  nodeTitle: string;
  inclusions: string;
  commercialNote: string;
  reviewState: ReviewState;
  staffNote: string;
};

type NotificationRecord = {
  id: string;
  channel: 'In-app' | 'Email';
  recipient: string;
  subject: string;
  message: string;
  status: string;
};

const packageOptions: PackageOption[] = [
  {
    id: 'pkg-tri-island',
    title: 'Tri-Island Passport Trail — Joiner',
    lane: 'SPM Package',
    description: 'Island-hopping package prepared for approved operator supply and controlled booking handoff.',
  },
  {
    id: 'pkg-cloud9',
    title: 'Cloud 9 Surf + Scenic Passport Trail',
    lane: 'Passport Trail',
    description: 'Surf discovery route with scenic stops, stamp collection, and partner support.',
  },
  {
    id: 'pkg-north',
    title: 'North Siargao Discovery Trail',
    lane: 'Passport Trail',
    description: 'North-side route connecting approved scenic, beach, and activity stops.',
  },
  {
    id: 'pkg-diy',
    title: 'Build Your Own Family Passport Trail',
    lane: 'DIY Assisted',
    description: 'Staff-assisted route request where operators are attached only when required.',
  },
];

const nodeOptions: NodeOption[] = [
  { id: 'node-corregidor', title: 'Corregidor Island', family: 'Island Hopping', stampLabel: 'Stamp eligible' },
  { id: 'node-daku', title: 'Daku Island', family: 'Island Hopping', stampLabel: 'Stamp eligible' },
  { id: 'node-departure', title: 'General Luna Island Hopping Departure', family: 'Island Hopping', stampLabel: 'Checkpoint only' },
  { id: 'node-cloud9', title: 'Cloud 9 Boardwalk', family: 'Surf Explorer', stampLabel: 'Stamp eligible' },
  { id: 'node-pacifico', title: 'Pacifico', family: 'North Siargao', stampLabel: 'Stamp eligible' },
];

const operatorServiceOptions: OperatorServiceOption[] = [
  {
    id: 'svc-island-hop-a',
    operatorName: 'Approved Island Hopping Partner A',
    serviceTitle: 'Tri-Island Boat + Guide Support',
    serviceType: 'Island Hopping',
    readiness: 'Approved supply sample',
  },
  {
    id: 'svc-land-a',
    operatorName: 'Approved Land Tour Partner A',
    serviceTitle: 'North Siargao TukTuk / Land Route Support',
    serviceType: 'Land Tour',
    readiness: 'Approved supply sample',
  },
  {
    id: 'svc-surf-a',
    operatorName: 'Approved Surf Partner A',
    serviceTitle: 'Cloud 9 Surf Orientation Support',
    serviceType: 'Surf',
    readiness: 'Review sample',
  },
  {
    id: 'svc-manual',
    operatorName: 'Admin-Assisted Fulfillment Pool',
    serviceTitle: 'Manual Operator Assignment Required',
    serviceType: 'Admin Assisted',
    readiness: 'Manual assignment sample',
  },
];

const baseCard: CSSProperties = {
  borderRadius: 16,
  border: '1px solid rgba(1,56,99,0.10)',
  background: 'rgba(255,255,255,0.96)',
  boxShadow: '0 18px 44px rgba(1,56,99,0.075)',
};

const fieldStyle: CSSProperties = {
  width: '100%',
  minHeight: 44,
  marginTop: 7,
  borderRadius: 14,
  border: '1px solid rgba(1,56,99,0.14)',
  background: OSP.white,
  color: OSP.deepNavy,
  padding: '0 10px',
  fontWeight: 850,
  outline: 'none',
  boxShadow: '0 8px 18px rgba(1,56,99,0.035)',
};

const textAreaStyle: CSSProperties = {
  width: '100%',
  marginTop: 7,
  borderRadius: 14,
  border: '1px solid rgba(1,56,99,0.14)',
  background: OSP.white,
  color: OSP.deepNavy,
  padding: 9,
  fontWeight: 750,
  outline: 'none',
  resize: 'vertical',
};

const labelStyle: CSSProperties = {
  color: OSP.deepNavy,
  fontSize: 12,
  fontWeight: 900,
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function chipTone(value: string): CSSProperties {
  const normalized = value.toLowerCase();

  if (normalized.includes('approved') || normalized.includes('live')) {
    return { background: 'rgba(5,150,165,0.15)', color: OSP.deepNavy };
  }

  if (normalized.includes('review') || normalized.includes('revision') || normalized.includes('confirm')) {
    return { background: 'rgba(243,174,38,0.23)', color: OSP.deepNavy };
  }

  if (normalized.includes('reject') || normalized.includes('suspended') || normalized.includes('not')) {
    return { background: 'rgba(180,35,24,0.10)', color: OSP.deepNavy };
  }

  return { background: 'rgba(80,102,139,0.11)', color: OSP.slate };
}

function StatusChip({ children, tone }: { children: React.ReactNode; tone: string }) {
  return (
    <span
      style={{
        borderRadius: 999,
        padding: '7px 10px',
        fontSize: 10,
        fontWeight: 950,
        letterSpacing: '0.075em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...chipTone(tone),
      }}
    >
      {children}
    </span>
  );
}

function WorkspaceHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <p
        style={{
          margin: '0 0 7px',
          color: OSP.teal,
          fontSize: 11,
          fontWeight: 950,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </p>
      <h3
        style={{
          margin: 0,
          color: OSP.deepNavy,
          fontSize: 'clamp(1.42rem, 2vw, 1.95rem)',
          lineHeight: 1,
          letterSpacing: '-0.055em',
          fontWeight: 760,
        }}
      >
        {title}
      </h3>
      <p style={{ margin: '10px 0 0', color: OSP.slate, fontSize: 12.5, lineHeight: 1.6 }}>
        {body}
      </p>
    </div>
  );
}

const compactHeroClampApplied = true;

const ADMIN_CT_SPM_09F_9B_PARTNER_COMPACTED = true;
const ADMIN_CT_SPM_09F_10_NUCLEAR_PARTNER_UX = true;

export default function AdminSpmPartnerMappingWorkspace() {
  const [activeTab, setActiveTab] = useState<TabKey>('packageMapping');

  const [selectedPackageId, setSelectedPackageId] = useState(packageOptions[0].id);
  const [selectedNodeId, setSelectedNodeId] = useState(nodeOptions[0].id);
  const [selectedServiceId, setSelectedServiceId] = useState(operatorServiceOptions[0].id);
  const [sourceType, setSourceType] = useState<SourceType>('SPM Curated');
  const [bookingMode, setBookingMode] = useState<BookingMode>('Request to Confirm');
  const [readiness, setReadiness] = useState<ReadinessState>('For Review');
  const [staffNotes, setStaffNotes] = useState('');

  const [operatorName, setOperatorName] = useState('Sample Operator');
  const [operatorEmail, setOperatorEmail] = useState('operator@example.com');
  const [operatorServiceTitle, setOperatorServiceTitle] = useState('');
  const [operatorServiceType, setOperatorServiceType] = useState('Island Hopping');
  const [operatorInclusions, setOperatorInclusions] = useState('');
  const [operatorCommercialNote, setOperatorCommercialNote] = useState('');

  const [mappingRecords, setMappingRecords] = useState<MappingRecord[]>([
    {
      id: 'map-sample-001',
      packageTitle: 'Tri-Island Passport Trail — Joiner',
      nodeTitle: 'Daku Island',
      operatorName: 'Approved Island Hopping Partner A',
      serviceTitle: 'Tri-Island Boat + Guide Support',
      sourceType: 'SPM Curated',
      bookingMode: 'Request to Confirm',
      readiness: 'For Review',
      staffNotes: 'Use as sample mapping for island-hopping supply readiness.',
    },
  ]);

  const [operatorSubmissions, setOperatorSubmissions] = useState<OperatorSubmission[]>([
    {
      id: 'submission-sample-001',
      operatorName: 'Approved Island Hopping Partner A',
      operatorEmail: 'operator.prototype@osp.local',
      serviceTitle: 'Tri-Island Boat + Guide Support',
      serviceType: 'Island Hopping',
      packageTitle: 'Tri-Island Passport Trail — Joiner',
      nodeTitle: 'Daku Island',
      inclusions: 'Boat, guide coordination, island hopping operational support, pickup coordination.',
      commercialNote: 'Request-to-confirm until final rate card is approved.',
      reviewState: 'Under Review',
      staffNote: 'Check operator compliance and island-hopping capacity before live exposure.',
    },
  ]);

  const [notifications, setMessages] = useState<NotificationRecord[]>([]);
  const [selectedReviewId, setSelectedReviewId] = useState('submission-sample-001');

  const selectedPackage = useMemo(
    () => packageOptions.find((item) => item.id === selectedPackageId) || packageOptions[0],
    [selectedPackageId],
  );

  const selectedNode = useMemo(
    () => nodeOptions.find((item) => item.id === selectedNodeId) || nodeOptions[0],
    [selectedNodeId],
  );

  const selectedService = useMemo(
    () => operatorServiceOptions.find((item) => item.id === selectedServiceId) || operatorServiceOptions[0],
    [selectedServiceId],
  );

  const selectedReview = useMemo(
    () => operatorSubmissions.find((item) => item.id === selectedReviewId) || operatorSubmissions[0],
    [operatorSubmissions, selectedReviewId],
  );

  const readyMappings = mappingRecords.filter((record) => ['Approved', 'Live'].includes(record.readiness)).length;
  const reviewQueue = operatorSubmissions.filter((record) =>
    ['Submitted', 'Under Review', 'Needs Revision'].includes(record.reviewState),
  ).length;

  const canAddMapping = Boolean(selectedPackageId && selectedNodeId && selectedServiceId);
  const canSubmitService = Boolean(operatorName.trim() && operatorEmail.trim() && operatorServiceTitle.trim());

  function pushNotification(params: {
    channel: 'In-app' | 'Email';
    recipient: string;
    subject: string;
    message: string;
  }) {
    const next: NotificationRecord = {
      id: makeId('notice'),
      channel: params.channel,
      recipient: params.recipient,
      subject: params.subject,
      message: params.message,
      status: 'Queued sample',
    };

    setMessages((current) => [next, ...current]);
  }

  function addMapping() {
    if (!canAddMapping) return;

    const next: MappingRecord = {
      id: makeId('mapping'),
      packageTitle: selectedPackage.title,
      nodeTitle: selectedNode.title,
      operatorName: selectedService.operatorName,
      serviceTitle: selectedService.serviceTitle,
      sourceType,
      bookingMode,
      readiness,
      staffNotes: staffNotes.trim(),
    };

    setMappingRecords((current) => [next, ...current]);
    setStaffNotes('');

    pushNotification({
      channel: 'In-app',
      recipient: 'SPM Mapping Team',
      subject: 'New package-to-operator mapping prepared',
      message: `${selectedPackage.title} was mapped to ${selectedNode.title} using ${selectedService.serviceTitle}.`,
    });
  }

  function submitOperatorService() {
    if (!canSubmitService) return;

    const next: OperatorSubmission = {
      id: makeId('submission'),
      operatorName: operatorName.trim(),
      operatorEmail: operatorEmail.trim(),
      serviceTitle: operatorServiceTitle.trim(),
      serviceType: operatorServiceType,
      packageTitle: selectedPackage.title,
      nodeTitle: selectedNode.title,
      inclusions: operatorInclusions.trim(),
      commercialNote: operatorCommercialNote.trim(),
      reviewState: 'Submitted',
      staffNote: '',
    };

    setOperatorSubmissions((current) => [next, ...current]);
    setSelectedReviewId(next.id);
    setOperatorServiceTitle('');
    setOperatorInclusions('');
    setOperatorCommercialNote('');
    setActiveTab('staffReview');

    pushNotification({
      channel: 'In-app',
      recipient: 'Admin Review Desk',
      subject: 'New operator service ready for review',
      message: `${next.operatorName} submitted ${next.serviceTitle} for ${next.packageTitle}.`,
    });

    pushNotification({
      channel: 'Email',
      recipient: next.operatorEmail,
      subject: 'Service submission received',
      message: `Your service submission "${next.serviceTitle}" was received and is now pending staff review.`,
    });
  }

  function decideSubmission(id: string, reviewState: ReviewState, staffNote: string) {
    const record = operatorSubmissions.find((item) => item.id === id);

    setOperatorSubmissions((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              reviewState,
              staffNote,
            }
          : item,
      ),
    );

    if (!record) return;

    pushNotification({
      channel: 'In-app',
      recipient: record.operatorName,
      subject: `Service review update: ${reviewState}`,
      message: `${record.serviceTitle} is now marked as ${reviewState}. ${staffNote}`,
    });

    pushNotification({
      channel: 'Email',
      recipient: record.operatorEmail,
      subject: `OSP service review update: ${reviewState}`,
      message: `Your submitted service "${record.serviceTitle}" has been marked as ${reviewState}. ${staffNote}`,
    });
  }

  function promoteSubmission(record: OperatorSubmission) {
    const next: MappingRecord = {
      id: makeId('mapping'),
      packageTitle: record.packageTitle,
      nodeTitle: record.nodeTitle,
      operatorName: record.operatorName,
      serviceTitle: record.serviceTitle,
      sourceType: 'Operator Partner',
      bookingMode: 'Request to Confirm',
      readiness: record.reviewState === 'Approved' ? 'Approved' : 'For Review',
      staffNotes: record.staffNote || 'Promoted from staff review queue.',
    };

    setMappingRecords((current) => [next, ...current]);
    setActiveTab('packageMapping');

    pushNotification({
      channel: 'In-app',
      recipient: 'SPM Mapping Team',
      subject: 'Operator service promoted to mapping',
      message: `${record.serviceTitle} was promoted into the package mapping workspace.`,
    });
  }

  async function copyContractPreview() {
    const payload = {
      workspace: 'SPM Partner Mapping Workspace',
      packageMappings: mappingRecords,
      operatorServiceSubmissions: operatorSubmissions,
      notificationSamples: notifications,
      futureBackendReminder:
        'This sample UI is for workflow shaping only. Backend DB writes, email jobs, and traveler exposure remain separate future contracts.',
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      alert('Workspace sample JSON copied.');
    } catch {
      console.log(payload);
      alert('Clipboard unavailable. JSON printed to console.');
    }
  }

  const tabs: Array<{ key: TabKey; label: string; sublabel: string; count: string }> = [
    { key: 'packageMapping', label: 'Mapping Desk', sublabel: 'Supply linkage', count: String(mappingRecords.length) },
    { key: 'operatorServices', label: 'Service Intake', sublabel: 'Operator submissions', count: String(operatorSubmissions.length) },
    { key: 'staffReview', label: 'Review Queue', sublabel: 'Decision queue', count: String(reviewQueue) },
    { key: 'notifications', label: 'Messages', sublabel: 'Trigger samples', count: String(notifications.length) },
    { key: 'contractPreview', label: 'Backend Shape', sublabel: 'Contract guide', count: 'JSON' },
  ];

  return (
    <section
      id="admin-spm-partner-mapping-workspace"
      aria-label="SPM Partner Mapping Premium Workspace"
      style={{
        marginTop: 20,
        borderRadius: 16,
        border: '1px solid rgba(1,56,99,0.10)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.99), rgba(234,251,250,0.94))',
        boxShadow: '0 28px 76px rgba(1,56,99,0.11)',
        padding: 9,
      }}
    >
      <section
        style={{
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.99), rgba(234,251,250,0.96))',
          padding: 9,
          color: OSP.deepNavy,
          boxShadow: '0 24px 60px rgba(1,56,99,0.20)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 7, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 760 }}>
            <p
              style={{
                margin: '0 0 9px',
                color: OSP.gold,
                fontSize: 11,
                fontWeight: 950,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              ADMIN-CT-SPM-09F-10 / NUCLEAR PARTNER MAPPING DECISION COCKPIT
            </p>

            <h2
              style={{
                margin: 0,
                color: OSP.deepNavy,
                fontSize: 'clamp(1.32rem, 1.85vw, 1.75rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.045em',
                fontWeight: 760,
              }}
            >
              Partner Mapping Decision Desk
            </h2>

            <p style={{ margin: '14px 0 0', color: OSP.slate, maxWidth: 760, lineHeight: 1.65, fontSize: 13 }}>
              Decide which SPM products can use which operator supply, what needs review, and what must stay blocked before exposure.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(72px, 1fr))', gap: 7, minWidth: 320 }}>
            {[
              ['Mapped', mappingRecords.length],
              ['Ready', readyMappings],
              ['Review', reviewQueue],
              ['Messages', notifications.length],
            ].map(([label, value]) => (
              <div key={label} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.16)', padding: 9, border: '1px solid rgba(255,255,255,0.16)' }}>
                <div style={{ fontSize: 11, color: OSP.slate, fontWeight: 850 }}>{label}</div>
                <div style={{ fontSize: 18, color: OSP.deepNavy, fontWeight: 900, lineHeight: 1 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav
        aria-label="Partner Mapping workspace tabs"
        style={{
          marginTop: 7,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(118px, 1fr))',
          gap: 7,
        }}
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                minHeight: 44,
                border: active ? '1px solid rgba(5,150,165,0.48)' : '1px solid rgba(1,56,99,0.08)',
                borderRadius: 16,
                background: active
                  ? 'linear-gradient(135deg, #013863, #0596A5)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(244,252,250,0.96))',
                color: active ? OSP.white : OSP.deepNavy,
                padding: '8px 10px',
                cursor: 'pointer',
                boxShadow: active ? '0 18px 38px rgba(1,56,99,0.18)' : '0 10px 24px rgba(1,56,99,0.055)',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 7, alignItems: 'center' }}>
                <strong style={{ fontSize: 12.5, letterSpacing: '-0.02em' }}>{tab.label}</strong>
                <span
                  style={{
                    borderRadius: 999,
                    padding: '5px 8px',
                    fontSize: 10,
                    fontWeight: 950,
                    background: active ? 'rgba(255,255,255,0.18)' : 'rgba(5,150,165,0.12)',
                    color: active ? OSP.white : OSP.deepNavy,
                  }}
                >
                  {tab.count}
                </span>
              </div>
              <div style={{ marginTop: 3, fontSize: 10.5, fontWeight: 750, color: active ? 'rgba(255,255,255,0.76)' : OSP.slate }}>
                {tab.sublabel}
              </div>
            </button>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: 7,
          borderRadius: 16,
          border: '1px solid rgba(5,150,165,0.14)',
          background: 'linear-gradient(135deg, rgba(234,251,250,0.86), rgba(255,255,255,0.94))',
          padding: '11px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 7,
          flexWrap: 'wrap',
          color: OSP.deepNavy,
          fontSize: 12,
          fontWeight: 850,
        }}
      >
        <span>Decision mode: map only approved supply, hold uncertain services in review, and keep exposure blocked until governance is clear.</span>
        <span style={{ color: OSP.teal, fontWeight: 950 }}>Controlled Supply Linkage</span>
      </div>

      <section
        aria-label="Partner Mapping sub-dashboard"
        style={{
          marginTop: 7,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))',
          gap: 7,
        }}
      >
        {[
          {
            eyebrow: 'Supply Control',
            title: 'Package → Node → Operator',
            body: 'Connect only the supply that is safe to operationalize.',
            tone: 'active',
          },
          {
            eyebrow: 'Staff Gate',
            title: 'Review before exposure',
            body: 'Keep questionable services out of traveler view.',
            tone: 'review',
          },
          {
            eyebrow: 'Commercial Boundary',
            title: 'No flat directory',
            body: 'Prevent random exposure and supplier confusion.',
            tone: 'safe',
          },
          {
            eyebrow: 'Next Backend Contract',
            title: 'Mapping + approval spine',
            body: 'Prepare the fields backend must enforce later.',
            tone: 'planned',
          },
        ].map((card) => (
          <article
            key={card.title}
            style={{
              borderRadius: 16,
              border: '1px solid rgba(1,56,99,0.09)',
              background:
                card.tone === 'active'
                  ? 'linear-gradient(135deg, rgba(5,150,165,0.16), rgba(255,255,255,0.96))'
                  : card.tone === 'review'
                    ? 'linear-gradient(135deg, rgba(243,174,38,0.20), rgba(255,255,255,0.96))'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(234,251,250,0.72))',
              boxShadow: '0 10px 24px rgba(1,56,99,0.045)',
              padding: 9,
              minHeight: 78,
            }}
          >
            <p
              style={{
                margin: '0 0 8px',
                color: card.tone === 'review' ? '#9A6500' : OSP.teal,
                fontSize: 10,
                fontWeight: 950,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              {card.eyebrow}
            </p>
            <h4
              style={{
                margin: 0,
                color: OSP.deepNavy,
                fontSize: 12.5,
                lineHeight: 1.02,
                letterSpacing: '-0.04em',
                fontWeight: 850,
              }}
            >
              {card.title}
            </h4>
            <p style={{ margin: '9px 0 0', color: OSP.slate, fontSize: 11, lineHeight: 1.55 }}>
              {card.body}
            </p>
          </article>
        ))}
      </section>

      {activeTab === 'packageMapping' ? (
        <section style={{ ...baseCard, marginTop: 7, padding: 18 }}>
          <WorkspaceHeader
            eyebrow="Active Workspace / Mapping Desk"
            title="Create a controlled supply mapping"
            body="Attach the right operator service to the right SPM product and stop. Use readiness to keep weak supply out of exposure."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: 7, marginTop: 18 }}>
            <label style={labelStyle}>
              SPM package
              <select value={selectedPackageId} onChange={(event) => setSelectedPackageId(event.target.value)} style={fieldStyle}>
                {packageOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
            </label>

            <label style={labelStyle}>
              Trail node / stop
              <select value={selectedNodeId} onChange={(event) => setSelectedNodeId(event.target.value)} style={fieldStyle}>
                {nodeOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.title} · {item.family}</option>
                ))}
              </select>
            </label>

            <label style={labelStyle}>
              Operator service
              <select value={selectedServiceId} onChange={(event) => setSelectedServiceId(event.target.value)} style={fieldStyle}>
                {operatorServiceOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.operatorName} · {item.serviceTitle}</option>
                ))}
              </select>
            </label>

            <label style={labelStyle}>
              Source type
              <select value={sourceType} onChange={(event) => setSourceType(event.target.value as SourceType)} style={fieldStyle}>
                <option>SPM Curated</option>
                <option>Operator Partner</option>
                <option>DIY Assisted</option>
                <option>OTA Assisted</option>
              </select>
            </label>

            <label style={labelStyle}>
              Booking mode
              <select value={bookingMode} onChange={(event) => setBookingMode(event.target.value as BookingMode)} style={fieldStyle}>
                <option>Instant Book</option>
                <option>Request to Confirm</option>
                <option>Admin Assisted</option>
                <option>Not Bookable</option>
              </select>
            </label>

            <label style={labelStyle}>
              Readiness
              <select value={readiness} onChange={(event) => setReadiness(event.target.value as ReadinessState)} style={fieldStyle}>
                <option>Draft</option>
                <option>For Review</option>
                <option>Approved</option>
                <option>Live</option>
                <option>Suspended</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(160px, 1fr))', gap: 7, marginTop: 16 }}>
            <div style={{ borderRadius: 16, background: OSP.soft, border: '1px solid rgba(1,56,99,0.08)', padding: 15 }}>
              <strong style={{ color: OSP.deepNavy }}>{selectedPackage.title}</strong>
              <p style={{ margin: '7px 0 0', color: OSP.slate, fontSize: 12.5, lineHeight: 1.5 }}>{selectedPackage.description}</p>
            </div>
            <div style={{ borderRadius: 16, background: OSP.soft, border: '1px solid rgba(1,56,99,0.08)', padding: 15 }}>
              <strong style={{ color: OSP.deepNavy }}>{selectedNode.title}</strong>
              <p style={{ margin: '7px 0 0', color: OSP.slate, fontSize: 12.5, lineHeight: 1.5 }}>{selectedNode.family} · {selectedNode.stampLabel}</p>
            </div>
            <div style={{ borderRadius: 16, background: OSP.soft, border: '1px solid rgba(1,56,99,0.08)', padding: 15 }}>
              <strong style={{ color: OSP.deepNavy }}>{selectedService.serviceTitle}</strong>
              <p style={{ margin: '7px 0 0', color: OSP.slate, fontSize: 12.5, lineHeight: 1.5 }}>{selectedService.operatorName} · {selectedService.readiness}</p>
            </div>
          </div>

          <label style={{ display: 'block', marginTop: 7, ...labelStyle }}>
            Staff handling note
            <textarea
              value={staffNotes}
              onChange={(event) => setStaffNotes(event.target.value)}
              rows={3}
              placeholder="Example: Use this operator only for approved island-hopping slots. Keep request-to-confirm until capacity rules are finalized."
              style={textAreaStyle}
            />
          </label>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginTop: 7, borderRadius: 16, background: 'rgba(234,251,250,0.72)', padding: 15 }}>
            <p style={{ margin: 0, color: OSP.deepNavy, fontSize: 12, fontWeight: 850 }}>
              Decision: add this mapping only when the operator supply is operationally defensible.
            </p>
            <button
              type="button"
              onClick={addMapping}
              disabled={!canAddMapping}
              style={{
                minHeight: 38,
                border: 0,
                borderRadius: 999,
                background: canAddMapping ? OSP.gold : 'rgba(80,102,139,0.18)',
                color: OSP.deepNavy,
                padding: '0 16px',
                fontSize: 12.5,
                fontWeight: 950,
                cursor: canAddMapping ? 'pointer' : 'not-allowed',
              }}
            >
              Add Controlled Mapping
            </button>
          </div>

          <div style={{ display: 'grid', gap: 7, marginTop: 18 }}>
            {mappingRecords.map((record) => (
              <article key={record.id} style={{ borderRadius: 16, border: '1px solid rgba(1,56,99,0.08)', background: OSP.white, padding: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 7, flexWrap: 'wrap' }}>
                  <strong style={{ color: OSP.deepNavy, fontSize: 15 }}>{record.packageTitle}</strong>
                  <StatusChip tone={record.readiness}>{record.readiness}</StatusChip>
                </div>
                <p style={{ margin: '8px 0 0', color: OSP.slate, fontSize: 13 }}>
                  {record.nodeTitle} → {record.operatorName} / {record.serviceTitle}
                </p>
                <p style={{ margin: '7px 0 0', color: OSP.deepNavy, fontSize: 12, fontWeight: 850 }}>
                  {record.sourceType} · {record.bookingMode}
                </p>
                {record.staffNotes ? <p style={{ margin: '7px 0 0', color: OSP.slate, fontSize: 12 }}>Note: {record.staffNotes}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'operatorServices' ? (
        <section style={{ ...baseCard, marginTop: 7, padding: 18 }}>
          <WorkspaceHeader
            eyebrow="Active Workspace / Service Intake"
            title="Operator service intake desk"
            body="This is the admin-side sample of what an operator-submitted service should look like before staff review and mapping."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(205px, 1fr))', gap: 7, marginTop: 18 }}>
            <label style={labelStyle}>
              Operator name
              <input value={operatorName} onChange={(event) => setOperatorName(event.target.value)} style={fieldStyle} />
            </label>
            <label style={labelStyle}>
              Operator email
              <input value={operatorEmail} onChange={(event) => setOperatorEmail(event.target.value)} style={fieldStyle} />
            </label>
            <label style={labelStyle}>
              Service title
              <input value={operatorServiceTitle} onChange={(event) => setOperatorServiceTitle(event.target.value)} placeholder="Example: Tri-Island Private Boat Support" style={fieldStyle} />
            </label>
            <label style={labelStyle}>
              Service type
              <select value={operatorServiceType} onChange={(event) => setOperatorServiceType(event.target.value)} style={fieldStyle}>
                <option>Island Hopping</option>
                <option>Land Tour</option>
                <option>Surf</option>
                <option>Transport Support</option>
                <option>Passport Trail Support</option>
                <option>Admin Assisted</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 7, marginTop: 14 }}>
            <label style={labelStyle}>
              Service inclusions
              <textarea value={operatorInclusions} onChange={(event) => setOperatorInclusions(event.target.value)} rows={4} placeholder="Boat, guide, pickup coordination, permits, photography, etc." style={textAreaStyle} />
            </label>
            <label style={labelStyle}>
              Commercial note
              <textarea value={operatorCommercialNote} onChange={(event) => setOperatorCommercialNote(event.target.value)} rows={4} placeholder="Request-to-confirm, seasonal rate, private/group logic, inclusions/exclusions." style={textAreaStyle} />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginTop: 7, borderRadius: 16, background: 'rgba(234,251,250,0.72)', padding: 15 }}>
            <p style={{ margin: 0, color: OSP.deepNavy, fontSize: 12, fontWeight: 850 }}>
              Staff action: create a service sample and send it to the review queue.
            </p>
            <button
              type="button"
              onClick={submitOperatorService}
              disabled={!canSubmitService}
              style={{
                minHeight: 38,
                border: 0,
                borderRadius: 999,
                background: canSubmitService ? OSP.gold : 'rgba(80,102,139,0.18)',
                color: OSP.deepNavy,
                padding: '0 16px',
                fontSize: 12.5,
                fontWeight: 950,
                cursor: canSubmitService ? 'pointer' : 'not-allowed',
              }}
            >
              Send to Review Desk
            </button>
          </div>
        </section>
      ) : null}

      {activeTab === 'staffReview' ? (
        <section style={{ ...baseCard, marginTop: 7, padding: 18 }}>
          <WorkspaceHeader
            eyebrow="Active Workspace / Review Queue"
            title="Approve operator services before mapping"
            body="Staff can approve, reject, request changes, or promote the service into the package mapping workspace."
          />

          <div style={{ display: 'grid', gap: 7, marginTop: 18 }}>
            {operatorSubmissions.map((record) => {
              const selected = selectedReview?.id === record.id;

              return (
                <article
                  key={record.id}
                  style={{
                    borderRadius: 16,
                    border: selected ? '1px solid rgba(5,150,165,0.48)' : '1px solid rgba(1,56,99,0.08)',
                    background: selected ? 'rgba(234,251,250,0.84)' : OSP.white,
                    padding: 15,
                    boxShadow: selected ? '0 12px 28px rgba(1,56,99,0.08)' : 'none',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedReviewId(record.id)}
                    style={{ width: '100%', border: 0, background: 'transparent', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 7, flexWrap: 'wrap' }}>
                      <strong style={{ color: OSP.deepNavy, fontSize: 15 }}>{record.serviceTitle}</strong>
                      <StatusChip tone={record.reviewState}>{record.reviewState}</StatusChip>
                    </div>
                    <p style={{ margin: '8px 0 0', color: OSP.slate, fontSize: 13 }}>
                      {record.operatorName} · {record.operatorEmail}
                    </p>
                    <p style={{ margin: '7px 0 0', color: OSP.deepNavy, fontSize: 12, fontWeight: 850 }}>
                      {record.packageTitle} · {record.nodeTitle}
                    </p>
                    {record.inclusions ? <p style={{ margin: '7px 0 0', color: OSP.slate, fontSize: 12 }}>Inclusions: {record.inclusions}</p> : null}
                    {record.commercialNote ? <p style={{ margin: '7px 0 0', color: OSP.slate, fontSize: 12 }}>Commercial: {record.commercialNote}</p> : null}
                  </button>

                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 12 }}>
                    <button type="button" onClick={() => decideSubmission(record.id, 'Under Review', 'Staff moved this service into review.')} style={{ border: 0, borderRadius: 999, background: 'rgba(80,102,139,0.12)', color: OSP.deepNavy, padding: '9px 12px', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}>
                      Mark Review
                    </button>
                    <button type="button" onClick={() => decideSubmission(record.id, 'Approved', 'Approved for partner mapping preparation.')} style={{ border: 0, borderRadius: 999, background: 'rgba(5,150,165,0.16)', color: OSP.deepNavy, padding: '9px 12px', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}>
                      Approve
                    </button>
                    <button type="button" onClick={() => decideSubmission(record.id, 'Needs Revision', 'Needs revised inclusions, rate logic, or compliance detail.')} style={{ border: 0, borderRadius: 999, background: 'rgba(243,174,38,0.22)', color: OSP.deepNavy, padding: '9px 12px', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}>
                      Request Revision
                    </button>
                    <button type="button" onClick={() => decideSubmission(record.id, 'Rejected', 'Rejected for current SPM mapping preparation.')} style={{ border: 0, borderRadius: 999, background: 'rgba(180,35,24,0.10)', color: OSP.deepNavy, padding: '9px 12px', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}>
                      Reject
                    </button>
                    <button type="button" onClick={() => promoteSubmission(record)} style={{ border: 0, borderRadius: 999, background: OSP.gold, color: OSP.deepNavy, padding: '9px 12px', fontSize: 12, fontWeight: 950, cursor: 'pointer' }}>
                      Promote to Mapping
                    </button>
                  </div>

                  {record.staffNote ? (
                    <p style={{ margin: '10px 0 0', color: OSP.slate, fontSize: 12 }}>
                      Staff note: {record.staffNote}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {activeTab === 'notifications' ? (
        <section style={{ ...baseCard, marginTop: 7, padding: 18 }}>
          <WorkspaceHeader
            eyebrow="Active Workspace / Messages"
            title="In-app and email message samples"
            body="This tab shows the sample messages that should be triggered when staff creates mappings, reviews services, or promotes approved supply."
          />

          {notifications.length === 0 ? (
            <div style={{ marginTop: 7, borderRadius: 16, background: 'rgba(234,251,250,0.64)', padding: 9, color: OSP.deepNavy, fontSize: 12.5, fontWeight: 850 }}>
              No messages yet. Add a mapping or send an operator service to review to generate sample notifications.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 7, marginTop: 16 }}>
              {notifications.map((record) => (
                <article key={record.id} style={{ borderRadius: 16, border: '1px solid rgba(1,56,99,0.08)', background: OSP.white, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 7, flexWrap: 'wrap' }}>
                    <strong style={{ color: OSP.deepNavy, fontSize: 13 }}>{record.subject}</strong>
                    <StatusChip tone={record.channel}>{record.channel} · {record.status}</StatusChip>
                  </div>
                  <p style={{ margin: '7px 0 0', color: OSP.slate, fontSize: 12 }}>To: {record.recipient}</p>
                  <p style={{ margin: '7px 0 0', color: OSP.deepNavy, fontSize: 12, lineHeight: 1.5 }}>{record.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {activeTab === 'contractPreview' ? (
        <section style={{ ...baseCard, marginTop: 7, padding: 18 }}>
          <WorkspaceHeader
            eyebrow="Active Workspace / Backend Shape"
            title="Backend shape generated from staff workflow"
            body="This tab summarizes what the eventual backend contract should support after the workflow is approved."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(160px, 1fr))', gap: 7, marginTop: 18 }}>
            {[
              ['Package mapping', 'packageId, nodeId, operatorServiceId, sourceType, bookingMode, readiness'],
              ['Operator service intake', 'operator profile, submitted service, inclusions, pricing notes, compliance state'],
              ['Staff review', 'review status, decision note, reviewer, approval timestamp, audit trail'],
              ['Messages', 'in-app notification, email job, template, recipient, delivery status'],
            ].map(([title, body]) => (
              <div key={title} style={{ borderRadius: 16, background: OSP.soft, border: '1px solid rgba(1,56,99,0.08)', padding: 15 }}>
                <strong style={{ color: OSP.deepNavy }}>{title}</strong>
                <p style={{ margin: '7px 0 0', color: OSP.slate, fontSize: 12.5, lineHeight: 1.5 }}>{body}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={copyContractPreview}
            style={{
              marginTop: 7,
              minHeight: 38,
              border: 0,
              borderRadius: 999,
              background: OSP.gold,
              color: OSP.deepNavy,
              padding: '0 16px',
              fontSize: 12.5,
              fontWeight: 950,
              cursor: 'pointer',
            }}
          >
            Copy Workspace JSON
          </button>

          <div style={{ marginTop: 7, borderRadius: 16, background: 'rgba(243,174,38,0.13)', color: OSP.deepNavy, padding: 9, fontSize: 12.5, lineHeight: 1.55 }}>
            Backend, database writes, email sending, and public traveler exposure remain future contracts. This tabbed workspace is the premium admin operating sample for how staff should work.
          </div>
        </section>
      ) : null}
    </section>
  );
}
