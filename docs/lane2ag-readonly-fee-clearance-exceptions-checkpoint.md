# Lane 2-AG — Read-Only Fee Clearance Exceptions Checkpoint

## Current Branch

- fix/operator-staff-membership-layer

## Locked Purpose

Fee-clearance enforcement now blocks inter-island departure when generated fee charges, payment, and receipt requirements are not satisfied.

Lane 2-AG exposes fee-clearance blocked exceptions through a read-only compliance endpoint.

## Completed

### API

Added:

- GET /api/v1/osp-qr/compliance/fee-clearance-exceptions?limit=10

Allowed roles:

- ADMIN
- SILENT_LGU_ANALYTICS
- LGU_FEE_EDITOR

## Filter Logic

The endpoint reads:

- ComplianceException

It filters:

- resolutionNotes contains FEE_CLEARANCE_REQUIRED

Reason:

- ComplianceException.exceptionType is enum-based
- current stored exceptionType remains DOT_LGU_REVIEW_REQUIRED
- fee-clearance semantic reason is preserved inside resolutionNotes

## Returned Fields

The endpoint returns:

- id
- qrEventId
- travelerUserId
- tripId
- operatorUserId
- checkpointId
- exceptionType
- severity
- resolutionStatus
- resolutionNotes
- resolvedByUserId
- resolvedAt
- createdAt

## Expected Runtime Evidence

Latest fee-clearance exception should show:

- exceptionType: DOT_LGU_REVIEW_REQUIRED
- severity: HIGH
- resolutionStatus: OPEN
- resolutionNotes includes FEE_CLEARANCE_REQUIRED
- resolutionNotes includes Current status: NO_CHARGES

## Current Doctrine

Fee-clearance exception visibility is read-only.

This does not resolve exceptions.

This does not create a dashboard.

This does not export reports.

This does not create a formal FEE_CLEARANCE_REQUIRED enum value yet.

## Not Yet Done

Still pending:

- dedicated FEE_CLEARANCE_REQUIRED exception taxonomy if needed
- exception dashboard filtering in frontend
- LGU/DOT reporting/export
- receipt PDF/export
- traveler-facing receipt view

## Hard Rules

1. Do not mutate exceptions from this endpoint.
2. Do not use frontend filtering as security.
3. Keep SILENT_LGU_ANALYTICS read-only.
4. Do not add export/reporting inside this lane.
5. Do not formalize a new enum value without a separate taxonomy lane.
