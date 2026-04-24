# Lane 2-T — Idempotent Fee Charge Generation Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Fee charge preview is now proven. Lane 2-T converts approved fee preview data into actual fee charge snapshot records without collecting payment, issuing receipts, or enforcing departure clearance.

## Completed

### API

Added:

- POST /api/v1/osp-qr/inter-island/movements/:id/fee-charges/generate

Allowed roles:

- ADMIN
- LGU_FEE_EDITOR

Blocked role:

- SILENT_LGU_ANALYTICS

## Generation Behavior

The endpoint:

- checks existing fee charges for the movement
- returns existing charges if already generated
- uses fee charge preview logic as source
- blocks generation unless previewStatus is READY
- creates one OspInterIslandFeeCharge row per fee item
- sets chargeStatus = PENDING
- snapshots approved fee program and fee item values
- does not collect payment
- does not issue receipts
- does not enforce departure clearance

## Runtime Verified

Movement:

- cmocfquvg0000148g9kqiz9ij

Role wall:

- SILENT_LGU_ANALYTICS attempted generation → 403 Forbidden

First generation:

- generationStatus: GENERATED
- charge rows created: 5
- chargeStatus: PENDING

Second generation:

- generationStatus: ALREADY_GENERATED
- duplicate rows not created

Database verification:

- count: 5
- totalAmountPhp: 7700
- statuses: PENDING, PENDING, PENDING, PENDING, PENDING

Generated fee charge snapshots:

- ENVIRONMENTAL_FEE: ₱100 × 14 = ₱1,400
- BARANGAY_FEE: ₱150 × 14 = ₱2,100
- TERMINAL_OR_DEPARTURE_FEE: ₱100 × 14 = ₱1,400
- ISLAND_ACCESS_FEE: ₱100 × 14 = ₱1,400
- OTHER_LOCAL_FEE: ₱100 × 14 = ₱1,400

Total:

- ₱7,700

## Current Doctrine

Generated fee charges are charge snapshots.

They are not payment records.

They are not receipts.

They are not clearance enforcement yet.

## Not Yet Done

Still pending:

- fee charge read endpoint
- fee payment collection
- fee receipt issuance
- fee clearance enforcement before departure
- traveler-facing fee breakdown
- DOT/LGU reporting/export

## Hard Rules

1. Do not collect payment inside charge generation.
2. Do not issue receipts from charge generation.
3. Do not enforce departure clearance from generated charges until payment/receipt lanes exist.
4. Future enforcement must inspect generated charge/payment state, not mutable fee configuration.
5. Fee charge generation must remain idempotent.
