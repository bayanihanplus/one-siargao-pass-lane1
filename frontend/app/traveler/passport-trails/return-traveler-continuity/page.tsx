import SpmTravelerBottomTabBar from "../../../../src/components/traveler/SpmTravelerBottomTabBar";
import Link from "next/link";

const OSP = {
  navy: "#013863",
  deepNavy: "#003B66",
  deepNavy2: "#004D73",
  teal: "#0596A5",
  tealDeep: "#057E92",
  tealSoft: "#DFF8F8",
  gold: "#F3AE26",
  goldSoft: "#FFD166",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  mistSoft: "#F4FCFA",
  slate: "#50668B",
  line: "rgba(1,56,99,0.12)",
};

const heroStats = [
  {
    label: "Saved Trails",
    value: "3",
    icon: "▰",
    image: "/osp/spm/trails/return-traveler-continuity/saved-trails.png",
  },
  {
    label: "Verified Stamps",
    value: "7",
    icon: "✦",
    image: "/osp/spm/trails/return-traveler-continuity/verified-stamps.png",
  },
  {
    label: "Next Return",
    value: "Planned",
    icon: "✈",
    image: "/osp/spm/trails/return-traveler-continuity/next-returned-planned.png",
  },
] as const;

const actionCards = [
  {
    label: "Passport",
    title: "View My Passport",
    body: "See your identity, stamps, and saved progress.",
    href: "/traveler/pass",
    icon: "▣",
    tone: "primary",
  },
  {
    label: "Trails",
    title: "Continue My Trails",
    body: "Pick an official trail to resume or start.",
    href: "/traveler/passport-trails",
    icon: "⌁",
    tone: "gold",
  },
  {
    label: "Kuya Tala",
    title: "Ask Kuya Tala What’s Next",
    body: "Get guidance for your next return journey.",
    href: "/traveler/assistant",
    icon: "☻",
    tone: "aqua",
  },
] as const;

const returnProgress = [
  {
    icon: "🌴",
    label: "First Visit",
    body: "Your first verified Passport activity starts the story.",
  },
  {
    icon: "◉",
    label: "Return Explorer",
    body: "Your next trip can continue from your saved progress.",
  },
  {
    icon: "△",
    label: "Multi-Trail Progress",
    body: "Your journey grows across official trail families.",
  },
  {
    icon: "♛",
    label: "Deep Return Traveler",
    body: "Repeated verified activity builds long-term recognition.",
  },
] as const;

const otherTrails = [
  {
    iconSrc: "/osp/osp-verified-logo.png",
    fallbackIcon: "🏝",
    title: "Tri-Island Passport Trail",
    href: "/traveler/passport-trails/island-hopping",
    tileColor: "#EAFBFA",
  },
  {
    iconSrc: "/osp/spm/trails/icons/sugba-lagoon-badge.png?v=01l",
    fallbackIcon: "🛶",
    title: "Sugba Lagoon Island Hopping",
    href: "/traveler/passport-trails/sugba-lagoon",
    tileColor: "#EEFBEF",
  },
  {
    iconSrc: "/osp/spm/trails/icons/siargao-land-tour-badge.png?v=01l",
    fallbackIcon: "🌴",
    title: "Siargao Land Tour Passport Trail",
    href: "/traveler/passport-trails/siargao-land-tour",
    tileColor: "#FFF8E7",
  },
  {
    iconSrc: "/osp/spm/trails/icons/surf-explorer-badge.png?v=01l",
    fallbackIcon: "🏄",
    title: "Explorer Surf Trail",
    href: "/traveler/passport-trails/surf-explorer",
    tileColor: "#EEF7FF",
  },
  {
    iconSrc: "/osp/spm/trails/icons/culture-community-badge.png?v=01l",
    fallbackIcon: "✺",
    title: "Culture & Community Trail",
    href: "/traveler/passport-trails/culture-community",
    tileColor: "#F6F3FF",
  },
  {
    iconSrc: "/osp/spm/trails/icons/food-wellness-badge.png?v=01l",
    fallbackIcon: "🍲",
    title: "Food & Wellness Trail",
    href: "/traveler/passport-trails/food-wellness",
    tileColor: "#FFF4EF",
  },
] as const;

const shellCard = {
  background: "rgba(255,255,255,0.97)",
  border: `1px solid ${OSP.line}`,
  borderRadius: 28,
  boxShadow: "0 18px 50px rgba(1,56,99,0.08)",
};

