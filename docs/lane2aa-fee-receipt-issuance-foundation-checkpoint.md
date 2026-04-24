# Lane 2-AA — Fee Receipt Issuance Foundation Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Fee charges can now be generated, paid manually, and audited. Lane 2-AA adds the first receipt issuance foundation.

This creates official fee receipt records only after fee payment status is PAID.

This still does not enforce departure clearance.

## Completed

### Backend Schema

Added:

- OspFeeReceipt

Mapped table:

- osp_fee_receipts

### Receipt Fields

Receipt records capture:

- receiptReference
- movementId
- manifestId
- bookingId
- paymentReference
- totalPaidAmountPhp
- receiptStatus
- issuedByUserId
- issuedAt
- notes
- createdAt
- updatedAt

### Receipt Issuance API

Added:

- POST /api/v1/osp-qr/inter-island/movements/:id/fee-receipts/issue

Allowed role:

- ADMIN

Blocked roles:

- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

### Receipt Read API

Added:

- GET /api/v1/osp-qr/inter-island/movements/:id/fee-receipt

Allowed roles:

- ADMIN
- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

## Issuance Rules

Receipt issuance:

- is idempotent per movementId
- requires fee payment summary status PAID
- requires a paymentReference
- generates receiptReference using OSP-FEE- + movement suffix
- snapshots totalPaidAmountPhp
- does not mutate movement status
- does not enforce clearance

## Runtime Verified

Movement:

- cmocfquvg0000148g9kqiz9ij

Payment reference:

- MANUAL-TEST-001

Receipt reference:

- OSP-FEE-9KQIZ9IJ

Role wall:

- SILENT_LGU_ANALYTICS attempted receipt issuance → 403 Forbidden

First admin issuance:

- issuanceStatus: ISSUED
- receiptStatus: ISSUED
- totalPaidAmountPhp: 7700
- issuedByUserId: osp-admin-001

Second admin issuance:

- issuanceStatus: ALREADY_ISSUED
- no duplicate receipt created

LGU read:

- ok: true
- receiptStatus: ISSUED

## Current Doctrine

Paid fee charges are now receiptable.

Receipt issuance exists.

Receipt issuance is not departure clearance enforcement.

Receipt records are not PDFs yet.

Receipt records are not DOT/LGU export reports yet.

## Not Yet Done

Still pending:

- receipt audit/read listing endpoint
- receipt PDF/export
- traveler-facing receipt view
- fee clearance enforcement before departure
- DOT/LGU reporting/export
- formal finance role separation

## Hard Rules

1. SILENT_LGU_ANALYTICS must not issue receipts.
2. LGU_FEE_EDITOR must not issue receipts.
3. Receipt issuance must remain idempotent.
4. Do not enforce departure clearance until the clearance lane is explicitly built.
5. Do not treat receipt schema as PDF/export readiness.
