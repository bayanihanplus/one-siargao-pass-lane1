'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminSpmAuthTokenBridge, {
  ADMIN_SPM_TOKEN_EVENT,
  getAdminSpmBearerToken,
} from './AdminSpmAuthTokenBridge';
import AdminSpmTrailNodesCreateForm from './AdminSpmTrailNodesCreateForm';

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

type TrailNode = {
  id: string;
  trailFamilyId?: string | null;
  trailTrackId?: string | null;
  code: string;
  name: string;
  description?: string | null;
  nodeType?: string | null;
  requirementType?: string | null;
  isOfficialNode?: boolean;
  isConditionalNode?: boolean;
  conditionNote?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  locationLabel?: string | null;
  municipality?: string | null;
  barangay?: string | null;
  publicAccessLevel?: string | null;
  stampEligible?: boolean;
  bookingRequired?: boolean;
  operatorRequired?: boolean;
  guideRequirement?: string | null;
  safetyControlled?: boolean;
  approvalStatus?: string | null;
};

type NodeDraft = {
  name: string;
  description: string;
  locationLabel: string;
  municipality: string;
  barangay: string;
  latitude: string;
  longitude: string;
  conditionNote: string;
  guideRequirement: string;
  stampEligible: boolean;
  bookingRequired: boolean;
  operatorRequired: boolean;
  safetyControlled: boolean;
  isOfficialNode: boolean;
  isConditionalNode: boolean;
  approvalStatus: string;
};

type RowStatus = {
  state: 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
  message?: string;
};

function valueToString(value: unknown) {
  if (value === null || value === undefined) return '';
  return String(value);
}

function cleanNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
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

function toDraft(node: TrailNode): NodeDraft {
  return {
    name: node.name ?? '',
    description: node.description ?? '',
    locationLabel: node.locationLabel ?? '',
    municipality: node.municipality ?? '',
    barangay: node.barangay ?? '',
    latitude: valueToString(node.latitude),
    longitude: valueToString(node.longitude),
    conditionNote: node.conditionNote ?? '',
    guideRequirement: node.guideRequirement ?? '',
    stampEligible: node.stampEligible === true,
    bookingRequired: node.bookingRequired === true,
    operatorRequired: node.operatorRequired === true,
    safetyControlled: node.safetyControlled === true,
    isOfficialNode: node.isOfficialNode === true,
    isConditionalNode: node.isConditionalNode === true,
    approvalStatus: node.approvalStatus ?? 'DRAFT',
  };
}

function normalizeDraft(draft: NodeDraft) {
  return {
    name: draft.name.trim(),
    description: draft.description.trim(),
    locationLabel: draft.locationLabel.trim(),
    municipality: draft.municipality.trim(),
    barangay: draft.barangay.trim(),
    latitude: cleanNumber(draft.latitude),
    longitude: cleanNumber(draft.longitude),
    conditionNote: draft.conditionNote.trim(),
    guideRequirement: draft.guideRequirement.trim(),
    stampEligible: draft.stampEligible,
    bookingRequired: draft.bookingRequired,
    operatorRequired: draft.operatorRequired,
    safetyControlled: draft.safetyControlled,
    isOfficialNode: draft.isOfficialNode,
    isConditionalNode: draft.isConditionalNode,
    approvalStatus: draft.approvalStatus,
  };
}

function normalizeNode(node: TrailNode) {
  return {
    name: (node.name ?? '').trim(),
    description: (node.description ?? '').trim(),
    locationLabel: (node.locationLabel ?? '').trim(),
    municipality: (node.municipality ?? '').trim(),
    barangay: (node.barangay ?? '').trim(),
    latitude:
      node.latitude === null || node.latitude === undefined || node.latitude === ''
        ? null
        : Number(node.latitude),
    longitude:
      node.longitude === null || node.longitude === undefined || node.longitude === ''
        ? null
        : Number(node.longitude),
    conditionNote: (node.conditionNote ?? '').trim(),
    guideRequirement: (node.guideRequirement ?? '').trim(),
    stampEligible: node.stampEligible === true,
    bookingRequired: node.bookingRequired === true,
    operatorRequired: node.operatorRequired === true,
    safetyControlled: node.safetyControlled === true,
    isOfficialNode: node.isOfficialNode === true,
    isConditionalNode: node.isConditionalNode === true,
    approvalStatus: node.approvalStatus ?? 'DRAFT',
  };
}

function isDirty(node: TrailNode, draft: NodeDraft | undefined) {
  if (!draft) return false;
  return JSON.stringify(normalizeDraft(draft)) !== JSON.stringify(normalizeNode(node));
}

