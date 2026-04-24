# Lane 2-L — Governed LGU Fee Editor Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Inter-island approval logic now includes LGU / barangay / environmental fee configuration.

Lane 2-L adds governed fee editing while preserving the separation between read-only LGU analytics and fee-edit authority.

## Completed

### Role Added

Added UserRole:

- LGU_FEE_EDITOR

Existing role remains read-only:

- SILENT_LGU_ANALYTICS

## Completed API

Added:

- PATCH /api/v1/osp-qr/compliance/fee-items/:id

Allowed roles:

- ADMIN
- LGU_FEE_EDITOR

Blocked role:

- SILENT_LGU_ANALYTICS

## Fee Item Update Behavior

The endpoint can update:

- amountPhp
- description
- isRequiredForApproval
- isTravelerFacing

The endpoint validates:

- fee item must exist
- amountPhp must be null or non-negative number

## Runtime Verified

### Role Wall

- SILENT_LGU_ANALYTICS tried PATCH fee item → 403 Forbidden
- LGU_FEE_EDITOR patched ENVIRONMENTAL_FEE amountPhp to 100 → ok true
- ADMIN patched ENVIRONMENTAL_FEE amountPhp to null → ok true

### Fee Readiness

After filling all required fee items:

- requiredFeeItems: 5
- requiredFeeItemsMissingAmount: 0
- feeConfigurationStatus: READY

This proves the system can move from:

- NEEDS_REVIEW

to:

- READY

when all required LGU/barangay/environmental fee amounts are configured.

## Read Access Adjustment

LGU_FEE_EDITOR was also allowed to read LGU compliance summary and fee programs so the editor can verify fee readiness after editing.

Mutation boundaries remain:

- LGU_FEE_EDITOR can edit fee items only
- LGU_FEE_EDITOR cannot create movements unless explicitly granted later
- LGU_FEE_EDITOR cannot perform QR scans unless explicitly granted later
- LGU_FEE_EDITOR cannot resolve compliance exceptions unless explicitly granted later
- SILENT_LGU_ANALYTICS remains read-only

## Current Fee Program

Program:

- GL_INTER_ISLAND_LGU_BARANGAY_FEES
- scopeType: INTER_ISLAND_MOVEMENT
- municipality: General Luna
- approvalStatus: DRAFT
- isActive: true

Fee items:

- ENVIRONMENTAL_FEE
- BARANGAY_FEE
- TERMINAL_OR_DEPARTURE_FEE
- ISLAND_ACCESS_FEE
- OTHER_LOCAL_FEE

## Not Yet Done

Still pending before full fee compliance readiness:

- fee program approval workflow
- fee change audit ledger
- fee payment collection
- fee receipt issuance
- fee clearance enforcement before departure
- traveler-facing fee breakdown
- LGU editor UI
- DOT/LGU reporting/export

## Hard Rules

1. SILENT_LGU_ANALYTICS must remain read-only.
2. LGU_FEE_EDITOR can edit fee configuration but must not gain broad operational powers.
3. Fee amounts must come from backend records, not frontend constants.
4. Do not enforce fee clearance until fee payment collection and receipts exist.
5. Do not claim fee compliance is complete until fee collection, receipts, and enforcement are built.
