export type PassportMapRegion =
  | "TOURISM_CORE"
  | "ISLAND_HOPPING"
  | "SURF_BELT"
  | "NORTH_SIARGAO"
  | "SCENIC_INLAND"
  | "SOCORRO_BUCAS_GRANDE"
  | "SYSTEM_MILESTONE";

export type PassportMapLabelAlign = "left" | "center" | "right";

export type PassportMapRouteGroup =
  | "TRI_ISLAND_JOINER"
  | "ISLAND_HOPPING_EXTENDED"
  | "SURF_EXPLORER"
  | "NORTH_COAST_ADVENTURE"
  | "SCENIC_SUNSET"
  | "SOCORRO_BUCAS_GRANDE_ADVENTURE";

export type PassportMapNodeCoordinate = {
  nodeCode: string;
  mapRegion: PassportMapRegion;
  mapX: number;
  mapY: number;
  labelX: number;
  labelY: number;
  labelAlign: PassportMapLabelAlign;
  displayPriority: number;
  insetGroup: string | null;
  routeGroup: PassportMapRouteGroup;
};

export const SIARGAO_PASSPORT_MAP_COORDINATES = {
  GUYAM_ISLAND: {
    nodeCode: "GUYAM_ISLAND",
    mapRegion: "ISLAND_HOPPING",
    mapX: 64,
    mapY: 73,
    labelX: 67,
    labelY: 70,
    labelAlign: "left",
    displayPriority: 1,
    insetGroup: null,
    routeGroup: "TRI_ISLAND_JOINER",
  },
  DAKU_ISLAND: {
    nodeCode: "DAKU_ISLAND",
    mapRegion: "ISLAND_HOPPING",
    mapX: 72,
    mapY: 68,
    labelX: 75,
    labelY: 66,
    labelAlign: "left",
    displayPriority: 1,
    insetGroup: null,
    routeGroup: "TRI_ISLAND_JOINER",
  },
  NAKED_ISLAND: {
    nodeCode: "NAKED_ISLAND",
    mapRegion: "ISLAND_HOPPING",
    mapX: 82,
    mapY: 75,
    labelX: 80,
    labelY: 79,
    labelAlign: "right",
    displayPriority: 1,
    insetGroup: null,
    routeGroup: "TRI_ISLAND_JOINER",
  },
} as const satisfies Record<string, PassportMapNodeCoordinate>;

export const TRI_ISLAND_JOINER_MAP_NODE_CODES = [
  "GUYAM_ISLAND",
  "DAKU_ISLAND",
  "NAKED_ISLAND",
] as const;

export function getSiargaoPassportMapCoordinate(nodeCode: string) {
  return SIARGAO_PASSPORT_MAP_COORDINATES[
    nodeCode as keyof typeof SIARGAO_PASSPORT_MAP_COORDINATES
  ] ?? null;
}
