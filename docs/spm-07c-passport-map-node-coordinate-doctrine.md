# SPM-07C — Passport Map Node Coordinate Doctrine

## 1. Purpose

This doctrine defines how Siargao Passport Map nodes should be positioned on the owned illustrated Passport Map before any final map UI, schema change, or visual asset generation.

SPM-07A locked geographic fidelity.
SPM-07B locked visual asset direction.
SPM-07C locks the coordinate doctrine.

This prevents premature UI map work and avoids baking wrong node positions into the visual system.

---

## 2. Strategic Decision

The Passport Map must use a dual-coordinate system: real-world coordinates and illustrated map coordinates.

Real-world coordinates are used for geographic truth, future directions, utility map links, operator/admin verification, safety checks, and LGU or operations use cases.

Illustrated map coordinates are used for Passport Map UI, node marker placement, label placement, route overlays, stamp overlays, mobile layout, and inset handling.

Hard lock: do not use raw latitude and longitude directly as UI map positions.

Hard lock: do not treat visual map coordinates as real geospatial truth.

---

## 3. Coordinate System Standard

The first production-friendly coordinate standard must use normalized percentage coordinates.

- mapX: 0 to 100
- mapY: 0 to 100
- labelX: 0 to 100
- labelY: 0 to 100

x means horizontal percentage from left to right.
y means vertical percentage from top to bottom.

Example: GUYAM_ISLAND may start around mapX 64 and mapY 73 as a visual coordinate, not a real GPS coordinate.

---

## 4. Why Percentage Coordinates

Percentage coordinates are recommended first because they are simple, mobile-friendly, SVG-compatible, React overlay-compatible, easy to tune visually, independent from final pixel size, and compatible with responsive map scaling.

This lets the map render across phone width, larger mobile screens, tablet views, web previews, and SVG-based map layers without rewriting every node placement.

---

## 5. Coordinate Storage Decision

Use frontend coordinate config first.

Recommended first implementation path:

frontend/src/spm/map/siargaoMapCoordinates.ts

Do not immediately mutate Prisma schema.

Reason: the visual asset is not final yet, node placement will require tuning, map layout may change after browser review, schema-level coordinates are premature before asset acceptance, rollback is easier, and no migration is needed.

Future schema path may later add SpmTrailNodeMapPosition after the visual coordinate system stabilizes.

---

## 6. Coordinate Ownership Rule

The coordinate layer belongs to the visual map system, not the trail node truth system.

- SpmTrailNode owns official node truth.
- Package-node contracts own package inclusion.
- Stamp tables own stamp truth.
- Package progress owns package completion.
- Coordinate config owns visual placement.

Do not overload one model with all responsibilities.

---

## 7. Required Coordinate Fields

Each coordinated node should eventually support: nodeCode, mapRegion, mapX, mapY, labelX, labelY, labelAlign, displayPriority, insetGroup, and routeGroup.

Required minimum fields: nodeCode, mapRegion, mapX, mapY.

Recommended fields: labelX, labelY, labelAlign, displayPriority, insetGroup, routeGroup.

---

## 8. Map Region Doctrine

Each node must belong to one controlled visual region.

Recommended map regions:

- TOURISM_CORE
- ISLAND_HOPPING
- SURF_BELT
- NORTH_SIARGAO
- SCENIC_INLAND
- SOCORRO_BUCAS_GRANDE
- SYSTEM_MILESTONE

mapRegion controls visual grouping and overlay behavior. It does not replace official geography classification.

---

## 9. Inset Coordinate Doctrine

Some regions should not be forced onto the main island map at full scale.

This applies especially to Socorro / Bucas Grande, distant adventure clusters, special marine movement clusters, and dense island-hopping subclusters if mobile readability requires callout logic.

Recommended insetGroup example: BUCAS_GRANDE_INSET.

Inset nodes may still use normalized coordinates, but within the inset coordinate frame.

Hard lock: inset use must not imply false geographic adjacency. Insets must be labeled and visually separated.

---

## 10. Label Coordinate Doctrine

Labels should not always sit directly on the marker.

Marker coordinate equals mapX and mapY.
Label coordinate equals labelX and labelY.

This supports cleaner mobile readability, fewer overlapping labels, controlled stamp marker placement, and better route line visibility.

Hard rule: label nudging is allowed. Marker movement that breaks geographic truth is not allowed.

---

## 11. Display Priority Doctrine

Display priority controls map clutter.

- 1 = primary package node
- 2 = important official node
- 3 = supporting official node
- 4 = candidate or hidden until relevant
- 5 = system-only or not displayed by default

