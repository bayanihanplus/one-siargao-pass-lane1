# OSP Command Center Phase 4 — Date-Scoped Data + Municipality Breakdown

## Purpose

This lane makes the command center filters more meaningful by adding DB-backed date-scoped counts and municipality breakdown readiness.

## Added

- Date-scoped DB counts where date columns exist.
- Municipality breakdown detection where municipality columns exist.
- LGU and Super Admin date-scoped sections.
- LGU and Super Admin municipality breakdown readiness sections.
- Clear build-target messaging when municipality-specific columns are not normalized yet.

## Current Scope

Date range now produces filtered counts when source tables expose a compatible date/timestamp column.

Municipality dropdown is architecturally present. Municipality-native aggregation is surfaced as active only where the table has a detectable municipality column.

## Hard Boundary

No fake municipality data.

If municipality columns are not present, the dashboard must show build-target status instead of pretending that municipal filtering is complete.

## Protected Boundaries

- LGU remains role-scoped.
- No raw OTA commercial exposure.
- No operator financial exposure.
- No unrestricted traveler personal data.
- No token secrets.
- No commit.
