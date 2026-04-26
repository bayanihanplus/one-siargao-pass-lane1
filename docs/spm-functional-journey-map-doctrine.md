# SPM Functional Journey Map Doctrine
## Locked Production Doctrine

## 1. Locked Context

The SPM Functional Journey Map is the compact, structured, progress-oriented map surface used inside Passport Trails and internal journey flows.

It is separate from:

1. **SPM Own Map Canvas** — the premium branded hero visual asset.
2. **SPM Functional Journey Map** — the compact progress and continuity surface.
3. **Future Full SPM Interactive Map Layer** — the richer stateful interactive map system to be built later.

The SPM Functional Journey Map is not the decorative hero map, not a full interactive map, not a tourism poster, not a generic island illustration, and not a dead placeholder.

It is a product-grade journey map surface that translates verified SPM/OSP movement into a compact traveler-facing progress experience.

---

## 2. Primary Role

The SPM Functional Journey Map exists to answer:

- Where is the traveler in the trail?
- What has already been verified?
- What is the recommended next step?
- What remains locked?
- What action should the traveler take now?

Its job is not visual spectacle. Its job is journey clarity.

---

## 3. Core Product Objective

The Functional Journey Map must be:

- compact
- structured
- progress-oriented
- easier to wire
- less decorative
- more state-driven
- mobile-app ready
- future overlay-ready
- realistic before full database completion

It must work in two states:

### Pre-full-wiring mode
When DB truth is incomplete, it must remain honest and production-safe.

### DB-wired mode
When verified stops, trail progress, and QR/stamp events exist, it must reflect governed truth without redesign.

---

## 4. Doctrinal Separation From Hero Map

### SPM Own Map Canvas
Used for:

- hero branding
- product identity
- emotional visual storytelling
- SPM world-building

### SPM Functional Journey Map
Used for:

- trail continuity
- next-stop logic
- verified progression
- compact operational traveler guidance

### Hard Rule
Do not reuse the full decorative hero map blindly inside Passport Trails or internal progress surfaces.

Reason:

- it creates visual repetition
- it implies false system completeness
- it becomes harder to wire meaningfully
- it weakens operational clarity
- it makes Passport Trails feel decorative instead of functional

---

## 5. Required Placement

The Functional Journey Map should be used in:

### Passport Trails internal journey surfaces
Examples:

- Continue Passport Trail
- Next Best Action
- active trail journey blocks
- trail continuation modules

### Verified Stops context
Examples:

- state-aware progress support block near Verified Stops
- next unlock guidance
- verified-to-next-action flow

### Trail detail pages
Examples:

- `/traveler/passport-trails/[trailSlug]`
- trail progress intro surface
- mini route orientation panel

### Future stamps / progress panels
Examples:

- stamp readiness
- progress summaries
- route continuity modules

---

## 6. Where It Must Not Be Used

Do not use the Functional Journey Map as:

- the main SPM hero art
- a decorative full-screen banner
- a generic background
- a fake all-trails-at-once visualization
- a dense GIS map
- a fake interactive map before interactivity exists

---

## 7. Visual Composition Doctrine

The Functional Journey Map must feel like a guided trail progress panel.

Required qualities:

- compact rounded-card surface
- mobile-first proportions
- clean route path
- limited visible nodes
- clear state hierarchy
- focused on one active trail context
- structured, not scenic-heavy
- polished but restrained

Visual weight:

- lighter than hero
- utility-driven
- still premium
- less cinematic than hero
- more informational than emotional

---

## 8. Map Content Doctrine

The Functional Journey Map should not show the full island in rich decorative detail every time.

It should show a focused journey slice with:

- active trail route line
- selected trail corridor or zone
- current state
- previous verified nodes
- next unlock node
- locked future nodes
- optional endpoint or milestone

It may reference Siargao geography, but in simplified modular form.

---

## 9. Required Node States

The component must support these node states:

### Verified / Completed
Meaning:

- governed scan or approved record exists

Visual treatment:

- completed marker
- check or approval icon
- stronger confidence state
- slightly more saturated

### Current / Active
Meaning:

- traveler is currently on this trail or continuity state

Visual treatment:

- highlighted marker
- active ring or glow
- stronger emphasis than pending nodes

### Recommended Next Stop
Meaning:

- system-guided next meaningful action

Visual treatment:

- highlighted marker
- action-oriented accent
- visually distinct from locked future nodes

### Locked Future Node
Meaning:

- exists in the trail but is not yet unlocked

Visual treatment:

- muted marker
- optional lock icon
- lower emphasis

### Pending / Placeholder
Meaning:

- no governed record yet

Visual treatment:

- neutral placeholder node
- non-deceptive styling
- must not pretend to be verified

---

## 10. Route Line Doctrine

Route lines must be:

- visible
- tasteful
- thin-to-medium weight
- product-grade
- mobile-readable
- not cartoonishly thick
- not overly complex

Recommended segmentation:

- completed segment = stronger / clearer
- current segment = highlighted accent
- future segment = lighter / dashed / subdued

---

## 11. Icon Logic Doctrine

Allowed icon logic:

- verified = check / badge / approval symbol
- current step = position / pulse / journey spark
- next unlock = arrow / target / flag / route cue
- locked = lock / muted node
- pending = neutral placeholder
- trail family = small accent icon only when useful

Hard rule:

Icons must be compact, consistent, semantic, product-grade, and not decorative clutter.

---

## 12. Label / Text Doctrine

Text must be dynamic JSX, not baked into image assets.

Allowed text:

- current trail
- next unlock
- verified count
- node short name
- route hint
- progress hint

Avoid:

