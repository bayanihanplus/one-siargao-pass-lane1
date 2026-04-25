# SPM-07B — Passport Map Visual Asset / Illustration Direction Audit

## 1. Purpose

This document locks the visual asset direction for the Siargao Passport Map before any illustrated map asset is generated or implemented.

SPM-07A already locked the geographic fidelity standard:

- geographically faithful
- visually stylized
- owned illustrated map base
- no Google Maps screenshot/tile dependency
- dual coordinate doctrine
- Bucas Grande / Socorro inset protection

SPM-07B now defines how the visual asset should look, what it must include, what it must avoid, and what must be rejected before any production map asset is accepted.

---

## 2. Strategic Decision

The Siargao Passport Map visual asset must become a branded, ownable destination product asset.

It must not look like:

- a generic Google map
- a random cartoon island
- a fantasy treasure map disconnected from real Siargao
- a travel agency poster background
- a decorative wallpaper with no data overlay purpose

It must look like:

- a premium Passport Trails™ map
- a verified journey map
- a tourism progress map
- a mobile-first stamp and trail visualization layer
- a branded One Siargao Pass / Siargao Passport Map asset

---

## 3. Visual Direction Lock

The approved visual direction is:

**Premium Island Expedition Passport Map**

The map should combine:

- real Siargao geography
- old expedition map influence
- passport booklet texture
- journey-route visual language
- soft island-tourism colors
- stamp-ready visual zones
- clean mobile readability

It may take inspiration from:

- vintage expedition maps
- Indiana Jones-style travel route maps
- passport stamp pages
- premium tourism guide maps
- coastal/island illustration systems

It must not copy or directly mimic any copyrighted map artwork, movie artwork, or Google Maps imagery.

---

## 4. Visual Tone

The visual tone must be:

- premium
- adventurous
- trustworthy
- island-rooted
- clean enough for mobile
- warm but not childish
- playful but not toy-like
- official but not bureaucratic

The visual must feel like a traveler-owned journey artifact, not an admin dashboard map.

---

## 5. Color Direction

The preferred color world should align with One Siargao Pass / Siargao Passport Map:

### 5.1 Primary environment colors

- soft ocean blue
- deep island navy
- teal / turquoise accents
- sand / parchment tones
- coconut green
- muted sunrise gold

### 5.2 Avoid

- harsh Google Maps greens/yellows
- neon UI map colors
- overly saturated cartoon palettes
- dark fantasy pirate map palettes
- muddy brown parchment that makes mobile text unreadable

### 5.3 Required visual balance

The map should feel:

- tropical but controlled
- premium but warm
- illustrated but readable
- branded but not over-decorated

---

## 6. Base Map Asset Doctrine

The base map asset must be an owned visual asset.

Acceptable future asset types:

- SVG
- layered SVG
- high-resolution PNG generated from owned illustration
- React/SVG component if generated manually
- vector illustration exported from a design tool
- hybrid SVG base + React overlay

Preferred production direction:

- SVG base for scalable quality
- React overlay for nodes, route lines, stamps, labels, and progress states

### Hard lock

The base asset must not be:

- a Google Maps screenshot
- a downloaded Google tile
- a traced Google Maps image presented as owned work
- a generic stock map with incorrect geography
- a fantasy silhouette unrelated to Siargao

---

## 7. Map Composition Requirements

The visual asset must support the following composition zones:

1. main Siargao island body
2. General Luna / tourism core
3. island-hopping offshore cluster
4. surf/east-coast cluster
5. north Siargao cluster
6. scenic/inland cluster
7. Bucas Grande / Socorro inset or callout
8. legend/status area
9. stamp/progress overlay space
10. mobile-safe label space

The map must not crowd all nodes into one visual area.

---

## 8. Main Island Silhouette Requirements

The Siargao island silhouette must be recognizable.

It should preserve:

- the broad island shape
- north/south orientation
- east-coast identity
- south/south-east General Luna tourism zone
- offshore island-hopping relationship
- northern Pacifico identity

It may simplify:

- small coastline details
- micro bays
- internal road line density
- minor island shape irregularities

It must not:

- become a random oval island
- exaggerate General Luna into the whole island
- erase the north/south geography
- visually misplace major tourism zones

---

## 9. Cluster Layout Requirements

The visual direction must support geography clusters defined in SPM-07A.

### 9.1 General Luna / Tourism Core

Must visually sit in the south/south-east tourism zone.

Should support labels or markers for:

- General Luna context
- Catangnan / Cloud 9 context
- tourism-core trail interaction

### 9.2 Island Hopping Cluster

Must be visually offshore from the correct General Luna jump-off context.

Must be able to represent:

- Guyam Island
- Daku Island
- Naked Island
- Corregidor Island
- Mam-on Island
- Secret Island as conditional only

The tri-island package must clearly read as a package path.

### 9.3 Surf Explorer Cluster

Must preserve east-coast / surf belt logic.

Must be able to support:

- Cloud 9
- Jacking Horse
- Quicksilver
- Tuason Point
- Stimpy’s
- Pacifico surf area
- Union Surf Area
- Giwan
- Secret Spot

### 9.4 Scenic / Sunset Cluster

Must support scenic markers without overcrowding.

Must be able to support:

- Cloud 9 Sunset Zone
- Catangnan Bridge / Sunset Bridge
- Coconut Road Scenic Point
- Pacifico Scenic / Sunset Point
- Magpupungko scenic area
- Hawaiian Hills
- Little Hawaii

### 9.5 Socorro / Bucas Grande Adventure Cluster

Must be treated as a distinct distant geography.

Preferred visual treatment:

- inset panel
- callout island group
- separate adventure cluster badge
- labeled marine/adventure extension

It must not be visually collapsed into mainland Siargao.

---

## 10. Trail Path Visual Doctrine

Trail paths should feel like a traveler route or expedition line.

Approved path styles:

- dotted line
- dashed route curve
- soft nautical route line
- passport itinerary path
- animated path later, but not now

Trail paths should represent:

- package sequence
- stamp journey
- cluster progression
- discovery route

Trail paths must not represent:

- exact boat navigation route
- exact road route
- official safety/operational path
- unauthorized travel corridor

The path is a visual journey layer, not a navigation instruction.

---

## 11. Node Marker Doctrine

Node markers must support stateful rendering.

Required future states:

1. not available / locked
2. available / stamp-ready
3. stamped
4. verified
5. completed package
6. conditional / weather-dependent
7. controlled / safety-sensitive
8. revoked / invalidated later if needed

Recommended marker visual language:

- small illustrated pin for available node
- faded pin for not stamped
- passport stamp mark for stamped node
- seal/check mark for verified node
- gold or green completion accent for completed package
- warning/controlled icon for safety-controlled node

Markers must be readable on mobile.

---

## 12. Digital Stamp Visual Direction

The digital stamp should look like a travel document mark, not a game badge.

Approved style traits:

- circular or rounded rectangular stamp
- lightly distressed edge
- passport ink treatment
- official seal feel
- stamped date support later
- node short code / initials if needed
- subtle motion later, not now

Avoid:

- arcade achievement badges
- childish stickers
- overly glossy NFT/token look
- cluttered stamp marks that cover the map

---

## 13. Typography Direction

Typography should support premium travel identity.

Recommended style split:

### 13.1 Map labels

- clean sans-serif
- high readability
- small but clear
- avoid dense paragraphs directly on map

### 13.2 Hero/brand labels

- premium serif or script accent
- used sparingly
- should match SPM approved visual direction

### 13.3 Stamp text

- compact all-caps
- passport-style
- readable at mobile size

Avoid:

- too many script labels
- tiny unreadable place names
- decorative type on every node
- fake handwritten labels that reduce clarity

---

## 14. Mobile Readability Doctrine

The map must be designed mobile-first.

This means:

- labels cannot be too dense
- node markers must be tap-safe
- key route lines must remain visible
- stamp state must be readable at phone width
- detail panels/cards should handle longer descriptions
- map may use segmented panels or scroll sections if needed
- distant clusters may use insets rather than tiny pins

The map must not be a desktop poster squeezed into a phone.

---

## 15. Overlay Compatibility Doctrine

