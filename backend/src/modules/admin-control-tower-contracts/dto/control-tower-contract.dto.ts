export const CONTROL_TOWER_AREAS = [
  "COMMAND_CENTER",
  "OSP_CORE",
  "SPM_PASSPORT_TRAILS",
  "EXPLORE_SIARGAO",
  "OPERATOR_GOVERNANCE",
  "ACCOMMODATION_CONTROL",
  "PRICING_MARGIN",
  "PAYMENTS_PAYOUTS_STATEMENTS",
  "QR_COMPLIANCE_MOVEMENT",
  "MARKETPLACE_EXPOSURE",
  "AI_ASSISTANT",
  "LOCALIZATION",
  "API_CONTROL",
  "INTELLIGENCE_DATA",
  "SYSTEM_SETTINGS",
] as const;

export type ControlTowerArea = (typeof CONTROL_TOWER_AREAS)[number];

export const CONTROL_TOWER_READINESS_STATES = [
  "SHELL_ONLY",
  "CONTRACT_READY",
  "READ_ONLY_READY",
  "PARTIALLY_WIRED",
  "DB_BACKED",
  "BLOCKED",
] as const;

export type ControlTowerReadinessState =
  (typeof CONTROL_TOWER_READINESS_STATES)[number];

export const CONTROL_TOWER_RISK_LEVELS = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const;

export type ControlTowerRiskLevel = (typeof CONTROL_TOWER_RISK_LEVELS)[number];

export type ControlTowerSourceType =
  | "SCHEMA"
  | "SERVICE"
  | "MODULE"
  | "COMPUTED"
  | "STATIC_CONTRACT"
  | "NOT_WIRED";

export interface ControlTowerSourceContractDto {
  type: ControlTowerSourceType;
  label: string;
  moduleName?: string;
  filePath?: string;
  modelName?: string;
  endpoint?: string;
  notes?: string;
}

export interface ControlTowerMetricContractDto {
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
}

export interface ControlTowerActionContractDto {
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
}

export interface ControlTowerAreaContractDto {
  area: ControlTowerArea;
  title: string;
  route: string;
  readiness: ControlTowerReadinessState;
  riskLevel: ControlTowerRiskLevel;
  purpose: string;
  hardBoundary: string;
  sourceContracts: ControlTowerSourceContractDto[];
  metricContracts: ControlTowerMetricContractDto[];
  actionContracts: ControlTowerActionContractDto[];
  blockers: string[];
  nextBackendLane: string;
}

export interface ControlTowerOverviewContractDto {
  generatedAt: string;
  contractVersion: "ADMIN_CT_V1";
  mode: "CONTRACT_ONLY" | "READ_ONLY" | "PARTIAL_RUNTIME";
  areas: ControlTowerAreaContractDto[];
  globalBlockers: string[];
  hardStopRules: string[];
}
