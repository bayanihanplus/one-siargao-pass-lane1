# OSP Traveler Next Pages Mobile UI Audit + Production Lane Map

Date: 2026-04-25  
Branch: fix/operator-staff-membership-layer

## Audit Purpose

The OSP Home Screen is now moving toward a mobile-app-grade traveler entry screen. The next risk is screen inconsistency: downstream traveler pages may still feel like plain web/admin pages.

This audit defines the controlled next lanes for all traveler-facing pages after the Home Screen.

Covered routes:

1. /traveler/pass
2. /traveler/passport-map
3. /traveler/trips
4. /traveler/trips/[tripId]
5. /traveler/payments/[intentId]

## Global Mobile UI Doctrine

All traveler pages must behave like mobile app screens, not desktop web pages.

### Required Screen Rules

- Max content width should generally align with the Home shell: around 430px.
- Page padding should be mobile-first, normally 14px–18px.
- Sections must use rounded app-card shells.
- Cards must use consistent elevation, border, and color logic.
- No wide 920px desktop layout for traveler-facing mobile-first screens.
- CTAs must have clear hierarchy.
- Icons must be semantic, not decorative filler.
- Statuses must use controlled semantic color logic.
- Avoid generic browser-link appearance.
- Avoid plain HTML/admin-page visual language.
- Preserve real backend data wiring.
- Do not fake verification, payment, QR, or pass state.

## Global Color System

### Core Brand Colors

- Deep Navy: #19305a
- Teal Primary: #16bfd3
- Teal Dark: #0e7490
- App Background: #f8fcff
- Neutral Border: #dbe8ef
- Muted Text: #64748b

### Semantic Colors

- Approved / Active / Verified: #16a34a
- Payment / Receipt / Financial: #d97706
- Passport Map / Trails: #0ea5b7
- Trip / Schedule / Movement: #2563eb
- Warning / Pending: #b45309
- Blocked / Error: #dc2626

### Button Doctrine

Primary buttons:
- Background: #16bfd3 or #0e7490
- Text: #ffffff
- Rounded pill or rounded card button
- Used for main action only

Secondary buttons:
- Background: #ffffff or rgba(255,255,255,0.08)
- Border: #dbe8ef or rgba(255,255,255,0.45)
- Text: #19305a or #ffffff on dark hero
- Used for secondary navigation

Positive / ready state:
- Green accent #16a34a
- Do not overuse as full background

Payment action:
- Amber accent #d97706
- Use only for payment-related shells/statuses

Danger / blocked:
- Red #dc2626
- Use only for denial, invalid QR, blocked pass, failed payment

---

# Page 1 — /traveler/pass

## Current Role

Operational traveler pass screen. It should show:
- pass readiness
- active QR credential
- pass state
- SPM bridge
- trip/payment/status summary

## Current Risk

The page has been improved but still started as a web-style page. It needs final mobile-app shell hardening.

## Production UI Direction

This page should feel like the detailed version of the Home active pass card.

## Required Improvements

### Mobile Shell

- Set mobile-first max width around 430px.
- Reduce broad desktop spacing.
- Use compact section rhythm.
- Make QR credential centered and visually premium.
- Reduce page from “report page” feeling to “traveler credential screen.”

### Header

- Keep “Official Traveler Pass.”
- Use compact h1.
- Add optional small official logo later if needed.
- Top nav pills must remain icon-driven and compact.

### Pass Readiness

- Keep state icon.
- State shell should be clear:
  - Pass Ready = green
  - Pass Pending = amber
  - Pass Blocked = red
- Avoid oversized web card.

### QR Credential

- QR must remain backend-driven.
- No fake QR fallback as valid.
- QR shell should be premium but compact.
- Add label: Active Pass QR Credential.
- QR should fit mobile viewport.

### SPM Bridge

- CTA should clearly go to /traveler/passport-map.
- Use map/trail icon.
- Keep bridge copy short.
- Do not turn it into a marketing block.

## Lane

OSP UI Lane 8 — Traveler Pass Mobile Production Shell

## Acceptance Criteria

- Looks like mobile app screen.
- No 920px desktop layout.
- QR fits cleanly.
- Pass Readiness is immediately understandable.
- SPM bridge is visible but not oversized.
- No backend changes.

---

# Page 2 — /traveler/passport-map

## Current Role

Second screen after OSP Home / Pass. It is the traveler-facing SPM journey screen.

## Current Risk

SPM page has approved visual direction but needs consistency with newly hardened OSP Home:
- header consistency
- card shell consistency
- bottom nav consistency
- real-vs-preview state clarity
- mobile screen height balance

## Production UI Direction

This page should feel like a distinct “journey map” screen, but still part of the OSP mobile app.

## Required Improvements

### Header

- Keep Siargao Passport Map branding.
- Use official SPM icon if available.
- Keep tagline: Follow the Trails. Build the Journey.
- Notification icon should match OSP Home style.

### Hero Map

- Maintain approved visual direction.
- Keep dynamic JSX text, not baked into background.
- Do not overcompress the map.
- Ensure legend and stats do not overpower the island image.

### Trail Cards

- Continue using 3-card geometry.
- Real progress appears first.
- Padded fallback cards must be visibly secondary.
- Use semantic color:
  - active trail = teal
  - completed = green
  - locked = slate/neutral

### Verified Stops

- Use compact mobile cards.
- Real verified stops must come from governed QR/stamp records.
- No fake verified stops.
- Use soft green/teal verification markers.

