'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminSpmAuthTokenBridge, { ADMIN_SPM_TOKEN_EVENT, getAdminSpmBearerToken } from './AdminSpmAuthTokenBridge';

const API_BASE = '';

type AdminSpmOverview = {
  lane?: string;
  contractMode?: string;
  schemaMutationIncluded?: boolean;
  dbMigrationIncluded?: boolean;
  panels?: {
    passportMapProductStatus?: Record<string, number>;
    trailFamiliesControl?: Record<string, unknown>;
    trailNodesControl?: Record<string, unknown>;
    stampRulesControl?: Record<string, unknown>;
    partnerMappingControl?: Record<string, unknown>;
    pricingLogicAssignment?: Record<string, unknown>;
    frontendExposureControl?: Record<string, unknown>;
  };
  hardRules?: string[];
  recentAuditEvents?: Array<Record<string, unknown>>;
};

type EndpointState<T> = {
  label: string;
  path: string;
  status: 'idle' | 'loading' | 'ready' | 'unauthorized' | 'error';
  httpStatus?: number;
  data?: T | null;
  message?: string;
};

const OSP = {
  deepNavy: '#013863',
  teal: '#0596A5',
  gold: '#F3AE26',
  mist: '#EAFBFA',
  slate: '#50668B',
  white: '#FFFFFF',
};

const tokenKeys = [
  'osp_admin_token',
  'osp_access_token',
  'accessToken',
  'access_token',
  'token',
  'authToken',
];

function legacyGetStoredBearerToken() {
  if (typeof window === 'undefined') return null;

  for (const key of tokenKeys) {
    const value = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
    if (value && value.trim()) return value.trim();
  }

  return null;
}

