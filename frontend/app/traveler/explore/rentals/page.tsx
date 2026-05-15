import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../../src/components/traveler/UniversalTravelerBottomTabBar";

export const dynamic = "force-dynamic";

type RentalMarketplaceService = {
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
    inventoryCount?: number | null;
  };
  booking?: {
    ctaMode?: string;
    bookingMode?: string;
    instantCheckoutAllowed?: boolean;
  };
  governance?: {
    marketplaceVisible?: boolean;
    approvalStatus?: string;
  };
  rental?: {
    rentalType?: string;
    pickupArea?: string;
    dropoffArea?: string;
    pricingMode?: string;
    baseDailyRate?: number;
    tripRate?: number;
    requestRateLabel?: string;
    availabilityStatus?: string;
    requestRequired?: boolean;
    inventoryCount?: number;
    licenseRequired?: boolean;
    helmetIncluded?: boolean;
    depositRequired?: boolean;
    depositAmount?: number;
    validIdRequired?: boolean;
    deliveryAvailable?: boolean;
    driverIncluded?: boolean;
    operatorVerified?: boolean;
    marketplaceVisible?: boolean;
  };
};

type MarketplacePayload = {
  ok?: boolean;
  mode?: string;
  counts?: {
    total?: number;
    spmPackages?: number;
    operatorActivities?: number;
  };
  services?: RentalMarketplaceService[];
};

