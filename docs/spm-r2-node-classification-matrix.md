# SPM-R2 — Node Classification Matrix

## Purpose

This matrix converts the SPM-R1 Siargao Geography + Tour Sites Research Doctrine into seed decisions.

No node should be seeded, activated, exposed in traveler UI, attached to checkout, or treated as Passport Stamp eligible unless it has a classification in this matrix.

## Decision Classes

- SEED_NOW_APPROVED
- SEED_NOW_PENDING_REVIEW
- CANDIDATE_RESEARCH_REQUIRED
- CHECKPOINT_ONLY
- PACKAGE_ONLY
- SAFETY_CONTROLLED
- REJECT_OR_DEFER

## Global Hard Rules

1. Do not invent new trail families.
2. Do not build UI from this matrix yet.
3. Do not activate instant checkout from this matrix.
4. Do not create Passport Stamps without OSP QR validation.
5. Do not make restaurants/culture nodes public without partner approval.
6. Do not treat Socorro / Bucas Grande as ordinary island hopping.
7. Do not treat Union/Giwan/Secret Spot as official surf completion nodes without surf validation.
8. Do not treat Little Hawaii / Hawaiian Hills as official until access and exact location are verified.

---

## Classification Matrix

| Canonical Node Code | Public Name | Municipality / Area | Trail Family | Node Type | Decision Class | QR Stamp Eligible | Booking Required | Operator Required | Guide Required | Safety / Compliance Flags | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| GUYAM_ISLAND | Guyam Island | General Luna route / island hopping | ISLAND_HOPPING | PLACE | SEED_NOW_APPROVED | yes | yes | yes | optional | boat_required, manifest_relevant, qr_validation_required | Already seeded. |
| DAKU_ISLAND | Daku Island | General Luna route / island hopping | ISLAND_HOPPING | PLACE | SEED_NOW_APPROVED | yes | yes | yes | optional | boat_required, manifest_relevant, qr_validation_required | Already seeded. |
| NAKED_ISLAND | Naked Island | General Luna route / island hopping | ISLAND_HOPPING | PLACE | SEED_NOW_APPROVED | yes | yes | yes | optional | boat_required, manifest_relevant, qr_validation_required | Already seeded. |
| CORREGIDOR_ISLAND | Corregidor Island | Extended island hopping | ISLAND_HOPPING | PLACE | SEED_NOW_APPROVED | yes | yes | yes | optional | boat_required, manifest_relevant, qr_validation_required | Already seeded. |
| MAM_ON_ISLAND | Mam-on Island | Extended island hopping | ISLAND_HOPPING | PLACE | SEED_NOW_APPROVED | yes | yes | yes | optional | boat_required, manifest_relevant, qr_validation_required | Already seeded. |
| SECRET_ISLAND | Secret Island | Conditional package route | ISLAND_HOPPING | CONDITIONAL_PACKAGE_NODE | PACKAGE_ONLY | yes | yes | yes | optional | package_only, boat_required, qr_validation_required | Already seeded as conditional. |
| GENERAL_LUNA_ISLAND_HOPPING_DEPARTURE | General Luna Island Hopping Departure | General Luna | ISLAND_HOPPING | TRANSPORT | CHECKPOINT_ONLY | no | yes | yes | no | departure_scan, boat_required, manifest_relevant | Compliance/checkpoint node, not traveler trophy node. |
| GENERAL_LUNA_ISLAND_HOPPING_RETURN | General Luna Island Hopping Return | General Luna | ISLAND_HOPPING | TRANSPORT | CHECKPOINT_ONLY | no | yes | yes | no | return_scan, boat_required, manifest_relevant | Compliance/checkpoint node, not traveler trophy node. |

