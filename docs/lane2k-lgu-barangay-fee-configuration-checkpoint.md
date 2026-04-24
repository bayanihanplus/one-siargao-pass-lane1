# Lane 2-K — LGU / Barangay Fee Configuration Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Inter-island movement approval must include fee configuration logic, not only vessel, manifest, passenger, payment, and exception logic.

LGU / barangay / environmental fees are part of inter-island compliance and must be visible to the LGU Console.

## Completed

### Backend Schema

Added:

- OspComplianceFeeProgram
- OspComplianceFeeItem

Mapped tables:

- osp_compliance_fee_programs
- osp_compliance_fee_items

### Seeded Fee Program

Seeded:

- GL_INTER_ISLAND_LGU_BARANGAY_FEES
- scopeType: INTER_ISLAND_MOVEMENT
- municipality: General Luna
- approvalStatus: DRAFT
- isActive: true

### Seeded Fee Items

Seeded required fillable fee items:

- ENVIRONMENTAL_FEE
- BARANGAY_FEE
- TERMINAL_OR_DEPARTURE_FEE
- ISLAND_ACCESS_FEE
- OTHER_LOCAL_FEE

Each fee item currently has:

- amountPhp: null
- isRequiredForApproval: true
- isLguFillable: true
- isTravelerFacing: true

### Read API

Added:

- GET /api/v1/osp-qr/compliance/fee-programs

LGU analytics role can read this endpoint.

### Compliance Summary Updated

GET /api/v1/osp-qr/inter-island/compliance-summary now includes:

- activeFeePrograms
- requiredFeeItems
- requiredFeeItemsMissingAmount
- feeConfigurationStatus

Runtime verified:

- activeFeePrograms: 1
- requiredFeeItems: 5
- requiredFeeItemsMissingAmount: 5
- feeConfigurationStatus: NEEDS_REVIEW

### LGU Console UI

Added:

- frontend/app/lgu/page.tsx

The LGU Console now shows:

- read-only compliance summary
- inter-island approval logic
- fee configuration status
- environmental fee
- barangay fee
- terminal / departure fee
- island access fee
- other local fee
- missing amount indicators
- read-only doctrine

## Critical Doctrine

Fee amounts are not hardcoded in frontend.

Fees must come from backend-configured fee programs.

## Current Status

Fee configuration exists, but amounts are not filled yet.

Therefore inter-island fee readiness is:

- NEEDS_REVIEW

## Not Yet Done

Still pending:

- governed LGU fee editor role
- LGU fee amount update endpoint
- approval workflow for fee program changes
- audit ledger for fee changes
- fee payment collection logic
- fee receipt issuance
- fee clearance enforcement before departure
- traveler-facing fee breakdown
- DOT/LGU export/reporting

## Hard Rules

1. Do not hardcode fee amounts in frontend.
2. Do not allow SILENT_LGU_ANALYTICS to edit fees.
3. Do not enforce fee clearance until configured amounts and fee payment collection exist.
4. Do not claim LGU Console is operationally complete.
5. LGU Console remains read-only until a governed LGU editor role is created.
