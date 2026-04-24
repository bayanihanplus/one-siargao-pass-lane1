# Lane 2-AC — Transfer Checkpoint Before Fee Clearance Enforcement

## Current Branch

- fix/operator-staff-membership-layer

## Current Head

- bbad465 document lane 2ab readonly fee receipts endpoint checkpoint

## Locked Context

Inter-island LGU/barangay/environmental fee compliance now has a complete backend spine up to receipt visibility.

The system can now:

- configure LGU/barangay/environmental fee programs
- edit fee item amounts through governed roles
- audit fee item changes
- approve fee programs through ADMIN
- audit fee program approvals
- preview movement-linked fee charges
- generate idempotent fee charge snapshots
- read generated fee charge snapshots
- track fee payment state
- manually record full payment through ADMIN
- audit manual payment recording
- expose payment audit records
- issue idempotent fee receipts
- expose issued fee receipts read-only

This is still not fee clearance enforcement.

## Latest Commit Stack

- bbad465 document lane 2ab readonly fee receipts endpoint checkpoint
- 2fa11e6 add readonly fee receipts endpoint
- f975bc9 add fee receipt issuance foundation
- eeaac64 document lane 2aa fee receipt issuance checkpoint
- 6c83b98 document transfer checkpoint before fee receipt issuance
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

## Completed Receipt Spine

### Fee Receipts Table

Table:

- osp_fee_receipts

Model:

- OspFeeReceipt

Fields:

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

Endpoint:

- POST /api/v1/osp-qr/inter-island/movements/:id/fee-receipts/issue

Allowed:

- ADMIN

Blocked:

- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

### Movement Receipt Read API

Endpoint:

- GET /api/v1/osp-qr/inter-island/movements/:id/fee-receipt

Allowed:

- ADMIN
- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

### Receipt List API

Endpoint:

- GET /api/v1/osp-qr/compliance/fee-receipts

Allowed:

- ADMIN
- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

## Runtime Verified Receipt

Movement:

- cmocfquvg0000148g9kqiz9ij

Receipt:

- receiptReference: OSP-FEE-9KQIZ9IJ
- receiptStatus: ISSUED
- paymentReference: MANUAL-TEST-001
- totalPaidAmountPhp: 7700
- issuedByUserId: osp-admin-001

Role wall:

- SILENT_LGU_ANALYTICS cannot issue receipt
- ADMIN can issue receipt
- repeated issue request is idempotent and returns ALREADY_ISSUED
- LGU can read receipt

## What Is Not Built Yet

Do not claim any of the following are complete:

- fee clearance enforcement before departure
- departure blocking based on unpaid/unreceipted fees
- fee clearance summary in departure gate
- receipt PDF/export
- traveler-facing receipt view
- DOT/LGU reports/export
- formal finance role separation
- external payment gateway integration

## Critical Hard Rules

1. Fee clearance enforcement must inspect generated fee charge payment/receipt state.
2. Do not enforce clearance from mutable fee configuration.
3. Do not enforce clearance from preview-only data.
4. Receipt must exist before fee clearance is considered complete.
5. Paid charges alone are not enough if the enforcement doctrine requires issued receipt.
6. SILENT_LGU_ANALYTICS remains read-only.
7. LGU_FEE_EDITOR must not issue receipts or enforce clearance.
8. Backend remains source of truth.
9. No external payment gateway in the clearance lane.
10. No PDF/export in the clearance lane unless explicitly opened.

## Recommended Next Lane

Lane 2-AD — Fee Clearance Readiness Summary

Recommended conservative scope:

- add read-only clearance summary endpoint first
- check generated fee charges exist
- check paymentStatus is PAID
- check receiptStatus is ISSUED
- return feeClearanceStatus:
  - NO_CHARGES
  - UNPAID
  - PAID_NO_RECEIPT
  - CLEARED
- do not block departure yet
- do not mutate movement yet

Only after this read-only clearance summary is verified should departure enforcement be patched.

