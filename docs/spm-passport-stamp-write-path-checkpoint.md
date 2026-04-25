# SPM Passport Stamp Write Path Checkpoint

Date: 2026-04-25
Branch: fix/operator-staff-membership-layer

## Locked State

SPM now has a working passport stamp write path.

## Flow

PASSPORT_STAMP_SCAN writes to:

1. OspQrEvent
2. SpmTravelerStamp
3. SpmTravelerStopVerification
4. SpmTravelerTrailProgress

## Endpoint

POST /api/v1/osp-qr/passport-stamp-scan

Payload:

- qrToken
- trailNodeId
- channel

## Validation Result

Local test returned:

- outcome: ALLOWED
- stamp created
- verified stop created
- trail progress recalculated
- traveler-preview returned previewOnly: false
- progressPercentage: 17
- placesVerified: 1
- trailsUnlocked: 1

## Important Fix

Effective pass status now prefers any linked PAID booking before falling back to latest linked booking.

Reason:
A newer unpaid booking link should not block a valid paid booking on the same trip.

## Hard Rules

- No legacy QrEvent writes.
- Use OspQrEvent only.
- Do not verify frontend-only stops.
- Stamp requires active/effective pass state.
- Stamp requires approved + stampEligible SPM trail node.

## Next Possible Lanes

1. Add duplicate scan/idempotency response hardening
2. Add admin/operator UI for passport stamp scanning
3. Add traveler SPM browser validation after real stamp
4. Add tests around paid-booking preference
5. Add official audit checkpoint doc
