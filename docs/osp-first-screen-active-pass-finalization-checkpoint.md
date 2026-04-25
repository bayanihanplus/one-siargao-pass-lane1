# OSP First Screen Active Pass Finalization Checkpoint

Date: 2026-04-25
Branch: fix/operator-staff-membership-layer

## Locked State

The OSP first screen now connects the traveler-facing first screen to the real active pass and SPM second screen.

## Official Logo Asset

Official OSP logo is now stored at:

frontend/public/osp/osp-official-logo.png

The old circular text placeholder in the OSP main header has been replaced by the official logo image.

## Active Pass QR Wiring

The OSP home active pass card now renders a real QR code from:

latestTravelerTrip.pass.qrCredential.qrToken

If no QR token exists, the UI must show a clear unavailable state. No fake QR shell should be used as a real credential.

## Traveler Pass Payment Fix

Backend trip detail composition now prefers a paid linked booking before falling back to latest linked booking.

Reason:
A newer unpaid/self-linked booking must not override a valid paid booking already attached to the same trip.

Current behavior:

- currentBooking prefers latest paid linked booking
- currentPaymentState reflects paid linked booking when available
- /traveler/pass can correctly show Pass Ready
- QR Credential is full-opacity when the pass is operationally ready

## OSP → SPM Bridge

Traveler pass page now links to:

/traveler/passport-map

The first screen hero also links to the SPM second screen through Open Passport Map.

## Hard Rules

- Do not restore the old circular text logo placeholder.
- Do not use fake QR graphics for active pass credentials.
- Do not treat latest unpaid booking as authoritative if a paid linked booking exists.
- OSP first screen remains the traveler operational entry point.
- SPM remains the second screen for trails, stamps, and passport-map progress.
- Real verification still comes from governed QR/stamp/pass/trip records.

## Latest Relevant Commits

- 940da92 wire official osp logo and active pass qr
- 8f5ec1a add traveler pass to spm bridge
- 6e87f93 redirect operators from root to operator workspace
- 72335b1 document spm real data ui idempotency checkpoint
- 8457748 connect passport stamp scans to spm traveler progress
