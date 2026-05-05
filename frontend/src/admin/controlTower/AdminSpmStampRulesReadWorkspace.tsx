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

type StampRuleNode = {
  id: string;
  trailFamilyId?: string | null;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  nodeType?: string | null;
  requirementType?: string | null;
  approvalStatus?: string | null;
  stampEligible?: boolean;
  bookingRequired?: boolean;
  operatorRequired?: boolean;
  guideRequirement?: string | null;
  safetyControlled?: boolean;
  isOfficialNode?: boolean;
  isConditionalNode?: boolean;
  conditionNote?: string | null;
};

type Draft = {
  stampEligible: boolean;
  bookingRequired: boolean;
  operatorRequired: boolean;
  guideRequirement: string;
  safetyControlled: boolean;
  isConditionalNode: boolean;
  conditionNote: string;
  approvalStatus: string;
};

function toDraft(node: StampRuleNode): Draft {
  return {
    stampEligible: node.stampEligible === true,
    bookingRequired: node.bookingRequired === true,
    operatorRequired: node.operatorRequired === true,
    guideRequirement: node.guideRequirement || 'NO_GUIDE_REQUIRED',
    safetyControlled: node.safetyControlled === true,
    isConditionalNode: node.isConditionalNode === true,
    conditionNote: node.conditionNote || '',
    approvalStatus: node.approvalStatus || 'DRAFT',
  };
}

function normalizePayload(payload: any): StampRuleNode[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.records)) return payload.records;
  return [];
}

