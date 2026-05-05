'use client';

import { useEffect, useState } from 'react';

export const ADMIN_SPM_TOKEN_STORAGE_KEY = 'osp_admin_token';
export const ADMIN_SPM_TOKEN_EVENT = 'osp-admin-token-updated';

const tokenKeys = [
  ADMIN_SPM_TOKEN_STORAGE_KEY,
  'osp_access_token',
  'accessToken',
  'access_token',
  'token',
  'authToken',
];

export function getAdminSpmBearerToken() {
  if (typeof window === 'undefined') return null;

  for (const key of tokenKeys) {
    const value = window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
    if (value && value.trim()) return value.trim();
  }

  return null;
}

export function setAdminSpmBearerToken(token: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_SPM_TOKEN_STORAGE_KEY, token.trim());
  window.dispatchEvent(new CustomEvent(ADMIN_SPM_TOKEN_EVENT));
}

export function clearAdminSpmBearerToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ADMIN_SPM_TOKEN_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(ADMIN_SPM_TOKEN_EVENT));
}

export default function AdminSpmAuthTokenBridge({ compact = false }: { compact?: boolean }) {
  const [token, setToken] = useState('');
  const [hasToken, setHasToken] = useState(false);
  const [message, setMessage] = useState('');

  function refreshState() {
    setHasToken(Boolean(getAdminSpmBearerToken()));
  }

  useEffect(() => {
    refreshState();

    function onUpdate() {
      refreshState();
    }

    window.addEventListener(ADMIN_SPM_TOKEN_EVENT, onUpdate);
    window.addEventListener('storage', onUpdate);

    return () => {
      window.removeEventListener(ADMIN_SPM_TOKEN_EVENT, onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, []);

  function saveToken() {
    const cleaned = token.trim().replace(/^Bearer\s+/i, '');

    if (!cleaned) {
      setMessage('Paste a valid admin bearer token first.');
      return;
    }

    setAdminSpmBearerToken(cleaned);
    setToken('');
    setMessage('Admin bearer token saved. Refresh or wait for panels to reload.');
  }

  function clearToken() {
    clearAdminSpmBearerToken();
    setMessage('Admin bearer token cleared.');
  }

  return (
    <section
      aria-label="Admin SPM bearer token bridge"
      style={{
        marginTop: compact ? 12 : 16,
        borderRadius: compact ? 18 : 22,
        border: '1px solid rgba(1,56,99,0.14)',
        background: hasToken
          ? 'rgba(5,150,165,0.10)'
          : 'linear-gradient(135deg, rgba(243,174,38,0.14), rgba(255,255,255,0.94))',
        padding: compact ? 12 : 14,
        color: '#013863',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div
            style={{
              color: hasToken ? '#0596A5' : '#A66D00',
              fontSize: 11,
              fontWeight: 950,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Protected Admin Access
          </div>
          <strong>{hasToken ? 'Admin bearer token is available' : 'Admin bearer token required'}</strong>
          <p style={{ margin: '5px 0 0', color: '#50668B', fontSize: 12.5, lineHeight: 1.45 }}>
            This does not bypass backend security. It only stores a valid admin token locally so the
            SPM Control Tower can call protected admin endpoints.
          </p>
        </div>

        <button
          type="button"
          onClick={clearToken}
          style={{
            border: 0,
            borderRadius: 999,
            background: hasToken ? '#013863' : 'rgba(1,56,99,0.14)',
            color: hasToken ? '#FFFFFF' : '#013863',
            padding: '9px 12px',
            fontSize: 11,
            fontWeight: 900,
            cursor: 'pointer',
          }}
        >
          Clear token
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: compact ? '1fr' : 'minmax(0, 1fr) 140px',
          gap: 10,
          marginTop: 12,
        }}
      >
        <input
          type="password"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Paste admin bearer token here"
          style={{
            minHeight: 42,
            borderRadius: 14,
            border: '1px solid rgba(1,56,99,0.16)',
            padding: '0 12px',
            color: '#013863',
            fontWeight: 750,
            background: '#FFFFFF',
          }}
        />

        <button
          type="button"
          onClick={saveToken}
          style={{
            minHeight: 42,
            border: 0,
            borderRadius: 999,
            background: '#F3AE26',
            color: '#013863',
            padding: '0 14px',
            fontSize: 12,
            fontWeight: 950,
            cursor: 'pointer',
          }}
        >
          Save token
        </button>
      </div>

      {message ? (
        <div style={{ marginTop: 9, color: '#013863', fontSize: 12.5, fontWeight: 800 }}>
          {message}
        </div>
      ) : null}
    </section>
  );
}
