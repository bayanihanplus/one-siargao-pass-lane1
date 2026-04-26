# SPM-10Y — Kuya Tala™ Phase 2 AI Chat Architecture

## Status

Phase 2 architecture doctrine. Not live AI runtime.

## Assistant Identity

Kuya Tala™ — Your Siargao Journey Guide.

Kuya Tala™ is the trusted One Siargao Pass assistant that helps travelers understand trip readiness, QR/pass status, Passport Trails, verified stops, payments, and responsible movement across Siargao.

Tone: calm local guide + digital readiness assistant. Warm, but not clownish, not comedic, not a generic travel mascot.

## Phase 1 Current Foundation

- GET /assistant/traveler-context
- GET /assistant/knowledge-spine
- POST /assistant/chat/messages
- POST /assistant/kb-submissions
- Kuya Tala™ panel in Traveler Settings
- Traveler page exposes chat entry only
- KB intake belongs in Admin Console only for Operator-led Tours KB and Future LGU-led KB
- No live AI generation yet
- No unapproved KB ingestion into trusted answers

## Admin-Only KB Intake Lanes

### Operator-led Tours KB

Used for approved operator tour operations only after review.

Required normalization:
- operator identity
- tour title
- route/stops
- operating schedule rules
- safety controls
- inclusions/exclusions
- pricing/commercial notes
- QR/stamp eligibility
- cancellation/exception rules
- approval status
- effective date

### Future LGU-led KB

Used for LGU advisories, compliance, access, safety, local regulations, and official movement guidance only after review.

Required normalization:
- issuing office
- jurisdiction/scope
- advisory category
- official text
- effective date
- expiry/review date
- approval authority
- public/traveler visibility
- escalation rule

## Retrieval Architecture

Future runtime should retrieve from:

1. Traveler live DB context
2. OSP/SPM locked doctrine
3. Approved SPM trail family/node records
4. Approved operator-led tour KB
5. Approved LGU-led KB
6. Language pack layer
7. Safety/compliance guardrails

## Chat Runtime Rules

The assistant may:
- explain current trip readiness
- explain QR/pass status
- guide Passport Trail choices
- explain verified stops
- explain payment state from DB
- explain Siargao tourism and access planning
- route traveler to correct OSP page

The assistant must not:
- approve clearance
- issue passes
- mark payment paid
- submit or approve manifests
- create bookings
- assign guides/operators
- unlock stamps without QR/stamp event
- claim live route/schedule/fare/weather/advisory truth without verified source
- treat submitted KB as official until approved

## Speech-to-Text Later

Speech-to-text should only be layered after:
- text chat shell is stable
- chat endpoint has runtime policy
- conversation storage exists
- privacy/permission UX exists
- mobile fallback exists

## Hard Decision

Phase 2 AI chat must be retrieval-grounded and governed. No generic chatbot behavior.


## Public Traveler Assistant Boundary

Traveler-facing assistant pages must not expose KB upload, KB intake, or guardrail management controls.

Traveler-facing page may show:
- Kuya Tala™ greeting
- chat message shell
- trip/context summary
- safe knowledge coverage

Admin Console may show:
- KB upload/intake
- operator-led KB review
- future LGU-led KB review
- guardrails
- approval workflow
- publishing controls
