import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";
import { getTravelerLanguageRuntime, tr } from "../../../src/lib/traveler-language-runtime";

type TravelerDictionary = Record<string, string>;

const premiumTapStyle = {
  WebkitTapHighlightColor: "transparent",
  touchAction: "manipulation",
  transition:
    "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease, color 160ms ease",
} as const;

const premiumFocusRing = {
  outline: "2px solid rgba(243,174,38,0.42)",
  outlineOffset: 2,
} as const;

const premiumCardShadow = {
  primary: "0 16px 36px rgba(1,56,99,0.14)",
  medium: "0 12px 26px rgba(1,56,99,0.10)",
  soft: "0 8px 18px rgba(1,56,99,0.065)",
  flat: "0 6px 14px rgba(1,56,99,0.045)",
} as const;

const softCardSurfaces = {
  aqua: "linear-gradient(135deg, #EAFBFA 0%, #FFFFFF 100%)",
  sand: "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)",
  blue: "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)",
  pearl: "linear-gradient(135deg, #F8FBFD 0%, #FFFFFF 100%)",
  gold: "linear-gradient(135deg, #FFF8E6 0%, #FFFFFF 100%)",
  mist: "linear-gradient(135deg, #F4FCFA 0%, #FFFFFF 100%)",
} as const;


type ExploreLane = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  tone: "teal" | "sand" | "mint" | "sky";
  icon: string;
};

type FeaturedService = {
  routeProductCode?: string;
  portCode?: string;
  pricingMode?: string;
  feeDoctrine?: string;
  dcsStatusLabel?: string;
  paymentPathLabel?: string;
  slug?: string;
  category: string;
  title: string;
  titleKey?: string;
  body: string;
  price: string;
  href: string;
  tags: string[];
  tone: "ocean" | "trail" | "surf";
  sourceLabel?: string;
  visualBackground?: string;
  mediaUrl?: string | null;
  mediaTruth?: string;
  operatorLabel?: string;
  availabilityLabel?: string;
  urgencyLabel?: string;
  bookingModeLabel?: string;
  pricingReady?: boolean;
  ctaLabel?: string;
};

type MarketplaceService = {
  slug?: string;
  id?: string;
  sourceType?: string;
  sourceId?: string;
  title?: string;
  shortDescription?: string;
  category?: string;
  price?: {
    priceMode?: string;
    displayPrice?: string;
    currencyCode?: string;
    pricingReady?: boolean;
  };
  availability?: {
    status?: string;
    label?: string;
    urgencyLabel?: string;
    calendarStatus?: string;
  };
  operator?: {
    displayName?: string;
    verificationStatus?: string;
  };
  governance?: {
    marketplaceVisible?: boolean;
    approvalStatus?: string;
    requiresClearance?: boolean;
    requiresManifest?: boolean;
    qrValidationRequired?: boolean;
    stampEligible?: boolean;
    passportTrailEligible?: boolean;
  };
  booking?: {
    ctaMode?: string;
    bookingMode?: string;
    instantCheckoutAllowed?: boolean;
    paymentExecutionIncluded?: boolean;
  };
  commercialBadges?: string[];
  badges?: string[];
  media?: {
    heroImageUrl?: string | null;
    imageUrl?: string | null;
    thumbnailUrl?: string | null;
    gallery?: string[];
    mediaStatus?: string;
    fallbackGradient?: string;
    icon?: string;
    imageIntent?: string;
    visualTruth?: string;
  };
};

