type TravelerTabKey = "home" | "trails" | "pass" | "explore" | "profile";

type TravelerTab = {
  key: TravelerTabKey;
  label: string;
  href: string;
  icon: string;
  ariaLabel: string;
};

const TRAVELER_TABS: TravelerTab[] = [
  {
    key: "home",
    label: "Home",
    href: "/",
    icon: "⌂",
    ariaLabel: "Open OSP home",
  },
  {
    key: "trails",
    label: "Trails",
    href: "/traveler/passport-trails",
    icon: "◇",
    ariaLabel: "Open Passport Trails",
  },
  {
    key: "pass",
    label: "QR",
    href: "/traveler/pass",
    icon: "▣",
    ariaLabel: "Open OSP Pass and QR",
  },
  {
    key: "explore",
    label: "Explore",
    href: "/traveler/partner-tours",
    icon: "✦",
    ariaLabel: "Open Siargao partner tours and local experiences",
  },
  {
    key: "profile",
    label: "Profile",
    href: "/traveler/settings",
    icon: "☻",
    ariaLabel: "Open traveler profile and settings",
  },
];

function isTabActive(activeTab: TravelerTabKey | undefined, tab: TravelerTab) {
  return activeTab === tab.key;
}

export default function UniversalTravelerBottomTabBar(props: {
  activeTab?: TravelerTabKey;
  fixed?: boolean;
}) {
  const positionStyle = props.fixed
    ? {
        position: "fixed" as const,
        left: "50%",
        bottom: 14,
        transform: "translateX(-50%)",
        zIndex: 50,
        width: "min(560px, calc(100vw - 22px))",
      }
    : {
        position: "relative" as const,
        width: "100%",
      };

  return (
    <nav
      aria-label="Universal traveler bottom navigation"
      style={{
        ...positionStyle,
        borderRadius: 999,
        padding: 8,
        background: "rgba(255,255,255,0.94)",
        border: "1px solid rgba(203,213,225,0.92)",
        boxShadow: "0 18px 42px rgba(15,23,42,0.16)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 6,
          alignItems: "center",
        }}
      >
        {TRAVELER_TABS.map((tab) => {
          const active = isTabActive(props.activeTab, tab);

          return (
            <a
              key={tab.key}
              href={tab.href}
              aria-label={tab.ariaLabel}
              aria-current={active ? "page" : undefined}
              style={{
                minHeight: 50,
                borderRadius: 999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                textDecoration: "none",
                background: active ? "#0f766e" : "transparent",
                color: active ? "#ffffff" : "#475569",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: "-0.01em",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontSize: tab.key === "pass" ? 18 : 16,
                  lineHeight: 1,
                }}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
