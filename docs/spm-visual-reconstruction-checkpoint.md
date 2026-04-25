# SPM Visual Reconstruction Checkpoint

Date: 2026-04-25
Branch: fix/operator-staff-membership-layer
Route: /traveler/passport-map
File: frontend/app/traveler/passport-map/page.tsx

## Locked Visual Sections

The following SPM traveler UI sections are reconstructed and locked for now:

1. Header identity
2. Hero banner and hero metrics row
3. Your Trails preview cards
4. Verified Stops preview cards
5. Continue Your Journey preview card
6. SPM UI DB wiring doctrine

## Latest Locked Commits

- 4405766 refine spm continue journey preview card
- 5fd3417 document spm ui db wiring doctrine
- e4e27d9 refine spm verified stops preview cards
- 272c33c refine spm your trails preview cards
- 80d5ab7 refine spm hero banner and metrics row layout
- 4c8f555 document spm hero typography asset blocker
- 1605d30 wire official spm header mark

## Header Lock

The header uses the official SPM header mark asset and dynamic JSX title/subtitle.

Locked behavior:

- left SPM mark
- dynamic title: Siargao Passport Map
- dynamic subtitle: Follow the Trails. Build the Journey.
- right notification bell
- no full-logo lockup duplication
- no OSP parent-stamp substitution

## Hero Lock

The hero section is accepted for now.

Locked behavior:

- dynamic hero text remains JSX
- hero banner background remains image-backed
- map/banner remains visual-only preview
- metrics row is horizontal
- preview warning remains present
- hero typography has known blocker documented separately

Known limitation:

- exact approved script/handwritten typography requires approved font files or transparent text assets before pixel-level finalization.

## Your Trails Lock

Your Trails preview cards are accepted for now.

Locked behavior:

- three horizontal cards
- General Luna Explorer
- Island Discovery Trail
- North Coast Adventure locked card
- visual progress bars
- preview-only copy retained
- DB-wiring doctrine prepared

## Verified Stops Lock

Verified Stops preview cards are accepted for now.

Locked behavior:

- three horizontal cards
- General Luna
- Cloud 9
- Magpungko
- verified badge styling
- visual-only state retained
- real verification must come from governed QR/stamp records later

## Continue Your Journey Lock

Continue Your Journey preview card is accepted for now.

Locked behavior:

- compact card
- Daku Island recommendation
- CTA: Explore My Map
- bottom-nav clearance improved
- remains preview-only pending real recommendation API/data

## Anti-Drift Rules

Do not modify locked sections unless a new section-specific instruction is issued.

Do not re-open:
- header mark extraction
- hero banner cropping
- hero metrics layout
- Your Trails card geometry
- Verified Stops card geometry
- Continue Journey compact card geometry

## Future DB Wiring Rule

All current preview card data must eventually be replaced by governed APIs without changing approved UI geometry.

Refer to:

docs/spm-ui-db-wiring-doctrine.md

## Next Recommended Lane

Before backend wiring, next safe lane should be one of:

1. Bottom nav spacing / safe-area audit
2. SPM route/page checkpoint documentation
3. DB/API design for SPM trails and verified stops
4. Passport Trail schema preparation

No VPS deployment yet.
