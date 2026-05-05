'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminSpmAuthTokenBridge, {
  ADMIN_SPM_TOKEN_EVENT,
  getAdminSpmBearerToken,
} from './AdminSpmAuthTokenBridge';

const API_BASE = '';

const OSP = {
  deepNavy: '#013863',
  teal: '#0596A5',
  gold: '#F3AE26',
  slate: '#50668B',
  white: '#FFFFFF',
};

type TrailFamily = {
  id: string;
  code: string;
  name: string;
  publicLabel?: string | null;
  description?: string | null;
  officialSortOrder?: number | string | null;
  sortOrder?: number | string | null;
  isActive?: boolean;
};

type FamilyDraft = {
  publicLabel: string;
  description: string;
  officialSortOrder: string;
  isActive: boolean;
};

type RowStatus = {
  state: 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
  message?: string;
};

function valueToString(value: unknown) {
  if (value === null || value === undefined) return '';
  return String(value);
}

function toDraft(family: TrailFamily): FamilyDraft {
  return {
    publicLabel: family.publicLabel || family.name || '',
    description: family.description || '',
    officialSortOrder: valueToString(family.officialSortOrder ?? family.sortOrder ?? ''),
    isActive: family.isActive === true,
  };
}

function normalizeDraft(draft: FamilyDraft) {
  const parsedSort = Number(draft.officialSortOrder);

  return {
    publicLabel: draft.publicLabel.trim(),
    description: draft.description.trim(),
    officialSortOrder: Number.isFinite(parsedSort) ? parsedSort : 0,
    isActive: draft.isActive,
  };
}

function normalizeFamily(family: TrailFamily) {
  const parsedSort = Number(family.officialSortOrder ?? family.sortOrder ?? 0);

  return {
    publicLabel: (family.publicLabel || family.name || '').trim(),
    description: (family.description || '').trim(),
    officialSortOrder: Number.isFinite(parsedSort) ? parsedSort : 0,
    isActive: family.isActive === true,
  };
}

function isDirty(family: TrailFamily, draft: FamilyDraft | undefined) {
  if (!draft) return false;
  return JSON.stringify(normalizeDraft(draft)) !== JSON.stringify(normalizeFamily(family));
}

function rowStatusStyle(status: RowStatus['state']) {
  if (status === 'saved') return { background: 'rgba(5,150,165,0.14)', color: OSP.deepNavy };
  if (status === 'error') return { background: 'rgba(205,70,70,0.12)', color: '#8A1D1D' };
  if (status === 'saving') return { background: 'rgba(80,102,139,0.14)', color: OSP.deepNavy };
  if (status === 'dirty') return { background: 'rgba(243,174,38,0.22)', color: OSP.deepNavy };
  return { background: 'rgba(80,102,139,0.10)', color: OSP.slate };
}

function inputStyle() {
  return {
    minHeight: 44,
    borderRadius: 14,
    border: '1px solid rgba(1,56,99,0.16)',
    padding: '0 12px',
    color: OSP.deepNavy,
    fontWeight: 750,
    background: OSP.white,
  } as const;
}

