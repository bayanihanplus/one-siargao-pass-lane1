# OSP Partner / OTA API Schema Foundation

## Purpose

This schema foundation supports the One Siargao Pass master website and API partner architecture.

It adds the database layer required before exposing any real OTA/API partner portal, token management UI, or booking-to-pass intake workflow.

## Doctrine Alignment

OTA, travel agency, hotel desk, affiliate, and API partners are provisioning and distribution partners only.

They do not become QR/pass lifecycle authorities.

OSP remains the issuer and governing authority for traveler pass and QR identity.

## Added Models

### PartnerAccount

Represents approved or pending external partners such as:

- OTA
- International OTA
- Travel agency
- Hotel desk
- Operator
- Affiliate
- Government partner
- Internal partner

### PartnerApiToken

Stores scoped, revocable partner API tokens.

Only token hashes are stored.

Token UI must not be exposed publicly until backend guards and token issuance services are implemented.

### OtaTripIntakeEvent

Snapshots OTA/API booking-to-pass intake events.

This prevents invisible partner behavior and supports idempotency, audit, duplicate control, and manual review.

### OtaWebhookEvent

Snapshots inbound partner webhook activity.

### PartnerApiAuditLog

Captures token events, partner approval/suspension, intake actions, webhook handling, QR issuance requests, and QR status lookups.

## Hard Rules

1. OTA partners cannot issue sovereign QR credentials.
2. OTA partners can only request OSP-issued pass/QR workflows.
3. API token creation must be authenticated, scoped, and audited.
4. Public website copy may describe approved partner access, but must not expose fake token UI.
5. Partner booking intake must use external booking reference and partner account identity for duplicate control.
6. No public route should claim production API activation until the backend service layer exists.

## Next Backend Layer

After this schema foundation:

1. Add Partner module.
2. Add partner account application endpoint.
3. Add admin approval controls.
4. Add token guard/service.
5. Add OTA trip intake endpoint.
6. Wire trip intake to ensureOspPassForTrip().
7. Add partner API audit writes.

## Local DB Migration Status

Migration created/applied locally:

`backend/prisma/migrations/20260429122132_osp_partner_api_foundation`

Verified through Prisma Client with local development database:

- partnerAccount
- partnerApiToken
- otaTripIntakeEvent
- otaWebhookEvent
- partnerApiAuditLog

## Next Controlled Backend Step

Build Partner backend module foundation:

1. PartnerAccount application endpoint
2. Admin approval/suspension endpoints
3. Partner API audit writer
4. Token service skeleton
5. Token guard design
6. OTA trip intake endpoint skeleton

Do not expose public token creation UI until backend guard/service exists.
