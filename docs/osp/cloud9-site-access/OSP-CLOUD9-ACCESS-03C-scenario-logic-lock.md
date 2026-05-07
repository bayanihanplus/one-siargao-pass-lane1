# OSP-CLOUD9-ACCESS-03C — Cloud 9 Access Scenario Logic Lock + Frontend State Map

## Locked Correction

Do not use traveler-facing same-day expiry psychology.

Avoid presenting Cloud 9 access as a daily-expiring QR or as a separate site QR.

Correct Cloud 9 rule:

Cloud 9 access is valid within the traveler’s given trip period and is usable only once.

The operational failure state should be framed as:

- Already used
- Not attached
- Payment required
- Manual review required
- Outside active trip window only if trip validity truly does not cover the visit

## Core Doctrine

Cloud 9 Site Access is not DCS.

Cloud 9 is LGU Site Access.

One official Traveler QR is used for identity and access validation.

Cloud 9 access entitlement attaches to the official Traveler QR.

No separate Cloud 9 QR is created.

LGU remains the site-access authority.

OSP provides the system, verification, entitlement attachment, and operational audit trail.

## Primary Traveler Flow

1. Traveler arrives at Cloud 9.
2. Traveler opens scanner camera.
3. Traveler scans official Cloud 9 signage QR.
4. Traveler lands on Cloud 9 Site Access before-payment page.
5. Traveler confirms site fee and access rule.
6. Traveler chooses:
   - sandbox/prepaid online payment path
   - LGU counter handoff path
   - account creation path if no Traveler QR exists
7. After payment or counter confirmation, Cloud 9 access attaches to the official Traveler QR.
8. OSP Verified stamp appears as a status/verification visual only.
9. LGU gate validates the official Traveler QR.
10. Entitlement is marked used once.

## Validity Rule

Cloud 9 entitlement is valid within the traveler’s active trip period.

It is one-use only.

Once used, it cannot be reused.

Correct operational states:

- READY_FOR_GATE
- USED
- ALREADY_USED
- PAYMENT_REQUIRED
- ACCOUNT_REQUIRED
- MANUAL_REVIEW_REQUIRED
- OUTSIDE_TRIP_WINDOW
- VOIDED
- REFUNDED

## Auto Rate Categories At Gate

Gate-side rate categories must be supported in the logic model:

- STANDARD_RATE
- EXEMPT
- DISCOUNTED
- RESIDENT_RATE
- SENIOR_RATE
- CHILD_RATE

These categories may be automatically applied at gate if LGU rules/configuration are available.

For now, UI must avoid hardcoding discount results unless officially configured.

## Scenario 1 — Traveler Prepaid Cloud 9 Access Beforehand

State:

PREPAID_READY

Behavior:

- Do not show payment CTA as primary.
- Show “Ready for LGU gate validation.”
- Show OSP Verified stamp.
- Show official Traveler QR doctrine.
- LGU gate validates:
  - site = CLOUD_9
  - fee paid or rate category valid
  - within active trip period
  - not used yet
  - traveler entitlement exists

Frontend State:

/traveler/site-access/cloud-9?payment=sandbox-approved

Future Backend State:

READY_FOR_GATE

## Scenario 2 — Traveler Opens Scanner Camera On Site

State:

BEFORE_PAYMENT

Behavior:

- Traveler scans Cloud 9 signage QR.
- Page must look like a traveler-facing mobile app page, not a developer explainer.
- It must show:
  - Cloud 9
  - LGU entrance fee
  - continue to payment
  - LGU counter handoff
  - official Traveler QR rule
  - no fake QR

Frontend State:

/traveler/site-access/cloud-9

## Scenario 3 — Traveler Has Not Created Account

State:

ACCOUNT_REQUIRED

Behavior:

- Do not send traveler into a long registration funnel.
- Show “Create your Traveler QR” prompt.
- Explain that the official Traveler QR is required for site access.
- After account creation, return to Cloud 9 Site Access page.

Minimum future fields:

- full name
- nationality
- mobile/email optional
- consent
- trip period or current visit context

Future route:

/traveler/register?returnTo=/traveler/site-access/cloud-9

## Scenario 4 — Traveler Prepaid But Forgot Phone / QR

State:

MANUAL_REVIEW_REQUIRED

Behavior:

- Do not create a second QR.
- LGU staff uses manual verification.
- Search by:
  - traveler name
  - nationality
  - email/phone
  - payment reference
  - trip/pass reference
- Staff confirms match.
- Staff marks entitlement as manually verified used.
- Audit event is recorded.

Gate outcome:

MANUAL_VERIFIED_USED

Required controls:

