# Lane 2-R — Transfer Checkpoint Before Fee Payment / Receipt Lanes

## Current Branch

- fix/operator-staff-membership-layer

## Current Head

- 7b55fd4 document lane 2q fee program approval audit endpoint checkpoint

## Locked Context

Inter-island tours are the primary compliance reason OSP exists.

The system now has a hardened compliance spine covering:

- inter-island movement lifecycle
- QR scan events
- compliance exceptions
- exception resolution
- vessel compliance
- passenger reconciliation visibility
- payment clearance visibility
- LGU read-only access
- LGU / barangay / environmental fee configuration
- governed fee editing
- fee edit audit ledger
- fee program approval workflow
- fee program approval audit ledger
- LGU fee-aware read-only console shell

## Important Boundary

Do not claim fee compliance is complete.

Fee configuration and approval are complete enough for governance visibility, but not yet enough for enforcement.

Fee collection, receipts, and fee clearance enforcement are still pending.

## Completed Fee Compliance Stack

### Fee Configuration

Schema:

- OspComplianceFeeProgram
- OspComplianceFeeItem

Tables:

- osp_compliance_fee_programs
- osp_compliance_fee_items

Seeded program:

- GL_INTER_ISLAND_LGU_BARANGAY_FEES
- scopeType: INTER_ISLAND_MOVEMENT
- municipality: General Luna
- approvalStatus: APPROVED
- isActive: true

Configured fee items:

- ENVIRONMENTAL_FEE: ₱100
- BARANGAY_FEE: ₱150
- TERMINAL_OR_DEPARTURE_FEE: ₱100
- ISLAND_ACCESS_FEE: ₱100
- OTHER_LOCAL_FEE: ₱100

### Fee Read APIs

- GET /api/v1/osp-qr/compliance/fee-programs
- GET /api/v1/osp-qr/compliance/fee-audits
- GET /api/v1/osp-qr/compliance/fee-program-approval-audits

### Fee Editing

Role added:

- LGU_FEE_EDITOR

Endpoint:

- PATCH /api/v1/osp-qr/compliance/fee-items/:id

Allowed:

- ADMIN
- LGU_FEE_EDITOR

Blocked:

- SILENT_LGU_ANALYTICS

### Fee Edit Audit

Schema:

- OspFeeChangeAudit

Table:

- osp_fee_change_audits

Runtime verified:

- BARANGAY_FEE changed from ₱100 to ₱150
- actorRole: LGU_FEE_EDITOR
- audit row created

### Fee Program Approval

Endpoint:

- PATCH /api/v1/osp-qr/compliance/fee-programs/:id/approval-status

Allowed:

- ADMIN

Blocked:

- LGU_FEE_EDITOR
- SILENT_LGU_ANALYTICS

Runtime verified:

- LGU_FEE_EDITOR approval attempt returned 403
- ADMIN approval succeeded
- approvalStatus: APPROVED

### Fee Program Approval Audit

Schema:

- OspFeeProgramApprovalAudit

Table:

- osp_fee_program_approval_audits

Runtime verified:

- approvalAuditCount increased from 0 to 2
- latest actorRole: ADMIN
- previousApprovalStatus: READY_FOR_REVIEW
- newApprovalStatus: APPROVED

## LGU Console

Route:

- frontend/app/lgu/page.tsx

The LGU Console currently shows:

- compliance summary
- inter-island approval logic
- fee configuration status
- environmental fee
- barangay fee
- terminal/departure fee
- island access fee
- other local fee
- missing amount indicators
- read-only doctrine

Important:

- LGU Console is not operationally complete.
- It is currently a read-only visibility shell.
- It does not collect payments.
- It does not issue receipts.
- It does not enforce departure clearance.

## Current Compliance Summary Fields Related to Fees

Compliance summary now includes:

- activeFeePrograms
- requiredFeeItems
- requiredFeeItemsMissingAmount
- feeConfigurationStatus

Runtime verified before approval:

- activeFeePrograms: 1
- requiredFeeItems: 5
- requiredFeeItemsMissingAmount: 0
- feeConfigurationStatus: READY

## Role Doctrine

### ADMIN

Can:

- approve fee programs
- update fee items
- resolve compliance exceptions
- perform admin-only compliance mutations

### LGU_FEE_EDITOR

Can:

- read compliance views
- read fee programs
- read fee audit ledgers
- update fee items

Cannot:

- approve fee programs
- resolve compliance exceptions
- create inter-island movements
- perform QR scans
- enforce clearance

### SILENT_LGU_ANALYTICS

Can:

- read compliance views
- read fee programs
- read audit ledgers

Cannot:

- edit fees
- approve fee programs
- resolve exceptions
- create movements
- perform QR scans
- mutate operational records

## Hard Rules For Next Chat / Next Lane

1. Do not hardcode fee amounts in frontend.
2. Do not give SILENT_LGU_ANALYTICS mutation authority.
3. Do not allow LGU_FEE_EDITOR to approve fee programs.
4. Do not enforce fee clearance until fee payment collection and receipts exist.
5. Do not claim fee compliance is complete until collection, receipts, and enforcement are complete.
6. Do not start traveler-facing fee breakdown until backend fee charge records exist.
7. Do not wire fee enforcement directly from fee item config alone.
8. Fee enforcement must use booking-linked fee charge records and receipt/payment state.
9. LGU Console remains read-only visibility unless a dedicated editor UI lane is explicitly opened.
10. Backend remains source of truth.

## Recommended Next Lane

Lane 2-S — Fee Charge Snapshot Foundation

Purpose:

Before fee payment collection, create booking/movement-linked fee charge records that snapshot approved fee program values.

Recommended backend scope:

- add OspInterIslandFeeCharge or equivalent
- link to movementId where possible
- link to bookingId / manifestId where possible
- snapshot fee item code, name, category, charge basis, amountPhp
- compute total required local fee amount
- expose read-only fee charge preview endpoint
- do not collect payment yet
- do not issue receipt yet
- do not enforce departure yet

## Explicitly Not Next Yet

Do not jump directly to:

- payment gateway wiring
- receipt issuance
- traveler checkout UI
- fee enforcement before departure
- LGU dashboard expansion
- export/reporting