| CLOUD_9 | Cloud 9 | General Luna | SURF_EXPLORER | SURF | SEED_NOW_APPROVED | yes | no | no | no | surf_condition_dependent, qr_validation_required | Also maps to Sunset Scenic if needed. |
| JACKING_HORSE | Jacking Horse | General Luna surf area | SURF_EXPLORER | SURF | SEED_NOW_PENDING_REVIEW | yes | no | no | no | surf_condition_dependent, local_validation_required | Public visit vs surf participation must be separated. |
| QUICKSILVER | Quicksilver | General Luna surf area | SURF_EXPLORER | SURF | SEED_NOW_PENDING_REVIEW | yes | no | no | no | surf_condition_dependent, local_validation_required | Needs local surf validation. |
| TUASON_POINT | Tuason Point | General Luna surf area | SURF_EXPLORER | SURF | SEED_NOW_PENDING_REVIEW | yes | no | no | no | surf_condition_dependent, local_validation_required | Needs local surf validation. |
| STIMPYS | Stimpy's | Siargao surf area | SURF_EXPLORER | SURF | SEED_NOW_PENDING_REVIEW | yes | no | no | no | surf_condition_dependent, local_validation_required | Needs local surf validation. |
| PACIFICO_SURF_AREA | Pacifico Surf Area | San Isidro / Pacifico | SURF_EXPLORER | SURF | SEED_NOW_PENDING_REVIEW | yes | no | no | no | surf_condition_dependent, local_validation_required | Separate from Pacifico scenic node. |
| GIWAN_SURF_AREA | Giwan Surf Area | Siargao surf area | SURF_EXPLORER | SURF | CANDIDATE_RESEARCH_REQUIRED | no | no | no | no | exact_location_unverified, surf_validation_required | Include in research; do not approve yet. |
| UNION_SURF_AREA | Union Surf Area | Siargao surf area | SURF_EXPLORER | SURF | CANDIDATE_RESEARCH_REQUIRED | no | no | no | no | exact_location_unverified, surf_validation_required | Include in research; avoid confusion with La Union. |
| SECRET_SPOT_SURF_AREA | Secret Spot Surf Area | Siargao surf area | SURF_EXPLORER | SURF | CANDIDATE_RESEARCH_REQUIRED | no | no | no | no | exact_location_unverified, access_unverified, surf_validation_required | Candidate only. |

| PACIFICO | Pacifico | San Isidro | NORTH_SIARGAO | PLACE | SEED_NOW_APPROVED | yes | no | no | optional | qr_validation_required | North route anchor. |
| BURGOS | Burgos | Burgos | NORTH_SIARGAO | PLACE | SEED_NOW_PENDING_REVIEW | yes | no | no | optional | local_validation_required | Route/town node, not necessarily attraction node. |
| ALEGRIA_BEACH | Alegria Beach | Santa Monica / Alegria area | NORTH_SIARGAO | PLACE | SEED_NOW_APPROVED | yes | no | no | optional | qr_validation_required | North route scenic stop. |
| TAKTAK_FALLS | Taktak Falls | Santa Monica | NORTH_SIARGAO | PLACE | SEED_NOW_APPROVED | yes | no | no | optional | safety_review_required, qr_validation_required | Adventure-lite/scenic node. |
| COCONUT_ROAD | Coconut Road | North / inland scenic road | NORTH_SIARGAO | SCENIC | SEED_NOW_PENDING_REVIEW | yes | no | no | no | route_location_validation_required | May overlap with Coconut Forest Scenic Corridor. |
| LITTLE_HAWAII | Little Hawaii | Burgos / North Siargao candidate | NORTH_SIARGAO | SCENIC | CANDIDATE_RESEARCH_REQUIRED | no | no | no | no | exact_location_unverified, access_unverified, road_condition_check_required | Candidate only. |
| HAWAIIAN_HILLS | Hawaiian Hills | Burgos / North Siargao candidate | NORTH_SIARGAO | SCENIC | CANDIDATE_RESEARCH_REQUIRED | no | no | no | no | exact_location_unverified, access_unverified, road_condition_check_required | May resolve into same canonical node as Little Hawaii. |
| SECRET_MOUNTAIN_VIEWPOINT | Secret Mountain Viewpoint | North Siargao candidate | NORTH_SIARGAO | SCENIC | CANDIDATE_RESEARCH_REQUIRED | no | no | no | no | exact_location_unverified, access_unverified | Candidate only. |
| SOMYOT_CAVE | Somyot Cave | Burgos candidate | NORTH_SIARGAO | ADVENTURE | CANDIDATE_RESEARCH_REQUIRED | no | no | no | optional | exact_location_unverified, safety_review_required | Candidate only. |

