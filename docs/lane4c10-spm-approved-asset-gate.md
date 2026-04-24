# Lane 4-C.10 — SPM Approved UI Asset Gate

## Hard Rule

Reject any SPM UI reconstruction that cannot visually align with the approved UI.

Build success is not enough. Browser visual result must match the approved design direction section by section.

## Current Decision

Do not continue JSX approximation using generic CSS, emojis, or reused unrelated assets.

The approved UI requires production assets before further reconstruction.

## Required Assets

Place the following files in frontend/public/osp/:

1. spm-logo-stamp.png
2. spm-map-illustration.png
3. spm-trail-general-luna.png
4. spm-trail-island-discovery.png
5. spm-trail-north-coast-locked.png
6. spm-stop-general-luna.png
7. spm-stop-cloud-9.png
8. spm-stop-magpupungko.png
9. spm-verified-seal.png
10. spm-continue-daku-island.png

## Validation Command

Run: ./scripts/check-spm-approved-assets.sh

## Rebuild Sequence After Asset Gate Passes

1. A1 Header with real logo asset
2. A2 Hero typography
3. A3 Map illustration with real map asset
4. A4 Legend
5. A5 Status row
6. A6 Trail cards with real images
7. A7 Verified stops with stop images and seal
8. A8 Continue journey card
9. A9 Bottom nav

## Forbidden

- No full-page screenshot as UI
- No generic approximation
- No fake DB state
- No QR/stamp mutation
- No backend or Prisma work in this visual lane
