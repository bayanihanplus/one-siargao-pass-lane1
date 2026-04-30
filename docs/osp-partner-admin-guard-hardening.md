# OSP Partner Admin Guard Hardening

## Purpose

This lane protects partner admin/internal endpoints before any frontend or public partner portal work proceeds.

## Hardened Endpoints

Guarded:

- GET /partners/admin/applications
- POST /partners/admin/applications/:id/approve
- POST /partners/admin/applications/:id/suspend
- POST /partners/admin/applications/:id/reject
- POST /partners/admin/api-tokens

Public:

- POST /partners/apply
- GET /partners/applications/:id/status

## Smoke Test Requirements

The hardening smoke test verifies:

1. Public partner application works.
2. Public partner status lookup works.
3. Admin list endpoint returns 403 without admin/staff role.
4. Admin list endpoint works with a dev admin role header.
5. Admin approval works with a dev admin role header.
6. Token creation remains blocked by design.
7. Partner audit logs are written.

## Hard Stop

Do not expose a frontend token UI yet.

Do not expose partner admin UI until role/auth integration is finalized with the platform’s real authenticated admin session, not only the dev role header.
