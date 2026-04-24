# Lane 4-C.9 — SPM Production Asset Intake + Replacement Plan

Branch:
- fix/operator-staff-membership-layer

Current HEAD:
- 175175b add spm continue journey preview card

## CTO Finding

The current SPM UI route is functional and build-safe, but it is not production-grade 100% approved UI.

Reason:
- The approved UI depends on a premium illustrated Siargao map asset.
- The current implementation uses a developer-drawn SVG/CSS map approximation.
- The approximation is useful for shell proof, but rejected as final production UI.

## Asset Audit Result

Existing public assets:
- frontend/public/osp/osp-hero-map.png

Missing asset:
- frontend/public/osp/spm-approved-map.png

Current SPM page still uses:
- SpmMapVisualPreview
- PreviewPin
- MapLabel
- inline SVG map drawing

## Hard Decision

The CSS/SVG map must not be polished further as final.

Production-grade SPM requires an asset-driven map implementation.

## Required Production Asset

Preferred target path:
- frontend/public/osp/spm-approved-map.png

Asset requirements:
1. Map-only image asset.
2. No iPhone frame.
3. No browser chrome.
4. No bottom navigation.
5. No full-page screenshot.
6. Includes premium illustrated Siargao island.
7. Includes approved route visual.
8. Includes approved pin/stamp/lock visual language if available.
9. Includes key labels where approved:
   - Daku Island
   - General Luna
   - Cloud 9
   - Magpupungko
   - Pacifico
   - Alegria Beach
10. Minimum recommended height: 1200px.
11. PNG or WebP accepted.
12. Transparent background preferred if possible.

## Replacement Plan

Once the asset exists:

1. Add asset to:
   - frontend/public/osp/spm-approved-map.png

2. Replace:
   - SpmMapVisualPreview

3. Remove or deprecate:
   - CSS/SVG island drawing
   - PreviewPin
   - MapLabel

4. Use image-backed hero composition:
   - text block layered left/front
   - map asset positioned right/center
   - legend/status below
   - no map library
   - no geolocation
   - no backend
   - no DB mutation

## Forbidden Scope

Do not add:
- Leaflet
- Mapbox
- Google Maps
- geolocation
- backend API
- Prisma models
- QR event creation
- Passport Stamp creation
- real progress calculation
- official trail completion

## Final Acceptance Rule

SPM approved UI cannot be considered production-grade until the real SPM map asset is added and the CSS/SVG approximation is replaced.
