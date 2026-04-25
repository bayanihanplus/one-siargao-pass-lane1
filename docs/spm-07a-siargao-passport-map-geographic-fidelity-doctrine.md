# SPM-07A — Siargao Passport Map Geographic Fidelity Doctrine

## 1. Purpose

This doctrine locks how the Siargao Passport Map must represent real Siargao geography while remaining a premium, owned, stylized Passport Map visual layer.

This document exists to prevent drift into either of the following bad directions:

1. a fake fantasy map that no longer reflects real Siargao geography
2. a generic Google Maps style map that weakens Passport Trails branding and introduces unnecessary dependency

The SPM map must be:

- geographically faithful
- visually stylized
- mobile-friendly
- owned as a product asset
- compatible with Passport Trails package logic
- compatible with stamp progression logic
- independent from downloaded Google map tiles

---

## 2. Strategic Decision

The Siargao Passport Map is **not** a raw navigation map.

It is a:

- journey map
- Passport Trails visualization layer
- progress/stamp visualization layer
- destination memory layer
- commercial and repeat-travel engagement layer

Therefore, the map must use an **owned illustrated map base** that remains anchored to the true Siargao geography.

### Locked decision

The SPM map must be:

- based on real Siargao geography
- illustratively rendered
- not dependent on Google Maps tiles or screenshots
- not fictionalized
- not reduced to standard map pins on a utility map

---

## 3. Core Fidelity Standard

The official fidelity standard is:

**Geographically Faithful, Visually Stylized**

This means the map must preserve:

- true island form
- true orientation
- true relative region placement
- true tourism geography logic
- true trail-node spatial logic

This also means the map may simplify:

- minor coastline detail
- exact road geometry
- exact distance ratios
- small-scale inlets and micro-curves
- dense real-world clutter that hurts mobile readability

### Hard lock

The map must feel like:

- real Siargao
- premium Passport Map
- trail progression layer

It must not feel like:

- fantasy island art
- inaccurate cartoon tourism graphic
- generic web map screenshot
- direct Google Map clone

---

## 4. What Must Remain True

The following truths must remain intact in all future SPM map visuals.

### 4.1 Island silhouette truth

The main Siargao island silhouette must remain recognizably Siargao.

The map must preserve:

- the overall island shape
- the recognizable east-coast and south-east tourism side
- the northward extension of the island
- the correct relative offshore positioning of nearby key islands relevant to tourism packages

### 4.2 Orientation truth

North must remain north.

The map must preserve broad geographic orientation so that:

- General Luna remains in the south / south-east tourism core
- Cloud 9 / Catangnan stay on the east-side surf/tourism zone
- Pacifico remains in the north / north-east zone
- inland/scenic/falls zones remain inland and northward relative to General Luna
- island-hopping destinations remain offshore from General Luna in their proper relative direction
- Bucas Grande / Socorro remains separate from mainland Siargao and treated as a distant adventure cluster

### 4.3 Relative geography truth

The map must preserve real relative placement between important zones and nodes.

Examples:

- Guyam, Daku, and Naked must sit in a believable island-hopping cluster relative to General Luna
- Cloud 9 must not appear inland or on the wrong coast
- Pacifico must not appear near General Luna
- Magpupungko must not appear south of General Luna
- Bucas Grande / Socorro must not appear as an adjacent tiny stop beside General Luna

### 4.4 Tourism geography truth

The map must preserve real tourism geography clusters.

These clusters govern both visual grouping and future trail logic.

---

## 5. Locked Tourism Geography Clusters

The SPM map must group locations according to controlled tourism geography, not random pin placement.

### 5.1 General Luna / Tourism Core Cluster

Includes the core south/south-east tourism concentration around General Luna and nearby areas.

Example controlled zone references:

- General Luna
- Catangnan
- Cloud 9 vicinity
- Sunset Bridge / Catangnan Bridge zone
- nearby tourism-core support areas

### 5.2 Island Hopping Cluster

Includes the official island-hopping geography associated with the General Luna jump-off context.

Confirmed examples:

- Guyam Island
- Daku Island
- Naked Island
- Corregidor Island
- Mam-on Island
- Secret Island — conditional only

### 5.3 Surf Explorer Cluster

Includes surf-related geography that must remain on the proper surf-oriented coast and regional zones.

Confirmed examples:

- Cloud 9
- Jacking Horse
- Quicksilver
- Tuason Point
- Stimpy’s
- Pacifico surf area
- Union Surf Area
- Giwan
- Secret Spot

