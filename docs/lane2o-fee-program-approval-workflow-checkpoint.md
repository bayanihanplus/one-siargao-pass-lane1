# Lane 2-O — Fee Program Approval Workflow Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Inter-island fee configuration can now be edited and audited, but fee programs must not become operationally approved without governance control.

Lane 2-O adds controlled approval status changes for LGU / barangay / environmental fee programs.

## Completed

### API

Added:

- PATCH /api/v1/osp-qr/compliance/fee-programs/:id/approval-status

Allowed role:

- ADMIN

Blocked role:

- LGU_FEE_EDITOR

## Supported Approval Statuses

Allowed statuses:

- DRAFT
- READY_FOR_REVIEW
- APPROVED
- SUSPENDED

## Approval Guard

The endpoint blocks `APPROVED` status if required fee items are missing amounts.

## Runtime Verified

Fee program:

- GL_INTER_ISLAND_LGU_BARANGAY_FEES

Runtime test result:

- LGU_FEE_EDITOR tried to approve fee program → 403 Forbidden
- ADMIN approved fee program → ok true
- approvalStatus: APPROVED

Configured approved fee amounts:

- ENVIRONMENTAL_FEE: ₱100
- BARANGAY_FEE: ₱150
- TERMINAL_OR_DEPARTURE_FEE: ₱100
- ISLAND_ACCESS_FEE: ₱100
- OTHER_LOCAL_FEE: ₱100

## Current Doctrine

LGU_FEE_EDITOR can configure fee items.

ADMIN controls fee program approval status.

SILENT_LGU_ANALYTICS remains read-only.

## Not Yet Done

Still pending:

- fee program approval audit ledger
- LGU fee editor UI
- fee payment collection
- fee receipt issuance
- fee clearance enforcement before departure
- traveler-facing fee breakdown
- DOT/LGU reporting/export

## Hard Rules

1. LGU_FEE_EDITOR cannot approve fee programs.
2. SILENT_LGU_ANALYTICS cannot edit or approve fees.
3. Fee program approval does not mean fee collection is active.
4. Do not enforce fee clearance until fee payment collection and receipt lanes exist.
