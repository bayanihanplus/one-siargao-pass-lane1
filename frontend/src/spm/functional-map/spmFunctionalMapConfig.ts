export type SpmFunctionalMapNodeState =
  | "verified"
  | "next"
  | "qr_ready"
  | "locked"
  | "conditional";

export type SpmFunctionalMapNodePriority = "primary" | "secondary";

export type SpmFunctionalMapLabelPosition = "top" | "right" | "bottom" | "left";

export type SpmFunctionalMapSegmentStyle = "active" | "upcoming" | "locked";

export type SpmFunctionalMapNode = {
  key: string;
  label: string;
  shortLabel: string;
  xPercent: number;
  yPercent: number;
  labelPosition: SpmFunctionalMapLabelPosition;
  state: SpmFunctionalMapNodeState;
  priority: SpmFunctionalMapNodePriority;


};

export type SpmFunctionalMapSegment = {
  from: string;
  to: string;
  style: SpmFunctionalMapSegmentStyle;
};

export type SpmFunctionalTrailMap = {
  slug: string;
  familyLabel: string;
  heading: string;
  subheading: string;
  nextUnlockLabel: string;
  nextUnlockDescription: string;
  imageSrc: string;
  nodes: SpmFunctionalMapNode[];
  segments: SpmFunctionalMapSegment[];
};

