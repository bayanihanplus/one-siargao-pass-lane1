import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../../src/components/traveler/UniversalTravelerBottomTabBar";

export const dynamic = "force-dynamic";

type MarketplaceService = {
  id: string;
  sourceType?: string;
  sourceId?: string;
  title: string;
  slug?: string;
  shortDescription?: string;
  category?: string;
  locationArea?: string | null;
  operator?: {
    displayName?: string | null;
    verificationStatus?: string | null;
    dotAccreditation?: {
      required?: boolean;
      isAccredited?: boolean | null;
      status?: string | null;
    };
  };
  media?: {
    heroImageUrl?: string | null;
    imageUrl?: string | null;
    thumbnailUrl?: string | null;
    gallery?: string[];
    fallbackGradient?: string;
    icon?: string;
  };
  taxonomy?: {
    serviceCategory?: string;
    serviceSubcategory?: string | null;
    commercialLane?: string;
  };
  exposure?: {
    featuredActive?: boolean;
    placementTier?: string;
    readinessScore?: number;
    finalExposureScore?: number;
    nicheTags?: string[];
  };
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
  };
  booking?: {
    ctaMode?: string;
    bookingMode?: string;
    instantCheckoutAllowed?: boolean;
  };
  governance?: {
    marketplaceVisible?: boolean;
    approvalStatus?: string;
    requiresManifest?: boolean;
    requiresGuide?: boolean;
    requiresClearance?: boolean;
    qrValidationRequired?: boolean;
    stampEligible?: boolean;
    passportTrailEligible?: boolean;
  };
  commercialBadges?: string[];
  badges?: string[];
};

type MarketplacePayload = {
  ok?: boolean;
  mode?: string;
  generatedAt?: string;
  counts?: {
    total?: number;
    spmPackages?: number;
    operatorActivities?: number;
  };
  services?: MarketplaceService[];
};

