# OSP Root Public Gateway Conversion

## Purpose

This lane converts `/` from the old traveler-home behavior into the public One Siargao Pass website gateway.

## What Changed

- `/` is now the public OSP website gateway.
- `/traveler/home` remains the mobile-first Traveler App home.
- Public root now routes users to:
  - Travelers
  - Operators
  - OTA / API Partners
  - LGU / DOT / Government
  - Passport Trails
  - Developers
  - Support
- Root CTAs point to:
  - `/traveler/start`
  - `/traveler/home`

## What Did Not Change

- Did not modify `/siargao-passport-map`.
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

