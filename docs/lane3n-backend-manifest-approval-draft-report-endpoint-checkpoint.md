# Lane 3-N — Backend Manifest Approval Draft Report Endpoint Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Completed

Added backend-owned draft report JSON endpoint for LGU Manifest Approval reporting.

## Backend Endpoint

Added:

- GET /api/v1/osp-qr/reports/manifest-approval/draft?limit=25

Allowed roles:

- ADMIN
- SILENT_LGU_ANALYTICS
- LGU_APPROVER
- LGU_FEE_EDITOR

## Report Mode

This endpoint returns draft report data only.

It explicitly returns:

- reportType: MANIFEST_APPROVAL_DRAFT
- reportMode: DRAFT
- official: false
- watermark: DRAFT — NOT OFFICIAL LGU/DOT REPORT
- generatedAt
- generatedBy
- limits
- summary
- rows
- approvalEvents

## Source of Truth

The endpoint uses the backend LGU manifest submissions read source:

- ManifestApprovalRequest
- ManifestApprovalAction
- Manifest
- ManifestMember
- ActivityInstance
- ActivityTemplate
- User actor enrichment

## Current Report Data

Summary includes:

- totalRows
- underReviewCount
- approvedCount
- deniedCount
- approvalEventCount

Rows include:

- request ID
- manifest ID
- manifest reference
- request status
- manifest status
- operator ID/name/email/role
- activity title
- scheduled date
- member counts
- latest action
- latest actor
- review fields
- request created timestamp

Approval events include:

- event ID
- request ID
- manifest ID/reference
- action type
- action notes
- actedByUserId
- actor object
- createdAt

## Runtime Verified

Confirmed:

- backend build passes
- frontend build passes
- endpoint is implemented under osp-qr controller/service
- report remains draft-only
- no official report number added
- no signature added
- no PDF generation added
- no report audit table added

## Current Doctrine

Backend now owns the draft report dataset.

Frontend export/print should migrate away from locally-derived rows and consume this backend report endpoint.

Official reports are still not built.

## Not Yet Done

Still pending:

- frontend Reports panel consuming backend draft report endpoint
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

## Hard Rules

1. Keep this endpoint draft-only.
2. Do not represent this output as official DOT/LGU report.
3. Do not add official report number before audit trail exists.
4. Do not add signature/seal before official template is locked.
5. Do not mutate records from this report endpoint.
6. Keep report source backend-owned.
