import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../../src/components/traveler/UniversalTravelerBottomTabBar";

export const dynamic = "force-dynamic";

type FoodCultureMarketplaceService = {
  id: string;
  sourceType?: string;
  sourceId?: string;
  title: string;
  slug?: string;
  shortDescription?: string | null;
  category?: string;
  locationArea?: string | null;
  merchant?: {
    displayName?: string | null;
    merchantVerified?: boolean;
  };
  media?: {
    heroImageUrl?: string | null;
    imageUrl?: string | null;
    thumbnailUrl?: string | null;
    gallery?: string[];
    fallbackGradient?: string;
    icon?: string;
  };
  foodCulture?: {
    foodType?: string | null;
    cuisineType?: string | null;
    merchantType?: string | null;
    locationArea?: string | null;
    openingHoursLabel?: string | null;
    openStatus?: string | null;
    reservationMode?: string | null;
    walkInFriendly?: boolean | null;
    priceBand?: string | null;
    displayPrice?: string | null;
    menuAvailable?: boolean | null;
    signatureItem?: string | null;
    dietaryTags?: string[];
    familyFriendly?: boolean | null;
    groupFriendly?: boolean | null;
    cashAccepted?: boolean | null;
    gcashAccepted?: boolean | null;
    cardAccepted?: boolean | null;
    deliveryAvailable?: boolean | null;
    pickupAvailable?: boolean | null;
    passportStampEligible?: boolean;
    cultureStopEligible?: boolean;
    merchantVerified?: boolean;
    marketplaceVisible?: boolean;
  };
  governance?: {
    marketplaceVisible?: boolean;
    approvalStatus?: string;
    sourcePolicy?: string;
    notPassportTrail?: boolean;
    paymentDisabled?: boolean;
  };
  booking?: {
    ctaMode?: string;
    paymentAllowed?: boolean;
    reservationRequired?: boolean;
  };
};

type MarketplacePayload = {
  ok?: boolean;
  mode?: string;
  counts?: {
    total?: number;
    sourceRows?: number;
  };
  services?: FoodCultureMarketplaceService[];
};

