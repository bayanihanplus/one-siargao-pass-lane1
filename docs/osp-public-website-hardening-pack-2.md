# OSP Public Website Hardening Pack 2

## Purpose

This lane hardens the public website interface so `/` clearly feels like the One Siargao Pass website gateway, while `/traveler/home` remains the mobile app interface.

## What Changed

- Hardened public website shell.
- Improved desktop navigation.
- Added mobile public navigation strip.
- Strengthened root homepage positioning.
- Clarified website vs traveler app separation.
- Added trust strip.
- Improved role-routing cards.
- Improved product-layer cards.

## Protected Boundaries

- Did not touch `/traveler/home`.
- Did not touch `/siargao-passport-map`.
- Did not expose API token UI.
- Did not claim OTA can issue QR independently.
- Did not claim all activities require manifest.
- Did not commit.

## Browser QA Required

Check:

- http://localhost:3000/
- http://localhost:3000/traveler/home
- http://localhost:3000/travelers
- http://localhost:3000/ota
- http://localhost:3000/developers
- http://localhost:3000/government
- http://localhost:3000/siargao-passport-map

Acceptance:

- `/` must feel like a public website.
- `/traveler/home` must still feel like the mobile app.
- Public copy must be customer-facing.
- Navigation must be readable and contrasted.