type MarketplacePayload = {
  ok?: boolean;
  mode?: string;
  services?: MarketplaceService[];
  counts?: {
    total?: number;
    spmPackages?: number;
    operatorActivities?: number;
  };
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:8001/api/v1";

const LOCKED_TOUR_POSTER_BY_SLUG: Record<string, string> = {
  "tri-island-joiner": "/osp/temp-tour-posters/tri-island-joiner.png",
  "private-diy-land-tour": "/osp/temp-tour-posters/private-diy-land-tour.png",
  "bucas-grande-sohoton-tour": "/osp/temp-tour-posters/bucas-grande-sohoton-tour.png",
  "sugba-lagoon-mangrove-tours": "/osp/temp-tour-posters/sugba-lagoon-mangrove-tours.png",
};

function getFeaturedServiceCardHref(service: FeaturedService) {
  if (service.href === "/traveler/site-access/cloud-9") return service.href;

  if (service.slug && LOCKED_TOUR_POSTER_BY_SLUG[service.slug]) {
    return `/traveler/explore/tours/${service.slug}`;
  }

  return service.href;
}

function getFeaturedServiceCardMediaUrl(service: FeaturedService) {
  if (service.slug && LOCKED_TOUR_POSTER_BY_SLUG[service.slug]) {
    return LOCKED_TOUR_POSTER_BY_SLUG[service.slug];
  }

  return service.mediaUrl || null;
}

function getFeaturedServiceCardCta(service: FeaturedService) {
  if (service.slug && LOCKED_TOUR_POSTER_BY_SLUG[service.slug]) {
    return service.ctaLabel || "View Trip Options";
  }

  return service.ctaLabel || "View details";
}


const LOCKED_FEATURED_VERIFIED_ROUTE_CARDS: FeaturedService[] = [
  {
    slug: "general-luna-island-hopping",
    category: "Island Hopping",
    title: "General Luna Island Hopping",
    body: "Official island routes from General Luna.",
    price: "Trip options",
    href: "/traveler/explore/tours/general-luna-island-hopping",
    tags: ["General Luna Port", "Island routes", "Voucher path"],
    tone: "ocean",
    sourceLabel: "Verified route gateway",
    mediaUrl: "/osp/temp-tour-posters/tri-island-joiner.png",
    mediaTruth: "Installed OSP route poster",
    operatorLabel: "Approved local fulfillment",
    availabilityLabel: "Choose route",
    urgencyLabel: "Clear port + fees",
    bookingModeLabel: "View Trip Options",
    pricingReady: false,
    ctaLabel: "View Trip Options",
    routeProductCode: "GENERAL_LUNA_ROUTE_GROUP",
    portCode: "GENERAL_LUNA_PORT",
    pricingMode: "Route options before payment",
    feeDoctrine: "Fees shown before checkout",
    dcsStatusLabel: "Voucher and boarding path after payment",
    paymentPathLabel: "Review route before payment",
  },
  {
    slug: "sugba-lagoon-mangrove-tours",
    category: "Lagoon & Mangrove",
    title: "Del Carmen Lagoon & Mangrove Trips",
    body: "Explore Sugba Lagoon, Kawhagan, Pamomoan, and Mangrove route options with published route pricing.",
    price: "Route options",
    href: "/traveler/explore/tours/sugba-lagoon-mangrove-tours",
    tags: ["Del Carmen", "Sugba Lagoon", "Mangrove routes"],
    tone: "surf",
    sourceLabel: "Verified route gateway",
    mediaUrl: "/osp/temp-tour-posters/sugba-lagoon-mangrove-tours.png",
    mediaTruth: "Installed OSP route poster",
    operatorLabel: "Del Carmen route context",
    availabilityLabel: "Choose route",
    urgencyLabel: "Published route prices",
    bookingModeLabel: "View Trip Options",
    pricingReady: false,
    ctaLabel: "View Trip Options",
    routeProductCode: "DEL_CARMEN_ROUTE_GROUP",
    portCode: "DEL_CARMEN_PORT",
    pricingMode: "Published route price + entrance fee",
    feeDoctrine: "Entrance fee shown before checkout",
    dcsStatusLabel: "Route product selection",
    paymentPathLabel: "Review route before payment",
  },
  {
    slug: "bucas-grande-sohoton-tour",
    category: "Dapa / Socorro",
    title: "Bucas Grande & Sohoton Trips",
    body: "Discover Bucas Grande and Sohoton trip options with request-to-confirm handling before payment.",
    price: "Request first",
    href: "/traveler/explore/tours/bucas-grande-sohoton-tour",
    tags: ["Dapa Port", "Sohoton", "Request first"],
    tone: "trail",
    sourceLabel: "Verified route gateway",
    mediaUrl: "/osp/temp-tour-posters/bucas-grande-sohoton-tour.png",
    mediaTruth: "Installed OSP route poster",
    operatorLabel: "Dapa / Socorro route context",
    availabilityLabel: "Request first",
    urgencyLabel: "Confirmed before payment",
    bookingModeLabel: "View Trip Options",
    pricingReady: false,
    ctaLabel: "View Trip Options",
    routeProductCode: "BUCAS_SOHOTON_ROUTE_GROUP",
    portCode: "DAPA_PORT",
    pricingMode: "Request-to-confirm",
    feeDoctrine: "Entrance fee and base price confirmed before checkout",
    dcsStatusLabel: "Route confirmation first",
    paymentPathLabel: "Request confirmation before payment",
  },
  {
    slug: "private-siargao-land-route",
    category: "Private Land Route",
    title: "Private Siargao Land Route",
    body: "Build a flexible land route with driver coordination, scenic stops, and confirmed inclusions before checkout.",
    price: "Request first",
    href: "/traveler/explore/tours/private-siargao-land-route",
    tags: ["Land route", "Driver support", "Confirmed inclusions"],
    tone: "trail",
    sourceLabel: "Verified route gateway",
    mediaUrl: "/osp/temp-tour-posters/private-diy-land-tour.png",
    mediaTruth: "Installed OSP route poster",
    operatorLabel: "Local route operator",
    availabilityLabel: "Request first",
    urgencyLabel: "Land route only",
    bookingModeLabel: "Review Route Options",
    pricingReady: false,
    ctaLabel: "Review Route Options",
    routeProductCode: "PRIVATE_SIARGAO_LAND_ROUTE",
    portCode: "LAND_ROUTE",
    pricingMode: "Request-to-confirm land route",
    feeDoctrine: "Transport and stop fees confirmed before checkout",
    dcsStatusLabel: "Not boat-class DCS",
    paymentPathLabel: "Request confirmation before payment",
  },
];

function getFeaturedVerifiedServicesForDisplay(services: FeaturedService[]) {
  const lockedSlugs = new Set(LOCKED_FEATURED_VERIFIED_ROUTE_CARDS.map((item) => item.slug));
  const extraServices = services.filter((item) => !item.slug || !lockedSlugs.has(item.slug)).slice(0, 0);

  return [...LOCKED_FEATURED_VERIFIED_ROUTE_CARDS, ...extraServices].slice(0, 4);
}

function getFeaturedServiceCardPrice(service: FeaturedService) {
  if (service.slug === "tri-island-joiner") return "Boat class + fees";
  if (service.slug === "bucas-grande-sohoton-tour") return "Request to confirm";
  if (service.slug === "sugba-lagoon-mangrove-tours") return "From PHP 2,650 + fees";
  if (service.slug === "private-diy-land-tour") return "Request to confirm";

  return service.price;
}


function normalizeDiscoveryLaneTone(value?: string): FeaturedService["tone"] {
  if (value === "trail" || value === "surf" || value === "ocean") return value;
  return "ocean";
}

function mapDiscoveryLaneToFeatured(lane: DiscoveryLane): FeaturedService {
  const serviceCount = Number(lane.serviceCount || 0);
  const live = serviceCount > 0 || lane.readinessStatus === "LIVE";

  return {
    category: lane.title,
    title: lane.title,
    body:
      lane.body ||
      "Trusted discovery lane for traveler-ready services.",
    price: live ? `${serviceCount} ready service${serviceCount === 1 ? "" : "s"}` : "Coming online",
    href: lane.href,
    tags: lane.tags && lane.tags.length ? lane.tags : live ? ["Live", "Verified"] : ["Lane ready", "Awaiting supply"],
    tone: normalizeDiscoveryLaneTone(lane.tone),
    sourceLabel: live ? "Live lane" : "Discovery lane",
    visualBackground: lane.fallbackGradient || undefined,
    mediaUrl: lane.featuredImageUrl || null,
    mediaTruth: lane.mediaStatus || lane.readinessStatus || undefined,
    operatorLabel: live ? `${serviceCount} operator-backed service${serviceCount === 1 ? "" : "s"}` : "Operator lane ready",
    availabilityLabel: live ? "Live supply" : "Awaiting approved supply",
    urgencyLabel: lane.source || "MARKETPLACE_EXPOSURE_READY",
    bookingModeLabel: live ? "Browse lane" : "Coming online",
    pricingReady: false,
    ctaLabel: lane.ctaLabel || "Explore",
  };
}

async function getDiscoveryLaneServices(): Promise<FeaturedService[]> {
  try {
    const res = await fetch(`${API_BASE}/traveler/marketplace/discovery-lanes`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return [];

    const payload: DiscoveryLanesPayload = await res.json();
    const lanes = Array.isArray(payload?.lanes) ? payload.lanes : [];

    return lanes
      .filter((lane) => lane?.title && lane?.href)
      .slice(0, 5)
      .map(mapDiscoveryLaneToFeatured);
  } catch {
    return [];
  }
}

async function getMarketplaceServices(): Promise<MarketplacePayload> {
  try {
    const res = await fetch(`${API_BASE}/traveler/marketplace/services?limit=10`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        ok: false,
        mode: "MARKETPLACE_BACKEND_ERROR",
        services: [],
      };
    }

    return await res.json();
  } catch {
    return {
      ok: false,
      mode: "MARKETPLACE_BACKEND_UNAVAILABLE",
      services: [],
    };
  }
}

type DiscoveryLane = {
  laneKey: string;
  title: string;
  body?: string;
  href: string;
  serviceCount?: number;
  featuredImageUrl?: string | null;
  fallbackGradient?: string | null;
  readinessStatus?: string;
  source?: string;
  mediaStatus?: string;
  ctaLabel?: string;
  tags?: string[];
  tone?: FeaturedService["tone"];
};

type DiscoveryLanesPayload = {
  ok?: boolean;
  mode?: string;
  lanes?: DiscoveryLane[];
};

function formatMarketplaceCategory(category?: string) {
  if (!category) return "Verified Service";

  return String(category)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function getFeaturedServiceTone(service: MarketplaceService): FeaturedService["tone"] {
  const category = String(service.category || "").toUpperCase();

  if (category.includes("SURF")) return "surf";
  if (service.governance?.passportTrailEligible || service.sourceType === "SPM_TRAIL_PACKAGE") return "trail";

  return "ocean";
}

function getFeaturedServiceTags(service: MarketplaceService) {
  const tags = [
    service.governance?.qrValidationRequired ? "QR-ready" : null,
    service.governance?.passportTrailEligible ? "Passport eligible" : null,
    service.governance?.requiresClearance ? "Clearance-aware" : null,
    service.governance?.marketplaceVisible ? "Verified" : null,
  ].filter(Boolean) as string[];

  const fallbackTags = (service.badges || service.commercialBadges || [])
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => String(item));

  return tags.length > 0 ? tags.slice(0, 3) : fallbackTags.length > 0 ? fallbackTags : ["Verified"];
}

function getMarketplaceMediaUrl(service: MarketplaceService) {
  return (
    service.media?.heroImageUrl ||
    service.media?.imageUrl ||
    service.media?.thumbnailUrl ||
    service.media?.gallery?.[0] ||
    null
  );
}

function formatBookingModeLabel(mode?: string) {
  const value = String(mode || "").trim().toUpperCase();

  if (value === "REGULATED_REQUEST") return "Regulated request";
  if (value === "REQUEST_TO_CONFIRM") return "Request to confirm";
  if (value === "INSTANT_BOOKING") return "Instant booking";

  return "View details";
}

function getFeaturedCtaLabel(service: MarketplaceService) {
  const ctaMode = String(service.booking?.ctaMode || "").toUpperCase();

  if (ctaMode === "START_ISLAND_HOPPING_REQUEST") return "View regulated details";
  if (ctaMode === "REQUEST_AVAILABILITY") return "Request availability";
  if (ctaMode === "ADD_TO_TRAIL") return "Add to trail";

  return "View details";
}

function getGovernanceSummary(service: MarketplaceService) {
  if (service.governance?.requiresClearance) return "Clearance-aware";
  if (service.governance?.passportTrailEligible) return "Passport Trail eligible";
  if (service.governance?.qrValidationRequired) return "QR-ready";

  return "Verified";
}

function mapMarketplaceServiceToFeatured(service: MarketplaceService): FeaturedService {
  return {
    slug: service.slug,
    category: formatMarketplaceCategory(service.category),
    title: service.title || "Verified Siargao Experience",
    body:
      service.shortDescription ||
      service.operator?.displayName ||
      "Traveler-safe experience from the governed OSP marketplace catalog.",
    price: service.price?.displayPrice || "Request to confirm",
    href: "/traveler/explore/tours",
    tags: getFeaturedServiceTags(service),
    tone: getFeaturedServiceTone(service),
    sourceLabel: "Live marketplace",
    visualBackground: service.media?.fallbackGradient,
    mediaUrl: getMarketplaceMediaUrl(service),
    mediaTruth: service.media?.visualTruth || service.media?.mediaStatus || undefined,
    operatorLabel: service.operator?.displayName || "Approved local partner required",
    availabilityLabel: service.availability?.label || "Request-ready",
    urgencyLabel: service.availability?.urgencyLabel || getGovernanceSummary(service),
    bookingModeLabel: formatBookingModeLabel(service.booking?.bookingMode),
    pricingReady: service.price?.pricingReady === true,
    ctaLabel: getFeaturedCtaLabel(service),
  };
}

const lanes: ExploreLane[] = [
  {
    eyebrow: "Places to stay",
    title: "Stay in Siargao",
    body: "Hotels, villas, hostels, and guesthouses.",
    href: "/traveler/explore/stays",
    cta: "Explore",
    tone: "teal",
    icon: "🏝️",
  },
  {
    eyebrow: "Official route layer",
    title: "Official Passport Trails",
    body: "Curated trails, stops, and progress.",
    href: "/traveler/passport-trails",
    cta: "Explore",
    tone: "sand",
    icon: "🧭",
  },
  {
    eyebrow: "Flexible planning",
    title: "Build Your Own Trail",
    body: "Build a route around your stops.",
    href: "/traveler/passport-trails/diy-trail-builder",
    cta: "Explore",
    tone: "mint",
    icon: "✨",
  },
  {
    eyebrow: "Food and local discovery",
    title: "Food & Local Spots",
    body: "Food, culture, and island stops.",
    href: "/traveler/explore/food-culture",
    cta: "Explore",
    tone: "sky",
    icon: "🍽️",
  },
];

const fallbackFeaturedServices: FeaturedService[] = [
  {
    category: "LGU Site Access",
    title: "Cloud 9 Site Access",
    body: "Confirm the ₱100 LGU entrance fee and attach access to your official Traveler QR.",
    price: "₱100 LGU fee",
    href: "/traveler/site-access/cloud-9",
    tags: ["Official Traveler QR", "One-use access", "LGU validation"],
    tone: "ocean",
    sourceLabel: "Site access",
    mediaTruth: "LGU_SITE_ACCESS",
    operatorLabel: "General Luna LGU",
    availabilityLabel: "Access-ready",
    urgencyLabel: "Gate validation",
    bookingModeLabel: "Access intent",
    pricingReady: true,
    ctaLabel: "Open access",
  },
  {
    category: "Tour Operators",
    title: "Siargao Tour Operators",
    body: "Approved local tour operators for island hopping, land tours, culture routes, and custom Siargao experiences.",
    price: "Request to confirm",
    href: "/traveler/explore/tours",
    tags: ["Approved operators", "Governed exposure"],
    tone: "ocean",
    sourceLabel: "Discovery lane",
    mediaTruth: "PREVIEW_VISUAL",
    operatorLabel: "Verified operator lane",
    availabilityLabel: "Request-ready",
    urgencyLabel: "Operator readiness",
    bookingModeLabel: "Request to confirm",
    pricingReady: false,
    ctaLabel: "Explore",
  },
  {
    category: "Rentals",
    title: "Rentals",
    body: "Scooters, motorbikes, cars, vans, surfboards, gear, and island equipment after provider readiness checks.",
    price: "Check availability",
    href: "/traveler/explore/rentals",
    tags: ["Deposit aware", "Policy required"],
    tone: "trail",
    sourceLabel: "Discovery lane",
    mediaTruth: "PREVIEW_VISUAL",
    operatorLabel: "Verified rental lane",
    availabilityLabel: "Availability required",
    urgencyLabel: "Policy readiness",
    bookingModeLabel: "Check availability",
    pricingReady: false,
    ctaLabel: "Explore",
  },
  {
    category: "Surf Schools",
    title: "Surfing Schools",
    body: "Surf schools, instructors, beginner lessons, guided sessions, and board inclusion details when verified.",
    price: "Request session",
    href: "/traveler/explore/surf-schools",
    tags: ["Instructor-ready", "Safety notes"],
    tone: "surf",
    sourceLabel: "Discovery lane",
    mediaTruth: "PREVIEW_VISUAL",
    operatorLabel: "Verified surf lane",
    availabilityLabel: "Request-ready",
    urgencyLabel: "Lesson readiness",
    bookingModeLabel: "Request session",
    pricingReady: false,
    ctaLabel: "Explore",
  },
  {
    category: "Food & Culture",
    title: "Food & Culture",
    body: "Cafés, restaurants, local food, and curated island stops.",
    price: "View spots",
    href: "/traveler/explore/food-culture",
    tags: ["Curated", "Local discovery"],
    tone: "trail",
    sourceLabel: "Discovery lane",
    mediaTruth: "PREVIEW_VISUAL",
    operatorLabel: "Curated discovery lane",
    availabilityLabel: "Discovery-ready",
    urgencyLabel: "Curation required",
    bookingModeLabel: "Discovery only",
    pricingReady: false,
    ctaLabel: "Explore",
  },
  {
    category: "Beauty & Health",
    title: "Beauty & Health",
    body: "Massage, salons, wellness, clinics, and traveler services only after stronger verification and clear presentation checks.",
    price: "Request appointment",
    href: "/traveler/explore/beauty-health",
    tags: ["Verified services", "Careful listing"],
    tone: "ocean",
    sourceLabel: "Discovery lane",
    mediaTruth: "PREVIEW_VISUAL",
    operatorLabel: "Verified services lane",
    availabilityLabel: "Appointment-ready",
    urgencyLabel: "Verification required",
    bookingModeLabel: "Request appointment",
    pricingReady: false,
    ctaLabel: "Explore",
  },
];

const categories = [
  { label: "Siargao Tour Operators", href: "/traveler/explore/stays", icon: "🚐" },
  { label: "Rentals", href: "/traveler/explore/rentals", icon: "🛵" },
  { label: "Surfing Schools", href: "/traveler/explore/surf-schools", icon: "🏄" },
  { label: "Food & Culture", href: "/traveler/explore/stays", icon: "🍽️" },
  { label: "Beauty & Health", href: "/traveler/explore/stays", icon: "🌿" },
];

function toneStyles(tone: ExploreLane["tone"]) {
  if (tone === "teal") {
    return {
      background:
        "radial-gradient(circle at 18% 0%, rgba(56, 189, 189, 0.10), transparent 34%), linear-gradient(135deg, #f4fffe, #eefbfc)",
      border: "1px solid rgba(8, 145, 178, 0.13)",
      title: "#225766",
      body: "#5d7780",
      eyebrow: "#5c99a4",
      ctaBg: "#4aa8b3",
      ctaColor: "#ffffff",
    };
  }

  if (tone === "sand") {
    return {
      background: "linear-gradient(135deg, #fff7ed, #fffaf2)",
      border: "1px solid rgba(217, 119, 6, 0.18)",
      title: "#7c3f10",
      body: "#71533a",
      eyebrow: "#b45309",
      ctaBg: "#b87518",
      ctaColor: "#ffffff",
    };
  }

  if (tone === "mint") {
    return {
      background: "linear-gradient(135deg, #f0fdf4, #f7fee7)",
      border: "1px solid rgba(34, 197, 94, 0.18)",
      title: "#2f5f2f",
      body: "#527052",
      eyebrow: "#3f8f3f",
      ctaBg: "#3f7f34",
      ctaColor: "#ffffff",
    };
  }

  return {
    background: "linear-gradient(135deg, #eef7ff, #f6fbff)",
    border: "1px solid rgba(14, 116, 144, 0.18)",
    title: "#0b3768",
    body: "#58708d",
    eyebrow: "#078da0",
    ctaBg: "#078da0",
    ctaColor: "#ffffff",
  };
}

function serviceTone(tone: FeaturedService["tone"]) {
  if (tone === "trail") return "linear-gradient(135deg, #d1fae5, #fef3c7)";
  if (tone === "surf") return "linear-gradient(135deg, #bae6fd, #dbeafe)";
  return "linear-gradient(135deg, #0e7490, #22d3ee)";
}



type ExploreSearchParams = {
  q?: string;
  category?: string;
};

const filterOptions = [
  { label: "All", value: "ALL", dictionaryKey: "explore.filters.all" },
  { label: "Stays", value: "STAYS", dictionaryKey: "explore.filters.stays" },
  { label: "Tours", value: "TOURS", dictionaryKey: "explore.filters.tours" },
  { label: "Rentals", href: "/traveler/explore/rentals", value: "RENTALS", dictionaryKey: "explore.filters.rentals" },
  { label: "Surf", value: "SURF", dictionaryKey: "explore.filters.surf" },
  { label: "Food", value: "FOOD_CULTURE", dictionaryKey: "explore.filters.food" },
  { label: "Health", value: "BEAUTY_HEALTH", dictionaryKey: "explore.filters.health" },
];

function normalizeSearchValue(value?: string | string[]) {
  if (Array.isArray(value)) return String(value[0] || "").trim();
  return String(value || "").trim();
}

function normalizeFilterCategory(value?: string | string[]) {
  const raw = normalizeSearchValue(value).toUpperCase();
  return raw || "ALL";
}

function getFilteredMarketplaceServices(
  services: MarketplaceService[],
  input: { q: string; category: string },
) {
  const q = input.q.trim().toLowerCase();
  const category = input.category.trim().toUpperCase();

  return services.filter((service) => {
    const serviceCategory = String(service.category || "").toUpperCase();
    const title = String(service.title || "");
    const description = String(service.shortDescription || "");
    const operator = String(service.operator?.displayName || "");
    const badges = [...(service.badges || []), ...(service.commercialBadges || [])].join(" ");

    const haystack = [title, description, operator, serviceCategory, badges]
      .join(" ")
      .toLowerCase();

    const categoryMatch =
      category === "ALL" ||
      serviceCategory === category ||
      (category === "PASSPORT_TRAILS" && service.governance?.passportTrailEligible === true) ||
      (category === "PARTNER_TOURS" && (service.sourceType === "OPERATOR_ACTIVITY" || service.sourceType === "SPM_TRAIL_PACKAGE")) ||
      (category === "SURF" && haystack.includes("surf"));

    const searchMatch = !q || haystack.includes(q);

    return categoryMatch && searchMatch;
  });
}

function buildExploreFilterHref(params: { q?: string; category?: string }) {
  const qp = new URLSearchParams();

  if (params.q) qp.set("q", params.q);
  if (params.category && params.category !== "ALL") qp.set("category", params.category);

  const query = qp.toString();
  return query ? `/traveler/explore?${query}` : "/traveler/explore";
}


function compactFeaturedText(value: string, max = 42) {
  const clean = String(value || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

function Header({ dictionary }: { dictionary: TravelerDictionary }) {
  return (
    <header style={{ display: "grid", gap: 10 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "44px 1fr 44px",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Link
          href="/traveler/home"
          aria-label="Back to traveler home"
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: "#ffffff",
            border: "1px solid rgba(1,56,99,0.10)",
            color: "#013863",
            textDecoration: "none",
            boxShadow: premiumCardShadow.soft,
            fontSize: 20,
            fontWeight: 950,
            ...premiumTapStyle,
          }}
        >
          ‹
        </Link>

        <div style={{ minWidth: 0, textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              color: "#0596A5",
              fontSize: 9.4,
              fontWeight: 950,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            One Siargao Pass
          </p>
          <h1
            style={{
              margin: "2px 0 0",
              color: "#013863",
              fontSize: 22,
              lineHeight: 1,
              letterSpacing: "-0.045em",
              fontWeight: 950,
            }}
          >
            {tr(dictionary, "explore.header.title", "Explore Siargao")}
          </h1>
        </div>

        <div
          aria-label="One Siargao Pass badge"
          style={{
            width: 44,
            height: 44,
            borderRadius: 16,
            display: "grid",
            placeItems: "center",
            background: "#ffffff",
            border: "1px solid rgba(5,150,165,0.14)",
            boxShadow: premiumCardShadow.soft,
            overflow: "hidden",
          }}
        >
          <img
            src="/osp/osp-logo.png"
            alt="One Siargao Pass"
            style={{ width: 32, height: 32, objectFit: "contain", display: "block" }}
          />
        </div>
      </div>

      <p
        style={{
          margin: 0,
          color: "#50668B",
          fontSize: 12.2,
          lineHeight: 1.25,
          fontWeight: 780,
          textAlign: "center",
        }}
      >
        {tr(dictionary, "explore.header.body", "Find trusted routes, stays, and local services.")}
      </p>
    </header>
  );
}

function SearchRow({
  q,
  category,
  dictionary,
}: {
  q: string;
  category: string;
  dictionary: TravelerDictionary;
}) {
  return (
    <section style={{ display: "grid", gap: 8 }}>
      <form action="/traveler/explore" method="get">
        {category && category !== "ALL" ? <input type="hidden" name="category" value={category} /> : null}

        <label
          style={{
            minHeight: 50,
            borderRadius: 18,
            background: "#ffffff",
            border: "1px solid rgba(5,150,165,0.14)",
            display: "grid",
            gridTemplateColumns: "30px 1fr auto",
            alignItems: "center",
            gap: 8,
            padding: "7px 8px 7px 12px",
            color: "#50668B",
            boxShadow: premiumCardShadow.medium,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 30,
              height: 30,
              borderRadius: 13,
              display: "grid",
              placeItems: "center",
              background: "#EAFBFA",
              color: "#0596A5",
              fontSize: 16,
              fontWeight: 950,
            }}
          >
            ⌕
          </span>

          <input
            name="q"
            defaultValue={q}
            placeholder={tr(dictionary, "explore.search.placeholder", "Search Siargao…")}
            style={{
              width: "100%",
              border: 0,
              outline: 0,
              background: "transparent",
              color: "#013863",
              fontSize: 13,
              fontWeight: 820,
              minWidth: 0,
            }}
          />

          <button
            type="submit"
            aria-label={tr(dictionary, "explore.search.aria", "Search Explore Siargao")}
            style={{
              minHeight: 34,
              borderRadius: 14,
              padding: "0 12px",
              border: 0,
              background: "linear-gradient(135deg, #013863, #0596A5)",
              color: "#ffffff",
              fontWeight: 950,
              fontSize: 11,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              ...premiumTapStyle,
            }}
          >
            Go
          </button>
        </label>
      </form>

      <div
        aria-label={tr(dictionary, "explore.filters.aria", "Explore filters")}
        style={{
          display: "flex",
          gap: 7,
          overflowX: "auto",
          padding: "1px 1px 4px",
          scrollbarWidth: "none",
        }}
      >
        {filterOptions.map((option) => {
          const active = category === option.value || (!category && option.value === "ALL");
          return (
            <Link
              key={option.value}
              href={option.href || buildExploreFilterHref({ q, category: option.value === "ALL" ? undefined : option.value })}
              style={{
                flex: "0 0 auto",
                borderRadius: 999,
                padding: "8px 11px",
                background: active ? "#013863" : "#ffffff",
                color: active ? "#ffffff" : "#50668B",
                border: active ? "1px solid #013863" : "1px solid rgba(5,150,165,0.14)",
                textDecoration: "none",
                fontSize: 10.6,
                fontWeight: 900,
                boxShadow: active ? "0 12px 22px rgba(1,56,99,0.18)" : premiumCardShadow.flat,
                ...premiumTapStyle,
              }}
            >
              {tr(dictionary, option.dictionaryKey, option.label)}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function HeroCard({ dictionary }: { dictionary: TravelerDictionary }) {
  const actions = [
    {
      label: "Passport Trails",
      labelKey: "explore.primary.passportTrails",
      note: "Routes",
      noteKey: "explore.primary.routes",
      href: "/traveler/passport-trails",
      icon: "🧭",
      tone: softCardSurfaces.aqua,
      text: "#013863",
    },
    {
      label: "Verified Tours",
      labelKey: "explore.primary.verifiedTours",
      note: "Bookable",
      noteKey: "explore.primary.bookable",
      href: "/traveler/explore/tours",
      icon: "⛵",
      tone: softCardSurfaces.blue,
      text: "#013863",
    },
    {
      label: "Stays",
      labelKey: "explore.primary.stays",
      note: "Places",
      noteKey: "explore.primary.places",
      href: "/traveler/explore/stays",
      icon: "🏝️",
      tone: softCardSurfaces.sand,
      text: "#013863",
    },
  ];

  return (
    <section style={{ display: "grid", gap: 9 }}>
      <div
        style={{
          borderRadius: 24,
          padding: 16,
          minHeight: 132,
          color: "#ffffff",
          backgroundImage:
            "linear-gradient(90deg, rgba(1,56,99,0.94) 0%, rgba(1,56,99,0.82) 48%, rgba(1,56,99,0.50) 100%), url('/osp/explore-siargao-hero-lagoon-kayak-square.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 18px 42px rgba(1,56,99,0.20)",
          display: "grid",
          alignContent: "end",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            margin: "0 0 5px",
            color: "#F3AE26",
            fontSize: 9.6,
            fontWeight: 950,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
          }}
        >
          {tr(dictionary, "explore.hero.badge", "Verified by OSP")}
        </p>
        <h2
          style={{
            margin: 0,
            maxWidth: 250,
            color: "#ffffff",
            WebkitTextFillColor: "#ffffff",
            fontSize: 24,
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            fontWeight: 950,
            textShadow: "0 5px 18px rgba(0,0,0,0.70)",
          }}
        >
          {tr(dictionary, "explore.hero.title", "Discover Siargao your way")}
        </h2>
      </div>

      <div
        aria-label="Primary Explore actions"
        style={{
          display: "grid",
          gridTemplateColumns: "1.18fr 1fr 1fr",
          gap: 8,
        }}
      >
        {actions.map((action) => (
          <Link
            key={tr(dictionary, action.labelKey, action.label)}
            href={action.href}
            style={{
              minHeight: 78,
              borderRadius: 20,
              padding: 10,
              background: action.tone,
              border: "1px solid rgba(5,150,165,0.13)",
              boxShadow: premiumCardShadow.soft,
              color: action.text,
              textDecoration: "none",
              display: "grid",
              alignContent: "space-between",
              overflow: "hidden",
              ...premiumTapStyle,
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 13,
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.76)",
                boxShadow: "0 6px 14px rgba(1,56,99,0.045)",
                fontSize: 17,
                lineHeight: 1,
              }}
            >
              {action.icon}
            </span>
            <span>
              <strong style={{ display: "block", fontSize: 11.4, lineHeight: 1.05, fontWeight: 950 }}>
                {tr(dictionary, action.labelKey, action.label)}
              </strong>
              <span style={{ display: "block", marginTop: 3, fontSize: 9.2, opacity: 0.78, fontWeight: 850 }}>
                {tr(dictionary, action.noteKey, action.note)}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LaneGrid({ dictionary }: { dictionary: TravelerDictionary }) {
  const shortcuts = [
    { title: "Tours", titleKey: "explore.lanes.tours", icon: "⛵", href: "/traveler/explore/tours", surface: softCardSurfaces.blue },
    { title: "Rentals", titleKey: "explore.lanes.rentals", icon: "🛵", href: "/traveler/explore/rentals", surface: softCardSurfaces.aqua },
    { title: "Surf", titleKey: "explore.lanes.surf", icon: "🏄", href: "/traveler/explore/surf-schools", surface: softCardSurfaces.pearl },
    { title: "Food", titleKey: "explore.lanes.food", icon: "🍽️", href: "/traveler/explore/food-culture", surface: softCardSurfaces.sand },
    { title: "Care", titleKey: "explore.lanes.care", icon: "✨", href: "/traveler/explore/beauty-health", surface: softCardSurfaces.gold },
    { title: "Stays", titleKey: "explore.lanes.stays", icon: "🏝️", href: "/traveler/explore/stays", surface: softCardSurfaces.mist },
  ];

  return (
    <section style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 10 }}>
        <h2 style={{ margin: 0, color: "#013863", fontSize: 18.5, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          {tr(dictionary, "explore.lanes.title", "Explore by lane")}
        </h2>
        <Link href="/traveler/explore/tours" style={{ color: "#0596A5", fontWeight: 950, textDecoration: "none", fontSize: 10.5 }}>
          {tr(dictionary, "explore.actions.seeAll", "All")} →
        </Link>
      </div>

      <div
        aria-label="Explore category shortcuts"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {shortcuts.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            style={{
              minHeight: 74,
              borderRadius: 18,
              padding: 9,
              background: item.surface,
              border: "1px solid rgba(5,150,165,0.13)",
              boxShadow: premiumCardShadow.soft,
              textDecoration: "none",
              color: "#013863",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              gap: 5,
              ...premiumTapStyle,
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 13,
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.72)",
                boxShadow: "0 6px 14px rgba(1,56,99,0.045)",
                fontSize: 17,
                lineHeight: 1,
              }}
            >
              {item.icon}
            </span>
            <strong style={{ fontSize: 10.8, lineHeight: 1.05, fontWeight: 950 }}>{tr(dictionary, item.titleKey, item.title)}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedServices({
  services,
  marketplaceMode,
  dictionary,
}: {
  services: FeaturedService[];
  marketplaceMode?: string;
  dictionary: TravelerDictionary;
}) {
  const displayServices = getFeaturedVerifiedServicesForDisplay(services);

  return (
    <section style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 10 }}>
        <h2 style={{ margin: 0, color: "#013863", fontSize: 19.5, lineHeight: 1.04, letterSpacing: "-0.025em" }}>
          {tr(dictionary, "explore.featured.title", "Featured verified services")}
        </h2>
        <Link href="/traveler/explore/tours" style={{ color: "#0596A5", fontWeight: 950, textDecoration: "none", fontSize: 10.5 }}>
          {tr(dictionary, "explore.actions.allTours", "Tours")} →
        </Link>
      </div>

      <div
        aria-label="Featured verified service carousel"
        style={{
          display: "flex",
          gap: 9,
          overflowX: "auto",
          padding: "2px 2px 9px",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {displayServices.map((service) => {
          const mediaUrl = getFeaturedServiceCardMediaUrl(service);

          return (
            <Link
              key={service.title}
              href={getFeaturedServiceCardHref(service)}
              style={{
                flex: "0 0 66%",
                scrollSnapAlign: "start",
                borderRadius: 21,
                overflow: "hidden",
                background: "#ffffff",
                border: "1px solid rgba(1,56,99,0.10)",
                boxShadow: premiumCardShadow.primary,
                textDecoration: "none",
                color: "#013863",
                ...premiumTapStyle,
              }}
            >
              <div
                style={{
                  height: 118,
                  position: "relative",
                  overflow: "hidden",
                  background: service.visualBackground || serviceTone(service.tone),
                }}
              >
                {mediaUrl ? (
                  <img
                    src={mediaUrl}
                    alt={`${service.title} service banner`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : null}

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: mediaUrl
                      ? "linear-gradient(180deg, rgba(1,56,99,0.08) 0%, rgba(1,56,99,0.55) 100%)"
                      : "linear-gradient(180deg, rgba(1,56,99,0.02) 0%, rgba(1,56,99,0.22) 100%)",
                  }}
                />

                <span
                  style={{
                    position: "absolute",
                    left: 9,
                    top: 9,
                    maxWidth: "calc(100% - 18px)",
                    borderRadius: 999,
                    background: "rgba(1,56,99,0.82)",
                    color: "#ffffff",
                    padding: "5px 8px",
                    fontSize: 8.6,
                    fontWeight: 950,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {service.category}
                </span>
              </div>

              <div style={{ padding: "10px 10px 11px", display: "grid", gap: 9 }}>
                <strong
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    color: "#013863",
                    fontSize: 14,
                    lineHeight: 1.08,
                    letterSpacing: "-0.018em",
                    minHeight: 30,
                  }}
                >
                  {service.titleKey ? tr(dictionary, service.titleKey, service.title) : service.title}
                </strong>

                <span
                  style={{
                    justifySelf: "start",
                    borderRadius: 999,
                    background: "linear-gradient(135deg, rgba(1,56,99,0.10), rgba(5,150,165,0.16))",
                    color: "#013863",
                    border: "1px solid rgba(5,150,165,0.18)",
                    padding: "6px 11px",
                    fontSize: 10,
                    fontWeight: 950,
                  }}
                >
                  {tr(dictionary, "explore.cards.cta", "View")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function MoreWaysToExplore({ services, dictionary }: { services: FeaturedService[]; dictionary: TravelerDictionary }) {
  if (!services.length) return null;

  const shortcuts: Array<{ title: string; titleKey?: string; href: string; icon: string; surface: string }> = [
    ...services.slice(0, 5).map((service) => {
      const title = service.title;
      const key = title.toLowerCase();
      const icon = key.includes("rental") ? "🛵" : key.includes("surf") ? "🏄" : key.includes("food") ? "🍽️" : key.includes("beauty") || key.includes("health") ? "✨" : "🧭";
      const surface = key.includes("rental")
        ? softCardSurfaces.aqua
        : key.includes("surf")
          ? softCardSurfaces.blue
          : key.includes("food")
            ? softCardSurfaces.sand
            : key.includes("beauty") || key.includes("health")
              ? softCardSurfaces.gold
              : softCardSurfaces.pearl;
      return { title, href: getFeaturedServiceCardHref(service), icon, surface };
    }),
    {
      title: "Site Access",
      titleKey: "explore.moreWays.siteAccess",
      href: "/traveler/site-access/cloud-9",
      icon: "🎟️",
      surface: softCardSurfaces.mist,
    },
  ];

  return (
    <section style={{ display: "grid", gap: 8 }}>
      <h2 style={{ margin: 0, color: "#013863", fontSize: 18.2, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
        {tr(dictionary, "explore.moreWays.title", "More ways to explore")}
      </h2>

      <div
        aria-label="More Explore shortcuts"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {shortcuts.map((service) => (
          <Link
            key={service.title}
            href={service.href}
            style={{
              minHeight: 78,
              borderRadius: 18,
              background: service.surface,
              border: "1px solid rgba(5,150,165,0.13)",
              boxShadow: premiumCardShadow.soft,
              color: "#013863",
              textDecoration: "none",
              padding: 10,
              display: "grid",
              gridTemplateColumns: "28px 1fr",
              gap: 8,
              alignItems: "center",
              overflow: "hidden",
              ...premiumTapStyle,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.72)",
                boxShadow: "0 6px 14px rgba(1,56,99,0.045)",
                fontSize: 15,
              }}
            >
              {service.icon}
            </span>
            <strong
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontSize: 11.5,
                lineHeight: 1.08,
                fontWeight: 950,
              }}
            >
              {service.title}
            </strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function TravelerExplorePage({
  searchParams,
}: {
  searchParams?: ExploreSearchParams;
}) {
  const q = normalizeSearchValue(searchParams?.q);
  const category = normalizeFilterCategory(searchParams?.category);
  const languageRuntime = await getTravelerLanguageRuntime({
    searchParams,
    scope: "traveler",
    allowQueryPreview: true,
  });
  const dictionary = languageRuntime.dictionary;

  const marketplace = await getMarketplaceServices();
  const backendFeaturedServices =
    marketplace.services && marketplace.services.length > 0
      ? marketplace.services.slice(0, 3).map(mapMarketplaceServiceToFeatured)
      : [];

  const existingTitles = new Set(backendFeaturedServices.map((item) => item.title));
  const DiscoveryLaneServices = await getDiscoveryLaneServices();
  const previewExploreServices = (
    DiscoveryLaneServices.length > 0
      ? DiscoveryLaneServices
      : fallbackFeaturedServices.filter((item) => !existingTitles.has(item.title))
  ).slice(0, 5);

  return (
    <main
      style={{
        maxWidth: 430,
        margin: "0 auto",
        minHeight: "100vh",
        padding: "18px 14px 112px",
        background:
          "radial-gradient(circle at 15% 0%, rgba(204,251,241,0.72), transparent 32%), linear-gradient(180deg, #f6fdff 0%, #ffffff 60%, #fffaf0 100%)",
        color: "#102f57",
        fontFamily: "Arial, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div style={{ display: "grid", gap: 13 }}>
        <Header dictionary={dictionary} />
        <SearchRow q={q} category={category} dictionary={dictionary} />
        <HeroCard dictionary={dictionary} />
        <LaneGrid dictionary={dictionary} />
        <FeaturedServices services={backendFeaturedServices} marketplaceMode={marketplace.mode} dictionary={dictionary} />
        <MoreWaysToExplore services={previewExploreServices} dictionary={dictionary} />
      </div>

      <UniversalTravelerBottomTabBar activeTab="explore" />
    </main>
  );
}
