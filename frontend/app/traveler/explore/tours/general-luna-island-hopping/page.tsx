import Link from "next/link";
import UniversalTravelerBottomTabBar from "../../../../../src/components/traveler/UniversalTravelerBottomTabBar";

const OSP = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  mist: "#F4FCFA",
  soft: "#F8FBFD",
  slate: "#50668B",
  line: "rgba(1,56,99,0.10)",
};

function buildIslandHoppingBookingHref({
  product,
  bookingPath,
  pricingMode,
}: {
  product: "tri-island-joiner" | "private-island-route";
  bookingPath: "joiner" | "private";
  pricingMode: "per-head" | "pax-tiered";
}) {
  const params = new URLSearchParams({
    intent: "island-hopping-request",
    trail: "island-hopping",
    officialTrail: "Island Hopping",
    routeType: "GL_TRI_ISLAND_STANDARD",
    routeCode: "gl-tri-island-standard",
    routeProduct: product,
    tripNo: "GL-ISL-01",
    departurePort: "GENERAL_LUNA_PORT",
    routeReadiness: "required",
    departureReadiness: "required",
    boardingFlow: "online",
    voucher: "required",
    onlineBoarding: "required",
    boardingQr: "required",
    manifest: "required",
    movementRecord: "required",
    paymentTiming: "after-route-readiness",
    fulfillment: "boat-guide-operator-assignment",
    step: "availability",
    product,
    pricingMode,
    bookingPath,
    source: "explore-tour",
  });

  return `/traveler/passport-trails/island-hopping/book?${params.toString()}`;
}

const joinerBookingHref = buildIslandHoppingBookingHref({
  product: "tri-island-joiner",
  bookingPath: "joiner",
  pricingMode: "per-head",
});

const privateBookingHref = buildIslandHoppingBookingHref({
  product: "private-island-route",
  bookingPath: "private",
  pricingMode: "pax-tiered",
});

const bookingHref = joinerBookingHref;

const mediaTiles = [
  {
    label: "Boat route",
    hint: "Route view",
    image: "/osp/explore/tours/general-luna-island-hopping/boat-route.png",
  },
  {
    label: "Daku lunch",
    hint: "Island stop",
    image: "/osp/explore/tours/general-luna-island-hopping/daku-lunch.png",
  },
  {
    label: "Sandbar",
    hint: "Open beach",
    image: "/osp/explore/tours/general-luna-island-hopping/sandbar.png",
  },
];

const confidenceCards = [
  { label: "Route-ready", value: "GL Tri-Island" },
  { label: "Voucher", value: "After booking" },
  { label: "Support", value: "Boarding help" },
];

const routeSetups = [
  {
    badge: "Best start",
    title: "Tri-Island Joiner",
    note: "Shared island-hopping slot.",
    price: "From ₱1,500",
    meta: "Per traveler",
    cta: "Choose Joiner Seat",
    href: joinerBookingHref,
    tone: "gold",
  },
  {
    badge: "Flexible",
    title: "Private Boat",
    note: "Price adjusts by group size.",
    price: "Pax-tiered",
    meta: "Boat class matched",
    cta: "Review Private Boat",
    href: privateBookingHref,
    tone: "mist",
  },
];

const trailStops = [
  {
    number: "1",
    tag: "Departure · Route start",
    title: "General Luna Port",
    body: "General Luna departure point.",
    tone: "mist",
  },
  {
    number: "2",
    tag: "Sandbar · Morning stop",
    title: "Naked Island",
    body: "Open sandbar stop.",
    tone: "gold",
  },
  {
    number: "3",
    tag: "Lunch stop · Midday stop",
    title: "Daku Island",
    body: "Lunch and island time.",
    tone: "mist",
  },
  {
    number: "4",
    tag: "Final island · Afternoon stop",
    title: "Guyam Island",
    body: "Final island stop before return.",
    tone: "mist",
  },
];

const reasons = [
  ["1", "Classic route", "Guyam, Naked, and Daku."],
  ["2", "Easy day", "Simple island-hopping rhythm."],
  ["3", "Pickup area", "General Luna pickup guidance."],
  ["4", "Clear setup", "Choose joiner or private boat."],
];

