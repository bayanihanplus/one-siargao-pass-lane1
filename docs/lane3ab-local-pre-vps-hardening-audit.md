# Lane 3-AB — Local Pre-VPS Hardening Audit

## Current Branch

- fix/operator-staff-membership-layer

## Purpose

Local stabilization audit before any VPS deployment or official activation workflow.

This lane is hardening-only.

No new feature expansion.
No official report number generation.
No official PDF.
No signature/seal.
No official activation.

## Audit Scope

Validated:

- backend build
- frontend build
- Prisma schema validation
- Prisma migration status
- Prisma client generation
- official report registry seed repeatability
- official registry disabled state
- report export audit read path
- draft CSV export audit write path
- draft print audit write path
- LGU read-only role guard
- LGU approver role gate

## Expected Protected State

Official reporting remains disabled:

- enabledReportTypeCount: 0
- enabledJurisdictionCount: 0
- officialActivation: DISABLED

Draft reporting remains active:

- backend draft JSON report
- backend draft CSV export
- browser print/save-as-PDF draft path
- ReportExportAudit rows for CSV and PRINT_VIEW

## Security / Governance Checks

SILENT_LGU_ANALYTICS:

- can read
- cannot approve
- fake approve returns 403

LGU_APPROVER:

- can pass role gate
- fake approve returns 404 after role gate
- real approve remains governed by manifest approval endpoint and request state

## Current Doctrine

The system is locally stable enough for VPS preparation only after this audit passes.

Do not use VPS as the first place to discover migration, seed, build, or role failures.

## Not Yet Done

Still pending:

- VPS deployment checklist
- production environment variable audit
- production database backup plan
- production migration plan
- official activation workflow doctrine
- official report number generator
- server-side PDF generation
- signature/seal
- official report button

## Hard Rules

1. Do not activate official reporting yet.
2. Do not generate official report numbers yet.
3. Do not add official PDF yet.
4. Do not add signature/seal yet.
5. Do not remove DRAFT warning.
6. Do not deploy until local hardening passes.