- staff account
- reason code
- timestamp
- duplicate-use protection
- daily manual verification report
- supervisor override for uncertain matches

Future LGU route:

/lgu/site-access/cloud-9/manual-verify

## Scenario 5 — Group Traveler With One Lead QR

State:

GROUP_LEAD_READY

Rule:

One official Traveler QR belongs to one traveler identity.

A group cannot share one identity QR as if it represents all identities.

Correct model:

Group lead Traveler QR
+ group entitlement for pax_count
+ paid amount = rate × pax_count

Gate validation:

- lead traveler identity exists
- group entitlement exists
- pax_count exists
- amount or rate category is valid
- within active trip period
- not used yet
- staff confirms headcount

MVP rule:

Group entitlement is consumed once for the full paid pax count.

No split entry.

No partial refund at gate.

Future fields:

- lead_traveler_id
- pax_count
- rate_category
- paid_amount
- used_at
- validated_by

## Scenario 6 — Already Used / Duplicate Attempt

State:

ALREADY_USED

Behavior:

- Show already used.
- Show used time and staff/station in LGU view.
- Do not allow second entry without supervisor override.
- Record duplicate attempt.

Gate outcome:

DUPLICATE_ATTEMPT

## Scenario 7 — Outside Active Trip Window

State:

OUTSIDE_TRIP_WINDOW

Behavior:

Use only if the traveler’s active trip period does not cover the visit.

Do not frame this as same-day expiry.

Correct message:

“This access is outside the active trip period. Please proceed to LGU counter for review.”

## Scenario 8 — LGU Counter Payment

State:

COUNTER_HANDOFF

Behavior:

- Traveler goes to LGU counter.
- Staff confirms or creates Traveler QR identity.
- Staff applies correct rate category:
  - STANDARD_RATE
  - EXEMPT
  - DISCOUNTED
  - RESIDENT_RATE
  - SENIOR_RATE
  - CHILD_RATE
- Entitlement attaches to official Traveler QR.
- OSP Verified stamp can be shown after counter confirmation.

Frontend State:

/traveler/site-access/cloud-9?path=lgu-counter

## Scenario 9 — Weak Internet / Degraded Flow

State:

MANUAL_REVIEW_REQUIRED

Behavior:

- Signage should include fallback instruction.
- Traveler proceeds to LGU counter.
- Manual logging may be encoded later.
- Future offline scanner cache can be added later.

Do not build offline mode in this lane.

## Frontend State Map

### BEFORE_PAYMENT

Route:

/traveler/site-access/cloud-9

UI:

- clean traveler-first mobile app screen
- no developer-explainer tone
- fee confirmation
- payment CTA
- LGU counter handoff CTA
- pending access confirmation
- no OSP Verified stamp yet

### PAYMENT_SANDBOX

Route:

/traveler/payments/site-sandbox/cloud-9

UI:

- payment preview
- PHP 100 fee
- sandbox-only disclaimer
- confirm sandbox payment
- return to payment approved state

### PAYMENT_APPROVED

Route:

/traveler/site-access/cloud-9?payment=sandbox-approved

UI:

- OSP Verified stamp
- ready for LGU gate validation
- official Traveler QR doctrine
- gate validation checklist

### COUNTER_HANDOFF

Route:

/traveler/site-access/cloud-9?path=lgu-counter

UI:

- OSP Verified stamp for presentation handoff
- LGU counter confirmation path
- official Traveler QR doctrine
- gate validation checklist

### ACCOUNT_REQUIRED

Future query route:

/traveler/site-access/cloud-9?state=account-required

UI:

- create Traveler QR prompt
- return to Cloud 9 flow

### GROUP_LEAD

Future query route:

/traveler/site-access/cloud-9?state=group&pax=5

UI:

- group lead QR
- pax count
- amount = rate × pax
- one-use group entitlement

### MANUAL_REVIEW

Future query route:

/traveler/site-access/cloud-9?state=manual-review

UI:

- proceed to LGU counter/manual verification
- no second QR
- audit-required explanation

## Hard UI Direction

The default Cloud 9 page must not feel developer-like.

Default page should look like a polished traveler app screen:

- simple arrival context
- clear fee
- two action choices
- no long technical explanation above the fold
- no fake QR
- no dark navy hero
- GL logo as authority
- official Traveler QR doctrine clear but concise
- OSP Verified only appears in approved/handoff states, not before payment

## Commit Rule

Do not commit this logic lock until browser QA confirms:

- default before-payment page is acceptable after future hardening
- payment sandbox renders
- payment-approved handoff renders
- LGU counter handoff renders
- no fake QR
- no separate Cloud 9 QR
- frontend build passes
