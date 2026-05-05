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
  isActive?: boolean;
};

type CreateDraft = {
  trailFamilyId: string;
  code: string;
  name: string;
  nodeType: string;
  requirementType: string;
  description: string;
  municipality: string;
  barangay: string;
  locationLabel: string;
  latitude: string;
  longitude: string;
  stampEligible: boolean;
  bookingRequired: boolean;
  operatorRequired: boolean;
  safetyControlled: boolean;
  isOfficialNode: boolean;
  isConditionalNode: boolean;
  guideRequirement: string;
  conditionNote: string;
  approvalStatus: string;
};

const initialDraft: CreateDraft = {
  trailFamilyId: '',
  code: '',
  name: '',
  nodeType: 'PLACE',
  requirementType: 'OPTIONAL',
  description: '',
  municipality: 'General Luna',
  barangay: '',
  locationLabel: '',
  latitude: '',
  longitude: '',
  stampEligible: true,
  bookingRequired: false,
  operatorRequired: false,
  safetyControlled: false,
  isOfficialNode: true,
  isConditionalNode: false,
  guideRequirement: 'GUIDE_OPTIONAL',
  conditionNote: '',
  approvalStatus: 'DRAFT',
};

function cleanCode(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function cleanNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function hasInvalidNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return !Number.isFinite(Number(trimmed));
}

function inputStyle() {
  return {
    minHeight: 42,
    borderRadius: 14,
    border: '1px solid rgba(1,56,99,0.16)',
    padding: '0 12px',
    color: OSP.deepNavy,
    fontWeight: 750,
    background: OSP.white,
  } as const;
}

type Props = {
  onCreated?: () => void;
  defaultTrailFamilyId?: string;
  onCancel?: () => void;
};

