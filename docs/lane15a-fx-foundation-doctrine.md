# Lane 15A — FX Foundation Doctrine

## Status

Lane 15A is a foundation/audit lane.

This lane does not activate live FX conversion.
This lane does not change traveler totals.
This lane does not change payment execution.
This lane does not change booking settlement rules.
This lane does not introduce UI-only converted pricing.

## Current Money Model

The current OSP commercial spine is PHP-native.

Current persisted fields include:

- Booking.bookingTotalPhp
- Booking.currencyCode
- PaymentIntent.amountPhp
- PaymentIntent.currencyCode
- PaymentStateRecord.paidAmountPhp
- PaymentStateRecord.unpaidAmountPhp
- Inter-island fee amountPhp / paidAmountPhp / unpaidAmountPhp fields

Frontend currently displays money using local helpers:

- frontend/app/traveler/trips/[tripId]/page.tsx formatMoney(...)
- frontend/app/traveler/payments/[intentId]/page.tsx formatMoney(...)

Traveler settings already exposes a Currency / FX placeholder panel, but no live conversion is active.

## Locked FX Principle

FX is a display and snapshot layer.

FX must never reinterpret historical payment obligations.

Every booking/payment must preserve PHP as the settlement truth unless a future commercial doctrine explicitly approves multi-currency settlement.

## Source of Truth

PHP amount fields remain the settlement source of truth.

FX display fields may be derived from PHP amount fields only when:
1. a traveler display currency is selected or inferred;
2. an FX rate source is available;
3. the applied rate is snapshotted;
4. the converted value is clearly marked as display-only unless future settlement doctrine changes.

## Prohibited Behavior

The system must not:

- convert bookingTotalPhp directly in frontend without a backend snapshot;
- overwrite PHP settlement values with converted values;
- treat traveler display currency as settlement currency;
- create payment intents in non-PHP currency unless explicitly approved in a later PSP/payment lane;
- calculate FX differently across Home, Trip Detail, Payment Detail, and Settings;
- display stale FX without timestamp/source metadata;
- silently change a previously snapshotted booking total after payment intent creation.

## Canonical Future FX Snapshot Fields

Future FX snapshot fields should preserve these concepts:

- fxSnapshotId
- sourceAmountPhp
- sourceCurrencyCode = PHP
- displayCurrencyCode
- fxRate
- convertedDisplayAmount
- fxSource
- fxAsOf
- snapshotReason
- bookingId
- paymentIntentId
- createdAt

Optional later fields:

- rateExpiresAt
- rateMarkupAmount
- rateMarkupPercent
- displayRoundingMode
- displayMinorUnits
- providerReference

## Canonical Display Rules

For traveler-facing pages:

Primary settlement display should remain clear:

- PHP amount remains visible or traceable.
- Converted amount may appear as secondary display.
- UI must distinguish settlement amount from approximate traveler display.

Example future pattern:

- Payable: PHP 2,500
- Display estimate: USD 44.20
- Rate: 1 PHP = 0.01768 USD
- FX snapshot: as of 2026-04-25 14:00

## Backend-First Requirement

FX calculation belongs in backend services before broad UI rendering.

Required future backend layer:

- supported display currency registry
- FX rate lookup provider or static seed for local dev
- snapshot service
- formatter/response serializer
- audit event for snapshot creation/update

## Recommended Build Sequence

### 15A-1
Document FX doctrine and current audit state.

### 15A-2
Add backend FX schema/model foundation only.

### 15A-3
Add backend FX service with deterministic dev rates.

### 15A-4
Expose FX display snapshot in booking/payment read responses.

### 15A-5
Render FX display on Traveler Trip Detail and Payment Detail.

### 15A-6
Wire Traveler Settings currency preference to backend profile/user preference.

## Explicitly Deferred

The following are not part of 15A foundation:

- live external FX provider integration
- PSP multi-currency payment execution
- payout FX
- operator settlement currency
- OTA settlement currency
- accounting export FX
- tax reporting FX
- automatic repricing
- SPM commercial pricing
- marketplace pricing FX

## Hard Decision

Proceed backend-first.

Do not add UI-only FX conversion.

Do not modify payment intent creation until FX snapshot doctrine is implemented.
