'use client';

const ADMIN_CT_SPM_09K1_PREMIUM_OVERVIEW_WIRED = true;

const ADMIN_CT_SPM_09J1B_PASSPORT_MAP_WIRED = true;

const ADMIN_CT_SPM_09H1C_FRONTEND_EXPOSURE_WIRED = true;

const ADMIN_CT_SPM_09G3D_REAL_STATICPANEL_BRANCH_FIXED = true;

import { useState } from 'react';
import AdminSpmTrailFamiliesEditor from './AdminSpmTrailFamiliesEditor';
import AdminSpmTrailNodesEditor from './AdminSpmTrailNodesEditor';
import AdminSpmStampRulesReadWorkspace from './AdminSpmStampRulesReadWorkspace';
import AdminSpmPartnerMappingWorkspace from './AdminSpmPartnerMappingWorkspace';
import AdminSpmPricingLogicWorkspace from './AdminSpmPricingLogicWorkspace';
import AdminSpmFrontendExposureWorkspace from './AdminSpmFrontendExposureWorkspace';
import AdminSpmControlTowerReadPanel from './AdminSpmControlTowerReadPanel';
import AdminSpmPassportMapWorkspace from './AdminSpmPassportMapWorkspace';
import AdminSpmOverviewWorkspace from './AdminSpmOverviewWorkspace';

const OSP = {
  deepNavy: '#013863',
  teal: '#0596A5',
  gold: '#F3AE26',
  slate: '#50668B',
  white: '#FFFFFF',
  mist: '#EAFBFA',
};

type ControlKey =
  | 'overview'
  | 'passport-map'
  | 'official-trails'
  | 'nodes-stops'
  | 'stamp-rules'
  | 'partner-mapping'
  | 'pricing-logic'
  | 'frontend-exposure';

const controls: Array<{
  key: ControlKey;
  title: string;
  subtitle: string;
  status: 'LIVE' | 'READY' | 'PLANNED' | 'GATED';
}> = [
  {
    key: 'overview',
    title: 'Overview',
    subtitle: 'SPM Product Command',
    status: 'LIVE',
  },
  {
    key: 'passport-map',
    title: 'Passport Map',
    subtitle: 'Traveler Surface Control',
    status: 'READY',
  },
  {
    key: 'official-trails',
    title: 'Official Trails',
    subtitle: 'Trail Family Governance',
    status: 'LIVE',
  },
  {
    key: 'nodes-stops',
    title: 'Nodes / Stops',
    subtitle: 'Map Inventory Layer',
    status: 'LIVE',
  },
  {
    key: 'stamp-rules',
    title: 'Stamp Rules',
    subtitle: 'Proof-of-Visit Logic',
    status: 'LIVE',
  },
  {
    key: 'partner-mapping',
    title: 'Partner Mapping',
    subtitle: 'Operator Supply Linkage',
    status: 'PLANNED',
  },
  {
    key: 'pricing-logic',
    title: 'Pricing Logic',
    subtitle: 'Commercial Rule Assignment',
    status: 'GATED',
  },
  {
    key: 'frontend-exposure',
    title: 'Frontend Exposure',
    subtitle: 'Traveler UI Publishing Gate',
    status: 'PLANNED',
  },
];

function statusStyle(status: string) {
  if (status === 'LIVE') return { background: 'rgba(5,150,165,0.16)', color: OSP.deepNavy };
  if (status === 'READY') return { background: 'rgba(243,174,38,0.22)', color: OSP.deepNavy };
  if (status === 'GATED') return { background: 'rgba(80,102,139,0.14)', color: OSP.deepNavy };
  return { background: 'rgba(80,102,139,0.10)', color: OSP.slate };
}

