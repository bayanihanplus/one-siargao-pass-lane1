import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../../src/components/traveler/UniversalTravelerBottomTabBar";

export const dynamic = "force-dynamic";

type CareMarketplaceService = {
  id: string;
  title: string;
  slug?: string;
  shortDescription?: string | null;
  category?: string;
  locationArea?: string | null;
  care?: {
    careType?: string | null;
    providerType?: string | null;
    serviceArea?: string | null;
    locationArea?: string | null;
    homeServiceAvailable?: boolean | null;
    appointmentRequired?: boolean;
    walkInFriendly?: boolean | null;
    durationLabel?: string | null;
    displayPrice?: string | null;
    priceBand?: string | null;
    requestRateLabel?: string | null;
    hygieneSignal?: string | null;
    femaleProviderAvailable?: boolean | null;
    privateRoomAvailable?: boolean | null;
    groupSessionAvailable?: boolean | null;
    beginnerFriendly?: boolean | null;
    providerVerified?: boolean;
    licenseRequired?: boolean;
    licenseVerified?: boolean;
    medicalService?: boolean;
    wellnessOnly?: boolean;
    governedHealthSupport?: boolean;
    marketplaceVisible?: boolean;
  };
  media?: {
    heroImageUrl?: string | null;
    imageUrl?: string | null;
    thumbnailUrl?: string | null;
    gallery?: string[];
    fallbackGradient?: string;
    icon?: string;
  };
  governance?: {
    marketplaceVisible?: boolean;
    approvalStatus?: string;
    sourcePolicy?: string;
    medicalClaimsDisabled?: boolean;
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
  services?: CareMarketplaceService[];
};

type CareCard = {
  id: string;
  title: string;
  eyebrow: string;
  type: string;
  location: string;
  price: string;
  signal: string;
  cta: string;
  href: string;
  tone: "aqua" | "blue" | "gold" | "slate" | "sand" | "rose";
  icon: string;
  imageUrl?: string | null;
  featured?: boolean;
  governed?: boolean;
  service?: CareMarketplaceService;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001/api/v1";

const careChips = [
  "All",
  "Massage",
  "Spa",
  "Salon",
  "Nails",
  "Hair",
  "Wellness",
  "Yoga",
  "Recovery",
  "Laundry",
];

const careEssentials: CareCard[] = [
  {
    id: "massage-spa",
    title: "Massage / spa",
    eyebrow: "Recovery",
    type: "Spa",
    location: "General Luna",
    price: "Request rate",
    signal: "Appointment",
    cta: "Check details",
    href: "/traveler/settings?panel=assistant&topic=massage%20spa%20Siargao",
    tone: "aqua",
    icon: "💆",
    imageUrl: "/osp/explore/care-wellness/massage-spa.png",
    featured: true,
  },
  {
    id: "salon-hair",
    title: "Salon / hair",
    eyebrow: "Grooming",
    type: "Salon",
    location: "Siargao",
    price: "Request rate",
    signal: "Ask first",
    cta: "View care",
    href: "/traveler/settings?panel=assistant&topic=salon%20hair%20Siargao",
    tone: "sand",
    icon: "✂️",
    imageUrl: "/osp/explore/care-wellness/salon-hair.png",
  },
  {
    id: "nails-lashes-brows",
    title: "Nails / lashes / brows",
    eyebrow: "Beauty care",
    type: "Care",
    location: "General Luna",
    price: "Request rate",
    signal: "Appointment",
    cta: "Request slot",
    href: "/traveler/settings?panel=assistant&topic=nails%20lashes%20brows%20Siargao",
    tone: "rose",
    icon: "💅",
    imageUrl: "/osp/explore/care-wellness/nails-lashes-brows.png",
  },
  {
    id: "hair-grooming",
    title: "Hair / grooming",
    eyebrow: "Personal care",
    type: "Grooming",
    location: "Nearby areas",
    price: "Request rate",
    signal: "Check details",
    cta: "Ask guide",
    href: "/traveler/settings?panel=assistant&topic=hair%20grooming%20Siargao",
    tone: "gold",
    icon: "🪒",
    imageUrl: "/osp/explore/care-wellness/hair-grooming.png",
  },
  {
    id: "wellness-yoga",
    title: "Wellness / yoga",
    eyebrow: "Calm session",
    type: "Wellness",
    location: "Select areas",
    price: "Request rate",
    signal: "Schedule",
    cta: "Check class",
    href: "/traveler/settings?panel=assistant&topic=wellness%20yoga%20Siargao",
    tone: "aqua",
    icon: "🧘",
    imageUrl: "/osp/explore/care-wellness/wellness-yoga.png",
  },
  {
    id: "stretching-recovery",
    title: "Stretching / recovery",
    eyebrow: "Body recovery",
    type: "Recovery",
    location: "General Luna",
    price: "Request rate",
    signal: "Wellness only",
    cta: "Ask first",
    href: "/traveler/settings?panel=assistant&topic=stretching%20recovery%20Siargao",
    tone: "blue",
    icon: "🌿",
    imageUrl: "/osp/explore/care-wellness/stretching-recovery.png",
  },
  {
    id: "laundry-wash-care",
    title: "Laundry / wash care",
    eyebrow: "Travel utility",
    type: "Laundry",
    location: "Town areas",
    price: "Request rate",
    signal: "Pickup later",
    cta: "Ask guide",
    href: "/traveler/settings?panel=assistant&topic=laundry%20wash%20service%20Siargao",
    tone: "slate",
    icon: "🧺",
    imageUrl: "/osp/explore/care-wellness/laundry-wash-care.png",
  },
  {
    id: "traveler-care-support",
    title: "Traveler care support",
    eyebrow: "Convenience",
    type: "Care",
    location: "Siargao",
    price: "Request rate",
    signal: "Ask first",
    cta: "Ask Kuya Tala",
    href: "/traveler/settings?panel=assistant&topic=traveler%20care%20support%20Siargao",
    tone: "gold",
    icon: "✨",
    imageUrl: "/osp/explore/care-wellness/traveler-care-support.png",
  },
];

const governedSupport: CareCard[] = [
  {
    id: "clinic-support-later",
    title: "Clinic support",
    eyebrow: "Governed later",
    type: "Health support",
    location: "Verified providers only",
    price: "Not bookable here",
    signal: "Governed",
    cta: "Ask guidance",
    href: "/traveler/settings?panel=assistant&topic=clinic%20support%20Siargao",
    tone: "slate",
    icon: "🏥",
    imageUrl: "/osp/explore/care-wellness/clinic-support.png",
    governed: true,
  },
  {
    id: "doctor-emergency-later",
    title: "Doctor / emergency",
    eyebrow: "Governed later",
    type: "Health safety",
    location: "Proper channels only",
    price: "Not bookable here",
    signal: "Not marketplace",
    cta: "Ask guidance",
    href: "/traveler/settings?panel=assistant&topic=emergency%20doctor%20support%20Siargao",
    tone: "slate",
    icon: "🚑",
    imageUrl: "/osp/explore/care-wellness/doctor-emergency.png",
    governed: true,
  },
  {
    id: "diagnosis-treatment-later",
    title: "Diagnosis / treatment",
    eyebrow: "Governed later",
    type: "Medical support",
    location: "Licensed care only",
    price: "Not bookable here",
    signal: "Governed",
    cta: "Ask guidance",
    href: "/traveler/settings?panel=assistant&topic=medical%20treatment%20guidance%20Siargao",
    tone: "slate",
    icon: "🩺",
    imageUrl: "/osp/explore/care-wellness/diagnosis-treatment.png",
    governed: true,
  },
  {
    id: "prescription-pharmacy-later",
    title: "Prescription / pharmacy",
    eyebrow: "Governed later",
    type: "Health support",
    location: "Proper providers only",
    price: "Not bookable here",
    signal: "Governed",
    cta: "Ask guidance",
    href: "/traveler/settings?panel=assistant&topic=pharmacy%20prescription%20support%20Siargao",
    tone: "slate",
    icon: "💊",
    imageUrl: "/osp/explore/care-wellness/prescription-pharmacy.png",
    governed: true,
  },
];

async function getCareServices(): Promise<MarketplacePayload> {
  try {
    const res = await fetch(`${API_BASE}/traveler/care/marketplace?limit=24`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return { ok: false, mode: "CARE_UNAVAILABLE", counts: { total: 0, sourceRows: 0 }, services: [] };
    }

    return await res.json();
  } catch {
    return { ok: false, mode: "CARE_UNAVAILABLE", counts: { total: 0, sourceRows: 0 }, services: [] };
  }
}

function normalizeText(value?: string | null, fallback = "Siargao") {
  const clean = String(value || "").trim();
  return clean || fallback;
}

function getServiceImage(service: CareMarketplaceService) {
  return (
    service.media?.heroImageUrl ||
    service.media?.imageUrl ||
    service.media?.thumbnailUrl ||
    service.media?.gallery?.[0] ||
    null
  );
}

function getCareType(service: CareMarketplaceService) {
  const text = [
    service.care?.careType,
    service.care?.providerType,
    service.title,
    service.shortDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/massage|spa/.test(text)) return "Massage / spa";
  if (/salon|hair|grooming/.test(text)) return "Salon / grooming";
  if (/nails|lashes|brows/.test(text)) return "Nails / lashes / brows";
  if (/wellness|yoga/.test(text)) return "Wellness / yoga";
  if (/stretching|recovery/.test(text)) return "Stretching / recovery";
  if (/laundry|wash/.test(text)) return "Laundry / wash";
  return "Traveler care";
}

function getTone(type: string): CareCard["tone"] {
  const key = type.toLowerCase();
  if (key.includes("massage") || key.includes("wellness") || key.includes("recovery")) return "aqua";
  if (key.includes("salon") || key.includes("grooming")) return "sand";
  if (key.includes("nails") || key.includes("lashes")) return "rose";
  if (key.includes("laundry")) return "blue";
  return "gold";
}

function getIcon(type: string) {
  const key = type.toLowerCase();
  if (key.includes("massage") || key.includes("spa")) return "💆";
  if (key.includes("salon") || key.includes("grooming")) return "✂️";
  if (key.includes("nails") || key.includes("lashes")) return "💅";
  if (key.includes("wellness") || key.includes("yoga")) return "🧘";
  if (key.includes("recovery")) return "🌿";
  if (key.includes("laundry")) return "🧺";
  return "✨";
}

function mapServiceToCareCard(service: CareMarketplaceService): CareCard {
  const type = getCareType(service);

  return {
    id: service.id || service.slug || service.title,
    title: service.title || "Care & Wellness service",
    eyebrow: "Verified care",
    type,
    location: normalizeText(service.care?.locationArea || service.locationArea),
    price: service.care?.displayPrice || service.care?.requestRateLabel || "Request rate",
    signal: service.care?.hygieneSignal || "Check details",
    cta: service.booking?.ctaMode === "REQUEST_APPOINTMENT" ? "Request slot" : "Check details",
    href: service.slug ? `/traveler/explore/beauty-health/${service.slug}` : `/traveler/settings?panel=assistant&topic=${encodeURIComponent(service.title || "care service")}`,
    tone: getTone(type),
    icon: getIcon(type),
    imageUrl: getServiceImage(service),
    service,
  };
}

function dedupeCards(cards: CareCard[]) {
  const seen = new Set<string>();
  return cards.filter((card) => {
    const key = card.href || card.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cardSurface(tone: CareCard["tone"]) {
  if (tone === "aqua") return "linear-gradient(135deg, #EAFBFA 0%, #FFFFFF 100%)";
  if (tone === "blue") return "linear-gradient(135deg, #EEF6FF 0%, #FFFFFF 100%)";
  if (tone === "gold") return "linear-gradient(135deg, #FFF8E6 0%, #FFFFFF 100%)";
  if (tone === "sand") return "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)";
  if (tone === "rose") return "linear-gradient(135deg, #FFF1F7 0%, #FFFFFF 100%)";
  return "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)";
}

function badgeColor(tone: CareCard["tone"]) {
  if (tone === "aqua") return { bg: "rgba(32,169,183,0.13)", fg: "#0E777E", border: "rgba(32,169,183,0.24)" };
  if (tone === "blue") return { bg: "rgba(19,79,127,0.10)", fg: "#0B4B78", border: "rgba(19,79,127,0.20)" };
  if (tone === "gold") return { bg: "rgba(242,193,78,0.18)", fg: "#805B12", border: "rgba(242,193,78,0.32)" };
  if (tone === "sand") return { bg: "rgba(255,247,237,0.96)", fg: "#7A4D14", border: "rgba(242,193,78,0.20)" };
  if (tone === "rose") return { bg: "rgba(244,114,182,0.12)", fg: "#9D174D", border: "rgba(244,114,182,0.20)" };
  return { bg: "rgba(15,23,42,0.06)", fg: "#334155", border: "rgba(15,23,42,0.12)" };
}

function CareCardView({ card, index }: { card: CareCard; index: number }) {
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
            : `radial-gradient(circle at 25% 0%, rgba(32,169,183,0.18), transparent 34%), ${cardSurface(card.tone)}`,
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
        <span style={{ color: "#0E8B96", fontSize: 9.5, lineHeight: 1, fontWeight: 950, letterSpacing: "0.10em", textTransform: "uppercase" }}>
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ color: "#0B355F", fontSize: isWide ? 13 : 11.3, fontWeight: 950 }}>{card.price}</span>
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
    <h2 style={{ margin: 0, color: "#08365F", fontSize: 18.5, lineHeight: 1.04, letterSpacing: "-0.02em", fontWeight: 950 }}>
      {title}
    </h2>
  );
}

export default async function BeautyHealthExplorePage() {
  const payload = await getCareServices();
  const apiCards = dedupeCards((payload.services || []).map(mapServiceToCareCard)).slice(0, 12);

  return (
    <main className="osp-traveler-bottom-tab-safe-page"
      data-osp-traveler-surface="true"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% -8%, rgba(32,169,183,0.13), transparent 34%), radial-gradient(circle at 94% 4%, rgba(242,193,78,0.10), transparent 30%), linear-gradient(180deg, #F7FCFB 0%, #FFFFFF 52%, #FFF9EC 100%)",
        color: "#10233F",
        padding: "14px 13px 104px",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto", display: "grid", gap: 14 }}>
        <header style={{ display: "grid", gap: 10, borderRadius: 26, padding: 14, background: "rgba(255,255,255,0.90)", border: "1px solid rgba(47,127,178,0.14)", boxShadow: "0 14px 34px rgba(1,56,99,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <Link href="/traveler/explore" aria-label="Back to Explore" style={{ width: 38, height: 38, borderRadius: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "#08365F", background: "#F4FCFA", border: "1px solid rgba(32,169,183,0.16)", fontWeight: 950 }}>
              ←
            </Link>

            <span style={{ borderRadius: 999, padding: "7px 10px", background: "rgba(32,169,183,0.10)", color: "#0E777E", border: "1px solid rgba(32,169,183,0.18)", fontSize: 10.5, lineHeight: 1, fontWeight: 950 }}>
              Care marketplace
            </span>
          </div>

          <div>
            <p style={{ margin: 0, color: "#0E8B96", fontSize: 10, lineHeight: 1, fontWeight: 950, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Explore by lane
            </p>
            <h1 style={{ margin: "6px 0 0", color: "#08365F", fontSize: 26, lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 950 }}>
              Care & Wellness
            </h1>
            <p style={{ margin: "7px 0 0", color: "rgba(16,35,63,0.68)", fontSize: 12.8, lineHeight: 1.35, fontWeight: 760 }}>
              Spa, grooming, recovery, and traveler care.
            </p>
          </div>

          <nav aria-label="Care filters" style={{ display: "flex", gap: 7, overflowX: "auto", padding: "1px 1px 4px" }}>
            {careChips.map((chip) => (
              <a key={chip} href="#care-essentials" style={{ flex: "0 0 auto", minHeight: 32, borderRadius: 999, padding: "0 11px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: chip === "All" ? "#08365F" : "rgba(255,255,255,0.88)", color: chip === "All" ? "#FFFFFF" : "#08365F", border: "1px solid rgba(47,127,178,0.14)", boxShadow: "0 7px 16px rgba(1,56,99,0.06)", textDecoration: "none", fontSize: 11, lineHeight: 1, fontWeight: 950, whiteSpace: "nowrap" }}>
                {chip}
              </a>
            ))}
          </nav>
        </header>

        <section id="care-essentials" style={{ display: "grid", gap: 9 }}>
          <SectionHeader title="Care essentials" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
            {careEssentials.map((card, index) => (
              <CareCardView key={card.id} card={card} index={index} />
            ))}
          </div>
        </section>

        <section id="verified-care" style={{ display: "grid", gap: 9 }}>
          <SectionHeader title="Verified care cards" />
          {apiCards.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
              {apiCards.map((card, index) => (
                <CareCardView key={card.id} card={card} index={index + careEssentials.length} />
              ))}
            </div>
          ) : (
            <div style={{ borderRadius: 24, padding: 15, background: "rgba(255,255,255,0.90)", border: "1px solid rgba(47,127,178,0.14)", boxShadow: "0 12px 28px rgba(1,56,99,0.08)", display: "grid", gap: 9 }}>
              <span style={{ color: "#0E8B96", fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Care partners
              </span>
              <strong style={{ color: "#08365F", fontSize: 19, lineHeight: 1.05, fontWeight: 950 }}>
                Care cards will appear when available.
              </strong>
              <p style={{ margin: 0, color: "rgba(16,35,63,0.68)", fontSize: 12.5, lineHeight: 1.35, fontWeight: 740 }}>
                Use the essentials above for quick care guidance.
              </p>
            </div>
          )}
        </section>

        <section style={{ display: "grid", gap: 9 }}>
          <SectionHeader title="Governed support later" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
            {governedSupport.map((card, index) => (
              <CareCardView key={card.id} card={card} index={index + careEssentials.length + apiCards.length + 1} />
            ))}
          </div>
        </section>

        <section aria-label="Care visit checks" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          {[
            ["Hygiene", "Ask details"],
            ["Slot", "Request time"],
            ["Type", "Wellness only"],
          ].map(([label, value]) => (
            <div key={label} style={{ borderRadius: 18, padding: "10px 9px", background: "rgba(255,255,255,0.86)", border: "1px solid rgba(47,127,178,0.12)", boxShadow: "0 8px 18px rgba(1,56,99,0.05)" }}>
              <span style={{ display: "block", color: "#0E8B96", fontSize: 9.5, lineHeight: 1, fontWeight: 950 }}>{label}</span>
              <strong style={{ display: "block", marginTop: 5, color: "#08365F", fontSize: 11.2, lineHeight: 1.08, fontWeight: 950 }}>
                {value}
              </strong>
            </div>
          ))}
        </section>

        <section style={{ borderRadius: 26, padding: 15, background: "radial-gradient(circle at 12% 0%, rgba(32,169,183,0.13), transparent 36%), linear-gradient(135deg, #EAFBFA 0%, #FFFFFF 100%)", border: "1px solid rgba(32,169,183,0.18)", boxShadow: "0 14px 34px rgba(1,56,99,0.08)", display: "grid", gap: 10 }}>
          <span style={{ color: "#0E777E", fontSize: 10, fontWeight: 950, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Need care guidance?
          </span>
          <h2 style={{ margin: 0, color: "#08365F", fontSize: 21, lineHeight: 1.05, letterSpacing: "-0.025em", fontWeight: 950 }}>
            Match care to your trip need.
          </h2>
          <p style={{ margin: 0, color: "rgba(16,35,63,0.68)", fontSize: 12.6, lineHeight: 1.35, fontWeight: 740 }}>
            Ask Kuya Tala for wellness, grooming, laundry, or support guidance.
          </p>
          <Link href="/traveler/settings?panel=assistant&topic=care%20wellness%20Siargao" style={{ minHeight: 42, borderRadius: 17, display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", background: "#08365F", color: "#FFFFFF", fontSize: 12.5, fontWeight: 950 }}>
            Ask Kuya Tala
          </Link>
        </section>
      </div>

      <UniversalTravelerBottomTabBar />
    </main>
  );
}
