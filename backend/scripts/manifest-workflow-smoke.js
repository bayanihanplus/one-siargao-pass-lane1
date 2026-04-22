const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const API_BASE = process.env.API_BASE || 'http://localhost:8001/api/v1';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin1@osp.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Password123!';

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  return { res, json, text };
}

async function getAdminToken() {
  const { res, json } = await jsonFetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!res.ok || !json?.accessToken) {
    throw new Error(`Admin login failed: HTTP ${res.status} :: ${JSON.stringify(json)}`);
  }

  return json.accessToken;
}

async function getLatestActivityInstanceId() {
  const row = await prisma.activityInstance.findFirst({
    where: { bookingItems: { some: {} } },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  if (!row) {
    throw new Error('No activity instance with bookingItems found');
  }

  return row.id;
}

async function getLatestApprovalRequestId(manifestId) {
  const row = await prisma.manifestApprovalRequest.findFirst({
    where: { manifestId },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  if (!row) {
    throw new Error(`No manifestApprovalRequest found for manifest ${manifestId}`);
  }

  return row.id;
}

function assertStatus(actual, expected, label, json) {
  if (actual !== expected) {
    throw new Error(`${label} failed: expected HTTP ${expected}, got ${actual} :: ${JSON.stringify(json)}`);
  }
  console.log(`PASS: ${label} -> HTTP ${actual}`);
}

async function main() {
  const token = await getAdminToken();
  const activityInstanceId = await getLatestActivityInstanceId();

  console.log(`Using activityInstanceId=${activityInstanceId}`);

  const generate1 = await jsonFetch(`${API_BASE}/manifests/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ activityInstanceId }),
  });
  assertStatus(generate1.res.status, 201, 'generate manifest for duplicate-submit case', generate1.json);

  const manifestId1 = generate1.json?.id;
  if (!manifestId1) throw new Error('Missing manifestId1');

  const submit1a = await jsonFetch(`${API_BASE}/manifests/${manifestId1}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  assertStatus(submit1a.res.status, 201, 'first submit', submit1a.json);

  const submit1b = await jsonFetch(`${API_BASE}/manifests/${manifestId1}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  assertStatus(submit1b.res.status, 400, 'duplicate submit rejected', submit1b.json);

  const generate2 = await jsonFetch(`${API_BASE}/manifests/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ activityInstanceId }),
  });
  assertStatus(generate2.res.status, 201, 'generate manifest for transition case', generate2.json);

  const manifestId2 = generate2.json?.id;
  if (!manifestId2) throw new Error('Missing manifestId2');

  const submit2 = await jsonFetch(`${API_BASE}/manifests/${manifestId2}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notes: 'smoke submit' }),
  });
  assertStatus(submit2.res.status, 201, 'submit for transition case', submit2.json);

  const requestId2 = await getLatestApprovalRequestId(manifestId2);
  console.log(`Using requestId=${requestId2}`);

  const approve1 = await jsonFetch(`${API_BASE}/manifest-approvals/${requestId2}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notes: 'approve once' }),
  });
  assertStatus(approve1.res.status, 201, 'first approve', approve1.json);

  const approve2 = await jsonFetch(`${API_BASE}/manifest-approvals/${requestId2}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notes: 'approve twice' }),
  });
  assertStatus(approve2.res.status, 400, 're-approve rejected', approve2.json);

  const denyAfterApprove = await jsonFetch(`${API_BASE}/manifest-approvals/${requestId2}/deny`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ notes: 'deny after approve' }),
  });
  assertStatus(denyAfterApprove.res.status, 400, 'deny after approve rejected', denyAfterApprove.json);

  console.log('\nALL MANIFEST WORKFLOW SMOKE CHECKS PASSED');
}

main()
  .catch((err) => {
    console.error('\nSMOKE FAILED');
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