- long paragraphs inside the map
- large static labels
- fake destination labels
- static text that should later come from DB

---

## 13. Component Structure Doctrine

The component should be treated as a journey block, not just an image.

Recommended structure:

### Header Row
Contains:

- eyebrow label
- title
- short support line
- optional CTA

### Map Surface
Contains:

- compact route canvas
- nodes
- state logic
- progress route emphasis

### Summary Strip / Footer Row
Contains:

- active trail
- next unlock
- verified stops count
- CTA

This keeps the component operationally useful.

---

## 14. Required State Modes

The Functional Journey Map must support these production modes:

### Mode 1 — No Records Yet
Show:

- safe placeholder route
- neutral nodes
- one clear next action
- no fake progress

### Mode 2 — Ready to Start
Show:

- trail route
- starting point
- next unlock node
- lightly locked future nodes

### Mode 3 — In Progress
Show:

- completed route segment
- verified nodes
- active/current node
- recommended next stop
- future locked nodes

### Mode 4 — Progress Blocked / Awaiting Action
Show:

- current trail
- highlighted next unlock
- blocked future nodes
- direct CTA to required action

### Mode 5 — Trail Complete
Show:

- completed nodes
- endpoint / reward-ready cue
- soft celebratory state
- no over-gamification

---

## 15. Data / DB Wiring Doctrine

The component must be designed so it can later consume DB truth without redesign.

Expected future data shape:

- `trailSlug`
- `trailTitle`
- `trailFamily`
- `tripId`
- `progressPercent`
- `verifiedStopsCount`
- `totalStopsCount`
- `currentNode`
- `nextNode`
- `completedNodes[]`
- `lockedNodes[]`
- `recommendedAction`
- `lastVerifiedAt`
- `requiresQrScan`
- `requiresApprovedStop`
- `mapRegionKey`
- `visualMode`

Hard rule:

The UI must not assume fields that do not yet exist, but it must be ready to accept them later.

---

## 16. Pre-DB Safe Doctrine

Before full DB wiring, the component must remain honest.

Do not show:

- fake exact traveler counts
- invented completion percentages
- fake route certainty
- fake unlocked achievements
- fake node names implying verified truth

Use:

- guided preview language
- governed-progress language
- pending states
- verification-ready language
- safe placeholder logic

---

## 17. CTA / Action Doctrine

The Functional Journey Map must always support the next meaningful action.

Correct CTA examples:

- Continue
- View Trail
- Scan QR
- View Stops
- Open Trail
- Start Trail

Wrong CTA behavior:

- dead buttons
- decorative buttons with no route
- broad “Learn More”
- unrelated route drift

---

## 18. Route Wiring Doctrine

Functional journey map surfaces must wire to real or production-safe routes.

Examples:

- trail list → `/traveler/passport-trails`
- trail detail → `/traveler/passport-trails/[trailSlug]`
- verification / QR → `/traveler/pass`
- future records/stamps panel → only after built

Hard rule:

Do not invent dead deep links.

---

## 19. Mobile Production Hardening Doctrine

The component must feel like a mobile app production block.

Required:

- soft shell colors
- strong readable contrast
- card containment
- compact spacing
- clear icon hierarchy
- clear active / inactive states
- finger-friendly CTA
- no cramped text
- no oversized scenic art stealing utility value

---

## 20. Interaction Doctrine

Supported interaction patterns:

- tap active trail card
- tap CTA
- tap next unlock summary
- tap route preview area if routed
- subtle hover/focus only if implemented safely
- clear active/pressed state

Do not use:

- fake interactivity
- arbitrary animation clutter
- motion implying unsupported functionality

---

## 21. Hard Visual Rules

The Functional Journey Map must be:

- compact
- focused
- believable
- structured
- product-grade
- future-wireable
- state-driven

It must not be:

- another hero art clone
- an infographic poster
- full-screen scenic art
- fake-interactive map
- generic island wallpaper
- label-overloaded
- decorative-only

---

## 22. Placement Decision

On `/traveler/passport-map`, use it:

- below Verified Stops
- inside Continue Trail / Next Best Action logic
- as the functional continuity panel

Production order:

1. Verified Stops shows what records exist.
2. Functional Journey Map shows what those records mean.
3. CTA shows what to do next.

---

## 23. Component Relationship Decision

### Verified Stops
Shows record truth.

### Functional Journey Map
Shows route continuity based on that record truth.

### CTA / Summary Footer
Shows next action.

This is the correct product sequence.

---

## 24. Production Decision

Final locked architecture:

1. **SPM Own Map Canvas** — hero / identity
2. **SPM Functional Journey Map** — Passport Trails progress surfaces
3. **Future Full SPM Interactive Map Layer** — later interactive system

This architecture is locked to prevent drift.

---

## 25. Implementation Decision For Now

The next build should create a Functional Journey Map component.

Immediate form:

- header
- compact route map panel
- node states
- active trail summary
- next unlock summary
- CTA

This must be stronger than the current weak placeholder and easier to wire later.

---

## 26. Hard Stop Rules

1. Do not reuse the full hero map art for internal trail progress surfaces.
2. Do not fake DB completeness.
3. Do not bake large text into static image assets.
4. Do not create dead buttons or fake routes.
5. Do not make the journey block decorative-only.
6. Do not turn the Functional Journey Map into scenic poster art.
7. Keep it compact, structured, state-driven, and trail-oriented.

---

## 27. Locked Summary

The SPM Functional Journey Map is a compact, structured, state-driven, mobile-ready trail progress map surface used inside Passport Trails and internal progress flows.

It must support verified, active, next, locked, and pending states; guide traveler continuity; remain safe before full DB wiring; and feel operational rather than decorative.

