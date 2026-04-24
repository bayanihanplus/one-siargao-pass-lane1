# Lane 2-S — Fee Charge Snapshot Preview Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Approved LGU / barangay / environmental fee configuration must be snapshotted into movement / manifest / booking-linked fee charge records before collection, receipts, or enforcement.

Lane 2-S creates the fee charge snapshot table and a read-only preview endpoint. It does not collect payment, issue receipts, or enforce departure clearance yet.

## Completed

### Backend Schema

Added:

- OspInterIslandFeeCharge

Mapped table:

- osp_inter_island_fee_charges

### Fee Charge Snapshot Fields

The table captures:

- movementId
- manifestId
- bookingId
- travelerUserId
- feeProgramId
- feeProgramCodeSnapshot
- feeItemId
- feeItemCodeSnapshot
- feeItemNameSnapshot
- feeCategorySnapshot
- chargeBasisSnapshot
- amountPhp
- quantity
- totalAmountPhp
- chargeStatus
- source
- createdAt
- updatedAt

### Read-Only Preview API

Added:

- GET /api/v1/osp-qr/inter-island/movements/:id/fee-charge-preview

Allowed roles:

- ADMIN
- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

The endpoint:

- loads movement
- loads manifest
- loads active approved inter-island fee program
- uses manifest members count when present
- falls back to manifest.totalMembers when members are not listed
- calculates charge rows from approved fee items
- calculates total local fee amount
- returns previewStatus and issues[]

## Runtime Verified

Movement:

- cmocfquvg0000148g9kqiz9ij

Manifest:

- MAN-SEED-APPROVED-1776985827373
- totalMembers: 14
- members: []

Fee program:

- GL_INTER_ISLAND_LGU_BARANGAY_FEES
- approvalStatus: APPROVED

Result:

- previewStatus: READY
- quantityBasis: 14
- charges: 5
- issues: []
- totalAmountPhp: 7700

Charge calculation:

- ENVIRONMENTAL_FEE: ₱100 × 14 = ₱1,400
- BARANGAY_FEE: ₱150 × 14 = ₱2,100
- TERMINAL_OR_DEPARTURE_FEE: ₱100 × 14 = ₱1,400
- ISLAND_ACCESS_FEE: ₱100 × 14 = ₱1,400
- OTHER_LOCAL_FEE: ₱100 × 14 = ₱1,400

Total:

- ₱7,700

## Current Doctrine

Fee charge preview is read-only.

No fee charge records are written yet.

No fee payment is collected yet.

No fee receipt is issued yet.

No fee clearance enforcement is active yet.

## Not Yet Done

Still pending:

- create/write fee charge snapshot records
- idempotent fee charge generation
- fee charge payment collection
- fee receipt issuance
- fee clearance enforcement before departure
- traveler-facing fee breakdown
- DOT/LGU reporting/export

## Hard Rules

1. Do not collect fees from preview records.
2. Do not enforce fee clearance from preview only.
3. Do not issue receipts until fee payment records exist.
4. Fee charge snapshots must preserve approved fee values at the time of generation.
5. Future enforcement must use generated fee charge/payment state, not mutable fee config directly.
