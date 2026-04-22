const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const API_BASE = process.env.API_BASE || 'http://localhost:8001/api/v1';
const OPERATOR_EMAIL = process.env.OPERATOR_EMAIL || 'operator1@osp.local';
const OPERATOR_PASSWORD = process.env.OPERATOR_PASSWORD || 'Password123!';
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

function assertStatus(actual, expected, label, json) {
  if (actual !== expected) {
    throw new Error(`${label} failed: expected HTTP ${expected}, got ${actual} :: ${JSON.stringify(json)}`);
  }
  console.log(`PASS: ${label} -> HTTP ${actual}`);
}

function assert(condition, label, detail) {
  if (!condition) {
    throw new Error(`${label} failed${detail ? ` :: ${detail}` : ''}`);
  }
  console.log(`PASS: ${label}`);
}

async function getToken(email, password, label) {
  const { res, json } = await jsonFetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok || !json?.accessToken) {
    throw new Error(`${label} login failed: HTTP ${res.status} :: ${JSON.stringify(json)}`);
  }

  return json.accessToken;
}

function uniqueSuffix() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function main() {
  const operatorToken = await getToken(OPERATOR_EMAIL, OPERATOR_PASSWORD, 'operator');
  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD, 'admin');
  const suffix = uniqueSuffix();

  const templateTitle = `Smoke Template ${suffix}`;

  const createTemplate = await jsonFetch(`${API_BASE}/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${operatorToken}`,
    },
    body: JSON.stringify({
      title: templateTitle,
      description: 'activities smoke test',
      meetingPointText: 'General Luna',
      requiresManifest: true,
      requiresGuide: false,
    }),
  });
  assertStatus(createTemplate.res.status, 201, 'create activity template', createTemplate.json);

  const templateId = createTemplate.json?.id;
  assert(!!templateId, 'template id returned', JSON.stringify(createTemplate.json));

  const operatorTemplates = await jsonFetch(`${API_BASE}/activities/templates`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${operatorToken}`,
    },
  });
  assertStatus(operatorTemplates.res.status, 200, 'operator template list', operatorTemplates.json);
  assert(
    Array.isArray(operatorTemplates.json) &&
      operatorTemplates.json.some((row) => row.id === templateId),
    'created template visible in operator template list'
  );

  const adminTemplates = await jsonFetch(`${API_BASE}/activities/templates`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  });
  assertStatus(adminTemplates.res.status, 200, 'admin template list', adminTemplates.json);
  assert(
    Array.isArray(adminTemplates.json) &&
      adminTemplates.json.some((row) => row.id === templateId),
    'created template visible in admin template list'
  );

  const scheduledDate = '2026-05-03';

  const createInstance1 = await jsonFetch(`${API_BASE}/activities/instances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${operatorToken}`,
    },
    body: JSON.stringify({
      activityTemplateId: templateId,
      scheduledDate,
      capacity: 9,
    }),
  });
  assertStatus(createInstance1.res.status, 201, 'create activity instance', createInstance1.json);

  const instanceId1 = createInstance1.json?.id;
  assert(!!instanceId1, 'instance id returned', JSON.stringify(createInstance1.json));

  const createInstance2 = await jsonFetch(`${API_BASE}/activities/instances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${operatorToken}`,
    },
    body: JSON.stringify({
      activityTemplateId: templateId,
      scheduledDate,
      capacity: 9,
    }),
  });
  assertStatus(createInstance2.res.status, 201, 'duplicate instance create reused', createInstance2.json);

  const instanceId2 = createInstance2.json?.id;
  assert(
    instanceId1 === instanceId2,
    'duplicate create returns same instance id',
    `${instanceId1} != ${instanceId2}`
  );

  const mismatchInstance = await jsonFetch(`${API_BASE}/activities/instances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${operatorToken}`,
    },
    body: JSON.stringify({
      activityTemplateId: templateId,
      scheduledDate,
      capacity: 99,
    }),
  });
  assertStatus(mismatchInstance.res.status, 400, 'capacity mismatch rejected', mismatchInstance.json);

  const operatorInstances = await jsonFetch(`${API_BASE}/activities/instances`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${operatorToken}`,
    },
  });
  assertStatus(operatorInstances.res.status, 200, 'operator instance list', operatorInstances.json);
  assert(
    Array.isArray(operatorInstances.json) &&
      operatorInstances.json.some((row) => row.id === instanceId1),
    'created instance visible in operator instance list'
  );

  const adminInstances = await jsonFetch(`${API_BASE}/activities/instances`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  });
  assertStatus(adminInstances.res.status, 200, 'admin instance list', adminInstances.json);
  assert(
    Array.isArray(adminInstances.json) &&
      adminInstances.json.some((row) => row.id === instanceId1),
    'created instance visible in admin instance list'
  );

  const storedInstance = await prisma.activityInstance.findUnique({
    where: { id: instanceId1 },
    select: {
      id: true,
      activityTemplateId: true,
      scheduledDate: true,
      capacity: true,
      instanceStatus: true,
    },
  });

  assert(!!storedInstance, 'stored instance exists in database');
  assert(storedInstance.activityTemplateId === templateId, 'stored instance points to created template');
  assert(storedInstance.capacity === 9, 'stored instance capacity locked at original value');
  assert(storedInstance.instanceStatus === 'scheduled', 'stored instance remains scheduled');

  console.log('\nALL ACTIVITIES WORKFLOW SMOKE CHECKS PASSED');
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
