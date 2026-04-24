# Lane 3-G — LGU Manifest Approval Confirmation Guardrails Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Completed

LGU manifest approval actions now require deliberate guardrails before mutation.

## Frontend Guardrails

### Approve Manifest

LGU_APPROVER / ADMIN must type:

- APPROVE

before approval can proceed.

If the typed confirmation is missing or incorrect:

- action is blocked
- user is redirected back with action=approve-confirm-required

### Return / Deny

LGU_APPROVER / ADMIN must provide a reason.

Rules:

- reason is required
- reason must be at least 10 characters

If the reason is missing or too short:

- action is blocked
- user is redirected back with action=deny-reason-required

## Still Preserved

SILENT_LGU_ANALYTICS:

- remains read-only
- cannot approve
- cannot deny
- sees Approval Locked

LGU_APPROVER:

- can approve UNDER_REVIEW requests only after typed confirmation
- can return/deny UNDER_REVIEW requests only with reason

APPROVED / DENIED requests:

- show Action Closed

## Runtime Verified

Confirmed visually:

- Approve Manifest requires typed APPROVE
- Return / Deny requires reason
- UNDER_REVIEW rows still expose governed actions for LGU_APPROVER
- closed requests do not expose mutation buttons
- read-only LGU remains locked

## Current Doctrine

Government approval must not be accidental.

Manifest approval is now guarded by deliberate operator intent before backend mutation.

## Not Yet Done

Still pending:

- dedicated confirmation modal
- richer typed return-for-correction workflow
- approval history timeline
- notification integration
- audit export/reporting
- formal LGU approval event dashboard

## Hard Rules

1. Do not expose approve/deny to SILENT_LGU_ANALYTICS.
2. Do not expose approve/deny to LGU_FEE_EDITOR.
3. Do not allow bulk approval.
4. Do not silently approve manifests.
5. Require deliberate confirmation for approval.
6. Require a clear reason for return/deny.
7. Every approve/deny must remain backend-governed through ManifestApprovalAction.
