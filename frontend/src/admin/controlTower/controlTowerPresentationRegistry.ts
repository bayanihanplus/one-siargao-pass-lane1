export type PresentationControlState =
  | "ACTIVE_CONTROL_VIEW"
  | "READY_FOR_BACKEND_CONTROL"
  | "LOCKED_FOR_SAFETY"
  | "VPS_PRESENTATION_READY";

export type PresentationRisk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type PresentationCommand = {
  key: string;
  title: string;
  command: string;
  visibleImpact: string;
  lguMeaning: string;
  state: PresentationControlState;
  risk: PresentationRisk;
};

export type PresentationPageProfile = {
  matchers: string[];
  title: string;
  subtitle: string;
  executiveBrief: string;
  proofLine: string;
  commands: PresentationCommand[];
};

const launchControls: PresentationCommand[] = [
  {
    key: "vps.launch-gate",
    title: "VPS launch gate",
    command: "Show build, browser QA, route stability, endpoint health, and commit isolation before launch.",
    visibleImpact: "Prevents unstable traveler-facing pages from going live.",
    lguMeaning: "OSP launch is governed, not experimental.",
    state: "VPS_PRESENTATION_READY",
    risk: "HIGH",
  },
  {
    key: "brand.trust-ui",
    title: "Trust-grade OSP interface",
    command: "Enforce Deep Navy, Ocean Teal, Sun Gold, white headers, readable CTAs, and premium mobile-first pages.",
    visibleImpact: "Keeps traveler screens consistent, official-looking, and readable.",
    lguMeaning: "OSP appears as a serious destination platform, not a generic website.",
    state: "ACTIVE_CONTROL_VIEW",
    risk: "MEDIUM",
  },
];

