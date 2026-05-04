export type ControlTowerGateKey =
  | "osp-core"
  | "spm"
  | "explore"
  | "operators"
  | "accommodations"
  | "pricing"
  | "payments"
  | "qr-compliance"
  | "marketplace-exposure"
  | "ai-assistant"
  | "localization"
  | "api"
  | "intelligence"
  | "settings";

export type ControlTowerGateData = {
  key: ControlTowerGateKey;
  code: string;
  title: string;
  subtitle: string;
  readiness: string;
  dataState: string;
  exposureState: string;
  purpose: string;
  operationalRole: string;
  connectedRoutes: string[];
  knownBlockers: string[];
  actionLanes: string[];
  backendDependencies: string[];
  publicExposureRisk: string;
};

export const controlTowerGateData: Record<ControlTowerGateKey, ControlTowerGateData> = {
  "osp-core": {
    key: "osp-core",
    code: "B",
    title: "OSP Core",
    subtitle: "Traveler identity, QR, pass, trip, app settings, auth routing, safety, and operating gateway governance.",
    readiness: "Gate page ready / wiring pending",
    dataState: "Control-state only",
    exposureState: "Private Super Admin",
    purpose:
      "Govern the main OSP Mobile App spine: traveler accounts, QR identity, OSP Passes, trips, trip validity dates, KYC readiness, traveler settings, notifications, emergency/safety, and auth routing.",
    operationalRole:
      "This module prevents traveler identity, QR issuance, pass readiness, and role-aware navigation from being scattered across login, traveler, and middleware pages.",
    connectedRoutes: [
      "/traveler/home",
      "/traveler/pass",
      "/traveler/trips",
      "/traveler/settings",
      "/traveler/emergency-safety",
      "/login",
    ],
    knownBlockers: [
      "QR identity and OSP pass readiness need final admin review surfaces.",
      "Role-aware login continuation must remain governed and must not reintroduce destructive next=/traveler/home redirects.",
      "Traveler settings, language, currency, and safety states are not yet fully supervised from this module.",
    ],
    actionLanes: [
      "Map traveler identity and pass-related surfaces into one admin read model.",
      "Create readiness review cards for QR identity, pass validity, profile/KYC, and trip state.",
      "Add auth-routing governance under Settings before production hardening.",
    ],
    backendDependencies: [
      "Traveler/account model readiness",
      "QrCredential / OSP pass linkage",
      "Trip and trip validity records",
      "Auth/session role routing",
    ],
    publicExposureRisk:
      "Never show traveler private identity, QR token, trip details, or KYC data outside protected role boundaries.",
  },
  spm: {
    key: "spm",
    code: "C",
    title: "SPM / Passport Trails",
    subtitle: "Passport Map, official trails, trail families, stamps, DIY builder, partner tours, curated tours, and trail progress.",
    readiness: "Gate page ready / Tour Architecture migration next",
    dataState: "Control-state only",
    exposureState: "Public discovery depends on approval",
    purpose:
      "Govern the Siargao Passport Map and Passport Trails product system: official trail families, trail nodes, trail variants, curated tours, Siargao Partner Tours, DIY trail rules, stamp rules, events, and return-traveler continuity.",
    operationalRole:
      "This module becomes the permanent home for Tour Architecture because the page governs Passport Trails, partner tours, stamps, and commercial tour mapping.",
    connectedRoutes: [
      "/siargao-passport-map",
      "/traveler/passport-trails",
      "/traveler/passport-trails/[trailSlug]",
      "/traveler/passport-trails/diy-trail-builder",
      "/admin/control-tower/spm/tour-architecture",
      "/admin/commercial/tour-architecture",
    ],
    knownBlockers: [
      "Current Tour Architecture prototype still lives under /admin/commercial/tour-architecture.",
      "Trail-family, stamp-rule, and DIY-route governance are not yet fully inside Control Tower.",
      "SPM curation and Explore Siargao discovery must remain connected but not collapsed.",
    ],
    actionLanes: [
      "ADMIN-CT-04: Tour Architecture now has its final Control Tower home at /admin/control-tower/spm/tour-architecture.",
      "Keep old /admin/commercial/tour-architecture untouched until ADMIN-CT-05 route classification.",
      "Create subroute homes for official trails, DIY trails, and stamp rules.",
      "Define which public SPM routes depend on admin approval and data readiness.",
    ],
    backendDependencies: [
      "Passport trail family records",
      "Trail node / stop metadata",
      "Stamp event rules",
      "DIY builder request/payment handoff records",
    ],
    publicExposureRisk:
      "Do not publish trails, stops, stamps, or partner-tour promises unless the source, approval, and commercial ownership are clear.",
  },
  explore: {
    key: "explore",
    code: "D",
    title: "Explore Siargao Commercial Center",
    subtitle: "Traveler-facing discovery governance for tours, stays, rentals, food, culture, surf schools, health, beauty, transport, products, and services.",
    readiness: "Gate page ready / exposure wiring pending",
    dataState: "Control-state only",
    exposureState: "Strict public exposure gates",
    purpose:
      "Govern all traveler-facing discovery modules, category pools, public cards, CTA routing, marketplace exposure, media display rules, filters, and featured experiences.",
    operationalRole:
      "This module controls what appears publicly in Explore Siargao without confusing it with SPM trail doctrine or operator authoring tools.",
    connectedRoutes: [
      "/traveler/explore",
      "/traveler/explore/tours",
      "/traveler/explore/stays",
      "/traveler/explore/rentals",
      "/traveler/explore/food-culture",
      "/traveler/explore/beauty-health",
      "/traveler/explore/surf-schools",
    ],
    knownBlockers: [
      "Discovery modules are present but not all have centralized exposure governance.",
      "Operator-created services must not bypass approval and readiness scoring.",
      "Media, CTA routing, and category readiness need admin control.",
    ],
    actionLanes: [
      "Define Explore category pools and public-card readiness gates.",
      "Separate SPM trail products from general commercial discovery.",
      "Connect marketplace exposure engine to Explore display rules later.",
    ],
    backendDependencies: [
      "Marketplace service catalog",
      "Operator commercial records",
      "Accommodation profile/readiness records",
      "Media records and category metadata",
    ],
    publicExposureRisk:
      "Explore must never become a raw directory of unapproved operators, imported accommodations, or incomplete services.",
  },
  operators: {
    key: "operators",
    code: "E",
    title: "Operator Governance",
    subtitle: "Operator applications, profiles, DOT accreditation, capabilities, approvals, suspension, staff access, and leniency review.",
    readiness: "Gate page ready / leniency doctrine active",
    dataState: "Control-state only",
    exposureState: "Lenient onboarding / strict public exposure",
    purpose:
      "Govern operator applications, profiles, DOT accreditation, capabilities, tour operators, accommodation operators, rental operators, transport providers, food/culture partners, service providers, staff access, and suspension/reinstatement.",
    operationalRole:
      "This module lets operators enter the system early while preventing unready operators from appearing publicly.",
    connectedRoutes: [
      "/operator/commercial",
      "/operator/accommodations",
      "/operator/settings",
      "/admin/control-tower/operators/tour-operators",
      "/admin/control-tower/operators/approvals",
      "/admin/control-tower/operators/leniency-review",
    ],
    knownBlockers: [
      "Operator approval, media approval, pricing approval, and distribution approval must not collapse into one vague approved state.",
      "Operator staff roles need clean boundaries.",
      "Leniency review needs admin-grade visibility.",
    ],
    actionLanes: [
      "Create operator leniency-review panels.",
      "Map operator status to public exposure eligibility.",
      "Prepare approvals, suspension, and reinstatement controls.",
    ],
    backendDependencies: [
      "Operator profile records",
      "Operator capability records",
      "DOT accreditation fields",
      "Team/staff role records",
    ],
    publicExposureRisk:
      "Lenient onboarding does not mean public marketplace exposure. Draft or incomplete operators remain internal.",
  },
  accommodations: {
    key: "accommodations",
    code: "F",
    title: "Accommodation Control Center",
    subtitle: "Accommodation profiles, onboarding, rooms, availability, booking modes, QR check-in, package-linked stays, payouts, and readiness.",
    readiness: "Gate page ready / readiness wiring pending",
    dataState: "Control-state only",
    exposureState: "Lenient import / strict bookability",
    purpose:
      "Govern accommodation profiles, owner onboarding, media galleries, rooms and units, availability, stay requests, confirmed stays, QR check-in/check-out, package-linked stays, OTA/travel-and-tours sourced stays, payments, payouts, statements, marketplace readiness, and intelligence.",
    operationalRole:
      "This module keeps accommodation supply, fulfillment, QR, package, payment, payout, OTA/API, Travel & Tours, and intelligence logic from becoming a generic stays marketplace.",
    connectedRoutes: [
      "/traveler/explore/stays",
      "/traveler/explore/stays/[slug]",
      "/operator/accommodations",
      "/admin/control-tower/accommodations/profiles",
      "/admin/control-tower/accommodations/marketplace-readiness",
    ],
    knownBlockers: [
      "Accommodation records may exist before claim, owner readiness, media readiness, pricing, or bookability.",
      "Rooms, units, availability, and booking modes need central control.",
      "Raw accommodation imports must not be published blindly.",
    ],
    actionLanes: [
      "Create profiles, onboarding, rooms/units, booking modes, QR check-in, and readiness subroute homes.",
      "Define accommodation readiness gates.",
      "Separate claimed, draft, internal, request-to-confirm, and public-bookable states.",
    ],
    backendDependencies: [
      "Accommodation profile records",
      "Accommodation media records",
      "Room/unit records",
      "Availability and booking mode records",
      "Payment/payout linkage",
    ],
    publicExposureRisk:
      "550 accommodations must not be blindly published. Public bookability requires readiness gates.",
  },
  pricing: {
    key: "pricing",
    code: "G",
    title: "Pricing & Margin Governance",
    subtitle: "Fee matrix, public SRP, operator base rates, platform margin, traveler fees, OTA fees, processing, FX, discounts, payouts, and snapshots.",
    readiness: "Gate page ready / central governance home assigned",
    dataState: "Control-state only",
    exposureState: "Private commercial governance",
    purpose:
      "Govern all commercial money logic: fee matrix, public SRP, operator base rates, platform margin, commission-inclusive pricing, traveler fees, OTA fees, payment processing, FX/currency, discount rules, margin absorption, payout rules, refund rules, and commercial snapshots.",
    operationalRole:
      "This module prevents tour pages, accommodation pages, payment pages, and operator pages from each becoming their own pricing source of truth.",
    connectedRoutes: [
      "/admin/control-tower/pricing/fee-matrix",
      "/admin/control-tower/pricing/tour-pricing",
      "/admin/control-tower/pricing/accommodation-pricing",
      "/traveler/payments/[intentId]",
    ],
    knownBlockers: [
      "Recommended fee rules and fees are not final locked yet.",
      "Pricing snapshots need strict commercial field alignment before production.",
      "Payment processing, FX, traveler fees, and OTA fees must remain separated.",
    ],
    actionLanes: [
      "Define central fee matrix overview.",
      "Prepare tour pricing and accommodation pricing gates.",
      "Add commercial snapshot review language before live wiring.",
    ],
    backendDependencies: [
      "Commercial pricing snapshot fields",
      "PaymentIntent records",
      "Booking pricing breakdown",
      "Operator payout computation",
      "FX/currency fields",
    ],
    publicExposureRisk:
      "Wrong public SRP, operator payout, traveler fee, or OTA fee creates financial trust damage and manual cleanup.",
  },
  payments: {
    key: "payments",
    code: "H",
    title: "Payments, Payouts & Statements",
    subtitle: "Payment intents, gateway status, PayMongo sandbox/live mode, receipts, refunds, payout holds, settlements, and statements.",
    readiness: "Gate page ready / financial ops wiring pending",
    dataState: "Control-state only",
    exposureState: "Private finance operations",
    purpose:
      "Govern payment intents, PayMongo status, sandbox/live mode, gateway handoffs, receipts, refunds, payout holds, operator payouts, accommodation payouts, OTA/partner settlement, statements, payment failures, and manual review.",
    operationalRole:
      "This module keeps traveler payment screens from becoming the payment control center.",
    connectedRoutes: [
      "/traveler/payments",
      "/traveler/payments/[intentId]",
      "/traveler/payments/[intentId]/sandbox-handoff",
      "/admin/control-tower/payments/payment-intents",
      "/admin/control-tower/payments/statements",
    ],
    knownBlockers: [
      "Payment operations are currently visible mainly through traveler-facing flows.",
      "PayMongo readiness, failures, receipts, and payout states need central admin supervision.",
      "Statements and settlement modes need their own governance views.",
    ],
    actionLanes: [
      "Create payment-intents, receipts, refunds, payouts, and statements subroute homes.",
      "Label sandbox/live mode clearly.",
      "Prepare financial exception panels.",
    ],
    backendDependencies: [
      "PaymentIntent records",
      "PaymentStateRecord records",
      "Receipt records",
      "Booking/payment linkage",
      "Payout/statement records",
    ],
    publicExposureRisk:
      "Do not expose internal payment failures, payout details, or settlement data to travelers or operators beyond role-appropriate views.",
  },
  "qr-compliance": {
    key: "qr-compliance",
    code: "I",
    title: "QR, Compliance & Movement",
    subtitle: "QR credentials, events, ingress, egress, island hopping, manifests, checkpoints, vessels, exceptions, and manual review.",
    readiness: "Gate page ready / compliance wiring pending",
    dataState: "Control-state only",
    exposureState: "Protected compliance governance",
    purpose:
      "Govern QR credentials, OSP QR events, traveler ingress, egress, island hopping departure, boat boarding, disembarkation, inter-island movement, activity check-in/out, manifests, compliance exceptions, checkpoints, vessels, and manual review.",
    operationalRole:
      "This module keeps QR as the operating compliance rail, not merely a Passport Trails stamp mechanism.",
    connectedRoutes: [
      "/traveler/pass",
      "/traveler/scan",
      "/operator/access-scan",
      "/operator/manifests",
      "/admin/manifest-approvals",
      "/admin/checkpoint",
    ],
    knownBlockers: [
      "Compliance gates must enforce approved manifest/operator/vessel where required.",
      "QR event trail needs protected admin interpretation.",
      "LGU/DOT visibility must remain aggregated and boundary-safe.",
    ],
    actionLanes: [
      "Create qr-events, checkpoints, inter-island, manifests, and exceptions subroute homes.",
      "Define movement-event categories.",
      "Prepare manual review and compliance exception surfaces.",
    ],
    backendDependencies: [
      "QrCredential records",
      "OspQrEvent records",
      "Manifest records",
      "Checkpoint records",
      "Trip/activity linkage",
    ],
    publicExposureRisk:
      "QR movement and compliance data must not leak private traveler or commercial operator information.",
  },
  "marketplace-exposure": {
    key: "marketplace-exposure",
    code: "J",
    title: "Marketplace Exposure Engine",
    subtitle: "Readiness scores, exposure scores, category pools, placement tiers, suppression, fairness rotation, sponsored later, and logs.",
    readiness: "Gate page ready / algorithm wiring pending",
    dataState: "Control-state only",
    exposureState: "Strict exposure governance",
    purpose:
      "Govern what becomes visible and why: readiness scores, exposure scores, category pools, placement tiers, featured verified, recommended, local verified partner, group/budget/private tags, fairness rotation, suppression, suspension, sponsored later, and placement logs.",
    operationalRole:
      "This module prevents the fatal flat 85-operator list mistake by making exposure governed, scored, and auditable.",
    connectedRoutes: [
      "/traveler/explore",
      "/traveler/partner-tours",
      "/traveler/explore/tours",
      "/traveler/explore/stays",
      "/admin/control-tower/marketplace-exposure/readiness",
    ],
    knownBlockers: [
      "Exposure logs and weighted fairness are not wired yet.",
      "Readiness score inputs need backend alignment.",
      "Sponsored placement must remain later, not MVP exposure bypass.",
    ],
    actionLanes: [
      "Create readiness, category-pools, placement-logs, and suppression subroute homes.",
      "Define MVP exposure categories and suppression states.",
      "Connect approved marketplace services only after gates pass.",
    ],
    backendDependencies: [
      "Marketplace service readiness fields",
      "Operator capability/readiness records",
      "Exposure score inputs",
      "Placement log records",
    ],
    publicExposureRisk:
      "No flat operator directory. No blind round robin. No exposure bypassing approval/readiness.",
  },
  "ai-assistant": {
    key: "ai-assistant",
    code: "K",
    title: "AI Assistant Control Center",
    subtitle: "Kuya Tala™ personality, allowed knowledge, approved answers, rejected answers, safety rules, language behavior, escalation, and hallucination guards.",
    readiness: "Gate page ready / knowledge controls pending",
    dataState: "Control-state only",
    exposureState: "Traveler-facing answer risk",
    purpose:
      "Govern Kuya Tala™ personality, allowed knowledge sources, approved answers, rejected answers, fallback rules, emergency behavior, tour/accommodation/pricing/safety knowledge, language behavior, escalation rules, conversation logs, training data approval, and hallucination guards.",
    operationalRole:
      "This module makes AI behavior part of Super Admin governance, not just a chat widget.",
    connectedRoutes: [
      "/traveler/settings",
      "/api/traveler/assistant/chat",
      "/admin/control-tower/ai-assistant/kuya-tala",
      "/admin/control-tower/ai-assistant/knowledge",
      "/admin/control-tower/ai-assistant/safety-rules",
    ],
    knownBlockers: [
      "Approved knowledge sources and rejected-answer controls are not fully admin-wired.",
      "Tour/accommodation/pricing facts must not be invented.",
      "Emergency and safety behavior needs strict escalation doctrine.",
    ],
    actionLanes: [
      "Create Kuya Tala™, knowledge, safety-rules, and language subroute homes.",
      "Define allowed knowledge and fallback states.",
      "Prepare conversation review and hallucination guard surfaces.",
    ],
    backendDependencies: [
      "Assistant chat endpoint",
      "Approved knowledge records",
      "Conversation log records",
      "Safety escalation rules",
    ],
    publicExposureRisk:
      "Kuya Tala™ must not invent prices, inclusions, safety claims, operator promises, or LGU/DOT statements.",
  },
  localization: {
    key: "localization",
    code: "L",
    title: "Language, Currency & Localization",
    subtitle: "Local Philippine languages, international traveler languages, translation approval, localized QR/payment/safety notes, currency display, and FX readiness.",
    readiness: "Gate page ready / localization workflow pending",
    dataState: "Control-state only",
    exposureState: "Traveler-facing copy risk",
    purpose:
      "Govern English, Filipino/Tagalog, Cebuano/Bisaya, Surigaonon where feasible, Chinese Simplified/Traditional, Korean, Japanese, Spanish, French, German, Hebrew, Arabic, Russian, Thai, Indonesian, Vietnamese, currency display, localized safety notes, payment notes, QR instructions, and translation approval status.",
    operationalRole:
      "This module ensures traveler-facing multilingual content is source-grounded and approval-aware rather than uncontrolled AI translation.",
    connectedRoutes: [
      "/traveler/settings",
      "/traveler/pass",
      "/traveler/payments",
      "/traveler/emergency-safety",
      "/admin/control-tower/localization",
    ],
    knownBlockers: [
      "Translation approval workflow is not built yet.",
      "Currency display and FX readiness are not centralized here yet.",
      "Localized safety, QR, and payment notes need official source control.",
    ],
    actionLanes: [
      "Create translation status and approval control panels.",
      "Define localized QR, payment, and safety-note ownership.",
      "Connect currency display readiness to pricing governance later.",
    ],
    backendDependencies: [
      "Language preference records",
      "Currency preference records",
      "Translation/content approval records",
      "FX/currency display settings",
    ],
    publicExposureRisk:
      "Wrong translations in safety, payment, QR, or compliance instructions can create operational and trust damage.",
  },
  api: {
    key: "api",
    code: "M",
    title: "API Control Center",
    subtitle: "API partners, OTA access, Travel & Tours access, tokens, scopes, rate limits, webhooks, booking intake, QR issuance, and audit logs.",
    readiness: "Gate page ready / partner API later",
    dataState: "Control-state only",
    exposureState: "Private integration governance",
    purpose:
      "Govern API partners, OTA API access, Travel & Tours API access, tokens, scopes, rate limits, webhook logs, booking intake, passport validation, QR issuance API, partner status, API terms, suspension, and audit logs.",
    operationalRole:
      "This module treats API access as governed destination infrastructure, not open public access.",
    connectedRoutes: [
      "/developers",
      "/api-terms",
      "/admin/control-tower/api/partners",
      "/admin/control-tower/api/tokens",
      "/admin/control-tower/api/webhooks",
    ],
    knownBlockers: [
      "Full API partner portal is post-VPS.",
      "Token issuance and scopes need approval workflow.",
      "Webhook logs and suspension controls are not wired yet.",
    ],
    actionLanes: [
      "Create partners, tokens, scopes, webhooks, and logs subroute homes.",
      "Define API approval and suspension lifecycle.",
      "Keep public developer pages separate from private API control.",
    ],
    backendDependencies: [
      "API partner records",
      "Token records",
      "Scope/rate-limit settings",
      "Webhook logs",
      "Audit logs",
    ],
    publicExposureRisk:
      "API tokens, scopes, booking intake, and QR issuance must never be uncontrolled or public by default.",
  },
  intelligence: {
    key: "intelligence",
    code: "N",
    title: "Intelligence & Data Center",
    subtitle: "Traveler flow, trip volume, trail demand, tour demand, accommodation capacity, QR events, operator performance, booking conversion, payment failures, and LGU/DOT aggregated views.",
    readiness: "Gate page ready / protected analytics pending",
    dataState: "Control-state only",
    exposureState: "Private full intelligence / aggregated LGU-DOT views",
    purpose:
      "Govern protected analytics: traveler flow, trip volume, domestic/international mix, accommodation capacity, trail demand, tour demand, QR events, operator performance, booking conversion, payment failures, seasonal pressure, forward demand, LGU/DOT aggregated views, emergency visibility, and commercial intelligence.",
    operationalRole:
      "This module separates Super Admin full intelligence from LGU/DOT aggregated views and operator-owned operational data.",
    connectedRoutes: [
      "/admin/intelligence",
      "/lgu/intelligence",
      "/admin/control-tower/intelligence",
    ],
    knownBlockers: [
      "Old /admin/intelligence and /lgu/intelligence need route classification in ADMIN-CT-05.",
      "LGU/DOT view boundaries must remain strict.",
      "Commercial intelligence must not leak into public or operator views.",
    ],
    actionLanes: [
      "Create protected intelligence command surface.",
      "Classify existing admin and LGU intelligence routes.",
      "Define full vs aggregated vs operator-owned data boundaries.",
    ],
    backendDependencies: [
      "Booking records",
      "Trip records",
      "QR event records",
      "Operator performance records",
      "Payment failure records",
      "Aggregated reporting views",
    ],
    publicExposureRisk:
      "Super Admin can see full intelligence; LGU/DOT sees protected aggregated intelligence; operators see only their own data.",
  },
  settings: {
    key: "settings",
    code: "O",
    title: "System Settings",
    subtitle: "Users, roles, permissions, navigation, feature flags, auth redirects, platform settings, payment mode, language defaults, currency defaults, AI settings, emergency settings, and audit settings.",
    readiness: "Gate page ready / RBAC plug-in later",
    dataState: "Control-state only",
    exposureState: "Private platform configuration",
    purpose:
      "Govern roles and permissions, admin users, staff users, operator roles, traveler app settings, SPM app settings, feature flags, route settings, auth redirect rules, navigation rules, brand settings, notification settings, emergency settings, payment mode, sandbox/live toggle, currency rules, language rules, AI assistant settings, and audit settings.",
    operationalRole:
      "This module becomes the long-term governance home for destructive redirect prevention, feature flags, navigation rules, payment mode, localization defaults, and audit settings.",
    connectedRoutes: [
      "/login",
      "/logout",
      "/admin/control-tower/settings/users",
      "/admin/control-tower/settings/roles",
      "/admin/control-tower/settings/navigation",
      "/admin/control-tower/settings/feature-flags",
    ],
    knownBlockers: [
      "Full RBAC is not overbuilt yet.",
      "Admin roles are visible but can be gated later.",
      "Auth redirects and route settings need governed configuration before VPS.",
    ],
    actionLanes: [
      "Create users, roles, navigation, feature-flags, and platform subroute homes.",
      "Prepare route-aware auth redirect governance.",
      "Define settings audit event requirements.",
    ],
    backendDependencies: [
      "User/session role records",
      "RBAC permission map",
      "Feature flag settings",
      "Navigation settings",
      "Audit log settings",
    ],
    publicExposureRisk:
      "Misconfigured auth redirects, feature flags, or role settings can expose the wrong surface to the wrong user.",
  },
};
