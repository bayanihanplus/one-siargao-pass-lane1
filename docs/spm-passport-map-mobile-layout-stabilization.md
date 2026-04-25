# SPM Passport Map — Mobile Layout Stabilization

## Status

Accepted for now after browser QA.

## Scope

This lane stabilizes the traveler-facing Siargao Passport Map page at:

- `/traveler/passport-map`
- `frontend/app/traveler/passport-map/page.tsx`

## Final Browser-Accepted State

The current SPM page keeps:

- Siargao Passport Map header
- approved SPM hero visual direction
- map-first hero composition
- governed SPM metrics
- Your Trails preview block
- Verified Stops preview block
- Recommended Next Stop card
- mobile bottom navigation

## CTO Notes

This lane had multiple browser-driven layout attempts. The accepted state is a stabilization checkpoint, not a permanent full visual lock for all SPM screens.

The final accepted decision is to stop reopening the hero/layout loop inside this lane and move forward.

## Final Accepted Adjustments

- Hero became a controlled mobile visual stage.
- Banner/map visual direction was preserved.
- Metrics are positioned inside the hero stage.
- Your Trails preview cards were compacted.
- Bottom navigation behavior was adjusted to prevent the worst overlay issue.
- Excess experimental spacing was removed.
- Backend, API, QR, payment, manifest, and Passport Trails data contracts were not changed.

## Locked / Untouched

- Backend
- API
- QR identity doctrine
- Payment logic
- Manifest logic
- Passport Trails routes
- SPM data contract
- OSP single QR doctrine

## Hard Rule

Future SPM visual work must be handled in a separate lane with a fresh visual target. Do not reopen the same hero/layout loop inside this commit.
