# Lane 3-P — Backend Manifest Approval Draft CSV Export Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Completed

Added backend-owned CSV export for the LGU Manifest Approval Draft Report.

## Backend Endpoint

Added:

- GET /api/v1/osp-qr/reports/manifest-approval/draft.csv?limit=25

Allowed roles:

- ADMIN
- SILENT_LGU_ANALYTICS
- LGU_APPROVER
- LGU_FEE_EDITOR

## CSV Behavior

The endpoint returns:

- Content-Type: text/csv; charset=utf-8
- Content-Disposition attachment filename
- draft watermark row
- report metadata rows
- manifest approval report header row
- manifest approval report data rows

The CSV includes the explicit warning:

- DRAFT — NOT OFFICIAL LGU/DOT REPORT

## Frontend

Reports / Export CSV button now points to the backend CSV endpoint.

Print / Save as PDF remains browser-based.

## Runtime Verified

Confirmed:

- backend build passes after importing Res
- frontend build passes
- CSV endpoint returns HTTP 200
- CSV endpoint returns text/csv
- CSV endpoint returns downloadable filename
- CSV output includes draft watermark
- JSON draft report endpoint still works

## Current Doctrine

Backend owns both draft report JSON and draft report CSV.

The CSV export is still draft-only.

It is not an official DOT/LGU report.

## Not Yet Done

Still pending:

- server-side PDF generation
- official report type registry
- immutable report generation audit record
- official report number
- signature/attestation block
- date range filters
- actor filters
- jurisdiction filters
- official DOT/LGU templates
- export access logging

## Hard Rules

1. Keep CSV export draft-only.
2. Do not remove DRAFT warning.
3. Do not add official report number before report audit trail exists.
4. Do not add signature/seal before official template is locked.
5. Do not mutate records from CSV export endpoint.
6. CSV must remain backend-owned, not browser-derived.
