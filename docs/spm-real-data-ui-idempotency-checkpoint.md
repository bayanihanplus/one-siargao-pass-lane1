# SPM Real Data UI + Stamp Idempotency Checkpoint

Date: 2026-04-25
Branch: fix/operator-staff-membership-layer

## Locked State

SPM now supports real traveler progress from governed passport stamp scans while preserving the approved SPM UI geometry.

## Backend Locked Flow

PASSPORT_STAMP_SCAN now writes through the governed QR/compliance spine:

1. OspQrEvent
2. SpmTravelerStamp
3. SpmTravelerStopVerification
4. SpmTravelerTrailProgress

## Idempotency Lock

Duplicate passport stamp scans now return:

- outcome: ALREADY_STAMPED
- reasonCode: ALREADY_STAMPED
- same stampId
- progress unchanged

Duplicate scans still create an OspQrEvent audit record, but do not rewrite the active stamp/progress state.

## Effective Pass Status Fix

Effective pass status now prefers any linked PAID booking before falling back to the latest linked booking.

Reason:
A newer unpaid/self-linked booking must not block a valid paid booking already attached to the same trip.

## Frontend Locked Behavior

The SPM traveler page now:

- reads real DB-backed progress first
- preserves 3-card geometry using padded fallback cards
- shows real progress in first slots
- avoids layout collapse when only one real trail/stop exists

Validated browser state after one real stamp:

- Island Hopping Trail
- 1 / 6 completed
- Corregidor Island verified
- previewOnly: false from backend
- approved UI geometry preserved

## Hard Rules

- No legacy QrEvent writes.
- Use OspQrEvent only.
- No frontend-only verification.
- Real verified stops require governed QR/stamp records.
- UI geometry must not collapse when real records are fewer than 3.
- Extra padded cards are visual layout stabilizers, not claimed real achievements.

## Latest Relevant Commits

- f744377 preserve spm card geometry with real data padding
- e0695d5 harden spm passport stamp duplicate scans
- 8457748 connect passport stamp scans to spm traveler progress
- dc800c9 read spm traveler progress with preview fallback
- 2083e61 add spm traveler progress schema

## Next Possible Lanes

1. Admin/Operator passport stamp scan UI
2. Formal DOT/LGU audit checkpoint doc
3. Backend tests for stamp idempotency and paid-booking preference
4. SPM recommendation engine improvement
5. Traveler SPM copy polish after real-data activation
