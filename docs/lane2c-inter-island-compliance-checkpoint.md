# Lane 2-C — Inter-Island Tour Compliance Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Inter-island tours are the primary compliance reason OSP exists.

This lane establishes the backend compliance spine for DOT-LGU visibility, but the LGU Console / DOT-LGU Dashboard UI is not yet built.

## Completed Backend Spine

### Core Tables

- osp_qr_events
- osp_checkpoints
- inter_island_movements
- compliance_exceptions
- osp_vessels

### Completed APIs

- GET /api/v1/osp-qr/checkpoints
- GET /api/v1/osp-qr/checkpoint/events
- GET /api/v1/osp-qr/compliance/exceptions
- GET /api/v1/osp-qr/inter-island/movements
- POST /api/v1/osp-qr/inter-island/movements
- POST /api/v1/osp-qr/inter-island/movements/:id/departure-scan
- POST /api/v1/osp-qr/inter-island/movements/:id/arrival-scan
- POST /api/v1/osp-qr/inter-island/movements/:id/return-scan
- GET /api/v1/osp-qr/inter-island/compliance-summary

## Verified Lifecycle

Movement lifecycle:

- PLANNED
- DEPARTED
- ARRIVED
- COMPLETED

Verified QR event writes:

- INTER_ISLAND_DEPARTURE_SCAN
- INTER_ISLAND_ARRIVAL_SCAN
- return scan recorded as INTER_ISLAND_ARRIVAL_SCAN back to origin checkpoint with return channel

## Compliance Gate

Departure scan now requires:

- operatorUserId
- manifestId
- manifestStatus = APPROVED
- active origin checkpoint supporting inter-island movement
- active destination checkpoint supporting inter-island movement
- manifest operator must match movement operator

## Exception Logic

Blocked inter-island departure now creates:

- ComplianceException
- exceptionType: NO_MANIFEST / WRONG_OPERATOR / DOT_LGU_REVIEW_REQUIRED / UNAPPROVED_OPERATOR
- severity: HIGH
- resolutionStatus: OPEN

Verified blocked loose movement:

- HTTP 400
- complianceExceptionId returned
- NO_MANIFEST exception created

## Runtime Verified Summary

GET /api/v1/osp-qr/inter-island/compliance-summary returns:

- totalMovements
- plannedMovements
- departedMovements
- arrivedMovements
- completedMovements
- blockedMovements
- openComplianceExceptions
- noManifestExceptions
- latestMovements
- latestExceptions

## Not Yet Done

Do not claim DOT-LGU Dashboard is wired yet.

Still pending before full DOT-LGU readiness:

- LGU Console / DOT-LGU Dashboard UI
- DOT-LGU role/auth separation
- vessel-required enforcement where applicable
- passenger-level manifest reconciliation
- payment/booking clearance enforcement where applicable
- overdue departed movement detection
- exception resolution workflow
- operator/vessel compliance dashboard
- audit export/reporting

## Hard Rule

Do not build generic dashboards. LGU Console must read from this compliance spine and show operational compliance, exceptions, live movement state, and audit trails.