The base map asset must allow dynamic overlays.

Future UI must be able to place:

- node markers
- stamp state
- route paths
- progress percentage
- package-level completion
- cluster labels
- locked/candidate states
- callout/inset markers
- legend items

Therefore, the map asset should not bake all state into the image.

### Hard lock

The base illustrated map should be mostly static geography.

Dynamic information must be rendered by the app.

---

## 16. Asset Layering Doctrine

Preferred future layering:

1. base island illustration
2. decorative terrain/water texture
3. cluster/inset zones
4. package route overlay
5. node marker overlay
6. stamp/verification overlay
7. label overlay
8. legend / progress panel

Do not bake dynamic node states into the base image.

---

## 17. File Format Direction

Preferred production assets:

### 17.1 Base map

- SVG preferred
- PNG fallback acceptable
- transparent or soft background variant may be useful

### 17.2 Overlay data

- JSON / TS coordinate config
- React-rendered node markers
- React-rendered path overlays

### 17.3 Future asset paths

Recommended future paths:

- `frontend/public/spm/siargao-passport-map-base.svg`
- `frontend/public/spm/siargao-passport-map-base.png`
- `frontend/src/spm/map/siargaoMapCoordinates.ts`
- `frontend/src/spm/map/passportMapLayers.ts`

No asset should be committed until the direction and coordinate doctrine are locked.

---

## 18. AI-Generated Map Draft Doctrine

AI-generated map drafts are allowed only as concept/style exploration until verified.

An AI-generated draft must be rejected if:

- island silhouette is not recognizably Siargao
- General Luna / Cloud 9 / Pacifico zones are misplaced
- island-hopping cluster is geographically wrong
- Bucas Grande / Socorro is falsely adjacent
- map looks like a pirate/fantasy island instead of Siargao
- text labels are garbled
- it includes fake place names
- it implies official geography not approved by doctrine
- it cannot support clean overlay markers
- it is too visually busy for mobile

AI generation may be used to explore:

- color mood
- texture treatment
- stamp visual feel
- route line style
- paper/passport aesthetic
- island tourism vibe

AI generation must not be treated as final geography truth.

---

## 19. Production Acceptance Criteria

A production-ready SPM visual map asset must satisfy all of the following:

1. real Siargao silhouette remains recognizable
2. real tourism geography clusters remain correct
3. the visual reads as premium Passport Map, not generic map
4. the image remains clear on mobile
5. dynamic overlays can be rendered cleanly
6. labels do not overcrowd the map
7. major clusters are visually distinct
8. Bucas Grande / Socorro is handled through correct distinct/inset logic
9. no Google Maps visual dependency exists
10. the asset can support future stamped/un-stamped states
11. the map can support package route overlays
12. the map has enough neutral space for visual UI cards or legends
13. color palette matches OSP/SPM premium island direction
14. typography choices are readable and not noisy
15. fake or unapproved place names are absent

---

## 20. Rejection Criteria

Reject the visual asset if:

- it looks like a fake fantasy island
- it looks like a Google map clone
- it uses downloaded map tiles
- it uses inaccurate region placement
- it misplaces island-hopping geography
- it misrepresents Socorro / Bucas Grande
- it is too cluttered for mobile
- it bakes dynamic stamp states into the base image
- it includes unreadable labels
- it creates official-looking nodes that are not in the controlled registry
- it cannot support dynamic package/stamp overlays

---

## 21. Final Decision

The SPM map visual asset must be generated later as an owned illustrated map base, after:

- SPM-07A geographic fidelity doctrine
- SPM-07B visual asset direction
- SPM-07C node coordinate doctrine

The asset must be:

- visually premium
- geographically faithful
- mobile-first
- overlay-ready
- independent from Google Maps
- compatible with Passport Trails package progress
- compatible with digital stamp visualization

---

## 22. Next Lane

Next recommended lane:

SPM-07C — Passport Map Node Coordinate Doctrine

Purpose:

- define visual coordinate rules
- decide whether map positions live in schema or frontend config first
- define mapX/mapY and inset coordinate behavior
- define which official nodes receive coordinates first
- prevent premature final asset generation before node placement doctrine is locked

