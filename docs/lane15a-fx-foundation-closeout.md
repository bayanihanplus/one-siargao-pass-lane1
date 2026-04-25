# Lane 15A — FX Foundation Closeout Checkpoint

## Status

LOCKED.

Lane 15A established the backend-first FX display foundation for One Siargao Pass.

This lane does not activate live external FX.
This lane does not change payment settlement.
This lane does not change booking totals.
This lane does not create non-PHP payment intents.
This lane does not make traveler display currency the settlement currency.

## Locked Commits

- c660b12 document fx foundation doctrine
- a0b5b2f add fx display snapshot schema foundation
- 76e3c13 add fx service foundation
- 7bc4e08 expose payment detail fx display snapshot
- d894107 expose trip detail fx display snapshot
- b91db53 render payment detail fx display estimate
- e769137 render trip detail fx display estimate

## Locked Doctrine

PHP remains the payment and settlement source of truth.

FX is display-only at this stage.

Every FX amount shown to the traveler must come from a backend FX display snapshot, not from frontend-only conversion.

FX display must be secondary to the PHP payable / booking amount.

## Locked Schema

The model `FxDisplaySnapshot` now exists.

Canonical fields include:

- sourceAmountPhp
- sourceCurrencyCode
- displayCurrencyCode
- fxRate
- convertedDisplayAmount
- fxSource
- fxAsOf
- snapshotReason
- bookingId
- paymentIntentId
- rateExpiresAt
- metadataJson
- createdAt
- updatedAt

Database table:

- fx_display_snapshots

## Locked Backend Service

`FxService` now provides deterministic development FX behavior.

Current deterministic rates are labeled:

- DETERMINISTIC_DEV_RATE

Current helper methods:

- getOrCreatePaymentIntentDisplaySnapshot
- getOrCreateBookingDisplaySnapshot
- createDisplaySnapshot
- getDeterministicDevRate
- getSupportedDisplayCurrencies
- normalizeCurrencyCode

## Locked Backend Response Exposure

Payment Detail response now exposes:

- fxDisplaySnapshot

Snapshot reason:

- PAYMENT_INTENT_DETAIL_READ

Trip Detail response now exposes:

- currentBooking.fxDisplaySnapshot

Snapshot reason:

- TRIP_DETAIL_CURRENT_BOOKING_READ

## Locked Traveler UI Behavior

Payment Detail now renders FX display under Receipt Summary.

Trip Detail now renders FX display under Current Booking.

Both UIs show FX as a secondary display estimate only.

The PHP amount remains primary.

Both UIs include language-backed labels and a display-only disclaimer.

## Locked Language Keys

Payment Detail FX keys:

- paymentDetail.fx.displayEstimate
- paymentDetail.fx.rate
- paymentDetail.fx.source
- paymentDetail.fx.asOf
- paymentDetail.fx.note

Trip Detail FX keys:

- tripDetail.fx.displayEstimate
- tripDetail.fx.rate
- tripDetail.fx.source
- tripDetail.fx.asOf
- tripDetail.fx.note

Runtime proof confirmed:

- EN dictionary contains all required FX keys.
- FIL dictionary contains required proof values.
- Seed applies cleanly.

## Closeout Proof

Final closeout audit confirmed:

- FX doctrine exists.
- FxDisplaySnapshot schema exists.
- Deterministic FX service exists.
- Payment Detail backend exposes fxDisplaySnapshot.
- Trip Detail backend exposes currentBooking.fxDisplaySnapshot.
- Payment Detail UI renders FX display estimate.
- Trip Detail UI renders FX display estimate.
- Runtime language keys are present.
- Backend build passes.
- Frontend build passes.
- Git state was clean after commit e769137.

## Explicitly Deferred

The following are not part of Lane 15A:

- live external FX provider integration
- traveler-selected currency preference persistence
- user profile currency preference backend wiring
- payment intent multi-currency execution
- PSP multi-currency settlement
- payout FX
- operator settlement FX
- OTA settlement FX
- accounting export FX
- tax reporting FX
- marketplace pricing FX
- SPM pricing FX
- automatic repricing
- FX rate expiry enforcement
- FX markup rules

## Next Recommended Lane

15B — Traveler Currency Preference Foundation.

Recommended order:

1. audit Traveler Settings currency placeholder
2. add backend user/profile currency preference field if not present
3. expose supported display currencies from backend
4. persist traveler display currency preference
5. use preference instead of hardcoded USD in FX snapshot reads
6. keep PHP settlement unchanged

## Hard Stop Rule

Do not wire live FX providers or PSP multi-currency execution until the traveler currency preference foundation is locked.

Do not let frontend calculate converted totals independently.

Do not replace PHP payable amounts with FX display amounts.
