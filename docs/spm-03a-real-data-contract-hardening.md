# SPM-03A Real Data Contract Hardening

## Status

LOCKED.

## Purpose

This patch hardens `/api/v1/spm/traveler-preview` so governed traveler progress is not mixed with fake preview progress.

## Locked Rule

SPM traveler progress must only come from governed SPM records:

- SpmTravelerTrailProgress
- SpmTravelerStopVerification
- SpmTravelerStamp
- OspQrEvent-backed Passport Stamp validation

## Removed Backend Risk

The backend must not fabricate:

- 5 unlocked trails
- 3 verified places
- 42% journey progress
- fake Daku Island verified progress
- fake ETA/distance recommendation as governed truth
- fallback Passport Trail progress

## New Contract Separation

The response now separates:

1. `travelerProgress`
   - real trail progress
   - real verified stops

2. `officialDiscovery`
   - official trail families
   - approved nodes

3. `metrics`
   - computed only from real traveler progress

4. `dataIntegrity`
   - governedProgressOnly
   - fallbackProgressUsed
   - visualPaddingAllowedOnFrontendOnly

## Frontend Boundary

Frontend may preserve layout using visual padding cards, but those cards must remain visually secondary and must not be represented as governed progress.

## Hard Decision

SPM can now safely move toward traveler trail list/detail routes because the backend contract no longer presents preview fallback as real journey truth.
