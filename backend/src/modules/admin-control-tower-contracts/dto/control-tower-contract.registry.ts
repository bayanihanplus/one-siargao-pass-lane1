import {
  type ControlTowerArea,
  type ControlTowerAreaContractDto,
} from "./control-tower-contract.dto";

const areaRoutes: Record<ControlTowerArea, string> = {
  COMMAND_CENTER: "/admin/control-tower/command-center",
  OSP_CORE: "/admin/control-tower/osp-core",
  SPM_PASSPORT_TRAILS: "/admin/control-tower/spm",
  EXPLORE_SIARGAO: "/admin/control-tower/explore",
  OPERATOR_GOVERNANCE: "/admin/control-tower/operators",
  ACCOMMODATION_CONTROL: "/admin/control-tower/accommodations",
  PRICING_MARGIN: "/admin/control-tower/pricing",
  PAYMENTS_PAYOUTS_STATEMENTS: "/admin/control-tower/payments",
  QR_COMPLIANCE_MOVEMENT: "/admin/control-tower/qr-compliance",
  MARKETPLACE_EXPOSURE: "/admin/control-tower/marketplace-exposure",
  AI_ASSISTANT: "/admin/control-tower/ai-assistant",
  LOCALIZATION: "/admin/control-tower/localization",
  API_CONTROL: "/admin/control-tower/api",
  INTELLIGENCE_DATA: "/admin/control-tower/intelligence",
  SYSTEM_SETTINGS: "/admin/control-tower/settings",
};

const areaTitles: Record<ControlTowerArea, string> = {
  COMMAND_CENTER: "Command Center",
  OSP_CORE: "OSP Core",
  SPM_PASSPORT_TRAILS: "SPM / Passport Trails",
  EXPLORE_SIARGAO: "Explore Siargao Commercial Center",
  OPERATOR_GOVERNANCE: "Operator Governance",
  ACCOMMODATION_CONTROL: "Accommodation Control Center",
  PRICING_MARGIN: "Pricing & Margin Governance",
  PAYMENTS_PAYOUTS_STATEMENTS: "Payments, Payouts & Statements",
  QR_COMPLIANCE_MOVEMENT: "QR, Compliance & Movement",
  MARKETPLACE_EXPOSURE: "Marketplace Exposure Engine",
  AI_ASSISTANT: "AI Assistant Control Center",
  LOCALIZATION: "Language, Currency & Localization",
  API_CONTROL: "API Control Center",
  INTELLIGENCE_DATA: "Intelligence & Data Center",
  SYSTEM_SETTINGS: "System Settings",
};

const areaPurposes: Record<ControlTowerArea, string> = {
  COMMAND_CENTER: "Executive Super Admin overview across the full OSP Control Tower.",
  OSP_CORE: "Traveler identity, OSP pass, QR credential, trip readiness, and core operating state.",
  SPM_PASSPORT_TRAILS: "Passport Trails, curated trails, DIY trail builder, stamps, partner tours, and SPM commercial structure.",
  EXPLORE_SIARGAO: "Commercial discovery governance across tours, stays, rentals, food, culture, health, and services.",
  OPERATOR_GOVERNANCE: "Operator onboarding, readiness, approval, leniency, exposure eligibility, and risk boundaries.",
  ACCOMMODATION_CONTROL: "Accommodation supply, claim readiness, rooms, availability, stay validation, vouchers, payouts, and bookability.",
  PRICING_MARGIN: "Fee matrix, traveler totals, platform share, operator payout, FX, processing, discounts, and commercial snapshots.",
  PAYMENTS_PAYOUTS_STATEMENTS: "Payment intents, gateway state, receipts, refunds, payout holds, statements, and settlements.",
  QR_COMPLIANCE_MOVEMENT: "QR credentials, OSP QR events, manifests, checkpoints, regulated movement, clearance, and exceptions.",
  MARKETPLACE_EXPOSURE: "Readiness scoring, category pools, exposure scoring, suppression, fairness, placement, and auditability.",
  AI_ASSISTANT: "Kuya Tala™ persona, approved knowledge, safety rules, fallback behavior, and answer governance.",
  LOCALIZATION: "Language preferences, official translations, currency display, FX boundaries, and localized official copy.",
  API_CONTROL: "Partner API access, tokens, scopes, webhooks, API logs, partner suspension, and rate-limit governance.",
  INTELLIGENCE_DATA: "Super Admin intelligence, aggregated LGU/DOT views, operator-owned views, forecasting, and decision signals.",
  SYSTEM_SETTINGS: "Roles, permissions, navigation rules, feature flags, auth redirects, payment mode, AI settings, and audit configuration.",
};

