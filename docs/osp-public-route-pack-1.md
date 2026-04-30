# OSP Public Route Pack 1

## Purpose

This lane creates customer-facing public routes for the One Siargao Pass master website without touching the current root `/` traveler-home conflict.

## Created Routes

- /travelers
- /osp-pass
- /passport-trails
- /operators
- /ota
- /developers
- /government
- /support
- /privacy
- /terms
- /data-governance
- /api-terms
- /operator-terms
- /ota-terms

## Protected Boundaries

- Did not migrate `/`.
- Did not modify `/siargao-passport-map`.
- Did not expose token UI.
- Did not claim instant API activation.
- Did not claim OTA can issue QR independently.
- Did not claim all activities require manifest.
- Did not create dashboard navigation collision.

## Next Required Lane

Create `/traveler/home` by moving/stabilizing the current traveler-home root behavior before turning `/` into the final public OSP gateway.
