type TravelerTabKey = "home" | "trails" | "pass" | "explore" | "profile";

type TravelerTab = {
  key: TravelerTabKey;
  label: string;
  href: string;
  ariaLabel: string;
};

const TRAVELER_TABS: TravelerTab[] = [
  {
    key: "home",
    label: "Home",
    href: "/",
    ariaLabel: "Open OSP home",
  },
  {
    key: "trails",
    label: "Trails",
    href: "/traveler/passport-trails",
    ariaLabel: "Open Passport Trails",
  },
  {
    key: "pass",
    label: "QR",
    href: "/traveler/pass",
    ariaLabel: "Open OSP Pass and QR",
  },
  {
    key: "explore",
    label: "Explore",
    href: "/traveler/partner-tours",
    ariaLabel: "Open Siargao partner tours and local experiences",
  },
  {
    key: "profile",
    label: "Profile",
    href: "/traveler/settings",
    ariaLabel: "Open traveler profile and settings",
  },
];

function TravelerTabIcon(props: { kind: TravelerTabKey; active?: boolean }) {
  const stroke = props.active ? "#0f766e" : "#64748b";

  if (props.kind === "home") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path
          d="M4.5 11.5 12 5l7.5 6.5v7a1.8 1.8 0 0 1-1.8 1.8h-3.1v-5.4H9.4v5.4H6.3a1.8 1.8 0 0 1-1.8-1.8v-7Z"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (props.kind === "trails") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path
          d="M7 6.8c2.8-2.4 7.2-2.4 10 0M6.5 17.3c3 2.3 8 2.3 11 0"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 12h.01M12 9h.01M16 12h.01M12 15h.01"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (props.kind === "pass") {
    return (
      <svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="6" height="6" rx="1.4" stroke="#ffffff" strokeWidth="2.2" />
        <rect x="14" y="4" width="6" height="6" rx="1.4" stroke="#ffffff" strokeWidth="2.2" />
        <rect x="4" y="14" width="6" height="6" rx="1.4" stroke="#ffffff" strokeWidth="2.2" />
        <path d="M14 15h2v-2h2v4h-4v-2Zm4 3h2v2h-2v-2Z" fill="#ffffff" />
      </svg>
    );
  }

  if (props.kind === "explore") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path
          d="m12 3 2.15 6.1L20.5 12l-6.35 2.9L12 21l-2.15-6.1L3.5 12l6.35-2.9L12 3Z"
          fill={props.active ? "#ffffff" : "#64748b"}
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M12 12.2a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.8 20.2c1.4-3.4 4-5.1 7.2-5.1s5.8 1.7 7.2 5.1"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
        bottom: 12,
        transform: "translateX(-50%)",
        zIndex: 50,
        width: "min(404px, calc(100vw - 34px))",
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
        borderRadius: 22,
        padding: "6px 8px",
        background: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(203,213,225,0.95)",
        boxShadow: "0 14px 34px rgba(15,23,42,0.14)"
        backdropFilter: "blur(18px)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 3,
          alignItems: "center",
        }}
      >
        {TRAVELER_TABS.map((tab) => {
          const active = isTabActive(props.activeTab, tab);
          const isMainQr = tab.key === "pass";

          return (
            <a
              key={tab.key}
              href={tab.href}
              aria-label={tab.ariaLabel}
              aria-current={active ? "page" : undefined}
              style={{
                minHeight: isMainQr ? 54 : 48,
                borderRadius: isMainQr ? 999 : 17,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                textDecoration: "none",
                background: isMainQr
                  ? "linear-gradient(135deg, #10b8b2 0%, #0794ad 100%)"
                  : active
                    ? "rgba(20,184,166,0.12)"
                    : "transparent",
                color: isMainQr ? "#ffffff" : active ? "#0f766e" : "#475569",
                border: isMainQr
                  ? "3px solid rgba(255,255,255,0.98)"
                  : "1px solid transparent",
                boxShadow: isMainQr
                  ? "0 10px 24px rgba(8,145,178,0.25)"
                  : active
                    ? "0 6px 14px rgba(20,184,166,0.10)"
                    : "none",
                fontSize: 10.5,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                WebkitTapHighlightColor: "transparent",
                transform: isMainQr ? "translateY(-4px)" : "none",
              }}
            >
              <TravelerTabIcon kind={tab.key} active={active || isMainQr} />
              <span>{tab.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
