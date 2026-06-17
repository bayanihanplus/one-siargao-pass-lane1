export type SettingsControlMode =
  | "DISPLAY_ONLY"
  | "FRONTEND_CONFIG_READY"
  | "MUTATION_LOCKED";

export type SettingsControlRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type SettingsControlContract = {
  key: string;
  section:
    | "NAVIGATION"
    | "AUTH_ROUTES"
    | "PUBLIC_DISCOVERY"
    | "FEATURE_FLAGS"
    | "PAYMENT_MODE"
    | "AI_ASSISTANT"
    | "BRAND_UI"
    | "VPS_READINESS";
  label: string;
  description: string;
  currentState: string;
  targetControl: string;
  mode: SettingsControlMode;
  risk: SettingsControlRisk;
  enabled: boolean;
  requiresBackendMutation: boolean;
  requiresAuditLog: boolean;
  lockedReason?: string;
};

const mutationLocked =
  "Locked until backend settings contract, permission gate, audit log, and rollback behavior are created.";

export const CONTROL_TOWER_SETTINGS_CONTROLS: SettingsControlContract[] = [
  {
    key: "navigation.traveler-home",
    section: "NAVIGATION",
    label: "Traveler home routing",
    description: "Control where traveler Home and Continue actions point inside the mobile app shell.",
    currentState: "Route behavior exists in frontend code and middleware/auth flow.",
    targetControl: "Govern /traveler/app, /traveler/explore, /traveler/trips, /traveler/pass and bottom nav behavior.",
    mode: "DISPLAY_ONLY",
    risk: "HIGH",
    enabled: true,
    requiresBackendMutation: false,
    requiresAuditLog: false,
  },
  {
    key: "auth.returning-login",
    section: "AUTH_ROUTES",
    label: "Returning login behavior",
    description: "Govern stale next parameters, role-aware continue destination, and protected route redirects.",
    currentState: "Frontend/middleware code controls redirect behavior.",
    targetControl: "Expose allowed redirect rules without allowing destructive traveler-home next params.",
    mode: "MUTATION_LOCKED",
    risk: "CRITICAL",
    enabled: false,
    requiresBackendMutation: true,
    requiresAuditLog: true,
    lockedReason: mutationLocked,
  },
  {
    key: "public-discovery.pages",
    section: "PUBLIC_DISCOVERY",
    label: "Public discovery visibility",
    description: "Govern which Explore, Passport Trails, Partner Tours, and public product pages remain visitor-readable.",
    currentState: "Public/private behavior is route-level and middleware dependent.",
    targetControl: "Centralize public discovery labels before runtime toggles.",
    mode: "DISPLAY_ONLY",
    risk: "HIGH",
    enabled: true,
    requiresBackendMutation: false,
    requiresAuditLog: false,
  },
  {
    key: "feature-flags.command-center",
    section: "FEATURE_FLAGS",
    label: "Command Center feature flags",
    description: "Define which Command Center controls are visible, locked, or ready.",
    currentState: "Feature state is currently controlled by build lanes and frontend registry contracts.",
    targetControl: "Prepare a governed flag table for future backend-controlled toggles.",
    mode: "FRONTEND_CONFIG_READY",
    risk: "MEDIUM",
    enabled: true,
    requiresBackendMutation: false,
    requiresAuditLog: false,
  },
  {
    key: "payment.mode",
    section: "PAYMENT_MODE",
    label: "Payment mode governance",
    description: "Govern sandbox/live payment mode labels and PayMongo handoff readiness without mutating payment records.",
    currentState: "Payment pages and gateway logic exist separately from this Command Center.",
    targetControl: "Display current payment readiness and lock live-mode changes until backend finance contract exists.",
    mode: "MUTATION_LOCKED",
    risk: "CRITICAL",
    enabled: false,
    requiresBackendMutation: true,
    requiresAuditLog: true,
    lockedReason: mutationLocked,
  },
  {
    key: "ai.kuya-tala",
    section: "AI_ASSISTANT",
    label: "Kuya Tala™ governance",
    description: "Control approved knowledge, safety boundaries, escalation labels, and no-hallucination rules.",
    currentState: "Assistant routes exist; knowledge governance is not fully centralized here yet.",
    targetControl: "Centralize assistant rule visibility before live editing.",
    mode: "DISPLAY_ONLY",
    risk: "HIGH",
    enabled: true,
    requiresBackendMutation: false,
    requiresAuditLog: false,
  },
  {
    key: "brand-ui.osp-palette",
    section: "BRAND_UI",
    label: "OSP UI palette and contrast doctrine",
    description: "Govern Deep Navy, Ocean Teal, Sun Gold, white headers on dark shells, and no low-contrast buttons.",
    currentState: "Locked visual doctrine is enforced through frontend patches and QA.",
    targetControl: "Expose UI doctrine as a Command Center rule set before theme mutation exists.",
    mode: "DISPLAY_ONLY",
    risk: "MEDIUM",
    enabled: true,
    requiresBackendMutation: false,
    requiresAuditLog: false,
  },
  {
    key: "vps.preflight",
    section: "VPS_READINESS",
    label: "VPS readiness preflight",
    description: "Track whether build, browser QA, route audit, endpoint audit, and commit isolation are ready for VPS.",
    currentState: "Manual audits and builds are passing lane-by-lane.",
    targetControl: "Show the VPS readiness checklist before deployment branch preparation.",
    mode: "DISPLAY_ONLY",
    risk: "HIGH",
    enabled: true,
    requiresBackendMutation: false,
    requiresAuditLog: false,
  },
];

export function getEnabledSettingsControls() {
  return CONTROL_TOWER_SETTINGS_CONTROLS.filter((control) => control.enabled);
}

export function getLockedSettingsControls() {
  return CONTROL_TOWER_SETTINGS_CONTROLS.filter((control) => !control.enabled);
}
