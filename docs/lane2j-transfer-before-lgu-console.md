# Lane 2-J — Transfer Checkpoint Before LGU Console UI

## Current Branch

- fix/operator-staff-membership-layer

## Locked Context

Inter-island tours are the primary compliance reason OSP exists.

The backend compliance spine is now substantially built. LGU Console / DOT-LGU Dashboard UI must not be built as a generic dashboard. It must read from the hardened compliance spine created in Lanes 2-C through 2-I.

## Latest Commit Stack

- c3f21f6 document lane 2i lgu readonly auth checkpoint
- 414d3af allow lgu analytics read only compliance access
- 94ffa18 document lane 2h exception resolution checkpoint
- 3eb3b06 add compliance exception resolution workflow
- 7d55d8e document lane 2g payment clearance checkpoint
- 1b4614c add payment clearance counts to compliance summary
- f6a84ac add inter island payment clearance endpoint
- e317402 document lane 2f overdue movement checkpoint
- bc3ccf0 add overdue movement count to compliance summary
- f38dec9 add overdue inter island movements endpoint
- 5048dcc document lane 2e passenger reconciliation checkpoint
- 498caa7 add passenger reconciliation counts to compliance summary
- d498a92 add inter island passenger reconciliation endpoint
- d97f3c1 document lane 2d vessel compliance checkpoint
- 230c7a8 add vessel counts to inter island compliance summary
- 3d96b95 add read only vessel compliance endpoint
- f302c68 enforce approved vessel for inter island departures
- 4033f90 seed lane 2d approved vessel
- 2969a36 document lane 2c inter island compliance checkpoint
- 3412d0e add inter island compliance summary endpoint
- d7ab797 add read only compliance exceptions endpoint
- 0210477 create compliance exceptions for blocked inter island departures
- f56177a harden inter island departure compliance gate
- 357f223 add inter island return scan
- d7c390c add inter island arrival scan
- 9cd265e add inter island departure scan

## Completed Compliance Spine

### Core Backend Tables In Use

- inter_island_movements
- osp_qr_events
- compliance_exceptions
- osp_checkpoints
- osp_vessels
- manifests
- manifest_members
- bookings / payment state

### Movement Lifecycle

Supported states currently used:

- PLANNED
- DEPARTED
- ARRIVED
- COMPLETED

### QR / Compliance Event Trail

Implemented event paths include:

- inter-island departure scan
- inter-island arrival scan
- inter-island return scan
- checkpoint ingress scan
- checkpoint egress scan
- operator access scan

New compliance scan writes go to:

- OspQrEvent / osp_qr_events

Legacy table:

- QrEvent is frozen as historical only.

## Completed Read APIs

Admin and LGU-read-only where applicable:

- GET /api/v1/osp-qr/checkpoints
- GET /api/v1/osp-qr/checkpoint/events
- GET /api/v1/osp-qr/compliance/exceptions
- GET /api/v1/osp-qr/vessels
- GET /api/v1/osp-qr/inter-island/movements
- GET /api/v1/osp-qr/inter-island/compliance-summary
- GET /api/v1/osp-qr/inter-island/overdue-movements
- GET /api/v1/osp-qr/inter-island/movements/:id/passenger-reconciliation
- GET /api/v1/osp-qr/inter-island/movements/:id/payment-clearance

## Completed Mutation APIs

Admin-only:

- POST /api/v1/osp-qr/inter-island/movements
- POST /api/v1/osp-qr/inter-island/movements/:id/departure-scan
- POST /api/v1/osp-qr/inter-island/movements/:id/arrival-scan
- POST /api/v1/osp-qr/inter-island/movements/:id/return-scan
- PATCH /api/v1/osp-qr/compliance/exceptions/:id/resolve

Operator-only where applicable:

- operator access summary/recent/detail/status/scan routes remain operator-role protected.

## Compliance Gates Implemented

Inter-island departure scan now requires:

- operatorUserId
- approved manifest
- manifest operator must match movement operator
- active origin checkpoint supporting inter-island
- active destination checkpoint supporting inter-island
- approved vessel
- vessel operator must match movement operator

Blocked departure creates a ComplianceException.

Known exception types used:

- NO_MANIFEST
- WRONG_OPERATOR
- DOT_LGU_REVIEW_REQUIRED
- UNAPPROVED_OPERATOR
- UNREGISTERED_VESSEL

## Vessel Compliance

Seeded approved vessel:

- id: osp-vessel-001
- operatorUserId: osp-operator-001
- vesselName: OSP Test Island Hopping Boat 01
- vesselRegistrationNumber: OSP-BOAT-001
- vesselType: ISLAND_HOPPING_BOAT
- capacity: 16
- complianceStatus: APPROVED

Departure blocks if vessel is missing or not approved.

## Passenger Reconciliation

Implemented read-only endpoint:

- GET /api/v1/osp-qr/inter-island/movements/:id/passenger-reconciliation

Current behavior:

- compares manifest totalMembers against listed members
- checks departure/arrival/return event existence
- returns reconciliationStatus
- returns issues[]

Known current local data condition:

- some movements are linked to approved manifest with totalMembers > 0 but members.length = 0
- system correctly flags NEEDS_REVIEW

## Payment Clearance

Implemented read-only endpoint:

- GET /api/v1/osp-qr/inter-island/movements/:id/payment-clearance

Current decision:

- do not enforce payment clearance from InterIslandMovement.bookingId yet
- compute clearance through ManifestMember.bookingId → Booking.paymentState.state

Current local summary:

- paymentClearMovementCount: 0
- paymentNeedsReviewMovementCount: 5

## Overdue Movement Detection

Implemented read-only endpoint:

- GET /api/v1/osp-qr/inter-island/overdue-movements?thresholdMinutes=5

Current local summary:

- overdueDepartedMovements: 4

This is read-only detection only. No auto-alerts yet.

## Exception Resolution

Implemented:

- PATCH /api/v1/osp-qr/compliance/exceptions/:id/resolve

Admin-only.

Runtime verified:

- resolvedByUserId is stored
- resolvedAt is populated
- resolution notes are appended
- openComplianceExceptions decreases
- noManifestExceptions decreases when resolving NO_MANIFEST

## LGU Read-Only Auth

Existing role:

- SILENT_LGU_ANALYTICS

Runtime verified:

- LGU analytics user can read compliance summary
- LGU analytics user cannot resolve exceptions
- LGU analytics user cannot create movements

LGU read-only routes include:

- checkpoints
- checkpoint events
- compliance exceptions
- vessels
- inter-island movements
- compliance summary
- overdue movements
- passenger reconciliation
- payment clearance

Mutation routes remain blocked for LGU analytics.

## Current Summary Counts Observed

At latest runtime verification:

- totalMovements: 10
- plannedMovements: 5
- departedMovements: 4
- arrivedMovements: 0
- completedMovements: 1
- openComplianceExceptions: 1
- noManifestExceptions: 0
- approvedVessels: 1
- manifestLinkedMovements: 5
- manifestMemberMismatchMovements: 5
- overdueDepartedMovements: 4
- paymentClearMovementCount: 0
- paymentNeedsReviewMovementCount: 5

## Hard Rules For Next Chat / Next Lane

1. Do not claim DOT-LGU Dashboard UI is built yet.
2. Do not build generic dashboard UI.
3. Do not give SILENT_LGU_ANALYTICS mutation authority.
4. Do not enforce payment clearance yet.
5. Do not claim passenger-level compliance is complete.
6. Do not auto-create overdue alerts yet.
7. LGU Console must read from the hardened compliance spine only.
8. Frontend should expose operational compliance, exceptions, overdue movements, vessel compliance, passenger reconciliation, and payment clearance status.
9. Backend remains source of truth. Frontend hiding is not security.
10. Before UI, decide exact LGU Console route namespace and shell architecture.

## Recommended Next Lane

Lane 3-A — LGU Console Read-Only UI Shell

Recommended scope:

- frontend route for LGU Console shell
- login/access path using SILENT_LGU_ANALYTICS token
- read-only compliance dashboard cards
- no mutation buttons
- cards wired to GET /api/v1/osp-qr/inter-island/compliance-summary
- clearly label unresolved gaps:
  - passenger scan writes not yet implemented
  - payment enforcement not yet active
  - overdue auto-alerts not yet active
  - exception resolution admin-only

Do not implement exports, reports, exception resolution UI, or operational actions yet.