### 5.4 Scenic / Sunset Cluster

Includes scenic and sunset-oriented nodes or viewpoints.

Confirmed examples:

- Cloud 9 Sunset Zone
- Catangnan Bridge / Sunset Bridge
- Coconut Road Scenic Point
- Pacifico Scenic / Sunset Point
- Magpupungko scenic area
- Hawaiian Hills
- Little Hawaii

### 5.5 Inland / Nature Cluster

Includes inland and nature-based stops that are not primarily surf or island-hopping nodes.

Examples may include controlled inland waterfalls, scenic routes, coconut-road style landscapes, and inland exploratory routes once fully approved.

### 5.6 North Siargao Cluster

Includes northward geography and nodes whose identity depends on their northern placement.

Pacifico and related scenic/nature/surf subzones must remain visually north relative to General Luna.

### 5.7 Socorro / Bucas Grande Adventure Cluster

This must be treated as a distinct, controlled distant cluster.

Confirmed inclusion:

- Socorro Island / Bucas Grande
- Sohoton Cove context
- Jellyfish Sanctuary context
- caves / lagoons / adventure water-route logic
- operator jump-off logic where relevant

This cluster must not be visually collapsed into mainland Siargao.

---

## 6. What May Be Stylized

The following may be stylized for the sake of premium visual quality and mobile readability:

- coastline smoothness
- route curves
- decorative terrain texture
- landmark icon style
- stamp marker style
- label typography treatment
- visual path connectors
- water texture, wave treatment, passport/expedition styling
- inset framing, banners, parchment cards, stamp frames

### Hard rule

Stylization must enhance comprehension and brand value, not distort geography.

---

## 7. What Must Not Drift

The following are prohibited:

- moving major zones into wrong island regions
- turning the map into a fantasy or theme-park diagram
- compressing all nodes toward General Luna for convenience
- placing Bucas Grande beside mainland Siargao just to fit screen layout
- swapping north/south orientation
- using arbitrary positions that break true regional logic
- turning offshore island nodes into inland markers
- using a downloaded Google map screenshot or tile as the visual base
- tracing and presenting Google map imagery as the owned map asset

---

## 8. Dual Coordinate Doctrine

The SPM map must eventually support two coordinate truths for each node.

### 8.1 Real-world geography truth

Each node must preserve real-world location attributes such as:

- municipality
- barangay where applicable
- latitude
- longitude
- tourism geography cluster
- regional/island grouping

This is the real-world anchor.

### 8.2 Illustrated map placement truth

Each node must also support a visual placement layer for the Passport Map.

Recommended future visual fields:

- mapX
- mapY
- labelX
- labelY
- mapRegion
- visualPriority
- insetGroup
- routeLayer

This is the presentation anchor.

### Hard lock

Do not confuse real-world coordinates with visual overlay coordinates.

The real-world coordinates support geography truth.

The visual coordinates support a readable premium map UI.

---

## 9. Inset / Callout Doctrine

Not all geography should be forced into the same exact continuous scale.

This is especially important for:

- Bucas Grande / Socorro
- distant or special cluster groupings
- offshore groups that would otherwise become too tiny or unreadable on mobile

### Locked rule

The map may use insets or callout boxes for geographically distant clusters **only if**:

- the inset clearly preserves relative identity
- the inset is visually labeled
- the inset does not imply false adjacency
- the user can still understand the stop is part of the broader destination experience

### Example

Bucas Grande / Socorro may be shown in a dedicated inset panel or callout rather than forced into a misleading near-main-island scale.

---

## 10. Node Placement Doctrine

Every visual node must respect the following hierarchy:

1. geography truth
2. trail/package logic
3. visual readability
4. stampability and interaction clarity

### 10.1 Node placement rules

Nodes must be placed according to their real-world cluster and relative position first.

Then they may be slightly adjusted for:

- label overlap prevention
- mobile readability
- line/path clarity
- tap-target usability

### 10.2 Acceptable movement

A node may be nudged slightly for readability.

A node may not be moved so far that it appears in the wrong geography cluster or wrong island region.

---

## 11. Trail Path Doctrine

Trail paths are narrative path overlays, not literal navigational road routes.

The displayed path must communicate:

- package progression
- cluster sequence
- traveler journey logic
- stamp path clarity

### Trail paths may:

- use simplified curved connectors
- abstract marine movement
- abstract island-hopping progression
- show directional flow between official nodes

### Trail paths must not:

- pretend to be exact marine navigation tracks
- imply unsafe or unauthorized route operation
- override real regional placement
- suggest operational routing not approved by the governed system

---

## 12. Label Doctrine

Labels must remain readable and geography-aware.

### Labels must reflect:

- official node name
- official package name where needed
- cluster/inset identity where useful

### Labels may be stylized with:

- expedition-map treatment
- passport-style captions
- premium tourism visual tone

### Labels must not:

- clutter the map
- obscure the island shape
- create false geographic interpretation
- replace a node name with non-governed marketing language

---

## 13. Stamp Visual Doctrine

Digital stamp visuals may appear on the map as the traveler progresses.

The stamp marker visual should feel like:

- passport stamp
- immigration-style mark
- journey verification seal
- premium travel collectible

But stamp visuals must not obscure map comprehension.

### Stamp states must eventually support:

- not stamped
- stamped
- verified
- revoked if needed
- completion-ready where relevant

The visual language may vary, but the geography underneath must remain true.

---

## 14. Google Maps / Utility Map Boundary Doctrine

Google Maps or similar utility maps may be used later only as a secondary utility layer.

Approved future utility uses:

- Open in Google Maps
- Get Directions
- external navigation
- operational lookup
- admin/operator support tools

### Hard lock

Google Maps must **not** be the SPM base visual layer.

Do not:

- download Google map imagery for the Passport Map
- build the Passport Map as a Google map screenshot
- rely on Google tiles as the owned visual asset
- make SPM’s main identity depend on Google map rendering

The owned illustrated Passport Map is the primary visual product.

---

## 15. Mobile Production Doctrine

The Passport Map is ultimately a mobile production screen.

Therefore, geographic fidelity must be balanced with mobile clarity.

### The map must support:

- readable node placement on mobile
- clear package progression
- visible stamped vs unstamped state
- touch-safe interactive zones
- clear legends and status states
- scroll-safe or panel-safe composition
- future map zoom or segmented panel logic if required

### The map must not become:

- a cluttered desktop map shrunk to phone size
- a dense operations map
- a tiny-pin utility map
- a wallpaper with unreadable labels

---

## 16. Acceptance Standard

A future SPM Passport Map passes geographic fidelity review only if all of the following are true:

1. A person familiar with Siargao would still recognize the map as Siargao.
2. Major regions are in the correct relative location.
3. Key official trail nodes are not placed in false geographies.
4. Island-hopping nodes feel offshore and relative to the correct jump-off context.
5. North-zone nodes still read as north.
6. Bucas Grande / Socorro remains visibly distinct and not falsely adjacent.
7. The map reads as a Passport Map, not a generic utility map.
8. The map remains readable on mobile.
9. Node placement supports future stamp overlay.
10. The visual remains owned and brandable.

---

## 17. Rejection Standard

A future SPM Passport Map must be rejected if any of the following occur:

- General Luna cluster drifts into the wrong zone
- Cloud 9 appears on the wrong side of the island
- Pacifico loses its northern identity
- island-hopping nodes are visually misplaced into inland areas
- Bucas Grande / Socorro is falsely represented as adjacent to mainland Siargao
- the map depends on Google map tiles or screenshots
- stylization causes geographic mistruth
- the map is too cluttered to support mobile stamps/trail progression
- package progression becomes visually confusing
- official geography and governed package logic diverge

---

## 18. Hard Decision

The Siargao Passport Map must be an **owned illustrated tourism map** that is:

- geographically anchored to real Siargao
- visually stylized for premium Passport Map presentation
- compatible with node stamps and package progression
- independent from Google-map-derived visual dependence

This is the locked doctrine moving forward.

---

## 19. Recommended Next Sequence

Recommended next controlled sequence:

1. SPM-07A — Siargao Passport Map Geographic Fidelity Doctrine
2. SPM-07B — Passport Map Visual Asset / Illustration Direction Audit
3. SPM-07C — Passport Map Node Coordinate Doctrine
4. SPM-07D — Passport Map UI Overlay Contract Audit
5. SPM-07E — Passport Map Traveler Screen Implementation

### Hard rule

Do not build the final Passport Map UI until:

- geographic fidelity doctrine is locked
- visual asset direction is locked
- node coordinate doctrine is locked
- package/node stamp contracts remain stable

