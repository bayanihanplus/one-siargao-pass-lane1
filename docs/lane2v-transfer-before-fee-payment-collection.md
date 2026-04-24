# Lane 2-V — Transfer Checkpoint Before Fee Payment Collection

## Current Branch

- fix/operator-staff-membership-layer

## Current Head

- e33c85f document lane 2u readonly generated fee charges checkpoint

## Locked Context

Inter-island tours are the primary compliance reason OSP exists.

The backend now supports a complete pre-payment fee compliance spine:

- fee configuration
- governed fee editing
- fee edit audit
- fee program approval
- fee program approval audit
- approved fee charge preview
- idempotent generated fee charge snapshots
- read-only generated fee charge visibility

This is still pre-payment and pre-receipt.

## Latest Commit Stack

- e33c85f document lane 2u readonly generated fee charges checkpoint
- 88ff7e3 add readonly generated fee charges endpoint
- 52533c7 document lane 2t fee charge generation checkpoint
- 77510be add idempotent inter island fee charge generation
- 3718fac document lane 2s fee charge preview checkpoint
- d111099 add inter island fee charge preview foundation
- ec32f7d document transfer checkpoint before fee payment lanes
- 7b55fd4 document lane 2q fee program approval audit endpoint checkpoint
- 89c2e96 add readonly fee program approval audit endpoint
- aa6ad27 document lane 2p fee program approval audit ledger checkpoint
- 1e6d05f add fee program approval audit ledger
- 0daf5a9 document lane 2o fee program approval workflow checkpoint
- 0e9f1cd add fee program approval workflow
- 3bc8b76 document lane 2n readonly fee audit ledger checkpoint
- 394ecab add read only fee audit ledger endpoint
- ae87fb6 document lane 2m fee change audit ledger checkpoint
- 92fe18a add fee change audit ledger
- 7179139 document lane 2l governed lgu fee editor checkpoint
- 4f700ad add governed lgu fee item update endpoint
- b5c2e35 add governed lgu fee item update endpoint
- 8387b5d add lgu fee editor role
- b54d07e document lane 2k lgu fee configuration checkpoint
- 60dad4a add lgu fee aware compliance console shell
- 48ffb42 add fee configuration counts to compliance summary
- d245dae add read only lgu fee program endpoint
- 36195bb add inter island lgu fee configuration foundation

## Completed Fee Compliance Spine

### Fee Configuration

Tables:

- osp_compliance_fee_programs
- osp_compliance_fee_items

Seeded and approved program:

- GL_INTER_ISLAND_LGU_BARANGAY_FEES
- scopeType: INTER_ISLAND_MOVEMENT
- municipality: General Luna
- approvalStatus: APPROVED
- isActive: true

Configured approved fees:

- ENVIRONMENTAL_FEE: ₱100
- BARANGAY_FEE: ₱150
- TERMINAL_OR_DEPARTURE_FEE: ₱100
- ISLAND_ACCESS_FEE: ₱100
- OTHER_LOCAL_FEE: ₱100

### Fee Roles

Existing roles relevant to this lane:

- ADMIN
- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

Role doctrine:

- ADMIN can approve fee programs and perform governed admin actions.
- LGU_FEE_EDITOR can edit fee item values and generate fee charge snapshots.
- SILENT_LGU_ANALYTICS can only read compliance/fee views.

### Fee Read Endpoints

- GET /api/v1/osp-qr/compliance/fee-programs
- GET /api/v1/osp-qr/compliance/fee-audits
- GET /api/v1/osp-qr/compliance/fee-program-approval-audits
- GET /api/v1/osp-qr/inter-island/movements/:id/fee-charge-preview
- GET /api/v1/osp-qr/inter-island/movements/:id/fee-charges

### Fee Mutation Endpoints

- PATCH /api/v1/osp-qr/compliance/fee-items/:id
- PATCH /api/v1/osp-qr/compliance/fee-programs/:id/approval-status
- POST /api/v1/osp-qr/inter-island/movements/:id/fee-charges/generate

### Audit Ledgers

Fee item update audit:

- osp_fee_change_audits

Fee program approval audit:

- osp_fee_program_approval_audits

### Fee Charge Snapshots

Table:

- osp_inter_island_fee_charges

Generated charge records currently snapshot:

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

## Runtime Verified Fee Charge Snapshot

Movement:

- cmocfquvg0000148g9kqiz9ij

Manifest:

- cmoc3hbn10005z0g9y10vtjci
- totalMembers: 14

Generated rows:

- chargeCount: 5
- totalAmountPhp: 7700
- chargeStatus: PENDING for all rows

Snapshot breakdown:

- ENVIRONMENTAL_FEE: ₱100 × 14 = ₱1,400
- BARANGAY_FEE: ₱150 × 14 = ₱2,100
- TERMINAL_OR_DEPARTURE_FEE: ₱100 × 14 = ₱1,400
- ISLAND_ACCESS_FEE: ₱100 × 14 = ₱1,400
- OTHER_LOCAL_FEE: ₱100 × 14 = ₱1,400

Total:

- ₱7,700

## What Is Not Built Yet

Do not claim any of the following are complete:

- fee payment collection
- fee receipt issuance
- fee clearance enforcement before departure
- traveler-facing fee checkout
- traveler-facing fee breakdown
- DOT/LGU reports/export
- operator payout implications
- accounting settlement treatment

## Critical Hard Rules

1. Do not collect payment from preview records.
2. Do not collect payment directly from mutable fee config.
3. Payment collection must use generated fee charge snapshot records.
4. Generated fee charges with PENDING status are unpaid.
5. Do not issue receipts until a payment/receipt lane exists.
6. Do not enforce departure clearance until fee charge payment/receipt state exists.
7. Do not give SILENT_LGU_ANALYTICS mutation authority.
8. Do not let LGU_FEE_EDITOR approve fee programs.
9. Fee charge generation must remain idempotent.
10. Backend remains source of truth.

## Recommended Next Lane

Lane 2-W — Fee Payment State Foundation

Recommended scope:

- add fee payment state fields or separate fee payment record table
- link to generated fee charge rows
- track unpaid / partially paid / paid
- add read-only fee payment summary endpoint
- do not integrate external payment gateway yet
- do not issue receipt yet
- do not enforce departure yet

Alternative if going more conservative:

Lane 2-W — Fee Charge Status Lifecycle Foundation

- PENDING
- WAIVED
- CANCELLED
- READY_FOR_PAYMENT

But payment should not be implemented until the generated charge records can carry clear lifecycle state.

