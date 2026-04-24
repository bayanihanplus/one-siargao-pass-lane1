# Lane 3-R — Report Export Audit Schema Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Completed

Added ReportExportAudit schema and database migration.

## Migration

Created and applied:

- 20260424100725_add_report_export_audit

## Model

Added:

- ReportExportAudit

Mapped table:

- report_export_audits

## Purpose

This table is the future immutable tracking layer for report/export generation.

It is required before activating:

- official report numbers
- official PDF generation
- signed reports
- report filing language
- government seal/signature blocks
- permanent export traceability

## Current Fields

The model supports:

- reportType
- reportMode
- official flag
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

## Runtime Verified

Confirmed:

- Prisma migration applied
- database is in sync
- Prisma Client regenerated
- schema supports report export audit tracking

## Current Doctrine

The audit table exists, but export endpoints do not write to it yet.

Current reports remain draft-only.

## Not Yet Done

Still pending:

- write audit record on JSON draft generation
- write audit record on CSV draft export
- report audit read endpoint
- export access log panel
- official report number generation
- server-side PDF generation
- official report templates
- signature/attestation block
- void/supersede workflow

## Hard Rules

1. Do not create official reports yet.
2. Do not add official report numbers yet.
3. Do not add signature/seal yet.
4. Do not remove DRAFT warning.
5. Do not treat this migration as official report activation.
6. Do not mutate operational manifest records from report export audit logic.