export const SPM_FUNCTIONAL_TRAIL_MAPS: Record<string, SpmFunctionalTrailMap> = {
  "return-traveler-continuity": {
    slug: "return-traveler-continuity",
    familyLabel: "Return Traveler Continuity",
    heading: "Your Siargao story continues",
    subheading:
      "A state-based SPM Functional Map for verified ingress, egress, unfinished trails, second-trip return activation, and future multi-trip continuity. Ingress activates return mode; egress completes the milestone.",
    nextUnlockLabel: "Second Ingress Return Mode",
    nextUnlockDescription:
      "A first completed trip creates historical memory. A second verified ingress activates the Welcome Back experience. A second verified egress completes the Second Trip Return Explorer milestone.",
    imageSrc: "/spm/trails/return-traveler-continuity-functional-map.png",
    nodes: [
      {
        key: "NO_VERIFIED_HISTORY",
        label: "No Verified History",
        shortLabel: "NH",
        xPercent: 18,
        yPercent: 72,
        labelPosition: "right",
        state: "locked",
        priority: "primary",
      },
      {
        key: "FIRST_TRIP_ACTIVE",
        label: "First Trip Active",
        shortLabel: "IA",
        xPercent: 31,
        yPercent: 57,
        labelPosition: "right",
        state: "conditional",
        priority: "primary",
      },
      {
        key: "FIRST_TRIP_COMPLETED_BY_EGRESS",
        label: "First Journey Saved",
        shortLabel: "FE",
        xPercent: 45,
        yPercent: 46,
        labelPosition: "bottom",
        state: "locked",
        priority: "primary",
      },
      {
        key: "SECOND_INGRESS_RETURN_ACTIVE",
        label: "Return Journey Active",
        shortLabel: "RI",
        xPercent: 59,
        yPercent: 42,
        labelPosition: "bottom",
        state: "conditional",
        priority: "primary",
      },
      {
        key: "SECOND_EGRESS_RETURN_COMPLETED",
        label: "Second Return Completed",
        shortLabel: "RE",
        xPercent: 73,
        yPercent: 55,
        labelPosition: "left",
        state: "locked",
        priority: "secondary",
      },
      {
        key: "MULTI_RETURN_TRAVELER",
        label: "Multi-Return Traveler",
        shortLabel: "MR",
        xPercent: 66,
        yPercent: 75,
        labelPosition: "top",
        state: "locked",
        priority: "secondary",
      },
    ],
    segments: [
      { from: "NO_VERIFIED_HISTORY", to: "FIRST_TRIP_ACTIVE", style: "locked" },
      { from: "FIRST_TRIP_ACTIVE", to: "FIRST_TRIP_COMPLETED_BY_EGRESS", style: "locked" },
      { from: "FIRST_TRIP_COMPLETED_BY_EGRESS", to: "SECOND_INGRESS_RETURN_ACTIVE", style: "locked" },
      { from: "SECOND_INGRESS_RETURN_ACTIVE", to: "SECOND_EGRESS_RETURN_COMPLETED", style: "locked" },
      { from: "SECOND_EGRESS_RETURN_COMPLETED", to: "MULTI_RETURN_TRAVELER", style: "locked" },
    ],
  },

  "adventure": {
    slug: "adventure",
    familyLabel: "Adventure",
    heading: "Adventure Trail map journey",
    subheading:
      "Adventure nodes are safety-controlled and operator-backed. This map shows candidate adventure zones only; completion requires governed QR, operator, guide, or partner validation.",
    nextUnlockLabel: "Sugba Lagoon",
    nextUnlockDescription:
      "Sugba Lagoon is the next safety-controlled adventure anchor. Sohoton Cove, Bucas Grande Island, Tayangban Cave Pool, Siargao Wakepark, and Calicoan Paddle Trail remain locked or conditional until operator, access, safety, and partner validation rules are active.",
    imageSrc: "/spm/trails/adventure-functional-map.png",
    nodes: [
      {
        key: "SUGBA_LAGOON",
        label: "Sugba Lagoon",
        shortLabel: "SL",
        xPercent: 20,
        yPercent: 46,
        labelPosition: "right",
        state: "next",
        priority: "primary",
      },
      {
        key: "SOHOTON_COVE",
        label: "Sohoton Cove",
        shortLabel: "SC",
        xPercent: 54,
        yPercent: 34,
        labelPosition: "bottom",
        state: "locked",
        priority: "primary",
      },
      {
        key: "BUCAS_GRANDE_ISLAND",
        label: "Bucas Grande Island",
        shortLabel: "BG",
        xPercent: 71,
        yPercent: 38,
        labelPosition: "left",
        state: "locked",
        priority: "primary",
      },
      {
        key: "TAYANGBAN_CAVE_POOL",
        label: "Tayangban Cave Pool",
        shortLabel: "TC",
        xPercent: 43,
        yPercent: 67,
        labelPosition: "top",
        state: "locked",
        priority: "secondary",
      },
      {
        key: "SIARGAO_WAKEPARK",
        label: "Siargao Wakepark",
        shortLabel: "SW",
        xPercent: 76,
        yPercent: 63,
        labelPosition: "left",
        state: "qr_ready",
        priority: "secondary",
      },
      {
        key: "CALICOAN_PADDLE_TRAIL",
        label: "Calicoan Paddle Trail",
        shortLabel: "CP",
        xPercent: 27,
        yPercent: 78,
        labelPosition: "right",
        state: "conditional",
        priority: "secondary",
      },
    ],
    segments: [
      { from: "SUGBA_LAGOON", to: "SOHOTON_COVE", style: "locked" },
      { from: "SOHOTON_COVE", to: "BUCAS_GRANDE_ISLAND", style: "locked" },
      { from: "SUGBA_LAGOON", to: "TAYANGBAN_CAVE_POOL", style: "locked" },
      { from: "TAYANGBAN_CAVE_POOL", to: "SIARGAO_WAKEPARK", style: "locked" },
      { from: "TAYANGBAN_CAVE_POOL", to: "CALICOAN_PADDLE_TRAIL", style: "locked" },
    ],
  },

  "sunset-scenic": {
    slug: "sunset-scenic",
    familyLabel: "Sunset & Scenic",
    heading: "Sunset & Scenic Stops Trail map journey",
    subheading:
      "Cloud 9 Sunset Zone and Catangnan Bridge are DB-approved scenic anchors. Malinao Skate Area, Coconut Road Scenic Point, and Magpupungko Scenic Area remain presentation-approved / pending DB review.",
    nextUnlockLabel: "Catangnan Bridge / Sunset Bridge",
    nextUnlockDescription:
      "Cloud 9 Sunset Zone is the approved scenic anchor. Catangnan Bridge is next. Malinao, Coconut Road Scenic Point, and Magpupungko Scenic Area are shown only as presentation-approved pending-review nodes; no Pacifico scenic node is included in this focused route.",
    imageSrc: "/spm/trails/sunset-scenic-functional-map.png",
    nodes: [
      {
        key: "CLOUD_9_SUNSET_ZONE",
        label: "Cloud 9 Sunset Zone",
        shortLabel: "C9",
        xPercent: 22,
        yPercent: 62,
        labelPosition: "top",
        state: "verified",
        priority: "primary",
      },
      {
        key: "CATANGNAN_BRIDGE",
        label: "Catangnan Bridge / Sunset Bridge",
        shortLabel: "CB",
        xPercent: 39,
        yPercent: 55,
        labelPosition: "bottom",
        state: "next",
        priority: "primary",
      },
      {
        key: "MALINAO_SKATE_AREA",
        label: "Malinao Skate Area",
        shortLabel: "MS",
        xPercent: 49,
        yPercent: 73,
        labelPosition: "top",
        state: "qr_ready",
        priority: "secondary",
      },
      {
        key: "COCONUT_ROAD_SCENIC_POINT",
        label: "Coconut Road Scenic Point",
        shortLabel: "CR",
        xPercent: 72,
        yPercent: 45,
        labelPosition: "left",
        state: "locked",
        priority: "secondary",
      },
      {
        key: "MAGPUPUNGKO_SCENIC_AREA",
        label: "Magpupungko Scenic Area",
        shortLabel: "MG",
        xPercent: 83,
        yPercent: 28,
        labelPosition: "left",
        state: "locked",
        priority: "secondary",
      },
    ],
    segments: [
      { from: "CLOUD_9_SUNSET_ZONE", to: "CATANGNAN_BRIDGE", style: "active" },
      { from: "CATANGNAN_BRIDGE", to: "MALINAO_SKATE_AREA", style: "upcoming" },
      { from: "MALINAO_SKATE_AREA", to: "COCONUT_ROAD_SCENIC_POINT", style: "locked" },
      { from: "COCONUT_ROAD_SCENIC_POINT", to: "MAGPUPUNGKO_SCENIC_AREA", style: "locked" },
    ],
  },

  "island-hopping": {
    slug: "island-hopping",
    familyLabel: "Island Hopping",
    heading: "Island Hopping Trail map journey",
    subheading:
      "SPM Own Map view with official node placement, QR-ready states, and governed unlock logic.",
    nextUnlockLabel: "Daku Island",
    nextUnlockDescription:
      "Guyam is already stamped. Daku is the next ready-to-verify official Island Hopping node. Corregidor, Mam-on, and Secret Island stay locked until governed package or progress rules apply.",
    imageSrc: "/spm/trails/island-hopping-functional-map.png",
    nodes: [
      {
        key: "GUYAM_ISLAND",
        label: "Guyam Island",
        shortLabel: "GU",
        xPercent: 17,
        yPercent: 61,
        labelPosition: "bottom",
        state: "verified",
        priority: "primary",
      },
      {
        key: "DAKU_ISLAND",
        label: "Daku Island",
        shortLabel: "DA",
        xPercent: 42,
        yPercent: 43,
        labelPosition: "bottom",
        state: "next",
        priority: "primary",
      },
      {
        key: "NAKED_ISLAND",
        label: "Naked Island",
        shortLabel: "NA",
        xPercent: 62,
        yPercent: 55,
        labelPosition: "bottom",
        state: "qr_ready",
        priority: "primary",
      },
      {
        key: "CORREGIDOR_ISLAND",
        label: "Corregidor Island",
        shortLabel: "CO",
        xPercent: 26,
        yPercent: 35,
        labelPosition: "bottom",
        state: "locked",
        priority: "secondary",
      },
      {
        key: "MAM_ON_ISLAND",
        label: "Mam-on Island",
        shortLabel: "MO",
        xPercent: 77,
        yPercent: 51,
        labelPosition: "bottom",
        state: "locked",
        priority: "secondary",
      },
      {
        key: "SECRET_ISLAND",
        label: "Secret Island",
        shortLabel: "SI",
        xPercent: 50,
        yPercent: 66,
        labelPosition: "bottom",
        state: "conditional",
        priority: "secondary",
      },
    ],
    segments: [
      { from: "GUYAM_ISLAND", to: "DAKU_ISLAND", style: "active" },
      { from: "DAKU_ISLAND", to: "NAKED_ISLAND", style: "upcoming" },
      { from: "NAKED_ISLAND", to: "MAM_ON_ISLAND", style: "locked" },
      { from: "DAKU_ISLAND", to: "CORREGIDOR_ISLAND", style: "locked" },
      { from: "DAKU_ISLAND", to: "SECRET_ISLAND", style: "locked" },
    ],
  },

  "surf-explorer": {
    slug: "surf-explorer",
    familyLabel: "Surf Explorer",
    heading: "Surf Explorer Trail map journey",
    subheading:
      "Cloud 9 is the approved anchor. Surf breaks beyond Cloud 9 stay pending-review until locally validated.",
    nextUnlockLabel: "Jacking Horse",
    nextUnlockDescription:
      "Cloud 9 is the approved Surf Explorer anchor. Jacking Horse, Quicksilver, Tuason Point, Stimpy’s, and Pacifico Surf Area are shown as pending-review surf nodes, not approved completion nodes.",
    imageSrc: "/spm/trails/surf-explorer-functional-map.png",
    nodes: [
      {
        key: "CLOUD_9",
        label: "Cloud 9",
        shortLabel: "C9",
        xPercent: 23,
        yPercent: 72,
        labelPosition: "top",
        state: "verified",
        priority: "primary",
      },
      {
        key: "JACKING_HORSE",
        label: "Jacking Horse",
        shortLabel: "JH",
        xPercent: 31,
        yPercent: 61,
        labelPosition: "right",
        state: "next",
        priority: "primary",
      },
      {
        key: "QUICKSILVER",
        label: "Quicksilver",
        shortLabel: "QS",
        xPercent: 44,
        yPercent: 51,
        labelPosition: "bottom",
        state: "qr_ready",
        priority: "primary",
      },
      {
        key: "TUASON_POINT",
        label: "Tuason Point",
        shortLabel: "TP",
        xPercent: 56,
        yPercent: 42,
        labelPosition: "bottom",
        state: "locked",
        priority: "secondary",
      },
      {
        key: "STIMPYS",
        label: "Stimpy’s",
        shortLabel: "ST",
        xPercent: 66,
        yPercent: 34,
        labelPosition: "bottom",
        state: "locked",
        priority: "secondary",
      },
      {
        key: "PACIFICO_SURF_AREA",
        label: "Pacifico Surf Area",
        shortLabel: "PF",
        xPercent: 79,
        yPercent: 22,
        labelPosition: "left",
        state: "locked",
        priority: "secondary",
      },
    ],
    segments: [
      { from: "CLOUD_9", to: "JACKING_HORSE", style: "active" },
      { from: "JACKING_HORSE", to: "QUICKSILVER", style: "upcoming" },
      { from: "QUICKSILVER", to: "TUASON_POINT", style: "locked" },
      { from: "TUASON_POINT", to: "STIMPYS", style: "locked" },
      { from: "STIMPYS", to: "PACIFICO_SURF_AREA", style: "locked" },
    ],
  },

  "north-siargao": {
    slug: "north-siargao",
    familyLabel: "North Siargao",
    heading: "North Siargao Trail map journey",
    subheading:
      "Pacifico, Alegria Beach, and Taktak Falls are approved North Siargao nodes. Burgos and Coconut Road remain pending-review corridor nodes.",
    nextUnlockLabel: "Alegria Beach",
    nextUnlockDescription:
      "Pacifico is the approved north anchor. Alegria Beach and Taktak Falls are approved QR nodes; Burgos and Coconut Road stay locked until final local validation is completed.",
    imageSrc: "/spm/trails/north-siargao-functional-map.png",
    nodes: [
      {
        key: "PACIFICO",
        label: "Pacifico",
        shortLabel: "PF",
        xPercent: 72,
        yPercent: 23,
        labelPosition: "left",
        state: "verified",
        priority: "primary",
      },
      {
        key: "ALEGRIA_BEACH",
        label: "Alegria Beach",
        shortLabel: "AL",
        xPercent: 58,
        yPercent: 32,
        labelPosition: "bottom",
        state: "next",
        priority: "primary",
      },
      {
        key: "TAKTAK_FALLS",
        label: "Taktak Falls",
        shortLabel: "TF",
        xPercent: 30,
        yPercent: 66,
        labelPosition: "right",
        state: "qr_ready",
        priority: "primary",
      },
      {
        key: "BURGOS",
        label: "Burgos",
        shortLabel: "BG",
        xPercent: 49,
        yPercent: 45,
        labelPosition: "bottom",
        state: "locked",
        priority: "secondary",
      },
      {
        key: "COCONUT_ROAD",
        label: "Coconut Road",
        shortLabel: "CR",
        xPercent: 44,
        yPercent: 78,
        labelPosition: "top",
        state: "locked",
        priority: "secondary",
      },
    ],
    segments: [
      { from: "PACIFICO", to: "ALEGRIA_BEACH", style: "active" },
      { from: "ALEGRIA_BEACH", to: "TAKTAK_FALLS", style: "upcoming" },
      { from: "TAKTAK_FALLS", to: "BURGOS", style: "locked" },
      { from: "BURGOS", to: "COCONUT_ROAD", style: "locked" },
    ],
  },

  "inland-discovery": {
    slug: "inland-discovery",
    familyLabel: "Inland Discovery",
    heading: "Inland Discovery Trail map journey",
    subheading:
      "Maasin River and Magpupungko Rock Pools are approved Inland Discovery nodes. Coconut Forest, Tayangban, and Sugba access remain governed review nodes.",
    nextUnlockLabel: "Magpupungko Rock Pools",
    nextUnlockDescription:
      "Maasin River is the approved inland anchor. Magpupungko Rock Pools is approved but tide and safety-sensitive. Tayangban Cave Pool and Sugba Lagoon Jump-Off require stricter access validation.",
    imageSrc: "/spm/trails/inland-discovery-functional-map.png",
    nodes: [
      {
        key: "MAASIN_RIVER",
        label: "Maasin River",
        shortLabel: "MR",
        xPercent: 18,
        yPercent: 62,
        labelPosition: "right",
        state: "verified",
        priority: "primary",
      },
      {
        key: "MAGPUPUNGKO_ROCK_POOLS",
        label: "Magpupungko Rock Pools",
        shortLabel: "MP",
        xPercent: 78,
        yPercent: 72,
        labelPosition: "left",
        state: "next",
        priority: "primary",
      },
      {
        key: "COCONUT_FOREST_SCENIC_CORRIDOR",
        label: "Coconut Forest",
        shortLabel: "CF",
        xPercent: 48,
        yPercent: 46,
        labelPosition: "top",
        state: "qr_ready",
        priority: "secondary",
      },
      {
        key: "TAYANGBAN_CAVE_POOL",
        label: "Tayangban Cave Pool",
        shortLabel: "TC",
        xPercent: 24,
        yPercent: 22,
        labelPosition: "bottom",
        state: "locked",
        priority: "secondary",
      },
      {
        key: "SUGBA_LAGOON_ACCESS_NODE",
        label: "Sugba Access Node",
        shortLabel: "SG",
        xPercent: 74,
        yPercent: 18,
        labelPosition: "bottom",
        state: "conditional",
        priority: "secondary",
      },
    ],
    segments: [
      { from: "MAASIN_RIVER", to: "COCONUT_FOREST_SCENIC_CORRIDOR", style: "active" },
      { from: "COCONUT_FOREST_SCENIC_CORRIDOR", to: "MAGPUPUNGKO_ROCK_POOLS", style: "upcoming" },
      { from: "MAASIN_RIVER", to: "TAYANGBAN_CAVE_POOL", style: "locked" },
      { from: "COCONUT_FOREST_SCENIC_CORRIDOR", to: "SUGBA_LAGOON_ACCESS_NODE", style: "locked" },
    ],
  },

  "culture-community": {
    slug: "culture-community",
    familyLabel: "Culture & Community",
    heading: "Culture & Community Trail map journey",
    subheading:
      "Culture & Community is consent-first. Boodle Fight Experience remains package-only, pending review, conditional, and not stamp-eligible.",
    nextUnlockLabel: "Boodle Fight Experience",
    nextUnlockDescription:
      "Boodle Fight Experience requires booking and operator participation. Partner Approval Required and Community Consent Review remain governance-locked before any public completion behavior is exposed.",
    imageSrc: "/spm/trails/culture-community-functional-map.png",
    nodes: [
      {
        key: "BOODLE_FIGHT_EXPERIENCE",
        label: "Boodle Fight Experience",
        shortLabel: "BF",
        xPercent: 36,
        yPercent: 54,
        labelPosition: "right",
        state: "conditional",
        priority: "primary",
      },
      {
        key: "PARTNER_APPROVAL_REQUIRED",
        label: "Partner Approval Required",
        shortLabel: "PA",
        xPercent: 58,
        yPercent: 40,
        labelPosition: "bottom",
        state: "locked",
        priority: "secondary",
      },
      {
        key: "COMMUNITY_CONSENT_REVIEW",
        label: "Community Consent Review",
        shortLabel: "CR",
        xPercent: 68,
        yPercent: 68,
        labelPosition: "left",
        state: "locked",
        priority: "secondary",
      },
    ],
    segments: [
      { from: "BOODLE_FIGHT_EXPERIENCE", to: "PARTNER_APPROVAL_REQUIRED", style: "locked" },
      { from: "BOODLE_FIGHT_EXPERIENCE", to: "COMMUNITY_CONSENT_REVIEW", style: "locked" },
    ],
  },
};

export function getFunctionalTrailMapBySlug(slug: string) {
  return SPM_FUNCTIONAL_TRAIL_MAPS[slug] ?? null;
}