const inclusions = [
  "Boat",
  "Guide",
  "Drone shots",
  "Entrance fees",
  "Boodle fight lunch",
  "Cottages",
  "Docking fees",
  "Environmental fees",
  "GL pickup",
];

const exclusions = ["Snorkels not included", "Paddle boards not included"];

const otherTrails = [
  {
    title: "Sugba Lagoon Island Hopping",
    icon: "/osp/spm/trails/icons/sugba-lagoon-badge.png",
    area: "Del Carmen",
    tag: "Lagoon",
    note: "Lagoon route",
    href: "/traveler/explore/tours/sugba-lagoon-mangrove-tours",
    tileColor: "#EAFBFA",
  },
  {
    title: "Siargao Land Tour Passport Trail",
    icon: "/osp/spm/trails/icons/siargao-land-tour-badge.png",
    area: "South / North",
    tag: "Land",
    note: "Land route",
    href: "/traveler/explore/tours/private-siargao-land-route",
    tileColor: "#FFF8E6",
  },
  {
    title: "Explorer Surf Trail",
    icon: "/osp/spm/trails/icons/surf-explorer-badge.png",
    area: "Cloud 9",
    tag: "Surf",
    note: "Surf support",
    href: "/traveler/passport-trails/surf-explorer",
    tileColor: "#EAF5FF",
  },
  {
    title: "Bucas Grande / Sohoton Official Trail",
    icon: "/osp/spm/trails/icons/bucas-sohoton-badge.png",
    area: "Dapa-side",
    tag: "Sohoton",
    note: "Governed route",
    href: "/traveler/explore/tours/bucas-grande-sohoton-tour",
    tileColor: "#EAFBFA",
  },
];

function ShellCard({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <section
      style={{
        borderRadius: 24,
        padding: 12,
        background: "#FFFFFF",
        border: `1px solid ${OSP.line}`,
        boxShadow: "0 12px 28px rgba(1,56,99,0.065)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: OSP.teal,
        fontSize: 9.4,
        lineHeight: 1,
        fontWeight: 900,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: "6px 0 0",
        color: OSP.navy,
        fontSize: 20,
        lineHeight: 1.05,
        letterSpacing: "-0.04em",
        fontWeight: 860,
      }}
    >
      {children}
    </h2>
  );
}

