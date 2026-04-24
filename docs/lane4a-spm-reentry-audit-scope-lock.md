# Lane 4-A — SPM Build Re-Entry Audit / Scope Lock

Branch:
- fix/operator-staff-membership-layer

Latest confirmed checkpoint:
- c411030 document lane 3ab local pre vps hardening audit

## 1. CTO Decision

Lane 4-A is approved as the correct re-entry lane before any SPM UI import.

The approved Siargao Passport Map UI is accepted as visual doctrine, but it must not be imported as live functional truth until the route, scope, data contract, and anti-fake-progress rules are locked.

Next implementation sequence:
1. Lane 4-A.1 — Document SPM re-entry audit / scope lock
2. Lane 4-B — Create traveler SPM route shell only
3. Lane 4-C — Convert approved SPM UI into doctrine-safe route shell
4. Lane 4-D — Expand traveler-safe SPM read API contract
5. Lane 4-E — Wire real SPM progress, stamps, nodes, and trail data progressively

## 2. Build Proof

Backend build:
- PASSED
- Command: npm --prefix backend run build

Frontend build:
- PASSED
- Command: npm --prefix frontend run build
- Generated frontend routes: 21

No build blocker exists before SPM re-entry.

## 3. Current SPM Backend Reality

SPM backend module exists.

Confirmed files:
- backend/src/modules/spm/spm.controller.ts
- backend/src/modules/spm/spm.module.ts
- backend/src/modules/spm/spm.service.ts

SPM module is registered in:
- backend/src/app.module.ts

Current backend endpoints:
- GET /api/v1/spm/trail-families
- GET /api/v1/spm/trail-nodes

Current critical limitation:
- SPM controller is currently ADMIN-only.
- It uses DevAuthGuard + RolesGuard.
- It has @Roles('ADMIN') at controller level.
- Therefore, existing SPM endpoints are not traveler-ready APIs yet.

Hard lock:
- Do not wire traveler UI directly to admin-only SPM endpoints.
- A traveler-safe read API contract must be created later.

## 4. Current SPM Prisma Foundation

Existing SPM enums include:
- SpmTrailFamilyCode
- SpmTrailNodeType
- SpmNodeRequirementType
- SpmApprovalStatus

Existing locked trail family enum values:
- ISLAND_HOPPING
- SURF_EXPLORER
- NORTH_SIARGAO
- INLAND_DISCOVERY
- CULTURE_COMMUNITY
- SUNSET_SCENIC
- ADVENTURE
- RETURN_TRAVELER_CONTINUITY

Existing SPM models:
- SpmTrailFamily
- SpmTrailTrack
- SpmTrailNode
- SpmTrailVariant
- SpmTrailVariantNode

Assessment:
- SPM is backend-founded.
- SPM is not yet commercially complete.
- SPM does not yet contain the full Super Final Doctrine schema.
- The current foundation is enough for route and read-contract planning.
- It is not enough for real traveler progress, verified stops, or trail booking UX.

## 5. QR / Passport Stamp / Compliance Spine Reality

Existing QR/compliance enums include:
- TRAVELER_INGRESS_SCAN
- TRAVELER_EGRESS_SCAN
- INTER_ISLAND_DEPARTURE_SCAN
- INTER_ISLAND_ARRIVAL_SCAN
- BOAT_BOARDING_SCAN
- BOAT_DISEMBARKATION_SCAN
- ACTIVITY_CHECK_IN_SCAN
- ACTIVITY_CHECK_OUT_SCAN
- OPERATOR_ACCESS_SCAN
- GUIDE_VALIDATION_SCAN
- PARTNER_NODE_CHECK_IN_SCAN
- PASSPORT_STAMP_SCAN
- MANIFEST_PARTICIPATION_SCAN
- COMPLIANCE_EXCEPTION_SCAN

Existing QR/compliance models include:
- OspQrEvent
- OspCheckpoint
- OspVessel
- InterIslandMovement
- ComplianceException

Existing SPM linkage fields:
- OspQrEvent.trailBookingId
- InterIslandMovement.trailBookingId

Assessment:
- The QR/compliance amendment is already structurally represented in the codebase.
- QR is correctly positioned as more than Passport Stamp.
- QR can support ingress, egress, inter-island movement, boat boarding, disembarkation, activity check-in/out, manifest participation, and compliance exception records.
- This is strong enough to preserve DOT/LGU audit doctrine while SPM traveler UI is being introduced.

Hard lock:
- Passport Stamps must remain an output of governed validation.
- QR events are compliance and intelligence records, not decorative UI events.
- Do not create fake stamp progress in frontend.

## 6. Current Frontend Reality

Existing traveler frontend routes:
- /traveler/pass
- /traveler/trips
- /traveler/trips/[tripId]
- /traveler/payments/[intentId]

No existing SPM traveler route:
- No /traveler/passport-map
- No /traveler/spm
- No /passport-map
- No /spm

