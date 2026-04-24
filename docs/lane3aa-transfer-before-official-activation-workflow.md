# Lane 3-AA — Transfer Checkpoint Before Official Activation Workflow

## Current Branch

- fix/operator-staff-membership-layer

## Current HEAD Context

Latest completed lanes:

- Lane 3-Z — Official Report Registry Read Panel
- Lane 3-Y — Official Report Registry Seed Script
- Lane 3-X — Official Report Type + Jurisdiction Registry Schema
- Lane 3-W — Official Report Numbering Doctrine
- Lane 3-V — Transfer Before Official Report Numbering / Server PDF
- Lane 3-U — Draft Print Report View Audit
- Lane 3-T — LGU Report Export Audit Read Panel
- Lane 3-S — Draft CSV Export Audit Record
- Lane 3-R — ReportExportAudit Schema
- Lane 3-Q — Report Export Audit Log Doctrine

## Current Reporting / Export Capabilities

### Draft Report JSON

Endpoint:

- GET /api/v1/osp-qr/reports/manifest-approval/draft

State:

- reportMode: DRAFT
- official: false
- reportNumber: null
- watermark: DRAFT — NOT OFFICIAL LGU/DOT REPORT

### Draft CSV Export

Endpoint:

- GET /api/v1/osp-qr/reports/manifest-approval/draft.csv

State:

- backend-owned CSV
- DRAFT watermark retained
- creates ReportExportAudit record
- format: CSV
- official: false
- reportNumber: null

### Draft Print / Save as PDF View

Endpoint:

- POST /api/v1/osp-qr/reports/manifest-approval/draft-print-audit

State:

- browser print only
- creates ReportExportAudit record
- format: PRINT_VIEW
- official: false
- reportNumber: null
- not server-side PDF
- not official PDF

### Export Audit Read

Endpoint:

- GET /api/v1/osp-qr/reports/export-audits

State:

- read-only
- shows latest ReportExportAudit rows
- used by LGU Reports / Export panel

### Official Registry Read

Endpoint:

- GET /api/v1/osp-qr/reports/official-registries

State:

- read-only
- returns OfficialReportTypeRegistry rows
- returns OfficialJurisdictionRegistry rows
- summary shows officialActivation: DISABLED
- enabledReportTypeCount: 0
- enabledJurisdictionCount: 0

## Current Database Models

### ReportExportAudit

Purpose:

- tracking spine for report/export activity

Important fields:

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

### OfficialReportTypeRegistry

Purpose:

- controlled official report type code registry

Seeded codes:

- MANIFEST-APPROVAL
- MANIFEST-SUBMISSION
- APPROVAL-EVENT
- FEE-CLEARANCE-EXCEPTION
- FEE-RECEIPT-REGISTER
- PAYMENT-AUDIT
- OVERDUE-MOVEMENT
- INTER-ISLAND-COMPLIANCE

Critical state:

- isOfficialEnabled: false

### OfficialJurisdictionRegistry

Purpose:

- controlled official jurisdiction code registry

Seeded codes:

- GL
- SIARGAO
- SDN
- DOT

Critical state:

- isOfficialEnabled: false

## Current Frontend Reports / Export Panel

Panel includes:

- Draft report summary
- DRAFT watermark
- Export Draft CSV
- Print / Save as PDF
- Manifest Approval Draft Report
- Official Report Registry Readiness
- Latest Report Export Audit Log

Panel does not include:

- official report button
- official report number
- signature/seal
- official PDF button
- official filing language

## Current Doctrine

The system is now ready to discuss official activation workflow, but official activation is not built.

Official activation must remain separate from draft reporting.

Official activation must be role-governed and backend-enforced.

Official activation must not be a simple frontend toggle.

## What Is Explicitly Not Built Yet

Do not claim these are done:

- official activation workflow
- official report number generator
- official report creation endpoint
- server-side official PDF generation
- official PDF template
- signature block
- government seal
- legal attestation language
- file hashing
- export storage
- void workflow
- supersede workflow
- official report filing workflow

## Recommended Next Lane

Lane 3-AB — Official Activation Workflow Doctrine

Scope:

- define who can activate official reporting
- define activation approval requirements
- define activation prerequisites
- define activation audit requirements
- define registry activation constraints
- doctrine only

Do not implement official report number generation yet.

Do not implement server-side PDF yet.

## Hard Rules For Next Chat / Next Lane

1. Do not generate official report numbers yet.
2. Do not create official PDF yet.
3. Do not add official report button yet.
4. Do not add signature/seal yet.
5. Do not remove DRAFT warning.
6. Do not make official activation a frontend-only toggle.
7. Do not enable registry rows without activation doctrine.
8. Do not mutate manifest records from report/export endpoints.
9. Keep ReportExportAudit as the tracking spine.
10. Backend remains source of truth.
