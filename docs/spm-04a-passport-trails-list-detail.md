# SPM-04A Passport Trails List + Detail

## Status

LOCKED.

## Scope

This lane creates the first traveler-facing Passport Trails™ route set after SPM governed-progress hardening.

## Added Backend Routes

- GET /api/v1/spm/passport-trails
- GET /api/v1/spm/passport-trails/:trailSlug

## Added Frontend Routes

- /traveler/passport-trails
- /traveler/passport-trails/[trailSlug]

## Hard Boundary

This lane is discovery/progress only.

It does not add:

- pricing
- checkout
- trail bookings
- guide assignment
- operator fulfillment
- manifest logic
- inter-island movement logic
- DIY trail builder

## Data Integrity

The list/detail pages use official SPM discovery data from:

- SpmTrailFamily
- SpmTrailTrack
- SpmTrailNode
- SpmTrailVariant

No fake traveler progress is introduced.
