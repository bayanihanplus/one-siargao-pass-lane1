# Lane 3-K — Transfer Checkpoint Before LGU Reporting / Export Layer

## Current Branch

- fix/operator-staff-membership-layer

## Current LGU Console Capabilities

### Roles

SILENT_LGU_ANALYTICS:
- read-only
- can inspect compliance data
- can inspect manifest queue
- cannot approve manifests
- cannot deny/return manifests
- cannot record payments
- cannot issue receipts
- cannot edit fee programs

LGU_APPROVER:
- can read LGU compliance queue
- can inspect manifest queue
- can approve UNDER_REVIEW manifests
- can return/deny UNDER_REVIEW manifests
- cannot bulk approve
- cannot bypass confirmation guardrails

LGU_FEE_EDITOR:
- fee-related role
- must not gain manifest approval power

ADMIN:
- governed full approval access

## Manifest Submissions

Manifest Submissions is now the official LGU approval workbench.

Current features:
- DB-backed submitted manifest queue
- manifest reference
- request status
- manifest status
- operator
- activity title
- member count
- submitted timestamp
- latest action
- request ID
- View Details
- Approve Manifest
- Return / Deny
- Action Closed for non-UNDER_REVIEW records
- Approval Locked for read-only users

## Manifest Detail Review

Current features:
- selected manifest request via manifestRequestId
- manifest reference
- request status
- operator
- manifest status
- member count
- schedule
- submission notes
- latest action
- approval boundary
- manifest members section
- approval history timeline
- close details link

## Approval Guardrails

Approve Manifest:
- available only to ADMIN / LGU_APPROVER
- available only for UNDER_REVIEW requests
- requires typing APPROVE
- blocked if confirmation is missing/wrong

Return / Deny:
- available only to ADMIN / LGU_APPROVER
- available only for UNDER_REVIEW requests
- requires reason
- reason must be at least 10 characters

Hard preserved rule:
- no silent approval
- no bulk approval

## Approval History

Approval History Timeline shows:
- action type
- action notes
- actor full name
- actor email
- actor role
- actor user ID fallback
- timestamp

Source of truth:
- ManifestApprovalAction
- User actor enrichment

## Intelligence Layer

LGU Intelligence panel now includes Manifest Approval Event Dashboard.

Current features:
- approval events count
- approved actions count
- returned/denied count
- latest actor
- latest event list
- manifest reference
- activity title
- notes
- actor name/email/role
- timestamp

Important doctrine:
- Intelligence is read-only
- Intelligence is not the official approval queue
- Manifest Submissions remains the official workbench

## Backend Sources Currently Used

LGU read endpoints:
- GET /api/v1/osp-qr/compliance/manifest-submissions
- GET /api/v1/osp-qr/inter-island/compliance-summary
- GET /api/v1/osp-qr/compliance/fee-clearance-exceptions
- GET /api/v1/osp-qr/compliance/fee-receipts
- GET /api/v1/osp-qr/compliance/fee-payment-audits
- GET /api/v1/osp-qr/compliance/fee-programs
- GET /api/v1/osp-qr/inter-island/overdue-movements

Manifest mutation endpoints:
- POST /api/v1/manifest-approvals/:requestId/approve
- POST /api/v1/manifest-approvals/:requestId/deny

Allowed approval roles:
- ADMIN
- LGU_APPROVER

Excluded:
- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

## Current Technical Notes

Known operational note:
- stale .next chunk errors can occur after heavy page rewrites
- fix by stopping frontend, correcting ownership if needed, deleting .next, and rebuilding

Known local hard reset:
- stop port 3000
- stop next dev
- correct frontend/.next ownership if needed
- delete frontend/.next and frontend/.turbo
- rebuild frontend
- restart frontend dev server

## What Is Not Yet Built

Do not claim these are done:
- formal export/reporting layer
- PDF generation
- CSV export
- DOT/LGU official report templates
- date-range filters
- actor filters
- formal reporting backend endpoint
- signed report audit trail
- notification integration
- typed return-for-correction workflow
- dedicated confirmation modal
- timestamp formatting/localization

## Recommended Next Lane

Lane 3-L — LGU Reporting / Export Readiness Audit

Recommended scope:
- audit existing data sources
- define report categories
- define official LGU/DOT report fields
- identify which reports are safe to generate from current DB state
- identify missing data fields
- avoid creating export buttons until schema/report doctrine is locked

Potential report families:
1. Manifest Approval Report
2. Manifest Submission Queue Report
3. Approval Event Report
4. Fee Clearance Exception Report
5. Fee Receipt Register
6. Payment Audit Register
7. Overdue Movement Signal Report
8. Inter-Island Compliance Summary

## Hard Rules For Next Chat / Next Lane

1. Do not add export buttons before report doctrine is locked.
2. Do not generate official DOT/LGU reports from incomplete data.
3. Do not expose approve/deny in Intelligence panels.
4. Do not expose approve/deny to SILENT_LGU_ANALYTICS.
5. Do not expose approve/deny to LGU_FEE_EDITOR.
6. Do not bulk approve manifests.
7. Do not silently approve manifests.
8. Keep Manifest Submissions as the official approval workbench.
9. Keep Intelligence as read-only summary.
10. Keep backend as the source of truth.