export default function AdminSpmStampRulesReadWorkspace() {
  const [nodes, setNodes] = useState<StampRuleNode[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'unauthorized' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [lastLoadedAt, setLastLoadedAt] = useState('');

  const selectedNode = useMemo(() => {
    if (!nodes.length) return null;
    return nodes.find((node) => node.id === selectedId) || nodes[0];
  }, [nodes, selectedId]);

  const stampEligibleCount = useMemo(
    () => nodes.filter((node) => node.stampEligible === true).length,
    [nodes],
  );

  const approvedStampEligibleCount = useMemo(
    () =>
      nodes.filter(
        (node) => node.stampEligible === true && String(node.approvalStatus).toUpperCase() === 'APPROVED',
      ).length,
    [nodes],
  );

  const isDirty = useMemo(() => {
    if (!selectedNode || !draft) return false;
    return JSON.stringify(toDraft(selectedNode)) !== JSON.stringify(draft);
  }, [selectedNode, draft]);

  async function loadStampRuleNodes(nextSelectedId?: string) {
    setStatus('loading');
    setMessage('');

    const token = getAdminSpmBearerToken();

    try {
      const response = await fetch(`${API_BASE}/api/admin/spm/nodes?limit=250`, {
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
        setMessage(payload?.message || 'Admin bearer token or admin login cookie is required.');
        return;
      }

      if (!response.ok) {
        setStatus('error');
        setMessage(payload?.message || `Failed to load SPM trail nodes. HTTP ${response.status}`);
        return;
      }

      const items = normalizePayload(payload);
      setNodes(items);

      const target = nextSelectedId || selectedId || items[0]?.id || '';
      setSelectedId(target);

      const selected = items.find((node) => node.id === target) || items[0] || null;
      setDraft(selected ? toDraft(selected) : null);

      setLastLoadedAt(new Date().toLocaleTimeString());
      setStatus('ready');
      setSaveStatus('idle');
      setSaveMessage('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Network request failed.');
    }
  }

  async function saveStampRule() {
    if (!selectedNode || !draft) return;

    setSaveStatus('saving');
    setSaveMessage('');

    const token = getAdminSpmBearerToken();

    try {
      const response = await fetch(`${API_BASE}/api/admin/spm/nodes/${selectedNode.id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          stampEligible: draft.stampEligible,
          bookingRequired: draft.bookingRequired,
          operatorRequired: draft.operatorRequired,
          guideRequirement: draft.guideRequirement,
          safetyControlled: draft.safetyControlled,
          isConditionalNode: draft.isConditionalNode,
          conditionNote: draft.conditionNote,
          approvalStatus: draft.approvalStatus,
          actorRole: 'ADMIN_CONTROL_TOWER',
          reason: 'ADMIN_CT_SPM_09D_3_STAMP_RULE_NODE_UPDATE',
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setSaveStatus('error');
        setSaveMessage(payload?.message || `Save failed. HTTP ${response.status}`);
        return;
      }

      setSaveStatus('saved');
      setSaveMessage('Saved. Reloading from DB to verify persistence.');
      await loadStampRuleNodes(selectedNode.id);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error instanceof Error ? error.message : 'Save request failed.');
    }
  }

  useEffect(() => {
    loadStampRuleNodes();

    function reloadOnTokenUpdate() {
      loadStampRuleNodes();
    }

    window.addEventListener(ADMIN_SPM_TOKEN_EVENT, reloadOnTokenUpdate);

    return () => {
      window.removeEventListener(ADMIN_SPM_TOKEN_EVENT, reloadOnTokenUpdate);
    };
  }, []);

  function updateDraft(patch: Partial<Draft>) {
    setDraft((current) => (current ? { ...current, ...patch } : current));
    setSaveStatus('idle');
    setSaveMessage('');
  }

  return (
    <section
      id="admin-spm-stamp-rules-workspace"
      aria-label="SPM Stamp Rules Workspace"
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
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
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
            ADMIN-CT-SPM-09D-3 / NODE-BASED STAMP RULES
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
            Stamp Rules workspace
          </h2>

          <p style={{ margin: '10px 0 0', color: OSP.slate, maxWidth: 980, lineHeight: 1.6, fontSize: 14 }}>
            Current MVP stamp rules are governed through Trail Node eligibility and validation requirements. This workspace edits the rule fields that decide whether a stop can issue a Passport stamp and what operational validation is required.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadStampRuleNodes()}
          style={{
            minHeight: 42,
            border: 0,
            borderRadius: 999,
            background: OSP.deepNavy,
            color: OSP.white,
            padding: '0 16px',
            fontSize: 12,
            fontWeight: 900,
            cursor: 'pointer',
          }}
        >
          Refresh stamp rules
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16, color: OSP.deepNavy, fontSize: 12, fontWeight: 800 }}>
        <span style={{ borderRadius: 999, background: 'rgba(5,150,165,0.14)', padding: '8px 11px' }}>
          {nodes.length} nodes loaded
        </span>
        <span style={{ borderRadius: 999, background: 'rgba(243,174,38,0.22)', padding: '8px 11px' }}>
          {stampEligibleCount} stamp eligible
        </span>
        <span style={{ borderRadius: 999, background: 'rgba(243,174,38,0.22)', padding: '8px 11px' }}>
          {approvedStampEligibleCount} approved stamp nodes
        </span>
        <span style={{ borderRadius: 999, background: 'rgba(80,102,139,0.10)', padding: '8px 11px' }}>
          PATCH /admin/spm/nodes/:nodeId
        </span>
        {lastLoadedAt ? (
          <span style={{ borderRadius: 999, background: 'rgba(80,102,139,0.10)', padding: '8px 11px' }}>
            loaded {lastLoadedAt}
          </span>
        ) : null}
      </div>

      {status === 'unauthorized' ? <AdminSpmAuthTokenBridge compact /> : null}

      {status === 'loading' ? (
        <div style={{ marginTop: 18, color: OSP.slate }}>Loading node-based stamp rules...</div>
      ) : null}

      {status === 'unauthorized' || status === 'error' ? (
        <div
          style={{
            marginTop: 18,
            borderRadius: 20,
            border: '1px solid rgba(243,174,38,0.28)',
            background: 'rgba(243,174,38,0.10)',
            padding: 14,
            color: OSP.deepNavy,
            lineHeight: 1.55,
            fontSize: 13,
          }}
        >
          <strong>{status === 'unauthorized' ? 'Admin authorization required.' : 'Stamp Rules workspace needs check.'}</strong>
          <div>{message}</div>
        </div>
      ) : null}

      {status === 'ready' && nodes.length === 0 ? (
        <div
          style={{
            marginTop: 18,
            borderRadius: 22,
            border: '1px solid rgba(1,56,99,0.10)',
            background: OSP.white,
            padding: 16,
            color: OSP.deepNavy,
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          <strong>No trail nodes returned yet.</strong>
          <div style={{ color: OSP.slate, marginTop: 4 }}>
            Stamp rules cannot be edited until Trail Nodes exist.
          </div>
        </div>
      ) : null}

      {status === 'ready' && selectedNode && draft ? (
        <>
          <div
            style={{
              marginTop: 18,
              borderRadius: 26,
              border: '1px solid rgba(5,150,165,0.20)',
              background:
                'linear-gradient(135deg, rgba(234,251,250,0.98), rgba(255,255,255,0.96))',
              padding: 18,
              boxShadow: '0 16px 38px rgba(1,56,99,0.08)',
            }}
          >
            <p style={{ margin: '0 0 6px', color: OSP.teal, fontSize: 11, fontWeight: 950, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Stamp rule selector
            </p>

            <h3 style={{ margin: 0, color: OSP.deepNavy, fontSize: 22, lineHeight: 1, letterSpacing: '-0.04em' }}>
              Select a Trail Node / Stop to control stamp behavior
            </h3>

            <select
              value={selectedNode.id}
              onChange={(event) => {
                const node = nodes.find((item) => item.id === event.target.value) || nodes[0];
                setSelectedId(node.id);
                setDraft(toDraft(node));
                setSaveStatus('idle');
                setSaveMessage('');
              }}
              style={{
                width: '100%',
                minHeight: 50,
                marginTop: 14,
                borderRadius: 16,
                border: '1px solid rgba(1,56,99,0.16)',
                background: OSP.white,
                color: OSP.deepNavy,
                padding: '0 14px',
                fontWeight: 900,
                boxShadow: '0 8px 20px rgba(1,56,99,0.04)',
              }}
            >
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.code || 'NO_CODE'} · {node.name || 'Unnamed node'} · {node.stampEligible ? 'STAMP_ON' : 'STAMP_OFF'} · {node.approvalStatus || 'UNKNOWN'}
                </option>
              ))}
            </select>
          </div>

          <article
            style={{
              marginTop: 14,
              borderRadius: 24,
              border: isDirty ? '1px solid rgba(243,174,38,0.55)' : '1px solid rgba(1,56,99,0.10)',
              background: OSP.white,
              padding: 16,
              boxShadow: '0 14px 34px rgba(1,56,99,0.06)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: OSP.teal, fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {selectedNode.code || 'NO_CODE'} · {selectedNode.nodeType || 'NODE'}
                </div>
                <h3 style={{ margin: '5px 0 0', color: OSP.deepNavy, fontSize: 24, letterSpacing: '-0.04em' }}>
                  {selectedNode.name || 'Unnamed node'}
                </h3>
              </div>

              <span
                style={{
                  borderRadius: 999,
                  background: isDirty ? 'rgba(243,174,38,0.22)' : 'rgba(5,150,165,0.14)',
                  color: OSP.deepNavy,
                  padding: '9px 12px',
                  fontSize: 11,
                  fontWeight: 950,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  alignSelf: 'start',
                }}
              >
                {isDirty ? 'DIRTY' : 'LOADED FROM DB'}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 14,
                marginTop: 18,
              }}
            >
              {[
                ['stampEligible', 'Stamp eligible'],
                ['bookingRequired', 'Booking required'],
                ['operatorRequired', 'Operator required'],
                ['safetyControlled', 'Safety controlled'],
                ['isConditionalNode', 'Conditional node'],
              ].map(([key, label]) => (
                <label
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    borderRadius: 16,
                    border: '1px solid rgba(1,56,99,0.08)',
                    background: 'rgba(234,251,250,0.42)',
                    padding: 12,
                    color: OSP.deepNavy,
                    fontSize: 13,
                    fontWeight: 900,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={Boolean((draft as any)[key])}
                    onChange={(event) => updateDraft({ [key]: event.target.checked } as Partial<Draft>)}
                  />
                  {label}
                </label>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 14,
                marginTop: 16,
              }}
            >
              <label style={{ color: OSP.deepNavy, fontSize: 12, fontWeight: 900 }}>
                Guide requirement
                <select
                  value={draft.guideRequirement}
                  onChange={(event) => updateDraft({ guideRequirement: event.target.value })}
                  style={{
                    width: '100%',
                    minHeight: 46,
                    marginTop: 7,
                    borderRadius: 15,
                    border: '1px solid rgba(1,56,99,0.14)',
                    background: OSP.white,
                    color: OSP.deepNavy,
                    padding: '0 12px',
                    fontWeight: 850,
                  }}
                >
                  <option value="NO_GUIDE_REQUIRED">NO_GUIDE_REQUIRED</option>
                  <option value="GUIDE_OPTIONAL">GUIDE_OPTIONAL</option>
                  <option value="GUIDE_REQUIRED">GUIDE_REQUIRED</option>
                </select>
              </label>

              <label style={{ color: OSP.deepNavy, fontSize: 12, fontWeight: 900 }}>
                Approval status
                <select
                  value={draft.approvalStatus}
                  onChange={(event) => updateDraft({ approvalStatus: event.target.value })}
                  style={{
                    width: '100%',
                    minHeight: 46,
                    marginTop: 7,
                    borderRadius: 15,
                    border: '1px solid rgba(1,56,99,0.14)',
                    background: OSP.white,
                    color: OSP.deepNavy,
                    padding: '0 12px',
                    fontWeight: 850,
                  }}
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </label>
            </div>

            <label style={{ display: 'block', marginTop: 16, color: OSP.deepNavy, fontSize: 12, fontWeight: 900 }}>
              Stamp / validation condition note
              <textarea
                value={draft.conditionNote}
                onChange={(event) => updateDraft({ conditionNote: event.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  marginTop: 7,
                  borderRadius: 15,
                  border: '1px solid rgba(1,56,99,0.14)',
                  background: OSP.white,
                  color: OSP.deepNavy,
                  padding: 12,
                  fontWeight: 750,
                  resize: 'vertical',
                }}
              />
            </label>

            {saveMessage ? (
              <div
                style={{
                  marginTop: 14,
                  borderRadius: 16,
                  background: saveStatus === 'error' ? 'rgba(220,38,38,0.10)' : 'rgba(5,150,165,0.12)',
                  color: OSP.deepNavy,
                  padding: 12,
                  fontSize: 12,
                  fontWeight: 850,
                }}
              >
                {saveMessage}
              </div>
            ) : null}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: 18,
                borderRadius: 18,
                background: 'rgba(234,251,250,0.52)',
                padding: 14,
              }}
            >
              <div style={{ color: OSP.deepNavy, fontSize: 12, fontWeight: 850, lineHeight: 1.5 }}>
                <strong>Current rule contract:</strong> TrailNode stamp eligibility + booking/operator/guide/safety validation. No separate SpmStampRule table exists in this MVP lane.
              </div>

              <button
                type="button"
                onClick={saveStampRule}
                disabled={!isDirty || saveStatus === 'saving'}
                style={{
                  minHeight: 46,
                  border: 0,
                  borderRadius: 999,
                  background: isDirty ? OSP.gold : 'rgba(80,102,139,0.20)',
                  color: OSP.deepNavy,
                  padding: '0 20px',
                  fontSize: 13,
                  fontWeight: 950,
                  cursor: isDirty ? 'pointer' : 'not-allowed',
                }}
              >
                {saveStatus === 'saving' ? 'Saving...' : isDirty ? 'Save Stamp Rule & Verify' : 'No Changes'}
              </button>
            </div>
          </article>
        </>
      ) : null}
    </section>
  );
}
