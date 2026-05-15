import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../../src/components/traveler/UniversalTravelerBottomTabBar";

export const dynamic = "force-dynamic";

type SurfMarketplaceService = {
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
  surf?: {
    surfLevel?: string;
    lessonType?: string;
    instructorVerified?: boolean;
    boardIncluded?: boolean;
    boardRentalAvailable?: boolean;
    meetingArea?: string;
    surfSpot?: string;
    sessionDuration?: string;
    scheduleMode?: string;
    requestRequired?: boolean;
    safetyBriefingIncluded?: boolean;
    beginnerFriendly?: boolean;
    groupSize?: number;
    privateLessonAvailable?: boolean;
    pickupArea?: string;
    pricingMode?: string;
    baseLessonRate?: number;
    boardRentalRate?: number;
    requestRateLabel?: string;
    availabilityStatus?: string;
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
  services?: SurfMarketplaceService[];
};

type SurfCard = {
  id: string;
  title: string;
  eyebrow: string;
  level: string;
  location: string;
  price: string;
  signal: string;
  cta: string;
  href: string;
  tone: "aqua" | "blue" | "gold" | "slate" | "sand";
  icon: string;
  imageUrl?: string | null;
  featured?: boolean;
  service?: SurfMarketplaceService;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";

const surfChips = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Private",
  "Group",
  "Board",
  "Cloud 9",
  "GL",
];

const essentials: SurfCard[] = [
  {
    id: "beginner-surf-lessons",
    title: "Beginner surf lessons",
    eyebrow: "First-timer friendly",
    level: "Beginner",
    location: "Cloud 9 / General Luna",
    price: "Request rate",
    signal: "Board included",
    cta: "Check surf schedule",
    href: "/traveler/settings?panel=assistant&topic=beginner%20surf%20lesson%20Siargao",
    tone: "aqua",
    icon: "🏄",
    featured: true,
  },
  {
    id: "intermediate-coaching",
    title: "Intermediate coaching",
    eyebrow: "Skill progression",
    level: "Intermediate",
    location: "General Luna",
    price: "Request rate",
    signal: "Instructor-led",
    cta: "Request coaching",
    href: "/traveler/settings?panel=assistant&topic=intermediate%20surf%20coaching%20Siargao",
    tone: "blue",
    icon: "🌊",
  },
  {
    id: "advanced-progression",
    title: "Advanced / progression coaching",
    eyebrow: "Progression",
    level: "Advanced",
    location: "Surf area",
    price: "Request rate",
    signal: "Skill match",
    cta: "Ask first",
    href: "/traveler/settings?panel=assistant&topic=advanced%20surf%20coaching%20Siargao",
    tone: "slate",
    icon: "🏄‍♂️",
  },
  {
    id: "private-lesson",
    title: "Private lesson",
    eyebrow: "One-on-one",
    level: "Private",
    location: "Cloud 9 / GL",
    price: "Request rate",
    signal: "Instructor",
    cta: "Request lesson",
    href: "/traveler/settings?panel=assistant&topic=private%20surf%20lesson%20Siargao",
    tone: "gold",
    icon: "👤",
  },
  {
    id: "group-lesson",
    title: "Group lesson",
    eyebrow: "Shared session",
    level: "Group",
    location: "General Luna",
    price: "Request rate",
    signal: "Group size",
    cta: "Check schedule",
    href: "/traveler/settings?panel=assistant&topic=group%20surf%20lesson%20Siargao",
    tone: "sand",
    icon: "👥",
  },
  {
    id: "board-rental-addon",
    title: "Board rental / add-on",
    eyebrow: "Board support",
    level: "Board",
    location: "Cloud 9 / GL",
    price: "Request rate",
    signal: "Board option",
    cta: "Request board",
    href: "/traveler/explore/rentals",
    tone: "aqua",
    icon: "🏄",
  },
  {
    id: "kids-first-timer",
    title: "Kids / first-timer friendly",
    eyebrow: "Gentle start",
    level: "Beginner",
    location: "Safe area check",
    price: "Request rate",
    signal: "Safety first",
    cta: "Ask first",
    href: "/traveler/settings?panel=assistant&topic=kids%20first%20timer%20surf%20lesson%20Siargao",
    tone: "sand",
    icon: "🌤️",
  },
  {
    id: "instructor-led-surf-day",
    title: "Instructor-led surf day",
    eyebrow: "Guided surf plan",
    level: "Surf day",
    location: "General Luna",
    price: "Request rate",
    signal: "Route match",
    cta: "Plan session",
    href: "/traveler/settings?panel=assistant&topic=instructor%20led%20surf%20day%20Siargao",
    tone: "blue",
    icon: "🧭",
  },
];

async function getSurfServices(): Promise<MarketplacePayload> {
  try {
    const res = await fetch(`${API_BASE}/traveler/marketplace/services?category=SURF&limit=24`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return { ok: false, mode: "SURF_UNAVAILABLE", counts: { total: 0 }, services: [] };
    }

    return await res.json();
  } catch {
    return { ok: false, mode: "SURF_UNAVAILABLE", counts: { total: 0 }, services: [] };
  }
}

function normalizeText(value?: string | null, fallback = "Siargao") {
  const clean = String(value || "").trim();
  return clean || fallback;
}

function getServiceImage(service: SurfMarketplaceService) {
  return (
    service.media?.heroImageUrl ||
    service.media?.imageUrl ||
    service.media?.thumbnailUrl ||
    service.media?.gallery?.[0] ||
    null
  );
}

function getSurfLevel(service: SurfMarketplaceService) {
  const text = [
    service.surf?.surfLevel,
    service.surf?.lessonType,
    service.taxonomy?.serviceSubcategory,
    service.category,
    service.title,
    service.shortDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/beginner|first.?timer|first timer|kids/.test(text)) return "Beginner";
  if (/intermediate|progression/.test(text)) return "Intermediate";
  if (/advanced/.test(text)) return "Advanced";
  if (/private|one.?on.?one/.test(text)) return "Private";
  if (/group|shared/.test(text)) return "Group";
  if (/board/.test(text)) return "Board";
  return "Surf";
}

function getSurfTone(level: string): SurfCard["tone"] {
  const key = level.toLowerCase();
  if (key.includes("beginner") || key.includes("board")) return "aqua";
  if (key.includes("intermediate") || key.includes("surf")) return "blue";
  if (key.includes("private")) return "gold";
  if (key.includes("group")) return "sand";
  return "slate";
}

function getSurfIcon(level: string) {
  const key = level.toLowerCase();
  if (key.includes("beginner")) return "🏄";
  if (key.includes("intermediate")) return "🌊";
  if (key.includes("advanced")) return "🏄‍♂️";
  if (key.includes("private")) return "👤";
  if (key.includes("group")) return "👥";
  if (key.includes("board")) return "🏄";
  return "🌊";
}

function getSurfPrice(service: SurfMarketplaceService) {
  if (service.price?.displayPrice) return service.price.displayPrice;
  if (service.surf?.baseLessonRate) return `From ₱${service.surf.baseLessonRate.toLocaleString("en-PH")}`;
  if (service.surf?.boardRentalRate) return `Board ₱${service.surf.boardRentalRate.toLocaleString("en-PH")}`;
  if (service.surf?.requestRateLabel) return service.surf.requestRateLabel;
  return "Request rate";
}

function getSurfSignal(service: SurfMarketplaceService) {
  const surf = service.surf || {};
  if (surf.boardIncluded) return "Board included";
  if (surf.instructorVerified) return "Instructor";
  if (surf.safetyBriefingIncluded) return "Safety brief";
  if (surf.beginnerFriendly) return "Beginner";
  if (surf.privateLessonAvailable) return "Private option";
  if (surf.boardRentalAvailable) return "Board option";
  return service.availability?.label || "Check schedule";
}

function getSurfCta(service: SurfMarketplaceService) {
  const level = getSurfLevel(service).toLowerCase();
  if (level.includes("board")) return "Request board";
  if (level.includes("private")) return "Request lesson";
  if (level.includes("group")) return "Check schedule";
  if (service.booking?.ctaMode === "REQUEST_AVAILABILITY") return "Check surf schedule";
  return "Request session";
}

function getSurfHref(service: SurfMarketplaceService) {
  if (service.slug) return `/traveler/explore/surf-schools/${service.slug}`;
  return `/traveler/settings?panel=assistant&topic=${encodeURIComponent(service.title || "surf lesson request")}`;
}

function mapServiceToSurfCard(service: SurfMarketplaceService): SurfCard {
  const level = getSurfLevel(service);

  return {
    id: service.id || service.slug || service.title,
    title: service.title || "Verified surf session",
    eyebrow: "Verified surf",
    level,
    location: normalizeText(service.surf?.meetingArea || service.surf?.surfSpot || service.locationArea || service.operator?.displayName, "Cloud 9 / General Luna"),
    price: getSurfPrice(service),
    signal: getSurfSignal(service),
    cta: getSurfCta(service),
    href: getSurfHref(service),
    tone: getSurfTone(level),
    icon: getSurfIcon(level),
    imageUrl: getServiceImage(service),
    service,
  };
}

function dedupeCards(cards: SurfCard[]) {
  const seen = new Set<string>();
  return cards.filter((card) => {
    const key = card.href || card.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cardSurface(tone: SurfCard["tone"]) {
  if (tone === "aqua") return "linear-gradient(135deg, #EAFBFA 0%, #FFFFFF 100%)";
  if (tone === "blue") return "linear-gradient(135deg, #EEF6FF 0%, #FFFFFF 100%)";
  if (tone === "gold") return "linear-gradient(135deg, #FFF8E6 0%, #FFFFFF 100%)";
  if (tone === "sand") return "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)";
  return "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)";
}

function badgeColor(tone: SurfCard["tone"]) {
  if (tone === "aqua") return { bg: "rgba(32,169,183,0.13)", fg: "#0E777E", border: "rgba(32,169,183,0.24)" };
  if (tone === "blue") return { bg: "rgba(19,79,127,0.10)", fg: "#0B4B78", border: "rgba(19,79,127,0.20)" };
  if (tone === "gold") return { bg: "rgba(242,193,78,0.18)", fg: "#805B12", border: "rgba(242,193,78,0.32)" };
  if (tone === "sand") return { bg: "rgba(255,247,237,0.96)", fg: "#7A4D14", border: "rgba(242,193,78,0.20)" };
  return { bg: "rgba(15,23,42,0.06)", fg: "#334155", border: "rgba(15,23,42,0.12)" };
}

function SurfCardView({ card, index }: { card: SurfCard; index: number }) {
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
            {card.eyebrow} · {card.level}
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

export default async function SurfSchoolsExplorePage() {
  const payload = await getSurfServices();
  const apiCards = dedupeCards((payload.services || []).map(mapServiceToSurfCard)).slice(0, 12);

  return (
    <main
      data-osp-traveler-surface="true"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% -8%, rgba(32,169,183,0.16), transparent 34%), radial-gradient(circle at 94% 4%, rgba(242,193,78,0.11), transparent 30%), linear-gradient(180deg, #F7FCFB 0%, #FFFFFF 52%, #F4FBFF 100%)",
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
              Surf marketplace
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
              Surf Schools
            </h1>
            <p style={{ margin: "7px 0 0", color: "rgba(16,35,63,0.68)", fontSize: 12.8, lineHeight: 1.35, fontWeight: 760 }}>
              Lessons, boards, and instructor-led sessions.
            </p>
          </div>

          <nav aria-label="Surf filters" style={{ display: "flex", gap: 7, overflowX: "auto", padding: "1px 1px 4px" }}>
            {surfChips.map((chip) => (
              <a
                key={chip}
                href="#surf-essentials"
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

        <section id="surf-essentials" style={{ display: "grid", gap: 9 }}>
          <SectionHeader title="Surf essentials" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
            {essentials.map((card, index) => (
              <SurfCardView key={card.id} card={card} index={index} />
            ))}
          </div>
        </section>

        <section id="verified-surf" style={{ display: "grid", gap: 9 }}>
          <SectionHeader title="Verified surf cards" />

          {apiCards.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
              {apiCards.map((card, index) => (
                <SurfCardView key={card.id} card={card} index={index + essentials.length} />
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
                Surf partners
              </span>
              <strong style={{ color: "#08365F", fontSize: 19, lineHeight: 1.05, fontWeight: 950 }}>
                Surf cards will appear when available.
              </strong>
              <p style={{ margin: 0, color: "rgba(16,35,63,0.68)", fontSize: 12.5, lineHeight: 1.35, fontWeight: 740 }}>
                Use the essentials above for quick surf requests.
              </p>
            </div>
          )}
        </section>

        <section
          aria-label="Surf checks"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 8,
          }}
        >
          {[
            ["Level", "Match skill"],
            ["Board", "Check option"],
            ["Safety", "Ask first"],
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
              "radial-gradient(circle at 12% 0%, rgba(32,169,183,0.13), transparent 36%), linear-gradient(135deg, #EEF6FF 0%, #FFFFFF 100%)",
            border: "1px solid rgba(32,169,183,0.18)",
            boxShadow: "0 14px 34px rgba(1,56,99,0.08)",
            display: "grid",
            gap: 10,
          }}
        >
          <span style={{ color: "#0E777E", fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Need surf guidance?
          </span>
          <h2 style={{ margin: 0, color: "#08365F", fontSize: 21, lineHeight: 1.05, letterSpacing: "-0.025em", fontWeight: 950 }}>
            Match the session to your level.
          </h2>
          <p style={{ margin: 0, color: "rgba(16,35,63,0.68)", fontSize: 12.6, lineHeight: 1.35, fontWeight: 740 }}>
            Ask Kuya Tala for level, board, and lesson guidance.
          </p>
          <Link
            href="/traveler/settings?panel=assistant&topic=surf%20lesson%20Siargao"
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
