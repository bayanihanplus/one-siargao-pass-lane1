# Lane 2-AE — Departure Scan Fee-Clearance Enforcement Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Fee configuration, charge generation, payment recording, audit visibility, receipt issuance, and receipt visibility now exist.

Lane 2-AE enforces fee clearance at the inter-island departure scan gate.

This lane only patches departure scan enforcement.

## Completed

### Enforcement Location

Patched:

- inter-island departure scan flow
- before QR event creation
- after existing manifest, vessel, operator, origin, and destination validation
- before movement is marked DEPARTED

### Enforcement Logic

Departure scan now checks:

- generated fee charges exist
- fee payment summary is PAID
- fee receipt status is ISSUED

The departure scan calls:

- getInterIslandFeeClearanceSummary(movement.id)

If:

- feeClearanceStatus === CLEARED

Then:

- departure scan proceeds

If not CLEARED:

- departure scan is blocked
- compliance exception is created
- no departure QR event is created
- movement remains not departed

## Exception Handling

Storage exception type used:

- DOT_LGU_REVIEW_REQUIRED

Reason message includes semantic fee-clearance reason:

- FEE_CLEARANCE_REQUIRED: Fee clearance is required before departure scan. Current status: <STATUS>

Reason for this approach:

- current compliance exception storage already supports DOT_LGU_REVIEW_REQUIRED safely
- FEE_CLEARANCE_REQUIRED is preserved in the reasonMessage
- future lane may formalize FEE_CLEARANCE_REQUIRED as a dedicated taxonomy value if required

## Runtime Verified — Happy Path

Movement:

- cmocimz2f000035y1zzawyh7o

Setup:

- fee charges generated
- payment recorded
- receipt issued

Fee clearance:

- feeClearanceStatus: CLEARED
- paymentStatus: PAID
- receiptStatus: ISSUED
- receiptReference: OSP-FEE-ZZAWYH7O

Departure scan result:

- ok: true
- movementStatus: DEPARTED
- eventType: INTER_ISLAND_DEPARTURE_SCAN
- outcome: ALLOWED

## Runtime Verified — Negative Path

Movement:

- cmocioj1r0000z1seq5rg2xpp

Setup:

- approved manifest exists
- approved vessel exists
- active origin/destination checkpoints exist
- no generated fee charges

Fee clearance:

- feeClearanceStatus: NO_CHARGES
- issues:
  - NO_GENERATED_FEE_CHARGES
- receiptStatus: NOT_ISSUED

Departure scan result:

- HTTP 400 Bad Request
- exceptionType: DOT_LGU_REVIEW_REQUIRED
- message includes:
  - FEE_CLEARANCE_REQUIRED
  - Current status: NO_CHARGES
- complianceExceptionId created

## Current Doctrine

Inter-island departure now requires fee clearance.

Fee clearance requires both:

1. fee payment status PAID
2. fee receipt status ISSUED

This enforcement is backend-side.

Frontend hiding is not security.

## Not Yet Done

Still pending:

- dedicated FEE_CLEARANCE_REQUIRED exception taxonomy if needed
- fee-clearance exception dashboard filtering
- LGU/DOT reporting/export
- receipt PDF/export
- traveler-facing receipt view
- formal finance role separation

## Hard Rules

1. Do not allow inter-island departure when fee clearance is not CLEARED.
2. Do not enforce clearance from mutable fee config.
3. Do not enforce clearance from preview-only records.
4. Enforcement must inspect generated fee charges, payment state, and issued receipt state.
5. Do not touch arrival or return scan enforcement under this lane.
