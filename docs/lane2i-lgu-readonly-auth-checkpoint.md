# Lane 2-I — LGU Read-Only Auth Separation Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Inter-island tours are the primary compliance reason OSP exists.

Lane 2-I confirms LGU/DOT-style analytics access can read compliance state without gaining mutation authority.

## Existing Role Reality

Current UserRole includes:

- TRAVELER
- OPERATOR_OWNER
- OPERATOR_MANAGER
- OPERATOR_STAFF
- GUIDE
- ADMIN
- SILENT_LGU_ANALYTICS

There is no separate DOT role yet.

## CTO Decision

Use `SILENT_LGU_ANALYTICS` as read-only LGU/DOT analytics access for now.

Do not grant this role operational mutation rights.

## Read Access Granted

`SILENT_LGU_ANALYTICS` may read:

- GET /api/v1/osp-qr/checkpoints
- GET /api/v1/osp-qr/checkpoint/events
- GET /api/v1/osp-qr/compliance/exceptions
- GET /api/v1/osp-qr/vessels
- GET /api/v1/osp-qr/inter-island/movements
- GET /api/v1/osp-qr/inter-island/compliance-summary
- GET /api/v1/osp-qr/inter-island/overdue-movements
- GET /api/v1/osp-qr/inter-island/movements/:id/passenger-reconciliation
- GET /api/v1/osp-qr/inter-island/movements/:id/payment-clearance

## Mutation Access Remains Blocked

`SILENT_LGU_ANALYTICS` cannot:

- create inter-island movements
- perform departure scans
- perform arrival scans
- perform return scans
- resolve compliance exceptions
- perform checkpoint ingress/egress scans
- perform operator mutation actions

## Runtime Verified

Test user:

- email: lgu1@osp.local
- primaryRole: SILENT_LGU_ANALYTICS

Verified:

- LGU read compliance summary → ok: true
- LGU resolve exception → 403 Forbidden
- LGU create movement → 403 Forbidden

## Not Yet Done

Still pending before full DOT-LGU readiness:

- dedicated DOT/LGU role taxonomy
- LGU Console UI
- LGU/DOT user onboarding flow
- role-specific route namespace
- report/export authorization
- exception resolution policy for government users
- activity/audit ledger for LGU reads

## Hard Rule

LGU analytics access is read-only.

Do not give SILENT_LGU_ANALYTICS mutation authority unless a separate governance decision explicitly changes the role model.
