# OSP Public Website CSS Type Declaration Fix

## Problem

The project did not recognize side-effect CSS imports in TypeScript:

`import "./globals.css";`

Build failed because CSS module declarations were missing.

## Fix

Added `frontend/global.d.ts` with CSS declarations.

## Protected Boundaries

- Did not modify `/traveler/home`.
- Did not modify `/siargao-passport-map`.
- Did not expose token UI.
- Did not commit.
