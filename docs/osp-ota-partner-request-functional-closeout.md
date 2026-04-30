# OSP OTA Partner Request Functional Closeout

## Purpose

This lane verifies that the `/ota` partner request form is not just visual. It confirms the public form writes to the database through the backend partner application endpoint.

## Verified Flow

Frontend:

- `/ota`
- Partner request form
- POST to `/api/v1/partners/apply`

Backend:

- `POST /api/v1/partners/apply`
- Creates or returns `PartnerAccount`
- Writes `PartnerApiAuditLog`

Database:

- `PartnerAccount` exists
- Latest public request status is `PENDING_REVIEW` or existing reviewed status
- `PartnerApiAuditLog` exists
- `PartnerApiToken` count remains `0`

## Hard Boundary

The public partner request form must not create API tokens.

Partner review is required before sandbox, production API access, token issuance, or booking-to-pass integration.

OSP remains the pass and QR lifecycle authority.
