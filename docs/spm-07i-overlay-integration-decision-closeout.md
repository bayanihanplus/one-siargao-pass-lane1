# SPM-07I — Passport Map Overlay Integration Decision Closeout

## Status

CLOSED.

Decision: keep the Passport Map overlay scaffold parked.

## Context

SPM-07H created an isolated overlay scaffold component:

- `frontend/src/spm/map/PassportMapOverlayScaffold.tsx`

The scaffold uses:

- `frontend/src/spm/map/siargaoMapCoordinates.ts`
- `frontend/public/spm/siargao-passport-map-placeholder.svg`

The scaffold is intentionally not wired into `/traveler/passport-map`.

## Decision

Do not integrate the overlay scaffold into the production traveler Passport Map page yet.

The overlay scaffold remains a controlled internal foundation only.

## Reason

The current traveler Passport Map page is already production-grade mobile UI.

Integrating a placeholder/test map into the production traveler page now would create credibility risk.

Even if the placeholder is labeled as non-final, a low-trust traveler may read the page visually as unfinished.

The correct move is to preserve the current production-grade traveler UI and keep the overlay scaffold parked until a final owned illustrated map asset exists.

## Confirmed Hard State

- Overlay scaffold exists.
- Coordinate config exists.
- Placeholder SVG exists.
- Scaffold remains isolated.
- Placeholder SVG is not imported into app routes.
- No final illustrated map has been generated.
- No final overlay has been wired.
- No Prisma coordinate fields have been added.

## Allowed Later Lane

Future lane:

- `SPM-07J — Final Map Asset Readiness / Art Direction Pack`

Only after final map asset readiness should the project move to:

- `SPM-07K — Final Map Overlay Integration`

## Not Allowed Now

- No placeholder map in traveler production UI.
- No final map overlay integration.
- No schema coordinate storage.
- No Google Maps base.
- No broad Passport Map redesign.
- No typography refinement mixed into SPM-07.
- No booking/payment/operator/admin expansion mixed into map work.

## Next Best Lane

The best next visible production improvement is:

- `SPM-06J — Passport Trails Typography Refinement`

Reason:

The Passport Trails UI is already production-grade mobile app quality, but typography hierarchy and text rhythm can be improved without changing backend contracts, map foundations, or product logic.

## Hard Decision

SPM-07 is parked after scaffold foundation.

Proceed next to SPM-06J typography refinement only as a narrow UI polish lane.