function rowStatusStyle(status: RowStatus['state']) {
  if (status === 'saved') return { background: 'rgba(5,150,165,0.14)', color: OSP.deepNavy };
  if (status === 'error') return { background: 'rgba(205,70,70,0.12)', color: '#8A1D1D' };
  if (status === 'saving') return { background: 'rgba(80,102,139,0.14)', color: OSP.deepNavy };
  if (status === 'dirty') return { background: 'rgba(243,174,38,0.22)', color: OSP.deepNavy };
  return { background: 'rgba(80,102,139,0.10)', color: OSP.slate };
}

export default function AdminSpmTrailNodesEditor() {
  const [families, setFamilies] = useState<TrailFamily[]>([]);
  const [nodes, setNodes] = useState<TrailNode[]>([]);
  const [drafts, setDrafts] = useState<Record<string, NodeDraft>>({});
  const [rowStatuses, setRowStatuses] = useState<Record<string, RowStatus>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'unauthorized' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [lastLoadedAt, setLastLoadedAt] = useState('');
  const [selectedFamilyId, setSelectedFamilyId] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const approvedCount = useMemo(
    () => nodes.filter((node) => node.approvalStatus === 'APPROVED').length,
    [nodes],
  );

  const dirtyCount = useMemo(
    () => nodes.filter((node) => isDirty(node, drafts[node.id])).length,
    [nodes, drafts],
  );

  const familyScopedNodes = useMemo(() => {
    if (!selectedFamilyId) return [];
    return nodes.filter((node) => node.trailFamilyId === selectedFamilyId);
  }, [nodes, selectedFamilyId]);

  const unassignedNodes = useMemo(
    () => nodes.filter((node) => !node.trailFamilyId),
    [nodes],
  );

  const selectedNode = useMemo(() => {
    if (selectedNodeId) {
      return familyScopedNodes.find((node) => node.id === selectedNodeId) || null;
    }
    return familyScopedNodes[0] || null;
  }, [familyScopedNodes, selectedNodeId]);

  const selectedFamily = useMemo(
    () => families.find((family) => family.id === selectedFamilyId) || null,
    [families, selectedFamilyId],
  );

  async function loadNodesAndFamilies() {
    setStatus('loading');
    setMessage('');

    const token = getAdminSpmBearerToken();

    try {
      const [familiesResponse, nodesResponse] = await Promise.all([
        fetch(`${API_BASE}/api/admin/spm/trail-families`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: 'no-store',
        }),
        fetch(`${API_BASE}/api/admin/spm/nodes`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: 'no-store',
        }),
      ]);

      const familiesPayload = await familiesResponse.json().catch(() => null);
      const nodesPayload = await nodesResponse.json().catch(() => null);

      if (familiesResponse.status === 401 || nodesResponse.status === 401 || familiesResponse.status === 403 || nodesResponse.status === 403) {
        setStatus('unauthorized');
        setMessage('Admin login cookie or bearer token is required to edit SPM trail nodes.');
        return;
      }

      if (!familiesResponse.ok) {
        setStatus('error');
        setMessage(familiesPayload?.message || `Failed to load trail families. HTTP ${familiesResponse.status}`);
        return;
      }

      if (!nodesResponse.ok) {
        setStatus('error');
        setMessage(nodesPayload?.message || `Failed to load trail nodes. HTTP ${nodesResponse.status}`);
        return;
      }

      const familyItems = Array.isArray(familiesPayload) ? familiesPayload : [];
      const nodeItems = Array.isArray(nodesPayload) ? nodesPayload : [];

      setFamilies(familyItems);
      setNodes(nodeItems);

      const nextFamilyId = selectedFamilyId || familyItems[0]?.id || '';
      const scopedNodes = nodeItems.filter((node) => node.trailFamilyId === nextFamilyId);
      const nextNodeId = scopedNodes.some((node) => node.id === selectedNodeId)
        ? selectedNodeId
        : scopedNodes[0]?.id || '';

      setSelectedFamilyId(nextFamilyId);
      setSelectedNodeId(nextNodeId);

      const nextDrafts: Record<string, NodeDraft> = {};
      const nextStatuses: Record<string, RowStatus> = {};

      for (const node of nodeItems) {
        nextDrafts[node.id] = toDraft(node);
        nextStatuses[node.id] = { state: 'idle', message: 'Loaded from DB.' };
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
    loadNodesAndFamilies();

    function reloadOnTokenUpdate() {
      loadNodesAndFamilies();
    }

    window.addEventListener(ADMIN_SPM_TOKEN_EVENT, reloadOnTokenUpdate);

    return () => {
      window.removeEventListener(ADMIN_SPM_TOKEN_EVENT, reloadOnTokenUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFamilyChange(familyId: string) {
    const scopedNodes = nodes.filter((node) => node.trailFamilyId === familyId);
    setSelectedFamilyId(familyId);
    setSelectedNodeId(scopedNodes[0]?.id || '');
  }

  function updateDraft(nodeId: string, node: TrailNode, patch: Partial<NodeDraft>) {
    setDrafts((current) => {
      const nextDraft = {
        ...current[nodeId],
        ...patch,
      };

      const nextDrafts = {
        ...current,
        [nodeId]: nextDraft,
      };

      const changed = isDirty(node, nextDraft);

      setRowStatuses((statuses) => ({
        ...statuses,
        [nodeId]: changed
          ? { state: 'dirty', message: 'Unsaved node changes.' }
          : { state: 'idle', message: 'No pending changes.' },
      }));

      return nextDrafts;
    });
  }

  async function saveNode(node: TrailNode) {
    const draft = drafts[node.id];
    if (!draft) return;

    if (!isDirty(node, draft)) {
      setRowStatuses((current) => ({
        ...current,
        [node.id]: { state: 'idle', message: 'No changes to save.' },
      }));
      return;
    }

    const token = getAdminSpmBearerToken();

    setRowStatuses((current) => ({
      ...current,
      [node.id]: { state: 'saving', message: 'Saving node to DB...' },
    }));

    try {
      const response = await fetch(`${API_BASE}/api/admin/spm/nodes/${node.id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...normalizeDraft(draft),
          reason: 'ADMIN_CT_SPM_09C3E_FAMILY_SCOPED_NODE_EDIT',
        }),
      });

      const payload = await response.json().catch(() => null);

      if (response.status === 401 || response.status === 403) {
        setStatus('unauthorized');
        setRowStatuses((current) => ({
          ...current,
          [node.id]: {
            state: 'error',
            message: payload?.message || 'Admin authorization is required.',
          },
        }));
        return;
      }

      if (!response.ok) {
        setRowStatuses((current) => ({
          ...current,
          [node.id]: {
            state: 'error',
            message: payload?.message || `Save failed. HTTP ${response.status}`,
          },
        }));
        return;
      }

      const updated = payload as TrailNode;

      setNodes((current) =>
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
        loadNodesAndFamilies();
      }, 500);
    } catch (error) {
      setRowStatuses((current) => ({
        ...current,
        [node.id]: {
          state: 'error',
          message: error instanceof Error ? error.message : 'Save request failed.',
        },
      }));
    }
  }

  return (
    <section
      aria-label="SPM Trail Nodes Editor"
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
            ADMIN-CT-SPM-09C-3E / Family-scoped node workspace
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
            Trail Nodes / Stops editor
          </h2>

          <p
            style={{
              margin: '10px 0 0',
              color: OSP.slate,
              maxWidth: 900,
              lineHeight: 1.6,
              fontSize: 14,
            }}
          >
            Select a trail family first, then edit only the nodes under that family. This prevents
            mixed 37-node editing and keeps the SPM map inventory aligned to product taxonomy.
          </p>
        </div>

        <button
          type="button"
          onClick={loadNodesAndFamilies}
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
          Refresh nodes
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          marginTop: 16,
          color: OSP.deepNavy,
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        <span style={{ borderRadius: 999, background: 'rgba(5,150,165,0.14)', padding: '8px 11px' }}>
          {nodes.length} nodes loaded
        </span>
        <span style={{ borderRadius: 999, background: 'rgba(243,174,38,0.22)', padding: '8px 11px' }}>
          {approvedCount} approved
        </span>
        <span style={{ borderRadius: 999, background: dirtyCount ? 'rgba(243,174,38,0.24)' : 'rgba(80,102,139,0.10)', padding: '8px 11px' }}>
          {dirtyCount} unsaved
        </span>
        <span style={{ borderRadius: 999, background: 'rgba(80,102,139,0.10)', padding: '8px 11px' }}>
          {familyScopedNodes.length} in selected family
        </span>
        {unassignedNodes.length > 0 ? (
          <span style={{ borderRadius: 999, background: 'rgba(205,70,70,0.12)', padding: '8px 11px' }}>
            {unassignedNodes.length} unassigned
          </span>
        ) : null}
        {lastLoadedAt ? (
          <span style={{ borderRadius: 999, background: 'rgba(80,102,139,0.10)', padding: '8px 11px' }}>
            loaded {lastLoadedAt}
          </span>
        ) : null}
      </div>

      {status === 'unauthorized' ? <AdminSpmAuthTokenBridge compact /> : null}

      {status === 'loading' ? (
        <div style={{ marginTop: 18, color: OSP.slate }}>Loading trail nodes...</div>
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
          <strong>{status === 'unauthorized' ? 'Admin authorization required.' : 'Trail node editor needs check.'}</strong>
          <div>{message}</div>
        </div>
      ) : null}

      {status === 'ready' && families.length > 0 ? (
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
          <p
            style={{
              margin: '0 0 6px',
              color: OSP.teal,
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            Node workspace selector
          </p>

          <h3
            style={{
              margin: 0,
              color: OSP.deepNavy,
              fontSize: 22,
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            Select Trail Family, then Node / Stop
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              gap: 12,
              marginTop: 14,
            }}
          >
            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>
                Trail Family
              </span>
              <select
                value={selectedFamilyId}
                onChange={(event) => handleFamilyChange(event.target.value)}
                style={{
                  minHeight: 50,
                  borderRadius: 16,
                  border: '1px solid rgba(1,56,99,0.16)',
                  background: OSP.white,
                  color: OSP.deepNavy,
                  padding: '0 14px',
                  fontWeight: 900,
                }}
              >
                {families.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.publicLabel || family.name} · {family.code}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: 'grid', gap: 8 }}>
              <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>
                Node / Stop in selected family
              </span>
              <select
                value={selectedNode?.id || ''}
                onChange={(event) => setSelectedNodeId(event.target.value)}
                disabled={familyScopedNodes.length === 0}
                style={{
                  minHeight: 50,
                  borderRadius: 16,
                  border: '1px solid rgba(1,56,99,0.16)',
                  background: OSP.white,
                  color: OSP.deepNavy,
                  padding: '0 14px',
                  fontWeight: 900,
                }}
              >
                {familyScopedNodes.length === 0 ? (
                  <option value="">No nodes under selected family</option>
                ) : null}
                {familyScopedNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.code} · {node.name} · {node.approvalStatus || 'DRAFT'}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: 12,
            }}
          >
            <p style={{ margin: 0, color: OSP.slate, fontSize: 12, fontWeight: 800 }}>
              {selectedFamily
                ? `${familyScopedNodes.length} nodes are available under ${selectedFamily.publicLabel || selectedFamily.name}.`
                : 'Select a family to edit its nodes.'}
            </p>

            <button
              type="button"
              onClick={() => {
                setShowCreateForm((current) => {
                  const next = !current;
                  if (!current) {
                    window.setTimeout(() => {
                      document
                        .getElementById('admin-spm-create-node-form')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 80);
                  }
                  return next;
                });
              }}
              style={{
                minHeight: 40,
                border: 0,
                borderRadius: 999,
                background: showCreateForm ? OSP.deepNavy : OSP.gold,
                color: showCreateForm ? OSP.white : OSP.deepNavy,
                padding: '0 16px',
                fontSize: 12,
                fontWeight: 950,
                cursor: 'pointer',
                boxShadow: '0 12px 26px rgba(243,174,38,0.22)',
              }}
            >
              {showCreateForm ? 'Hide Create Form' : '+ Add Node / Stop'}
            </button>
          </div>
        </div>
      ) : null}

      {status === 'ready' && selectedNode ? (() => {
        const node = selectedNode;
        const draft = drafts[node.id] || toDraft(node);
        const dirty = isDirty(node, draft);
        const rowStatus = rowStatuses[node.id] ?? { state: dirty ? 'dirty' : 'idle' };
        const style = rowStatusStyle(rowStatus.state);

        return (
          <article
            key={node.id}
            style={{
              marginTop: 14,
              borderRadius: 24,
              border: dirty ? '1px solid rgba(243,174,38,0.55)' : '1px solid rgba(1,56,99,0.10)',
              background: OSP.white,
              padding: 16,
              boxShadow: dirty
                ? '0 16px 36px rgba(243,174,38,0.16)'
                : '0 14px 34px rgba(1,56,99,0.06)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 190px',
                gap: 14,
              }}
            >
              <div>
                <div
                  style={{
                    color: OSP.teal,
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {node.code} · {node.nodeType || 'NODE'}
                </div>
                <h3
                  style={{
                    margin: '5px 0 0',
                    color: OSP.deepNavy,
                    fontSize: 19,
                    letterSpacing: '-0.04em',
                  }}
                >
                  {node.name}
                </h3>
              </div>

              <div style={{ display: 'grid', gap: 8, justifyItems: 'end' }}>
                <span
                  style={{
                    borderRadius: 999,
                    background: style.background,
                    color: style.color,
                    padding: '7px 10px',
                    fontSize: 11,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {rowStatus.state}
                </span>

                <select
                  value={draft.approvalStatus}
                  onChange={(event) =>
                    updateDraft(node.id, node, { approvalStatus: event.target.value })
                  }
                  style={{
                    minHeight: 38,
                    borderRadius: 999,
                    border: '1px solid rgba(1,56,99,0.16)',
                    padding: '0 10px',
                    color: OSP.deepNavy,
                    fontWeight: 850,
                    background: OSP.white,
                  }}
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: 12,
                marginTop: 14,
              }}
            >
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Stop / node name</span>
                <input
                  value={draft.name}
                  onChange={(event) => updateDraft(node.id, node, { name: event.target.value })}
                  style={inputStyle()}
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Location label</span>
                <input
                  value={draft.locationLabel}
                  onChange={(event) => updateDraft(node.id, node, { locationLabel: event.target.value })}
                  style={inputStyle()}
                />
              </label>
            </div>

            <label style={{ display: 'grid', gap: 6, marginTop: 12 }}>
              <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Traveler-facing stop description</span>
              <textarea
                value={draft.description}
                onChange={(event) => updateDraft(node.id, node, { description: event.target.value })}
                rows={3}
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 12,
                marginTop: 12,
              }}
            >
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Municipality</span>
                <input value={draft.municipality} onChange={(event) => updateDraft(node.id, node, { municipality: event.target.value })} style={inputStyle()} />
              </label>
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Barangay</span>
                <input value={draft.barangay} onChange={(event) => updateDraft(node.id, node, { barangay: event.target.value })} style={inputStyle()} />
              </label>
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Latitude</span>
                <input value={draft.latitude} onChange={(event) => updateDraft(node.id, node, { latitude: event.target.value })} style={inputStyle()} />
              </label>
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Longitude</span>
                <input value={draft.longitude} onChange={(event) => updateDraft(node.id, node, { longitude: event.target.value })} style={inputStyle()} />
              </label>
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
                    checked={Boolean(draft[field as keyof NodeDraft])}
                    onChange={(event) =>
                      updateDraft(node.id, node, {
                        [field]: event.target.checked,
                      } as Partial<NodeDraft>)
                    }
                  />
                  {label}
                </label>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: 12,
                marginTop: 12,
              }}
            >
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Guide requirement</span>
                <input value={draft.guideRequirement} onChange={(event) => updateDraft(node.id, node, { guideRequirement: event.target.value })} style={inputStyle()} />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ color: OSP.slate, fontSize: 12, fontWeight: 850 }}>Condition note</span>
                <input value={draft.conditionNote} onChange={(event) => updateDraft(node.id, node, { conditionNote: event.target.value })} style={inputStyle()} />
              </label>
            </div>

            {rowStatus.message ? (
              <div
                style={{
                  marginTop: 12,
                  borderRadius: 16,
                  background: style.background,
                  color: style.color,
                  padding: 11,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {rowStatus.message}
              </div>
            ) : null}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                alignItems: 'center',
                marginTop: 14,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ color: OSP.slate, fontSize: 12 }}>
                Editing is scoped to the selected trail family. Create-new-node appears below as a secondary action.
              </div>

              <button
                type="button"
                onClick={() => saveNode(node)}
                disabled={!dirty || rowStatus.state === 'saving'}
                style={{
                  minHeight: 42,
                  border: 0,
                  borderRadius: 999,
                  background: !dirty
                    ? 'rgba(80,102,139,0.18)'
                    : rowStatus.state === 'saving'
                      ? OSP.slate
                      : OSP.gold,
                  color: !dirty ? OSP.slate : OSP.deepNavy,
                  padding: '0 16px',
                  fontSize: 12,
                  fontWeight: 950,
                  cursor: !dirty ? 'not-allowed' : rowStatus.state === 'saving' ? 'wait' : 'pointer',
                  boxShadow: dirty ? '0 12px 26px rgba(243,174,38,0.24)' : 'none',
                }}
              >
                {rowStatus.state === 'saving' ? 'Saving...' : dirty ? 'Save Node & Verify' : 'No Changes'}
              </button>
            </div>
          </article>
        );
      })() : null}

      {showCreateForm ? (
        <AdminSpmTrailNodesCreateForm
          defaultTrailFamilyId={selectedFamilyId}
          onCancel={() => setShowCreateForm(false)}
          onCreated={() => {
            loadNodesAndFamilies();
            setShowCreateForm(false);
          }}
        />
      ) : null}
    </section>
  );
}