export default function AdminSpmTrailFamiliesEditor() {
  const [families, setFamilies] = useState<TrailFamily[]>([]);
  const [drafts, setDrafts] = useState<Record<string, FamilyDraft>>({});
  const [rowStatuses, setRowStatuses] = useState<Record<string, RowStatus>>({});
  const [selectedFamilyId, setSelectedFamilyId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'unauthorized' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [lastLoadedAt, setLastLoadedAt] = useState('');

  const activeCount = useMemo(
    () => families.filter((family) => family.isActive === true).length,
    [families],
  );

  const dirtyCount = useMemo(
    () => families.filter((family) => isDirty(family, drafts[family.id])).length,
    [families, drafts],
  );

  const selectedFamily = useMemo(() => {
    if (!families.length) return null;
    return families.find((family) => family.id === selectedFamilyId) || families[0];
  }, [families, selectedFamilyId]);

  async function loadFamilies() {
    setStatus('loading');
    setMessage('');

    const token = getAdminSpmBearerToken();

    try {
      const response = await fetch(`${API_BASE}/api/admin/spm/trail-families`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: 'no-store',
      });

      const payload = await response.json().catch(() => null);

      if (response.status === 401 || response.status === 403) {
        setStatus('unauthorized');
        setMessage(payload?.message || 'Admin login cookie or bearer token is required.');
        return;
      }

      if (!response.ok) {
        setStatus('error');
        setMessage(payload?.message || `Failed to load trail families. HTTP ${response.status}`);
        return;
      }

      const items = Array.isArray(payload) ? payload : [];
      setFamilies(items);

      if (items.length > 0) {
        setSelectedFamilyId((current) => current || items[0].id);
      }

      const nextDrafts: Record<string, FamilyDraft> = {};
      const nextStatuses: Record<string, RowStatus> = {};

      for (const family of items) {
        nextDrafts[family.id] = toDraft(family);
        nextStatuses[family.id] = { state: 'idle', message: 'Loaded from DB.' };
      }

      setDrafts(nextDrafts);
      setRowStatuses(nextStatuses);
      setLastLoadedAt(new Date().toLocaleTimeString());
      setStatus('ready');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Network request failed.');
    }
  }

  useEffect(() => {
    loadFamilies();

    function reloadOnTokenUpdate() {
      loadFamilies();
    }

    window.addEventListener(ADMIN_SPM_TOKEN_EVENT, reloadOnTokenUpdate);

    return () => {
      window.removeEventListener(ADMIN_SPM_TOKEN_EVENT, reloadOnTokenUpdate);
    };
  }, []);

  function updateDraft(familyId: string, family: TrailFamily, patch: Partial<FamilyDraft>) {
    setDrafts((current) => {
      const nextDraft = {
        ...current[familyId],
        ...patch,
      };

      const nextDrafts = {
        ...current,
        [familyId]: nextDraft,
      };

      const changed = isDirty(family, nextDraft);

      setRowStatuses((statuses) => ({
        ...statuses,
        [familyId]: changed
          ? { state: 'dirty', message: 'Unsaved family changes.' }
          : { state: 'idle', message: 'No pending changes.' },
      }));

      return nextDrafts;
    });
  }

  async function saveFamily(family: TrailFamily) {
    const draft = drafts[family.id];
    if (!draft) return;

    if (!isDirty(family, draft)) {
      setRowStatuses((current) => ({
        ...current,
        [family.id]: { state: 'idle', message: 'No changes to save.' },
      }));
      return;
    }

    const token = getAdminSpmBearerToken();

    setRowStatuses((current) => ({
      ...current,
      [family.id]: { state: 'saving', message: 'Saving Trail Family to DB...' },
    }));

    try {
      const response = await fetch(`${API_BASE}/api/admin/spm/trail-families/${family.id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...normalizeDraft(draft),
          reason: 'ADMIN_CT_SPM_09B2A_TRAIL_FAMILY_DROPDOWN_EDIT',
        }),
      });

      const payload = await response.json().catch(() => null);

      if (response.status === 401 || response.status === 403) {
        setStatus('unauthorized');
        setRowStatuses((current) => ({
          ...current,
          [family.id]: {
            state: 'error',
            message: payload?.message || 'Admin authorization is required.',
          },
        }));
        return;
      }

      if (!response.ok) {
        setRowStatuses((current) => ({
          ...current,
          [family.id]: {
            state: 'error',
            message: payload?.message || `Save failed. HTTP ${response.status}`,
          },
        }));
        return;
      }

      const updated = payload as TrailFamily;

      setFamilies((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );

      setDrafts((current) => ({
        ...current,
        [updated.id]: toDraft(updated),
      }));

      setRowStatuses((current) => ({
        ...current,
        [updated.id]: {
          state: 'saved',
          message: `Saved at ${new Date().toLocaleTimeString()}. Reloading verifies DB state.`,
        },
      }));

      setTimeout(() => {
        loadFamilies();
      }, 500);
    } catch (error) {
      setRowStatuses((current) => ({
        ...current,
        [family.id]: {
          state: 'error',
          message: error instanceof Error ? error.message : 'Save request failed.',
        },
      }));
    }
  }

  const family = selectedFamily;
  const draft = family ? drafts[family.id] || toDraft(family) : null;
  const rowStatus = family ? rowStatuses[family.id] ?? { state: 'idle' as const } : { state: 'idle' as const };
  const dirty = family && draft ? isDirty(family, draft) : false;
  const style = rowStatusStyle(rowStatus.state);

  return (
    <section
      aria-label="SPM Trail Families Editor"
      style={{
        marginTop: 20,
        borderRadius: 30,
        border: '1px solid rgba(1,56,99,0.10)',
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(234,251,250,0.94))',
        boxShadow: '0 24px 60px rgba(1,56,99,0.08)',
        padding: 24,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: '0 0 8px', color: OSP.teal, fontSize: 11, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            ADMIN-CT-SPM-09B-2A / Trail family dropdown workspace
          </p>

          <h2 style={{ margin: 0, color: OSP.deepNavy, fontSize: 'clamp(1.7rem, 3vw, 3rem)', lineHeight: 0.98, letterSpacing: '-0.055em', fontWeight: 760 }}>
            Trail Families editor
          </h2>

          <p style={{ margin: '10px 0 0', color: OSP.slate, maxWidth: 900, lineHeight: 1.6, fontSize: 14 }}>
            Select one official Passport Trail family, edit its traveler-facing label, description, sort order, and active state, then save and verify from DB.
          </p>
        </div>

        <button
          type="button"
          onClick={loadFamilies}
          style={{ minHeight: 42, border: 0, borderRadius: 999, background: OSP.deepNavy, color: OSP.white, padding: '0 16px', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}
        >
          Refresh families
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16, color: OSP.deepNavy, fontSize: 12, fontWeight: 800 }}>
        <span style={{ borderRadius: 999, background: 'rgba(5,150,165,0.14)', padding: '8px 11px' }}>{families.length} families loaded</span>
        <span style={{ borderRadius: 999, background: 'rgba(243,174,38,0.22)', padding: '8px 11px' }}>{activeCount} active</span>
        <span style={{ borderRadius: 999, background: dirtyCount ? 'rgba(243,174,38,0.24)' : 'rgba(80,102,139,0.10)', padding: '8px 11px' }}>{dirtyCount} unsaved</span>
        <span style={{ borderRadius: 999, background: 'rgba(80,102,139,0.10)', padding: '8px 11px' }}>PATCH /admin/spm/trail-families/:familyId</span>
        {lastLoadedAt ? (
          <span style={{ borderRadius: 999, background: 'rgba(80,102,139,0.10)', padding: '8px 11px' }}>loaded {lastLoadedAt}</span>
        ) : null}
      </div>

      {status === 'unauthorized' ? <AdminSpmAuthTokenBridge compact /> : null}

      {status === 'loading' ? (
        <div style={{ marginTop: 18, color: OSP.slate }}>Loading trail families...</div>
      ) : null}

      {status === 'unauthorized' || status === 'error' ? (
        <div style={{ marginTop: 18, borderRadius: 20, border: '1px solid rgba(243,174,38,0.28)', background: 'rgba(243,174,38,0.10)', padding: 14, color: OSP.deepNavy, lineHeight: 1.55, fontSize: 13 }}>
          <strong>{status === 'unauthorized' ? 'Admin authorization required.' : 'Trail Families editor needs check.'}</strong>
          <div>{message}</div>
        </div>
      ) : null}

      {status === 'ready' && families.length > 0 ? (
        <div style={{ marginTop: 18, borderRadius: 26, border: '1px solid rgba(5,150,165,0.20)', background: 'linear-gradient(135deg, rgba(234,251,250,0.98), rgba(255,255,255,0.96))', padding: 18, boxShadow: '0 16px 38px rgba(1,56,99,0.08)' }}>
          <p style={{ margin: '0 0 6px', color: OSP.teal, fontSize: 11, fontWeight: 950, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Trail family workspace selector
          </p>

          <h3 style={{ margin: 0, color: OSP.deepNavy, fontSize: 22, lineHeight: 1, letterSpacing: '-0.04em' }}>
            Select one Trail Family to edit
          </h3>

          <select
            value={family?.id || ''}
            onChange={(event) => setSelectedFamilyId(event.target.value)}
            style={{ width: '100%', minHeight: 50, marginTop: 14, borderRadius: 16, border: '1px solid rgba(1,56,99,0.16)', background: OSP.white, color: OSP.deepNavy, padding: '0 14px', fontWeight: 900, boxShadow: '0 8px 20px rgba(1,56,99,0.04)' }}
          >
            {families.map((item) => (
              <option key={item.id} value={item.id}>
                {item.code} · {item.publicLabel || item.name} · {item.isActive ? 'ACTIVE' : 'INACTIVE'}
              </option>
            ))}
          </select>

          <p style={{ margin: '12px 0 0', color: OSP.slate, fontSize: 12, fontWeight: 800 }}>
            Showing one selected trail family only. This removes the old stacked 8-family editor.
          </p>
        </div>
      ) : null}

      {status === 'ready' && family && draft ? (
        <article
          key={family.id}
          style={{
            marginTop: 14,
            borderRadius: 24,
            border: dirty ? '1px solid rgba(243,174,38,0.55)' : '1px solid rgba(1,56,99,0.10)',
            background: OSP.white,
            padding: 16,
            boxShadow: dirty ? '0 16px 36px rgba(243,174,38,0.16)' : '0 14px 34px rgba(1,56,99,0.06)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 180px', gap: 14, alignItems: 'start' }}>
            <div>
              <div style={{ color: OSP.teal, fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{family.code}</div>
              <h3 style={{ margin: '5px 0 0', color: OSP.deepNavy, fontSize: 22, letterSpacing: '-0.04em' }}>
                {family.publicLabel || family.name}
              </h3>
            </div>

            <div style={{ display: 'grid', gap: 8, justifyItems: 'end' }}>
              <span style={{ borderRadius: 999, background: style.background, color: style.color, padding: '7px 10px', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {rowStatus.state}
              </span>

              <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: OSP.deepNavy, fontSize: 12, fontWeight: 850 }}>
                <input
                  type="checkbox"
                  checked={draft.isActive}
                  onChange={(event) => updateDraft(family.id, family, { isActive: event.target.checked })}
                />
                Active
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 180px', gap: 12, marginTop: 14 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Traveler-facing label</span>
              <input value={draft.publicLabel} onChange={(event) => updateDraft(family.id, family, { publicLabel: event.target.value })} style={inputStyle()} />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Sort order</span>
              <input value={draft.officialSortOrder} onChange={(event) => updateDraft(family.id, family, { officialSortOrder: event.target.value })} style={inputStyle()} />
            </label>
          </div>

          <label style={{ display: 'grid', gap: 6, marginTop: 12 }}>
            <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Traveler-facing description</span>
            <textarea
              value={draft.description}
              onChange={(event) => updateDraft(family.id, family, { description: event.target.value })}
              rows={3}
              style={{ borderRadius: 14, border: '1px solid rgba(1,56,99,0.16)', padding: 12, color: OSP.deepNavy, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.45 }}
            />
          </label>

          {rowStatus.message ? (
            <div style={{ marginTop: 12, borderRadius: 16, background: style.background, color: style.color, padding: 11, fontSize: 12, fontWeight: 800 }}>
              {rowStatus.message}
            </div>
          ) : null}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginTop: 14, flexWrap: 'wrap' }}>
            <div style={{ color: OSP.slate, fontSize: 12 }}>
              Writes only allowed Trail Family fields. No schema change. No traveler draft exposure.
            </div>

            <button
              type="button"
              onClick={() => saveFamily(family)}
              disabled={!dirty || rowStatus.state === 'saving'}
              style={{
                minHeight: 42,
                border: 0,
                borderRadius: 999,
                background: !dirty ? 'rgba(80,102,139,0.18)' : rowStatus.state === 'saving' ? OSP.slate : OSP.gold,
                color: !dirty ? OSP.slate : OSP.deepNavy,
                padding: '0 16px',
                fontSize: 12,
                fontWeight: 950,
                cursor: !dirty ? 'not-allowed' : rowStatus.state === 'saving' ? 'wait' : 'pointer',
                boxShadow: dirty ? '0 12px 26px rgba(243,174,38,0.24)' : 'none',
              }}
            >
              {rowStatus.state === 'saving' ? 'Saving...' : dirty ? 'Save Trail Family & Verify' : 'No Changes'}
            </button>
          </div>
        </article>
      ) : null}
    </section>
  );
}
