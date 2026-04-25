# SPM-07E — Passport Map Base Visual Placeholder Audit

## 1. Purpose

This audit decides whether One Siargao Pass should create a temporary owned visual placeholder for the Siargao Passport Map before commissioning or generating the final illustrated map asset.

This is not a final map asset lane.

This is not an image generation lane.

This is not a Google Maps integration lane.

This is a controlled audit to determine whether a non-final placeholder is useful for testing coordinate overlays, node markers, package routes, and stamp states.

---

## 2. Current Foundation

The current foundation is:

- SPM-07A — Geographic Fidelity Doctrine
- SPM-07B — Visual Asset / Illustration Direction Audit
- SPM-07C — Node Coordinate Doctrine
- SPM-07D — Coordinate Config Foundation

The current coordinate config exists at:

`frontend/src/spm/map/siargaoMapCoordinates.ts`

Current seeded nodes:

- GUYAM_ISLAND
- DAKU_ISLAND
- NAKED_ISLAND

Current route group:

- TRI_ISLAND_JOINER

Current scope remains:

- no final map asset
- no UI overlay
- no schema coordinate fields
- no Google Maps base
- no production illustration

---

## 3. Core Decision

A temporary placeholder map may be useful, but only if its role is tightly controlled.

The approved temporary placeholder role is:

- layout testing
- overlay testing
- mapX/mapY verification
- route line testing
- stamped / unstamped state testing
- mobile spacing testing
- label collision testing

The placeholder must not become:

- the final Siargao map
- official geography artwork
- a substitute for a proper illustrated asset
- a Google Maps-derived visual
- a fictional island shape accepted as production

---

## 4. Placeholder Asset Doctrine

If created, the placeholder asset must be clearly marked as:

- NON-FINAL
- LAYOUT TEST ONLY
- NOT GEOGRAPHICALLY ACCEPTED ARTWORK
- NOT FINAL SPM ILLUSTRATION
- NOT FOR PRODUCTION ACCEPTANCE

Recommended filename if created later:

`frontend/public/spm/siargao-passport-map-placeholder.svg`

Recommended visible label inside asset:

`SPM MAP PLACEHOLDER — NOT FINAL`

---

## 5. Why a Placeholder May Be Useful

A placeholder can help answer practical UI questions before final artwork exists.

It can test:

- whether normalized map coordinates work
- whether Tri-Island nodes render in readable positions
- whether route lines connect cleanly
- whether stamped and unstamped markers are visually distinct
- whether labels collide on mobile
- whether the map container height is correct
- whether bottom sheets or cards overlap the map
- whether the overlay architecture works before final asset production

This avoids waiting for final illustration before proving the technical overlay system.

---

## 6. Why a Placeholder Is Risky

A placeholder is risky if the team forgets it is temporary.

Risks:

- fake geography may become accidentally accepted
- stakeholders may judge visual quality prematurely
- developers may tune coordinates to the wrong base shape
- screenshots may circulate as if production-ready
- visual debt may get committed into the product identity
- final asset replacement may require coordinate rework

Therefore, the placeholder must be intentionally ugly enough or clearly marked enough to avoid accidental brand acceptance, while still being structurally useful for overlay testing.

---

## 7. Allowed Placeholder Style

Allowed placeholder style:

- simple SVG
- soft island-shaped silhouette
- rough main island area
- clearly labeled placeholder
- light water background
- simple zone hints
- no detailed fake place names
- no decorative final-grade artwork
- no production polish

The placeholder may include:

- rough mainland silhouette
- rough offshore island-hopping zone
- simple “General Luna area” hint
- simple “Island Hopping cluster” hint
- clear non-final watermark

---

## 8. Prohibited Placeholder Style

The placeholder must not:

- look like a final illustrated map
- use Google Maps tiles
- use downloaded map screenshots
- include fake official place names
- include high-detail invented geography
- imply accepted node placements beyond Tri-Island test scope
- include Socorro / Bucas Grande as if final geography is approved
- replace the final illustration process

---

## 9. Placeholder Scope

If created in the next technical lane, the placeholder should support only:

- map container testing
- Tri-Island overlay testing
- coordinate rendering
- route line proof
- stamped state proof

It should not support:

- full Siargao node registry
- Socorro / Bucas Grande inset finalization
- surf cluster final layout
- scenic cluster final layout
- final typography
- final illustration acceptance

---

## 10. Relationship to Coordinate Config

The placeholder should use the current coordinate config only for technical overlay tests.

Coordinates currently seeded:

- GUYAM_ISLAND
- DAKU_ISLAND
- NAKED_ISLAND

These coordinates remain starting visual coordinates only.

They are not production-accepted until tested against the final accepted illustrated base map.

---

## 11. Relationship to Final Asset

The final asset still requires a separate future lane.

The placeholder does not replace:

- visual research
- illustrated asset generation
- geography fidelity review
- production acceptance review
- mobile screenshot QA
- stakeholder approval

Future final asset lane should still produce or accept:

- owned SVG base
- recognizable Siargao silhouette
- real geography cluster placement
- overlay-safe visual zones
- mobile-safe label spacing

---

## 12. Audit Decision

Recommended decision:

Create a placeholder only if the next goal is to test overlay mechanics before final map generation.

Do not create the final illustrated map yet.

Do not use Google Maps.

Do not wire the placeholder into a public production-feeling UI without clear non-final labeling.

---

## 13. Recommended Next Lane

Recommended next lane:

SPM-07F — Passport Map Placeholder SVG Foundation

Scope:

- create `frontend/public/spm/siargao-passport-map-placeholder.svg`
- clearly mark it as non-final
- create no UI import
- create no overlay rendering
- create no production map acceptance
- build proof only

Alternative if we want to skip placeholder:

SPM-07F-ALT — Passport Map Overlay Component Audit

Scope:

- audit where the future overlay component should live
- no asset creation
- no UI rendering
- no final map generation

---

## 14. Hard Decision

The placeholder is allowed only as a test scaffold.

It must not become the official SPM map.

The final SPM map remains deferred until:

- final asset direction is locked
- coordinate system is tested
- official node placement is reviewed
- visual acceptance rules are satisfied
