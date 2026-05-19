"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type TravelerBottomTabKey = "home" | "trails" | "pass" | "explore" | "profile";

type SpmTravelerBottomTabBarProps = {
  activeTab?: TravelerBottomTabKey;
  fixed?: boolean;
  labels?: Partial<Record<TravelerBottomTabKey, string>>;
};

type TabItem = {
  key: Exclude<TravelerBottomTabKey, "pass">;
  label: string;
  href: string;
  dictionaryKey: string;
};

const OSP = {
  navy: "#013863",
  teal: "#0596A5",
  gold: "#F3AE26",
  white: "#FFFFFF",
  mist: "#EAFBFA",
  slate: "#50668B",
} as const;

const bottomTabSafeSpacerStyle = {
  height: "calc(112px + env(safe-area-inset-bottom))",
  flex: "0 0 auto",
  pointerEvents: "none",
} as const;

const TABS: TabItem[] = [
  { key: "home", label: "Home", href: "/traveler/home", dictionaryKey: "traveler.bottomTab.home" },
  { key: "explore", label: "Explore", href: "/traveler/explore", dictionaryKey: "traveler.bottomTab.explore" },
  { key: "trails", label: "Trails", href: "/traveler/passport-trails", dictionaryKey: "traveler.bottomTab.trails" },
  { key: "profile", label: "Profile", href: "/traveler/settings", dictionaryKey: "traveler.bottomTab.profile" },
];

function readPreviewLanguageCookie() {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)osp_preview_language=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "en";
}

function translate(dictionary: Record<string, string>, key: string, fallback: string) {
  return dictionary[key] || fallback;
}

async function loadDictionary(languageCode: string) {
  try {
    const response = await fetch(`/api/traveler/language/dictionary?language=${encodeURIComponent(languageCode)}`, {
      cache: "no-store",
    });

    if (!response.ok) return {};

    const payload = await response.json();
    return payload?.dictionary && typeof payload.dictionary === "object" ? payload.dictionary : {};
  } catch {
    return {};
  }
}

export default function SpmTravelerBottomTabBar({
  activeTab = "trails",
  labels,
}: SpmTravelerBottomTabBarProps) {
  const passActive = activeTab === "pass";
  const [portalMounted, setPortalMounted] = useState(false);
  const [dictionary, setDictionary] = useState<Record<string, string>>({});

  useEffect(() => {
    setPortalMounted(true);
  }, []);

  useEffect(() => {
    const languageCode = readPreviewLanguageCookie();
    let isMounted = true;

    loadDictionary(languageCode).then((nextDictionary) => {
      if (isMounted) {
        setDictionary(nextDictionary);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const resolvedTabs = useMemo(
    () =>
      TABS.map((tab) => ({
        ...tab,
        label: labels?.[tab.key] || translate(dictionary, tab.dictionaryKey, tab.label),
      })),
    [dictionary, labels],
  );

  const bottomTabNav = (
    <nav
      aria-label="SPM traveler bottom tab"
      data-osp-component="spm-traveler-bottom-tab"
      data-osp-lock="SPM_HOME_EXPLORE_QR_TRAILS_PROFILE"
      style={{
        position: "fixed",
        left: "50%",
        bottom: "calc(12px + env(safe-area-inset-bottom))",
        transform: "translateX(-50%)",
        pointerEvents: "auto",
        width: "min(398px, calc(100vw - 28px))",
        minWidth: 320,
        minHeight: 72,
        zIndex: 120,
        borderRadius: 26,
        background: "rgba(255,255,255,0.98)",
        border: "1px solid rgba(5,150,165,0.16)",
        boxShadow: "0 18px 46px rgba(1,56,99,0.14)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 68px 1fr 1fr",
        alignItems: "center",
        gap: 6,
        padding: "8px 10px 9px",
        boxSizing: "border-box",
      }}
    >
      {resolvedTabs.slice(0, 2).map((tab) => (
        <BottomTabItem key={tab.key} tab={tab} active={activeTab === tab.key} />
      ))}

      <a
        href="/traveler/pass"
        aria-label={translate(dictionary, "traveler.bottomTab.qrAria", "Open official Traveler QR")}
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

      {resolvedTabs.slice(2).map((tab) => (
        <BottomTabItem key={tab.key} tab={tab} active={activeTab === tab.key} />
      ))}
    </nav>
  );

  return (
    <>
      <div aria-hidden="true" style={bottomTabSafeSpacerStyle} />
      {portalMounted ? createPortal(bottomTabNav, document.body) : null}
    </>
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

  if (icon === "home") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.5Z" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === "trails") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="4" width="14" height="16" rx="2" stroke={color} strokeWidth="1.9" />
        <path d="M8 8h8M8 12h8M8 16h5" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }

  if (icon === "explore") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="5.5" stroke={color} strokeWidth="1.9" />
        <path d="m16 16 4 4" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M11 8.2v5.6M8.2 11h5.6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.9" />
      <path d="M5 20c1.2-3.5 3.5-5.2 7-5.2s5.8 1.7 7 5.2" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function QrIcon({ active }: { active: boolean }) {
  const stroke = active ? OSP.gold : OSP.white;

  return (
    <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="8" height="8" rx="1.8" stroke={stroke} strokeWidth="2.2" />
      <rect x="19" y="5" width="8" height="8" rx="1.8" stroke={stroke} strokeWidth="2.2" />
      <rect x="5" y="19" width="8" height="8" rx="1.8" stroke={stroke} strokeWidth="2.2" />
      <path d="M19 19h3v3h-3v-3ZM24 19h3v8h-8v-3h5v-5Z" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

// OSP_SPM_BOTTOM_TAB_SPATIAL_ORDER_12C_COMPLETE
