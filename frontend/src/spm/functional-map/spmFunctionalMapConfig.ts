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
};

export function getFunctionalTrailMapBySlug(trailSlug: string) {
  return SPM_FUNCTIONAL_TRAIL_MAPS[trailSlug] ?? null;
}