export default function AdminSpmTrailNodesCreateForm({ onCreated, defaultTrailFamilyId, onCancel }: Props) {
  const [families, setFamilies] = useState<TrailFamily[]>([]);
  const [draft, setDraft] = useState<CreateDraft>(initialDraft);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'saving' | 'saved' | 'unauthorized' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const canSubmit = useMemo(() => {
    return Boolean(
      draft.trailFamilyId &&
        cleanCode(draft.code) &&
        draft.name.trim() &&
        draft.nodeType &&
        draft.requirementType,
    );
  }, [draft]);

  const missingFields = useMemo(() => {
    const missing: string[] = [];
    if (!draft.trailFamilyId) missing.push('Trail Family');
    if (!cleanCode(draft.code)) missing.push('Node Code');
    if (!draft.name.trim()) missing.push('Node Name');
    if (!draft.nodeType) missing.push('Node Type');
    if (!draft.requirementType) missing.push('Requirement Type');
    return missing;
  }, [draft]);

  async function loadFamilies() {
    const token = getAdminSpmBearerToken();
    setStatus((current) => (current === 'idle' ? 'loading' : current));

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

      setDraft((current) => ({
        ...current,
        trailFamilyId: defaultTrailFamilyId || current.trailFamilyId || items[0]?.id || '',
      }));

      setStatus('ready');
      setMessage('');
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

  useEffect(() => {
    if (!defaultTrailFamilyId) return;
    setDraft((current) => ({
      ...current,
      trailFamilyId: defaultTrailFamilyId,
    }));
  }, [defaultTrailFamilyId]);

  function updateDraft(patch: Partial<CreateDraft>) {
    setDraft((current) => ({
      ...current,
      ...patch,
    }));
  }

  async function createNode() {
    if (!canSubmit) {
      setMessage('Trail family, node code, node name, node type, and requirement type are required.');
      return;
    }

    const token = getAdminSpmBearerToken();
    setStatus('saving');
    setMessage('Creating node...');

    const body = {
      trailFamilyId: draft.trailFamilyId,
      code: cleanCode(draft.code),
      name: draft.name.trim(),
      nodeType: draft.nodeType,
      requirementType: draft.requirementType,
      description: draft.description.trim(),
      municipality: draft.municipality.trim(),
      barangay: draft.barangay.trim(),
      locationLabel: draft.locationLabel.trim(),
      latitude: null,
      longitude: null,
      stampEligible: draft.stampEligible,
      bookingRequired: draft.bookingRequired,
      operatorRequired: draft.operatorRequired,
      safetyControlled: draft.safetyControlled,
      isOfficialNode: draft.isOfficialNode,
      isConditionalNode: draft.isConditionalNode,
      guideRequirement: draft.guideRequirement.trim(),
      conditionNote: draft.conditionNote.trim(),
      approvalStatus: draft.approvalStatus,
      reason: 'ADMIN_CT_SPM_09C2_TRAIL_NODE_CREATE',
    };

    try {
      const response = await fetch(`${API_BASE}/api/admin/spm/nodes`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const payload = await response.json().catch(() => null);

      if (response.status === 401 || response.status === 403) {
        setStatus('unauthorized');
        setMessage(payload?.message || 'Admin authorization is required.');
        return;
      }

      if (!response.ok) {
        setStatus('error');
        setMessage(payload?.message || `Create failed. HTTP ${response.status}`);
        return;
      }

      setStatus('saved');
      setMessage(`Saved new node ${payload?.code || body.code} as ${body.approvalStatus}. Reloading node list...`);
      setDraft({
        ...initialDraft,
        trailFamilyId: draft.trailFamilyId,
        municipality: draft.municipality,
      });

      setTimeout(() => {
        onCreated?.();
        setStatus('ready');
      }, 700);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Create request failed.');
    }
  }

  return (
    <section
      id="admin-spm-create-node-form"
      aria-label="Create SPM Trail Node"
      style={{
        marginTop: 18,
        borderRadius: 28,
        border: '1px solid rgba(1,56,99,0.10)',
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(234,251,250,0.94))',
        boxShadow: '0 18px 44px rgba(1,56,99,0.07)',
        padding: 20,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
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
            ADMIN-CT-SPM-09C-2 / Create map inventory
          </p>
          <h3
            style={{
              margin: 0,
              color: OSP.deepNavy,
              fontSize: 'clamp(1.35rem, 2.2vw, 2.2rem)',
              lineHeight: 1,
              letterSpacing: '-0.045em',
            }}
          >
            New Trail Node / Stop
          </h3>
          <p style={{ margin: '8px 0 0', color: OSP.slate, maxWidth: 840, fontSize: 13, lineHeight: 1.55 }}>
            Fill this form to add a future or newly discovered Passport Map stop under the selected Trail Family. Keep new records in DRAFT unless the stop is already operationally verified.
          </p>
        </div>

        <button
          type="button"
          onClick={loadFamilies}
          style={{
            minHeight: 40,
            border: 0,
            borderRadius: 999,
            background: OSP.deepNavy,
            color: OSP.white,
            padding: '0 14px',
            fontSize: 12,
            fontWeight: 900,
            cursor: 'pointer',
          }}
        >
          Refresh families
        </button>
      </div>

      {status === 'unauthorized' ? <AdminSpmAuthTokenBridge compact /> : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
          marginTop: 16,
        }}
      >
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Trail family</span>
          <select
            value={draft.trailFamilyId}
            onChange={(event) => updateDraft({ trailFamilyId: event.target.value })}
            style={inputStyle()}
          >
            {families.length === 0 ? <option value="">No trail families loaded</option> : null}
            {families.map((family) => (
              <option key={family.id} value={family.id}>
                {family.publicLabel || family.name} · {family.code}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>
            Node code <strong style={{ color: OSP.deepNavy }}>* required</strong>
          </span>
          <input
            value={draft.code}
            onChange={(event) => updateDraft({ code: cleanCode(event.target.value) })}
            placeholder="Auto-fills from node name, editable"
            style={inputStyle()}
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Node type</span>
          <select value={draft.nodeType} onChange={(event) => updateDraft({ nodeType: event.target.value })} style={inputStyle()}>
            <option value="PLACE">PLACE</option>
            <option value="STOP">STOP</option>
            <option value="ACTIVITY">ACTIVITY</option>
            <option value="CHECKPOINT">CHECKPOINT</option>
            <option value="TRANSPORT_ANCHOR">TRANSPORT_ANCHOR</option>
          </select>
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Requirement type</span>
          <select value={draft.requirementType} onChange={(event) => updateDraft({ requirementType: event.target.value })} style={inputStyle()}>
            <option value="OPTIONAL">OPTIONAL</option>
            <option value="REQUIRED">REQUIRED</option>
            <option value="CONDITIONAL">CONDITIONAL</option>
          </select>
        </label>
      </div>

      <label style={{ display: 'grid', gap: 6, marginTop: 12 }}>
        <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Stop / node name</span>
        <input
          value={draft.name}
          onChange={(event) => updateDraft({ name: event.target.value })}
          placeholder="Example: Cloud 9 Boardwalk"
          style={inputStyle()}
        />
      </label>

      <label style={{ display: 'grid', gap: 6, marginTop: 12 }}>
        <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Traveler-facing stop description</span>
        <textarea
          value={draft.description}
          onChange={(event) => updateDraft({ description: event.target.value })}
          rows={3}
          placeholder="What should travelers understand about this stop?"
          style={{
            borderRadius: 14,
            border: '1px solid rgba(1,56,99,0.16)',
            padding: 12,
            color: OSP.deepNavy,
            resize: 'vertical',
            fontFamily: 'inherit',
            lineHeight: 1.45,
          }}
        />
      </label>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginTop: 12,
        }}
      >
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Municipality</span>
          <input value={draft.municipality} onChange={(event) => updateDraft({ municipality: event.target.value })} style={inputStyle()} />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Barangay</span>
          <input value={draft.barangay} onChange={(event) => updateDraft({ barangay: event.target.value })} style={inputStyle()} />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Location label</span>
          <input value={draft.locationLabel} onChange={(event) => updateDraft({ locationLabel: event.target.value })} style={inputStyle()} />
        </label>
        <div
          style={{
            borderRadius: 16,
            border: '1px solid rgba(1,56,99,0.10)',
            background: 'rgba(255,255,255,0.72)',
            padding: 12,
            color: OSP.slate,
            fontSize: 12,
            fontWeight: 800,
            lineHeight: 1.45,
          }}
        >
          Coordinates bypassed for now. SPM is not GPS-based yet; new nodes save latitude and longitude as null.
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 10,
          marginTop: 14,
          color: OSP.deepNavy,
          fontSize: 12,
          fontWeight: 850,
        }}
      >
        {[
          ['stampEligible', 'Stamp eligible'],
          ['bookingRequired', 'Booking required'],
          ['operatorRequired', 'Operator required'],
          ['safetyControlled', 'Safety controlled'],
          ['isOfficialNode', 'Official node'],
          ['isConditionalNode', 'Conditional node'],
        ].map(([field, label]) => (
          <label key={field} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={Boolean(draft[field as keyof CreateDraft])}
              onChange={(event) =>
                updateDraft({
                  [field]: event.target.checked,
                } as Partial<CreateDraft>)
              }
            />
            {label}
          </label>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
          marginTop: 12,
        }}
      >
        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Guide requirement</span>
          <input value={draft.guideRequirement} onChange={(event) => updateDraft({ guideRequirement: event.target.value })} style={inputStyle()} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Condition note</span>
          <input value={draft.conditionNote} onChange={(event) => updateDraft({ conditionNote: event.target.value })} style={inputStyle()} />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>
            Approval status / save state
          </span>
          <select value={draft.approvalStatus} onChange={(event) => updateDraft({ approvalStatus: event.target.value })} style={inputStyle()}>
            <option value="DRAFT">DRAFT</option>
            <option value="REVIEW">REVIEW</option>
            <option value="APPROVED">APPROVED</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </label>
      </div>

      {message ? (
        <div
          style={{
            marginTop: 14,
            borderRadius: 16,
            background:
              status === 'error'
                ? 'rgba(205,70,70,0.12)'
                : status === 'saved'
                  ? 'rgba(5,150,165,0.14)'
                  : 'rgba(243,174,38,0.14)',
            color: OSP.deepNavy,
            padding: 11,
            fontSize: 12,
            fontWeight: 850,
          }}
        >
          {message}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 18,
          borderRadius: 22,
          border: canSubmit
            ? '1px solid rgba(5,150,165,0.24)'
            : '1px solid rgba(243,174,38,0.30)',
          background: canSubmit
            ? 'linear-gradient(135deg, rgba(234,251,250,0.95), rgba(255,255,255,0.98))'
            : 'linear-gradient(135deg, rgba(243,174,38,0.10), rgba(255,255,255,0.98))',
          padding: 16,
          boxShadow: '0 14px 32px rgba(1,56,99,0.07)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 14,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ minWidth: 260 }}>
          <div
            style={{
              color: OSP.deepNavy,
              fontSize: 13,
              fontWeight: 950,
              letterSpacing: '-0.02em',
            }}
          >
            {canSubmit ? 'Ready to create this node.' : 'Required fields still missing.'}
          </div>
          <div style={{ color: OSP.slate, fontSize: 12, lineHeight: 1.5, marginTop: 4 }}>
            Required fields are marked by the save gate. Coordinates are bypassed for now and saved as null.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              style={{
                minHeight: 44,
                border: '1px solid rgba(1,56,99,0.14)',
                borderRadius: 999,
                background: OSP.white,
                color: OSP.deepNavy,
                padding: '0 16px',
                fontSize: 12,
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          ) : null}

          <button
            type="button"
            onClick={createNode}
            disabled={!canSubmit || status === 'saving'}
            style={{
              minHeight: 46,
              border: 0,
              borderRadius: 999,
              background: !canSubmit || status === 'saving' ? 'rgba(80,102,139,0.18)' : OSP.gold,
              color: !canSubmit || status === 'saving' ? OSP.slate : OSP.deepNavy,
              padding: '0 20px',
              fontSize: 13,
              fontWeight: 1000,
              cursor: !canSubmit || status === 'saving' ? 'not-allowed' : 'pointer',
              boxShadow: canSubmit ? '0 16px 32px rgba(243,174,38,0.28)' : 'none',
            }}
          >
            {status === 'saving'
              ? 'Creating...'
              : canSubmit
                ? `Save New Node / Stop as ${draft.approvalStatus}`
                : `Missing: ${missingFields.join(', ') || 'Required Fields'}`}
          </button>
        </div>
      </div>
    </section>
  );
}
