# Lane 15B — Traveler Display Currency Preference Closeout Checkpoint

## Status

LOCKED.

Lane 15B established traveler-controlled display currency preference for the OSP FX display layer.

This lane does not activate live FX providers.
This lane does not change payment settlement.
This lane does not change booking totals.
This lane does not create non-PHP payment intents.
This lane does not alter operator payout, OTA settlement, accounting, or tax behavior.

## Locked Commits

- 3e2a680 add user display currency preference
- d261a41 use user display currency for fx snapshots
- a208683 add traveler currency selector

## Locked Architecture Decision

Display currency belongs first on `User`.

Reason:

- display currency is a traveler preference;
- settlement remains PHP;
- booking and payment records remain PHP-native;
- FX snapshots derive from user display preference during traveler read flows;
- future preference usage can remain consistent across Trip Detail, Payment Detail, Home, and Settings.

## Locked Schema

`User.preferredDisplayCurrencyCode` now exists.

Default:

- USD

Migration:

- 20260425094959_lane15b_user_display_currency_preference

Database behavior:

- existing users receive default USD;
- profile PATCH can update the value;
- profile GET returns the value.

## Locked Backend Profile Behavior

`UpdateProfileDto` now accepts:

- preferredDisplayCurrencyCode

`ProfilesService.getMe()` now returns:

- preferredDisplayCurrencyCode

`ProfilesService.updateMe()` now updates:

- preferredDisplayCurrencyCode

Current update behavior:

- value is normalized to uppercase before persistence.

## Locked FX Read Behavior

Payment Detail FX snapshots now use:

- authenticated user preferredDisplayCurrencyCode

Payment Detail fallback remains:

- USD

Trip Detail FX snapshots now use:

- trip.traveler.preferredDisplayCurrencyCode

Trip Detail fallback remains:

- USD

Important:

- fallback USD exists only as safety fallback;
- hardcoded USD is no longer the primary FX read behavior.

## Locked Traveler Settings Behavior

Traveler Settings now includes a Currency panel selector.

Supported display currencies:

- PHP
- USD
- EUR
- JPY
- KRW
- CNY
- HKD
- AUD
- SGD

UI doctrine:

- PHP is marked as settlement source;
- all other currencies are display estimates;
- selector saves through existing `/profile` PATCH;
- selected currency is read from current authenticated user;
- no live external FX provider is involved.

## Runtime Proof

Post-commit verification confirmed:

- profile currency can update from USD to SGD;
- profile currency can restore from SGD to USD;
- backend build passes;
- frontend build passes;
- git state is clean after verification.

15B closeout audit additionally confirmed:

- profile currency can update from USD to HKD;
- profile currency can restore from HKD to USD;
- backend and frontend remain build-clean.

## Explicitly Deferred

The following are not part of Lane 15B:

- live external FX provider integration
- FX provider rate freshness
- FX rate expiry enforcement
- FX markup rules
- PSP multi-currency payment execution
- payout FX
- operator settlement FX
- OTA settlement FX
- accounting export FX
- tax reporting FX
- marketplace pricing FX
- SPM pricing FX
- automatic repricing
- Home screen currency selector behavior
- admin FX controls

## Next Recommended Move

Return to SPM build pages.

Reason:

- FX foundation is now sufficiently locked for traveler display estimates;
- SPM was intentionally frozen before dictionary conversion because more SPM pages still need to be built;
- continuing FX now risks overbuilding provider/settlement layers before product surfaces are complete.

## SPM Re-entry Rule

When returning to SPM:

- build SPM pages first;
- keep SPM commercial pricing FX deferred;
- do not convert SPM dictionary until page structure stabilizes;
- do not add FX pricing to SPM until SPM product/package pricing doctrine is reopened.

## Hard Stop Rule

Do not wire live FX provider or PSP multi-currency execution next.

Do not replace PHP settlement amounts.

Do not add SPM pricing FX until SPM pages and product logic are stable.

Do not start SPM dictionary conversion until the active SPM page expansion is complete.
