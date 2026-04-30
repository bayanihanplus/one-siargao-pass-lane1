# OSP Public Website Real CSS Foundation

## Problem

The public website rendered like raw HTML because this project does not currently use Tailwind configuration for the public components.

## Fix

The public website shell and OTA partner form were moved to real CSS classes defined in `frontend/app/globals.css`.

## Protected Boundaries

- Did not modify `/traveler/home`.
- Did not modify `/siargao-passport-map`.
- Did not expose token UI.
- Did not commit.

## Browser QA Required

Check:

- http://localhost:3000/
- http://localhost:3000/ota
- http://localhost:3000/developers
- http://localhost:3000/government
- http://localhost:3000/traveler/home
- http://localhost:3000/siargao-passport-map