type RentalCard = {
  id: string;
  title: string;
  eyebrow: string;
  type: string;
  location: string;
  price: string;
  requirement: string;
  cta: string;
  href: string;
  tone: "aqua" | "blue" | "gold" | "slate" | "sand";
  icon: string;
  imageUrl?: string | null;
  featured?: boolean;
  service?: RentalMarketplaceService;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";

const rentalChips = [
  "All",
  "Motorbike",
  "E-bike",
  "Car",
  "Van",
  "Airport",
  "Dapa",
  "Surfboard",
  "Drone",
  "GoPro",
];

const essentials: RentalCard[] = [
  {
    id: "motorbike-scooter",
    title: "Motorbike / scooter rental",
    eyebrow: "Mobility",
    type: "Daily rental",
    location: "General Luna",
    price: "From ₱350/day",
    requirement: "Helmet / ID",
    cta: "Check availability",
    href: "/traveler/settings?panel=assistant&topic=motorbike%20scooter%20rental",
    tone: "aqua",
    icon: "🛵",
    featured: true,
  },
  {
    id: "ebike-bicycle",
    title: "E-bike / bicycle rental",
    eyebrow: "Light ride",
    type: "Daily rental",
    location: "Town routes",
    price: "Request rate",
    requirement: "Pickup area",
    cta: "Request rental",
    href: "/traveler/settings?panel=assistant&topic=e-bike%20bicycle%20rental",
    tone: "sand",
    icon: "🚲",
  },
  {
    id: "car-van",
    title: "Car / van rental",
    eyebrow: "Group mobility",
    type: "Private vehicle",
    location: "Islandwide",
    price: "Car ₱2,800 · Van ₱3,500/day",
    requirement: "Driver option",
    cta: "View rates",
    href: "/traveler/settings?panel=assistant&topic=car%20van%20rental",
    tone: "blue",
    icon: "🚐",
  },
  {
    id: "airport-dapa-pickup",
    title: "Airport / Dapa pickup",
    eyebrow: "Transfer",
    type: "Trip rate",
    location: "Sayak · Dapa",
    price: "From ₱1,500/trip",
    requirement: "Time needed",
    cta: "Request pickup",
    href: "/traveler/settings?panel=assistant&topic=airport%20dapa%20pickup",
    tone: "gold",
    icon: "🚕",
  },
  {
    id: "private-transport",
    title: "Private transport",
    eyebrow: "Flexible route",
    type: "Driver support",
    location: "Siargao",
    price: "Request rate",
    requirement: "Route needed",
    cta: "Plan transport",
    href: "/traveler/settings?panel=assistant&topic=private%20transport%20siargao",
    tone: "slate",
    icon: "🚘",
  },
  {
    id: "surfboard-rental",
    title: "Surfboard rental",
    eyebrow: "Surf gear",
    type: "Board rental",
    location: "Cloud 9 / GL",
    price: "Request rate",
    requirement: "Skill level",
    cta: "Request board",
    href: "/traveler/explore/surf-schools",
    tone: "aqua",
    icon: "🏄",
  },
  {
    id: "drone-rental",
    title: "Drone",
    eyebrow: "Media gear",
    type: "Gear request",
    location: "Operator-assisted",
    price: "Request rate",
    requirement: "Rules apply",
    cta: "Ask first",
    href: "/traveler/settings?panel=assistant&topic=drone%20rental%20siargao",
    tone: "sand",
    icon: "📷",
  },
  {
    id: "gopro-gear",
    title: "GoPro / gear rentals",
    eyebrow: "Trip gear",
    type: "Gear request",
    location: "Select areas",
    price: "Request rate",
    requirement: "Deposit terms",
    cta: "Request gear",
    href: "/traveler/settings?panel=assistant&topic=gopro%20gear%20rental",
    tone: "gold",
    icon: "🎒",
  },
];

async function getRentalServices(): Promise<MarketplacePayload> {
  try {
    const res = await fetch(`${API_BASE}/traveler/marketplace/services?category=RENTALS&limit=24`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return { ok: false, mode: "RENTALS_UNAVAILABLE", counts: { total: 0 }, services: [] };
    }

    return await res.json();
  } catch {
    return { ok: false, mode: "RENTALS_UNAVAILABLE", counts: { total: 0 }, services: [] };
  }
}

function normalizeText(value?: string | null, fallback = "Siargao") {
  const clean = String(value || "").trim();
  return clean || fallback;
}

function normalizeCategory(value?: string | null) {
  const raw = String(value || "RENTAL").replace(/_/g, " ").trim();
  return raw
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getServiceImage(service: RentalMarketplaceService) {
  return (
    service.media?.heroImageUrl ||
    service.media?.imageUrl ||
    service.media?.thumbnailUrl ||
    service.media?.gallery?.[0] ||
    null
  );
}

function getRentalType(service: RentalMarketplaceService) {
  const text = [
    service.rental?.rentalType,
    service.taxonomy?.serviceSubcategory,
    service.category,
    service.title,
    service.shortDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/motorbike|scooter/.test(text)) return "Motorbike";
  if (/e-bike|ebike|bicycle|bike/.test(text)) return "E-bike";
  if (/van/.test(text)) return "Van";
  if (/car/.test(text)) return "Car";
  if (/airport|dapa|seaport|pickup|transfer/.test(text)) return "Transfer";
  if (/surfboard|board/.test(text)) return "Surfboard";
  if (/drone/.test(text)) return "Drone";
  if (/gopro|gear|equipment/.test(text)) return "Gear";
  return normalizeCategory(service.category || service.taxonomy?.serviceCategory);
}

function getRentalTone(type: string): RentalCard["tone"] {
  const key = type.toLowerCase();
  if (key.includes("motorbike") || key.includes("scooter") || key.includes("surf")) return "aqua";
  if (key.includes("car") || key.includes("van") || key.includes("transfer")) return "blue";
  if (key.includes("drone") || key.includes("gear")) return "gold";
  if (key.includes("e-bike") || key.includes("bike")) return "sand";
  return "slate";
}

function getRentalIcon(type: string) {
  const key = type.toLowerCase();
  if (key.includes("motorbike") || key.includes("scooter")) return "🛵";
  if (key.includes("e-bike") || key.includes("bike")) return "🚲";
  if (key.includes("van")) return "🚐";
  if (key.includes("car") || key.includes("transfer")) return "🚗";
  if (key.includes("surf")) return "🏄";
  if (key.includes("drone")) return "📷";
  if (key.includes("gear")) return "🎒";
  return "🧭";
}

function getRentalPrice(service: RentalMarketplaceService) {
  if (service.price?.displayPrice) return service.price.displayPrice;
  if (service.rental?.baseDailyRate) return `From ₱${service.rental.baseDailyRate.toLocaleString("en-PH")}/day`;
  if (service.rental?.tripRate) return `From ₱${service.rental.tripRate.toLocaleString("en-PH")}/trip`;
  if (service.rental?.requestRateLabel) return service.rental.requestRateLabel;
  return "Request rate";
}

function getRequirement(service: RentalMarketplaceService) {
  const rental = service.rental || {};
  if (rental.helmetIncluded) return "Helmet";
  if (rental.licenseRequired) return "License";
  if (rental.depositRequired) return "Deposit";
  if (rental.validIdRequired) return "Valid ID";
  if (rental.deliveryAvailable) return "Delivery";
  if (rental.driverIncluded) return "Driver";
  return service.availability?.label || "Check terms";
}

function getRentalCta(service: RentalMarketplaceService) {
  const type = getRentalType(service).toLowerCase();
  if (type.includes("transfer")) return "Request pickup";
  if (type.includes("drone") || type.includes("gear")) return "Ask first";
  if (service.booking?.ctaMode === "REQUEST_AVAILABILITY") return "Check availability";
  return "Request rental";
}

function getRentalHref(service: RentalMarketplaceService) {
  if (service.slug) return `/traveler/explore/rentals/${service.slug}`;
  return `/traveler/settings?panel=assistant&topic=${encodeURIComponent(service.title || "rental request")}`;
}

function mapServiceToRentalCard(service: RentalMarketplaceService): RentalCard {
  const type = getRentalType(service);

  return {
    id: service.id || service.slug || service.title,
    title: service.title || "Verified rental",
    eyebrow: "Verified rental",
    type,
    location: normalizeText(service.rental?.pickupArea || service.locationArea || service.operator?.displayName),
    price: getRentalPrice(service),
    requirement: getRequirement(service),
    cta: getRentalCta(service),
    href: getRentalHref(service),
    tone: getRentalTone(type),
    icon: getRentalIcon(type),
    imageUrl: getServiceImage(service),
    service,
  };
}

function dedupeCards(cards: RentalCard[]) {
  const seen = new Set<string>();
  return cards.filter((card) => {
    const key = card.href || card.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cardSurface(tone: RentalCard["tone"]) {
  if (tone === "aqua") return "linear-gradient(135deg, #EAFBFA 0%, #FFFFFF 100%)";
  if (tone === "blue") return "linear-gradient(135deg, #EEF6FF 0%, #FFFFFF 100%)";
  if (tone === "gold") return "linear-gradient(135deg, #FFF8E6 0%, #FFFFFF 100%)";
  if (tone === "sand") return "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)";
  return "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)";
}

function badgeColor(tone: RentalCard["tone"]) {
  if (tone === "aqua") return { bg: "rgba(32,169,183,0.13)", fg: "#0E777E", border: "rgba(32,169,183,0.24)" };
  if (tone === "blue") return { bg: "rgba(19,79,127,0.10)", fg: "#0B4B78", border: "rgba(19,79,127,0.20)" };
  if (tone === "gold") return { bg: "rgba(242,193,78,0.18)", fg: "#805B12", border: "rgba(242,193,78,0.32)" };
  if (tone === "sand") return { bg: "rgba(255,247,237,0.96)", fg: "#7A4D14", border: "rgba(242,193,78,0.20)" };
  return { bg: "rgba(15,23,42,0.06)", fg: "#334155", border: "rgba(15,23,42,0.12)" };
}

function RentalCardView({ card, index }: { card: RentalCard; index: number }) {
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
            : `radial-gradient(circle at 25% 0%, rgba(32,169,183,0.24), transparent 34%), ${cardSurface(card.tone)}`,
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
          {card.requirement}
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

export default async function RentalsExplorePage() {
  const payload = await getRentalServices();
  const apiCards = dedupeCards((payload.services || []).map(mapServiceToRentalCard)).slice(0, 12);

  return (
    <main
      data-osp-traveler-surface="true"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% -8%, rgba(32,169,183,0.16), transparent 34%), radial-gradient(circle at 94% 4%, rgba(242,193,78,0.11), transparent 30%), linear-gradient(180deg, #F7FCFB 0%, #FFFFFF 52%, #FFF9EC 100%)",
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
                background: "rgba(32,169,183,0.10)",
                color: "#0E777E",
                border: "1px solid rgba(32,169,183,0.18)",
                fontSize: 10.5,
                lineHeight: 1,
                fontWeight: 950,
              }}
            >
              Rentals marketplace
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
              Rentals in Siargao
            </h1>
            <p style={{ margin: "7px 0 0", color: "rgba(16,35,63,0.68)", fontSize: 12.8, lineHeight: 1.35, fontWeight: 760 }}>
              Verified mobility, pickup, and gear options.
            </p>
          </div>

          <nav aria-label="Rental filters" style={{ display: "flex", gap: 7, overflowX: "auto", padding: "1px 1px 4px" }}>
            {rentalChips.map((chip) => (
              <a
                key={chip}
                href="#rental-essentials"
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

        <section id="rental-essentials" style={{ display: "grid", gap: 9 }}>
          <SectionHeader title="Mobility essentials" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
            {essentials.map((card, index) => (
              <RentalCardView key={card.id} card={card} index={index} />
            ))}
          </div>
        </section>

        <section id="verified-rentals" style={{ display: "grid", gap: 9 }}>
          <SectionHeader title="Verified rental cards" />

          {apiCards.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
              {apiCards.map((card, index) => (
                <RentalCardView key={card.id} card={card} index={index + essentials.length} />
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
                Partner rentals
              </span>
              <strong style={{ color: "#08365F", fontSize: 19, lineHeight: 1.05, fontWeight: 950 }}>
                Rental cards will appear when available.
              </strong>
              <p style={{ margin: 0, color: "rgba(16,35,63,0.68)", fontSize: 12.5, lineHeight: 1.35, fontWeight: 740 }}>
                Use the essentials above for quick requests.
              </p>
            </div>
          )}
        </section>

        <section
          aria-label="Rental checks"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          {[
            ["ID", "Bring valid ID"],
            ["Terms", "Check deposit"],
            ["Area", "Confirm pickup"],
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
              "radial-gradient(circle at 12% 0%, rgba(32,169,183,0.13), transparent 36%), linear-gradient(135deg, #FFF8E6 0%, #FFFFFF 100%)",
            border: "1px solid rgba(242,193,78,0.26)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
            display: "grid",
            gap: 10,
          }}
        >
          <span style={{ color: "#8A6414", fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Need help choosing?
          </span>
          <h2 style={{ margin: 0, color: "#08365F", fontSize: 21, lineHeight: 1.05, letterSpacing: "-0.025em", fontWeight: 950 }}>
            Match the rental to your route.
          </h2>
          <p style={{ margin: 0, color: "rgba(16,35,63,0.68)", fontSize: 12.6, lineHeight: 1.35, fontWeight: 740 }}>
            Ask Kuya Tala for pickup, route, and gear guidance.
          </p>
          <Link
            href="/traveler/settings?panel=assistant&topic=rentals%20in%20Siargao"
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
