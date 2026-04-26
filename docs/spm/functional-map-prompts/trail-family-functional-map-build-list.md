# SPM Functional Map Remaining Trail Family Build List

## Completed
- island-hopping
  - asset: frontend/public/spm/trails/island-hopping-functional-map.png
  - config: frontend/src/spm/functional-map/spmFunctionalMapConfig.ts
  - route: /traveler/passport-trails/island-hopping

## Remaining trail-specific functional map assets to generate

1. surf-explorer
   - target asset: frontend/public/spm/trails/surf-explorer-functional-map.png
   - focus: Cloud 9, surf-side coastline, surf stops, boardwalk / beach movement

2. north-siargao
   - target asset: frontend/public/spm/trails/north-siargao-functional-map.png
   - focus: Pacifico, Alegria Beach, Taktak Falls, northward road/coast progression

3. inland-discovery
   - target asset: frontend/public/spm/trails/inland-discovery-functional-map.png
   - focus: Maasin River, Magpupungko Rock Pools, inland/scenic road movement

4. culture-community
   - target asset: frontend/public/spm/trails/culture-community-functional-map.png
   - focus: community/culture stops; currently zero approved DB nodes, do not fake final node claims

5. sunset-scenic
   - target asset: frontend/public/spm/trails/sunset-scenic-functional-map.png
   - focus: Catangnan Bridge / Sunset Bridge, Cloud 9 Sunset Zone, coastal sunset movement

6. adventure
   - target asset: frontend/public/spm/trails/adventure-functional-map.png
   - focus: Sugba Lagoon, safety-controlled adventure area, water/adventure route logic

7. return-traveler-continuity
   - target asset: frontend/public/spm/trails/return-traveler-continuity-functional-map.png
   - focus: repeat-visit continuity; currently zero approved DB nodes, do not fake final node claims

## Hard rule
These are illustrated placement maps, not GIS maps. Labels and dynamic state must remain JSX overlays, not baked into the asset.
