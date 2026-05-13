"use client";

type TravelerBottomTabKey = "home" | "trails" | "pass" | "explore" | "profile";

type UniversalTravelerBottomTabBarProps = {
  activeTab?: TravelerBottomTabKey;
  fixed?: boolean;
};

type TabItem = {
  key: Exclude<TravelerBottomTabKey, "pass">;
  label: string;
  href: string;
};

const TABS: TabItem[] = [
  { key: "home", label: "Home", href: "/traveler/home" },
  { key: "trails", label: "Trails", href: "/traveler/passport-trails" },
  { key: "explore", label: "Explore", href: "/traveler/explore" },
  { key: "profile", label: "Profile", href: "/traveler/settings" },
];

const OSP = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  mist: "#EAFBFA",
  slate: "#50668B",
  white: "#FFFFFF",
};

export default function UniversalTravelerBottomTabBar({
  activeTab = "home",
  fixed = true,
}: UniversalTravelerBottomTabBarProps) {
  const passActive = activeTab === "pass";

  return (
    <nav
      aria-label="Universal traveler bottom tab"
      data-osp-component="universal-traveler-bottom-tab"
      data-osp-lock="HOME_TRAILS_QR_EXPLORE_PROFILE"
      style={{
        position: fixed ? "fixed" : "sticky",
        left: "50%",
        bottom: fixed ? "calc(10px + env(safe-area-inset-bottom))" : 10,
        transform: "translateX(-50%)",
        width: "min(430px, calc(100vw - 20px))",
        minWidth: 330,
        minHeight: 76,
        zIndex: 90,
        borderRadius: 30,
        background: "rgba(255,255,255,0.99)",
        border: "1px solid rgba(5,150,165,0.18)",
        boxShadow: "0 18px 46px rgba(1,56,99,0.18)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 76px 1fr 1fr",
        alignItems: "center",
        gap: 5,
        padding: "8px 10px 9px",
        boxSizing: "border-box",
      }}
    >
      {TABS.slice(0, 2).map((tab) => (
        <BottomTabItem key={tab.key} tab={tab} active={activeTab === tab.key} />
      ))}

      <a
        href="/traveler/pass"
        aria-label="Open official Traveler QR"
        aria-current={passActive ? "page" : undefined}
        data-osp-bottom-tab-center-qr="true"
        style={{
          width: 64,
          height: 64,
          borderRadius: 25,
          margin: "0 auto",
          transform: "translateY(-13px)",
          display: "grid",
          placeItems: "center",
          textDecoration: "none",
          color: OSP.white,
          background: passActive
            ? "linear-gradient(135deg, #013863 0%, #0596A5 100%)"
            : "linear-gradient(135deg, #0596A5 0%, #013863 100%)",
          border: passActive
            ? "2px solid rgba(243,174,38,0.96)"
            : "2px solid rgba(255,255,255,1)",
          boxShadow: passActive
            ? "0 18px 38px rgba(1,56,99,0.30), 0 0 0 5px rgba(243,174,38,0.15)"
            : "0 16px 34px rgba(1,56,99,0.24)",
          boxSizing: "border-box",
        }}
      >
        <QrIcon active={passActive} />
      </a>

      {TABS.slice(2).map((tab) => (
        <BottomTabItem key={tab.key} tab={tab} active={activeTab === tab.key} />
      ))}
    </nav>
  );
}

function BottomTabItem({
  tab,
  active,
}: {
  tab: TabItem;
  active: boolean;
}) {
  return (
    <a
      href={tab.href}
      aria-label={tab.label}
      aria-current={active ? "page" : undefined}
      data-osp-bottom-tab-item={tab.key}
      style={{
        minHeight: 58,
        minWidth: 0,
        borderRadius: 21,
        display: "grid",
        gridTemplateRows: "30px 17px",
        alignContent: "center",
        justifyItems: "center",
        rowGap: 3,
        textDecoration: "none",
        color: active ? OSP.navy : OSP.slate,
        background: active
          ? "linear-gradient(180deg, rgba(234,251,250,1) 0%, rgba(255,255,255,0.98) 100%)"
          : "transparent",
        border: active ? "1px solid rgba(5,150,165,0.26)" : "1px solid transparent",
        boxShadow: active ? "0 9px 20px rgba(1,56,99,0.09)" : "none",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {active ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 5,
            width: 20,
            height: 3,
            borderRadius: 999,
            background: OSP.gold,
            boxShadow: "0 2px 8px rgba(243,174,38,0.30)",
          }}
        />
      ) : null}

      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          display: "grid",
          placeItems: "center",
          color: active ? OSP.white : OSP.slate,
          background: active ? OSP.teal : "rgba(234,251,250,0.82)",
          border: active ? "1px solid rgba(5,150,165,0.34)" : "1px solid rgba(5,150,165,0.14)",
          boxSizing: "border-box",
        }}
      >
        <TabIcon icon={tab.key} active={active} />
      </span>

      <span
        style={{
          maxWidth: "100%",
          color: active ? OSP.navy : OSP.slate,
          fontSize: 11,
          lineHeight: "15px",
          fontWeight: active ? 960 : 900,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {tab.label}
      </span>
    </a>
  );
}

function TabIcon({
  icon,
  active,
}: {
  icon: TabItem["key"];
  active: boolean;
}) {
  const color = active ? OSP.white : OSP.slate;
  const strokeWidth = active ? 2.45 : 2.2;

  if (icon === "home") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4.5 11.2 12 4.8l7.5 6.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.9 10.4v7.8c0 .8.5 1.3 1.3 1.3h7.6c.8 0 1.3-.5 1.3-1.3v-7.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d="M10 19.5v-5.2h4v5.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === "trails") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5.4 18.4c3.9-6.9 8.9-5.4 13.2-12.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <circle cx="6" cy="18" r="1.9" fill={color} />
        <circle cx="11.8" cy="12" r="1.7" fill={color} />
        <circle cx="18.3" cy="5.8" r="1.9" fill={color} />
      </svg>
    );
  }

  if (icon === "explore") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="5.7" stroke={color} strokeWidth={strokeWidth} />
        <path d="m15.3 15.3 3.9 3.9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d="M11 8.2v3l2.1 1.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.2" r="3.5" stroke={color} strokeWidth={strokeWidth} />
      <path d="M5.8 19.2c.9-3.4 3.2-5.2 6.2-5.2s5.3 1.8 6.2 5.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

function QrIcon({ active }: { active: boolean }) {
  const color = OSP.white;
  const glow = active ? "rgba(243,174,38,0.22)" : "rgba(255,255,255,0.16)";

  return (
    <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" fill={glow} />
      <rect x="4" y="4" width="9" height="9" rx="2" stroke={color} strokeWidth="2.6" />
      <rect x="19" y="4" width="9" height="9" rx="2" stroke={color} strokeWidth="2.6" />
      <rect x="4" y="19" width="9" height="9" rx="2" stroke={color} strokeWidth="2.6" />
      <rect x="7.2" y="7.2" width="2.7" height="2.7" rx="0.5" fill={color} />
      <rect x="22.2" y="7.2" width="2.7" height="2.7" rx="0.5" fill={color} />
      <rect x="7.2" y="22.2" width="2.7" height="2.7" rx="0.5" fill={color} />
      <path d="M18.5 18.5h4.4v4.4h-4.4v-4.4Z" fill={color} />
      <path d="M25.3 18.5H29v9.5h-3.7v-3.5h-3.8" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 16h3M16 24h2.8M23.5 16H29" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