function actionTone(tone: string) {
  if (tone === "primary") {
    return {
      background:
        "linear-gradient(135deg, #003B66 0%, #00587C 100%)",
      color: OSP.white,
      border: "1px solid rgba(255,255,255,0.18)",
      shadow: "0 16px 30px rgba(1,56,99,0.18)",
    };
  }

  if (tone === "gold") {
    return {
      background: "linear-gradient(135deg, #F3AE26 0%, #FFD166 100%)",
      color: OSP.deepNavy,
      border: "1px solid rgba(243,174,38,0.34)",
      shadow: "0 14px 28px rgba(243,174,38,0.20)",
    };
  }

  return {
    background: "linear-gradient(135deg, #EAFBFA 0%, #F6FEFF 100%)",
    color: OSP.deepNavy,
    border: "1px solid rgba(5,150,165,0.16)",
    shadow: "0 10px 24px rgba(1,56,99,0.06)",
  };
}


export default function ReturnTravelerContinuityPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0% 0%, rgba(5,150,165,0.11), transparent 31%), linear-gradient(180deg, #F4FCFA 0%, #FFFFFF 50%, #EAFBFA 100%)",
        color: OSP.navy,
        padding: "18px 14px 132px",
        fontFamily: '"Source Sans 3", "Source Sans Pro", "Noto Sans", Arial, sans-serif',
      }}
    >
      <div style={{ width: "100%", maxWidth: 430, margin: "0 auto" }}>
        <header
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            alignItems: "start",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: OSP.teal,
                fontSize: 10.8,
                lineHeight: 1,
                fontWeight: 920,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              PASSPORT TRAILS™ · CONTINUITY
            </div>
            <h1
              style={{
                margin: "7px 0 0",
                color: OSP.deepNavy,
                fontSize: 32,
                lineHeight: 0.94,
                fontWeight: 840,
                letterSpacing: "-0.06em",
              }}
            >
              Return Traveler Continuity
            </h1>
          </div>

          <Link
            href="/traveler/passport-trails"
            style={{
              borderRadius: 999,
              border: "1px solid rgba(5,150,165,0.22)",
              background: "rgba(255,255,255,0.92)",
              color: OSP.teal,
              padding: "12px 16px",
              fontSize: 13.2,
              fontWeight: 900,
              whiteSpace: "nowrap",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              boxShadow: "0 8px 20px rgba(1,56,99,0.04)",
            }}
          >
            <span aria-hidden="true">◉</span>
            Trails
          </Link>
        </header>

        <section
          aria-label="Premium Continuity Hero"
          style={{
            ...shellCard,
            overflow: "hidden",
            padding: 10,
            background: "#FFFFFF",
          }}
        >
          <div
            style={{
              borderRadius: 25,
              overflow: "hidden",
              minHeight: 254,
              padding: 18,
              display: "grid",
              alignContent: "space-between",
              color: OSP.white,
              backgroundImage:
                "linear-gradient(90deg, rgba(0,59,102,0.68) 0%, rgba(0,59,102,0.50) 42%, rgba(5,150,165,0.10) 100%), url('/osp/return-continuity-hero-banner.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              boxShadow: "0 20px 42px rgba(1,56,99,0.18)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                width: "fit-content",
                borderRadius: 999,
                padding: "8px 12px",
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.24)",
                color: "rgba(255,255,255,0.94)",
                fontSize: 10.3,
                fontWeight: 930,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                backdropFilter: "blur(10px)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 8,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255,255,255,0.18)",
                  color: OSP.white,
                  fontSize: 12,
                }}
              >
                ▣
              </span>
              Passport Memory
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <h2
                style={{
                  
                  color: "#FFFFFF",
                  WebkitTextFillColor: "#FFFFFF",
                  textShadow: "0 2px 18px rgba(0,0,0,0.58)",margin: "48px 0 0",
                  fontSize: 31,
                  lineHeight: 0.98,
                  fontWeight: 880,
                  letterSpacing: "-0.06em",
                }}
              >
                Pick up where
                <br />
                Siargao left you
              </h2>
              <p
                style={{
                  margin: "9px 0 0",
                  maxWidth: 292,
                  color: "rgba(255,255,255,0.92)",
                  fontSize: 13.2,
                  lineHeight: 1.34,
                  fontWeight: 760,
                  textShadow: "0 1px 10px rgba(0,0,0,0.34)",
                }}
              >
                Your saved trails, verified stamps, and return progress stay connected to your OSP identity.
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: 9,
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            {heroStats.map((item) => (
              <div
                key={item.label}
                style={{
                  minHeight: 70,
                  borderRadius: 17,
                  padding: 9,
                  display: "grid",
                  alignContent: "space-between",
                  background:
                    `linear-gradient(180deg, rgba(1,56,99,0.06), rgba(1,56,99,0.70)), url(${item.image}) center/cover`,
                  border: "1px solid rgba(255,255,255,0.72)",
                  boxShadow: "0 12px 28px rgba(1,56,99,0.16)",
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 7,
                    color: "rgba(255,255,255,0.92)",
                    textShadow: "0 2px 8px rgba(1,56,99,0.42)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 10,
                      display: "grid",
                      placeItems: "center",
                      background: "#FFFFFF",
                      border: "1px solid rgba(1,56,99,0.08)",
                      color: OSP.deepNavy,
                      fontSize: 12,
                      boxShadow: "0 6px 14px rgba(1,56,99,0.045)",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.92)", textShadow: "0 2px 8px rgba(1,56,99,0.42)", fontSize: 13, fontWeight: 950 }}>›</span>
                </span>
                <span>
                  <span
                    style={{
                      display: "block",
                      color: "rgba(255,255,255,0.88)",
                      textShadow: "0 2px 8px rgba(1,56,99,0.42)",
                      fontSize: 8,
                      lineHeight: 1,
                      fontWeight: 930,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}
                  </span>
                  <strong
                    style={{
                      display: "block",
                      marginTop: 4,
                      color: "#FFFFFF",
                      textShadow: "0 2px 10px rgba(1,56,99,0.52)",
                      fontSize: item.value === "Planned" ? 13 : 18,
                      lineHeight: 1,
                      fontWeight: 920,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {item.value}
                  </strong>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Passport Continuity Center"
          style={{ ...shellCard, marginTop: 14, padding: 16 }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 54px",
              alignItems: "start",
              gap: 10,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  color: OSP.teal,
                  fontSize: 10.5,
                  fontWeight: 920,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Passport Continuity Center
              </div>
              <h2
                style={{
                  margin: "9px 0 0",
                  color: OSP.deepNavy,
                  fontSize: 22,
                  lineHeight: 1.02,
                  fontWeight: 830,
                  letterSpacing: "-0.04em",
                }}
              >
                Your Passport remembers what ordinary trips forget.
              </h2>
              <p style={{ margin: "7px 0 0", color: OSP.slate, fontSize: 13.1, lineHeight: 1.34, fontWeight: 720 }}>
                Use this center to continue your saved journey.
              </p>
            </div>

            <div
              aria-hidden="true"
              style={{
                width: 54,
                height: 54,
                borderRadius: 18,
                background: OSP.mist,
                color: OSP.teal,
                display: "grid",
                placeItems: "center",
                fontSize: 24,
                fontWeight: 900,
              }}
            >
              ≋
            </div>
          </div>

          <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
            {actionCards.map((action) => {
              const tone = actionTone(action.tone);
              const isGold = action.tone === "gold";
              const isAqua = action.tone === "aqua";

              return (
                <Link
                  key={action.label}
                  href={action.href}
                  style={{
                    minHeight: 66,
                    borderRadius: 18,
                    padding: "10px 11px",
                    display: "grid",
                    gridTemplateColumns: "42px minmax(0, 1fr) 30px",
                    alignItems: "center",
                    gap: 10,
                    textDecoration: "none",
                    background: tone.background,
                    color: tone.color,
                    border: tone.border,
                    boxShadow: tone.shadow,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 14,
                      display: "grid",
                      placeItems: "center",
                      background: isGold
                        ? "rgba(255,255,255,0.30)"
                        : isAqua
                          ? OSP.mist
                          : "rgba(255,255,255,0.13)",
                      color: isGold || isAqua ? OSP.teal : OSP.white,
                      fontSize: 22,
                      fontWeight: 930,
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)",
                    }}
                  >
                    {action.icon}
                  </span>

                  <span style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        color: isGold ? "rgba(1,56,99,0.82)" : isAqua ? OSP.teal : "rgba(255,255,255,0.82)",
                        fontSize: 8.8,
                        lineHeight: 1,
                        fontWeight: 950,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {action.label}
                    </span>
                    <strong
                      style={{
                        display: "block",
                        marginTop: 5,
                        color: isGold || isAqua ? OSP.deepNavy : OSP.white,
                        fontSize: 14.8,
                        lineHeight: 1.04,
                        fontWeight: 900,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {action.title}
                    </strong>
                    <span
                      style={{
                        display: "block",
                        marginTop: 5,
                        color: isGold ? "rgba(1,56,99,0.72)" : isAqua ? OSP.slate : "rgba(255,255,255,0.82)",
                        fontSize: 10.8,
                        lineHeight: 1.22,
                        fontWeight: 720,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {action.body}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      background: isGold || isAqua ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.16)",
                      color: isGold || isAqua ? OSP.deepNavy : OSP.white,
                      border: isAqua ? `1px solid ${OSP.line}` : "1px solid rgba(255,255,255,0.12)",
                      fontSize: 23,
                      lineHeight: 1,
                      fontWeight: 900,
                    }}
                  >
                    ›
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section aria-label="Return Progress" style={{ ...shellCard, marginTop: 14, padding: 16 }}>
          <div
            style={{
              color: OSP.teal,
              fontSize: 10.5,
              fontWeight: 920,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Return Progress
          </div>
          <p style={{ margin: "8px 0 0", color: OSP.slate, fontSize: 12.4, lineHeight: 1.34, fontWeight: 720 }}>
            Milestones are earned through verified Passport activity, not self-claimed visits.
          </p>

          <div style={{ marginTop: 12, display: "grid", gap: 0 }}>
            {returnProgress.map((item, index) => (
              <div
                key={item.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 44px minmax(0, 1fr)",
                  gap: 12,
                  alignItems: "center",
                  padding: "8px 0",
                  minHeight: 62,
                  borderBottom: index === returnProgress.length - 1 ? "none" : `1px solid ${OSP.line}`,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    background: OSP.white,
                    border: "2px solid rgba(5,150,165,0.26)",
                    color: OSP.teal,
                    fontSize: 10,
                    fontWeight: 900,
                    position: "relative",
                  }}
                >
                  ●
                </span>

                <span
                  aria-hidden="true"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    background: OSP.mist,
                    color: OSP.teal,
                    border: "1px solid rgba(5,150,165,0.16)",
                    fontSize: 21,
                    lineHeight: 1,
                  }}
                >
                  {item.icon}
                </span>

                <span style={{ minWidth: 0 }}>
                  <strong
                    style={{
                      display: "block",
                      color: OSP.deepNavy,
                      fontSize: 14.3,
                      lineHeight: 1.08,
                      fontWeight: 900,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {item.label}
                  </strong>
                  <span
                    style={{
                      display: "block",
                      marginTop: 4,
                      color: OSP.slate,
                      fontSize: 12.1,
                      lineHeight: 1.28,
                      fontWeight: 720,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {item.body}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label="Discover other trails"
          style={{
            ...shellCard,
            marginTop: 14,
            padding: 12,
          }}
        >
          <div
            style={{
              color: OSP.teal,
              fontSize: 10.5,
              lineHeight: 1,
              fontWeight: 920,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Discover other trails
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 8 }}>
            {otherTrails.map((trail) => (
              <Link
                key={trail.href}
                href={trail.href}
                style={{
                  minHeight: 98,
                  borderRadius: 17,
                  background: trail.tileColor,
                  color: OSP.navy,
                  border: "1px solid rgba(5,150,165,0.12)",
                  display: "grid",
                  gridTemplateColumns: "44px minmax(0, 1fr) 26px",
                  alignItems: "center",
                  gap: 9,
                  textDecoration: "none",
                  padding: "10px",
                  boxShadow: "0 8px 18px rgba(1,56,99,0.045)",
                  minWidth: 0,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 16,
                    display: "grid",
                    placeItems: "center",
                    background: "#FFFFFF",
                    border: "1px solid rgba(1,56,99,0.10)",
                    boxShadow: "0 10px 22px rgba(1,56,99,0.09)",
                    overflow: "hidden",
                    color: OSP.teal,
                    fontSize: 19,
                    flex: "0 0 auto",
                  }}
                >
                  <img
                    src={trail.iconSrc}
                    alt=""
                    aria-hidden="true"
                    style={{ width: 32, height: 32, objectFit: "contain", display: "block" }}
                  />
                </span>

                <strong
                  style={{
                    display: "block",
                    color: OSP.deepNavy,
                    fontSize: 12.6,
                    lineHeight: 1.08,
                    fontWeight: 900,
                    overflowWrap: "anywhere",
                  }}
                >
                  {trail.title}
                </strong>

                <span
                  aria-hidden="true"
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(255,255,255,0.76)",
                    color: OSP.deepNavy,
                    border: "1px solid rgba(1,56,99,0.08)",
                    fontSize: 17,
                    fontWeight: 900,
                  }}
                >
                  ›
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div aria-hidden="true" style={{ height: 118 }} />
      </div>

      <SpmTravelerBottomTabBar activeTab="trails" fixed />
    </main>
  );
}
