# OSP Traveler Language Coverage Audit — Lane 14L

## 1. Locked CTO Diagnosis

One Siargao Pass currently has a real DB-backed language foundation, but it is not yet a fully multilingual traveler UX.

Current status:

- Language packs exist.
- Traveler preferred language persists.
- Dictionary API exists.
- Settings consumes limited dictionary keys.
- OSP Home consumes limited dictionary keys.
- Filipino proof values exist.
- Missing translation values correctly fall back to English default text.

However, traveler-facing language rendering is not complete.

Do not move to FX.
Do not move to AI runtime.
Do not claim multilingual readiness.
Do not continue one-string random patches.

The next build sequence must convert traveler screens through a controlled dictionary key map.

## 2. Current Confirmed Translation Keys

Current DB seed keys:

- home.hero.title
- home.cta.showQr
- home.cta.passportMap
- settings.title
- settings.language.title
- trips.title
- tripDetail.title
- paymentDetail.title
- spm.title

Current Filipino proof values:

- settings.title = Mga Kontrol ng Traveler
- settings.language.title = Piliin ang travel language mo
- home.hero.title = Trip Aktibo. Pass Handa.
- home.cta.showQr = Ipakita ang QR
- home.cta.passportMap = Buksan ang Passport Map

## 3. Audit Scope

Traveler files audited:

- frontend/app/page.tsx
- frontend/app/traveler/settings/page.tsx
- frontend/app/traveler/pass/page.tsx
- frontend/app/traveler/trips/page.tsx
- frontend/app/traveler/trips/[tripId]/page.tsx
- frontend/app/traveler/payments/[intentId]/page.tsx
- frontend/app/traveler/passport-map/page.tsx

Build proof passed before this document.

## 4. Classification Rules

Every traveler-facing string must be classified before conversion.

### A. Already dictionary-driven

Strings already wired through dictionary helper or language pack API.

### B. Hardcoded and must become dictionary key

Static traveler-facing text, CTA labels, helper copy, tab labels, card labels, notification labels, aria labels, empty-state messages, and shell text.

### C. Dynamic backend value and should not be translated directly

Trip IDs, pass codes, manifest IDs, booking references, timestamps, traveler names, operator names, payment references, QR tokens, and backend-returned canonical records.

### D. Status enum requiring label mapping

Payment status, clearance status, pass status, trip status, manifest status, booking status, validation state, stamp state, and any operational enum.

These need mapping keys, not loose inline translation.

Example:

- status.payment.PAID
- status.payment.PENDING
- status.pass.ISSUED
- status.clearance.APPROVED

### E. Brand/proper noun that should remain fixed

- One Siargao Pass
- OSP
- Siargao Passport Map
- Passport Trails
- DOT-LGU where institutionally required
- Official product names unless doctrine later requires localized display names

### F. Technical/internal text that should be hidden or demoted

Dev route labels, internal route index labels, debug helper text, raw backend error phrasing, and admin/operator branch strings inside root page that are not traveler UX.

## 5. Screen Findings

## 5.1 OSP Home — frontend/app/page.tsx

### Already dictionary-driven

- home.hero.title
- home.cta.showQr
- home.cta.passportMap

### Must become dictionary keys

Hero state copy:

- home.hero.active.title
- home.hero.active.body
- home.hero.registrationRequired.title
- home.hero.registrationRequired.body
- home.hero.manifestRequired.title
- home.hero.manifestRequired.body
- home.hero.passPending.title
- home.hero.passPending.body
- home.hero.clearancePending.title
- home.hero.clearancePending.body
- home.hero.paymentPending.title
- home.hero.paymentPending.body
- home.hero.empty.title
- home.hero.empty.body

Header / shell:

- home.header.officialTravelerPass
- home.header.notifications.ariaLabel
- home.pass.openQr.ariaLabel

Traveler CTA / cards / labels should be audited deeper in Lane 14M because the grep only catches obvious static strings.

### Should remain fixed

- One Siargao Pass

### Internal/admin/operator branch note

The root page contains non-traveler ADMIN and OPERATOR fallback route labels. Do not mix those into traveler language coverage unless a later admin/operator localization lane is opened.

## 5.2 Traveler Settings — frontend/app/traveler/settings/page.tsx

### Already dictionary-driven

- settings.title
- settings.language.title

### Must become dictionary keys

Access cards:

- settings.language.eyebrow
- settings.language.body
- settings.currency.eyebrow
- settings.currency.title
- settings.currency.body
- settings.assistant.eyebrow
- settings.assistant.title
- settings.assistant.body
- settings.notifications.eyebrow
- settings.notifications.title
- settings.notifications.body

Panel navigation:

- settings.nav.language
- settings.nav.currency
- settings.nav.assistant
- settings.nav.notifications

Language names:

Language labels may remain canonical for now, but later need locale display policy.

