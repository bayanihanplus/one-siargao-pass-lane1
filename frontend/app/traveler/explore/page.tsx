import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../src/components/traveler/UniversalTravelerBottomTabBar";

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
    body: "Choose official island routes from General Luna Port. Review route options and clear fee visibility before payment.",
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
      "Operator-console backed discovery lane prepared for governed traveler marketplace exposure.",
    price: live ? `${serviceCount} ready service${serviceCount === 1 ? "" : "s"}` : "Coming online",
    href: lane.href,
    tags: lane.tags && lane.tags.length ? lane.tags : live ? ["DB wired", "Marketplace backed"] : ["Lane ready", "Awaiting supply"],
    tone: normalizeDiscoveryLaneTone(lane.tone),
    sourceLabel: live ? "DB lane" : "Preview lane",
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
    body: "Find hotels, resorts, villas, hostels, homestays, and guesthouses prepared for traveler-ready discovery.",
    href: "/traveler/explore/stays",
    cta: "Explore",
    tone: "teal",
    icon: "🏝️",
  },
  {
    eyebrow: "Official route layer",
    title: "Official Passport Trails",
    body: "Follow curated trail families, verified stops, and progress logic connected to your Siargao journey.",
    href: "/traveler/passport-trails",
    cta: "Explore",
    tone: "sand",
    icon: "🧭",
  },
  {
    eyebrow: "Flexible planning",
    title: "Build Your Own Trail",
    body: "Create your own Passport Trail request and connect preferred island stops into one structured journey.",
    href: "/traveler/passport-trails/diy-trail-builder",
    cta: "Explore",
    tone: "mint",
    icon: "✨",
  },
  {
    eyebrow: "Food and local discovery",
    title: "Food & Local Spots",
    body: "Discover cafés, restaurants, local culture, and curated island stops without turning Explore into a noisy directory.",
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
    sourceLabel: "Preview lane",
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
    sourceLabel: "Preview lane",
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
    sourceLabel: "Preview lane",
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
    body: "Cafés, restaurants, local food, cultural spots, and curated island stops without becoming a noisy directory.",
    price: "View spots",
    href: "/traveler/explore/food-culture",
    tags: ["Curated", "Local discovery"],
    tone: "trail",
    sourceLabel: "Preview lane",
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
    sourceLabel: "Preview lane",
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
  { label: "Rentals", href: "/traveler/explore/stays", icon: "🛵" },
  { label: "Surfing Schools", href: "/traveler/explore/stays", icon: "🏄" },
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
  { label: "All", value: "ALL" },
  { label: "Stays", value: "STAYS" },
  { label: "Tours", value: "TOURS" },
  { label: "Rentals",
    href: "/traveler/explore/stays", value: "RENTALS" },
  { label: "Surf", value: "SURF" },
  { label: "Food", value: "FOOD_CULTURE" },
  { label: "Health", value: "BEAUTY_HEALTH" },
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

function Header() {
  return (
    <header
      style={{
        display: "grid",
        gap: 14,
        padding: "4px 0 2px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "52px 1fr 52px",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Link
          href="/traveler/home"
          aria-label="Back to traveler home"
          style={{
            width: 52,
            height: 52,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            color: "#0b3768",
            textDecoration: "none",
            boxShadow: "0 14px 30px rgba(15,23,42,0.07)",
            fontSize: 28,
            fontWeight: 950,
          }}
        >
          ‹
        </Link>

        <div
          style={{
            minWidth: 0,
            textAlign: "center",
            display: "grid",
            gap: 4,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#078da0",
              fontSize: 10.5,
              fontWeight: 950,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            One Siargao Pass
          </p>
          <h1
            style={{
              margin: 0,
              color: "#102f57",
              fontSize: 34,
              lineHeight: 0.96,
              letterSpacing: "-0.055em",
              fontWeight: 950,
            }}
          >
            Explore Siargao
          </h1>
        </div>

        <div
          aria-label="One Siargao Pass badge"
          style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(6,120,137,0.14)",
            boxShadow: "0 14px 30px rgba(6,120,137,0.10)",
            overflow: "hidden",
          }}
        >
          <img
            src="/osp/osp-logo.png"
            alt="One Siargao Pass"
            style={{
              width: 38,
              height: 38,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>

      <section
        style={{
          borderRadius: 26,
          padding: "16px 16px 15px",
          background:
            "radial-gradient(circle at 18% 0%, rgba(34,211,238,0.22), transparent 38%), linear-gradient(135deg, rgba(255,255,255,0.96), rgba(236,253,245,0.78))",
          border: "1px solid rgba(6,120,137,0.12)",
          boxShadow: "0 18px 42px rgba(15,23,42,0.06)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#0b7285",
            fontSize: 11,
            fontWeight: 950,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
          }}
        >
          Verified island discovery
        </p>
        <p
          style={{
            margin: "7px 0 0",
            color: "#4f647e",
            fontSize: 13.5,
            lineHeight: 1.42,
            fontWeight: 800,
          }}
        >
          Browse stays, tours, rentals, surf schools, food, culture, and trusted local services connected to your One Siargao Pass.
        </p>
      </section>
    </header>
  );
}

function SearchRow({
  q,
  category,
}: {
  q: string;
  category: string;
}) {
  return (
    <section
      style={{
        display: "grid",
        gap: 11,
        marginTop: -2,
      }}
    >
      <form
        action="/traveler/explore"
        method="get"
        style={{
          display: "grid",
          gap: 8,
        }}
      >
        {category && category !== "ALL" ? <input type="hidden" name="category" value={category} /> : null}

        <label
          style={{
            minHeight: 62,
            borderRadius: 24,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,253,255,0.96))",
            border: "1px solid rgba(6,120,137,0.14)",
            display: "grid",
            gridTemplateColumns: "34px 1fr auto",
            alignItems: "center",
            gap: 10,
            padding: "8px 9px 8px 15px",
            color: "#64748b",
            fontWeight: 800,
            boxShadow: "0 16px 34px rgba(15,23,42,0.07)",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 34,
              height: 34,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: "#e0f7fb",
              color: "#078da0",
              fontSize: 18,
              fontWeight: 950,
            }}
          >
            ⌕
          </span>

          <input
            name="q"
            defaultValue={q}
            placeholder="Search stays, tours, rentals, surf, food…"
            style={{
              width: "100%",
              border: 0,
              outline: 0,
              background: "transparent",
              color: "#102f57",
              fontSize: 13.5,
              fontWeight: 850,
              minWidth: 0,
            }}
          />

          <button
            type="submit"
            aria-label="Search Explore Siargao"
            style={{
              minHeight: 44,
              borderRadius: 18,
              padding: "0 15px",
              border: "1px solid rgba(255,255,255,0.28)",
              background: "linear-gradient(135deg, #063b63, #089fa5)",
              color: "#ffffff",
              fontWeight: 950,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 24px rgba(6,120,137,0.18)",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Go
          </button>
        </label>
      </form>

      <div
        aria-label="Explore filters"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: "2px 0 5px",
          scrollbarWidth: "none",
        }}
      >
        {filterOptions.map((option) => {
          const active = category === option.value;
          return (
            <Link
              key={option.value}
              href={buildExploreFilterHref({ q, category: option.value })}
              style={{
                flex: "0 0 auto",
                minHeight: 36,
                borderRadius: 999,
                padding: "0 13px",
                background: active
                  ? "linear-gradient(135deg,#063b63,#089fa5)"
                  : "rgba(255,255,255,0.92)",
                border: active
                  ? "1px solid rgba(6,120,137,0.30)"
                  : "1px solid rgba(6,120,137,0.13)",
                color: active ? "#ffffff" : "#0b3768",
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 950,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: active
                  ? "0 12px 24px rgba(6,120,137,0.16)"
                  : "0 8px 18px rgba(15,23,42,0.045)",
              }}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <section
      style={{
        minHeight: 320,
        borderRadius: 28,
        padding: 24,
        overflow: "hidden",
        position: "relative",
        color: "#ffffff",
        backgroundImage:
          "linear-gradient(90deg, rgba(2,18,31,0.90) 0%, rgba(2,24,39,0.78) 42%, rgba(3,52,66,0.38) 74%, rgba(3,52,66,0.18) 100%), url('/osp/explore-siargao-hero-lagoon-kayak-square.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        boxShadow: "0 22px 52px rgba(6,120,137,0.26)",
        display: "grid",
        alignContent: "end",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.28) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 292,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.38)",
            background: "rgba(2,18,31,0.46)",
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 950,
            letterSpacing: "0.06em",
            marginBottom: 14,
            textShadow: "0 2px 8px rgba(0,0,0,0.45)",
          }}
        >
          ⛨ VERIFIED BY OSP
        </div>

        <h2
          style={{
            margin: "0 0 12px",
fontSize: 36,
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            maxWidth: 250,
            fontWeight: 950,
color: "#ffffff",
            WebkitTextFillColor: "#ffffff",
            textShadow: "0 5px 18px rgba(0,0,0,0.78)",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              WebkitTextFillColor: "#ffffff",
              textShadow: "0 5px 18px rgba(0,0,0,0.78)",
              display: "inline",
            }}
          >
            Discover Siargao your way
          </span>
        </h2>

        <p
          style={{
            margin: "0 0 20px",
            maxWidth: 270,
fontSize: 15,
            lineHeight: 1.5,
            fontWeight: 850,
            textShadow: "0 3px 12px rgba(0,0,0,0.54)",
            color: "rgba(232,248,250,0.94)",
          }}
        >
          Find verified local experiences, partner tours, and Passport Trails connected to your One Siargao Pass.
        </p>

        <Link
          href="/traveler/passport-trails"
          style={{
            minHeight: 48,
            padding: "0 18px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.98)",
            color: "#0b3768",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            fontWeight: 950,
            boxShadow: "0 16px 34px rgba(0,0,0,0.28)",
          }}
        >
          Explore Passport Trails →
        </Link>
      </div>
    </section>
  );
}


function CategoryChips() {
  return (
    <section
      aria-label="Explore category shortcuts"
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        padding: "2px 0 6px",
        scrollbarWidth: "none",
      }}
    >
      {categories.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          style={{
            flex: "0 0 auto",
            minWidth: 74,
            minHeight: 58,
            borderRadius: 16,
            display: "grid",
            placeItems: "center",
            gap: 3,
            textDecoration: "none",
            color: "#0b3768",
            background: "#ffffff",
            border: "1px solid rgba(6,120,137,0.12)",
            boxShadow: "0 10px 20px rgba(15,23,42,0.045)",
            fontSize: 10.5,
            fontWeight: 900,
            textAlign: "center",
            padding: "7px 8px",
            lineHeight: 1.05,
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </section>
  );
}

function LaneGrid() {
  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <h2 style={{ margin: 0, color: "#102f57", fontSize: 22, lineHeight: 1.1 }}>
          Explore by lane
        </h2>
        <Link href="/traveler/explore/tours" style={{ color: "#078da0", fontWeight: 900, textDecoration: "none", fontSize: 13 }}>
          See all →
        </Link>
      </div>

      <div
        aria-label="Explore Siargao lane grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridAutoRows: "minmax(158px, auto)",
          gap: 12,
        }}
      >
        {lanes.map((lane) => {
          const s = toneStyles(lane.tone);
          return (
            <Link
              key={lane.title}
              href={lane.href}
              style={{
                minHeight: 158,
                borderRadius: 22,
                padding: 13,
                background: s.background,
                border: s.border,
                boxShadow: "0 14px 32px rgba(15,23,42,0.06)",
                textDecoration: "none",
                color: s.title,
                display: "grid",
                alignContent: "space-between",
                overflow: "hidden",
              }}
            >
              <div>
                <div style={{ fontSize: 25, marginBottom: 7 }}>{lane.icon}</div>
                <div
                  style={{
                    fontSize: 8.8,
                    letterSpacing: "0.13em",
                    textTransform: "uppercase",
                    fontWeight: 950,
                    color: s.eyebrow,
                    marginBottom: 7,
                  }}
                >
                  {lane.eyebrow}
                </div>
                <strong style={{ display: "block", fontSize: 15.3, lineHeight: 1.12, color: s.title }}>
                  {lane.title}
                </strong>
                <p style={{ margin: "7px 0 0", color: s.body, fontSize: 10.8, lineHeight: 1.32, fontWeight: 750 }}>
                  {lane.body}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <span style={{ color: s.ctaColor, background: s.ctaBg, borderRadius: 999, padding: "5px 9px", fontSize: 11.2, fontWeight: 950 }}>
                  {lane.cta}
                </span>
                <span style={{ color: s.ctaColor, background: s.ctaBg, width: 26, height: 26, borderRadius: 999, display: "grid", placeItems: "center", fontWeight: 950 }}>
                  ›
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedServices({
  services,
  marketplaceMode,
}: {
  services: FeaturedService[];
  marketplaceMode?: string;
}) {
  const displayServices = getFeaturedVerifiedServicesForDisplay(services);

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <h2 style={{ margin: 0, color: "#102f57", fontSize: 24, lineHeight: 1.1 }}>
            Featured verified services
          </h2>
          <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 12.5, lineHeight: 1.35, fontWeight: 750 }}>
            Choose your Siargao trip type. Open the route group, compare options, and continue only when the route and fee path feel clear.
          </p>
        </div>
        <Link href="/traveler/explore/tours" style={{ color: "#078da0", fontWeight: 900, textDecoration: "none", fontSize: 13 }}>
          All tours →
        </Link>
      </div>

      {marketplaceMode ? (
        <div
          style={{
            marginTop: -4,
            color: "#64748b",
            fontSize: 11.5,
            fontWeight: 800,
          }}
        >
          Source: OSP curated trip gateway
        </div>
      ) : null}

      <div
        aria-label="Featured verified service carousel"
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          padding: "2px 2px 8px",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {displayServices.map((service) => (
          <Link
            key={service.title}
            href={getFeaturedServiceCardHref(service)}
            style={{
              flex: "0 0 296px",
              scrollSnapAlign: "start",
              borderRadius: 24,
              overflow: "hidden",
              background: "#ffffff",
              border: "1px solid rgba(15,23,42,0.10)",
              boxShadow: "0 18px 40px rgba(1,56,99,0.12)",
              textDecoration: "none",
              color: "#102f57",
            }}
          >
            <div
              style={{
                height: 176,
                position: "relative",
                overflow: "hidden",
                background: service.visualBackground || serviceTone(service.tone),
              }}
            >
              {getFeaturedServiceCardMediaUrl(service) ? (
                <img
                  src={getFeaturedServiceCardMediaUrl(service) || ""}
                  alt={`${service.title} service banner`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : null}

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: getFeaturedServiceCardMediaUrl(service)
                    ? "linear-gradient(180deg, rgba(1,56,99,0.18) 0%, rgba(1,56,99,0.76) 100%)"
                    : "transparent",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: 10,
                  right: 10,
                  top: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    borderRadius: 999,
                    background: "rgba(7,141,160,0.9)",
                    color: "#ffffff",
                    padding: "6px 8px",
                    fontSize: 10,
                    fontWeight: 950,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {service.category}
                </span>
                <span style={{ color: "#ffffff", fontSize: 20, textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>♡</span>
              </div>

              {!getFeaturedServiceCardMediaUrl(service) && service.mediaTruth ? (
                <div
                  style={{
                    position: "absolute",
                    left: 10,
                    bottom: 10,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.78)",
                    color: "#475569",
                    padding: "5px 7px",
                    fontSize: 9.2,
                    fontWeight: 900,
                  }}
                >
                  Visual pending
                </div>
              ) : null}
            </div>

            <div style={{ padding: 14, display: "grid", gap: 10 }}>
              <div>
                <strong style={{ display: "block", fontSize: 16.5, lineHeight: 1.08, marginBottom: 6 }}>
                  {service.title}
                </strong>
                <p style={{ margin: 0, color: "#64748b", fontSize: 11.4, lineHeight: 1.42, fontWeight: 680 }}>
                  {service.body}
                </p>
              </div>

              <div
                style={{
                  borderRadius: 16,
                  background: "#F8FBFD",
                  border: "1px solid rgba(15,23,42,0.06)",
                  padding: 10,
                  display: "grid",
                  gap: 6,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                  <span style={{ color: "#64748b", fontSize: 10.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Price
                  </span>
                  <strong style={{ color: "#078da0", fontSize: 15, fontWeight: 950, textAlign: "right" }}>
                    {getFeaturedServiceCardPrice(service)}
                  </strong>
                </div>

                <div style={{ color: "#475569", fontSize: 11.5, fontWeight: 800, lineHeight: 1.35 }}>
                  {service.availabilityLabel} · {service.urgencyLabel}
                </div>

                <div style={{ color: "#64748b", fontSize: 11, fontWeight: 750, lineHeight: 1.35 }}>
                  {service.operatorLabel}
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(service.tags || []).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      borderRadius: 999,
                      background: "#ecfeff",
                      color: "#0e7490",
                      border: "1px solid rgba(14,116,144,0.14)",
                      padding: "5px 7px",
                      fontSize: 10.5,
                      fontWeight: 900,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span
                  style={{
                    borderRadius: 999,
                    background: "#eef8fb",
                    color: "#0b7285",
                    padding: "7px 9px",
                    fontSize: 10.8,
                    fontWeight: 950,
                  }}
                >
                  {service.availabilityLabel || "Choose route"}
                </span>
                <span style={{ color: "#0b3768", fontSize: 12.5, fontWeight: 950 }}>
                  {getFeaturedServiceCardCta(service)} →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function MoreWaysToExplore({ services }: { services: FeaturedService[] }) {
  if (!services.length) return null;

  function getBannerTheme(title: string) {
    if (title === "Siargao Tour Operators") {
      return {
        eyebrow: "Verified local tours",
        headline: "Island routes, land tours, and curated operator-led experiences",
        icon: "🚐",
        chips: ["Island hopping", "Land tours", "Custom trips"],
        background: "linear-gradient(135deg, #013863 0%, #055f86 56%, #0ea5b1 100%)",
        motif: "tours",
      } as const;
    }

    if (title === "Rentals") {
      return {
        eyebrow: "Island mobility",
        headline: "Motorbikes, vans, boards, and rental-ready island movement",
        icon: "🛵",
        chips: ["Motorbike", "Van", "Board rental"],
        background: "linear-gradient(135deg, #0b3d67 0%, #146b89 50%, #f3ae26 100%)",
        motif: "rentals",
      } as const;
    }

    if (title === "Surfing Schools") {
      return {
        eyebrow: "Surf lessons",
        headline: "Local coaching, board support, and beginner-to-advanced surf access",
        icon: "🏄",
        chips: ["Beginner", "Coaching", "Board support"],
        background: "linear-gradient(135deg, #036b78 0%, #0c8ea0 54%, #013863 100%)",
        motif: "surf",
      } as const;
    }

    if (title === "Food & Culture") {
      return {
        eyebrow: "Local taste",
        headline: "Cafés, restaurants, cultural stops, and curated island discoveries",
        icon: "🍽️",
        chips: ["Cafés", "Restaurants", "Culture stops"],
        background: "linear-gradient(135deg, #9a5f0c 0%, #d58b18 48%, #013863 100%)",
        motif: "food",
      } as const;
    }

    if (title === "Beauty & Health") {
      return {
        eyebrow: "Wellness & care",
        headline: "Spa, recovery, grooming, wellness, and local care services",
        icon: "🌿",
        chips: ["Spa", "Recovery", "Wellness"],
        background: "linear-gradient(135deg, #0a6572 0%, #13889a 52%, #325d66 100%)",
        motif: "wellness",
      } as const;
    }

    return {
      eyebrow: "Explore lane",
      headline: title,
      icon: "◇",
      chips: ["Explore", "Discover", "View"],
      background: "linear-gradient(135deg, #013863 0%, #0596a5 100%)",
      motif: "default",
    } as const;
  }

  function renderMotif(motif: string) {
    if (motif === "tours") {
      return (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 14,
            bottom: 18,
            width: 82,
            height: 58,
            zIndex: 1,
          }}
        >
          <div style={{ position: "absolute", right: 0, bottom: 0, width: 68, height: 18, borderRadius: 999, background: "rgba(255,255,255,0.16)" }} />
          <div style={{ position: "absolute", left: 10, bottom: 16, width: 12, height: 12, borderRadius: 999, background: "#ffffff" }} />
          <div style={{ position: "absolute", left: 30, bottom: 26, width: 12, height: 12, borderRadius: 999, background: "rgba(255,255,255,0.88)" }} />
          <div style={{ position: "absolute", left: 50, bottom: 38, width: 12, height: 12, borderRadius: 999, background: "rgba(255,255,255,0.72)" }} />
          <div style={{ position: "absolute", left: 18, bottom: 22, width: 18, height: 2, background: "rgba(255,255,255,0.72)", transform: "rotate(26deg)" }} />
          <div style={{ position: "absolute", left: 38, bottom: 34, width: 18, height: 2, background: "rgba(255,255,255,0.72)", transform: "rotate(26deg)" }} />
        </div>
      );
    }

    if (motif === "rentals") {
      return (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 12,
            bottom: 14,
            width: 88,
            height: 64,
            zIndex: 1,
          }}
        >
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.18)" }} />
          <div style={{ position: "absolute", left: 16, bottom: 13, width: 12, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.92)" }} />
          <div style={{ position: "absolute", left: 38, bottom: 13, width: 12, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.92)" }} />
          <div style={{ position: "absolute", left: 60, bottom: 13, width: 12, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.92)" }} />
          <div style={{ position: "absolute", left: 10, bottom: 28, width: 24, height: 20, borderRadius: 8, background: "rgba(255,255,255,0.88)" }} />
          <div style={{ position: "absolute", left: 38, bottom: 24, width: 18, height: 24, borderRadius: 10, background: "rgba(255,255,255,0.78)" }} />
          <div style={{ position: "absolute", left: 62, bottom: 30, width: 14, height: 14, borderRadius: 999, background: "rgba(255,255,255,0.94)" }} />
        </div>
      );
    }

    if (motif === "surf") {
      return (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            width: 92,
            height: 68,
            zIndex: 1,
          }}
        >
          <div style={{ position: "absolute", right: 0, bottom: 10, width: 70, height: 18, borderRadius: "20px 20px 24px 24px", border: "3px solid rgba(255,255,255,0.78)", borderLeft: "0", borderTop: "0", background: "transparent" }} />
          <div style={{ position: "absolute", right: 18, bottom: 22, width: 52, height: 14, borderRadius: "20px 20px 22px 22px", border: "3px solid rgba(255,255,255,0.52)", borderLeft: "0", borderTop: "0", background: "transparent" }} />
          <div style={{ position: "absolute", left: 6, bottom: 8, width: 10, height: 46, borderRadius: 999, background: "rgba(255,255,255,0.88)", transform: "rotate(18deg)" }} />
        </div>
      );
    }

    if (motif === "food") {
      return (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 12,
            bottom: 14,
            width: 84,
            height: 64,
            zIndex: 1,
          }}
        >
          <div style={{ position: "absolute", right: 8, bottom: 8, width: 42, height: 42, borderRadius: 999, border: "3px solid rgba(255,255,255,0.92)" }} />
          <div style={{ position: "absolute", right: 19, bottom: 19, width: 20, height: 20, borderRadius: 999, background: "rgba(255,255,255,0.30)" }} />
          <div style={{ position: "absolute", left: 12, bottom: 12, width: 4, height: 36, borderRadius: 999, background: "rgba(255,255,255,0.90)" }} />
          <div style={{ position: "absolute", left: 22, bottom: 12, width: 4, height: 36, borderRadius: 999, background: "rgba(255,255,255,0.72)" }} />
          <div style={{ position: "absolute", left: 32, bottom: 12, width: 4, height: 36, borderRadius: 999, background: "rgba(255,255,255,0.56)" }} />
        </div>
      );
    }

    if (motif === "wellness") {
      return (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 10,
            bottom: 12,
            width: 86,
            height: 66,
            zIndex: 1,
          }}
        >
          <div style={{ position: "absolute", right: 8, bottom: 8, width: 42, height: 16, borderRadius: 999, background: "rgba(255,255,255,0.32)" }} />
          <div style={{ position: "absolute", right: 16, bottom: 26, width: 30, height: 14, borderRadius: 999, background: "rgba(255,255,255,0.54)" }} />
          <div style={{ position: "absolute", right: 22, bottom: 42, width: 18, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.82)" }} />
          <div style={{ position: "absolute", left: 8, bottom: 12, width: 20, height: 34, borderRadius: "20px 0 20px 0", background: "rgba(255,255,255,0.82)", transform: "rotate(-22deg)" }} />
          <div style={{ position: "absolute", left: 24, bottom: 18, width: 16, height: 28, borderRadius: "20px 0 20px 0", background: "rgba(255,255,255,0.56)", transform: "rotate(16deg)" }} />
        </div>
      );
    }

    return null;
  }

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div>
        <h2 style={{ margin: 0, color: "#102f57", fontSize: 22, lineHeight: 1.1 }}>
          More ways to explore
        </h2>
        <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 12.5, lineHeight: 1.35, fontWeight: 750 }}>
          Discovery lanes shown separately from verified marketplace services.
        </p>
      </div>

      <div
        aria-label="More ways to explore carousel"
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          padding: "2px 2px 10px",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {services.map((service) => {
          const theme = getBannerTheme(service.title);

          return (
            <Link
              key={service.title}
              href={getFeaturedServiceCardHref(service)}
              style={{
                flex: "0 0 242px",
                scrollSnapAlign: "start",
                borderRadius: 26,
                overflow: "hidden",
                background: "#ffffff",
                border: "1px solid rgba(5,150,165,0.14)",
                boxShadow: "0 18px 38px rgba(1,56,99,0.11)",
                textDecoration: "none",
                color: "#102f57",
              }}
            >
              <div
                style={{
                  minHeight: 148,
                  padding: 14,
                  position: "relative",
                  overflow: "hidden",
                  background: theme.background,
                  color: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(1,56,99,0.20) 0%, rgba(1,56,99,0.10) 100%)",
                    zIndex: 0,
                  }}
                />

                {renderMotif(theme.motif)}

                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      borderRadius: 999,
                      padding: "6px 9px",
                      background: "rgba(255,255,255,0.18)",
                      border: "1px solid rgba(255,255,255,0.34)",
                      color: "#ffffff",
                      fontSize: 10.5,
                      fontWeight: 950,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {theme.eyebrow}
                  </span>

                  <span
                    aria-hidden="true"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 16,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#ffffff",
                      color: "#013863",
                      fontSize: 19,
                      boxShadow: "0 10px 22px rgba(1,56,99,0.18)",
                      flex: "0 0 auto",
                    }}
                  >
                    {theme.icon}
                  </span>
                </div>

                <div style={{ position: "relative", zIndex: 2, display: "grid", gap: 10 }}>
                  <strong
                    style={{
                      display: "block",
                      maxWidth: 206,
                      color: "#ffffff",
                      fontSize: 16.5,
                      lineHeight: 1.08,
                      letterSpacing: "-0.025em",
                      fontWeight: 950,
                      textShadow: "0 2px 12px rgba(0,0,0,0.16)",
                    }}
                  >
                    {theme.headline}
                  </strong>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {theme.chips.map((chip) => (
                      <span
                        key={chip}
                        style={{
                          borderRadius: 999,
                          padding: "5px 8px",
                          background: "rgba(255,255,255,0.16)",
                          border: "1px solid rgba(255,255,255,0.22)",
                          color: "#ffffff",
                          fontSize: 10.5,
                          fontWeight: 850,
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: 13, display: "grid", gap: 8 }}>
                <strong style={{ display: "block", fontSize: 14.5, lineHeight: 1.18 }}>
                  {service.title}
                </strong>
                <p style={{ margin: 0, color: "#64748b", fontSize: 11.3, lineHeight: 1.38, fontWeight: 750 }}>
                  {service.body}
                </p>
                <span
                  style={{
                    width: "fit-content",
                    borderRadius: 999,
                    padding: "7px 10px",
                    background: "rgba(5,150,165,0.10)",
                    color: "#047f91",
                    border: "1px solid rgba(5,150,165,0.16)",
                    fontSize: 12,
                    fontWeight: 950,
                  }}
                >
                  Explore →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function GovernanceNote() {
  return (
    <section
      style={{
        borderRadius: 24,
        background: "linear-gradient(135deg, #fff7ed, #fffaf0)",
        border: "1px solid rgba(217,119,6,0.18)",
        padding: 16,
        display: "grid",
        gridTemplateColumns: "52px 1fr auto",
        gap: 12,
        alignItems: "center",
      }}
    >
      <div
        aria-label="Department of Tourism visibility note"
        style={{
          width: 52,
          height: 52,
          borderRadius: 18,
          display: "grid",
          placeItems: "center",
          background: "#ffffff",
          border: "1px solid rgba(217,119,6,0.16)",
          boxShadow: "0 10px 24px rgba(146,64,14,0.08)",
          overflow: "hidden",
        }}
      >
        <img
          src="/osp/dot-logo.png"
          alt="Department of Tourism"
          style={{
            width: 40,
            height: 40,
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>
      <div>
        <strong style={{ display: "block", color: "#92400e", fontSize: 14 }}>
          Experience visibility is governed.
        </strong>
        <p style={{ margin: "4px 0 0", color: "#6b4f35", fontSize: 12.5, lineHeight: 1.35, fontWeight: 750 }}>
          Only traveler-safe, approved, or marketplace-ready services appear here. Operator-created services do not show automatically.
        </p>
      </div>
      <span style={{ color: "#92400e", fontSize: 24 }}>›</span>
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

  const marketplace = await getMarketplaceServices();
  const backendFeaturedServices =
    marketplace.services && marketplace.services.length > 0
      ? marketplace.services.slice(0, 3).map(mapMarketplaceServiceToFeatured)
      : [];

  const existingTitles = new Set(backendFeaturedServices.map((item) => item.title));
  const backendDiscoveryLaneServices = await getDiscoveryLaneServices();
  const previewExploreServices = (
    backendDiscoveryLaneServices.length > 0
      ? backendDiscoveryLaneServices
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
      }}
    >
      <div style={{ display: "grid", gap: 18 }}>
        <Header />
        <SearchRow q={q} category={category} />
        <HeroCard />
        <LaneGrid />
        <FeaturedServices services={backendFeaturedServices} marketplaceMode={marketplace.mode} />
        <MoreWaysToExplore services={previewExploreServices} />
        <GovernanceNote />
      </div>

      <UniversalTravelerBottomTabBar activeTab="explore" />
    </main>
  );
}