export const PRESENTATION_PAGE_PROFILES: PresentationPageProfile[] = [
  {
    matchers: ["settings"],
    title: "Traveler Frontend Control Center",
    subtitle: "Govern what travelers see, where they go, and which public routes stay visible.",
    executiveBrief:
      "This is the command page for traveler UI behavior: navigation, protected route boundaries, login redirects, public discovery access, bottom navigation, CTA destinations, payment labels, brand standards, and launch readiness.",
    proofLine:
      "For LGU presentation: this proves OSP can control the traveler-facing island experience from one governed console.",
    commands: [
      {
        key: "settings.traveler-navigation",
        title: "Traveler navigation control",
        command: "Govern Home, Explore, Trips, My Pass, QR, Settings, and public discovery routing.",
        visibleImpact: "Travelers land on the correct screen instead of dead or private pages.",
        lguMeaning: "The traveler journey can be organized and corrected centrally.",
        state: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
      },
      {
        key: "settings.auth-boundary",
        title: "Login and access boundary",
        command: "Protect private traveler/admin/operator pages while keeping approved public discovery pages accessible.",
        visibleImpact: "Prevents wrong redirects and stale login continuation paths.",
        lguMeaning: "Access control is managed, not accidental.",
        state: "LOCKED_FOR_SAFETY",
        risk: "CRITICAL",
      },
      {
        key: "settings.public-discovery",
        title: "Public discovery switchboard",
        command: "Label which traveler discovery pages are public, protected, hidden, or launch-ready.",
        visibleImpact: "Only appropriate tourism pages appear to visitors before login.",
        lguMeaning: "Destination information can be published safely.",
        state: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
      },
      ...launchControls,
    ],
  },
  {
    matchers: ["marketplace", "exposure"],
    title: "Marketplace Exposure Control",
    subtitle: "Control what operators, services, categories, and listings can appear publicly.",
    executiveBrief:
      "This page governs public exposure quality: category visibility, listing readiness, operator card rules, suppression, ranking/fairness logic, and anti-bypass controls.",
    proofLine:
      "For LGU presentation: this proves OSP prevents unqualified or incomplete tourism supply from appearing to travelers.",
    commands: [
      {
        key: "marketplace.category-control",
        title: "Category visibility command",
        command: "Control Tours, Stays, Rentals, Surf, Food & Culture, Health, Services, and future categories by readiness.",
        visibleImpact: "Empty or weak categories can stay hidden until ready.",
        lguMeaning: "The island marketplace can launch responsibly by category.",
        state: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
      },
      {
        key: "marketplace.operator-card",
        title: "Public listing card control",
        command: "Govern photos, badges, price labels, accreditation indicators, CTA state, and exposure readiness.",
        visibleImpact: "Travelers see professional, verified-looking listings instead of raw database records.",
        lguMeaning: "Public tourism presentation quality is governed.",
        state: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
      },
      {
        key: "marketplace.suppression",
        title: "Suppress / restore exposure",
        command: "Prepare hide, suppress, restore, and review actions as locked audit-backed controls.",
        visibleImpact: "Unsafe or unready listings can be removed from public view.",
        lguMeaning: "OSP can protect destination reputation.",
        state: "LOCKED_FOR_SAFETY",
        risk: "CRITICAL",
      },
      {
        key: "marketplace.no-flat-list",
        title: "No random operator exposure",
        command: "Reject flat directories; use readiness, category fit, fairness, and risk suppression.",
        visibleImpact: "Qualified operators get chances without damaging traveler trust.",
        lguMeaning: "Exposure is fair but controlled.",
        state: "ACTIVE_CONTROL_VIEW",
        risk: "HIGH",
      },
      ...launchControls,
    ],
  },
  {
    matchers: ["operator"],
    title: "Operator Governance Control",
    subtitle: "Govern operator readiness before they become visible to travelers.",
    executiveBrief:
      "This page controls operator presentation readiness: profile completeness, service readiness, accreditation labels, pricing/media checks, exposure eligibility, and approval/suspension states.",
    proofLine:
      "For LGU presentation: this proves operators are not automatically published just because they registered.",
    commands: [
      {
        key: "operator.readiness-ladder",
        title: "Operator readiness ladder",
        command: "Show Draft, In Review, Approved, Exposure Ready, Hidden, and Suspended states.",
        visibleImpact: "Admin can identify why an operator is or is not ready.",
        lguMeaning: "Operator onboarding is structured and accountable.",
        state: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
      },
      {
        key: "operator.public-card",
        title: "Operator card governance",
        command: "Control public name, photos, accreditation badges, price readiness, inclusion labels, and CTA state.",
        visibleImpact: "Incomplete operator records do not appear as finished public products.",
        lguMeaning: "Local operators are presented professionally.",
        state: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
      },
      {
        key: "operator.approval-safety",
        title: "Approval / suspension safety",
        command: "Register approve, suspend, reopen, and hide actions as audit-backed backend controls.",
        visibleImpact: "No unsafe click can mutate operator state without governance.",
        lguMeaning: "Administrative control has accountability.",
        state: "LOCKED_FOR_SAFETY",
        risk: "CRITICAL",
      },
      ...launchControls,
    ],
  },
  {
    matchers: ["spm", "passport", "trail"],
    title: "Passport Trails Frontend Control",
    subtitle: "Control trail pages, map journeys, stamp rules, media blocks, payment blocks, and Kuya Tala placement.",
    executiveBrief:
      "This page governs the public Passport Trails experience: trail hero, video/photo placeholders, map journey canvas, Surf Ready state, payment blocks, trail stops, stamp rules, Discover More, and Kuya Tala guidance.",
    proofLine:
      "For LGU presentation: this proves OSP can govern curated destination journeys, not only publish static pages.",
    commands: [
      {
        key: "spm.trail-hero-media",
        title: "Trail hero and media control",
        command: "Control video placeholder, photo placeholder, title, badges, route summary, and hero CTA.",
        visibleImpact: "Trail pages become professionally presentable for travelers.",
        lguMeaning: "Official or curated journeys can be presented consistently.",
        state: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
      },
      {
        key: "spm.stamp-rules",
        title: "Stamp rules command",
        command: "Assign different stamp rules per page, stop, trail, or journey type.",
        visibleImpact: "Passport gamification becomes governed, not scattered.",
        lguMeaning: "Tourism engagement can be structured and measured.",
        state: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
      },
      {
        key: "spm.map-payment-flow",
        title: "Map and payment flow control",
        command: "Govern map journey canvas, trail stops, payment block, and post-payment trail readiness.",
        visibleImpact: "Travelers understand the journey before and after payment.",
        lguMeaning: "OSP links discovery, movement, and payment into one managed journey.",
        state: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
      },
      {
        key: "spm.kuya-tala-placement",
        title: "Kuya Tala™ guidance placement",
        command: "Control where the AI guide appears and what approved knowledge it can explain.",
        visibleImpact: "Travelers get contextual help without hallucinated claims.",
        lguMeaning: "AI support can be governed and safe.",
        state: "LOCKED_FOR_SAFETY",
        risk: "HIGH",
      },
      ...launchControls,
    ],
  },
  {
    matchers: ["explore"],
    title: "Explore Siargao Frontend Control",
    subtitle: "Control public discovery categories, homepage modules, cards, and CTA destinations.",
    executiveBrief:
      "This page governs Explore: category order, launch visibility, hero/feature blocks, card presentation, public/private route boundaries, and CTA destinations across tours, stays, rentals, surf, food, culture, and services.",
    proofLine:
      "For LGU presentation: this proves OSP can organize traveler discovery without exposing unready supply.",
    commands: [
      {
        key: "explore.category-grid",
        title: "Explore category grid control",
        command: "Control category order, visibility, launch state, and empty-state behavior.",
        visibleImpact: "The public Explore page can launch only with quality-ready categories.",
        lguMeaning: "Traveler discovery can be phased and governed.",
        state: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
      },
      {
        key: "explore.hero-content",
        title: "Explore hero and feature content",
        command: "Control hero copy, feature cards, image placeholders, CTAs, and priority modules.",
        visibleImpact: "The public page looks intentional, not generic.",
        lguMeaning: "Official destination messaging can be managed.",
        state: "READY_FOR_BACKEND_CONTROL",
        risk: "MEDIUM",
      },
      {
        key: "explore.cta-routing",
        title: "Discovery CTA routing",
        command: "Control View, Request, Book, Pay, Save, Ask Kuya Tala, and Review Route destinations.",
        visibleImpact: "Travelers move through a clear conversion journey.",
        lguMeaning: "OSP can reduce confusion and organize tourism actions.",
        state: "READY_FOR_BACKEND_CONTROL",
        risk: "HIGH",
      },
      ...launchControls,
    ],
  },
];

export function findPresentationPageProfile(gateKey: string): PresentationPageProfile {
  const key = gateKey.toLowerCase();
  return (
    PRESENTATION_PAGE_PROFILES.find((profile) =>
      profile.matchers.some((matcher) => key.includes(matcher)),
    ) || {
      matchers: ["default"],
      title: "Frontend Control Surface",
      subtitle: "Govern traveler-facing UI behavior, visibility, content, and route logic.",
      executiveBrief:
        "This page defines what the Command Center can control for this frontend surface: route behavior, public visibility, CTA routing, content blocks, and launch safety.",
      proofLine:
        "For LGU presentation: this proves OSP has controlled frontend governance instead of scattered page edits.",
      commands: [
        {
          key: "default.ui-control",
          title: "Frontend behavior control",
          command: "Map route visibility, CTA behavior, content blocks, and public presentation rules.",
          visibleImpact: "Traveler-facing UI becomes governed.",
          lguMeaning: "OSP can manage the public digital experience.",
          state: "READY_FOR_BACKEND_CONTROL",
          risk: "MEDIUM",
        },
        ...launchControls,
      ],
    }
  );
}