async function fetchAdminSpm<T>(path: string): Promise<{
  status: EndpointState<T>['status'];
  httpStatus: number;
  data: T | null;
  message?: string;
}> {
  const token = getAdminSpmBearerToken();

  try {
    const proxyPath = path.replace(/^\/admin\/spm\/?/, '/api/admin/spm/');
    const response = await fetch(`${API_BASE}${proxyPath}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => null);

    if (response.status === 401 || response.status === 403) {
      return {
        status: 'unauthorized',
        httpStatus: response.status,
        data: payload,
        message:
          payload?.message ||
          'Admin bearer token is required before this Control Tower can load live SPM data.',
      };
    }

    if (!response.ok) {
      return {
        status: 'error',
        httpStatus: response.status,
        data: payload,
        message: payload?.message || `Request failed with HTTP ${response.status}`,
      };
    }

    return {
      status: 'ready',
      httpStatus: response.status,
      data: payload as T,
    };
  } catch (error) {
    return {
      status: 'error',
      httpStatus: 0,
      data: null,
      message: error instanceof Error ? error.message : 'Network request failed.',
    };
  }
}

function metricLabel(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .replace('Spm', 'SPM');
}

function StatusPill({ status }: { status: EndpointState<unknown>['status'] }) {
  const label =
    status === 'ready'
      ? 'Live'
      : status === 'unauthorized'
        ? 'Auth required'
        : status === 'error'
          ? 'Needs check'
          : status === 'loading'
            ? 'Loading'
            : 'Idle';

  const background =
    status === 'ready'
      ? 'rgba(5,150,165,0.14)'
      : status === 'unauthorized'
        ? 'rgba(243,174,38,0.22)'
        : status === 'error'
          ? 'rgba(200,60,60,0.12)'
          : 'rgba(80,102,139,0.12)';

  return (
    <span
      style={{
        display: 'inline-flex',
        borderRadius: 999,
        background,
        color: OSP.deepNavy,
        padding: '7px 10px',
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  );
}

export default function AdminSpmControlTowerReadPanel() {
  const [overview, setOverview] = useState<EndpointState<AdminSpmOverview>>({
    label: 'Overview',
    path: '/admin/spm/control-tower/overview',
    status: 'idle',
  });

  const [endpoints, setEndpoints] = useState<Array<EndpointState<unknown>>>([
    { label: 'Trail Families', path: '/admin/spm/trail-families', status: 'idle' },
    { label: 'Trail Nodes', path: '/admin/spm/nodes', status: 'idle' },
    { label: 'Packages', path: '/admin/spm/packages', status: 'idle' },
    { label: 'Pricing Rules', path: '/admin/spm/pricing-rules', status: 'idle' },
    { label: 'Operator Mapping', path: '/admin/spm/operator-mapping', status: 'idle' },
    { label: 'Frontend Exposure', path: '/admin/spm/frontend-exposure', status: 'idle' },
    { label: 'Stamp Events', path: '/admin/spm/stamp-events', status: 'idle' },
  ]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setOverview((current) => ({ ...current, status: 'loading' }));
      setEndpoints((current) => current.map((item) => ({ ...item, status: 'loading' })));

      const overviewResult = await fetchAdminSpm<AdminSpmOverview>('/admin/spm/control-tower/overview');

      if (!isMounted) return;

      setOverview({
        label: 'Overview',
        path: '/admin/spm/control-tower/overview',
        status: overviewResult.status,
        httpStatus: overviewResult.httpStatus,
        data: overviewResult.data,
        message: overviewResult.message,
      });

      const endpointPaths = [
        { label: 'Trail Families', path: '/admin/spm/trail-families' },
        { label: 'Trail Nodes', path: '/admin/spm/nodes' },
        { label: 'Packages', path: '/admin/spm/packages' },
        { label: 'Pricing Rules', path: '/admin/spm/pricing-rules' },
        { label: 'Operator Mapping', path: '/admin/spm/operator-mapping' },
        { label: 'Frontend Exposure', path: '/admin/spm/frontend-exposure' },
        { label: 'Stamp Events', path: '/admin/spm/stamp-events' },
      ];

      const results = await Promise.all(
        endpointPaths.map(async (endpoint) => {
          const result = await fetchAdminSpm<unknown>(endpoint.path);
          return {
            label: endpoint.label,
            path: endpoint.path,
            status: result.status,
            httpStatus: result.httpStatus,
            data: result.data,
            message: result.message,
          };
        }),
      );

      if (!isMounted) return;
      setEndpoints(results);
    }

    load();

    function reloadOnTokenUpdate() {
      load();
    }

    window.addEventListener(ADMIN_SPM_TOKEN_EVENT, reloadOnTokenUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener(ADMIN_SPM_TOKEN_EVENT, reloadOnTokenUpdate);
    };
  }, []);

  const metrics = useMemo(() => {
    return overview.data?.panels?.passportMapProductStatus ?? {};
  }, [overview.data]);

  const readyCount = endpoints.filter((endpoint) => endpoint.status === 'ready').length;
  const unauthorizedCount = endpoints.filter((endpoint) => endpoint.status === 'unauthorized').length;
  const errorCount = endpoints.filter((endpoint) => endpoint.status === 'error').length;

  return (
    <section
      aria-label="Admin SPM live read contract"
      style={{
        marginTop: 20,
        borderRadius: 30,
        border: '1px solid rgba(1,56,99,0.10)',
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(234,251,250,0.92))',
        boxShadow: '0 24px 60px rgba(1,56,99,0.08)',
        padding: 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 18,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <p
            style={{
              margin: '0 0 8px',
              color: OSP.teal,
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            Admin backend read contract
          </p>
          <h2
            style={{
              margin: 0,
              color: OSP.deepNavy,
              fontSize: 'clamp(1.7rem, 3vw, 3rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.055em',
              fontWeight: 760,
            }}
          >
            Live SPM control data connection
          </h2>
          <p
            style={{
              margin: '10px 0 0',
              color: OSP.slate,
              maxWidth: 840,
              lineHeight: 1.6,
              fontSize: 14,
            }}
          >
            This panel reads the protected admin SPM endpoints created in ADMIN-CT-SPM-06.
            It is read-only. Forms, approvals, dropdowns, and submissions start in ADMIN-CT-SPM-09B.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gap: 8,
            minWidth: 210,
          }}
        >
          <StatusPill status={overview.status} />
          <div style={{ color: OSP.slate, fontSize: 12, lineHeight: 1.45 }}>
            {readyCount} live · {unauthorizedCount} auth required · {errorCount} needs check
          </div>
        </div>
      </div>

      {overview.status === 'unauthorized' ? <AdminSpmAuthTokenBridge compact /> : null}

      {overview.status === 'ready' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 12,
            marginTop: 18,
          }}
        >
          {Object.entries(metrics).map(([key, value]) => (
            <article
              key={key}
              style={{
                borderRadius: 20,
                border: '1px solid rgba(5,150,165,0.13)',
                background: OSP.white,
                padding: 14,
              }}
            >
              <div
                style={{
                  color: OSP.slate,
                  fontSize: 11,
                  fontWeight: 800,
                  lineHeight: 1.25,
                }}
              >
                {metricLabel(key)}
              </div>
              <div
                style={{
                  marginTop: 8,
                  color: OSP.deepNavy,
                  fontSize: 24,
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                }}
              >
                {Number(value || 0).toLocaleString()}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div
          style={{
            marginTop: 18,
            borderRadius: 22,
            border: '1px solid rgba(243,174,38,0.28)',
            background: 'rgba(243,174,38,0.10)',
            padding: 16,
            color: OSP.deepNavy,
            lineHeight: 1.55,
            fontSize: 13,
          }}
        >
          <strong>
            {overview.status === 'unauthorized'
              ? 'Admin authorization is required.'
              : overview.status === 'loading'
                ? 'Loading admin SPM contract...'
                : 'Admin SPM read contract is not ready.'}
          </strong>
          <div style={{ marginTop: 4 }}>
            {overview.message ||
              'If this stays blocked, confirm the logged-in admin token is stored in the frontend session/local storage.'}
          </div>
          <code
            style={{
              display: 'inline-flex',
              marginTop: 10,
              borderRadius: 12,
              background: OSP.deepNavy,
              color: OSP.white,
              padding: '7px 9px',
              fontSize: 12,
            }}
          >
            {overview.path}
          </code>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 12,
          marginTop: 16,
        }}
      >
        {endpoints.map((endpoint) => (
          <article
            key={endpoint.path}
            style={{
              borderRadius: 20,
              border: '1px solid rgba(1,56,99,0.10)',
              background: OSP.white,
              padding: 14,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <strong style={{ color: OSP.deepNavy, fontSize: 13 }}>{endpoint.label}</strong>
              <StatusPill status={endpoint.status} />
            </div>
            <code
              style={{
                display: 'block',
                marginTop: 10,
                color: OSP.slate,
                fontSize: 11,
                wordBreak: 'break-all',
              }}
            >
              {endpoint.path}
            </code>
            <div style={{ marginTop: 8, color: OSP.slate, fontSize: 12, lineHeight: 1.4 }}>
              HTTP {endpoint.httpStatus ?? '—'}
              {Array.isArray(endpoint.data)
                ? ` · ${endpoint.data.length} records`
                : endpoint.data && typeof endpoint.data === 'object'
                  ? ' · contract response'
                  : ''}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