Current OSP home references:
- Hero CTA says "Open Passport Map"
- Continue Your Journey card says "Passport Map"
- Current Passport Map card links to /traveler/trips
- There is no valid SPM route target yet

Recommended route:
- /traveler/passport-map

Reason:
- SPM is traveler-facing.
- SPM must stay tied to traveler trip/pass identity.
- SPM should not become a generic public map route yet.

## 7. Approved SPM UI Doctrine

The approved UI is accepted as visual doctrine.

Approved characteristics:
- Premium
- Map-first
- Journey-oriented
- Progress-driven
- Emotionally rewarding
- Mobile-first
- Tied to One Siargao Pass identity
- Uses Passport Trails as discovery/progress layer

Approved public identity:
- Siargao Passport Map
- Follow the Trails. Build the Journey.

Approved bottom navigation direction:
- Map
- Trails
- Pass
- Profile

Hard lock:
- Do not dilute the approved UI.
- Do not redesign the SPM visual language.
- Do not turn SPM into a generic dashboard.
- Do not turn SPM into a random places directory.
- Do not turn SPM into fake gamification.

## 8. Approved UI Data Risk

The approved UI contains high-risk values if hardcoded as real state:
- 5 Trails Unlocked
- 3 Places Verified
- 42% Journey Progress
- Pass Active
- Completed
- Available
- Locked
- Verified Stops
- Recommended Next Stop
- General Luna Explorer
- Island Discovery Trail
- North Coast Adventure
- Daku Island
- Cloud 9
- Magpupungko
- Alegria Beach
- Pacifico

These values must not be represented as live traveler truth unless backed by real backend records.

Hard lock:
- These may be used only as doctrine-safe visual placeholders during shell build.
- They must not create DB records.
- They must not imply real verified progress.
- They must not be used for official completion logic.
- They must not trigger Passport Stamp records.
- They must not feed DOT/LGU reporting.

## 9. Lane 4-B Scope Lock — Traveler SPM Route Shell Only

Next code lane:
- Lane 4-B — Create Traveler SPM Route Shell Only

Route to create:
- frontend/app/traveler/passport-map/page.tsx

Allowed in Lane 4-B:
1. Create the route file.
2. Render a controlled placeholder SPM shell.
3. Use approved SPM identity text.
4. Keep the page mobile-first.
5. Include doctrine-safe message that SPM is being prepared.
6. Link back to:
   - /
   - /traveler/pass
   - /traveler/trips
7. Build proof backend and frontend.
8. Commit only the route shell and any minimal home link wiring if included.

Forbidden in Lane 4-B:
1. No full approved UI import yet.
2. No fake map.
3. No fake stamps.
4. No fake verified stops.
5. No fake progress percentages.
6. No map library install.
7. No DB writes.
8. No SPM API mutation.
9. No QR scan creation.
10. No Passport Stamp event creation.
11. No official LGU report work.
12. No VPS work.

## 10. Lane 4-C Scope Lock — Approved UI Hardening

Lane 4-C may start only after Lane 4-B route shell is built and committed.

Allowed in Lane 4-C:
1. Convert approved UI into React/Next route structure.
2. Preserve approved visual doctrine.
3. Use static doctrine-safe presentation data only where clearly non-official.
4. Keep all progress/stamp/verified values separated from backend truth.
5. No DB mutation.
6. No fake completion engine.

Hard rule:
- The approved UI is visual doctrine first.
- Real SPM data wiring comes later.

## 11. Lane 4-D Scope Lock — Traveler-Safe SPM Read API

Future traveler-safe API candidates:
- GET /api/v1/passport-map
- GET /api/v1/passport-trails
- GET /api/v1/passport-progress/me
- GET /api/v1/passport-stamps/me

Do not use existing admin-only /api/v1/spm endpoints directly for traveler UI.

Traveler-safe API must respect:
- current user identity
- trip/pass context
- approved nodes only
- stamp eligibility only from governed sources
- no fake self-claimed progress
- no admin-only leakage

## 12. Hard Risks / Failure Points

1. Beautiful UI can accidentally normalize fake progress.
2. Admin-only SPM endpoints are not traveler-safe.
3. SPM schema is partial versus the Super Final Doctrine.
4. Existing SPM frontend route does not exist yet.
5. Passport Map links currently route to trips.
6. Map library installation would widen scope too early.
7. Hardcoded completed/verified values could create audit risk.
8. Full UI import before route/data lock could cause doctrine drift.
9. QR and Passport Stamps must remain compliance-backed, not cosmetic.
10. DOT/LGU audit posture requires strict separation between visual placeholder and official validation records.

## 13. Final Hard Decision

Proceed to Lane 4-B only after this document is committed.

Lane 4-B must create:
- /traveler/passport-map

Lane 4-B must not create:
- real progress
- real stamps
- real verified stops
- real trail completion
- real Passport Stamp event creation
- real inter-island movement changes
- map library dependency
- official report activation
- VPS deployment

Final decision:
- Build route shell first.
- Import approved UI second.
- Wire real data third.
- Expand backend contract only after shell discipline is locked.
