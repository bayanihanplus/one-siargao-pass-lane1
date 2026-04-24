# Lane 3-I — LGU Manifest Approval Actor Enrichment Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Completed

LGU Manifest Approval History Timeline now shows enriched actor identity instead of raw user ID only.

## Backend

Updated LGU manifest submissions read payload to enrich approval actions with actor details.

Each approval action now exposes:

- actionType
- actionNotes
- actedByUserId
- actor.fullName
- actor.email
- actor.primaryRole
- createdAt

Actor data is read-only and sourced from:

- User

Approval action data remains sourced from:

- ManifestApprovalAction

## Frontend

Updated Approval History Timeline to render:

- actor full name
- actor email
- actor role
- action timestamp
- action notes

## Runtime Verified

Confirmed:

- LGU manifest queue still renders
- Approval Access remains ENABLED for LGU_APPROVER
- approve guardrail remains active
- approved rows show Action Closed
- approval history timeline can now display enriched actor identity

## Current Doctrine

LGU/DOT users should not audit raw user IDs alone.

Approval history must identify who acted in human-readable form while preserving backend source-of-truth IDs.

## Not Yet Done

Still pending:

- dedicated confirmation modal
- richer return-for-correction workflow
- notification integration
- export/reporting
- formal LGU approval event dashboard
- timestamp formatting/localization

## Hard Rules

1. Actor enrichment is read-only.
2. Do not mutate User records from LGU read panels.
3. Do not mutate ManifestApprovalAction from LGU read panels.
4. Do not expose approve/deny to SILENT_LGU_ANALYTICS.
5. Do not expose approve/deny to LGU_FEE_EDITOR.
6. Keep approval action history tied to backend ManifestApprovalAction records.