## 5.3 Traveler Pass — frontend/app/traveler/pass/page.tsx

### Must become dictionary keys

Pass state copy:

- pass.state.noTrip.title
- pass.state.noTrip.body
- pass.state.ready.title
- pass.state.ready.body
- pass.state.onRecord.title
- pass.state.pending.title
- pass.state.pending.body

Bottom nav labels:

- nav.home
- nav.myTrips
- nav.passportMap
- nav.logout

QR empty state:

- pass.qr.unavailable

### Dynamic values not directly translated

- pass code
- traveler name
- validity dates
- QR token
- pass status enum output

## 5.4 Traveler Trips — frontend/app/traveler/trips/page.tsx

The basic grep returned no obvious hits. This does not prove the page is complete.

Lane 14O must inspect manually for:

- empty states
- trip cards
- status labels
- CTA labels
- aria labels
- bottom nav labels
- helper copy
- date/status formatting

## 5.5 Trip Detail — frontend/app/traveler/trips/[tripId]/page.tsx

### Must become dictionary keys

- tripDetail.members.empty

### Dynamic values not directly translated

- trip ID
- traveler name
- member names
- booking references
- dates
- backend records

Lane 14O must inspect deeper because the grep likely missed JSX strings split across components.

## 5.6 Payment Detail — frontend/app/traveler/payments/[intentId]/page.tsx

### Status enum label mapping required

Do not translate inline status strings directly. Create status mapping keys.

Required keys:

- paymentDetail.status.verified
- paymentDetail.status.pending
- paymentDetail.status.attentionNeeded
- paymentDetail.status.record

These should map from payment status values, not from ad hoc UI labels.

## 5.7 SPM — frontend/app/traveler/passport-map/page.tsx

### Already seeded

- spm.title

### Must become dictionary keys

Aria labels:

- spm.nav.backHome.ariaLabel
- spm.notifications.open.ariaLabel
- spm.continueJourney.card.ariaLabel
- spm.verifiedStops.cards.ariaLabel
- spm.verifiedStops.viewAll.ariaLabel
- spm.passportTrails.cards.ariaLabel
- spm.passportTrails.viewAll.ariaLabel
- spm.metrics.preview.ariaLabel

Static node labels:

- spm.stop.dakuIsland.name
- spm.stop.dakuIsland.subtitle
- spm.stop.guyamIsland.name
- spm.stop.guyamIsland.subtitle
- spm.stop.cloud9.name
- spm.stop.cloud9.subtitle

Important: official stop names can remain fixed if doctrine requires canonical place names. Subtitles like "Verified stop" and "World Famous Wave" should be localizable.

## 6. Required Shared Runtime Direction

Before converting many screens, create a reusable traveler translation pattern.

Recommended:

- Shared dictionary type
- Shared `t(dictionary, key, fallback)` helper
- Optional status label helper
- Per-screen dictionary fetch where needed
- No client-side fake translation
- No hardcoded translated strings in component logic
- English fallback must remain available

Do not introduce FX or AI helper runtime into this lane.

## 7. Conversion Sequence

### 14M — OSP Home Full Dictionary Conversion

Convert only traveler-facing Home copy.

Include:

- hero state variants
- key CTAs
- status labels where safe
- journey card labels
- helper strip copy
- aria labels

Do not touch admin/operator root branches unless required for compile safety.

### 14N — Traveler Pass Dictionary Conversion

Convert:

- pass state copy
- QR empty state
- pass screen shell labels
- nav labels if not already shared

### 14O — Trips + Trip Detail Dictionary Conversion

Convert:

- trips title
- trip list cards
- trip empty states
- trip detail title
- member empty states
- trip action labels
- status enum mappings

### 14P — Payment Detail Dictionary Conversion

Convert:

- payment title
- payment state labels
- payment helper copy
- payment action labels
- payment status enum mapping

### 14Q — SPM Dictionary Conversion

Convert:

- SPM hero title/subtitle/labels
- Passport Trails cards
- verified stops subtitles
- CTA labels
- aria labels
- progress labels

Respect approved SPM UI. No redesign.

### 14R — Translation Seed Expansion

Add English defaults and Filipino proof values for all converted keys.

Do not add weak machine translations for all languages yet.

### 14S — Language Runtime Checkpoint

Verify:

- EN renders
- FIL renders
- fallback works for missing values
- text length does not break mobile shell
- build passes
- dictionary API returns expected key coverage
- no key drift
- no FX started prematurely

Only after 14S should FX be reopened.

## 8. Hard Stop Rules

- No FX before language coverage is mapped and converted.
- No AI runtime before language coverage is mapped and converted.
- No fake translation.
- No translation of backend records.
- No loose enum text translation.
- No random one-string patches.
- No UI redesign during language conversion.
- No breaking icon logic.
- No weakening mobile app production shell.
- No VPS.
