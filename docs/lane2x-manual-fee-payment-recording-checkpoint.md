# Lane 2-X — Manual Fee Payment Recording + Audit Ledger Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Generated inter-island fee charges now have payment state. Lane 2-X adds a controlled manual full-payment recording endpoint and payment audit ledger.

This is still not an external payment gateway integration and still not receipt issuance.

## Completed

### Backend Schema

Added:

- OspFeePaymentAudit

Mapped table:

- osp_fee_payment_audits

### Payment Audit Captures

- actorUserId
- actorRole
- movementId
- manifestId
- bookingId
- paymentReference
- paymentMethod
- previousPaymentStatus
- newPaymentStatus
- totalAmountPhp
- paidAmountPhp
- unpaidAmountPhp
- chargeIdsJson
- notes
- createdAt

### Manual Payment Recording API

Added:

- PATCH /api/v1/osp-qr/inter-island/movements/:id/fee-payments/record

Allowed role:

- ADMIN

Blocked roles:

- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

## Runtime Verified

Movement:

- cmocfquvg0000148g9kqiz9ij

Role wall:

- LGU_FEE_EDITOR attempted manual payment recording → 403 Forbidden

Admin payment recording:

- paymentReference: MANUAL-TEST-001
- paymentMethod: MANUAL_CASH
- previousPaymentStatus: UNPAID
- newPaymentStatus: PAID
- totalAmountPhp: 7700
- paidAmountPhp: 7700
- unpaidAmountPhp: 0

Payment summary after recording:

- chargeCount: 5
- totalAmountPhp: 7700
- paidAmountPhp: 7700
- unpaidAmountPhp: 0
- paymentStatus: PAID

Each generated charge now has:

- chargeStatus: PAID
- paymentStatus: PAID
- unpaidAmountPhp: 0
- paymentReference: MANUAL-TEST-001
- paymentRecordedByUserId: osp-admin-001

## Current Doctrine

Manual fee payment recording is now possible for admin users only.

This is not a payment gateway.

This is not traveler checkout.

This is not receipt issuance.

This is not clearance enforcement yet.

## Not Yet Done

Still pending:

- read-only fee payment audit endpoint
- fee receipt issuance
- fee clearance enforcement before departure
- traveler-facing fee checkout
- DOT/LGU reporting/export

## Hard Rules

1. SILENT_LGU_ANALYTICS must not record payments.
2. LGU_FEE_EDITOR must not record payments.
3. Manual payment recording must remain auditable.
4. Paid fee charges are not receipts.
5. Do not enforce departure clearance until receipt/clearance lanes are built.
