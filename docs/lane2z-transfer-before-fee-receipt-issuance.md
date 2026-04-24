# Lane 2-Z — Transfer Checkpoint Before Fee Receipt Issuance

## Current Branch

- fix/operator-staff-membership-layer

## Current Head

- 2f8a919 document lane 2y readonly fee payment audit endpoint checkpoint

## Locked Context

Inter-island LGU/barangay/environmental fee compliance now has a complete pre-receipt backend spine.

The system can now:

- configure LGU/barangay/environmental fees
- audit fee item changes
- approve fee programs
- audit fee program approvals
- preview approved fee charges
- generate idempotent fee charge snapshots
- read generated fee charges
- track fee payment state
- record manual full payment as ADMIN
- audit manual payment recording
- expose payment audit records read-only

This is still not receipt issuance and still not departure clearance enforcement.

## Latest Commit Stack

- 2f8a919 document lane 2y readonly fee payment audit endpoint checkpoint
- 81fa2d0 add readonly fee payment audit endpoint
- bab0f7a document lane 2x manual fee payment recording checkpoint
- 5b66955 add manual fee payment recording and audit ledger
- ad6ee30 document lane 2w fee payment state foundation checkpoint
- 250def8 add fee charge payment state foundation
- 2847b1b document transfer checkpoint before fee payment collection
- e33c85f document lane 2u readonly generated fee charges checkpoint
- 88ff7e3 add readonly generated fee charges endpoint
- 52533c7 document lane 2t fee charge generation checkpoint
- 77510be add idempotent inter island fee charge generation
- 3718fac document lane 2s fee charge preview checkpoint
- d111099 add inter island fee charge preview foundation

## Completed Fee Payment Spine

### Fee Charge Snapshot Records

Table:

- osp_inter_island_fee_charges

Payment-related fields now include:

- paymentStatus
- paidAmountPhp
- unpaidAmountPhp
- paymentReference
- paidAt
- paymentRecordedByUserId

### Fee Payment Audit Ledger

Table:

- osp_fee_payment_audits

Captures:

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

### Fee Payment Summary API

Endpoint:

- GET /api/v1/osp-qr/inter-island/movements/:id/fee-payment-summary

Allowed roles:

- ADMIN
- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

### Manual Fee Payment Recording API

Endpoint:

- PATCH /api/v1/osp-qr/inter-island/movements/:id/fee-payments/record

Allowed:

- ADMIN

Blocked:

- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

### Fee Payment Audit Read API

Endpoint:

- GET /api/v1/osp-qr/compliance/fee-payment-audits

Allowed roles:

- ADMIN
- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

## Runtime Verified Manual Payment

Movement:

- cmocfquvg0000148g9kqiz9ij

Payment reference:

- MANUAL-TEST-001

Payment method:

- MANUAL_CASH

Runtime result:

- previousPaymentStatus: UNPAID
- newPaymentStatus: PAID
- totalAmountPhp: 7700
- paidAmountPhp: 7700
- unpaidAmountPhp: 0
- chargeCount: 5
- all chargeStatus: PAID
- all paymentStatus: PAID
- paymentRecordedByUserId: osp-admin-001
- audit row created

## Role Doctrine

### ADMIN

Can:

- configure controlled admin workflows
- record manual full fee payment
- read all fee/payment audit records

### LGU_FEE_EDITOR

Can:

- configure fee items
- generate fee charge snapshots
- read fee/payment audit records

Cannot:

- approve fee programs
- record payments
- issue receipts
- enforce clearance

### SILENT_LGU_ANALYTICS

Can:

- read fee/payment compliance records

Cannot:

- edit fees
- approve fee programs
- generate fee charges
- record payments
- issue receipts
- enforce clearance

## What Is Not Built Yet

Do not claim any of the following are complete:

- fee receipt issuance
- official receipt number generation
- receipt PDF/export
- traveler-facing receipt view
- fee clearance enforcement before departure
- automatic payment gateway collection
- accounting settlement treatment
- DOT/LGU reporting/export

## Critical Hard Rules

1. Paid fee charges are not receipts.
2. Audit rows are not receipts.
3. Do not issue receipts until a receipt schema and issuance endpoint exist.
4. Do not enforce departure clearance until receipt/clearance logic exists.
5. Do not integrate payment gateway yet.
6. Manual payment recording must remain admin-only until a formal finance role exists.
7. Backend remains the source of truth.
8. Do not mutate historical fee charge snapshots after payment except through governed payment/receipt workflows.

## Recommended Next Lane

Lane 2-AA — Fee Receipt Issuance Foundation

Recommended scope:

- add OspFeeReceipt table
- issue receipt only when fee payment summary is PAID
- snapshot movementId, manifestId, totalPaidAmountPhp, paymentReference, issuedByUserId, issuedAt
- generate unique receiptReference
- add read-only receipt endpoint
- do not enforce departure clearance yet

