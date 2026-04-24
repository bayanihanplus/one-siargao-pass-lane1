# Lane 2-E — Passenger-Level Manifest Reconciliation Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Inter-island tours are the primary compliance reason OSP exists.

Lane 2-E adds passenger-level manifest reconciliation visibility on top of:

- approved manifest enforcement
- approved vessel enforcement
- checkpoint validation
- QR event trail
- compliance exception trail

## Completed

### API

Added:

- GET /api/v1/osp-qr/inter-island/movements/:id/passenger-reconciliation

This returns:

- movement
- manifest
- manifestTotalMembers
- listedMembersCount
- departureEventExists
- arrivalEventExists
- returnEventExists
- reconciliationStatus
- issues[]

### Verified Result

For current test movement:

- reconciliationStatus: NEEDS_REVIEW
- manifestTotalMembers: 14
- listedMembersCount: 0
- issues:
  - MANIFEST_TOTAL_DOES_NOT_MATCH_LISTED_MEMBERS

This confirms the system can detect manifest passenger count mismatch before DOT-LGU Dashboard wiring.

### Compliance Summary Updated

GET /api/v1/osp-qr/inter-island/compliance-summary now includes:

- manifestLinkedMovements
- manifestMemberMismatchMovements

## Current Known Data Condition

Some test movements are linked to:

- approved manifest
- approved vessel
- departure QR event

But the linked manifest may still have:

- totalMembers > 0
- members.length = 0

This is intentionally flagged as NEEDS_REVIEW.

## Not Yet Done

Still pending before full DOT-LGU readiness:

- passenger boarding scan per manifest member
- passenger arrival scan per manifest member
- passenger return reconciliation
- missing passenger detection
- extra passenger detection
- duplicate passenger scan detection
- payment/booking clearance enforcement where applicable
- exception resolution workflow
- LGU Console / DOT-LGU Dashboard UI
- DOT-LGU role/auth separation
- audit export/reporting

## Hard Rule

Do not claim passenger-level compliance is complete yet.

Lane 2-E currently provides reconciliation visibility only. It does not yet perform passenger-level scan writes or passenger-level enforcement.