function StaticPanel({
  eyebrow,
  title,
  body,
  controlsPrepared,
  blockers,
}: {
  eyebrow: string;
  title: string;
  body: string;
  controlsPrepared: string[];
  blockers: string[];
}) {
  return (
    <div
      style={{
        borderRadius: 28,
        border: '1px solid rgba(1,56,99,0.10)',
        background: OSP.white,
        padding: 22,
        boxShadow: '0 18px 46px rgba(1,56,99,0.07)',
      }}
    >
      <p
        style={{
          margin: '0 0 10px',
          color: OSP.gold,
          fontSize: 11,
          fontWeight: 950,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </p>

      <h2
        style={{
          margin: 0,
          color: OSP.deepNavy,
          fontSize: 'clamp(2rem, 4vw, 3.2rem)',
          lineHeight: 0.98,
          letterSpacing: '-0.06em',
          fontWeight: 760,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: '14px 0 0',
          color: OSP.slate,
          maxWidth: 920,
          lineHeight: 1.6,
          fontSize: 15,
        }}
      >
        {body}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
          marginTop: 20,
        }}
      >
        <div
          style={{
            borderRadius: 20,
            border: '1px solid rgba(1,56,99,0.08)',
            background: 'rgba(234,251,250,0.55)',
            padding: 16,
          }}
        >
          <h3 style={{ margin: 0, color: OSP.deepNavy, fontSize: 15 }}>Controls prepared</h3>
          <ul style={{ margin: '12px 0 0', paddingLeft: 18, color: OSP.slate, lineHeight: 1.7 }}>
            {controlsPrepared.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div
          style={{
            borderRadius: 20,
            border: '1px solid rgba(1,56,99,0.08)',
            background: 'rgba(234,251,250,0.55)',
            padding: 16,
          }}
        >
          <h3 style={{ margin: 0, color: OSP.deepNavy, fontSize: 15 }}>Current blockers</h3>
          <ul style={{ margin: '12px 0 0', paddingLeft: 18, color: OSP.slate, lineHeight: 1.7 }}>
            {blockers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function AdminSpmOperationalControlsShell() {
  const [activeControl, setActiveControl] = useState<ControlKey>('overview');

  function renderActivePanel() {
    if (activeControl === 'official-trails') {
      return <AdminSpmTrailFamiliesEditor />;
    }

    if (activeControl === 'nodes-stops') {
      return <AdminSpmTrailNodesEditor />;
    }

    if (activeControl === 'stamp-rules') {
      return <AdminSpmStampRulesReadWorkspace />;
    }

    if (activeControl === 'overview') {
      return (
        <>
          {/* ADMIN_CT_SPM_09K1_PREMIUM_OVERVIEW_WORKSPACE_RENDERED */}
          <AdminSpmOverviewWorkspace />
        </>
      );
    }

    if (activeControl === 'passport-map') {
      return (
        <>
          {/* ADMIN_CT_SPM_09J1B_PASSPORT_MAP_WORKSPACE_RENDERED */}
          <AdminSpmPassportMapWorkspace />
        </>
      );
    }

    if (activeControl === 'partner-mapping') {
      return <AdminSpmPartnerMappingWorkspace />;
    }

    if (activeControl === 'pricing-logic') {
      return (
        <>
          {/* ADMIN_CT_SPM_09G3D_PRICING_DECISION_WORKSPACE_RENDERED */}
          <AdminSpmPricingLogicWorkspace />
        </>
      );
    }

    if (activeControl === 'frontend-exposure') {
      return (
        <>
          {/* ADMIN_CT_SPM_09H1C_FRONTEND_EXPOSURE_WORKSPACE_RENDERED */}
          <AdminSpmFrontendExposureWorkspace />
        </>
      );
    }

    return (
      <StaticPanel
        eyebrow="Traveler UI Publishing Gate"
        title="Frontend Exposure control is planned"
        body="Frontend Exposure will control what becomes visible on traveler-facing SPM surfaces and why: hidden, draft, ready for review, approved, live, or suspended."
        controlsPrepared={[
          'Surface visibility',
          'CTA route assignment',
          'Publishing blockers',
          'Exposure readiness state',
        ]}
        blockers={[
          'No traveler access to drafts',
          'No approval bypass',
          'No fake live status',
        ]}
      />
    );
  }

  return (
    <section
      id="admin-spm-contained-controls-shell"
      aria-label="SPM Operational Controls Shell"
      style={{
        marginTop: 24,
        borderRadius: 34,
        border: '1px solid rgba(1,56,99,0.10)',
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(234,251,250,0.92))',
        boxShadow: '0 26px 70px rgba(1,56,99,0.10)',
        padding: 24,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <p
          style={{
            margin: '0 0 8px',
            color: OSP.teal,
            fontSize: 11,
            fontWeight: 950,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          ADMIN-CT-SPM-09E-1 / CONTAINED OPERATIONAL SHELL
        </p>

        <h2
          style={{
            margin: 0,
            color: OSP.deepNavy,
            fontSize: 'clamp(2.1rem, 4vw, 3.5rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.065em',
            fontWeight: 760,
          }}
        >
          SPM Controls operating shell
        </h2>

        <p
          style={{
            margin: '12px 0 0',
            color: OSP.slate,
            maxWidth: 960,
            lineHeight: 1.6,
            fontSize: 15,
          }}
        >
          All SPM product controls now live inside this shell. Operational editors must not float as disconnected blocks outside the SPM Controls architecture.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px minmax(0, 1fr)',
          gap: 18,
          alignItems: 'start',
        }}
      >
        <aside
          style={{
            position: 'sticky',
            top: 18,
            borderRadius: 24,
            border: '1px solid rgba(1,56,99,0.08)',
            background: OSP.white,
            padding: 14,
            boxShadow: '0 14px 34px rgba(1,56,99,0.06)',
          }}
        >
          <h3
            style={{
              margin: '0 0 12px',
              color: OSP.deepNavy,
              fontSize: 17,
              letterSpacing: '-0.03em',
            }}
          >
            SPM Controls
          </h3>

          <div style={{ display: 'grid', gap: 8 }}>
            {controls.map((control) => {
              const active = control.key === activeControl;
              const badge = statusStyle(control.status);

              return (
                <button
                  key={control.key}
                  type="button"
                  onClick={() => setActiveControl(control.key)}
                  style={{
                    border: active ? '1px solid rgba(5,150,165,0.45)' : '1px solid rgba(1,56,99,0.06)',
                    borderRadius: 18,
                    background: active
                      ? 'linear-gradient(135deg, #013863, #0596A5)'
                      : 'rgba(234,251,250,0.55)',
                    color: active ? OSP.white : OSP.deepNavy,
                    padding: 13,
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: active ? '0 14px 28px rgba(1,56,99,0.18)' : 'none',
                  }}
                >
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 950 }}>{control.title}</span>
                    <span
                      style={{
                        borderRadius: 999,
                        background: active ? 'rgba(255,255,255,0.16)' : badge.background,
                        color: active ? OSP.white : badge.color,
                        padding: '3px 7px',
                        fontSize: 9,
                        fontWeight: 950,
                        letterSpacing: '0.08em',
                      }}
                    >
                      {control.status}
                    </span>
                  </span>
                  <span
                    style={{
                      display: 'block',
                      marginTop: 4,
                      fontSize: 11,
                      fontWeight: 800,
                      color: active ? 'rgba(255,255,255,0.74)' : OSP.slate,
                    }}
                  >
                    {control.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div>{renderActivePanel()}</div>
      </div>
    </section>
  );
}
