# OSP LGU Intelligence Partner / OTA Table Detection Fix

## Problem

The LGU Intelligence API was live and DB-backed, but Partner / OTA data returned zero because the service only checked Prisma model-style names such as `PartnerAccount`.

The actual database may use mapped physical names such as:

- `partner_accounts`
- `partner_api_audit_logs`
- `partner_api_tokens`

## Fix

The LGU Intelligence service now:

- expands table name candidates
- supports snake_case physical table names
- supports partner account/audit/token table variants
- resolves column candidates such as `partnerType` and `partner_type`
- resolves event columns such as `eventType` and `event_type`

## Expected Result

`GET /api/v1/lgu/intelligence/overview` should now detect Partner / OTA records where the physical tables exist.

## Protected Boundary

This fix only improves LGU intelligence aggregation.

It does not expose raw OTA commercial data, API token secrets, operator financial data, or unrestricted traveler personal data.
