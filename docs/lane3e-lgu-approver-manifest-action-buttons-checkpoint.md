# Lane 3-E — LGU Approver Manifest Action Buttons Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Completed

LGU Console Manifest Submissions panel now supports governed manifest actions.

### Read Roles

SILENT_LGU_ANALYTICS:

- can read manifest queue
- can inspect manifest records
- sees Approval Locked
- cannot approve
- cannot deny

LGU_APPROVER:

- can read manifest queue
- can inspect manifest records
- can approve UNDER_REVIEW manifest approval requests
- can return/deny UNDER_REVIEW manifest approval requests
- sees Action Closed for non-UNDER_REVIEW requests

ADMIN:

- retains governed approval access

### Backend

LGU_APPROVER can read:

- GET /api/v1/osp-qr/compliance/manifest-submissions?limit=10

LGU_APPROVER can act through existing governed endpoints:

- POST /api/v1/manifest-approvals/:requestId/approve
- POST /api/v1/manifest-approvals/:requestId/deny

### Frontend

LGU Console now renders:

- Approval Access = ENABLED for LGU_APPROVER
- Approve Manifest button for UNDER_REVIEW rows
- Return / Deny button for UNDER_REVIEW rows
- Action Closed for APPROVED / DENIED rows
- Approval Locked for SILENT_LGU_ANALYTICS

### Runtime Verified

Verified visually:

- LGU_APPROVER session displays enabled approval access
- UNDER_REVIEW manifest rows show Approve Manifest and Return / Deny
- APPROVED manifest rows show Action Closed
- approve action redirects back with action=approved
- SILENT_LGU_ANALYTICS remains read-only

## Current Doctrine

Manifest Submissions is the official LGU compliance queue.

Notifications must not replace the manifest queue.

Approval actions must be role-governed and backend-enforced.

## Not Yet Done

Still pending:

- View Details modal
- confirmation modal before approve/deny
- typed return-for-correction flow
- reason field for denial/return
- approval history display hardening
- notification integration
- audit export/reporting

## Hard Rules

1. Do not expose approve/deny to SILENT_LGU_ANALYTICS.
2. Do not expose approve/deny to LGU_FEE_EDITOR.
3. Do not allow bulk approval.
4. Do not silently approve manifests.
5. Every approve/deny must go through backend ManifestApprovalAction creation.
6. Manifest approval must remain part of the compliance spine.
