# Lane 2-D — Vessel Compliance Enforcement Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Inter-island tours are the primary compliance reason OSP exists.

Lane 2-D adds vessel compliance enforcement on top of the Lane 2-C inter-island compliance spine.

## Completed

### Seed

- Added repeatable seed script:
  - backend/scripts/seed-lane2d-vessel-compliance.js

Seeded vessel:

- id: osp-vessel-001
- operatorUserId: osp-operator-001
- vesselName: OSP Test Island Hopping Boat 01
- vesselRegistrationNumber: OSP-BOAT-001
- vesselType: ISLAND_HOPPING_BOAT
- capacity: 16
- complianceStatus: APPROVED

### Enforcement

Departure scan now requires:

- approved manifest
- matching operator
- active inter-island origin checkpoint
- active inter-island destination checkpoint
- approved vessel
- vessel operator must match movement operator

### Blocked Departure Behavior

If vessel is missing or not approved:

- departure scan returns HTTP 400
- ComplianceException is created
- exceptionType: UNREGISTERED_VESSEL
- severity: HIGH
- resolutionStatus: OPEN

### Verified

Approved vessel departure:

- movementStatus: DEPARTED
- qrEvent.eventType: INTER_ISLAND_DEPARTURE_SCAN
- qrEvent.vesselId: osp-vessel-001
- vessel.complianceStatus: APPROVED

No-vessel departure:

- HTTP 400
- exceptionType: UNREGISTERED_VESSEL
- complianceExceptionId returned

### Read APIs

- GET /api/v1/osp-qr/vessels
- GET /api/v1/osp-qr/inter-island/compliance-summary

Compliance summary now includes:

- approvedVessels
- pendingVessels
- nonApprovedVessels
- latestMovements with vesselId
- latestExceptions with UNREGISTERED_VESSEL and NO_MANIFEST

## Not Yet Done

Still pending before full DOT-LGU readiness:

- LGU Console / DOT-LGU Dashboard UI
- DOT-LGU role/auth separation
- passenger-level manifest reconciliation
- payment/booking clearance enforcement where applicable
- overdue departed movement detection
- exception resolution workflow
- operator/vessel compliance dashboard
- audit export/reporting
- production vessel onboarding and approval workflow

## Hard Rule

Do not wire LGU Console to loose or generic movement records.

LGU Console must read hardened compliance state from:

- inter_island_movements
- osp_qr_events
- compliance_exceptions
- osp_checkpoints
- osp_vessels
- approved manifests
