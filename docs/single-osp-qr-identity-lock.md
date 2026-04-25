# Single OSP QR Identity Lock — Architecture Doctrine

## Status

LOCKED.

This document locks the One Siargao Pass QR architecture for all future OSP, SPM, Passport Trails™, manifest, payment-reference, checkpoint, event, operator, guide, partner, and DOT/LGU compliance work.

## Core Rule

One traveler must not receive separate QR identities for separate modules.

The OSP QR is the single governed traveler identity anchor attached to the traveler’s OSP pass and trip context.

The same QR identity anchor is used across governed validation contexts.

## Correct Mental Model

One QR identity anchor.

Many validation contexts.

Separate event records per scan/use.

Separate downstream records per domain.

## What The QR Can Be Used For

The same OSP QR can be used for:

- Traveler ingress
- Traveler egress
- Airport checkpoint validation
- Seaport checkpoint validation
- Inter-island movement validation
- Boat boarding validation
- Boat disembarkation validation
- Manifest participation validation
- Activity check-in
- Activity check-out
- Operator access validation
- Guide validation
- Partner node validation
- Restaurant / culture node validation
- Scenic node validation
- Passport Trails™ stamp validation
- Event participation validation
- Payment-reference linkage
- DOT/LGU audit events
- Compliance exceptions

## Payment Boundary

The OSP QR is not the payment instrument.

The OSP QR may identify the traveler, trip, pass, booking, manifest, checkpoint, trail node, or service context used to initiate, verify, or reference a governed payment action.

Payment state must remain in payment records.

Payment references must remain in payment or fee records.

The QR must not become an uncontrolled money-transfer object.

## Passport Trails™ Boundary

Passport Trails™ must not create a separate QR identity.

Passport Trails™ scans must use the OSP QR token.

Passport Trails™ stamp validation must write OSP QR events and then update governed SPM stamp/progress records.

Correct output path:

1. Scan OSP QR
2. Resolve pass/trip/traveler
3. Validate trail node/context
4. Write OspQrEvent
5. Write or update SpmTravelerStamp
6. Write or update SpmTravelerStopVerification
7. Write or update SpmTravelerTrailProgress

## Manifest / Inter-Island Boundary

Manifest and inter-island movement must not create a separate manifest QR identity.

Inter-island movement, boat boarding, boat disembarkation, arrival, return, and egress must use the same OSP QR identity rail and write OspQrEvent records.

Movement records may reference QR events by ID.

## Event Boundary

Events must not create separate event QR identities.

Event participation may use the OSP QR identity anchor and must write scoped event/validation records.

## Forbidden Drift

Do not create:

- paymentQr
- eventQr
- trailQr
- passportTrailQr
- manifestQr
- separate QR identity
- per-module QR credential
- new QR table for Passport Trails™ identity
- new QR table for payment identity
- new QR table for manifest identity
- new QR table for event identity

## Allowed Records

The following are allowed because they are not separate QR identities:

- OspQrEvent
- PaymentIntent
- PaymentStateRecord
- PaymentEventLedger
- SpmTravelerStamp
- SpmTravelerStopVerification
- SpmTravelerTrailProgress
- Manifest
- ManifestMember
- InterIslandMovement
- ComplianceException
- Operator access records
- Activity participation records
- Fee payment audit records
- Fee receipt records

## Implementation Rule

Every meaningful QR interaction must write an OspQrEvent.

Domain modules may create their own downstream records, but they must reference the OSP QR event, QR credential, pass, trip, booking, manifest, movement, or node context rather than creating a new QR identity.

## Current Code Alignment Proof

Current schema supports:

- OspPass.tripId as unique trip-pass anchor
- QrCredential.ospPassId as unique pass-QR anchor
- QrCredential.qrToken as unique QR token
- OspQrEvent with tripId, passId, qrCredentialId, bookingId, trailBookingId, manifestId, operatorUserId, guideProfileId, partnerId, vesselId, checkpointId, paymentStatus, manifestStatus, outcome, and reason fields
- Passport Trails™ stamp path through passportStampScan using qrToken and trailNodeId
- Payments linked through bookingId and payment intent/state/event records, not a separate payment QR
- No detected parallel paymentQr, eventQr, trailQr, passportTrailQr, or manifestQr pattern

## Hard Decision

The architecture is GO.

Future work must preserve one OSP QR identity rail across all modules.
