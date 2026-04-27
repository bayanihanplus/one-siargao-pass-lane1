# OSP-LOGIN-08 — Traveler Flow Closeout Doctrine + Route Contract

## 1. Purpose

This document locks the current first-time traveler entry flow for One Siargao Pass.

The goal of this lane is to prevent drift between traveler login, first-time traveler start, traveler account registration, guided first trip creation, trip detail continuation, and OSP Pass / QR eligibility boundaries.

This document does not activate Google OAuth, Apple OAuth, pass issuance, QR issuance, payment, manifest creation, or clearance approval.

---

## 2. Locked Route Chain

Approved first-time traveler route chain:

/login
→ /traveler/start
→ /traveler/register
→ /login?mode=returning&registered=1&next=/traveler/trips/new
→ /traveler/trips/new
→ /traveler/trips/[tripId]

Route meaning:

- /login = traveler-owned entry gateway using existing email/password login.
- /traveler/start = first-time traveler start surface, frontend guidance only.
- /traveler/register = traveler account creation using existing POST /auth/register.
- /login?mode=returning&registered=1&next=/traveler/trips/new = post-registration login continuation.
- /traveler/trips/new = guided first trip setup using existing POST /trips.
- /traveler/trips/[tripId] = created trip detail page.

---

## 3. Login Doctrine

/login is a public traveler-owned surface.

It must not expose:

- Staff login
- Operator login
- LGU login
- Admin seeded accounts
- Internal dashboard language
- Intelligence-layer language
- Compliance backend mechanics

The traveler should understand only:

- Start
- My Trip
- Map
- Create My OSP Pass
- Continue My Trip

Google and Apple buttons are UI readiness placeholders only.

They must not claim:

- OAuth is active
- Account linking is active
- Provider callback routes exist
- Google or Apple account creation is live

Until OAuth is explicitly built, these buttons must remain safe placeholder behavior.

---

## 4. First-Time Traveler Start Doctrine

/traveler/start is a traveler orientation surface.

It may explain:

- account access
- trip details
- OSP Pass readiness
- QR readiness
- map preview

It must not claim:

- pass is issued
- QR is issued
- trip is created
- booking is created
- payment is created
- manifest is created
- clearance is approved

Allowed routing from this page:

- /traveler/register
- /traveler/trips/new
- /traveler/passport-map
- /traveler/pass

---

## 5. Traveler Registration Doctrine

/traveler/register creates a traveler account only.

It uses existing backend endpoint:

POST /auth/register

Known backend behavior:

- creates User
- sets primaryRole = TRAVELER
- creates blank TravelerProfile
- creates notification preferences
- returns user basics only
- does not return access token

Required registration fields:

- fullName
- password
- either email or mobileNumber

After successful registration, redirect is locked as:

/login?mode=returning&registered=1&next=/traveler/trips/new

This ensures a first-time traveler continues to trip setup immediately after signing in.

Registration must not create:

- Trip
- OSP Pass
- QR Credential
- Booking
- PaymentIntent
- Manifest
- Clearance approval

---

## 6. Guided First Trip Creation Doctrine

/traveler/trips/new creates a trip record only.

It uses existing backend endpoint:

POST /trips

Required trip fields:

- arrivalDate
- departureDate

Optional trip fields:

- tripTitle
- originLocation
- declaredAccommodationName

Current backend behavior:

- creates Trip
- creates TripRegistration
- sets tripStatus = REGISTERED
- sets registrationStatus = SUBMITTED
- sets clearanceStatus = PENDING

This backend behavior is accepted for now but may need a future semantics audit because it submits registration immediately.

After successful trip creation, redirect is locked as:

/traveler/trips/[tripId]

Trip creation must not create:

- OSP Pass
- QR Credential
- Booking
- PaymentIntent
- Manifest
- Clearance approval

---

## 7. Pass / QR Boundary Doctrine

OSP Pass / QR must remain eligibility-based.

The first-time flow must never imply instant pass/QR issuance.

Known pass boundary:

- Pass readiness checks trip state.
- Pass issuance remains separate from registration.
- Pass issuance remains separate from trip creation.
- Pass/QR requires downstream eligibility such as clearance and payment conditions, as enforced by pass service logic.

Boundary-safe language:

- Pass and QR are not instant.
- Trip record first. Pass later.
- Your OSP Pass / QR appears when your trip is ready.

Avoid unsafe language unless backend records prove it:

- Pass issued
- QR issued
- Trip approved
- Clearance approved
- Payment completed
- Manifest created

---

## 8. Traveler UI Visual Doctrine

The first-time traveler flow must remain mobile-app production grade.

Approved styling direction:

- green / teal OSP pantone
- compact CTA buttons
- readable icon logic
- soft card shells
- no bulky button blocks
- no admin/dev-style pages
- no public exposure of staff/operator/LGU surfaces

Relevant pages:

- /login
- /traveler/start
- /traveler/register
- /traveler/trips/new
- /traveler/trips
- /traveler/trips/[tripId]

Any future patch to these pages must preserve visual consistency.

---

## 9. Current Accepted Route Contract

First-time traveler:

/login
Click: Create My OSP Pass
→ /traveler/start
Click: Create account
→ /traveler/register
Submit registration
→ /login?mode=returning&registered=1&next=/traveler/trips/new
Sign in
→ /traveler/trips/new
Submit trip
→ /traveler/trips/[tripId]

Returning traveler:

/login?mode=returning
Sign in
→ next path if present
→ otherwise /

Traveler without trip:

/traveler/trips
Empty state
Click: Create Trip
→ /traveler/trips/new

---

## 10. Deferred Work

The following are explicitly deferred:

1. Google OAuth
2. Apple OAuth
3. Auto-login after registration
4. Email verification
5. Mobile verification
6. Trip draft semantics
7. Trip registration review workflow
8. Pass issuance changes
9. QR issuance changes
10. Booking creation
11. Payment creation
12. Manifest creation
13. Clearance approval
14. Traveler profile enrichment
15. Staff/operator/LGU login separation route

---

## 11. Hard Stop Rules

Do not build any of the following inside the first-time traveler entry flow unless a dedicated lane is opened:

- OAuth provider callbacks
- automatic pass issuance
- automatic QR issuance
- automatic booking creation
- automatic payment creation
- automatic manifest creation
- automatic clearance approval
- public staff/operator/LGU login entry
- intelligence-layer exposure
- fake success claims unsupported by backend state

---

## 12. Closeout Status

OSP-LOGIN-01 through OSP-LOGIN-07 established and accepted:

- Traveler-owned /login
- Dedicated /traveler/start
- Dedicated /traveler/register
- Guided /traveler/trips/new
- Registration-to-trip continuation
- Browser QA route chain
- Pass/QR boundary preserved

This route contract is now the source of truth for the current first-time traveler entry flow.