### Recommended Next Stop

- Should feel like a conversion CTA.
- CTA color: teal primary.
- Should not create fake navigation if no real route exists.

## Lane

OSP UI Lane 9 — SPM Mobile App Screen Consistency Hardening

## Acceptance Criteria

- SPM remains visually aligned to approved UI.
- No generic travel app look.
- Real data and preview fallback clearly separated.
- Cards remain mobile compact.
- No route or backend widening.

---

# Page 3 — /traveler/trips

## Current Role

Traveler trip list and trip records entry page.

## Current Risk

Likely still web/plain list style. This is dangerous because Trips is a core navigation destination from:
- Home Continue Journey
- Bottom Nav
- Payments placeholder route
- pass/trip status flows

## Production UI Direction

This page should feel like “My Trips” inside a travel pass app.

## Required Improvements

### Mobile Shell

- Max width 430px.
- App header with title “My Trips.”
- Summary card at top:
  - active trip count
  - upcoming trip count
  - pass-ready indicator if available

### Trip Cards

Each trip card should show:
- trip title/date range
- clearance status
- payment status
- pass status
- primary action: View Trip
- secondary action: Open Pass if eligible

### Color Logic

- Active trip = teal shell
- Approved clearance = green badge
- Pending = amber badge
- Blocked/denied = red badge
- Completed = neutral/slate

### Buttons

Primary:
- View Trip = teal button

Secondary:
- Open Pass = white shell, navy text
- Payment Required = amber if needed

## Lane

OSP UI Lane 10 — Traveler Trips List Mobile Production Screen

## Acceptance Criteria

- No plain table/list UI.
- Trip cards are scannable.
- Traveler can identify the active trip quickly.
- Buttons are not generic links.
- No fake trips.

---

# Page 4 — /traveler/trips/[tripId]

## Current Role

Trip detail page. This is the operational truth screen for one traveler trip.

## Current Risk

This page can easily become a backend data dump. It must be redesigned into mobile sections.

## Production UI Direction

Trip detail should act as the traveler’s operational trip command screen.

## Required Improvements

### Page Header

- Trip status headline.
- Date range.
- Route/location context.
- Back to Trips pill.

### Core Status Stack

Cards:
- Registration
- Manifest
- Clearance
- Payment
- Pass

Use same semantic shell colors as Home status cards.

### Booking + Payment Section

- Show current booking reference.
- Show payment state.
- Show payment action if unpaid.
- Do not expose raw IDs as primary UI unless in debug/details section.

### Pass + QR Section

- If pass active: CTA to /traveler/pass.
- If not issued: show next requirement.
- If blocked: show clear reason.

### SPM Bridge

- CTA to /traveler/passport-map if trip is linked to SPM progress.
- Keep as secondary.

### Raw Technical Details

- If needed, collapse behind “Technical Details.”
- Do not show raw IDs as main traveler UX.

## Lane

OSP UI Lane 11 — Traveler Trip Detail Mobile Production Screen

## Acceptance Criteria

- Trip detail does not feel like API output.
- Primary traveler actions are obvious.
- Raw IDs are not visually dominant.
- Status logic is color-coded and consistent.
- No backend widening unless a missing field blocks UI truth.

---

# Page 5 — /traveler/payments/[intentId]

## Current Role

Payment detail/receipt screen for a specific payment intent.

## Current Risk

Payment screens require trust. A generic payment detail page will reduce confidence.

## Production UI Direction

This should feel like a secure transaction receipt / payment status screen.

## Required Improvements

### Header

- Payment Status headline.
- Payment reference.
- Paid / Pending / Failed state.

### Payment Status Card

Semantic colors:
- Paid = green
- Pending = amber
- Failed = red
- Cancelled = neutral/slate

### Receipt Section

Show:
- amount
- currency
- booking reference
- provider
- confirmation time if paid
- payment intent reference

### CTA Logic

If paid:
- View Trip
- Open Pass
- Download receipt later if supported

If pending:
- Continue Payment
- Back to Trip

If failed:
- Retry Payment
- Contact Support later if support layer exists

### Trust Copy

Small reassurance strip:
- “Payments are linked to your OSP booking and pass status.”

## Lane

OSP UI Lane 12 — Traveler Payment Detail Mobile Production Screen

## Acceptance Criteria

- Payment state is instantly understandable.
- Paid screen feels like receipt.
- Pending/failed screens provide clear next action.
- No raw debug-first layout.
- No fake receipt download unless implemented.

---

# Execution Order

Recommended lane order:

1. Lane 8 — /traveler/pass mobile shell
2. Lane 9 — /traveler/passport-map consistency hardening
3. Lane 10 — /traveler/trips list
4. Lane 11 — /traveler/trips/[tripId] detail
5. Lane 12 — /traveler/payments/[intentId] payment detail

## Why This Order

The traveler flow is:

Home → Pass → Passport Map  
Home → Trips → Trip Detail → Payment  
Home → Payment/Pass/Checkpoint shortcuts

So we should finalize screens in flow order, not by file order.

## Hard Stop Rules

- Do not start DOT/LGU audit docs until traveler mobile screens are visually credible.
- Do not patch multiple pages in one lane.
- Do not mix backend logic with UI shell hardening unless blocked.
- Do not use raw IDs as primary traveler-facing UI.
- Do not use generic text links where a production CTA is required.
- Do not over-color entire screens; semantic color must guide, not decorate.
- Do not break existing backend data wiring.
- Do not add fake data to make UI look complete.