type FoodCard = {
  id: string;
  title: string;
  eyebrow: string;
  type: string;
  location: string;
  price: string;
  signal: string;
  cta: string;
  href: string;
  tone: "aqua" | "blue" | "gold" | "slate" | "sand" | "violet";
  icon: string;
  imageUrl?: string | null;
  featured?: boolean;
  service?: FoodCultureMarketplaceService;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";

const foodChips = [
  "All",
  "Cafés",
  "Restaurants",
  "Seafood",
  "Brunch",
  "Dessert",
  "Coffee",
  "Culture",
  "Wellness",
  "Market",
];

const essentials: FoodCard[] = [
  {
    id: "cafe-stops",
    title: "Café stops",
    eyebrow: "Coffee / breakfast",
    type: "Café",
    location: "General Luna",
    price: "Check details",
    signal: "Local stop",
    cta: "View spots",
    href: "/traveler/settings?panel=assistant&topic=cafe%20stops%20Siargao",
    tone: "sand",
    icon: "☕",
    featured: true,
  },
  {
    id: "local-restaurants",
    title: "Local restaurants",
    eyebrow: "Island food",
    type: "Restaurant",
    location: "Siargao",
    price: "Check details",
    signal: "Local food",
    cta: "Ask guide",
    href: "/traveler/settings?panel=assistant&topic=local%20restaurants%20Siargao",
    tone: "gold",
    icon: "🍽️",
  },
  {
    id: "seafood-grill",
    title: "Seafood / grill",
    eyebrow: "Dinner ideas",
    type: "Seafood",
    location: "GL / island areas",
    price: "Check details",
    signal: "Group friendly",
    cta: "View spots",
    href: "/traveler/settings?panel=assistant&topic=seafood%20grill%20Siargao",
    tone: "aqua",
    icon: "🐟",
  },
  {
    id: "breakfast-brunch",
    title: "Breakfast / brunch",
    eyebrow: "Morning stop",
    type: "Brunch",
    location: "General Luna",
    price: "Check details",
    signal: "Start point",
    cta: "Plan stop",
    href: "/traveler/settings?panel=assistant&topic=breakfast%20brunch%20Siargao",
    tone: "sand",
    icon: "🍳",
  },
  {
    id: "dessert-snacks",
    title: "Dessert / snacks",
    eyebrow: "Quick stop",
    type: "Snacks",
    location: "Nearby areas",
    price: "Check details",
    signal: "Light stop",
    cta: "Ask guide",
    href: "/traveler/settings?panel=assistant&topic=dessert%20snacks%20Siargao",
    tone: "gold",
    icon: "🍰",
  },
  {
    id: "culture-food-stops",
    title: "Local culture stops",
    eyebrow: "Community taste",
    type: "Culture",
    location: "Island communities",
    price: "Check details",
    signal: "Respectful visit",
    cta: "Plan stop",
    href: "/traveler/settings?panel=assistant&topic=local%20culture%20food%20stops%20Siargao",
    tone: "violet",
    icon: "🧺",
  },
  {
    id: "healthy-wellness-food",
    title: "Healthy / wellness food",
    eyebrow: "Fresh options",
    type: "Wellness food",
    location: "Select areas",
    price: "Check details",
    signal: "Diet tags later",
    cta: "Ask guide",
    href: "/traveler/settings?panel=assistant&topic=healthy%20wellness%20food%20Siargao",
    tone: "aqua",
    icon: "🥗",
  },
  {
    id: "market-local-produce",
    title: "Market / local produce",
    eyebrow: "Later",
    type: "Market",
    location: "Local areas",
    price: "Check details",
    signal: "Local produce",
    cta: "Ask first",
    href: "/traveler/settings?panel=assistant&topic=market%20local%20produce%20Siargao",
    tone: "slate",
    icon: "🥭",
  },
];

async function getFoodCultureServices(): Promise<MarketplacePayload> {
  try {
    const res = await fetch(`${API_BASE}/traveler/food-culture/marketplace?limit=24`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return { ok: false, mode: "FOOD_CULTURE_UNAVAILABLE", counts: { total: 0, sourceRows: 0 }, services: [] };
    }

    return await res.json();
  } catch {
    return { ok: false, mode: "FOOD_CULTURE_UNAVAILABLE", counts: { total: 0, sourceRows: 0 }, services: [] };
  }
}

function normalizeText(value?: string | null, fallback = "Siargao") {
  const clean = String(value || "").trim();
  return clean || fallback;
}

function getServiceImage(service: FoodCultureMarketplaceService) {
  return (
    service.media?.heroImageUrl ||
    service.media?.imageUrl ||
    service.media?.thumbnailUrl ||
    service.media?.gallery?.[0] ||
    null
  );
}

function getFoodType(service: FoodCultureMarketplaceService) {
  const text = [
    service.foodCulture?.foodType,
    service.foodCulture?.cuisineType,
    service.foodCulture?.merchantType,
    service.title,
    service.shortDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/coffee|cafe|café/.test(text)) return "Café";
  if (/seafood|grill/.test(text)) return "Seafood";
  if (/breakfast|brunch/.test(text)) return "Brunch";
  if (/dessert|snack/.test(text)) return "Snacks";
  if (/culture|community|heritage/.test(text)) return "Culture";
  if (/wellness|healthy|vegan|vegetarian/.test(text)) return "Wellness food";
  if (/market|produce/.test(text)) return "Market";
  return "Local food";
}

function getFoodTone(type: string): FoodCard["tone"] {
  const key = type.toLowerCase();
  if (key.includes("café") || key.includes("cafe") || key.includes("brunch")) return "sand";
  if (key.includes("seafood") || key.includes("wellness")) return "aqua";
  if (key.includes("culture") || key.includes("community")) return "violet";
  if (key.includes("market")) return "slate";
  return "gold";
}

function getFoodIcon(type: string) {
  const key = type.toLowerCase();
  if (key.includes("café") || key.includes("cafe")) return "☕";
  if (key.includes("seafood")) return "🐟";
  if (key.includes("brunch")) return "🍳";
  if (key.includes("snack")) return "🍰";
  if (key.includes("culture")) return "🧺";
  if (key.includes("wellness")) return "🥗";
  if (key.includes("market")) return "🥭";
  return "🍽️";
}

function getFoodPrice(service: FoodCultureMarketplaceService) {
  return service.foodCulture?.displayPrice || service.foodCulture?.priceBand || "Check details";
}

function getFoodSignal(service: FoodCultureMarketplaceService) {
  const food = service.foodCulture || {};
  if (food.signatureItem) return food.signatureItem;
  if (food.menuAvailable) return "Menu";
  if (food.walkInFriendly) return "Walk-in";
  if (food.familyFriendly) return "Family";
  if (food.groupFriendly) return "Group";
  if (food.deliveryAvailable) return "Delivery";
  if (food.pickupAvailable) return "Pickup";
  if (food.cultureStopEligible) return "Culture stop";
  return "Local stop";
}

function getFoodCta(service: FoodCultureMarketplaceService) {
  if (service.booking?.ctaMode === "ASK_GUIDE") return "Ask guide";
  if (service.foodCulture?.reservationMode === "REQUEST_ONLY") return "Check details";
  return "View spot";
}

function getFoodHref(service: FoodCultureMarketplaceService) {
  if (service.slug) return `/traveler/explore/food-culture/${service.slug}`;
  return `/traveler/settings?panel=assistant&topic=${encodeURIComponent(service.title || "food culture stop")}`;
}

function mapServiceToFoodCard(service: FoodCultureMarketplaceService): FoodCard {
  const type = getFoodType(service);

  return {
    id: service.id || service.slug || service.title,
    title: service.title || "Food & Culture stop",
    eyebrow: "Verified local spot",
    type,
    location: normalizeText(service.foodCulture?.locationArea || service.locationArea || service.merchant?.displayName),
    price: getFoodPrice(service),
    signal: getFoodSignal(service),
    cta: getFoodCta(service),
    href: getFoodHref(service),
    tone: getFoodTone(type),
    icon: getFoodIcon(type),
    imageUrl: getServiceImage(service),
    service,
  };
}

function dedupeCards(cards: FoodCard[]) {
  const seen = new Set<string>();
  return cards.filter((card) => {
    const key = card.href || card.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cardSurface(tone: FoodCard["tone"]) {
  if (tone === "aqua") return "linear-gradient(135deg, #EAFBFA 0%, #FFFFFF 100%)";
  if (tone === "blue") return "linear-gradient(135deg, #EEF6FF 0%, #FFFFFF 100%)";
  if (tone === "gold") return "linear-gradient(135deg, #FFF8E6 0%, #FFFFFF 100%)";
  if (tone === "sand") return "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)";
  if (tone === "violet") return "linear-gradient(135deg, #F6F3FF 0%, #FFFFFF 100%)";
  return "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)";
}

function badgeColor(tone: FoodCard["tone"]) {
  if (tone === "aqua") return { bg: "rgba(32,169,183,0.13)", fg: "#0E777E", border: "rgba(32,169,183,0.24)" };
  if (tone === "blue") return { bg: "rgba(19,79,127,0.10)", fg: "#0B4B78", border: "rgba(19,79,127,0.20)" };
  if (tone === "gold") return { bg: "rgba(242,193,78,0.18)", fg: "#805B12", border: "rgba(242,193,78,0.32)" };
  if (tone === "sand") return { bg: "rgba(255,247,237,0.96)", fg: "#7A4D14", border: "rgba(242,193,78,0.20)" };
  if (tone === "violet") return { bg: "rgba(124,58,237,0.10)", fg: "#5B21B6", border: "rgba(124,58,237,0.18)" };
  return { bg: "rgba(15,23,42,0.06)", fg: "#334155", border: "rgba(15,23,42,0.12)" };
}

function FoodCardView({ card, index }: { card: FoodCard; index: number }) {
  const badge = badgeColor(card.tone);
  const isWide = card.featured || index === 0;
  const visualHeight = isWide ? 142 : index % 3 === 0 ? 128 : 112;

  return (
    <Link
      href={card.href}
      style={{
        gridColumn: isWide ? "span 2" : "span 1",
        display: "grid",
        overflow: "hidden",
        borderRadius: 24,
        textDecoration: "none",
        color: "#08365F",
        background: cardSurface(card.tone),
        border: "1px solid rgba(47,127,178,0.14)",
        boxShadow: isWide ? "0 16px 36px rgba(1,56,99,0.13)" : "0 9px 22px rgba(1,56,99,0.075)",
      }}
    >
      <div
        style={{
          minHeight: visualHeight,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: card.imageUrl
            ? `linear-gradient(180deg, rgba(7,32,61,0.02), rgba(7,32,61,0.24)), url(${card.imageUrl}) center/cover`
            : `radial-gradient(circle at 25% 0%, rgba(242,193,78,0.20), transparent 34%), ${cardSurface(card.tone)}`,
        }}
      >
        {!card.imageUrl ? (
          <span style={{ fontSize: isWide ? 45 : 34, filter: "drop-shadow(0 12px 16px rgba(7,32,61,0.14))" }}>
            {card.icon}
          </span>
        ) : null}

        <span
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            maxWidth: "calc(100% - 20px)",
            borderRadius: 999,
            padding: "6px 9px",
            background: "rgba(255,255,255,0.92)",
            color: "#08365F",
            border: "1px solid rgba(255,255,255,0.74)",
            boxShadow: "0 8px 18px rgba(1,56,99,0.10)",
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
            background: badge.bg,
            color: badge.fg,
            border: `1px solid ${badge.border}`,
            backdropFilter: "blur(12px)",
            fontSize: 9.5,
            lineHeight: 1,
            fontWeight: 950,
          }}
        >
          {card.signal}
        </span>
      </div>

      <div style={{ display: "grid", gap: 7, padding: isWide ? "13px 13px 14px" : "10px 10px 11px" }}>
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
            {card.eyebrow} · {card.type}
          </span>

          <strong
            style={{
              color: "#08365F",
              fontSize: isWide ? 18.5 : 14.2,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              fontWeight: 950,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: isWide ? 39 : 30,
            }}
          >
            {card.title}
          </strong>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ color: "#0B355F", fontSize: isWide ? 13 : 11.3, fontWeight: 950 }}>
            {card.price}
          </span>
          <span style={{ color: "#0596A5", fontSize: isWide ? 12 : 10.5, fontWeight: 950, whiteSpace: "nowrap" }}>
            {card.cta} →
          </span>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12 }}>
      <h2 style={{ margin: 0, color: "#08365F", fontSize: 18.5, lineHeight: 1.04, letterSpacing: "-0.02em", fontWeight: 950 }}>
        {title}
      </h2>
    </div>
  );
}

