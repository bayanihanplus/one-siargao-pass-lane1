# Lane 3-Q — Report Export Audit Log Doctrine

## Current Branch

- fix/operator-staff-membership-layer

## Purpose

Define the required audit log doctrine before OSP creates official LGU/DOT reports, official report numbers, official PDFs, signatures, seals, or permanent export records.

This lane is doctrine-only.

No schema migration.
No export mutation.
No official report number.
No official PDF.
No signature/seal.
No report issuance.

## Current Reporting State

Currently built:

- backend Manifest Approval Draft Report JSON endpoint
- backend Manifest Approval Draft CSV endpoint
- frontend Reports / Export panel
- browser Print / Save as PDF
- DRAFT watermark

Current backend endpoints:

- GET /api/v1/osp-qr/reports/manifest-approval/draft
- GET /api/v1/osp-qr/reports/manifest-approval/draft.csv

Current report mode:

- DRAFT
- official: false
- DRAFT — NOT OFFICIAL LGU/DOT REPORT

## Why Audit Log Is Required

A report export becomes institutionally sensitive when users can download, print, forward, or rely on it for LGU/DOT review.

Without an export audit log, OSP cannot prove:

- who generated the report
- when the report was generated
- what report type was generated
- what filters were used
- whether the report was draft or official
- what file format was produced
- whether the exported data came from current records or a historical snapshot
- whether a report was regenerated, superseded, or voided
- whether the report was accessed by an authorized role

## Required Future Model: ReportExportAudit

Recommended future model fields:

- id
- reportType
- reportMode
- official
- reportNumber
- generatedByUserId
- generatedByRole
- generatedAt
- format
- sourceEndpoint
- sourceFiltersJson
- rowCount
- approvalEventCount
- jurisdictionScope
- periodStart
- periodEnd
- watermark
- fileName
- fileHash
- storageKey
- status
- voidedAt
- voidedByUserId
- voidReason
- metadataJson
- createdAt
- updatedAt

## Required Report Type Registry

Initial report types:

1. MANIFEST_APPROVAL_DRAFT
2. MANIFEST_APPROVAL_OFFICIAL
3. MANIFEST_SUBMISSION_QUEUE_DRAFT
4. APPROVAL_EVENT_DRAFT
5. FEE_CLEARANCE_EXCEPTION_DRAFT
6. FEE_RECEIPT_REGISTER_DRAFT
7. PAYMENT_AUDIT_REGISTER_DRAFT
8. OVERDUE_MOVEMENT_SIGNAL_DRAFT
9. INTER_ISLAND_COMPLIANCE_SUMMARY_DRAFT

Official report types must not be enabled until the official report doctrine is locked.

## Required Export Formats

Initial formats:

- JSON
- CSV
- PRINT_VIEW
- PDF_DRAFT

Future official formats:

- PDF_OFFICIAL
- CSV_OFFICIAL

## Required Report Modes

Allowed report modes:

- DRAFT
- OFFICIAL
- VOIDED
- SUPERSEDED

Current system must remain DRAFT only.

## Required Audit Triggers

Future audit log should be created when:

- a user downloads CSV
- a user opens printable report view
- a user generates server-side PDF
- a user generates official report
- a user regenerates an official report
- a user voids/supersedes a report

Do not create audit logs for ordinary dashboard viewing unless a separate access log doctrine is created.

## Draft Export Doctrine

Draft exports may be generated without official report number.

Draft exports must include:

- DRAFT watermark
- generatedAt
- generatedBy
- reportType
- reportMode
- official: false
- row count
- source endpoint or source type

Draft exports must not include:

- official report number
- government seal
- signature block
- attestation text
- final filing language

## Official Export Doctrine

Official exports require all of the following before activation:

- locked official report template
- report type registry
- immutable audit log
- official report number generation
- generatedBy actor identity
- generatedAt timestamp
- report filters/scope
- file hash
- storage key or retention reference
- signature/attestation doctrine
- void/supersede doctrine
- access control review

## Frontend Rules

Reports / Export panel may show:

- Draft CSV
- Print / Save as PDF
- DRAFT warning
- backend source metadata

Reports / Export panel must not show:

- Official Report button
- Official PDF button
- report number
- government seal
- signature block
- final filing language

## Backend Rules

Current backend endpoints must remain read/export-only.

They must not mutate operational records.

Future audit log writes must be limited to report export audit records only.

## Recommended Next Lane

Lane 3-R — ReportExportAudit Schema Draft

Scope:

- add ReportExportAudit model
- add enum-like string fields or Prisma enums if consistent with current schema style
- no endpoint changes yet
- no official report activation
- no PDF generation yet

## Hard Rules

1. Do not create official reports before audit log exists.
2. Do not create official report numbers before audit log exists.
3. Do not add signature/seal before official template is locked.
4. Do not remove draft watermark.
5. Do not mutate manifest approval records from report/export endpoints.
6. Do not treat browser print as official PDF.
7. Backend remains source of truth for report data.
8. Report exports must remain role-governed.
