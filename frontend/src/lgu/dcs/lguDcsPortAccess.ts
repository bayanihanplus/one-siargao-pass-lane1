export type LguDcsPortCode = "GENERAL_LUNA_PORT" | "DAPA_PORT" | "DEL_CARMEN_PORT";
export type LguDcsRole = "SUPER_ADMIN" | "LGU_ADMIN" | "LGU_STAFF" | "LGU_OFFICER" | "DOT_LGU" | "LGU_VIEWER";

export type LguDcsPortAccessContext = {
  role: LguDcsRole;
  allowedPorts: LguDcsPortCode[];
  accessMode: "SUPER_ADMIN_ALL_PORTS" | "PORT_SCOPED_LGU_USER";
  source: "FRONTEND_PRESENTATION_GATE";
};

export const LGU_DCS_PORTS: Array<{
  code: LguDcsPortCode;
  name: string;
  municipality: string;
  moduleStatus: "READY_FOR_FLOW_REVIEW" | "NEXT_MODULE";
  route: string;
  scope: string;
}> = [
  {
    code: "GENERAL_LUNA_PORT",
    name: "General Luna Port",
    municipality: "General Luna",
    moduleStatus: "READY_FOR_FLOW_REVIEW",
    route: "/lgu/departure-control/general-luna",
    scope: "Classic Tri-Island, Mam-On route, Corregidor route",
  },
  {
    code: "DAPA_PORT",
    name: "Dapa Port",
    municipality: "Dapa",
    moduleStatus: "NEXT_MODULE",
    route: "#",
    scope: "Bucas Grande / Sohoton",
  },
  {
    code: "DEL_CARMEN_PORT",
    name: "Del Carmen Port",
    municipality: "Del Carmen",
    moduleStatus: "NEXT_MODULE",
    route: "#",
    scope: "Sugba Lagoon / Mangrove tours",
  },
];

export function normalizeLguDcsRole(input?: string | null): LguDcsRole {
  const role = String(input || "").trim().toUpperCase();

  if (role === "SUPER_ADMIN") return "SUPER_ADMIN";
  if (role === "LGU_ADMIN") return "LGU_ADMIN";
  if (role === "LGU_STAFF") return "LGU_STAFF";
  if (role === "LGU_OFFICER") return "LGU_OFFICER";
  if (role === "DOT_LGU") return "DOT_LGU";

  return "LGU_VIEWER";
}

export function normalizePortScope(input?: string | null): LguDcsPortCode[] {
  const raw = String(input || "").trim().toUpperCase();

  if (!raw) return ["GENERAL_LUNA_PORT"];

  const aliases: Record<string, LguDcsPortCode> = {
    GL: "GENERAL_LUNA_PORT",
    GENERAL_LUNA: "GENERAL_LUNA_PORT",
    GENERAL_LUNA_PORT: "GENERAL_LUNA_PORT",
    DAPA: "DAPA_PORT",
    DAPA_PORT: "DAPA_PORT",
    DEL_CARMEN: "DEL_CARMEN_PORT",
    DEL_CARMEN_PORT: "DEL_CARMEN_PORT",
  };

  const ports = raw
    .split(",")
    .map((item) => aliases[item.trim()])
    .filter(Boolean);

  return Array.from(new Set(ports.length ? ports : ["GENERAL_LUNA_PORT"]));
}

export function buildLguDcsAccessContext(input?: {
  role?: string | null;
  portScope?: string | null;
}): LguDcsPortAccessContext {
  const role = normalizeLguDcsRole(input?.role);

  if (role === "SUPER_ADMIN") {
    return {
      role,
      allowedPorts: ["GENERAL_LUNA_PORT", "DAPA_PORT", "DEL_CARMEN_PORT"],
      accessMode: "SUPER_ADMIN_ALL_PORTS",
      source: "FRONTEND_PRESENTATION_GATE",
    };
  }

  return {
    role,
    allowedPorts: normalizePortScope(input?.portScope),
    accessMode: "PORT_SCOPED_LGU_USER",
    source: "FRONTEND_PRESENTATION_GATE",
  };
}

export function canAccessLguDcsPort(context: LguDcsPortAccessContext | null | undefined, portCode: LguDcsPortCode) {
  if (!context) return portCode === "GENERAL_LUNA_PORT";

  if (context.role === "SUPER_ADMIN") return true;

  const allowedPorts = Array.isArray(context.allowedPorts) ? context.allowedPorts : ["GENERAL_LUNA_PORT"];

  return allowedPorts.includes(portCode);
}

export function getLguDcsPortAccessLabel(context: LguDcsPortAccessContext | null | undefined) {
  if (!context) return "1 authorized port";

  if (context.role === "SUPER_ADMIN") return "Super Admin · all ports";

  const allowedPorts = Array.isArray(context.allowedPorts) ? context.allowedPorts : ["GENERAL_LUNA_PORT"];

  return `${allowedPorts.length} authorized port${allowedPorts.length === 1 ? "" : "s"}`;
}

export function getLguDcsDeniedCopy(portCode: LguDcsPortCode) {
  const port = LGU_DCS_PORTS.find((item) => item.code === portCode);

  return {
    title: "Port access not assigned",
    body: `Your LGU account is not authorized for ${port?.name || portCode}. Ask the LGU/DOT account administrator or Super Admin to update your DCS port scope.`,
  };
}
