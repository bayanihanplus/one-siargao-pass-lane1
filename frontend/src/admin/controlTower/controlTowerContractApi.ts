export type ControlTowerReadinessState =
  | "SHELL_ONLY"
  | "CONTRACT_READY"
  | "READ_ONLY_READY"
  | "PARTIALLY_WIRED"
  | "DB_BACKED"
  | "BLOCKED";

export type ControlTowerRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ControlTowerSourceType =
  | "SCHEMA"
  | "SERVICE"
  | "MODULE"
  | "COMPUTED"
  | "STATIC_CONTRACT"
  | "NOT_WIRED";

export type ControlTowerSourceContract = {
  type: ControlTowerSourceType;
  label: string;
  moduleName?: string;
  filePath?: string;
  modelName?: string;
  endpoint?: string;
  notes?: string;
};

export type ControlTowerMetricContract = {
  key: string;
  label: string;
  description: string;
  sourceType: ControlTowerSourceType;
  readiness: ControlTowerReadinessState;
  riskLevel: ControlTowerRiskLevel;
  valueType:
    | "COUNT"
    | "AMOUNT"
    | "PERCENT"
    | "STATUS"
    | "TEXT"
    | "TIMESTAMP"
    | "BOOLEAN"
    | "COLLECTION";
  safeForSuperAdmin: boolean;
  safeForLguDot: boolean;
  safeForOperator: boolean;
  safeForTraveler: boolean;
  notes?: string;
};

export type ControlTowerActionContract = {
  key: string;
  label: string;
  description: string;
  readiness: ControlTowerReadinessState;
  riskLevel: ControlTowerRiskLevel;
  requiresBackendMutation: boolean;
  requiresSchemaMutation: boolean;
  requiresAuditLog: boolean;
  allowedRoles: string[];
  notes?: string;
};

export type ControlTowerAreaContract = {
  area: string;
  title: string;
  route: string;
  readiness: ControlTowerReadinessState;
  riskLevel: ControlTowerRiskLevel;
  purpose: string;
  hardBoundary: string;
  sourceContracts: ControlTowerSourceContract[];
  metricContracts: ControlTowerMetricContract[];
  actionContracts: ControlTowerActionContract[];
  blockers: string[];
  nextBackendLane: string;
};

export type ControlTowerOverviewContract = {
  generatedAt: string;
  contractVersion: "ADMIN_CT_V1";
  mode: "CONTRACT_ONLY" | "READ_ONLY" | "PARTIAL_RUNTIME";
  areas: ControlTowerAreaContract[];
  globalBlockers: string[];
  hardStopRules: string[];
};

export type ControlTowerContractLoadState =
  | {
      status: "ready";
      data: ControlTowerOverviewContract;
      endpoint: string;
    }
  | {
      status: "unavailable";
      endpoint: string;
      error: string;
    };

const DEFAULT_BACKEND_BASE_URL = "http://localhost:8001/api/v1";

function getBackendBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_OSP_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    DEFAULT_BACKEND_BASE_URL
  ).replace(/\/$/, "");
}

function isControlTowerOverviewContract(
  value: unknown,
): value is ControlTowerOverviewContract {
  if (!value || typeof value !== "object") return false;

  const data = value as Partial<ControlTowerOverviewContract>;

  return (
    data.contractVersion === "ADMIN_CT_V1" &&
    data.mode === "CONTRACT_ONLY" &&
    Array.isArray(data.areas) &&
    Array.isArray(data.globalBlockers) &&
    Array.isArray(data.hardStopRules)
  );
}

export async function loadControlTowerOverviewContract(): Promise<ControlTowerContractLoadState> {
  const endpoint = `${getBackendBaseUrl()}/admin/control-tower/overview`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        status: "unavailable",
        endpoint,
        error: `Contract endpoint returned HTTP ${response.status}.`,
      };
    }

    const data: unknown = await response.json();

    if (!isControlTowerOverviewContract(data)) {
      return {
        status: "unavailable",
        endpoint,
        error:
          "Contract endpoint responded, but payload is not ADMIN_CT_V1 CONTRACT_ONLY.",
      };
    }

    return {
      status: "ready",
      endpoint,
      data,
    };
  } catch (error) {
    return {
      status: "unavailable",
      endpoint,
      error:
        error instanceof Error
          ? error.message
          : "Unknown contract adapter fetch failure.",
    };
  }
}
