export type FrontendControlType =
  | "ROUTE_VISIBILITY"
  | "CTA_ROUTING"
  | "HERO_CONTENT"
  | "CATEGORY_EXPOSURE"
  | "CARD_PRESENTATION"
  | "PAYMENT_LABEL"
  | "AUTH_REDIRECT"
  | "BRAND_UI"
  | "FEATURE_FLAG"
  | "VPS_PREFLIGHT";

export type FrontendControlStatus =
  | "CONFIGURABLE_VIEW"
  | "READY_FOR_BACKEND_CONTROL"
  | "LOCKED_FOR_SAFETY";

export type FrontendControlRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type FrontendControlItem = {
  key: string;
  type: FrontendControlType;
  title: string;
  targetSurface: string;
  currentRule: string;
  desiredControl: string;
  businessImpact: string;
  status: FrontendControlStatus;
  risk: FrontendControlRisk;
  primaryAction: string;
  secondaryAction: string;
};

export type FrontendControlProfile = {
  gateMatchers: string[];
  title: string;
  commandBrief: string;
  controls: FrontendControlItem[];
};

const commonControls: FrontendControlItem[] = [
  {
    key: "brand-ui.contrast",
    type: "BRAND_UI",
    title: "OSP palette and contrast",
    targetSurface: "All frontend pages",
    currentRule: "Deep Navy, Ocean Teal, Sun Gold, white headers, readable actions.",
    desiredControl: "Expose UI doctrine as an admin-visible rule set before theme mutation.",
    businessImpact: "Prevents weak, unreadable, or off-brand public and admin screens.",
    status: "CONFIGURABLE_VIEW",
    risk: "MEDIUM",
    primaryAction: "Review UI rule",
    secondaryAction: "Prepare theme contract",
  },
  {
    key: "vps.preflight",
    type: "VPS_PREFLIGHT",
    title: "VPS readiness gate",
    targetSurface: "Deployment readiness",
    currentRule: "Build, browser QA, endpoint health, route behavior, and commit isolation must pass.",
    desiredControl: "Expose launch readiness as a visible command checklist.",
    businessImpact: "Stops unstable mixed-scope work from reaching VPS.",
    status: "CONFIGURABLE_VIEW",
    risk: "HIGH",
    primaryAction: "Review launch gate",
    secondaryAction: "Prepare deployment checklist",
  },
];

