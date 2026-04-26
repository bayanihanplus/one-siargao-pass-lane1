export type SpmFunctionalNodeState =
  | "verified"
  | "next"
  | "qr_ready"
  | "locked"
  | "conditional";

export type SpmFunctionalLabelPosition = "top" | "right" | "bottom" | "left";

export type SpmFunctionalNode = {
  key: string;
  label: string;
  shortLabel?: string;
  xPercent: number;
  yPercent: number;
  labelPosition: SpmFunctionalLabelPosition;
  state: SpmFunctionalNodeState;
  priority: "primary" | "secondary" | "tertiary";
};

export type SpmFunctionalRouteSegment = {
  from: string;
  to: string;
  style: "active" | "upcoming" | "locked";
};

export type SpmFunctionalTrailMap = {
  slug: string;
  familyLabel: string;
  heading: string;
  subheading: string;
  nextUnlockLabel: string;
  nextUnlockDescription: string;
  imageSrc: string;
  nodes: SpmFunctionalNode[];
  segments: SpmFunctionalRouteSegment[];
};

export const SPM_FUNCTIONAL_TRAIL_MAPS: Record<string, SpmFunctionalTrailMap> = {
  "island-hopping": {
    slug: "island-hopping",
    familyLabel: "Island Hopping",
    heading: "Island Hopping Trail map journey",
    subheading:
      "SPM Own Map view with official node placement, QR-ready states, and governed unlock logic.",
    nextUnlockLabel: "Daku Island",
    nextUnlockDescription:
      "Guyam is already stamped. Daku is the next ready-to-verify official Island Hopping node. Corregidor, Mam-on, and Secret Island remain governed secondary or conditional nodes.",
    imageSrc: "/spm/trails/island-hopping-functional-map.png",
    nodes: [
      {
        key: "GUYAM_ISLAND",
        label: "Guyam Island",
        shortLabel: "GU",
        xPercent: 17,
        yPercent: 62,
        labelPosition: "bottom",
        state: "verified",
        priority: "primary",
      },
      {
        key: "DAKU_ISLAND",
        label: "Daku Island",
        shortLabel: "DA",
        xPercent: 44,
        yPercent: 40,
        labelPosition: "bottom",
        state: "next",
        priority: "primary",
      },
      {
        key: "NAKED_ISLAND",
        label: "Naked Island",
        shortLabel: "NA",
        xPercent: 68,
        yPercent: 50,
        labelPosition: "bottom",
        state: "qr_ready",
        priority: "primary",
      },
      {
        key: "CORREGIDOR_ISLAND",
        label: "Corregidor Island",
        shortLabel: "CO",
        xPercent: 30,
        yPercent: 46,
        labelPosition: "top",
        state: "locked",
        priority: "secondary",
      },
      {
        key: "MAM_ON_ISLAND",
        label: "Mam-on Island",
        shortLabel: "MO",
        xPercent: 81,
        yPercent: 62,
        labelPosition: "right",
        state: "locked",
        priority: "secondary",
      },
      {
        key: "SECRET_ISLAND",
        label: "Secret Island",
        shortLabel: "SI",
        xPercent: 53,
        yPercent: 72,
        labelPosition: "bottom",
        state: "conditional",
        priority: "tertiary",
      },
    ],
    segments: [
      { from: "GUYAM_ISLAND", to: "DAKU_ISLAND", style: "active" },
      { from: "DAKU_ISLAND", to: "NAKED_ISLAND", style: "upcoming" },
      { from: "DAKU_ISLAND", to: "CORREGIDOR_ISLAND", style: "locked" },
      { from: "NAKED_ISLAND", to: "MAM_ON_ISLAND", style: "locked" },
      { from: "DAKU_ISLAND", to: "SECRET_ISLAND", style: "locked" },
    ],
  },
  "surf-explorer": {
    slug: "surf-explorer",
    familyLabel: "Surf Explorer",
    heading: "Surf Explorer Trail map journey",
    subheading:
      "Cloud 9 is the approved anchor. Surf breaks beyond Cloud 9 stay pending-review until locally validated.",
    nextUnlockLabel: "Cloud 9",
    nextUnlockDescription:
      "Cloud 9 is the approved Surf Explorer anchor. Jacking Horse, Quicksilver, Tuason Point, Stimpy’s, and Pacifico Surf Area are visible as pending-review surf nodes until local validation is completed.",
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

};

export function getFunctionalTrailMapBySlug(trailSlug: string) {
  return SPM_FUNCTIONAL_TRAIL_MAPS[trailSlug] ?? null;
}
