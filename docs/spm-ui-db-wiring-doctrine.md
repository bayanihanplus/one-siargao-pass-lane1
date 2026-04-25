# SPM UI DB Wiring Doctrine — Locked Preview-to-Data Contract

Date: 2026-04-25
Scope: Traveler route `/traveler/passport-map`
File: `frontend/app/traveler/passport-map/page.tsx`

## Purpose

The current Siargao Passport Map UI sections are preview-only visual components, but every card must remain structurally wireable to governed backend data.

The UI must not become a static marketing mockup. It must evolve into a data-backed traveler journey layer connected to OSP/SPM records.

## Locked Rule

Preview components may use hardcoded placeholder props during UI reconstruction, but every card must map cleanly to future database/API fields.

No future patch may introduce visual-only structures that cannot be backed by DB fields.

## Sections Covered

1. Your Trails cards
2. Verified Stops cards
3. Continue Your Journey recommendation card

## Your Trails Data Contract

Future source should be a traveler-specific trails API, such as:

`GET /api/v1/traveler/spm/trails`

Required fields:

- `trail_id`
- `trail_name`
- `trail_slug`
- `trail_status`
  - `active`
  - `locked`
  - `completed`
- `stops_total`
- `stops_completed`
- `progress_percentage`
- `thumbnail_url`
- `icon_key`
- `unlock_rule`
- `display_order`

UI mapping:

- Card title = `trail_name`
- Progress label = `stops_completed / stops_total completed`
- Progress bar = `progress_percentage`
- Locked state = `trail_status === "locked"`
- Image/visual = `thumbnail_url` or controlled fallback by `icon_key`
- Click route = `/traveler/passport-map/trails/{trail_slug}` when route exists

## Verified Stops Data Contract

Future source should be a traveler-specific verified stops API, such as:

`GET /api/v1/traveler/spm/verified-stops`

Required fields:

- `stop_id`
- `stop_name`
- `stop_slug`
- `stop_type`
- `subtitle`
- `verification_status`
  - `verified`
  - `pending`
  - `rejected`
- `verified_at`
- `verification_source`
  - `QR`
  - `stamp`
  - `admin`
  - `operator`
- `image_url`
- `trail_id`
- `display_order`

UI mapping:

- Card title = `stop_name`
- Subtitle = `subtitle`
- Badge = `verification_status`
- Image = `image_url` or controlled fallback
- Badge checkmark shown only when `verification_status === "verified"`
- Click route = `/traveler/passport-map/stops/{stop_slug}` when route exists

## Continue Your Journey Data Contract

Future source should be a recommendation API, such as:

`GET /api/v1/traveler/spm/next-stop`

Required fields:

- `recommended_stop_id`
- `recommended_stop_name`
- `recommendation_reason`
- `distance_or_eta_label`
- `image_url`
- `linked_trip_id`
- `linked_trail_id`
- `cta_route`

UI mapping:

- Heading = `recommended_stop_name`
- Eyebrow = recommendation category or `Recommended Next Stop`
- Supporting text = `recommendation_reason`
- ETA label = `distance_or_eta_label`
- CTA href = `cta_route`
- Image = `image_url` or controlled fallback

## Backend Governance Rule

Verified Stops must not be trusted from frontend state.

A stop may only be treated as verified if backend records confirm:

- traveler identity
- trip/pass relationship
- stop/trail relationship
- QR/stamp/check-in event
- timestamp
- verification source
- audit trail

## Anti-Drift UI Rule

The current UI may stay preview-only, but labels must not claim live verification, live trail completion, or live pass achievement until API data is connected.

Allowed preview labels:

- Preview-only
- Visual preview
- Real trail state comes later
- Real verification requires governed records

Disallowed before backend wiring:

- You completed this trail
- Verified by OSP
- Reward unlocked
- Live checkpoint confirmed
- Official stamp issued

## Future Wiring Sequence

1. Preserve current approved visual layout.
2. Extract placeholder card props into local arrays.
3. Replace local arrays with API fetch.
4. Add loading/empty/error states.
5. Add backend verification logic.
6. Add audit-safe click routes.
7. Remove preview-only warnings only after real DB/API wiring is complete.

## Locked Implementation Rule

No future UI patch should redesign approved sections while wiring data.

Data wiring must preserve the approved card geometry, spacing, and visual hierarchy unless a separate UI approval is given.
