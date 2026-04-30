# OSP Admin Partners ApiState Type Fix

## Problem

The `/admin/partners` page failed TypeScript build because `ApiState` constrained the loading message to one exact string.

Action submissions use dynamic loading messages such as:

- Submitting approve action...
- Submitting suspend action...
- Submitting reject action...

## Fix

Widened the `loading` message type to `string`.

## Protected Boundaries

- Did not modify `/traveler/home`.
- Did not modify `/siargao-passport-map`.
- Did not expose token UI.
- Did not commit.
