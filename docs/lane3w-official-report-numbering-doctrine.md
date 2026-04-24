# Lane 3-W — Official Report Numbering Doctrine

## Current Branch

- fix/operator-staff-membership-layer

## Purpose

Define official report numbering doctrine before OSP creates official LGU/DOT reports, official server-side PDFs, signatures, seals, or statutory filing language.

This lane is doctrine-only.

No schema migration.
No endpoint changes.
No official report number generation.
No server-side PDF.
No signature/seal.
No official report button.

## Current Reporting State

Current reporting/export layer is draft-only but auditable.

Existing capabilities:

- backend draft JSON report
- backend draft CSV export
- browser Print / Save as PDF draft view
- CSV export audit write
- print-view audit write
- ReportExportAudit schema
- export audit read endpoint
- LGU export audit read panel

Current official state:

- official: false
- reportMode: DRAFT
- reportNumber: null
- watermark: DRAFT — NOT OFFICIAL LGU/DOT REPORT

## Why Official Report Numbering Must Be Controlled

An official report number turns an exported file from a working draft into an institutional record.

Once report numbers exist, users may treat reports as:

- filed LGU records
- DOT-facing submissions
- board-facing compliance evidence
- audit artifacts
- legal/administrative references

Therefore, numbering must be deterministic, traceable, non-reusable, and void/supersede aware.

## Official Report Number Format

Recommended format:

OSP-{JURISDICTION}-{REPORT_TYPE}-{YYYYMMDD}-{SEQUENCE}

Example:

OSP-GL-MANIFEST-APPROVAL-20260424-000001

Components:

- OSP = platform/system prefix
- GL = jurisdiction code
- MANIFEST-APPROVAL = official report type code
- 20260424 = official generation date
- 000001 = daily sequence per jurisdiction + report type

## Jurisdiction Codes

Initial jurisdiction code doctrine:

- GL = General Luna
- SIARGAO = island-level consolidated report
- SDN = Surigao del Norte province-level consolidated report
- DOT = DOT-facing consolidated report

Do not invent LGU codes dynamically.

Codes must be registry-controlled.

## Report Type Codes

Initial official report type codes:

- MANIFEST-APPROVAL
- MANIFEST-SUBMISSION
- APPROVAL-EVENT
- FEE-CLEARANCE-EXCEPTION
- FEE-RECEIPT-REGISTER
- PAYMENT-AUDIT
- OVERDUE-MOVEMENT
- INTER-ISLAND-COMPLIANCE

Draft report type codes may exist, but official numbering only applies to official report types.

## Sequence Rules

Sequence must be scoped by:

- jurisdiction code
- report type code
- official generation date

Example:

- OSP-GL-MANIFEST-APPROVAL-20260424-000001
- OSP-GL-MANIFEST-APPROVAL-20260424-000002
- OSP-GL-PAYMENT-AUDIT-20260424-000001
- OSP-SIARGAO-MANIFEST-APPROVAL-20260424-000001

The same number must never be reused.

## Draft vs Official Transition

Draft reports:

- reportMode: DRAFT
- official: false
- reportNumber: null
- watermark: DRAFT — NOT OFFICIAL LGU/DOT REPORT

Official reports:

- reportMode: OFFICIAL
- official: true
- reportNumber: required
- watermark: OFFICIAL LGU/DOT REPORT or locked official label
- generatedAt required
- generatedByUserId required
- generatedByRole required
- jurisdictionScope required
- report period required where applicable
- fileHash required once server-side file generation exists
- storageKey required once storage exists

A draft report must not be “upgraded” in place unless the system explicitly creates a new official audit record.

## Official Report Creation Rule

Official reports must be generated from a backend endpoint only.

Frontend must never construct official report numbers.

Frontend must never decide whether a report is official.

Backend must own:

- official mode transition
- report number allocation
- file generation
- audit creation
- hash calculation
- storage reference
- status tracking

## Void / Supersede Doctrine

Official reports must not be deleted.

Allowed lifecycle statuses:

- GENERATED
- FILED
- SUPERSEDED
- VOIDED

Void behavior:

- original report remains stored
- status becomes VOIDED
- voidedAt required
- voidedByUserId required
- voidReason required
- report number remains permanently consumed
- replacement report must receive a new report number

Supersede behavior:

- original report remains stored
- status becomes SUPERSEDED
- replacement report receives a new report number
- metadataJson should reference superseded report ID and report number

## Required Before Implementation

Before implementing official numbering, lock:

1. official report type registry
2. jurisdiction code registry
3. report period doctrine
4. official report template doctrine
5. server-side PDF generation approach
6. file storage/retention doctrine
7. file hash doctrine
8. signature/attestation doctrine
9. void/supersede workflow
10. role authorization matrix

## Recommended Next Lane

Lane 3-X — Official Report Type + Jurisdiction Registry Schema

Scope:

- add registry doctrine or schema for official report type codes
- add registry doctrine or schema for jurisdiction codes
- no report number generation yet
- no official PDF
- no signature/seal

## Hard Rules

1. Do not create official reports yet.
2. Do not generate official report numbers yet.
3. Do not add official report buttons yet.
4. Do not add signature/seal yet.
5. Do not remove DRAFT warning.
6. Do not treat browser print as official PDF.
7. Do not allow frontend-generated official numbers.
8. Do not reuse report numbers.
9. Do not delete official report audit records.
10. Do not implement server-side PDF until official template doctrine is locked.
