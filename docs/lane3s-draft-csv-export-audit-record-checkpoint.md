# Lane 3-S — Draft CSV Export Audit Record Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Completed

Draft CSV export now writes a ReportExportAudit record whenever the backend CSV export endpoint is hit.

## Endpoint

Audited endpoint:

- GET /api/v1/osp-qr/reports/manifest-approval/draft.csv

## Audit Record Behavior

Each CSV export creates a ReportExportAudit row with:

- reportType: MANIFEST_APPROVAL_DRAFT
- reportMode: DRAFT
- official: false
- reportNumber: null
- generatedByUserId
- generatedByRole
- generatedAt
- format: CSV
- sourceEndpoint
- sourceFiltersJson
- rowCount
- approvalEventCount
- watermark
- fileName
- status: GENERATED
- metadataJson

## Runtime Verified

Confirmed:

- CSV endpoint returns HTTP 200
- CSV endpoint returns text/csv
- CSV includes DRAFT watermark
- ReportExportAudit row is created
- audit row stores DRAFT mode
- official remains false
- reportNumber remains null
- rowCount stores exported row count
- approvalEventCount stores approval event count

## Current Doctrine

CSV export is now auditable.

It remains draft-only.

It is not an official DOT/LGU report.

## Not Yet Done

Still pending:

- report audit read endpoint
- LGU export audit log panel
- audit record for JSON draft report generation
- audit record for print/PDF view
- server-side PDF generation
- official report type registry
- official report number generation
- signature/attestation block
- void/supersede workflow

## Hard Rules

1. Do not create official reports yet.
2. Do not create official report numbers yet.
3. Do not add signature/seal yet.
4. Do not remove DRAFT warning.
5. Do not mutate manifest approval records from report export audit logic.
6. Keep audit writes limited to ReportExportAudit.
