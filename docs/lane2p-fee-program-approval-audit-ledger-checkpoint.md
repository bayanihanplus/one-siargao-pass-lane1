# Lane 2-P — Fee Program Approval Audit Ledger Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Fee item edits are already audited, but fee program approval status changes also affect compliance readiness.

Lane 2-P adds an audit ledger for fee program approval status changes before fee payment collection, receipts, or enforcement are built.

## Completed

### Backend Schema

Added:

- OspFeeProgramApprovalAudit

Mapped table:

- osp_fee_program_approval_audits

### Audit Fields Captured

Each approval status change captures:

- actorUserId
- actorRole
- feeProgramId
- feeProgramCodeSnapshot
- feeProgramNameSnapshot
- previousApprovalStatus
- newApprovalStatus
- previousNotes
- newNotes
- createdAt

### Approval Endpoint Hardened

The existing fee program approval endpoint now updates approval status and writes an approval audit row inside a transaction.

Endpoint:

- PATCH /api/v1/osp-qr/compliance/fee-programs/:id/approval-status

Allowed role:

- ADMIN

Blocked roles:

- LGU_FEE_EDITOR
- SILENT_LGU_ANALYTICS

## Runtime Verified

Test sequence:

1. Changed fee program from APPROVED to READY_FOR_REVIEW
2. Changed fee program from READY_FOR_REVIEW to APPROVED
3. Verified audit count increased from 0 to 2

Latest audit row:

- actorRole: ADMIN
- feeProgramCodeSnapshot: GL_INTER_ISLAND_LGU_BARANGAY_FEES
- previousApprovalStatus: READY_FOR_REVIEW
- newApprovalStatus: APPROVED
- previousNotes captured
- newNotes captured

## Current Approved Fee Program

Program:

- GL_INTER_ISLAND_LGU_BARANGAY_FEES
- approvalStatus: APPROVED

Configured fee amounts:

- ENVIRONMENTAL_FEE: ₱100
- BARANGAY_FEE: ₱150
- TERMINAL_OR_DEPARTURE_FEE: ₱100
- ISLAND_ACCESS_FEE: ₱100
- OTHER_LOCAL_FEE: ₱100

## Not Yet Done

Still pending:

- read endpoint for fee program approval audit ledger
- LGU fee editor UI
- fee payment collection
- fee receipt issuance
- fee clearance enforcement before departure
- traveler-facing fee breakdown
- DOT/LGU reporting/export

## Hard Rules

1. Fee program approval status changes must be audited.
2. LGU_FEE_EDITOR cannot approve fee programs.
3. SILENT_LGU_ANALYTICS cannot edit or approve fee programs.
4. Fee program approval does not mean fee collection is active.
5. Do not enforce fee clearance until payment collection and receipts are built.