export const FRONTEND_CONTROL_PROFILES: FrontendControlProfile[] = [
  {
    gateMatchers: ["settings"],
    title: "System Settings Frontend Control",
    commandBrief:
      "Control navigation, authentication routing, public discovery visibility, feature flags, payment mode labels, brand doctrine, and VPS launch gates from one command surface.",
    controls: [
      {
        key: "settings.navigation.home",
        type: "ROUTE_VISIBILITY",
        title: "Traveler navigation routing",
        targetSurface: "/traveler/home, /traveler/explore, /traveler/trips, /traveler/pass",
        currentRule: "Navigation behavior is controlled by frontend route code and middleware boundaries.",
        desiredControl: "Expose route targets and active/inactive navigation rules as configurable admin intent.",
        businessImpact: "Prevents traveler flows from landing on wrong pages or dead routes.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
        primaryAction: "Map route rule",
        secondaryAction: "Prepare backend setting",
      },
      {
        key: "settings.auth.returning",
        type: "AUTH_REDIRECT",
        title: "Returning login redirect rule",
        targetSurface: "/login and protected traveler/operator/admin routes",
        currentRule: "Role-aware redirects are code-governed and fragile if stale next params leak.",
        desiredControl: "Create visible rules for safe redirect destinations per role.",
        businessImpact: "Stops destructive /traveler/home next-param regressions.",
        status: "LOCKED_FOR_SAFETY",
        risk: "CRITICAL",
        primaryAction: "Lock rule",
        secondaryAction: "Create audit contract",
      },
      {
        key: "settings.flags",
        type: "FEATURE_FLAG",
        title: "Command Center feature flags",
        targetSurface: "Admin command surfaces",
        currentRule: "Feature readiness is controlled by build lanes and frontend registries.",
        desiredControl: "Show module controls as visible, locked, hidden, or backend-ready.",
        businessImpact: "Lets Super Admin see what can be launched safely.",
        status: "CONFIGURABLE_VIEW",
        risk: "MEDIUM",
        primaryAction: "Review flags",
        secondaryAction: "Prepare flag backend",
      },
      ...commonControls,
    ],
  },
  {
    gateMatchers: ["marketplace", "exposure"],
    title: "Marketplace Exposure Frontend Control",
    commandBrief:
      "Control what becomes visible in public discovery: category exposure, operator cards, readiness gates, suppression labels, sponsored slots, and no-flat-list ranking.",
    controls: [
      {
        key: "marketplace.category.visibility",
        type: "CATEGORY_EXPOSURE",
        title: "Category visibility matrix",
        targetSurface: "/traveler/explore and marketplace category pages",
        currentRule: "Categories exist as frontend pages but exposure gating is not centralized.",
        desiredControl: "Control which categories are visible, hidden, launch-ready, or admin-only.",
        businessImpact: "Prevents weak inventory from appearing publicly before readiness.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
        primaryAction: "Map category rule",
        secondaryAction: "Prepare exposure API",
      },
      {
        key: "marketplace.operator.cards",
        type: "CARD_PRESENTATION",
        title: "Operator card presentation",
        targetSurface: "Public operator/service listing cards",
        currentRule: "Cards can render from scattered page logic.",
        desiredControl: "Govern title, media, badges, price labels, readiness labels, and CTA availability.",
        businessImpact: "Improves traveler trust and stops unqualified operator exposure.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
        primaryAction: "Review card rules",
        secondaryAction: "Prepare card schema",
      },
      {
        key: "marketplace.suppression",
        type: "FEATURE_FLAG",
        title: "Suppression and public hiding",
        targetSurface: "Marketplace listings and public discovery modules",
        currentRule: "Suppression is not yet a live admin mutation.",
        desiredControl: "Expose suppress/restore as locked command actions until audit-backed backend exists.",
        businessImpact: "Protects public quality while preserving operator governance.",
        status: "LOCKED_FOR_SAFETY",
        risk: "CRITICAL",
        primaryAction: "Register suppress action",
        secondaryAction: "Build audit mutation later",
      },
      ...commonControls,
    ],
  },
  {
    gateMatchers: ["operator"],
    title: "Operator Frontend Control",
    commandBrief:
      "Control operator-facing and traveler-facing representation: onboarding readiness, public cards, approval labels, service visibility, and commercial exposure boundaries.",
    controls: [
      {
        key: "operators.public-card",
        type: "CARD_PRESENTATION",
        title: "Operator public card rules",
        targetSurface: "Explore, partner tours, stays, rentals, and operator marketplace cards",
        currentRule: "Operator presentation is not yet centrally controlled from Command Center.",
        desiredControl: "Govern public name, photos, accreditation badges, price readiness, and CTA state.",
        businessImpact: "Stops incomplete operator records from damaging public trust.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
        primaryAction: "Map card fields",
        secondaryAction: "Prepare operator read model",
      },
      {
        key: "operators.approval-label",
        type: "FEATURE_FLAG",
        title: "Approval state labels",
        targetSurface: "Admin and public operator surfaces",
        currentRule: "Approval state is not yet an admin-controlled live mutation here.",
        desiredControl: "Show Draft, Review, Approved, Suspended, Hidden, and Exposure Ready states.",
        businessImpact: "Makes operator readiness understandable for admin operations.",
        status: "CONFIGURABLE_VIEW",
        risk: "HIGH",
        primaryAction: "Review state map",
        secondaryAction: "Prepare approval endpoint",
      },
      {
        key: "operators.cta",
        type: "CTA_ROUTING",
        title: "Operator/service CTA routing",
        targetSurface: "Public service cards and detail pages",
        currentRule: "CTA routes can drift between traveler request, booking, payment, or detail pages.",
        desiredControl: "Govern Request, Book, View Details, Ask Kuya Tala™, and Payment CTA routing.",
        businessImpact: "Prevents conversion leaks and dead-end traveler journeys.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
        primaryAction: "Map CTA rule",
        secondaryAction: "Prepare route config",
      },
      ...commonControls,
    ],
  },
  {
    gateMatchers: ["spm", "passport", "trail"],
    title: "SPM / Passport Trails Frontend Control",
    commandBrief:
      "Control public trail pages, stamp rules, hero media, CTA routing, payment blocks, map canvas, discover-more sections, and Kuya Tala™ placement.",
    controls: [
      {
        key: "spm.hero-media",
        type: "HERO_CONTENT",
        title: "Trail hero media and content",
        targetSurface: "Passport Trail detail pages",
        currentRule: "Hero/media blocks are page-level and not admin-configurable yet.",
        desiredControl: "Control video placeholder, photo placeholder, title, subtitle, badges, and route intro.",
        businessImpact: "Makes trail pages commercially presentable and operator-ready.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
        primaryAction: "Map hero fields",
        secondaryAction: "Prepare media contract",
      },
      {
        key: "spm.stamp-rules",
        type: "FEATURE_FLAG",
        title: "Stamp rule display",
        targetSurface: "Trail detail, map journey canvas, stops, and payment states",
        currentRule: "Stamp rules can differ by page but are not centrally configured.",
        desiredControl: "Expose stamp rule sets as admin-visible page rules.",
        businessImpact: "Prevents inconsistent passport gamification logic.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
        primaryAction: "Map stamp rule",
        secondaryAction: "Prepare rule schema",
      },
      {
        key: "spm.cta-routing",
        type: "CTA_ROUTING",
        title: "Trail CTA routing",
        targetSurface: "SPM trail pages and DIY flows",
        currentRule: "CTAs can drift across Explore, Passport Trails, payment, and detail routes.",
        desiredControl: "Control Book, Request, Follow Map, Review Route, Payment, and Discover More CTAs.",
        businessImpact: "Improves conversion and prevents broken trail journeys.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
        primaryAction: "Map CTA matrix",
        secondaryAction: "Prepare CTA config",
      },
      ...commonControls,
    ],
  },
  {
    gateMatchers: ["explore"],
    title: "Explore Frontend Control",
    commandBrief:
      "Control category visibility, homepage modules, public card rules, CTA routing, and source readiness across tours, stays, rentals, surf, food, culture, health, and services.",
    controls: [
      {
        key: "explore.category-grid",
        type: "CATEGORY_EXPOSURE",
        title: "Explore category grid",
        targetSurface: "/traveler/explore",
        currentRule: "Explore categories are visible by page implementation.",
        desiredControl: "Control category order, visibility, launch status, and empty-state behavior.",
        businessImpact: "Makes Explore useful for VPS without exposing weak inventory.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
        primaryAction: "Map category grid",
        secondaryAction: "Prepare category config",
      },
      {
        key: "explore.hero",
        type: "HERO_CONTENT",
        title: "Explore hero and feature blocks",
        targetSurface: "Explore landing and category pages",
        currentRule: "Hero and feature copy are not controlled from Command Center.",
        desiredControl: "Govern hero text, feature cards, image/media placeholders, and CTA blocks.",
        businessImpact: "Stops generic public discovery output.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "MEDIUM",
        primaryAction: "Map content blocks",
        secondaryAction: "Prepare CMS-lite contract",
      },
      {
        key: "explore.cta",
        type: "CTA_ROUTING",
        title: "Explore CTA destinations",
        targetSurface: "Explore category and detail cards",
        currentRule: "CTA destinations can point to mixed traveler/public routes.",
        desiredControl: "Control View, Request, Book, Payment, Ask Assistant, and Save CTAs.",
        businessImpact: "Protects conversion flow and reduces user confusion.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
        primaryAction: "Map CTA rules",
        secondaryAction: "Prepare routing config",
      },
      ...commonControls,
    ],
  },
  {
    gateMatchers: ["payment", "payout", "statement"],
    title: "Payments Frontend Control",
    commandBrief:
      "Control payment labels, mode indicators, receipt states, payout visibility, refund labels, and PayMongo readiness without mutating payment records.",
    controls: [
      {
        key: "payments.mode-label",
        type: "PAYMENT_LABEL",
        title: "Sandbox/live payment label",
        targetSurface: "Traveler payment pages and admin finance pages",
        currentRule: "Payment mode labels are not centrally governed here.",
        desiredControl: "Show sandbox/live readiness, PayMongo status, and payment CTA state as admin-visible controls.",
        businessImpact: "Prevents payment trust failure during MVP.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "CRITICAL",
        primaryAction: "Map payment labels",
        secondaryAction: "Prepare payment mode endpoint",
      },
      {
        key: "payments.receipt-state",
        type: "CARD_PRESENTATION",
        title: "Receipt and payment status presentation",
        targetSurface: "Traveler receipts, payment pages, admin finance cards",
        currentRule: "Receipt labels can drift across pages.",
        desiredControl: "Govern Pending, Paid, Failed, Refunded, Sandbox, and Handoff states.",
        businessImpact: "Makes traveler payment state clear.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "CRITICAL",
        primaryAction: "Map receipt states",
        secondaryAction: "Prepare receipt contract",
      },
      ...commonControls,
    ],
  },
  {
    gateMatchers: ["pricing"],
    title: "Pricing Frontend Control",
    commandBrief:
      "Control how pricing logic appears across traveler totals, operator payouts, platform share, payment processing, OTA fee, FX, and commercial snapshots.",
    controls: [
      {
        key: "pricing.display-breakdown",
        type: "CARD_PRESENTATION",
        title: "Pricing breakdown display",
        targetSurface: "Traveler payment, operator statements, admin pricing cards",
        currentRule: "Pricing display can drift between modules.",
        desiredControl: "Govern field labels and separation of traveler total, platform share, operator payout, FX, and processing.",
        businessImpact: "Protects commercial trust and investor-grade financial clarity.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "CRITICAL",
        primaryAction: "Map pricing fields",
        secondaryAction: "Prepare commercial read model",
      },
      {
        key: "pricing.snapshot-label",
        type: "FEATURE_FLAG",
        title: "Booking pricing snapshot labels",
        targetSurface: "Booking, payment, receipt, and statement views",
        currentRule: "Snapshot truth is doctrine but not centrally visible as a UI control.",
        desiredControl: "Show whether a page displays live estimate or frozen booking snapshot.",
        businessImpact: "Prevents downstream reinterpretation of old bookings.",
        status: "READY_FOR_BACKEND_CONTROL",
        risk: "CRITICAL",
        primaryAction: "Map snapshot rule",
        secondaryAction: "Prepare snapshot contract",
      },
      ...commonControls,
    ],
  },
];

export function findFrontendControlProfile(gateKey: string): FrontendControlProfile {
  const key = gateKey.toLowerCase();
  return (
    FRONTEND_CONTROL_PROFILES.find((profile) =>
      profile.gateMatchers.some((matcher) => key.includes(matcher)),
    ) || {
      gateMatchers: ["default"],
      title: "Frontend UI Control",
      commandBrief:
        "Control the frontend behavior, content, route visibility, and user-facing presentation for this module.",
      controls: [
        {
          key: "default.route-control",
          type: "ROUTE_VISIBILITY",
          title: "Route and UI behavior",
          targetSurface: "Module frontend routes",
          currentRule: "Behavior exists in route/page code.",
          desiredControl: "Expose route, CTA, content, and visibility rules as admin control intent.",
          businessImpact: "Turns this module into a useful frontend control surface.",
          status: "READY_FOR_BACKEND_CONTROL",
          risk: "MEDIUM",
          primaryAction: "Map control",
          secondaryAction: "Prepare backend contract",
        },
        ...commonControls,
      ],
    }
  );
}