For Tri-Island Joiner: Guyam Island, Daku Island, and Naked Island are priority 1.

Secret Island and Socorro adventure placeholders should remain priority 4 or inset-only until validated.

---

## 12. Route Group Doctrine

Route grouping must support package paths.

Recommended route groups:

- TRI_ISLAND_JOINER
- ISLAND_HOPPING_EXTENDED
- SURF_EXPLORER
- NORTH_COAST_ADVENTURE
- SCENIC_SUNSET
- SOCORRO_BUCAS_GRANDE_ADVENTURE

Route groups are visual overlay groupings. They do not replace package code or trail family code.

---

## 13. First Coordinate Scope

Do not coordinate every possible Siargao node immediately.

Seed first: GUYAM_ISLAND, DAKU_ISLAND, NAKED_ISLAND.

Reason: current package TRI_ISLAND_JOINER exists, package progress exists, node stamp state exists, UI reads package detail contract, and this is the easiest path to test overlay and stamp states.

Seed second: CLOUD_9, CATANGNAN_BRIDGE_SUNSET, COCONUT_ROAD_SCENIC_POINT, MAGPUPUNGKO, PACIFICO_SURF_AREA.

Seed third only after validation: CORREGIDOR_ISLAND, MAM_ON_ISLAND, SECRET_ISLAND, UNION_SURF_AREA, GIWAN, SECRET_SPOT, HAWAIIAN_HILLS, LITTLE_HAWAII, and SOCORRO / BUCAS GRANDE nodes.

---

## 14. Tri-Island Coordinate Doctrine

The first visual map overlay should prove the Tri-Island Joiner package.

Guyam, Daku, and Naked must appear as offshore island-hopping nodes connected to the General Luna jump-off context.

The three nodes must be visibly separate but cluster-related.

The stamped node must render differently from unstamped nodes.

Current required UI state: Guyam Island stamped and verified, Daku Island not stamped, Naked Island not stamped, package progress 33 percent.

---

## 15. Coordinate Accuracy Standard

The first coordinate version should aim for true region placement, believable relative placement, mobile readability, and clear state rendering.

It does not need exact meter-level geospatial accuracy, exact boat route geometry, survey-grade alignment, or pixel-perfect road/coastline alignment.

Hard lock: readable and truthful beats geospatially exact but unusable.

---

## 16. Relationship to Real Coordinates

Future real coordinates may still be used for Open in Maps, directions, operator pickup/drop-off accuracy, safety and compliance checks, official LGU/admin views, logistics, and manifest intelligence.

But these must remain separate from the Passport Map visual coordinate layer.

---

## 17. Relationship to Google Maps

Google Maps may later be used as a utility link or operations tool.

It must not provide the base visual map, be downloaded as a static base, define the SPM visual style, or replace the owned coordinate system.

The SPM Passport Map coordinate system must work without Google Maps.

---

## 18. Coordinate Validation Rules

Before a node coordinate is accepted, it must pass these checks: node exists in the controlled trail node registry, node belongs to the expected geography cluster, node is not placed in a false region, node does not create wrong package path interpretation, label is readable on mobile, marker does not overlap important labels, node supports stamped/unstamped visual state, node supports future route overlay, node does not require Google Maps to render, and distant/inset nodes are clearly labeled as inset if used.

---

## 19. Rejection Rules

Reject a coordinate if it places General Luna-related nodes in the wrong region, places offshore island-hopping nodes inland, makes Pacifico appear near General Luna, collapses Bucas Grande / Socorro into mainland Siargao, makes a conditional node look officially active, causes unreadable mobile labels, hides stamped/unstamped state, confuses package progress, relies on raw Google map positioning, or cannot support future visual overlays.

---

## 20. Recommended First Coordinate File

Future first implementation should create:

frontend/src/spm/map/siargaoMapCoordinates.ts

Starting visual coordinates should seed GUYAM_ISLAND, DAKU_ISLAND, and NAKED_ISLAND only.

These are starting visual coordinates only and must be verified against the accepted illustrated base map before production acceptance.

---

## 21. Final Decision

Use frontend coordinate config first.

Do not add Prisma coordinate fields yet.

Do not generate the final map asset yet.

Do not wire final Passport Map overlay yet.

Next step after this doctrine: create a controlled coordinate config lane, test only Tri-Island nodes first, then create or accept the visual map asset, then implement overlay logic.

---

## 22. Next Lane

Recommended next lane: SPM-07D — Passport Map Coordinate Config Foundation.

Purpose: create frontend coordinate config, seed only Tri-Island Joiner node coordinates, add no UI behavior yet, build proof only, and prepare for later overlay implementation.
