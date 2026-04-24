# Lane 3-U — Draft Print Report View Audit Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Completed

Draft Print / Save as PDF action now writes a ReportExportAudit record before triggering browser print.

## Backend

Added endpoint:

- POST /api/v1/osp-qr/reports/manifest-approval/draft-print-audit

Allowed roles:

- ADMIN
- SILENT_LGU_ANALYTICS
- LGU_APPROVER
- LGU_FEE_EDITOR

## Audit Behavior

The print audit writes:

- reportType: MANIFEST_APPROVAL_DRAFT
- reportMode: DRAFT
- official: false
- reportNumber: null
- format: PRINT_VIEW
- sourceEndpoint: /api/v1/osp-qr/reports/manifest-approval/draft-print-audit
- sourceFiltersJson
- rowCount
- approvalEventCount
- watermark
- status: GENERATED
- metadataJson.printMode: BROWSER_PRINT_SAVE_AS_PDF

## Frontend

Reports / Export panel now:

- uses a server-action form for Print / Save as PDF
- records print audit first
- redirects back with print=1
- auto-triggers browser print after audit record is created

## Current Doctrine

Browser Print / Save as PDF is auditable.

It is still a draft print view.

It is not server-side PDF generation.

It is not an official DOT/LGU PDF.

## Not Yet Done

Still pending:

- server-side PDF generation
- official report type registry
- official report number generation
- signature/attestation block
- official DOT/LGU report template
- void/supersede workflow
- export filters
- jurisdiction/date filters

## Hard Rules

1. Do not create official reports yet.
2. Do not create official report numbers yet.
3. Do not add signature/seal yet.
4. Do not remove DRAFT warning.
5. Do not treat browser print as official PDF.
6. Keep print audit writes limited to ReportExportAudit.
