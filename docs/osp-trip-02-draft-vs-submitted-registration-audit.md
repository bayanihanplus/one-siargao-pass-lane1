# OSP-TRIP-02 — Draft vs Submitted Registration Semantics Audit

## Purpose

This audit exists because OSP-TRIP-01 confirmed a semantic mismatch:

- Prisma schema defaults support draft trip creation.
- Current TripsService.create overrides the defaults and immediately marks a new trip as REGISTERED and SUBMITTED.

This document is an audit draft only until accepted.

---

## Current Schema Truth

TripStatus supports:

- DRAFT
- REGISTERED
- ACTIVE
- COMPLETED
- CANCELLED

RegistrationStatus supports:

- INCOMPLETE
- SUBMITTED
- VERIFIED
- REJECTED

ClearanceStatus supports:

- PENDING
- APPROVED
- DENIED
- NEEDS_CHANGES

Trip model defaults:

- tripStatus = DRAFT
- registrationStatus = INCOMPLETE
- clearanceStatus = PENDING

---

## Current Runtime Behavior

Current POST /trips creates:

- tripStatus = REGISTERED
- registrationStatus = SUBMITTED
- clearanceStatus = PENDING
- TripRegistration
- registrationCompletedAt = now

This collapses two separate moments:

- traveler creates trip
- traveler submits registration

---

## Proposed Locked Semantics

### Trip Creation

POST /trips should create the first trip shell only.

Target state:

- tripStatus = DRAFT
- registrationStatus = INCOMPLETE
- clearanceStatus = PENDING

Trip creation must not imply DOT/LGU registration submission.

### Registration Shell

A TripRegistration shell may still be created at draft stage if a registrationReference is useful for continuity.

If created at draft stage:

- registrationCompletedAt must be null
- registrationChannel may remain app
- registrationReference may exist as draft reference

### Explicit Submission

A future endpoint should perform explicit registration submission:

POST /trips/:tripId/submit-registration

Target state:

- tripStatus = REGISTERED
- registrationStatus = SUBMITTED
- clearanceStatus = PENDING
- TripRegistration.registrationCompletedAt = now

This endpoint should be added only after acceptance of the semantics.

---

## Pass / QR Boundary

Pass and QR issuance must remain blocked by existing downstream requirements.

Trip creation alone must not issue:

- OSP Pass
- QR Credential
- Booking
- PaymentIntent
- Manifest
- Clearance approval

---

## Required Code Impact If Accepted

Likely changes:

1. Patch TripsService.create to stop overriding schema defaults to REGISTERED / SUBMITTED.
2. Keep or create TripRegistration shell with registrationCompletedAt null.
3. Add submit-registration endpoint in a separate controlled lane.
4. Update traveler UI copy if needed to distinguish trip draft from submitted registration.
5. Update docs/osp-login-08-traveler-flow-closeout-doctrine.md if runtime behavior changes.
6. Add smoke checks for trip creation response statuses.

---

## Hard Stop Rules

Do not change pass issuance logic inside this lane.

Do not change QR issuance logic inside this lane.

Do not change manifest approval logic inside this lane.

Do not change payment logic inside this lane.

Do not create booking/payment/manifest from trip creation.

Do not mark a trip submitted without explicit traveler action.
