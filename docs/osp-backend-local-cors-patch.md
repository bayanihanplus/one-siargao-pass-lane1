# OSP Backend Local CORS Patch

## Problem

The OTA partner request form worked through direct curl but failed in browser because the Nest backend did not enable CORS for the local frontend origin.

## Fix

Added local frontend CORS support in `backend/src/main.ts` for:

- http://localhost:3000
- http://127.0.0.1:3000

## Protected Boundaries

- Did not modify `/traveler/home`.
- Did not modify `/siargao-passport-map`.
- Did not expose token UI.
- Did not commit.
