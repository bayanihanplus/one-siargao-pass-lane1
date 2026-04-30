# OSP PUBLIC-03 — Blue Pantone + Logo Audit

## Decision

The public website must follow the official OSP app hue. The current green-heavy public shell is not aligned with the OSP app identity.

## Required Direction

- Replace public website green dominance with OSP official blue.
- Use a universal brand token layer.
- Apply brand colors through shared public shell selectors.
- Insert official OSP logo globally in the public header.
- Do not manually patch every public route.
- Do not invent a fake official logo if the real logo asset is missing.

## Required Asset

Preferred official logo path:

- `frontend/public/osp/osp-logo.svg`

Acceptable alternatives if already present:

- `frontend/public/osp/osp-logo.png`
- `frontend/public/osp/one-siargao-pass-logo.svg`
- `frontend/public/osp/one-siargao-pass-logo.png`

## Temporary Color Lock

Until exact official Pantone/HEX is supplied, use the app-aligned OSP Blue system:

- OSP Blue Deep: `#0B2E6B`
- OSP Blue: `#1D4ED8`
- OSP Blue Bright: `#2563EB`
- OSP Sky: `#0EA5E9`
- OSP Soft Blue Background: `#EFF6FF`
- OSP Sand Accent: `#FDE68A`

These are web tokens, not final print Pantone values.
