# OSP Admin Command Center UI + Data Correction

## Problem

Browser QA showed Super Admin operational queues rendering `ADMIN_ONLY` as a giant fake metric. Date-scoped counts and municipality readiness headings also appeared without visible cards.

## Fix

- Rewrote `/admin/intelligence` rendering.
- Humanized admin labels.
- Changed admin queue main value from `ADMIN_ONLY` to `Review`.
- Kept `Admin Only` as a badge.
- Added empty-state fallbacks for missing date-scoped and municipality arrays.
- Preserved Super Admin restricted scope.

## Hard Boundary

No commit.
No LGU exposure expansion.
No raw OTA commercial data exposed to LGU.
No operator financial data exposed to LGU.
No unrestricted traveler personal data exposed to LGU.