type CompactTourCard = {
  id: string;
  title: string;
  eyebrow: string;
  location: string;
  badge: string;
  price: string;
  href: string;
  imageUrl: string;
  tone: "aqua" | "blue" | "gold" | "sand";
  cta: string;
  featured?: boolean;
  service?: MarketplaceService;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";

const officialRoutes: CompactTourCard[] = [
  {
    id: "gl-island-hopping",
    title: "General Luna Island Hopping",
    eyebrow: "Passport Trail",
    location: "Guyam · Daku · Naked",
    badge: "Official route",
    price: "Joiner or private",
    href: "/traveler/explore/tours/general-luna-island-hopping",
    imageUrl: "/osp/temp-tour-posters/tri-island-joiner.png",
    tone: "blue",
    cta: "View options",
    featured: true,
  },
  {
    id: "sugba-lagoon",
    title: "Sugba Lagoon Route",
    eyebrow: "Lagoon tour",
    location: "Del Carmen",
    badge: "Route options",
    price: "Review route",
    href: "/traveler/explore/tours/sugba-lagoon-mangrove-tours",
    imageUrl: "/osp/temp-tour-posters/sugba-lagoon-mangrove-tours.png",
    tone: "aqua",
    cta: "View route",
  },
  {
    id: "bucas-sohoton",
    title: "Bucas Grande & Sohoton",
    eyebrow: "Dapa-side route",
    location: "Cove · Lagoon · Cave",
    badge: "Request first",
    price: "Confirm route",
    href: "/traveler/explore/tours/bucas-grande-sohoton-tour",
    imageUrl: "/osp/temp-tour-posters/bucas-grande-sohoton-tour.png",
    tone: "sand",
    cta: "View route",
  },
  {
    id: "siargao-land-route",
    title: "Private Siargao Land Route",
    eyebrow: "Land tour",
    location: "South · North · DIY",
    badge: "Private setup",
    price: "Request route",
    href: "/traveler/explore/tours/private-siargao-land-route",
    imageUrl: "/osp/temp-tour-posters/private-diy-land-tour.png",
    tone: "gold",
    cta: "Plan route",
  },
];

const categoryChips = [
  { label: "All", href: "#marketplace" },
  { label: "Island", href: "#official-routes" },
  { label: "Lagoon", href: "#official-routes" },
  { label: "Land", href: "#official-routes" },
  { label: "Surf", href: "#marketplace" },
  { label: "Private", href: "#custom-route" },
];

async function getMarketplaceServices(): Promise<MarketplacePayload> {
  try {
    const res = await fetch(`${API_BASE}/traveler/marketplace/services?limit=24`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return {
        ok: false,
        mode: "MARKETPLACE_UNAVAILABLE",
        generatedAt: new Date().toISOString(),
        counts: { total: 0, spmPackages: 0, operatorActivities: 0 },
        services: [],
      };
    }

    return await res.json();
  } catch {
    return {
      ok: false,
      mode: "MARKETPLACE_UNAVAILABLE",
      generatedAt: new Date().toISOString(),
      counts: { total: 0, spmPackages: 0, operatorActivities: 0 },
      services: [],
    };
  }
}

function normalizeCategory(value?: string) {
  const raw = String(value || "TOUR").replace(/_/g, " ").trim();
  if (!raw) return "Tour";
  return raw
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getServiceImage(service: MarketplaceService) {
  return (
    service.media?.heroImageUrl ||
    service.media?.imageUrl ||
    service.media?.thumbnailUrl ||
    service.media?.gallery?.[0] ||
    "/osp/osp-verified-logo.png"
  );
}

function getServiceBadge(service: MarketplaceService) {
  if (service.governance?.passportTrailEligible) return "Passport Trail";
  if (service.exposure?.featuredActive) return "Featured";
  if (service.booking?.ctaMode === "REQUEST_AVAILABILITY") return "Request";
  return "Verified";
}

function getServiceCta(service: MarketplaceService) {
  if (service.booking?.ctaMode === "ADD_TO_TRAIL") return "View trail";
  if (service.booking?.ctaMode === "REQUEST_AVAILABILITY") return "Check availability";
  if (service.booking?.ctaMode === "START_ISLAND_HOPPING_REQUEST") return "View options";
  return "View details";
}

function getServiceHref(service: MarketplaceService) {
  if (service.booking?.ctaMode === "ADD_TO_TRAIL" && service.slug) {
    return `/traveler/passport-trails/${service.slug}`;
  }

  if (service.slug) {
    return `/traveler/explore/tours/${service.slug}`;
  }

  return `/traveler/settings?panel=assistant&topic=${encodeURIComponent(service.title)}`;
}

function getServicePrice(service: MarketplaceService) {
  if (service.price?.displayPrice) return service.price.displayPrice;
  if (service.price?.pricingReady) return "Price ready";
  if (service.booking?.ctaMode === "REQUEST_AVAILABILITY") return "Request first";
  return "View options";
}

function getServiceLocation(service: MarketplaceService) {
  return service.locationArea || service.operator?.displayName || "Siargao";
}

function getServiceTone(service: MarketplaceService): CompactTourCard["tone"] {
  const category = String(service.category || service.taxonomy?.serviceCategory || "").toUpperCase();
  if (category.includes("ISLAND") || category.includes("HOPPING")) return "blue";
  if (category.includes("SURF") || category.includes("LAGOON")) return "aqua";
  if (category.includes("LAND") || category.includes("PRIVATE")) return "gold";
  return "sand";
}

function mapServiceToCard(service: MarketplaceService): CompactTourCard {
  return {
    id: service.id || service.slug || service.title,
    title: service.title || "Verified Siargao experience",
    eyebrow: normalizeCategory(service.category || service.taxonomy?.serviceCategory),
    location: getServiceLocation(service),
    badge: getServiceBadge(service),
    price: getServicePrice(service),
    href: getServiceHref(service),
    imageUrl: getServiceImage(service),
    tone: getServiceTone(service),
    cta: getServiceCta(service),
    service,
  };
}

function sortMarketplaceServices(services: MarketplaceService[]) {
  return [...services].sort((a, b) => {
    const aOfficial = a.sourceType === "SPM_TRAIL_PACKAGE" ? 1 : 0;
    const bOfficial = b.sourceType === "SPM_TRAIL_PACKAGE" ? 1 : 0;
    if (aOfficial !== bOfficial) return bOfficial - aOfficial;

    const aPrice = a.price?.pricingReady ? 1 : 0;
    const bPrice = b.price?.pricingReady ? 1 : 0;
    if (aPrice !== bPrice) return bPrice - aPrice;

    const aFeatured = a.exposure?.featuredActive ? 1 : 0;
    const bFeatured = b.exposure?.featuredActive ? 1 : 0;
    if (aFeatured !== bFeatured) return bFeatured - aFeatured;

    return String(a.title || "").localeCompare(String(b.title || ""));
  });
}

function dedupeCards(cards: CompactTourCard[]) {
  const seen = new Set<string>();
  return cards.filter((card) => {
    const key = card.href || card.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cardSurface(tone: CompactTourCard["tone"]) {
  if (tone === "blue") return "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)";
  if (tone === "aqua") return "linear-gradient(135deg, #EAFBFA 0%, #FFFFFF 100%)";
  if (tone === "gold") return "linear-gradient(135deg, #FFF8E6 0%, #FFFFFF 100%)";
  return "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)";
}

function badgeSurface(tone: CompactTourCard["tone"]) {
  if (tone === "gold") return { background: "rgba(242,193,78,0.18)", color: "#805B12", border: "rgba(242,193,78,0.32)" };
  if (tone === "aqua") return { background: "rgba(32,169,183,0.13)", color: "#0E777E", border: "rgba(32,169,183,0.24)" };
  if (tone === "blue") return { background: "rgba(19,79,127,0.10)", color: "#0B4B78", border: "rgba(19,79,127,0.20)" };
  return { background: "rgba(255,247,237,0.90)", color: "#7A4D14", border: "rgba(242,193,78,0.22)" };
}

function CompactTourCardView({ card, index }: { card: CompactTourCard; index: number }) {
  const badge = badgeSurface(card.tone);
  const imageHeight = card.featured ? 158 : index % 3 === 0 ? 142 : 124;

  return (
    <Link
      href={card.href}
      style={{
        gridColumn: card.featured ? "span 2" : "span 1",
        display: "grid",
        overflow: "hidden",
        borderRadius: 24,
        textDecoration: "none",
        color: "#0B355F",
        background: cardSurface(card.tone),
        border: "1px solid rgba(47,127,178,0.14)",
        boxShadow: card.featured
          ? "0 18px 42px rgba(1,56,99,0.16)"
          : "0 10px 24px rgba(1,56,99,0.08)",
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: imageHeight,
          background: `linear-gradient(180deg, rgba(7,32,61,0.05), rgba(7,32,61,0.26)), url(${card.imageUrl}) center/cover`,
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            maxWidth: "calc(100% - 20px)",
            borderRadius: 999,
            padding: "6px 9px",
            background: "rgba(255,255,255,0.92)",
            color: "#0B355F",
            border: "1px solid rgba(255,255,255,0.74)",
            boxShadow: "0 8px 18px rgba(1,56,99,0.12)",
            fontSize: 10,
            lineHeight: 1,
            fontWeight: 950,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {card.location}
        </span>

        <span
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            borderRadius: 999,
            padding: "6px 8px",
            background: badge.background,
            color: badge.color,
            border: `1px solid ${badge.border}`,
            backdropFilter: "blur(12px)",
            fontSize: 9.6,
            lineHeight: 1,
            fontWeight: 950,
          }}
        >
          {card.badge}
        </span>
      </div>

      <div style={{ padding: card.featured ? "13px 13px 14px" : "10px 10px 11px", display: "grid", gap: 7 }}>
        <div style={{ display: "grid", gap: 4 }}>
          <span
            style={{
              color: "#0E8B96",
              fontSize: 9.5,
              lineHeight: 1,
              fontWeight: 950,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            {card.eyebrow}
          </span>

          <strong
            style={{
              color: "#08365F",
              fontSize: card.featured ? 19 : 14.2,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              fontWeight: 950,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: card.featured ? 40 : 30,
            }}
          >
            {card.title}
          </strong>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ color: "#0B355F", fontSize: card.featured ? 13 : 11.5, fontWeight: 950 }}>
            {card.price}
          </span>
          <span
            style={{
              color: "#0596A5",
              fontSize: card.featured ? 12 : 10.5,
              fontWeight: 950,
              whiteSpace: "nowrap",
            }}
          >
            {card.cta} →
          </span>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ title, actionHref, actionLabel }: { title: string; actionHref?: string; actionLabel?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12 }}>
      <h2 style={{ margin: 0, color: "#08365F", fontSize: 18.5, lineHeight: 1.04, letterSpacing: "-0.02em", fontWeight: 950 }}>
        {title}
      </h2>
      {actionHref && actionLabel ? (
        <Link href={actionHref} style={{ color: "#0596A5", fontSize: 11, fontWeight: 950, textDecoration: "none", whiteSpace: "nowrap" }}>
          {actionLabel} →
        </Link>
      ) : null}
    </div>
  );
}

export default async function ToursMarketplacePage() {
  const marketplace = await getMarketplaceServices();
  const services = sortMarketplaceServices(marketplace.services || []);
  const marketplaceCards = dedupeCards(services.map(mapServiceToCard));
  const visibleMarketplaceCards = marketplaceCards.slice(0, 12);

  return (
    <main className="osp-traveler-bottom-tab-safe-page"
      data-osp-traveler-surface="true"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 18% -6%, rgba(32,169,183,0.16), transparent 34%), radial-gradient(circle at 94% 4%, rgba(242,193,78,0.12), transparent 30%), linear-gradient(180deg, #F7FCFB 0%, #FFFFFF 52%, #FFF9EC 100%)",
        color: "#10233F",
        padding: "14px 13px 104px",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto", display: "grid", gap: 14 }}>
        <header
          style={{
            display: "grid",
            gap: 10,
            borderRadius: 26,
            padding: 14,
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(47,127,178,0.14)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <Link
              href="/traveler/explore"
              aria-label="Back to Explore"
              style={{
                width: 38,
                height: 38,
                borderRadius: 15,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                color: "#08365F",
                background: "#F4FCFA",
                border: "1px solid rgba(32,169,183,0.16)",
                fontWeight: 950,
              }}
            >
              ←
            </Link>

            <span
              style={{
                borderRadius: 999,
                padding: "7px 10px",
                background: "rgba(32,169,183,0.10)",
                color: "#0E777E",
                border: "1px solid rgba(32,169,183,0.18)",
                fontSize: 10.5,
                lineHeight: 1,
                fontWeight: 950,
              }}
            >
              Tours marketplace
            </span>
          </div>

          <div>
            <p
              style={{
                margin: 0,
                color: "#0E8B96",
                fontSize: 10,
                lineHeight: 1,
                fontWeight: 950,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Explore by lane
            </p>
            <h1
              style={{
                margin: "6px 0 0",
                color: "#08365F",
                fontSize: 26,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                fontWeight: 950,
              }}
            >
              Tours in Siargao
            </h1>
            <p style={{ margin: "7px 0 0", color: "rgba(16,35,63,0.68)", fontSize: 12.8, lineHeight: 1.35, fontWeight: 760 }}>
              Official routes and verified local experiences.
            </p>
          </div>

          <nav aria-label="Tour filters" style={{ display: "flex", gap: 7, overflowX: "auto", padding: "1px 1px 4px" }}>
            {categoryChips.map((chip) => (
              <a
                key={chip.label}
                href={chip.href}
                style={{
                  flex: "0 0 auto",
                  minHeight: 32,
                  borderRadius: 999,
                  padding: "0 11px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: chip.label === "All" ? "#08365F" : "rgba(255,255,255,0.88)",
                  color: chip.label === "All" ? "#FFFFFF" : "#08365F",
                  border: "1px solid rgba(47,127,178,0.14)",
                  boxShadow: "0 7px 16px rgba(1,56,99,0.06)",
                  textDecoration: "none",
                  fontSize: 11,
                  lineHeight: 1,
                  fontWeight: 950,
                  whiteSpace: "nowrap",
                }}
              >
                {chip.label}
              </a>
            ))}
          </nav>
        </header>

        <section id="official-routes" style={{ display: "grid", gap: 9 }}>
          <SectionHeader title="Featured official routes" actionHref="/traveler/passport-trails" actionLabel="Trails" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
            {officialRoutes.map((card, index) => (
              <CompactTourCardView key={card.id} card={card} index={index} />
            ))}
          </div>
        </section>

        <section id="marketplace" style={{ display: "grid", gap: 9 }}>
          <SectionHeader title="Verified local tours" />

          {visibleMarketplaceCards.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
              {visibleMarketplaceCards.map((card, index) => (
                <CompactTourCardView key={card.id} card={card} index={index + 4} />
              ))}
            </div>
          ) : (
            <div
              style={{
                borderRadius: 24,
                padding: 15,
                background: "rgba(255,255,255,0.90)",
                border: "1px solid rgba(47,127,178,0.14)",
                boxShadow: "0 12px 28px rgba(1,56,99,0.08)",
                display: "grid",
                gap: 10,
              }}
            >
              <span style={{ color: "#0E8B96", fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Verified supply
              </span>
              <strong style={{ color: "#08365F", fontSize: 19, lineHeight: 1.05, fontWeight: 950 }}>
                Local tour cards will appear after approval.
              </strong>
              <p style={{ margin: 0, color: "rgba(16,35,63,0.68)", fontSize: 12.5, lineHeight: 1.38, fontWeight: 740 }}>
                Browse official routes first while partner services are prepared.
              </p>
              <Link
                href="/traveler/passport-trails"
                style={{
                  minHeight: 42,
                  borderRadius: 17,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  background: "#08365F",
                  color: "#FFFFFF",
                  fontSize: 12.5,
                  fontWeight: 950,
                }}
              >
                View Passport Trails
              </Link>
            </div>
          )}
        </section>

        <section
          id="custom-route"
          style={{
            borderRadius: 26,
            padding: 15,
            background:
              "radial-gradient(circle at 12% 0%, rgba(32,169,183,0.14), transparent 36%), linear-gradient(135deg, #FFF8E6 0%, #FFFFFF 100%)",
            border: "1px solid rgba(242,193,78,0.26)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
            display: "grid",
            gap: 10,
          }}
        >
          <span style={{ color: "#8A6414", fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Custom route
          </span>
          <h2 style={{ margin: 0, color: "#08365F", fontSize: 21, lineHeight: 1.05, letterSpacing: "-0.025em", fontWeight: 950 }}>
            Want a private plan?
          </h2>
          <p style={{ margin: 0, color: "rgba(16,35,63,0.68)", fontSize: 12.6, lineHeight: 1.38, fontWeight: 740 }}>
            Build a route for land tours, surf days, food stops, or private island plans.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Link
              href="/traveler/passport-trails/diy-trail-builder"
              style={{
                minHeight: 42,
                borderRadius: 17,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                background: "#08365F",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 950,
              }}
            >
              Build trail
            </Link>
            <Link
              href="/traveler/passport-map"
              style={{
                minHeight: 42,
                borderRadius: 17,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                background: "rgba(255,255,255,0.82)",
                color: "#08365F",
                border: "1px solid rgba(47,127,178,0.14)",
                fontSize: 12,
                fontWeight: 950,
              }}
            >
              Open map
            </Link>
          </div>
        </section>
      </div>

      <UniversalTravelerBottomTabBar />
    </main>
  );
}