export default async function FoodCultureExplorePage() {
  const payload = await getFoodCultureServices();
  const apiCards = dedupeCards((payload.services || []).map(mapServiceToFoodCard)).slice(0, 12);

  return (
    <main
      data-osp-traveler-surface="true"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% -8%, rgba(242,193,78,0.14), transparent 34%), radial-gradient(circle at 94% 4%, rgba(32,169,183,0.12), transparent 30%), linear-gradient(180deg, #FFFCF4 0%, #FFFFFF 52%, #F4FCFA 100%)",
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
            background: "rgba(255,255,255,0.90)",
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
                background: "rgba(242,193,78,0.16)",
                color: "#805B12",
                border: "1px solid rgba(242,193,78,0.28)",
                fontSize: 10.5,
                lineHeight: 1,
                fontWeight: 950,
              }}
            >
              Food marketplace
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
              Food & Culture
            </h1>
            <p style={{ margin: "7px 0 0", color: "rgba(16,35,63,0.68)", fontSize: 12.8, lineHeight: 1.35, fontWeight: 760 }}>
              Cafés, local food, and culture stops.
            </p>
          </div>

          <nav aria-label="Food filters" style={{ display: "flex", gap: 7, overflowX: "auto", padding: "1px 1px 4px" }}>
            {foodChips.map((chip) => (
              <a
                key={chip}
                href="#food-essentials"
                style={{
                  flex: "0 0 auto",
                  minHeight: 32,
                  borderRadius: 999,
                  padding: "0 11px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: chip === "All" ? "#08365F" : "rgba(255,255,255,0.88)",
                  color: chip === "All" ? "#FFFFFF" : "#08365F",
                  border: "1px solid rgba(47,127,178,0.14)",
                  boxShadow: "0 7px 16px rgba(1,56,99,0.06)",
                  textDecoration: "none",
                  fontSize: 11,
                  lineHeight: 1,
                  fontWeight: 950,
                  whiteSpace: "nowrap",
                }}
              >
                {chip}
              </a>
            ))}
          </nav>
        </header>

        <section id="food-essentials" style={{ display: "grid", gap: 9 }}>
          <SectionHeader title="Local discovery" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
            {essentials.map((card, index) => (
              <FoodCardView key={card.id} card={card} index={index} />
            ))}
          </div>
        </section>

        <section id="verified-food" style={{ display: "grid", gap: 9 }}>
          <SectionHeader title="Verified food cards" />

          {apiCards.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
              {apiCards.map((card, index) => (
                <FoodCardView key={card.id} card={card} index={index + essentials.length} />
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
                gap: 9,
              }}
            >
              <span style={{ color: "#0E8B96", fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Local partners
              </span>
              <strong style={{ color: "#08365F", fontSize: 19, lineHeight: 1.05, fontWeight: 950 }}>
                Food cards will appear when available.
              </strong>
              <p style={{ margin: 0, color: "rgba(16,35,63,0.68)", fontSize: 12.5, lineHeight: 1.35, fontWeight: 740 }}>
                Use the essentials above for quick food guidance.
              </p>
            </div>
          )}
        </section>

        <section
          aria-label="Food visit checks"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          {[
            ["Area", "Check location"],
            ["Menu", "Ask details"],
            ["Visit", "Plan stop"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                borderRadius: 18,
                padding: "10px 9px",
                background: "rgba(255,255,255,0.86)",
                border: "1px solid rgba(47,127,178,0.12)",
                boxShadow: "0 8px 18px rgba(1,56,99,0.05)",
              }}
            >
              <span style={{ display: "block", color: "#0E8B96", fontSize: 9.5, lineHeight: 1, fontWeight: 950 }}>
                {label}
              </span>
              <strong style={{ display: "block", marginTop: 5, color: "#08365F", fontSize: 11.2, lineHeight: 1.08, fontWeight: 950 }}>
                {value}
              </strong>
            </div>
          ))}
        </section>

        <section
          style={{
            borderRadius: 26,
            padding: 15,
            background:
              "radial-gradient(circle at 12% 0%, rgba(242,193,78,0.16), transparent 36%), linear-gradient(135deg, #FFF8E6 0%, #FFFFFF 100%)",
            border: "1px solid rgba(242,193,78,0.26)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
            display: "grid",
            gap: 10,
          }}
        >
          <span style={{ color: "#8A6414", fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Need local food guidance?
          </span>
          <h2 style={{ margin: 0, color: "#08365F", fontSize: 21, lineHeight: 1.05, letterSpacing: "-0.025em", fontWeight: 950 }}>
            Match food stops to your route.
          </h2>
          <p style={{ margin: 0, color: "rgba(16,35,63,0.68)", fontSize: 12.6, lineHeight: 1.35, fontWeight: 740 }}>
            Ask Kuya Tala for cafés, local food, and culture stops.
          </p>
          <Link
            href="/traveler/settings?panel=assistant&topic=food%20culture%20Siargao"
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
            Ask Kuya Tala
          </Link>
        </section>
      </div>

      <UniversalTravelerBottomTabBar />
    </main>
  );
}
