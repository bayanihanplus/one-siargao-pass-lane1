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
  { label: "Siargao Tour Operators", href: "/traveler/explore/tours", icon: "🚐" },
  { label: "Rentals", href: "/traveler/explore/rentals", icon: "🛵" },
  { label: "Surfing Schools", href: "/traveler/explore/surf-schools", icon: "🏄" },
  { label: "Food & Culture", href: "/traveler/explore/food-culture", icon: "🍽️" },
  { label: "Beauty & Health", href: "/traveler/explore/beauty-health", icon: "🌿" },
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
  { label: "Island Hopping", value: "ISLAND_HOPPING" },
  { label: "Passport Trails", value: "PASSPORT_TRAILS" },
  { label: "Partner Tours", value: "PARTNER_TOURS" },
  { label: "Surf", value: "SURF" },
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
    <header style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link
          href="/traveler/home"
          aria-label="Back to traveler home"
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: "#ffffff",
            border: "1px solid rgba(15, 23, 42, 0.08)",
            color: "#0b3768",
            textDecoration: "none",
            boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
            fontSize: 24,
            fontWeight: 900,
          }}
        >
          ‹
        </Link>

        <div style={{ textAlign: "center", display: "grid", placeItems: "center", gap: 7 }}>
          <img
            src="/osp/osp-logo.png"
            alt="One Siargao Pass"
            style={{
              width: 92,
              maxHeight: 58,
              objectFit: "contain",
              display: "block",
              filter: "drop-shadow(0 10px 18px rgba(6,120,137,0.12))",
            }}
          />
        </div>

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: "#f8fbfd",
            border: "1px solid rgba(6,120,137,0.14)",
            fontSize: 20,
          }}
        >
          🏝️
        </div>
      </div>

      <h1
        style={{
          margin: 0,
          textAlign: "center",
          fontSize: 32,
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
          color: "#102f57",
          fontWeight: 950,
        }}
      >
        Explore Siargao
      </h1>
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
    <section style={{ display: "grid", gap: 10 }}>
      <form action="/traveler/explore" method="get" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
        {category && category !== "ALL" ? <input type="hidden" name="category" value={category} /> : null}

        <label
          style={{
            minHeight: 58,
            borderRadius: 18,
            background: "#ffffff",
            border: "1px solid rgba(15,23,42,0.10)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 16px",
            color: "#64748b",
            fontWeight: 750,
            boxShadow: "0 12px 28px rgba(15,23,42,0.04)",
          }}
        >
          <span style={{ fontSize: 20 }}>⌕</span>
          <input
            name="q"
            defaultValue={q}
            placeholder="Search experiences, trails, islands"
            style={{
              width: "100%",
              border: 0,
              outline: 0,
              background: "transparent",
              color: "#102f57",
              fontSize: 14,
              fontWeight: 800,
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            minHeight: 58,
            borderRadius: 18,
            padding: "0 16px",
            border: "1px solid rgba(15,23,42,0.10)",
            background: "#ffffff",
            color: "#102f57",
            fontWeight: 900,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 12px 28px rgba(15,23,42,0.04)",
            cursor: "pointer",
          }}
        >
          ⚙︎ <span>Search</span>
        </button>
      </form>

      <div
        aria-label="Explore filters"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          padding: "2px 0 4px",
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
                borderRadius: 999,
                padding: "9px 12px",
                background: active ? "linear-gradient(135deg,#067889,#089fa5)" : "#ffffff",
                border: active ? "1px solid rgba(6,120,137,0.28)" : "1px solid rgba(6,120,137,0.12)",
                color: active ? "#ffffff" : "#0b3768",
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 950,
                boxShadow: active ? "0 12px 24px rgba(6,120,137,0.16)" : "0 8px 18px rgba(15,23,42,0.04)",
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
  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <h2 style={{ margin: 0, color: "#102f57", fontSize: 24, lineHeight: 1.1 }}>
            Featured verified services
          </h2>
          <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 12.5, lineHeight: 1.35, fontWeight: 750 }}>
            Live marketplace services only. Preview lanes are separated below.
          </p>
        </div>
        <Link href="/traveler/explore/tours" style={{ color: "#078da0", fontWeight: 900, textDecoration: "none", fontSize: 13 }}>
          View all →
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
          Source: governed traveler marketplace catalog
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
        {services.map((service) => (
          <Link
            key={service.title}
            href={service.href}
            style={{
              flex: "0 0 238px",
              scrollSnapAlign: "start",
              borderRadius: 20,
              overflow: "hidden",
              background: "#ffffff",
              border: "1px solid rgba(15,23,42,0.10)",
              boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
              textDecoration: "none",
              color: "#102f57",
            }}
          >
            <div
              style={{
                height: 126,
                position: "relative",
                overflow: "hidden",
                background: service.visualBackground || serviceTone(service.tone),
              }}
            >
              {service.mediaUrl ? (
                <img
                  src={service.mediaUrl}
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
                  background: service.mediaUrl
                    ? "linear-gradient(180deg, rgba(2,24,39,0.12) 0%, rgba(2,24,39,0.44) 100%)"
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

              {!service.mediaUrl && service.mediaTruth ? (
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
                <strong style={{ display: "block", fontSize: 16.5, lineHeight: 1.15, marginBottom: 6 }}>
                  {service.title}
                </strong>
                <p style={{ margin: 0, color: "#64748b", fontSize: 12, lineHeight: 1.35, fontWeight: 750 }}>
                  {service.body}
                </p>
              </div>

              <div
                style={{
                  borderRadius: 16,
                  background: "#f8fafc",
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
                    {service.price}
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
                  {service.bookingModeLabel}
                </span>
                <span style={{ color: "#0b3768", fontSize: 12.5, fontWeight: 950 }}>
                  {service.ctaLabel || "View details"} →
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
          gap: 10,
          overflowX: "auto",
          padding: "2px 2px 8px",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {services.map((service) => (
          <Link
            key={service.title}
            href={service.href}
            style={{
              flex: "0 0 180px",
              scrollSnapAlign: "start",
              borderRadius: 20,
              overflow: "hidden",
              background: "#ffffff",
              border: "1px solid rgba(15,23,42,0.10)",
              boxShadow: "0 12px 28px rgba(15,23,42,0.07)",
              textDecoration: "none",
              color: "#102f57",
            }}
          >
            <div
              style={{
                height: 92,
                background: service.visualBackground || serviceTone(service.tone),
                position: "relative",
                padding: 10,
              }}
            >
              <span
                style={{
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.82)",
                  color: "#475569",
                  padding: "5px 7px",
                  fontSize: 9.8,
                  fontWeight: 950,
                }}
              >
                Preview lane
              </span>
            </div>
            <div style={{ padding: 12, display: "grid", gap: 8 }}>
              <strong style={{ display: "block", fontSize: 14.5, lineHeight: 1.18 }}>
                {service.title}
              </strong>
              <p style={{ margin: 0, color: "#64748b", fontSize: 11.2, lineHeight: 1.35, fontWeight: 750 }}>
                {service.body}
              </p>
              <span style={{ color: "#078da0", fontSize: 12, fontWeight: 950 }}>
                Explore →
              </span>
            </div>
          </Link>
        ))}
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
        gridTemplateColumns: "44px 1fr auto",
        gap: 12,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 16,
          display: "grid",
          placeItems: "center",
          background: "#ffffff",
          border: "1px solid rgba(217,119,6,0.15)",
          fontSize: 24,
        }}
      >
        ⛨
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
  const previewExploreServices = fallbackFeaturedServices
    .filter((item) => !existingTitles.has(item.title))
    .slice(0, 5);

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