const hardBoundaryByArea: Record<ControlTowerArea, string> = {
  COMMAND_CENTER: "Must not show fake live platform counters before read-only backend contracts exist.",
  OSP_CORE: "Must not reinterpret traveler identity, OSP pass, QR credential, or trip clearance from frontend-only state.",
  SPM_PASSPORT_TRAILS: "Must not publish SPM commercial readiness without approved source, pricing, and fulfillment contracts.",
  EXPLORE_SIARGAO: "Must not expose raw operator, accommodation, or service records as public marketplace inventory.",
  OPERATOR_GOVERNANCE: "Operator authoring remains separate; Super Admin governs readiness, approval, and exposure.",
  ACCOMMODATION_CONTROL: "Imported or claimed accommodation records are not automatically public bookable inventory.",
  PRICING_MARGIN: "Pricing formulas and booking snapshots must not drift across feature modules.",
  PAYMENTS_PAYOUTS_STATEMENTS: "Traveler payment pages execute payment flow; finance operations and settlement truth live in governed contracts.",
  QR_COMPLIANCE_MOVEMENT: "QR is not only for stamps; it is the compliance rail for identity, movement, manifests, and exceptions.",
  MARKETPLACE_EXPOSURE: "No flat 85-operator list, no blind round robin, and no readiness bypass.",
  AI_ASSISTANT: "Kuya Tala™ must not invent prices, inclusions, safety claims, operator promises, or LGU/DOT statements.",
  LOCALIZATION: "AI translation must not publish official safety, payment, QR, or compliance instructions without approval.",
  API_CONTROL: "Partner API access must be approved, scoped, logged, and suspendable.",
  INTELLIGENCE_DATA: "Super Admin full intelligence, LGU/DOT aggregated intelligence, and operator-owned intelligence must remain separate.",
  SYSTEM_SETTINGS: "Settings shell must not change middleware, RBAC, auth redirects, feature flags, payment mode, or runtime behavior yet.",
};

export const CONTROL_TOWER_AREA_CONTRACTS: ControlTowerAreaContractDto[] =
  (Object.keys(areaTitles) as ControlTowerArea[]).map((area) => ({
    area,
    title: areaTitles[area],
    route: areaRoutes[area],
    readiness: "CONTRACT_READY",
    riskLevel:
      area === "PAYMENTS_PAYOUTS_STATEMENTS" ||
      area === "QR_COMPLIANCE_MOVEMENT" ||
      area === "API_CONTROL" ||
      area === "INTELLIGENCE_DATA"
        ? "HIGH"
        : "MEDIUM",
    purpose: areaPurposes[area],
    hardBoundary: hardBoundaryByArea[area],
    sourceContracts: [
      {
        type: "STATIC_CONTRACT",
        label: "ADMIN-CT-24 read-only contract shell",
        notes:
          "Contract exists. No DB mutation, no live read model, and no fake metric claim.",
      },
    ],
    metricContracts: [],
    actionContracts: [],
    blockers: [
      "No live metrics are claimed yet.",
      "No Prisma/database read model is used yet.",
      "No mutation actions are enabled.",
    ],
    nextBackendLane:
      "ADMIN-CT-25 — Select first low-risk read-only module wiring using existing data only.",
  }));
