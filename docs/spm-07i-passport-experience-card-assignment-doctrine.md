# SPM-07I — Passport Experience Card Assignment Doctrine

## Purpose

This lane assigns each SPM commercial card to the correct traveler-facing product lane and removes old/drifting family-card language from the Passport Map page.

## Locked Product Cards

The top-level SPM commercial cards are:

1. Siargao Partner Tour
2. Passport Trails™ Curated Tour
3. Build Your Own Passport Trail

## Card Assignment

### Siargao Partner Tour

Used for actual local operator tour products made Passport-ready.

Examples:
- Tri-Island Joiner
- Corregidor + Tri-Island Joiner
- Sohoton Joiner

Required language:
- Operated by approved local partner
- Passport stamps available
- Package pricing applies when booking opens

Guide/support:
- Provided by approved local partner

### Passport Trails™ Curated Tour

Used for official SPM trail families only.

Official families:
- Island Hopping Trail
- Surf Explorer Trail
- North Siargao Trail
- Inland Discovery Trail
- Culture & Community Trail
- Sunset & Scenic Stops Trail
- Adventure Trail
- Return Traveler Continuity Trail

Required language:
- Provided through SPM-approved trail operations
- Verified Passport stamps included when activated
- Pricing appears before checkout

Guide/support:
- Provided through SPM-approved trail operations

### Build Your Own Passport Trail

Used for DIY curated route planning.

Required language:
- Route guidance provided by SPM
- Approved local partner support may apply where transport, boat, guide, or activity service is required
- Planning preview now

Guide/support:
- Route guidance provided by SPM

## Hard Cleanup

Remove old “Passport Trail Families” prime card blocks if they use old or rejected names.

Rejected on `/traveler/passport-map`:
- Surf & Coastal
- Food & Culture
- Nature & Inland
- Heritage & Local Life
- Hidden Gems
- Island Hopping Core Trail
- North Siargao Scenic Route
- Culture & Local Flavor Route
- Surf Discovery Trail
- Golden Hour Scenic Loop
- Adventure Expedition
- Local Operator-Led Tours
- SPM-Led Passport Trails
- DIY-Led Trails

## Hard Boundaries

No backend.
No Prisma.
No fake booking.
No fake checkout.
No fake operator approval.
No fake guide assignment.
No fake stamp completion.
No invented trail family names.
