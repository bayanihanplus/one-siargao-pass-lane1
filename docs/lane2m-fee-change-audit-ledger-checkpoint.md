# Lane 2-M — Fee Change Audit Ledger Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

LGU / barangay / environmental fee configuration now affects inter-island approval readiness.

Because fee amounts can be edited by a governed role, every fee configuration change must be audit-traceable before fee payment collection, receipts, or enforcement are built.

## Completed

### Backend Schema

Added:

- OspFeeChangeAudit

Mapped table:

- osp_fee_change_audits

### Audit Fields Captured

Each fee change audit row captures:

- actorUserId
- actorRole
- feeProgramId
- feeItemId
- feeItemCodeSnapshot
- feeItemNameSnapshot
- previousAmountPhp
- newAmountPhp
- previousDescription
- newDescription
- previousRequiredForApproval
- newRequiredForApproval
- previousTravelerFacing
- newTravelerFacing
- changeReason
- createdAt

### Update Endpoint Hardened

The existing fee update endpoint now writes fee item update and audit row inside a transaction:

- PATCH /api/v1/osp-qr/compliance/fee-items/:id

Allowed roles:

- ADMIN
- LGU_FEE_EDITOR

Still blocked:

- SILENT_LGU_ANALYTICS

## Runtime Verified

Tested update:

- fee item: BARANGAY_FEE
- previousAmountPhp: 100
- newAmountPhp: 150
- actorRole: LGU_FEE_EDITOR
- auditCount: 0 → 1
- description change captured
- changeReason captured

## Current Doctrine

Fee configuration is now governed and auditable.

This does not yet mean fee collection is active.

## Not Yet Done

Still pending:

- read endpoint for fee audit ledger
- LGU fee editor UI
- fee program approval workflow
- fee payment collection
- fee receipt issuance
- fee clearance enforcement before departure
- traveler-facing fee breakdown
- DOT/LGU reporting/export

## Hard Rules

1. Do not allow silent analytics users to edit fees.
2. Do not modify fee amounts without audit logging.
3. Do not enforce fee clearance until collection and receipts exist.
4. Do not claim fee compliance is complete until fee collection, receipt, and enforcement lanes are built.
