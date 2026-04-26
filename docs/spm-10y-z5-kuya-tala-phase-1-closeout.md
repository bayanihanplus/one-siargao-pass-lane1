# SPM-10Y-Z5 — Kuya Tala™ Phase 1 Closeout Proof

## Scope

This closeout documents the completed Kuya Tala™ Phase 1 chat hardening lane for One Siargao Pass / Siargao Passport Map.

## Locked Assistant Identity

**Kuya Tala™ — Your Siargao Journey Guide**

Kuya Tala™ is the governed traveler assistant for One Siargao Pass and Siargao Passport Map. It helps travelers understand trip readiness, QR/pass status, Passport Trails, Passport Map, payments, Emergency & Safety guidance, official alerts, and responsible Siargao movement.

## Phase 1 Runtime Boundary

Kuya Tala™ Phase 1 is text-chat only.

The assistant does not include:
- microphone input
- speech-to-text
- voice interface
- audio capture
- public KB upload
- public guardrail controls
- live emergency dispatch
- LGU broadcast sending
- pass issuance
- payment mutation
- booking creation
- guide assignment
- stamp unlock mutation

## Final Surface Doctrine

Full chat surface:
- `/traveler/settings?panel=assistant`

Contextual entry CTAs:
- `/traveler/passport-map`
- `/traveler/passport-trails`
- `/traveler/passport-trails/[trailSlug]`
- `/traveler/trips`
- `/traveler/trips/[tripId]`
- `/traveler/pass`
- `/traveler/payments/[intentId]`
- `/traveler/emergency-safety`

Contextual route pattern:
- `/traveler/settings?panel=assistant&topic=map`
- `/traveler/settings?panel=assistant&topic=trail`
- `/traveler/settings?panel=assistant&topic=trips`
- `/traveler/settings?panel=assistant&topic=trip`
- `/traveler/settings?panel=assistant&topic=pass`
- `/traveler/settings?panel=assistant&topic=payment`
- `/traveler/settings?panel=assistant&topic=emergency`

## Completed Build Proof

Completed commits:
- `78ee437 add kuya tala contextual traveler entry ctas`
- `7dcf31a make kuya tala greeting topic aware`
- `f49d98d refine kuya tala first greeting`
- `30b8fff route kuya tala replies by topic`
- `e9e1ed1 route backend kuya tala replies by topic`

## Frontend Proof

Files:
- `frontend/src/traveler-assistant/KuyaTalaChatBox.tsx`
- `frontend/src/traveler-assistant/KuyaTalaEntryButton.tsx`
- `frontend/app/traveler/settings/page.tsx`
- `frontend/app/api/traveler/assistant/chat/route.ts`

Locked behavior:
- full chat is rendered only in Traveler Settings
- contextual entry buttons route to the assistant with `topic`
- first greeting is traveler-facing, not system-facing
- topic-specific greeting and placeholder are supported
- session storage is scoped by topic
- chat sends `{ message, topic }`
- no speech or microphone runtime is present in assistant files

## Backend Proof

Files:
- `backend/src/modules/assistant/assistant.service.ts`
- `backend/src/modules/assistant/assistant.controller.ts`

Locked behavior:
- `POST /assistant/chat/messages` accepts message payload
- backend reads `topic`
- backend routes deterministic answer by topic and message intent
- backend returns received topic in payload
- runtime mode remains `DETERMINISTIC_CONTEXT_AWARE_NO_LLM_NO_SPEECH`

## Topic Behaviors

### Pass / QR
Kuya Tala™ may explain visible pass and QR status.

It must not:
- issue a pass
- approve a pass
- regenerate QR
- claim missing records exist

### Payment
Kuya Tala™ may explain visible payment state, booking status, FX/display estimates where available, and safe next steps.

It must not:
- mark payment as paid
- refund
- override records
- claim settlement without proof

### Passport Trails / Passport Map
Kuya Tala™ may explain trail families, verified stops, QR/stamp logic, and route movement.

It must not:
- unlock stamps
- mark stops visited
- confirm live pricing
- confirm operator assignment
- claim booking readiness without records

### Trip / Trips
Kuya Tala™ may explain visible trip readiness, trip status, QR/pass context, ingress/egress logic, and next traveler actions.

It must not:
- approve clearance
- mutate trip records
- invent missing travel records

### Emergency & Safety
Kuya Tala™ may guide travelers to safety information and OSP records.

It must not:
- dispatch responders
- claim help is coming
- create emergency incidents without backend records
- confirm LGU/police/coast guard/medical notification without proof

### Official Safety Broadcast
Kuya Tala™ may explain visible official alerts.

It must not:
- create broadcasts
- approve broadcasts
- send SMS/push/email
- confirm LGU acknowledgement or delivery without backend logs

## Browser QA Acceptance

Manual QA passed by user after topic-aware greeting and backend topic routing work.

Validated expected behavior:
- contextual assistant entry renders
- first greeting is traveler-facing
- topic greeting works
- no speech UI
- boundaries are preserved
- backend deterministic response routing is wired

## Current Locked Head

Latest confirmed lane head after this closeout:

`e9e1ed1 route backend kuya tala replies by topic`

## Closeout Status

Kuya Tala™ Phase 1 chat foundation is considered locked for this lane.

Future lanes should not reopen Phase 1 basics unless a regression is found.

Recommended next future lane:
- Kuya Tala™ action button routing polish
- assistant response action links mapped to real traveler routes
- backend response contract typing
- browser QA screenshot proof pack
- later Phase 2 AI/RAG architecture only after governance approval
