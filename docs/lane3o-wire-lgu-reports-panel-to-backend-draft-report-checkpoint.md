# Lane 3-O — Wire LGU Reports Panel To Backend Draft Report Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Completed

LGU Reports / Export panel now consumes the backend-owned Manifest Approval Draft Report endpoint.

## Backend Source

Frontend now reads:

- GET /api/v1/osp-qr/reports/manifest-approval/draft?limit=100

The report source is no longer purely frontend-derived from visible manifest queue rows.

## Frontend

Updated Reports / Export panel to use backend report data for:

- report generated timestamp
- report watermark
- report summary
- report generatedBy metadata
- report type
- report rows
- approval event count

CSV export remains available.

Print / Save as PDF remains browser-based.

## Runtime Verified

Confirmed:

- frontend build passes
- Reports / Export panel loads
- Draft Rows comes from backend summary
- Approval Events comes from backend summary
- Source card uses Backend Draft Report
- CSV export remains available
- Print / Save as PDF remains available
- DRAFT warning remains visible

## Current Doctrine

Backend owns draft report data.

Frontend renders, exports, and prints the backend-provided draft dataset.

This is still not an official DOT/LGU report.

## Not Yet Done

Still pending:

- server-side CSV endpoint
- server-side PDF generation
- official report type registry
- immutable report generation audit record
- report number
- signature/attestation block
- date range filters
- actor filters
- jurisdiction filters
- official DOT/LGU templates
- export access logging

## Hard Rules

1. Keep report output draft-only.
2. Do not remove DRAFT warning.
3. Do not add official report number before report audit trail exists.
4. Do not add signature/seal before official template is locked.
5. Do not mutate records from report endpoints.
6. Frontend export must continue to show draft status.
