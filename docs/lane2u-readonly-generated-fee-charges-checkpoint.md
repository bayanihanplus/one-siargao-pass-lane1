# Lane 2-U — Read-Only Generated Fee Charges Endpoint Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Generated fee charge snapshots must be inspectable before fee payment collection, receipt issuance, or departure enforcement.

Lane 2-U exposes generated inter-island fee charges through a read-only compliance endpoint.

## Completed

### API

Added:

- GET /api/v1/osp-qr/inter-island/movements/:id/fee-charges

Allowed roles:

- ADMIN
- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

## Runtime Verified

Movement:

- cmocfquvg0000148g9kqiz9ij

Result:

- ok: true
- chargeCount: 5
- totalAmountPhp: 7700
- chargeStatus: PENDING for all charge rows

Generated charges:

- ENVIRONMENTAL_FEE: ₱100 × 14 = ₱1,400
- BARANGAY_FEE: ₱150 × 14 = ₱2,100
- TERMINAL_OR_DEPARTURE_FEE: ₱100 × 14 = ₱1,400
- ISLAND_ACCESS_FEE: ₱100 × 14 = ₱1,400
- OTHER_LOCAL_FEE: ₱100 × 14 = ₱1,400

Total:

- ₱7,700

## Current Doctrine

Generated fee charges are visible but unpaid.

Generated fee charges are not receipts.

Generated fee charges do not enforce departure clearance yet.

## Not Yet Done

Still pending:

- fee payment collection
- fee receipt issuance
- fee clearance enforcement before departure
- traveler-facing fee breakdown
- DOT/LGU reporting/export

## Hard Rules

1. Read-only fee charge visibility must not mutate charge records.
2. Do not treat PENDING fee charges as paid.
3. Do not issue receipts until payment state exists.
4. Do not enforce departure clearance until fee charge payment/receipt lanes exist.
