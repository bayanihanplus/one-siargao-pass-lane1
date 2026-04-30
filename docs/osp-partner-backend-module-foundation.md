# OSP Partner Backend Module Foundation

## Purpose

This backend module creates the controlled foundation for OSP partner onboarding and future OTA/API integration.

It supports public partner applications and internal partner review actions while keeping token issuance intentionally blocked until token guards, scope policy, and admin approval flow are fully wired.

## Added Backend Files

- backend/src/modules/partners/partners.module.ts
- backend/src/modules/partners/partners.controller.ts
- backend/src/modules/partners/partners.service.ts

## Added Routes

Public application:

- POST /partners/apply
- GET /partners/applications/:id/status

Admin/internal review foundation:

- GET /partners/admin/applications
- POST /partners/admin/applications/:id/approve
- POST /partners/admin/applications/:id/suspend
- POST /partners/admin/applications/:id/reject

Blocked by design:

- POST /partners/admin/api-tokens

## Hard Rules

1. Token creation UI must not be exposed publicly yet.
2. OTA/API partners remain provisioning partners only.
3. OSP remains QR/pass issuer and lifecycle authority.
4. Partner application is PENDING_REVIEW by default.
5. Duplicate active applications are controlled by contact email + partner type.
6. Partner API activity must be audit-written.
7. Admin endpoints still require final role guard hardening before public/admin UI exposure.

## Next Required Hardening

1. Add proper admin/role guard to admin partner endpoints.
2. Add token hashing and token issuance only after guard policy is confirmed.
3. Add OTA trip intake endpoint.
4. Wire intake to ensureOspPassForTrip().
5. Add public /ota and /developers pages with customer-facing copy only.
6. Do not expose API token UI until backend authorization is finished.