| MAASIN_RIVER | Maasin River | Pilar / inland route | INLAND_DISCOVERY | PLACE | SEED_NOW_APPROVED | yes | no | no | optional | qr_validation_required | Inland core node. |
| MAGPUPUNGKO_ROCK_POOLS | Magpupungko Rock Pools | Pilar | INLAND_DISCOVERY | PLACE | SEED_NOW_APPROVED | yes | no | no | optional | tide_dependent, safety_review_required, qr_validation_required | Must include tide logic later. |
| TAYANGBAN_CAVE_POOL | Tayangban Cave Pool | Pilar | INLAND_DISCOVERY | ADVENTURE | SEED_NOW_PENDING_REVIEW | yes | yes | yes | optional | safety_controlled, access_validation_required | Do not activate as casual DIY. |
| COCONUT_FOREST_SCENIC_CORRIDOR | Coconut Forest Scenic Corridor | Pilar / inland road | INLAND_DISCOVERY | SCENIC | SEED_NOW_PENDING_REVIEW | yes | no | no | no | route_location_validation_required | Scenic corridor node. |
| SUGBA_LAGOON_ACCESS_NODE | Sugba Lagoon Jump-Off / Access Node | Del Carmen | INLAND_DISCOVERY | TRANSPORT | CHECKPOINT_ONLY | no | yes | yes | optional | boat_required, environmental_sensitivity, manifest_relevant | Access/checkpoint node, not completion trophy by itself. |
| DEL_CARMEN_MANGROVE_CORRIDOR | Del Carmen Mangrove Corridor | Del Carmen | INLAND_DISCOVERY | SCENIC | CANDIDATE_RESEARCH_REQUIRED | no | yes | yes | optional | environmental_sensitivity, access_validation_required | Candidate eco node. |

| CLOUD_9_SUNSET_ZONE | Cloud 9 Sunset Zone | General Luna | SUNSET_SCENIC | SCENIC | SEED_NOW_APPROVED | yes | no | no | no | qr_validation_required | Scenic/sunset node. |
| CATANGNAN_BRIDGE | Catangnan Bridge / Sunset Bridge | General Luna / Catangnan | SUNSET_SCENIC | SCENIC | SEED_NOW_APPROVED | yes | no | no | no | qr_validation_required | Scenic/sunset node. |
| COCONUT_ROAD_SCENIC_POINT | Coconut Road Scenic Point | Scenic road corridor | SUNSET_SCENIC | SCENIC | SEED_NOW_PENDING_REVIEW | yes | no | no | no | route_location_validation_required | Needs exact QR location. |
| PACIFICO_SCENIC_SUNSET_POINT | Pacifico Scenic / Sunset Point | San Isidro / Pacifico | SUNSET_SCENIC | SCENIC | SEED_NOW_PENDING_REVIEW | yes | no | no | no | local_validation_required | Candidate for scenic route. |
| MAGPUPUNGKO_SCENIC_AREA | Magpupungko Scenic Area | Pilar | SUNSET_SCENIC | SCENIC | SEED_NOW_PENDING_REVIEW | yes | no | no | optional | tide_dependent, safety_review_required | Related to Magpupungko core node. |

