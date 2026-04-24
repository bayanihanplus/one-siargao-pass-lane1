# Lane 4-C.10 — SPM Approved UI Asset Gate

## Hard Rule

Reject any SPM UI reconstruction that cannot visually align with the approved UI.

Build success is not enough. Browser visual result must match the approved design direction section by section.

## Current Decision

Do not invent asset filenames.

Use only the actual approved assets currently present in:

- frontend/public/osp/

## Approved Current Asset Filenames

1. one-siargao-pass.png
2. osp-hero-map.png

## Usage Rule

- one-siargao-pass.png is the approved SPM visual reference asset.
- osp-hero-map.png is the existing map/island visual asset available in the repo.
- Do not use a full-page screenshot as the final interactive UI.
- Rebuild the UI as JSX components section by section.
- Use approved assets only where they strengthen visual fidelity.

## Validation Command

Run: ./scripts/check-spm-approved-assets.sh

## Rebuild Sequence

1. A1 Header only
2. A2 Hero typography only
3. A3 Map visual only
4. A4 Legend only
5. A5 Status row only
6. A6 Trail cards only
7. A7 Verified stops only
8. A8 Continue journey only
9. A9 Bottom nav only

## Forbidden

- No invented filenames
- No full-page screenshot as final UI
- No generic approximation
- No fake DB state
- No QR/stamp mutation
- No backend or Prisma work in this visual lane