export default function GeneralLunaIslandHoppingExplorePage() {
  return (
    <main className="osp-traveler-bottom-tab-safe-page"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% 0%, rgba(5,150,165,0.10), transparent 34%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 54%, #EAFBFA 100%)",
        color: OSP.navy,
        padding: "14px 14px 132px",
      }}
    >
      <div style={{ maxWidth: 390, margin: "0 auto" }}>
        <Link
          href="/traveler/explore"
          aria-label="Back to Explore"
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: "#FFFFFF",
            border: `1px solid ${OSP.line}`,
            color: OSP.navy,
            textDecoration: "none",
            fontSize: 18,
            fontWeight: 900,
            boxShadow: "0 10px 24px rgba(1,56,99,0.08)",
            marginBottom: 10,
          }}
        >
          ‹
        </Link>

        <ShellCard style={{ padding: 8 }}>
          <section
            aria-label="Island Hopping media detail"
            style={{
              minHeight: 246,
              borderRadius: 22,
              overflow: "hidden",
              padding: 14,
              display: "grid",
              alignContent: "end",
              background:
                "linear-gradient(180deg, rgba(1,56,99,0.36), rgba(1,56,99,0.88)), url('/osp/explore/tours/general-luna-island-hopping/main-preview.png') center/cover",
            }}
          >
            <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap", marginBottom: 13 }}>
              <span
                style={{
                  borderRadius: 999,
                  padding: "7px 10px",
                  background: "#FFFFFF",
                  color: OSP.navy,
                  fontSize: 10.5,
                  fontWeight: 900,
                }}
              >
                ● OFFICIAL TRAIL
              </span>
              <span
                style={{
                  borderRadius: 999,
                  padding: "7px 10px",
                  background: OSP.gold,
                  color: OSP.navy,
                  fontSize: 10.5,
                  fontWeight: 900,
                }}
              >
                Route ready
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                color: "#FFFFFF",
                textShadow: "0 3px 16px rgba(0,0,0,0.36)",
                fontSize: 31,
                lineHeight: 0.93,
                letterSpacing: "-0.055em",
                fontWeight: 880,
              }}
            >
              Island Hopping
            </h1>

            <p
              style={{
                margin: "10px 0 0",
                color: "rgba(255,255,255,0.96)",
                textShadow: "0 2px 10px rgba(0,0,0,0.32)",
                fontSize: 13.2,
                lineHeight: 1.28,
                fontWeight: 760,
                maxWidth: 300,
              }}
            >
              Tri-Island packages mapped to the official General Luna route.
            </p>

            <Link
              href={bookingHref}
              style={{
                justifySelf: "end",
                marginTop: 14,
                borderRadius: 999,
                padding: "8px 12px",
                background: "rgba(1,56,99,0.86)",
                color: "#FFFFFF",
                textDecoration: "none",
                fontSize: 11,
                fontWeight: 900,
              }}
            >
              ▶ Video
            </Link>
          </section>

          <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {mediaTiles.map((tile) => (
              <div
                key={tile.label}
                style={{
                  minHeight: 76,
                  borderRadius: 18,
                  padding: 10,
                  background:
                    `linear-gradient(180deg, rgba(1,56,99,0.04), rgba(1,56,99,0.64)), url(${tile.image}) center/cover`,
                  border: "1px solid rgba(255,255,255,0.72)",
                  boxShadow: "0 12px 26px rgba(1,56,99,0.14)",
                  display: "grid",
                  alignContent: "space-between",
                  overflow: "hidden",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.88)", textShadow: "0 2px 8px rgba(1,56,99,0.42)", fontSize: 9.2, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {tile.hint}
                </span>
                <strong style={{ color: "#FFFFFF", textShadow: "0 2px 8px rgba(1,56,99,0.48)", fontSize: 12.5, lineHeight: 1.05 }}>{tile.label}</strong>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard style={{ marginTop: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              ["📅", "Date", "Choose on next step"],
              ["👥", "Pax", "Set during booking"],
              ["📍", "Pickup", "General Luna"],
              ["🛥️", "Setup", "Joiner / Private"],
            ].map(([icon, label, value]) => (
              <div
                key={label}
                style={{
                  minHeight: 76,
                  borderRadius: 18,
                  padding: 12,
                  background: OSP.mist,
                  border: "1px solid rgba(5,150,165,0.16)",
                  display: "grid",
                  gridTemplateColumns: "26px 1fr",
                  gap: 9,
                  alignItems: "center",
                }}
              >
                <span>{icon}</span>
                <div>
                  <div style={{ color: OSP.slate, fontSize: 9.5, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {label}
                  </div>
                  <strong style={{ display: "block", marginTop: 4, color: OSP.navy, fontSize: 12.5, lineHeight: 1.12 }}>{value}</strong>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={bookingHref}
            style={{
              marginTop: 10,
              minHeight: 52,
              borderRadius: 18,
              background: OSP.navy,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 930,
            }}
          >
            Confirm Island Hopping Seat
          </Link>
        </ShellCard>

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {confidenceCards.map((card) => (
            <div
              key={card.label}
              style={{
                minHeight: 70,
                borderRadius: 18,
                padding: 10,
                background: "#FFFFFF",
                border: `1px solid ${OSP.line}`,
                boxShadow: "0 10px 22px rgba(1,56,99,0.05)",
              }}
            >
              <div style={{ color: OSP.slate, fontSize: 9.2, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {card.label}
              </div>
              <strong style={{ display: "block", marginTop: 8, color: OSP.navy, fontSize: 12.5, lineHeight: 1.1 }}>{card.value}</strong>
            </div>
          ))}
        </div>

        <ShellCard style={{ marginTop: 12 }}>
          <Eyebrow>Trail stops</Eyebrow>
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {trailStops.map((stop) => (
              <div
                key={stop.title}
                style={{
                  minHeight: 88,
                  borderRadius: 20,
                  padding: 12,
                  background: stop.tone === "gold" ? "#FFF8E6" : OSP.mist,
                  border: stop.tone === "gold" ? "1px solid rgba(243,174,38,0.28)" : "1px solid rgba(5,150,165,0.16)",
                  display: "grid",
                  gridTemplateColumns: "52px 1fr",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 18,
                    background: "#FFFFFF",
                    display: "grid",
                    placeItems: "center",
                    color: OSP.navy,
                    fontWeight: 950,
                    fontSize: 15,
                  }}
                >
                  {stop.number}
                </div>

                <div>
                  <span
                    style={{
                      borderRadius: 999,
                      padding: "4px 8px",
                      background: "#FFFFFF",
                      color: OSP.slate,
                      fontSize: 9,
                      fontWeight: 900,
                    }}
                  >
                    {stop.tag}
                  </span>
                  <strong style={{ display: "block", marginTop: 7, color: OSP.navy, fontSize: 15.5, lineHeight: 1.05 }}>
                    {stop.title}
                  </strong>
                  <p style={{ margin: "5px 0 0", color: OSP.slate, fontSize: 12, lineHeight: 1.28, fontWeight: 740 }}>
                    {stop.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard style={{ marginTop: 12 }}>
          <Eyebrow>Choose route setup</Eyebrow>

          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {routeSetups.map((setup) => (
              <article
                key={setup.title}
                style={{
                  borderRadius: 20,
                  padding: 12,
                  background: setup.tone === "gold" ? "#FFF8E6" : OSP.mist,
                  border: setup.tone === "gold" ? "1px solid rgba(243,174,38,0.28)" : "1px solid rgba(5,150,165,0.16)",
                  display: "grid",
                  gap: 9,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "5px 8px",
                        background: "#FFFFFF",
                        color: OSP.slate,
                        fontSize: 9.2,
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      {setup.badge}
                    </span>
                    <strong style={{ display: "block", marginTop: 9, color: OSP.navy, fontSize: 15.5, lineHeight: 1.05 }}>
                      {setup.title}
                    </strong>
                    <p style={{ margin: "4px 0 0", color: OSP.slate, fontSize: 12, fontWeight: 720 }}>{setup.note}</p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <strong style={{ display: "block", color: OSP.navy, fontSize: 15.5, lineHeight: 1.05 }}>{setup.price}</strong>
                    <span style={{ color: OSP.slate, fontSize: 10.5, fontWeight: 800 }}>{setup.meta}</span>
                  </div>
                </div>

                <Link
                  href={setup.href}
                  style={{
                    width: "fit-content",
                    borderRadius: 999,
                    padding: "8px 12px",
                    background: OSP.navy,
                    color: "#FFFFFF",
                    textDecoration: "none",
                    fontSize: 11,
                    fontWeight: 900,
                  }}
                >
                  {setup.cta}
                </Link>
              </article>
            ))}
          </div>
        </ShellCard>

        <ShellCard style={{ marginTop: 12 }}>
          <Heading>Classic General Luna island route.</Heading>
          <p style={{ margin: "9px 0 0", color: OSP.slate, fontSize: 12.6, lineHeight: 1.35, fontWeight: 760 }}>
            Choose joiner or private boat, then continue to booking.
          </p>
        </ShellCard>

        <ShellCard style={{ marginTop: 12 }}>
          <Eyebrow>Top reasons</Eyebrow>
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {reasons.map(([number, title, body]) => (
              <div key={number} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 10, alignItems: "center" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: number === "1" ? "#FFF8E6" : OSP.mist,
                    color: OSP.navy,
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 950,
                  }}
                >
                  {number}
                </div>
                <div>
                  <strong style={{ color: OSP.navy, fontSize: 14.2, lineHeight: 1.05 }}>{title}</strong>
                  <p style={{ margin: "4px 0 0", color: OSP.slate, fontSize: 11.7, lineHeight: 1.25, fontWeight: 720 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard style={{ marginTop: 12 }}>
          <Eyebrow>Included support</Eyebrow>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 7 }}>
            {inclusions.map((item) => (
              <span
                key={item}
                style={{
                  borderRadius: 999,
                  padding: "8px 10px",
                  background: OSP.mist,
                  border: "1px solid rgba(5,150,165,0.18)",
                  color: OSP.navy,
                  fontSize: 11,
                  fontWeight: 850,
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 10, display: "grid", gap: 7 }}>
            {exclusions.map((item) => (
              <div
                key={item}
                style={{
                  borderRadius: 999,
                  padding: "9px 12px",
                  background: "#FFF8E6",
                  border: "1px solid rgba(243,174,38,0.24)",
                  color: OSP.navy,
                  fontSize: 11.5,
                  fontWeight: 860,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard style={{ marginTop: 12, background: "linear-gradient(145deg, #FFF8E6, #FFFFFF)", border: "1px solid rgba(243,174,38,0.28)" }}>
          <Eyebrow>Guide support</Eyebrow>
          <Heading>Confirm your seat first.</Heading>
          <p style={{ margin: "9px 0 0", color: OSP.slate, fontSize: 12.6, lineHeight: 1.35, fontWeight: 760 }}>
            Local support checks pickup, pax, boat readiness, product type, tide-sensitive stops, and departure timing.
          </p>
        </ShellCard>

        <section
          style={{
            marginTop: 12,
            borderRadius: 24,
            padding: 14,
            background: OSP.navy,
            color: "#FFFFFF",
            boxShadow: "0 14px 28px rgba(1,56,99,0.20)",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 21, lineHeight: 1.02, letterSpacing: "-0.045em", fontWeight: 860 }}>
            Confirm your Island Hopping seat.
          </h2>
          <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.82)", fontSize: 12.8, lineHeight: 1.35, fontWeight: 760 }}>
            Choose date, pax, and setup next.
          </p>
          <Link
            href={bookingHref}
            style={{
              marginTop: 13,
              minHeight: 52,
              borderRadius: 18,
              background: OSP.gold,
              color: OSP.navy,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 930,
            }}
          >
            Confirm Island Hopping Seat
          </Link>
        </section>

        <ShellCard style={{ marginTop: 12 }}>
          <Eyebrow>Discover other trails</Eyebrow>
          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {otherTrails.map((trail) => (
              <Link
                key={trail.href}
                href={trail.href}
                style={{
                  minHeight: 112,
                  borderRadius: 18,
                  background: trail.tileColor,
                  color: OSP.navy,
                  border: "1px solid rgba(5,150,165,0.12)",
                  display: "grid",
                  alignContent: "space-between",
                  gap: 8,
                  textDecoration: "none",
                  padding: 12,
                }}
              >
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 999,
                        background: "#FFFFFF",
                        border: "1px solid rgba(5,150,165,0.16)",
                        boxShadow: "0 8px 18px rgba(1,56,99,0.08)",
                        display: "grid",
                        placeItems: "center",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={trail.icon}
                        alt=""
                        aria-hidden="true"
                        style={{
                          width: 36,
                          height: 36,
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                    </div>

                    <span
                      style={{
                        borderRadius: 999,
                        padding: "5px 8px",
                        background: "#FFFFFF",
                        color: OSP.teal,
                        border: "1px solid rgba(5,150,165,0.16)",
                        boxShadow: "0 6px 14px rgba(1,56,99,0.06)",
                        fontSize: 9,
                        fontWeight: 950,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {trail.tag}
                    </span>
                  </div>

                  <strong style={{ display: "block", color: OSP.navy, fontSize: 13.2, lineHeight: 1.05 }}>
                    {trail.title}
                  </strong>
                  <span style={{ display: "block", color: OSP.slate, fontSize: 11, fontWeight: 750 }}>{trail.area}</span>
                </div>
                <span style={{ color: OSP.slate, fontSize: 10.8, fontWeight: 800 }}>{trail.note} ›</span>
              </Link>
            ))}
          </div>
        </ShellCard>
      </div>
      <UniversalTravelerBottomTabBar />
    </main>
  );
}
