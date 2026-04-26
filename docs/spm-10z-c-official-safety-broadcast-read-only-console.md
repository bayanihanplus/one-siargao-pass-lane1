# SPM-10Z-C — Admin/LGU Official Safety Broadcast Read-Only Console

## Status

Read-only UI surface only.

## Routes

- /admin/official-safety-broadcasts
- /lgu/official-safety-broadcasts

## Scope

The console may display:

- product doctrine
- access doctrine
- canonical Siargao municipality registry
- broadcast categories
- severity levels
- state machine
- target scopes
- channel readiness
- backend spine audit
- minimum audit fields
- hard stops before live send

## Explicitly Not Included

- no send button
- no create broadcast form
- no approval workflow
- no SMS provider
- no push provider
- no email provider
- no traveler alert inbox write path
- no live delivery claims

## Hard Rule

Official Safety Broadcast live sending must wait for backend persistence, approval controls, delivery adapters, and immutable audit logs.
