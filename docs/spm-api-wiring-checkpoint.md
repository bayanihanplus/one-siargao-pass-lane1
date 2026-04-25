# SPM API Wiring Checkpoint

Date: 2026-04-25
Branch: fix/operator-staff-membership-layer

## Locked State

SPM traveler UI is now wired to a traveler-safe backend preview endpoint.

## Backend

Added:

GET /api/v1/spm/traveler-preview

Role:

TRAVELER

Source files:

- backend/src/modules/spm/spm.controller.ts
- backend/src/modules/spm/spm.service.ts

Admin endpoints remain protected:

- GET /api/v1/spm/trail-families
- GET /api/v1/spm/trail-nodes

## Frontend

Updated:

- frontend/app/traveler/passport-map/page.tsx

Behavior:

- server-side fetches traveler preview data
- uses authenticated token from existing server-auth helper
- preserves fallback UI if API fails
- no visual layout redesign during API wiring

## Validated

- Traveler endpoint returned preview payload
- Admin trail-families endpoint still works
- Backend build passed
- Frontend build passed
- Working tree clean after commit e3ac36a

## Still Preview Only

Metrics remain preview values until real traveler stamp/progress records exist.

Do not claim live completion, live verification, official stamp issuance, or rewards until governed data exists.

## Next Possible Lanes

1. Real SPM progress schema
2. Passport stamp scan event model hardening
3. Traveler SPM API from real stamp/checkpoint records
4. Bottom nav/safe-area polish
5. SPM official font/text asset intake
