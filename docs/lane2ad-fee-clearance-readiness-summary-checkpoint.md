# Lane 2-AD — Fee Clearance Readiness Summary Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Fee payment and receipt issuance now exist, but departure enforcement must not be patched blindly.

Lane 2-AD adds a read-only fee clearance readiness summary endpoint before any departure scan blocking is implemented.

## Completed

### API

Added:

- GET /api/v1/osp-qr/inter-island/movements/:id/fee-clearance-summary

Allowed roles:

- ADMIN
- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

## Returned Clearance Statuses

The endpoint returns:

- NO_CHARGES
- UNPAID
- PAID_NO_RECEIPT
- CLEARED

## Clearance Logic

The endpoint checks:

1. Generated fee charges exist
2. Fee payment status is PAID
3. Fee receipt status is ISSUED

Status mapping:

- NO_CHARGES → no generated fee charges
- UNPAID → fee charges exist but payment summary is not PAID
- PAID_NO_RECEIPT → payment is PAID but receipt is not ISSUED
- CLEARED → payment is PAID and receipt is ISSUED

## Expected Runtime Evidence

Movement:

- cmocfquvg0000148g9kqiz9ij

Expected result:

- feeClearanceStatus: CLEARED
- issues: []
- payment.paymentStatus: PAID
- payment.paidAmountPhp: 7700
- payment.unpaidAmountPhp: 0
- receipt.receiptStatus: ISSUED
- receipt.receiptReference: OSP-FEE-9KQIZ9IJ

## Current Doctrine

Fee clearance readiness is now inspectable.

This is read-only.

This does not mutate movement records.

This does not block departure scans yet.

## Not Yet Done

Still pending:

- departure scan fee-clearance enforcement
- blocked departure exception type for unpaid/unreceipted fees
- LGU/DOT report/export
- receipt PDF/export
- traveler-facing receipt view

## Hard Rules

1. Do not enforce departure clearance from fee config.
2. Do not enforce departure clearance from fee preview.
3. Departure enforcement must inspect generated fee charges, payment state, and issued receipt state.
4. This endpoint is read-only and must not mutate movement records.
5. Do not claim departure enforcement is active until the next explicit lane patches the departure scan gate.
