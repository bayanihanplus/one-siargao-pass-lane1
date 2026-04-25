# SPM-07G — Passport Map Overlay Component Audit Closeout

## Status

PASSED AS AUDIT.

SPM-07G was executed after SPM-06I closeout and the public checkout-copy refinement.

This was an audit-only lane. No UI patch, overlay component, placeholder import, schema mutation, or final map generation was performed.

## Confirmed Previous Closeout

Confirmed recent commits:

- `c719578 refine passport trails public readiness copy`
- `feee8c8 document spm passport trails ui qa closeout`

## Map Foundation Files

Confirmed existing files:

- `frontend/src/spm/map/siargaoMapCoordinates.ts`
- `frontend/public/spm/siargao-passport-map-placeholder.svg`

## Coordinate Config Audit

Coordinate config is sufficient for a first overlay scaffold.

The current coordinate model includes:

- `nodeCode`
- `mapRegion`
- `mapX`
- `mapY`
- `labelX`
- `labelY`
- `labelAlign`
- `displayPriority`
- `insetGroup`
- `routeGroup`

Current seeded nodes:

- `GUYAM_ISLAND`
- `DAKU_ISLAND`
- `NAKED_ISLAND`

Current seeded route group:

- `TRI_ISLAND_JOINER`

## Placeholder Asset Audit

The placeholder SVG is acceptable only as an internal layout-testing scaffold.

It is clearly marked:

- `NON-FINAL PLACEHOLDER`
- `LAYOUT TEST ONLY`
- `NOT FINAL GEOGRAPHY ARTWORK`
- `DO NOT USE AS PRODUCTION MAP`

The placeholder must not be presented as final geography artwork.

## Import Audit

Confirmed:

- Coordinate config remains parked.
- Placeholder SVG remains parked.
- No UI import detected for the coordinate config or placeholder asset.

## Existing Passport Map Relationship

The existing `/traveler/passport-map` page already contains production-grade mobile shell behavior, Passport Trails routing relationship, bottom navigation, preview cards, progress logic, QR/passport stamp language, and visual placeholder disclosure.

The current page has many existing absolute-positioned visual elements and SVG usage, so future overlay work must be isolated and controlled.

## Build Proof

Frontend build passed:

- `npm --prefix frontend run build`

## Decision

SPM-07G is closed as audit passed.

Next allowed lane:

- `SPM-07H — Passport Map Overlay Scaffold Foundation`

## SPM-07H Scope Boundary

Allowed:

- Create a separate overlay scaffold component under `frontend/src/spm/map/`.
- Use existing `siargaoMapCoordinates.ts`.
- Render only the Tri-Island Joiner nodes.
- Keep explicit non-final/internal layout test language if placeholder asset is used.
- Keep overlay work isolated from backend schema.
- Keep typography refinement parked.

Not allowed:

- No final illustrated map generation.
- No Google Maps base.
- No Prisma coordinate fields.
- No broad Passport Map redesign.
- No fake production geography claim.
- No mixed typography polish.
- No backend payment/pricing/booking expansion.
- No operator/guide/admin workflow expansion.

## Hard Decision

Proceed to SPM-07H only if the goal is a controlled overlay scaffold.

Do not proceed directly to final map art, final map overlay, or schema coordinate storage.
