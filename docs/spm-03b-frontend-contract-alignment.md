# SPM-03B Frontend Contract Alignment

## Status

LOCKED.

## Purpose

This patch aligns `/traveler/passport-map` with the hardened SPM backend contract.

## Locked Rule

The frontend must not present visual padding cards as governed traveler progress.

## Changes

- Removed Daku Island as fake next-stop fallback.
- Removed fake 5 / 3 / 42% metrics from SPM status cards.
- Status cards now read from backend `metrics`.
- Empty traveler state shows zero governed progress.
- Verified Stop fallback cards are now labeled pending / visual placeholder.
- Trail fallback cards are now labeled pending / visual placeholder.
- Progress bars now use real `progressPercentage`.
- Visual padding remains allowed only to preserve mobile app layout.

## Hard Boundary

Frontend visual placeholders do not count as:

- Passport Stamps
- verified stops
- trail completion
- journey progress
- official recommendations

## Next Build Readiness

After this patch, traveler SPM list/detail route work may begin without carrying fake progress debt into the next pages.
