# OSP-TRIP-04 — Explicit Trip Registration Submit Endpoint Audit

## Purpose

OSP-TRIP-03 changed POST /trips so trip creation now creates a draft trip instead of immediately submitting registration.

This lane audits the required second compliance action:

POST /trips/:tripId/submit-registration

This audit does not patch runtime behavior yet.

---

## Current Locked Behavior

POST /trips creates:

- tripStatus = DRAFT
- registrationStatus = INCOMPLETE
- clearanceStatus = PENDING
- TripRegistration shell
- TripRegistration.registrationCompletedAt = null

This correctly separates trip draft creation from registration submission.

---

## Required Submit Endpoint

Proposed endpoint:

POST /trips/:tripId/submit-registration

Runtime requirements:

- Authenticated traveler only
- Trip must belong to current traveler
- Trip must exist
- Trip must not be cancelled
- Trip must not already be submitted, verified, or rejected without dedicated resubmission rules
- Required trip fields must be present:
  - arrivalDate
  - departureDate
- TripRegistration shell should exist or be created if missing
- registrationCompletedAt must be set to now
- tripStatus becomes REGISTERED
- registrationStatus becomes SUBMITTED
- clearanceStatus remains PENDING

---

## Required Response Contract

The endpoint should return the updated trip with registration data.

Minimum fields expected:

- id
- tripStatus
- registrationStatus
- clearanceStatus
- registration.registrationReference
- registration.registrationCompletedAt

---

## Explicit Non-Goals

This endpoint must not create:

- OSP Pass
- QR Credential
- Booking
- PaymentIntent
- Manifest
- Clearance approval

This endpoint must not mutate:

- pass issuance
- QR issuance
- payment state
- manifest state
- manifest approval requests

---

## Future UI Implication

After this endpoint exists, traveler trip detail should eventually expose a controlled action:

Submit Registration

Only when:

- tripStatus = DRAFT
- registrationStatus = INCOMPLETE

After submit, UI should show:

- tripStatus = REGISTERED
- registrationStatus = SUBMITTED
- clearanceStatus = PENDING

But UI patch is separate from endpoint patch.

---

## Hard Stop Rules

Do not change pass service in this lane.

Do not change OSP QR service in this lane.

Do not change payment service in this lane.

Do not change manifest or manifest approval service in this lane.

Do not approve clearance from this endpoint.

Do not issue pass or QR from this endpoint.
