# Lane 4-C — Approved SPM UI Doctrine Hardening Scope

Branch:
- fix/operator-staff-membership-layer

Current HEAD before Lane 4-C:
- ce5e4b0 add traveler passport map route shell

## 1. Purpose

Lane 4-C converts the approved Siargao Passport Map mobile UI direction into the existing traveler route:

- /traveler/passport-map

This lane is visual/doctrine hardening only.

The approved UI is treated as:
- visual doctrine
- navigation doctrine
- emotional engagement doctrine
- traveler-facing SPM positioning doctrine

It is not yet treated as:
- live progress truth
- live Passport Stamp truth
- live completion truth
- DOT/LGU official reporting truth
- database-backed traveler achievement truth

## 2. Approved UI Direction

The approved SPM UI must remain:
- premium
- map-first
- progress-driven
- emotionally rewarding
- mobile-first
- tied to One Siargao Pass identity
- tied to Passport Trails
- visually distinct from a generic dashboard
- visually distinct from a generic Google Maps clone

Approved public identity:
- Siargao Passport Map
- Follow the Trails. Build the Journey.

## 3. Route Lock

Traveler route remains:

- /traveler/passport-map

Do not create alternate routes in this lane:
- no /spm
- no /passport-map
- no /traveler/spm

## 4. Micro-Slice Import Plan

Lane 4-C must be imported section by section.

Approved sequence:
1. 4-C.0 — Lock this scope document
2. 4-C.1 — Approved SPM frame only
3. 4-C.2 — Hero copy block only
4. 4-C.3 — Map visual area only
5. 4-C.4 — Legend + status summary
6. 4-C.5 — Your Trails cards
7. 4-C.6 — Verified Stops cards
8. 4-C.7 — Continue Your Journey card
9. 4-C.8 — Visual polish / spacing / final build

Each slice must pass frontend build before commit.

## 5. Allowed UI Sections

Lane 4-C may include:

1. SPM mobile shell
2. Premium header
3. Logo badge
4. Notification icon placeholder
5. Map-first hero card
6. Passport Map visual area
7. Legend
8. Trail status summary cards
9. Passport Trails preview cards
10. Verified stops preview section
11. Continue journey card
12. Bottom navigation
13. Buttons for existing safe destinations:
   - /
   - /traveler/trips
   - /traveler/pass
   - /traveler/passport-map

## 6. Doctrine-Safe Placeholder Rule

Any value that looks like progress, verification, completion, stamp history, or unlocked trail count must remain clearly non-official until backed by real backend records.

High-risk values include:
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

These may be rendered only as preview/mock UI labels inside the route shell and must not:
- create DB records
- create QR events
- create Passport Stamp events
- imply official trail completion
- feed reporting
- feed DOT/LGU audit
- mutate traveler state

## 7. Font / Typography Rule

The approved typography should be matched as closely as possible using safe web font stacks unless an official font file or licensed web font is explicitly added later.

Allowed temporary font strategy:
- Serif title feel: Georgia, Times New Roman, Times, serif
- Handwritten accent feel: Bradley Hand, Segoe Print, Comic Sans MS, cursive
- UI/body text: system font stack

Hard rule:
- Do not add external font dependencies in Lane 4-C.
- Do not share or embed font files.
- Do not block UI hardening because exact licensed font is unavailable.
- Preserve the approved typography direction and hierarchy.

## 8. Forbidden Scope

Lane 4-C must not include:

1. No map library installation.
2. No Leaflet / Mapbox / Google Maps dependency.
3. No geolocation logic.
4. No DB writes.
5. No API mutations.
6. No QR scan creation.
7. No Passport Stamp event creation.
8. No official trail completion logic.
9. No real traveler progress calculations.
10. No traveler-safe SPM backend API yet.
11. No LGU report activation.
12. No official report numbering.
13. No VPS work.
14. No backend changes.
15. No Prisma changes.
16. No dependency changes unless explicitly approved later.

## 9. Button Wiring Rule

Buttons may be visually present.

Only safe links are allowed:
- Home -> /
- Trips -> /traveler/trips
- Pass -> /traveler/pass
- Map -> /traveler/passport-map

Any future action button such as:
- Start Trail
- Verify Stop
- Scan QR
- Claim Stamp
- Complete Trail
- Unlock Trail

must not create any event or mutation in this lane.

If included visually, it must be disabled, non-mutating, or clearly marked as not yet active.

## 10. Acceptance Criteria

Lane 4-C is accepted only if:

1. frontend build passes after each slice.
2. /traveler/passport-map exists.
3. approved SPM visual doctrine is materially represented.
4. no backend files are changed.
5. no Prisma files are changed.
6. no dependencies are added.
7. no QR/stamp/progress mutation exists.
8. OSP home shell remains untouched except prior link wiring.
9. route is mobile-first and readable.
10. no generic dashboard drift appears.
11. each slice can be independently reviewed and rolled back.

## 11. Hard Risks / Failure Points

1. Full UI import may recreate OSP-style debugging loops.
2. JSX nesting mistakes are likely if the full mockup is pasted at once.
3. Typography, map, stats, trail cards, and bottom nav have different failure modes.
4. Beautiful UI can accidentally normalize fake progress.
5. Hardcoded completed/verified values could create audit risk.
6. Map visual may be mistaken for live map behavior.
7. QR and Passport Stamps must remain compliance-backed, not cosmetic.
8. The approved UI must not become a generic dashboard or weak gamification layer.

## 12. Final Hard Decision

Lane 4-C is a frontend-only visual doctrine hardening lane.

The import must be done section by section.

Real SPM backend data wiring comes later.

Final order remains:
1. Route shell
2. Approved UI conversion by micro-slices
3. Traveler-safe read API
4. Real data wiring
5. Stamp/progress mutation only after governed backend contract