| SUGBA_LAGOON | Sugba Lagoon | Del Carmen | ADVENTURE | ADVENTURE | SEED_NOW_APPROVED | yes | yes | yes | optional | boat_required, environmental_sensitivity, safety_controlled, closure_possible | No casual DIY. |
| SOCORRO_BUCAS_GRANDE_CLUSTER | Socorro / Bucas Grande Cluster | Socorro / Bucas Grande | ADVENTURE | ADVENTURE | CANDIDATE_RESEARCH_REQUIRED | no | yes | yes | required | boat_required, vessel_required, manifest_relevant, safety_controlled | Cluster classification, not simple public stamp. |
| SOHOTON_COVE | Sohoton Cove | Socorro / Bucas Grande | ADVENTURE | ADVENTURE | SEED_NOW_PENDING_REVIEW | yes | yes | yes | required | boat_required, vessel_required, safety_controlled, manifest_relevant | Controlled adventure node. |
| JELLYFISH_SANCTUARY | Jellyfish Sanctuary | Socorro / Bucas Grande | ADVENTURE | ADVENTURE | SEED_NOW_PENDING_REVIEW | yes | yes | yes | required | eco_controlled, boat_required, safety_controlled | Requires local/operator validation. |
| HAGUKAN_CAVE | Hagukan Cave | Socorro / Bucas Grande | ADVENTURE | ADVENTURE | CANDIDATE_RESEARCH_REQUIRED | no | yes | yes | required | cave_safety, boat_required, exact_location_unverified | Candidate only. |
| MAGKUKUOB_CAVE | Magkukuob Cave | Socorro / Bucas Grande | ADVENTURE | ADVENTURE | CANDIDATE_RESEARCH_REQUIRED | no | yes | yes | required | cave_safety, boat_required, exact_location_unverified | Candidate only. |
| TIKTIKAN_LAKE_OR_COVE | Tiktikan Lake / Cove | Socorro / Bucas Grande | ADVENTURE | ADVENTURE | CANDIDATE_RESEARCH_REQUIRED | no | yes | yes | required | boat_required, exact_location_unverified | Candidate only. |
| SOHOTON_OPERATOR_JUMP_OFF | Sohoton Operator Jump-Off | Socorro / Bucas Grande | ADVENTURE | TRANSPORT | CHECKPOINT_ONLY | no | yes | yes | required | boat_required, vessel_required, manifest_relevant | Compliance/checkpoint only. |
| APPROVED_CAVE_PADDLE_JUMP_NODE | Approved Cave / Paddle / Jump Node | Adventure candidate | ADVENTURE | ADVENTURE | CANDIDATE_RESEARCH_REQUIRED | no | yes | yes | required | safety_controlled | Placeholder only. |
| APPROVED_WAKEPARK_ADVENTURE_PARTNER_NODE | Approved Wakepark / Adventure Partner Node | Adventure candidate | ADVENTURE | ADVENTURE | CANDIDATE_RESEARCH_REQUIRED | no | yes | yes | required | partner_approval_required | Placeholder only. |

| APPROVED_RESTAURANT_NODE | Approved Restaurant Node | TBD | CULTURE_COMMUNITY | RESTAURANT | CANDIDATE_RESEARCH_REQUIRED | no | yes | no | optional | partner_approval_required, QR_validation_required | No random restaurant stamps. |
| LOCAL_MARKET_FOOD_CULTURE_NODE | Local Market / Food Culture Node | TBD | CULTURE_COMMUNITY | COMMUNITY | CANDIDATE_RESEARCH_REQUIRED | no | no | no | optional | community_sensitivity, access_validation_required | Candidate only. |
| BOODLE_FIGHT_EXPERIENCE | Boodle Fight Experience | TBD | CULTURE_COMMUNITY | RESTAURANT | PACKAGE_ONLY | no | yes | yes | optional | inclusion_only_unless_validated | Inclusion by default. |
| KAKANIN_ISLAND_DELICACIES_NODE | Kakanin / Island Delicacies Node | TBD | CULTURE_COMMUNITY | RESTAURANT | CANDIDATE_RESEARCH_REQUIRED | no | yes | no | optional | partner_approval_required | Candidate only. |

| FIRST_TRIP_EXPLORER | First Trip Explorer | System milestone | RETURN_TRAVELER_CONTINUITY | MILESTONE | SEED_NOW_PENDING_REVIEW | no | no | no | no | system_generated | Not physical geography. |
| SECOND_TRIP_RETURN_EXPLORER | Second Trip Return Explorer | System milestone | RETURN_TRAVELER_CONTINUITY | MILESTONE | SEED_NOW_PENDING_REVIEW | no | no | no | no | system_generated | Not physical geography. |
| MULTI_TRAIL_PROGRESSION | Multi-Trail Progression | System milestone | RETURN_TRAVELER_CONTINUITY | MILESTONE | SEED_NOW_PENDING_REVIEW | no | no | no | no | system_generated | Not physical geography. |

---

## Final SPM-R2 Decision

Only the following classes should be seeded in the next researched node seed:

- SEED_NOW_APPROVED
- SEED_NOW_PENDING_REVIEW
- CHECKPOINT_ONLY
- PACKAGE_ONLY when package logic needs it

The following must not be activated publicly:

- CANDIDATE_RESEARCH_REQUIRED
- REJECT_OR_DEFER

The next build lane should be:

SPM-05C-R — Researched Official Trail Node Seed

